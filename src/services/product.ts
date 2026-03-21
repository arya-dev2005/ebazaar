import { prisma } from "@/lib/prisma";
import type { PaginatedResult, ProductWithCategory } from "@/types";
import type { ProductFilter } from "@/lib/validators";
import { slugify } from "@/lib/utils";

const PRISMA_UNIQUE_CONSTRAINT_ERROR = "P2002";

/**
 * Generate a unique slug by appending a suffix if needed
 */
async function generateUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.product.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}

export async function getProducts(
    filters: ProductFilter
): Promise<PaginatedResult<ProductWithCategory>> {
    const { search, categoryId, minPrice, maxPrice, sort, page, limit } = filters;

    const where: any = {};
    if (search) {
        // Note: mode 'insensitive' requires PostgreSQL. For SQLite, use lowercase comparison.
        // Check if we're using PostgreSQL for case-insensitive search
        const isPostgres = process.env.DATABASE_URL?.startsWith('postgresql');

        if (isPostgres) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        } else {
            // SQLite fallback: use lowercase search
            const searchLower = search.toLowerCase();
            where.OR = [
                { name: { contains: searchLower } }, // Assumes data is stored lowercase
                { description: { contains: searchLower } },
            ];
        }
    }
    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = (() => {
        switch (sort) {
            case "price-asc": return { price: "asc" };
            case "price-desc": return { price: "desc" };
            case "name": return { name: "asc" };
            case "newest": return { createdAt: "desc" };
            default: return { createdAt: "desc" };
        }
    })();

    const [items, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
            include: { category: true },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        items: items as ProductWithCategory[],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getProductBySlug(slug: string) {
    return prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            reviews: {
                include: { user: { select: { id: true, name: true, image: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });
}

export async function getFeaturedProducts(limit = 8) {
    return prisma.product.findMany({
        where: { featured: true, stock: { gt: 0 } },
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}

export async function createProduct(data: {
    name: string;
    slug?: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    featured: boolean;
    images: string;
}) {
    // Generate a unique slug if not provided or if it might conflict
    const baseSlug = data.slug || slugify(data.name);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    try {
        return await prisma.product.create({
            data: { ...data, slug: uniqueSlug },
        });
    } catch (error: any) {
        // Handle unique constraint violation (P2002) on slug
        if (error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR) {
            // This shouldn't happen since we generate a unique slug,
            // but handle it defensively
            const retrySlug = await generateUniqueSlug(`${baseSlug}-${Date.now()}`);
            return await prisma.product.create({
                data: { ...data, slug: retrySlug },
            });
        }
        throw error;
    }
}

export async function updateProduct(
    id: string,
    data: Partial<{
        name: string;
        slug: string;
        description: string;
        price: number;
        stock: number;
        categoryId: string;
        featured: boolean;
        images: string;
    }>
) {
    return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
}

export async function getCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(data: { name: string; slug?: string }) {
    const baseSlug = data.slug || slugify(data.name);
    const uniqueSlug = await generateUniqueCategorySlug(baseSlug);

    try {
        return await prisma.category.create({
            data: { name: data.name, slug: uniqueSlug },
        });
    } catch (error: any) {
        if (error.code === PRISMA_UNIQUE_CONSTRAINT_ERROR) {
            const retrySlug = await generateUniqueCategorySlug(`${baseSlug}-${Date.now()}`);
            return await prisma.category.create({
                data: { name: data.name, slug: retrySlug },
            });
        }
        throw error;
    }
}

export async function updateCategory(
    id: string,
    data: Partial<{ name: string; slug: string }>
) {
    return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
    // Check if category has products
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
        throw new Error("Cannot delete category with associated products");
    }
    return prisma.category.delete({ where: { id } });
}

/**
 * Generate a unique slug for categories
 */
async function generateUniqueCategorySlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await prisma.category.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}
