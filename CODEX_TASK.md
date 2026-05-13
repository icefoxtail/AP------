[Codex 지시서 — report.js 평가 리포트 2차 안정화: 학부모 표현 보정 + 아카이브 404 방어]

작업 위치:
C:\Users\USER\Desktop\AP------

수정 대상 파일:
apmath/js/report.js

수정 금지 파일:
- worker/index.js
- worker/schema.sql
- apmath/js/core.js
- apmath/js/dashboard.js
- apmath/js/classroom.js
- apmath/index.html
- 기타 report.js 외 모든 파일

절대 원칙:
- report.js 외 파일 수정 금지
- DB/API/Worker/R2 구조 변경 금지
- 기존 프리미엄 리포트 디자인 전체 갈아엎기 금지
- Clean PDF 자연 흐름형 구조 유지
- MathJax 출력 구조 유지
- reportCenterBuildQuestionStats() 수정 금지
- reportCenterGetSameExamSessions() 수정 금지
- reportCenterGetClassExamSessions() 수정 금지
- reportCenterBuildPremiumQuestionRows() 수정 금지
- reportCenterPrintCleanPdf()의 MathJax 기반 print 흐름 수정 금지
- stable 함수 대량 리팩터링 금지
- 이번 요청 외 기능 추가 금지

목표:
평가 리포트에서 학부모에게 오해를 줄 수 있는 “잘한 점” 표현을 제거하고,
아카이브 파일 404가 콘솔에 에러처럼 크게 남거나 리포트 흐름을 깨지 않도록 방어한다.

────────────────────────────────
수정 1 — “잘한 점” 카드 제거 및 중립 표현으로 변경
────────────────────────────────

문제:
현재 PDF/크게보기 리포트에서 학생 점수가 전체 평균/반 평균보다 낮아도 “잘한 점” 섹션에 성적 요약이 들어간다.
예:
- 학생 83점
- 전체 평균 84점
- 반 평균 92점
인데 “잘한 점”에 성적 요약이 들어가면 학부모 입장에서 신뢰도 문제가 생긴다.

수정 대상 함수:
reportCenterBuildCleanPdfDocument()

현재 구조에서 아래 섹션을 찾는다.

<section class="aprc-pdf-section aprc-pdf-point-grid">
    <article class="aprc-pdf-panel">
        <div class="aprc-section-title">잘한 점</div>
        ...
    </article>
    <article class="aprc-pdf-panel">
        <div class="aprc-section-title">확인할 점</div>
        ...
    </article>
</section>

수정 방향:
- “잘한 점” → “현재 위치”
- “확인할 점” → “우선 확인할 점”
- 첫 번째 카드 내용은 칭찬형이 아니라 현재 점수와 평균 비교를 반영한 중립형 문구로 출력
- 두 번째 카드는 기존 보완/확인 문구 유지하되 제목만 “우선 확인할 점”으로 변경

필수 구현:
reportCenterBuildCleanPdfDocument() 내부에서 coreItems 선언 이후 또는 point-grid 출력 전에 아래 성격의 중립 문구를 생성한다.

예시 함수명은 자유지만 report.js 내부에만 추가할 것:
reportCenterBuildCurrentPositionText(data, correctRate, wrongCount)

구현 기준:
- data.session.score
- data.stats.overallAvg
- data.stats.classAvg
- data.stats.className
- correctRate
- wrongCount
를 사용한다.

문구 기준:

1. 전체 평균과 반 평균이 모두 있고, 학생 점수가 둘 다 이상이면:
“OO 학생은 이번 평가에서 N점을 기록했습니다. 전체 평균과 소속 반 평균 이상을 기록해 현재 범위의 풀이 흐름이 안정적으로 유지되고 있습니다.”

2. 전체 평균 이상이지만 반 평균보다 낮으면:
“OO 학생은 이번 평가에서 N점을 기록했습니다. 전체 평균과는 비슷하거나 높은 수준이나, 소속 반 평균과 비교하면 추가 확인이 필요한 문항이 있어 풀이 흐름을 함께 점검하겠습니다.”

3. 전체 평균보다 낮으면:
“OO 학생은 이번 평가에서 N점을 기록했습니다. 전체 평균과 비교해 보완할 지점이 확인되어, 우선 확인 문항과 풀이 과정을 중심으로 다시 점검하겠습니다.”

4. 평균 자료가 부족하면:
“OO 학생은 이번 평가에서 N점을 기록했습니다. 이번 리포트에서는 점수뿐 아니라 문항별 정답률과 오답 흐름을 함께 보며 다음 수업 보완 방향을 정리했습니다.”

주의:
아래 표현은 평균 이상인 경우가 아니면 사용 금지:
- 잘했습니다
- 우수합니다
- 안정적입니다
- 좋은 흐름입니다
- 강점입니다
- 성취가 좋습니다

단, 점수가 전체 평균/반 평균 이상인 경우에는 “안정적” 정도만 허용.

수정 후 point-grid 구조는 반드시 아래처럼 되어야 한다.

<section class="aprc-pdf-section aprc-pdf-point-grid">
    <article class="aprc-pdf-panel">
        <div class="aprc-section-title">현재 위치</div>
        <p>...</p>
    </article>
    <article class="aprc-pdf-panel">
        <div class="aprc-section-title">우선 확인할 점</div>
        <p>...</p>
    </article>
</section>

기존 “잘한 점” 문자열은 report.js 안에서 PDF 리포트 영역에 남기지 말 것.

────────────────────────────────
수정 2 — 아카이브 404 방어 및 콘솔 에러성 출력 완화
────────────────────────────────

문제:
크게보기 진입 시 콘솔에 아래와 같은 404가 뜬다.

Failed to load resource: the server responded with a status of 404
[reportCenterFetchArchiveQuestionDetails] failed: Error: HTTP 404

이 문제는 아카이브 파일 경로가 없는 경우에도 문항 원문 확인을 시도하면서 발생한다.
리포트 본문은 오답 번호/단원/정답률 기준으로 표시 가능하므로, 404를 치명 오류처럼 처리하면 안 된다.

수정 대상 함수:
reportCenterFetchArchiveQuestionDetails(session)

현재 catch 안에 아래 계열이 있으면:

console.warn('[reportCenterFetchArchiveQuestionDetails] failed:', e);

수정 방향:
- HTTP 404는 예상 가능한 “원문 미연결” 상태로 처리
- 404일 때는 console.warn 대신 console.info 또는 조용한 처리
- 사용자에게는 기존 메시지 “문항 원문 확인 불가 — 오답 번호/단원/정답률 기준 분석으로 표시합니다.” 유지
- 리포트 생성/출력 흐름 중단 금지

구현 예시:

catch (e) {
    const message = String(e?.message || '');
    const isNotFound = message.includes('HTTP 404');

    if (!isNotFound) {
        console.warn('[reportCenterFetchArchiveQuestionDetails] failed:', e);
    } else {
        console.info('[reportCenterFetchArchiveQuestionDetails] archive file not found; fallback to stats-only analysis.');
    }

    return reportCenterSetCachedArchiveDetails(session.id, {
        ok: false,
        status: isNotFound ? 'not-found' : 'fetch-failed',
        archiveInfo,
        message: '문항 원문 확인 불가 — 오답 번호/단원/정답률 기준 분석으로 표시합니다.',
        details: wrongRows.map(row => reportCenterNormalizeQuestionDetail(null, row.questionNo, row))
    });
}

주의:
- fetch 자체는 유지
- 아카이브 원문 확인 기능 삭제 금지
- reportCenterNormalizeArchiveFile() 대량 수정 금지
- 404 fallback에서도 details 배열은 반드시 유지
- 리포트 출력은 계속 가능해야 함

────────────────────────────────
추가 확인 — 상단 날짜/발행일 겹침 여부
────────────────────────────────

현재 크게보기 화면에서 상단 발행일/시험명 영역이 좁은 폭에서 겹칠 수 있다.
다만 이번 작업의 핵심은 문구 오류와 404 방어이므로, 큰 CSS 리디자인은 금지한다.

reportCenterPremiumReportStyle() 안에서 아래 정도의 최소 보정만 허용한다.

- .aprc-pdf-header 의 gap 유지 또는 확대
- .aprc-issued 에 min-width 부여 가능
- .aprc-title 이 발행일 영역과 겹치지 않도록 max-width 또는 flex 보정 가능
- 기존 프리미엄 디자인 유지

권장 보정:
.aprc-pdf-header > div:first-child { min-width:0; padding-right:8mm; }
.aprc-issued { flex-shrink:0; min-width:28mm; }

이 보정은 겹침이 실제 CSS상 발생할 수 있는 경우에만 적용한다.

────────────────────────────────
검증 명령
────────────────────────────────

작업 후 반드시 실행:

node --check apmath/js/report.js

검색 검증:

PowerShell 기준:

Select-String -Path apmath/js/report.js -Pattern "잘한 점"
Select-String -Path apmath/js/report.js -Pattern "현재 위치"
Select-String -Path apmath/js/report.js -Pattern "우선 확인할 점"
Select-String -Path apmath/js/report.js -Pattern "프리미엄 분석 반영"
Select-String -Path apmath/js/report.js -Pattern "프리미엄 분석 ·"
Select-String -Path apmath/js/report.js -Pattern "aprc-fixed-page"
Select-String -Path apmath/js/report.js -Pattern "width:210mm"
Select-String -Path apmath/js/report.js -Pattern "height:297mm"

정상 기준:
- “잘한 점”은 PDF 리포트 point-grid 영역에서 없어야 함
- “현재 위치” 있어야 함
- “우선 확인할 점” 있어야 함
- “프리미엄 분석 반영” 없어야 함
- “프리미엄 분석 ·” 없어야 함
- aprc-fixed-page 없어야 함
- width:210mm 없어야 함
- height:297mm 없어야 함

브라우저 수동 검수:
1. 평균보다 낮은 학생 리포트 생성
2. “잘한 점”이라는 제목이 없는지 확인
3. 첫 카드 제목이 “현재 위치”인지 확인
4. 현재 위치 문구가 칭찬형이 아니라 중립형/비교형인지 확인
5. 두 번째 카드 제목이 “우선 확인할 점”인지 확인
6. 아카이브 404가 있어도 리포트 화면이 깨지지 않는지 확인
7. 콘솔에서 404가 치명적인 warn/error처럼 반복 출력되지 않는지 확인
8. 인쇄하기 진입 시 PDF 화면이 깨끗하게 나오는지 확인

완료 보고:
작업 완료 후 프로젝트 루트에 CODEX_RESULT.md 파일을 생성/수정하고 아래만 적어라.

- 수정 파일 목록
- 구현 완료 항목
- node --check 결과
- 검색 검증 결과
- 수동 테스트 체크리스트
- 미구현/주의 항목

터미널에는 완료 보고를 길게 출력하지 말고 아래 한 줄만 출력하라.

CODEX_RESULT.md에 완료 보고를 저장했습니다.