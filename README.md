# ShopSwift

ShopSwift is a modern e-commerce platform built with Next.js, Tailwind CSS, and TypeScript. It features a dual-role system for Customers and Shop Owners, allowing for a seamless shopping and shop management experience.

## Features

### For Customers
-   **Browse Shops**: View products from multiple shops.
-   **Smart Cart**: Split orders by shop with individual delivery estimates.
-   **Location Services**: Auto-detect location or manually set address (default: IIITD Okhla Delhi).
-   **Order History**: View past orders and download professional PDF invoices.
-   **Profile Management**: Manage address and password.

### For Shop Owners
-   **Dashboard**: View detailed sales statistics and recent orders.
-   **Item Management**: Add, edit, and delete products with unit support (kg, L, etc.).
-   **Shop Settings**: Manage shop location and details.

## Tech Stack
-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS, Shadcn UI
-   **Language**: TypeScript
-   **PDF Generation**: jspdf, jspdf-autotable
-   **Icons**: Lucide React

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/mrayhankhan/ShopSwift.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Option 1: Vercel (Recommended)
This project uses Server Actions and requires a platform that supports SSR.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mrayhankhan/ShopSwift)

Or manually:
1.  Push to GitHub
2.  Go to [vercel.com](https://vercel.com)
3.  Import your repository
4.  Deploy (it auto-detects Next.js)

### Option 2: Other Platforms
-   **Netlify**: Supports Next.js with SSR
-   **Railway**: Supports Node.js apps
-   **Render**: Supports web services

**Note:** GitHub Pages is not supported because this app uses Server Actions which require a Node.js runtime.
