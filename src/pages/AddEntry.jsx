import { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { EXPENSE_TYPES, NAMED_CLIENTS } from '../lib/constants';
import { detectClient } from '../lib/clientDetect';
import { insertRow } from '../lib/dataLayer';
import { todayStr } from '../lib/helpers';
import { ClientBadge } from '../components/ClientBadge';
import { useToast } from '../components/Toast';

export default function AddEntry() {
  const { vehicles } = useFleet();
  const [entryType, setEntryType] = useState('earning');
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState(todayStr());
  const [amount, setAmount] = useState('');
  const [expType, setExpType] = useState('Toll');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [ToastEl, showToast] = useToast();

  const isEarning = entryType === 'earning';
  const noteKeywords = NAMED_CLIENTS.map(c => c.keyword).join(' / ');

  async function saveEntry() {
    const amt = parseFloat(amount);
    if (!vehicle || !amt || !date) {
      showToast('Please fill vehicle, amount and date.', false);
      return;
    }
    setSaving(true);
    try {
      if (isEarning) {
        await insertRow('earnings', { vehicle, amount: amt, note: note.trim(), date });
      } else {
        await insertRow('expenses', { vehicle, amount: amt, expense_type: expType, note: note.trim(), date });
      }
      showToast((isEarning ? 'Earning' : 'Expense') + ' saved!', true);
      setAmount('');
      setNote('');
    } catch (e) {
      showToast('Error: ' + e.message, false);
    }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div className="type-toggle">
        <button
          className={'type-btn' + (isEarning ? ' earn-active' : '')}
          onClick={() => setEntryType('earning')}
        >⬆ Earning</button>
        <button
          className={'type-btn' + (!isEarning ? ' exp-active' : '')}
          onClick={() => setEntryType('expense')}
        >⬇ Expense</button>
      </div>

      <div className="field">
        <label className="label">Vehicle Number</label>
        <select className="select" value={vehicle} onChange={e => setVehicle(e.target.value)}>
          <option value="">Select vehicle...</option>
          {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="label">Date</label>
        <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div className="field">
        <label className="label">Amount (S$)</label>
        <input
          type="number" className="input mono" placeholder="0.00"
          style={{ fontSize: 20, fontWeight: 700, color: isEarning ? 'var(--green)' : 'var(--red)' }}
          value={amount} onChange={e => setAmount(e.target.value)}
        />
      </div>

      {!isEarning && (
        <div className="field">
          <label className="label">Expense Category</label>
          <select className="select" value={expType} onChange={e => setExpType(e.target.value)}>
            {EXPENSE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      )}

      <div className="field">
        <label className="label">
          {isEarning ? `Notes (mention ${noteKeywords} if applicable)` : 'Notes'}
        </label>
        <textarea
          className="textarea" rows={3}
          placeholder={isEarning ? `e.g. ${NAMED_CLIENTS[0]?.keyword} delivery...` : 'Details...'}
          value={note} onChange={e => setNote(e.target.value)}
        />
        {isEarning && note.trim() && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
            Auto-detected: <ClientBadge clientKey={detectClient(note)} />
          </div>
        )}
      </div>

      <button
        className={'btn-save ' + (isEarning ? 'earn' : 'exp')}
        disabled={saving} onClick={saveEntry}
      >
        {saving ? 'Saving...' : isEarning ? 'Save Earning' : 'Save Expense'}
      </button>
      <ToastEl />

      <div className="setup-box" style={{ borderColor: '#f0a50033' }}>
        <div style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: 1, fontWeight: 700 }}>🚛 FLEET CONFIG</div>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, lineHeight: 1.8 }}>
          Vehicles are managed from the database.<br />
          Go to the <b style={{ color: 'var(--accent)' }}>Vehicles</b> tab to add, edit or deactivate vehicles.
        </p>
      </div>
    </div>
  );
}
