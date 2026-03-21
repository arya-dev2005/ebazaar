import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { deleteProductAction } from "@/actions/admin";
import { formatPrice } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Products" };

export default async function AdminProductsPage() {
    await requireAdmin();

    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white">Products</h1>
                    <Link href="/admin"><Button variant="outline" size="sm">← Dashboard</Button></Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900/80">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Stock</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{product.name}</td>
                                    <td className="px-4 py-3 text-slate-400">{product.category.name}</td>
                                    <td className="px-4 py-3 text-indigo-400">{formatPrice(product.price)}</td>
                                    <td className="px-4 py-3">
                                        <span className={product.stock > 0 ? "text-emerald-400" : "text-red-400"}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <form action={deleteProductAction.bind(null, product.id)} className="inline">
                                            <Button variant="danger" size="sm" type="submit">Delete</Button>
                                        </form>
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
