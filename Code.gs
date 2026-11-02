/**
 * ParkEase - Google Apps Script backend starter
 * IMPORTANT:
 * - Do not deploy this as a public, unauthenticated API.
 * - Configure Firebase Authentication (or another trusted identity provider).
 * - Verify ID tokens server-side and map each verified email/UID to a role.
 * - Enforce resident ownership and staff permissions in every server function.
 * - Store spreadsheet ID and configuration in Script Properties, not in GitHub.
 *
 * This file provides the database structure and safe server-side patterns to finish
 * after the identity provider and deployment model have been selected.
 */

const SHEETS = {
  Residents: ["ParkingID","ParkingBay","UnitNo","ResidentName","Phone","Email","MonthlyRent","StartDate","EndDate","Status"],
  Bills: ["BillID","BillingMonth","ParkingID","AmountDue","DueDate","AmountPaid","Status","Balance"],
  Payments: ["TransactionID","PaymentDate","ParkingID","BillingMonth","BankReference","Amount","ProofFileID","VerificationStatus","RecordedBy","VerifiedDate"],
  ReminderLog: ["ReminderDate","ParkingID","ResidentName","BillingMonth","Outstanding","ReminderStage","Method","Notes"],
  Users: ["AuthUID","Email","Role","ParkingID","Status"],
  AuditLog: ["Timestamp","ActorUID","ActorEmail","Action","RecordType","RecordID","Details"]
};

function setupDatabase() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Set SPREADSHEET_ID in Script Properties before setup.");
  const ss = SpreadsheetApp.openById(id);
  Object.entries(SHEETS).forEach(([name, headers]) => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(headers);
    sh.setFrozenRows(1);
  });
  return "Database tabs checked.";
}

/**
 * Example server-side authorization guard.
 * Implement verifyIdentityToken_(token) using Firebase Admin / a trusted
 * token-verification service before enabling any endpoint.
 */
function requireRole_(identity, allowedRoles) {
  if (!identity || !identity.uid || !identity.email || !identity.role) {
    throw new Error("Unauthenticated");
  }
  if (!allowedRoles.includes(identity.role)) throw new Error("Forbidden");
  return identity;
}

/**
 * Never trust a ParkingID supplied by the browser for resident access.
 * Resolve the resident's ParkingID from the Users table using verified UID.
 */
function assertResidentOwnsParking_(identity, parkingId) {
  requireRole_(identity, ["resident","staff"]);
  if (identity.role === "resident" && identity.parkingId !== parkingId) {
    throw new Error("Forbidden: residents may only access their own parking account.");
  }
  return true;
}

/**
 * Recommended transaction rule:
 * 1. Insert payment with VerificationStatus=Pending.
 * 2. Staff verifies bank statement.
 * 3. On verification, update payment status and recalculate bill allocations.
 * 4. Append an AuditLog row. Never delete or overwrite payment history.
 */
function recordPayment_(identity, payment) {
  requireRole_(identity, ["staff"]);
  if (!payment || !payment.parkingId || !payment.billingMonth ||
      !payment.amount || Number(payment.amount) <= 0) {
    throw new Error("Invalid payment details.");
  }
  // TODO: validate parking ID and bill, append Pending payment row,
  // then append an AuditLog record. Do not mark as paid on resident submission.
  throw new Error("Backend endpoint not activated. Complete identity verification and API deployment first.");
}

function createDailyReminderTrigger() {
  // Run once from the Apps Script editor after configuring reminder policy.
  ScriptApp.newTrigger("sendDailyOverdueSummary_").timeBased().everyDays(1).atHour(9).create();
}

function sendDailyOverdueSummary_() {
  // TODO: read overdue bills, email authorised management address,
  // and append each reminder/report event to ReminderLog.
  // Do not send resident notices until contact details and approved wording are confirmed.
}
