"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, parseImages } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart";
import { Button } from "@/components/ui/button";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
    stock: number;
    category: { name: string };
}

export function RecommendedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products?limit=4&sort=newest");
                const data = await response.json();
                if (data.items) {
                    setProducts(data.items);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="mt-12">
                <h2 className="text-xl font-semibold text-white mb-6">Recommended For You</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-slate-800 rounded-xl mb-3"></div>
                            <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-xl font-semibold text-white mb-6">Recommended For You</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => {
                    const images = parseImages(product.images);
                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="group block"
                        >
                            <div className="aspect-square rounded-xl overflow-hidden bg-slate-800 mb-3">
                                {images[0] ? (
                                    <img
                                        src={images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-sm font-semibold text-indigo-400 mt-1">
                                {formatPrice(product.price)}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
