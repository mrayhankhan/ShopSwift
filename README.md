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

## Deployment:

This project is configured for deployment on GitHub Pages.

1.  Push changes to the `main` branch.
2.  The GitHub Actions workflow will automatically build and deploy the site to the `gh-pages` branch.
