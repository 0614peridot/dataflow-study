# SI 500 prototype test

A React/Vite prototype for Phase 2 of the SI 500 study on how people evaluate AI-recommended data platforms.
The current research source of truth is `MDs/SI500_Prototype_Test_Context.md`.

## Study flow

### Phase 1 — outside this prototype

Participants use real ChatGPT and write their own prompts. The researcher observes the needs, evaluation criteria and
verification questions they introduce naturally.

### Phase 2 — this prototype

1. The participant selects **Use this prompt**, submits the shared scenario prompt and reads one personalized Lumen recommendation.
2. They choose among the **Lumen website**, **AI-assisted demo** and **community reactions**; the order is logged. The Reddit discussion appears as a source link beside the community summary.
3. Website reading and demo interaction are separate. Nexa first offers a simulated Lumen MCP connection; after a brief connection state, suggested chat instructions update a live workspace panel on the right.
4. Completed options disappear. The remaining 2, then 1, appear directly below the latest result. After the Lumen and Reddit tabs have both been opened and the AI demo is complete, a **Finish session** button appears. The interview begins only after that button is selected.

The app has no live AI model, API, real data upload or MCP connection. Nexa's demo actions are scripted and use fictional sample data.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Requires Node 18 or newer.

## Where to edit content

| What | File |
|---|---|
| Product name, shared facts and required evidence sources | `src/config.js` |
| Personalized response and community bridge | `src/sites/chat/responses.jsx` |
| AI-assisted demo workspace | `src/sites/chat/AgentDemoPanel.jsx` |
| Lumen landing page | `src/sites/product/ProductSite.jsx`, `src/sites/product/productData.js` |
| Simulated Reddit post and comments | `src/sites/community/CommunitySite.jsx` |
| Session state, logging and navigation | `src/context/StudyContext.jsx` |
| Styles | `src/styles.css` |

## Logged events

The in-memory JSON log records `session_start`, `suggested_prompt_used`, `prompt_sent`, `source_link_clicked`, `community_followup_shown`, `agent_demo_requested`, `demo_connection_offered`, `mcp_connect_clicked`, `mcp_connected`, `suggested_demo_prompt_used`, `agent_demo_command`, `agent_demo_step`, `agent_demo_completed`, `session_finished`, `next_action`, `navigate`, `navigate_back`,
`product_use_case`, `community_sort` and `community_vote`. Download it before restarting or closing the tab.

Session progress is also mirrored to `sessionStorage`, so using the browser Back button and returning in the same tab
restores the participant, response, navigation history, source choices and page interactions.
Only the prototype's two-click **Restart** control clears the saved study session.

## Research safeguards

- Lumen and all associated product facts, prices and customer stories are fictional.
- The Reddit discussion, usernames and comments are simulated research material.
- Every participant receives the same personalized recommendation and can choose the order of the website, AI-assisted demo and community evidence.
- Website visits, typed demo instructions, completed demo steps and community visits are logged; comparative evaluation happens in the interview.
