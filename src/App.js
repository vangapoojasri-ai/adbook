import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || '';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f0f0f; --paper: #f5f2ed; --cream: #ede9e0;
    --accent: #c84b31; --accent2: #2d6a4f; --gold: #c9a84c;
    --border: #d4cfc6; --muted: #8a8478; --surface: #ffffff;
    --mono: 'DM Mono', monospace; --sans: 'DM Sans', sans-serif;
    --display: 'Bebas Neue', sans-serif;
  }
  body { background: var(--paper); color: var(--ink); font-family: var(--sans); min-height: 100vh; }
  .shell { display: flex; min-height: 100vh; }
  .sidebar { width: 280px; background: var(--ink); color: var(--paper); padding: 32px 24px; display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
  .logo { font-family: var(--display); font-size: 42px; letter-spacing: 2px; color: var(--paper); line-height: 1; margin-bottom: 4px; }
  .logo-sub { font-family: var(--mono); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 32px; }
  .nav-section { font-family: var(--mono); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 0 8px; margin: 16px 0 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; color: #8a8478; border: none; background: none; width: 100%; text-align: left; transition: all 0.15s; }
  .nav-item:hover { background: rgba(255,255,255,0.06); color: var(--paper); }
  .nav-item.active { background: var(--accent); color: white; }
  .sidebar-divider { height: 1px; background: #2a2a2a; margin: 12px 0; }
  .main { flex: 1; padding: 40px 48px; overflow-y: auto; }
  .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 2px solid var(--border); }
  .page-title { font-family: var(--display); font-size: 52px; letter-spacing: 2px; line-height: 1; color: var(--ink); }
  .page-sub { font-family: var(--mono); font-size: 11px; color: var(--muted); margin-top: 6px; letter-spacing: 1px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 4px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; letter-spacing: 0.5px; }
  .btn-primary { background: var(--ink); color: var(--paper); }
  .btn-primary:hover { background: #2a2a2a; transform: translateY(-1px); }
  .btn-accent { background: var(--accent); color: white; }
  .btn-accent:hover { background: #b03d25; }
  .btn-success { background: var(--accent2); color: white; }
  .btn-success:hover { background: #235c41; }
  .btn-outline { background: transparent; color: var(--ink); border: 1.5px solid var(--border); }
  .btn-outline:hover { border-color: var(--ink); }
  .btn-sm { padding: 7px 14px; font-size: 12px; }
  .btn-ghost { background: var(--cream); color: var(--muted); }
  .btn-ghost:hover { background: var(--border); color: var(--ink); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
  .card-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--cream); }
  .card-title { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); }
  .card-body { padding: 24px; }
  .pkg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .pkg-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: 6px; padding: 16px; cursor: pointer; transition: all 0.15s; position: relative; }
  .pkg-card:hover { border-color: var(--ink); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .pkg-card.in-cart { border-color: var(--accent2); background: rgba(45,106,79,0.04); }
  .pkg-card.in-cart::after { content: '✓'; position: absolute; top: 10px; right: 12px; color: var(--accent2); font-weight: 700; font-size: 14px; }
  .pkg-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; line-height: 1.3; }
  .pkg-count { font-family: var(--mono); font-size: 10px; color: var(--muted); }
  .cart-pkg { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 16px; overflow: hidden; }
  .cart-pkg-header { padding: 14px 20px; background: var(--cream); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .cart-pkg-name { font-weight: 600; font-size: 14px; }
  .cart-pkg-count { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .lineitem-row { padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .lineitem-row:last-child { border-bottom: none; }
  .lineitem-name { font-size: 14px; font-weight: 500; margin-bottom: 12px; }
  .fields-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 8px; }
  .field-group { background: var(--cream); border-radius: 6px; padding: 12px; border: 1px solid var(--border); }
  .field-group-title { font-family: var(--mono); font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 8px; }
  .field-item { margin-bottom: 6px; }
  .field-label { font-family: var(--mono); font-size: 10px; color: var(--muted); margin-bottom: 2px; }
  .field-input { width: 100%; background: white; border: 1px solid var(--border); border-radius: 3px; padding: 5px 8px; font-size: 11px; font-family: var(--mono); outline: none; transition: border-color 0.15s; }
  .field-input:focus { border-color: var(--ink); }
  .field-value { font-size: 12px; font-weight: 500; }
  .field-value.na { color: var(--muted); font-style: italic; }
  .items-table { width: 100%; border-collapse: collapse; }
  .items-table th { background: var(--ink); color: var(--paper); padding: 10px 14px; text-align: left; font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .items-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .items-table tr:hover td { background: var(--cream); }
  .uid-tag { font-family: var(--mono); font-size: 10px; background: var(--ink); color: var(--paper); padding: 2px 8px; border-radius: 3px; }
  .overlay { position: fixed; inset: 0; background: rgba(15,15,15,0.7); z-index: 50; display: flex; align-items: flex-start; justify-content: center; padding: 24px; overflow-y: auto; }
  .modal { background: var(--surface); border: 2px solid var(--ink); border-radius: 8px; width: 100%; max-width: 1100px; margin: auto; box-shadow: 8px 8px 0 var(--ink); }
  .modal-head { padding: 24px 28px; border-bottom: 2px solid var(--ink); display: flex; align-items: center; justify-content: space-between; background: var(--cream); }
  .modal-title { font-family: var(--display); font-size: 32px; letter-spacing: 1px; }
  .modal-body { padding: 28px; }
  .close-btn { background: none; border: 1.5px solid var(--border); width: 36px; height: 36px; border-radius: 4px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .close-btn:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .steps-bar { display: flex; gap: 0; margin-bottom: 32px; border: 1.5px solid var(--border); border-radius: 6px; overflow: hidden; }
  .step { flex: 1; padding: 10px 16px; font-family: var(--mono); font-size: 11px; text-align: center; border-right: 1px solid var(--border); color: var(--muted); background: var(--surface); }
  .step:last-child { border-right: none; }
  .step.active { background: var(--ink); color: var(--paper); }
  .step.done { background: var(--accent2); color: white; }
  .text-mono { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  .flex-gap { display: flex; align-items: center; gap: 12px; }
  .empty { text-align: center; padding: 60px; color: var(--muted); font-family: var(--mono); font-size: 13px; }

  /* Phase 2 modal */
  .phase2-section { margin-bottom: 24px; }
  .phase2-title { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .phase2-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .edit-btn { background: var(--cream); border: 1px solid var(--border); padding: 5px 10px; border-radius: 3px; font-size: 11px; cursor: pointer; font-family: var(--mono); transition: all 0.15s; }
  .edit-btn:hover { background: var(--ink); color: var(--paper); border-color: var(--ink); }
`;

export default function App() {
  const [tab, setTab] = useState('packages');
  const [packages, setPackages] = useState({});
  const [cart, setCart] = useState([]);
  const [createdItems, setCreatedItems] = useState([]);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [phase2Data, setPhase2Data] = useState({});

  useEffect(() => { fetchPackages(); fetchCreatedItems(); }, []);

  async function fetchPackages() {
    try { const r = await fetch(`${API}/api/packages`); setPackages(await r.json()); } catch(e) {}
  }

  async function fetchCreatedItems() {
    try { const r = await fetch(`${API}/api/lineitems`); setCreatedItems(await r.json()); } catch(e) {}
  }

  function addToCart(pkgName) {
    if (!cart.find(c => c.package === pkgName)) {
      setCart([...cart, {
        package: pkgName,
        lineItems: (packages[pkgName] || []).map(name => ({
          name, selected: true,
          reach_sends: 'N/A', reach_impressions: 'N/A', reach_views: 'N/A',
          internal_rate: 'N/A', internal_quantity: 'N/A', internal_revenue_allocation: 'N/A',
          external_rate_type: 'N/A', external_net_cost: 'N/A',
        }))
      }]);
    }
  }

  function removeFromCart(pkgName) { setCart(cart.filter(c => c.package !== pkgName)); }

  function toggleLineItem(pkgName, itemName) {
    setCart(cart.map(c => c.package === pkgName ? {
      ...c, lineItems: c.lineItems.map(li => li.name === itemName ? { ...li, selected: !li.selected } : li)
    } : c));
  }

  function updateField(pkgName, itemName, field, value) {
    setCart(cart.map(c => c.package === pkgName ? {
      ...c, lineItems: c.lineItems.map(li => li.name === itemName ? { ...li, [field]: value || 'N/A' } : li)
    } : c));
  }

  async function createLineItems() {
    setLoading(true);
    const items = [];
    cart.forEach(pkg => {
      pkg.lineItems.filter(li => li.selected).forEach(li => {
        items.push({
          package: pkg.package, lineItemName: li.name,
          reach_sends: li.reach_sends, reach_impressions: li.reach_impressions, reach_views: li.reach_views,
          internal_rate: li.internal_rate, internal_quantity: li.internal_quantity, internal_revenue_allocation: li.internal_revenue_allocation,
          external_rate_type: li.external_rate_type, external_net_cost: li.external_net_cost,
        });
      });
    });
    await fetch(`${API}/api/lineitems/create`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    await fetchCreatedItems();
    setLoading(false);
    setShowNewTicket(false);
    setCart([]);
    setStep(1);
    setTab('created');
  }

  async function savePhase2() {
    await fetch(`${API}/api/lineitems/${editingItem.uniqueId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phase2Data)
    });
    await fetchCreatedItems();
    setEditingItem(null);
    setPhase2Data({});
  }

  const selectedCount = cart.reduce((acc, pkg) => acc + pkg.lineItems.filter(li => li.selected).length, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="logo">ADBOOK</div>
          <div className="logo-sub">Line Item Platform</div>
          <div className="nav-section">Navigation</div>
          <button className={`nav-item ${tab === 'packages' ? 'active' : ''}`} onClick={() => setTab('packages')}>📦 Packages</button>
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

        <main className="main">
          {tab === 'packages' && (
            <>
              <div className="page-header">
                <div>
                  <div className="page-title">PACKAGES</div>
                  <div className="page-sub">{Object.keys(packages).length} packages available</div>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowNewTicket(true); setStep(1); setCart([]); }}>
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
                      <div key={item} style={{padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 13, display: 'flex', justifyContent: 'space-between'}}>
                        <span>{item}</span>
                        <span className="text-mono">available</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

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
                        <th>Net Cost</th>
                        <th>Impressions</th>
                        <th>Creative Format</th>
                        <th>Phase 2</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {createdItems.map(item => (
                        <tr key={item.uniqueId}>
                          <td><span className="uid-tag">{item.uniqueId}</span></td>
                          <td style={{fontWeight: 600}}>{item.lineItemName}</td>
                          <td className="text-mono">{item.package}</td>
                          <td>{item.external_net_cost || '—'}</td>
                          <td>{item.reach_impressions || '—'}</td>
                          <td>{item.creative_format || '—'}</td>
                          <td>
                            {item.creative_format ?
                              <span style={{color: 'var(--accent2)', fontSize: 11, fontFamily: 'var(--mono)'}}>✓ Done</span> :
                              <span style={{color: 'var(--accent)', fontSize: 11, fontFamily: 'var(--mono)'}}>⚠ Pending</span>
                            }
                          </td>
                          <td>
                            <button className="edit-btn" onClick={() => {
                              setEditingItem(item);
                              setPhase2Data({
                                creative_format: item.creative_format || '',
                                creative_lives_on: item.creative_lives_on || '',
                                creative_supplied_by: item.creative_supplied_by || '',
                                creative_clicks_out_to: item.creative_clicks_out_to || '',
                                hard_cost_budget: item.hard_cost_budget || '',
                                hard_cost_rate: item.hard_cost_rate || '',
                                hard_cost_tied_to: item.hard_cost_tied_to || '',
                              });
                            }}>Edit Details</button>
                          </td>
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
              <div className="modal-title">{step === 1 ? 'SELECT PACKAGES' : 'EDIT CART'}</div>
              <button className="close-btn" onClick={() => setShowNewTicket(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="steps-bar">
                <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>01 — Select Packages</div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>02 — Edit Cart & Create</div>
              </div>

              {step === 1 && (
                <>
                  <div style={{marginBottom: 20, fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)'}}>
                    Select packages to add to cart.
                  </div>
                  <div className="pkg-grid">
                    {Object.entries(packages).map(([name, items]) => (
                      <div className={`pkg-card ${cart.find(c => c.package === name) ? 'in-cart' : ''}`} key={name}
                        onClick={() => cart.find(c => c.package === name) ? removeFromCart(name) : addToCart(name)}>
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

              {step === 2 && (
                <>
                  <div style={{marginBottom: 20, fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)'}}>
                    Keep required line items, remove unnecessary ones, and fill in Phase 1 details.
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
                          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: li.selected ? 12 : 0}}>
                            <input type="checkbox" checked={li.selected} onChange={() => toggleLineItem(pkg.package, li.name)} style={{width: 16, height: 16, cursor: 'pointer'}} />
                            <div className="lineitem-name" style={{margin: 0}}>{li.name}</div>
                          </div>
                          {li.selected && (
                            <div className="fields-grid">
                              <div className="field-group">
                                <div className="field-group-title">Reach</div>
                                {[['reach_sends','Sends'],['reach_impressions','Impressions'],['reach_views','Views']].map(([key, label]) => (
                                  <div className="field-item" key={key}>
                                    <div className="field-label">{label}</div>
                                    <input className="field-input" type="text" defaultValue={li[key]}
                                      onBlur={e => updateField(pkg.package, li.name, key, e.target.value)} />
                                  </div>
                                ))}
                              </div>
                              <div className="field-group">
                                <div className="field-group-title">Internal Pricing</div>
                                {[['internal_rate','Rate'],['internal_quantity','Quantity'],['internal_revenue_allocation','Revenue Allocation']].map(([key, label]) => (
                                  <div className="field-item" key={key}>
                                    <div className="field-label">{label}</div>
                                    <input className="field-input" type="text" defaultValue={li[key]}
                                      onBlur={e => updateField(pkg.package, li.name, key, e.target.value)} />
                                  </div>
                                ))}
                              </div>
                              <div className="field-group">
                                <div className="field-group-title">External Pricing</div>
                                {[['external_rate_type','Rate Type'],['external_net_cost','Net Cost']].map(([key, label]) => (
                                  <div className="field-item" key={key}>
                                    <div className="field-label">{label}</div>
                                    <input className="field-input" type="text" defaultValue={li[key]}
                                      onBlur={e => updateField(pkg.package, li.name, key, e.target.value)} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <div className="flex-gap">
                      <span className="text-mono">{selectedCount} line item{selectedCount !== 1 ? 's' : ''} ready</span>
                      <button className="btn btn-accent" disabled={selectedCount === 0 || loading} onClick={createLineItems}>
                        {loading ? '⏳ Creating...' : '✅ Create Line Items'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2 EDIT MODAL */}
      {editingItem && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setEditingItem(null)}>
          <div className="modal" style={{maxWidth: 600}}>
            <div className="modal-head">
              <div>
                <div className="modal-title">EDIT DETAILS</div>
                <div style={{fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 4}}>
                  {editingItem.lineItemName} · <span className="uid-tag">{editingItem.uniqueId}</span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setEditingItem(null)}>✕</button>
            </div>
            <div className="modal-body">
              {/* CREATIVE */}
              <div className="phase2-section">
                <div className="phase2-title">Creative</div>
                <div className="phase2-grid">
                  {[['creative_format','Format'],['creative_lives_on','Lives on'],['creative_supplied_by','Supplied by'],['creative_clicks_out_to','Clicks out to']].map(([key, label]) => (
                    <div className="field-item" key={key}>
                      <div className="field-label">{label}</div>
                      <input className="field-input" type="text"
                        value={phase2Data[key] || ''}
                        onChange={e => setPhase2Data({...phase2Data, [key]: e.target.value})}
                        placeholder="N/A"
                        style={{width: '100%'}}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* HARD COSTS */}
              <div className="phase2-section">
                <div className="phase2-title">Hard Costs (Internal)</div>
                <div className="phase2-grid">
                  {[['hard_cost_budget','Budget'],['hard_cost_rate','Rate'],['hard_cost_tied_to','Tied to']].map(([key, label]) => (
                    <div className="field-item" key={key}>
                      <div className="field-label">{label}</div>
                      <input className="field-input" type="text"
                        value={phase2Data[key] || ''}
                        onChange={e => setPhase2Data({...phase2Data, [key]: e.target.value})}
                        placeholder="N/A"
                        style={{width: '100%'}}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)'}}>
                <button className="btn btn-outline" onClick={() => setEditingItem(null)}>Cancel</button>
                <button className="btn btn-success" onClick={savePhase2}>✅ Save Details</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}