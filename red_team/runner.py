import json
from pathlib import Path

from app.injection_detector import detect_prompt_injection
from ml.detector import detect_ml_threat


BASE_DIR = Path(__file__).resolve().parent

ATTACK_FILE = BASE_DIR / "attacks.json"
REPORT_FILE = BASE_DIR / "report.json"


def load_attacks():
    with open(ATTACK_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def run_red_team_test():
    attacks = load_attacks()

    results = []
    blocked = 0

    for attack in attacks:
        prompt = attack["prompt"]

        rule_detected, patterns = detect_prompt_injection(prompt)

        ml_detected, confidence, label = detect_ml_threat(prompt)

        detected = rule_detected or ml_detected

        if detected:
            blocked += 1

        results.append({
            "name": attack["name"],
            "prompt": prompt,
            "blocked": detected,
            "rule_detection": rule_detected,
            "ml_detection": ml_detected,
            "ml_confidence": confidence,
            "ml_label": label,
            "patterns": patterns
        })

    total = len(attacks)

    detection_rate = (
        blocked / total * 100
        if total
        else 0
    )

    report = {
        "total_attacks": total,
        "blocked_attacks": blocked,
        "detection_rate": round(detection_rate, 2),
        "target": 95,
        "target_met": detection_rate >= 95,
        "results": results
    }

    with open(REPORT_FILE, "w", encoding="utf-8") as file:
        json.dump(
            report,
            file,
            indent=4
        )

    print("Red-Team Test Complete")
    print(f"Total attacks: {total}")
    print(f"Blocked: {blocked}")
    print(f"Detection rate: {detection_rate:.2f}%")
    print(f"95% target met: {detection_rate >= 95}")

    return report


if __name__ == "__main__":
    run_red_team_test()