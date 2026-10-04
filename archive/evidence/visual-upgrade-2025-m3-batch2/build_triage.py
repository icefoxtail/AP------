import json,re,sys
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8',errors='replace')
E=Path('archive/evidence/visual-upgrade-2025-m3-batch2');D=json.loads((E/'inventory.json').read_text(encoding='utf-8'))
add_info={
('25_신흥중_2학기_중간_중3_수학.js',7):('직선의 x절편·y절편과 run=2, rise=1의 기울기 삼각형을 함께 보여 tan a=1/2의 소유 관계를 세운다.', ['원문에 도형 없음','x축과 직선 교점에서 각 a 표시','기울기 1/2를 실제 run 2, rise 1인 직각삼각형에 결속'], '식만 있는 원문에는 각 a와 기울기의 기하 소유가 없어, 같은 계산을 반복하지 않는 직선·축·기울기 삼각형을 새로 넣었다.'),
('25_신흥중_2학기_중간_중3_수학.js',8):('보조점 H에서 BC를 BH와 HC로 나눠 두 직각삼각형의 길이 계산을 보인다.', ['원문 삼각형에는 H가 없음','AH 수선과 H의 직각 사각형 표시','BH, AH, HC, BC의 값을 각각 실제 선분에 결속'], '원문 그림은 입력 삼각형만 보이므로 풀이에서 새로 도입한 수선과 두 구간을 추가했다.'),
('25_신흥중_2학기_중간_중3_수학.js',11):('이등변삼각형 풀이에 쓰는 D, E, F 작도와 nested angle ownership을 보인다.', ['원문 삼각형에는 D, E, F가 없음','수선 D, DE=BD, BE, F의 수선 작도','30°, 45°, 75°를 각 꼭짓점과 두 광선에 결속'], '원문 도형만으로는 풀이의 보조 작도 및 단계별 각 관계가 보이지 않아 새 helper geometry를 추가했다.'),
('25_신흥중_2학기_중간_중3_수학.js',14):('정삼각형의 중심 O와 중선 AM 위의 2:1 분할을 보인다.', ['원문은 현에 내린 수선과 같은 거리 조건만 표시','정삼각형 변, 중선, 무게중심 O를 구분','AO=4와 OM=2를 각각 owner segment에 결속'], '원문은 세 변에서 같은 거리라는 조건을 보이지만 무게중심의 2:1 분할과 OA 반지름 계산 위치를 보여주지 않아 이를 추가했다.'),
('25_신흥중_2학기_중간_중3_수학.js',18):('직사각형 내접원의 U,V,T 접점과 접선 길이, 직각삼각형 DEC를 보인다.', ['원문에는 보조 접점 U,V,T와 접선 등식이 없음','DU=DT, EV=ET 및 EC, DE 값을 소유 선분에 연결','△DEC의 직각 표시와 넓이 결론을 구별'], '원문 그림은 원과 접선만 표시하므로 풀이의 접점 분할과 넓이 삼각형을 더해준다.'),
('25_신흥중_2학기_중간_중3_수학.js',20):('접점 C를 지나는 AB 평행선으로 x−3, 9−x의 높이 구간을 분리한다.', ['원문은 반원 접선의 전체 모습만 제시','C를 지나는 평행 보조선과 F 수선 발','DC:CE=1:3의 닮음에 필요한 두 높이를 해당 선분에 결속'], '원문 도형에 풀이의 평행 보조선이 없어 닮음비의 owner 구간을 직접 보여주도록 추가했다.'),
('25_신흥중_2학기_중간_중3_수학.js',22):('열기구 C에서 H로 내린 수선으로 45°·60° 삼각형과 AH+HB=50을 보인다.', ['원문에는 H가 없음','CH 수선과 H의 직각 사각형 표시','AH, HB, CH 길이를 각 실제 선분에 결속'], '원문 그림에는 두 관측각과 밑변만 있으므로, 높이 식을 만드는 수선을 추가했다.'),
('25_신흥중_2학기_중간_중3_수학.js',24):('접선 반지름 직각 사각형과 60°/120° angle arc로 음영 영역 분해를 보인다.', ['원문 음영 그림은 반지름 수직 표시와 중심각이 없음','PA·PB 접선, OA·OB 반지름, 중심각 120° 표시','음영 영역은 원의 부채꼴을 뺀 영역으로 결론 색 분리'], '원문 그림이 음영만 보여주는 데 그쳐 넓이 차를 설명하는 직각삼각형과 중심각을 추가했다.'),
('25_연향중_2학기_중간_중3_수학.js',11):('H에서 밑변 BC로 내린 높이를 표시해 넓이의 owner를 만든다.', ['원문에는 수선 H가 없음','45°의 owner arc와 AH⊥BC 사각형','AB, BC, AH를 각 선분에 결속'], '원문 도형만으로 넓이 계산에 쓰는 높이를 알 수 없어 수선과 높이를 추가했다.'),
('25_연향중_2학기_중간_중3_수학.js',12):('호의 비에서 중심각 120°와 현 중점 M의 수선 삼각형을 보인다.', ['원문에는 M과 OM 수선이 없음','120° 중심각과 nested 60° 반각 arcs','OA=8, OM=4, AM=4√3을 실제 선분에 결속'], '원문 그림의 호 비와 반지름만으로는 △ABO 넓이에 쓰는 높이를 바로 찾기 어려워 중점 수선과 60° 분할을 추가했다.'),
('25_연향중_2학기_중간_중3_수학.js',16):('접는 선 AB를 OP의 수직이등분선으로 나타내고 M에서 반지름을 나눈다.', ['원문은 접힌 원 도형만 제시','P와 O를 잇고 그 중점 M 및 AB 수직 표시','OP=4, OM=2, AB=4√3을 해당 선분에 결속'], '원문 그림에는 접는 선이 OP를 수직이등분한다는 핵심 관계가 표시되지 않아 M과 직각 사각형을 추가했다.')
}

def clean(s):
 s=re.sub(r'<[^>]+>',' ',s);s=s.replace('$','').replace('\\',' ');s=re.sub(r'\s+',' ',s).strip();return s
rows=[]
for ex in D['exams']:
 file=Path(ex['sourcePath']).name
 for q in ex['questions']:
  key=(file,q['qid']);exists=bool(q.get('solutionImagePath'));addition=key in add_info
  if exists:
   if file=='25_신흥중_2학기_중간_중3_수학.js' and q['qid']==23:
    action='STYLE_NORMALIZE';reason='기하 구조만 있는 그림을 같은 글자·선·여백 기준으로 정규화했다.'
   elif file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==10:
    action='REBUILD';reason='교점 P의 기존 라벨 위치가 실제 두 현의 교점과 어긋나 교점 중심에 결속되도록 다시 구성했다.'
   elif file=='25_왕운중_2학기_기말_중3_기출.js' and q['qid']==12:
    action='REBUILD';reason='접점 T와 지름 끝점 D를 분리하고, 68°·22°·46°의 실제 꼭짓점/광선 소유자와 접선의 직각 표시를 바로잡았다.'
   else:
    action='POLISH';reason='각도 호·직각 사각형·선분 길이 소유자를 추가하고 출판형 조판으로 다듬었다.'
   decisive=clean(q['solution'])[:220] or clean(q['content'])[:220]
   row={'qid':q['qid'],'questionUid':q['questionUid'],'action':action,'baselineSolutionImagePresent':True,'oneLineReason':reason,'decisiveRelation':decisive,'sourceFigurePresence':'PRESENT' if q.get('problemImagePath') else 'NONE'}
  elif addition:
   decisive,info,benefit=add_info[key];presence='PRESENT' if q.get('problemImagePath') else 'NONE'
   row={'qid':q['qid'],'questionUid':q['questionUid'],'action':'ADD','baselineSolutionImagePresent':False,'oneLineReason':'풀이의 핵심 보조관계가 원문 도형에 없어 해설 SVG를 보강했다.','decisiveRelation':decisive,'sourceFigurePresence':presence,'marginalBenefitEvidence':{'sourceFigurePresence':presence,'sourceFigureSufficiency':'원문에 H, 접점 분할, 수선, 중심 중선 등 풀이에서 새로 쓰는 결정 관계가 빠져 있다.' if presence=='PRESENT' else '원문에 문제 도형이 없어서 결정 구조를 전달할 해설 도형이 필요하다.','newVisualInformation':info,'marginalBenefitReason':benefit}}
  else:
   presence='PRESENT' if q.get('problemImagePath') else 'NONE'
   action='EXEMPT'
   if presence=='PRESENT':reason='원문 도형이 풀이의 결정 구조를 이미 전달하므로 복제 그림의 추가 이득이 없다.'
   else:reason='이 문항은 식·수치·표의 계산으로 결정되며 공간 관계가 없어 그림 추가가 장식이 된다.'
   decisive=clean(q['solution'])[:220] or clean(q['content'])[:220]
   row={'qid':q['qid'],'questionUid':q['questionUid'],'action':action,'baselineSolutionImagePresent':False,'oneLineReason':reason,'decisiveRelation':decisive,'sourceFigurePresence':presence}
  rows.append(row)
counts={a:sum(r['action']==a for r in rows) for a in ['KEEP','STYLE_NORMALIZE','POLISH','REBUILD','ADD','REMOVE','EXEMPT']}
out={'schemaVersion':'M3_VISUAL_UPGRADE_BATCH2_TRIAGE_v1','baseCommit':D['baseCommit'],'denominator':len(rows),'actionCounts':counts,'triage':rows}
(E/'triage.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'denominator':len(rows),'actionCounts':counts},ensure_ascii=False,indent=2))
