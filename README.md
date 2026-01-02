# Bistro Admin

A Next.js-based admin dashboard for managing a restaurant/bistro application with menu items, orders, feedback, and analytics.

## Features

- 📊 **Dashboard Analytics** - Daily revenue tracking and top-selling items
- 🍽️ **Menu Management** - Add, edit, and manage menu items with categories
- 📝 **Feedback System** - View and manage customer feedback
- 🔐 **Authentication** - Secure sign-in with Clerk
- 💾 **PostgreSQL Database** - Robust data storage with Prisma ORM

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud-hosted like Supabase)
- Clerk account for authentication

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd bistro-admin
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (use `env.example` as reference):

```bash
# Database Connection
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### 3. Database Setup

**IMPORTANT:** This step fixes the "Database Tables Not Found" error.

```bash
# Generate Prisma Client
npm run postinstall

# Run database migrations
npm run db:migrate

# OR if database already exists, deploy migrations
npm run db:deploy
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Create and run new migrations (development)
- `npm run db:deploy` - Deploy migrations (production)
- `npm run db:reset` - Reset database (WARNING: deletes all data)
- `npm run db:studio` - Open Prisma Studio database GUI

## Database Schema

The application uses the following models:

- **Menu** - Restaurant menu items with pricing and categories
- **Order** - Customer orders with items and payment info
- **OrderItem** - Junction table for orders and menu items
- **Session** - User session data for the ordering system
- **Feedback** - Customer feedback and ratings

## Troubleshooting

### "Database Tables Not Found" Error

This error occurs when the database schema hasn't been applied. To fix:

```bash
# If you have an existing database with tables
npx prisma db pull
npx prisma generate

# If starting fresh
npm run db:migrate
```

### Migration Issues

If you see migration drift or conflicts:

```bash
# Pull current database schema
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Create a new baseline migration
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
npx prisma migrate resolve --applied 0_init
```

## Tech Stack

- **Framework:** Next.js 16.1 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Charts:** Recharts
- **Icons:** Lucide React

## Project Structure

```
bistro-admin/
├── app/                    # Next.js app directory
│   ├── actions/           # Server actions
│   ├── sign-in/          # Authentication pages
│   └── page.tsx          # Main dashboard
├── components/            # React components
│   ├── analytics/        # Analytics components
│   └── ui/              # UI components
├── lib/                  # Utility functions
│   ├── db.ts            # Prisma client
│   └── utils.ts         # Helper functions
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files
└── public/              # Static assets
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to set up your environment variables in the Vercel dashboard before deploying.
