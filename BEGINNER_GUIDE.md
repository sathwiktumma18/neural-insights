# 🧠 NeuralDecide — Complete Beginner Guide
### *Everything you need to know, step by step*

---

## 📋 Table of Contents
1. [What is NeuralDecide?](#1-what-is-neuraldecide)
2. [What You Need Before Starting](#2-what-you-need-before-starting)
3. [Opening the Project in VS Code](#3-opening-the-project-in-vs-code)
4. [Understanding the Project Folder Structure](#4-understanding-the-folder-structure)
5. [Installing Dependencies](#5-installing-dependencies)
6. [Running the Project](#6-running-the-project)
7. [Logging In](#7-logging-in)
8. [Every Page Explained — Section by Section](#8-every-page-explained)
9. [How the Technology Works Together](#9-how-the-technology-works-together)
10. [Common Problems & Fixes](#10-common-problems--fixes)
11. [How to Edit / Add Things](#11-how-to-edit--add-things)

---

## 1. What is NeuralDecide?

**NeuralDecide** is an **AI-powered business decision platform** built as a web application.

Think of it as a **smart dashboard** that helps businesses:
- 📊 Upload and manage data (CSV, Excel, JSON files)
- 🤖 Run machine learning models to find patterns in that data
- 📈 Forecast future trends (sales, demand, revenue)
- 🔔 Get alerts when something unusual happens
- 📑 Automatically generate business reports
- 🎯 Make intelligent decisions backed by AI

**It is currently a front-end demo app** — all data is simulated/mock, and it uses Supabase only for user login/signup.

---

## 2. What You Need Before Starting

You need to install these tools on your computer **once**:

### Step 2.1 — Install Node.js
Node.js lets you run JavaScript on your computer and is required to run this project.

1. Go to 👉 **https://nodejs.org**
2. Download the **LTS** version (green button)
3. Run the installer — click Next → Next → Install → Finish
4. To verify it worked, open a terminal and type:
   ```
   node --version
   ```
   You should see something like `v20.x.x` ✅

### Step 2.2 — Install VS Code
VS Code is a free code editor by Microsoft.

1. Go to 👉 **https://code.visualstudio.com**
2. Download and install it
3. Open VS Code after installation

### Step 2.3 — Install useful VS Code Extensions (Optional but helpful)
Inside VS Code, click the Extensions icon (looks like 4 squares on the left sidebar) and search for:
- **"ES7+ React/Redux/React-Native snippets"** — helps with React code
- **"Tailwind CSS IntelliSense"** — auto-completes Tailwind CSS classes
- **"Prettier - Code formatter"** — keeps your code tidy

---

## 3. Opening the Project in VS Code

### Step 3.1 — Locate the project folder
Your project is located at:
```
C:\Users\\Downloads\neural-insights\neural-insights-main
```

### Step 3.2 — Open it in VS Code
**Option A — Drag and drop:**
Drag the `neural-insights-main` folder directly onto the VS Code window.

**Option B — From VS Code menu:**
1. Open VS Code
2. Click **File** → **Open Folder**
3. Navigate to `C:\Users\sathw\Downloads\neural-insights\neural-insights-main`
4. Click **Select Folder**

**Option C — From File Explorer:**
Right-click the `neural-insights-main` folder → **Open with Code**

You'll now see the project files in the left sidebar. ✅

---

## 4. Understanding the Folder Structure

```
neural-insights-main/
│
├── 📁 src/                        ← All your application code lives here
│   ├── 📁 pages/                  ← Each page of the app (one file = one page)
│   │   ├── Landing.tsx            → The public home/marketing page
│   │   ├── Login.tsx              → Login page
│   │   ├── SignUp.tsx             → Sign up page
│   │   ├── DashboardHome.tsx      → Main dashboard after login
│   │   ├── RealTimeMonitoring.tsx → Live data monitoring page
│   │   ├── Forecasting.tsx        → Time-series forecasting page
│   │   ├── DataUpload.tsx         → Upload & manage datasets
│   │   ├── AIAnalysis.tsx         → Run AI/ML models on data
│   │   ├── Decisions.tsx          → AI decision engine
│   │   ├── StrategyEngine.tsx     → Business strategy recommendations
│   │   ├── SimulationEngine.tsx   → Digital twin business simulator
│   │   ├── KnowledgeGraph.tsx     → Entity relationship graph
│   │   ├── Reports.tsx            → Generate & view reports
│   │   ├── Alerts.tsx             → Alert rules & notifications
│   │   ├── DomainInsights.tsx     → Industry-specific analytics
│   │   ├── SettingsPage.tsx       → App settings & business profile
│   │   └── Profile.tsx            → User profile
│   │
│   ├── 📁 components/             ← Reusable building blocks used across pages
│   │   ├── DashboardLayout.tsx    → The sidebar + header wrapper for all dashboard pages
│   │   └── NavLink.tsx            → Custom navigation link component
│   │
│   ├── 📁 integrations/
│   │   └── supabase/
│   │       └── client.ts          → Supabase connection (for login/auth)
│   │
│   ├── App.tsx                    ← Main app — defines all routes/pages
│   ├── main.tsx                   ← Entry point — starts the app
│   └── index.css                  ← Global styles (colors, fonts, theme)
│
├── 📄 package.json                ← Lists all libraries the app uses
├── 📄 vite.config.ts              ← Configuration for the build tool (Vite)
├── 📄 tailwind.config.ts          ← Tailwind CSS configuration
├── 📄 .env                        ← Secret environment variables (Supabase keys)
└── 📄 README.md                   ← Quick setup instructions
```

> 💡 **Key rule:** Each `.tsx` file in `src/pages/` is one screen/page you see in the browser.

---

## 5. Installing Dependencies

Before running for the **first time**, you need to install all the libraries the project uses.

### Step 5.1 — Open the VS Code Terminal
In VS Code: **Terminal** → **New Terminal** (or press `Ctrl + `` ` ``)

A black/dark terminal panel will appear at the bottom.

### Step 5.2 — Run the install command
Type this and press Enter:
```bash
npm install
```

> ⏳ This downloads all the required packages. Wait 1–3 minutes.
> You'll see a progress bar. When it finishes, you'll see your cursor again.

You only need to run this **once** (unless someone adds new packages to `package.json`).

---

## 6. Running the Project

### Step 6.1 — Start the development server
In the VS Code terminal, type:
```bash
npm run dev
```

You'll see output like:
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### Step 6.2 — Open in browser
Open your browser (Chrome recommended) and go to:
```
http://localhost:8080
```

You'll see the **NeuralDecide landing page**! ✅

> 💡 **Keep the terminal running** while you work. The moment you save any file, the browser updates automatically (this is called **Hot Module Replacement / HMR**).

### Step 6.3 — Stopping the server
When you're done, click in the terminal and press:
```
Ctrl + C
```

---

## 7. Logging In

### Step 7.1 — Create an account
1. Click **Get Started** on the landing page
2. You'll be taken to `/signup`
3. Enter your email and a password (min 6 characters)
4. Click **Sign Up**
5. Check your email for a verification link (from Supabase)
6. Click the link in your email
7. You'll be redirected to the dashboard

### Step 7.2 — Login next time
1. Go to `http://localhost:8080/login`
2. Enter your email + password
3. Click **Sign In**
4. You'll land on the Dashboard

> 🔐 **How auth works:** The app uses **Supabase** (a cloud database service) to store user accounts. When you sign in, Supabase gives the app a secure "session token". The app checks this token on every page — if you're not logged in, it redirects you to `/login`.

---

## 8. Every Page Explained

### 🏠 Dashboard (Home)
**Route:** `/dashboard`

This is your **overview / cockpit**. It shows:

| Section | What it does |
|---------|-------------|
| **Date Range Picker** (top right) | Filter all data by date range. Click Apply to "refresh". |
| **4 KPI Cards** | Key numbers: Total Analyses, Accuracy %, Data Points, Active Models. They count up from 0 when the page loads. |
| **Business Health Score** | A circular gauge showing 78/100 — a combined score of how healthy your business metrics are. 5 sub-scores shown below (Forecast Accuracy, Inventory Health, Sales Trend, etc.) |
| **Accuracy Line Chart** | Shows how decision accuracy improved month-by-month |
| **Domain Bar Chart** | Shows how many analyses were run per industry domain |
| **Recent Activity** | A log of the latest actions in the system |
| **Quick Actions** | Shortcut buttons to Upload Data, Run Analysis, View Reports |

---

### 📡 Live Monitoring
**Route:** `/dashboard/monitoring`

A **real-time operations dashboard**. Has 2 tabs:

**Live Feed tab:**
- 🟢 **LIVE badge** in top-right — pulses to show data is updating
- **4 KPI Cards** refresh every 30 seconds automatically (sales, inventory %, revenue, footfall)
- **Live Sales Chart** — line chart showing last 10 data points; a new point is added every 30 sec
- **Activity Log** — scrolling feed of events (new sales, stock updates). New events appear every 30 sec

**Anomalies tab:**
- Line chart with **red dots** marking anomaly points (unusual spikes/drops)
- **Anomaly History Table** — lists detected anomalies with severity badges (High/Medium/Low)
- Click **"View Detail"** on any row → opens a popup with a plain-English explanation

---

### 📈 Forecasting
**Route:** `/dashboard/forecasting`

Predicts future values using time-series AI models.

| Control | What it does |
|---------|-------------|
| **Metric Dropdown** | Choose what to forecast: Sales, Demand, Revenue, or Inventory |
| **Period Buttons** | Choose how far ahead: 7, 30, or 90 days |
| **Chart** | Solid cyan line = historical data. Dashed purple line = AI forecast. Shaded area = confidence band (95% confidence interval) |
| **3 Stat Cards** | Forecast Accuracy (MAPE %), Trend Direction (↑/↓), Next Peak Date |

> 💡 Change the metric or period and the chart updates instantly with new mock forecast data.

---

### 📂 Data Upload
**Route:** `/dashboard/data`

The **data management hub**.

| Action | How to do it |
|--------|-------------|
| **Upload a file** | Click the dashed zone → file picker opens. Choose a `.csv`, `.xlsx`, or `.json` file. OR drag a file and drop it onto the zone. |
| **Search datasets** | Type in the search box to filter by name or domain |
| **Preview a file** | Click the 📋 table icon on any row → shows first 3 rows of data |
| **Download a file** | Click the ⬇️ icon on any row → downloads the file to your computer |
| **Delete a file** | Click the 🗑️ icon → removes it from the list |

---

### 🤖 AI Analysis
**Route:** `/dashboard/analysis`

Has **3 tabs** at the top:

**Tab 1 — Run Analysis (4-step wizard):**
1. **Step 1:** Select a dataset from the dropdown
2. **Step 2:** Choose a model type (Classification, Regression, Clustering, Time-Series)
3. **Step 3:** Review auto-configured parameters (train/test split, cross validation, etc.)
4. **Step 4:** Click **Run Analysis** → watch the progress bar → see results:
   - Accuracy, Precision, Recall, F1 Score
   - Feature Importance bar chart
   - AI text summary
   - Export buttons (PDF, CSV)

**Tab 2 — Model Comparison:**
- 4 model cards: Random Forest, XGBoost, LSTM, Linear Regression
- Each shows Accuracy %, Precision %, Recall %, F1 Score %
- Click **Set as Active** to highlight your chosen model (cyan border appears)
- Grouped bar chart below compares all 4 models side by side

**Tab 3 — Explainability (SHAP):**
- Select which analysis to explain
- **Horizontal bar chart** — cyan bars = features that push prediction UP, red bars = push prediction DOWN
- **AI Explanation card** — plain English summary of what drove the prediction
- **Top Positive Factors** (green) and **Top Negative Factors** (red) side-by-side

---

### 💡 Intelligent Decisions
**Route:** `/dashboard/decisions`

An **AI decision engine** that recommends an action based on your data.

1. Select a dataset and a trained model
2. Click **Generate Decision**
3. The AI outputs:
   - A **recommendation** with a confidence % badge
   - **Reasoning breakdown** — why it made this decision
   - **Alternative options** — other choices with lower confidence
4. **Decision Log** table at bottom — history of past decisions with timestamps

---

### ⚡ Strategy Engine
**Route:** `/dashboard/strategy`

Recommends **business strategies** using reinforcement learning logic.

1. Select your **Business Context** from the dropdown (Grocery/Retail/Restaurant/Pharmacy/Finance)
2. Click **Generate Strategies**
3. Wait ~1.5 seconds (loading animation)
4. You'll see **3 ranked strategy cards** — each shows:
   - Strategy title + category badge (Pricing/Inventory/Marketing/Operations)
   - Expected ROI %
   - 2-line description
   - **Apply Strategy** button → shows a toast confirmation
5. **ROI Comparison bar chart** below compares all 3 strategies

---

### 🔬 Simulation (Digital Twin)
**Route:** `/dashboard/simulation`

A **"what-if" business simulator**. Change 4 variables and instantly see predicted outcomes.

| Slider | Range | Effect |
|--------|-------|--------|
| Price Adjustment | -30% to +30% | Higher price = more profit margin but lower revenue |
| Marketing Spend | ₹0 to ₹5,00,000 | More spend = better revenue |
| Inventory Level | 0% to 200% | Balanced inventory = best turnover |
| Staff Count | 1 to 50 | More staff = better satisfaction |

**Right panel** updates in real-time showing:
- Projected Revenue, Customer Satisfaction, Inventory Turnover, Profit Margin

**Before/After Charts** at bottom compare baseline vs your simulation.

Click **Run Full Simulation** → 2-second animation → summary result card appears.

---

### 🕸️ Knowledge Graph
**Route:** `/dashboard/knowledge-graph`

An **interactive relationship map** showing how business entities connect.

**Node types (color-coded):**
- 🔵 Cyan = Products
- 🟣 Purple = Suppliers
- 🟡 Amber = Customers
- 🟢 Green = Seasons
- 🟣 Light purple = Categories

**How to interact:**
- **Hover over any node** → connected nodes stay bright, unrelated nodes fade out
- A **tooltip** appears showing the node name and number of connections
- **Below the graph:** 3 insight cards summarize key patterns in the graph

---

### 📑 Reports
**Route:** `/dashboard/reports`

Generate, view, and schedule analytical reports.

**AI Generate button:**
1. Click **AI Generate** (purple button with sparkle icon)
2. Watch the 5-step animated progress: Analyzing data → Identifying trends → Drafting summary → Compiling recommendations → Report ready ✓
3. A **report preview card** slides in showing 4 accordion sections:
   - Executive Summary, Key Findings, Risk Analysis, Recommendations
   - Click any section to expand it and read the AI-generated text
4. **Download PDF** button → starts download
5. **Save to Library** → adds the report to the table below

**Reports Library table** — lists all generated reports. Each row has download and share icons.

**Scheduled Reports** — shows recurring reports (weekly, monthly) with next run dates.

---

### 🔔 Alerts
**Route:** `/dashboard/alerts`

Manage alert rules and see notification history.

**Category Filter Bar** at top:
- `All` `Critical` `Warning` `Info` — click to filter the alert rules list

**Alert Rules list:**
- Each rule has a colored severity dot and badge (Critical = red, Warning = amber, Info = blue)
- **Edit Threshold** button → opens a dialog where you can change the trigger value (e.g., change "accuracy drops below 80%" to 75%)
- 🗑️ Delete button to remove a rule
- Status badge: Active / Paused

**Notification History** — log of past alerts that were triggered, with timestamps.

---

### 🌐 Domain Insights
**Route:** `/dashboard/domain-insights`

Industry-specific analytics panels for 4 domains:
- 🎓 **Education** — student performance, dropout risk, learning outcomes
- 🏥 **Healthcare** — patient risk, diagnosis accuracy, treatment outcomes
- 💼 **Business** — sales performance, customer behavior, inventory
- 💰 **Finance** — fraud detection, credit scoring, portfolio performance

Each domain section shows: KPI cards, use cases, and demo AI output results.

---

### ⚙️ Settings
**Route:** `/dashboard/settings`

**Section 1 — Business Profile & Data Adapter (top):**
- 5 large card-style buttons: 🛒 Grocery / 🏪 Retail / 🍽️ Restaurant / 💊 Pharmacy / 📈 Finance
- Click one → the Data Configuration panel updates with:
  - **Key Metrics** for that business type
  - **Terminology Mapping** (e.g., "Transactions" → "Orders" for Restaurant)
- **Download Sample Template** → downloads a CSV template for that business type
- **Upload zone** → drag/drop your business data file for validation
- **Preview table** appears after upload showing first 3 rows

**Section 2 — General:** Dark mode toggle, language setting

**Section 3 — Notifications:** Email and in-app notification toggles

**Section 4 — API Keys:** View and regenerate your API production key

**Section 5 — Team Management:** Invite team members (admin only)

**Section 6 — Audit Log:** See all user actions with timestamps (admin only)

---

### 👤 Profile
**Route:** `/dashboard/profile`

Shows your account details — name, email, and domain preference from your Supabase profile.

---

## 9. How the Technology Works Together

```
Your Browser
    │
    │  React (UI framework — builds what you see)
    │  TypeScript (adds type safety to JavaScript)
    │  Tailwind CSS (styling — colors, spacing, layout)
    │  Framer Motion (animations — fade-ins, slide-ups)
    │
    ├─── Vite (development server — runs the app locally at localhost:8080)
    │
    ├─── Recharts (all the charts — line, bar, radial gauge, etc.)
    │
    ├─── shadcn/ui (pre-built UI components — buttons, dialogs, sliders, etc.)
    │
    ├─── React Router DOM (handles page navigation — /dashboard, /dashboard/analysis, etc.)
    │
    └─── Supabase (cloud service — only used for user login & signup)
              │
              └── Supabase Auth (stores email + password securely in the cloud)
```

**All other data (charts, tables, analysis results) is mock/simulated** — it's generated inside the JavaScript code itself, not from a real database.

---

## 10. Common Problems & Fixes

| Problem | Solution |
|---------|----------|
| **`npm install` fails with errors** | Make sure Node.js is installed. Run `node --version` to check. |
| **Port 8080 already in use** | Close other apps using that port, or change the port in `vite.config.ts` |
| **Page shows blank white screen** | Open browser DevTools (F12) → Console tab → look for red errors |
| **Redirected to login on every page** | You're not logged in. Sign up or log in first. |
| **Changes not showing in browser** | Make sure `npm run dev` is still running in the terminal |
| **"Module not found" error** | Run `npm install` again |
| **File upload not working** | Make sure you're selecting `.csv`, `.xlsx`, or `.json` files only |
| **Toast not showing** | Refresh the page — Vite HMR sometimes needs a full reload after big changes |

---

## 11. How to Edit / Add Things

### Editing a page's content
1. Open `src/pages/` in VS Code sidebar
2. Click the page file you want to edit (e.g., `DashboardHome.tsx`)
3. Make your changes — the browser updates instantly on Save (`Ctrl + S`)

### Changing colors
The entire color system is in `src/index.css`. The main accent color is:
```css
--primary: hsl(191, 100%, 50%);  /* This is the cyan/neon blue */
```
Change this HSL value to change the accent color everywhere.

### Adding a new page
1. Create a new file in `src/pages/`, e.g., `MyNewPage.tsx`
2. Start with this template:
   ```tsx
   export default function MyNewPage() {
     return (
       <div className="space-y-6">
         <h1 className="font-heading text-3xl font-bold text-foreground">My New Page</h1>
       </div>
     );
   }
   ```
3. Add the route in `src/App.tsx`:
   ```tsx
   import MyNewPage from "./pages/MyNewPage";
   // Inside the /dashboard Route:
   <Route path="my-page" element={<MyNewPage />} />
   ```
4. Add the link in `src/components/DashboardLayout.tsx` in the `navItems` array:
   ```tsx
   { to: "/dashboard/my-page", icon: SomeIcon, label: "My Page" },
   ```

### Connecting to a real backend
Currently all data is mock. To connect real data:
1. Create a Supabase table (at supabase.com → your project → Table Editor)
2. Import the client: `import { supabase } from "@/integrations/supabase/client"`
3. Fetch data: `const { data } = await supabase.from("your_table").select("*")`

---

## 🎉 You're all set!

**Quick reference — most used commands:**

```bash
# Install packages (first time only)
npm install

# Start the app
npm run dev

# Stop the app
Ctrl + C

# Check for TypeScript errors
npx tsc --noEmit
```

**App URL:** http://localhost:8080

**Key files to know:**
- `src/App.tsx` → all routes
- `src/components/DashboardLayout.tsx` → sidebar + header
- `src/pages/*.tsx` → every page
- `src/index.css` → all colors and global styles
- `.env` → Supabase keys (never share this file)

---

*Guide written for NeuralDecide v2.0 — March 2026*
