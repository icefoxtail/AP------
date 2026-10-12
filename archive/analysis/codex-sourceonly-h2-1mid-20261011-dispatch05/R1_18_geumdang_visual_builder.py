from pathlib import Path
from math import cos, sin, pi
import json
ROOT=Path.cwd(); ASSET_DIR=ROOT/'archive/assets/images/18_금당고_1학기_중간_고2_확률과통계'; EVIDENCE_DIR=ROOT/'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05'; ASSET_DIR.mkdir(parents=True,exist_ok=True)

# q11, exact unit-square probability region.
x0,y0,side=72.0,62.0,300.0
def p11(x,y): return (x0+side*x,y0+side*(1-y))
def pts11(a): return ' '.join(f'{p11(x,y)[0]:.3f},{p11(x,y)[1]:.3f}' for x,y in a)
valid=[(0,1/3),(2/3,1),(1,1),(1,2/3),(1/3,0),(0,0)]; tl=[(0,1/3),(0,1),(2/3,1)]; br=[(1/3,0),(1,0),(1,2/3)]
u0,u1=p11(0,1/3),p11(2/3,1); l0,l1=p11(1/3,0),p11(1,2/3)
svg11=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 430" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-geometry-preset="STANDARD_LANDSCAPE" data-visual-provenance="R1_CODEX_SOURCE_FACTS">
<title id="title">두 점 사이 거리 조건이 만드는 정사각형 영역</title><desc id="desc">단위 정사각형에서 |x-y|≤1/3인 대각 띠가 유효 영역이며 좌상단과 우하단 직각삼각형은 제외 영역이다.</desc>
<defs><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#8a8a8a" stroke-width="1.2"/></pattern></defs>
<rect width="780" height="430" fill="#fff"/><text x="38" y="34" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="22" font-weight="700" fill="#111">거리 조건이 정하는 영역</text>
<polygon id="valid-region" data-role="valid-region" points="{pts11(valid)}" fill="#e8f1fa"/>
<polygon data-role="excluded-region" points="{pts11(tl)}" fill="#ededed"/><polygon points="{pts11(tl)}" fill="url(#hatch)"/><polygon data-role="excluded-region" points="{pts11(br)}" fill="#ededed"/><polygon points="{pts11(br)}" fill="url(#hatch)"/>
<line x1="{u0[0]:.3f}" y1="{u0[1]:.3f}" x2="{u1[0]:.3f}" y2="{u1[1]:.3f}" stroke="#245a88" stroke-width="3" data-role="boundary-upper"/><line x1="{l0[0]:.3f}" y1="{l0[1]:.3f}" x2="{l1[0]:.3f}" y2="{l1[1]:.3f}" stroke="#245a88" stroke-width="3" data-role="boundary-lower"/>
<rect x="{x0}" y="{y0}" width="{side}" height="{side}" fill="none" stroke="#111" stroke-width="2.5" data-role="unit-square"/>
<text x="{x0-4}" y="{y0+side+27}" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#111">0</text><text x="{x0+side}" y="{y0+side+27}" text-anchor="middle" font-family="sans-serif" font-size="17" fill="#111">1</text><text x="{x0-15}" y="{y0+side+4}" text-anchor="end" font-family="sans-serif" font-size="17" fill="#111">x</text><text x="{x0-15}" y="{y0+12}" text-anchor="end" font-family="sans-serif" font-size="17" fill="#111">y</text>
<text x="{x0-12}" y="{u0[1]+5:.2f}" text-anchor="end" font-family="sans-serif" font-size="16" fill="#245a88">1/3</text><text x="{u1[0]:.2f}" y="{y0-10}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#245a88">2/3</text><text x="{l1[0]+8:.2f}" y="{l1[1]+5:.2f}" font-family="sans-serif" font-size="16" fill="#245a88">2/3</text><text x="{l0[0]:.2f}" y="{y0+side+25}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#245a88">1/3</text>
<rect x="430" y="78" width="310" height="275" rx="16" fill="#f7f9fc" stroke="#c5d3e1" stroke-width="2"/><text x="456" y="116" font-family="sans-serif" font-size="19" font-weight="700" fill="#111">유효 영역</text><text x="456" y="151" font-family="sans-serif" font-size="18" fill="#111">|x − y| ≤ 1/3</text><text x="456" y="194" font-family="sans-serif" font-size="17" fill="#333">제외되는 모서리 삼각형 2개</text><text x="456" y="225" font-family="sans-serif" font-size="17" fill="#333">각 직각변의 길이: 2/3</text><line x1="456" y1="246" x2="710" y2="246" stroke="#c8c8c8"/><text x="456" y="282" font-family="sans-serif" font-size="18" fill="#111">1 − 2 × 1/2 × (2/3)²</text><text x="456" y="321" font-family="sans-serif" font-size="22" font-weight="700" fill="#111">= 5/9</text></svg>'''
(ASSET_DIR/'q11-solution.svg').write_text(svg11,encoding='utf-8')

# q12, source-verified six columns by three rows.
gx,gy,cell=70.0,70.0,55.0
def p12(x,y): return (gx+cell*x,gy+cell*(3-y))
A,B,Q,P=p12(0,0),p12(6,3),p12(4,1),p12(4,2)
vlines=''.join(f'<line x1="{p12(i,0)[0]:.1f}" y1="{gy:.1f}" x2="{p12(i,0)[0]:.1f}" y2="{p12(i,0)[1]:.1f}" data-grid-vertical="{i}"/>' for i in range(7))
hlines=''.join(f'<line x1="{gx:.1f}" y1="{p12(0,j)[1]:.1f}" x2="{p12(6,j)[0]:.1f}" y2="{p12(6,j)[1]:.1f}" data-grid-horizontal="{j}"/>' for j in range(4))
svg12=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 790 390" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-geometry-preset="STANDARD_LANDSCAPE" data-visual-provenance="R1_CODEX_SOURCE_FACTS">
<title id="title">금지 도로를 지나는 최단 경로를 빼기</title><desc id="desc">6열 3행 도로망에서 A에서 B로 가는 최단 경로 중 세로 간선 QP를 지나는 15개 경로를 전체 84개에서 뺀다.</desc><rect width="790" height="390" fill="#fff"/><text x="34" y="35" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="22" font-weight="700" fill="#111">금지 도로를 지나는 경로를 제외</text>
<g stroke="#777" stroke-width="2">{vlines}{hlines}</g><line id="forbidden-edge" x1="{Q[0]:.1f}" y1="{Q[1]:.1f}" x2="{P[0]:.1f}" y2="{P[1]:.1f}" stroke="#b3261e" stroke-width="8" stroke-linecap="round" data-role="forbidden-edge" data-math-from="4,1" data-math-to="4,2"/>
<circle cx="{Q[0]:.1f}" cy="{Q[1]:.1f}" r="6" fill="#111"/><circle cx="{P[0]:.1f}" cy="{P[1]:.1f}" r="6" fill="#111"/><text x="{Q[0]-15:.1f}" y="{Q[1]+6:.1f}" text-anchor="end" font-family="sans-serif" font-size="17" fill="#111">Q</text><text x="{P[0]-15:.1f}" y="{P[1]+6:.1f}" text-anchor="end" font-family="sans-serif" font-size="17" fill="#111">P</text><circle cx="{A[0]:.1f}" cy="{A[1]:.1f}" r="5" fill="#111"/><circle cx="{B[0]:.1f}" cy="{B[1]:.1f}" r="5" fill="#111"/><text x="{A[0]-12:.1f}" y="{A[1]+24:.1f}" font-family="sans-serif" font-size="18" font-weight="700" fill="#111">A</text><text x="{B[0]+8:.1f}" y="{B[1]+6:.1f}" font-family="sans-serif" font-size="18" font-weight="700" fill="#111">B</text><text x="{Q[0]+20:.1f}" y="{(P[1]+Q[1])/2+6:.1f}" font-family="sans-serif" font-size="16" font-weight="700" fill="#b3261e">금지</text>
<rect x="455" y="62" width="305" height="270" rx="16" fill="#f7f9fc" stroke="#c5d3e1" stroke-width="2"/><text x="480" y="102" font-family="sans-serif" font-size="18" font-weight="700" fill="#111">전체 최단 경로</text><text x="480" y="135" font-family="sans-serif" font-size="19" fill="#111">C(9,3) = 84</text><line x1="480" y1="157" x2="730" y2="157" stroke="#c8c8c8"/><text x="480" y="192" font-family="sans-serif" font-size="17" fill="#111">A → Q: C(5,1) = 5</text><text x="480" y="224" font-family="sans-serif" font-size="17" fill="#111">P → B: C(3,1) = 3</text><text x="480" y="256" font-family="sans-serif" font-size="17" fill="#111">금지 도로 통과: 5 × 3 = 15</text><text x="480" y="300" font-family="sans-serif" font-size="22" font-weight="700" fill="#111">84 − 15 = 69</text></svg>'''
(ASSET_DIR/'q12-solution.svg').write_text(svg12,encoding='utf-8')

# q13, exact regular-octagon coordinates and four diameters.
cx,cy,r=265.0,235.0,145.0
points=[(cx+r*cos(-pi/2+i*pi/4),cy+r*sin(-pi/2+i*pi/4)) for i in range(8)]
dash=['none','9 5','3 5','12 4 2 4']
diameters=''.join(f'<line x1="{points[i][0]:.3f}" y1="{points[i][1]:.3f}" x2="{points[i+4][0]:.3f}" y2="{points[i+4][1]:.3f}" stroke="#245a88" stroke-width="2.5" stroke-dasharray="{dash[i]}" data-role="diameter" data-pair="{i},{i+4}"/>' for i in range(4))
vertices=''.join(f'<circle cx="{x:.3f}" cy="{y:.3f}" r="6.5" fill="#111" data-role="equally-spaced-point" data-index="{i}"/>' for i,(x,y) in enumerate(points))
svg13=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 430" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="title desc" data-geometry-preset="STANDARD_LANDSCAPE" data-visual-provenance="R1_CODEX_SOURCE_FACTS">
<title id="title">원 위의 8점에서 지름을 고르는 직각삼각형</title><desc id="desc">같은 간격의 8개 원주점에서 마주 보는 점 2개를 고르면 지름이며, 네 지름 각각에 대해 나머지 6점이 세 번째 꼭짓점 후보가 된다.</desc><rect width="780" height="430" fill="#fff"/><text x="34" y="35" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="22" font-weight="700" fill="#111">직각삼각형의 빗변은 원의 지름</text>
<circle cx="{cx:.3f}" cy="{cy:.3f}" r="{r:.3f}" fill="none" stroke="#333" stroke-width="2.5" data-role="circumcircle"/>{diameters}{vertices}<circle cx="{cx:.3f}" cy="{cy:.3f}" r="4" fill="#245a88"/>
<rect x="485" y="68" width="265" height="278" rx="16" fill="#f7f9fc" stroke="#c5d3e1" stroke-width="2"/><text x="510" y="108" font-family="sans-serif" font-size="19" font-weight="700" fill="#111">원주각과 지름</text><text x="510" y="148" font-family="sans-serif" font-size="17" fill="#111">마주 보는 점 2개</text><text x="510" y="178" font-family="sans-serif" font-size="17" fill="#111">→ 지름 4개</text><text x="510" y="219" font-family="sans-serif" font-size="17" fill="#111">지름마다 세 번째 점 6개</text><text x="510" y="251" font-family="sans-serif" font-size="18" fill="#111">직각삼각형: 4 × 6 = 24</text><line x1="510" y1="271" x2="725" y2="271" stroke="#c8c8c8"/><text x="510" y="306" font-family="sans-serif" font-size="17" fill="#111">전체: C(8,3) = 56</text><text x="510" y="335" font-family="sans-serif" font-size="20" font-weight="700" fill="#111">확률 = 3/7</text></svg>'''
(ASSET_DIR/'q13-solution.svg').write_text(svg13,encoding='utf-8')

facts={'q11':{'backend':'STANDARD_SVG','mathDomain':'unit square [0,1]^2','boundaries':{'y=x+1/3':[list(u0),list(u1)],'y=x-1/3':[list(l0),list(l1)]},'validArea':5/9,'excludedTriangles':2,'legLength':2/3},'q12':{'backend':'MINIMAL_EXAM_DIAGRAM','gridColumns':6,'gridRows':3,'start':[0,0],'finish':[6,3],'forbiddenEdge':{'Q':[4,1],'P':[4,2]},'totalShortestPaths':84,'pathsThroughForbiddenEdge':15,'validPaths':69},'q13':{'backend':'STANDARD_SVG','center':[cx,cy],'radius':r,'points':[list(p) for p in points],'diameterPairs':[[i,i+4] for i in range(4)],'totalTriples':56,'rightTriangles':24,'probability':'3/7'}}
(EVIDENCE_DIR/'R1_18_geumdang_visual_geometry_expected.json').write_text(json.dumps(facts,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'written':[str(ASSET_DIR/f'q{i}-solution.svg') for i in [11,12,13]],'facts':facts},ensure_ascii=False))
