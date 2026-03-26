# Contributing to Ebazaar

Welcome! We're excited that you're interested in contributing to Ebazaar. This document provides comprehensive guidelines for contributing to our project.

Please take a moment to read this guide carefully. Following these guidelines helps us maintain code quality and ensures a smooth collaboration process.

---

## 📋 Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Repository Rules](#repository-rules)
- [Contribution Workflow](#contribution-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Code Style \& Best Practices](#code-style--best-practices)
- [Reporting Issues](#reporting-issues)
- [Suggestions \& Discussions](#suggestions--discussions)
- [Acknowledgment](#acknowledgment)

---

## 👋 Introduction

Ebazaar is a modern e-commerce platform built with Next.js 16. We welcome contributions from developers of all skill levels. Whether you're fixing a bug, adding a new feature, or improving documentation, your help is appreciated!

### What You Can Contribute

- 🐛 Bug fixes
- ✨ New features
- 📖 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Git** installed on your local machine
- **Node.js** 18.x or later
- **npm** 9.x or later
- A **GitHub account**

### Setting Up Your Development Environment

```bash
# 1. Fork the repository
# Click the "Fork" button on https://github.com/arya-dev2005/ebazaar

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/ebazaar.git
cd ebazaar

# 3. Add upstream remote
git remote add upstream https://github.com/arya-dev2005/ebazaar.git

# 4. Install dependencies
npm install

# 5. Copy environment template
cp .env.example .env

# 6. Setup database
npm run db:push

# 7. Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🔒 Repository Rules

We have established branch protection rules to maintain code quality and ensure proper review processes. All contributors must follow these rules:

| Rule | Description |
|------|-------------|
| **Restrict Deletions** | Protected branches cannot be deleted |
| **Require Pull Request** | All changes must go through PR (minimum 1 approval required) |
| **Dismiss Stale Approvals** | Previous approvals are dismissed when new commits are pushed |
| **Require Status Checks** | All CI/CD checks must pass before merging |
| **Require Up-to-Date** | Branches must be rebased/merged with target branch before merging |
| **Block Force Pushes** | Force pushes are disabled on all branches |

### Important Notes

- ⚠️ **Never push directly to `main`** - All changes must be submitted via pull request
- 🔄 **Keep your branch updated** - Rebase on the latest `main` before creating a PR
- ✅ **Wait for approvals** - Your PR needs at least 1 reviewer approval
- 🟢 **Pass all checks** - Ensure all CI tests and status checks pass

---

## 🔄 Contribution Workflow

Follow these steps to contribute effectively:

### 1. Sync Your Fork

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or
git checkout -b docs/improvement
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Make Your Changes

- Write clean, maintainable code
- Follow the code style guidelines
- Add tests for new functionality
- Update documentation if needed

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new feature description"
```

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Restructuring
- `test` - Testing
- `chore` - Maintenance

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Navigate to the original repository
2. Click "New Pull Request"
3. Select your branch and fill in the template
4. Request review from a maintainer
5. Address any feedback promptly

### PR Title Format

Use the same conventional commit format:
```
feat(cart): add promo code support
fix(admin): resolve product deletion issue
docs: update API documentation
```

---

## 🧪 Testing Guidelines

All contributions should include appropriate tests. We use:

- **Vitest** for unit tests
- **Playwright** for end-to-end tests

### Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run end-to-end tests
npm run test:e2e

# Run with coverage
npm run test -- --coverage
```

### Writing Tests

```typescript
// Example unit test
describe('Cart Service', () => {
  it('should add item to cart', async () => {
    const cart = await addToCart(userId, productId, 1);
    expect(cart.items).toHaveLength(1);
  });
});
```

```typescript
// Example e2e test
test('user can checkout', async ({ page }) => {
  await page.goto('/cart');
  await page.click('button[name="checkout"]');
  await page.waitForURL('/checkout/success');
});
```

### Test Coverage Requirements

- Minimum 80% code coverage for new features
- All critical paths must be tested
- Include edge case tests

---

## 💻 Code Style & Best Practices

### TypeScript

- ✅ Use explicit types instead of `any`
- ✅ Prefer interfaces over types for object shapes
- ✅ Use meaningful variable and function names
- ✅ Add JSDoc comments for complex functions

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

async function getUserById(id: string): Promise<User | null> {
  return await prisma.user.findUnique({ where: { id } });
}

// ❌ Avoid
function getUser(id: any): any {
  // ...
}
```

### React/Next.js

- ✅ Use functional components with hooks
- ✅ Keep components small and focused
- ✅ Use proper TypeScript prop types
- ✅ Follow Next.js App Router conventions
- ✅ Use Server Components where possible

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <Button onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </Button>
    </div>
  );
}
```

### CSS/Styling

- ✅ Use Tailwind CSS utility classes
- ✅ Follow mobile-first responsive design
- ✅ Use design system tokens
- ✅ Keep styles consistent with existing components

### General Best Practices

- 🔧 Keep functions small and focused (single responsibility)
- 📝 Write meaningful commit messages
- 📚 Document complex logic with comments
- 🔒 Handle errors gracefully
- ⚡ Optimize for performance where needed

---

## 🐛 Reporting Issues

Found a bug? We want to know about it! Please follow these guidelines:

### Before Reporting

1. Search existing issues to avoid duplicates
2. Check if the issue is already fixed in the latest version
3. Verify the bug exists in the main branch

### How to Report

Use GitHub Issues with this template:

```markdown
## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened instead.

## Environment
- OS: [e.g., macOS 14.0]
- Node: [e.g., v18.17.0]
- Browser: [e.g., Chrome 115]

## Screenshots
If applicable, add screenshots to help explain the problem.

## Additional Context
Any other context about the problem.
```

---

## 💡 Suggestions & Discussions

Have an idea for a new feature or want to discuss something?

### Feature Requests

1. **Check existing discussions** - Maybe someone already proposed it
2. **Use the issue tracker** - Create a feature request issue
3. **Provide context** - Explain why this feature would be useful
4. **Include examples** - Mockups or examples help visualize the idea

### Discussion Guidelines

- Be respectful and constructive
- Stay on topic
- Provide feedback with reasoning
- Help newcomers get oriented

---

## 🎉 Acknowledgment

Thank you for contributing to Ebazaar! Every contribution, no matter how small, helps make this project better.

### Contributors

All contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

### Recognition

We appreciate your time and effort. Contributors who make significant contributions may be invited to become maintainers.

- Open an issue for general questions
- Email: aryadas.dev@gmail.com

---

Thank you for contributing to Ebazaar! 🎉
