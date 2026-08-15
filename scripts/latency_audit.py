import sys
import os
import time
import statistics

sys.path.insert(
    0,
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from app.dlp import sanitize_prompt


TEST_PROMPTS = [
    "Hello, how are you?",

    "Contact me at user@example.com",

    "My phone number is 9876543210",

    "My card number is 4111 1111 1111 1111",

    "My email is user@example.com and phone is 9876543210",

    "My Aadhaar number is 1234 5678 9012",

    "My PAN is ABCDE1234F",

    "My IP address is 192.168.1.10",

    "My API key is sk-abcdefghijklmnop"
]


def measure(prompt: str, iterations: int = 100):
    measurements = []

    for _ in range(iterations):

        start = time.perf_counter()

        sanitize_prompt(prompt)

        end = time.perf_counter()

        measurements.append(
            (end - start) * 1000
        )

    return measurements


def main():

    all_measurements = []

    print("=" * 60)
    print("LLM-GUARD DLP LATENCY AUDIT")
    print("=" * 60)

    for prompt in TEST_PROMPTS:

        measurements = measure(
            prompt,
            iterations=100
        )

        average = statistics.mean(
            measurements
        )

        minimum = min(measurements)
        maximum = max(measurements)

        all_measurements.extend(
            measurements
        )

        print()
        print("Prompt:", prompt)
        print(
            f"Average: {average:.4f} ms"
        )
        print(
            f"Minimum: {minimum:.4f} ms"
        )
        print(
            f"Maximum: {maximum:.4f} ms"
        )

    print()
    print("=" * 60)
    print("OVERALL RESULTS")
    print("=" * 60)

    print(
        f"Samples: {len(all_measurements)}"
    )

    print(
        f"Average latency: "
        f"{statistics.mean(all_measurements):.4f} ms"
    )

    print(
        f"Minimum latency: "
        f"{min(all_measurements):.4f} ms"
    )

    print(
        f"Maximum latency: "
        f"{max(all_measurements):.4f} ms"
    )

    print("=" * 60)


if __name__ == "__main__":
    main()