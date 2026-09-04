'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, MapPin, Clock, ExternalLink } from 'lucide-react';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { generateEnquiryWhatsAppLink } from '@/lib/whatsapp';

export default function Footer() {
  const { settings } = useShopSettings();
  const currentYear = new Date().getFullYear();
  const whatsAppLink = generateEnquiryWhatsAppLink(settings.whatsappNumber);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center">
                <Image
                  src={settings.logoUrl || '/images/shop-logo.svg'}
                  alt={settings.shopName}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-white text-lg leading-tight">
                {settings.shopName}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fresh, high quality dairy products available for daily needs, family functions, marriages, and catering events.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-semibold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Open Daily Morning &amp; Evening
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase text-xs">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products &amp; Prices
                </Link>
              </li>
              <li>
                <Link href="/#functions" className="hover:text-white transition-colors">
                  Marriage &amp; Function Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Location
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dairy Specialities */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase text-xs">
              Our Products
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Pure Farm Whole Milk (250ml, 500ml, 1L)</li>
              <li>• Fresh Thick Curd (Dahi)</li>
              <li>• 5 kg, 10 kg &amp; 20 kg Curd Buckets</li>
              <li>• Refreshing Spiced Buttermilk</li>
              <li>• Sweet Creamy Malai Lassi</li>
              <li>• Fresh Homemade Paneer &amp; Desi Ghee</li>
            </ul>
          </div>

          {/* Col 4: Shop Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base tracking-wide uppercase text-xs">
              Shop Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 font-medium"
                >
                  WhatsApp: +{settings.whatsappNumber}
                </a>
              </div>
            </div>

            {settings.googleMapsUrl && (
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 pt-1"
              >
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Bottom copyright & admin login link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {settings.shopName}. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link
              href="/admin/login"
              className="hover:text-slate-400 transition-colors"
            >
              Shop Owner Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
