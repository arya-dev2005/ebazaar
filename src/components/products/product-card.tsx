"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { formatPrice, parseImages } from "@/lib/utils";
import { addToCartAction } from "@/actions/cart";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string;
        category: { name: string };
        stock?: number;
        rating?: number;
        reviewCount?: number;
        salePrice?: number | null;
    };
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount?: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            {hasHalfStar && (
                <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                        <linearGradient id="halfStar">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="#3f3f46" />
                        </linearGradient>
                    </defs>
                    <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="h-3.5 w-3.5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            {reviewCount !== undefined && reviewCount > 0 && (
                <span className="text-xs text-slate-400 ml-1">({reviewCount})</span>
            )}
        </div>
    );
}

function StockBadge({ stock }: { stock: number }) {
    if (stock === 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Out of Stock
            </span>
        );
    }

    if (stock <= 5) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Only {stock} left
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            In Stock
        </span>
    );
}

function ProductImage({ src, alt }: { src: string; alt: string }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="aspect-square overflow-hidden bg-slate-800 relative">
            {isLoading && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse" />
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                className={`h-full w-full object-cover transition-all duration-500 ${isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
                    }`}
            />
        </div>
    );
}

function QuickAddButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleAddToCart = async () => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("quantity", "1");

            const result = await addToCartAction(null, formData);
            if (result?.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
            }
        });
    };

    if (showSuccess) {
        return (
            <button
                disabled
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white font-medium text-sm transition-all duration-300"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Added!
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled || isPending}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-5.98.286h5.98zM7.5 14.25h9m-9 0a3 3 0 01-5.98.286M16.5 14.25a3 3 0 005.98.286h-5.98zm0 0a3 3 0 015.98.286M21.75 3h-1.386a1.125 1.125 0 00-1.087.835l-.383 1.437M17.25 14.25l.69-8.573A1.125 1.125 0 0016.82 4.5H7.18a1.125 1.125 0 00-1.12 1.177L6.75 14.25" />
                </svg>
            )}
            {isPending ? "Adding..." : "Add to Cart"}
        </button>
    );
}

export function ProductCard({ product }: ProductCardProps) {
    const images = parseImages(product.images);
    const imageUrl = images[0] || "/placeholder.svg";
    const isOnSale = product.salePrice !== null && product.salePrice !== undefined && product.salePrice < product.price;
    const isOutOfStock = !product.stock || product.stock === 0;

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
                {/* Image with loading state */}
                <ProductImage src={imageUrl} alt={product.name} />

                {/* Info */}
                <div className="p-4 space-y-3">
                    {/* Category and Stock */}
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-indigo-400">
                            {product.category.name}
                        </p>
                        {product.stock !== undefined && <StockBadge stock={product.stock} />}
                    </div>

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                    )}

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 group-hover:text-white transition-colors">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        {isOnSale ? (
                            <>
                                <span className="text-lg font-bold text-emerald-400">
                                    {formatPrice(product.salePrice!)}
                                </span>
                                <span className="text-sm text-slate-500 line-through">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-red-500/10 text-red-400">
                                    {Math.round((1 - product.salePrice! / product.price) * 100)}% OFF
                                </span>
                            </>
                        ) : (
                            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Quick Add Button */}
                    <div className="pt-1">
                        <QuickAddButton
                            productId={product.id}
                            disabled={isOutOfStock}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}
