import os
import re
import json
import time
import random
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# 클라이언트 설정: API 서버 생성 지연으로 인한 ReadTimeout 방지를 위해 타임아웃을 120초로 연장
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY"),
    http_options={
        'timeout': 120.0
    }
)

EXAMS_DIR = r"C:\Users\USER\Desktop\APMATH\AP\exams"

class SolutionResponse(BaseModel):
    solution: str
    sympy_code: str


# ── 전처리: 스키마 정규화 및 포맷 초기화 (기존 해설 절대 보존) ──
def preprocess_exam_files():
    js_files = []
    for root, dirs, files in os.walk(EXAMS_DIR):
        for f in files:
            if f.endswith(".js"):
                js_files.append(os.path.join(root, f))

    for js_path in js_files:
        filename = os.path.basename(js_path)
        title_match = re.search(r"^(.*?)(?:_p\d+)?\.js$", filename)
        exam_title = title_match.group(1) if title_match else filename.replace(".js", "")

        with open(js_path, "r", encoding="utf-8") as f:
            content = f.read()

        bank_match = re.search(r"window\.questionBank\s*=\s*(\[[\s\S]*?\]);", content)
        if not bank_match:
            continue

        try:
            bank = json.loads(bank_match.group(1))
        except json.JSONDecodeError:
            continue

        if not isinstance(bank, list):
            continue
            
        is_malformed = False
        for q in bank:
            if not isinstance(q, dict):
                is_malformed = True
                break
        
        if is_malformed:
            print(f"[건너뜀] 구조 에러 (문항이 객체가 아님) → {filename}")
            continue

        modified = False
        for i, q in enumerate(bank):
            new_id = i + 1
            if q.get("id") != new_id:
                q["id"] = new_id
                modified = True

            if "level" not in q:
                q["level"] = "중"
                modified = True

            if "content" in q and "\n" in q["content"]:
                q["content"] = q["content"].replace("\n", "<br>")
                modified = True

        if modified or "window.examTitle" not in content:
            js_content = f'window.examTitle = "{exam_title}";\n'
            js_content += f"window.questionBank = {json.dumps(bank, ensure_ascii=False, indent=2)};\n"
            with open(js_path, "w", encoding="utf-8") as f:
                f.write(js_content)


# ── JS 파일에서 questionBank 추출 ──────────────────────────
def extract_question_bank(js_path: str):
    with open(js_path, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r"window\.questionBank\s*=\s*(\[[\s\S]*?\]);", content)
    if not match:
        return None
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return None


# ── JS 파일에 questionBank 저장 ────────────────────────────
def save_question_bank(js_path: str, data: list):
    exam_title = ""
    with open(js_path, "r", encoding="utf-8") as f:
        content = f.read()
        title_match = re.search(r'window\.examTitle\s*=\s*"(.*?)";', content)
        if title_match:
            exam_title = title_match.group(1)

    js_content = ""
    if exam_title:
        js_content += f'window.examTitle = "{exam_title}";\n'
    js_content += f"window.questionBank = {json.dumps(data, ensure_ascii=False, indent=2)};\n"
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)


# ── Gemini로 solution 생성 ─────────────────────────────────
def generate_solution(q: dict) -> tuple:
    content = q.get("content", "")
    choices = q.get("choices", [])
    answer = q.get("answer", "")

    choices_str = ""
    if choices:
        for i, c in enumerate(choices, 1):
            choices_str += f"  {i}. {c}\n"

    prompt = f"""다음 수학 문제의 풀이와 Sympy 검증 코드를 작성하세요.

[문제]
{content}

[선택지]
{choices_str if choices_str else "(주관식)"}

[정답]
{answer}

풀이 작성 규칙:
- 반드시 아래 구조를 따른다: [풀이] 조건 정리 및 수식 중심 전개 --- [결론] 정답: {answer}이다.
- 단계별로 계산 과정을 빠짐없이 작성한다. 논리 점프 금지.
- 각 단계마다 왜 그렇게 하는지 근거를 한 줄씩 붙인다.
- 마지막 줄은 반드시 "[결론] 정답: {answer}이다." 형태로 마무리한다.

수식 규칙 (solution 필드):
- 수식은 $...$로 감싼다.
- JS 문자열 내 역슬래시는 반드시 이중으로 쓴다. 예: \\\\frac, \\\\sqrt, \\\\therefore
- 줄바꿈은 <br>로 표기한다. $...$는 줄마다 반드시 쌍으로 닫는다.
- solution에 implies, therefore는 영어 금지. \\\\implies, \\\\therefore, \\\\because 사용.

Sympy 코드 규칙 (sympy_code 필드):
- 반드시 실행 가능한 Python 코드로 작성한다.
- from sympy import * 로 시작한다.
- 최종 결과를 print(result)로 출력한다.
- 도형 문제 등 Sympy로 검증 불가한 경우: "SKIP" 으로만 기입한다."""

    for attempt in range(1, 6):
        try:
            # 중등부 저비용 고속 처리를 위해 Lite 모델 사용
            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=SolutionResponse,
                    temperature=0.2
                ),
            )
            result = json.loads(response.text)
            return result.get("solution", ""), result.get("sympy_code", "SKIP")
        except Exception as e:
            if attempt == 5:
                raise
            # 지터가 포함된 지수 백오프로 안정성 확보
            wait = (2 ** attempt) + random.uniform(1, 5)
            print(f"    [재시도 {attempt}/5] 오류: {e} | {wait:.1f}초 대기...")
            time.sleep(wait)


# ── 메인 실행 ──────────────────────────────────────────────
def run_solution_generator():
    preprocess_exam_files()
    
    js_files = []
    for root, dirs, files in os.walk(EXAMS_DIR):
        for f in files:
            if f.endswith(".js"):
                js_files.append(os.path.join(root, f))

    # 최신 연도부터 내림차순 정렬
    js_files.sort(key=lambda x: os.path.basename(x), reverse=True)
    
    total_done = 0
    total_fail = 0
    total_skipped = 0

    for js_path in js_files:
        filename = os.path.basename(js_path)
        bank = extract_question_bank(js_path)

        if not isinstance(bank, list):
            continue

        valid_bank = [q for q in bank if isinstance(q, dict)]
        needs_solution = [q for q in valid_bank if not q.get("solution")]
        
        if not needs_solution:
            continue

        # 중등부 식별자 검증 (오탐지 방지를 위해 '중간' 텍스트 제거 후 비교)
        clean_filename = filename.replace("중간", "")
        is_middle_school = "중1" in filename or "중2" in filename or "중3" in filename or "중학교" in filename or "중" in clean_filename

        if not is_middle_school:
            print(f"\n[건너뜀] {filename} (고등부 파일 보류)")
            total_skipped += len(needs_solution)
            continue

        print(f"\n[처리 중] {filename} (미완료: {len(needs_solution)}문항)")
        modified = False

        for q in bank:
            if not isinstance(q, dict) or q.get("solution"):
                continue

            qid = q.get("id", "?")

            try:
                solution, sympy_code = generate_solution(q)
                q["solution"] = solution
                q["sympy_code"] = sympy_code
                modified = True
                total_done += 1
                print(f"  ✅ 문제{qid} 완료 (중등부 Lite LLM)")
            except Exception as e:
                total_fail += 1
                print(f"  ❌ 문제{qid} 실패 — {e}")

        if modified:
            save_question_bank(js_path, bank)

    print(f"\n[작업 종료] 중등부 완료: {total_done}건 | 고등부 건너뜀: {total_skipped}건 | 실패: {total_fail}건")

if __name__ == "__main__":
    run_solution_generator()