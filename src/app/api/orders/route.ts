import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import {
  generateOrderWhatsAppMessage,
  generateWhatsAppLink,
  cleanWhatsAppNumber,
} from '@/lib/whatsapp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, address, notes, items } = body;

    // Validate customer info
    if (!customerName || !customerName.trim()) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    const cleanPhone = customerPhone?.replace(/\D/g, '') || '';
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: 'Please enter your delivery / shop pickup address.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    // SERVER-SIDE PRICE AND STOCK VALIDATION
    // Fetch real variants from database
    const variantIds = items.map((i: any) => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
      },
      include: {
        product: true,
      },
    });

    const variantMap = new Map(dbVariants.map((v) => [v.id, v]));

    let calculatedTotal = 0;
    const verifiedOrderItems: Array<{
      variantId: string;
      productId: string;
      productName: string;
      packSize: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const dbVariant = variantMap.get(item.variantId);
      if (!dbVariant) {
        return NextResponse.json(
          { error: `A product variant in your cart no longer exists.` },
          { status: 400 }
        );
      }

      if (!dbVariant.isAvailable || !dbVariant.product.isActive) {
        return NextResponse.json(
          { error: `"${dbVariant.product.name} (${dbVariant.packSize})" is currently unavailable.` },
          { status: 400 }
        );
      }

      const requestedQty = parseInt(item.quantity, 10);
      if (isNaN(requestedQty) || requestedQty <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${dbVariant.product.name}.` },
          { status: 400 }
        );
      }

      if (dbVariant.stockQuantity < requestedQty) {
        return NextResponse.json(
          {
            error: `Not enough stock for "${dbVariant.product.name} (${dbVariant.packSize})". Available: ${dbVariant.stockQuantity}, Requested: ${requestedQty}.`,
          },
          { status: 400 }
        );
      }

      // Exact server-calculated line item total from DB price
      const lineTotal = dbVariant.price * requestedQty;
      calculatedTotal += lineTotal;

      verifiedOrderItems.push({
        variantId: dbVariant.id,
        productId: dbVariant.productId,
        productName: dbVariant.product.name,
        packSize: dbVariant.packSize,
        quantity: requestedQty,
        unitPrice: dbVariant.price,
        totalPrice: lineTotal,
      });
    }

    // Check if order is a special function order
    const isFunctionOrder = Boolean(
      (notes && notes.toLowerCase().includes('marriage')) ||
        (notes && notes.toLowerCase().includes('function')) ||
        (notes && notes.toLowerCase().includes('event')) ||
        (notes && notes.toLowerCase().includes('party')) ||
        verifiedOrderItems.some((i) =>
          i.packSize.toLowerCase().includes('bucket') ||
          i.packSize.toLowerCase().includes('10 kg') ||
          i.packSize.toLowerCase().includes('20 kg') ||
          i.quantity >= 5
        )
    );

    // Create Order and OrderItems in database transaction & decrement stock
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          address: address.trim(),
          notes: notes?.trim() || null,
          totalAmount: calculatedTotal,
          status: 'Pending',
          isFunctionOrder,
          items: {
            create: verifiedOrderItems.map((vi) => ({
              productId: vi.productId,
              variantId: vi.variantId,
              productName: vi.productName,
              packSize: vi.packSize,
              quantity: vi.quantity,
              unitPrice: vi.unitPrice,
              totalPrice: vi.totalPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Reduce stock for ordered variants
      for (const vi of verifiedOrderItems) {
        await tx.productVariant.update({
          where: { id: vi.variantId },
          data: {
            stockQuantity: {
              decrement: vi.quantity,
            },
          },
        });
      }

      return order;
    });

    // Retrieve shop settings for configured WhatsApp number
    const settings = await prisma.shopSettings.findUnique({
      where: { id: 'default-settings' },
    });

    const targetWhatsAppNumber = cleanWhatsAppNumber(
      settings?.whatsappNumber || process.env.SHOP_WHATSAPP_NUMBER || '919876543210'
    );

    // Format WhatsApp message
    const whatsAppMessage = generateOrderWhatsAppMessage({
      orderId: createdOrder.id,
      customerName: createdOrder.customerName,
      customerPhone: createdOrder.customerPhone,
      address: createdOrder.address,
      items: verifiedOrderItems,
      totalAmount: calculatedTotal,
      notes: createdOrder.notes,
    });

    const whatsAppLink = generateWhatsAppLink(targetWhatsAppNumber, whatsAppMessage);

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: createdOrder,
        whatsAppLink,
        whatsAppMessage,
        shopWhatsAppNumber: targetWhatsAppNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to process order. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isFunctionOnly = searchParams.get('function') === 'true';
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    if (isFunctionOnly) {
      whereClause.isFunctionOrder = true;
    }
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { address: { contains: q } },
        { id: { contains: q } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}
