import { getProducts, getCategories } from "@/services/product";
import { ProductCard } from "@/components/products/product-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const filters = {
        search: params.search as string | undefined,
        categoryId: params.categoryId as string | undefined,
        sort: params.sort as any,
        page: Number(params.page) || 1,
        limit: 12,
    };

    let data = { items: [] as any[], total: 0, page: 1, limit: 12, totalPages: 0 };
    let categories: any[] = [];

    try {
        [data, categories] = await Promise.all([
            getProducts(filters),
            getCategories(),
        ]);
    } catch {
        // DB may not exist yet
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                            <h2 className="text-sm font-semibold text-white mb-4">Filters</h2>

                            {/* Search */}
                            <form className="mb-6">
                                <input
                                    name="search"
                                    defaultValue={filters.search}
                                    placeholder="Search products..."
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                                />
                            </form>

                            {/* Categories */}
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Categories</h3>
                            <ul className="space-y-1">
                                <li>
                                    <a
                                        href="/products"
                                        className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${!filters.categoryId ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white"
                                            }`}
                                    >
                                        All
                                    </a>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <a
                                            href={`/products?categoryId=${cat.id}`}
                                            className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${filters.categoryId === cat.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white"
                                                }`}
                                        >
                                            {cat.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>

                            {/* Sort */}
                            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-6 mb-2">Sort By</h3>
                            <ul className="space-y-1">
                                {[
                                    { value: "newest", label: "Newest" },
                                    { value: "price-asc", label: "Price: Low → High" },
                                    { value: "price-desc", label: "Price: High → Low" },
                                    { value: "name", label: "Name" },
                                ].map((opt) => (
                                    <li key={opt.value}>
                                        <a
                                            href={`/products?sort=${opt.value}${filters.categoryId ? `&categoryId=${filters.categoryId}` : ""}`}
                                            className={`block rounded-lg px-3 py-1.5 text-sm transition-colors ${filters.sort === opt.value ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-white"
                                                }`}
                                        >
                                            {opt.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-white">Products</h1>
                            <span className="text-sm text-slate-400">{data.total} results</span>
                        </div>

                        {data.items.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                {data.items.map((product) => (
                                    <ProductCard key={product.id} product={product as any} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-16 text-center">
                                <p className="text-slate-400">No products found</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {data.totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
                                    <a
                                        key={page}
                                        href={`/products?page=${page}${filters.categoryId ? `&categoryId=${filters.categoryId}` : ""}${filters.sort ? `&sort=${filters.sort}` : ""}`}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${page === data.page
                                                ? "bg-indigo-500 text-white"
                                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                            }`}
                                    >
                                        {page}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
