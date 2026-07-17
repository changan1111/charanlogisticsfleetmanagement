import { useEffect, useState } from 'react';
import { sb, setSession } from './lib/supabaseClient';
import Login from './pages/Login';
import FleetApp from './FleetApp';
import { FleetProvider } from './context/FleetContext';

// ═══════════════════════════════════════════════
//  AUTH GATE
//  No session → Login. Session → FleetApp.
// ═══════════════════════════════════════════════
export default function App() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initial session check
    sb.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      setChecking(false);
    });

    // Login / logout / token refresh
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--muted)', fontSize: 13,
      }}>
        Checking access...
      </div>
    );
  }

  if (!user) return <Login />;

  return (
    <FleetProvider>
      <FleetApp user={user} />
    </FleetProvider>
  );
}
