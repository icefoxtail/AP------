# M3 잔여 3 UID — 실제 recovery 이후 발급할 준비안

상태: `PREPARATION_ONLY_NOT_A_REGISTRATION_REQUEST`.

현재 production source와 inbox에는 아무것도 쓰지 않았다. 실제 recovery 영수증을 기다리는 동안 immutable 승인값, 현재 source 및 metadata before 관측값, 적용 가능한 metadata append만 대조했다. 이 폴더의 before와 candidate source blob은 실제 발급 시 다시 고정해야 한다.

## 고정한 관측점

- 실제 main: `aa3789e87da68ccd649d950946e8b06aca5d9754`.
- root new12 로컬 입력 비교점: `c999ffcb1939261ed90b27e075d529d2fd52cb46`.
- 원 native: `c17c09a24eb356e4eaf17e4f5bc43c9844cf7427`.
- E001 Q8/Q19 독립 확정: `9e50297143a0a30a0a1daf5e1b5f4c919a025371`.
- E017 Q23 TPL 확정: `156e71e9916ba7d71fa2f071d30669b056a3c8f4`.

## 준비 범위

| 대상 | 새 source 필드 | 기존 승인 보존 선행 | 정의 선행 |
|---|---|---|---|
| E001 Q8 | `conditionKeys`에 명시 확정된 `COND_EXCLUDED_ANGLE_VALUE` 추가 | E001 원 5 UID의 실제 recovery 영수증 | 원 `ADD_ONLY` 정의를 그대로 적용. 발급 직전 실제 registry 재확인 |
| E001 Q19 | 없음 | 같은 E001 원 5 UID | 확정된 `KEEP_REVIEWED_ACTIVE_PRIMARY`를 그대로 운반 |
| E017 Q23 | `templateKey`, `courseKey` | E017 원 18 UID의 실제 recovery 영수증 | E005가 공급하는 확정 TPL의 실제 ACTIVE 설치 확인 |

E001 기존 namespace는 현재 metadata에 2015/M3-2로 존재하며 새 source namespace를 만들지 않는다. E017은 승인된 원 question의 명시 `curriculum=2015`를 유지하고 native `rpm.base.scope=M3-2`만 course alias로 운반한다. 원 native의 비교 교육과정을 새 원교육과정 승인으로 확대하지 않는다.

새 3 UID와 기존 23 UID 보존을 합치면 나중의 owned 범위는 26 UID이다. E001 신규 2개를 같은 최종 source blob으로 묶고 기존 5개 보존을 별도 요청으로, E017 신규 1개와 기존 18개 보존을 별도 요청으로 설계할 수 있으나 지금 요청을 발급하지 않았다. 오래된 E017의 15+3 preview 영수증 대신 현재 실제 18개 cohort의 recovery 결과를 받아야 한다.

## 직접 확인한 경계

- actual main과 root new12 입력에서 두 source의 bytes가 동일하다.
- 세 선택 question은 해당 immutable 승인 snapshot의 whole-object hash와 같다.
- 현재 referenced renderer 6개의 bytes가 각각 승인 근거와 같다. E017은 독립 확정의 published source commit 자산까지 직접 대조했다.
- metadata append를 메모리에서 적용했을 때 학생 payload 47개와 비수정 whole object 45개가 동일하다.
- 기존 보존 대상 E001 5개 및 E017 18개는 source object가 모두 동일하며 신규 3 UID와 겹치지 않는다.
- E017의 TPL 외 native 직접 필드와 기존 동결 요청의 after가 동일하다. TPL 정의는 immutable mapping과 root E005 provider의 exact definition이 같다.
- production source write 0, production inbox 발급 0, 최종 predecessor receipt 참조 0, 새 수학 QA/난도 판단 0.

## 파일과 재개 순서

`preparation.json`에 UID, 현재 source/blob, actual metadata/identity before 관측값, draft after, 정확한 authority refs, future preservation 범위가 있다. `evidence-manifest.json`은 immutable raw refs의 SHA256을 나열한다. 두 `*.metadata-append.js`는 기존 source에 붙일 수 있는 metadata 전용 fragment이며 실제 source에 적용하지 않았다.

실제 recovery 완료 뒤 current source, metadata/identity, 실제 recovered receipt raw SHA를 다시 읽는다. 변경이 있으면 현재 준비안의 before/blob을 그대로 사용하지 않는다. 모든 recovered sidecar와 원 native 계보를 공식 등록기로 재검증할 수 있어야 한다. E017 TPL은 실제 ACTIVE 설치를 우선 확인한다. CC/COND 정렬기가 TPL 순서를 보장한다고 가정하지 않으며, 같은 transaction 대안은 별도 공식 order 및 registrar 증거가 필요하다.

그 다음 source/request를 정확한 최종 blob과 actual recovery receipt에 결속하고, official dry/write/replay, source/identity/runtime 경계, full catalog/Consumer, immutable shadow, exact-head CI를 실행한다. 이번 준비 단계에서는 이 공식 등록·Consumer·shadow를 실행하지 않았고 production 등록 완료를 주장하지 않는다.

M3 1학기, E020 Q16, 기존 M2 보류 9개는 이 준비안의 범위 밖이다. 동결된 M2 follow6 34개 파일도 수정하지 않았다.
