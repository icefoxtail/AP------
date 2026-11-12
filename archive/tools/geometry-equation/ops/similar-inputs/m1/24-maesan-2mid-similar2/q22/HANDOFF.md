# 매산 Q22 해설용 평행선 샘플

PARTIAL_SAMPLE_ONLY: 해설 입력3종과 SVG 생성. 문제 그림은 OPEN_SOURCE_LAYOUT.
source work/similar-m1-accumulate / archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js ordinal22, blob4f300aeae1bae07e956a266c76a78a0c3e59b6b0. 해당 전용 경로 기존 결과 없음, 기존 원본·학년 작업 파일 미수정.

발문에는 원래 그림의 각 위치가 없어 문제 배치를 추정해 새 given을 만들지 않았다. 기존 해설에서 명시된 관계는 공식 construction-spike-v1로 새 해설 도식화했다. 문제용 asset은 생성하지 않았으며 solution SVG를 문제에 연결하면 정답 힌트가 되므로 금지. nextAction: 원본 MD의 실제 그림/각 배치 또는 별도 그림 계획 확보 후 문제 입력을 추가한다. 엔진 미지원과 출처 부족을 구분한다.

Q11: 맞꼭지각 a=c, e=g 및 동위각 a=e를 같은 파랑으로, 이웃각 f를 다른 색으로 표시. 80/100은 내부 비직각 예시값으로 실제 SVG에 표시하지 않는다. Q22: 위(3x-10)°와 아래 엇각을 같은 파랑으로, 이웃한 (2x+40)°를 다른 색으로 표시. 긴 식은 엔진 LEADER로 분리. 아래 두 각 합180, x30 검산. 각도는 생성 모델 좌표의 독립 atan2로 재측정해 선언값과 일치.

초기 parallel mark 입력을 실제 segment ID로 수정하고, angle label은 공식 DEGREE로 바꾸어 자유변수 MATH 라벨 준비 오류를 해결했다. 엔진/검증 기준 수정 없음. 오류 근거 별도 보존. 최종 staticAudit/headless renderedLayout PASS, 실제 화면 시각 검수 NOT_RUN. caller-supplied typography이므로 actualArchive/qualification/publication NOT_RUN, 운영 게시 계약과 지정 담당 미확인은 계속 별도 유지. main 병합 없음.
