# Red-Team Simulator

Built for the **anshika** branch of the LLM Guard project. This module attacks
your own team's guard/firewall system with adversarial prompts and reports how
well it defends itself.

## What's inside

```
red-team-simulator/
├── data/
│   └── adversarial_prompts.json     # 32 categorized attack prompts
├── runner/
│   ├── config.py                    # target API settings — EDIT THIS
│   ├── attack_runner.py             # sends every prompt, logs block/pass
│   └── mock_target_server.py        # fake API so you can test right now
├── report/
│   └── report_generator.py          # detection rate + markdown report
├── results/                         # auto-created, holds each run's raw JSON
└── requirements.txt
```

## Attack categories (matches your project requirements)

- `jailbreak` — hypothetical/fictional framing, false authority, encoding tricks
- `prompt_injection` — instruction override, delimiter escape, embedded-doc injection
- `dan_attack` — DAN persona, dual-persona, developer-mode roleplay
- `system_prompt_extraction` — direct asks, repeat-after-me, completion tricks
- `data_exfiltration` — credential probing, cross-user data, config leaks
- `role_manipulation` — false identity, privilege escalation, tool impersonation

Each prompt has an `id`, `technique`, and `severity` (`low`/`medium`/`high`) so
your report can prioritize what to fix first.

## How to run it

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Try it right now with the mock server (no need to wait for teammates)
```bash
# terminal 1
python runner/mock_target_server.py

# terminal 2
python runner/attack_runner.py
```
This proves the whole pipeline works before your real target API exists.

### 3. Point it at the real guard system
Open `runner/config.py` and set:
- `TARGET_URL` — the actual endpoint (ask whoever owns `proxy.py`/`routes.py`)
- `PROMPT_FIELD` — the JSON key their API expects the message in
- `API_KEY` — if their endpoint requires auth

Then open `attack_runner.py` and check `is_blocked()` — edit it to match
however their system actually signals "I blocked this" (status code, a JSON
field, or specific keywords in `blocked_keywords.json`). Coordinate with that
teammate for 5 minutes; this is the one integration point that depends on
their code.

### 4. Run the real attack
```bash
python runner/attack_runner.py
```
This writes `results/run_<timestamp>.json`.

### 5. Generate the report
```bash
python report/report_generator.py results/run_<timestamp>.json
```
This writes `report/security_test_report_<timestamp>.md` with:
- Overall detection rate
- Detection rate per attack category
- A prioritized table of every attack that got through, worst severity first
- Recommendations for the guard-logic owner

## Adding more attack prompts

Just add new entries to `data/adversarial_prompts.json` following the same
shape (`id`, `category`, `technique`, `severity`, `prompt`). Keep `category`
one of the six values above so the report groups correctly.

## Where this fits in the bigger project

Your teammates own the defense (`firewall.py`, `injection_detector.py`,
`dlp.py`, `risk.py`, `blocked_keywords.json`). You own the offense: proving
which of those defenses actually hold up, and handing back a report that
tells them exactly what to fix. Re-run this after every change they make to
track whether detection rate is improving.
