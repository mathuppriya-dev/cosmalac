# COSMALAC Premium Skincare B2B + B2C Platform

An enterprise-grade, high-end digital showcase and trade platform for **COSMALAC** (Established 2016). Built using a MERN stack utilizing React (Vite) + Express + MongoDB Atlas + Mongoose, styled with **Tailwind CSS v4** matching a pink-based premium luxury palette, and animated with Framer Motion.

---

## Architecture & Features

### 🌐 Public Website
* **Home**: Hero parallax section, trust row highlights, brand legacy, featured range, doctor endorsements, newsletter form, and accordion FAQs.
* **Products Catalog**: Multi-category filter grid (Creams, Serums, Cleansers, Toners), sorting drop-down, and live typing search query.
* **Product Details**: Multi-molecular ingredients glossary, instructions, storage and packaging specifications, and a dynamic "Inquire About Formulation" CTA.
* **About Company**: Founded in 2016. Mission, vision, core values, founders' commitment, and chronological journey timeline.
* **Quality & R&D**: Sterilization cleanrooms, HPLC chromatography source checking, safety patch testing, and GMP/ISO certifications.
* **Science Blog**: Rich HTML publications detailing ingredient chemistry and dermatologist routine guidelines.
* **Contact Portal**: Basic contact lines, vector map placeholder, and dual forms mapping consumer questions and wholesale B2B distributor applications.

### 👨💼 Admin CMS Dashboard
* **Secure Gateway**: Authorized JWT authentication with access/refresh token rotation.
* **Dashboard Stats**: Summary of products, inquiries, B2B leads, blog counters, and a line chart of daily inquiry inflow logs.
* **Product Manager**: Full CRUD manager for formulations, ingredients, and categories.
* **Inquiry Manager**: Review leads, mark progress statuses, and save private follow-up trade notes.
* **Blog Editor**: Publish or edit HTML blog posts.
* **Site Config Manager**: Edit site emails, phones, address, and social link handles.

---

## Tech Stack & Core Enhancements
* **Frontend**: React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion.
* **Data Fetching**: TanStack Query (React Query) for caching and background sync, coupled with Axios Interceptors for token rotation.
* **Backend**: Node.js + Express + TypeScript API server.
* **Security & Audits**: Helmet headers, Express rate limits, JWT access tokens (15m) + HttpOnly cookies refresh tokens (7d), password hashing using `bcryptjs`, and Zod validators.
* **Storage**: Integrated Cloudinary uploads with local development filesystem fallbacks.
* **Database**: MongoDB Atlas or local MongoDB using Mongoose, with a transparent local JSON file fallback (`mock_db.json`) if MongoDB is offline.
* **Logger**: Winston logging error and activity logs to standard files.
* **API Docs**: OpenAPI JSDoc served interactively via Swagger UI under `/api/docs`.

---

## Quick Start Setup

### 1. Sourcing Mockup Images
We have generated premium studio skincare mockups (Glow Cream Jar, Dropper Serum, Lab formulation). Copy these assets into the frontend public directory by running the helper script:
```bash
python copy_assets.py
```

### 2. Environment Configurations
Create a `.env` file under the `/backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/cosmalac   # Set to 'mock' to use local mock_db.json instead
JWT_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
EMAIL_PROVIDER=mock                            # SMTP/SendGrid options available
```

### 3. Installation & Run
From the root workspace directory, run:
```bash
# Install dependencies for both frontend and backend
npm run install-all

# Seed database with products and default admin accounts
npm run seed --prefix backend

# Start development servers (frontend on http://localhost:5173, backend on 5000)
npm run dev
```

### 4. Default Seeded Admin Credentials
Seeded admin credentials can be customized in the seeder script at `backend/src/scripts/seed.ts` before seeding:
* **Super Admin**: `your_custom_email@example.com` / `your_custom_password`
* **Editor**: `editor@cosmalac.com` / `CosmalacEditor2026!`
* **Viewer**: `viewer@cosmalac.com` / `CosmalacViewer2026!`

### 5. Accessing Swagger API Documentation
Open your browser and navigate to:
```text
http://localhost:5000/api/docs
```

---

## Production Deployment using Docker
You can spin up the MongoDB database, Express API server, and Nginx frontend in containerized environments:
```bash
docker-compose up --build
```
The application will run on port `80` (Frontend) and `5000` (Backend).
