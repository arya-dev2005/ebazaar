// Custom type augmentations

export type UserRole = "USER" | "ADMIN";
export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface CartWithItems {
    id: string;
    userId: string;
    items: CartItemWithProduct[];
}

export interface CartItemWithProduct {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        images: string;
        stock: number;
    };
}

export interface ProductWithCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string;
    stock: number;
    featured: boolean;
    categoryId: string;
    category: { id: string; name: string; slug: string };
    createdAt: Date;
}

export interface OrderWithItems {
    id: string;
    userId: string;
    status: OrderStatus;
    total: number;
    stripeSessionId: string | null;
    shippingAddress: string | null;
    createdAt: Date;
    items: {
        id: string;
        quantity: number;
        price: number;
        product: {
            id: string;
            name: string;
            slug: string;
            images: string;
        };
    }[];
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Auth.js type augmentation
declare module "next-auth" {
    interface User {
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: string;
    }
}
