# 🛡️ USER ROLES & ACCESS CONTROL (RBAC) SPECIFICATION

---

## 1. Principles of Authorization

Brightloop strictly adheres to the principle of **Least Privilege** and **Defense in Depth**:
1. **Server-Side Enforcement**: Permissions are validated on every backend API route, Server Action, and database query. Hiding links in the navigation bar is treated merely as UI ergonomics, never as a security boundary.
2. **Tenant Data Isolation**: Customers are strictly partitioned by their `customer_id`. A customer querying an invoice or subscription from another organization receives an immediate `404 Not Found` or `403 Forbidden` response.
3. **Audit Trail**: Privileged administrative and financial state changes are logged to the `audit_logs` table with actor ID, timestamp, and IP address.

---

## 2. Role Definitions

### 👑 1. ADMIN (Super Administrator)
- **Persona Representation**: Samira Jenkins (VP of Revenue Operations).
- **Scope**: Unrestricted control across all functional modules.
- **Unique Capabilities**:
  - Author and edit global jurisdictional tax rules (`taxes`).
  - Configure dynamic discount rules, thresholds, and limits (`discounts`).
  - Onboard, modify, and deactivate internal staff accounts (`users.role = 'STAFF'`).
  - Trigger manual batch runs of the automated billing engine.
  - Review comprehensive financial audits and configure system-level parameters.

---

### 💼 2. STAFF (Operations & Sales Specialist)
- **Persona Representation**: Sales representatives, account managers, and billing operations coordinators.
- **Scope**: Day-to-day operational execution.
- **Capabilities**:
  - View product catalog and available plan tiers.
  - Create customer profiles and maintain commercial contacts.
  - Spin up quotation templates and author customized customer proposals.
  - Convert approved quotations into active subscriptions.
  - Manage subscription lifecycle events (Pause, Resume, Renew, Early Close).
  - Review generated invoices, confirm draft invoices, and send them to clients.
  - Record payments received via bank transfer, cheque, or manual reconciliation.
- **Restrictions**:
  - Cannot alter tax percentages or configure new tax jurisdictions.
  - Cannot create or modify discount rules.
  - Cannot view, invite, or deactivate other staff members.

---

### 👤 3. CUSTOMER (Client Self-Service Portal)
- **Persona Representation**: Authorized billing contacts of subscriber companies.
- **Scope**: Tenant-isolated view of their own commercial relationship.
- **Capabilities**:
  - Access personal customer portal dashboard.
  - View active plans, seat allocations, contract start dates, and next renewal dates.
  - Download official printable PDF invoices.
  - Review complete payment history and ledger receipts.
  - Update company contact details and billing addresses.
- **Restrictions**:
  - Cannot view any other subscriber's data.
  - Cannot access staff or administrative dashboards.
  - Cannot view internal system costs, margins, or global revenue metrics.

---

## 3. Granular Permission Matrix

| Module / Operation | Admin | Staff | Customer | Server-Side Enforcement Mechanism |
| :--- | :---: | :---: | :---: | :--- |
| **User & Staff Management** | | | | |
| View Staff List | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| Invite / Create New Staff | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| Deactivate Staff Account | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| **Product & Plan Catalog** | | | | |
| View Products & Plans | ✅ | ✅ | ❌ (Portal View) | `requireRole(['ADMIN', 'STAFF'])` |
| Create / Edit Products | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| Add Product Variants & Surcharges | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| Create / Edit Plan Recurrence Rules | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| **Customer Management** | | | | |
| Create & Edit Customer Accounts | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| Search All Customers | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| Edit Own Profile & Address | N/A | N/A | ✅ (Own Only) | `requireTenant(session.customerId)` |
| **Quotations** | | | | |
| Create Quotation Templates | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| Draft Custom Quotations | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| Convert Quote to Subscription | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| **Subscription Lifecycle** | | | | |
| View All Subscriptions | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| View Own Subscriptions | ✅ | ✅ | ✅ (Own Only) | `WHERE customer_id = session.customerId` |
| Transition State (Draft $\to$ Active) | ✅ | ✅ | ❌ | State Machine Guard in Service |
| Pause / Resume Subscription | ✅ | ✅ | ❌ | Plan Rule Validator (`allow_pause`) |
| Early Contract Termination | ✅ | ✅ | ❌ | Plan Rule Validator (`allow_early_closure`) |
| **Invoicing & Billing Engine** | | | | |
| Trigger Daily Billing Batch Run | ✅ | ❌ | ❌ | `requireRole('ADMIN')` or CRON Auth |
| Confirm Draft Invoices | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| Cancel Invoices | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| View & Download Invoices | ✅ | ✅ | ✅ (Own Only) | Tenant Isolation Guard |
| Print Official Invoices | ✅ | ✅ | ✅ (Own Only) | Tenant Isolation Guard |
| **Taxes & Discounts** | | | | |
| Create / Edit Tax Rules | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| Create / Edit Discount Rules | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| View Applied Discounts on Invoices | ✅ | ✅ | ✅ (On Invoice)| Read-only on line items |
| **Payments & Collections** | | | | |
| Record Offline / Bank Payments | ✅ | ✅ | ❌ | `requireRole(['ADMIN', 'STAFF'])` |
| Reconcile Ledger Balance | ✅ | ✅ | ❌ | Ledger Transaction Service |
| View Payment Receipts | ✅ | ✅ | ✅ (Own Only) | `WHERE customer_id = session.customerId` |
| **Reports & Telemetry** | | | | |
| View MRR, ARR, Churn, Velocity | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |
| Export Accounting CSVs | ✅ | ❌ | ❌ | `requireRole('ADMIN')` |

---

## 4. Implementation Example: Server Action Guard

```typescript
// lib/auth/guards.ts
import { auth } from "@/lib/auth";

export async function requireRole(allowedRoles: ("ADMIN" | "STAFF" | "CUSTOMER")[]) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("UNAUTHORIZED: Session authentication required.");
  }
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error(`FORBIDDEN: Role '${session.user.role}' lacks sufficient privileges.`);
  }
  return session.user;
}

export async function requireTenantIsolation(customerId: string) {
  const user = await requireRole(["CUSTOMER", "ADMIN", "STAFF"]);
  if (user.role === "CUSTOMER" && user.customerId !== customerId) {
    throw new Error("FORBIDDEN: Cross-tenant access strictly prohibited.");
  }
}
```
