# Run Comparison Notes — Red-Team Simulator

Comparing the two full test runs against the real LLM_Guard API.

## Run 1 — Baseline (20260812_205027)

- **Dataset size:** 32 prompts (6 categories)
- **Overall detection rate:** 84.4% (27 blocked / 5 got through)
- **Weakest category:** `jailbreak` — 16.7% (1/6 blocked, 5 got through)
- **Strongest categories:** dan_attack, data_exfiltration, prompt_injection,
  role_manipulation, system_prompt_extraction — all at 100%

## Run 2 — After Dataset Expansion (20260813_115648)

- **Dataset size:** 36 prompts (added JB-007 to JB-010: roleplay persona lock,
  reverse psychology, gradual context shift, fictional research paper framing)
- **Overall detection rate:** 88.9%
- **Change from Run 1:** +4.5 percentage points overall

## What This Tells Us

1. The overall detection rate improved between runs, but this is measured
   across a **larger and different prompt set** (32 → 36), so it is not a
   direct apples-to-apples improvement of the guard itself — no code in
   `firewall.py` / `injection_detector.py` was changed between these runs.
2. The `jailbreak` category remains the primary gap. Before drawing further
   conclusions, the next run should re-test the *exact same* JB-001 to JB-006
   prompts from Run 1 to see whether any of them are now caught (which would
   indicate an actual guard-side change) or if the improvement is purely due
   to the new prompts happening to be easier to catch.
3. **Recommendation:** once the guard-logic owner adds detection coverage for
   the patterns listed in `vulnerability_findings_20260812_205027.md`, re-run
   `attack_runner.py` again and compare against this file to measure real
   improvement (not just dataset-size effects).

## How to Reproduce

```
python runner/attack_runner.py
python report/report_generator.py results/run_<new-timestamp>.json
```

Then update this file with the new run's numbers for the next comparison.
