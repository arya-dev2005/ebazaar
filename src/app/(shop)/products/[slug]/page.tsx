import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product";
import { formatPrice, parseImages } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Not Found" };
    return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const images = parseImages(product.images);
    const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Image */}
                    <div className="aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                        {images[0] ? (
                            <img src={images[0]} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-600">No image</div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-indigo-400 mb-2">{product.category.name}</p>
                        <h1 className="text-3xl font-bold text-white">{product.name}</h1>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className={`h-4 w-4 ${star <= avgRating ? "text-amber-400" : "text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-slate-400">({product.reviews.length} reviews)</span>
                        </div>

                        <p className="mt-4 text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                        </p>

                        <p className="mt-4 text-slate-400 leading-relaxed">{product.description}</p>

                        {/* Stock */}
                        <div className="mt-6">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    In stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="text-sm text-red-400">Out of stock</span>
                            )}
                        </div>

                        {/* Add to Cart */}
                        {product.stock > 0 && (
                            <div className="mt-6">
                                <AddToCartButton productId={product.id} />
                            </div>
                        )}

                        {/* Reviews */}
                        <div className="mt-12 border-t border-slate-800 pt-8">
                            <h2 className="text-lg font-semibold text-white mb-4">Reviews</h2>
                            {product.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {product.reviews.map((review) => (
                                        <div key={review.id} className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium text-white">{review.user.name}</span>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg key={star} className={`h-3 w-3 ${star <= review.rating ? "text-amber-400" : "text-slate-700"}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && <p className="text-sm text-slate-400">{review.comment}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
