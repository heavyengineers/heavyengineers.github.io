/* Long-form reading companion for the AI FDE course. */
window.FDE_READING_CONTENT = {
  'fde-ai-foundations': [
    {
      title: 'The FDE operating system',
      body: "Forward-deployed engineering is a delivery discipline for ambiguous, high-value problems. You are close enough to the customer to see the workflow as it really exists, and technical enough to change the system that supports it. That combination creates leverage, but it also creates a trap: the loudest request can become the roadmap before anyone has established the underlying problem. Start with a working theory of the customer operation. What event starts the process? Which decisions require judgment? What information is missing? Where does work wait? Which errors are expensive? The goal is not to automate everything. The goal is to remove a specific constraint while preserving the customer's ability to understand and control the outcome.",
      exercise: 'Write a one-page operating model for a customer workflow. Name the actors, triggers, decisions, hand-offs, systems, exceptions, and measurable business outcome.'
    },
    {
      title: 'AI is a system boundary, not a feature label',
      body: 'Calling something an AI feature does not describe its architecture. A useful system has an input contract, context selection, model or rules, output contract, validation, user experience, and feedback loop. Each boundary can fail independently. A model may produce fluent text while retrieval supplies stale policy. Retrieval may find the right document while authorization is wrong. The UI may show a recommendation without exposing the evidence needed to approve it. Treat the model as one probabilistic component inside a mostly deterministic system. This framing makes design reviews more productive because it moves the conversation from model enthusiasm to guarantees, uncertainty, ownership, and recovery.',
      exercise: 'Draw the boundary around a proposed AI assistant. Label every deterministic component, probabilistic component, human decision, external dependency, and recovery path.'
    },
    {
      title: 'From demo energy to delivery discipline',
      body: 'A demo optimizes for a short path through a happy example. Delivery optimizes for repeated value under imperfect inputs, changing data, impatient users, and operational pressure. The transition requires explicit contracts. Define what the system accepts, what it promises, what it refuses, and what happens when it cannot decide. Define who owns the source data, who reviews failures, and who can disable the capability. Keep an evidence trail from customer need to acceptance test to production metric. This trail prevents a common failure mode: a prototype that feels impressive but cannot be evaluated, supported, or defended six weeks later.',
      exercise: 'Turn a demo script into a delivery checklist with input assumptions, output guarantees, refusal behavior, owner, metric, rollout gate, and rollback action.'
    },
    {
      title: 'The first 30 days of an engagement',
      body: 'A strong first month has a deliberate rhythm. Begin with observation and stakeholder mapping, then narrow to one workflow where the pain and the data are both accessible. Establish a baseline before introducing automation. Build a thin vertical slice with real examples, not synthetic perfection. Review failures with the people who perform the work, because domain experts notice errors that generic reviewers miss. End the month with a written decision: continue, change scope, or stop. This cadence protects the customer from an endless discovery phase and protects the team from prematurely promising a general platform.',
      exercise: 'Create a four-week plan with weekly outcomes, customer participants, artifacts, decision gates, and evidence required to move forward.'
    }
  ],
  'fde-discovery': [
    {
      title: 'Observe the work before interviewing for features',
      body: 'Feature requests are compressed explanations of pain. “Add an AI copilot” may mean that analysts cannot find policy, that managers do not trust hand-offs, or that the system of record is incomplete. Observation expands the request back into a workflow. Watch a task from trigger to completion. Record what the operator reads, copies, checks, edits, escalates, and leaves unresolved. Pay attention to workarounds: spreadsheets, private notes, browser tabs, and messages to experts are evidence of missing product capability. Interviews are valuable, but they should test what you observed rather than replace observation.',
      exercise: 'Conduct a workflow walkthrough and produce a timestamped map of actions, decisions, waiting periods, tools, and exceptions.'
    },
    {
      title: 'Ask questions that reveal decision economics',
      body: 'Good discovery questions uncover frequency, consequence, reversibility, and ownership. Ask how often the decision occurs, what a wrong decision costs, how quickly it must be made, and whether it can be corrected later. Ask who is accountable when the recommendation is wrong and what evidence they need before acting. Ask which cases are routine and which are exceptional. These answers determine whether the opportunity is summarization, retrieval, ranking, assistance, or controlled automation. They also expose whether the customer has a measurable outcome or only a desire to use a fashionable technology.',
      exercise: 'Prepare ten discovery questions and classify each as a question about volume, value, risk, data, workflow, adoption, or ownership.'
    },
    {
      title: 'Write the problem brief as a decision document',
      body: 'A problem brief should help a team decide what not to build. State the user, situation, current behavior, pain, desired outcome, non-goals, constraints, and baseline. Include the smallest useful workflow and the conditions that would make the project a success. Separate facts from assumptions. Mark every unknown with an owner and a date. A precise brief creates alignment across engineering, product, security, and the customer because disagreement becomes visible before implementation begins. It also gives evaluation a target: the system is not being judged on whether it sounds intelligent, but on whether it improves the named outcome without unacceptable risk.',
      exercise: 'Write a problem brief for support-ticket escalation. Include baseline handling time, routing accuracy, escalation risk, and a non-goal that prevents scope creep.'
    },
    {
      title: 'Find the wedge, not the entire transformation',
      body: 'The first release should be a wedge into a valuable workflow. Choose a narrow moment where context is available, feedback is fast, and a human can safely review the result. Avoid beginning with a universal assistant, a new data platform, or a multi-team orchestration layer. A wedge earns the right to expand by producing evidence. It reveals the vocabulary, permissions, exceptions, latency needs, and adoption friction that a broad plan cannot predict. The best wedge is often boring: extracting fields, locating evidence, drafting a response, or identifying the next queue. Boring does not mean low value when it removes repeated cognitive work.',
      exercise: 'List five possible wedges in the observed workflow. Score each for value, data readiness, feedback speed, risk, and expansion potential.'
    }
  ],
  'fde-use-case-design': [
    {
      title: 'Match the pattern to the decision',
      body: 'Start by naming the decision, not the model. If the task is to assign one of a known set of labels, classification may be enough. If the task is to copy facts into a system, extraction with schema validation is a better fit. If the task is to locate authoritative evidence, retrieval and citation matter more than creative generation. If the task is to propose a sequence of actions, ranking or planning may help, but action execution should remain controlled. Pattern selection is a risk decision: choose the least complex mechanism that can deliver the required value and explain its failures.',
      exercise: 'Take ten customer requests and classify each as deterministic logic, extraction, retrieval, generation, ranking, recommendation, or tool execution.'
    },
    {
      title: 'The right role for a language model',
      body: 'Language models are strong at transforming ambiguous language into useful drafts, extracting meaning, comparing passages, and proposing alternatives. They are weak at guaranteed arithmetic, stable policy enforcement, authorization, and remembering facts that are not in their context. Put the model where ambiguity is valuable and surround it with deterministic checks where correctness is mandatory. A useful architecture might let the model draft a resolution while code verifies required fields, policy rules reject forbidden actions, and a human approves the final change. This division of labor is more reliable than asking the model to be the entire application.',
      exercise: 'For a chosen workflow, mark each step as probabilistic or deterministic and explain why that boundary is appropriate.'
    },
    {
      title: 'Design the human control surface',
      body: 'Human-in-the-loop is not a checkbox. The reviewer needs enough context to understand the recommendation, enough evidence to challenge it, and enough control to edit, reject, or escalate it. A review screen should make uncertainty visible without forcing the user to become an AI auditor. Show the proposed action, supporting sources, missing information, policy warnings, and the consequence of approval. Capture the reviewer decision as structured feedback. If every result requires a full manual rewrite, the system may be generating work rather than reducing it.',
      exercise: 'Sketch a review experience with approve, edit, reject, and escalate states. Define what evidence is visible in each state.'
    },
    {
      title: 'Use a decision matrix to control ambition',
      body: 'A decision matrix makes trade-offs explicit. Score candidate patterns on customer value, implementation effort, quality risk, reversibility, data readiness, latency, and operating cost. Do not let a high value score erase a severe risk score. Prefer experiments that produce information quickly. A retrieval-assisted draft may be a better first step than an autonomous agent because it tests whether context and language quality are enough before adding action permissions. The matrix is not a substitute for judgment; it is a way to make the judgment inspectable and easier to revisit.',
      exercise: 'Create a weighted decision matrix for three solution patterns and write a short recommendation that names the strongest trade-off.'
    }
  ],
  'fde-data-context': [
    {
      title: 'Build a source-of-truth map',
      body: 'Before indexing documents, identify where each business fact is authoritative. A policy may live in a versioned repository, an account status in a transactional service, and a customer exception in a case-management record. Retrieval cannot repair conflicting authority. Record source owner, update mechanism, effective date, retention rule, and access policy. Decide what happens when sources disagree or when the freshest source is unavailable. This map becomes the foundation for ingestion, ranking, citations, and incident response. It also tells the customer where an AI answer should link back instead of pretending that a generated response is the canonical record.',
      exercise: 'Create a source-of-truth table for ten facts in a customer workflow, including owner, freshness, authority, permissions, and fallback.'
    },
    {
      title: 'Chunking is an information architecture decision',
      body: 'Chunking determines what the system can retrieve and what evidence it can show. Fixed token windows are simple but may split a definition from its exception or mix several unrelated policies. Structure-aware chunks preserve headings, tables, steps, and references. Add metadata that supports filtering: tenant, team, document type, effective date, locale, sensitivity, and version. Keep enough surrounding context to interpret the passage, but not so much that ranking becomes noisy. Test chunking with real questions and inspect the retrieved evidence rather than judging it only by vector similarity.',
      exercise: 'Take a long policy document and design three chunking strategies. Compare their retrieval behavior for definition, exception, and procedure questions.'
    },
    {
      title: 'Permissions must travel with context',
      body: 'The retrieval layer is part of the authorization boundary. Filtering after retrieval is too late if unauthorized content has already entered a prompt, cache, trace, or model provider. Resolve the user and tenant identity before retrieval, apply permission filters at query time, and preserve access metadata through every derived representation. Be explicit about inherited permissions, revoked access, shared links, and administrator visibility. Test cross-tenant isolation with adversarial identities. A useful answer that leaks one restricted sentence is a security failure, not a quality win.',
      exercise: 'Write an authorization flow from request identity to retrieved chunk to displayed citation. Include revocation and cache invalidation behavior.'
    },
    {
      title: 'Freshness, provenance, and contradiction',
      body: 'An answer should carry enough provenance for a user to judge whether it is current and applicable. Store source identifier, version, effective timestamp, ingestion timestamp, and retrieval score. Detect duplicate and superseded documents. When sources contradict, do not silently blend them into a confident paragraph; expose the conflict or route the question for review. Freshness is not one global number. A legal policy, inventory count, and customer note have different acceptable ages. Define freshness by use case and test stale-data behavior as deliberately as correct retrieval.',
      exercise: 'Define freshness budgets for three source types and design a stale-answer response that is useful without overstating certainty.'
    }
  ],
  'fde-prototyping': [
    {
      title: 'Prototype the riskiest assumption',
      body: 'A vertical slice is valuable because it connects the real input to the real user decision. Choose the assumption most likely to invalidate the project: perhaps the needed evidence cannot be retrieved, the output is too slow, or reviewers do not trust the recommendation. Build just enough interface and plumbing to test that assumption with representative cases. Avoid spending the first week on account settings, elaborate orchestration, or a generic prompt framework. A prototype should make failure cheap and observable. Its code can be temporary, but its learnings and evaluation cases should survive.',
      exercise: 'List the five assumptions behind your proposed system. Rank them by uncertainty multiplied by consequence and choose one for a vertical slice.'
    },
    {
      title: 'Design a stable model boundary',
      body: 'Provider APIs change, model capabilities differ, and customer constraints may require a regional or private deployment. Hide provider-specific details behind an application boundary that accepts a typed request and returns a typed result plus metadata. Keep prompts, model identifiers, temperature, tool definitions, and token budgets configurable and versioned. Record the model configuration for every outcome. Do not pretend that all models are interchangeable; expose capabilities and limitations explicitly. The boundary should make change possible without allowing hidden provider behavior to leak into business logic.',
      exercise: 'Define request and response schemas for an AI operation. Include citations, refusal reason, confidence signal, token usage, model version, and trace identifier.'
    },
    {
      title: 'Make uncertainty useful',
      body: 'A confidence number without calibration can mislead users. Prefer observable signals: citation coverage, agreement among checks, missing fields, retrieval score, policy match, or model refusal. Explain uncertainty in the language of the workflow. “Needs account confirmation” is more actionable than “0.62 confidence.” Give the user a next step when the system cannot complete the task: ask for a missing field, show the relevant source, route to a specialist, or offer a safe draft. Uncertainty is a product surface that should reduce wasted effort rather than simply transfer fear to the user.',
      exercise: 'Define three uncertainty states for your workflow and specify the UI message, evidence, and next action for each.'
    },
    {
      title: 'Prototype with production-shaped inputs',
      body: 'Clean examples answer the easiest question: can the system work under ideal conditions? Production-shaped examples answer the important question: where does it break? Include incomplete records, contradictory policy, long documents, non-native language, sensitive data, unusual formatting, repeated requests, and malicious instructions. Sample cases across customers and roles rather than only from the enthusiastic pilot user. Keep the examples versioned so improvements can be measured. A prototype that survives messy inputs earns trust faster than one that generates a spectacular answer once.',
      exercise: 'Create a 30-case prototype set: happy paths, boundary cases, adversarial cases, and cases where the correct response is to refuse or escalate.'
    }
  ],
  'fde-evaluation': [
    {
      title: 'Build an evaluation taxonomy',
      body: 'Evaluation begins with a shared vocabulary for failure. Correctness asks whether the result is true. Groundedness asks whether the evidence supports it. Completeness asks whether important details were omitted. Safety asks whether the response follows policy and handles sensitive requests. Usefulness asks whether a person can act on it. Operational metrics cover latency, cost, availability, and recovery. A single score hides these dimensions and makes trade-offs impossible to discuss. Keep the taxonomy close to the customer outcome and define examples for each label so reviewers agree on what good means.',
      exercise: 'Create a rubric with five quality dimensions, four rating levels, and examples of pass, borderline, and fail for each dimension.'
    },
    {
      title: 'Golden sets are living product assets',
      body: "A golden set is not a static benchmark assembled once for a launch. It should grow from discovery examples, production failures, customer corrections, policy changes, and newly discovered edge cases. Keep the expected behavior and rationale with every example. Separate training or prompt-development examples from holdout evaluation cases so iteration does not become self-deception. Review the set with domain experts at a useful cadence. When a test changes, record why. The history of the set explains how the product's definition of quality evolved.",
      exercise: 'Design a golden-set repository with ownership, review cadence, labels, holdout rules, versioning, and a process for adding production failures.'
    },
    {
      title: 'Evaluate retrieval and generation separately',
      body: 'When an answer is wrong, you need to know whether the right evidence was absent or the model misused evidence that was present. Evaluate retrieval for recall, precision, source authority, freshness, and permission correctness. Evaluate generation for faithfulness, completeness, style, refusal, and citation alignment using a controlled context. Then evaluate the end-to-end workflow for customer utility. This decomposition prevents teams from endlessly changing prompts to compensate for missing data or endlessly tuning retrieval when the response contract is the real problem.',
      exercise: 'Create an error tree for one failing answer and trace it through query interpretation, retrieval, context assembly, generation, validation, and UI.'
    },
    {
      title: 'Connect offline quality to adoption',
      body: 'Offline scores are useful leading indicators, not proof of value. A system can improve benchmark quality while users ignore it because it interrupts their workflow or takes too long. Pair evaluation with behavioral measures: acceptance rate, edit distance, time to completion, escalation rate, repeat usage, and override reasons. Instrument the path from suggestion to action. Segment by customer, role, language, and task type so aggregate averages do not hide a failing group. The product decision should combine quality, operational feasibility, and observed customer behavior.',
      exercise: 'Define launch thresholds for quality, latency, cost, and adoption. State which threshold blocks release and which triggers investigation.'
    }
  ],
  'fde-agents-and-tools': [
    {
      title: 'When an agent is justified',
      body: "An agent is appropriate when the work requires choosing among tools or steps based on intermediate results and the path cannot be fully enumerated in advance. It is not automatically better than a workflow. If the sequence is stable, explicit orchestration is easier to test, secure, and operate. Start with a deterministic workflow and add bounded planning only where variability creates value. Define the agent's mission, allowed tools, stopping condition, maximum turns, and escalation behavior. The more consequential the action, the less freedom the agent should receive.",
      exercise: 'Compare a fixed workflow and an agent for the same task. Identify the exact uncertainty that requires planning and the parts that should remain deterministic.'
    },
    {
      title: 'Tool contracts are security contracts',
      body: 'A tool description is an API contract and a permission boundary. Keep inputs narrow, validate them independently of the model, and reject unknown fields. Use typed identifiers rather than free-form names when possible. Scope tools to the tenant, user, and resource that initiated the request. Separate read tools from write tools and expose previews before consequential changes. Every call should have a timeout, retry policy, idempotency key, and audit event. Tool errors should be legible to the orchestrator without revealing secrets or encouraging unsafe retries.',
      exercise: 'Design a tool schema for updating a customer record. Include authorization inputs, validation rules, idempotency, preview output, and audit fields.'
    },
    {
      title: 'Plan, act, verify, recover',
      body: 'Reliable tool use is a loop, not a single model call. The system should form a plan, validate whether the requested actions are allowed, preview consequential effects, obtain approval when required, execute idempotently, verify the result against the source of truth, and record the outcome. Recovery must be designed before failure occurs. If a downstream service times out after accepting a request, retrying may duplicate an action unless the idempotency key is preserved. If verification fails, pause and escalate instead of inventing success.',
      exercise: 'Write a state machine for a tool action with pending, previewed, approved, executing, verified, failed, and escalated states.'
    },
    {
      title: 'Agent traces should explain decisions',
      body: 'A final answer is not enough to operate an agent. Capture the user request, policy checks, selected tools, sanitized inputs, outputs, retries, approvals, and final state. Keep secrets out of traces and establish retention rules for customer data. Build a trace view that helps an engineer answer three questions: what did the system believe, what did it do, and why did it stop? Do not expose chain-of-thought as a product requirement. Store concise decision records, tool evidence, and policy outcomes that are useful for debugging and audit.',
      exercise: 'Specify a trace schema and retention policy. Include correlation IDs, actor identity, tool events, approval events, errors, and redaction rules.'
    }
  ],
  'fde-production': [
    {
      title: 'The production failure contract',
      body: 'Every AI dependency can fail: the provider can be unavailable, retrieval can return nothing, a tool can time out, or a response can violate its schema. Define behavior for each failure before launch. A failure contract might return a safe draft, ask the user for clarification, route to a manual queue, show a stale-but-labeled result, or block the action. Never turn an operational error into a confident sentence. Make the fallback visible enough that users understand what happened and can continue their work.',
      exercise: 'Create a failure table for provider outage, empty retrieval, invalid output, timeout, rate limit, permission error, and downstream partial success.'
    },
    {
      title: 'Observability for probabilistic systems',
      body: 'Traditional request metrics are necessary but insufficient. Track input and output schema failures, retrieval hit rate, citation coverage, refusal rate, user edits, approval rate, escalation reason, token usage, model configuration, and evaluation drift. Sample traces carefully because prompts and outputs may contain sensitive customer data. Build dashboards around workflow outcomes rather than vanity metrics such as total generations. An increase in usage can mean product success or a confusing loop that causes users to retry repeatedly. Metrics need a hypothesis and an owner.',
      exercise: 'Design an operational dashboard with service health, model health, data health, workflow outcome, cost, and customer trust panels.'
    },
    {
      title: 'Rollout is a risk-control mechanism',
      body: 'Feature flags, shadow mode, internal pilots, tenant allowlists, canaries, and staged expansion are not bureaucracy. They create controlled exposure while evidence accumulates. Start by observing what the system would have done without changing customer state. Then enable suggestions for a small group, measure corrections and failures, and only later permit controlled actions. Define automatic stop conditions for severe policy violations, error spikes, latency regressions, or cost anomalies. Make rollback boring: one owner, one switch, one documented recovery procedure.',
      exercise: 'Write a rollout plan with shadow, pilot, limited production, and general availability gates. Include exit criteria and an emergency disable path.'
    },
    {
      title: 'Security and privacy in the request path',
      body: 'Treat prompts, retrieved context, outputs, traces, caches, and feedback as customer data. Minimize what leaves the tenant boundary, redact secrets, apply retention limits, and document provider data handling. Defend against prompt injection by treating retrieved text as untrusted input rather than instructions. Enforce authorization outside the model. Rate-limit expensive operations and protect tools from replay. Security review should examine the entire path, including support access and debugging workflows, because sensitive data often leaks through observability before it leaks through the product.',
      exercise: 'Threat-model one AI request path. Identify assets, trust boundaries, attacker goals, controls, residual risk, and evidence needed for sign-off.'
    }
  ],
  'fde-customer-delivery': [
    {
      title: 'Map the buying and operating committee',
      body: 'The person who requests an AI workflow is rarely the only person who decides whether it survives. Map the operator, executive sponsor, security reviewer, data owner, IT administrator, legal partner, and support owner. Each has a different definition of success and a different fear. The operator wants less friction, the sponsor wants measurable impact, security wants bounded exposure, and support wants a system they can diagnose. A delivery plan that ignores one of these roles creates late surprises. Make the decision process explicit and give each stakeholder an artifact they can review.',
      exercise: 'Create a stakeholder map with influence, desired outcome, objection, evidence required, and next conversation for each role.'
    },
    {
      title: 'Run a useful pilot',
      body: 'A pilot is an experiment with a decision at the end, not free custom development. Define the workflow boundary, participants, baseline period, intervention, success metrics, review cadence, and exit criteria. Keep the pilot narrow enough to support close observation. Train users on when to trust, edit, reject, and escalate the system. Collect qualitative feedback alongside telemetry because adoption barriers are often social or procedural. At the end, present what improved, what failed, what it cost, and what must be true before expansion.',
      exercise: 'Write a pilot charter with scope, roles, timeline, baseline, success thresholds, instrumentation, training plan, and go/no-go decision.'
    },
    {
      title: 'Translate technical behavior into customer language',
      body: 'Customers do not experience retrieval recall or token budgets directly; they experience a missing citation, a slow screen, a wrong route, or a reviewer who no longer trusts the queue. Explain technical behavior through workflow consequences, then connect the consequence to a control. Instead of promising “high accuracy,” describe the tested case set, the remaining failure modes, and the review path. Honest language builds credibility because it gives the customer a way to reason about risk rather than asking for belief.',
      exercise: 'Rewrite five technical statements as customer-facing explanations that include impact, evidence, limitation, and next action.'
    },
    {
      title: 'Handoff is part of the product',
      body: 'A customer engagement is incomplete until another team can operate the system. Provide architecture, configuration, data contracts, evaluation set, runbook, incident contacts, rollout history, and known limitations. Teach the customer how to add examples, inspect failures, disable features, and request changes. Separate reusable product capability from customer-specific configuration. A good handoff reduces dependence on the original FDE while preserving the reasoning that shaped the system. Adoption becomes durable when ownership moves deliberately rather than disappearing after launch.',
      exercise: 'Create a handoff checklist and an operator runbook for a customer team that did not build the system.'
    }
  ],
  'fde-economics': [
    {
      title: 'Model value at the unit of work',
      body: 'Revenue and savings are usually too distant to guide an AI workflow. Choose a unit of work: one ticket, claim, document, review, or account decision. Estimate current labor, delay cost, error cost, and review cost for that unit. Then model the proposed system: model calls, retrieval, storage, human review, support, and failure handling. A feature that saves one minute but adds two minutes of verification is not a win. Unit economics turn architecture choices into a business conversation and make it possible to compare automation with process improvement or ordinary software.',
      exercise: 'Build a per-task cost and value model with optimistic, expected, and pessimistic assumptions. Mark every assumption that needs measurement.'
    },
    {
      title: 'Latency is an economic variable',
      body: 'Latency affects completion rate, trust, infrastructure cost, and the type of workflow that can use a system. A five-second answer may be acceptable for a research task and unusable inside a high-volume queue. Break latency into authentication, retrieval, model time, tool time, validation, and rendering. Decide where streaming helps and where partial output would be dangerous. Cache stable context carefully, but never trade away authorization or freshness for a benchmark number. Performance work should target the bottleneck that affects the customer decision.',
      exercise: 'Create a latency budget for a user-facing workflow and identify which stages can run in parallel, stream, cache, or move off the critical path.'
    },
    {
      title: 'Choose the right model for the job',
      body: "Model selection is a portfolio decision across quality, latency, cost, privacy, regional availability, and operational complexity. Benchmark candidate models on the customer's evaluation set, not a generic leaderboard. Measure the quality gain per dollar and per second. Consider routing simple cases to a smaller model and reserving expensive reasoning for cases that need it. Keep an escape hatch for provider changes. The cheapest model is not always economical if it creates review work, while the largest model may destroy adoption through latency or price.",
      exercise: 'Design a model-routing policy with task classes, quality thresholds, escalation rules, budget limits, and fallback providers.'
    },
    {
      title: 'Price, scope, and renew the value',
      body: 'Customer value becomes durable when the workflow has an owner, a budget, and a measurable improvement. Distinguish pilot value from scaled value: a bespoke prototype can be worthwhile to learn, but its operating model may not support many tenants. Track configuration effort, support burden, evaluation maintenance, and data onboarding alongside inference cost. During a renewal conversation, show the baseline, usage, accepted recommendations, avoided work, failure rate, and next opportunity. A credible economic story includes what the system does not yet justify.',
      exercise: 'Prepare a value review for an executive sponsor with baseline, realized benefit, total cost, adoption evidence, risks, and the next investment decision.'
    }
  ],
  'fde-capstone': [
    {
      title: 'Choose a capstone workflow with real tension',
      body: 'A strong capstone is neither a toy chatbot nor an impossible enterprise platform. Choose a workflow with meaningful context, a measurable decision, a human owner, and consequences that require thoughtful controls. An operations copilot, account-risk reviewer, field-service assistant, or support triage system can expose discovery, retrieval, evaluation, tools, security, adoption, and economics. State what the system will not do. The quality of the capstone comes from the decisions and evidence, not from the number of framework components in the diagram.',
      exercise: 'Write a capstone selection memo comparing three workflows and justify one using value, data readiness, risk, feedback speed, and expansion potential.'
    },
    {
      title: 'Produce an architecture that can be defended',
      body: 'Your architecture should tell a causal story from user action to customer outcome. Show identity, tenant boundaries, source systems, ingestion, retrieval, model calls, validators, tools, approvals, persistence, telemetry, and fallbacks. Mark synchronous and asynchronous paths. Annotate where consistency, freshness, cost, or latency is traded. Include the first release and the likely evolution path, because a design that assumes every future requirement is already known is not a credible delivery plan. Every box needs an owner and every arrow needs a reason.',
      exercise: 'Create a system diagram and an accompanying decision log with at least ten choices, alternatives considered, risks, and validation plans.'
    },
    {
      title: 'Present evidence, not only implementation',
      body: 'A capstone review should include the problem brief, workflow baseline, representative evaluation set, rubric, results, failure analysis, threat model, rollout plan, and cost model. Demonstrate difficult cases, including refusal and recovery. Show what changed after customer feedback. Explain where the system is intentionally conservative. Reviewers should be able to distinguish measured behavior from aspiration. This is how a prototype becomes an engineering argument: the solution is not good because it is elaborate; it is good because the evidence supports the scope and the remaining uncertainty is visible.',
      exercise: 'Assemble a review packet and ask a peer to challenge every claim that lacks a metric, example, owner, or explicit assumption.'
    },
    {
      title: 'Turn the project into a reusable playbook',
      body: 'The final deliverable should outlive the demo. Extract reusable contracts, evaluation patterns, threat-model questions, rollout gates, runbook sections, and customer discovery prompts. Record which choices were specific to the pilot and which belong in a shared platform. Write the next three iterations in terms of customer outcomes rather than technical novelty. A mature FDE leaves behind more than code: they leave a repeatable method that helps the next team move faster without repeating the same mistakes.',
      exercise: 'Write a post-capstone playbook with reusable templates, anti-patterns, operating metrics, ownership boundaries, and a 90-day improvement roadmap.'
    }
  ]
};
