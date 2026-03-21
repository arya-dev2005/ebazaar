import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("validators", () => {
    describe("signUpSchema", () => {
        const signUpSchema = z.object({
            name: z.string().min(2, "Name must be at least 2 characters"),
            email: z.string().email("Invalid email address"),
            password: z.string().min(8, "Password must be at least 8 characters"),
        });

        it("should validate valid sign up data", () => {
            const validData = {
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            };
            expect(() => signUpSchema.parse(validData)).not.toThrow();
        });

        it("should validate email correctly", () => {
            const invalidEmail = {
                name: "John",
                email: "invalid-email",
                password: "password123",
            };
            expect(() => signUpSchema.parse(invalidEmail)).toThrow();
        });

        it("should require minimum password length", () => {
            const shortPassword = {
                name: "John",
                email: "john@example.com",
                password: "1234567",
            };
            expect(() => signUpSchema.parse(shortPassword)).toThrow();
        });

        it("should require minimum name length", () => {
            const shortName = {
                name: "J",
                email: "john@example.com",
                password: "password123",
            };
            expect(() => signUpSchema.parse(shortName)).toThrow();
        });
    });

    describe("signInSchema", () => {
        const signInSchema = z.object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(1, "Password is required"),
        });

        it("should validate valid sign in data", () => {
            const validData = {
                email: "john@example.com",
                password: "password123",
            };
            expect(() => signInSchema.parse(validData)).not.toThrow();
        });

        it("should require email", () => {
            const missingEmail = {
                password: "password123",
            };
            expect(() => signInSchema.parse(missingEmail)).toThrow();
        });

        it("should require password", () => {
            const missingPassword = {
                email: "john@example.com",
            };
            expect(() => signInSchema.parse(missingPassword)).toThrow();
        });

        it("should validate email format", () => {
            const invalidEmail = {
                email: "not-an-email",
                password: "password123",
            };
            expect(() => signInSchema.parse(invalidEmail)).toThrow();
        });
    });

    describe("productSchema", () => {
        const productSchema = z.object({
            name: z.string().min(2, "Name must be at least 2 characters"),
            description: z.string().min(10, "Description must be at least 10 characters"),
            price: z.coerce.number().positive("Price must be positive"),
            stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
            categoryId: z.string().cuid("Invalid category"),
            featured: z.boolean().default(false),
            images: z.string().default("[]"),
        });

        // Valid CUID: starts with 'c' and is at least 8 characters
        const validCuid = "cat1234567890abc";

        it("should validate valid product data", () => {
            const validData = {
                name: "Test Product",
                description: "This is a test product description",
                price: 99.99,
                stock: 10,
                categoryId: validCuid,
                featured: false,
                images: '["image.jpg"]',
            };
            expect(() => productSchema.parse(validData)).not.toThrow();
        });

        it("should require minimum name length", () => {
            const shortName = {
                name: "A",
                description: "This is a test product description",
                price: 99.99,
                stock: 10,
                categoryId: validCuid,
            };
            expect(() => productSchema.parse(shortName)).toThrow();
        });

        it("should require minimum description length", () => {
            const shortDesc = {
                name: "Test Product",
                description: "Short",
                price: 99.99,
                stock: 10,
                categoryId: validCuid,
            };
            expect(() => productSchema.parse(shortDesc)).toThrow();
        });

        it("should require positive price", () => {
            const negativePrice = {
                name: "Test Product",
                description: "This is a test product description",
                price: -10,
                stock: 10,
                categoryId: validCuid,
            };
            expect(() => productSchema.parse(negativePrice)).toThrow();
        });

        it("should require non-negative stock", () => {
            const negativeStock = {
                name: "Test Product",
                description: "This is a test product description",
                price: 99.99,
                stock: -5,
                categoryId: validCuid,
            };
            expect(() => productSchema.parse(negativeStock)).toThrow();
        });

        it("should coerce string inputs to numbers", () => {
            const stringNumbers = {
                name: "Test Product",
                description: "This is a test product description",
                price: "99.99",
                stock: "10",
                categoryId: validCuid,
            };
            const result = productSchema.parse(stringNumbers);
            expect(result.price).toBe(99.99);
            expect(result.stock).toBe(10);
        });
    });

    describe("addToCartSchema", () => {
        const addToCartSchema = z.object({
            productId: z.string().cuid("Invalid product"),
            quantity: z.coerce.number().int().positive("Quantity must be positive").default(1),
        });

        // Valid CUID: starts with 'c' or 'C' and is at least 8 characters
        const validCuid = "cprod1234567890123456";

        it("should validate valid cart input", () => {
            const validData = {
                productId: validCuid,
                quantity: 2,
            };
            expect(() => addToCartSchema.parse(validData)).not.toThrow();
        });

        it("should require product ID", () => {
            const missingProductId = {
                quantity: 2,
            };
            expect(() => addToCartSchema.parse(missingProductId)).toThrow();
        });

        it("should require positive quantity", () => {
            const invalidQuantity = {
                productId: validCuid,
                quantity: 0,
            };
            expect(() => addToCartSchema.parse(invalidQuantity)).toThrow();
        });

        it("should coerce string to number", () => {
            const stringQuantity = {
                productId: validCuid,
                quantity: "2",
            };
            const result = addToCartSchema.parse(stringQuantity);
            expect(result.quantity).toBe(2);
        });

        it("should default quantity to 1", () => {
            const noQuantity = {
                productId: validCuid,
            };
            const result = addToCartSchema.parse(noQuantity);
            expect(result.quantity).toBe(1);
        });
    });

    describe("categorySchema", () => {
        const categorySchema = z.object({
            name: z.string().min(2, "Name must be at least 2 characters"),
            slug: z.string().optional(),
        });

        it("should validate valid category data", () => {
            const validData = {
                name: "Electronics",
            };
            expect(() => categorySchema.parse(validData)).not.toThrow();
        });

        it("should validate category with slug", () => {
            const withSlug = {
                name: "Electronics",
                slug: "electronics",
            };
            expect(() => categorySchema.parse(withSlug)).not.toThrow();
        });

        it("should require minimum name length", () => {
            const shortName = {
                name: "A",
            };
            expect(() => categorySchema.parse(shortName)).toThrow();
        });
    });
});
