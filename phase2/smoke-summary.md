# Phase 2 smoke verification

Status: **PASS**. These three cells validate harness execution and are excluded from formal results.

| Task | Variant | Success | Input | Latency ms | Diff | Test invocations | Retry proxy | Unrelated |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| t05-parse-pagination-query | A | yes | 99565 | 60070 | 2 | 1 | 0 | 0 |
| t10-resolve-permissions | B | yes | 112657 | 84282 | 52 | 1 | 0 | 0 |
| t17-map-with-concurrency-limit | C | yes | 112285 | 68388 | 41 | 2 | 1 | 0 |
