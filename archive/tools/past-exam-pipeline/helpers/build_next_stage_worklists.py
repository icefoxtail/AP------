import json
from datetime import datetime, timezone
from pathlib import Path


BATCH_ID = "1final_middle_m2_2022_2025"
BATCH_DIR = Path("archive/_generated/past-exams/_batch")
SUMMARY_PATH = BATCH_DIR / f"candidate_generation_summary_{BATCH_ID}.json"
PROGRESS_PATH = BATCH_DIR / f"parallel_pipeline_progress_{BATCH_ID}.json"
CONTENT_WORKLIST_PATH = BATCH_DIR / f"content_transcription_worklist_{BATCH_ID}.json"
ANSWER_WORKLIST_PATH = BATCH_DIR / f"answer_mapping_worklist_{BATCH_ID}.json"


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def split_agents(items, agent_count=4):
    agents = {}
    for index in range(agent_count):
        name = chr(ord("A") + index)
        agents[name] = {
            "agent": name,
            "jobCount": 0,
            "questionCount": 0,
            "items": [],
        }
    chunk_size = (len(items) + agent_count - 1) // agent_count
    for index, item in enumerate(items):
        name = chr(ord("A") + min(index // chunk_size, agent_count - 1))
        agents[name]["items"].append(item)
        agents[name]["jobCount"] += 1
        agents[name]["questionCount"] += item.get("questionCount", 0)
    return list(agents.values())


def build_queue(summary, queue_kind):
    queue_key = "contentTranscriptionQueue" if queue_kind == "content" else "answerMappingQueue"
    stage_name = "content_choices_transcription" if queue_kind == "content" else "answer_mapping"
    allowed_output = (
        ["content", "choices", "reviewStatus"]
        if queue_kind == "content"
        else [
            "answer",
            "answerStatus",
            "solution",
            "solutionStatus",
            "level",
            "category",
            "originalCategory",
            "standardCourse",
            "standardUnitKey",
            "standardUnit",
            "standardUnitOrder",
            "tagConfidence",
            "tagStatus",
        ]
    )

    items = []
    for row in summary["items"]:
        queue_path = row[queue_key]
        queue = read_json(Path(queue_path))
        item = {
            "examId": row["examId"],
            "candidateFile": row["candidateFile"],
            "queuePath": queue_path,
            "queueStatus": queue.get("status", "ready"),
            "questionCount": row["questionCount"],
            "allowedOutputFields": allowed_output,
            "protectedArchiveRule": "do not edit archive/exams/**/*.js, archive/db.js, archive/engine.html",
        }
        if queue_kind == "answer":
            item["directSolvePolicy"] = {
                "answerFallback": "Directly solve immediately after extraction; official answer evidence is only for cross-checking.",
                "solutionFallback": "When answer is solved, write the solution by following the rulebooks before any final validation.",
                "crossValidation": "If official answer/solution sources exist, compare after direct solving. Fix confirmed mistakes; keep direct solution with a conflict report when the source appears wrong.",
                "rulebooksToReadWhenSolving": queue.get("rulebooksToReadWhenSolving", [
                    "archive/archive/docs/PAST_EXAM_PDF_TO_JS_PIPELINE_RULEBOOK.md",
                    "rules/해설프로토콜.md",
                    "archive/textbook/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md",
                ]),
                "forbiddenDuringSolving": ["content", "choices", "id", "displayNo", "layoutTag", "wide", "image"],
                "conflictAction": "If solving reveals OCR/content conflict, report it back to the content queue instead of editing problem text.",
            }
        items.append(item)

    return {
        "generatedAt": now_iso(),
        "batchId": BATCH_ID,
        "stage": stage_name,
        "sourceSummary": str(SUMMARY_PATH),
        "jobCount": len(items),
        "questionCount": sum(item["questionCount"] for item in items),
        "status": "ready",
        "directSolvePolicy": {
            "enabled": queue_kind == "answer",
            "missingAnswerAction": "direct_solve_immediately_after_extraction" if queue_kind == "answer" else "",
            "missingSolutionAction": "write_rulebook_solution_immediately_after_answer" if queue_kind == "answer" else "",
            "officialSourceAction": "cross_check_after_direct_solve" if queue_kind == "answer" else "",
        },
        "agentPlan": {
            "agentCount": 4,
            "distribution": split_agents(items, 4),
        },
        "items": items,
    }


def main():
    summary = read_json(SUMMARY_PATH)
    content = build_queue(summary, "content")
    answer = build_queue(summary, "answer")
    write_json(CONTENT_WORKLIST_PATH, content)
    write_json(ANSWER_WORKLIST_PATH, answer)

    progress = {
        "generatedAt": now_iso(),
        "batchId": BATCH_ID,
        "scope": "1학기 기말 중2 2022~2025 sample batch, 20 PDFs",
        "pipelineMode": "parallel_preflight_then_full_page_fallback_candidate",
        "archiveProtection": {
            "protectedArchiveTouched": False,
            "protectedPaths": [
                "archive/exams/**/*.js",
                "archive/db.js",
                "archive/engine.html",
            ],
        },
        "stages": [
            {"name": "existing_js_inventory_and_exclusion", "status": "done"},
            {"name": "pdf_preflight_render", "status": "done"},
            {"name": "parallel_question_count_verification", "status": "done"},
            {"name": "displayNo_page_map", "status": "done"},
            {"name": "candidate_js_full_page_fallback", "status": "done"},
            {"name": "content_choices_transcription", "status": "ready"},
            {"name": "answer_solution_mapping", "status": "ready"},
            {"name": "final_js_validation", "status": "pending"},
            {"name": "live_archive_registration", "status": "blocked_until_user_approves"},
        ],
        "candidateSummary": {
            "path": str(SUMMARY_PATH),
            "jobCount": summary["jobCount"],
            "passedCount": summary["passedCount"],
            "needsReviewCount": summary["needsReviewCount"],
            "status": summary["status"],
        },
        "nextWorklists": {
            "contentTranscription": str(CONTENT_WORKLIST_PATH),
            "answerMapping": str(ANSWER_WORKLIST_PATH),
        },
    }
    write_json(PROGRESS_PATH, progress)
    print(json.dumps(progress, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
