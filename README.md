# COSMALAC Premium Skincare — Enterprise Platform & CMS

An enterprise-grade, luxury digital showcase, wholesale trade pipeline, and standalone Control Center for **COSMALAC** (Established 2016).

---

## 🏛️ System Architecture

This repository is structured as a decoupled monorepo containing two completely independent React/Vite frontends and one Express REST API backend:

```text
                                monorepo/
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
   [ frontend/ ]               [ admin/ ]               [ backend/ ]
   Public Storefront         Admin Control Center         Node/Express API
   Port: 5173                Port: 5174                 Port: 5000
   URL: cosmalac.com         URL: admin.cosmalac.com    URL: api.cosmalac.com
   (Zero admin knowledge)    (One-way link to public)   (Multi-origin CORS)
```

### Key Security & Isolation Highlights
1. **One-Directional Relationship**: The Admin Control Center can reference the public site via `VITE_PUBLIC_STORE_URL`, but the public storefront contains **zero** admin routes, zero admin dependencies, and zero knowledge of the admin panel.
2. **Passwordless Email OTP Authentication**: 6-digit one-time passcodes with a 10-minute expiry window, 5-attempt rate-limiting, and automatic dispatch via **Resend** (or console logging in local mock mode).
3. **Multi-Origin CORS Protection**: Backend explicitly isolates and verifies requests originating from `http://localhost:5173`, `http://localhost:5174`, `cosmalac.com`, and `admin.cosmalac.com`.
4. **No-Index Admin Panel**: Built-in `<meta name="robots" content="noindex, nofollow" />` ensuring search engines cannot index the management gateway.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 2. Install All Dependencies
From the repository root:
```bash
npm run install-all
```
*(This automatically installs dependencies across `backend/`, `frontend/`, and `admin/`)*

### 3. Run Everything Together
```bash
npm run dev
```
This starts all 3 services concurrently:
- **Public Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Control Center**: [http://localhost:5174](http://localhost:5174)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

*(You can also run them in separate terminal tabs with `npm run dev:backend`, `npm run dev:frontend`, and `npm run dev:admin`)*

---

## 🔑 Development vs. Production Modes

| Feature | Local Development Mode (Default) | Production Cloud Mode |
| :--- | :--- | :--- |
| **Database** | Seamless fallback to `mock_db.json` when `MONGO_URI=mock` | MongoDB Atlas Cluster |
| **Email (OTP & Inquiries)** | Console logging (Winston terminal logs) | **Resend API** (`RESEND_API_KEY`) |
| **Image Storage** | Local `/uploads` directory | **Cloudinary CDN** |
| **Admin Authentication** | 6-digit code logged in backend terminal | 6-digit code delivered to admin inbox |

> [!TIP]
> In local development, when you enter `admin@cosmalac.com` in the admin login, look at your **backend terminal window** to copy the generated 6-digit passcode.

---

## 📋 Production Handover & Deployment Guide

Follow these sequential steps to connect your company's production cloud services and deploy:

### Step 1: Set Up MongoDB Atlas (Company Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free or dedicated cluster.
2. Under **Database Access**, create a user with read/write permissions (e.g. `cosmalac_admin`).
3. Under **Network Access**, add IP address `0.0.0.0/0` (allow all incoming cloud connections from Railway).
4. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```text
   mongodb+srv://cosmalac_admin:<PASSWORD>@cluster0.abcde.mongodb.net/cosmalac?retryWrites=true&w=majority
   ```

---

### Step 2: Set Up Resend (Company Email & OTP Service)
1. Sign up at [Resend](https://resend.com).
2. Go to **API Keys** → Create an API key with sending permissions.
3. Under **Domains**, add `cosmalac.com` and copy the DNS records (TXT, MX, DKIM) into your domain registrar (Namecheap, GoDaddy, Cloudflare).
4. Once verified, set your sender email to `security@cosmalac.com` or `admin@cosmalac.com`.

---

### Step 3: Set Up Cloudinary (Product & Media Storage)
1. Sign up at [Cloudinary](https://cloudinary.com).
2. From the Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**.

---

### Step 4: Deploy the Backend API (Railway)
1. Sign in to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo** → Select the `Cosmalac` repository.
3. In Project Settings, set the **Root Directory** to `backend`.
4. Add the following **Environment Variables** in Railway:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://cosmalac_admin:<PASSWORD>@cluster0.abcde.mongodb.net/cosmalac?retryWrites=true&w=majority
   FRONTEND_URL=https://cosmalac.com
   ADMIN_URL=https://admin.cosmalac.com
   JWT_SECRET=your_long_random_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_long_random_refresh_secret_key_here
   RESEND_API_KEY=re_123456789abcdef
   RESEND_FROM_EMAIL=Cosmalac Security <security@cosmalac.com>
   ADMIN_EMAIL=admin@cosmalac.com
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
5. Under Settings → **Custom Domains**, attach `api.cosmalac.com`.

---

### Step 5: Deploy the Public Website (Vercel Project #1)
1. Go to [Vercel](https://vercel.com) → Click **Add New Project** → Import `Cosmalac` repository.
2. Name the project: `cosmalac-public`.
3. Set **Root Directory**: `frontend`.
4. Framework Preset: `Vite`.
5. Add **Environment Variable**:
   ```env
   VITE_API_URL=https://api.cosmalac.com/api
   ```
6. Click **Deploy**.
7. In Project Settings → **Domains**, add `cosmalac.com` and `www.cosmalac.com`.

---

### Step 6: Deploy the Admin Control Center (Vercel Project #2)
1. In Vercel, click **Add New Project** → Import the **same** `Cosmalac` repository again.
2. Name the project: `cosmalac-admin`.
3. Set **Root Directory**: `admin`.
4. Framework Preset: `Vite`.
5. Add **Environment Variables**:
   ```env
   VITE_API_URL=https://api.cosmalac.com/api
   VITE_PUBLIC_STORE_URL=https://cosmalac.com
   ```
6. Click **Deploy**.
7. In Project Settings → **Domains**, add `admin.cosmalac.com`.

---

## 🌐 Production DNS Configuration Reference

Add these records to your domain provider (Cloudflare / Namecheap / GoDaddy):

| Type | Host / Name | Value / Target | Purpose |
| :--- | :--- | :--- | :--- |
| **A** or **CNAME** | `@` | `76.76.21.21` (or `cname.vercel-dns.com`) | Public Storefront (`cosmalac.com`) |
| **CNAME** | `www` | `cname.vercel-dns.com` | Public Storefront (`www.cosmalac.com`) |
| **CNAME** | `admin` | `cname.vercel-dns.com` | Standalone Admin (`admin.cosmalac.com`) |
| **CNAME** | `api` | `your-railway-subdomain.up.railway.app` | Backend API (`api.cosmalac.com`) |

---

## 📁 Repository Structure

```text
Cosmalac/
├── admin/                    # Standalone Admin Vite application (Port 5174)
│   ├── src/
│   │   ├── features/admin/   # Dashboard, CMS Content, Products, Media, Inquiries, Settings
│   │   ├── lib/              # Dedicated Axios & React Query instances
│   │   ├── styles/           # Luxury theme & glassmorphism tokens
│   │   ├── App.tsx           # Admin router (/login, /dashboard, /content, etc.)
│   │   └── main.tsx
│   ├── .env.local            # VITE_API_URL & VITE_PUBLIC_STORE_URL
│   ├── index.html            # noindex meta tags
│   └── vite.config.ts        # Port 5174 + API proxy
│
├── frontend/                 # Standalone Public Storefront (Port 5173)
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ScrollProgress, ProductCard
│   │   ├── features/         # Home, Products, ProductDetails, B2BTrade, Contact
│   │   ├── pages/            # About, FAQ, Privacy, Terms, NotFound
│   │   ├── App.tsx           # Pure customer routing (Zero admin code)
│   │   └── main.tsx
│   ├── .env.local            # VITE_API_URL
│   └── vite.config.ts        # Port 5173
│
├── backend/                  # Node.js / Express API server (Port 5000)
│   ├── src/
│   │   ├── controllers/      # authController (OTP + JWT), productController, cmsController
│   │   ├── services/         # emailService (Resend + Mock), dbService (Mongo + Mock fallback)
│   │   ├── middlewares/      # auth (JWT verification), rateLimiter, validate
│   │   ├── models/           # Mongoose schemas for Products, Inquiries, Settings, Users
│   │   └── server.ts
│   └── .env                  # Backend credentials & secrets (Never commit to git)
│
└── package.json              # Monorepo management & concurrent dev scripts
```

---

## 🛡️ Support & Maintenance
For technical inquiries or updates to brand assets, update settings via the live Control Center at `https://admin.cosmalac.com` or consult the API documentation at `https://api.cosmalac.com/api/docs`.
