"""
M3 Similar Exam Harness Gate.
Incorporates toss-harness principles (multi-layer fail-closed activation gate,
result parity, cryptographic authority binding, and registry compliance)
with existing JS Archive validators and Meta Foundation registries.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any, Mapping

REPO_ROOT = Path(__file__).resolve().parents[2]

CANONICAL_RULES_PATH = REPO_ROOT / "archive/data/meta-foundation/canonical/metadata_rules.json"
TAG_MASTER_PATH = REPO_ROOT / "archive/data/master_tables/js_archive_tag_master.json"
CONCEPT_REGISTRY_PATH = REPO_ROOT / "archive/data/meta-foundation/compiled/concept_registry.json"
CONDITION_REGISTRY_PATH = REPO_ROOT / "archive/data/meta-foundation/compiled/condition_registry.json"

CIRCLED_DIGITS = {"①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5}


def compute_git_blob_sha1(data: bytes) -> str:
    """Compute git blob SHA-1: sha1("blob <size>\\0" + data)."""
    header = f"blob {len(data)}\0".encode("utf-8")
    return hashlib.sha1(header + data).hexdigest()


class M3HarnessGate:
    def __init__(self, repo_root: Path | None = None) -> None:
        self.root = repo_root or REPO_ROOT
        self._load_authorities()

    def _load_authorities(self) -> None:
        # 1. Metadata rules
        with open(self.root / "archive/data/meta-foundation/canonical/metadata_rules.json", "r", encoding="utf-8") as f:
            rules_doc = json.load(f)
            self.allowed_integration_patterns = set(
                rules_doc.get("integrationPatterns", [
                    "NONE", "SEQUENTIAL", "INTERDEPENDENT", "REINTERPRETATION", "CASE_BRANCH", "DEEP_COMPOSITE"
                ])
            )
            self.allowed_difficulty_buckets = set(
                rules_doc.get("difficultyBuckets", ["D1", "D2", "D3", "D4", "D5"])
            )

        # 2. Tag master (for standardUnitKey and subUnitKey)
        with open(self.root / "archive/data/master_tables/js_archive_tag_master.json", "r", encoding="utf-8") as f:
            tag_master = json.load(f)
            self.valid_sub_units = {
                entry.get("subUnitKey")
                for entry in tag_master
                if entry.get("subUnitKey")
            }
            self.valid_unit_keys = {
                entry.get("standardUnitKey")
                for entry in tag_master
                if entry.get("standardUnitKey")
            }

        # 3. Concept registry
        with open(self.root / "archive/data/meta-foundation/compiled/concept_registry.json", "r", encoding="utf-8") as f:
            concepts_doc = json.load(f)
            concepts = concepts_doc.get("concepts", concepts_doc.get("records", []))
            self.valid_concepts = {
                c["conceptKey"]
                for c in concepts
                if c.get("status") == "ACTIVE" or "status" not in c
            }

        # 4. Condition registry
        with open(self.root / "archive/data/meta-foundation/compiled/condition_registry.json", "r", encoding="utf-8") as f:
            conditions_doc = json.load(f)
            conditions = conditions_doc.get("conditions", conditions_doc.get("records", []))
            self.valid_conditions = {
                c["conditionKey"]
                for c in conditions
                if c.get("status") == "ACTIVE" or "status" not in c
            }

    def validate_exam(
        self,
        questions: list[dict[str, Any]],
        raw_js_bytes: bytes | None = None,
        small_meta: dict[str, Any] | None = None,
        expected_question_count: int = 24,
    ) -> dict[str, Any]:
        """
        Multi-layer fail-closed validation:
        Layer 1: Schema & Completeness
        Layer 2: Choice Uniqueness & Distractor Sanity
        Layer 3: Visual Asset Parity (Disk existence, plan compliance)
        Layer 4: Meta Foundation Registry Parity
        Layer 5: Small JSON Contract & Blob Parity
        """
        findings: list[dict[str, Any]] = []

        def add_finding(layer: str, code: str, message: str, qid: int | None = None) -> None:
            findings.append({
                "layer": layer,
                "code": code,
                "message": message,
                "qid": qid,
                "severity": "HARD_FAIL",
            })

        # --- Layer 1: Schema & Completeness ---
        if len(questions) != expected_question_count:
            add_finding(
                "LAYER_1_SCHEMA",
                "QUESTION_COUNT_MISMATCH",
                f"Expected exactly {expected_question_count} questions, got {len(questions)}",
            )

        for idx, q in enumerate(questions, start=1):
            qid = q.get("id")
            if qid != idx:
                add_finding(
                    "LAYER_1_SCHEMA",
                    "QUESTION_ID_NOT_SEQUENTIAL",
                    f"Question at index {idx} has id {qid}",
                    qid=qid,
                )

            q_type = q.get("questionType")
            if q_type not in ("객관식", "서술형", "주관식"):
                add_finding(
                    "LAYER_1_SCHEMA",
                    "INVALID_QUESTION_TYPE",
                    f"Unknown questionType '{q_type}'",
                    qid=qid,
                )

            content = q.get("content", "")
            if not isinstance(content, str) or not content.strip():
                add_finding("LAYER_1_SCHEMA", "CONTENT_EMPTY", "Content is empty", qid=qid)

            solution = q.get("solution", "")
            if not isinstance(solution, str) or not solution.strip():
                add_finding("LAYER_1_SCHEMA", "SOLUTION_EMPTY", "Solution is empty", qid=qid)

            answer = q.get("answer", "")
            if not isinstance(answer, str) or not answer.strip():
                add_finding("LAYER_1_SCHEMA", "ANSWER_EMPTY", "Answer is empty", qid=qid)

            # Forbidden tags in student solution
            forbidden_patterns = [r"<debug>", r"<placeholder>", r"TODO", r"FIXME", r"\[INTERNAL\]"]
            for pat in forbidden_patterns:
                if re.search(pat, solution, re.IGNORECASE):
                    add_finding("LAYER_1_SCHEMA", "FORBIDDEN_MARKUP_IN_SOLUTION", f"Solution contains forbidden pattern {pat}", qid=qid)
                if re.search(pat, content, re.IGNORECASE):
                    add_finding("LAYER_1_SCHEMA", "FORBIDDEN_MARKUP_IN_CONTENT", f"Content contains forbidden pattern {pat}", qid=qid)

        # --- Layer 2: Choice Uniqueness & Distractor Sanity ---
        for q in questions:
            qid = q.get("id")
            q_type = q.get("questionType")
            choices = q.get("choices", [])
            answer = q.get("answer", "")

            if q_type == "객관식":
                if len(choices) != 5:
                    add_finding(
                        "LAYER_2_CHOICE_SANITY",
                        "CHOICES_COUNT_NOT_5",
                        f"Multiple choice question must have exactly 5 choices, got {len(choices)}",
                        qid=qid,
                    )
                else:
                    # Check duplicate choices
                    clean_choices = [c.strip() for c in choices]
                    if len(set(clean_choices)) != len(clean_choices):
                        add_finding(
                            "LAYER_2_CHOICE_SANITY",
                            "DUPLICATE_CHOICES",
                            f"Choices contain duplicates: {clean_choices}",
                            qid=qid,
                        )

                    # Check answer symbol
                    if answer not in CIRCLED_DIGITS:
                        add_finding(
                            "LAYER_2_CHOICE_SANITY",
                            "INVALID_ANSWER_SYMBOL",
                            f"Answer '{answer}' is not a valid circled digit (①..⑤)",
                            qid=qid,
                        )
            elif q_type == "서술형":
                if choices:
                    add_finding(
                        "LAYER_2_CHOICE_SANITY",
                        "DESCRIPTIVE_WITH_CHOICES",
                        f"Descriptive question must not have choices, got {len(choices)}",
                        qid=qid,
                    )

        # --- Layer 3: Visual Asset Parity ---
        for q in questions:
            qid = q.get("id")
            img_rel = q.get("image")
            svg_content = q.get("figureSvg")

            if img_rel:
                # Path normalization: strip leading archive/ if relative to archive web root
                normalized_rel = img_rel.replace("\\", "/").lstrip("/")
                # Search in archive/ or repo root
                candidates = [
                    self.root / normalized_rel,
                    self.root / "archive" / normalized_rel,
                ]
                exists = any(p.is_file() for p in candidates)
                if not exists:
                    add_finding(
                        "LAYER_3_VISUAL_PARITY",
                        "ASSET_FILE_NOT_FOUND",
                        f"Referenced image '{img_rel}' does not exist on disk",
                        qid=qid,
                    )
                elif normalized_rel.endswith(".svg"):
                    # Check that the SVG file has valid SVG root tag
                    actual_file = next(p for p in candidates if p.is_file())
                    try:
                        svg_text = actual_file.read_text(encoding="utf-8")
                        if "<svg" not in svg_text:
                            add_finding(
                                "LAYER_3_VISUAL_PARITY",
                                "INVALID_SVG_FILE",
                                f"File '{img_rel}' does not contain valid <svg> markup",
                                qid=qid,
                            )
                    except Exception as e:
                        add_finding(
                            "LAYER_3_VISUAL_PARITY",
                            "SVG_READ_ERROR",
                            f"Failed to read SVG file '{img_rel}': {e}",
                            qid=qid,
                        )

            if svg_content:
                if "<svg" not in svg_content or "</svg>" not in svg_content:
                    add_finding(
                        "LAYER_3_VISUAL_PARITY",
                        "INVALID_FIGURE_SVG",
                        "figureSvg does not contain valid XML svg tag",
                        qid=qid,
                    )

        # --- Layer 4: Meta Foundation Registry Parity ---
        for q in questions:
            qid = q.get("id")
            unit_key = q.get("standardUnitKey")
            sub_key = q.get("subUnitKey")
            pattern = q.get("integrationPattern", "NONE")
            cross_keys = q.get("crossConceptKeys", [])
            cond_keys = q.get("conditionKeys", [])
            bucket = q.get("difficultyBucket", "D3")

            if unit_key and unit_key not in self.valid_unit_keys:
                add_finding(
                    "LAYER_4_META_PARITY",
                    "METADATA_UNIT_KEY_INVALID",
                    f"standardUnitKey '{unit_key}' not in tag master",
                    qid=qid,
                )

            if sub_key and sub_key not in self.valid_sub_units:
                add_finding(
                    "LAYER_4_META_PARITY",
                    "METADATA_SUB_UNIT_KEY_INVALID",
                    f"subUnitKey '{sub_key}' not in tag master",
                    qid=qid,
                )

            if pattern not in self.allowed_integration_patterns:
                add_finding(
                    "LAYER_4_META_PARITY",
                    "INTEGRATION_PATTERN_INVALID",
                    f"integrationPattern '{pattern}' not in canonical metadata_rules.json",
                    qid=qid,
                )

            if bucket not in self.allowed_difficulty_buckets:
                add_finding(
                    "LAYER_4_META_PARITY",
                    "DIFFICULTY_BUCKET_INVALID",
                    f"difficultyBucket '{bucket}' not in canonical metadata_rules.json",
                    qid=qid,
                )

            for ck in cross_keys:
                if ck not in self.valid_concepts:
                    add_finding(
                        "LAYER_4_META_PARITY",
                        "METADATA_CONCEPT_KEY_INVALID",
                        f"crossConceptKey '{ck}' is not in compiled concept_registry.json",
                        qid=qid,
                    )

            for cond in cond_keys:
                if cond not in self.valid_conditions:
                    add_finding(
                        "LAYER_4_META_PARITY",
                        "METADATA_CONDITION_KEY_INVALID",
                        f"conditionKey '{cond}' is not in compiled condition_registry.json",
                        qid=qid,
                    )

        # --- Layer 5: Small JSON Contract & Blob Parity ---
        if small_meta is not None:
            expected_schema = "archive-reviewed-exam-meta-register-request-v2"
            schema = small_meta.get("schemaVersion")
            if schema != expected_schema:
                add_finding(
                    "LAYER_5_CONTRACT_PARITY",
                    "SMALL_META_SCHEMA_INVALID",
                    f"Expected schema '{expected_schema}', got '{schema}'",
                )

            expected_count = small_meta.get("expectedQuestionCount")
            if expected_count != len(questions):
                add_finding(
                    "LAYER_5_CONTRACT_PARITY",
                    "SMALL_META_QUESTION_COUNT_MISMATCH",
                    f"Small meta expectedQuestionCount {expected_count} != bank length {len(questions)}",
                )

            if raw_js_bytes is not None:
                actual_sha1 = compute_git_blob_sha1(raw_js_bytes)
                declared_sha1 = small_meta.get("expectedSourceBlobSha1")
                if actual_sha1 != declared_sha1:
                    add_finding(
                        "LAYER_5_CONTRACT_PARITY",
                        "BLOB_SHA_MISMATCH",
                        f"Git blob SHA-1 mismatch: computed {actual_sha1} != declared {declared_sha1}",
                    )

        status = "BLOCKED" if findings else "PASS"
        return {
            "status": status,
            "findingsCount": len(findings),
            "findings": findings,
            "checkedQuestionCount": len(questions),
        }
