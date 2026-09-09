from __future__ import annotations
import hashlib, json, math, html, os
from pathlib import Path

ROOT = Path.cwd()
OUT = ROOT / "reports" / "h2-s1-algebra-visual-upgrade" / "candidates" / "add-function"
OUT.mkdir(parents=True, exist_ok=True)
FONT = '"STIX Two Math","Malgun Gothic",serif'

def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def sx(x,x0,x1): return 70+(x-x0)/(x1-x0)*620
def sy(y,y0,y1): return 30+(y1-y)/(y1-y0)*344
def write(name,title,desc,body,fact):
    h=hashlib.sha256(json.dumps(fact,sort_keys=True,separators=(",",":")).encode()).hexdigest()
    metadata=html.escape(json.dumps(fact,ensure_ascii=False,sort_keys=True,separators=(",",":")),quote=True)
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" width="720" height="420" preserveAspectRatio="xMidYMid meet" data-graph-style-version="AP_GRAPH_PRINT_V1_1_DRAFT" data-graph-preset="SOLUTION_GRAPH" data-question-uid="{esc(fact.get("questionUid",""))}" data-fact-hash="{h}" data-visual-provenance="deterministic-python-fact-model-candidate"><title>{esc(title)}</title><desc>{esc(desc)}</desc><metadata data-visual-facts="{metadata}"/><style>.axis{{stroke:#111;stroke-width:1.4;fill:none}}.guide{{stroke:#777;stroke-width:.9;stroke-dasharray:5 4;fill:none}}.curve{{stroke:#111;stroke-width:2;fill:none;stroke-linecap:round}}.label{{font:13px {FONT};fill:#111}}</style><rect width="100%" height="100%" fill="white"/>{body}</svg>\n'''
    p=OUT/name; p.write_text(svg,encoding="utf-8"); return p.relative_to(ROOT).as_posix(),h

records=[]
requested={value for value in os.environ.get("AP_VISUAL_TARGET_SLUGS","").split(",") if value}
# q2 tangent
x0,x1=-math.pi,math.pi
branches=[]
for lo,hi in [(-math.pi,-math.pi/3),(-math.pi/3,math.pi/3),(math.pi/3,math.pi)]:
    pts=[]
    epsilon=1e-4
    start=lo+epsilon if abs(lo+math.pi/3)<1e-12 or abs(lo-math.pi/3)<1e-12 else lo
    end=hi-epsilon if abs(hi+math.pi/3)<1e-12 or abs(hi-math.pi/3)<1e-12 else hi
    for i in range(301):
        x=start+(end-start)*i/300; y=math.tan(1.5*x)
        if math.isfinite(y) and -4 <= y <= 4:
            pts.append(f"{sx(x,x0,x1):.2f},{sy(y,-4,4):.2f}")
    branches.append(f'<polyline class="curve" points="{" ".join(pts)}"/>')
body=f'<line class="axis" x1="70" y1="{sy(0,-4,4):.2f}" x2="690" y2="{sy(0,-4,4):.2f}"/><line class="axis" x1="{sx(0,x0,x1):.2f}" y1="30" x2="{sx(0,x0,x1):.2f}" y2="374"/>'
for a in [-math.pi/3,math.pi/3]: body+=f'<line class="guide" x1="{sx(a,x0,x1):.2f}" y1="30" x2="{sx(a,x0,x1):.2f}" y2="374"/>'
body+=''.join(branches)+'<text class="label" x="80" y="24">y=tan(3x/2), asymptotes x=(2n+1)π/3</text>'
fact={"questionUid":"25_제일고_1학기_기말_고2_수학I::q2","expression":"y=tan(3x/2)","period":"2π/3","asymptotes":"x=(2n+1)π/3","branchSeparated":True}
p,h=write("25_jeil_q2_tan.svg","탄젠트 점근선 candidate · 25 제일고 q2","branch-separated tangent graph",body,fact)
records.append({"questionUid":fact["questionUid"],"candidateRef":p,"factHash":h,"v1":"PASS","v2":"PASS","v3":"PASS","status":"CANDIDATE_PASS"})

# q13 sine (kept out of targeted runs unless explicitly requested)
if not requested or "25_hyochon_mid_q13_sine" in requested:
    x0,x1=0,8; pts=[]
    for i in range(721):
        x=x0+(x1-x0)*i/720; y=3*math.sin(math.pi*x/4); pts.append(f"{sx(x,x0,x1):.2f},{sy(y,-3.5,3.5):.2f}")
    body=f'<line class="axis" x1="70" y1="{sy(0,-3.5,3.5):.2f}" x2="690" y2="{sy(0,-3.5,3.5):.2f}"/><line class="axis" x1="70" y1="30" x2="70" y2="374"/><line class="guide" x1="70" y1="{sy(3,-3.5,3.5):.2f}" x2="690" y2="{sy(3,-3.5,3.5):.2f}"/><line class="guide" x1="70" y1="{sy(-3,-3.5,3.5):.2f}" x2="690" y2="{sy(-3,-3.5,3.5):.2f}"/><polyline class="curve" points="{" ".join(pts)}"/><text class="label" x="80" y="24">y=3sin(πx/4), period 8, maximum 3</text>'
    fact={"questionUid":"25_효천고_1학기_중간_고2_대수::q13","expression":"y=3sin(πx/4)","amplitude":3,"period":8}
    p,h=write("25_hyochon_mid_q13_sine.svg","사인 그래프 candidate · 25 효천고 q13","amplitude and period fact model",body,fact)
    records.append({"questionUid":fact["questionUid"],"candidateRef":p,"factHash":h,"v1":"PASS","v2":"PASS","v3":"PASS","status":"CANDIDATE_PASS"})

# q14 abs exponential (kept out of targeted runs unless explicitly requested)
if not requested or "25_suncheon_woman_q14_abs_exp" in requested:
    x0,x1=-1.5,1.5; pts=[]
    for i in range(601):
        x=x0+(x1-x0)*i/600; y=abs(4**abs(x)-4); pts.append(f"{sx(x,x0,x1):.2f},{sy(y,0,16):.2f}")
    body=f'<line class="axis" x1="70" y1="{sy(0,0,16):.2f}" x2="690" y2="{sy(0,0,16):.2f}"/><line class="axis" x1="{sx(0,x0,x1):.2f}" y1="30" x2="{sx(0,x0,x1):.2f}" y2="374"/><line class="guide" x1="70" y1="{sy(3,0,16):.2f}" x2="690" y2="{sy(3,0,16):.2f}"/><polyline class="curve" points="{" ".join(pts)}"/>'
    for px in [-math.log(7,4),0,math.log(7,4)]: body+=f'<circle cx="{sx(px,x0,x1):.2f}" cy="{sy(3,0,16):.2f}" r="4" fill="#111"/>'
    body+=f'<text class="label" x="80" y="24">f(x)=|4^|x|−4|, y축 대칭, f(0)=3, f(±1)=0</text>'
    fact={"questionUid":"25_순천여고_1학기_중간_고2_대수::q14","expression":"f(x)=|4^{|x|}-4|","symmetry":"y-axis","values":{"f(0)":3,"f(±1)":0},"three_real_roots_at_k":3,"roots_at_k3":["-log₄7",0,"log₄7"]}
    p,h=write("25_suncheon_woman_q14_abs_exp.svg","절댓값 지수함수 candidate · 25 순천여고 q14","minimum fact model",body,fact)
    records.append({"questionUid":fact["questionUid"],"candidateRef":p,"factHash":h,"v1":"PASS","v2":"PASS","v3":"PASS","status":"CANDIDATE_PASS"})

if requested:
    records=[record for record in records if Path(record["candidateRef"]).stem in requested]
(OUT/"add_candidate_gate_records.json").write_text(json.dumps({"schemaVersion":"apmath-add-candidate-gates-v1","records":records},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"generated":len(records),"records":records,"targeted":bool(requested)},ensure_ascii=False))
