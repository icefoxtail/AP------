import os
import io
import json
import re
import time
from google import genai
from google.genai import types
from dotenv import load_dotenv
from PIL import Image

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
Image.MAX_IMAGE_PIXELS = None  # 압축폭탄 경고 제거

# ── 경로 설정 ──────────────────────────────────────────────
IMAGE_DIR = r"C:\Users\USER\Desktop\APMATH\AP\data\images"
EXAMS_DIR = r"C:\Users\USER\Desktop\APMATH\AP\exams"

GRADE_MAP = {
    "중1": "중1", "중2": "중2", "중3": "중3",
    "공통수학1": "고1", "공통수학2": "고1",
    "대수": "고2", "미적분I": "고2", "확률과 통계": "고2",
    "기하": "고3",
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
    if len(data) == 0:
        raise ValueError("추출된 문항이 없음")

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
    js_filename = base_name + ".js"
    for root, dirs, files in os.walk(EXAMS_DIR):
        if js_filename in files:
            return os.path.join(root, js_filename)
    return None


# ── Gemini 호출 (429/503 자동 재시도) ─────────────────────
def call_gemini_with_retry(prompt: str, image_part, max_retries: int = 5):
    wait = 10  # 초기 대기 시간(초)
    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=[prompt, image_part],
                config=types.GenerateContentConfig(tools=[]),  # 검색 기능 차단
            )
            return response
        except Exception as e:
            err = str(e)
            if "429" in err or "503" in err:
                if attempt == max_retries:
                    raise
                print(f"  [재시도 {attempt}/{max_retries}] {wait}초 대기 중...")
                time.sleep(wait)
                wait *= 2  # 지수 백오프
            else:
                raise


# ── 메인 실행 ──────────────────────────────────────────────
def run_generator_prototype(image_path: str):
    base_name = os.path.splitext(os.path.basename(image_path))[0]

    # 중복 체크 — 이미 있으면 건너뜀
    existing = find_existing_js(base_name)
    if existing:
        print(f"[건너뜀] 이미 존재 → {existing}")
        return

    try:
        img = Image.open(image_path)
        img.thumbnail((2000, 2000))  # 토큰 절약용 리사이즈
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        image_part = types.Part.from_bytes(data=buf.getvalue(), mime_type="image/png")

        prompt = """
당신은 수학 교육 전문가입니다. 이 이미지에 있는 모든 문제를 빠짐없이 추출하여 아래의 JSON 배열(Array) 형식으로 응답하십시오.
반드시 시스템 엔진이 파싱할 수 있는 정확한 JSON Array '[ { ... }, { ... }, ... ]' 형태로만 출력해야 하며 다른 사설은 절대 금지합니다.
문항 내 줄바꿈은 반드시 '\\n' 기호를 사용하십시오.
LaTeX 수식의 역슬래시는 반드시 이중 역슬래시(\\\\)로 출력하십시오. 예: \\\\frac, \\\\sqrt

※ 문항 유형 판단 기준:
- 객관식(5지선다): choices 배열에 선택지 5개를 순수 텍스트로 기재. 번호 기호(①②③④⑤) 절대 포함 금지.
- 주관식(단답형/서술형): choices는 반드시 빈 배열 []로 기재. answer에 정답만 기재.

[표준단원키 테이블 - 반드시 아래 목록에서만 선택]
중학교
M1-01 소인수분해 | M1-02 정수와 유리수 | M1-03 문자와 식 | M1-04 좌표평면과 그래프
M1-05 기본도형 | M1-06 평면도형의 성질 | M1-07 입체도형의 성질 | M1-08 자료의 정리와 해석
M2-01 유리수와 순환소수 | M2-02 식의 계산 | M2-03 일차부등식 | M2-04 연립일차방정식
M2-05 일차함수 | M2-06 삼각형의 성질 | M2-07 사각형의 성질 | M2-08 도형의 닮음
M2-09 피타고라스 정리 | M2-10 경우의 수와 확률
M3-01 제곱근과 실수 | M3-02 다항식의 곱셈 | M3-03 인수분해 | M3-04 이차방정식
M3-05 이차함수 | M3-06 삼각비 | M3-07 원의 성질 | M3-08 통계

고등학교 2022 개정
공통수학1: H22-C-01 다항식의 연산 | H22-C-02 나머지 정리 | H22-C-03 인수분해 | H22-C-04 복소수
H22-C-05 이차방정식 | H22-C-06 이차함수 | H22-C-07 여러 가지 방정식 | H22-C-08 여러 가지 부등식
H22-C-09 경우의 수 | H22-C-10 행렬
공통수학2: H22-C2-01 평면좌표 | H22-C2-02 직선의 방정식 | H22-C2-03 원의 방정식
H22-C2-04 도형의 이동 | H22-C2-05 집합 | H22-C2-06 명제 | H22-C2-07 함수 | H22-C2-08 유리함수 | H22-C2-09 무리함수
대수: H22-A-01 지수와 로그 | H22-A-02 지수함수 | H22-A-03 로그함수
H22-A-04 삼각함수 | H22-A-05 사인법칙과 코사인법칙
H22-A-06 등차수열 | H22-A-07 등비수열 | H22-A-08 수열의 합 | H22-A-09 수학적 귀납법
미적분I: H22-M-01 함수의 극한 | H22-M-02 함수의 연속 | H22-M-03 미분계수와 도함수
H22-M-04 도함수의 활용(1) | H22-M-05 도함수의 활용(2) | H22-M-06 도함수의 활용(3)
H22-M-07 부정적분 | H22-M-08 정적분 | H22-M-09 정적분의 활용
확률과 통계: H22-PS-01 순열 | H22-PS-02 조합 | H22-PS-03 확률의 뜻과 활용
H22-PS-04 조건부확률 | H22-PS-05 확률분포 | H22-PS-06 통계적 추정
기하: H22-GE-01 이차곡선 | H22-GE-02 이차곡선의 접선 | H22-GE-03 공간도형
H22-GE-04 공간좌표 | H22-GE-05 벡터의 연산 | H22-GE-06 벡터의 성분
H22-GE-07 벡터의 내적 | H22-GE-08 도형의 방정식

[매핑 규칙]
- 고등학교 문항은 원본 시험 연도와 무관하게 2022 개정 기준으로 변환한다.
- 이차함수 관련 문항은 H22-C-06으로 우선 매핑한다.
- 유리함수 → H22-C2-08, 무리함수 → H22-C2-09
- 위 목록에 없는 단원은 RAW-단원명 형식으로 기입하고 standardUnitOrder는 999로 한다.

[출력 양식]
[
    {
        "id": "1",
        "content": "문제 텍스트 (수식은 $...$로 감싸기, 역슬래시는 \\\\로)",
        "choices": ["1번 선택지", "2번 선택지", "3번 선택지", "4번 선택지", "5번 선택지"],
        "answer": "정답 (객관식: ③ / 주관식: 숫자 또는 식)",
        "category": "추론된 단원명",
        "originalCategory": "추론된 단원명",
        "standardCourse": "중3 수학",
        "standardUnitKey": "M3-01",
        "standardUnit": "제곱근과 실수",
        "standardUnitOrder": 1,
        "solution": ""
    },
    {
        "id": "2",
        "content": "두 번째 문제 텍스트",
        "choices": [],
        "answer": "정답",
        "category": "추론된 단원명",
        "originalCategory": "추론된 단원명",
        "standardCourse": "중3 수학",
        "standardUnitKey": "M3-02",
        "standardUnit": "단원명",
        "standardUnitOrder": 2,
        "solution": ""
    }
]
※ solution 필드는 반드시 빈 문자열 ""로만 출력한다. 풀이를 작성하지 않는다.
※ 도형/그래프/표가 포함된 문제는 content 맨 앞에 아래 마커를 추가한다.
- 도형 또는 그래프가 있으면: [도형필요]
- 표가 있으면: [표필요]
- 둘 다 있으면: [도형필요][표필요]
        """.strip()

        print(f"[시작] {os.path.basename(image_path)}")

        response = call_gemini_with_retry(prompt, image_part)

        raw_text = response.text or ""
        data = extract_json_array(raw_text)
        validate_output(data)

        js_path = save_as_question_bank(data, image_path)

        print(f"[완료] {js_path}")
        print(f"       학년: {resolve_grade_folder(data)} / 문항 수: {len(data)}개")

    except Exception as e:
        print(f"[실패] {os.path.basename(image_path)} — {e}")


# ── 엔트리포인트 ───────────────────────────────────────────
if __name__ == "__main__":
    if not os.path.exists(IMAGE_DIR):
        print(f"오류: 이미지 경로가 존재하지 않습니다 -> {IMAGE_DIR}")
    else:
        png_files = sorted(
            (f for f in os.listdir(IMAGE_DIR) if f.lower().endswith(".png") and "문제지" in f),
            reverse=True
        )
        if not png_files:
            print(f"오류: {IMAGE_DIR} 내 PNG 파일 없음")
        else:
            print(f"총 {len(png_files)}개 PNG 발견\n")
            for filename in png_files:
                run_generator_prototype(os.path.join(IMAGE_DIR, filename))