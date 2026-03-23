import { NextRequest, NextResponse } from "next/server";
import { getFeaturedProducts, getProducts } from "@/services/product";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const featured = searchParams.get("featured");
        const limit = parseInt(searchParams.get("limit") || "8");
        const page = parseInt(searchParams.get("page") || "1");

        if (featured === "true") {
            const products = await getFeaturedProducts(limit);
            return NextResponse.json({
                items: products,
                total: products.length,
                page: 1,
                limit,
                totalPages: 1,
            });
        }

        // Regular products with filters
        const categoryId = searchParams.get("categoryId") || undefined;
        const search = searchParams.get("search") || undefined;
        const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
        const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
        const sort = searchParams.get("sort") || "newest";

        const result = await getProducts({
            categoryId,
            search,
            minPrice,
            maxPrice,
            sort: sort as any,
            page,
            limit,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}
