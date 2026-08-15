"""
Red-Team Simulator — Detection Rate Calculator + Security Test Report Generator
================================================================================

Run AFTER attack_runner.py has produced a results/run_<timestamp>.json file.

Usage:
  python report/report_generator.py results/run_20260811_120000.json

Produces a Markdown security test report in report/ named after the run.
"""

import json
import os
import sys
from collections import defaultdict
from datetime import datetime, timezone


def load_run(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def compute_stats(results):
    per_category = defaultdict(lambda: {"total": 0, "blocked": 0, "got_through": 0, "error": 0})
    overall = {"total": 0, "blocked": 0, "got_through": 0, "error": 0}
    got_through_items = []

    for r in results:
        cat = r["category"]
        per_category[cat]["total"] += 1
        overall["total"] += 1

        if r["outcome"] == "BLOCKED":
            per_category[cat]["blocked"] += 1
            overall["blocked"] += 1
        elif r["outcome"] == "GOT THROUGH":
            per_category[cat]["got_through"] += 1
            overall["got_through"] += 1
            got_through_items.append(r)
        else:
            per_category[cat]["error"] += 1
            overall["error"] += 1

    def detection_rate(stats):
        testable = stats["blocked"] + stats["got_through"]
        return round(100 * stats["blocked"] / testable, 1) if testable else 0.0

    for cat in per_category:
        per_category[cat]["detection_rate"] = detection_rate(per_category[cat])
    overall["detection_rate"] = detection_rate(overall)

    return per_category, overall, got_through_items


def build_markdown(run_data, per_category, overall, got_through_items):
    ts = run_data.get("run_timestamp", "unknown")
    target = run_data.get("target", "unknown")
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines = []
    lines.append(f"# Security Test Report — Red-Team Simulator")
    lines.append("")
    lines.append(f"- **Run ID:** {ts}")
    lines.append(f"- **Target system:** `{target}`")
    lines.append(f"- **Report generated:** {now}")
    lines.append(f"- **Total attack prompts:** {overall['total']}")
    lines.append("")
    lines.append("## Overall Detection Rate")
    lines.append("")
    lines.append(f"**{overall['detection_rate']}%** of adversarial prompts were correctly blocked "
                  f"({overall['blocked']} blocked / {overall['got_through']} got through / "
                  f"{overall['error']} errors, out of {overall['total']} total).")
    lines.append("")
    lines.append("## Detection Rate by Category")
    lines.append("")
    lines.append("| Category | Total | Blocked | Got Through | Errors | Detection Rate |")
    lines.append("|---|---|---|---|---|---|")
    for cat, stats in sorted(per_category.items()):
        lines.append(
            f"| {cat} | {stats['total']} | {stats['blocked']} | {stats['got_through']} | "
            f"{stats['error']} | {stats['detection_rate']}% |"
        )
    lines.append("")

    lines.append("## Attacks That Got Through (Highest Priority to Fix)")
    lines.append("")
    if not got_through_items:
        lines.append("None — every attack in this run was blocked. Nice.")
    else:
        lines.append("| ID | Category | Technique | Severity | Prompt (truncated) |")
        lines.append("|---|---|---|---|---|")
        for item in sorted(got_through_items, key=lambda x: {"high": 0, "medium": 1, "low": 2}.get(x["severity"], 3)):
            prompt_preview = item["prompt"][:70].replace("|", "/") + ("..." if len(item["prompt"]) > 70 else "")
            lines.append(f"| {item['id']} | {item['category']} | {item['technique']} | {item['severity']} | {prompt_preview} |")
    lines.append("")

    lines.append("## Recommendations")
    lines.append("")
    lines.append("- Review every row in the \"Got Through\" table with the guard-logic owner (firewall.py / injection_detector.py).")
    lines.append("- Prioritize `high` severity gaps first, especially in `prompt_injection`, `system_prompt_extraction`, and `data_exfiltration`.")
    lines.append("- Add missed patterns to `blocked_keywords.json` or the relevant detector, then re-run this simulator to confirm the fix.")
    lines.append("- Track detection rate over time — commit each run's results so regressions are visible in git history.")
    lines.append("")

    return "\n".join(lines)


def run(run_json_path):
    run_data = load_run(run_json_path)
    per_category, overall, got_through_items = compute_stats(run_data["results"])
    markdown = build_markdown(run_data, per_category, overall, got_through_items)

    out_dir = os.path.join(os.path.dirname(__file__))
    ts = run_data.get("run_timestamp", "report")
    out_path = os.path.join(out_dir, f"security_test_report_{ts}.md")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(markdown)

    print(f"Report written to {out_path}")
    print(f"Overall detection rate: {overall['detection_rate']}%")
    return out_path


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python report/report_generator.py <path-to-run-results.json>")
        sys.exit(1)
    run(sys.argv[1])
