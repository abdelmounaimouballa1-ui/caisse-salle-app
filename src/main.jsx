import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { supabase } from './supabase';
import {
  LayoutDashboard, ArrowLeftRight, CalendarDays, LogOut,
  Plus, Search, RefreshCw, Pencil, Trash2,
  Wallet, CreditCard, Landmark, ReceiptText,
  ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown,
  LockKeyhole, CircleAlert, CheckCircle2, Info,
  Banknote, Building2, FileText, ShieldCheck,
} from 'lucide-react';
import './style.css';

/* ─── Helpers ───────────────────────────────────────────────── */
const money = n =>
  new Intl.NumberFormat('fr-MA', {
    style: 'currency', currency: 'MAD', maximumFractionDigits: 2,
  }).format(Number(n || 0));

const todayISO = () => new Date().toLocaleDateString('en-CA');

const fmtDate = iso =>
  new Date(iso + 'T12:00:00').toLocaleDateString('fr-MA', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

const fmtDateLong = iso =>
  new Date(iso + 'T12:00:00').toLocaleDateString('fr-MA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

const KIND_LABELS = {
  income:     'Recette',
  expense:    'Dépense',
  deposit:    'Dépôt banque',
  withdrawal: 'Retrait banque',
  opening:    'Solde initial',
};

const PM_CLASSES = {
  'Cash':       'cash',
  'Carte TPE':  'tpe',
  'Virement':   'virement',
  'Chèque':     'cheque',
  'Autre':      'autre',
};

const PM_ICONS = {
  'Cash':       <Banknote size={15}/>,
  'Carte TPE':  <CreditCard size={15}/>,
  'Virement':   <Building2 size={15}/>,
  'Chèque':     <FileText size={15}/>,
  'Autre':      <ReceiptText size={15}/>,
};

const CATEGORIES = [
  'Recette salle','Abonnement / client','Bouteille de gaz',
  'Achat marchandise','Loyer','Électricité / eau',
  'Salaire','Entretien','Transport','Fournitures',
  'Dépôt banque','Retrait banque','Autre','Solde initial',
];

const emptyForm = () => ({
  date: todayISO(),
  kind: 'income',
  label: '',
  category: 'Recette salle',
  payment_method: 'Cash',
  amount: '',
  notes: '',
});

/* ─── App root ──────────────────────────────────────────────── */
function App() {
  const configured = !!supabase;

  /* auth */
  const [session, setSession]   = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [authEmail, setAuthEmail]     = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  /* data */
  const [rows, setRows]       = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  /* ui */
  const [tab, setTab]           = useState('dashboard');
  const [notice, setNotice]     = useState({ msg: '', type: 'success' });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(emptyForm());
  const [formSaving, setFormSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // row id
  const [filterDate, setFilterDate] = useState(todayISO());
  const [search, setSearch]     = useState('');

  /* ─ init auth ─ */
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else { setProfile(null); setRows([]); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ─ load data when ready ─ */
  useEffect(() => {
    if (session && profile) loadRows();
  }, [session, profile]);

  async function loadProfile(uid) {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('id', uid).single();
    if (error) {
      setAuthError(
        "Profil introuvable. Demandez à l'administrateur de créer votre profil dans la table profiles."
      );
      setProfile(null);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  const loadRows = useCallback(async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1000);
    setDataLoading(false);
    if (error) showNotice(error.message, 'error');
    else setRows(data || []);
  }, []);

  async function login(e) {
    e.preventDefault();
    setAuthError(''); setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail, password: authPassword,
    });
    if (error) { setAuthError(error.message); }
    setAuthLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null); setProfile(null);
  }

  const isAdmin = profile?.role === 'admin';

  function showNotice(msg, type = 'success') {
    setNotice({ msg, type });
    setTimeout(() => setNotice({ msg: '', type: 'success' }), 4000);
  }

  /* ─ filtered rows ─ */
  const visible = useMemo(() => rows.filter(r => {
    const matchDate = !filterDate || r.date === filterDate;
    const q = search.toLowerCase();
    const matchSearch = !q || (
      r.label.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.payment_method.toLowerCase().includes(q) ||
      (r.notes || '').toLowerCase().includes(q)
    );
    return matchDate && matchSearch;
  }), [rows, filterDate, search]);

  /* ─ dashboard stats ─ */
  const stats = useMemo(() => {
    const sum = (pred) => rows.filter(pred).reduce((s, r) => s + Number(r.amount), 0);
    const td = todayISO();

    const opening     = sum(r => r.kind === 'opening');
    const cashIn      = sum(r => r.kind === 'income'     && r.payment_method === 'Cash');
    const cashOut     = sum(r => r.kind === 'expense'    && r.payment_method === 'Cash');
    const deposits    = sum(r => r.kind === 'deposit');
    const withdrawals = sum(r => r.kind === 'withdrawal');
    const cashBalance = opening + cashIn - cashOut - deposits + withdrawals;

    const tpe      = sum(r => r.kind === 'income' && r.payment_method === 'Carte TPE');
    const virement = sum(r => r.kind === 'income' && r.payment_method === 'Virement');
    const cheque   = sum(r => r.kind === 'income' && r.payment_method === 'Chèque');

    const cashInToday  = sum(r => r.kind === 'income'  && r.payment_method === 'Cash' && r.date === td);
    const cashOutToday = sum(r => r.kind === 'expense' && r.payment_method === 'Cash' && r.date === td);
    const txToday      = rows.filter(r => r.date === td).length;
    const totalIncome  = sum(r => r.kind === 'income');
    const totalExpense = sum(r => r.kind === 'expense');

    return {
      cashBalance, cashInToday, cashOutToday,
      tpe, virement, cheque, deposits, withdrawals,
      txToday, totalIncome, totalExpense,
    };
  }, [rows]);

  /* ─ form helpers ─ */
  function openNewForm() {
    setForm(emptyForm()); setEditId(null); setShowForm(true);
  }

  function startEdit(r) {
    if (!isAdmin) return;
    setForm({
      date: r.date, kind: r.kind, label: r.label,
      category: r.category, payment_method: r.payment_method,
      amount: String(r.amount), notes: r.notes || '',
    });
    setEditId(r.id);
    setShowForm(true);
  }

  function setKind(k) {
    const catMap = {
      expense:    'Autre',
      deposit:    'Dépôt banque',
      withdrawal: 'Retrait banque',
      opening:    'Solde initial',
      income:     'Recette salle',
    };
    const pmForce = (k === 'deposit' || k === 'withdrawal') ? 'Cash' : form.payment_method;
    setForm(f => ({ ...f, kind: k, category: catMap[k] || f.category, payment_method: pmForce }));
  }

  async function saveTransaction(e) {
    e.preventDefault();
    if (!isAdmin) return;
    const amount = Number(form.amount);
    if (!form.label.trim() || !amount || amount <= 0) {
      showNotice('Saisissez une description et un montant positif.', 'error'); return;
    }
    setFormSaving(true);
    const payload = {
      date: form.date, kind: form.kind,
      label: form.label.trim(), category: form.category,
      payment_method: form.payment_method,
      amount, notes: form.notes.trim(),
      created_by: session.user.id,
    };
    let res;
    if (editId) res = await supabase.from('transactions').update(payload).eq('id', editId);
    else        res = await supabase.from('transactions').insert(payload);
    setFormSaving(false);
    if (res.error) { showNotice(res.error.message, 'error'); return; }
    showNotice(editId ? 'Opération modifiée.' : 'Opération enregistrée.', 'success');
    setShowForm(false); setEditId(null); setForm(emptyForm());
    loadRows();
  }

  async function deleteRow(id) {
    if (!isAdmin) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    setConfirmDelete(null);
    if (error) showNotice(error.message, 'error');
    else { showNotice('Opération supprimée.', 'success'); loadRows(); }
  }

  /* ─── Routing ─── */
  if (!configured)  return <SetupScreen />;
  if (loading)      return <LoadingScreen />;
  if (!session)     return <AuthScreen email={authEmail} setEmail={setAuthEmail} password={authPassword} setPassword={setAuthPassword} onLogin={login} error={authError} loading={authLoading} />;
  if (!profile)     return <ProfileErrorScreen onLogout={logout} error={authError} />;

  const pageLabels = {
    dashboard:    'Vue d\'ensemble',
    transactions: 'Journal des opérations',
    closing:      'Clôture quotidienne',
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-logo">
            <Wallet size={20} />
          </div>
          <div className="sb-brand-text">
            <strong>Caisse Salle</strong>
            <span>Gestion quotidienne</span>
          </div>
        </div>

        <nav className="sb-nav">
          <span className="sb-section">Principal</span>
          <button className={`nav-btn${tab === 'dashboard' ? ' active' : ''}`} onClick={() => setTab('dashboard')}>
            <LayoutDashboard size={17} /><span>Tableau de bord</span>
          </button>
          <button className={`nav-btn${tab === 'transactions' ? ' active' : ''}`} onClick={() => setTab('transactions')}>
            <ArrowLeftRight size={17} /><span>Opérations</span>
          </button>
          <span className="sb-section">Comptabilité</span>
          <button className={`nav-btn${tab === 'closing' ? ' active' : ''}`} onClick={() => setTab('closing')}>
            <CalendarDays size={17} /><span>Clôture du jour</span>
          </button>
        </nav>

        <div className="sb-footer">
          <div className="sb-profile">
            <div className="sb-avatar">
              {(profile.display_name || session.user.email).slice(0, 1).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <span className="sb-user-name">
                {profile.display_name || session.user.email}
              </span>
              <span className="sb-user-role">
                {isAdmin ? 'Administrateur' : 'Lecture seule'}
              </span>
            </div>
          </div>
          <button className="sb-logout" onClick={logout}>
            <LogOut size={15} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main">
        {/* topbar */}
        <header className="topbar">
          <div className="tb-left">
            <p className="tb-eyebrow">CAISSE SALLE</p>
            <h1 className="tb-title">{pageLabels[tab]}</h1>
          </div>
          <div className="tb-right">
            <span className="role-badge">
              {isAdmin ? <ShieldCheck size={13}/> : <Landmark size={13}/>}
              {isAdmin ? 'Accès complet' : 'Lecture seule'}
            </span>
            <button className="btn btn-ghost btn-icon" onClick={loadRows} title="Actualiser">
              {dataLoading
                ? <span className="spinner spinner-sm" />
                : <RefreshCw size={16} />}
            </button>
            {isAdmin && (
              <button className="btn btn-primary new-op-btn" onClick={openNewForm}>
                <Plus size={16} /><span>Nouvelle opération</span>
              </button>
            )}
          </div>
        </header>

        {/* notice */}
        {notice.msg && (
          <div className={`notice-bar ${notice.type}`} onClick={() => setNotice({ msg: '' })}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {notice.type === 'success' && <CheckCircle2 size={14} />}
              {notice.type === 'error'   && <CircleAlert size={14} />}
              {notice.type === 'info'    && <Info size={14} />}
              {notice.msg}
            </span>
            <button>×</button>
          </div>
        )}

        {/* ── page content ── */}
        <div className="main-inner">
          {tab === 'dashboard' && (
            <DashboardTab
              rows={rows} stats={stats} profile={profile}
              isAdmin={isAdmin}
              onEdit={startEdit} onDelete={id => setConfirmDelete(id)}
              onViewAll={() => setTab('transactions')}
            />
          )}
          {tab === 'transactions' && (
            <TransactionsTab
              rows={visible} isAdmin={isAdmin}
              filterDate={filterDate} setFilterDate={setFilterDate}
              search={search} setSearch={setSearch}
              onEdit={startEdit} onDelete={id => setConfirmDelete(id)}
              onReset={() => { setFilterDate(''); setSearch(''); }}
            />
          )}
          {tab === 'closing' && (
            <ClosingTab
              rows={rows} isAdmin={isAdmin} session={session}
              onSaved={() => { loadRows(); showNotice('Clôture enregistrée.', 'success'); }}
            />
          )}
        </div>

        <footer className="app-footer">
          Les montants sont saisis manuellement. Vérifiez les relevés TPE et bancaires séparément.
        </footer>
      </div>

      {/* ── Transaction modal ── */}
      {showForm && (
        <TransactionModal
          form={form} setForm={setForm}
          editId={editId}
          saving={formSaving}
          onKind={setKind}
          onSave={saveTransaction}
          onClose={() => { setShowForm(false); setEditId(null); setForm(emptyForm()); }}
        />
      )}

      {/* ── Confirm delete ── */}
      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer cette opération ?"
          body="Cette action est irréversible. L'opération sera définitivement supprimée du journal."
          onConfirm={() => deleteRow(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD TAB
   ══════════════════════════════════════════════════════════════ */
function DashboardTab({ rows, stats, profile, isAdmin, onEdit, onDelete, onViewAll }) {
  return (
    <>
      {/* Welcome row */}
      <div className="welcome-row">
        <div>
          <h2>
            Bonjour{profile.display_name ? ' ' + profile.display_name.split(' ')[0] : ''} 👋
          </h2>
          <p>Voici la situation financière de votre caisse.</p>
        </div>
        <div className="date-pill">
          <CalendarDays size={14} />
          {fmtDateLong(todayISO())}
        </div>
      </div>

      {/* Cash balance hero */}
      <div className="cash-hero">
        <div className="hero-left">
          <p className="hero-eyebrow">Solde caisse — Espèces</p>
          <div className={`hero-amount${stats.cashBalance < 0 ? ' neg' : ''}`}>
            {money(stats.cashBalance)}
          </div>
          <p className="hero-desc">
            <Banknote size={13} />
            Cash physique théorique calculé depuis toutes les opérations
          </p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat in">
            <small>Entrées aujourd'hui</small>
            <strong>{money(stats.cashInToday)}</strong>
          </div>
          <div className="hero-stat out">
            <small>Dépenses aujourd'hui</small>
            <strong>{money(stats.cashOutToday)}</strong>
          </div>
          <div className="hero-stat tx">
            <small>Opérations</small>
            <strong>{stats.txToday}</strong>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="kpi-grid">
        <div className="kpi-card green">
          <div className="kpi-icon"><TrendingUp /></div>
          <p className="kpi-label">Total recettes</p>
          <span className="kpi-value">{money(stats.totalIncome)}</span>
          <span className="kpi-desc">Toutes méthodes confondues</span>
        </div>
        <div className="kpi-card red">
          <div className="kpi-icon"><TrendingDown /></div>
          <p className="kpi-label">Total dépenses</p>
          <span className="kpi-value">{money(stats.totalExpense)}</span>
          <span className="kpi-desc">Sorties cash uniquement</span>
        </div>
        <div className="kpi-card blue">
          <div className="kpi-icon"><ArrowDownCircle /></div>
          <p className="kpi-label">Dépôts banque</p>
          <span className="kpi-value">{money(stats.deposits)}</span>
          <span className="kpi-desc">Cash versé en banque</span>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-icon"><ArrowUpCircle /></div>
          <p className="kpi-label">Retraits banque</p>
          <span className="kpi-value">{money(stats.withdrawals)}</span>
          <span className="kpi-desc">Cash récupéré depuis banque</span>
        </div>
      </div>

      {/* Payment methods breakdown */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-head-left">
            <p className="panel-title">Recettes hors espèces</p>
            <p className="panel-sub">Ces montants ne s'ajoutent pas au cash physique de la caisse.</p>
          </div>
          <CreditCard size={18} style={{ color: 'var(--t-faint)', flexShrink: 0 }} />
        </div>
        <div className="pm-grid">
          <PmCard cls="tpe"      icon={<CreditCard size={16}/>}  label="Carte TPE"  value={stats.tpe} />
          <PmCard cls="virement" icon={<Building2 size={16}/>}   label="Virement"   value={stats.virement} />
          <PmCard cls="cheque"   icon={<FileText size={16}/>}    label="Chèque"     value={stats.cheque} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="panel">
        <div className="panel-head">
          <div className="panel-head-left">
            <p className="panel-title">Dernières opérations</p>
            <p className="panel-sub">Les opérations les plus récentes enregistrées.</p>
          </div>
          <button className="text-btn" onClick={onViewAll}>Voir tout →</button>
        </div>
        <TransactionTable
          rows={rows.slice(0, 7)} isAdmin={isAdmin}
          onEdit={onEdit} onDelete={onDelete}
        />
      </div>
    </>
  );
}

function PmCard({ cls, icon, label, value }) {
  return (
    <div className={`pm-card ${cls}`}>
      <div className="pm-icon">{icon}</div>
      <div>
        <span className="pm-lbl">{label}</span>
        <span className="pm-val">{money(value)}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRANSACTIONS TAB
   ══════════════════════════════════════════════════════════════ */
function TransactionsTab({
  rows, isAdmin, filterDate, setFilterDate,
  search, setSearch, onEdit, onDelete, onReset,
}) {
  return (
    <div style={{ paddingTop: 22 }}>
      <div className="panel">
        <div className="filters-bar">
          <div className="search-wrap">
            <Search size={15} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une opération…"
            />
          </div>
          <div className="filter-date">
            <CalendarDays size={14} />
            <input
              type="date" value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            Tout afficher
          </button>
        </div>
        <TransactionTable
          rows={rows} isAdmin={isAdmin}
          onEdit={onEdit} onDelete={onDelete}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRANSACTION TABLE (shared)
   ══════════════════════════════════════════════════════════════ */
function TransactionTable({ rows, isAdmin, onEdit, onDelete }) {
  if (!rows.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><ReceiptText size={22} /></div>
        <h3>Aucune opération</h3>
        <p>Les opérations apparaîtront ici une fois enregistrées.</p>
      </div>
    );
  }

  function kindTag(r) {
    if (r.kind === 'deposit')    return <span className="mtag depot">Dépôt</span>;
    if (r.kind === 'withdrawal') return <span className="mtag retrait">Retrait</span>;
    if (r.kind === 'opening')    return <span className="mtag initial">Solde initial</span>;
    const cls = PM_CLASSES[r.payment_method] || 'autre';
    return (
      <span className={`mtag ${cls}`}>
        {PM_ICONS[r.payment_method]}
        {r.payment_method}
      </span>
    );
  }

  function amtClass(r) {
    if (r.kind === 'expense' || r.kind === 'deposit') return 'amt neg';
    if (r.kind === 'income' || r.kind === 'withdrawal' || r.kind === 'opening') return 'amt pos';
    return 'amt neu';
  }

  function amtSign(r) {
    if (r.kind === 'expense' || r.kind === 'deposit') return '−';
    if (r.kind === 'income' || r.kind === 'withdrawal' || r.kind === 'opening') return '+';
    return '';
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Opération</th>
            <th>Type</th>
            <th>Mode</th>
            <th style={{ textAlign: 'right' }}>Montant</th>
            {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td style={{ color: 'var(--t-low)', fontSize: 12 }}>{fmtDate(r.date)}</td>
              <td className="td-main">
                <div className="tx-lbl">{r.label}</div>
                <div className="tx-cat">{r.category}</div>
              </td>
              <td>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '2px 8px', borderRadius: 'var(--r-full)',
                  fontSize: 11, fontWeight: 600,
                  background: 'var(--bg-subtle)', color: 'var(--t-low)',
                }}>
                  {KIND_LABELS[r.kind]}
                </span>
              </td>
              <td>{kindTag(r)}</td>
              <td className={amtClass(r)}>
                {amtSign(r)}{money(r.amount)}
              </td>
              {isAdmin && (
                <td>
                  <div className="row-acts">
                    <button className="row-act-btn" title="Modifier" onClick={() => onEdit(r)}>
                      <Pencil size={14} />
                    </button>
                    <button className="row-act-btn del" title="Supprimer" onClick={() => onDelete(r.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLOSING TAB
   ══════════════════════════════════════════════════════════════ */
function ClosingTab({ rows, isAdmin, session, onSaved }) {
  const [date, setDate]     = useState(todayISO());
  const [actual, setActual] = useState('');
  const [note, setNote]     = useState('');
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [histLoading, setHistLoading] = useState(true);

  useEffect(() => {
    supabase.from('cash_closings')
      .select('*').order('date', { ascending: false }).limit(30)
      .then(({ data }) => { setHistory(data || []); setHistLoading(false); });
  }, []);

  const tx   = rows.filter(r => r.date === date);
  const upto = rows.filter(r => r.date <= date);

  const sum = (pred) => upto.filter(pred).reduce((s, r) => s + Number(r.amount), 0);
  const opening     = sum(r => r.kind === 'opening');
  const cumCashIn   = sum(r => r.kind === 'income'     && r.payment_method === 'Cash');
  const cumCashOut  = sum(r => r.kind === 'expense'    && r.payment_method === 'Cash');
  const cumDeposits = sum(r => r.kind === 'deposit');
  const cumWithdraw = sum(r => r.kind === 'withdrawal');
  const expected    = opening + cumCashIn - cumCashOut - cumDeposits + cumWithdraw;

  const income   = tx.filter(r => r.kind === 'income'  && r.payment_method === 'Cash').reduce((s, r) => s + Number(r.amount), 0);
  const expenses = tx.filter(r => r.kind === 'expense' && r.payment_method === 'Cash').reduce((s, r) => s + Number(r.amount), 0);
  const txCount  = tx.length;

  const diff = Number(actual) - expected;
  const diffClass = !actual ? '' : diff === 0 ? ' balanced' : diff > 0 ? ' over' : ' short';
  const diffLabel = !actual ? '' : diff === 0
    ? '✓ Caisse équilibrée'
    : diff > 0
      ? `Excédent de ${money(diff)}`
      : `Manque de ${money(Math.abs(diff))}`;

  async function save(e) {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    const { error } = await supabase.from('cash_closings').upsert({
      date, expected_cash: expected, actual_cash: Number(actual),
      difference: diff, notes: note, closed_by: session.user.id,
    }, { onConflict: 'date' });
    setSaving(false);
    if (error) { alert(error.message); return; }
    const { data } = await supabase.from('cash_closings')
      .select('*').order('date', { ascending: false }).limit(30);
    setHistory(data || []);
    onSaved();
  }

  return (
    <div style={{ paddingTop: 22 }}>
      {/* summary stats */}
      <div className="closing-stats">
        <div className="cls-stat">
          <div className="cls-stat-lbl">Date de clôture</div>
          <input type="date" className="form-input"
            value={date} onChange={e => setDate(e.target.value)}
            style={{ marginTop: 6 }} />
        </div>
        <div className="cls-stat">
          <div className="cls-stat-lbl">Cash théorique</div>
          <div className="cls-stat-val">{money(expected)}</div>
        </div>
        <div className="cls-stat">
          <div className="cls-stat-lbl">Recettes cash</div>
          <div className="cls-stat-val pos">{money(income)}</div>
        </div>
        <div className="cls-stat">
          <div className="cls-stat-lbl">Dépenses cash</div>
          <div className="cls-stat-val neg">{money(expenses)}</div>
        </div>
      </div>

      {/* form or readonly notice */}
      {isAdmin ? (
        <div className="cls-form">
          <p className="cls-form-title">
            <LockKeyhole size={15} /> Saisie de la clôture
          </p>
          <form onSubmit={save}>
            <div className="cls-input-row">
              <div className="form-row">
                <label className="form-lbl">Cash compté (MAD)<span className="req">*</span></label>
                <input
                  type="number" min="0" step="0.01"
                  className="form-input"
                  value={actual}
                  onChange={e => setActual(e.target.value)}
                  placeholder="Saisissez le montant compté"
                  required
                />
              </div>
              <div className="form-row">
                <label className="form-lbl">Note de clôture</label>
                <input
                  type="text"
                  className="form-input"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Écart expliqué, dépôt effectué…"
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? <><span className="spinner spinner-sm" /> Enregistrement…</> : 'Enregistrer'}
              </button>
            </div>
            {actual && (
              <div className={`cls-diff${diffClass}`}>
                {diffLabel}
                {actual && <span style={{ marginLeft: 'auto', fontWeight: 400, fontSize: 12, opacity: .8 }}>
                  Théorique : {money(expected)} — Réel : {money(Number(actual))}
                </span>}
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className="panel" style={{ marginBottom: 18 }}>
          <div className="panel-body">
            <p className="form-hint info">
              Accès lecture seule — La clôture ne peut être saisie que par l'administrateur.
            </p>
          </div>
        </div>
      )}

      {/* history */}
      <p className="history-title">
        <CalendarDays size={15} /> Clôtures récentes
      </p>
      <div className="panel">
        {histLoading ? (
          <div className="empty-state">
            <span className="spinner" />
          </div>
        ) : !history.length ? (
          <div className="empty-state">
            <div className="empty-icon"><CalendarDays size={22} /></div>
            <h3>Aucune clôture</h3>
            <p>Les clôtures enregistrées apparaîtront ici.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Théorique</th>
                  <th style={{ textAlign: 'right' }}>Réel compté</th>
                  <th style={{ textAlign: 'right' }}>Écart</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => {
                  const d = Number(h.difference);
                  return (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 600, color: 'var(--t-hi)' }}>{fmtDate(h.date)}</td>
                      <td className="amt neu">{money(h.expected_cash)}</td>
                      <td className="amt neu">{money(h.actual_cash)}</td>
                      <td className={`amt ${d === 0 ? 'pos' : d > 0 ? 'pos' : 'neg'}`}>
                        {d > 0 ? '+' : ''}{money(d)}
                      </td>
                      <td style={{ color: 'var(--t-low)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {h.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRANSACTION MODAL
   ══════════════════════════════════════════════════════════════ */
function TransactionModal({ form, setForm, editId, saving, onKind, onSave, onClose }) {
  const kinds = [
    { k: 'income',     icon: <TrendingUp size={16}/>,    label: 'Recette' },
    { k: 'expense',    icon: <TrendingDown size={16}/>,  label: 'Dépense' },
    { k: 'deposit',    icon: <ArrowDownCircle size={16}/>, label: 'Dépôt banque' },
    { k: 'withdrawal', icon: <ArrowUpCircle size={16}/>,  label: 'Retrait banque' },
    { k: 'opening',    icon: <Wallet size={16}/>,         label: 'Solde initial' },
  ];

  const lockPM = form.kind === 'deposit' || form.kind === 'withdrawal';

  return (
    <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <p className="modal-eyebrow">Journal de caisse</p>
            <h2 className="modal-title">
              {editId ? 'Modifier une opération' : 'Nouvelle opération'}
            </h2>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={onSave}>
          <div className="modal-body">
            {/* Kind selector */}
            <div className="form-row" style={{ marginBottom: 16 }}>
              <label className="form-lbl">Type d'opération<span className="req">*</span></label>
              <div className="kind-sel">
                {kinds.map(({ k, icon, label }) => (
                  <button
                    type="button" key={k}
                    className={`kind-opt ${k}${form.kind === k ? ' selected' : ''}`}
                    onClick={() => onKind(k)}
                  >
                    {icon}{label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grid">
              {/* Date */}
              <div className="form-row">
                <label className="form-lbl">Date<span className="req">*</span></label>
                <input type="date" className="form-input"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required />
              </div>

              {/* Payment method */}
              <div className="form-row">
                <label className="form-lbl">Mode de paiement<span className="req">*</span></label>
                <select className="form-select"
                  value={form.payment_method}
                  disabled={lockPM}
                  onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
                  {['Cash', 'Carte TPE', 'Virement', 'Chèque', 'Autre'].map(x => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>

              {/* Label */}
              <div className="form-row span2">
                <label className="form-lbl">Description<span className="req">*</span></label>
                <input type="text" className="form-input"
                  value={form.label}
                  onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Ex. Paiement client, achat bouteille de gaz…"
                  required />
              </div>

              {/* Category */}
              <div className="form-row">
                <label className="form-lbl">Catégorie</label>
                <select className="form-select"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(x => <option key={x}>{x}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div className="form-row">
                <label className="form-lbl">Montant (MAD)<span className="req">*</span></label>
                <input type="number" className="form-input"
                  min="0.01" step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0,00"
                  required />
              </div>

              {/* Notes */}
              <div className="form-row span2">
                <label className="form-lbl">Note / référence <span style={{ fontWeight: 400, color: 'var(--t-faint)' }}>(facultatif)</span></label>
                <textarea className="form-textarea"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Référence, reçu, détail supplémentaire…"
                  rows={2} />
              </div>

              {/* Info hint */}
              {(form.kind === 'income' || form.kind === 'expense') && form.payment_method !== 'Cash' && (
                <div className="span2">
                  <p className="form-hint info">
                    <Info size={13} style={{ flexShrink: 0, marginRight: 5 }} />
                    Les paiements par {form.payment_method} ne modifient pas le solde espèces de la caisse physique.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving
                ? <><span className="spinner spinner-sm" /> Enregistrement…</>
                : editId ? 'Enregistrer les modifications' : 'Enregistrer l\'opération'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONFIRM DIALOG
   ══════════════════════════════════════════════════════════════ */
function ConfirmDialog({ title, body, onConfirm, onCancel }) {
  return (
    <div className="modal-bg" onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal confirm-card">
        <div className="modal-body" style={{ paddingTop: 28 }}>
          <div className="confirm-icon"><Trash2 size={22} /></div>
          <h3 className="confirm-title">{title}</h3>
          <p className="confirm-body">{body}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUTH SCREEN
   ══════════════════════════════════════════════════════════════ */
function AuthScreen({ email, setEmail, password, setPassword, onLogin, error, loading }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <Wallet size={26} />
          </div>
        </div>
        <p className="auth-eyebrow">Accès sécurisé</p>
        <h1 className="auth-title">Caisse Salle</h1>
        <p className="auth-sub">Connectez-vous pour accéder au journal de caisse et aux rapports financiers.</p>

        <form className="auth-form" onSubmit={onLogin}>
          <div className="form-row">
            <label className="form-lbl">Adresse e-mail</label>
            <input type="email" className="form-input"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@exemple.com" required autoComplete="email" />
          </div>
          <div className="form-row">
            <label className="form-lbl">Mot de passe</label>
            <input type="password" className="form-input"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required autoComplete="current-password" />
          </div>
          {error && <div className="form-err">{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading
              ? <><span className="spinner spinner-sm" /> Connexion…</>
              : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <ShieldCheck size={12} />
          Accès sécurisé par Supabase Auth
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROFILE ERROR SCREEN
   ══════════════════════════════════════════════════════════════ */
function ProfileErrorScreen({ onLogout, error }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark" style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)' }}>
            <CircleAlert size={26} />
          </div>
        </div>
        <h1 className="auth-title" style={{ fontSize: 20 }}>Profil non configuré</h1>
        <p className="auth-sub">{error || "Votre compte est connecté, mais aucun profil avec un rôle n'est configuré. Demandez à l'administrateur d'ajouter votre ligne dans la table profiles."}</p>
        <button className="btn btn-secondary btn-full" onClick={onLogout}>
          <LogOut size={14} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOADING SCREEN
   ══════════════════════════════════════════════════════════════ */
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div style={{
          width: 48, height: 48,
          borderRadius: 14,
          background: 'linear-gradient(135deg,#1ab8a8,#2274e3)',
          display: 'grid', placeItems: 'center', color: '#fff',
          boxShadow: '0 8px 24px rgba(26,184,168,.35)',
          marginBottom: 8,
        }}>
          <Wallet size={22} />
        </div>
        <div className="spinner" />
        <p className="loading-label">Chargement de l'application…</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SETUP SCREEN
   ══════════════════════════════════════════════════════════════ */
function SetupScreen() {
  return (
    <div className="setup-page">
      <div className="setup-card">
        <div className="setup-icon">
          <LockKeyhole size={24} />
        </div>
        <h1>Connexion Supabase requise</h1>
        <p>Le projet est prêt. Copiez <code>.env.example</code> vers <code>.env</code>, ajoutez votre URL et votre clé publique Supabase :</p>
        <p><code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code></p>
        <p>Puis exécutez le SQL de <code>supabase/schema.sql</code> dans l'éditeur SQL Supabase.</p>
        <p className="setup-muted">Ne mettez jamais la clé <code>service_role</code> dans le navigateur.</p>
      </div>
    </div>
  );
}

/* ── Service Worker ── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  );
}

/* ── Mount ── */
createRoot(document.getElementById('root')).render(<App />);
