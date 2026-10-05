"""Retired task dispatch is read/reconcile-only under the work-batch budget.

Production remains main-worker work. Reserve a whole-job semantic review through
pipeline-core work-batch-reserve BEFORE invoking a provider. Legacy per-question,
per-axis and continuous-wave receipts cannot serve as new launch authorization.
"""
from typing import Any


def hold_legacy_launch(task: dict[str, Any], external_id: str) -> None:
    attempts = task.get("dispatch", {}).get("attempts", [])
    if task.get("status") == "DISPATCHED" and attempts and attempts[-1].get("externalId") == external_id:
        return
    raise ValueError("HOLD:LEGACY_AGENT_DISPATCH_DISABLED: reconcile existing receipts; produce the whole job locally; use pipeline-core work-batch-reserve")
