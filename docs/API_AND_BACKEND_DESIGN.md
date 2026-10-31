# 🔌 API & BACKEND ARCHITECTURE SPECIFICATION

---

## 1. Overview & Protocol Design

Brightloop adopts a hybrid **Server Actions + RESTful JSON API** design powered by Next.js 15:
- **Server Actions**: Used for form submissions, state transitions, and interactive UI mutations. Provides direct type-safety without manual URL serialization.
- **RESTful Endpoints (`/api/...`)**: Standardized endpoints for background schedulers, automated integrations, and data queries.

### Standard Response Envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Resource processed successfully",
  "meta": {
    "timestamp": "2026-10-31T05:30:00Z",
    "version": "v2.4"
  }
}
```

### Standard Error Envelope:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Subscription in Closed state cannot be paused.",
    "details": [ ... ]
  }
}
```

---

## 2. API Endpoint Specifications

### 2.1 Authentication & Profile (`/api/auth`)

#### `POST /api/auth/register`
- **Access**: Public
- **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@techcorp.com",
    "password": "Password@123",
    "company_name": "TechCorp LLC",
    "phone": "+1-555-0199",
    "billing_address": "123 Market St, Suite 400, San Francisco CA"
  }
  ```
- **Validation Rules**:
  - `email`: Valid email format, checked against `users.email` for uniqueness.
  - `password`: Tested against regex `^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{9,}$`.
- **Response**: `201 Created` with session token cookie.

#### `POST /api/auth/login`
- **Access**: Public
- **Payload**: `{"email": "jane@techcorp.com", "password": "Password@123"}`
- **Response**: `200 OK` with user payload and HTTP-only session cookie.

#### `POST /api/auth/forgot-password`
- **Access**: Public
- **Payload**: `{"email": "jane@techcorp.com"}`
- **Behavior**: Generates cryptographic reset token with 60-minute expiry; logs reset URL to terminal during development.

---

### 2.2 Product & Variant Engine (`/api/products`)

#### `GET /api/products`
- **Access**: Admin, Staff
- **Query Params**: `?type=Software&active=true&search=CRM`
- **Response**: Array of product objects with nested `variants[]`.

#### `POST /api/products`
- **Access**: Admin only
- **Payload**:
  ```json
  {
    "name": "BrightDesk ERP Suite",
    "product_type": "Software",
    "sales_price": 2400.00,
    "cost_price": 600.00,
    "notes": "Flagship multi-module enterprise ERP",
    "variants": [
      {
        "variant_name": "Standard Edition",
        "attribute_key": "Edition",
        "attribute_value": "Standard",
        "additional_price": 0.00
      },
      {
        "variant_name": "Odoo Brand Edition",
        "attribute_key": "Brand",
        "attribute_value": "Odoo Brand",
        "additional_price": 560.00
      }
    ]
  }
  ```

---

### 2.3 Plan Engine (`/api/plans`)

#### `POST /api/plans`
- **Access**: Admin only
- **Payload**:
  ```json
  {
    "name": "Enterprise Annual Pro",
    "billing_interval": "yearly",
    "base_cost": 28800.00,
    "min_quantity": 5,
    "available_from": "2026-01-01",
    "available_to": "2026-12-31",
    "auto_close": false,
    "allow_early_closure": true,
    "allow_pause": true,
    "allow_renewal": true
  }
  ```

---

### 2.4 Quotations & Conversions (`/api/quotations`)

#### `POST /api/quotations`
- **Access**: Admin, Staff
- **Payload**:
  ```json
  {
    "customer_id": "cust-8821",
    "valid_days": 30,
    "items": [
      {
        "product_id": "prod-101",
        "variant_id": "var-odoo-560",
        "plan_id": "plan-monthly-std",
        "quantity": 10,
        "unit_price": 2960.00,
        "tax_id": "tax-gst-18"
      }
    ]
  }
  ```

#### `POST /api/quotations/:id/convert`
- **Access**: Admin, Staff
- **Behavior**: Converts accepted quotation into a `Confirmed` Subscription inside an ACID database transaction.
- **Response**: `200 OK` with created `subscription_id` and `subscription_number`.

---

### 2.5 Subscription Engine (`/api/subscriptions`)

#### State Machine Progression Actions:
- `POST /api/subscriptions/:id/confirm`: Moves `Quotation` $\to$ `Confirmed`.
- `POST /api/subscriptions/:id/activate`: Moves `Confirmed` $\to$ `Active`, sets `start_date` and initial `next_billing_date`.
- `POST /api/subscriptions/:id/pause`: Moves `Active` $\to$ `Paused`.
- `POST /api/subscriptions/:id/resume`: Moves `Paused` $\to$ `Active`.
- `POST /api/subscriptions/:id/renew`: Extends `expiry_date` by plan duration.
- `POST /api/subscriptions/:id/close-early`: Validates plan's `allow_early_closure` and transitions to `Closed`.

---

### 2.6 Billing Engine & Idempotent Invoicing (`/api/billing`)

#### `POST /api/billing/run-engine`
- **Access**: Admin, Background Job (CRON header secret)
- **Execution Flow**:
  1. Queries all active subscriptions where `next_billing_date <= CURRENT_DATE`.
  2. For each subscription, computes:
     $$\text{idempotency\_key} = \text{SHA256}(\text{sub\_id} + \text{billing\_period\_start} + \text{billing\_period\_end})$$
  3. Evaluates active discounts (checks minimum purchase amount, seats, and usage count limit).
  4. Inserts draft invoice; on unique constraint conflict, gracefully skips duplicate.
  5. Advances subscription's `next_billing_date` by its recurrence interval (`daily`, `weekly`, `monthly`, `yearly`).
- **Response**:
  ```json
  {
    "processed_count": 142,
    "generated_invoices": 142,
    "skipped_duplicates": 0,
    "total_billed_amount": 148250.00
  }
  ```

---

### 2.7 Payment Recording (`/api/payments`)

#### `POST /api/payments`
- **Access**: Admin, Staff
- **Payload**:
  ```json
  {
    "invoice_id": "inv-2026-0842",
    "customer_id": "cust-8821",
    "amount": 14825.00,
    "payment_method": "Bank Transfer",
    "payment_date": "2026-10-31",
    "reference_notes": "UTR: HSBC9823487192"
  }
  ```
- **Ledger Effect**:
  - Inserts record into `payments`.
  - Increments `invoices.paid_amount` by `$14,825.00`.
  - Decrements `invoices.balance_due`.
  - If `balance_due == 0.00`, transitions `invoices.status = 'paid'`.

---

### 2.8 Penny Real-Time Dispatch (`/api/penny/insights`)

#### `GET /api/penny/insights`
- **Access**: Authenticated users
- **Behavior**: Scans live database metrics and returns structured commentary:
  ```json
  {
    "mood": "alert",
    "headline": "PENNY'S DISPATCH // PRIORITY TELEMETRY",
    "message": "Hey y'all! Penny here! You've got 142 renewals running smooth, but keep an eye on those 14 overdue accounts totaling $9,350!",
    "metrics": {
      "active_renewals": 142,
      "overdue_count": 14,
      "overdue_amount": 9350.00,
      "churn_rescue_rate": 92.4
    },
    "action_label": "Review Overdue Invoices",
    "action_path": "/invoices?status=overdue"
  }
  ```

