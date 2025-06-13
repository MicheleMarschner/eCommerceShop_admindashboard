# E-Commerce - Admin Dashboard  
**Password-protected product management dashboard with secure media uploads.**  

An internal admin interface to manage product listings for the e-commerce store. Enables authorized staff to create, update, and delete products with integrated image storage and Google SSO login.

[![Live Site](https://img.shields.io/badge/live-e--commerce--shop--admin--dashboard.vercel.app-blue)](https://e-commerce-shop-admin-dashboard.vercel.app)

## Features
- CRUD operations for managing product inventory  
- Login via Google SSO using NextAuth for secure admin access  
- Upload and manage product images via AWS S3  
- Optimized for mobile and desktop use

## Technical Features
- MongoDB and Mongoose for structured product data  
- AWS S3 for media file storage and linking via product schema  
- Protected routes using NextAuth with Google provider  
- Clean, mobile-first UI built with Tailwind CSS

## Tech Stack & Tools
- Next.js / React  
- Tailwind CSS  
- MongoDB / Mongoose  
- AWS S3 (for product image storage)  
- NextAuth (with Google OAuth)
- Faker.js (for mock data generation)

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/MicheleMarschner/eCommerceShop_admindashboard.git
cd eCommerceShop_admindashboard
```

### 2. Install dependencies
```npm install```

### 3. Add environment variables in a .env.local file

### 4. Run the development server
```npm run dev```

### 5. Visit http://localhost:3000
