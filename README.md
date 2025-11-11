# Magnus Pharma — Next.js Inventory & Billing

This repository is a starter scaffold for the Magnus Pharma dashboard using Next.js 14 (App Router), TailwindCSS and NextAuth with MongoDB. It contains pages and API routes for user auth, inventory CRUD, basic dashboard UI, and utilities to clear user data.

Important: This is a scaffold with working routes and basic UI. Customize the components and styles to match your pixel-perfect screenshot. The structure is deploy-ready to Vercel.

Getting started

1. Copy `.env.example` to `.env.local` and fill values:

```
MONGODB_URI="your_mongo_connection_string"
NEXTAUTH_SECRET="a_long_random_value"
NEXTAUTH_URL="http://localhost:3000"
```

2. Install dependencies:

Windows PowerShell:

```powershell
npm install
npm run dev
```

3. Open http://localhost:3000

Deployment

Push to a GitHub repo and deploy to Vercel. Set the same environment variables in the Vercel dashboard.

Notes and next steps

- Tailwind is configured; tweak colors in `tailwind.config.js`.
- The app uses NextAuth with a MongoDB adapter; the signup API inserts a user with hashed password into MongoDB.
- Models and API routes include userId scoping — ensure your data collections use `userId`.
- For pixel-perfect reproduction: replace the UI components under `components/` with exact styles and icons from the screenshot.
