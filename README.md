# Fedoc

## Getting Started

First, create .env with db secret:
```
echo 'DATABASE_URL="file:./fedoc.db"' > .env
```

Create database
```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

