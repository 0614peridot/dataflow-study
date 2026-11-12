# SI 500 — Prototype Test Context

## Purpose
Identify **which criteria users apply when evaluating an AI-recommended data platform**, which evidence source they choose first, and how personalized guidance, community reactions and a hands-on demo shape verification.

## Test Flow

### Phase 1 — Natural AI Discovery
1. Present the scenario: a small team needs to combine spreadsheets, CRM/customer records, and sales data into dashboards.
2. Participants use **real ChatGPT**, writing their own prompts to discover and evaluate software.
3. Observe the requirements they communicate, criteria they establish, and information they seek or verify.

### Phase 2 — Controlled Prototype Evaluation
1. Present one prepared **personalized Lumen recommendation** in a simulated ChatGPT interface.
2. Ask participants which evidence source they want to check first and why.
3. Let them explore the **Lumen website**, an **AI-assisted sample-data demo**, and a **community-reaction summary** in any order. Record the order; remove each completed option so the list progresses from 3 to 2 to 1, and require all three before the session can finish. Place the simulated Reddit discussion as a clickable source beside the community summary rather than as its primary CTA.
4. Treat website reading and demo interaction as distinct behaviors. The demo stays in the AI chat: Nexa offers a simulated Lumen MCP connection, briefly shows the connection state, then asks what to do first. Participants use suggested chat instructions while a workspace panel on the right shows the actions and results.
5. Show **Finish session** only after the Lumen website tab and Reddit source tab have both been opened and the AI-assisted demo is complete. After the participant selects it, conduct a brief post-test interview covering which part was most helpful and why.

## Prototype Scope
| Asset | Quantity |
|---|---:|
| Prepared AI answer: Personalized | 1 |
| Lumen product landing page (shared) | 1 |
| Simulated Reddit discussion page | 1 (already created) |
| AI-assisted sample-data demo in Nexa | 1 |

No live AI API, MCP integration or working data upload is required. Nexa's demo actions are scripted and use fictional sample data.

## What to Validate
| Focus | Evidence to collect |
|---|---|
| **Criteria formation** | What users prioritize before and after the recommendation; criteria added, retained, or revised |
| **Verification behavior** | Which source they select, which claims they check, and what evidence is missing |
| **Context continuity** | Whether users carry their original needs through exploration or intentionally revise them |
| **Provider implications** | What product facts, use cases, setup information, limitations, or user experiences Lumen/Fabric should surface |

**Outcome:** Translate observed evaluation criteria and information gaps into recommendations for a future **Microsoft Fabric website redesign**. The prototype tests user evaluation behavior, not Fabric's actual AI search ranking or technical performance.
