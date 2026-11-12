import { useMemo, useState } from 'react';
import { useStudy } from '../../context/StudyContext.jsx';
import { PRODUCT } from '../../config.js';
import { useSessionValue } from '../../sessionStorage.js';

// Simulated Reddit discussion. Nothing on this page is a real post or user.
// Several viewpoints on purpose: positive, mixed, negative and unanswered questions.
// u/ops_analyst, u/team_lead and u/data_newbie match the quotes used in the AI chat (Version B).

const P = PRODUCT.name;

const POST = {
  community: 'r/dataengineering',
  author: 'u/data_team_2026',
  age: '3 days ago',
  title: `Is ${P} worth it for a small team?`,
  body: `We're a small team trying to combine spreadsheets, customer records, and sales data into dashboards. ${P} keeps coming up, but I'm wondering if it's overkill for our needs. Has anyone used it for a similar project? What should we check before signing up?`,
  votes: 24,
};

const COMMENTS = [
  {
    id: 'c1',
    author: 'u/ops_analyst',
    age: '3 days ago',
    votes: 42,
    text: 'Getting our sales tables and customer records into one dashboard was useful. Mapping fields between sources took more work than I expected.',
    replies: [
      {
        id: 'c1r1',
        author: 'u/data_team_2026',
        age: '3 days ago',
        votes: 6,
        text: 'How long did the mapping take you, roughly?',
        replies: [
          {
            id: 'c1r1r1',
            author: 'u/ops_analyst',
            age: '2 days ago',
            votes: 9,
            text: 'For us, a few afternoons. Most of it was customer names that were spelled differently in the CRM and our sheets. It doesn’t clean that up for you.',
          },
        ],
      },
    ],
  },
  {
    id: 'c2',
    author: 'u/team_lead',
    age: '3 days ago',
    votes: 31,
    text: 'Sharing reports and scheduled refreshes helped, but we had to think about the cost per teammate. Not everyone on our team got a seat.',
  },
  {
    id: 'c3',
    author: 'u/data_newbie',
    age: '2 days ago',
    votes: 27,
    text: 'Seeing the setup steps and limitations was more convincing than a feature list. It helped us understand what we would actually need to maintain.',
  },
  {
    id: 'c4',
    author: 'u/spreadsheet_holdout',
    age: '2 days ago',
    votes: 19,
    text: 'We tried it and went back to spreadsheets. The price was fine for 4 people, but nobody owned the field mapping, so the dashboards slowly drifted out of date.',
    replies: [
      {
        id: 'c4r1',
        author: 'u/ops_analyst',
        age: '2 days ago',
        votes: 11,
        text: 'Same thing almost happened to us. It got better once one person was clearly responsible for mapping and refreshes.',
      },
    ],
  },
  {
    id: 'c5',
    author: 'u/analytics_dev',
    age: '1 day ago',
    votes: 15,
    text: 'If your CRM has duplicates, you’ll see them in every chart. There’s no automatic cleanup, so budget time to fix the source data first.',
  },
  {
    id: 'c6',
    author: 'u/curious_founder',
    age: '1 day ago',
    votes: 8,
    text: 'Does anyone know which CRMs it connects to? I couldn’t find a clear list. Also wondering how it handles security for customer data.',
    replies: [
      {
        id: 'c6r1',
        author: 'u/team_lead',
        age: '20 hours ago',
        votes: 3,
        text: 'Not sure about the full list. I’d ask their team directly before committing.',
      },
    ],
  },
  {
    id: 'c7',
    author: 'u/bi_consultant',
    age: '14 hours ago',
    votes: 5,
    text: 'For a team that small, it can be a good fit if your sources are mostly CSVs plus one CRM. If you need real-time numbers, look elsewhere; it refreshes on a schedule.',
  },
];

const AGE_ORDER = { '14 hours ago': 0, '20 hours ago': 1, '1 day ago': 2, '2 days ago': 3, '3 days ago': 4 };
const countAll = (list) => list.reduce((n, c) => n + 1 + countAll(c.replies || []), 0);

function Arrow({ dir, active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={active ? 'var(--cm-accent)' : '#6B7180'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'up' ? 'M10 4l6 7h-4v5H8v-5H4z' : 'M10 16l6-7h-4V4H8v5H4z'} />
    </svg>
  );
}

function Votes({ base, vote, onVote, label }) {
  return (
    <div className="cm-votes">
      <button type="button" aria-label={`Upvote ${label}`} aria-pressed={vote === 1} onClick={() => onVote(vote === 1 ? 0 : 1)}>
        <Arrow dir="up" active={vote === 1} />
      </button>
      <span>{base + vote}</span>
      <button type="button" aria-label={`Downvote ${label}`} aria-pressed={vote === -1} onClick={() => onVote(vote === -1 ? 0 : -1)}>
        <Arrow dir="down" active={vote === -1} />
      </button>
    </div>
  );
}

function Comment({ c, depth, votes, setVote, collapsed, toggle }) {
  const isCollapsed = collapsed[c.id];
  const initial = c.author.replace('u/', '').charAt(0).toUpperCase();
  return (
    <div className="cm-comment" style={{ marginLeft: depth ? 20 : 0 }}>
      <div className="cm-comment-head">
        <span className="cm-avatar" aria-hidden="true">
          {initial}
        </span>
        <b>{c.author}</b>
        <span className="cm-muted">· {c.age}</span>
        <button type="button" className="cm-collapse" onClick={() => toggle(c.id)} aria-expanded={!isCollapsed}>
          {isCollapsed ? `Show (${1 + countAll(c.replies || [])})` : 'Hide'}
        </button>
      </div>
      {!isCollapsed && (
        <div className="cm-comment-body">
          <p>{c.text}</p>
          <div className="cm-comment-actions">
            <Votes base={c.votes} vote={votes[c.id] || 0} onVote={(v) => setVote(c.id, v)} label={`comment by ${c.author}`} />
            <span className="cm-muted">Reply</span>
          </div>
          {(c.replies || []).map((r) => (
            <Comment key={r.id} c={r} depth={depth + 1} votes={votes} setVote={setVote} collapsed={collapsed} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommunitySite() {
  const { log, sessionId } = useStudy();
  const [sort, setSort] = useSessionValue(`community:${sessionId}:sort`, 'top');
  const [votes, setVotes] = useSessionValue(`community:${sessionId}:votes`, {});
  const [collapsed, setCollapsed] = useSessionValue(`community:${sessionId}:collapsed`, {});

  const sorted = useMemo(() => {
    const list = [...COMMENTS];
    if (sort === 'top') list.sort((a, b) => b.votes - a.votes);
    else list.sort((a, b) => AGE_ORDER[a.age] - AGE_ORDER[b.age]);
    return list;
  }, [sort]);

  function setVote(id, v) {
    setVotes((x) => ({ ...x, [id]: v }));
    log('community_vote', { id, vote: v });
  }

  return (
    <div className="cm">
      <header className="cm-header">
        <div className="cm-wrap cm-header-inner">
          <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
            <rect x="2" y="4" width="18" height="14" rx="5" fill="var(--cm-accent)" />
            <rect x="9" y="11" width="17" height="13" rx="5" fill="none" stroke="var(--cm-accent)" strokeWidth="2.2" />
          </svg>
          <span className="cm-logo">reddit</span>
          <span className="cm-proto">Simulated Reddit discussion · Research prototype</span>
        </div>
      </header>

      <div className="cm-wrap cm-layout">
        <main className="cm-main">
          <div className="cm-sim-note">
            Simulated Reddit discussion for this research study. These are not real Reddit posts, real users, or real
            customer reviews of any product.
          </div>

          <article className="cm-card cm-post">
            <Votes base={POST.votes} vote={votes.post || 0} onVote={(v) => setVote('post', v)} label="post" />
            <div className="cm-post-body">
              <div className="cm-meta">
                <b>{POST.community}</b>
                <span className="cm-muted">
                  · Posted by {POST.author} · {POST.age}
                </span>
              </div>
              <h1>{POST.title}</h1>
              <p>{POST.body}</p>
              <span className="cm-muted">{countAll(COMMENTS)} comments</span>
            </div>
          </article>

          <section className="cm-card cm-comments" aria-label="Comments">
            <div className="cm-sort">
              <span>Sort by</span>
              {[
                ['top', 'Top'],
                ['new', 'New'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={sort === id}
                  className={sort === id ? 'active' : ''}
                  onClick={() => {
                    setSort(id);
                    log('community_sort', { sort: id });
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {sorted.map((c) => (
              <Comment
                key={c.id}
                c={c}
                depth={0}
                votes={votes}
                setVote={setVote}
                collapsed={collapsed}
                toggle={(id) => setCollapsed((x) => ({ ...x, [id]: !x[id] }))}
              />
            ))}
          </section>
        </main>

        <aside className="cm-side">
          <div className="cm-card">
            <b>{POST.community}</b>
            <p>A place to discuss data pipelines, warehouses, dashboards and the tools teams use to build them.</p>
            <span className="cm-muted">Simulated subreddit for research</span>
          </div>
          <div className="cm-card">
            <b>Community rules</b>
            <ol>
              <li>Share experiences, not ads</li>
              <li>Say what your setup looked like</li>
              <li>Be kind to beginners</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
