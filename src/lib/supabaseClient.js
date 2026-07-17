// ═══════════════════════════════════════════════
//  SUPABASE CLIENT
//  Credentials injected at build time by GitHub Actions
//  (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY secrets)
// ═══════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js';

export const SB_URL = import.meta.env.VITE_SUPABASE_URL;
export const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const sb = createClient(SB_URL, SB_KEY);

// Session is held here so the raw REST data layer can use the
// user's access_token (same behaviour as the old single-file app).
let _session = null;
export function setSession(s) { _session = s; }
export function getSession() { return _session; }
export function authToken() { return _session?.access_token || SB_KEY; }
