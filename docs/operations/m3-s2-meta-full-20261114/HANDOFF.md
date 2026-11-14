# 중3 2학기 메타 전체 검토 — 최종 인계

**상태: REVIEW_COMPLETE_RELEASE_PENDING / RESUME_READY.** 기존 74시험지·1,749문항을 재사용하고 이번 잔여 9시험지·209문항을 완료했다. 전체 **83/83시험지, 1,958/1,958문항**, 미검토 0이다. 작성자 외 source-first 표본은 기존222+신규27=**249문항**이다. 전체 품질 PASS나 운영 출고 완료를 선언하지 않는다.

## 정확한 재개 위치

- workKey: `M3-S2-META-FULL`
- taskId: `1bd79c4f-817a-4748-9cff-4d17a9758c33`
- root owner: `GPT_ROOT_00FBAC4C0777`
- 저장소/브랜치: `icefoxtail/AP------` / `review/m3-s2-meta-full-20261114`
- 재개 당시 원격 HEAD: `7a9320064c2daf1eae602fefcf0796e2d1d2226c`
- 9시험지 소스·기본 증거 원격 HEAD: `5aaec4b716f26d61b95d7f8b2916d777caebd79d`
- 마지막 비교 main: `9e8e635f6bfefb11287da7a7f499206013ae5e7e`. 대상9소스·의미 판정 정본·registry/master/crosswalk·공식검증기 차이 0. 다른 main 작업으로 runtime bridge receipt의 catalogIndexVersion 두 곳만 달라졌다. resolver 정본 참조 전체는 동일하며 출고 시 최신 consumer 검증 대상이다.
- 진행표: [progress.json](progress.json), 집계: [completion-summary.json](completion-summary.json), 출고 대기 목록: [release-queue.json](release-queue.json).
- 최종 마감 커밋 SHA는 push 후 Notion 재개 인덱스와 AWCR에 외부 기록한다. 자기 커밋 SHA를 파일 내부에 요구하지 않는다.

현재 root와 A/B/C는 이 마감 판본을 원격 저장한 후 쓰기를 종료한다. 다음 담당은 **Codex 운영 등록 담당**이며, AWCR 인계 수락은 아직 하지 않았다. 다른 학기나 다른 task로 자동 합류하지 않는다.

## 이번 완료 범위

| ID | 시험지 | 문항 | 메타 필드 수정 | 시험지 원격 커밋 |
| --- | --- | ---: | ---: | --- |
| E064 | 20 이수중 2학기 기말 중3 기출 | 22 | 145 | `46145196e7ee` |
| E065 | 20 신흥중 2학기 중간 중3 수학 | 24 | 148 | `731a0abac9ff` |
| E066 | 20 연향중 2학기 중간 중3 수학 | 21 | 195 | `d4798d43cc7f` |
| E067 | 20 이수중 2학기 중간 중3 수학 | 22 | 84 | `535fc1999dd0` |
| E079 | 17 팔마중 2학기 기말 중3 수학 | 24 | 391 | `198662dea960` |
| E080 | 16 신흥중 2학기 기말 중3 수학 | 23 | 380 | `933f5e4a8b83` |
| E081 | 16 왕의중 2학기 기말 중3 수학 | 24 | 398 | `4127cd0a84b4` |
| E082 | 15 신흥중 2학기 기말 중3 수학 | 24 | 389 | `439a292143a6` |
| E083 | 15 왕의중 2학기 기말 중3 수학 | 25 | 408 | `5aaec4b716f2` |

총209문항의 2,538개 메타 필드를 수정했다. 작성자의 최초 난도 bucket에서 root 최종 판단으로23문항을 조정했고, 기존 비어 있지 않은 `level` 값은 전부 보존했다. 최종 bucket 분포는 1단계38, 2단계100, 3단계67, 4단계2, UNKNOWN2다. UNKNOWN은 출고 전 선결 문제를 남긴 값이며 임의 숫자로 채우지 않았다.

## 검증 결과와 한계

- 9개 JS의 문법·UID·순서·문항 수·원문·보기·정답·해설·그림 경로를 검사했다. 허용17개 메타 필드 외의 원시 속성 바이트와 VM 값 보존 검사에 오류0. 독립 C의 209문항·3,670개 비메타 속성 비교도 차이0이다. 파생 배열을 포함한4,866개 비교 및9개 글로벌 연결도 보존했다.
- 참조 이미지327개를 읽고 SHA로 결속했다. asset 자체 수정0. 별도 crop 문제2문항은 아래 큐에 남겼다.
- 4칸209문항, 원문/해설 직접 인용1,499개를 검사했고 fail0, warn39다. 경고 원인은 각 작성자·통합 증거에 보존했다. 이 수치는 태그 구조 검증이며 수학 전체 출고 PASS가 아니다.
- 신규3표본×9시험지=27개를 실제 source-first 동결 후 작성안과 비교했다. 난도 경계·불일치는 추가 독립 검토 및 root 판정 근거를 붙였다. 새로운 R1/R2/R3 수학 인증을 주장하지 않는다.
- 공식 resolver·난도·최종화 결과의 정본은 [유효 집계](closeout/ALL9.official-validation.effective-summary.json)다. 기존403경로의 compact/영수증은 동결하고, E065 Q5/2022의 새1경로만 별도 검증했다. 209문항×2과정=418개 가능한 경로 중 **실행404, 미실행14**다. 미실행14는 소스 선결5문항×2과정10개와2022 정확leaf부재4개다.
- 원래403경로의 공식 resolver·난도는 모두 PASS였으며 최종화는358 PASS/45 FAIL/15 NOT_RUN이었다. 추가 경로까지 합친 최종화는 **359 PASS/45 FAIL/14 NOT_RUN**이며 resolver·난도는 각각404 PASS다. 기존45 FAIL은 **목표에 맞는 TPL 부재39경로 + 실제 후보노출을 인정한 관계 provenance6경로**다. 후자는 CURRENT 사용자우선 규정과 기존 검증기의 비노출 필드 조건 불일치다. 실제 노출을 false로 바꾸거나 맞지 않는 TPL을 넣어 PASS로 만들지 않았다.
- 현재 source의 PT/TPL 필수값 미완결은84문항이다. 이들은 미검토 문항이 아니라 명시된 등록 대기다. native template gap43은43문항이며43종 신설 뜻이 아니다. 적합한 기존 template의 공식 binding 확장으로 해결할 수 있는 경우도 있다.

## 이번에 새로 확인한 소스 선결 문제5문항

| 시험지·문항 | 문제 | 다음 처리 |
| --- | --- | --- |
| E064 이수중2020기말21 | 중심각의 기존 해설 근거 오류 | 해설 수리·독립 검증 후 resolver 재실행 |
| E067 이수중2020중간11 | 90°를 포함한 정의역과 tan 진술의 충돌 | 원본 대조·문항 조건 확정 후 난도 UNKNOWN 재판정 |
| E079 팔마중2017기말18 | 현의 곱을 쓰기 전 AA 닮음 유도 누락 | 학생용 해설에 유도 작성·검증 후 M2 정확 leaf 경로 실행 |
| E079 팔마중2017기말19 | 할선의 곱을 쓰기 전 AA 닮음 유도 누락 | 같은 조건으로 해설 보완·검증 |
| E079 팔마중2017기말22 | 주어진 도형 수치가 함께 성립하지 않음 | 원본 시험지 대조 후 문항·해설·난도 UNKNOWN 재검토 |

위5개는 **이번 잔여209문항에서 발견한 신규 항목**이다. 앞선74시험지에 이미 있던 소스·교육과정 선결 문제를 모두 합쳐5개라는 뜻은 아니다. 원문을 임의 수정하지 않았다.

전체 난도 보류12문항은 기존10(E055 21·22·23, E059 13, E070 3·8·19·23, E074 17·23)+신규2(E067 11, E079 22)다. E055의3문항은 선택형 대안들의 단일 UID 난도 집계 규칙이 필요하고, 나머지 기존7문항은 원문/중등 범위 풀이 선결 문제다. 각 UID·이유·원본 근거는 release-queue에 있다.

## 의미·등록 관련 별도 후속

E065 Q5는 현재2022 M3-RPM-135(y=ax²)에 정확히 해당한다. 2015/2022 경로 이름 불일치를 leaf 부재로 취급했던 당시 기록을 **추가 증거 판본**으로 바로잡았다. source의2015 메타는 바꾸지 않았다. Q1·4·11·16은 현재2022 leaf 부재를 유지한다.

E082 Q19·21은 실제 결정적 풀이에 각각 M2 피타고라스/외심 의미를 사용하되 **대상 과정은 중3, target unit은 M3-06**으로 보존했다. 미등록된 원-원 접함 target subunit·보조 CC는 등록 대기다. E082 Q19의 독립 검토 이견도 보존했다. Q11·17의 원본 PNG crop은 전체 발문/해설 SVG를 읽어 메타를 판단했으며, asset 복구는 별도 후속이다.

## 재현과 증거 우선순위

[PACKAGE_NOTES.md](closeout/PACKAGE_NOTES.md)의 판본 우선순위와 [evidence-relocations.json](closeout/evidence-relocations.json)을 먼저 읽는다. E066 Q3의 오래된 설명에서 학습수준 하라는 말과 실제 보존값 중의 차이도 명시했다. 원본 증거 SHA를 깨지 않도록 동결 파일은 수정하지 않았다. [evidence-relocations-applied.json](closeout/evidence-relocations-applied.json)이 경로 이동 적용 완료 판정이다. 제안서의 COPY_PENDING은 과거 상태다.

```bash
node docs/operations/m3-s2-meta-full-20261114/closeout/replay_compact_official_validation.mjs --repo-root . --report-dir docs/operations/m3-s2-meta-full-20261114/closeout --out /tmp/m3-s2-frozen-replay.json
```

위 명령은 이미 원격 저장된403경로의 결과와 영수증을 재현한다. 예상된 FAIL/HOLD를 똑같이 재현한 것은 증거 재현 PASS이며 메타 최종화 PASS가 아니다. E065 추가경로 재현 명령은 `replay_current2022_supplement.mjs`의 사용법 및 supplemental 검증 파일을 따른다. 새 판본 작업 시 관련 시험지만 재검증하고 완료된83시험지를 처음부터 반복하지 않는다.

## Codex 다음 행동

1. 정확한 task/branch와 최신 원격 HEAD·AWCR 체크포인트를 확인하고 OFFERED 인계를 수락한다. `progress.json`의 미검토0과 등록 대기를 구분한다.
2. 소스 선결·난도 보류·leaf/target parent·template/binding 큐에서 필요한 항목만 해결한다. 기존74시험지의 나머지 등록 debt는 해당 frozen meta/proposals도 함께 읽는다.
3. 실제 candidate 노출을 보존하면서 CURRENT 규정에 맞는 검증기 처리 또는 명시적 호환 판정을 적용한다.
4. 승인된 등록과 필요한 consumer 검증 후 해당 출고 절차에 따라 main 병합을 처리한다. 이번 작업에서는 공용 registry/master/crosswalk/compiledDB/runtime, main, 배포를 바꾸지 않았다.
