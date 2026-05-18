# NeoBank — Retail & Admin Banking Interface

A secure, role-based React SPA engineered for digital banking operations. Built with Vite, Tailwind CSS, and DaisyUI.

> 🔗 **Backend API Repository:** [View the Node.js Backend Here](https://github.com/mahoozi97/neobank-backend)

---

## Tech Stack

| Layer        | Technology             |
| ------------ | ---------------------- |
| Framework    | React (Vite)           |
| UI / Styling | Tailwind CSS + DaisyUI |
| Routing      | React Router           |
| HTTP Client  | Axios                  |

---

## 📸 Screenshots

<details>
<summary>Click to expand gallery</summary>

### Auth
| Page | Light | Dark |
|---|---|---|
| Sign Up | <img src="screenshots/user-light/sign-up.png"> | <img src="screenshots/user-dark/sign-up.png"> |
| Sign In | <img src="screenshots/user-light/sign-in.png"> | <img src="screenshots/user-dark/sign-in.png"> |

### User
| Page | Light | Dark |
|---|---|---|
| Homepage | <img src="screenshots/user-light/homepage.png"> | <img src="screenshots/user-dark/homepage.png"> |
| Open Account | <img src="screenshots/user-light/open-account.png"> | <img src="screenshots/user-dark/open-account.png"> |
| Account Form | <img src="screenshots/user-light/account-form.png"> | <img src="screenshots/user-dark/account-form.png"> |
| Account Summary | <img src="screenshots/user-light/account-summary.png"> | <img src="screenshots/user-dark/account-summary.png"> |
| Profile | <img src="screenshots/user-light/profile.png"> | <img src="screenshots/user-dark/profile.png"> |
| Upload Document | <img src="screenshots/user-light/upload-kyc.png"> | <img src="screenshots/user-dark/upload-kyc.png"> |

### Admin
| Page | Light | Dark |
|---|---|---|
| Dashboard | <img src="screenshots/admin-light/dashboard.png"> | <img src="screenshots/admin-dark/dashboard.png"> |
| Account Summary | <img src="screenshots/admin-light/account-summary.png"> | <img src="screenshots/admin-dark/account-summary.png"> |
| User KYC | <img src="screenshots/admin-light/user-kyc.png"> | <img src="screenshots/admin-dark/user-kyc.png"> |
| Audit Logs | <img src="screenshots/admin-light/audit-log.png"> | <img src="screenshots/admin-dark/audit-log.png"> |

</details>

---

## Route Architecture

Access is enforced at the route level via two protected wrappers:

- `UserRoute` — accessible to authenticated users only
- `AdminRoute` — accessible to admin role only

```
/
├── (UserRoute)
│   ├── dashboard
│   ├── profile
│   ├── upload-kyc
│   ├── open-account
│   └── transfer
│
└── (AdminRoute)
    ├── admin/dashboard
    ├── admin/account-summary
    ├── admin/kyc
    └── admin/logs
```

---

## Pages

### User Pages

**`/dashboard`**

The primary banking view. Conditionally renders based on account status:

- If no account exists → shows an **Open Account** button
- If account exists →
  - Account details and current balance
  - Recent transaction history
  - **Freeze / Activate** account toggle (instant, real-time)
  - Quick navigation to the transfer form

**`/profile`**

- Personal user details
- Most recent KYC document submission and its current status (`pending`, `approved`, `rejected`)

**`/upload-kyc`**

Adaptive multi-part document uploader:

- Selecting **Passport** → single document upload
- Selecting **Identity Card** → dual upload (front + back)
- Re-submission is only allowed if the previous request was `rejected`

**`/open-account`**

Account creation form. Account type defaults to `savings`.

**`/transfer`**

Smart transfer interface:

- Recipient lookup by **IBAN** or **Mobile Number**
- Real-time account verification before submission
- Dynamic transfer limit warnings based on the user's KYC tier.

---

### Admin Pages

**`/admin/dashboard`**

Central user registry table:

- Search users by **Name** or **CPR**
- **Block / Activate** user actions per row
- Navigate to a user's **Account Summary** or **KYC Review** page directly from the table

**`/admin/account-summary`**

Full account summary for a selected user — balance, account details, and transaction history with `status` and `date` filters.

**`/admin/kyc`**

KYC review panel:

- Side-by-side view of uploaded identity documents (Cloudinary)
- **Approve** action → sets user to `verified`
- **Reject** action → requires a reason comment before submission

**`/admin/logs`**

Paginated audit log viewer with filtering by `action` type (login, transfer, freeze, KYC events, etc.).

---

## Security

- Route-level guards via `UserRoute` and `AdminRoute` components
- JWT token attached to all Axios requests via an interceptor
- Admin paths are protected on both the frontend and the backend middleware

---

## KYC Transfer Limits

| KYC Status   | Max Transfer |
| ------------ | ------------ |
| `unverified` | 100 BHD      |
| `verified`   | 3000 BHD     |

Enforced on both the frontend (UI warning) and the backend (middleware validation).

---

## Deployment

The app is live at: [https://neobank-frontend.netlify.app](https://neobank-frontend.netlify.app)

> ⚠️ **Render Free Tier Note:** The backend is hosted on Render's free plan. If the live frontend feels stuck or isn't loading data, the backend server is likely asleep. You can wake it up manually by clicking this link and waiting ~1 minute for it to load: [https://neobank-backend-z6vx.onrender.com](https://neobank-backend-z6vx.onrender.com)