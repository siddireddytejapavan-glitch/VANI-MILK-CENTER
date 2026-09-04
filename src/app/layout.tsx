import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ShopSettingsProvider } from '@/context/ShopSettingsContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'VANI MILK CENTER, GOPIVANIPALEM | Quality Milk Products',
  description:
    'Vani Milk Center, Gopivanipalem - 100% Pure & Natural Quality Milk Products: Full Fat Milk, Curd, Ghee, Paneer, Buttermilk, Lassi. Contact: 7995597719.',
  keywords:
    'milk shop, fresh milk, curd bucket, marriage curd order, buttermilk, lassi, daily dairy products, WhatsApp dairy order',
  openGraph: {
    title: 'Sri Krishna Milk & Dairy Center',
    description:
      'Pure and farm-fresh dairy products. Bulk marriage and function orders welcome. Easy WhatsApp ordering.',
    images: ['/images/hero-dairy.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-sky-100 selection:text-sky-800">
        <ShopSettingsProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ShopSettingsProvider>
      </body>
    </html>
  );
}
