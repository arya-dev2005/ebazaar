import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/actions/category";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditCategoryDialog } from "./edit-category-dialog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Categories" };

export default async function AdminCategoriesPage() {
    await requireAdmin();

    const categories = await prisma.category.findMany({
        include: {
            _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
    });

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold text-white">Categories</h1>
                    <Link href="/admin">
                        <Button variant="outline" size="sm">← Dashboard</Button>
                    </Link>
                </div>

                <div className="mb-6">
                    <CategoryForm />
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-800">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900/80">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Slug</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Products</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                                        No categories yet. Create one above.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="px-4 py-3 text-white font-medium">{category.name}</td>
                                        <td className="px-4 py-3 text-slate-400">{category.slug}</td>
                                        <td className="px-4 py-3 text-indigo-400">{category._count.products}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <EditCategoryDialog category={category} />
                                                <form action={deleteCategoryAction.bind(null, category.id) as any} className="inline">
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        type="submit"
                                                        disabled={category._count.products > 0}
                                                        title={category._count.products > 0 ? "Cannot delete category with products" : "Delete"}
                                                    >
                                                        Delete
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function CategoryForm() {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="text-lg font-medium text-white mb-4">New Category</h2>
            <form action={createCategoryAction as any}>
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Category name"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label htmlFor="slug" className="block text-sm font-medium text-slate-400 mb-1">
                            Slug (optional)
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="auto-generated-if-empty"
                        />
                    </div>
                    <Button type="submit" variant="primary">
                        Create Category
                    </Button>
                </div>
            </form>
        </div>
    );
}
