import time
from typing import Callable, Any


def measure_latency(
    operation: Callable,
    *args,
    **kwargs
) -> tuple[Any, float]:
    """
    Execute an operation and measure its execution time.

    Returns:
        result: Operation result
        latency_ms: Execution time in milliseconds
    """

    start = time.perf_counter()

    result = operation(
        *args,
        **kwargs
    )

    end = time.perf_counter()

    latency_ms = (end - start) * 1000

    return result, round(latency_ms, 3)


def measure_dlp_latency(
    sanitize_function: Callable,
    prompt: str
) -> tuple[Any, float]:
    """
    Measure the latency introduced by DLP sanitization.
    """

    return measure_latency(
        sanitize_function,
        prompt
    )


def create_latency_report(
    measurements: list[float]
) -> dict:
    """
    Generate a summary of latency measurements.
    """

    if not measurements:
        return {
            "samples": 0,
            "average_ms": 0,
            "minimum_ms": 0,
            "maximum_ms": 0
        }

    average = sum(measurements) / len(measurements)

    return {
        "samples": len(measurements),
        "average_ms": round(average, 3),
        "minimum_ms": round(min(measurements), 3),
        "maximum_ms": round(max(measurements), 3)
    }