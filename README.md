# Charan Logistics — Fleet Management (React + Vite)

Vehicle P&L Tracker migrated from single-file HTML to React + Vite. Same features,
same Supabase backend, same design — now componentised per feature.

## Stack
- React 18 + Vite 5
- Supabase (auth + REST) — tables: `earnings`, `expenses`, `vehicles`, `cash_on_hand`, `tripdetails`
- Chart.js 4 (Charts tab)
- SheetJS `xlsx` (Report tab Excel export)
- GitHub Pages deploy via Actions

## File map (feature → file)
```
src/
  App.jsx                       Auth gate (Login ↔ FleetApp)
  FleetApp.jsx                  Header, day/night mode, tab routing
  pages/Login.jsx               Login page (truck collage + Supabase auth)
  tabs/AddEntry.jsx             ➕ Add Entry (earning/expense, client auto-detect)
  tabs/History.jsx              📋 History (day cards, edit/delete)
  tabs/Dashboard.jsx            📊 Dashboard (fleet totals, perf vs target)
  tabs/Charts.jsx               📈 Charts (individual / compare / client trend)
  tabs/CashOnHand.jsx           💵 Cash on Hand (form + ledger)
  tabs/Vehicles.jsx             🚛 Vehicles (add / activate / delete)
  tabs/Report.jsx               🖨️ Report (preview + xlsx download)
  tabs/SettleDriver.jsx         🧾 Settle Driver + Salary Calculator
  tabs/Trips.jsx                🗺️ Trips (log trips/KM, stats)
  components/EditEntryModal.jsx  Edit earning/expense modal
  components/EditCashModal.jsx   Edit cash entry modal
  components/ClientBadge.jsx     Client badge + header pills
  components/Toast.jsx           useToast hook
  context/FleetContext.jsx       Shared active-vehicles list
  lib/supabaseClient.js          Supabase client + session token
  lib/dataLayer.js               REST helpers (get/insert/update/delete)
  lib/clientDetect.js            KAIRA/JIT/... note detection
  lib/constants.js               Client config, months, expense/cash types, target
  lib/helpers.js                 fmt, fmtK, pad, sumByClient, date formatters
  styles/app.css                 Main app CSS (unchanged from v1)
  styles/login.css               Login CSS (scoped for SPA)
```

## Local development
```bash
npm install
cp .env.example .env   # fill in your Supabase URL + anon key
npm run dev
```

## Deploy (GitHub Pages)
1. Repo name must be `charanlogisticsfleetmanagement` (matches `base` in vite.config.js).
2. Repo **Settings → Secrets and variables → Actions**, add:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Repo **Settings → Pages** → Source: **GitHub Actions**.
4. Push to `main` — `.github/workflows/deploy.yml` builds and deploys `dist/`.

Keep-alive secrets (unchanged from v1): `APP_URL`, `APP_EMAIL`, `APP_PASSWORD`.

## Keep-alive compatibility
`keep-alive.js` (Playwright cron) is unchanged. The React app keeps the same
accessible names and IDs it relies on: Email/Password fields, "Sign In" button,
tab button labels, and `#histVehicle` select in the History tab.

## Notes from migration
- Demo mode removed — app is always live against Supabase.
- Trips tab: v1 inserted the note into a `notes` column but displayed `t.note`
  (so notes never showed in the table). The React version displays
  `t.note || t.notes`, so whichever column exists in the DB will show.
- Login and app are now one SPA — no `login.html` redirect; the auth gate in
  `App.jsx` switches views based on the Supabase session.
- Day/Night mode preference still stored in `localStorage` (`mode` key).
"# charanlogisticsfleetmanagement" 
