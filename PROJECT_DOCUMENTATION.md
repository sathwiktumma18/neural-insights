# NeuralDecide — Complete Project Documentation

> **AI-Powered Decision Intelligence Platform**
> A full-featured web application that transforms raw data into actionable insights using machine learning across Education, Healthcare, Business, and Finance domains.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [How the App Works — User Flow](#4-how-the-app-works--user-flow)
5. [Pages & Features (Detailed)](#5-pages--features-detailed)
   - [Landing Page](#51-landing-page)
   - [Authentication (Login / Sign Up / Forgot Password)](#52-authentication)
   - [Dashboard Home](#53-dashboard-home)
   - [Data Management](#54-data-management)
   - [AI Analysis](#55-ai-analysis)
   - [Intelligent Decisions](#56-intelligent-decisions)
   - [Reports](#57-reports)
   - [Alerts & Notifications](#58-alerts--notifications)
   - [Domain Insights](#59-domain-insights)
   - [Settings](#510-settings)
   - [Profile](#511-profile)
6. [Navigation & Layout](#6-navigation--layout)
7. [Backend & Database (Supabase)](#7-backend--database-supabase)
8. [Design System & UI](#8-design-system--ui)
9. [Supported Domains & Use Cases](#9-supported-domains--use-cases)
10. [Running the Project](#10-running-the-project)
11. [Key Metrics & KPIs Displayed](#11-key-metrics--kpis-displayed)

---

## 1. Project Overview

**NeuralDecide** (named from the project folder `neural-insights`) is an enterprise-grade AI decision intelligence platform. It allows users (analysts, domain experts, administrators) to:

- Upload datasets (CSV, Excel, JSON)
- Run machine learning models (Classification, Regression, Clustering, Time-Series)
- Generate AI-powered decisions with confidence scores and reasoning breakdowns
- View domain-specific insights (Education, Healthcare, Business, Finance)
- Create, schedule, and export reports
- Set up alert rules to monitor model performance
- Manage team members and API keys

The project is structured entirely as a frontend React application with Supabase handling authentication and the backend database.

---

## 2. Technology Stack

| Category          | Technology                                  |
|-------------------|---------------------------------------------|
| **Framework**     | React 18 + TypeScript                       |
| **Build Tool**    | Vite 5                                      |
| **Routing**       | React Router DOM v6                         |
| **State/Data**    | TanStack React Query v5                     |
| **Backend/Auth**  | Supabase (PostgreSQL + Auth)                |
| **Styling**       | Tailwind CSS v3 + custom CSS variables      |
| **UI Components** | shadcn/ui (Radix UI primitives)             |
| **Charts**        | Recharts                                    |
| **Animations**    | Framer Motion                               |
| **Icons**         | Lucide React                                |
| **Forms**         | React Hook Form + Zod (validation)          |
| **Testing**       | Vitest + Testing Library                    |
| **Dev Server**    | npm run dev → `http://localhost:8080`        |

---

## 3. Project Structure

```
neural-insights-main/
├── src/
│   ├── App.tsx              # Root app — defines all routes
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles & CSS tokens
│   ├── App.css              # App-level styles
│   ├── pages/               # One file per page/screen
│   │   ├── Landing.tsx          # Public landing page
│   │   ├── Login.tsx            # Login screen (Supabase auth)
│   │   ├── SignUp.tsx           # Registration screen
│   │   ├── ForgotPassword.tsx   # Password recovery (email OTP)
│   │   ├── ResetPassword.tsx    # Set new password
│   │   ├── DashboardHome.tsx    # Main dashboard overview
│   │   ├── DataUpload.tsx       # Dataset management
│   │   ├── AIAnalysis.tsx       # Run ML models
│   │   ├── Decisions.tsx        # AI decision engine
│   │   ├── Reports.tsx          # Report generation & library
│   │   ├── Alerts.tsx           # Alerts & notification rules
│   │   ├── DomainInsights.tsx   # Industry-specific analytics
│   │   ├── SettingsPage.tsx     # App preferences & admin
│   │   ├── Profile.tsx          # User profile
│   │   ├── Index.tsx            # Redirect handler
│   │   └── NotFound.tsx         # 404 page
│   ├── components/
│   │   ├── DashboardLayout.tsx  # Sidebar + header shell for all dashboard pages
│   │   ├── NavLink.tsx          # Active-state-aware nav link
│   │   ├── NeuralBackground.tsx # Animated neural network canvas background
│   │   └── ui/                  # All shadcn/ui components (Button, Input, Select, etc.)
│   ├── hooks/                   # Custom React hooks (use-toast, use-mobile, etc.)
│   ├── integrations/
│   │   └── supabase/            # Supabase client setup & type exports
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn, classnames)
│   └── test/                    # Vitest test files
├── supabase/
│   └── config.toml              # Supabase project config
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── vite.config.ts               # Vite configuration (port 8080)
├── tailwind.config.ts           # Tailwind theme customization
└── .env                         # Supabase environment variables
```

---

## 4. How the App Works — User Flow

```
User visits http://localhost:8080
         ↓
   [Landing Page]
   - See features, domains, CTA
         ↓
 [Sign Up / Login] ← Supabase Auth
         ↓
   [Dashboard] (protected by session check)
         ↓
   ┌─────────────────────────────────────┐
   │  Sidebar Navigation                 │
   │  • Dashboard Home  (overview KPIs)  │
   │  • Data Upload     (manage datasets)│
   │  • AI Analysis     (run ML models)  │
   │  • Decisions       (AI decisions)   │
   │  • Reports         (generate/export)│
   │  • Alerts          (rules & history)│
   │  • Domain Insights (4 industries)   │
   │  • Settings        (prefs & admin)  │
   │  • Profile         (user account)   │
   └─────────────────────────────────────┘
         ↓
   [Logout] → Back to /login
```

**Authentication Guard:** The `DashboardLayout` uses `supabase.auth.onAuthStateChange` — if no active session is found, the user is automatically redirected to `/login`.

---

## 5. Pages & Features (Detailed)

### 5.1 Landing Page
**Route:** `/`

The public-facing marketing page. Contains:

| Section        | Description |
|----------------|-------------|
| **Navigation** | NeuralDecide logo + Login and Sign Up buttons |
| **Hero**       | Animated headline "Decisions Powered by Intelligence", subtext about ML capabilities, CTA buttons ("Get Started Free", "Sign In") |
| **Features**   | 4 feature cards: AI-Powered Analysis, Real-time Insights, Instant Decisions, Enterprise Security |
| **Domains**    | 4 domain cards with gradient icons: Education, Healthcare, Business, Finance |
| **CTA Banner** | "Ready to Make Smarter Decisions?" with Start Free Trial button |
| **Footer**     | Copyright and logo |

**Special effect:** Animated neural network/circuit board background rendered on a `<canvas>` element (`NeuralBackground.tsx`) with glowing dots and connecting lines.

---

### 5.2 Authentication

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Email + password login via Supabase. Show/hide password toggle. Redirects to `/dashboard` on success. |
| **Sign Up** | `/signup` | Registration form with full name, domain selection, email, password & confirm password. Creates a Supabase user. |
| **Forgot Password** | `/forgot-password` | Enter email to receive OTP/reset link via Supabase email. |
| **Reset Password** | `/reset-password` | Set a new password using the reset link from email. |

All auth forms use real Supabase authentication (`supabase.auth.signInWithPassword`, `signUp`, `resetPasswordForEmail`).

---

### 5.3 Dashboard Home
**Route:** `/dashboard`

The main overview screen shown after login.

**KPI Cards (4):**
- Total Analyses: `1,248` (+12% from last month)
- Decision Accuracy: `94.7%` (+2.3%)
- Data Points: `2.4M` (+18%)
- Active Models: `12` (+3)

**Charts (2):**
- **Line Chart** — Decision Accuracy Over Time (Jan–Jun, trending from 88% → 94.7%)
- **Bar Chart** — Domain-wise Usage (Education: 340, Healthcare: 290, Business: 420, Finance: 198)

**Recent Activity Feed:** Shows last 5 events (analyses, uploads, reports, alerts) with colored status dots (green/yellow/blue) and timestamps.

**Quick Actions:** 3 shortcut buttons → Upload Data, Run Analysis, View Reports.

---

### 5.4 Data Management
**Route:** `/dashboard/data`

For uploading and managing datasets.

**Upload Zone:**
- Drag-and-drop area supporting CSV, Excel (.xlsx), and JSON files up to 50MB
- Changes border color on drag-over
- Shows a toast notification on drop/click

**Dataset Library (table):**

| Column  | Info |
|---------|------|
| Name    | File name with icon |
| Domain  | Business / Healthcare / Education / Finance |
| Rows    | Number of data rows |
| Size    | File size in MB |
| Status  | Ready (green) / Processing (yellow) |
| Actions | Preview table, Download, Delete |

**Search Bar:** Filter datasets by name or domain in real-time.

**Example datasets shown:**
- `sales_q4_2025.csv` — 15,420 rows, Business, 2.4 MB
- `patient_records.json` — 42,300 rows, Healthcare, 8.1 MB
- `student_scores.csv` — 8,900 rows, Education, 1.2 MB
- `transactions_2025.xlsx` — 31,200 rows, Finance, 5.7 MB

---

### 5.5 AI Analysis
**Route:** `/dashboard/analysis`

A 4-step wizard for configuring and running ML models.

**Step 1 — Select Dataset:**
Choose from uploaded datasets (sales_q4_2025.csv, patient_records.json, student_scores.csv).

**Step 2 — Choose ML Model:**
- Classification
- Regression
- Clustering
- Time-Series Forecasting

**Step 3 — Configure Parameters:**
Displays auto-configured settings:
- Train/Test Split: 80% / 20%
- Feature Selection: Auto (PCA)
- Cross Validation: 5-Fold
- Hyperparameters: Auto-tuned

**Step 4 — Run & Results:**
- Animated progress bar (0–100%) while running
- After completion shows:
  - **Metrics:** Accuracy (94.2%), Precision (93.8%), Recall (92.1%), F1 Score (92.9%)
  - **Feature Importance Bar Chart** (horizontal): Age 89%, Income 76%, History 72%, Location 58%, Score 45%
  - **AI Summary:** Text summary recommending the model for production
  - **Export buttons:** PDF and CSV

**Analysis History Table:**
Shows past runs (A-001 through A-004) with model type, dataset, accuracy, and status (Completed/Running/Failed) with colored badges.

---

### 5.6 Intelligent Decisions
**Route:** `/dashboard/decisions`

AI-powered decision engine that generates recommendations with confidence scoring.

**Decision Engine Panel:**
1. Select Dataset/Scenario (from existing datasets)
2. Select Trained Model (from completed analyses)
3. Click "Generate Decision"

**Decision Output (example — Loan Approval):**
- **Decision:** "Approve Loan Application" — Confidence: **94%** (with progress bar)
- **Reasoning Breakdown:**
  - ✅ Credit score above threshold (720+)
  - ✅ Stable income for 3+ years
  - ⚠️ Debt-to-income ratio slightly elevated (32%)
- **Alternatives with scores:**
  - Conditional Approval: 88%
  - Reduced Amount: 79%
  - Deny: 6%

**Decision Log Table:**
Searchable table of past decisions:
| ID | Scenario | Model | Confidence | Decision | Domain |
|----|----------|-------|------------|----------|--------|
| D-001 | Loan Approval — Applicant #4821 | Classification | 94% | Approve | Finance |
| D-002 | Student Dropout Risk — ID #1129 | Classification | 87% | High Risk | Education |
| D-003 | Sales Forecast Q2 2026 | Time-Series | 91% | $2.4M projected | Business |
| D-004 | Treatment Plan — Patient #773 | Regression | 82% | Plan B Recommended | Healthcare |

---

### 5.7 Reports
**Route:** `/dashboard/reports`

For generating, viewing, and scheduling analytical reports.

**Generate Report Panel:**
- Select Source (specific analysis, specific decision, or all recent data)
- Select Report Type (Summary / Detailed / Comparative)
- Click Generate

**Reports Library (table):**
| ID | Title | Type | Date | Pages |
|----|-------|------|------|-------|
| R-001 | Monthly Performance Summary | Summary | 2026-03-01 | 12 |
| R-002 | Q1 2026 Domain Comparison | Comparative | 2026-02-28 | 24 |
| R-003 | Healthcare Model Deep Dive | Detailed | 2026-02-20 | 38 |
| R-004 | Weekly Accuracy Trends | Summary | 2026-03-08 | 6 |

Each report has **Download** and **Share** action buttons.

**Scheduled Reports:**
- Weekly KPI Summary — next: 2026-03-15
- Monthly Analysis Digest — next: 2026-04-01
  
Supports "Add Schedule" for automation.

---

### 5.8 Alerts & Notifications
**Route:** `/dashboard/alerts`

Monitor model performance and get notified on threshold violations.

**Alert Rules (configurable):**
| Rule | Condition | Status |
|------|-----------|--------|
| Low Accuracy Alert | Accuracy drops below 80% | Active |
| Data Quality Warning | Null values exceed 10% | Active |
| Model Drift Detection | Feature distribution shift > 15% | Paused |

Each rule can be deleted. New rules can be added via "New Rule" button.

**Notification History:**
- ⚠️ Accuracy dropped to 78.2% on model A-004 — 5 hr ago
- ✅ Analysis A-003 completed successfully — 1 hr ago
- ℹ️ New dataset uploaded: transactions_2025.xlsx — 2 hr ago
- ℹ️ Scheduled report generated: Weekly KPI Summary — 6 hr ago

---

### 5.9 Domain Insights
**Route:** `/dashboard/domain-insights`

Industry-specific AI analytics panels for all 4 domains.

#### 🎓 Education
- **KPIs:** 12,450 Students Analyzed | 234 Dropout Risk Alerts | 91.3% Prediction Accuracy
- **Use Cases:** 
  - Student performance prediction (attendance + grades + engagement)
  - Dropout risk scoring with early intervention
  - Course recommendation using aptitude analysis
- **Demo:** Student #4821 Dropout Risk → 23% → **Low Risk**

#### 🏥 Healthcare
- **KPIs:** 8,920 Patients Processed | 1,340 Diagnoses Assisted | 93.7% Treatment Accuracy
- **Use Cases:**
  - Patient diagnosis via symptom pattern analysis
  - Treatment recommendation scoring by patient history
  - Hospital resource allocation optimization
- **Demo:** Patient #773 Treatment Score → 87% → **Plan B Recommended**

#### 📈 Business
- **KPIs:** 3,210 Forecasts Generated | 890 Churn Predictions | 89.5% Forecast Accuracy
- **Use Cases:**
  - Sales forecasting with seasonal trends
  - Customer churn prediction + retention strategies
  - Market segmentation using clustering
- **Demo:** Q2 Sales Forecast Confidence → 91% → **$2.4M Projected**

#### 🏦 Finance
- **KPIs:** 1.2M Transactions Analyzed | 47 Fraud Detected | 97.1% Detection Rate
- **Use Cases:**
  - Loan/credit risk assessment
  - Real-time fraud detection scoring
  - Portfolio optimization
- **Demo:** Transaction #99201 Fraud Score → 8% → **Legitimate**

---

### 5.10 Settings
**Route:** `/dashboard/settings`

Application configuration and admin controls.

| Section | Options |
|---------|---------|
| **General** | Dark Mode toggle (default: on), Language (English) |
| **Notifications** | Email Notifications toggle, In-App Notifications toggle |
| **API Keys** | View/regenerate Production API key (masked: `sk-•••4f2a`) |
| **Team Management** | Invite team members (admin only) |
| **Audit Log** | View all user actions with timestamps (admin only) |

---

### 5.11 Profile
**Route:** `/dashboard/profile`

User account page showing:
- Display name and email from Supabase user metadata
- Domain selection
- Account information

---

## 6. Navigation & Layout

The dashboard uses a persistent **sidebar layout** (`DashboardLayout.tsx`):

### Sidebar
- **Collapsible**: Can be toggled between full (264px) and icon-only (64px) mode
- **Mobile responsive**: Slides in as an overlay on mobile with hamburger menu
- **Active state**: Current page highlighted with a left border accent + background tint
- **Nav items**: Dashboard, Data Upload, AI Analysis, Decisions, Reports, Alerts, Domain Insights, Settings, Profile
- **Logout button** at the bottom

### Top Header Bar
- Hamburger menu (mobile)
- User domain badge (e.g., "general", "education")
- Bell icon with notification dot
- User avatar (initial circle) + name

---

## 7. Backend & Database (Supabase)

The app uses **Supabase** as the backend-as-a-service:

| Feature | How it's used |
|---------|--------------|
| **Authentication** | Email/password sign up, login, logout, password reset |
| **Session management** | `supabase.auth.onAuthStateChange` in DashboardLayout guards all dashboard routes |
| **User metadata** | Full name and domain stored in `user_metadata` on sign up |
| **Environment vars** | Supabase URL and anon key stored in `.env` |

> **Note:** The current build uses **mock/demo data** for datasets, analyses, decisions, and reports. The Supabase integration is active for authentication only. The rest of the features are ready for backend integration via the Supabase database tables.

---

## 8. Design System & UI

### Visual Theme
- **Color scheme:** Dark-first design with deep navy background (`hsl(220, 47%, 11%)`)
- **Primary accent:** Cyan/neon blue (`hsl(191, 100%, 50%)`) — used for active elements, icons, buttons
- **Secondary:** Purple/violet (`hsl(262, 100%, 59%)`) — used in charts
- **Success:** Green for positive statuses
- **Warning:** Amber for alerts
- **Glassmorphism:** Cards use `glass-card` class — semi-transparent with backdrop blur

### Animation
- **Framer Motion** for page-level entrance animations (fade + slide up)
- **Staggered children** animations on card grids
- **Progress bars** animate during analysis runs
- **NeuralBackground**: Canvas animation of randomly moving nodes with connecting lines

### Typography
- Headings: Custom `font-heading` (distinct from body)
- Body: System UI via Tailwind defaults

### Components (shadcn/ui)
All interactive elements use accessible Radix UI primitives:
Button, Input, Label, Select, Progress, Switch, Dialog, Toast, Tooltip, and many more — all styled with Tailwind.

---

## 9. Supported Domains & Use Cases

| Domain | ML Task Type | Example Scenario |
|--------|-------------|-----------------|
| **Education** | Classification | Student dropout risk scoring |
| **Healthcare** | Regression | Treatment plan recommendation |
| **Business** | Time-Series | Q2 sales revenue forecasting |
| **Finance** | Classification | Loan approval / fraud detection |

---

## 10. Running the Project

### Prerequisites
- Node.js 18+ and npm installed

### Steps
```bash
# 1. Navigate to project directory
cd neural-insights-main

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Access
- Open browser at: **http://localhost:8080**
- Default port is 8080 (configured in `vite.config.ts`)

### Other Scripts
```bash
npm run build       # Production build
npm run preview     # Preview production build
npm run test        # Run Vitest tests
npm run lint        # Run ESLint
```

### Environment Variables (`.env`)
```
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## 11. Key Metrics & KPIs Displayed

| Metric | Value | Location |
|--------|-------|----------|
| Total Analyses | 1,248 | Dashboard Home |
| Decision Accuracy | 94.7% | Dashboard Home |
| Data Points | 2.4M | Dashboard Home |
| Active Models | 12 | Dashboard Home |
| Students Analyzed | 12,450 | Domain Insights - Education |
| Patients Processed | 8,920 | Domain Insights - Healthcare |
| Forecasts Generated | 3,210 | Domain Insights - Business |
| Transactions Analyzed | 1.2M | Domain Insights - Finance |
| Fraud Detection Rate | 97.1% | Domain Insights - Finance |
| Dropout Prediction Accuracy | 91.3% | Domain Insights - Education |
| Treatment Accuracy | 93.7% | Domain Insights - Healthcare |
| Sales Forecast Accuracy | 89.5% | Domain Insights - Business |

---

*Documentation generated from full source code analysis of the NeuralDecide project.*
*Last updated: March 2026*
