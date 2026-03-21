import { prisma } from "@/lib/prisma";

export async function createReview(data: {
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
}) {
    return prisma.review.create({ data });
}

export async function getProductReviews(productId: string) {
    return prisma.review.findMany({
        where: { productId },
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
    });
}

export async function getAverageRating(productId: string): Promise<number> {
    const result = await prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
    });
    return result._avg.rating || 0;
}
