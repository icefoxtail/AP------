"""Candidate-only adapter from frozen Past Exam EXPECTED FACTS to geometry-visual-v1."""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

from .config import resolve_output
from .entrypoints import build_independent

ROOT = Path(__file__).resolve().parents[4]


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"), allow_nan=False)


def sha(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def adapt_expected_facts(bundle):
    """Bind only the frozen, typed facts supplied by EXPECTED_FACT_FREEZE."""
    if not isinstance(bundle, dict):
        raise ValueError("EXPECTED_FACT_BUNDLE_REQUIRED")
    required = {"schemaVersion", "questionUid", "route", "visualType", "viewport", "sourceFacts", "derivedFacts", "displayFacts", "objects"}
    allowed = required | {"axes", "title", "specialVisual", "publication"}
    if set(bundle) - allowed or not required <= set(bundle):
        raise ValueError("EXPECTED_FACT_BUNDLE_SCHEMA_FAIL")
    if bundle["schemaVersion"] != "past-exam-expected-facts-v1" or not isinstance(bundle["questionUid"], str) or not bundle["questionUid"]:
        raise ValueError("EXPECTED_FACT_BUNDLE_SCHEMA_FAIL")
    if bundle["route"] not in {"STANDARD", "SPECIAL"}:
        raise ValueError("VISUAL_ROUTE_INVALID")
    if not all(isinstance(bundle[key], dict) for key in ("viewport", "sourceFacts", "derivedFacts", "displayFacts")) or not isinstance(bundle["objects"], list):
        raise ValueError("EXPECTED_FACT_BUNDLE_SCHEMA_FAIL")
    fact_hash = sha(canonical(bundle))
    visual_spec = {
        "id": bundle["questionUid"],
        "visualType": bundle["visualType"],
        "viewport": bundle["viewport"],
        "sourceFacts": {**bundle["sourceFacts"], "independentFactHash": fact_hash},
        "derivedFacts": bundle["derivedFacts"],
        "displayFacts": bundle["displayFacts"],
        "objects": bundle["objects"],
    }
    for key in ("axes", "title", "publication"):
        if key in bundle:
            visual_spec[key] = bundle[key]
    if bundle["route"] == "SPECIAL":
        special = bundle.get("specialVisual")
        if not isinstance(special, dict) or set(special) != {"adapter", "candidateSvg"} or not isinstance(special["candidateSvg"], str):
            raise ValueError("SPECIAL_ROUTE_INPUT_REQUIRED")
        return {"independentFactHash": fact_hash, "visualSpec": visual_spec, "specialVisual": {"adapter": special["adapter"]}, "candidateSvg": special["candidateSvg"]}
    if "specialVisual" in bundle:
        raise ValueError("STANDARD_ROUTE_SPECIAL_INPUT_FORBIDDEN")
    return {"independentFactHash": fact_hash, "visualSpec": visual_spec}


def build_candidate(bundle, config):
    fact = adapt_expected_facts(bundle)
    root = resolve_output(config)
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,80}", bundle["questionUid"]):
        raise ValueError("INVALID_QUESTION_UID")
    folder = (root / "candidate" / bundle["questionUid"]).resolve()
    if not folder.is_relative_to(root):
        raise ValueError("PRODUCTION_WRITE_FORBIDDEN")
    folder.mkdir(parents=True, exist_ok=True)
    if "candidateSvg" in fact:
        special_path = folder / "special-source.svg"
        special_path.write_text(fact.pop("candidateSvg"), encoding="utf-8", newline="\n")
        fact["specialVisual"]["path"] = special_path.relative_to(ROOT).as_posix()
    result = build_independent({"qKey": bundle["questionUid"]}, fact)
    output_svg = result["svg"]
    result["witness"].update({"independentFactHash": fact["independentFactHash"], "publicationAuthorized": False})
    for name, value in (
        ("visual.svg", output_svg),
        ("visualSpec.json", json.dumps(fact["visualSpec"], ensure_ascii=False, indent=2) + "\n"),
        ("witness.json", json.dumps(result["witness"], ensure_ascii=False, indent=2) + "\n"),
        ("expected-facts.json", json.dumps(bundle, ensure_ascii=False, indent=2) + "\n"),
    ):
        target = (folder / name).resolve()
        if not target.is_relative_to(root):
            raise ValueError("PRODUCTION_WRITE_FORBIDDEN")
        target.write_text(value, encoding="utf-8", newline="\n")
    return {"status": result["witness"]["status"], "path": folder.relative_to(ROOT).as_posix(), "independentFactHash": fact["independentFactHash"], "route": result["witness"]["classification"]}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--facts", required=True)
    parser.add_argument("--config", required=True)
    args = parser.parse_args()
    bundle = json.loads(Path(args.facts).read_text(encoding="utf-8"))
    config = json.loads(Path(args.config).read_text(encoding="utf-8"))
    print(json.dumps(build_candidate(bundle, config), ensure_ascii=False))


if __name__ == "__main__":
    main()
