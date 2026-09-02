# Literature and Guidance Notes

Research question: For modern reasoning/tool-using AI agents, when do lean outcome-first prompts outperform long prescriptive prompts, and when is more explicit procedural guidance necessary?

## Source-backed findings

1. OpenAI — GPT-5.6 Model Guidance
   - URL: https://developers.openai.com/api/docs/guides/latest-model
   - Current guidance explicitly says to favor leaner prompts.
   - OpenAI reports a sample of internal coding-agent evals where leaner system prompts improved evaluation scores by roughly 10–15%, while total tokens fell 41–66% and cost 33–67%.
   - OpenAI explicitly warns these ranges are directional and should be validated on representative workloads.
   - Guidance: state instructions once, remove repeated examples/instructions, keep relevant tools concise, preserve examples only when they encode a product requirement or fix a measured gap.

2. OpenAI — GPT-5.5 Model Guidance
   - URL: https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5
   - Recommends outcome-first prompting: define expected outcome, success criteria, allowed side effects, evidence rules, and output shape.
   - Reduce detailed step-by-step process guidance unless the exact path matters.
   - Legacy prompts can add noise, narrow the search space, or produce mechanical behavior.

3. Anthropic — Prompting Best Practices
   - URL: https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-templates-and-variables
   - For current reasoning models, prefers general instructions over prescriptive reasoning steps in many cases.
   - Recommends explicit self-check/test criteria when needed, while noting newer models may already verify strongly and can over-verify if legacy instructions are retained.

4. Google — Prompt Design Strategies for Gemini
   - URL: https://ai.google.dev/gemini-api/docs/prompting-strategies
   - Recommends direct, precise goals, consistent structure, explicit parameters, and prioritizing critical instructions.
   - For complex prompt stacks, suggests splitting instructions/components instead of overloading one prompt.
   - Prompt engineering remains iterative and workload-specific.

5. Microsoft — Prompts for Agents / Copilot
   - URL: https://learn.microsoft.com/en-us/microsoft-copilot-studio/microsoft-copilot-extend-action-prompt
   - Recommends specific, simple, brief instructions and an explicit fallback path.
   - Another Microsoft agent-instruction guide recommends reserving ordered steps for workflows where sequence is truly required.

6. Liu et al. (2024), “Lost in the Middle” — TACL
   - URL: https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00638/119630/Lost-in-the-Middle-How-Language-Models-Use-Long
   - Controlled experiments show long-context models do not use all positions equally robustly; relevant information in the middle can be harder to use.
   - This is not a direct study of prompt verbosity, but it supports a broader caution: more context is not automatically better context.

## Synthesis

The strongest cross-source consensus is not “short prompts always win.” It is: make prompts clear, high-signal, and outcome-oriented; preserve hard constraints and success criteria; use procedural detail when the path itself is part of the requirement; and validate prompt changes with representative evals rather than intuition alone.
