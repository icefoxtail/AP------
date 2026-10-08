# 효천고 ALIVE LITE 학교 마커·모의고사 파일럿

- 상태: **isolated pilot only**, main/Archive2 운영 코드·원본 변경 없음.
- 실제 원본: `archive/exams/original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js`, 26문항
- 실제 생성 후보: 22 UID, 원본 슬롯 5개(q1=4, q3=4, q5=9, q19=4, q23=1), RPM canonical L3는 6그룹.
- 생성 문항의 학생용 발문/보기만 `school-marker-read-model.json`에 포함. 정답·해설은 학생용 모델에서 배제.
- 엄격한 기본 상태: `AUTHOR_CANDIDATE`, 실학생에게는 공급할 수 없음. 개별 문항 독립 수학검수/교육과정/실렌더/공급 권한/대체슬롯 적격성이 모두 PASS하고 슬롯 L3·난이도·형식이 결속될 때만 교체.
- 현재 모의고사 preview는 **ORIGINAL 26 / GENERATED 0**이 맞음. 후보 수 22와 실제 적격 0을 혼동하지 말 것.
- 실사용 Archive2 catalog, `question_metadata.json`, 랜더러·Teacher UI·학생기록/오답 DB는 미연결.
- 다른 학교와 같은 정본 L3 검색은 지원할 수 있는 데이터 모델, 실제 다른 학교 간의 승인된 링크/문항 공급은 미구현. 검증 기록의 학교 간 테스트는 승인된 합성 fixture에 한정.
- seeded `paperRevision`은 파일럿의 재현 가능 식별자이며 암호학적 봉인 해시가 아니다. 정식 출판 시 내용 SHA-256/서버 revision 동결이 필요.

## 실행

```bash
node archive/tools/generated-lite/run-hyocheon-mock-pilot.mjs --seed demo-A --mode SCHOOL_BALANCED --fallback KEEP_ORIGINAL
node archive/tools/generated-lite/run-hyocheon-mock-pilot.mjs --seed demo-B --mode L3_EXPANDED --fallback UNFILLED_REPORT
node --test archive/tools/generated-lite/tests/school-marker-core.test.mjs
```

런타임에 실제 브라우저/Archive2 출력 경로를 수정하지 않는다. 위 Node 테스트 커맨드는 저장했지만 이번 GPT 환경에서 `node --test` 실행 완료를 확인한 것은 아니다. 실제 저장된 모듈과 read-model을 V8에서 직접 실행하여 18/18 계약 검사를 통과했고 그 결과는 `archive/data/generated-lite/hyocheon-2026-1mid-school-marker-contract-tests.json`에 기록했다.

## 다음 릴리즈 전 작업
1. 개별 후보 22개에 대한 독립 수학·교육과정·실제 Chrome 렌더 검수.
2. 원본 슬롯 qid별 L3/목표 난이도 current-pass 분류 및 `replacementEligibility` 승인 검토.
3. Archive2 실제 사용자 검색/클릭, seeded A/B/C 조합·저장·재열기, 정답 비공개/권한/런타임 회귀 검사.
4. 실제 타교 L3 공유 후보를 연결하고 학년/학기/모의고사 슬롯 gate 실검증.
