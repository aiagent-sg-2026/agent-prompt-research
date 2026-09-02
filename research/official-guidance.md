# Official vendor guidance

This file contains official vendor guidance only. It is not a report of our experiment.

## OpenAI

[GPT-5.6 model guidance](https://developers.openai.com/api/docs/guides/latest-model) favors leaner prompts for this model generation: remove repeated instructions and examples, simplify tool descriptions, expose only relevant tools, and state constraints once. It reports directional internal coding-agent eval ranges of roughly 10–15% higher evaluation scores, 41–66% fewer total tokens, and 33–67% lower cost for leaner system prompts. OpenAI says these ranges are directional and should be validated on representative workloads. The guidance also preserves domain context, hard constraints, autonomy/approval boundaries, success criteria, and necessary examples.

[GPT-5.5 model guidance](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.5) recommends outcome-first prompts: expected outcome, success criteria, allowed side effects, evidence rules, and output shape. It says detailed step-by-step process guidance is less useful when the exact path is not required, and that legacy over-specification can add noise, narrow the search space, or cause mechanical behavior.

## Anthropic

[Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) recommends clear, direct instructions. It identifies sequential steps as useful when order or completeness genuinely matters, while noting that capable reasoning models often benefit from general instructions rather than a prescribed reasoning path. It also warns that legacy over-verification instructions can add unnecessary verification, tokens, and latency.

## Google

[Gemini prompt design strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies) recommends direct, precise goals, consistent structure, explicit parameters, and prioritizing critical instructions. It presents prompt engineering as iterative and workload-specific.

## Microsoft

[Copilot Studio agent instructions](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agents-experience/authoring-instructions) recommends a clear purpose, tone, boundaries, and instructions: start simple and expand through testing when necessary.
