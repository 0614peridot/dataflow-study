import { useEffect, useState } from 'react';
import { useStudy } from '../context/StudyContext.jsx';
import { PRODUCT } from '../config.js';

const TABS = [
  { id: 'chat', label: 'AI Chat' },
  { id: 'product', label: `${PRODUCT.name} website` },
  { id: 'community', label: 'Simulated Reddit' },
];

export default function ControlBar() {
  const { participant, site, goTo, goBack, canGoBack, restart, events } = useStudy();
  const [confirming, setConfirming] = useState(false);
  const sourcesUnlocked = events.some((event) => event.type === 'response_revealed');
  const communityUnlocked = events.some((event) => event.type === 'community_followup_shown');
  const visibleTabs = sourcesUnlocked
    ? TABS.filter((tab) => tab.id !== 'community' || communityUnlocked)
    : TABS.filter((tab) => tab.id === 'chat');

  // Reset the two-step restart confirmation after a few seconds.
  useEffect(() => {
    if (!confirming) return undefined;
    const id = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(id);
  }, [confirming]);

  function onRestart() {
    if (confirming) {
      setConfirming(false);
      restart();
    } else {
      setConfirming(true);
    }
  }

  function downloadLog() {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `session-${participant.replace(/\s+/g, '_')}-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="controlbar" role="region" aria-label="Study controls">
      <div className="cb-inner">
        <span className="cb-label">Study</span>
        <span className="cb-name">{participant}</span>
        <nav className="cb-tabs" aria-label="Study pages">
          <button type="button" className="cb-tab cb-back" onClick={goBack} disabled={!canGoBack}>
            ← Back
          </button>
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={site === tab.id ? 'cb-tab active' : 'cb-tab'}
              aria-current={site === tab.id ? 'page' : undefined}
              onClick={() => goTo(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="cb-actions">
          <button type="button" className="cb-btn" onClick={downloadLog} title="Download what happened in this session as JSON">
            Download log
          </button>
          <button type="button" className={confirming ? 'cb-btn danger' : 'cb-btn'} onClick={onRestart}>
            {confirming ? 'Click again to restart' : 'Restart'}
          </button>
        </div>
      </div>
    </div>
  );
}
