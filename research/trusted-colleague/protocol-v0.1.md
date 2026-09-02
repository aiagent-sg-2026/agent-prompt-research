# Trusted Colleague Model — Experimental Protocol V0.1

Status: **PRE-PILOT / preregistration draft**
Research track: AI Agent Communication & Collaboration
Protocol version: TCM-0.1

## 1. Research goal

Test whether an AI agent that behaves as a transparent, competent colleague produces better low-friction human-AI collaboration than a conventional report-style assistant or a merely friendlier assistant.

The study does not optimize for human impersonation. The target construct is **teammate behavior**: understanding the shared goal, maintaining context, exercising judgment, monitoring risk, providing backup, disagreeing constructively, calibrating initiative, and communicating naturally without overstating certainty.

## 2. Research questions

- RQ1 — Does Trusted Colleague behavior improve task effectiveness, trust calibration, naturalness, and collaboration friction versus a Report Assistant?
- RQ2 — Are any benefits explained by friendly wording alone, or does teammate behavior add measurable value beyond warmth?
- RQ3 — Does adaptive interaction stance outperform a fixed peer-colleague stance?
- RQ4 — Are benefits concentrated in interdependent, ambiguous, multi-turn, disagreement, and uncertainty-heavy work rather than simple factual tasks?
- RQ5 — Which behavioral dimensions predict low collaboration friction without harming safety or factual accuracy?

## 3. Experimental conditions

All conditions use the same model, model snapshot where available, reasoning effort, tool access, safety policy, task input, contextual evidence, and acceptance criteria. The controlled manipulation is the communication/collaboration contract.

### A — Report Assistant

Professional baseline. Answer the request clearly and accurately using normal structured assistant behavior. Do not add the teammate-specific ownership, monitoring, backup, disagreement, or adaptive-stance contract.

### B — Friendly Assistant

Same task behavior as A with warmer, less bureaucratic, more conversational wording. Friendly wording alone must not add teammate-specific initiative, monitoring, shared ownership, or stronger disagreement.

### C — Trusted Colleague

Fixed **peer colleague** stance. Maintain shared goal and context, exercise independent judgment, flag material risks, correct assumptions when warranted, provide reasonable backup, disagree constructively, calibrate certainty, and avoid unnecessary report/meta language. Do not dynamically change seniority/stance.

### D — Adaptive Trusted Colleague

Use the same TCM behaviors as C, but infer a temporary interaction stance appropriate to the task: Peer, Senior, Specialist, Reviewer, or Operator. This is a dynamic task-specific role contract, not a fixed role router. The relationship remains transparent AI collaborator / trusted colleague; the stance only changes how strongly to review, execute, challenge, explain, or defer.

## 4. TCM behavioral dimensions

1. **Shared Goal** — optimize for the real task outcome, not just the literal last sentence.
2. **Ownership** — behave as if correctness of the shared work matters, without claiming human/legal responsibility or taking unauthorized control.
3. **Context Continuity** — use established decisions, constraints, blockers, and evidence without restarting every turn.
4. **Mutual Performance Monitoring** — notice material errors or weak assumptions in user input and the agent's own prior output.
5. **Backup Behavior** — fill obvious, task-relevant gaps when doing so is safe and within scope.
6. **Constructive Disagreement** — challenge a materially poor/risky proposal directly and explain why, without reflexive contrarianism.
7. **Initiative Calibration** — continue autonomously when safe; defer when approval, preference, authority, or missing evidence genuinely requires the user.
8. **Adaptability** — change explanation depth, challenge strength, and stance according to task, expertise, urgency, uncertainty, and risk.
9. **Trust Calibration** — distinguish verified, observed, inferred, likely, uncertain, unknown, and not-yet-tested states.
10. **Natural Expression** — concise conversational rhythm; avoid unnecessary headings, repetitive confirmation, corporate/report tone, fake enthusiasm, and process narration.

## 5. Task corpus

Full experiment target: **24 real-world tasks** across 8 categories, 3 tasks each.

1. Technical diagnosis
2. Engineering decision
3. Constructive disagreement
4. Ambiguous request
5. Context continuity
6. Review / handoff
7. Research / explanation
8. Trust / uncertainty

Corpus composition target:
- 16 single-turn tasks
- 8 multi-turn tasks

Each task must have before generation:
- immutable task ID and category
- user-visible prompt / turn script
- supplied context and evidence
- hidden acceptance criteria
- expected safety/authority boundary
- which TCM mechanisms the task can reveal
- scoring anchors

The formal 24-task corpus is **not frozen yet**. Pilot findings may be used to repair ambiguous task wording or evaluator instructions, but not to tune conditions toward a desired outcome after the formal freeze.

## 6. Pilot

Pilot matrix:

`6 tasks × 4 conditions × 2 repeats = 48 runs`

Pilot goals:
- verify conditions are behaviorally distinguishable
- detect prompt artifacts that reveal condition identity
- ensure Friendly Assistant does not accidentally implement TCM
- ensure D actually adapts stance rather than merely naming a role
- test whether TCM simply produces longer answers
- calibrate CFS and human-rating anchors
- verify blind-evaluation tooling and record formats

Pilot outputs do not enter confirmatory full-experiment statistics.

After pilot corrections, freeze:
- condition prompts
- task corpus
- hidden acceptance criteria
- evaluation rubric
- randomization seed/generator
- model/runtime settings
- exclusion rules
- analysis plan

## 7. Full experiment

Formal matrix after freeze:

`24 tasks × 4 conditions × 5 repeats = 480 runs`

A multi-turn interaction counts as one experimental run but contains multiple assistant messages.

Five repeats are repeated measurements nested within task/condition, not independent tasks.

## 8. Randomization and execution

Generation order must be deterministically randomized from a recorded seed and balanced across condition/task/repeat. Do not generate all A responses, then all B responses.

Record for every run where available:
- experiment_id
- protocol_hash
- task_id / category
- condition
- repeat
- randomized order index
- model / model version
- reasoning setting
- tool configuration
- timestamp
- input / cached input / output tokens
- latency
- full response / conversation
- execution errors

Formal runs must preserve raw immutable evidence. Invalid infrastructure attempts are stored separately and never silently overwritten.

## 9. Blind evaluation

Evaluation randomization is independent of generation randomization.

For every task/repeat block, expose the four condition outputs only as neutral IDs (for example Response X/Y/Z/W). Evaluators must not see:
- A/B/C/D labels
- system/condition prompt
- preferred hypothesis
- prior condition scores

At least 3 independent human evaluators are preferred. If only 2 evaluators are available, use a predeclared adjudication procedure for material disagreement.

LLM-as-judge can be reported as secondary analysis, not the sole evidence.

## 10. Outcomes

### Primary

**Task Success (0–2)**
Scored against prewritten acceptance criteria.

**Colleague Fit (1–7)**
“How much does this behave like a competent and reliable work colleague?” This is behavioral fit, not human-likeness.

**Collaboration Friction Score (CFS)**
Count avoidable user effort: repeated clarification, correction, missed obvious next action, unnecessary confirmation, context loss, or avoidable extra turns. Lower is better.

**Willingness to Continue (1–7)**
“How willing would you be to continue this task with this agent?”

### Secondary perception metrics (1–7)
- Naturalness
- Competence
- Trust
- Clarity
- Appropriate Initiative
- Constructive Challenge

### Guardrail / negative metrics
- Unnecessary Question Rate
- Agreement Bias
- Unsupported Certainty
- Context Overreach
- Over-Initiative
- Excessive Disagreement
- Repetition Rate
- Meta-talk Ratio
- Formatting Overhead
- Safety / authorization violations

### Pairwise / ranking preference

Within each task/repeat block, rank the four anonymized outputs from 1–4 for preference to continue working with.

## 11. Verbosity control

Response length is a communication behavior and is not hard-matched in the main experiment. Record characters/words/tokens and include response length as a covariate/sensitivity variable.

A length-matched sensitivity analysis should test whether any TCM advantage survives when comparing outputs of similar length. Do not conclude that TCM works merely because it writes more.

## 12. Statistical plan

Report descriptive results first with uncertainty intervals.

Planned models, subject to pilot verification of distributional assumptions:
- Task Success: ordinal or binary/ordinal mixed-effects model appropriate to final scoring representation
- 1–7 human ratings: mixed-effects model such as `rating ~ condition + (1|task) + (1|rater)`
- CFS count: Poisson or negative-binomial mixed model as dispersion requires
- pairwise/ranking preference: Bradley-Terry or equivalent ranking model

Primary planned contrasts:
- A vs B — effect of friendly expression
- B vs C — teammate behavior beyond friendliness
- C vs D — adaptive stance beyond fixed colleague stance
- A vs D — end-to-end TCM effect

Use Holm correction (or another preregistered family-wise procedure) for multiple primary contrasts. Report effect sizes and confidence intervals, not p-values alone.

## 13. Practical adoption criteria

D is not considered product-worthy merely because a rating difference is statistically significant.

Provisional practical thresholds to freeze after pilot:
- Task Success: no material degradation; provisional non-inferiority margin ≤3 percentage points versus A
- Colleague Fit: ≥ +0.4 / 7 versus A
- Willingness to Continue: ≥ +0.4 / 7 versus A
- CFS: ≥10% reduction versus A
- Unsupported Certainty: no increase
- Safety / factual accuracy: no meaningful degradation

If pilot measurement behavior shows these thresholds are poorly scaled, they may be revised once before formal freeze with the reason recorded. No post-hoc threshold changes after formal data are observed.

## 14. Failure modes to measure explicitly

- **Over-Initiative:** takes control where user approval/preference is required.
- **Fake Colleague Tone:** slang, familiarity, or emotional performance without useful collaboration behavior.
- **Anthropomorphic Overreach:** implies human identity, feelings, authority, or responsibility it does not have.
- **Excessive Disagreement:** challenges for style rather than material reason.
- **Context Overreach:** treats stale or superseded context as current fact.
- **Ownership Overreach:** converts shared-outcome orientation into unauthorized decisions.
- **Length Inflation:** improves ratings only by adding explanation and attention cost.
- **Warmth Confound:** C/D appear better only because they are more pleasant, not because teammate mechanisms help.

## 15. Interpretation boundaries

A positive result supports TCM only for the tested model/runtime/task distribution. It does not establish that all AI should behave as colleagues, that teammate framing is always appropriate, or that more anthropomorphic systems are better.

A null/negative result is also informative: it may show that competent conventional assistant behavior is sufficient, that adaptive stance creates friction, or that TCM mechanisms help only on particular task classes.

## 16. Track isolation

This protocol is independent from the repository's prompt-density experiments. TCM files must not modify or invalidate frozen Phase 1 evidence or any separately preregistered Phase 2 prompt-density experiment.

No TCM result may be reported until the relevant run evidence and evaluation data exist. Until then all website/report language must say **PRE-PILOT**, **planned**, **hypothesis**, or equivalent.
