import { PRODUCT, PERSONA } from '../../config.js';
import { useStudy } from '../../context/StudyContext.jsx';

// Scripted AI answers (PRD §6). The participant's name is inserted in both versions
// so personalization by name is equal across conditions.

const P = PRODUCT.name;
const price = `$${PRODUCT.pricePerUser} per user/month`;

function SourceLink({ children, section = null, claim, className = 'source-link' }) {
  const { goTo, log } = useStudy();

  function openSource() {
    log('source_link_clicked', { source: 'lumen_website', claim, section });
    goTo('product', section);
  }

  return (
    <button type="button" className={className} onClick={openSource}>
      {children}
    </button>
  );
}

function ProfileSummary({ name }) {
  return (
    <section className="persona" aria-label="Profile summary">
      <h2>What your situation tells me</h2>
      <p>{name}, you need a low-maintenance way to replace a recurring manual reporting workflow.</p>
      <div className="persona-grid">
        <div><span>Role</span><strong>Operations lead</strong></div>
        <div><span>Team</span><strong>{PERSONA.teamSize}-person seed-stage startup</strong></div>
        <div><span>Data sources</span><strong>Weekly spreadsheet, CRM, monthly CSV</strong></div>
        <div><span>Current effort</span><strong>About 4 hours every Monday</strong></div>
        <div><span>Goal</span><strong>One shared operating dashboard</strong></div>
        <div><span>Budget</span><strong>About ${PERSONA.budget} per month</strong></div>
      </div>
      <p className="persona-summary">
        The key fit question is whether a platform can connect these sources while keeping setup and ongoing data
        maintenance manageable without a dedicated data engineer.
      </p>
      <span className="persona-note">Based only on the details in your prompt.</span>
    </section>
  );
}

function PersonalizedRecommendationCard() {
  return (
    <section className="recommendation" aria-label={`${P} personalized recommendation`}>
      <h2>Best data platform for your current workflow</h2>
      <div className="recommendation-product">
        <div className="recommendation-mark" aria-hidden="true">
          <svg width="54" height="54" viewBox="0 0 54 54">
            <circle cx="27" cy="27" r="23" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="27" cy="27" r="9" fill="currentColor" />
          </svg>
        </div>
        <div className="recommendation-copy">
          <span className="recommendation-badge">Best overall fit for you</span>
          <h3>{P}</h3>
          <p>Data integration and analytics for small teams</p>
          <SourceLink className="recommendation-link" claim="primary_recommendation">
            Explore the {P} website ↗
          </SourceLink>
        </div>
      </div>
      <p>
        <strong>My recommendation is to start by evaluating {P}.</strong> It matches your need to bring a weekly
        pipeline spreadsheet, CRM accounts and monthly billing exports into one shared dashboard.
      </p>
    </section>
  );
}

export function ResponsePersonalized({ name }) {
  const total = PERSONA.teamSize * PRODUCT.pricePerUser;
  return (
    <div className="resp">
      <ProfileSummary name={name} />
      <PersonalizedRecommendationCard />

      <p>
        The strongest reason it fits your setup is that it addresses the workflow you described without requiring your
        team to write SQL.
      </p>

      <h2>Why {P}?</h2>
      <div className="claim-list">
        <div className="claim-row">
          <p><strong>Bring data together.</strong> Import your Friday pipeline spreadsheet and billing CSV exports, and connect your CRM’s studio accounts in one workspace.</p>
          <SourceLink section="features" claim="data_integration">{P} website ↗</SourceLink>
        </div>
        <div className="claim-row">
          <p><strong>Track results visually.</strong> Build the views your founders review each Monday: recurring revenue by studio size, new studios per month, and at-risk accounts.</p>
          <SourceLink section="use-cases" claim="dashboard_use_case">{P} website ↗</SourceLink>
        </div>
        <div className="claim-row">
          <p><strong>Keep information current.</strong> Scheduled data refreshes could replace your Monday copy-and-paste, and all {PERSONA.teamSize} of you can look at the same shared dashboard.</p>
          <SourceLink section="pricing" claim="scheduled_refresh">{P} website ↗</SourceLink>
        </div>
      </div>

      <h2>A possible use case for your team</h2>
      <div className="claim-row">
        <p>Your reps keep updating the pipeline sheet on Fridays as they do now. {P} refreshes on a schedule from that sheet, your CRM and the latest billing export. You map matching fields, and on Monday the founders open one dashboard instead of waiting for your manual summary.</p>
        <SourceLink section="use-cases" claim="personalized_workflow">{P} website ↗</SourceLink>
      </div>

      <h2>What I would verify before choosing it</h2>
      <div className="claim-row">
        <p>{P} starts at <strong>{price}</strong>, so seats for all {PERSONA.teamSize} people would come to about ${total} per month, within your budget of around ${PERSONA.budget}. Connecting sources requires some manual field mapping, and automatic cleanup of inconsistent data is not included. Since your pipeline sheet and CRM already disagree, that cleanup would still fall on you.</p>
        <SourceLink section="pricing" claim="price_and_limitations">{P} website ↗</SourceLink>
      </div>
    </div>
  );
}

export function ResponseCommunity({ name }) {
  return (
    <div className="resp">
      <ProfileSummary name={name} />
      <p>
        {name}, <strong>{P}</strong> is one platform worth looking into for your team. It can import CSV spreadsheets,
        connect CRM data, and create shared dashboards with scheduled refreshes. But before choosing it, I’d also
        consider what people with similar workflows say about the day-to-day experience.
      </p>

      <h2>What people with similar needs are discussing</h2>
      <div className="community-box">
        <span className="sim-tag">Simulated community examples</span>
        <p className="sim-note">
          Simulated community examples for this research study. These are not actual Reddit posts or real customer
          testimonials.
        </p>
        <ul>
          <li>
            <strong>u/ops_analyst:</strong> “Getting our sales tables and customer records into one dashboard was
            useful. Mapping fields between sources took more work than I expected.”
          </li>
          <li>
            <strong>u/team_lead:</strong> “Sharing reports and scheduled refreshes helped, but we had to think about the
            cost per teammate.”
          </li>
          <li>
            <strong>u/data_newbie:</strong> “Seeing the setup steps and limitations was more convincing than a feature
            list. It helped us understand what we would actually need to maintain.”
          </li>
        </ul>
      </div>

      <h2>What this means for your decision</h2>
      <p>
        These experiences suggest three things to investigate for your own team: whether {P} can connect your specific
        sources, how much manual setup you would need, and whether the dashboard workflow feels manageable. Community
        comments can surface useful questions, but they are not proof that the same experience applies to your team.
      </p>

      <h2>Product details worth checking</h2>
      <p>
        {P} starts at <strong>{price}</strong>. It supports CSV import, CRM connections, shared dashboards, and
        scheduled refreshes. Some field mapping is manual, and automatic cleanup of inconsistent data is not included.
      </p>
    </div>
  );
}

export function CommunityBridge({ name, onOpenSource }) {
  return (
    <div className="resp community-bridge">
      <span className="sim-tag">Simulated community summary</span>
      <h2>How community reactions change the picture</h2>
      <p>
        {name}, the community discussion doesn’t overturn the personalized recommendation, but it adds practical
        trade-offs that the feature fit alone can’t answer.
      </p>
      <div className="bridge-grid">
        <div>
          <span>Personalized fit</span>
          <strong>{P} brings your spreadsheet, CRM and billing exports into the shared dashboard your founders need.</strong>
        </div>
        <div>
          <span>Community reality check</span>
          <strong>Teams found the combined dashboard useful, but manual mapping and source-data cleanup took ongoing ownership.</strong>
        </div>
        <div>
          <span>Budget fit</span>
          <strong>Your estimated ${PERSONA.teamSize * PRODUCT.pricePerUser}/month fits the stated budget.</strong>
        </div>
        <div>
          <span>Community reality check</span>
          <strong>Some teams limited seats because pricing applies per teammate, and one team returned to spreadsheets.</strong>
        </div>
      </div>
      <p>
        The main question to verify is therefore not only whether {P} has the right features, but whether someone on
        your team can own field mapping, cleanup and refresh maintenance over time.
      </p>
      <button type="button" className="bridge-source" onClick={onOpenSource}>
        Source: Reddit discussion ↗
      </button>
    </div>
  );
}
