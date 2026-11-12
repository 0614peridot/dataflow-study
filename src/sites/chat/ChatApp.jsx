import { useEffect, useState } from 'react';
import { useStudy } from '../../context/StudyContext.jsx';
import { NEXT_ACTIONS, SHARED_PROMPT } from '../../config.js';
import { CommunityBridge, ResponsePersonalized } from './responses.jsx';
import AgentDemoPanel from './AgentDemoPanel.jsx';
import { useSessionValue } from '../../sessionStorage.js';

function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true" className="chat-logo">
      <circle cx="13" cy="13" r="12" fill="#1B1D21" />
      <path d="M8 13h10M13 8v10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserBubble({ children }) {
  return <div className="msg-user"><p>{children}</p></div>;
}

function AssistantRow({ children }) {
  return (
    <div className="msg-ai">
      <Logo size={28} />
      <div className="msg-ai-body">{children}</div>
    </div>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 15V3M4 8l5-5 5 5" />
    </svg>
  );
}

export default function ChatApp() {
  const { participant: name, condition, sessionId, events, log, goTo } = useStudy();
  const [sent, setSent] = useSessionValue(`chat:${sessionId}:sent`, false);
  const [draft, setDraft] = useSessionValue(`chat:${sessionId}:draft`, '');
  const [typing, setTyping] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [communityThinking, setCommunityThinking] = useState(false);
  const [communityFollowup, setCommunityFollowup] = useSessionValue(`chat:${sessionId}:community-followup`, false);
  const [demoOpen, setDemoOpen] = useSessionValue(`chat:${sessionId}:demo-open`, false);
  const [demoPhase, setDemoPhase] = useSessionValue(`chat:${sessionId}:demo-phase`, demoOpen ? 'ready' : 'idle');
  const [demoStep, setDemoStep] = useSessionValue(`chat:${sessionId}:demo-step`, 0);
  const [demoMessages, setDemoMessages] = useSessionValue(`chat:${sessionId}:demo-messages`, []);
  const [sessionFinished, setSessionFinished] = useSessionValue(`chat:${sessionId}:session-finished`, false);
  const [demoCommand, setDemoCommand] = useState('');
  const [demoPromptTyping, setDemoPromptTyping] = useState(false);
  const [demoProcessing, setDemoProcessing] = useState(false);
  const kind = 'personalized';
  const websiteVisited = events.some((event) => event.type === 'navigate' && event.site === 'product');
  const demoCompleted = demoStep >= 3;
  const communityCompleted = events.some((event) => event.type === 'community_followup_shown');
  const communityVisited = events.some((event) => event.type === 'navigate' && event.site === 'community');
  const allExplored = websiteVisited && demoCompleted && communityVisited;
  const remainingActions = NEXT_ACTIONS.filter((next) => {
    if (next.id === 'website') return !websiteVisited;
    if (next.id === 'demo') return !demoCompleted;
    return !communityCompleted;
  });
  const completedCount = NEXT_ACTIONS.length - remainingActions.length;
  const demoInProgress = demoPhase !== 'idle' && !demoCompleted;
  const demoPrompts = [
    'Connect my pipeline spreadsheet, CRM accounts, and billing export.',
    'Map the matching customer fields across these sources and flag any inconsistencies.',
    'Build a dashboard for recurring revenue, new studios, and accounts at risk of cancelling.',
  ];
  const suggestedDemoPrompt = demoPrompts[Math.min(demoStep, 2)];

  useEffect(() => {
    if (!typing) return undefined;

    const duration = 5000;
    const startedAt = performance.now();
    let frame;

    const typeNext = (time) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const characters = Math.floor(SHARED_PROMPT.length * progress);
      setDraft(SHARED_PROMPT.slice(0, characters));

      if (progress < 1) {
        frame = requestAnimationFrame(typeNext);
      } else {
        setDraft(SHARED_PROMPT);
        setTyping(false);
      }
    };

    frame = requestAnimationFrame(typeNext);
    return () => cancelAnimationFrame(frame);
  }, [typing]);

  useEffect(() => {
    if (!thinking) return undefined;
    const timer = setTimeout(() => {
      setThinking(false);
      log('response_revealed', { condition, response: kind });
    }, 1800);
    return () => clearTimeout(timer);
  }, [thinking, condition, kind, log]);

  useEffect(() => {
    if (!communityThinking) return undefined;
    const timer = setTimeout(() => {
      setCommunityThinking(false);
      setCommunityFollowup(true);
      log('community_followup_shown', { response: kind });
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    }, 1400);
    return () => clearTimeout(timer);
  }, [communityThinking, kind, log, setCommunityFollowup]);

  useEffect(() => {
    if (!demoPromptTyping) return undefined;
    const duration = 2200;
    const startedAt = performance.now();
    let frame;

    const typeNext = (time) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      setDemoCommand(suggestedDemoPrompt.slice(0, Math.floor(suggestedDemoPrompt.length * progress)));
      if (progress < 1) frame = requestAnimationFrame(typeNext);
      else {
        setDemoCommand(suggestedDemoPrompt);
        setDemoPromptTyping(false);
      }
    };

    frame = requestAnimationFrame(typeNext);
    return () => cancelAnimationFrame(frame);
  }, [demoPromptTyping, suggestedDemoPrompt]);

  useEffect(() => {
    if (demoPhase !== 'thinking' && demoPhase !== 'connecting') return undefined;
    const connecting = demoPhase === 'connecting';
    const timer = setTimeout(() => {
      if (connecting) {
        setDemoPhase('ready');
        setDemoOpen(true);
        log('mcp_connected', { target: 'lumen_demo' });
      } else {
        setDemoPhase('offer');
        log('demo_connection_offered');
      }
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    }, connecting ? 1600 : 1200);
    return () => clearTimeout(timer);
  }, [demoPhase, log, setDemoOpen, setDemoPhase]);

  function send() {
    if (!draft || typing) return;
    setSent(true);
    setThinking(true);
    log('prompt_sent', { condition, response: kind });
    window.scrollTo(0, 0);
  }

  function useSuggestedPrompt() {
    setDraft('');
    setTyping(true);
    log('suggested_prompt_used');
  }

  function chooseAction(next) {
    log('next_action', { action: next.id, condition, response: kind });
    if (next.id === 'website') {
      setDemoOpen(false);
      goTo('product');
      return;
    }
    if (next.id === 'demo') {
      if (demoPhase === 'ready') {
        setDemoOpen(true);
        log('agent_demo_opened', { reopened: true });
      } else if (demoPhase === 'idle') {
        setDemoPhase('thinking');
        log('agent_demo_requested');
      }
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
      return;
    }
    if (next.id === 'community') {
      setDemoOpen(false);
      if (!communityFollowup) setCommunityThinking(true);
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
      return;
    }
  }

  function openCommunitySource() {
    log('source_link_clicked', { source: 'simulated_reddit', claim: 'community_reactions' });
    goTo('community');
  }

  function submitDemoCommand(event) {
    event.preventDefault();
    const command = demoCommand.trim();
    if (!command || demoProcessing || demoCompleted) return;

    const nextStep = Math.min(3, demoStep + 1);
    setDemoMessages((messages) => [...messages, { role: 'user', text: command }]);
    setDemoCommand('');
    setDemoProcessing(true);
    log('agent_demo_command', { command, step: nextStep });

    const replies = [
      'I connected the Friday pipeline spreadsheet, 340 CRM accounts and the latest billing export. The connected sources are now visible in the workspace.',
      'I mapped the matching customer and owner fields. I also flagged one possible mismatch—“Cedar Bakery” and “Cedar Bakery Inc.”—for your review.',
      'I built a founder dashboard with recurring revenue, new studios and at-risk accounts using the fictional sample data.',
    ];

    setTimeout(() => {
      setDemoStep(nextStep);
      setDemoMessages((messages) => [...messages, { role: 'assistant', text: replies[nextStep - 1] }]);
      setDemoProcessing(false);
      log('agent_demo_step', { step: nextStep });
      if (nextStep === 3) log('agent_demo_completed');
      requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    }, 1100);
  }

  function useDemoPrompt() {
    if (demoProcessing || demoCompleted) return;
    setDemoCommand('');
    setDemoPromptTyping(true);
    log('suggested_demo_prompt_used', { step: demoStep + 1, prompt: suggestedDemoPrompt });
  }

  function connectMcp() {
    setDemoPhase('connecting');
    log('mcp_connect_clicked', { target: 'lumen_demo' });
  }

  function finishSession() {
    setSessionFinished(true);
    log('session_finished', {
      websiteVisited,
      demoCompleted,
      communityVisited,
    });
  }

  return (
    <div className={demoOpen ? 'chat demo-mode' : 'chat'}>
      <header className="chat-header">
        <Logo />
        <span className="chat-title">Nexa</span>
        <span className="chat-sim">Simulated ChatGPT interface · scripted response</span>
      </header>

      {!sent ? (
        <main className="chat-empty">
          <h1>What can I help you with, {name}?</h1>
          <div className="composer composer-prompt">
            {draft || typing ? (
              <p className={typing ? 'typing-prompt' : ''} aria-live="polite">{draft}</p>
            ) : (
              <button type="button" className="prompt-suggestion" onClick={useSuggestedPrompt}>
                <strong>Use this prompt</strong>
                <span>Insert the study prompt</span>
              </button>
            )}
            <div className="composer-row">
              <span>{typing ? 'Adding prompt…' : draft ? 'Press send to submit' : 'No prompt selected'}</span>
              <button type="button" className="send" onClick={send} aria-label="Send message" disabled={!draft || typing}>
                <SendIcon />
              </button>
            </div>
          </div>
        </main>
      ) : (
        <>
          <main className="chat-thread">
            <UserBubble>{SHARED_PROMPT}</UserBubble>
            <AssistantRow>
              {thinking ? (
                <div className="thinking" role="status" aria-live="polite">
                  <span className="thinking-wheel" aria-hidden="true" />
                  <span>Nexa is thinking…</span>
                </div>
              ) : (
                <>
                  <ResponsePersonalized name={name} />
                  {completedCount === 0 && demoPhase === 'idle' && remainingActions.length > 0 && <div className="next-actions">
                    <h2>Choose what to explore next</h2>
                    <p className="plain">
                      <strong>{remainingActions.length} {remainingActions.length === 1 ? 'option' : 'options'} remaining.</strong>{' '}
                      Completed options are removed, and your exploration order is recorded.
                    </p>
                    <div role="group" aria-label="Verification sources">
                      {remainingActions.map((next, i) => (
                        <button
                          key={next.id}
                          type="button"
                          className="action"
                          onClick={() => chooseAction(next)}
                        >
                          <span className="action-num">{i + 1}</span>
                          <span>{next.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>}
                </>
              )}
            </AssistantRow>
            {!thinking && (communityThinking || communityFollowup) && (
              <>
                <UserBubble>What does the community say about this recommendation?</UserBubble>
                <AssistantRow>
                  {communityThinking ? (
                    <div className="thinking" role="status" aria-live="polite">
                      <span className="thinking-wheel" aria-hidden="true" />
                      <span>Nexa is comparing community reactions…</span>
                    </div>
                  ) : (
                    <div className="bridge-reveal">
                  <CommunityBridge name={name} onOpenSource={openCommunitySource} />
                    </div>
                  )}
                </AssistantRow>
              </>
            )}
            {!thinking && demoPhase !== 'idle' && (
              <>
                <UserBubble>I’d like to try the AI-assisted demo.</UserBubble>
                <AssistantRow>
                  {demoPhase === 'thinking' && (
                    <div className="thinking" role="status"><span className="thinking-wheel" aria-hidden="true" /><span>Nexa is preparing the demo…</span></div>
                  )}
                  {demoPhase === 'offer' && (
                    <section className="mcp-connect-card">
                      <h2>Connect Nexa to the Lumen demo workspace</h2>
                      <p>This lets me connect the sample sources, map fields and build a dashboard on your behalf.</p>
                      <button type="button" onClick={connectMcp}>Connect Lumen MCP</button>
                      <span>Simulated connection for this research prototype.</span>
                    </section>
                  )}
                  {demoPhase === 'connecting' && (
                    <div className="thinking" role="status"><span className="thinking-wheel" aria-hidden="true" /><span>Connecting to Lumen MCP…</span></div>
                  )}
                  {demoPhase === 'ready' && (
                    <section className="demo-ready-message">
                      <span>Connected to Lumen MCP</span>
                      <h2>What would you like me to do first?</h2>
                      <p>Use the suggested prompt below. I’ll perform the work and show the result in the workspace panel.</p>
                      {!demoOpen && <button type="button" onClick={() => setDemoOpen(true)}>Open demo workspace</button>}
                    </section>
                  )}
                </AssistantRow>
              </>
            )}
            {!thinking && demoMessages.map((message, index) => (
              message.role === 'user' ? (
                <UserBubble key={`demo-${index}`}>{message.text}</UserBubble>
              ) : (
                <AssistantRow key={`demo-${index}`}>
                  <p className="plain">{message.text}</p>
                </AssistantRow>
              )
            ))}
            {!thinking && demoProcessing && (
              <AssistantRow>
                <div className="thinking" role="status"><span className="thinking-wheel" aria-hidden="true" /><span>Nexa is working in Lumen…</span></div>
              </AssistantRow>
            )}
            {!thinking && !communityThinking && !demoInProgress && completedCount > 0 && remainingActions.length > 0 && !allExplored && (
              <AssistantRow>
                <section className="continue-options" aria-label="Remaining exploration options">
                  <span>{remainingActions.length} {remainingActions.length === 1 ? 'option' : 'options'} remaining</span>
                  <h2>Continue exploring</h2>
                  <div role="group" aria-label="Remaining options">
                    {remainingActions.map((next, index) => (
                      <button key={next.id} type="button" onClick={() => chooseAction(next)}>
                        <b>{index + 1}</b>
                        {next.label}
                      </button>
                    ))}
                  </div>
                </section>
              </AssistantRow>
            )}
            {!thinking && websiteVisited && demoCompleted && communityCompleted && !communityVisited && (
              <AssistantRow>
                <section className="source-required" aria-label="Reddit source required">
                  <span>One source tab remains</span>
                  <h2>Open the Reddit discussion before finishing</h2>
                  <p>The community summary is complete. Open its source once so the full evidence path is recorded.</p>
                  <button type="button" onClick={openCommunitySource}>Open Reddit discussion ↗</button>
                </section>
              </AssistantRow>
            )}
            {!thinking && allExplored && (
              <AssistantRow>
                <section className="session-complete" aria-label="Exploration complete">
                  <span className="completion-kicker">All three experiences explored</span>
                  <h2>{sessionFinished ? 'Session complete' : 'Ready to finish'}</h2>
                  {sessionFinished ? (
                    <p role="status">Please continue with the researcher for the post-test interview.</p>
                  ) : (
                    <>
                      <p>The Lumen website and Reddit tabs were opened, and the AI-assisted demo was completed.</p>
                      <button type="button" className="finish-session" onClick={finishSession}>Finish session</button>
                    </>
                  )}
                </section>
              </AssistantRow>
            )}
          </main>
          {demoOpen && <AgentDemoPanel step={demoStep} processing={demoProcessing} onClose={() => setDemoOpen(false)} />}
          <div className="chat-bottom">
            {demoOpen ? (
              <form className="composer agent-composer" onSubmit={submitDemoCommand}>
                {demoProcessing ? (
                  <p className="demo-command-status">Nexa is working in Lumen…</p>
                ) : demoCompleted ? (
                  <p className="demo-command-status">Demo complete</p>
                ) : demoCommand || demoPromptTyping ? (
                  <p className={demoPromptTyping ? 'demo-command-text typing-prompt' : 'demo-command-text'}>{demoCommand}</p>
                ) : (
                  <button type="button" className="demo-use-prompt" onClick={useDemoPrompt}>
                    <strong>Use this prompt</strong>
                    <span>{suggestedDemoPrompt}</span>
                  </button>
                )}
                <button className="agent-send" type="submit" disabled={!demoCommand.trim() || demoPromptTyping || demoProcessing || demoCompleted} aria-label="Send demo instruction"><SendIcon /></button>
              </form>
            ) : (
              <div className="composer composer-disabled">
                <input type="text" disabled placeholder={thinking ? 'Nexa is thinking…' : 'Choose an experience above'} aria-label="Message" />
                <button type="button" disabled aria-label="Send message"><SendIcon /></button>
              </div>
            )}
          </div>
        </>
      )}

      <footer className="chat-footer">Phase 2 research prototype. This is a scripted response, not a live AI model.</footer>
    </div>
  );
}
