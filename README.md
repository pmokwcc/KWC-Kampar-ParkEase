# ParkEase — Condo Parking Manager (starter project)

A starter web application for a 20–50 bay condo parking rental operation.

## Included
- `index.html`, `styles.css`, `app.js`: responsive frontend prototype.
- `Code.gs`: Google Apps Script database setup and backend security scaffolding.
- `schema.json`: proposed Google Sheets data model.

## Important status
The browser app is currently a **local demo**. It uses fictional sample data and browser localStorage. It is not connected to Google Sheets, real authentication, email, bank feeds or receipt storage. Do not enter real resident personal information in this demo.

## Proposed production architecture
1. GitHub Pages serves the static frontend.
2. Firebase Authentication (or equivalent trusted identity provider) authenticates staff and residents.
3. A secure backend verifies identity tokens and authorises roles.
4. Google Apps Script / a secured API writes to Google Sheets.
5. Scheduled Apps Script triggers create bills and send management reminders.

Do not expose a spreadsheet ID, service-account key, API secret, Firebase Admin credential or other private secret in GitHub frontend files. GitHub Pages is public static hosting; it is not an access-control system.

## Suggested Google Sheets tabs
- Residents
- Bills
- Payments
- ReminderLog
- Users
- AuditLog

## Setup outline
1. Create a private GitHub repository for source control. (GitHub Pages publishes static site files; assume the published frontend is publicly reachable.)
2. Create a Google Sheet owned by the condo/management organisation.
3. Open Extensions → Apps Script, add `Code.gs`, and set `SPREADSHEET_ID` in Project Settings → Script Properties.
4. Run `setupDatabase()` from the Apps Script editor and authorise it.
5. Configure Firebase Authentication and register authorised users. Map each verified UID/email to `staff` or `resident` in the Users tab.
6. Implement server-side ID-token verification and role/ownership checks before exposing API methods.
7. Connect the frontend to the secured API. For a production deployment, use a backend/API gateway with explicit CORS, authentication, rate limits and audit logging; do not rely on client-side role switching.
8. Test with a staff test account and two resident accounts. Confirm resident A cannot read resident B's records.
9. Enable scheduled billing and reminder triggers only after due dates and notice wording are approved by management.

## Core business rules
- A resident payment submission creates a Pending claim, not a paid bill.
- Staff verify transfers against actual bank records.
- Only Verified payments reduce bill balances.
- A single payment covering multiple months must be split into explicit allocation rows.
- Keep payment history immutable; use reversals/adjustments with audit records.
- Use unique IDs for residents, bills and transactions.
- Restrict access to personal data to authorised management staff.

## Demo
Open `index.html` in a browser. Use the role selector to preview Staff and Resident screens. The resident preview is hard-coded to Sample Resident A and is not real authentication.
