import { requireAdmin } from "@/lib/auth";
import { getAllOrders } from "@/services/order";
import { formatPrice } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Orders" };

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400",
    PAID: "bg-blue-500/10 text-blue-400",
    SHIPPED: "bg-purple-500/10 text-purple-400",
    DELIVERED: "bg-emerald-500/10 text-emerald-400",
    CANCELLED: "bg-red-500/10 text-red-400",
};

export default async function AdminOrdersPage() {
    await requireAdmin();
    const orders = await getAllOrders();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <Link href="/admin"><Button variant="outline" size="sm">← Dashboard</Button></Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900/80">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Order</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-4 py-3 text-white font-mono text-xs">#{order.id.slice(-8)}</td>
                                    <td className="px-4 py-3 text-slate-400">{order.user?.email || "—"}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[order.status] || ""}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-indigo-400 font-medium">{formatPrice(order.total)}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
