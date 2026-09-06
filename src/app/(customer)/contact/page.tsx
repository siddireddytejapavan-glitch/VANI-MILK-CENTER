import React from 'react';
import Navbar from '@/components/customer/Navbar';
import Footer from '@/components/customer/Footer';
import FloatingWhatsApp from '@/components/customer/FloatingWhatsApp';
import CartDrawer from '@/components/customer/CartDrawer';
import ContactSection from '@/components/customer/ContactSection';
import BulkOrderBanner from '@/components/customer/BulkOrderBanner';

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Navbar />
      <CartDrawer />
      <FloatingWhatsApp />

      <main className="flex-1">
        <ContactSection />
        <BulkOrderBanner />
      </main>

      <Footer />
    </div>
  );
}
