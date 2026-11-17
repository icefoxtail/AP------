# 제한 근호곡선 자동 라벨 최소 교정

기준 원격: 8d1a65bf8da17cb5b8ea4917c246ffc240b0e31d. corrective-manifest.json에 두 파일의 정확한 원격 blob을 기록했다. 실행 JSON 두 파일에서 graphPlan.domainRangeLabels만 true→false로 변경했으며 그 밖의 모든 필드는 원격 저장본과 동일하다.

- b015 Q14: 실제 제한 정의역 5≤x≤40, 치역2≤y≤9인데 최종 spec에 −1/3≤x, y≥−2가 출력되는 것을 직접 확인했다.
- b016 Q20 첫 패널: max함수 첫 조각의 실제 정의역3≤x≤7, 치역3≤y≤7인데 최종 spec은3≤x,y≥3으로 끝 상한을 누락했다. 전체 근호함수와 실제 max함수의 첫 조각을 혼동할 수 있어 자동 라벨만 제거했다.

수정 후 두 spec에서 잘못된 자동 도메인/치역 라벨은 없다. 실제 제한구간·끝점좌표·곡선식·정답과 caption은 그대로 보존한다. 기준본2/2 및 수정본2/2 공식 검사 PASS. 실제 렌더 NOT_RUN. domain-label-evidence.json은 전후의 실제 출력 객체이다.
