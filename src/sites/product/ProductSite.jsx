import { useEffect, useMemo, useState } from 'react';
import { useStudy } from '../../context/StudyContext.jsx';
import { PRODUCT } from '../../config.js';
import { useSessionValue } from '../../sessionStorage.js';
import {
  DEMO_MAPPINGS,
  DEMO_MONTHS,
  DEMO_ROWS,
  DEMO_SOURCES,
  FEATURES,
  STORIES,
  USE_CASES,
} from './productData.js';

const P = PRODUCT.name;
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

function Mark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="14" cy="14" r="12" fill="none" stroke="var(--pd-accent)" strokeWidth="2.4" />
      <circle cx="14" cy="14" r="5" fill="var(--pd-accent)" />
    </svg>
  );
}

function SectionHead({ eyebrow, title, children }) {
  return (
    <div className="pd-head">
      <span className="pd-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export default function ProductSite() {
  const { focus, site } = useStudy();

  // Scroll to a section when another study control links here.
  useEffect(() => {
    if (site === 'product' && focus?.section) {
      requestAnimationFrame(() => document.getElementById(`pd-${focus.section}`)?.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [focus, site]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(`pd-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pd">
      <div className="pd-banner">
        Research prototype · {P} is a fictional product · All data, prices and customer stories on this page are simulated
      </div>

      <nav className="pd-nav" aria-label={`${P} website`}>
        <div className="pd-wrap pd-nav-inner">
          <div className="pd-brand">
            <Mark />
            <span>{P}</span>
          </div>
          <div className="pd-links">
            <a href="#pd-use-cases" onClick={scrollTo('use-cases')}>Use cases</a>
            <a href="#pd-features" onClick={scrollTo('features')}>Features</a>
            <a href="#pd-pricing" onClick={scrollTo('pricing')}>Pricing &amp; setup</a>
            <a href="#pd-customers" onClick={scrollTo('customers')}>Customers</a>
          </div>
          <a className="pd-btn pd-nav-cta" href="#pd-pricing" onClick={scrollTo('pricing')}>
            See pricing &amp; setup
          </a>
        </div>
      </nav>

      <Hero scrollTo={scrollTo} />
      <UseCases />
      <Features />
      <Pricing />
      <Customers />

      <footer className="pd-footer">
        <div className="pd-wrap">
          <span className="pd-footer-brand">{P}</span>
          <span>
            Research prototype. {P}, its prices and all customer stories shown here are fictional and simulated.
            Nothing on this page describes a real product or real customers.
          </span>
        </div>
      </footer>
    </div>
  );
}

function Hero({ scrollTo }) {
  return (
    <header className="pd-hero">
      <div className="pd-wrap pd-hero-inner">
        <div className="pd-hero-copy">
          <span className="pd-eyebrow">Data integration and analytics for small teams</span>
          <h1>Turn scattered spreadsheets and CRM records into one shared dashboard.</h1>
          <p>
            {P} brings your CSV spreadsheets, customer records and sales data into one workspace, so your team can build
            dashboards, schedule refreshes and review the same numbers.
          </p>
          <div className="pd-row">
            <a className="pd-btn pd-btn-outline" href="#pd-pricing" onClick={scrollTo('pricing')}>
              See pricing and setup
            </a>
          </div>
          <div className="pd-facts">
            <span>From ${PRODUCT.pricePerUser} per user/month</span>
            <span aria-hidden="true">·</span>
            <span>Built for teams of 2–25</span>
            <span aria-hidden="true">·</span>
            <span>No code or SQL required</span>
          </div>
        </div>
        <div className="pd-preview" aria-hidden="true">
          <div className="pd-preview-top">
            <i />
            <i />
            <i />
            <span>Weekly sales review</span>
          </div>
          <div className="pd-preview-kpis">
            <div>
              <span>Revenue</span>
              <b>$26,350</b>
            </div>
            <div>
              <span>Orders</span>
              <b>12</b>
            </div>
            <div>
              <span>Top region</span>
              <b>South</b>
            </div>
          </div>
          <div className="pd-preview-bars">
            {[0.76, 0.91, 0.99, 1].map((h, i) => (
              <div key={i} style={{ height: `${h * 100}%`, opacity: 0.55 + i * 0.15 }} />
            ))}
          </div>
          <div className="pd-preview-chips">
            <span>sales_pipeline.csv</span>
            <span>CRM accounts</span>
            <span>billing_export.csv</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function UseCases() {
  const { log, sessionId } = useStudy();
  const [idx, setIdx] = useSessionValue(`product:${sessionId}:use-case`, 0);
  const uc = USE_CASES[idx];

  return (
    <section id="pd-use-cases" className="pd-section pd-wrap">
      <SectionHead eyebrow="Use cases" title="From the files you already have to a dashboard your team shares">
        Each workflow shows the sources you start with, the steps you take in {P}, and the dashboard you end up with,
        including the parts you do by hand.
      </SectionHead>

      <div className="pd-pills" role="tablist" aria-label="Use case workflows">
        {USE_CASES.map((u, i) => (
          <button
            key={u.tab}
            type="button"
            role="tab"
            aria-selected={idx === i}
            className={idx === i ? 'pd-pill active' : 'pd-pill'}
            onClick={() => {
              setIdx(i);
              log('product_use_case', { useCase: u.tab });
            }}
          >
            {u.tab}
          </button>
        ))}
      </div>

      <div className="pd-card pd-uc">
        <p className="pd-uc-summary">{uc.summary}</p>
        <div className="pd-uc-cols">
          <div>
            <span className="pd-step-label">1 · Start with</span>
            {uc.inputs.map((i) => (
              <div key={i.name} className="pd-input">
                <b>{i.name}</b>
                <span>{i.detail}</span>
              </div>
            ))}
          </div>
          <div>
            <span className="pd-step-label">2 · Steps in {P}</span>
            <ol>
              {uc.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="pd-warn-sm">
              <strong>Done by hand:</strong> {uc.manual}
            </div>
          </div>
          <div>
            <span className="pd-step-label">3 · End with</span>
            <div className="pd-output">
              <b>{uc.outputTitle}</b>
              <ul>
                {uc.outputs.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="pd-features" className="pd-band">
      <div className="pd-section pd-wrap">
        <SectionHead eyebrow="Features" title="Everything in one workspace" />
        <div className="pd-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="pd-card pd-feature">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="var(--pd-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="4" width="24" height="24" rx="7" />
                <path d={f.icon} />
              </svg>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <ul>
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { sessionId } = useStudy();
  const [seats, setSeats] = useSessionValue(`product:${sessionId}:seats`, 7);
  const note =
    seats >= 25
      ? 'The Team plan covers up to 25 users. For more, see Business.'
      : seats <= 2
        ? 'The Team plan starts at 2 users.'
        : `${seats} users × $${PRODUCT.pricePerUser} per user/month`;

  return (
    <section id="pd-pricing" className="pd-section pd-wrap">
      <SectionHead eyebrow="Pricing & setup" title="Check the fit before you sign up">
        Prices, team size, what you need to get started, and what {P} does not do.
      </SectionHead>

      <div className="pd-grid pd-grid-2">
        <div className="pd-card pd-plan pd-plan-main">
          <div className="pd-plan-title">
            <h3>Team</h3>
            <span className="pd-badge">Most small teams</span>
          </div>
          <div className="pd-price">
            <b>${PRODUCT.pricePerUser}</b>
            <span>per user / month, billed monthly</span>
          </div>
          <span className="pd-muted">For teams of 2–25 users</span>
          <ul>
            <li>CSV spreadsheet import</li>
            <li>1 CRM connection</li>
            <li>Unlimited dashboards</li>
            <li>Scheduled refresh, up to once a day</li>
            <li>Share dashboards with workspace members</li>
          </ul>
          <div className="pd-calc">
            <span className="pd-calc-title">Estimate your monthly cost</span>
            <div className="pd-calc-row">
              <button type="button" aria-label="Fewer users" onClick={() => setSeats((s) => Math.max(2, s - 1))}>
                −
              </button>
              <span aria-live="polite">{seats} users</span>
              <button type="button" aria-label="More users" onClick={() => setSeats((s) => Math.min(25, s + 1))}>
                +
              </button>
              <b>{money(seats * PRODUCT.pricePerUser)} / month</b>
            </div>
            <span className="pd-muted">{note}</span>
          </div>
        </div>
        <div className="pd-card pd-plan">
          <h3>Business</h3>
          <div className="pd-price">
            <b className="pd-price-sm">Contact us</b>
          </div>
          <span className="pd-muted">For teams of 26 users or more</span>
          <ul>
            <li>Everything in Team</li>
            <li>Multiple CRM connections</li>
            <li>Scheduled refresh, up to once an hour</li>
            <li>Admin controls for who can view or edit</li>
          </ul>
        </div>
      </div>

      <div className="pd-grid pd-grid-3">
        <div className="pd-card">
          <h3>Technical requirements</h3>
          <ul>
            <li>A current version of Chrome, Edge, Firefox or Safari</li>
            <li>Spreadsheets exported as CSV files, up to 100 MB each</li>
            <li>Admin access to your CRM to approve the connection</li>
            <li>One person to own field mapping and dashboard setup</li>
            <li>No coding, SQL or installation required</li>
          </ul>
        </div>
        <div className="pd-card">
          <h3>How setup works</h3>
          <ol>
            <li>Create a workspace and invite your team</li>
            <li>Upload your CSV spreadsheets</li>
            <li>Connect your CRM</li>
            <li>Map matching fields between sources, by hand</li>
            <li>Build your first dashboard</li>
            <li>Choose a refresh schedule</li>
          </ol>
        </div>
        <div className="pd-card pd-limits">
          <h3>Limitations to know before you buy</h3>
          <ul>
            <li>Field mapping between sources is manual.</li>
            <li>
              {P} does not automatically clean inconsistent data, such as duplicates or names spelled differently in
              two sources. Fix these in the source or while mapping.
            </li>
            <li>Refreshes run on a schedule. {P} does not stream data in real time.</li>
            <li>The Team plan includes one CRM connection.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Customers() {
  return (
    <section id="pd-customers" className="pd-band">
      <div className="pd-section pd-wrap">
        <SectionHead eyebrow="Customer experiences" title="What worked, and what teams had to plan for" />
        <span className="pd-sim-tag">Illustrative stories · fictional companies created for this research prototype</span>
        <div className="pd-grid pd-grid-3">
          {STORIES.map((s) => (
            <article key={s.company} className="pd-card pd-story">
              <div>
                <h3>{s.company}</h3>
                <span className="pd-muted">{s.profile}</span>
              </div>
              <div className="pd-story-sources">
                <strong>Sources:</strong> {s.sources}
              </div>
              <div>
                <span className="pd-good">What worked</span>
                <p>{s.worked}</p>
              </div>
              <div>
                <span className="pd-plan-for">What they had to plan for</span>
                <p>{s.planFor}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  const { log } = useStudy();
  const [step, setStep] = useState('data');
  const [mapped, setMapped] = useState({});
  const [merged, setMerged] = useState(false);
  const [region, setRegion] = useState('All');

  const mappedCount = DEMO_MAPPINGS.filter((m) => mapped[m.id]).length;
  const ready = mappedCount === DEMO_MAPPINGS.length;

  function go(next) {
    setStep(next);
    log('demo_step', { step: next });
  }

  const data = useMemo(() => {
    const rows = DEMO_ROWS.map((r) =>
      merged && r.customer === 'Cedar Bakery Inc.' ? { ...r, customer: 'Cedar Bakery' } : r
    ).filter((r) => region === 'All' || r.region === region);
    const sum = (key) =>
      rows.reduce((acc, r) => {
        acc[r[key]] = (acc[r[key]] || 0) + r.revenue;
        return acc;
      }, {});
    const total = rows.reduce((a, r) => a + r.revenue, 0);
    const byM = sum('month');
    const byR = sum('region');
    const byC = sum('customer');
    const max = Math.max(1, ...DEMO_MONTHS.map((m) => byM[m] || 0));
    return {
      rows,
      total,
      topRegion: Object.keys(byR).sort((a, b) => byR[b] - byR[a])[0] || '—',
      months: DEMO_MONTHS.map((m) => ({ label: m, value: byM[m] || 0, h: Math.max(4, Math.round(((byM[m] || 0) / max) * 140)) })),
      top: Object.keys(byC)
        .sort((a, b) => byC[b] - byC[a])
        .map((c) => ({ name: c, value: byC[c] })),
    };
  }, [merged, region]);

  const tabs = [
    ['data', '1 · Sample data'],
    ['map', '2 · Map fields'],
    ['dash', '3 · Dashboard'],
  ];

  return (
    <section id="pd-demo" className="pd-section pd-wrap">
      <SectionHead eyebrow="Demo · no sign-in" title="Walk through a sample workflow">
        Use a mock sales dataset for Brightside Supply Co., a fictional business. Look at the sample sources, map the
        fields yourself, then explore the dashboard.
      </SectionHead>

      <div className="pd-card pd-demo">
        <div className="pd-demo-tabs" role="tablist" aria-label="Demo steps">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={step === id} className={step === id ? 'active' : ''} onClick={() => go(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="pd-demo-body">
          {step === 'data' && (
            <>
              <div className="pd-grid pd-grid-3">
                {DEMO_SOURCES.map((s) => (
                  <div key={s.name} className="pd-input">
                    <b>{s.name}</b>
                    <span>{s.detail}</span>
                  </div>
                ))}
              </div>
              <b className="pd-small-title">Preview: sales_pipeline.csv</b>
              <div className="pd-table-wrap">
                <table className="pd-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Month</th>
                      <th>Region</th>
                      <th>Customer</th>
                      <th className="num">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_ROWS.slice(0, 6).map((r) => (
                      <tr key={r.id}>
                        <td className="pd-muted">{r.id}</td>
                        <td>{r.month}</td>
                        <td>{r.region}</td>
                        <td>{r.customer}</td>
                        <td className="num">{money(r.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" className="pd-btn" onClick={() => go('map')}>
                Next: map fields
              </button>
            </>
          )}

          {step === 'map' && (
            <>
              <p className="pd-lead-sm">
                {P} doesn’t match fields between sources automatically. Confirm how each field in your spreadsheets
                lines up with the CRM.
              </p>
              {DEMO_MAPPINGS.map((m) => {
                const done = !!mapped[m.id];
                return (
                  <div key={m.id} className="pd-map-row">
                    <b>{m.from}</b>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5A606C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 10h12M12 6l4 4-4 4" />
                    </svg>
                    <b>{m.to}</b>
                    <button
                      type="button"
                      aria-pressed={done}
                      className={done ? 'pd-toggle on' : 'pd-toggle'}
                      onClick={() => {
                        setMapped((x) => ({ ...x, [m.id]: !x[m.id] }));
                        log('demo_mapping', { field: m.id, mapped: !done });
                      }}
                    >
                      {done ? 'Mapped' : 'Confirm mapping'}
                    </button>
                  </div>
                );
              })}
              <div className="pd-map-row pd-map-warn">
                <div>
                  <b>Inconsistent values found</b>
                  <span>
                    “Cedar Bakery” in the spreadsheet and “Cedar Bakery Inc.” in the CRM look like the same customer.{' '}
                    {P} won’t merge them automatically.
                  </span>
                </div>
                <button
                  type="button"
                  aria-pressed={merged}
                  className={merged ? 'pd-toggle on' : 'pd-toggle'}
                  onClick={() => {
                    setMerged((v) => !v);
                    log('demo_merge', { merged: !merged });
                  }}
                >
                  {merged ? 'Marked as same customer' : 'Mark as same customer'}
                </button>
              </div>
              <div className="pd-row">
                <button type="button" className="pd-btn" onClick={() => go('dash')}>
                  Next: view dashboard
                </button>
                <span className="pd-muted">
                  {mappedCount} of {DEMO_MAPPINGS.length} fields mapped.
                </span>
              </div>
            </>
          )}

          {step === 'dash' && !ready && (
            <div className="pd-card pd-locked">
              <b>Map all fields first</b>
              <span>
                {mappedCount} of {DEMO_MAPPINGS.length} fields mapped. The dashboard needs every source mapped before it
                can combine them.
              </span>
              <button type="button" className="pd-btn pd-btn-outline" onClick={() => go('map')}>
                Back to field mapping
              </button>
            </div>
          )}

          {step === 'dash' && ready && (
            <>
              <div className="pd-row">
                <b className="pd-small-title">Region</b>
                {['All', 'North', 'South', 'West'].map((r) => (
                  <button key={r} type="button" aria-pressed={region === r} className={region === r ? 'pd-pill active' : 'pd-pill'} onClick={() => setRegion(r)}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="pd-grid pd-grid-4">
                {[
                  ['Total revenue', money(data.total)],
                  ['Orders', String(data.rows.length)],
                  ['Average order', money(data.rows.length ? data.total / data.rows.length : 0)],
                  ['Top region', data.topRegion],
                ].map(([label, value]) => (
                  <div key={label} className="pd-kpi">
                    <span>{label}</span>
                    <b>{value}</b>
                  </div>
                ))}
              </div>
              <div className="pd-dash">
                <div className="pd-card pd-chart">
                  <b>Revenue by month</b>
                  <div
                    className="pd-bars"
                    role="img"
                    aria-label={'Bar chart of revenue by month: ' + data.months.map((m) => `${m.label} ${money(m.value)}`).join(', ')}
                  >
                    {data.months.map((m) => (
                      <div key={m.label} className="pd-bar-col">
                        <span>{money(m.value)}</span>
                        <div style={{ height: m.h }} />
                      </div>
                    ))}
                  </div>
                  <div className="pd-bar-labels">
                    {data.months.map((m) => (
                      <span key={m.label}>{m.label}</span>
                    ))}
                  </div>
                </div>
                <div className="pd-card pd-top">
                  <b>Revenue by customer</b>
                  {data.top.map((c) => (
                    <div key={c.name} className="pd-top-row">
                      <span>{c.name}</span>
                      <b>{money(c.value)}</b>
                    </div>
                  ))}
                  {!merged && (
                    <span className="pd-warn-sm">“Cedar Bakery” and “Cedar Bakery Inc.” are counted as two customers because they weren’t merged during mapping.</span>
                  )}
                </div>
              </div>
              <span className="pd-muted">Sample data · scheduled refresh: daily at 6:00 (simulated)</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
