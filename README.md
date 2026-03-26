# 🛒 Ebazaar - Modern E-Commerce Platform

A full-featured e-commerce platform built with Next.js 16, featuring a modern shopping experience with cart management, user authentication, order processing, and an admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## ✨ Features

### Customer Features
- 🔐 **User Authentication** - Secure sign-up/sign-in with NextAuth.js
- 🛍️ **Product Catalog** - Browse products by category with search and filtering
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities, apply promo codes
- 💳 **Checkout** - Stripe-powered payment integration
- 📦 **Order Tracking** - View order history and status
- ⭐ **Product Reviews** - Rate and review products

### Admin Features
- 📊 **Dashboard** - Overview of sales and key metrics
- 🏪 **Product Management** - Create, edit, delete products
- 📁 **Category Management** - Organize products into categories
- 📋 **Order Management** - View and update order status
- 👥 **User Management** - View and manage user accounts

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | SQLite with Prisma ORM |
| **Authentication** | NextAuth.js v5 |
| **State Management** | Zustand |
| **Styling** | Tailwind CSS v4 |
| **Payments** | Stripe |
| **Testing** | Vitest (unit) + Playwright (e2e) |
| **Error Tracking** | Sentry |

## 📌 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or later
- **npm** 9.x or later (or yarn/pnpm/bun)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/arya-dev2005/ebazaar.git
cd ebazaar
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"

# Stripe (get keys from https://dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Sentry (optional, get from https://sentry.io)
SENTRY_DSN=""
```

### 4. Initialize the Database

```bash
# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create an Admin User

After starting the server:
1. Sign up a new account
2. Access your database (e.g., via `npm run db:studio`)
3. Manually update the user's `role` field to `"ADMIN"`

## 📁 Project Structure

```
ebazaar/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── actions/           # Server actions
│   │   ├── admin.ts
│   │   ├── auth.ts
│   │   ├── cart.ts
│   │   ├── category.ts
│   │   ├── order.ts
│   │   └── product.ts
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth routes (sign-in, sign-up)
│   │   ├── (shop)/        # Shop routes (products)
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API routes
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # Checkout flow
│   │   └── orders/        # Order history
│   ├── components/        # React components
│   │   ├── cart/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── products/
│   │   └── ui/
│   ├── lib/               # Utilities and configs
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── sentry.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   ├── services/          # Business logic
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   ├── product.ts
│   │   ├── review.ts
│   │   └── user.ts
│   └── types/             # TypeScript types
├── e2e/                   # Playwright tests
├── tests/                 # Unit tests
└── public/                # Static assets
```

## 🗄 Database Schema

The application uses the following main models:

- **User** - Customer and admin accounts
- **Product** - Products with name, price, stock, images
- **Category** - Product categories
- **Cart & CartItem** - Shopping cart functionality
- **Order & OrderItem** - Order processing
- **Review** - Product reviews and ratings

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

Click the "Fork" button on GitHub.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ebazaar.git
cd ebazaar
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Make Changes

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features

### 5. Commit Your Changes

```bash
git add .
git commit -m "feat: Add new feature"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch and submit
4. Fill in the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots (for UI changes)

### Code Style Guidelines

- Use **TypeScript** for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Commit Message Format

We follow [Conventional Commits](https://conventionalcommits.org):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Testing
- `chore` - Maintenance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

If you have questions or need help:

- 📧 **Email**: arya.dev2005@gmail.com
- 💬 **GitHub Issues**: Report bugs and request features
- 🐦 **Twitter**: @arya_dev2005

---

<div align="center">

Made with ❤️ by [Arya](https://github.com/arya-dev2005)

</div>
