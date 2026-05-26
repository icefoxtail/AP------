🤖 JS아카이브 발문·보기 추출 프로토콜 v4.0

Full Page First · Question Crop Optional · CONTENT_CHOICES_ONLY

룰북/마스터테이블 비수정 · JS 직접 반영 · Manual Review 최소화

이번 프로토콜의 목적

이 프로토콜은 AP Math JS아카이브 교재 DB 변환에서 full page 이미지를 1차 원본으로 사용하여, fresh pack 안의 실제 JS 파일 questionBank 배열에 발문(content)과 보기(choices)를 직접 채우는 작업 기준이다.

이번 작업의 목표는 answer/solution 생성이 아니다.

목표:

full page 이미지 기준으로 문항의 발문과 보기를 최대한 직접 전사한다.

문항별 crop은 기본 자료가 아니라, full page만으로 판독이 어려운 경우에만 추가 요청한다.

기존 JS 객체의 id, 메타데이터, answer, solution은 보존한다.

최종 산출물은 correction_result JSON이 아니라 수정된 실제 js/*.js 파일이다.

full page에서 확인 가능한 문항을 crop_issue로 빼지 않는다.

불확실한 소수만 report로 분리한다.

이번 작업 모드: CONTENT_CHOICES_ONLY

수정 허용:

content

choices

도형/그래프/이미지 선택지처럼 글자 전사가 불가능한 경우에만 image 필드 추가

image 필드 추가 시 필요한 assets/images/... PNG 파일도 함께 포함

수정 금지:

answer

solution

id

level

category

originalCategory

standardCourse

standardUnitKey

standardUnit

standardUnitOrder

questionType

layoutTag

tags

wide

기존 문항 순서

기존 객체 수

예외:

사용자가 “누락 문항 추가까지 진행”이라고 명시한 경우에만 full page 기준 누락 문항을 새 객체로 추가한다.

사용자가 명시하지 않은 경우, 기존 questionBank 객체 수와 순서를 유지한다.

입력 자료 우선순위

1순위: full page 이미지2순위: 기존 JS 객체의 id / sourceQuestionNo / displayNo / category 흐름3순위: question full crop 이미지4순위: 파일명, crop_index, manifest, page mapping report5순위: answer crop / 정답표6순위: solution crop / 해설지

이번 작업에서는 answer crop과 solution crop을 answer/solution 입력용으로 사용하지 않는다.answer crop과 solution crop은 발문/보기 판독 보조가 필요한 경우에만 참고한다.

각 자료의 역할:

full page:

발문/보기 전사의 최우선 원본

문항 번호 흐름 확인

crop 잘림 복원

공통자료/표/도형/그래프 위치 확인

옆단 보기나 이어지는 문장 확인

기존 JS 문항 흐름과 실제 책 문항 흐름 대조

question full crop:

full page가 흐리거나 작아서 판독이 어려운 문항만 보조로 사용

문항 경계 확인

특정 수식/보기 확대 확인

full page와 crop이 충돌하면 full page를 우선한다.

기존 JS:

최종 반영 대상

id와 메타데이터 보존 기준

엔진 호환성 기준

작업 순서

반드시 다음 순서로 진행한다.

fresh pack 압축 해제

js/*.js 파일 확인

window.examTitle 및 window.questionBank 구조 확인

questionBank 객체 수 확인

각 객체의 id / sourceQuestionNo / displayNo / category / 기존 content 상태 확인

full page 이미지 페이지 범위 확인

full page 기준 실제 책 문항 번호 흐름 작성

JS 객체 흐름과 full page 문항 흐름 매칭

각 문항의 content 입력

객관식 문항의 choices 입력

주관식/서술형/계산형 문항은 choices: [] 유지

도형/그래프 선택지처럼 글자 전사가 불가능한 문항은 image fallback 처리

full page로도 판독이 어려운 항목만 report에 needs_crop 또는 manual_review로 기록

answer/solution 변경 여부 확인

node --check로 JS 문법 검증

questionBank 파싱 검증

최종 zip 생성

full page 기준 전사 원칙

content는 full page를 최우선으로 보고 입력한다.

원칙:

원문 유지

문장 순서 유지

조건 생략 금지

조건 추가 금지

문장 다듬기 금지

의미 보정 금지

보이는 문항은 반드시 입력

full page에 보이는 문항을 crop이 없다는 이유로 비워두지 않는다.

full page에서 확인 가능한데 crop_issue 처리하지 않는다.

full page에서도 판독이 어려운 부분만 [판독불가] 사용한다.

허용되는 최소 복원:

글자 1~2개가 흐리지만 수학적으로 명확한 경우

같은 페이지의 동일 표현이 반복되는 경우

RPM 교재의 고정 문항 패턴이 명확한 경우

보기 구조상 빠진 조사나 단위가 확실한 경우

“다음 중 옳은 것은?”, “다음 식을 계산하여라.”처럼 교재 반복 문구가 명확한 경우

문장 끝 “고르시오”, “구하여라”, “나타내어라”가 일부 흐려졌지만 문맥상 하나로만 읽히는 경우

복원 금지:

숫자가 불명확한 경우

부등호 방향이 불명확한 경우

등호/부등호/괄호 유무가 불명확한 경우

지수/첨자/분자/분모가 불명확한 경우

행렬의 성분 값이 불명확한 경우

보기 값 자체가 두 가지 이상으로 읽히는 경우

조건이 둘 이상 가능하게 읽히는 경우

도형/그래프 조건을 임의로 설명해야 하는 경우

crop 요청 기준

문항별 crop은 기본 입력 자료가 아니다.필요한 경우에만 사용자에게 요청한다.

crop 요청이 필요한 경우:

full page 해상도 때문에 특정 문항의 수식이 판독되지 않는 경우

숫자, 부호, 지수, 첨자, 분수 구조가 불명확한 경우

행렬 성분이 작아서 확인되지 않는 경우

보기 일부가 제본부, 그림자, 접힘, 흐림 때문에 보이지 않는 경우

표의 셀 내용이 full page에서 읽히지 않는 경우

그래프/도형 선택지 자체가 작아서 image fallback용 crop이 필요한 경우

공통자료가 여러 문항에 걸쳐 있는데 full page에서 연결 범위가 불명확한 경우

crop 요청이 필요하지 않은 경우:

full page에서 문항 전체가 보이는 경우

crop이 없지만 full page로 발문/보기가 충분히 보이는 경우

한글 조사/어미 1~2글자가 흐리지만 문맥상 명확한 경우

같은 페이지 반복 문항 패턴으로 복원 가능한 경우

보기 일부가 옆단에 있지만 full page에서 확인 가능한 경우

crop 요청 report 형식:

id

sourceQuestionNo 또는 displayNo

pageNo

neededSource: "question_crop" | "choice_crop" | "figure_crop" | "table_crop" | "higher_resolution_full_page"

reason

visibleTextSoFar

exactUnclearPart

예:{"id": 1133,"sourceQuestionNo": "1133","pageNo": 160,"neededSource": "question_crop","reason": "행렬 첫 번째 행 두 번째 성분이 2인지 z인지 full page에서 판독 불가","visibleTextSoFar": "두 행렬 A=..., B=...에 대하여 ...","exactUnclearPart": "A의 (1,2) 성분"}

content 입력 기준

content에는 문제의 발문을 입력한다.

원칙:

문제 번호는 content에 넣지 않는다.

객관식 보기 번호는 content에 넣지 않고 choices 배열에 넣는다.

발문 안의 조건, 표, 보기 전 조건은 빠짐없이 넣는다.

원문 줄바꿈은 JS 안정성을 위해 필요할 때만 \n으로 정리한다.

실제 줄바꿈 문자를 그대로 넣지 않는다.

수식은 필요한 부분만 $...$로 감싼다.

JS 문자열 내부 LaTeX 백슬래시는 반드시 이중 처리한다.

금지:

발문 새로 쓰기

학생이 이해하기 쉽게 문장 재구성하기

조건을 짧게 요약하기

원문에 없는 설명 추가하기

정답이나 해설을 content에 섞기

“원문 확인 필요”, “OCR 확인 필요” 같은 운영 메모를 content에 넣기

choices 입력 기준

객관식 보기가 있으면 choices 배열에 원문 순서대로 입력한다.

형식:choices: ["① ...","② ...","③ ...","④ ...","⑤ ..."]

원칙:

보기 순서 변경 금지

보기 개수 유지

①~⑤ 원표기 유지

보기 문장 다듬기 금지

보기 수식 의미 보정 금지

보기 일부가 옆단에 있어도 full page에서 확인되면 입력

보기가 없는 문항은 choices: [] 유지

선택지가 수식만 있는 경우:

각 보기를 독립 문자열로 입력한다.

수식은 $...$ 사용

JS 문자열 백슬래시 이중 처리

선택지가 도형/그래프/그림인 경우:

글자로 의미를 창작하지 않는다.

image fallback을 우선한다.

content에는 발문만 둔다.

choices는 [] 또는 기존 구조 유지 중 엔진 호환성이 높은 방식을 선택한다.

report에 image_fallback_applied 기록

선택지가 일부만 불명확한 경우:

확실한 보기만 넣고 나머지를 창작하지 않는다.

단, 같은 페이지 패턴이나 명확한 반복 구조로 확정 가능한 경우는 최소 복원 가능

불확실하면 choices_uncertain 또는 needs_crop으로 report에 기록

수식 입력 기준

기본:

필요한 부분만 $...$ 사용

최상위 분수는 \dfrac 사용

지수/첨자 내부 분수는 \frac 유지 가능

JS 문자열 내부 백슬래시는 반드시 이중 처리

부등호는 가능하면 \lt, \gt 사용

줄바꿈은 실제 줄바꿈이 아니라 \n 사용

예:

"$\dfrac{1}{3}$"

"$x \lt 2$"

"$0.\dot{3}$"

"$\begin{pmatrix}1&2\\3&4\end{pmatrix}$"

행렬:

행렬은 MathJax 호환 LaTeX로 입력한다.

행 구분은 \\를 사용하되 JS 문자열에서는 필요한 만큼 escape한다.

성분 하나라도 불명확하면 formula_uncertain 또는 needs_crop으로 기록한다.

행렬 성분을 문맥으로 임의 보정하지 않는다.

주의:

분자/분모가 불명확하면 임의 복원 금지

순환마디가 불명확하면 formula_uncertain

지수/첨자 위치가 불명확하면 formula_uncertain

마이너스와 빼기 기호 혼동 주의

1과 l, 0과 O, 2와 z처럼 혼동 가능한 문자는 full page만으로 확정하지 말고 필요 시 crop 요청

표 처리 기준

표가 문제에 있으면 가능하면 HTML table로 입력한다.

기준:

table은 발문 바로 아래 배치

SVG로 표를 만들지 않는다.

table 구조는 단순하게 유지

class="question-table" 우선 사용

tags는 이번 CONTENT_CHOICES_ONLY 모드에서는 기존 tags를 임의 변경하지 않는다.

기존 tags 변경이 필요한 경우 report에만 기록한다.

예:content: "다음 표를 보고 물음에 답하여라.<table class="question-table">......"

표 판독이 어려운 경우:

표 전체를 창작하지 않는다.

읽히는 셀만 입력하지 말고 needs_crop으로 요청한다.

neededSource는 "table_crop" 또는 "higher_resolution_full_page"로 기록한다.

도형/그래프/이미지 처리 기준

이 공정에서는 도형, 그래프, SVG를 새로 그리지 않는다.

도형/그래프가 문제 풀이 또는 보기 판독에 필요한 경우:

원문 발문은 content에 입력한다.

도형/그래프 자체를 글로 창작하지 않는다.

PNG 자산이 준비되어 있거나 full page에서 잘라낼 수 있으면 image 필드를 사용한다.

image 필드 추가 시 assets/images/시험지전체명/q{id}.png 구조를 따른다.

content 내부 보다 image 필드를 우선한다.

image와 content 내부 를 동시에 넣지 않는다.

image 예:image: "assets/images/RPM_공통수학1_행렬_12_행렬_고1/q1169.png"

도형/그래프 crop이 필요한 경우:

report에 neededSource: "figure_crop" 또는 "graph_crop"으로 남긴다.

해당 문항은 content만 먼저 채우고 image는 보류할 수 있다.

그래프/도형 선택지라서 choices 전사가 불가능하면 choices_uncertain이 아니라 image_fallback_needed로 기록한다.

Manual Review 최소화 강제 규칙

full page가 제공된 페이지의 문항은 content 누락 0개를 목표로 한다.

manual_review가 아닌 경우:

crop이 없지만 full page에서 보이는 경우

crop이 잘렸지만 full page에서 이어지는 문장이 보이는 경우

한글 조사/어미/단위 1~2글자가 흐리지만 문맥상 명확한 경우

같은 페이지의 반복 문항 패턴으로 표현이 명확한 경우

보기 일부가 옆단에 있지만 full page에서 확인되는 경우

수식이 단순하고 주변 문맥상 하나로만 해석되는 경우

manual_review 또는 needs_crop인 경우:

숫자가 불명확한 경우

부등호 방향이 불명확한 경우

지수/첨자/분자/분모가 불명확한 경우

행렬 성분이 불명확한 경우

보기 값 자체가 두 가지 이상으로 읽히는 경우

full page에서도 문항이 보이지 않는 경우

full page 이미지가 흐려서 확대해도 판독이 안 되는 경우

도형/그래프 자체가 선택지라 글자 전사가 불가능하고 image crop도 없는 경우

금지:

“crop이 없어서 못함” 처리 금지

“문항별 crop 미제공”만을 이유로 content 비워두기 금지

full page에서 보이는데 crop_issue 처리 금지

확실한 문항까지 manual_review로 넘기기 금지

report 작성 기준

불확실한 항목은 JS 작업을 멈추지 말고 report로 분리한다.

reports/content_choices_report.json:

전체 문항 처리 상태

content 입력 여부

choices 입력 여부

image fallback 여부

unchangedFields 확인 여부

reports/manual_review_report.json:

실제로 추가 자료가 필요한 문항만 기록

status 유형:

confirmed

needs_crop

formula_uncertain

choices_uncertain

image_fallback_needed

image_fallback_applied

full_page_blur

table_uncertain

manual_review

report 필드:

file

id

sourceQuestionNo

displayNo

pageNo

status

reason

neededSource

visibleTextSoFar

exactUnclearPart

note

중요:

report는 작업 실패가 아니다.

report는 후속 수동 보정을 위한 안전장치다.

단, report 남발은 실패다.

full page에서 확인 가능한 문항은 반드시 JS에 반영한다.

검증 기준

최종 zip 생성 전 반드시 확인한다.

필수 검증:

node --check js/*.js

window.questionBank 배열 파싱 가능 여부

객체 수 유지 여부

id 순서 유지 여부

sourceQuestionNo 중복 여부

content 빈 값 개수 확인

full page 제공 범위 내 content 누락 여부 확인

객관식 choices 배열 개수 확인

choices가 있는 문항의 ①~⑤ 순서 확인

answer 변경 없음 확인

solution 변경 없음 확인

메타데이터 변경 없음 확인

LaTeX 백슬래시 깨짐 확인

따옴표/줄바꿈/닫힘 괄호 확인

image 필드 추가 시 assets 파일 존재 확인

PASS 조건:

JS 문법 통과

questionBank 파싱 통과

기존 문항 수 유지

기존 answer/solution 변경 없음

기존 메타데이터 변경 없음

full page에서 확인 가능한 content 대부분이 아니라 전부 채워짐

choices가 가능한 범위에서 채워짐

불확실 항목은 정확한 추가 이미지 요청과 함께 report에 분리됨

단원별 작업 전략

전체를 한 번에 처리하지 않는다.단원별로 처리한다.

각 단원별 산출물:

수정된 js/*.js

reports/content_choices_report.json

reports/manual_review_report.json

reports/field_change_guard_report.json

CODEX_RESULT.md

CODEX_RESULT.md에는 다음을 짧게 기록한다.

생성/수정 파일

content 입력 완료 수

choices 입력 완료 수

image fallback 적용 수

추가 crop 요청 문항 수

node --check 결과

answer/solution 변경 없음 확인

메타데이터 변경 없음 확인

다음 조치

최종 원칙

이 작업의 핵심은 “문항별 crop을 보고 조심스럽게 일부만 넣기”가 아니다.

핵심은 다음이다.

full page를 원본으로 본다.

crop은 필요한 경우에만 요청한다.

JS에 직접 반영한다.

content와 choices만 채운다.

answer와 solution은 건드리지 않는다.

기존 메타데이터는 건드리지 않는다.

한두 글자 흐림은 문맥상 확실하면 복원한다.

숫자, 부호, 지수, 첨자, 분수, 행렬 성분은 추측하지 않는다.

full page에서 보이는 문항은 비워두지 않는다.

불확실한 소수만 report로 뺀다.

필요한 추가 이미지는 정확히 요청한다.

엔진에서 바로 도는 JS를 만든다.

최종 목표는 full page 기반으로 교재 DB 발문/보기 입력을 대량 생산 가능한 수준으로 자동화하는 것이다.