# 📋 COMPREHENSIVE SYSTEM REQUIREMENTS SPECIFICATION

---

## 1. Functional Requirements (FR)

### Module 1: Authentication & Account Security (FR-AUTH)
- **FR-AUTH-01 (Unique Identity)**: Users must register with a unique email address. Duplicate email registrations must be rejected with clear user feedback.
- **FR-AUTH-02 (Password Complexity Enforcement)**: Passwords must strictly enforce:
  - Minimum length $> 8$ characters.
  - At least one uppercase alphabetical character (`[A-Z]`).
  - At least one lowercase alphabetical character (`[a-z]`).
  - At least one special character (`[!@#$%^&*(),.?":{}|<>]`).
- **FR-AUTH-03 (Password Security)**: Passwords must be hashed using `bcrypt` (work factor $\ge 10$) before persistence. Plaintext passwords must never be logged or stored.
- **FR-AUTH-04 (Password Reset Workflow)**: Users can request a password reset. A secure, time-limited token (1-hour expiration) must be generated. In development or test environments, reset links must be displayed via development console or simulated email dispatch without false claims of SMTP delivery.
- **FR-AUTH-05 (Session & Token Management)**: Authenticated sessions must use secure, HTTP-only session cookies or signed JWTs (`jose`) with automatic expiration and renewal.

---

### Module 2: User Roles & Access Control (FR-RBAC)
- **FR-RBAC-01 (Role Segregation)**: System must recognize three immutable roles:
  1. `ADMIN`: Master control over products, plans, taxes, discounts, staff accounts, system configuration, and financial reports.
  2. `STAFF`: Daily operations access: customer onboarding, quotation authoring, subscription updates, invoice review, and payment recording. Cannot alter system tax rules or manage staff accounts.
  3. `CUSTOMER`: Strictly scoped portal access: views only their own profile, active subscriptions, next billing dates, invoice history, and payment receipts.
- **FR-RBAC-02 (Server-Side Authorization)**: Role access must be verified on every backend API route and Server Action. UI hiding alone is explicitly prohibited as an authorization mechanism.

---

### Module 3: Product & Variant Catalog (FR-PROD)
- **FR-PROD-01 (Product Attributes)**: Products must capture:
  - Product Name (string, required).
  - Product Type (`Software`, `Add-on`, `Service`, `Physical/Hardware`).
  - Sales Price (numeric, required).
  - Cost Price (numeric, required for margin calculation).
  - Notes / Internal Description (text).
- **FR-PROD-02 (Variant System)**: Products can define multiple variants with attribute keys (e.g., `Brand`, `Support Level`, `Tier`) and attribute values.
- **FR-PROD-03 (Variant Price Surcharges)**: Selecting a variant can add an incremental charge to the base sales price (e.g., Selecting "Odoo Brand" adds $+₹560$ to the unit price).
- **FR-PROD-04 (Product Lifecycle)**: Products can be created, updated, and soft-deactivated (preserving referential integrity for active contracts).

---

### Module 4: Plan Management Engine (FR-PLAN)
- **FR-PLAN-01 (Billing Intervals)**: Plans must support four discrete recurrence cycles:
  - `Daily` (bills every 24 hours).
  - `Weekly` (bills every 7 calendar days).
  - `Monthly` (bills every 30 days or calendar month).
  - `Yearly` (bills annually).
- **FR-PLAN-02 (Plan Boundaries)**: Plans must configure:
  - Minimum Subscription Quantity (e.g., min 5 seats).
  - Available Start Date and Expiry Date.
- **FR-PLAN-03 (Plan Closure & Pause Rules)**: Admin can designate on a per-plan basis:
  - `auto_close`: Automatically transitions subscription to `Closed` upon expiry date.
  - `allow_early_closure`: Allows customer/staff to terminate prior to contract term.
  - `allow_pause`: Allows temporary halting of recurring invoice generation.
  - `allow_renewal`: Allows automatic or manual contract extension.

---

### Module 5: Customer Management (FR-CUST)
- **FR-CUST-01 (Customer Profile)**: Captures Company Name, Contact Name, Email, Phone Number, Billing Address, Tax Identification Number (GSTIN/VAT), and Default Payment Terms.
- **FR-CUST-02 (360-Degree Customer View)**: Customer detail view links directly to their comprehensive historical timeline:
  - Active & Past Subscriptions.
  - Invoices (Draft, Confirmed, Paid, Overdue).
  - Payments Collected & Ledger Balance.
- **FR-CUST-03 (Search & Filtering)**: Instant search by company name, contact, email, or account status.

---

### Module 6: Quotation System (FR-QUOTE)
- **FR-QUOTE-01 (Quotation Templates)**: Staff can create and reuse standard quotation templates with pre-configured plan and product line items.
- **FR-QUOTE-02 (Quotation Generation)**: Staff can generate a customized quote for a customer specifying validity period (e.g., valid for 15, 30, or 60 days).
- **FR-QUOTE-03 (Line Items & Calculations)**: Each quote captures Product, Selected Variant, Plan, Quantity, Base Unit Price, Variant Surcharge, Effective Unit Price, Applied Tax, and Total.
- **FR-QUOTE-04 (1-Click Conversion)**: An accepted quotation converts instantly into a `Confirmed` Subscription without manual data re-entry.

---

### Module 7: Subscription Lifecycle Engine (FR-SUBS)
- **FR-SUBS-01 (Unique Identifier)**: Every subscription receives an auto-generated unique identifier (e.g., `SUB-2026-0001`).
- **FR-SUBS-02 (Deterministic 5-Stage State Machine)**:
  $$\text{Draft} \longrightarrow \text{Quotation} \longrightarrow \text{Confirmed} \longrightarrow \text{Active} \longrightarrow \text{Closed}$$
- **FR-SUBS-03 (Operational State Transitions)**:
  - `Pause`: Halts recurring billing; sets state to `Paused`.
  - `Resume`: Reactivates billing cadence; recalculates next billing date.
  - `Renew`: Extends expiry date and increments contract term.
  - `Early Close`: Allows closing active contracts subject to plan rules.
- **FR-SUBS-04 (Subscription Line Items)**: Retains product snapshot, quantities, negotiated unit prices, tax rates, and billing schedule.

---

### Module 8: Automated Recurring Invoicing (FR-INV)
- **FR-INV-01 (Automatic Invoice Generation)**: A background billing engine evaluates all `Active` subscriptions whose `next_billing_date` $\le \text{Current Date}$ and automatically generates Draft invoices.
- **FR-INV-02 (Zero Double-Billing Idempotency)**: A unique composite constraint and idempotency hash:
  $$\text{Idempotency Key} = \text{SHA256}(\text{subscription\_id} + \text{period\_start} + \text{period\_end})$$
  guarantees that a subscription cannot generate more than one invoice for any billing interval.
- **FR-INV-03 (Invoice Lifecycle)**:
  $$\text{Draft} \longrightarrow \text{Confirmed} \longrightarrow \text{Paid}$$
  with cancellation support (`Cancelled`).
- **FR-INV-04 (Invoice Operations)**: Invoices can be confirmed, printed (printable browser view / PDF styling), sent via notification, and downloaded.

---

### Module 9: Tax Management Engine (FR-TAX)
- **FR-TAX-01 (Configurable Rules)**: Admins define tax rules with Name (e.g., `GST 18%`, `VAT 5%`, `Sales Tax 8.25%`), Rate Percentage, and Active status.
- **FR-TAX-02 (Consistent Application)**: Applied deterministically across Quotation lines, Subscription recurring totals, and Invoice line items.

---

### Module 10: Dynamic Discount Engine (FR-DISC)
- **FR-DISC-01 (Admin-Only Management)**: Only Admins can create and edit discount rules.
- **FR-DISC-02 (Rule Parameters)**:
  - Discount Type: `Percentage` (e.g., $15\%$) or `Fixed Amount` (e.g., $\$50$).
  - Eligibility Constraints: Minimum Purchase Amount and/or Minimum Quantity of seats.
  - Scope: Specific Product SKU or Subscription-wide total.
  - Validity: Effective Start Date and Expiry Date.
  - Usage Limits: Maximum total usage limit and active usage counter.
- **FR-DISC-03 (Automated Application & Retirement)**: Eligible discounts apply automatically to the next invoice without manual intervention, and automatically deactivate when expired or when the usage limit is reached.

---

### Module 11: Payment Tracking & Reconciliation (FR-PAY)
- **FR-PAY-01 (Payment Recording)**: Staff records payment transactions with:
  - Unique Payment ID.
  - Associated Invoice ID.
  - Customer ID.
  - Payment Method (`Credit Card`, `Bank Transfer`, `UPI / Digital Wallet`, `Cash`, `Cheque`).
  - Amount Paid.
  - Payment Date and Reference Notes (e.g., Transaction Ref #).
- **FR-PAY-02 (Balance Calculation)**: Maintains accurate `paid_amount` and `balance_due` on invoices. Partial payments reduce balance; when `balance_due` $= 0$, invoice auto-transitions to `Paid`.
- **FR-PAY-03 (Overdue Chase Workflow)**: Invoices past their `due_date` with an outstanding balance are flagged as `Overdue` for immediate recovery action.

---

### Module 12: Financial Analytics & Reporting (FR-REP)
- **FR-REP-01 (Core SaaS Telemetry)**:
  - Monthly Recurring Revenue (MRR).
  - Annual Recurring Revenue (ARR).
  - Total Audited Revenue Collected (distinguished from projections).
  - Total Outstanding Cash & Overdue Balance.
  - Active Subscriptions & Subscriber Churn Rate.
- **FR-REP-02 (Visual Analytics)**: 6-month trailing revenue velocity dual-bar chart, tier distribution donut chart, and cohort expansion telemetry.

---

### Module 13: Staff Account Management (FR-STAFF)
- **FR-STAFF-01 (Admin Authority)**: Only Admins can invite, create, update, and deactivate Staff accounts.

---

### Module 14: Customer Self-Service Portal (FR-PORTAL)
- **FR-PORTAL-01 (Strict Tenant Isolation)**: Logged-in customers access only their own subscriptions, upcoming billing dates, and invoices.
- **FR-PORTAL-02 (Self-Service Invoicing)**: Customers view and download printable PDF invoices.

---

### Module 15: Penny The Coin Mascot Assistant (FR-PENNY)
- **FR-PENNY-01 (Original Visual Artwork)**: Distinctive round orange coin character (`#FF6B00`), animated eyes, retro smile, subtle bounce animation.
- **FR-PENNY-02 (Live Telemetry Dispatch)**: Penny reads live database aggregations to present real-time contextual commentary (e.g., "You have 14 overdue accounts totaling $9,350!").
- **FR-PENNY-03 (Multi-Point Presence)**: Integrated across Login, Dashboard Welcome, Customer Portal, Empty States, and floating assistant drawer.

---

## 2. Non-Functional Requirements (NFR)

- **NFR-PERF-01 (Response Time)**: All dashboard and data views must render in $\le 2.0\text{ seconds}$ under a load of $10,000$ active subscription records.
- **NFR-SEC-01 (Authentication & Authorization)**: Passwords hashed with bcrypt; role verification on every mutation; tenant isolation verified on every query.
- **NFR-REL-01 (Data Integrity & ACID)**: Financial transactions (subscription confirmation, invoice creation, payment recording) must execute within database transactions.
- **NFR-UX-01 (Responsive Neo-Brutalism)**: Uncompromising adherence to the 90s Retro-Modern SaaS design system across desktop ($1360\text{px}$ container), tablet, and mobile.

