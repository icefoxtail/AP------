import os
import io
import json
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv
from PIL import Image

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ── 경로 설정 ──────────────────────────────────────────────
IMAGE_DIR = r"C:\Users\USER\Desktop\APMATH\AP\data\images"
EXAMS_DIR = r"C:\Users\USER\Desktop\APMATH\AP\exams"

GRADE_MAP = {
    "중1": "중1", "중2": "중2", "중3": "중3",
    "고1": "고1", "고2": "고2", "고3": "고3",
}


# ── JSON 추출 ──────────────────────────────────────────────
def extract_json_array(raw_text: str):
    if not raw_text or not raw_text.strip():
        raise ValueError("모델 응답이 비어 있음")

    text = raw_text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    start = text.find("[")
    if start == -1:
        raise ValueError("응답에서 JSON Array를 찾지 못함")

    chunk = text[start:]
    try:
        return json.loads(chunk)
    except json.JSONDecodeError:
        pass

    # 역슬래시 이중화 전처리 (LaTeX \frac, \sqrt 등 대응)
    chunk_fixed = re.sub(r'(?<!\\)\\(?![\\"/bfnrtu])', r'\\\\', chunk)
    try:
        return json.loads(chunk_fixed)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON 파싱 실패: {e}")


# ── 유효성 검사 ────────────────────────────────────────────
def validate_output(data):
    if not isinstance(data, list):
        raise ValueError("출력 형식이 JSON Array가 아님")
    if len(data) != 2:
        raise ValueError(f"문항 수가 2개가 아님: {len(data)}개")

    required_keys = {
        "id", "content", "choices", "answer",
        "category", "originalCategory",
        "standardCourse", "standardUnitKey",
        "standardUnit", "standardUnitOrder", "solution",
    }

    for i, item in enumerate(data, start=1):
        if not isinstance(item, dict):
            raise ValueError(f"{i}번째 항목이 객체가 아님")

        missing = required_keys - set(item.keys())
        if missing:
            raise ValueError(f"{i}번째 항목 누락 키: {sorted(missing)}")

        choices = item["choices"]
        if not isinstance(choices, list):
            raise ValueError(f"{i}번째 항목 choices가 배열이 아님")

        if len(choices) == 0:
            pass  # 주관식
        elif len(choices) == 5:
            for choice in choices:
                if re.match(r"^\s*[①-⑤]\s*", str(choice)):
                    raise ValueError(f"{i}번째 항목 choices에 번호 기호 포함됨: {choice}")
        else:
            raise ValueError(f"{i}번째 항목 choices가 0개(주관식) 또는 5개(객관식)여야 함: {len(choices)}개")


# ── 학년 폴더 결정 ─────────────────────────────────────────
def resolve_grade_folder(data: list) -> str:
    course = data[0].get("standardCourse", "")
    for key, folder in GRADE_MAP.items():
        if key in course:
            return folder
    return "etc"


# ── window.questionBank JS 파일 저장 ──────────────────────
def save_as_question_bank(data: list, image_path: str):
    grade_folder = resolve_grade_folder(data)
    target_dir = os.path.join(EXAMS_DIR, grade_folder)
    os.makedirs(target_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(image_path))[0]
    js_path = os.path.join(target_dir, base_name + ".js")

    js_content = f"window.questionBank = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    return js_path


# ── 중복 체크: exams/ 전체에서 동일 파일명 탐색 ────────────
def find_existing_js(base_name: str) -> str | None:
    """exams/ 하위 모든 폴더에서 base_name.js 가 있으면 경로 반환, 없으면 None."""
    js_filename = base_name + ".js"
    for root, dirs, files in os.walk(EXAMS_DIR):
        if js_filename in files:
            return os.path.join(root, js_filename)
    return None


# ── 메인 실행 ──────────────────────────────────────────────
def run_generator_prototype(image_path: str):
    base_name = os.path.splitext(os.path.basename(image_path))[0]

    # ★ 중복 체크 — 이미 있으면 건너뜀
    existing = find_existing_js(base_name)
    if existing:
        print(f"[건너뜀] 이미 존재 → {existing}")
        return

    try:
        img = Image.open(image_path)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        image_part = types.Part.from_bytes(data=buf.getvalue(), mime_type="image/png")

        prompt = """
당신은 수학 교육 전문가입니다. 이 이미지에서 첫 번째 문제를 추출하고, 동일한 논리 구조를 가진 '유사 문항' 1개를 추가로 생성하여 아래의 JSON 배열(Array) 형식으로 응답하십시오.
반드시 시스템 엔진이 파싱할 수 있는 정확한 JSON Array '[ { ... }, { ... } ]' 형태로만 출력해야 하며 다른 사설은 절대 금지합니다.
문항 내 줄바꿈은 반드시 '\\n' 기호를 사용하십시오.

※ 문항 유형 판단 기준:
- 객관식(5지선다): choices 배열에 선택지 5개를 순수 텍스트로 기재. 번호 기호(①②③④⑤) 절대 포함 금지.
- 주관식(단답형/서술형): choices는 반드시 빈 배열 []로 기재. answer에 정답만 기재.

[출력 양식]
[
    {
        "id": "1",
        "content": "원본 문제 텍스트 (수식은 $기호로 감싸기)",
        "choices": ["1번 선택지", "2번 선택지", "3번 선택지", "4번 선택지", "5번 선택지"],
        "answer": "정답 (객관식: ③ / 주관식: 숫자 또는 식)",
        "category": "추론된 단원명",
        "originalCategory": "추론된 단원명",
        "standardCourse": "중3 수학",
        "standardUnitKey": "M3-01",
        "standardUnit": "제곱근과 실수",
        "standardUnitOrder": 1,
        "solution": "* 풀이 1단계\\n* 풀이 2단계\\n* 정답: ③"
    },
    {
        "id": "1-유사",
        "content": "변형된 유사 문항 텍스트",
        "choices": [],
        "answer": "정답",
        "category": "원본과 동일",
        "originalCategory": "원본과 동일",
        "standardCourse": "원본과 동일",
        "standardUnitKey": "원본과 동일",
        "standardUnit": "원본과 동일",
        "standardUnitOrder": 1,
        "solution": "* 풀이 1단계\\n* 풀이 2단계\\n* 정답: (위 answer 필드와 동일한 값)"
    }
]
        """.strip()

        print(f"[시작] {os.path.basename(image_path)}")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, image_part],
        )

        raw_text = response.text or ""
        data = extract_json_array(raw_text)
        validate_output(data)

        js_path = save_as_question_bank(data, image_path)

        q_type = "주관식" if len(data[0]["choices"]) == 0 else "객관식"
        print(f"[완료] {js_path}")
        print(f"       학년: {resolve_grade_folder(data)} / 유형: {q_type}")

    except Exception as e:
        print(f"[실패] {os.path.basename(image_path)} — {e}")


# ── 엔트리포인트 ───────────────────────────────────────────
if __name__ == "__main__":
    if not os.path.exists(IMAGE_DIR):
        print(f"오류: 이미지 경로가 존재하지 않습니다 -> {IMAGE_DIR}")
    else:
        png_files = sorted((f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(".png") and "문제지" in f), reverse=True)
        if not png_files:
            print(f"오류: {IMAGE_DIR} 내 PNG 파일 없음")
        else:
            print(f"총 {len(png_files)}개 PNG 발견\n")
            for filename in png_files:
                run_generator_prototype(os.path.join(IMAGE_DIR, filename))