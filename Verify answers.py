import os
import re
import json
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

EXAMS_DIR = r"C:\Users\USER\Desktop\APMATH\AP\exams"
LOG_PATH = r"C:\Users\USER\Desktop\APMATH\AP\verify_log.json"

# ── JS 파일에서 questionBank 추출 ──────────────────────────
def extract_question_bank(js_path: str):
    with open(js_path, "r", encoding="utf-8") as f:
        content = f.read()

    # window.questionBank = [...]; 형태 추출
    match = re.search(r"window\.questionBank\s*=\s*(\[[\s\S]*?\]);", content)
    if not match:
        # concat 패턴도 있을 수 있음 — 전체 합치기
        arrays = re.findall(r"\[(\{[\s\S]*?\})\]", content)
        if not arrays:
            return None
        return None

    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return None


# ── Gemini로 정답 검증 ─────────────────────────────────────
def verify_with_gemini(q: dict) -> dict:
    content = q.get("content", "")
    choices = q.get("choices", [])
    answer = q.get("answer", "")
    solution = q.get("solution", "")

    # 선택지 포맷
    choices_str = ""
    if choices:
        for i, c in enumerate(choices, 1):
            choices_str += f"  {i}. {c}\n"

    prompt = f"""다음 수학 문제의 정답이 올바른지 검증하세요.

[문제]
{content}

[선택지]
{choices_str if choices_str else "(주관식)"}

[현재 기재된 정답]
{answer}

[풀이]
{solution}

위 풀이를 직접 계산하여 정답이 맞는지 확인하세요.
반드시 아래 JSON 형식으로만 응답하세요. 다른 말은 절대 금지입니다.

{{
  "correct": true 또는 false,
  "correct_answer": "올바른 정답 (확실하지 않으면 현재 정답 그대로)",
  "reason": "틀린 이유 한 줄 (맞으면 빈 문자열)"
}}"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt],
        )
        raw = response.text.strip()
        raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.IGNORECASE)
        raw = re.sub(r"\s*```$", "", raw)
        return json.loads(raw)
    except Exception as e:
        return {"correct": None, "correct_answer": answer, "reason": f"검증 실패: {e}"}


# ── 메인 ───────────────────────────────────────────────────
def run_verify():
    results = []
    error_count = 0
    ok_count = 0
    skip_count = 0

    js_files = []
    for root, dirs, files in os.walk(EXAMS_DIR):
        for f in files:
            if f.endswith(".js"):
                js_files.append(os.path.join(root, f))

    js_files.sort()
    print(f"총 {len(js_files)}개 JS 파일 발견\n")

    for js_path in js_files:
        filename = os.path.basename(js_path)
        bank = extract_question_bank(js_path)

        if bank is None:
            print(f"[건너뜀] 파싱 실패 → {filename}")
            skip_count += 1
            continue

        print(f"[검증 중] {filename} ({len(bank)}문항)")

        for q in bank:
            qid = q.get("id", "?")
            result = verify_with_gemini(q)

            entry = {
                "file": filename,
                "id": qid,
                "original_answer": q.get("answer", ""),
                "correct": result.get("correct"),
                "correct_answer": result.get("correct_answer", ""),
                "reason": result.get("reason", ""),
            }
            results.append(entry)

            if result.get("correct") is False:
                error_count += 1
                print(f"  ❌ 문제{qid}: 기재={q.get('answer')} → 정답={result.get('correct_answer')} ({result.get('reason')})")
            elif result.get("correct") is True:
                ok_count += 1
                print(f"  ✅ 문제{qid}: {q.get('answer')}")
            else:
                print(f"  ⚠️  문제{qid}: 검증 실패")

            time.sleep(0.5)  # API 과부하 방지

    # 결과 저장
    with open(LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"✅ 정답: {ok_count}개")
    print(f"❌ 오류: {error_count}개")
    print(f"⚠️  건너뜀: {skip_count}개")
    print(f"로그 저장 → {LOG_PATH}")


if __name__ == "__main__":
    run_verify()