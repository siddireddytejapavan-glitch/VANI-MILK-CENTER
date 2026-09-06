import React from 'react';
import { prisma } from '@/lib/db';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
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
        openingHours: 'Morning 5:00 AM - Evening 10:00 PM',
        googleMapsUrl: 'https://maps.google.com/?q=Dairy+Shop+Tuni',
        logoUrl: '/images/shop-logo.svg',
        aboutDescription: 'We are a local family-owned dairy shop committed to providing pure, farm-fresh milk, thick curd, lassi, buttermilk, and bulk function supplies for marriages, birthdays, and community festivals.',
        bannerText: 'Fresh Farm Milk & Rich Curd Available Daily | Special Function Bulk Orders Undertaken',
      },
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SettingsForm initialSettings={settings as any} />
    </div>
  );
}
