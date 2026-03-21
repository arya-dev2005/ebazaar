import Link from "next/link";
import { formatPrice, parseImages } from "@/lib/utils";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string;
        category: { name: string };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    const images = parseImages(product.images);
    const imageUrl = images[0] || "/placeholder.svg";

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-slate-800">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Info */}
                <div className="p-4">
                    <p className="text-xs font-medium text-indigo-400 mb-1">
                        {product.category.name}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 mb-2 group-hover:text-white transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                    </p>
                </div>
            </div>
        </Link>
    );
}
