# Database Setup Instructions

## 1. Install PostgreSQL

### Option A: Local PostgreSQL
1. Download and install PostgreSQL from https://www.postgresql.org/download/
2. Create a database named `ascend_ai_secretary`
3. Note your username, password, and port (usually 5432)

### Option B: Docker PostgreSQL (Recommended)
```bash
# Run PostgreSQL in Docker
docker run --name ascend-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ascend_ai_secretary -p 5432:5432 -d postgres:15

# Check if running
docker ps
```

### Option C: Cloud Database (Neon, Supabase, etc.)
1. Sign up for a free PostgreSQL service
2. Copy the connection string

## 2. Environment Variables

The `.env` file has been created with placeholder values. Update it with your actual database credentials:

```env
# Database (replace with your actual PostgreSQL connection string)
DATABASE_URL="postgresql://username:password@localhost:5432/ascend_ai_secretary"

# NextAuth
NEXTAUTH_SECRET="development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Database Commands

Once PostgreSQL is running, run these commands:

```bash
# Generate Prisma client (already done)
npx prisma generate

# Create and run initial migration
npx prisma migrate dev --name init

# (Optional) View your database in Prisma Studio
npx prisma studio
```

## 3. Database Schema

The schema includes these models:
- **Organization** - Multi-tenant organizations
- **User** - Users belonging to organizations
- **Call** - Phone calls with transcripts and sentiment
- **Lead** - CRM leads with scoring and tracking
- **Message** - SMS and email messages

All models are properly isolated by `organizationId` for multi-tenant security.

## 4. Next Steps

After running the migration:
1. The database tables will be created
2. Prisma client will be generated
3. You can start using `db` from `src/lib/db.ts` in your API routes
