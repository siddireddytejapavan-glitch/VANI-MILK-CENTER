'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { generateEnquiryWhatsAppLink } from '@/lib/whatsapp';

export default function FloatingWhatsApp() {
  const { settings } = useShopSettings();
  const whatsAppLink = generateEnquiryWhatsAppLink(settings.whatsappNumber);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Speech bubble label visible on hover & pulse */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 bg-white text-slate-800 text-xs font-bold rounded-lg shadow-lg border border-slate-100 group-hover:scale-105 transition-all">
        Chat / Order on WhatsApp
      </span>

      <a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        {/* Pulse effect ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping"></span>
        <MessageCircle className="w-8 h-8 fill-white relative z-10" />
      </a>
    </div>
  );
}
