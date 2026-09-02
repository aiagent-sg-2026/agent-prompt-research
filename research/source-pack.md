# Verified Source Pack

Last checked: 2026-09-02. This file is a bounded evidence pack for the report writer. It separates source classes and records interpretation limits. Do not convert indirect evidence into direct causal claims about prompt verbosity.

## Official vendor guidance

### OpenAI — GPT-5.6 model guidance
URL: https://developers.openai.com/api/docs/guides/latest-model
- Current GPT-5.6 guidance says to favor leaner prompts for this model generation.
- It recommends removing repeated instructions/examples, simplifying tool descriptions, exposing only relevant tools, and stating constraints once.
- OpenAI reports a directional sample of internal coding-agent evals in which leaner system prompts improved evaluation scores by roughly 10–15%, reduced total tokens by 41–66%, and reduced cost by 33–67%.
- OpenAI explicitly says those ranges are directional and should be validated on representative workloads.
- Lean does not mean underspecified: preserve domain context, hard constraints, autonomy/approval boundaries, success criteria, and necessary examples.

### OpenAI — GPT-5.5 model guidance
URL: https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5
- Recommends outcome-first prompting: expected outcome, success criteria, allowed side effects, evidence rules, and output shape.
- Detailed step-by-step process guidance is less useful when the exact path is not itself required.
- Legacy over-specified prompts can add noise, narrow the search space, or cause mechanical behavior.

### Anthropic — Prompting best practices
URL: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Clear, direct instructions remain important.
- Sequential steps are useful when order or completeness is genuinely required.
- For capable reasoning models, general instructions can be preferable to prescribing the reasoning path.
- Legacy over-verification instructions can cause unnecessary verification, tokens, and latency on newer models.

### Google — Gemini prompt design strategies
URL: https://ai.google.dev/gemini-api/docs/prompting-strategies
- Recommends direct, precise goals, consistent structure, explicit parameters, and prioritizing critical instructions.
- Prompt engineering is iterative and workload-specific.

### Microsoft — Copilot Studio agent instructions
URL: https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-instructions
- Recommends clear purpose, tone, boundaries, and instructions.
- Start with a clear/simple description and expand through testing when necessary.

## Peer-reviewed research

### AgentIF — NeurIPS 2025 Datasets & Benchmarks Track
URL: https://papers.neurips.cc/paper_files/paper/2025/hash/51bb3a8a33610a25aae074bfc51b1b1f-Abstract-Datasets_and_Benchmarks_Track.html
- Benchmark built from 50 real-world agentic applications and 707 human-annotated instructions across 50 tasks.
- Instructions average about 1,723 words, with a maximum around 15,630 words, and average 11.9 constraints per instruction.
- Current models struggle with complex instruction-following, especially complex constraint structures and tool specifications.
- Interpretation boundary: this supports concern about instruction complexity; it does not establish that shorter prompts causally outperform longer prompts.

### APEX — Automatic Engineering of Long Prompts, Findings of ACL 2024
URL: https://aclanthology.org/2024.findings-acl.634/
- Shows that long prompts can be systematically improved rather than merely shortened.
- Reported average accuracy improvement of about 9.2% across eight BIG-Bench Hard tasks, plus consistent GSM8K improvements.
- Counter-evidence against any universal “shorter is better” rule: quality, organization, and task fit can make long prompts effective.

### LongLLMLingua — ACL 2024
URL: https://aclanthology.org/2024.acl-long.91/
- Studies long-context compression and reports improved efficiency, latency, and in some settings performance after compression.
- Interpretation boundary: this is evidence about long context/prompt compression, not a direct A/B test of agent instruction verbosity.

### Lost in the Middle — TACL 2024
URL: https://aclanthology.org/2024.tacl-1.9/
- Shows long-context models do not use information at all context positions equally robustly; middle-position information can be harder to retrieve/use.
- Interpretation boundary: more context is not automatically better, but this is not direct proof that shorter system prompts are better.

### LLMLingua — EMNLP 2023
URL: https://aclanthology.org/2023.emnlp-main.825/
- Demonstrates substantial prompt compression with limited performance loss in evaluated settings.
- Interpretation boundary: indirect support for high-signal context, not direct evidence about coding-agent instruction style.

## Preprints / surveys

### The Prompt Report — arXiv:2406.06608
URL: https://arxiv.org/abs/2406.06608
- Broad taxonomy/survey of prompting techniques and terminology.
- Use as landscape/background only; do not treat it as peer-reviewed causal evidence for lean prompts.

## Our evidence (separate from external literature)
- Model/runtime: gpt-5.6-luna through Codex CLI 0.151.0, reasoning effort medium.
- Frozen input commit: 21e97cb.
- Completed evidence checkpoint: 6e729ec.
- 3 deterministic coding tasks × 3 instruction styles = 9 valid cells.
- All variants achieved 3/3 task success and zero unrelated edits.
- Mean input tokens: A lean 66,003; B structured 86,585.33; C prescriptive 97,599.33.
- Mean latency: A 40.665s; B 47.265s; C 58.232s.
- Mean output tokens: A 1,261.33; B 1,349.67; C 1,988.
- Mean diff lines: A 26.67; B 17.33; C 36.33.
- Retry proxy totals: A 0; B 0; C 1.
- A used 23.77% fewer mean input tokens than B and 32.37% fewer than C; mean latency was 13.96% lower than B and 30.17% lower than C.
- B produced the smallest average diff, 35% smaller than A and 52.29% smaller than C.
- Input-token/latency results were not monotonic with prompt length within every task: e.g. t2/C was longer than t2/B but used fewer input tokens and lower latency.

## Required synthesis boundary
A defensible conclusion is: **prefer the leanest prompt that remains sufficient for the task**, not the shortest prompt possible. Preserve information whose omission changes correctness, safety, approvals, business semantics, evidence requirements, or success criteria. Add procedural detail when the procedure itself is a requirement or when representative evals demonstrate a reliability gap.
