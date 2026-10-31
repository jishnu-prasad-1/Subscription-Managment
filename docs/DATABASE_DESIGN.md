# 💾 DATABASE DESIGN & RELATIONAL DATA MODEL

---

## 1. Relational Schema Architecture

Brightloop's persistence layer is engineered for **ACID financial consistency**, **strict referential integrity**, and **ultra-low-latency indexing**.

The database comprises 16 normalized relational tables designed to scale effortlessly to tens of thousands of active subscriptions.

---

## 2. Table Specifications & Data Dictionaries

### 2.1 Table: `users` (Identity & RBAC)
Stores system actors (Admins, Staff members, and Customers).
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF', 'CUSTOMER')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    reset_token VARCHAR(255) NULL,
    reset_token_expiry TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2.2 Table: `customers` (Subscriber Profiles)
Captures commercial and billing profile details for businesses purchasing subscriptions.
```sql
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    company_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    billing_address TEXT NOT NULL,
    tax_id VARCHAR(50), -- GSTIN / VAT registration number
    payment_terms_default VARCHAR(50) DEFAULT 'Net 15',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_customers_company ON customers(company_name);
CREATE INDEX idx_customers_email ON customers(email);
```

---

### 2.3 Table: `products` (Catalog Master)
Master catalog of recurring software products, standalone add-ons, and physical hardware.
```sql
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('Software', 'Add-on', 'Service', 'Hardware')),
    sales_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_products_type ON products(product_type);
```

---

### 2.4 Table: `product_variants` (SKU Variations & Price Surcharges)
Supports multi-dimensional attributes with additive price modifiers (e.g., Brand = Odoo Brand adds ₹560).
```sql
CREATE TABLE product_variants (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_name VARCHAR(150) NOT NULL,
    attribute_key VARCHAR(100) NOT NULL, -- e.g. 'Brand', 'Edition', 'Storage'
    attribute_value VARCHAR(100) NOT NULL, -- e.g. 'Odoo Brand', 'Enterprise'
    additional_price DECIMAL(12,2) NOT NULL DEFAULT 0.00, -- Incremental price modifier
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_variants_product ON product_variants(product_id);
```

---

### 2.5 Table: `plans` (Billing Cadence & Contract Rules)
Defines recurrence intervals, minimum seats, and contract lifecycle rules.
```sql
CREATE TABLE plans (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    billing_interval VARCHAR(20) NOT NULL CHECK (billing_interval IN ('daily', 'weekly', 'monthly', 'yearly')),
    base_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    min_quantity INTEGER NOT NULL DEFAULT 1,
    available_from DATE,
    available_to DATE,
    auto_close BOOLEAN NOT NULL DEFAULT FALSE,
    allow_early_closure BOOLEAN NOT NULL DEFAULT TRUE,
    allow_pause BOOLEAN NOT NULL DEFAULT TRUE,
    allow_renewal BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_plans_interval ON plans(billing_interval);
```

---

### 2.6 Table: `quotation_templates` (Pre-Packaged Sales Bundles)
Enables sales reps to spin up structured quotes rapidly.
```sql
CREATE TABLE quotation_templates (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    default_validity_days INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.7 Table: `quotations` (Sales Offers)
Commercial proposals issued to prospective or existing subscribers.
```sql
CREATE TABLE quotations (
    id VARCHAR(36) PRIMARY KEY,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    template_id VARCHAR(36) NULL REFERENCES quotation_templates(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    valid_until DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_by VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quotes_customer ON quotations(customer_id);
CREATE INDEX idx_quotes_status ON quotations(status);
```

---

### 2.8 Table: `quotation_items` (Quotation Line Items)
```sql
CREATE TABLE quotation_items (
    id VARCHAR(36) PRIMARY KEY,
    quotation_id VARCHAR(36) NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id VARCHAR(36) NULL REFERENCES product_variants(id) ON DELETE SET NULL,
    plan_id VARCHAR(36) NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL
);
CREATE INDEX idx_quote_items_parent ON quotation_items(quotation_id);
```

---

### 2.9 Table: `subscriptions` (Contract Engine & State Machine)
Core lifecycle entity orchestrating recurring revenue agreements.
```sql
CREATE TABLE subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    subscription_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    plan_id VARCHAR(36) NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    quotation_id VARCHAR(36) NULL REFERENCES quotations(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'quotation', 'confirmed', 'active', 'paused', 'closed', 'expired')),
    start_date DATE NOT NULL,
    expiry_date DATE,
    next_billing_date DATE NOT NULL,
    payment_terms VARCHAR(50) NOT NULL DEFAULT 'Net 15',
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_recurring_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_subs_customer ON subscriptions(customer_id);
CREATE INDEX idx_subs_billing_sweep ON subscriptions(status, next_billing_date);
CREATE INDEX idx_subs_status ON subscriptions(status);
```

---

### 2.10 Table: `subscription_items` (Subscription Lines)
```sql
CREATE TABLE subscription_items (
    id VARCHAR(36) PRIMARY KEY,
    subscription_id VARCHAR(36) NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id VARCHAR(36) NULL REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL
);
CREATE INDEX idx_sub_items_parent ON subscription_items(subscription_id);
```

---

### 2.11 Table: `invoices` (Billing Ledger & Idempotency Key)
Stores billing records with guaranteed zero double-billing protection.
```sql
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    subscription_id VARCHAR(36) NOT NULL REFERENCES subscriptions(id) ON DELETE RESTRICT,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'confirmed', 'paid', 'cancelled', 'overdue')),
    due_date DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    balance_due DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    idempotency_key VARCHAR(128) NOT NULL UNIQUE, -- SHA256(sub_id + period_start + period_end)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status_due ON invoices(status, due_date);
CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
```

---

### 2.12 Table: `invoice_items` (Invoice Breakdown)
```sql
CREATE TABLE invoice_items (
    id VARCHAR(36) PRIMARY KEY,
    invoice_id VARCHAR(36) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(id),
    variant_id VARCHAR(36) NULL REFERENCES product_variants(id),
    description VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL
);
CREATE INDEX idx_inv_items_parent ON invoice_items(invoice_id);
```

---

### 2.13 Table: `taxes` (Tax Rates)
Admin-managed jurisdictional tax policies.
```sql
CREATE TABLE taxes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g. 'GST 18%', 'VAT 5%'
    rate_percentage DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

### 2.14 Table: `discounts` (Promotional Rules & Limits)
Admin-configured rules with automated application and usage caps.
```sql
CREATE TABLE discounts (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value DECIMAL(12,2) NOT NULL, -- e.g. 15.00 for 15% or 50.00 for $50
    min_purchase_amount DECIMAL(12,2) DEFAULT 0.00,
    min_quantity INTEGER DEFAULT 1,
    applies_to VARCHAR(30) NOT NULL CHECK (applies_to IN ('subscription', 'specific_product')),
    product_id VARCHAR(36) NULL REFERENCES products(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_usage_limit INTEGER NOT NULL DEFAULT 100,
    current_usage_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_discounts_dates ON discounts(start_date, end_date, is_active);
```

---

### 2.15 Table: `payments` (Payment Ledger)
Records cash inflow with full audit tracking.
```sql
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_id VARCHAR(36) NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Credit Card', 'Bank Transfer', 'UPI', 'Cash', 'Cheque')),
    payment_date DATE NOT NULL,
    reference_notes TEXT,
    recorded_by VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
```

---

### 2.16 Table: `audit_logs` (Security & Operations Log)
```sql
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    actor_id VARCHAR(36) NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g. 'SUBSCRIPTION_CONFIRMED', 'INVOICE_GENERATED'
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    payload JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

---

## 3. High-Performance Indexing Strategy

To guarantee $<2.0\text{s}$ response times with over $10,000$ active subscription records:
1. **Targeted Composite Index `idx_subs_billing_sweep`**: Indexes `(status, next_billing_date)`. The daily billing runner scans only indexed records meeting `status = 'active' AND next_billing_date <= CURRENT_DATE` in $<5\text{ms}$.
2. **Composite Overdue Index `idx_invoices_status_due`**: Indexes `(status, due_date)`. Instantly identifies overdue cash risks without a full table scan.
3. **Idempotency Index**: Unique constraint on `invoices(idempotency_key)` executes at B-Tree lookup speed ($O(\log N)$) during insertion.
