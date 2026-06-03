import React, { useState, useEffect } from 'react';

const API = 'http://localhost:4002/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f0f4f8; --surface: #ffffff; --border: #dde3ea;
    --accent: #0052cc; --accent2: #00875a; --text: #172b4d;
    --muted: #6b778c; --danger: #de350b; --warning: #ff8b00;
    --surface2: #f4f5f7;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; min-height: 100vh; }
  .app { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid var(--border); }
  .logo { font-size: 28px; font-weight: 700; color: var(--accent); letter-spacing: -1px; }
  .logo span { color: var(--text); }
  .subtitle { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 6px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #0065ff; box-shadow: 0 4px 12px rgba(0,82,204,0.3); }
  .btn-success { background: var(--accent2); color: white; }
  .btn-success:hover { background: #00a36b; }
  .btn-outline { background: transparent; color: var(--accent); border: 2px solid var(--accent); }
  .btn-outline:hover { background: rgba(0,82,204,0.08); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .btn-danger { background: var(--danger); color: white; }
  .tabs { display: flex; gap: 4px; background: var(--surface2); border-radius: 8px; padding: 4px; margin-bottom: 28px; }
  .tab { flex: 1; padding: 10px 16px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; background: transparent; color: var(--muted); transition: all 0.15s; text-align: center; }
  .tab.active { background: var(--surface); color: var(--accent); box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
  .modal { background: var(--surface); border-radius: 12px; width: 100%; max-width: 800px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .modal-header { padding: 24px 28px 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: var(--surface); z-index: 1; }
  .modal-title { font-size: 20px; font-weight: 700; }
  .modal-body { padding: 20px 28px 28px; }
  .close-btn { background: var(--surface2); border: none; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; }
  .package-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
  .package-card { background: var(--surface2); border: 2px solid var(--border); border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.15s; }
  .package-card:hover { border-color: var(--accent); background: rgba(0,82,204,0.04); transform: translateY(-1px); }
  .package-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .package-count { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--muted); }
  .back-btn { display: flex; align-items: center; gap: 8px; color: var(--accent); cursor: pointer; font-weight: 600; font-size: 14px; margin-bottom: 20px; background: none; border: none; padding: 0; }
  .lineitems-list { display: flex; flex-direction: column; gap: 8px; }
  .lineitem-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; }
  .lineitem-name { font-size: 14px; font-weight: 500; }
  .created-table { width: 100%; border-collapse: collapse; }
  .created-table th { background: var(--surface2); padding: 10px 14px; text-align: left; font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); border-bottom: 2px solid var(--border); }
  .created-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .created-table tr:hover td { background: var(--surface2); }
  .uid-badge { font-family: 'JetBrains Mono', monospace; font-size: 11px; background: rgba(0,82,204,0.1); color: var(--accent); padding: 3px 8px; border-radius: 4px; }
  .empty { text-align: center; padding: 60px; color: var(--muted); font-size: 14px; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-title { font-size: 18px; font-weight: 700; }
  .breadcrumb { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted); margin-bottom: 16px; }
`;

export default function App() {
  const [tab, setTab] = useState('new');
  const [packages, setPackages] = useState({});
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [createdItems, setCreatedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { fetchPackages(); fetchCreatedItems(); }, []);

  async function fetchPackages() {
    const res = await fetch(`${API}/packages`);
    setPackages(await res.json());
  }

  async function fetchCreatedItems() {
    const res = await fetch(`${API}/lineitems`);
    setCreatedItems(await res.json());
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div>
            <div className="logo">Ad<span>book</span></div>
            <div className="subtitle">Line Item Management Platform</div>
          </div>
          <button className="btn btn-primary" onClick={() => { setShowModal(true); setSelectedPackage(null); }}>
            + New Ticket
          </button>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'new' ? 'active' : ''}`} onClick={() => setTab('new')}>📦 Packages</button>
          <button className={`tab ${tab === 'created' ? 'active' : ''}`} onClick={() => { setTab('created'); fetchCreatedItems(); }}>
            📋 Created Line Items ({createdItems.length})
          </button>
        </div>

        {tab === 'new' && (
          <div>
            <div className="section-header">
              <div className="section-title">All Packages</div>
              <div style={{fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--muted)'}}>{Object.keys(packages).length} packages available</div>
            </div>
            <div className="package-grid">
              {Object.entries(packages).map(([name, items]) => (
                <div className="package-card" key={name} onClick={() => { setSelectedPackage(name); setShowModal(true); }}>
                  <div className="package-name">📁 {name}</div>
                  <div className="package-count">{items.length} line items</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'created' && (
          <div>
            <div className="section-header">
              <div className="section-title">Created Line Items</div>
            </div>
            {createdItems.length === 0 ? (
              <div className="empty">No line items created yet</div>
            ) : (
              <table className="created-table">
                <thead>
                  <tr>
                    <th>Unique ID</th>
                    <th>Line Item Name</th>
                    <th>Package</th>
                    <th>CPM</th>
                    <th>Impressions</th>
                    <th>Budget</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {createdItems.map(item => (
                    <tr key={item.uniqueId}>
                      <td><span className="uid-badge">{item.uniqueId}</span></td>
                      <td style={{fontWeight: 500}}>{item.lineItemName}</td>
                      <td style={{color: 'var(--muted)', fontSize: 12}}>{item.package}</td>
                      <td>{item.cpm || '—'}</td>
                      <td>{item.impressions ? Number(item.impressions).toLocaleString() : '—'}</td>
                      <td>{item.budget ? `$${Number(item.budget).toLocaleString()}` : '—'}</td>
                      <td style={{fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--muted)'}}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                {selectedPackage ? `📁 ${selectedPackage}` : '📦 Packages Folder'}
              </div>
              <button className="close-btn" onClick={() => { setShowModal(false); setSelectedPackage(null); }}>✕</button>
            </div>
            <div className="modal-body">
              {!selectedPackage ? (
                <>
                  <div className="breadcrumb">New Ticket → Packages Folder</div>
                  <div className="package-grid">
                    {Object.entries(packages).map(([name, items]) => (
                      <div className="package-card" key={name} onClick={() => setSelectedPackage(name)}>
                        <div className="package-name">📁 {name}</div>
                        <div className="package-count">{items.length} line items</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="breadcrumb">New Ticket → Packages Folder → {selectedPackage}</div>
                  <button className="back-btn" onClick={() => setSelectedPackage(null)}>← Back to Packages</button>
                  <div className="lineitems-list">
                    {packages[selectedPackage]?.map(item => (
                      <div className="lineitem-row" key={item}>
                        <div className="lineitem-name">{item}</div>
                        <span style={{fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--muted)'}}>available</span>
                      </div>
                    ))}
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
