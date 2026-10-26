# 📦 Parcelo — Courier & Logistics Platform

Parcelo is a full-stack courier and logistics web application. Customers create and pay for shipments, couriers work their assigned deliveries and track earnings, and admins run the whole operation: users, zones, hubs, pricing, and audit logs.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**, and connected to a real REST backend with Stripe test-mode payments.

---

## 🔗 Project Links

| Item                  | Link                                              |
| --------------------- | ------------------------------------------------- |
| **Live Frontend**     | https://parcelo-beta.vercel.app              |
| **Live Backend**      | https://courier-logistics-server.vercel.app               |
| **Backend Repository**| https://github.com/asif938/courier-and-logistics-server  |
| **Frontend Repository** | https://github.com/asif938/parcelo              |
| **API Documentation** | https://documenter.getpostman.com/view/54902113/2sBYHQ2hrZ        |
| **Demo Video**        | https://drive.google.com/drive/folders/1eEnL24Gw4levsOXVtDTD2c_OBCP_9W5A?usp=sharing                    |


---

## 🔐 Demo Credentials

The login page has **one-click Demo Login** buttons for each of the three roles. You can also sign in manually:

| Role                  | Email                         | Password       | Lands on     |
| --------------------- | ----------------------------- | -------------- | ------------ |
| 👨‍💼 **Admin**          | `admin@courierlogistics.dev`  | `Passw0rd!123` | `/admin`     |
| 👤 **User (Customer)** | `alice@example.com`           | `Passw0rd!123` | `/dashboard` |
| 🛠️ **Provider (Courier)** | `carl@example.com`         | `Passw0rd!123` | `/provider`  |

---

## ✨ Features

### 👤 Customer
- Create shipments through a **3-step wizard** (Addresses → Parcel & service → Review) with Zod validation at every step
- Manage saved pickup and delivery addresses
- Browse, filter, sort, and paginate shipments; view full tracking history per shipment
- Request a pickup, edit shipment details, or cancel a shipment
- Pay for shipments through **Stripe Checkout (test mode)** with dedicated success and cancel pages
- Payment history, notifications, and profile management

### 🛠️ Provider (Courier)
- Personal task list of assigned shipments with status updates (picked up, in transit, out for delivery, delivered, failed attempt, and more)
- Earnings page with filters and pagination
- Availability toggle and courier profile settings

### 👨‍💼 Admin
- Analytics dashboard with **Recharts** (shipment status breakdown, courier utilization)
- Shipment management: filter, inspect, assign couriers, change status
- User management: search, filter, change role and account status
- Zones & hubs: full create, edit, and delete
- Pricing rules and an instant **quote tool**
- Editable public contact information
- Searchable **audit logs** with detail view

### 🌐 Public
- Home, About, Services, Pricing, and Contact pages with SEO metadata
- Working contact form connected to the backend

---

## 🧱 Tech Stack

| Category              | Technology                                                  |
| --------------------- | ----------------------------------------------------------- |
| **Framework**         | Next.js 16 (App Router), React 19, TypeScript               |
| **Styling & UI**      | Tailwind CSS 4, shadcn/ui, Radix UI, Lucide React           |
| **Server State**      | TanStack Query                                              |
| **Client State**      | Zustand (auth store, persisted recently-viewed shipments)   |
| **Forms & Validation**| React Hook Form + Zod (`@hookform/resolvers`)               |
| **Authentication**    | Custom JWT in HTTP-only cookies + route protection via `src/proxy.ts` |
| **Payments**          | Stripe Checkout (test mode), initiated through the backend  |
| **Charts**            | Recharts                                                    |
| **Notifications**     | Sonner toasts                                               |
| **Theming**           | next-themes (light, dark, system)                           |

---

## 🏗️ Architecture Highlights

- **Server Components by default**; `"use client"` is used only for interactive pieces (forms, filters, dialogs, charts, providers).
- **Route groups**: `(marketing)` for public pages and `(auth)` for login and register, each with its own layout.
- **Protected areas** `/dashboard`, `/provider`, and `/admin` each have their own `layout.tsx`, `loading.tsx` (skeletons), and `error.tsx`. There is also a global `error.tsx` and a custom `not-found.tsx`.
- **Role-based access at two levels**:
  - *Route level*: `src/proxy.ts` validates the JWT cookie, redirects unauthenticated users to `/login?callbackUrl=...`, and sends users who open another role's area back to their own home. Signed-in users are also redirected away from `/login` and `/register`.
  - *UI level*: sidebar navigation and page content render per role (`nav-config.ts`).
- **Backend-for-frontend proxy**: the browser calls Next.js route handlers under `src/app/api/*`, which forward requests to the backend with the user's token from HTTP-only cookies. Tokens are never exposed to client JavaScript.
- **URL state synchronization**: filters, search, sorting, and pagination on shipments, payments, earnings, users, and audit logs are stored in the URL via `useSearchParams`, so every view is bookmarkable and shareable.
- **Optimistic updates**: shipment edits, status changes, and deletions update the TanStack Query cache instantly and roll back on failure (`use-optimistic-shipment-patch.ts`).
- **Server-side validation errors** from the API are mapped back onto form fields (`apply-server-errors.ts`).
- **Reusable building blocks**: `StatCard`, shared form field components, `StepIndicator`, `ErrorState`, page skeletons, and custom hooks such as `useDebouncedValue`, `useMultiStepForm`, and `useAuth`.

---

## 🗺️ Routes

### Public
| Route       | Description                      |
| ----------- | -------------------------------- |
| `/`         | Landing page                     |
| `/about`    | About                            |
| `/services` | Services                         |
| `/pricing`  | How pricing works                |
| `/contact`  | Contact form                     |
| `/login`    | Login with one-click demo buttons|
| `/register` | Registration                     |

### Customer — `/dashboard`
| Route                         | Description              |
| ----------------------------- | ------------------------ |
| `/dashboard`                  | Overview                 |
| `/dashboard/shipments`        | My shipments             |
| `/dashboard/shipments/new`    | Create shipment (wizard) |
| `/dashboard/shipments/[id]`   | Shipment details & tracking |
| `/dashboard/payments`         | Payment history          |
| `/dashboard/profile`          | Profile & addresses      |

### Provider — `/provider`
| Route                       | Description              |
| --------------------------- | ------------------------ |
| `/provider`                 | My tasks                 |
| `/provider/shipments`       | Assigned shipments       |
| `/provider/shipments/[id]`  | Task details & status updates |
| `/provider/earnings`        | Earnings                 |
| `/provider/profile`         | Profile & availability   |

### Admin — `/admin`
| Route                    | Description                    |
| ------------------------ | ------------------------------ |
| `/admin`                 | Analytics overview with charts |
| `/admin/shipments`       | Shipment management            |
| `/admin/shipments/[id]`  | Shipment details, assign courier, update status |
| `/admin/users`           | User management                |
| `/admin/zones-hubs`      | Zones and hubs                 |
| `/admin/pricing`         | Pricing rules & quote tool     |
| `/admin/contact`         | Public contact settings        |
| `/admin/audit-logs`      | Audit logs                     |

### Payments & Utility
| Route               | Description                |
| ------------------- | -------------------------- |
| `/payments/success` | Stripe success redirect    |
| `/payments/cancel`  | Stripe cancel redirect     |
| `not-found.tsx`     | Custom 404                 |
| `error.tsx`         | Global error boundary      |

---

## 🚚 Shipment Lifecycle

```
CREATED → PICKUP_SCHEDULED → COURIER_ASSIGNED → PICKED_UP → AT_ORIGIN_HUB
        → IN_TRANSIT → AT_DESTINATION_HUB → OUT_FOR_DELIVERY → DELIVERED

Exception states: FAILED_DELIVERY_ATTEMPT · RETURN_TO_SENDER · RETURNED · CANCELLED
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (marketing)/        # Public pages
│   ├── (auth)/             # Login & register
│   ├── dashboard/          # Customer area
│   ├── provider/           # Courier area
│   ├── admin/              # Admin area
│   ├── payments/           # Stripe success & cancel pages
│   └── api/                # Route handlers that proxy to the backend
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Shell, sidebar, header, nav config
│   ├── shipments/ admin/ payments/ earnings/ profile/ auth/ forms/ charts/ dashboard/
│   └── providers/          # Auth, query, and theme providers
├── hooks/                  # TanStack Query hooks & utility hooks
├── lib/
│   ├── api/                # Backend fetch + proxy helpers
│   ├── auth/               # JWT decoding, cookie helpers, session
│   ├── validations/        # Zod schemas
│   └── routes.ts           # Role → route mapping
├── stores/                 # Zustand stores
├── types/                  # API & domain TypeScript types
└── proxy.ts                # Route protection & role redirects
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 20 or newer
- npm
- The Parcelo backend API running locally or deployed

### 1. Clone and install

```bash
git clone https://github.com/asif938/parcelo.git
cd parcelo
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Base URL of the backend API (include the /api/v1 prefix)
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Public URL of this frontend (used for payment redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

If these are not set, the app falls back to the defaults shown above.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the development server  |
| `npm run build` | Create a production build     |
| `npm start`     | Run the production build      |
| `npm run lint`  | Lint with ESLint              |

---

## 💳 Testing Payments

Payments run in Stripe **test mode**. On a shipment with an unpaid balance, click **Pay now**. You are redirected to Stripe Checkout, then back to `/payments/success` or `/payments/cancel`.

Use Stripe's test card:

| Field  | Value                 |
| ------ | --------------------- |
| Card   | `4242 4242 4242 4242` |
| Expiry | Any future date       |
| CVC    | Any 3 digits          |

---

## 🚀 Deployment

The frontend is deployed on **Vercel**. Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_APP_URL` in the project's environment variables, and make sure the backend allows your frontend origin in its CORS configuration.

---

## 👤 Author

**Asif** — [@asif938](https://github.com/asif938)