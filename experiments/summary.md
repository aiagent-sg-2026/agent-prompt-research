# Experiment summary

Status: **COMPLETE**. Unrun cells are **PENDING**. This table is descriptive and makes no causal claims.

| Variant | Completed | Success | Success rate | Prompt chars (mean) | Input tokens (mean) | Output tokens (mean) | Latency ms (median) | Unrelated edits |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A | 3/3 | 3 | 100.0% | 689.3333333333334 | 66003 | 1261.3333333333333 | 39782 | 0 |
| B | 3/3 | 3 | 100.0% | 928 | 86585.33333333333 | 1349.6666666666667 | 47739 | 0 |
| C | 3/3 | 3 | 100.0% | 1290 | 97599.33333333333 | 1988 | 53546 | 0 |

## Per-run rows

| Task | Variant | Status | Success | Prompt chars | Final test exit |
|---|---|---|---|---:|---:|
| t1-normalize-tags | A | complete | true | 626 | 0 |
| t2-retry | B | complete | true | 889 | 0 |
| t3-merge-preferences | C | complete | true | 1409 | 0 |
| t1-normalize-tags | B | complete | true | 868 | 0 |
| t2-retry | C | complete | true | 1251 | 0 |
| t3-merge-preferences | A | complete | true | 792 | 0 |
| t1-normalize-tags | C | complete | true | 1210 | 0 |
| t2-retry | A | complete | true | 650 | 0 |
| t3-merge-preferences | B | complete | true | 1027 | 0 |
