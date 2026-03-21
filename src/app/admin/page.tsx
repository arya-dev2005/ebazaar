import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
    await requireAdmin();

    const [userCount, productCount, orderCount, revenue] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true }, where: { status: "PAID" } }),
    ]);

    const stats = [
        { label: "Users", value: userCount, icon: "👥" },
        { label: "Products", value: productCount, icon: "📦" },
        { label: "Orders", value: orderCount, icon: "🛒" },
        { label: "Revenue", value: `$${(revenue._sum.total || 0).toFixed(2)}`, icon: "💰" },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <Link href="/admin/products" className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/50 transition-colors">
                        <h2 className="text-lg font-semibold text-white">Manage Products</h2>
                        <p className="text-sm text-slate-400 mt-1">Create, edit, and delete products</p>
                    </Link>
                    <Link href="/admin/orders" className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/50 transition-colors">
                        <h2 className="text-lg font-semibold text-white">Manage Orders</h2>
                        <p className="text-sm text-slate-400 mt-1">View and update order statuses</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
