'use client';

import React from 'react';
import { Milk, Award, CalendarCheck, PackageOpen, HeartHandshake, MessageCircle } from 'lucide-react';

export default function WhyChooseUs() {
  const points = [
    {
      icon: Milk,
      title: '100% Pure & Fresh Daily',
      desc: 'Collected fresh twice every morning and evening. Untouched purity with natural cream and nutrients preserved.',
      badge: 'Zero Adulteration',
    },
    {
      icon: Award,
      title: 'Thick & Naturally Set Curd',
      desc: 'Prepared through traditional culture methods for superior thickness and authentic home taste without artificial thickeners.',
      badge: 'Traditional Taste',
    },
    {
      icon: CalendarCheck,
      title: 'Open 365 Days a Year',
      desc: 'We are open every single day from 5:30 AM to ensure your morning tea, coffee, and daily breakfast is never delayed.',
      badge: 'Reliable Daily',
    },
    {
      icon: PackageOpen,
      title: 'Function & Event Curd Buckets',
      desc: 'Specialists in 5kg, 10kg, and 20kg food-grade curd buckets for marriages, receptions, poojas, and catering orders.',
      badge: 'Bulk Specialists',
    },
    {
      icon: HeartHandshake,
      title: 'Local Family-Owned Trust',
      desc: 'Serving our neighborhood families with warmth, fair prices, and direct accountability for every product we sell.',
      badge: 'Family Values',
    },
    {
      icon: MessageCircle,
      title: 'Instant WhatsApp Ordering',
      desc: 'No complicated registration or payment forms. Choose what you need, click WhatsApp, and we confirm right away!',
      badge: 'Fast & Easy',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            Our Commitment to You
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Local Families Choose Our Dairy
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From your morning glass of milk to hundreds of kilograms of rich curd for family celebrations, quality and purity are always guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {point.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
