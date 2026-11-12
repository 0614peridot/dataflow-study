import { useEffect, useState } from 'react';

const TABS = ['Sources', 'Field mapping', 'Dashboard'];

export default function AgentDemoPanel({ step, processing, onClose }) {
  const [tab, setTab] = useState(Math.min(step, 2));

  useEffect(() => {
    if (step > 0) setTab(Math.min(step - 1, 2));
  }, [step]);

  return (
    <aside className="agent-demo" aria-label="Nexa live demo workspace">
      <header className="agent-demo-header">
        <div>
          <span>AI-assisted demo</span>
          <strong>Lumen workspace</strong>
        </div>
        <button type="button" onClick={onClose} aria-label="Close demo panel">×</button>
      </header>

      <div className="agent-demo-status">
        <span className={processing ? 'demo-live processing' : 'demo-live'} />
        {processing ? 'Nexa is working…' : step >= 3 ? 'Dashboard ready' : 'Waiting for your instruction'}
      </div>

      <nav className="agent-demo-tabs" aria-label="Demo results">
        {TABS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={tab === index ? 'active' : ''}
            disabled={step < index + 1}
            onClick={() => setTab(index)}
          >
            {step >= index + 1 ? '✓ ' : ''}{label}
          </button>
        ))}
      </nav>

      <div className="agent-demo-body">
        {step === 0 && (
          <div className="demo-empty">
            <strong>Tell Nexa what to do</strong>
            <p>Use the chat box to ask Nexa to connect your files, map fields and build a dashboard.</p>
          </div>
        )}

        {step > 0 && tab === 0 && (
          <div className="demo-sources">
            {[
              ['sales_pipeline.csv', 'Friday update · 28 rows'],
              ['CRM accounts', '340 studio accounts'],
              ['billing_export.csv', 'Monthly invoices · 342 rows'],
            ].map(([name, detail]) => (
              <div key={name}><span>Connected</span><strong>{name}</strong><small>{detail}</small></div>
            ))}
          </div>
        )}

        {step > 1 && tab === 1 && (
          <div className="demo-mapping">
            {[
              ['Spreadsheet · Studio name', 'CRM · Account name'],
              ['Billing · Client ID', 'CRM · Account ID'],
              ['Spreadsheet · Owner', 'CRM · Account owner'],
            ].map(([from, to]) => (
              <div key={from}><span>{from}</span><b>→</b><span>{to}</span><em>Mapped</em></div>
            ))}
            <div className="demo-warning"><strong>1 mismatch needs review</strong><span>“Cedar Bakery” may match “Cedar Bakery Inc.”</span></div>
          </div>
        )}

        {step > 2 && tab === 2 && (
          <div className="demo-dashboard">
            <div className="demo-kpis">
              <div><span>Monthly revenue</span><strong>$28,420</strong></div>
              <div><span>New studios</span><strong>12</strong></div>
              <div><span>At risk</span><strong>7</strong></div>
            </div>
            <div className="demo-chart">
              <strong>Recurring revenue</strong>
              <div>{[42, 56, 51, 68, 74, 86].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div>
              <span>Last 6 months · fictional sample data</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
