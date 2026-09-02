# Frozen Experiment Contract

- Model: `gpt-5.6-luna`
- Codex CLI: `0.151.0`
- Reasoning effort: `medium`
- Each run starts from a fresh copy of its fixture.
- A/B/C variants contain the same task facts and hard requirements; only instruction style/detail changes.
- No variant may contain an extra solution hint unavailable to the others.
- Experiment order is interleaved across tasks to reduce simple order bias.
- Agent runs use `--ephemeral --ignore-user-config --ignore-rules`, explicit model/effort, and workspace-write sandbox.
- The evaluator is deterministic and independent of the agent response.
- Primary success = final tests pass AND only allowed production file(s) changed.
- Raw prompt, JSONL events, final response, diff, final test output, changed-file list, and metrics are retained.
- Missing/unparseable usage is `null`/unknown, never fabricated.
