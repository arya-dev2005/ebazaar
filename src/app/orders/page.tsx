import { auth } from "@/lib/auth";
import { getOrdersByUser } from "@/services/order";
import { formatPrice, parseImages } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders" };

const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    PAID: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function OrdersPage() {
    const session = await auth();
    if (!session?.user) return null;

    const orders = await getOrdersByUser(session.user.id!);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-white mb-8">Your Orders</h1>

                {orders.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-16 text-center">
                        <p className="text-slate-400">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-mono">#{order.id.slice(-8)}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-sm font-semibold text-white">{formatPrice(order.total)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 overflow-x-auto">
                                    {order.items.map((item) => {
                                        const images = parseImages(item.product.images);
                                        return (
                                            <div key={item.id} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                                                {images[0] && <img src={images[0]} alt={item.product.name} className="h-full w-full object-cover" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
