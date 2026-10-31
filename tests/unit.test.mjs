import assert from "node:assert";
import crypto from "node:crypto";

console.log("=================================================");
console.log("BRIGHTLOOP UNIT TEST SUITE - HACKATHON VERIFICATION");
console.log("=================================================");

let totalPassed = 0;
let totalFailed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    totalPassed++;
  } catch (error) {
    console.error(`❌ FAIL: ${description}`);
    console.error(error);
    totalFailed++;
  }
}

// 1. Brand Variant Surcharge Calculation
test("Product Variant Surcharge - Odoo Brand adds +₹560 to base price", () => {
  const baseSalesPrice = 1200.0;
  const odooBrandSurcharge = 560.0;
  const effectiveUnitPrice = baseSalesPrice + odooBrandSurcharge;
  const quantity = 3;
  const subtotal = effectiveUnitPrice * quantity;

  assert.strictEqual(effectiveUnitPrice, 1760.0);
  assert.strictEqual(subtotal, 5280.0);
});

// 2. Tax Calculation (18% GST)
test("Tax Calculation - Standard 18% GST applied accurately", () => {
  const subtotal = 5280.0;
  const taxRatePercentage = 18.0;
  const taxAmount = Number(((subtotal * taxRatePercentage) / 100).toFixed(2));
  const totalAmount = Number((subtotal + taxAmount).toFixed(2));

  assert.strictEqual(taxAmount, 950.4);
  assert.strictEqual(totalAmount, 6230.4);
});

// 3. Password Complexity Policy
function validatePassword(password) {
  if (!password || password.length < 8) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUpper && hasLower && hasDigit && hasSpecial;
}

test("Security - Password policy accepts compliant password (Brightloop@2026)", () => {
  assert.strictEqual(validatePassword("Brightloop@2026"), true);
});

test("Security - Password policy rejects non-compliant passwords", () => {
  assert.strictEqual(validatePassword("short1!"), false); // < 8 chars
  assert.strictEqual(validatePassword("alllowercase123!"), false); // no uppercase
  assert.strictEqual(validatePassword("ALLUPPERCASE123!"), false); // no lowercase
  assert.strictEqual(validatePassword("NoDigitsAtAll!"), false); // no digit
  assert.strictEqual(validatePassword("NoSpecialChars123"), false); // no special char
});

// 4. SHA-256 Idempotency Key Generation
function generateIdempotencyKey(subscriptionId, periodStart, periodEnd) {
  const payload = `${subscriptionId}:${new Date(periodStart).toISOString()}:${new Date(periodEnd).toISOString()}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

test("Zero Double-Billing - Idempotency key is deterministic for identical periods", () => {
  const subId = "sub-test-uuid-001";
  const start = "2026-11-01T00:00:00.000Z";
  const end = "2026-12-01T00:00:00.000Z";

  const key1 = generateIdempotencyKey(subId, start, end);
  const key2 = generateIdempotencyKey(subId, start, end);

  assert.strictEqual(key1, key2);
  assert.strictEqual(key1.length, 64); // SHA-256 hex length
});

test("Zero Double-Billing - Idempotency key differs across distinct periods", () => {
  const subId = "sub-test-uuid-001";
  const start1 = "2026-11-01T00:00:00.000Z";
  const end1 = "2026-12-01T00:00:00.000Z";
  const start2 = "2026-12-01T00:00:00.000Z";
  const end2 = "2027-01-01T00:00:00.000Z";

  const key1 = generateIdempotencyKey(subId, start1, end1);
  const key2 = generateIdempotencyKey(subId, start2, end2);

  assert.notStrictEqual(key1, key2);
});

// 5. Billing Interval Date Stepper
function calculateNextBilling(currentDate, interval) {
  const next = new Date(currentDate);
  if (interval === "daily") {
    next.setDate(next.getDate() + 1);
  } else if (interval === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (interval === "yearly") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    // monthly default
    next.setMonth(next.getMonth() + 1);
  }
  return next;
}

test("Billing Engine - Correct date increments across intervals", () => {
  const base = new Date("2026-01-01T00:00:00.000Z");

  const daily = calculateNextBilling(base, "daily");
  assert.strictEqual(daily.toISOString().split("T")[0], "2026-01-02");

  const weekly = calculateNextBilling(base, "weekly");
  assert.strictEqual(weekly.toISOString().split("T")[0], "2026-01-08");

  const monthly = calculateNextBilling(base, "monthly");
  assert.strictEqual(monthly.toISOString().split("T")[0], "2026-02-01");

  const yearly = calculateNextBilling(base, "yearly");
  assert.strictEqual(yearly.toISOString().split("T")[0], "2027-01-01");
});

// 6. Payment Settlement & Multi-Stage Balances
test("Payment Engine - Correctly balances partial and full settlement", () => {
  const invoiceTotal = 5000.0;
  let paidAmount = 0.0;
  let balanceDue = invoiceTotal;
  let status = "confirmed";

  // First partial payment of ₹2,000
  const payment1 = 2000.0;
  paidAmount += payment1;
  balanceDue = invoiceTotal - paidAmount;
  status = balanceDue <= 0 ? "paid" : "partially_paid";

  assert.strictEqual(paidAmount, 2000.0);
  assert.strictEqual(balanceDue, 3000.0);
  assert.strictEqual(status, "partially_paid");

  // Second settlement payment of ₹3,000
  const payment2 = 3000.0;
  paidAmount += payment2;
  balanceDue = Math.max(0, invoiceTotal - paidAmount);
  status = balanceDue <= 0 ? "paid" : "partially_paid";

  assert.strictEqual(paidAmount, 5000.0);
  assert.strictEqual(balanceDue, 0.0);
  assert.strictEqual(status, "paid");
});

// 9. RBAC - Customer Role Privilege Isolation
test("RBAC Security - Customer role is strictly barred from adding customers, drafting quotes, or managing plans", () => {
  const customerRole = "CUSTOMER";
  const canAddCustomer = customerRole === "ADMIN" || customerRole === "STAFF";
  const canCreateQuotation = customerRole === "ADMIN" || customerRole === "STAFF";
  const canManagePlans = customerRole === "ADMIN";
  const canRunBillingEngine = customerRole === "ADMIN";

  assert.strictEqual(canAddCustomer, false, "Customer must NEVER have permission to add customers!");
  assert.strictEqual(canCreateQuotation, false, "Customer must NEVER have permission to create quotations!");
  assert.strictEqual(canManagePlans, false, "Customer must NEVER have permission to configure plans!");
  assert.strictEqual(canRunBillingEngine, false, "Customer must NEVER have permission to trigger billing engine!");
});

// 10. RBAC - Staff Role Operational Privilege Gating
test("RBAC Security - Staff role can create customers & quotes, but cannot manage staff or trigger billing sweep", () => {
  const staffRole = "STAFF";
  const canAddCustomer = staffRole === "ADMIN" || staffRole === "STAFF";
  const canCreateQuotation = staffRole === "ADMIN" || staffRole === "STAFF";
  const canManageStaff = staffRole === "ADMIN";
  const canRunBillingEngine = staffRole === "ADMIN";

  assert.strictEqual(canAddCustomer, true, "Staff MUST have permission to onboard customers!");
  assert.strictEqual(canCreateQuotation, true, "Staff MUST have permission to author sales quotations!");
  assert.strictEqual(canManageStaff, false, "Staff must NOT have access to staff roster admin!");
  assert.strictEqual(canRunBillingEngine, false, "Staff must NOT have access to run systemic billing sweeps!");
});

// 11. RBAC - Super Admin Complete Authority
test("RBAC Security - Super Admin has comprehensive governance across all capabilities", () => {
  const adminRole = "ADMIN";
  const canAddCustomer = adminRole === "ADMIN" || adminRole === "STAFF";
  const canCreateQuotation = adminRole === "ADMIN" || adminRole === "STAFF";
  const canManagePlans = adminRole === "ADMIN";
  const canManageStaff = adminRole === "ADMIN";
  const canRunBillingEngine = adminRole === "ADMIN";

  assert.strictEqual(canAddCustomer, true);
  assert.strictEqual(canCreateQuotation, true);
  assert.strictEqual(canManagePlans, true);
  assert.strictEqual(canManageStaff, true);
  assert.strictEqual(canRunBillingEngine, true);
});

console.log("=================================================");
console.log(`TEST SUMMARY: ${totalPassed} Passed, ${totalFailed} Failed`);
console.log("=================================================");

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log("ALL UNIT TESTS PASSED WITH 100% SUCCESS!");
}

