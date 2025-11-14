# Jobify – Job Application Tracking System

Jobify is a robust, full-stack Next.js application for tracking your job search and managing job applications. Built with Next.js 14, TypeScript, Prisma, Clerk authentication, Shadcn/UI, and Recharts, Jobify provides an interactive and secure dashboard to streamline the job application process.

---

## Table of Contents

| Section         | Link |
|-----------------|------|
| Features        | [Features](#features) |
| Getting Started | [Getting Started](#getting-started) |
| Database Setup  | [Database Setup](#database-setup) |
| Authentication  | [Authentication](#authentication) |
| UI & Layouts    | [UI--Layouts](#ui--layouts) |
| Core Components | [Core-Components](#core-components) |
| Advanced Features | [Advanced-Features](#advanced-features) |
| Scripts         | [Scripts](#scripts) |
| Useful References | [Useful-References](#useful-references) |
| Screenshots     | [Screenshots](#screenshots) |
| License         | [License](#license) |
| Credits         | [Credits](#credits) |


---

## Features

- 🚀 **Modern Next.js 14 App** with the `app/` directory structure
- 🟦 **TypeScript** & code linting for robustness and maintainability
- 🔒 **Authentication** powered by Clerk (auth, user profile, protected dashboard, public landing)
- 🗃️ **Persistent Database** using **Prisma ORM** and PostgreSQL
- 📊 **Dashboard** with job charts, statistics, monthly application graphs (Recharts)
- 💡 **Responsive UI**: Beautiful layouts with **Tailwind CSS** and [shadcn/ui](https://ui.shadcn.com/)
- ☀️ **Dark/Light Theme** toggle (persisted via next-themes)
- ⚙️ **React Query** for performant data fetching and mutations
- 🍞 **Toasts & Feedback** for user actions
- 🗂️ **Pagination, Search & Filtering** for jobs
- ✍️ **CRUD operations** on jobs (add, edit, delete)
- 🔗 **Sidebar, Navbar, Mobile Dropdown Nav** components, Favicon, custom Logo (Figma provided)

---

## Getting Started

### 1. Create a Next.js Project

```sh
npx create-next-app@14 jobify
# Choose: TypeScript and ESLint
```

### 2. Setup Dependencies

Install main libraries:

```sh
npm install @clerk/nextjs@^4.27.7 @prisma/client@^5.7.0 \
@tanstack/react-query@^5.14.0 @tanstack/react-query-devtools@^5.14.0 \
dayjs@^1.11.10 next-themes@^0.2.1 recharts@^2.10.3
npm install prisma@^5.7.0 -D
```

Add UI components via [shadcn/ui](https://ui.shadcn.com/):

```sh
npx shadcn@latest init
npx shadcn@latest add button dropdown-menu form input select card badge separator skeleton toast
```

---

## Database Setup

1. Run Prisma init & setup your database connection:

```sh
npx prisma init
```

2. Configure `.env` with your PostgreSQL connection string.

3. Define the Job model in `prisma/schema.prisma`:

```prisma
model Job {
  id        String   @id @default(uuid())
  clerkId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  position  String
  company   String
  location  String
  status    String
  mode      String
}
```

4. Push DB schema:

```sh
npx prisma db push
```

---

## Authentication

- [Clerk](https://clerk.com/) is used for authentication and user management.
- Only the landing page `/` is public; all dashboard pages require login.
- Wrap the app with `ClerkProvider` and configure `middleware.ts`:

```tsx
import { authMiddleware } from '@clerk/nextjs'
export default authMiddleware({
  publicRoutes: ['/'],
})
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

---

## UI & Layouts

- App structure follows Next.js conventions with dynamic routing.
- Layout and components are powered by Tailwind CSS and **shadcn/ui**.
- Dark/light theme toggle via `next-themes`.

---

## Core Components

- **CreateJobForm / EditJobForm**: Add & edit job entries with form validation (`zod`, `react-hook-form`)
- **JobsList / JobCard**: View paginated jobs, edit & delete actions, search/filter/pagination
- **StatsContainer & ChartsContainer**: Visualize application statistics (monthly bar chart & status cards)
- **Loading/Skeleton states** for smooth UX
- **Sidebar, Navbar, LinksDropdown**: Navigation for dashboard and mobile devices

---

## Advanced Features

- **Server Actions**: All CRUD operations are secure, type-safe, and leverage Prisma + Clerk user authentication
- **React Query**: Data fetching, mutations, cache invalidation, and devtools
- **Recharts**: Application growth visualized over past 6 months
- **Toast Notifications**: Feedback for all user actions

---

## Scripts

- **Seed database** with realistic mock data using [Mockaroo](https://www.mockaroo.com/):

```js
// prisma/seed.js -- basic example
const { PrismaClient } = require('@prisma/client')
const data = require('./mock-data.json')
const prisma = new PrismaClient()
// ...seed logic here...
```
```sh
node prisma/seed
```

---

## Useful References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Clerk Docs](https://clerk.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/en-US)

---

## Screenshots

Below are some screenshots to showcase Jobify in action:

| Page              | Screenshot                                       |
|-------------------|--------------------------------------------------|
| Landing/Home Page | ![Homepage Screenshot](assets/homepage.png)      |
| Dashboard         | ![Dashboard Screenshot](assets/dashboard.png)    |
| Stats & Charts    | ![Stats Screenshot](assets/stats.png)            |

> *To add your own screenshots, place image files in the `assets` directory and link them here using the Markdown image syntax:*  
> `![Description](assets/your-image-file.png)`

---

## License

This project is licensed under the MIT License.

---

## Credits

Designed and developed for educational use and rapid prototyping by [Your Name](https://github.com/yourusername). Feel free to fork and use in your own projects!
