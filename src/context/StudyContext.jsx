import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearStudySession, readSession, removeSession, writeSession } from '../sessionStorage.js';

const StudyContext = createContext(null);

const now = () => new Date().toISOString();

export function StudyProvider({ children }) {
  const [initial] = useState(() => readSession('study', null));
  const [participant, setParticipant] = useState(initial?.participant || ''); // empty = start screen
  const [condition, setCondition] = useState(initial?.condition || 'personalized');
  const [site, setSite] = useState(initial?.site || 'chat'); // 'chat' | 'product' | 'community'
  const [history, setHistory] = useState(initial?.history || []);
  const [focus, setFocus] = useState(initial?.focus || null); // { section, n } for scrolling to a section
  const [sessionId, setSessionId] = useState(initial?.sessionId || 1);
  const [events, setEvents] = useState(initial?.events || []);

  useEffect(() => {
    if (!participant) {
      removeSession('study');
      return;
    }
    writeSession('study', { participant, condition, site, history, focus, sessionId, events });
  }, [participant, condition, site, history, focus, sessionId, events]);

  // Records what the participant does, with timestamps. Download from the control bar.
  const log = useCallback((type, detail = {}) => {
    setEvents((ev) => [...ev, { t: now(), type, ...detail }]);
  }, []);

  const goTo = useCallback(
    (next, section = null) => {
      if (next !== site) setHistory((stack) => [...stack, site]);
      setSite(next);
      setFocus(section ? { section, n: Date.now() } : null);
      log('navigate', { site: next, section });
      if (!section) window.scrollTo(0, 0);
    },
    [log, site]
  );

  const goBack = useCallback(() => {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setHistory((stack) => stack.slice(0, -1));
    setSite(previous);
    setFocus(null);
    log('navigate_back', { from: site, site: previous });
    window.scrollTo(0, 0);
  }, [history, log, site]);

  const start = useCallback((name, cond) => {
    setParticipant(name);
    setCondition(cond);
    setSite('chat');
    setHistory([]);
    setFocus(null);
    setEvents([{ t: now(), type: 'session_start', participant: name, condition: cond }]);
    window.scrollTo(0, 0);
  }, []);

  const restart = useCallback(() => {
    clearStudySession();
    setParticipant('');
    setSite('chat');
    setHistory([]);
    setFocus(null);
    setEvents([]);
    setSessionId((s) => s + 1);
    window.scrollTo(0, 0);
  }, []);

  const value = useMemo(
    () => ({ participant, condition, site, focus, sessionId, events, log, goTo, goBack, canGoBack: history.length > 0, start, restart }),
    [participant, condition, site, focus, sessionId, events, log, goTo, goBack, history.length, start, restart]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used inside StudyProvider');
  return ctx;
}
