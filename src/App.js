import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || '';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0f0f0f;
    --paper: #f5f2ed;
    --cream: #ede9e0;
    --accent: #c84b31;
    --accent2: #2d6a4f;
    --gold: #c9a84c;
    --border: #d4cfc6;
    --muted: #8a8478;
    --surface: #ffffff;
    --mono: 'DM Mono', monospace;
    --sans: 'DM Sans', sans-serif;
    --display: 'Bebas Neue', sans-serif;
  }

  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    min-height: 100vh;
  }

  /* ── LAYOUT ── */
  .shell { display: flex; min-height: 100vh; }

  .sidebar {
    width: 280px;
    background: var(--ink);
    color: var(--paper);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }

  .logo {
    font-family: var(--display);
    font-size: 42px;
    letter-spacing: 2px;
    color: var(--paper);
    line-height: 1;
    margin-bottom: 4px;
  }

  .logo-sub {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 32px;
  }

  .nav-section {
    font-family: var(--mono);
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 8px;
    margin: 16px 0 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: #8a8478;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    transition: all 0.15s;
  }

  .nav-item:hover { background: rgba(255,255,255,0.06); color: var(--paper); }
  .nav-item.active { background: var(--accent); color: white; }

  .sidebar-divider { height: 1px; background: #2a2a2a; margin: 12px 0; }

  .main { flex: 1; padding: 40px 48px; overflow-y: auto; }

  /* ── HEADER ── */
  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--border);
  }

  .page-title {
    font-family: var(--display);
    font-size: 52px;
    letter-spacing: 2px;
    line-height: 1;
    color: var(--ink);
  }

  .page-sub {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    margin-top: 6px;
    letter-spacing: 1px;
  }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 4px;
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    letter-spacing: 0.5px;
  }

  .btn-primary { background: var(--ink); color: var(--paper); }
  .btn-primary:hover { background: #2a2a2a; transform: translateY(-1px); }
  .btn-accent { background: var(--accent); color: white; }
  .btn-accent:hover { background: #b03d25; transform: translateY(-1px); }
  .btn-success { background: var(--accent2); color: white; }
  .btn-success:hover { background: #235c41; }
  .btn-danger { background: #c0392b; color: white; }
  .btn-danger:hover { background: #a93226; }
  .btn-outline { background: transparent; color: var(--ink); border: 1.5px solid var(--border); }
  .btn-outline:hover { border-color: var(--ink); }
  .btn-sm { padding: 7px 14px; font-size: 12px; }
  .btn-ghost { background: var(--cream); color: var(--muted); }
  .btn-ghost:hover { background: var(--border); color: var(--ink); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* ── CARDS ── */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .card-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--cream);
  }

  .card-title {
    font-family: var(--mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
  }

  .card-body { padding: 24px; }

  /* ── PACKAGE GRID ── */
  .pkg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }

  .pkg-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 6px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.15s;
    position: relative;
  }

  .pkg-card:hover { border-color: var(--ink); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .pkg-card.in-cart { border-color: var(--accent2); background: rgba(45,106,79,0.04); }
  .pkg-card.in-cart::after { content: '✓'; position: absolute; top: 10px; right: 12px; color: var(--accent2); font-weight: 700; font-size: 14px; }

  .pkg-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.3; }
  .pkg-count { font-family: var(--mono); font-size: 10px; color: var(--muted); }

  /* ── CART ── */
  .cart-section { margin-top: 32px; }
  .cart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cart-title { font-family: var(--display); font-size: 28px; letter-spacing: 1px; }

  .cart-pkg {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .cart-pkg-header {
    padding: 14px 20px;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .cart-pkg-name { font-weight: 600; font-size: 14px; }
  .cart-pkg-count { font-family: var(--mono); font-size: 11px; color: var(--muted); }

  /* ── LINE ITEMS ── */
  .lineitem-row {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: start;
  }

  .lineitem-row:last-child { border-bottom: none; }
  .lineitem-name { font-size: 14px; font-weight: 500; margin-bottom: 12px; }

  .fields-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-top: 8px;
  }

  .field-group {
    background: var(--cream);
    border-radius: 6px;
    padding: 12px;
    border: 1px solid var(--border);
  }

  .field-group-title {
    font-family: var(--mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .field-item { margin-bottom: 6px; }

  .field-label {
    font-family: var(--mono);
    font-size: 10px;
    color: var(--muted);
    margin-bottom: 2px;
  }

  .field-value {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink);
  }

  .field-value.na { color: var(--muted); font-style: italic; }

  /* ── COMPARISON TABLE ── */
  .compare-wrap { overflow-x: auto; }

  .compare-table { width: 100%; border-collapse: collapse; font-size: 12px; }

  .compare-table th {
    background: var(--ink);
    color: var(--paper);
    padding: 10px 14px;
    text-align: left;
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .compare-table th:first-child { background: var(--accent); }

  .compare-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }

  .compare-table tr:nth-child(even) td { background: var(--cream); }
  .compare-table tr:hover td { background: rgba(200,75,49,0.04); }

  .row-label {
    font-family: var(--mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
    font-weight: 600;
    white-space: nowrap;
  }

  .uid-tag {
    font-family: var(--mono);
    font-size: 10px;
    background: var(--ink);
    color: var(--paper);
    padding: 2px 8px;
    border-radius: 3px;
  }

  /* ── CREATED ITEMS TABLE ── */
  .items-table { width: 100%; border-collapse: collapse; }
  .items-table th { background: var(--ink); color: var(--paper); padding: 10px 14px; text-align: left; font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .items-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .items-table tr:hover td { background: var(--cream); }

  /* ── MODAL ── */
  .overlay { position: fixed; inset: 0; background: rgba(15,15,15,0.7); z-index: 50; display: flex; align-items: flex-start; justify-content: center; padding: 24px; overflow-y: auto; }
  .modal { background: var(--surface); border: 2px solid var(--ink); border-radius: 8px; width: 100%; max-width: 1100px; margin: auto; box-shadow: 8px 8px 0 var(--ink); }
  .modal-head { padding: 24px 28px; border-bottom: 2px solid var(--ink); display: flex; align-items: center; justify-content: space-between; background: var(--cream); }
  .modal-title { font-family: var(--display); font-size: 32px; letter-spacing: 1px; }
  .modal-body { padding: 28px; }
  .close-btn { background: none; border: 1.5px solid var(--border); width: 36px; height: 36px; border-radius: 4px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .close-btn:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }

  /* ── BADGES ── */
  .badge { padding: 3px 10px; border-radius: 3px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.5px; }
  .badge-new { background: rgba(201,168,76,0.15); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
  .badge-done { background: rgba(45,106,79,0.12); color: var(--accent2); border: 1px solid rgba(45,106,79,0.25); }
  .badge-pending { background: rgba(200,75,49,0.12); color: var(--accent); border: 1px solid rgba(200,75,49,0.25); }

  /* ── MISC ── */
  .empty { text-align: center; padding: 60px; color: var(--muted); font-family: var(--mono); font-size: 13px; }
  .section-gap { margin-bottom: 32px; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .flex-gap { display: flex; align-items: center; gap: 12px; }
  .text-mono { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .divider { height: 1px; background: var(--border); margin: 24px 0; }

  /* ── VALIDATION BANNER ── */
  .validation-banner {
    background: var(--cream);
    border: 2px solid var(--ink);
    border-radius: 8px;
    padding: 24px 28px;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .validation-text { font-size: 15px; font-weight: 600; }
  .validation-sub { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 4px; }

  .steps-bar {
    display: flex;
    gap: 0;
    margin-bottom: 32px;
    border: 1.5px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
  }

  .step {
    flex: 1;
    padding: 10px 16px;
    font-family: var(--mono);
    font-size: 11px;
    text-align: center;
    border-right: 1px solid var(--border);
    color: var(--muted);
    background: var(--surface);
  }

  .step:last-child { border-right: none; }
  .step.active { background: var(--ink); color: var(--paper); }
  .step.done { background: var(--accent2); color: white; }
`;

// ── FIELD DISPLAY COMPONENT ──
function FieldDisplay({ label, value }) {
  const isNA = !value || value === 'N/A' || value === 'n/a';
  return (
    <div className="field-item">
      <div className="field-label">{label}</div>
      <div className={`field-value ${isNA ? 'na' : ''}`}>{isNA ? 'N/A' : value}</div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('packages');
  const [packages, setPackages] = useState({});
  const [cart, setCart] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [step, setStep] = useState(1); // 1=packages, 2=cart, 3=compare, 4=created
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPackages(); fetchCreatedItems(); }, []);

  async function fetchPackages() {
    try {
      const r = await fetch(`${API}/api/packages`);
      setPackages(await r.json());
    } catch(e) {}
  }

  async function fetchCreatedItems() {
    try {
      const r = await fetch(`${API}/api/lineitems`);
      setCreatedItems(await r.json());
    } catch(e) {}
  }

  function addToCart(pkgName) {
    if (!cart.find(c => c.package === pkgName)) {
      const pkgItems = packages[pkgName] || [];
      setCart([...cart, {
        package: pkgName,
        lineItems: pkgItems.map(name => ({
          name,
          selected: true,
          reach_sends: 'N/A',
          reach_impressions: 'N/A',
          reach_views: 'N/A',
          internal_rate: 'N/A',
          internal_quantity: 'N/A',
          internal_revenue_allocation: 'N/A',
          external_rate_type: 'N/A',
          external_net_cost: 'N/A',
        }))
      }]);
    }
  }

  function removeFromCart(pkgName) {
    setCart(cart.filter(c => c.package !== pkgName));
  }

  function toggleLineItem(pkgName, itemName) {
    setCart(cart.map(c => c.package === pkgName ? {
      ...c,
      lineItems: c.lineItems.map(li => li.name === itemName ? { ...li, selected: !li.selected } : li)
    } : c));
  }

  function updateField(pkgName, itemName, field, value) {
    setCart(cart.map(c => c.package === pkgName ? {
      ...c,
      lineItems: c.lineItems.map(li => li.name === itemName ? { ...li, [field]: value || 'N/A' } : li)
    } : c));
  }

  async function createLineItems() {
    setLoading(true);
    const items = [];
    cart.forEach(pkg => {
      pkg.lineItems.filter(li => li.selected).forEach(li => {
        items.push({
          package: pkg.package,
          lineItemName: li.name,
          reach_sends: li.reach_sends,
          reach_impressions: li.reach_impressions,
          reach_views: li.reach_views,
          internal_rate: li.internal_rate,
          internal_quantity: li.internal_quantity,
          internal_revenue_allocation: li.internal_revenue_allocation,
          external_rate_type: li.external_rate_type,
          external_net_cost: li.external_net_cost,
        });
      });
    });

    const res = await fetch(`${API}/api/lineitems/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    setPendingItems(data.created || []);
    setLoading(false);
    setStep(3);
  }

  async function handleFinish() {
    await fetchCreatedItems();
    setShowNewTicket(false);
    setCart([]);
    setPendingItems([]);
    setStep(1);
    setTab('created');
  }

  async function handleDontAdd() {
    if (pendingItems.length > 0) {
      const name = pendingItems[0]?.dealsheetName;
      if (name) {
        await fetch(`${API}/api/lineitems/dealsheet/${encodeURIComponent(name)}`, { method: 'DELETE' });
      } else {
        for (const item of pendingItems) {
          await fetch(`${API}/api/lineitems/${item.uniqueId}`, { method: 'DELETE' });
        }
      }
    }
    setShowNewTicket(false);
    setCart([]);
    setPendingItems([]);
    setStep(1);
  }

  const selectedCount = cart.reduce((acc, pkg) => acc + pkg.lineItems.filter(li => li.selected).length, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="shell">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">ADBOOK</div>
          <div className="logo-sub">Line Item Platform</div>

          <div className="nav-section">Navigation</div>
          <button className={`nav-item ${tab === 'packages' ? 'active' : ''}`} onClick={() => setTab('packages')}>
            📦 Packages
          </button>
          <button className={`nav-item ${tab === 'created' ? 'active' : ''}`} onClick={() => { setTab('created'); fetchCreatedItems(); }}>
            📋 Created Items ({createdItems.length})
          </button>

          <div className="sidebar-divider" />
          <div className="nav-section">Status</div>
          <div style={{padding: '0 8px', fontSize: 12, color: '#6b6560'}}>
            <div style={{marginBottom: 6}}>🟢 Adbook API</div>
            <div>📊 {createdItems.length} line items</div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">

          {/* PACKAGES TAB */}
          {tab === 'packages' && (
            <>
              <div className="page-header">
                <div>
                  <div className="page-title">PACKAGES</div>
                  <div className="page-sub">{Object.keys(packages).length} packages available</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowNewTicket(true); setStep(1); setCart([]); setPendingItems([]); }}>
                  + New Ticket
                </button>
              </div>

              <div className="pkg-grid">
                {Object.entries(packages).map(([name, items]) => (
                  <div className="pkg-card" key={name} onClick={() => setSelectedPkg(selectedPkg === name ? null : name)}>
                    <div className="pkg-name">📁 {name}</div>
                    <div className="pkg-count">{items.length} line items</div>
                  </div>
                ))}
              </div>

              {selectedPkg && (
                <div className="card" style={{marginTop: 24}}>
                  <div className="card-header">
                    <span className="card-title">📁 {selectedPkg}</span>
                    <button className="close-btn" onClick={() => setSelectedPkg(null)}>✕</button>
                  </div>
                  <div className="card-body">
                    {packages[selectedPkg]?.map(item => (
                      <div key={item} style={{padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span>{item}</span>
                        <span className="text-mono">available</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* CREATED ITEMS TAB */}
          {tab === 'created' && (
            <>
              <div className="page-header">
                <div>
                  <div className="page-title">CREATED ITEMS</div>
                  <div className="page-sub">{createdItems.length} line items in Adbook</div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={fetchCreatedItems}>↻ Refresh</button>
              </div>

              {createdItems.length === 0 ? (
                <div className="empty">No line items created yet</div>
              ) : (
                <div className="card">
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Unique ID</th>
                        <th>Line Item</th>
                        <th>Package</th>
                        <th>Dealsheet</th>
                        <th>Net Cost</th>
                        <th>Impressions</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdItems.map(item => (
                        <tr key={item.uniqueId}>
                          <td><span className="uid-tag">{item.uniqueId}</span></td>
                          <td style={{fontWeight: 600}}>{item.lineItemName}</td>
                          <td className="text-mono">{item.package}</td>
                          <td className="text-mono">{item.dealsheetName || '—'}</td>
                          <td>{item.external_net_cost || '—'}</td>
                          <td>{item.reach_impressions || '—'}</td>
                          <td className="text-mono">{new Date(item.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* NEW TICKET MODAL */}
      {showNewTicket && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowNewTicket(false)}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">
                {step === 1 && 'SELECT PACKAGES'}
                {step === 2 && 'EDIT CART'}
                {step === 3 && 'REVIEW & VALIDATE'}
              </div>
              <button className="close-btn" onClick={() => setShowNewTicket(false)}>✕</button>
            </div>
            <div className="modal-body">

              {/* STEPS BAR */}
              <div className="steps-bar">
                <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>01 — Select Packages</div>
                <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>02 — Edit Cart</div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>03 — Review & Validate</div>
              </div>

              {/* STEP 1: SELECT PACKAGES */}
              {step === 1 && (
                <>
                  <div style={{marginBottom: 20, fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)'}}>
                    Select packages to add to cart. Agent will add matched packages automatically.
                  </div>
                  <div className="pkg-grid">
                    {Object.entries(packages).map(([name, items]) => (
                      <div
                        className={`pkg-card ${cart.find(c => c.package === name) ? 'in-cart' : ''}`}
                        key={name}
                        onClick={() => cart.find(c => c.package === name) ? removeFromCart(name) : addToCart(name)}
                      >
                        <div className="pkg-name">📁 {name}</div>
                        <div className="pkg-count">{items.length} line items</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span className="text-mono">{cart.length} package{cart.length !== 1 ? 's' : ''} in cart</span>
                    <button className="btn btn-primary" disabled={cart.length === 0} onClick={() => setStep(2)}>
                      Continue to Edit Cart →
                    </button>
                  </div>
                </>
              )}

              {/* STEP 2: EDIT CART */}
              {step === 2 && (
                <>
                  <div style={{marginBottom: 20, fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)'}}>
                    Keep required line items, remove unnecessary ones, and fill in the details.
                  </div>
                  {cart.map(pkg => (
                    <div className="cart-pkg" key={pkg.package}>
                      <div className="cart-pkg-header">
                        <div>
                          <div className="cart-pkg-name">📁 {pkg.package}</div>
                          <div className="cart-pkg-count">{pkg.lineItems.filter(li => li.selected).length} selected</div>
                        </div>
                        <button className="btn btn-ghost btn-sm" onClick={() => removeFromCart(pkg.package)}>Remove Package</button>
                      </div>
                      {pkg.lineItems.map(li => (
                        <div className="lineitem-row" key={li.name} style={{opacity: li.selected ? 1 : 0.4}}>
                          <div style={{flex: 1}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
                              <input type="checkbox" checked={li.selected} onChange={() => toggleLineItem(pkg.package, li.name)} style={{width: 16, height: 16, cursor: 'pointer'}} />
                              <div className="lineitem-name">{li.name}</div>
                            </div>
                            {li.selected && (
                              <div className="fields-grid">
                                {/* REACH */}
                                <div className="field-group">
                                  <div className="field-group-title">Reach</div>
                                  {[['reach_sends','Sends'],['reach_impressions','Impressions'],['reach_views','Views']].map(([key, label]) => (
                                    <div className="field-item" key={key}>
                                      <div className="field-label">{label}</div>
                                      <input
                                        type="text"
                                        defaultValue={li[key]}
                                        onBlur={e => updateField(pkg.package, li.name, key, e.target.value)}
                                        style={{width:'100%', background:'white', border:'1px solid var(--border)', borderRadius:3, padding:'4px 8px', fontSize:11, fontFamily:'var(--mono)'}}
                                      />
                                    </div>
                                  ))}
                                </div>
                                {/* INTERNAL PRICING */}
                                <div className="field-group">
                                  <div className="field-group-title">Internal Pricing</div>
                                  {[['internal_rate','Rate'],['internal_quantity','Quantity'],['internal_revenue_allocation','Revenue Allocation']].map(([key, label]) => (
                                    <div className="field-item" key={key}>
                                      <div className="field-label">{label}</div>
                                      <input
                                        type="text"
                                        defaultValue={li[key]}
                                        onBlur={e => updateField(pkg.package, li.name, key, e.target.value)}
                                        style={{width:'100%', background:'white', border:'1px solid var(--border)', borderRadius:3, padding:'4px 8px', fontSize:11, fontFamily:'var(--mono)'}}
                                      />
                                    </div>
                                  ))}
                                </div>
                                {/* EXTERNAL PRICING */}
                                <div className="field-group">
                                  <div className="field-group-title">External Pricing</div>
                                  {[['external_rate_type','Rate Type'],['external_net_cost','Net Cost']].map(([key, label]) => (
                                    <div className="field-item" key={key}>
                                      <div className="field-label">{label}</div>
                                      <input
                                        type="text"
                                        defaultValue={li[key]}
                                        onBlur={e => updateField(pkg.package, li.name, key, e.target.value)}
                                        style={{width:'100%', background:'white', border:'1px solid var(--border)', borderRadius:3, padding:'4px 8px', fontSize:11, fontFamily:'var(--mono)'}}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <div className="flex-gap">
                      <span className="text-mono">{selectedCount} line item{selectedCount !== 1 ? 's' : ''} ready</span>
                      <button className="btn btn-accent" disabled={selectedCount === 0 || loading} onClick={createLineItems}>
                        {loading ? '⏳ Creating...' : 'Create Line Items →'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* STEP 3: REVIEW & VALIDATE */}
              {step === 3 && (
                <>
                  <div className="validation-banner">
                    <div>
                      <div className="validation-text">🎉 {pendingItems.length} Line Items Created Successfully!</div>
                      <div className="validation-sub">Review the details below. Click Finish to save to Google Sheets or Don't Add to discard.</div>
                    </div>
                    <div className="flex-gap">
                      <button className="btn btn-danger" onClick={handleDontAdd}>❌ Don't Add</button>
                      <button className="btn btn-success" onClick={handleFinish}>✅ Finish</button>
                    </div>
                  </div>

                  <div className="compare-wrap">
                    <table className="compare-table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          {pendingItems.map(item => (
                            <th key={item.uniqueId}>
                              {item.lineItemName}
                              <div style={{fontFamily:'var(--mono)', fontSize:9, marginTop:3, opacity:0.7}}>{item.uniqueId}</div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Package', 'package'],
                          ['Reach - Sends', 'reach_sends'],
                          ['Reach - Impressions', 'reach_impressions'],
                          ['Reach - Views', 'reach_views'],
                          ['Internal - Rate', 'internal_rate'],
                          ['Internal - Quantity', 'internal_quantity'],
                          ['Internal - Rev. Allocation', 'internal_revenue_allocation'],
                          ['External - Rate Type', 'external_rate_type'],
                          ['External - Net Cost', 'external_net_cost'],
                        ].map(([label, key]) => (
                          <tr key={key}>
                            <td className="row-label">{label}</td>
                            {pendingItems.map(item => (
                              <td key={item.uniqueId} style={{fontSize: 12}}>
                                {item[key] || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12}}>
                    <button className="btn btn-danger" onClick={handleDontAdd}>❌ Don't Add</button>
                    <button className="btn btn-success" onClick={handleFinish}>✅ Finish — Save to Google Sheets</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}