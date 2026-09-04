import React from 'react';
import { prisma } from '@/lib/db';
import ProductManager from './ProductManager';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <ProductManager
        initialProducts={products as any}
        categories={categories}
      />
    </div>
  );
}
