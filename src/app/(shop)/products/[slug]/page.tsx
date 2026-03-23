import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/services/product";
import { formatPrice, parseImages } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AddToCartWithQuantity } from "@/components/products/add-to-cart-with-quantity";
import { ProductCard } from "@/components/products/product-card";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Not Found" };
    return { title: product.name, description: product.description };
}

// Stock status helper
function getStockStatus(stock: number): { label: string; className: string; dotClassName: string } {
    if (stock <= 0) {
        return { label: "Out of Stock", className: "text-red-400", dotClassName: "bg-red-400" };
    }
    if (stock <= 5) {
        return { label: "Low Stock", className: "text-amber-400", dotClassName: "bg-amber-400" };
    }
    return { label: "In Stock", className: "text-emerald-400", dotClassName: "bg-emerald-400" };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const images = parseImages(product.images);
    const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
    const stockStatus = getStockStatus(product.stock);

    // Get related products from same category
    let relatedProducts: any[] = [];
    try {
        relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4);
    } catch {
        // DB may not exist yet
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Breadcrumb Navigation */}
                <nav className="mb-6">
                    <ol className="flex items-center gap-2 text-sm">
                        <li>
                            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                                Home
                            </Link>
                        </li>
                        <li className="text-slate-600">/</li>
                        <li>
                            <Link href="/products" className="text-slate-400 hover:text-white transition-colors">
                                Products
                            </Link>
                        </li>
                        <li className="text-slate-600">/</li>
                        <li>
                            <Link
                                href={`/products?categoryId=${product.categoryId}`}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                {product.category.name}
                            </Link>
                        </li>
                        <li className="text-slate-600">/</li>
                        <li className="text-slate-300 truncate max-w-[200px]">{product.name}</li>
                    </ol>
                </nav>

                {/* Main Product Section */}
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                            {images[0] ? (
                                <img
                                    src={images[0]}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-600">No image</div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((image, index) => (
                                    <button
                                        key={index}
                                        className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${index === 0 ? "border-indigo-500" : "border-slate-700 hover:border-slate-600"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} - ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col">
                        {/* Category */}
                        <Link
                            href={`/products?categoryId=${product.categoryId}`}
                            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 mb-2 inline-block"
                        >
                            {product.category.name}
                        </Link>

                        {/* Product Name */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">{product.name}</h1>

                        {/* Rating */}
                        <div className="mt-3 flex items-center gap-3">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        className={`h-5 w-5 ${star <= avgRating ? "text-amber-400" : "text-slate-700"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-slate-400">
                                {avgRating > 0 ? avgRating.toFixed(1) : "No"} ratings ({product.reviews.length} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <p className="mt-5 text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            {formatPrice(product.price)}
                        </p>

                        {/* Stock Status */}
                        <div className="mt-4">
                            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${stockStatus.className}`}>
                                <span className={`h-2 w-2 rounded-full ${stockStatus.dotClassName}`} />
                                {stockStatus.label}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                            <p className="text-slate-400 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Add to Cart */}
                        {product.stock > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-800">
                                <AddToCartWithQuantity productId={product.id} stock={product.stock} />
                            </div>
                        )}

                        {/* Product Details */}
                        <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                            <h3 className="text-sm font-semibold text-white mb-3">Product Details</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-slate-400">Category</dt>
                                    <dd className="text-slate-200">{product.category.name}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-slate-400">SKU</dt>
                                    <dd className="text-slate-200 font-mono">{product.slug.toUpperCase()}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 border-t border-slate-800 pt-10">
                    <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>
                    {product.reviews.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {product.reviews.slice(0, 6).map((review) => (
                                <div key={review.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <span className="text-indigo-400 font-medium">
                                                {review.user.name?.[0]?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-white">{review.user.name}</span>
                                            <div className="flex mt-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`h-3.5 w-3.5 ${star <= review.rating ? "text-amber-400" : "text-slate-700"}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {review.comment && <p className="text-sm text-slate-400">{review.comment}</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
                            <p className="text-slate-400">No reviews yet. Be the first to review this product!</p>
                        </div>
                    )}
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 border-t border-slate-800 pt-10">
                        <h2 className="text-2xl font-bold text-white mb-2">You May Also Like</h2>
                        <p className="text-slate-400 mb-6">Products from the same category</p>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
