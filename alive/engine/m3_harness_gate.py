"""
M3 Similar Exam Harness Gate (Rigorous Production Version).
Enforces fail-closed activation gate on Samsan M3-1 similar exam:
- Mandatory JS bytes & Small Meta JSON (never optional)
- window.questionBank enforcement
- Exact PT/TPL validation against compiled taxonomy_registry.json
- Mandatory image asset existence on visual questions (Q5, Q10, Q13, Q24)
- Rejection of forged review approvals (reviewStatus must be review_required, reviewPassCount must be 0)
- difficultyBucket integer validation (1..5)
- Git blob SHA-1 byte parity
"""

from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path
from typing import Any, Mapping

REPO_ROOT = Path(__file__).resolve().parents[2]

CIRCLED_DIGITS = {"①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5}
VISUAL_QIDS = {5, 10, 13, 24}


def compute_git_blob_sha1(data: bytes) -> str:
    """Compute git blob SHA-1: sha1('blob <size>\\0' + data)."""
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

        # 5. Taxonomy registry (Problem Types & Templates)
        with open(self.root / "archive/data/meta-foundation/compiled/taxonomy_registry.json", "r", encoding="utf-8") as f:
            tax_doc = json.load(f)
            self.active_pts = {
                pt["problemTypeKey"]: pt
                for pt in tax_doc.get("problemTypes", [])
                if pt.get("status") == "ACTIVE"
            }
            self.active_tpls = {
                tpl["templateKey"]: tpl
                for tpl in tax_doc.get("templates", [])
                if tpl.get("status") == "ACTIVE"
            }

    def validate_exam(
        self,
        questions: list[dict[str, Any]],
        raw_js_bytes: bytes,
        small_meta: dict[str, Any],
        expected_question_count: int = 24,
    ) -> dict[str, Any]:
        """
        Fail-closed activation gate:
        raw_js_bytes and small_meta are MANDATORY.
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

        # --- Mandatory Argument Check ---
        if not isinstance(raw_js_bytes, bytes) or not raw_js_bytes:
            add_finding("GATE_ARGUMENTS", "RAW_JS_BYTES_REQUIRED", "raw_js_bytes is mandatory and non-empty")
            return {"status": "BLOCKED", "findingsCount": len(findings), "findings": findings, "checkedQuestionCount": len(questions)}

        if not isinstance(small_meta, dict) or not small_meta:
            add_finding("GATE_ARGUMENTS", "SMALL_META_REQUIRED", "small_meta dictionary is mandatory")
            return {"status": "BLOCKED", "findingsCount": len(findings), "findings": findings, "checkedQuestionCount": len(questions)}

        # --- Layer 1: Schema & Completeness ---
        js_text = raw_js_bytes.decode("utf-8", errors="replace")
        if "window.questionBank" not in js_text:
            add_finding("LAYER_1_SCHEMA", "WINDOW_QUESTIONBANK_MISSING", "JS output must bind to window.questionBank")

        if len(questions) != expected_question_count:
            add_finding(
                "LAYER_1_SCHEMA",
                "QUESTION_COUNT_MISMATCH",
                f"Expected exactly {expected_question_count} questions, got {len(questions)}",
            )

        total_score = round(sum(q.get("score", 0.0) for q in questions), 2)
        if total_score != 100.0:
            add_finding(
                "LAYER_1_SCHEMA",
                "SCORE_SUM_MISMATCH",
                f"Total score must sum to 100.0, got {total_score}",
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
                add_finding("LAYER_1_SCHEMA", "INVALID_QUESTION_TYPE", f"Unknown questionType '{q_type}'", qid=qid)

            content = q.get("content", "")
            if not isinstance(content, str) or not content.strip():
                add_finding("LAYER_1_SCHEMA", "CONTENT_EMPTY", "Content is empty", qid=qid)

            solution = q.get("solution", "")
            if not isinstance(solution, str) or not solution.strip():
                add_finding("LAYER_1_SCHEMA", "SOLUTION_EMPTY", "Solution is empty", qid=qid)

            answer = q.get("answer", "")
            if not isinstance(answer, str) or not answer.strip():
                add_finding("LAYER_1_SCHEMA", "ANSWER_EMPTY", "Answer is empty", qid=qid)

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
                    add_finding("LAYER_2_CHOICE_SANITY", "CHOICES_COUNT_NOT_5", f"Multiple choice question must have exactly 5 choices, got {len(choices)}", qid=qid)
                else:
                    clean_choices = [c.strip() for c in choices]
                    if len(set(clean_choices)) != len(clean_choices):
                        add_finding("LAYER_2_CHOICE_SANITY", "DUPLICATE_CHOICES", f"Choices contain duplicates: {clean_choices}", qid=qid)
                    if answer not in CIRCLED_DIGITS:
                        add_finding("LAYER_2_CHOICE_SANITY", "INVALID_ANSWER_SYMBOL", f"Answer '{answer}' is not a valid circled digit (①..⑤)", qid=qid)
            elif q_type == "서술형":
                if choices:
                    add_finding("LAYER_2_CHOICE_SANITY", "DESCRIPTIVE_WITH_CHOICES", f"Descriptive question must not have choices, got {len(choices)}", qid=qid)

        # --- Layer 3: Visual Asset Parity ---
        for q in questions:
            qid = q.get("id")
            img_rel = q.get("image")

            # Q5, Q10, Q13, Q24 MUST have images
            if qid in VISUAL_QIDS and not img_rel:
                add_finding("LAYER_3_VISUAL_PARITY", "MANDATORY_IMAGE_MISSING", f"Question Q{qid} requires visual figure, but image field is missing", qid=qid)

            if img_rel:
                normalized_rel = img_rel.replace("\\", "/").lstrip("/")
                candidates = [
                    self.root / normalized_rel,
                    self.root / "archive" / normalized_rel,
                ]
                exists = any(p.is_file() for p in candidates)
                if not exists:
                    add_finding("LAYER_3_VISUAL_PARITY", "ASSET_FILE_NOT_FOUND", f"Referenced image '{img_rel}' does not exist on disk", qid=qid)

        # --- Layer 4: Meta Foundation Registry & Taxonomy Parity ---
        for q in questions:
            qid = q.get("id")
            unit_key = q.get("standardUnitKey")
            sub_key = q.get("subUnitKey")
            pt_key = q.get("problemTypeKey")
            tpl_key = q.get("templateKey")
            pattern = q.get("integrationPattern", "NONE")
            cross_keys = q.get("crossConceptKeys", [])
            cond_keys = q.get("conditionKeys", [])
            bucket = q.get("difficultyBucket")

            if unit_key and unit_key not in self.valid_unit_keys:
                add_finding("LAYER_4_META_PARITY", "METADATA_UNIT_KEY_INVALID", f"standardUnitKey '{unit_key}' not in tag master", qid=qid)

            if sub_key and sub_key not in self.valid_sub_units:
                add_finding("LAYER_4_META_PARITY", "METADATA_SUB_UNIT_KEY_INVALID", f"subUnitKey '{sub_key}' not in tag master", qid=qid)

            # PT / TPL verification against compiled taxonomy
            if pt_key:
                if pt_key not in self.active_pts:
                    add_finding("LAYER_4_META_PARITY", "PROBLEM_TYPE_NOT_IN_TAXONOMY", f"problemTypeKey '{pt_key}' is not in compiled taxonomy_registry.json", qid=qid)
            if tpl_key:
                if tpl_key not in self.active_tpls:
                    add_finding("LAYER_4_META_PARITY", "TEMPLATE_NOT_IN_TAXONOMY", f"templateKey '{tpl_key}' is not in compiled taxonomy_registry.json", qid=qid)
                else:
                    tpl_record = self.active_tpls[tpl_key]
                    if tpl_record.get("parentProblemTypeKey") != pt_key:
                        add_finding("LAYER_4_META_PARITY", "TEMPLATE_PARENT_MISMATCH", f"templateKey '{tpl_key}' parent '{tpl_record.get('parentProblemTypeKey')}' != '{pt_key}'", qid=qid)

            # difficultyBucket must be integer 1..5
            if bucket is not None:
                if not isinstance(bucket, int) or bucket not in (1, 2, 3, 4, 5):
                    add_finding("LAYER_4_META_PARITY", "DIFFICULTY_BUCKET_NOT_INTEGER_1_5", f"difficultyBucket must be integer 1..5, got {bucket!r}", qid=qid)

            if pattern not in self.allowed_integration_patterns:
                add_finding("LAYER_4_META_PARITY", "INTEGRATION_PATTERN_INVALID", f"integrationPattern '{pattern}' not in canonical metadata_rules.json", qid=qid)

            for ck in cross_keys:
                if ck not in self.valid_concepts:
                    add_finding("LAYER_4_META_PARITY", "METADATA_CONCEPT_KEY_INVALID", f"crossConceptKey '{ck}' is not in compiled concept_registry.json", qid=qid)

            for cond in cond_keys:
                if cond not in self.valid_conditions:
                    add_finding("LAYER_4_META_PARITY", "METADATA_CONDITION_KEY_INVALID", f"conditionKey '{cond}' is not in compiled condition_registry.json", qid=qid)

        # --- Layer 5: Small JSON Contract, Blob Parity, Items Parity & Approval Guard ---
        expected_schema = "archive-reviewed-exam-meta-register-request-v2"
        schema = small_meta.get("schemaVersion")
        if schema != expected_schema:
            add_finding("LAYER_5_CONTRACT_PARITY", "SMALL_META_SCHEMA_INVALID", f"Expected schema '{expected_schema}', got '{schema}'")

        # Approval status guard: CREATE stage must NOT forge reviewed_pass or premature REVIEW2
        approval = small_meta.get("approval", {})
        app_type = approval.get("type")
        review_status = approval.get("reviewStatus")
        review_pass_count = approval.get("reviewPassCount", 0)

        if review_status == "reviewed_pass" or review_pass_count > 0:
            add_finding("LAYER_5_APPROVAL_GUARD", "FORGED_REVIEW_APPROVAL", "CREATE stage candidate small meta must not declare reviewStatus='reviewed_pass' or reviewPassCount > 0")

        if app_type == "REVIEW2" and (review_pass_count < 2 or review_status != "reviewed_pass"):
            add_finding("LAYER_5_APPROVAL_GUARD", "PREMATURE_REVIEW2_DECLARATION", f"approval.type cannot be REVIEW2 when reviewPassCount is {review_pass_count} and reviewStatus is '{review_status}'")

        expected_count = small_meta.get("expectedQuestionCount")
        if expected_count != len(questions):
            add_finding("LAYER_5_CONTRACT_PARITY", "SMALL_META_QUESTION_COUNT_MISMATCH", f"Small meta expectedQuestionCount {expected_count} != bank length {len(questions)}")

        actual_sha1 = compute_git_blob_sha1(raw_js_bytes)
        declared_sha1 = small_meta.get("expectedSourceBlobSha1")
        if actual_sha1 != declared_sha1:
            add_finding("LAYER_5_CONTRACT_PARITY", "BLOB_SHA_MISMATCH", f"Git blob SHA-1 mismatch: computed {actual_sha1} != declared {declared_sha1}")

        # Items 1:1 Parity Guard: items must not be empty and must match each question's metadata
        items = small_meta.get("items")
        if not isinstance(items, list) or len(items) != len(questions):
            add_finding(
                "LAYER_5_CONTRACT_PARITY",
                "SMALL_META_ITEMS_COUNT_MISMATCH",
                f"Small meta items count {len(items) if isinstance(items, list) else 0} != question count {len(questions)}"
            )
        else:
            for idx, q in enumerate(questions, start=1):
                item = items[idx - 1]
                q_id = q.get("id")
                item_uid = item.get("questionUid")
                item_ordinal = item.get("sourceOrdinal")
                if item_uid != q_id or item_ordinal != q_id:
                    add_finding(
                        "LAYER_5_CONTRACT_PARITY",
                        "ITEM_UID_ORDINAL_MISMATCH",
                        f"Item at index {idx - 1} has questionUid={item_uid}, sourceOrdinal={item_ordinal}, expected {q_id}",
                        qid=q_id
                    )

                after = item.get("after", {})
                if after.get("standardUnitKey") != q.get("standardUnitKey"):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_UNIT_KEY_MISMATCH", f"Item {q_id} standardUnitKey '{after.get('standardUnitKey')}' != q '{q.get('standardUnitKey')}'", qid=q_id)
                if after.get("subUnitKey") != q.get("subUnitKey"):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_SUBUNIT_KEY_MISMATCH", f"Item {q_id} subUnitKey '{after.get('subUnitKey')}' != q '{q.get('subUnitKey')}'", qid=q_id)
                if after.get("difficultyBucket") != q.get("difficultyBucket"):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_DIFFICULTY_BUCKET_MISMATCH", f"Item {q_id} difficultyBucket '{after.get('difficultyBucket')}' != q '{q.get('difficultyBucket')}'", qid=q_id)
                if after.get("problemTypeKey") != q.get("problemTypeKey"):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_PROBLEM_TYPE_KEY_MISMATCH", f"Item {q_id} problemTypeKey '{after.get('problemTypeKey')}' != q '{q.get('problemTypeKey')}'", qid=q_id)
                if after.get("templateKey") != q.get("templateKey"):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_TEMPLATE_KEY_MISMATCH", f"Item {q_id} templateKey '{after.get('templateKey')}' != q '{q.get('templateKey')}'", qid=q_id)
                if sorted(after.get("crossConceptKeys") or []) != sorted(q.get("crossConceptKeys") or []):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_CROSS_CONCEPTS_MISMATCH", f"Item {q_id} crossConcepts mismatch", qid=q_id)
                if sorted(after.get("conditionKeys") or []) != sorted(q.get("conditionKeys") or []):
                    add_finding("LAYER_5_CONTRACT_PARITY", "ITEM_CONDITIONS_MISMATCH", f"Item {q_id} conditions mismatch", qid=q_id)

        status = "BLOCKED" if findings else "PASS"
        return {
            "status": status,
            "findingsCount": len(findings),
            "findings": findings,
            "checkedQuestionCount": len(questions),
        }
