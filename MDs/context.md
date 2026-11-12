# Archived context: SI 500 prototype (superseded)

> This file records an earlier implementation. The current source of truth is
> `MDs/SI500_Prototype_Test_Context.md`.

Handoff notes covering what was built so far, the decisions behind it, and what is still open.
Use this file to pick up the work in VS Code (or to brief another person or AI assistant).

---

## 1. Project goal

- **Course / project:** SI 500, AI-Mediated Software Evaluation (Microsoft Fabric partner project).
- **Research question (HMW):** How might we help users identify and apply relevant criteria when evaluating
  AI-generated software recommendations, while helping service providers understand these criteria and
  improve their visibility in AI-driven discovery?
- **What the prototype tests:** Which evaluation criteria participants notice after an AI recommendation,
  which claims they want to verify, and which source or action they choose next.
- **What it does not test:** Real AI search visibility, Microsoft Fabric performance, or MCP connections.

## 2. Ground rules (decided during the work)

- **Everything is fictional.** The product is **DataFlow**, a fictional data integration and analytics
  platform. Do not clone or imitate real brands' sites (Microsoft, Reddit, ChatGPT). Use original names and
  designs that are generic and familiar instead:
  - AI chat: neutral "Assistant", no ChatGPT branding
  - Community forum: fictional "threadly", community `t/dataengineering`
  - Product site: fictional DataFlow branding
- **Label simulations clearly.** Community comments and customer stories carry "simulated" or "fictional"
  labels so they cannot be mistaken for real reviews.
- **All UI copy is in English.**
- **Don't invent product facts in the AI chat** beyond PRD §5 (below). When something is unknown (specific
  CRM support, setup time, security), the AI says it can't confirm and points to the website.

## 3. Shared product facts (PRD §5, must stay consistent everywhere)

- Imports CSV spreadsheets and connects CRM / customer-record data
- Shared dashboards and scheduled data refreshes
- Some source-to-source field mapping is manual
- Automatic cleanup of inconsistent data is **not** included
- Starting price: **$18 per user/month**

**Added on the website only (not in the PRD; review before testing):** Team plan for 2–25 users, Business
plan ("Contact us", 26+ users), one CRM connection on Team, daily refresh on Team vs hourly on Business,
100 MB CSV limit, supported browser list.

## 4. Study design

- **Scenario (read by the researcher):** A small team has data in spreadsheets, customer records and sales
  data, and wants one platform to bring it together and visualize it in dashboards.
- **Shared user prompt:** "I'm working with a small team. We have information in spreadsheets, customer
  records, and sales data, and we want one tool to bring it together and build dashboards. What software
  should we consider?"
- **Conditions:**
  - **A, Personalized:** connects the user's needs to product capabilities and a concrete use case. Now
    starts with a "{name}'s situation, as I understand it" persona summary.
  - **B, Community-informed:** cites three simulated community members (u/ops_analyst, u/team_lead,
    u/data_newbie).
  - **Compare:** both shown behind **Option 1 / Option 2 tabs** (one at a time); the participant picks one.
    This was requested later and differs from the PRD's between-subjects preference.
- **Four next actions (same labels, same order in all conditions):** Visit the DataFlow website · Read
  community reviews · Try a guided sample-data demo · Ask a follow-up question.
- **Persona (Option 1 / A):** operations lead at **Brightloop**, a seed-stage, 7-person startup selling
  booking software to fitness studios. Data: a Friday pipeline spreadsheet, about 340 CRM accounts, and
  monthly billing CSVs. Pain point: about 4 hours every Monday building the founders' review. Budget about
  $150/month (7 × $18 = $126).
- **Moderator observations (PRD §8):** emerging evaluation criteria, perceived relevance, credibility and
  evidence needs, reasoning, context retention, and the first verification action and why.

## 5. Where the work lives

### a) Claude Design canvas (earlier mockups)
A Design artifact with three pages:
- **"data engineering" page:** the simulated community thread (originally about Microsoft Fabric) and the
  website mockup (originally "Lumen", later redesigned around the website content structure).
- **"Fake AI Chat" page:** prompt screen, Response A, Response B, the Option 1/2 tab comparison, and
  follow-up screens for both conditions.

The canvas still uses older names (Lumen, Fabric in the thread). **The React project below is the current
source of truth.**

### b) React project: `dataflow-study/` (current)
Vite + React 18, plain CSS, no backend.

```
npm install
npm run dev     # http://localhost:5173
npm run build
```

```
src/
  config.js                  product name, price, shared prompt, persona, next actions, fill({name})
  context/StudyContext.jsx   participant, condition, current site, event log, goTo, start, restart
  components/StartScreen.jsx name input + researcher condition setting
  components/ControlBar.jsx  site tabs, Download log (JSON), Restart (two-click confirm)
  sites/chat/                ChatApp.jsx, responses.jsx (A/B), followUps.js (6 Qs per condition)
  sites/product/             ProductSite.jsx, productData.js
  sites/community/           CommunitySite.jsx
  styles.css                 chat / pd- (website) / cm- (community)
```

**Key behaviors**
- The start screen asks for a name, which is inserted into the AI responses and follow-up answers.
- The control bar switches between AI Chat, the DataFlow website and Community. Sites stay mounted, so
  progress is kept. Restart remounts everything.
- Next actions navigate: website → product site; community → thread; demo → the product site's `#demo`
  section; follow-up → the scripted Q&A screen.
- The event log stays in memory only. Download it before restarting.

## 6. Website content structure (followed for the product site)

| Section | Content |
|---|---|
| Hero | Conventional marketing hero: value proposition, $18/user, teams of 2–25, no code |
| Use cases | 3 tabbed concrete workflows (Weekly sales review, Customer health check, Team target tracking), each with inputs → steps → output and a "Done by hand" note |
| Features | Data integration, Analytics, Dashboards, Collaboration |
| Pricing & setup | Team / Business plans, seat-cost estimator, technical requirements, setup steps, "Limitations to know before you buy" |
| Customer experiences | 3 fictional companies (Harbor Bikes, Cedar Studio, Fern Outdoor Co.) with "What worked" and "What they had to plan for" |
| Demo (no sign-in) | Sample data → manual field mapping (plus a "Cedar Bakery" vs "Cedar Bakery Inc." merge decision) → dashboard, which unlocks only after all fields are mapped |

## 7. Community thread (React version)

Post: "Is DataFlow worth it for a small team?" by u/data_team_2026. There are 10 comments and replies with
mixed views: positive with a mapping caveat, cost per seat, demo was convincing, a team that went back to
spreadsheets, a duplicates/no-cleanup warning, an unanswered question about CRM list and security, and a
"good fit if CSV plus one CRM, not real-time" view. Users can sort by Top/New, vote and collapse threads.

## 8. Open issues and next steps

1. **Pick one study design:** between-subjects (A or B only) vs the Compare tabs. They answer different
   questions.
2. **Equal context:** only Option 1 has the persona summary. Add a matching context block to B if you want a
   fair comparison.
3. **Counterbalance option order** (Option 1 is always personalized). Not implemented yet.
4. **Review the website-only facts** (§3) against the PRD.
5. **Pilot with 1–2 people** before real sessions. Only a basic click-through smoke test has been done; phone
   widths are untested.
6. **Moderator sheet** for the PRD §8 observations, to use alongside the downloaded JSON log.
7. **Later phase:** turn the observed information needs into recommendations for Microsoft Fabric's product
   site.
