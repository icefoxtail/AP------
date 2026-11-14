# M3-S1-META-FULL — Codex 인계/진행 상태

**상태: RUNNING — 전체 출고 인계 전. 미검토 시험지를 계속 검토한다.**

taskId: `675e8b6b-b864-4891-b6c2-e822f550853e`  
owner: `GPT_ROOT_D71839569CD9`  
branch: `review/m3-s1-meta-full-20261114`  
base main: `0ba1e7de048de3af0771da6c0972409fd46baa75`

## 현재 검증된 범위

전체 115시험지 / 2750문항 중 11시험지 / 261문항의 통합 검토안을 저장했다. 남은 104시험지는 완료로 간주하지 않는다.

원문·선택지·정답·해설·이미지·레이아웃·ID·문항 순서는 보존한다. 실제 변경은 원본의 허용 메타 필드와 작업 전용 검토안/근거 파일에 제한한다. main 병합·공용 등록·배포는 수행하지 않는다.

## 재개 위치

- `progress.json`: source별 canonical UID, baseline/final blob, 검토 상태·판본, 담당, 다음 작업.
- `exams/E###/review.json`: 문항별 before/after, native RPM과 2022 최신 부모 대응, PT/TPL 후보의 ACTIVE 검사, CrossConcept/Condition/Integration, level·5단계 난이도, 내용 부채.
- `exams/E###/4slot.json`: 정확 인용·QBODY/QFULL·최종 source blob에 결속한 4칸. 사전 후보는 제안 상태.
- `exams/E###/validation.json`: 공식4칸 검사, 실제 registry 검사, 보호필드 해시, WARN 우선 독립3문항 표본.
- `remote-checkpoints.json`: 이전 시험지 저장 후 실제 원격 HEAD·tree 일치 조회 기록. 현재커밋 자기 SHA를 파일 안에 요구하지 않는다.

## Codex 출고 경계

이 브랜치는 메타 검토안 보존용이다. 공용 question_metadata/identity/runtime/index/catalog/registry/crosswalk/dictionary를 변경하지 않았다. 공식 resolver가 요구하는 VERIFIED_FINAL·독립 수학 검증을 새로 주장하지 않으며 정적 ACTIVE 키·정확 결속 검사와 resolver 실행은 구분한다. 실제 leaf/type/binding gap, source fingerprint drift, 원문/그림 불일치, 교육과정 방법 우려는 UID 근거로 심사해야 한다. 등록 가능 판정을 추정하지 않는다.

원문 schema가 question 필드를 쓰면 기존 공식 QBODY/QFULL의 content=null 규칙을 보존하고 별도 stemEvidenceSha256와 source blob으로 발문을 결속한다. 원본 machine curriculum을 2022로 바꾸지 않는다.

## 다음 실행

세 작업자가 서로 다른 시험지를 연속 검토하고 root만 통합·Git·Notion·AWCR를 기록한다. 아래 미완료 항목만 이어간다. 이미 원격 저장된 시험지는 구체적 결함이나 판본 변경이 없으면 반복하지 않는다.

| key | source | 상태 |
|---|---|---|
| E011 | `original/middle/m3/1mid/25_신흥중_1학기_중간_중3_기출.js` | PENDING |
| E012 | `original/middle/m3/1mid/25_연향중_1학기_중간_중3_기출.js` | PENDING |
| E014 | `original/middle/m3/1final/24_신흥중_1학기_기말_중3_기출c.js` | PENDING |
| E015 | `original/middle/m3/1final/24_연향중_1학기_기말_중3_기출c.js` | PENDING |
| E016 | `original/middle/m3/1final/24_왕운중_1학기_기말_중3_기출c.js` | PENDING |
| E017 | `original/middle/m3/1mid/24_금당중_1학기_중간_중3_기출.js` | PENDING |
| E018 | `original/middle/m3/1mid/24_삼산중_1학기_중간_중3_수학.js` | PENDING |
| E019 | `original/middle/m3/1mid/24_신흥중_1학기_중간_중3_수학.js` | PENDING |
| E020 | `original/middle/m3/1mid/24_연향중_1학기_중간_중3_기출.js` | PENDING |
| E021 | `original/middle/m3/1mid/24_왕운중_1학기_중간_중3_기출.js` | PENDING |
| E022 | `original/middle/m3/1mid/24_이수중_1학기_중간_중3_기출c.js` | PENDING |
| E023 | `original/middle/m3/1mid/24_향림중_1학기_중간_중3_기출.js` | PENDING |
| E024 | `original/middle/m3/1final/23_매산중_1학기_기말_중3_기출c.js` | PENDING |
| E025 | `original/middle/m3/1final/23_매산중_1학기_기말_중3_수학c.js` | PENDING |
| E026 | `original/middle/m3/1final/23_연향중_1학기_기말_중3_수학.js` | PENDING |
| E027 | `original/middle/m3/1final/23_풍덕중_1학기_기말_중3_기출.js` | PENDING |
| E028 | `original/middle/m3/1mid/23_동산중_1학기_중간_중3_수학.js` | PENDING |
| E029 | `original/middle/m3/1mid/23_연향중_1학기_중간_중3_기출.js` | PENDING |
| E030 | `original/middle/m3/1mid/23_왕운중_1학기_중간_중3_기출.js` | PENDING |
| E031 | `original/middle/m3/1mid/23_풍덕중_1학기_중간_중3_기출.js` | PENDING |
| E032 | `original/middle/m3/1mid/23_향림중_1학기_중간_중3_기출.js` | PENDING |
| E033 | `original/middle/m3/1final/22_동산중_1학기_기말_중3_기출c.js` | PENDING |
| E034 | `original/middle/m3/1final/22_매산중_1학기_기말_중3_기출.js` | PENDING |
| E035 | `original/middle/m3/1final/22_신흥중_1학기_기말_중3_기출c.js` | PENDING |
| E036 | `original/middle/m3/1final/22_연향중_1학기_기말_중3_기출c.js` | PENDING |
| E037 | `original/middle/m3/1final/22_이수중_1학기_기말_중3_기출c.js` | PENDING |
| E038 | `original/middle/m3/1final/22_팔마중_1학기_기말_중3_기출c.js` | PENDING |
| E039 | `original/middle/m3/1final/22_풍덕중_1학기_기말_중3_기출c.js` | PENDING |
| E040 | `original/middle/m3/1final/22_향림중_1학기_기말_중3_수학.js` | PENDING |
| E041 | `original/middle/m3/1mid/22_동산중_1학기_중간_중3_기출.js` | PENDING |
| E042 | `original/middle/m3/1mid/22_신흥중_1학기_중간_중3_기출.js` | PENDING |
| E043 | `original/middle/m3/1mid/22_연향중_1학기_중간_중3_기출c.js` | PENDING |
| E044 | `original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js` | PENDING |
| E045 | `original/middle/m3/1mid/22_팔마중_1학기_중간_중3_기출.js` | PENDING |
| E046 | `original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` | PENDING |
| E047 | `original/middle/m3/1mid/22_향림중_1학기_중간_중3_수학.js` | PENDING |
| E048 | `original/middle/m3/1final/21_금당중_1학기_기말_중3_기출c.js` | PENDING |
| E049 | `original/middle/m3/1final/21_동산중_1학기_기말_중3_기출c.js` | PENDING |
| E050 | `original/middle/m3/1final/21_매산중_1학기_기말_중3_수학.js` | PENDING |
| E051 | `original/middle/m3/1final/21_신흥중_1학기_기말_중3_기출.js` | PENDING |
| E052 | `original/middle/m3/1final/21_연향중_1학기_기말_중3_기출c.js` | PENDING |
| E053 | `original/middle/m3/1final/21_왕운중_1학기_기말_중3_수학.js` | PENDING |
| E054 | `original/middle/m3/1final/21_왕의중_1학기_기말_중3_수학_기출.js` | PENDING |
| E055 | `original/middle/m3/1final/21_팔마중_1학기_기말_중3_수학.js` | PENDING |
| E056 | `original/middle/m3/1final/21_풍덕중_1학기_기말_중3_수학.js` | PENDING |
| E057 | `original/middle/m3/1mid/21_금당중_1학기_중간_중3_기출.js` | PENDING |
| E058 | `original/middle/m3/1mid/21_금당중_1학기_중간_중3_수학.js` | PENDING |
| E059 | `original/middle/m3/1mid/21_동산중_1학기_중간_중3_기출.js` | PENDING |
| E060 | `original/middle/m3/1mid/21_매산중_1학기_중간_중3_기출.js` | PENDING |
| E061 | `original/middle/m3/1mid/21_매산중_1학기_중간_중3_수학.js` | PENDING |
| E062 | `original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js` | PENDING |
| E063 | `original/middle/m3/1mid/21_신흥중_1학기_중간_중3_수학.js` | PENDING |
| E064 | `original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js` | PENDING |
| E065 | `original/middle/m3/1mid/21_왕운중_1학기_중간_중3_기출.js` | PENDING |
| E066 | `original/middle/m3/1mid/21_팔마중_1학기_중간_중3_기출.js` | PENDING |
| E067 | `original/middle/m3/1mid/21_풍덕중_1학기_중간_중3_기출.js` | PENDING |
| E068 | `original/middle/m3/1final/20_신흥중_1학기_기말_중3_수학.js` | PENDING |
| E069 | `original/middle/m3/1final/20_연향중_1학기_기말_중3_수학.js` | PENDING |
| E070 | `original/middle/m3/1final/20_이수중_1학기_기말_중3_수학.js` | PENDING |
| E071 | `original/middle/m3/1final/19_가산중_1학기_기말_중3_수학.js` | PENDING |
| E072 | `original/middle/m3/1final/19_동산중_1학기_기말_중3_수학.js` | PENDING |
| E073 | `original/middle/m3/1final/19_서울가산중_1학기_기말_중3_수학.js` | PENDING |
| E074 | `original/middle/m3/1final/19_신흥중_1학기_기말_중3_수학.js` | PENDING |
| E075 | `original/middle/m3/1final/19_연향중_1학기_기말_중3_수학.js` | PENDING |
| E076 | `original/middle/m3/1final/19_왕운중_1학기_기말_중3_수학.js` | PENDING |
| E077 | `original/middle/m3/1final/19_이수중_1학기_기말_중3_수학.js` | PENDING |
| E078 | `original/middle/m3/1mid/19_금당중_1학기_중간_중3_기출.js` | PENDING |
| E079 | `original/middle/m3/1mid/19_동산중_1학기_중간_중3_기출.js` | PENDING |
| E080 | `original/middle/m3/1mid/19_서울봉원중_1학기_중간_중3_수학.js` | PENDING |
| E081 | `original/middle/m3/1mid/19_서울세일중_1학기_중간_중3_수학.js` | PENDING |
| E082 | `original/middle/m3/1mid/19_서울시흥중_1학기_중간_중3_수학.js` | PENDING |
| E083 | `original/middle/m3/1mid/19_서울안천중_1학기_중간_중3_수학.js` | PENDING |
| E084 | `original/middle/m3/1mid/19_연향중_1학기_중간_중3_기출.js` | PENDING |
| E085 | `original/middle/m3/1mid/19_풍덕중_1학기_중간_중3_기출.js` | PENDING |
| E086 | `original/middle/m3/1final/18_동산중_1학기_기말_중3_수학.js` | PENDING |
| E087 | `original/middle/m3/1final/18_연향중_1학기_기말_중3_수학.js` | PENDING |
| E088 | `original/middle/m3/1mid/18_동산중_1학기_중간_중3_수학.js` | PENDING |
| E089 | `original/middle/m3/1mid/18_연향중_1학기_중간_중3_수학.js` | PENDING |
| E090 | `original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js` | PENDING |
| E091 | `original/middle/m3/1final/17_경북영신중_1학기_기말_중3_수학.js` | PENDING |
| E092 | `original/middle/m3/1final/17_경북창포중_1학기_기말_중3_수학.js` | PENDING |
| E093 | `original/middle/m3/1final/17_경북환호여중_1학기_기말_중3_수학.js` | PENDING |
| E094 | `original/middle/m3/1final/17_대구동도중_1학기_기말_중3_수학.js` | PENDING |
| E095 | `original/middle/m3/1final/17_대구오성중_1학기_기말_중3_수학.js` | PENDING |
| E096 | `original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js` | PENDING |
| E097 | `original/middle/m3/1final/17_풍덕중_1학기_기말_중3_수학.js` | PENDING |
| E098 | `original/middle/m3/1mid/17_대구교동중_1학기_중간_중3_수학.js` | PENDING |
| E099 | `original/middle/m3/1mid/17_서울가산중_1학기_중간_중3_수학.js` | PENDING |
| E100 | `original/middle/m3/1mid/17_이수중_1학기_중간_중3_수학.js` | PENDING |
| E101 | `original/middle/m3/1mid/17_풍덕중_1학기_중간_중3_수학.js` | PENDING |
| E102 | `original/middle/m3/1final/16_가람중_1학기_기말_중3_수학.js` | PENDING |
| E103 | `original/middle/m3/1final/16_경기은계중_1학기_기말_중3_수학.js` | PENDING |
| E104 | `original/middle/m3/1final/16_동원중_1학기_기말_중3_수학.js` | PENDING |
| E105 | `original/middle/m3/1final/16_오성중_1학기_기말_중3_수학.js` | PENDING |
| E106 | `original/middle/m3/1final/16_은계중_1학기_기말_중3_수학.js` | PENDING |
| E107 | `original/middle/m3/1final/16_장흥중_1학기_기말_중3_수학.js` | PENDING |
| E108 | `original/middle/m3/1final/16_창포중_1학기_기말_중3_수학.js` | PENDING |
| E109 | `original/middle/m3/1final/16_환호여중_1학기_기말_중3_수학.js` | PENDING |
| E110 | `original/middle/m3/1mid/16_경북장흥중_1학기_중간_중3_수학.js` | PENDING |
| E111 | `original/middle/m3/1mid/16_부산대천리중_1학기_중간_중3_수학.js` | PENDING |
| E112 | `original/middle/m3/1mid/16_부산만덕중_1학기_중간_중3_수학.js` | PENDING |
| E113 | `original/middle/m3/1mid/16_부산엄궁중_1학기_중간_중3_수학.js` | PENDING |
| E114 | `original/middle/m3/1mid/16_왕운중_1학기_중간_중3_수학.js` | PENDING |
| E115 | `original/middle/m3/1mid/16_왕의중_1학기_중간_중3_수학.js` | PENDING |
