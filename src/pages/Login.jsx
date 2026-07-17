import { useEffect, useRef, useState } from 'react';
import { sb } from '../lib/supabaseClient';
import '../styles/login.css';

// Truck collage images (served from /public)
const IMAGES = ['Truck1.jpeg', 'Truck2.jpeg', 'Truck3.jpeg', 'Truck4.jpeg'];
const SIZE = 300, CX = 150, CY = 150, R = 150, BORDER = 6;
const BASE = import.meta.env.BASE_URL;

function loadImage(src) {
  return new Promise(r => {
    const i = new Image();
    i.onload = () => r(i);
    i.onerror = () => r(null);
    i.src = src;
  });
}

function drawCover(ctx, img, qx, qy, qw, qh) {
  const ir = img.width / img.height, qr = qw / qh;
  let sw, sh, sx, sy;
  if (ir > qr) { sh = img.height; sw = sh * qr; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = sw / qr; sx = 0; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, qx, qy, qw, qh);
}

export default function Login() {
  const canvasRef = useRef(null);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [granted, setGranted] = useState(false);

  // Truck circle collage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const quads = [
      { x: 0, y: 0, w: CX, h: CY }, { x: CX, y: 0, w: CX, h: CY },
      { x: 0, y: CY, w: CX, h: CY }, { x: CX, y: CY, w: CX, h: CY },
    ];
    (async () => {
      const loaded = await Promise.all(IMAGES.map(f => loadImage(BASE + f)));
      ctx.save();
      ctx.beginPath(); ctx.arc(CX, CY, R - BORDER / 2, 0, Math.PI * 2); ctx.clip();
      quads.forEach((q, i) => {
        if (loaded[i]) drawCover(ctx, loaded[i], q.x, q.y, q.w, q.h);
        else { ctx.fillStyle = '#122240'; ctx.fillRect(q.x, q.y, q.w, q.h); }
      });
      ctx.strokeStyle = 'rgba(0,20,50,0.7)'; ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(CX, 0); ctx.lineTo(CX, SIZE);
      ctx.moveTo(0, CY); ctx.lineTo(SIZE, CY);
      ctx.stroke();
      ctx.restore();
      ctx.beginPath(); ctx.arc(CX, CY, R - BORDER / 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#D4AF37'; ctx.lineWidth = BORDER; ctx.stroke();
      ctx.beginPath(); ctx.arc(CX, CY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37'; ctx.fill();
    })();
  }, []);

  async function handleLogin() {
    if (!email.trim() || !pw) { setErr('Please enter your email and password.'); return; }
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) {
      setLoading(false);
      // Supabase rate-limits automatically after too many wrong attempts
      setErr(error.message || 'Incorrect credentials.');
      setPw('');
      return;
    }
    // App.jsx onAuthStateChange switches to the dashboard
    setGranted(true);
  }

  function onKeyDown(e) {
    setErr('');
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <div className="login-root">
      <div className="bg-base" />
      <div className="bg-dots" />
      <div className="bg-glow" />

      <div className="login-page">
        <div className="card">
          <div className="card-inner">

            <div className="collage-wrap">
              <canvas ref={canvasRef} width={300} height={300} />
            </div>
            <div className="form-title" style={{ marginTop: 18 }}>Charan Logistics Pte Ltd</div>
            <div className="form-title">Reg No: 202502540D · Singapore</div>
            <div className="divider">
              <div className="divider-line" /><div className="divider-dot" /><div className="divider-line" />
            </div>

            <div id="formArea">
              <div className="form-title" style={{ marginBottom: 18 }}>🔒 Authorised Access Only</div>
              <div className={'error-banner' + (err ? ' show' : '')} id="errBanner">
                <span>⚠</span><span id="errText">{err || 'Incorrect credentials.'}</span>
              </div>

              <label className="field-label" htmlFor="emailInput">Email</label>
              <div className="field">
                <input
                  type="email" id="emailInput" placeholder="your@email.com"
                  autoComplete="email" autoFocus style={{ padding: '13px 16px' }}
                  value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKeyDown}
                />
              </div>

              <label className="field-label" htmlFor="pwInput">Password</label>
              <div className="field">
                <input
                  type={showPw ? 'text' : 'password'} id="pwInput" placeholder="Enter password"
                  autoComplete="current-password" className={err ? 'err' : ''}
                  value={pw} onChange={e => setPw(e.target.value)} onKeyDown={onKeyDown}
                />
                <button className="eye-btn" type="button" onClick={() => setShowPw(s => !s)}>
                  {showPw ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                className={'btn' + (loading ? ' loading' : '')}
                id="loginBtn" disabled={loading}
                style={granted ? { background: 'linear-gradient(135deg,#3a8a5a,#5ab878)', marginTop: 8 } : { marginTop: 8 }}
                onClick={handleLogin}
              >
                <span className="label">{granted ? '✓ Access Granted' : 'Sign In →'}</span>
                <span className="spinner-wrap"><span className="ring" /></span>
              </button>
            </div>

            <div className="footer">
              <span className="footer-amber">◆</span> Fleet Management — Vehicle P&L Tracker<br />
              Contact admin if you need access
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
