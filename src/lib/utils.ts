import { type ClassValue, clsx } from "clsx";

/**
 * Merge Tailwind class names with conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price);
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "…";
}

/**
 * Get images array from JSON string stored in DB
 */
export function parseImages(imagesJson: string): string[] {
    try {
        return JSON.parse(imagesJson);
    } catch {
        return [];
    }
}
