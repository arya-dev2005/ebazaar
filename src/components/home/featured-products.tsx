"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
    category: { name: string };
}

function ProductSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
                {/* Image skeleton */}
                <div className="aspect-square bg-slate-800" />
                {/* Info skeleton */}
                <div className="p-4 space-y-3">
                    <div className="h-3 w-16 bg-slate-800 rounded" />
                    <div className="h-4 w-full bg-slate-800 rounded" />
                    <div className="h-4 w-2/3 bg-slate-800 rounded" />
                    <div className="h-6 w-24 bg-slate-800 rounded" />
                </div>
            </div>
        </div>
    );
}

function ShimmerSkeleton() {
    return (
        <div className="relative overflow-hidden bg-slate-800 rounded-xl border border-slate-700">
            <div className="aspect-square" />
            <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-slate-700 rounded" />
                <div className="h-4 w-full bg-slate-700 rounded" />
                <div className="h-4 w-2/3 bg-slate-700 rounded" />
                <div className="h-6 w-24 bg-slate-700 rounded" />
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-600/20 to-transparent" />
        </div>
    );
}

function LoadingState() {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
                <ShimmerSkeleton key={i} />
            ))}
        </div>
    );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-red-500/10 p-4">
                <svg
                    className="h-8 w-8 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-100">
                Unable to load products
            </h3>
            <p className="mb-6 max-w-md text-sm text-slate-400">
                We encountered an error while fetching the featured products. Please try again.
            </p>
            <Button onClick={onRetry} variant="outline">
                <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                Try Again
            </Button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-800 p-4">
                <svg
                    className="h-8 w-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-100">
                No products available
            </h3>
            <p className="mb-6 max-w-md text-sm text-slate-400">
                Check back soon for our featured products!
            </p>
            <Link href="/products">
                <Button>Browse All Products</Button>
            </Link>
        </div>
    );
}

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/products?featured=true&limit=8");
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            const data = await response.json();
            setProducts(data.items || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Featured Products</h2>
                        <p className="text-sm text-slate-400 mt-1">Handpicked for you</p>
                    </div>
                    <div className="h-5 w-24 bg-slate-800 animate-pulse rounded" />
                </div>
                <LoadingState />
            </section>
        );
    }

    if (error) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Featured Products</h2>
                        <p className="text-sm text-slate-400 mt-1">Handpicked for you</p>
                    </div>
                </div>
                <ErrorState onRetry={fetchProducts} />
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Featured Products</h2>
                        <p className="text-sm text-slate-400 mt-1">Handpicked for you</p>
                    </div>
                </div>
                <EmptyState />
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Featured Products</h2>
                    <p className="text-sm text-slate-400 mt-1">Handpicked for you</p>
                </div>
                <Link href="/products" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    View All →
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
