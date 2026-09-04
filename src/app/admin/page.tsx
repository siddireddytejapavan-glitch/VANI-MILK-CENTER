import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';
import { generateWhatsAppLink, cleanWhatsAppNumber } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Fetch real metrics from database
  const [
    totalProducts,
    activeProducts,
    allVariants,
    totalOrders,
    pendingOrders,
    functionOrders,
    recentOrders,
    settings,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.productVariant.findMany({ select: { stockQuantity: true, isAvailable: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'Pending' } }),
    prisma.order.count({ where: { isFunctionOrder: true } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.shopSettings.findUnique({ where: { id: 'default-settings' } }),
  ]);

  const outOfStockCount = allVariants.filter(
    (v) => !v.isAvailable || v.stockQuantity <= 0
  ).length;

  const totalRevenue = (
    await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'Cancelled' } },
    })
  )._sum.totalAmount || 0;

  const cards = [
    {
      title: 'Total Products',
      value: totalProducts,
      desc: 'Active catalogue items',
      icon: Package,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Available Products',
      value: activeProducts,
      desc: 'Visible to customers',
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Out-of-Stock Variants',
      value: outOfStockCount,
      desc: 'Variants requiring refill',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Total Customer Orders',
      value: totalOrders,
      desc: `Total volume: ${formatINR(totalRevenue)}`,
      icon: ShoppingBag,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      desc: 'Awaiting shop confirmation',
      icon: Calendar,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Function / Bulk Orders',
      value: functionOrders,
      desc: 'Marriages, parties & events',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            Live Shop Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Welcome to {settings?.shopName || 'Dairy Admin'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time control over products, variants, curd buckets, stock, and WhatsApp orders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            View Orders ({pendingOrders} Pending)
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className={`p-6 rounded-3xl border shadow-xs transition-shadow hover:shadow-md bg-white flex items-center justify-between`}
            >
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {c.title}
                </p>
                <p className="text-3xl font-black text-slate-900 mt-2">{c.value}</p>
                <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${c.color}`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest incoming orders placed via customer website and WhatsApp
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">No orders received yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Customer orders placed from the website will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Order Ref</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items Summary</th>
                  <th className="px-6 py-3.5">Total</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const customerWhatsAppMsg = `Hello ${order.customerName}, regarding your dairy order #${order.id.slice(-6).toUpperCase()} at ${settings?.shopName}...`;
                  const customerWhatsAppUrl = generateWhatsAppLink(
                    order.customerPhone,
                    customerWhatsAppMsg
                  );

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-slate-700">
                        #{order.id.slice(-6).toUpperCase()}
                        {order.isFunctionOrder && (
                          <span className="ml-2 inline-block px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800">
                            Function
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{order.customerPhone}</span>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">
                        {order.items.map((i) => `${i.productName} (${i.packSize} × ${i.quantity})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900 text-sm">
                        {formatINR(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'Confirmed'
                              ? 'bg-sky-100 text-sky-800'
                              : order.status === 'Preparing'
                              ? 'bg-indigo-100 text-indigo-800'
                              : order.status === 'Ready'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={customerWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-bold transition-colors"
                          title="Message customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
