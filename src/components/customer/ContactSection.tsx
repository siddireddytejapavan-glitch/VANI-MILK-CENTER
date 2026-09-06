'use client';

import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';
import { useShopSettings } from '@/context/ShopSettingsContext';
import { generateEnquiryWhatsAppLink } from '@/lib/whatsapp';

export default function ContactSection() {
  const { settings } = useShopSettings();
  const whatsAppLink = generateEnquiryWhatsAppLink(settings.whatsappNumber);

  return (
    <section id="contact" className="py-20 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            Visit &amp; Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Shop Location &amp; Timings
          </h2>
          <p className="text-slate-600 text-sm">
            Visit our counter directly or contact us for home pickup and bulk function delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-6 bg-white/95 backdrop-blur-sm p-8 rounded-3xl border border-white/80 shadow-md flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Shop Address</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Opening Timings</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {settings.openingHours}
                  </p>
                  <span className="inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
                    Open All 7 Days (5:00 AM – 10:00 PM)
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Direct Phone &amp; WhatsApp</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Phone: {settings.phone}
                  </p>
                  <p className="text-sm text-slate-600">
                    WhatsApp: +{settings.whatsappNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              {settings.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-sky-400" />
                  <span>Directions</span>
                </a>
              )}
            </div>
          </div>

          {/* Map Preview / Illustration Card */}
          <div className="lg:col-span-6 bg-sky-50 rounded-3xl border border-sky-200/80 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-200/70 text-sky-800 text-xs font-bold">
                <Navigation className="w-3.5 h-3.5" />
                <span>Find Our Shop</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Fresh Milk &amp; Dairy Ready Every Morning &amp; Evening
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Located conveniently near the center of town. Feel free to drive by for direct counter purchase or order in advance for express collection.
              </p>

              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-sky-100 shadow-sm space-y-2 text-xs">
                <p className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Fresh Batch Availability:
                </p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>• Morning Milk: 5:30 AM</div>
                  <div>• Fresh Set Curd: 7:00 AM</div>
                  <div>• Evening Milk: 4:30 PM</div>
                  <div>• Cold Buttermilk &amp; Lassi: All Day</div>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              {settings.googleMapsUrl ? (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-md hover:shadow-lg transition-all border border-slate-200"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-4 h-4 text-sky-600" />
                </a>
              ) : null}
            </div>

            {/* Subtle background decorative shapes */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-sky-200/50 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
