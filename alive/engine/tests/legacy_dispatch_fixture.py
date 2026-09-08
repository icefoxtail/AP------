"""Synthetic pre-budget receipts for reconciliation tests; never launch agents."""

from alive.engine.run_store import utc_now


def legacy_dispatched_task(task: dict, external_id: str) -> dict:
    task["status"] = "DISPATCHED"
    task["dispatch"] = {
        "attempts": [{
            "attempt": 1,
            "externalId": external_id,
            "route": "gpt-5.6-luna/xhigh",
            "status": "DISPATCHED",
            "startedAt": utc_now(),
        }],
        "lastFailure": None,
    }
    task["completionRequired"] = True
    return task


def persist_legacy_dispatch(store, run_id: str, task_id: str, external_id: str) -> dict:
    manifest = store.load(run_id)
    legacy_dispatched_task(manifest["tasks"][task_id], external_id)
    store.save(run_id, manifest)
    return manifest
