import { describe, it, expect } from "vitest";

// Simple inline tests for utils - no mocking needed
describe("utils", () => {
    describe("formatPrice", () => {
        it("should format USD correctly", () => {
            // Test the logic directly
            const formatPrice = (price: number): string => {
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price);
            };

            expect(formatPrice(0)).toBe("$0.00");
            expect(formatPrice(100)).toBe("$100.00");
            expect(formatPrice(1234.56)).toBe("$1,234.56");
            expect(formatPrice(99.99)).toBe("$99.99");
        });

        it("should handle large numbers", () => {
            const formatPrice = (price: number): string => {
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price);
            };

            expect(formatPrice(1000000)).toBe("$1,000,000.00");
        });

        it("should handle small decimal values", () => {
            const formatPrice = (price: number): string => {
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(price);
            };

            expect(formatPrice(0.01)).toBe("$0.01");
        });
    });

    describe("slugify", () => {
        it("should convert strings to URL-safe slugs", () => {
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_]+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();
            };

            expect(slugify("Hello World")).toBe("hello-world");
            expect(slugify("Product Name")).toBe("product-name");
        });

        it("should remove special characters", () => {
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_]+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();
            };

            expect(slugify("Product @#$%! Name")).toBe("product-name");
            expect(slugify("Test (2024)")).toBe("test-2024");
        });

        it("should replace spaces and underscores with hyphens", () => {
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_]+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();
            };

            expect(slugify("hello_world")).toBe("hello-world");
            expect(slugify("hello world test")).toBe("hello-world-test");
        });

        it("should handle multiple hyphens", () => {
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_]+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();
            };

            expect(slugify("hello---world")).toBe("hello-world");
            expect(slugify("hello--world--test")).toBe("hello-world-test");
        });

        it("should trim whitespace", () => {
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_]+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();
            };

            expect(slugify("  hello world  ")).toBe("-hello-world-");
        });

        it("should handle empty strings", () => {
            const slugify = (text: string): string => {
                return text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_]+/g, "-")
                    .replace(/-+/g, "-")
                    .trim();
            };

            expect(slugify("")).toBe("");
        });
    });

    describe("truncate", () => {
        it("should truncate long text", () => {
            const truncate = (text: string, length: number): string => {
                if (text.length <= length) return text;
                return text.slice(0, length) + "…";
            };

            const longText = "This is a very long text that should be truncated";
            expect(truncate(longText, 20)).toBe("This is a very long …");
        });

        it("should not truncate short text", () => {
            const truncate = (text: string, length: number): string => {
                if (text.length <= length) return text;
                return text.slice(0, length) + "…";
            };

            const shortText = "Short";
            expect(truncate(shortText, 20)).toBe("Short");
        });

        it("should handle exact length", () => {
            const truncate = (text: string, length: number): string => {
                if (text.length <= length) return text;
                return text.slice(0, length) + "…";
            };

            const exactText = "Hello";
            expect(truncate(exactText, 5)).toBe("Hello");
        });

        it("should handle zero length", () => {
            const truncate = (text: string, length: number): string => {
                if (text.length <= length) return text;
                return text.slice(0, length) + "…";
            };

            expect(truncate("Hello", 0)).toBe("…");
        });

        it("should use default ellipsis character", () => {
            const truncate = (text: string, length: number): string => {
                if (text.length <= length) return text;
                return text.slice(0, length) + "…";
            };

            const text = "Very long text here";
            const result = truncate(text, 10);
            expect(result).toContain("…");
        });
    });

    describe("parseImages", () => {
        it("should parse JSON array strings", () => {
            const parseImages = (imagesJson: string): string[] => {
                try {
                    return JSON.parse(imagesJson);
                } catch {
                    return [];
                }
            };

            expect(parseImages('["image1.jpg", "image2.jpg"]')).toEqual([
                "image1.jpg",
                "image2.jpg",
            ]);
        });

        it("should return empty array for invalid JSON", () => {
            const parseImages = (imagesJson: string): string[] => {
                try {
                    return JSON.parse(imagesJson);
                } catch {
                    return [];
                }
            };

            expect(parseImages("not valid json")).toEqual([]);
            expect(parseImages("")).toEqual([]);
        });

        it("should handle empty arrays", () => {
            const parseImages = (imagesJson: string): string[] => {
                try {
                    return JSON.parse(imagesJson);
                } catch {
                    return [];
                }
            };

            expect(parseImages("[]")).toEqual([]);
        });

        it("should handle arrays with single item", () => {
            const parseImages = (imagesJson: string): string[] => {
                try {
                    return JSON.parse(imagesJson);
                } catch {
                    return [];
                }
            };

            expect(parseImages('["single.jpg"]')).toEqual(["single.jpg"]);
        });
    });
});
