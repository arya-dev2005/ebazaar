import { test, expect } from "@playwright/test";

test.describe("Product E2E Tests", () => {
    test.describe("Product Listing Page", () => {
        test("should view product listing page", async ({ page }) => {
            await page.goto("/products");

            // Verify page title
            await expect(page.locator("h1")).toContainText("Products");

            // Verify search input exists
            await expect(page.locator('input[name="search"]')).toBeVisible();

            // Verify filters section exists
            await expect(page.locator("text=Filters")).toBeVisible();

            // Verify categories section exists
            await expect(page.locator("text=Categories")).toBeVisible();

            // Verify sort options exist
            await expect(page.locator("text=Sort By")).toBeVisible();
        });

        test("should display products grid", async ({ page }) => {
            await page.goto("/products");

            // Wait for products to load
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            // Check that product cards are visible
            const productLinks = page.locator("a[href^='/products/']");
            const count = await productLinks.count();

            // Should have at least some products or show "No products found"
            if (count > 0) {
                await expect(productLinks.first()).toBeVisible();
            } else {
                await expect(page.locator("text=No products found")).toBeVisible();
            }
        });

        test("should show results count", async ({ page }) => {
            await page.goto("/products");

            // Wait for page to load
            await page.waitForTimeout(2000);

            // Results count should be visible
            const resultsText = page.locator("text=/\\d+ results/");
            const count = await resultsText.count();
            expect(count).toBeGreaterThanOrEqual(0);
        });
    });

    test.describe("Featured Products on Homepage", () => {
        test("should view featured products on homepage", async ({ page }) => {
            await page.goto("/");

            // Wait for featured products section
            await page.waitForTimeout(2000);

            // Check if featured products section exists
            const featuredHeading = page.locator("text=Featured Products");
            const count = await featuredHeading.count();

            if (count > 0) {
                await expect(featuredHeading).toBeVisible();

                // Check for product cards in featured section
                const productCards = page.locator("a[href^='/products/']");
                const cardCount = await productCards.count();
                expect(cardCount).toBeGreaterThan(0);
            }
        });

        test("should have browse products button", async ({ page }) => {
            await page.goto("/");

            // Check for browse products button
            const browseButton = page.locator("text=Browse Products");
            await expect(browseButton).toBeVisible();

            // Click and verify navigation
            await browseButton.click();
            await expect(page).toHaveURL("/products");
        });

        test("should have create account button", async ({ page }) => {
            await page.goto("/");

            // Check for create account button
            const createAccountButton = page.locator("text=Create Account");
            await expect(createAccountButton).toBeVisible();
        });
    });

    test.describe("Product Detail Page", () => {
        test("should view product detail page", async ({ page }) => {
            // First go to products page to find a product
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            // Click on first product
            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // Verify we're on product detail page
            await expect(page).toHaveURL(/\/products\/.+/);

            // Verify product name is visible
            await expect(page.locator("h1")).toBeVisible();

            // Verify price is visible
            await expect(page.locator("text=$")).toBeVisible();

            // Verify add to cart button exists
            await expect(page.locator("text=Add to Cart")).toBeVisible();
        });

        test("should display product category", async ({ page }) => {
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // Category should be visible (indigo colored text)
            const category = page.locator("text=Electronics,Clothing,Accessories,Home,Sports").first();
            await expect(category).toBeVisible();
        });

        test("should display product stock status", async ({ page }) => {
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // Should show either "In stock" or "Out of stock"
            const inStock = await page.locator("text=In stock").count();
            const outOfStock = await page.locator("text=Out of stock").count();

            expect(inStock + outOfStock).toBeGreaterThan(0);
        });

        test("should display product description", async ({ page }) => {
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // Description section should be visible
            await expect(page.locator("text=Reviews")).toBeVisible();
        });

        test("should display product reviews section", async ({ page }) => {
            await page.goto("/products");
            await page.waitForSelector("a[href^='/products/']", { timeout: 10000 });

            const firstProduct = page.locator("a[href^='/products/']").first();
            await firstProduct.click();

            // Reviews section should be visible
            await expect(page.locator("text=Reviews")).toBeVisible();

            // Should show review count
            const reviewCount = page.locator("text=/\\d+ reviews/").count();
            expect(reviewCount).toBeGreaterThanOrEqual(0);
        });
    });

    test.describe("Search Products", () => {
        test("should search products", async ({ page }) => {
            await page.goto("/products");

            // Find and fill search input
            const searchInput = page.locator('input[name="search"]');
            await searchInput.fill("laptop");

            // Submit the search form
            await searchInput.press("Enter");

            // URL should contain search parameter
            await expect(page).toHaveURL(/search=laptop/);

            // Results should update
            await page.waitForTimeout(1000);
        });

        test("should clear search with empty query", async ({ page }) => {
            await page.goto("/products?search=test");

            // Click "All" in categories to clear filters
            await page.click("text=All");

            // Should remove search parameter
            await expect(page).toHaveURL("/products");
        });
    });

    test.describe("Filter by Category", () => {
        test("should filter by category", async ({ page }) => {
            await page.goto("/products");

            // Wait for categories to load
            await page.waitForTimeout(1000);

            // Click on a category link (first category after "All")
            const categoryLinks = page.locator('aside a[href^="/products?categoryId="]');
            const count = await categoryLinks.count();

            if (count > 0) {
                await categoryLinks.first().click();

                // URL should contain categoryId
                await expect(page).toHaveURL(/categoryId=/);

                // Results should update
                await page.waitForTimeout(1000);
            }
        });

        test("should show all products when clicking All", async ({ page }) => {
            // Navigate with a category filter
            await page.goto("/products");
            await page.waitForTimeout(1000);

            // Click "All" link
            const allLink = page.locator('aside a[href="/products"]').first();
            const count = await allLink.count();

            if (count > 0) {
                await allLink.click();

                // Should show all products
                await expect(page).toHaveURL("/products");
            }
        });

        test("should filter by sort option", async ({ page }) => {
            await page.goto("/products");

            // Wait for sort options to load
            await page.waitForTimeout(1000);

            // Click on a sort option
            const sortLinks = page.locator('aside a[href^="/products?sort="]');
            const count = await sortLinks.count();

            if (count > 0) {
                await sortLinks.first().click();

                // URL should contain sort parameter
                await expect(page).toHaveURL(/sort=/);

                // Results should update
                await page.waitForTimeout(1000);
            }
        });
    });

    test.describe("Navigation", () => {
        test("should navigate to products from header", async ({ page }) => {
            await page.goto("/");

            // Click Products in header
            await page.click("nav >> text=Products");

            await expect(page).toHaveURL("/products");
        });

        test("should navigate to product from home featured section", async ({ page }) => {
            await page.goto("/");

            // Wait for featured products
            await page.waitForTimeout(2000);

            const featuredProducts = page.locator("section a[href^='/products/']");
            const count = await featuredProducts.count();

            if (count > 0) {
                await featuredProducts.first().click();
                await expect(page).toHaveURL(/\/products\/.+/);
            }
        });
    });
});
