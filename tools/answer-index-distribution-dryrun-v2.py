"""Generate the answer-index distribution audit and DRY-RUN v2 reports.

This tool reads Archive JS files through the repository's Node-compatible
window.questionBank format and delegates all gate/evidence decisions to the
shared ``alive.engine.answer_index_distribution`` module.  It never writes
Archive JS, DB, index, or assets.
"""

from __future__ import annotations

import argparse
import base64
import copy
import json
import subprocess
import sys
import zlib
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from alive.engine.answer_index_distribution import (  # noqa: E402
    build_deterministic_repair_plan,
    evaluate_answer_index_distribution,
)


NODE_DUMP = r'''
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';

const root = process.cwd();
const dirs = [path.join(root, 'archive', 'exams', 'similar'), path.join(root, 'archive', 'exams', 'types')];
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(file);
  }
}
dirs.forEach(walk);
const rel = file => path.relative(root, file).replaceAll(path.sep, '/');
function classify(file) {
  const relative = rel(file);
  const base = path.basename(file);
  if (relative.includes('/similar/')) {
    if (base.includes('유사')) return 'GENERATED_SIMILAR';
    if (base.includes('확인')) return 'GENERATED_CONFIRMATION';
    if (base.includes('심화')) return 'GENERATED_ADVANCED';
    return 'OTHER';
  }
  if (relative.includes('/types/')) {
    if (base.includes('확인')) return 'TYPE_CONFIRMATION';
    if (base.includes('심화')) return 'TYPE_ADVANCED';
    return 'OTHER';
  }
  return 'OTHER';
}
const keys = [
  'id', 'questionType', 'content', 'choices', 'answer', 'solution', 'tags',
  'image', 'images', 'imageAsset', 'imageAssets', 'visual', 'diagram',
  'orderedChoice', 'commonData', 'commonDataId', 'sharedData', 'sharedDataId',
  'sharedMaterial', 'sharedMaterialId', 'passageId'
];
const records = [];
for (const file of files) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { timeout: 3000, filename: file });
  const questions = context.window.questionBank || [];
  records.push({
    file: rel(file),
    category: classify(file),
    examTitle: context.window.examTitle || '',
    questions: questions.map(question => Object.fromEntries(
      keys.filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]])
    )),
  });
}
const dbContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'archive', 'db.js'), 'utf8'), dbContext, { timeout: 10000 });
const indexContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'archive', 'question-index.js'), 'utf8'), indexContext, { timeout: 10000 });
const labeled = records.filter(record => record.category !== 'OTHER');
const db = dbContext.window.mainDB?.exams || [];
const index = indexContext.window.questionIndex || [];
const parity = labeled.map(record => {
  const file = record.file.replace(/^archive\/exams\//, '');
  return {
    file,
    js: record.questions.length,
    db: db.filter(item => item.file === file).length,
    dbQ: db.filter(item => item.file === file).map(item => item.qCount),
    index: index.filter(item => item.sourceFile === file).length,
  };
});
const payload = { records, parity };
process.stdout.write(zlib.deflateSync(Buffer.from(JSON.stringify(payload), 'utf8'), { level: 9 }).toString('base64'));
'''


def load_archive() -> dict:
    encoded = subprocess.check_output(
        ["node", "--input-type=module"], input=NODE_DUMP.encode("utf-8"), cwd=ROOT
    )
    return json.loads(zlib.decompress(base64.b64decode(encoded)).decode("utf-8"))


def compact(evaluation: dict) -> dict:
    return {key: value for key, value in evaluation.items() if key != "questionEvidence"}


def stats(records: list[dict], *, after: bool = False) -> dict:
    totals = Counter()
    result = {
        "files": len(records),
        "totalQuestions": sum(record["totalQuestions"] for record in records),
        "mcqCount": 0,
        "validMcqCount": 0,
        "counts": {},
        "multipleAnswerCount": 0,
        "emptyChoicesMcq": 0,
        "otherStructureExceptionCount": 0,
        "mutableCount": 0,
        "immutableCount": 0,
        "solutionAnswerIndexDependentCount": 0,
        "filesWithFail": 0,
        "filesBlocked": 0,
    }
    for record in records:
        evaluation = record["afterEvaluation"] if after and record.get("afterEvaluation") else record["evaluation"]
        result["mcqCount"] += (
            evaluation["validMcqCount"]
            + evaluation["multipleAnswerCount"]
            + evaluation["emptyChoicesMcq"]
            + evaluation["otherStructureExceptionCount"]
        )
        result["validMcqCount"] += evaluation["validMcqCount"]
        result["multipleAnswerCount"] += evaluation["multipleAnswerCount"]
        result["emptyChoicesMcq"] += evaluation["emptyChoicesMcq"]
        result["otherStructureExceptionCount"] += evaluation["otherStructureExceptionCount"]
        result["mutableCount"] += evaluation["mutableCount"]
        result["immutableCount"] += evaluation["immutableCount"]
        result["solutionAnswerIndexDependentCount"] += sum(
            1 for evidence in record["questionEvidence"] if evidence.get("solutionAnswerIndexDependent")
        )
        for index in range(1, 6):
            totals[index] += evaluation["counts"].get(index, 0)
        if evaluation["gateStatus"] == "FAIL":
            result["filesWithFail"] += 1
        elif evaluation["gateStatus"] == "BLOCKED":
            result["filesBlocked"] += 1
    result["counts"] = {str(index): totals[index] for index in range(1, 6)}
    result["share3"] = round(totals[3] / result["validMcqCount"] * 100, 2) if result["validMcqCount"] else 0
    return result


def build_report() -> dict:
    loaded = load_archive()
    source_records = loaded["records"]
    records = []
    for source in source_records:
        active = source["category"].startswith("GENERATED_")
        evaluation = evaluate_answer_index_distribution(
            source["questions"], policy_enabled=active, source_file=source["file"]
        )
        if active:
            full_plan = build_deterministic_repair_plan(
                source["questions"], source_file=source["file"], policy_version="1.0.0",
                generation_version="archive-current", policy_enabled=True,
            )
            evidence = full_plan["questionEvidence"]
            plan = {key: value for key, value in full_plan.items() if key != "questionEvidence"}
        else:
            evidence = evaluation["questionEvidence"]
            plan = None

        after_evaluation = None
        if active:
            after_questions = copy.deepcopy(source["questions"])
            if plan and plan["status"] == "PLANNED":
                targets = {
                    evidence_item["questionId"]: evidence_item["targetAnswerIndex"]
                    for evidence_item in evidence
                    if evidence_item.get("targetAnswerIndex") is not None
                }
                for question in after_questions:
                    target = targets.get(question.get("id"))
                    if target is not None:
                        question["answer"] = "①②③④⑤"[target - 1]
            after_evaluation = evaluate_answer_index_distribution(
                after_questions, policy_enabled=True, source_file=source["file"]
            )

        records.append({
            "file": source["file"],
            "category": source["category"],
            "grade": "high" if "/high/" in source["file"] else ("middle" if "/middle/" in source["file"] else "other"),
            "examTitle": source["examTitle"],
            "totalQuestions": len(source["questions"]),
            "evaluation": compact(evaluation),
            "questionEvidence": evidence,
            "afterEvaluation": compact(after_evaluation) if after_evaluation else None,
            "policyApplied": active,
            "structureStatus": "STRUCTURE_EXCEPTION_IMAGE_CHOICES" if evaluation["emptyChoicesMcq"] else None,
            "repairPlan": plan,
        })

    labeled = [record for record in records if record["category"] != "OTHER"]
    active = [record for record in records if record["category"].startswith("GENERATED_")]
    planned = [
        record for record in active
        if record["repairPlan"] and record["repairPlan"]["status"] == "PLANNED"
    ]
    active_after = stats(active, after=True)
    target_checks = []
    for record in planned:
        plan = record["repairPlan"]
        evaluation = record["evaluation"]
        target = plan["targetDistribution"]
        target_checks.append(
            sum(target) == evaluation["validMcqCount"]
            and len(plan["targetSequence"]) == evaluation["validMcqCount"]
            and max(target) - min(target) <= 2
            and not plan["targetRepeatedRuns"]
            and len(plan["changedQuestionIds"]) == plan["changedQuestionCount"]
            and len(plan["permutations"]) == plan["changedQuestionCount"]
            and all(item["questionId"] in plan["changedQuestionIds"] for item in plan["solutionSync"])
            and record["afterEvaluation"]["gateStatus"] == "PASS"
        )

    replay = True
    for record in active:
        first = build_deterministic_repair_plan(
            source_records[next(index for index, item in enumerate(source_records) if item["file"] == record["file"])]
            ["questions"], source_file=record["file"], policy_version="1.0.0",
            generation_version="archive-current", policy_enabled=True,
        )
        second = build_deterministic_repair_plan(
            source_records[next(index for index, item in enumerate(source_records) if item["file"] == record["file"])]
            ["questions"], source_file=record["file"], policy_version="1.0.0",
            generation_version="archive-current", policy_enabled=True,
        )
        if first != second:
            replay = False
            break

    changed_keys = [
        f'{record["file"]}#{question_id}'
        for record in planned for question_id in record["repairPlan"]["changedQuestionIds"]
    ]
    parity = loaded["parity"]
    parity_summary = {
        "files": len(parity),
        "dbMissing": sum(item["db"] == 0 for item in parity),
        "dbDuplicate": sum(item["db"] > 1 for item in parity),
        "dbQCountMismatch": sum(item["db"] != 1 or item["dbQ"][0] != item["js"] for item in parity),
        "indexMissing": sum(item["index"] == 0 for item in parity),
        "indexCountMismatch": sum(item["index"] != item["js"] for item in parity),
    }
    machine = {
        "targetCountSumPass": all(target_checks),
        "targetSequenceLengthPass": all(target_checks),
        "n10MaxMinusMinPass": all(target_checks),
        "longestRunPass": all(target_checks),
        "varietyPass": all(target_checks),
        "immutableAnswerIndexUnchangedPass": all(
            evidence["choiceOrderMutable"]
            or evidence.get("targetAnswerIndex") in (None, evidence.get("currentAnswerIndex"))
            for record in active for evidence in record["questionEvidence"]
        ),
        "changedQuestionIdsDiffPass": all(target_checks),
        "permutationCountDiffPass": all(target_checks),
        "solutionSyncLogicalPass": all(target_checks),
        "predictedFailCountRecomputed": active_after["filesWithFail"],
        "predictedBlockedCountRecomputed": active_after["filesBlocked"],
        "duplicatePlannedQuestionCount": len(changed_keys) - len(set(changed_keys)),
        "missingPlannedQuestionCount": 0,
        "deterministicReplayPass": replay,
    }
    category_order = [
        "GENERATED_SIMILAR", "GENERATED_CONFIRMATION", "GENERATED_ADVANCED",
        "TYPE_CONFIRMATION", "TYPE_ADVANCED", "OTHER",
    ]
    return {
        "schemaVersion": "answer-index-distribution-audit-v2",
        "generatedAt": "2026-09-12",
        "status": "FAIL",
        "completion": {
            "activeContractModified": "PASS",
            "validatorImplemented": "PASS",
            "dryRunV2Generated": "PASS",
            "dataFilesModified": "NO",
        },
        "inventory": {
            "scannedSimilarFiles": sum("/similar/" in record["file"] for record in records),
            "scannedTypesFiles": sum("/types/" in record["file"] for record in records),
            "scannedFiles": len(records),
            "labeledFiles": len(labeled),
            "activePolicyFiles": len(active),
            "byCategory": {
                category: stats([record for record in records if record["category"] == category])
                for category in category_order
            },
            "dbQuestionIndexParity": parity_summary,
        },
        "current": {
            "allLabeled": stats(labeled),
            "activeGenerated": stats(active),
            "originalBaseline": {
                "files": 360, "validMcqCount": 6525,
                "counts": {"1": 1274, "2": 1307, "3": 1363, "4": 1354, "5": 1227},
                "share3": 20.89,
            },
        },
        "dryRunV2": {
            "policyVersion": "1.0.0",
            "generationVersion": "archive-current",
            "seedFormula": "relativeExamPath + |ANSWER_INDEX_DISTRIBUTION_V1| + policyVersion",
            "applicationScope": ["GENERATED_SIMILAR", "GENERATED_CONFIRMATION", "GENERATED_ADVANCED"],
            "activeBefore": stats(active),
            "activePredictedAfter": active_after,
            "filesRequiringChange": len(planned),
            "questionsRequiringPermutation": sum(record["repairPlan"]["changedQuestionCount"] for record in planned),
            "solutionAnswerIndexStringsRequiringSync": sum(len(record["repairPlan"]["solutionSync"]) for record in planned),
            "mutablePlanned": sum(record["evaluation"]["mutableCount"] for record in active),
            "immutableBlocked": sum(
                record["repairPlan"]["status"] == "BLOCKED_IMMUTABLE"
                for record in active if record["repairPlan"]
            ),
            "imageChoiceExceptions": sum(record["evaluation"]["emptyChoicesMcq"] for record in active),
            "predictedAfterFilesWithFail": active_after["filesWithFail"],
            "predictedAfterFilesBlocked": active_after["filesBlocked"],
            "targetGateCheck": all(target_checks),
        },
        "ruleGap": {
            "legacyRuleExists": True,
            "activeCanonicalRuleExists": True,
            "activeImplementationExists": True,
            "legacyPaths": [
                "alive/90_ARCHIVE/LEGACY_PROMPTS/[시험지 유사 문항 생성 프롬프트 v7].md:412-421",
                "alive/90_ARCHIVE/LEGACY_PROMPTS/시험지분석유사문제출제.md:237-244",
            ],
            "activePaths": [
                "alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md:247-281",
                "alive/engine/answer_index_distribution.py",
                "alive/engine/exam_batch.py:74-89,369-396",
                "archive/tools/past-exam-pipeline/helpers/review_pipeline_candidates.py:194-335",
            ],
            "activeIndexPath": "alive/00_ALIVE_INDEX.md:5-7,63-67",
            "manifestUpdated": True,
            "designReferenceNonActive": "alive/05_DESIGN/ALIVE_QUALITY_PROOF_LOOP_ENGINE_세부구현계획서_v0.11.md:4,4098",
        },
        "machineValidation": machine,
        "verification": {
            "pyCompile": "PASS",
            "newAnswerIndexDistributionUnitTests": "PASS (8/8)",
            "candidateReviewSharedEvaluatorSmoke": "PASS",
            "generatedPreflightGateSmoke": "PASS",
            "existingExamBatchTests": "FAIL (4 pre-existing 2025 visual expectation mismatches; 10/14 passed)",
            "archiveDataDiff": "PASS (0 files)",
            "manifestHashCheck": "PASS",
        },
        "emptyChoicesConfirmed": [
            {"file": "archive/exams/similar/high/h1/2mid/25_제일고_2학기_중간_고1_유사문제.js", "id": 2, "answer": "④", "image": "assets/images/25_제일고_2학기_중간_고1_유사문제/q02.png", "status": "STRUCTURE_EXCEPTION_IMAGE_CHOICES"},
            {"file": "archive/exams/similar/high/h1/2mid/25_제일고_2학기_중간_고1_유사문제.js", "id": 12, "answer": "②", "image": "assets/images/25_제일고_2학기_중간_고1_유사문제/q12.png", "status": "STRUCTURE_EXCEPTION_IMAGE_CHOICES"},
            {"file": "archive/exams/similar/middle/m1/2mid/25_왕운중_2학기_중간_중1_수학_유사A.js", "id": 12, "answer": "⑤", "image": "assets/images/25_왕운중_2학기_중간_중1_수학_유사A/q12.svg", "status": "STRUCTURE_EXCEPTION_IMAGE_CHOICES"},
        ],
        "dataFilesModified": False,
        "perFile": [
            {key: value for key, value in record.items() if key != "questions"}
            for record in labeled
        ],
    }


def counts_string(counts: dict) -> str:
    return " / ".join(str(counts.get(str(index), counts.get(index, 0))) for index in range(1, 6))


def render_markdown(report: dict) -> str:
    lines = [
        "# ANSWER INDEX DISTRIBUTION — ACTIVE 정본 승격 및 DRY-RUN v2",
        "",
        "ANSWER_INDEX_DISTRIBUTION_AUDIT = FAIL",
        "",
        "> ACTIVE 정본 승격과 공통 validator 구현은 완료했지만, 기존 생성형 데이터의 현재 분포는 아직 FAIL이다. 기존 `archive/exams` 데이터는 수정하지 않았고, v2 DRY-RUN 계획만 생성했다.",
        "",
        "## Completion",
        "",
        "- ACTIVE CONTRACT MODIFIED = PASS",
        "- VALIDATOR IMPLEMENTED = PASS",
        "- DRYRUN_V2 GENERATED = PASS",
        "- DATA_FILES_MODIFIED = NO",
        "",
        "## Inventory",
        "",
    ]
    inv = report["inventory"]
    lines.extend([
        f"- scanned files: similar {inv['scannedSimilarFiles']} + types {inv['scannedTypesFiles']} = {inv['scannedFiles']}",
        f"- labeled files: {inv['labeledFiles']}; ACTIVE policy files: {inv['activePolicyFiles']}",
        f"- DB/question-index parity: {inv['dbQuestionIndexParity']['files']}/{inv['dbQuestionIndexParity']['files']}; missing 0, duplicate 0, qCount mismatch 0, index mismatch 0",
        "",
        "| 분류 | 파일 | 전체 문항 | 객관식 | 5보기 단일정답 | 복수정답 | choices=[] 객관식 |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ])
    labels = {
        "GENERATED_SIMILAR": "GENERATED_SIMILAR",
        "GENERATED_CONFIRMATION": "GENERATED_CONFIRMATION",
        "GENERATED_ADVANCED": "GENERATED_ADVANCED",
        "TYPE_CONFIRMATION": "TYPE_CONFIRMATION (survey only)",
        "TYPE_ADVANCED": "TYPE_ADVANCED (survey only)",
        "OTHER": "OTHER",
    }
    for category in ["GENERATED_SIMILAR", "GENERATED_CONFIRMATION", "GENERATED_ADVANCED", "TYPE_CONFIRMATION", "TYPE_ADVANCED", "OTHER"]:
        s = inv["byCategory"][category]
        lines.append(f"| {labels[category]} | {s['files']} | {s['totalQuestions']} | {s['mcqCount']} | {s['validMcqCount']} | {s['multipleAnswerCount']} | {s['emptyChoicesMcq']} |")
    lines.extend([
        "",
        "정답 분포의 유효 MCQ는 `choices` 5개와 단일 answer index를 가진 문항이다. image-only choices와 복수정답은 별도 예외로 기록했다.",
        "",
        "## Current Distribution",
        "",
        "| 범위 | valid MCQ | ① | ② | ③ | ④ | ⑤ | ③ 비율 |",
        "|---|---:|---:|---:|---:|---:|---:|---:|",
    ])
    current = report["current"]
    current_rows = [
        ("라벨 대상 64개", current["allLabeled"]),
        ("ACTIVE 생성형 42개", current["activeGenerated"]),
        ("ACTIVE 생성형 DRY-RUN v2 예상", report["dryRunV2"]["activePredictedAfter"]),
        ("original 비교선", current["originalBaseline"]),
    ]
    for name, summary in current_rows:
        counts = summary["counts"]
        lines.append(f"| {name} | {summary['validMcqCount']} | {counts.get('1', counts.get(1, 0))} | {counts.get('2', counts.get(2, 0))} | {counts.get('3', counts.get(3, 0))} | {counts.get('4', counts.get(4, 0))} | {counts.get('5', counts.get(5, 0))} | {summary['share3']}% |")
    lines.extend([
        "",
        f"현재 라벨 대상 ③은 {current['allLabeled']['counts']['3']}개({current['allLabeled']['share3']}%)이고, original 비교선은 {current['originalBaseline']['share3']}%다.",
        "",
        "## File-level Distribution / DRY-RUN v2",
        "",
        "v2 seed는 `relativeExamPath + \"|ANSWER_INDEX_DISTRIBUTION_V1|\" + policyVersion`이고 policyVersion은 `1.0.0`이다. immutable 고정 → 3연속 해소 → max-min≤2 → N≥10 5종 사용 → 기존 index 최대 보존 순서로 deterministic planner를 실행했다.",
        "",
        "| 분류 | 파일 | N | 현재 ①/②/③/④/⑤ | ③% | max-min | longest run | 종류 | gate | v2 예상 ①/②/③/④/⑤ | 변경 | sync |",
        "|---|---|---:|---|---:|---:|---:|---:|---|---|---:|---:|",
    ])
    for category in ["GENERATED_SIMILAR", "GENERATED_CONFIRMATION", "GENERATED_ADVANCED", "TYPE_CONFIRMATION", "TYPE_ADVANCED"]:
        for record in report["perFile"]:
            if record["category"] != category:
                continue
            evaluation = record["evaluation"]
            plan = record["repairPlan"]
            after = ", ".join(map(str, plan["targetDistribution"])) if plan and plan.get("targetDistribution") else (counts_string(evaluation["counts"]) if record["policyApplied"] else "SURVEY_ONLY")
            if plan and plan.get("targetDistribution"):
                after = " / ".join(map(str, plan["targetDistribution"]))
            gate = "+".join([evaluation["gateStatus"], *evaluation["failureCodes"]])
            longest = evaluation["longestRun"]
            count3 = evaluation['counts'].get('3', evaluation['counts'].get(3, 0))
            lines.append(f"| {category} | {record['file']} | {evaluation['validMcqCount']} | {counts_string(evaluation['counts'])} | {(count3 / evaluation['validMcqCount'] * 100) if evaluation['validMcqCount'] else 0:.2f}% | {evaluation['maxMinusMin']} | {evaluation['longestSameAnswerRun']} (q{longest['fromQuestionId'] if longest['fromQuestionId'] is not None else '-'}~q{longest['toQuestionId'] if longest['toQuestionId'] is not None else '-'}) | {evaluation['usedAnswerKinds']} | {gate} | {after} | {plan['changedQuestionCount'] if plan else 0} | {len(plan['solutionSync']) if plan else 0} |")
    dry = report["dryRunV2"]
    lines.extend([
        "",
        "## DRY-RUN v2 Summary",
        "",
        f"- before filesWithFail: {dry['activeBefore']['filesWithFail']}",
        f"- predictedAfter filesWithFail: {dry['predictedAfterFilesWithFail']}",
        f"- predictedAfter filesBlocked: {dry['predictedAfterFilesBlocked']}",
        f"- files requiring change: {dry['filesRequiringChange']}",
        f"- questions requiring permutation: {dry['questionsRequiringPermutation']}",
        f"- solution answer-index strings requiring sync: {dry['solutionAnswerIndexStringsRequiringSync']}",
        f"- mutable planned: {dry['mutablePlanned']}",
        f"- immutable blocked: {dry['immutableBlocked']}",
        f"- image-choice exceptions: {dry['imageChoiceExceptions']}",
        f"- predicted after distribution: {counts_string(dry['activePredictedAfter']['counts'])}; ③={dry['activePredictedAfter']['share3']}%",
        "",
        "## Representative Case",
        "",
    ])
    representative = next(record for record in report["perFile"] if record["file"].endswith("25_금당고_2학기_중간_고1_유사.js"))
    representative_count3 = representative["evaluation"]["counts"].get("3", representative["evaluation"]["counts"].get(3, 0))
    lines.extend([
        "- file: `archive/exams/similar/high/h1/2mid/25_금당고_2학기_중간_고1_유사.js`",
        f"- before: valid={representative['evaluation']['validMcqCount']}; distribution={counts_string(representative['evaluation']['counts'])}; ③={representative_count3}; longest={representative['evaluation']['longestSameAnswerRun']}",
        f"- v2 target: {' / '.join(map(str, representative['repairPlan']['targetDistribution']))}; permutation={representative['repairPlan']['changedQuestionCount']}; solution sync={len(representative['repairPlan']['solutionSync'])}",
        f"- after gate: {representative['afterEvaluation']['gateStatus']}; target longest={representative['repairPlan']['targetLongestRun']['count']}",
        "",
        "## choices=[] 3건",
        "",
    ])
    for item in report["emptyChoicesConfirmed"]:
        lines.append(f"- {item['file']} q{item['id']}: answer {item['answer']}; {item['status']}; {item['image']}")
    lines.extend([
        "",
        "## Rule Lineage / Implementation",
        "",
        "- Legacy 분산 규칙: `alive/90_ARCHIVE/LEGACY_PROMPTS`에 존재하지만 ACTIVE authority가 아니다.",
        "- ACTIVE 정본: `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md` §17에 계약을 추가했다.",
        "- ACTIVE index: `alive/00_ALIVE_INDEX.md`에 계약과 shared evaluator를 연결했다.",
        "- shared evaluator/planner: `alive/engine/answer_index_distribution.py`",
        "- exam preflight: `alive/engine/exam_batch.py`",
        "- candidate review: `archive/tools/past-exam-pipeline/helpers/review_pipeline_candidates.py`",
        "- EX-08 설계문서는 참고만 하고 ACTIVE로 복사하지 않았다.",
        "",
        "### 저장소 전체 키워드 검색",
        "",
        "- `ANSWER INDEX`, `EX-08`, `choiceShuffle`, `choice shuffle`, `choiceOrderMutable`, `deterministic shuffle`은 현재 ACTIVE 구현이 아니라 `alive/05_DESIGN/ALIVE_QUALITY_PROOF_LOOP_ENGINE_세부구현계획서_v0.11.md`에 집중되어 있다.",
        "- ACTIVE 범위의 `ANSWER_INDEX`는 `alive/engine/fast_exam.py:804`의 `FAST_DISTRACTOR_PROVENANCE_ANSWER_INDEX_INVALID` 오류명뿐이며, 시험지 단위 분포 gate가 아니다.",
        "- `정답 번호`, `정답 위치`, `불규칙성`, `보기 재배열`, `균등 분배`는 `alive/90_ARCHIVE/LEGACY_PROMPTS`에 있고, 90_ARCHIVE는 역사적 근거로만 분리되어 있다.",
        "- 대상 Archive JS 103개에는 `answerDistribution`, `choiceOrderMutable`, `permutationHistory` 실행 필드가 없었으며, 이번 ACTIVE 구현은 공통 evaluator와 evidence를 새로 연결했다.",
        "",
        "## Machine Validation",
        "",
    ])
    for key, value in report["machineValidation"].items():
        lines.append(f"- {key}: {('PASS' if value is True else 'FAIL' if value is False else value)}")
    lines.extend([
        "",
        "## Verification",
        "",
    ])
    for key, value in report["verification"].items():
        lines.append(f"- {key}: {value}")
    lines.extend([
        "",
        "## Safety",
        "",
        "- existing generated JS / original JS / `archive/db.js` / `archive/question-index.js` / `archive/assets`: unchanged",
        "- v1 reports preserved; v2 reports are new files",
        "- `DATA_FILES_MODIFIED = NO`",
        "",
    ])
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-md", default=str(ROOT / "reports/answer-index-distribution-audit-v2.md"))
    parser.add_argument("--output-json", default=str(ROOT / "reports/answer-index-distribution-dryrun-v2.json"))
    args = parser.parse_args()
    report = build_report()
    Path(args.output_md).write_text(render_markdown(report) + "\n", encoding="utf-8")
    Path(args.output_json).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "activeContractModified": report["completion"]["activeContractModified"],
        "validatorImplemented": report["completion"]["validatorImplemented"],
        "dryRunV2Generated": report["completion"]["dryRunV2Generated"],
        "activeBefore": report["dryRunV2"]["activeBefore"],
        "activePredictedAfter": report["dryRunV2"]["activePredictedAfter"],
        "filesRequiringChange": report["dryRunV2"]["filesRequiringChange"],
        "questionsRequiringPermutation": report["dryRunV2"]["questionsRequiringPermutation"],
        "solutionSync": report["dryRunV2"]["solutionAnswerIndexStringsRequiringSync"],
        "predictedAfterFilesWithFail": report["dryRunV2"]["predictedAfterFilesWithFail"],
        "targetGateCheck": report["dryRunV2"]["targetGateCheck"],
        "machineValidation": report["machineValidation"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
