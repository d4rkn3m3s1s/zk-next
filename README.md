# Zk İletişim - Next.js Migration

Professional web application for Zk İletişim, a phone repair and accessory shop in Kadıköy. This project has been migrated from a legacy Express/EJS app to a modern Next.js 14 application.

## Features

### Public Facing
-   **Home Page**: Featured products and latest blog posts.
-   **Shop**: Product listing with filtering (Brand, Price, Category) and sorting.
-   **Product Details**: Dynamic product pages with images and stock status.
-   **Blog**: Tech news and guides with search functionality.
-   **Services**: Appointment booking for repairs and support.
-   **Repair Tracking**: Real-time status tracking for customer devices.
-   **Contact**: Integrated contact form.
-   **Chatbot**: AI-powered customer support assistant.

### Admin Dashboard
-   **Secure Authentication**: Protected admin routes.
-   **Product Management**: CRUD operations for products.
-   **Order Management**: View and update order status.
-   **Appointment Management**: Manage service appointments.
-   **Repair Tracking**: Update repair status for customers.
-   **Blog Management**: Write and publish blog posts.
-   **User Management**: Manage system users.
-   **Message Center**: View and respond to contact form messages.

## Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: [SQLite](https://www.sqlite.org/) (via [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3))
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Database Setup**

    The project uses SQLite. The database file is located at `prisma/dev.db`.
    To reset or update the database schema:

    ```bash
    npx prisma migrate dev
    # or
    npx prisma db push
    ```

    To seed the database (optional):
    ```bash
    npx prisma db seed
    ```

3.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser.

4.  **Admin Access**

    Navigate to `/admin` to access the dashboard.
    (Default admin credentials should be configured in seed script or database)

## Deployment

This application is ready to be deployed on [Vercel](https://vercel.com).

Note: Since this uses SQLite, for a serverless environment like Vercel, you might need to switch to a cloud database like PostgreSQL (Supabase, Neon) or use a volume if deploying to a VPS/Container.

## License

[MIT](LICENSE)
