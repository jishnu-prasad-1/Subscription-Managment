# 🛠️ SETUP, INSTALLATION & ENVIRONMENT GUIDE

---

## 1. System Requirements & Prerequisites

Brightloop is engineered for zero-friction local development and rapid cloud deployment:
- **Node.js**: Version `18.18.0` or higher (verified on Node `v24.19.0`).
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`.
- **Database Engine**:
  - **Local Development**: SQLite (zero external installation, instant setup).
  - **Production / Cloud**: PostgreSQL (Supabase, Neon, Railway, or AWS RDS).
- **Source Control**: Git.

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/jishnu-prasad-1/Subscription-Managment.git
cd Subscription-Managment
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to create your local `.env` file:
```bash
cp .env.example .env
```

#### Standard `.env` Configuration:
```env
# Application
NODE_ENV="development"
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Authentication Secrets
NEXTAUTH_SECRET="brightloop-super-secure-hackathon-secret-key-2026"
NEXTAUTH_URL="http://localhost:3000"

# Database Configuration (Defaults to SQLite for instant local hackathon runs)
DATABASE_URL="file:./dev.db"

# For PostgreSQL production, simply swap the connection string:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/brightloop?schema=public"

# Automated Billing CRON Secret
CRON_SECRET="brightloop_midnight_cron_secure_token_xyz"
```

---

## 3. Database Migration & High-Volume Seeding

Brightloop includes a high-fidelity database seed script that instantly populates the system with realistic SaaS data matching the Google Stitch screens:

### Step 4: Run Database Migrations
```bash
npx prisma db push
```

### Step 5: Execute High-Fidelity Seed Script
```bash
npx prisma db seed
```

#### What gets created by the seed script:
- **3 User Roles**:
  - **Super Admin**: `admin@brightloop.com` (Samira Jenkins)
  - **Staff Specialist**: `staff@brightloop.com` (Alex Morgan)
  - **Customer Portal**: `customer@acme.com` (David Vance, Acme Corp)
- **Standard Password**: `Brightloop@2026` (Satisfies all complexity rules).
- **8 Core Products & Add-ons**: Includes "BrightDesk ERP", "Odoo Brand Integration Edition" (+₹560 surcharge), "Analytics Booster", "Priority Support".
- **4 Billing Plans**: Daily Sandbox, Weekly Sprint, Monthly Business, Enterprise Annual.
- **Tax Rules**: GST 18%, VAT 5%, Zero-rated Export.
- **Discount Rules**: 15% Early Bird discount, Enterprise Volume rebate.
- **1,842 Seeded Subscriptions & Invoices**: Generates real MRR velocity ($148,250 MRR) to verify sub-2-second query benchmarks.

---

## 4. Running the Application

### Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Verification:
```bash
npm run build
npm run start
```

---

## 5. Pre-Configured Test Logins for Judges

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@brightloop.com` | `Brightloop@2026` | Full system control, tax & discount management, staff admin, global telemetry. |
| **Internal Staff** | `staff@brightloop.com` | `Brightloop@2026` | Customer CRM, quote builder, subscription lifecycle, invoice confirmation, payments. |
| **Subscriber Customer** | `customer@acme.com` | `Brightloop@2026` | Tenant-isolated self-service portal, view own active plans, download invoices. |

*Note: You can also use the **Workspace Switcher** in the top-left sidebar to toggle dynamically between viewports.*

