# 🔗 REQUIREMENTS TRACEABILITY MATRIX (RTM)

---

## 1. Traceability Mapping Table

The following matrix guarantees that 100% of the functional and non-functional requirements from the official hackathon problem statement and project brief are mapped directly to system architecture, database entities, APIs, UI components, and automated test cases.

| Req ID | Origin / Source | Functional Requirement | Architecture Module | Database Entities | API / Server Action | UI Screen / Component | Verification Test Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-AUTH-01** | PDF p.2 / Brief 7.1 | Unique email account registration | Auth Service | `users` | `POST /api/auth/register` | `RegisterForm.tsx` | `TC-AUTH-01: Duplicate Email Rejection` |
| **FR-AUTH-02** | PDF p.2 / Brief 7.1 | Strict password complexity | Auth Service | `users` | `POST /api/auth/register` | `PasswordStrengthMeter.tsx` | `TC-AUTH-02: Password Policy Regex Test` |
| **FR-AUTH-03** | PDF p.2 / Brief 7.1 | Bcrypt password hashing | Crypto Utility | `users` | `POST /api/auth/login` | `LoginForm.tsx` | `TC-AUTH-03: Salted Bcrypt Hash Check` |
| **FR-AUTH-04** | PDF p.2 / Brief 7.1 | Password reset link | Auth Service | `users`, `password_resets` | `POST /api/auth/forgot-password` | `ForgotPasswordModal.tsx` | `TC-AUTH-04: Reset Token Expiry Validation` |
| **FR-RBAC-01** | PDF p.2 / Brief 2, 7.13 | 3 Roles: Admin, Staff, Customer | RBAC Engine | `users`, `roles` | `GET /api/auth/me` | `RoleGuard.tsx` | `TC-RBAC-01: Cross-Role Route Protection` |
| **FR-RBAC-02** | Brief 2, 7.13 | Server-side role authorization | Middleware | `users` | Middleware pipeline | `ProtectedLayout.tsx` | `TC-RBAC-02: Unauthorized API 403 Response` |
| **FR-PROD-01** | PDF p.3 / Brief 7.3 | Product creation (name, type, price, cost) | Product Engine | `products` | `POST /api/products` | `ProductCreateModal.tsx` | `TC-PROD-01: Product CRUD Validation` |
| **FR-PROD-02** | PDF p.3 / Brief 7.3 | Multi-attribute product variants | Product Engine | `product_variants` | `POST /api/products/:id/variants` | `VariantEditor.tsx` | `TC-PROD-02: Variant Association Check` |
| **FR-PROD-03** | PDF p.3 / Brief 7.3 | Variant surcharge (+₹560 Odoo brand) | Pricing Engine | `products`, `product_variants` | `POST /api/quotes/calculate` | `PriceCalculator.tsx` | `TC-PROD-03: Variant Price Addition Math` |
| **FR-PLAN-01** | PDF p.3 / Brief 7.4 | Billing intervals (daily, weekly, monthly, yearly)| Plan Engine | `plans` | `POST /api/plans` | `PlanForm.tsx` | `TC-PLAN-01: Billing Interval Math Engine` |
| **FR-PLAN-02** | PDF p.3 / Brief 7.4 | Min quantity & plan validity dates | Plan Engine | `plans` | `POST /api/plans` | `PlanForm.tsx` | `TC-PLAN-02: Min Quantity Constraint Check` |
| **FR-PLAN-03** | PDF p.3 / Brief 7.4 | Plan rules (auto_close, pause, renew) | Lifecycle Engine| `plans`, `subscriptions` | `PATCH /api/plans/:id` | `PlanRulesConfig.tsx` | `TC-PLAN-03: Auto-close & Pause Policy Check`|
| **FR-CUST-01** | Brief 7.5 | Customer profile & billing information | Customer Service| `customers` | `POST /api/customers` | `CustomerDrawer.tsx` | `TC-CUST-01: Customer Profile Validation` |
| **FR-CUST-02** | Brief 7.5 | 360-degree timeline (subs, invoices, payments)| Customer Service| `customers`, `subscriptions` | `GET /api/customers/:id` | `CustomerTimeline.tsx` | `TC-CUST-02: Customer 360 Aggregation` |
| **FR-QUOTE-01**| PDF p.3 / Brief 7.6 | Reusable quotation templates | Quotation Service| `quotation_templates` | `GET /api/quotation-templates` | `TemplateSelector.tsx` | `TC-QUOTE-01: Template Instantiation Check` |
| **FR-QUOTE-02**| PDF p.3 / Brief 7.6 | Quotation drafting with validity days | Quotation Service| `quotations`, `quotation_items` | `POST /api/quotations` | `QuotationBuilder.tsx` | `TC-QUOTE-02: Expiry Date Calculation` |
| **FR-QUOTE-04**| PDF p.3 / Brief 7.6 | 1-Click Quote-to-Subscription conversion | Lifecycle Service| `quotations`, `subscriptions` | `POST /api/quotations/:id/convert` | `ConvertQuoteButton.tsx` | `TC-QUOTE-03: State Machine Conversion Check` |
| **FR-SUBS-01** | PDF p.3 / Brief 7.7 | Unique subscription number generation | Subscription Eng| `subscriptions` | `POST /api/subscriptions` | `SubscriptionList.tsx` | `TC-SUBS-01: Unique Sequence Guarantee` |
| **FR-SUBS-02** | PDF p.3 / Brief 7.7 | 5-stage lifecycle state machine | Lifecycle Engine| `subscriptions` | `PATCH /api/subscriptions/:id/status` | `LifecycleStepper.tsx` | `TC-SUBS-02: Lifecycle State Transitions` |
| **FR-SUBS-03** | PDF p.3 / Brief 7.7 | Pause, Resume, Renew, Early Close | Lifecycle Engine| `subscriptions`, `history` | `POST /api/subscriptions/:id/action` | `ActionMenu.tsx` | `TC-SUBS-03: Pause & Resume Billing Dates` |
| **FR-INV-01**  | PDF p.3 / Brief 7.8 | Automated recurring invoice generation | Billing Engine | `invoices`, `invoice_items` | `POST /api/billing/run-engine` | `BillingPipelineView.tsx` | `TC-INV-01: Due Subscription Billing Run` |
| **FR-INV-02**  | PDF p.3 / Brief 7.8 | Zero double-billing idempotency hash | Billing Engine | `invoices` (composite unique index) | `POST /api/invoices/generate` | `BillingPipelineView.tsx` | `TC-INV-02: Idempotent Invoice Rejection` |
| **FR-INV-03**  | PDF p.3 / Brief 7.8 | Invoice lifecycle (Draft $\to$ Confirmed $\to$ Paid)| Invoice Service | `invoices` | `PATCH /api/invoices/:id/status` | `InvoiceDetailModal.tsx` | `TC-INV-03: Invoice State Progression` |
| **FR-INV-04**  | PDF p.3 / Brief 7.8 | Print and PDF download formatting | Document Service| `invoices` | `GET /api/invoices/:id/print` | `PrintableInvoice.tsx` | `TC-INV-04: Printable Layout Rendering` |
| **FR-TAX-01**  | PDF p.3 / Brief 7.9 | Admin-configurable tax rules | Tax Engine | `taxes` | `POST /api/taxes` | `TaxSettingsTab.tsx` | `TC-TAX-01: Tax Rate Management Check` |
| **FR-TAX-02**  | PDF p.3 / Brief 7.9 | Automated tax line-item calculation | Tax Engine | `taxes`, `invoice_items` | Evaluator Hook | `TaxBreakdownCard.tsx` | `TC-TAX-02: Multi-Item Tax Math Check` |
| **FR-DISC-01** | PDF p.4 / Brief 7.10| Admin-only discount creation | Discount Engine| `discounts` | `POST /api/discounts` | `DiscountForm.tsx` | `TC-DISC-01: Admin Discount Creation Auth` |
| **FR-DISC-02** | PDF p.4 / Brief 7.10| Percentage & fixed rules with constraints | Discount Engine| `discounts` | `POST /api/discounts` | `DiscountForm.tsx` | `TC-DISC-02: Min Quantity & Spend Check` |
| **FR-DISC-03** | PDF p.4 / Brief 7.10| Auto-application and usage limit cut-off | Discount Engine| `discounts`, `invoice_items` | `POST /api/billing/evaluate-discounts` | `AppliedDiscountsTag.tsx`| `TC-DISC-03: Max Usage Limit Retirement` |
| **FR-PAY-01**  | PDF p.4 / Brief 7.11| Multi-method payment recording | Payment Engine | `payments` | `POST /api/payments` | `RecordPaymentModal.tsx` | `TC-PAY-01: Payment Transaction Recording` |
| **FR-PAY-02**  | PDF p.4 / Brief 7.11| Partial payment & ledger balance tracking | Ledger Service | `invoices`, `payments` | `GET /api/invoices/:id/balance` | `BalanceDueIndicator.tsx`| `TC-PAY-02: Partial Payment Math Check` |
| **FR-PAY-03**  | PDF p.4 / Brief 7.11| Real-time overdue invoice identification | Ledger Service | `invoices` | `GET /api/invoices/overdue` | `OverdueAlertCard.tsx` | `TC-PAY-03: Overdue Detection Query Check` |
| **FR-REP-01**  | PDF p.4 / Brief 7.12| MRR, ARR, Audited Rev & Active Subs | Analytics Eng | `invoices`, `subscriptions` | `GET /api/analytics/kpis` | `BentoMetricGrid.tsx` | `TC-REP-01: MRR & ARR Aggregation Engine` |
| **FR-REP-02**  | PDF p.4 / Brief 7.12| Trailing velocity chart & tier breakdown | Analytics Eng | `subscriptions`, `plans` | `GET /api/analytics/charts` | `RevenueVelocityChart.tsx`| `TC-REP-02: Time-Series Chart Data Format` |
| **FR-STAFF-01**| PDF p.2 / Brief 7.13| Admin creates and manages Staff accounts | Staff Service | `users` (role=STAFF) | `POST /api/admin/staff` | `StaffManagementView.tsx`| `TC-STAFF-01: Admin Staff Management Perms`|
| **FR-PORTAL-01**| PDF p.2 / Brief 7.14| Customer views only own records | Portal Service | `subscriptions`, `invoices` | `GET /api/portal/my-records` | `CustomerPortalLayout.tsx`| `TC-PORTAL-01: Cross-Tenant Data Isolation` |
| **FR-PENNY-01**| Brief 5 | Original orange coin mascot artwork | UI Assets | SVG Component | Client-side render | `PennyMascot.tsx` | `TC-PENNY-01: SVG Rendering & Keyframe Animation` |
| **FR-PENNY-02**| Brief 5, 6.D | Live telemetry dispatch speech bubbles | Penny Dispatch | Dynamic Aggregations | `GET /api/penny/insights` | `PennyDispatchBanner.tsx` | `TC-PENNY-02: Contextual Insight Generation` |
| **NFR-PERF-01**| PDF p.4 / Brief 12 | Sub-2s page response with 10k rows | Database & API | Indexed tables | Performance Profiler | Entire Application | `TC-PERF-01: 10,000 Record Query Benchmark` |
| **NFR-SEC-01** | Brief 12 | Zero plaintext passwords & SQL injection | Security Layer | Prepared Statements | Auth Pipeline | Global API Handlers | `TC-SEC-01: Penetration & Query Sanity Check` |
| **NFR-REL-01** | Brief 12 | ACID transactions on billing operations | Transaction Eng| Prisma/Drizzle transactions | Billing & Invoicing | Global Services | `TC-REL-01: Transaction Rollback on Failure` |
| **NFR-UX-01**  | Brief 1.1, 4 | Stitch Neo-Brutalist 90s OS styling | Presentation | Tailwind Config | CSS Tokens | All Views | `TC-UX-01: Visual Regression & Tokens Check` |

