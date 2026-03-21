# Ebazaar Deployment Runbook

## Prerequisites
- Node.js 20+
- npm or yarn
- PostgreSQL database (production)
- Stripe account
- Sentry account (optional)

## Environment Variables

### Required
```
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional
```
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
STRIPE_CURRENCY=usd
```

## Deployment Steps

### 1. Local Development
```bash
npm install
cp .env.example .env
# Edit .env with your values
npm run db:push
npm run db:seed
npm run dev
```

### 2. Production Build
```bash
npm run build
```

### 3. Run Tests
```bash
npm run lint
npm run test
npm run test:e2e
```

### 4. Deploy to Vercel
```bash
vercel --prod
```

### 5. Setup Stripe Webhook
```bash
stripe listen --forward-to https://your-domain.com/api/webhooks/stripe
```

## Troubleshooting

### Database Issues
- Run `npm run db:push` to sync schema
- Run `npm run db:seed` to populate test data

### Authentication Issues
- Verify AUTH_SECRET is set
- Check NEXT_PUBLIC_APP_URL matches your domain

### Payment Issues
- Verify Stripe keys are correct
- Check webhook is configured
- Review Stripe dashboard for error logs
