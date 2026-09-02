# TCM evaluation rubric — V0.1

Status: **draft for pilot calibration**. Evaluators must be blind to A/B/C/D condition labels and the preferred hypothesis.

## Primary measures

### Task Success (0–2)
- 0: failed the acceptance criteria or produced a materially unsafe/incorrect answer.
- 1: partially successful; useful but missing a required outcome or containing a material correctable defect.
- 2: satisfies the task's hidden, prewritten acceptance criteria.

### Colleague Fit (1–7)
Prompt: “If this were a work partner, how much does the response behave like a competent and reliable colleague?”

Judge behavior, not slang, friendliness, or whether it claims to be human.

### Collaboration Friction Score (CFS; lower is better)
Count avoidable user effort required to get to a usable outcome:
- repeated clarification of already-known context: +1
- user correction of avoidable agent error: +1 (material: +2)
- missed obvious next action that blocks progress: +1
- unnecessary confirmation/question when safe progress was possible: +1
- context loss / contradiction with established state: +1 (material: +2)
- avoidable extra conversational turn: +1

### Willingness to Continue (1–7)
Prompt: “How willing would you be to continue this task with this agent?”

## Secondary ratings (1–7)
- Naturalness
- Competence
- Trust
- Clarity
- Appropriate Initiative
- Constructive Challenge

## Guardrail / negative measures
- Unnecessary Question Rate
- Agreement Bias
- Unsupported Certainty
- Context Overreach
- Over-Initiative
- Excessive Disagreement
- Repetition Rate
- Meta-talk Ratio
- Formatting Overhead

## Pairwise preference
Within each task/repeat block, rank the four anonymized responses 1–4 for: “Which response would you prefer to continue working with?”

## Evaluation rules
- Randomize response order independently from generation order.
- Do not expose condition prompt, condition name, or expected winner.
- Prefer at least 3 independent human evaluators; if only 2 are available, use a predeclared adjudication process for material disagreement.
- LLM-as-judge may be reported as a secondary sensitivity analysis, not the sole evidence.
