# 팔마고 QID9 Q05~Q08 학생용 등록·Meta 영구저장 기술 작업 원장

- 날짜: 2026-10-09 / 대상 36 UID (q05~q08 각9).
- 수학/발문 품질 승인: USER_DIRECTED_QUALITY_APPROVED_20261009_PALMA_Q05_Q08_36.
- Source JS 4 / Source metadata 4 / Consumer shards 4 / Consumer Index +36.
- Index 이전 승인 346(팔마63) 유지; 목표 382(팔마99); index staged blob 5aa2260f68b50717bb3e31c7a0dec715452dabdd.
- 연동 증거: Source 질문·정답·해설·uid 그대로 Consumer.question, 동일 MetaProjection은 Consumer.record와 Index.record에 1:1 저장.
- 미확정 Meta: q05 외심 2 UID CrossConcept canonical 미확정; q06 9 UID Condition working label 미canonical; q07 C1~C3 3 UID 양수조건 canonical 미확정. 이들은 null+evidenceDebt+workingLabels로 저장하며 NONE으로 오기록하지 않는다.
- 외심 외 기타 확인된 source CrossConcept key와 조건키는 source provenance 그대로 보존한다. RPM L3/L4는 q05 GENERATED_EXT_L4, q06 H1-RPM-219/220, q07 H1-RPM-226, q08 H1-RPM-238 대응.
- 정답·해설 수학 검수 후 사용자 품질승인과 별도 기술 gate. 실제 Chrome student lookup: NOT_TESTED. 저장만으로 MAIN_DONE 또는 Chrome PASS 선언 금지.
- 원본 기출 JS 및 q01~q04 36 기존 학생 출시분 보존. 기존 다른 346행은 재승인/재검수·정답 변경 없음.
