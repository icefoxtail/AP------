# ARCHIVE_REMAINING_FAILS

## 0. 요약

- 남은 FAIL 수: 3
- window.examTitle 없음: 1건
- 이미지 파일 없음: 1건
- schema.sql 없음: 1건
- 실제 수정 필요: 2건
- audit 기준 보정 필요: 1건
- 확인 필요: 0건

## 1. window.examTitle 없음

| 항목 | 내용 |
|---|---|
| 대상 파일 | `archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js` |
| 현재 표기 | `Window.examTitle = "25_순천고_1학기_기말_고1_기출";` |
| window.questionBank 존재 | 있음 (`window.questionBank = [`) |
| 판단 | 대소문자 오타 가능성. `window.examTitle`는 없고 `Window.examTitle`만 있음 |
| 다음 조치 후보 | `Window.examTitle`를 `window.examTitle`로 최소 수정 검토 |

### 파일 상단 10줄

```text
Window.examTitle = "25_순천고_1학기_기말_고1_기출";

window.questionBank = [
  {
    id: 1,
    level: "하",
    category: "여러 가지 부등식",
    originalCategory: "여러 가지 방정식과 부등식",
    standardCourse: "공통수학 1",
    standardUnitKey: "H22-C-06",
```

## 2. 이미지 파일 없음

| 항목 | 내용 |
|---|---|
| 대상 JS 파일 | `archive/exams/original/high/h1/1final/25_제일고_1학기_기말_고1_기출.js` |
| 문항 id | `15` |
| 경로 출처 | `image` 필드 |
| 현재 이미지 경로 | `assets/images/25_제일고_1학기_기말_고1_기출/q15.png` |
| 실제 존재 여부 | 없음 |
| 유사 파일 후보 | `archive/assets/images/25_순천고_1학기_기말_고1_기출/q15.png`, `archive/assets/images/25_제일고_1학기_기말_고1_기출/q17.png` |
| 판단 | 폴더명 차이 또는 실제 이미지 누락 가능성. 확장자 차이 후보는 이번 검색에서 없음 |
| 다음 조치 후보 | `q15.png`의 실제 소속 시험지 폴더 확인 후 경로 수정 또는 자산 복구 검토 |

## 3. schema.sql 없음

| 항목 | 내용 |
|---|---|
| audit가 찾은 경로 | 루트 `schema.sql` |
| 루트 schema.sql 존재 | 없음 |
| apmath/worker-backup/worker/schema.sql 존재 | 있음 |
| worker/schema.sql 존재 | 없음 |
| 판단 | audit가 루트 `schema.sql`을 기준으로 점검해서 발생한 경로 기준 FAIL. 프로젝트에는 worker용 schema 파일이 존재함 |
| 다음 조치 후보 | 루트 `schema.sql`이 정말 필수인지 확인하고, 아니라면 audit 기준 경로를 운영 기준 경로와 맞추는 보정 검토 |

## 4. 다음 단계 제안

1. `archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js`의 `Window.examTitle` 대소문자 표기를 최소 수정 대상으로 분리한다.
2. `25_제일고_1학기_기말_고1_기출`의 문항 15 이미지가 실제 누락인지, `25_순천고_1학기_기말_고1_기출/q15.png` 재사용 대상인지 확인한다.
3. `schema.sql` FAIL은 운영 기준 파일 위치 재정의가 필요한지 검토하고, 루트 파일 요구가 불필요하면 audit 기준만 조정한다.
