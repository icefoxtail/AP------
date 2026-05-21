# APMS Patch Review Board 설계 메모

이 문서는 패치마다 무엇이 바뀌었고, 어떻게 검증했고, 다음에 무엇을 확인해야 하는지를 한 화면에서 관리하기 위한 검수 대시보드 아이디어다.

아직 구현 문서가 아니라 운영 설계 메모다.

---

## 1. 목적

패치 작업이 길어질수록 다음 정보가 흩어진다.

- 테스트를 어떻게 할 것인지
- 어디가 바뀌었는지
- 바뀐 뒤 결과가 어떤지
- 검수 PASS/FAIL 여부
- 커밋/푸시/배포 여부
- 브라우저 화면 확인 여부

이 정보를 한 화면에서 정리하면 Codex, ChatGPT, Gemini, Claude, 사람 검수 흐름을 추적하기 쉬워진다.

---

## 2. 1차 데이터 항목

패치 단위로 아래 항목을 저장한다.

- patch_id
- patch_name
- 작업 목적
- 수정 파일
- 생성 파일
- 주요 변경 함수
- CSS selector 변경
- node --check 결과
- 검수 zip 이름
- 검수 결과
- 발견 오류
- 재수정 여부
- 브라우저 확인 여부
- 화면 캡처 링크 또는 파일명
- 커밋 hash
- push 여부
- 배포 여부
- 다음 조치

---

## 3. 화면 구성 초안

### 3.1 패치 목록

```text
대시보드 카드 shell 복구        검수중
일지 상담 병합                 PASS
teacherName escape 보강        PASS
타이포그래피 통일 2차           CONDITIONAL PASS
```

### 3.2 패치 상세

```text
패치명: dashboard_card_shell_restore_patch
목표: 카드 shell 복구
수정 파일: dashboard.js, dashboard-foundation.css
검증: node --check 통과
브라우저 확인: 대기
커밋: 미진행
```

### 3.3 검수 체크리스트

- 코드 문법
- 기능 보존
- CSS selector 보존
- UI 화면 캡처
- 기존 문구 보존
- Git 상태
- 배포 여부

---

## 4. APMS 작업 흐름과 연결

기본 흐름:

1. 최신 소스 기준 확인
2. 패치 제작
3. 적용용 zip 생성
4. 검수용 zip 생성
5. 현미경 검수 요청서 생성
6. 검수 결과 기록
7. 브라우저 화면 확인
8. 커밋/푸시
9. 다음 작업 후보 기록

---

## 5. 구현 시 주의

- 이 대시보드는 운영 사용자용이 아니라 개발/검수자용이다.
- 원장/선생님 대시보드에 노출하지 않는다.
- APMS 운영 화면 기본 메뉴에 넣지 않는다.
- 필요하면 별도 dev-only HTML 또는 docs 기반 dashboard로 둔다.
- 운영 데이터와 섞지 않는다.
- GitHub/로컬 작업 기록을 기준으로 시작한다.

---

## 6. 향후 후보

- CODEX_RESULT.md 자동 파싱
- 검수 결과 markdown 자동 파싱
- patch zip 파일명 목록화
- 커밋 hash 매칭
- 브라우저 캡처 파일 매칭
- Gemini/Claude/ChatGPT 검수 결과 비교
