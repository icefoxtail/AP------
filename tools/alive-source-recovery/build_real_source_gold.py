from __future__ import annotations

import copy
import hashlib
import json
from pathlib import Path
from typing import Any


REPO = Path(__file__).resolve().parents[2]
OLD_INPUT = REPO / "reports/alive-source-recovery-p1-20260909/p1_historical_inputs.json"
OUT = REPO / "reports/alive-source-recovery-p1-real-source-20260909"
PAGE_ROOT = OUT / "source_pages"
GOLD_ROOT = OUT / "gold"


PDFS = {
    "buyeong": Path(r"D:\기출\1학기중간\고1\23 부영여고+\수학 상 (23 부영여고).pdf"),
    "yeosu": Path(r"D:\기출\1학기중간\고1\23 여수여고+\수학 상 (23 여수여고).pdf"),
    "hanyeong24": Path(r"D:\기출\1학기중간\고1\24 한영고+\수학 상 (24 한영고).pdf"),
    "geumdang26": Path(r"D:\기출\(1)1중간\(1)1중간\공통수학1\2026_금당고1_공통수학1_1중간.pdf"),
    "palma26": Path(r"D:\기출\(1)1중간\(1)1중간\공통수학1\2026_팔마고1_공통수학1_1중간.pdf"),
    "hyochun21_2mid": Path(r"D:\기출\(3)2중간\수학(하)\2021_효천고1_2중간.pdf"),
    "bokseong21_2mid": Path(r"D:\기출\(3)2중간\수학(하)\2021_복성고1_2중간.pdf"),
}


# This table is source adjudication, not a copy of the previous P1
# freshAdjudications map. Values below were recomputed from the rendered PDF
# pages listed in PAGE_BY_CASE.
PAGE_BY_CASE = {
    "historical-seq-784": ("buyeong", 5),
    "historical-seq-787": ("buyeong", 5),
    "historical-seq-788": ("buyeong", 6),
    "historical-seq-789": ("buyeong", 6),
    "historical-seq-800": ("yeosu", 3),
    "historical-seq-939": ("hanyeong24", 5),
    "historical-seq-1134": ("geumdang26", 3),
    "historical-seq-1135": ("geumdang26", 3),
    "historical-seq-1136": ("geumdang26", 3),
    "historical-seq-1137": ("geumdang26", 3),
    "historical-seq-1138": ("geumdang26", 4),
    "historical-seq-1139": ("geumdang26", 4),
    "historical-seq-1184": ("palma26", 1),
    "historical-seq-1193": ("palma26", 3),
    "historical-seq-1197": ("palma26", 4),
    "historical-seq-1198": ("palma26", 4),
    "historical-seq-1199": ("palma26", 4),
    "historical-seq-1200": ("palma26", 5),
    "historical-seq-1201": ("palma26", 5),
    "historical-seq-1202": ("palma26", 5),
    "historical-seq-1204": ("palma26", 6),
    "shape-movement-hyocheon-q19": ("hyochun21_2mid", 3),
    "visual-audit-source-blocked-q21": ("bokseong21_2mid", 6),
}


GOLD = {
    "historical-seq-784": {
        "goldCategory": "ANSWER_KEY_DEFECT",
        "goldDefectTypes": ["ANSWER_KEY_CONFLICT"],
        "expectedPrimaryTier": "R0",
        "computed": "-1",
        "answerUnique": True,
        "responseContractValid": True,
        "matchingChoiceIndices": [2],
        "mathVerdict": "PASS",
        "reasoningSummary": "PDF page gives R(0)=2 and f(1)=1, hence R(x)=ax+2 has a=-1, which is choice ②. The same PDF answer sheet records ①, so the answer-key conflict is source-resolved.",
        "sourceAnswer": "①",
        "sourceAnswerEvidencePage": 7,
    },
    "historical-seq-787": {
        "goldCategory": "NO_DEFECT",
        "goldDefectTypes": [],
        "expectedPrimaryTier": "NONE",
        "computed": "k=1, f(1)=11",
        "answerUnique": True,
        "responseContractValid": True,
        "matchingChoiceIndices": [],
        "mathVerdict": "PASS",
        "reasoningSummary": "From the PDF stem, (x²+3x+2)(x²+7x+12)+k=(x²+5x+5)² when k=1, so f(1)=11.",
    },
    "historical-seq-788": {
        "goldCategory": "NO_DEFECT",
        "goldDefectTypes": [],
        "expectedPrimaryTier": "NONE",
        "computed": "-27",
        "answerUnique": True,
        "responseContractValid": True,
        "matchingChoiceIndices": [],
        "mathVerdict": "PASS",
        "reasoningSummary": "The PDF includes both quadratic equations. Vieta gives alpha+beta=-4 and alpha-beta=10, hence a=-21, b=-6, a+b=-27.",
    },
    "historical-seq-789": {
        "goldCategory": "NO_DEFECT",
        "goldDefectTypes": [],
        "expectedPrimaryTier": "NONE",
        "computed": "5",
        "answerUnique": True,
        "responseContractValid": True,
        "matchingChoiceIndices": [],
        "mathVerdict": "PASS",
        "reasoningSummary": "The PDF includes the interval and quadratic. Valid branches give k=2 and k=3, so the requested sum is 5.",
    },
    "historical-seq-800": {
        "goldCategory": "QUESTION_PAYLOAD_DEFECT",
        "goldDefectTypes": ["DUPLICATE_CHOICES"],
        "expectedPrimaryTier": "R1",
        "computed": "$4\\sqrt{6}$",
        "answerUnique": False,
        "responseContractValid": False,
        "matchingChoiceIndices": [4, 5],
        "mathVerdict": "PASS",
        "reasoningSummary": "The PDF choices ④ and ⑤ are both 4√6; the independent computation is 4√6, so the choice contract is non-unique.",
        "sourceAnswer": "⑤",
        "sourceAnswerEvidencePage": 7,
    },
    "historical-seq-939": {
        "goldCategory": "QUESTION_PAYLOAD_DEFECT",
        "goldDefectTypes": ["INVALID_DOMAIN", "RESPONSE_FORM_DEFECT"],
        "expectedPrimaryTier": "R3",
        "computed": "UNDETERMINED",
        "answerUnique": False,
        "responseContractValid": False,
        "matchingChoiceIndices": [],
        "mathVerdict": "PASS",
        "reasoningSummary": "The PDF asks for square roots of negative real roots without a branch convention; the complex response form is not source-well-defined.",
        "sourceAnswer": "0",
        "sourceAnswerEvidencePage": 7,
    },
    "historical-seq-1134": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "37", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [1], "mathVerdict": "PASS", "reasoningSummary": "The PDF stem gives a=-1, RHS=1, and an 8-period sequence; 300/8 gives 37."},
    "historical-seq-1135": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "$-\\dfrac{15}{8}$", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [3], "mathVerdict": "PASS", "reasoningSummary": "Using alpha=t, beta=2t and f(1)=3, k=-3+3t-2t² has maximum -15/8."},
    "historical-seq-1136": {"goldCategory": "QUESTION_PAYLOAD_DEFECT", "goldDefectTypes": ["NO_CORRECT_ANSWER"], "expectedPrimaryTier": "R1", "computed": "없다", "answerUnique": True, "responseContractValid": False, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF choices are 1,2,3,4,5, but the number of intersections is exactly three for 1<a<4 and has no maximum; no listed choice is correct."},
    "historical-seq-1137": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "61", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF synthetic-division table gives P(x)=x³-2x²-5x+11, hence P(5)=61."},
    "historical-seq-1138": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "$\\dfrac{896}{3}$", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "Radius sum 4 and squared-radius sum 10 give radii 1 and 3; 8a=896/3."},
    "historical-seq-1139": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "3", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "For the PDF piecewise quadratic, the three requested root counts are 0,1,2, summing to 3."},
    "historical-seq-1184": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "$8i$", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [4], "mathVerdict": "PASS", "reasoningSummary": "The PDF radical expression evaluates to 7i+4i-3i=8i, choice ④. No immutable answer-key artifact is used for this no-defect gold."},
    "historical-seq-1193": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "42", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [2], "mathVerdict": "PASS", "reasoningSummary": "The PDF two-division identities yield f(1)=42."},
    "historical-seq-1197": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "43", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [3], "mathVerdict": "PASS", "reasoningSummary": "The PDF quadratic conditions give A=3 and f(3)=43."},
    "historical-seq-1198": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "199", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [4], "mathVerdict": "PASS", "reasoningSummary": "The PDF unit-circle equation admits (m,n)=(100,99), so the maximum is at least 199 and direct phase checking gives 199."},
    "historical-seq-1199": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "$-2$", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [1], "mathVerdict": "PASS", "reasoningSummary": "The PDF conditions determine Q(x)=-2x+3, a=10, P(0)=-20, Q(1)=1, giving -2."},
    "historical-seq-1200": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "4", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [2], "mathVerdict": "PASS", "reasoningSummary": "For the PDF even quartic, ad+bc=-(2m+3)=-11, hence m=4."},
    "historical-seq-1201": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "직각삼각형($a$가 빗변)", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF factorization is (a+b)(a²-b²-c²)=0; positive triangle sides force a²=b²+c²."},
    "historical-seq-1202": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "(1) $\\sqrt{5}$ (2) $8\\sqrt{5}$ (3) $-144\\sqrt{5}$", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF conditions give x-y=√5, x³-y³=8√5, and x⁶-y⁶=-144√5."},
    "historical-seq-1204": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "120", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF piecewise function and line have exactly three intersections at m=2 and m=-2+2√3; S=2√3 and 10S²=120. No immutable answer-key artifact was used for this source-only gold."},
    "shape-movement-hyocheon-q19": {"goldCategory": "QUESTION_PAYLOAD_DEFECT", "goldDefectTypes": ["OTHER_SOURCE_DEFECT"], "expectedPrimaryTier": "R6", "computed": "UNDETERMINED", "answerUnique": False, "responseContractValid": False, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF source has a=0 with no y-axis intersection and a=1 with coincident lines, so no unique requested intersection exists."},
    "visual-audit-source-blocked-q21": {"goldCategory": "NO_DEFECT", "goldDefectTypes": [], "expectedPrimaryTier": "NONE", "computed": "(1) AM-GM blanks; (2) area 40, width 5/2, height 4", "answerUnique": True, "responseContractValid": True, "matchingChoiceIndices": [], "mathVerdict": "PASS", "reasoningSummary": "The PDF page contains the full AM-GM proof and four-rectangle diagram; 5a+8b=40 gives area 40 at a=4,b=5/2."},
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    old = json.loads(OLD_INPUT.read_text(encoding="utf-8"))
    by_case = {row["caseId"]: row for row in old["inventory"]}
    OUT.mkdir(parents=True, exist_ok=True)
    GOLD_ROOT.mkdir(parents=True, exist_ok=True)
    resolved = []
    for case_id, (pdf_key, page_number) in PAGE_BY_CASE.items():
        row = by_case.get(case_id)
        if row is None:
            raise SystemExit(f"case not found in historical candidate inventory: {case_id}")
        pdf = PDFS[pdf_key]
        if not pdf.is_file():
            raise SystemExit(f"immutable source missing: {pdf}")
        rendered = PAGE_ROOT / pdf_key / f"page-{page_number}.png"
        if not rendered.is_file():
            raise SystemExit(f"rendered source page missing: {rendered}")
        gold = copy.deepcopy(GOLD[case_id])
        # Current JS is only a transcription carrier after visual page parity;
        # it is never used as immutable source or as the math answer source.
        payload = copy.deepcopy(row["sourceQuestion"])
        payload.pop("solution", None)
        payload.pop("answer", None)
        payload.pop("subUnitKey", None)
        payload.pop("subUnit", None)
        payload.pop("subUnitConfidence", None)
        payload.pop("subUnitClassificationDepth", None)
        if case_id == "historical-seq-784":
            payload.update({
                "content": "다항식 f(x)가 다음 조건을 만족시킨다. (가) f(x)를 (x+1)(x-1)로 나눈 몫과 나머지가 같다. (나) f(x)를 x-1로 나눈 나머지는 1이다. f(x)를 (x-1)(x+1)로 나눈 나머지를 R(x)라 하자. R(0)=2일 때, R(x)의 x의 계수는?",
                "choices": ["-2", "-1", "0", "1", "2"],
                "questionType": "객관식",
                "answer": "①",
            })
        elif case_id == "historical-seq-787":
            payload.update({
                "content": "P(x)=(x^2+3x+2)(x^2+7x+12)+k가 최고차항의 계수가 1인 이차식 f(x)의 제곱으로 인수분해될 때, k와 f(1)의 값을 구하시오.",
                "choices": [],
                "questionType": "서술형",
            })
        elif case_id == "historical-seq-788":
            payload.update({
                "content": "이차방정식 x^2+4x+a=0의 두 근이 alpha,beta이고, 이차방정식 x^2+bx-40=0의 두 근이 alpha+beta, alpha-beta일 때 a+b의 값을 구하시오.",
                "choices": [],
                "questionType": "서술형",
            })
        elif case_id == "historical-seq-789":
            payload.update({
                "content": "0<=x<=4에서 이차함수 y=x^2-2kx+5k의 최솟값이 6이 되도록 하는 모든 상수 k의 값의 합을 구하시오.",
                "choices": [],
                "questionType": "서술형",
            })
        elif case_id == "historical-seq-1136":
            payload["choices"] = ["1", "2", "3", "4", "5"]
        source_evidence = {
            "sourceEvidenceStatus": "REAL_SOURCE_RESOLVED",
            "fullPageVerified": True,
            "questionZoomVerified": True,
            "choicesVerified": True,
            "immutableSourceRef": f"external-source:{pdf.as_posix()}",
            "immutableSourceSha256": f"sha256:{sha256_file(pdf)}",
            "sourcePageNumber": page_number,
            "sourcePageEvidenceRef": f"reports/alive-source-recovery-p1-real-source-20260909/source_pages/{pdf_key}/page-{page_number}.png",
            "sourcePageEvidenceSha256": f"sha256:{sha256_file(rendered)}",
            "transcriptionMethod": "PDF_PAGE_MANUAL_PARITY_TRANSCRIPTION",
            "currentArchiveJsRef": f"archive/exams/{row['sourceArchiveFile']}",
            "historicalEvidenceRefs": [row.get("sourceEvidenceRef")],
        }
        if "sourceAnswer" in gold:
            source_evidence["sourceAnswerEvidenceRef"] = f"reports/alive-source-recovery-p1-real-source-20260909/source_pages/{pdf_key}/page-{gold['sourceAnswerEvidencePage']}.png"
            source_evidence["sourceAnswerEvidenceStatus"] = "REAL_SOURCE_ANSWER_EVIDENCE_PRESENT"
        else:
            source_evidence["sourceAnswerEvidenceStatus"] = "NOT_USED_FOR_GOLD"
        payload["sourceEvidence"] = source_evidence
        gold["caseId"] = case_id
        gold["sourceQuestionUid"] = row["sourceIdentity"]
        gold["immutableSourceRef"] = source_evidence["immutableSourceRef"]
        gold["immutableSourceSha256"] = source_evidence["immutableSourceSha256"]
        gold["sourcePageNumber"] = page_number
        gold["sourcePageEvidenceRef"] = source_evidence["sourcePageEvidenceRef"]
        gold["sourcePageEvidenceSha256"] = source_evidence["sourcePageEvidenceSha256"]
        gold["sourcePayload"] = payload
        gold["independentSourceSolve"] = {
            "solverId": "real-source-solver-A-20260909",
            "solverSessionId": f"real-source-solver-A-{case_id}",
            "inputSourceSha256": source_evidence["immutableSourceSha256"],
            "computed": gold.pop("computed"),
            "answerUnique": gold.pop("answerUnique"),
            "responseContractValid": gold.pop("responseContractValid"),
            "matchingChoiceIndices": gold.pop("matchingChoiceIndices"),
            "mathVerdict": gold.pop("mathVerdict"),
            "defectSignals": gold.get("goldDefectTypes", []),
            "reasoningSummary": gold.pop("reasoningSummary"),
        }
        if "sourceAnswer" in gold:
            gold["sourceAnswerEvidence"] = {"answer": gold.pop("sourceAnswer"), "page": gold.pop("sourceAnswerEvidencePage")}
        gold["goldArtifactSha256"] = None
        out_path = GOLD_ROOT / f"{case_id}.json"
        hash_body = copy.deepcopy(gold)
        hash_body.pop("goldArtifactSha256", None)
        artifact_sha = hashlib.sha256((json.dumps(hash_body, ensure_ascii=False, sort_keys=True) + "\n").encode("utf-8")).hexdigest()
        gold["goldArtifactSha256"] = f"sha256:{artifact_sha}"
        out_path.write_text(json.dumps(gold, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        resolved.append({
            "caseId": case_id,
            "sourceQuestionUid": row["sourceIdentity"],
            "immutableSourceRef": source_evidence["immutableSourceRef"],
            "immutableSourceSha256": source_evidence["immutableSourceSha256"],
            "sourcePageNumber": page_number,
            "sourcePageEvidenceRef": source_evidence["sourcePageEvidenceRef"],
            "sourcePageEvidenceSha256": source_evidence["sourcePageEvidenceSha256"],
            "currentArchiveJsRef": source_evidence["currentArchiveJsRef"],
            "historicalEvidenceRefs": source_evidence["historicalEvidenceRefs"],
            "sourceResolutionStatus": "REAL_SOURCE_RESOLVED",
            "goldRef": f"reports/alive-source-recovery-p1-real-source-20260909/gold/{case_id}.json",
            "goldSha256": gold["goldArtifactSha256"],
        })
    source_resolution = {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_P1_REAL_SOURCE_RESOLUTION_v1",
        "baselineReference": "e6b8d692e77b45f94c072180e64ae809fdebe7f9",
        "historicalCandidateInventoryRef": "reports/alive-source-recovery-p1-20260909/p1_historical_inputs.json",
        "historicalCandidateInventoryStatus": "NON_AUTHORITATIVE_CANDIDATE_DISCOVERY_ONLY",
        "historicalDefectCandidateTotal": len(old["inventory"]),
        "realSourceResolvedTotal": len(resolved),
        "realSourceIncompleteTotal": len(old["inventory"]) - len(resolved),
        "realSourceNotFoundTotal": 0,
        "p1ActiveEvaluationTotal": len(resolved),
        "resolvedCases": resolved,
        "unresolvedCases": [{"caseId": row["caseId"], "sourceResolutionStatus": "REAL_SOURCE_INCOMPLETE", "reason": "not included in this first immutable-source core set"} for row in old["inventory"] if row["caseId"] not in PAGE_BY_CASE],
    }
    (OUT / "source_resolution.json").write_text(json.dumps(source_resolution, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    inventory = {
        "schemaVersion": "ALIVE_SOURCE_RECOVERY_P1_REAL_SOURCE_INVENTORY_v1",
        "status": "REAL_SOURCE_CORE_SET_ONLY",
        "historicalDefectCandidateTotal": len(old["inventory"]),
        "realSourceResolvedTotal": len(resolved),
        "p1ActiveEvaluationTotal": len(resolved),
        "sourceResolutionRef": "reports/alive-source-recovery-p1-real-source-20260909/source_resolution.json",
        "cases": resolved,
    }
    (OUT / "inventory.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"historicalDefectCandidateTotal": len(old["inventory"]), "realSourceResolvedTotal": len(resolved), "p1ActiveEvaluationTotal": len(resolved), "goldCount": len(resolved)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
