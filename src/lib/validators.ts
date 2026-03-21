import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────

export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// ─── Products ────────────────────────────────────────────────

export const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    categoryId: z.string().cuid("Invalid category"),
    featured: z.boolean().default(false),
    images: z.string().default("[]"),
});

export const productFilterSchema = z.object({
    search: z.string().optional(),
    categoryId: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    sort: z.enum(["price-asc", "price-desc", "newest", "name"]).optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(12),
});

// ─── Cart ────────────────────────────────────────────────────

export const addToCartSchema = z.object({
    productId: z.string().cuid("Invalid product"),
    quantity: z.coerce.number().int().positive("Quantity must be positive").default(1),
});

export const updateCartItemSchema = z.object({
    cartItemId: z.string().cuid("Invalid cart item"),
    quantity: z.coerce.number().int().positive("Quantity must be positive"),
});

// ─── Orders ──────────────────────────────────────────────────

export const updateOrderStatusSchema = z.object({
    orderId: z.string().cuid("Invalid order"),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

// ─── Categories ─────────────────────────────────────────────────

export const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    slug: z.string().optional(),
});

// ─── Reviews ─────────────────────────────────────────────────

export const reviewSchema = z.object({
    productId: z.string().cuid("Invalid product"),
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().max(500).optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductFilter = z.infer<typeof productFilterSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
