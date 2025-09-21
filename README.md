## 🔹 What is the business of **BOCOM**?

From all the requirements we’ve been building:

* **BOCOM** operates in the **fuel distribution and retail sector** (gas stations, corporate fuel management, POS at stations, loyalty programs, etc.).
* Its ecosystem includes:

  1. **MY_BOCOM Mobile App** → for individual and corporate customers to buy fuel, transfer fuel, recharge wallets, manage loyalty & rewards, view transactions, etc.
  2. **POS App** → used at gas stations by attendants/operators to accept payments, scan QR codes, and manage transactions (must work offline if internet is down).
  3. **Partner Dashboard** → for corporate clients/fleet managers and third-party merchants to manage company fuel usage, employees, and reporting.
  4. **Admin Portal** → for internal BOCOM staff to manage users, stations, KYC, fraud detection, rewards, pricing, reporting, and configurations.

👉 So, **BOCOM’s business** = *Digitizing the entire fuel retail ecosystem, providing seamless, secure, and multi-channel access to fuel purchase, transfer, and management.*

---

## 🔹 In the **Auth Service**, what areas are we covering?

Our **Auth microservice** is the **centralized security and identity layer** for all 4 applications (Mobile App, POS, Partner Dashboard, Admin Portal).

### ✅ Covered Areas

1. **User Registration & Onboarding**

   * Multi-step registration (Individual & Corporate)
   * Phone/email verification (OTP via AWS SNS/SES)
   * KYC document upload & verification lifecycle (pending → approved/rejected → resubmission → approval)

2. **Authentication & Session Management**

   * JWT-based access tokens (short-lived)
   * Refresh tokens stored in DB (`UserSessions`)
   * Multi-device login support
   * Logout (current session & all sessions)
   * Active session listing & selective revocation

3. **Authorization (RBAC)**

   * Role-based access (`Individual`, `CorporateAdmin`, `CorporateEmployee`, `POSOperator`, `Admin`)
   * Permissions tied to roles (e.g., KYC approval only for Admins)

4. **Security Enhancements**

   * Strong password validation + password history (reuse prevention)
   * Login rate limiting & brute force protection
   * Logging of IP, device, browser fingerprint
   * Email alerts on suspicious logins (“Was this you?” flow)
   * 2FA integration (via speakeasy, MS Authenticator support)

5. **Notifications** (integrated with SNS/SES)

   * OTP via SMS/Email
   * Login alerts (new device/IP)
   * KYC status notifications (approved/rejected with reason)

6. **Audit & Compliance**

   * Full logging of user actions (`UserActionLog`)
   * Notification logs (`NotificationLog`)
   * KYC history (`KYCDocumentHistory`) for regulatory compliance
   * Password change history (`PasswordChangeLog`)
---

## ✅ Why it matters for BOCOM’s business?

* The **Auth Service** ensures that **all fuel-related transactions** across **mobile, POS, partner, and admin** are **secure, traceable, and compliant**.
* It supports **corporate multi-user scenarios** (fleet managers, drivers, attendants), ensuring **controlled access**.
* It builds **trust** with customers by providing **strong security** (2FA, fraud alerts, KYC verification, audit logs).
* It helps **regulatory compliance** (AML/KYC laws, transaction logging).
