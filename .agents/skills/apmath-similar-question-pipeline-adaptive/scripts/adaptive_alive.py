#!/usr/bin/env python3
"""CLI entrypoint for the isolated ALIVE adaptive whole-exam experiment."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def find_repository_root() -> Path:
    for parent in Path(__file__).resolve().parents:
        if (parent / "alive" / "engine" / "alive_cli.py").is_file():
            return parent
    raise SystemExit("ALIVE repository root not found")


REPOSITORY_ROOT = find_repository_root()
if str(REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(REPOSITORY_ROOT))

from alive.engine import ENGINE_VERSION  # noqa: E402
from alive.engine import staged_exam as base  # noqa: E402
from alive.engine.adaptive_staged_exam import (  # noqa: E402
    ADAPTIVE_PROFILE,
    ADAPTIVE_REVIEW_POLICY,
    adaptive_runtime_root,
    assemble_adaptive_exam,
    build_adaptive_status,
    fail_adaptive_staged_dispatch,
    package_adaptive_exam,
    reconcile_adaptive_staged_run,
    record_adaptive_render,
    record_adaptive_visual_inspection,
    resolve_adaptive_manual_review,
    start_adaptive_correction_cycle,
    start_adaptive_staged_dispatch,
    start_adaptive_staged_exam,
)
from alive.engine.source_resolver import (  # noqa: E402
    resolve_explicit_source,
    resolve_source,
)


def emit(payload: Any, as_json: bool) -> None:
    if as_json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    elif isinstance(payload, dict):
        for key, value in payload.items():
            rendered = (
                json.dumps(value, ensure_ascii=False)
                if isinstance(value, (dict, list))
                else value
            )
            print(f"{key}: {rendered}")
    else:
        print(payload)


def common(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--runtime-root")
    parser.add_argument("--json", action="store_true")


def store_for(args: argparse.Namespace) -> base.StagedRunStore:
    return base.StagedRunStore(
        adaptive_runtime_root(REPOSITORY_ROOT, args.runtime_root)
    )


def command_start(args: argparse.Namespace) -> int:
    if not args.source_file and not args.query:
        raise SystemExit("adaptive start requires --source-file or --query")
    if args.source_file:
        resolution = resolve_explicit_source(
            REPOSITORY_ROOT, args.source_file, args.question
        )
        source_file = resolution["selected"]["path"]
    else:
        resolution = resolve_source(
            REPOSITORY_ROOT, args.query, None, args.limit
        )
        if resolution["status"] != "UNIQUE":
            emit(resolution, args.json)
            return 2
        source_file = resolution["selected"]["path"]
    store = store_for(args)
    manifest = start_adaptive_staged_exam(
        REPOSITORY_ROOT,
        store,
        source_file,
        args.query,
        ENGINE_VERSION,
        source_resolution=resolution,
        batch_count=args.batch_count,
        variation_mode=args.variation_mode,
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "workflowProfile": ADAPTIVE_PROFILE,
            "reviewPolicy": ADAPTIVE_REVIEW_POLICY,
            "model": "gpt-5.6-luna",
            "reasoning": "xhigh",
            "questionCount": manifest["request"]["expectedQuestionCount"],
            "batchCount": manifest["request"]["batchCount"],
            "taskCount": len(manifest.get("tasks", {})),
            "runDir": str(store.run_dir(manifest["runId"])),
        },
        args.json,
    )
    return 2 if manifest["status"] == "BLOCKED" else 0


def command_status(args: argparse.Namespace) -> int:
    emit(build_adaptive_status(store_for(args), args.run), args.json)
    return 0


def command_dispatch_start(args: argparse.Namespace) -> int:
    task, idempotent = start_adaptive_staged_dispatch(
        store_for(args), args.run, args.task, args.external_id, args.route
    )
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "idempotent": idempotent,
            "route": args.route or "gpt-5.6-luna/xhigh",
            "dispatch": task.get("dispatch", {}),
        },
        args.json,
    )
    return 0


def command_dispatch_fail(args: argparse.Namespace) -> int:
    store = store_for(args)
    task = fail_adaptive_staged_dispatch(store, args.run, args.task, args.code)
    manifest = store.load(args.run)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "dispatchStatus": task["dispatch"]["attempts"][-1]["status"],
            "parentStatus": manifest["status"],
        },
        args.json,
    )
    return 0


def command_recover(args: argparse.Namespace) -> int:
    store = store_for(args)
    task = base.recover_staged_task(store, args.run, args.task)
    manifest = store.load(args.run)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "recoveryCount": task.get("recoveryCount", 0),
            "parentStatus": manifest["status"],
        },
        args.json,
    )
    return 0


def command_mark_complete(args: argparse.Namespace) -> int:
    task = base.mark_staged_task_complete(store_for(args), args.run, args.task)
    emit(
        {
            "runId": args.run,
            "taskId": task["taskId"],
            "status": task["status"],
            "completionMarkerPath": task["completionMarkerPath"],
        },
        args.json,
    )
    return 0


def command_reconcile(args: argparse.Namespace) -> int:
    emit(
        reconcile_adaptive_staged_run(store_for(args), args.run),
        args.json,
    )
    return 0


def command_visual_inspection(args: argparse.Namespace) -> int:
    store = store_for(args)
    manifest = record_adaptive_visual_inspection(
        store, args.run, Path(args.file).resolve()
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "visualInspection": manifest.get("visualInspection"),
        },
        args.json,
    )
    return 2 if manifest["status"] == "BLOCKED" else 0


def command_parent_resolve(args: argparse.Namespace) -> int:
    store = store_for(args)
    manifest = resolve_adaptive_manual_review(
        store, args.run, Path(args.file).resolve()
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "manualResolution": manifest.get("manualResolution"),
        },
        args.json,
    )
    return 0


def command_correction_start(args: argparse.Namespace) -> int:
    store = store_for(args)
    manifest = start_adaptive_correction_cycle(store, args.run)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "correctionLoop": manifest.get("correctionLoop"),
            "workflowProfile": ADAPTIVE_PROFILE,
            "route": "gpt-5.6-luna/xhigh",
        },
        args.json,
    )
    return 0


def command_assemble(args: argparse.Namespace) -> int:
    store = store_for(args)
    manifest = assemble_adaptive_exam(
        REPOSITORY_ROOT,
        store,
        args.run,
        args.title or store.load(args.run)["request"]["query"],
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "workflowProfile": ADAPTIVE_PROFILE,
            "assembly": manifest.get("assembly"),
        },
        args.json,
    )
    return 0


def command_render(args: argparse.Namespace) -> int:
    store = store_for(args)
    manifest = record_adaptive_render(
        store, args.run, Path(args.file).resolve()
    )
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "render": manifest.get("render"),
            "renderFailure": manifest.get("renderFailure"),
        },
        args.json,
    )
    return 0


def command_package(args: argparse.Namespace) -> int:
    store = store_for(args)
    manifest = package_adaptive_exam(store, args.run)
    emit(
        {
            "runId": manifest["runId"],
            "status": manifest["status"],
            "currentStage": manifest["currentStage"],
            "package": manifest.get("package"),
        },
        args.json,
    )
    return 0


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(
        description="Isolated Luna xhigh adaptive ALIVE whole-exam experiment"
    )
    commands = root.add_subparsers(dest="command", required=True)

    start = commands.add_parser("start")
    start.add_argument("--source-file")
    start.add_argument("--query")
    start.add_argument("--question", type=int)
    start.add_argument("--limit", type=int, default=10)
    start.add_argument("--batch-count", type=int, default=4)
    start.add_argument(
        "--variation-mode",
        choices=("QUICK", "STRUCTURAL_VARIANT"),
        default="QUICK",
    )
    common(start)
    start.set_defaults(func=command_start)

    status = commands.add_parser("status")
    status.add_argument("--run", required=True)
    common(status)
    status.set_defaults(func=command_status)

    dispatch = commands.add_parser("dispatch-start")
    dispatch.add_argument("--run", required=True)
    dispatch.add_argument("--task", required=True)
    dispatch.add_argument("--external-id", required=True)
    dispatch.add_argument("--route")
    common(dispatch)
    dispatch.set_defaults(func=command_dispatch_start)

    dispatch_fail = commands.add_parser("dispatch-fail")
    dispatch_fail.add_argument("--run", required=True)
    dispatch_fail.add_argument("--task", required=True)
    dispatch_fail.add_argument("--code", required=True)
    common(dispatch_fail)
    dispatch_fail.set_defaults(func=command_dispatch_fail)

    recover = commands.add_parser("recover")
    recover.add_argument("--run", required=True)
    recover.add_argument("--task", required=True)
    common(recover)
    recover.set_defaults(func=command_recover)

    complete = commands.add_parser("mark-complete")
    complete.add_argument("--run", required=True)
    complete.add_argument("--task", required=True)
    common(complete)
    complete.set_defaults(func=command_mark_complete)

    reconcile = commands.add_parser("reconcile")
    reconcile.add_argument("--run", required=True)
    common(reconcile)
    reconcile.set_defaults(func=command_reconcile)

    visual_inspection = commands.add_parser("record-visual-inspection")
    visual_inspection.add_argument("--run", required=True)
    visual_inspection.add_argument("--file", required=True)
    common(visual_inspection)
    visual_inspection.set_defaults(func=command_visual_inspection)

    parent = commands.add_parser("parent-resolve")
    parent.add_argument("--run", required=True)
    parent.add_argument("--file", required=True)
    common(parent)
    parent.set_defaults(func=command_parent_resolve)

    correction = commands.add_parser("correction-start")
    correction.add_argument("--run", required=True)
    common(correction)
    correction.set_defaults(func=command_correction_start)

    assemble = commands.add_parser("assemble")
    assemble.add_argument("--run", required=True)
    assemble.add_argument("--title")
    common(assemble)
    assemble.set_defaults(func=command_assemble)

    render = commands.add_parser("record-render")
    render.add_argument("--run", required=True)
    render.add_argument("--file", required=True)
    common(render)
    render.set_defaults(func=command_render)

    package = commands.add_parser("package")
    package.add_argument("--run", required=True)
    common(package)
    package.set_defaults(func=command_package)
    return root


if __name__ == "__main__":
    arguments = parser().parse_args()
    raise SystemExit(arguments.func(arguments))
