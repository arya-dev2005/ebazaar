# Contributing to Ebazaar

Thank you for your interest in contributing to Ebazaar! This document provides guidelines for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by the following principles:
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what is best for the community

## How Can I Contribute?

### 🐛 Reporting Bugs

Before reporting a bug:
1. Check if the issue already exists
2. Use a clear and descriptive title
3. Explain the problem with steps to reproduce
4. Include relevant information (OS, Node version, etc.)

### 💡 Suggesting Features

1. Check existing issues and discussions
2. Describe the feature clearly
3. Explain why this feature would be useful
4. Provide examples or mockups if possible

### 🔧 Pull Requests

#### Process for Submitting Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/arya-dev2005/ebazaar.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**
   - Follow the code style
   - Write tests for new features
   - Keep commits atomic and focused

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Fill out the PR template
   - Link related issues
   - Request review from maintainers

#### PR Title Format

We follow [Conventional Commits](https://conventionalcommits.org):
```
<type>(<scope>): <description>
```

Examples:
- `feat(cart): add promo code support`
- `fix(admin): resolve product deletion issue`
- `docs: update README with new setup steps`

#### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting
- `refactor` - Code restructuring
- `test` - Adding/updating tests
- `chore` - Maintenance

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Setup Development Environment

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Setup database
npm run db:push

# Start dev server
npm run dev
```

### Running Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Linting
npm run lint
```

## Coding Standards

### TypeScript
- Use explicit types over `any`
- Prefer interfaces over types for object shapes
- Use meaningful variable names

### React/Next.js
- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing

### CSS/Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use design tokens from the design system

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update this CONTRIBUTING.md for process changes

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes
- Project documentation

## Questions?

- Open an issue for general questions
- Email: aryadas.dev@gmail.com

---

Thank you for contributing to Ebazaar! 🎉
