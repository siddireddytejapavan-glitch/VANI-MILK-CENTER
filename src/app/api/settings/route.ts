import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentAdmin } from '@/lib/auth';
import { cleanWhatsAppNumber } from '@/lib/whatsapp';

export async function GET() {
  try {
    let settings = await prisma.shopSettings.findUnique({
      where: { id: 'default-settings' },
    });

    if (!settings) {
      settings = await prisma.shopSettings.create({
        data: {
          id: 'default-settings',
          shopName: 'Sri Krishna Milk & Dairy Center',
          phone: '+91 98765 43210',
          whatsappNumber: '919876543210',
          address: 'Shop No. 4, Main Road, Near Clock Tower, Tuni, Andhra Pradesh',
          openingHours: 'Morning: 5:30 AM - 1:00 PM | Evening: 4:30 PM - 9:30 PM',
          googleMapsUrl: 'https://maps.google.com/?q=Dairy+Shop+Tuni',
          logoUrl: '/images/shop-logo.svg',
          aboutDescription: 'We are a local family-owned dairy shop committed to providing pure, farm-fresh milk, thick curd, lassi, buttermilk, and bulk function supplies for marriages, birthdays, and community festivals.',
          bannerText: 'Fresh Farm Milk & Rich Curd Available Daily | Special Function Bulk Orders Undertaken',
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shop settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      shopName,
      phone,
      whatsappNumber,
      address,
      openingHours,
      googleMapsUrl,
      logoUrl,
      aboutDescription,
      bannerText,
    } = body;

    const cleanedWhatsApp = cleanWhatsAppNumber(whatsappNumber || '');

    const updated = await prisma.shopSettings.upsert({
      where: { id: 'default-settings' },
      update: {
        shopName: shopName || 'Sri Krishna Milk & Dairy Center',
        phone: phone || '+91 98765 43210',
        whatsappNumber: cleanedWhatsApp || '919876543210',
        address: address || '',
        openingHours: openingHours || '',
        googleMapsUrl: googleMapsUrl || '',
        logoUrl: logoUrl || '/images/shop-logo.svg',
        aboutDescription: aboutDescription || '',
        bannerText: bannerText || '',
      },
      create: {
        id: 'default-settings',
        shopName: shopName || 'Sri Krishna Milk & Dairy Center',
        phone: phone || '+91 98765 43210',
        whatsappNumber: cleanedWhatsApp || '919876543210',
        address: address || '',
        openingHours: openingHours || '',
        googleMapsUrl: googleMapsUrl || '',
        logoUrl: logoUrl || '/images/shop-logo.svg',
        aboutDescription: aboutDescription || '',
        bannerText: bannerText || '',
      },
    });

    return NextResponse.json({
      message: 'Shop settings updated successfully',
      settings: updated,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update shop settings' },
      { status: 500 }
    );
  }
}
