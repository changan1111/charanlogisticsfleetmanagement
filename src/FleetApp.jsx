import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { sb } from './lib/supabaseClient';
import { useFleet } from './context/FleetContext';
import { ClientPills } from './components/ClientBadge';

import AddEntry from './pages/AddEntry';
import DayEntry from './pages/DayEntry';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Charts from './pages/Charts';
import CashOnHand from './pages/CashOnHand';
import CashMeter from './pages/CashMeter';
import Vehicles from './pages/Vehicles';
import Report from './pages/Report';
import SettleDriver from './pages/SettleDriver';
import Trips from './pages/Trips';

// Each entry here is both the nav button AND the route — add a screen
// once here and it shows up in the tab bar and gets its own URL.
const ROUTES = [
  { path: '/add',       label: '➕ Add Entry',      element: <AddEntry /> },
  { path: '/dayentry',  label: '🗓️ Day Entry',      element: <DayEntry /> },
  { path: '/history',   label: '📋 History',        element: <History /> },
  { path: '/dashboard', label: '📊 Dashboard',      element: <Dashboard /> },
  { path: '/charts',    label: '📈 Charts',         element: <Charts /> },
  { path: '/cash',      label: '💵 Cash on Hand',   element: <CashOnHand /> },
  { path: '/cashmeter', label: '⛽ Cash Meter',      element: <CashMeter /> },
  { path: '/vehicles',  label: '🚛 Vehicles',       element: <Vehicles /> },
  { path: '/report',    label: '🖨️ Report',         element: <Report /> },
  { path: '/settle',    label: '🧾 Settle Driver',  element: <SettleDriver /> },
  { path: '/trips',     label: '🗺️ Trips',          element: <Trips /> },
];

export default function FleetApp({ user }) {
  const { reloadVehicles } = useFleet();
  const [day, setDay] = useState(() => localStorage.getItem('mode') === 'day');

  // Load vehicles once on login
  useEffect(() => { reloadVehicles(); }, [reloadVehicles]);

  // Day / Night mode on <body> (unchanged — has nothing to do with routing)
  useEffect(() => {
    document.body.classList.toggle('day', day);
    localStorage.setItem('mode', day ? 'day' : 'night');
  }, [day]);

  async function signOut() {
    await sb.auth.signOut();
    // App.jsx onAuthStateChange switches back to Login
  }

  return (
    <>
      <div id="app-header">
        <div className="header-inner">
          <div className="header-top">
            <div className="header-brand">
              <div className="sub">Fleet Management</div>
              <h1>Vehicle P&amp;L Tracker</h1>
            </div>
            <button
              id="modeBtn"
              onClick={() => setDay(d => !d)}
              style={{
                padding: '5px 18px', background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--muted)', fontFamily: "'Syne',sans-serif",
                fontSize: 18, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {day ? '🌙 Night' : '☀️ Day'}
            </button>
            <div className="user-badge">
              <span className="user-email">{user.email}</span>
              <button className="btn-logout" onClick={signOut}>Sign Out</button>
            </div>
            <ClientPills />
          </div>
          <div className="tabs">
            {ROUTES.map(r => (
              <NavLink
                key={r.path}
                to={r.path}
                className={({ isActive }) => 'tab-btn' + (isActive ? ' active' : '')}
              >
                {r.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="page active">
          <Routes>
            {ROUTES.map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
            {/* Unknown or empty path → default screen */}
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
