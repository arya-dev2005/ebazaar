import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ebazaar.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@ebazaar.com",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Create test user
  const userHash = await bcrypt.hash("user1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@ebazaar.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@ebazaar.com",
      passwordHash: userHash,
      role: "USER",
    },
  });
  console.log("✅ Test user:", user.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics" },
    }),
    prisma.category.upsert({
      where: { slug: "clothing" },
      update: {},
      create: { name: "Clothing", slug: "clothing" },
    }),
    prisma.category.upsert({
      where: { slug: "home-garden" },
      update: {},
      create: { name: "Home & Garden", slug: "home-garden" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports" },
    }),
  ]);
  console.log("✅ Categories:", categories.length);

  // Create products
  const products = [
    {
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-noise-cancelling-headphones",
      description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for music lovers and professionals.",
      price: 299.99,
      stock: 50,
      featured: true,
      categoryId: categories[0].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"]),
    },
    {
      name: "Smart Watch Pro",
      slug: "smart-watch-pro",
      description: "Advanced smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display. Water-resistant up to 50 meters.",
      price: 399.99,
      stock: 30,
      featured: true,
      categoryId: categories[0].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"]),
    },
    {
      name: "4K Ultra HD Camera",
      slug: "4k-ultra-hd-camera",
      description: "Professional-grade mirrorless camera with 4K video, image stabilization, and interchangeable lenses.",
      price: 1299.99,
      stock: 15,
      featured: true,
      categoryId: categories[0].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"]),
    },
    {
      name: "Premium Leather Jacket",
      slug: "premium-leather-jacket",
      description: "Handcrafted genuine leather jacket with a modern slim-fit design. Timeless style meets unmatched durability.",
      price: 249.99,
      stock: 25,
      featured: true,
      categoryId: categories[1].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"]),
    },
    {
      name: "Designer Running Shoes",
      slug: "designer-running-shoes",
      description: "Lightweight performance running shoes with responsive cushioning and breathable mesh upper.",
      price: 179.99,
      stock: 80,
      featured: false,
      categoryId: categories[3].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]),
    },
    {
      name: "Smart Home Speaker",
      slug: "smart-home-speaker",
      description: "Voice-controlled smart speaker with premium sound quality, multi-room audio support.",
      price: 149.99,
      stock: 60,
      featured: true,
      categoryId: categories[0].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600"]),
    },
    {
      name: "Ergonomic Office Chair",
      slug: "ergonomic-office-chair",
      description: "Premium ergonomic chair with adjustable lumbar support, breathable mesh back, and 12-hour comfort.",
      price: 549.99,
      stock: 20,
      featured: false,
      categoryId: categories[2].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600"]),
    },
    {
      name: "Minimalist Backpack",
      slug: "minimalist-backpack",
      description: "Sleek waterproof backpack with laptop compartment, anti-theft design, and USB charging port.",
      price: 89.99,
      stock: 100,
      featured: true,
      categoryId: categories[1].id,
      images: JSON.stringify(["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"]),
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }
  console.log("✅ Products:", products.length);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
