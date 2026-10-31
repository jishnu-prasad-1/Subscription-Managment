# 📊 ENTITY RELATIONSHIP (ER) DIAGRAM

---

## 1. Visual Entity Relationship Model

The following diagram illustrates the complete relational model of the Brightloop Subscription Management System, including all 16 entities, primary keys, foreign keys, and cardinalities.

```mermaid
erDiagram
    USERS ||--o| CUSTOMERS : "authenticates"
    USERS ||--o{ QUOTATIONS : "authors"
    USERS ||--o{ PAYMENTS : "records"
    USERS ||--o{ AUDIT_LOGS : "triggers"

    CUSTOMERS ||--o{ QUOTATIONS : "receives"
    CUSTOMERS ||--o{ SUBSCRIPTIONS : "contracts"
    CUSTOMERS ||--o{ INVOICES : "billed"
    CUSTOMERS ||--o{ PAYMENTS : "remits"

    PRODUCTS ||--o{ PRODUCT_VARIANTS : "defines"
    PRODUCTS ||--o{ QUOTATION_ITEMS : "quoted"
    PRODUCTS ||--o{ SUBSCRIPTION_ITEMS : "subscribed"
    PRODUCTS ||--o{ INVOICE_ITEMS : "invoiced"
    PRODUCTS ||--o{ DISCOUNTS : "discounts"

    PLANS ||--o{ SUBSCRIPTIONS : "governs"
    PLANS ||--o{ QUOTATION_ITEMS : "schedules"

    QUOTATION_TEMPLATES ||--o{ QUOTATIONS : "pre-populates"
    QUOTATIONS ||--o{ QUOTATION_ITEMS : "contains"
    QUOTATIONS ||--o| SUBSCRIPTIONS : "converts to"

    SUBSCRIPTIONS ||--o{ SUBSCRIPTION_ITEMS : "contains"
    SUBSCRIPTIONS ||--o{ INVOICES : "generates"

    INVOICES ||--o{ INVOICE_ITEMS : "details"
    INVOICES ||--o{ PAYMENTS : "settled by"

    USERS {
        string id PK
        string email UK
        string password_hash
        string name
        string role
        boolean is_active
        string reset_token
        datetime reset_token_expiry
    }

    CUSTOMERS {
        string id PK
        string user_id FK
        string company_name
        string contact_name
        string email
        string phone
        string billing_address
        string tax_id
        string payment_terms_default
        boolean is_active
    }

    PRODUCTS {
        string id PK
        string name
        string product_type
        decimal sales_price
        decimal cost_price
        string notes
        boolean is_active
    }

    PRODUCT_VARIANTS {
        string id PK
        string product_id FK
        string variant_name
        string attribute_key
        string attribute_value
        decimal additional_price
        boolean is_active
    }

    PLANS {
        string id PK
        string name
        string billing_interval
        decimal base_cost
        int min_quantity
        date available_from
        date available_to
        boolean auto_close
        boolean allow_early_closure
        boolean allow_pause
        boolean allow_renewal
    }

    QUOTATION_TEMPLATES {
        string id PK
        string name
        string description
        int default_validity_days
    }

    QUOTATIONS {
        string id PK
        string quote_number UK
        string customer_id FK
        string template_id FK
        string status
        date valid_until
        decimal subtotal
        decimal tax_amount
        decimal discount_amount
        decimal total_amount
        string created_by FK
    }

    QUOTATION_ITEMS {
        string id PK
        string quotation_id FK
        string product_id FK
        string variant_id FK
        string plan_id FK
        int quantity
        decimal unit_price
        decimal tax_rate
        decimal total_amount
    }

    SUBSCRIPTIONS {
        string id PK
        string subscription_number UK
        string customer_id FK
        string plan_id FK
        string quotation_id FK
        string status
        date start_date
        date expiry_date
        date next_billing_date
        string payment_terms
        boolean auto_renew
        decimal total_recurring_amount
    }

    SUBSCRIPTION_ITEMS {
        string id PK
        string subscription_id FK
        string product_id FK
        string variant_id FK
        int quantity
        decimal unit_price
        decimal tax_rate
        decimal total_amount
    }

    INVOICES {
        string id PK
        string invoice_number UK
        string subscription_id FK
        string customer_id FK
        date billing_period_start
        date billing_period_end
        string status
        date due_date
        decimal subtotal
        decimal tax_amount
        decimal discount_amount
        decimal total_amount
        decimal paid_amount
        decimal balance_due
        string idempotency_key UK
    }

    INVOICE_ITEMS {
        string id PK
        string invoice_id FK
        string product_id FK
        string variant_id FK
        string description
        int quantity
        decimal unit_price
        decimal tax_amount
        decimal discount_amount
        decimal total_amount
    }

    TAXES {
        string id PK
        string name
        decimal rate_percentage
        boolean is_active
        boolean is_default
    }

    DISCOUNTS {
        string id PK
        string code UK
        string name
        string discount_type
        decimal value
        decimal min_purchase_amount
        int min_quantity
        string applies_to
        string product_id FK
        date start_date
        date end_date
        int max_usage_limit
        int current_usage_count
        boolean is_active
    }

    PAYMENTS {
        string id PK
        string payment_number UK
        string invoice_id FK
        string customer_id FK
        decimal amount
        string payment_method
        date payment_date
        string reference_notes
        string recorded_by FK
    }

    AUDIT_LOGS {
        string id PK
        string actor_id FK
        string action
        string entity_type
        string entity_id
        json payload
        datetime created_at
    }
```

---

## 2. Integrity Constraints & Cardinality Rules

1. **One-to-Many (`1:N`) between Customer and Subscriptions**: A customer may maintain multiple concurrent subscriptions across different software products and add-ons.
2. **One-to-Many (`1:N`) between Subscription and Invoices**: A single subscription generates recurring invoices over time, each distinguished by its billing period.
3. **One-to-Many (`1:N`) between Invoice and Payments**: An invoice supports multiple partial payments until `balance_due = 0.00`.
4. **Zero-or-One (`0..1:1`) between Quotation and Subscription**: An accepted quotation converts into at most one active subscription.
5. **Cascading Behavior**:
   - Deleting a draft quotation cascades and removes its quotation line items.
   - Deleting an invoice cascades and removes its invoice line items.
   - Core commercial entities (`customers`, `products`, `subscriptions`) use `ON DELETE RESTRICT` to prevent accidental deletion of historical accounting records.
