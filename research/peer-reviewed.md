# Peer-reviewed literature

These sources are peer-reviewed publications. Relevance is labelled because none is a direct replication of this coding-agent A/B pilot.

## Directly relevant to instruction complexity

[AgentIF — NeurIPS 2025 Datasets & Benchmarks Track](https://papers.neurips.cc/paper_files/paper/2025/hash/51bb3a8a33610a25aae074bfc51b1b1f-Abstract-Datasets_and_Benchmarks_Track.html) builds a benchmark from 50 real-world agentic applications and 707 human-annotated instructions across 50 tasks. Instructions average about 1,723 words and 11.9 constraints; current models struggle with complex instruction-following, especially constraint structures and tool specifications. This supports concern about complexity, but does not establish that shorter prompts causally outperform longer prompts.

[APEX — Findings of ACL 2024](https://aclanthology.org/2024.findings-acl.634/) shows that long prompts can be systematically improved rather than simply shortened, with reported average accuracy improvement of about 9.2% across eight BIG-Bench Hard tasks and consistent GSM8K improvements. This is counter-evidence to a universal “shorter is better” rule: quality, organization, and task fit matter.

## Indirect context-efficiency evidence

[LongLLMLingua — ACL 2024](https://aclanthology.org/2024.acl-long.91/) studies long-context compression and reports efficiency, latency, and sometimes performance improvements after compression. It is indirect evidence about context compression, not a direct A/B test of agent instruction verbosity.

[Lost in the Middle — TACL 2024](https://aclanthology.org/2024.tacl-1.9/) finds that long-context models do not use all context positions equally robustly; information in the middle can be harder to retrieve or use. This supports caution that more context is not automatically better context, not a direct proof that shorter system prompts are better.

[LLMLingua — EMNLP 2023](https://aclanthology.org/2023.emnlp-main.825/) demonstrates substantial prompt compression with limited performance loss in evaluated settings. It is indirect support for high-signal context, not direct evidence about coding-agent instruction style.
