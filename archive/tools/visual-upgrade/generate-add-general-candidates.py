from __future__ import annotations

import hashlib
import html
import json
import math
from pathlib import Path

ROOT = Path.cwd()
REPORT = ROOT / "reports" / "h2-s1-algebra-visual-upgrade"
OUT = REPORT / "candidates" / "add-general"
OUT.mkdir(parents=True, exist_ok=True)

FONT = "'STIX Two Math','Malgun Gothic',serif"


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def xy(x: float, y: float, box=(70, 30, 650, 344), xr=(-5, 5), yr=(-4, 4)) -> tuple[float, float]:
    x0, y0, w, h = box
    xa, xb = xr
    ya, yb = yr
    return x0 + (x - xa) / (xb - xa) * w, y0 + (yb - y) / (yb - ya) * h


def points(fn, xa, xb, ya=-4, yb=4, n=401):
    out = []
    for i in range(n):
        x = xa + (xb - xa) * i / (n - 1)
        try:
            y = fn(x)
        except (ArithmeticError, ValueError, OverflowError):
            continue
        if not math.isfinite(y):
            continue
        if y < ya - 0.25 or y > yb + 0.25:
            continue
        sx, sy = xy(x, y, xr=(xa, xb), yr=(ya, yb))
        out.append(f"{sx:.2f},{sy:.2f}")
    return " ".join(out)


def line(x1, y1, x2, y2, cls="axis"):
    return f'<line class="{cls}" x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}"/>'


def text(x, y, value, cls="label", anchor="start"):
    return f'<text class="{cls}" x="{x:.2f}" y="{y:.2f}" text-anchor="{anchor}">{esc(value)}</text>'


def axes(xa, xb, ya, yb, box=(70, 30, 650, 344)):
    x0, y0, w, h = box
    sx0, sy0 = xy(0, 0, box, (xa, xb), (ya, yb))
    return line(x0, sy0, x0 + w, sy0) + line(sx0, y0, sx0, y0 + h)


def polyline(pts, cls="curve"):
    return f'<polyline class="{cls}" points="{pts}"/>'


def base_svg(title, desc, body, facts, uid):
    canonical = json.dumps(facts, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    digest = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
    metadata = esc(json.dumps(facts, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420" width="720" height="420" preserveAspectRatio="xMidYMid meet" data-graph-style-version="AP_GRAPH_PRINT_V1_1_DRAFT" data-visual-provenance="deterministic-python-fact-model-candidate" data-question-uid="{esc(uid)}" data-fact-hash="{digest}">
<title>{esc(title)}</title><desc>{esc(desc)}</desc><metadata data-visual-facts="{metadata}"/>
<style>.axis{{stroke:#111;stroke-width:1.4;fill:none}}.guide{{stroke:#777;stroke-width:1;stroke-dasharray:5 4;fill:none}}.curve{{stroke:#111;stroke-width:2.3;fill:none;stroke-linecap:round}}.curve2{{stroke:#555;stroke-width:2;fill:none;stroke-linecap:round}}.mark{{stroke:#1b4f9c;stroke-width:2;fill:none}}.point{{fill:#111}}.region{{fill:#d9e8ff;stroke:#1b4f9c;stroke-width:1}}.label{{font:14px {FONT};fill:#111}}.small{{font:12px {FONT};fill:#333}}</style><rect width="100%" height="100%" fill="white"/>{body}
</svg>
''', digest


SPECS = [
    {"slug":"25_geumdang_final_q17_cycle","questionUid":"25_금당고_1학기_기말_고2_수학I::q17","sourceJsPath":"archive/exams/original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js","id":17,"kind":"cycle","facts":{"type":"state_cycle","cycle":[8,2,5],"period":3,"first_period_index":3,"a1_values":[17,80,29,128]},"anchors":["a_{n+3}","8\\to2\\to5","254"]},
    {"slug":"25_jeil_final_q15_trig_interval","questionUid":"25_제일고_1학기_기말_고2_수학I::q15","sourceJsPath":"archive/exams/original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js","id":15,"kind":"trig_interval","facts":{"type":"trig_inequality","sin_interval":"(π/4,3π/4)","cos_interval":"(π/3,5π/3)","intersection":"(π/3,3π/4)","ab":"1/4"},"anchors":["sin x","cos x","ab"]},
    {"slug":"25_hyochon_final_q23_two_circles","questionUid":"25_효천고_1학기_기말_고2_대수::q23","sourceJsPath":"archive/exams/original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js","id":23,"kind":"two_circles","facts":{"type":"equal_radius_geometry","radius_symbol":"R","AB":2,"O1D":"4√2","target":14,"collinearities":["A,O1,O2","C,O2,D"],"angle_relation":"θ3=θ1+θ2"},"anchors":["O_1","O_2","AB","14"]},
    {"slug":"23_jungang_q4_quadratic","questionUid":"23_중앙여고_1학기_중간_고2_대수::q4","sourceJsPath":"archive/exams/original/high/h2/1mid/23_중앙여고_1학기_중간_고2_대수.js","id":4,"kind":"quadratic","facts":{"type":"log_quadratic","substitution":"t=log₂x","quadratic":"t²−2t−log₂k≥0","discriminant":"D≤0","k_range":"0<k≤1/2"},"anchors":["log_2","판별식","1/2"]},
    {"slug":"23_hanyoung_q3_log_shift","questionUid":"23_한영고_1학기_중간_고2_대수::q3","sourceJsPath":"archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js","id":3,"kind":"log_shift","facts":{"type":"log_graph","expression":"y=log_{1/3}(x−2)−1","domain":"x>2","asymptote":"x=2","monotonicity":"decreasing","point":[3,-1],"not_translation_from_base3":True},"anchors":["1/3","x=2","(3, -1)"]},
    {"slug":"23_hanyoung_q9_graph_inequality","questionUid":"23_한영고_1학기_중간_고2_대수::q9","sourceJsPath":"archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js","id":9,"kind":"graph_compare","facts":{"type":"graph_inequality","reduction":"f(x)>g(x)","intersections":[-3,-1,2],"solution":"(-3,-1)∪(2,∞)"},"anchors":["2^{-f(x)}","-3","-1","2"]},
    {"slug":"23_hanyoung_q12_exp_compare","questionUid":"23_한영고_1학기_중간_고2_대수::q12","sourceJsPath":"archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js","id":12,"kind":"exp_compare","facts":{"type":"exponential_order","domain":"x<0","relation":"a<b","statements":["a>1⇒b>1","0<a<1 does not force b>1","0<b<1⇒ab<1"],"correct":"ㄱ,ㄷ"},"anchors":["x < 0","a^x","b^x","ab < 1"]},
    {"slug":"23_hanyoung_q13_cos_params","questionUid":"23_한영고_1학기_중간_고2_대수::q13","sourceJsPath":"archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js","id":13,"kind":"cos_params","facts":{"type":"cosine_parameters","expression":"y=2cos((4/5)(x−5π/8))+1","amplitude":2,"midline":1,"period":"5π/2","phase":"5π/8","value":13},"anchors":["5ab","최댓값","5/2","5/8"]},
    {"slug":"24_geumdang_q18_log_transform","questionUid":"24_금당고_1학기_중간_고2_대수::q18","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":18,"kind":"log_transform","facts":{"type":"log_transform","start":"y=log₂x","vertical_shift":-3,"reflection":"x-axis","result":"y=log_{1/2}(x/8)","a":"1/2","b":"1/8","sum":"5/8"},"anchors":["log_2 x","-3","1/2","1/8"]},
    {"slug":"24_geumdang_q21_exp_log_triangle","questionUid":"24_금당고_1학기_중간_고2_대수::q21","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":21,"kind":"exp_log_triangle","facts":{"type":"exp_log_triangle","translated_line":"y=8−u","midpoint_x":"11/2","A":["7/2","9/2"],"C":[3,0],"a":"81/4","area":10},"anchors":["81/4","11/2","C(3, 0)"]},
    {"slug":"25_maesan_q11_sine_params","questionUid":"25_매산고_1학기_중간_고2_대수::q11","sourceJsPath":"archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js","id":11,"kind":"sine_params","facts":{"type":"sine_parameters","expression":"y=2sin(2x+3π/2)+1","amplitude":2,"midline":1,"period":"π","max_points":["π/2","3π/2"],"value":3},"anchors":["a\\sin","최댓값","주기"]},
    {"slug":"25_maesan_q18_sector_max","questionUid":"25_매산고_1학기_중간_고2_대수::q18","sourceJsPath":"archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js","id":18,"kind":"sector_max","facts":{"type":"sector_annulus","perimeter":48,"variable":"x=r₂−r₁","area":"−x²+24x","max_x":12,"max_area":144},"anchors":["부채꼴","48","12"]},
    {"slug":"25_suncheon_q9_log_inverse","questionUid":"25_순천고_1학기_중간_고2_대수::q9","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":9,"kind":"log_inverse","facts":{"type":"log_graph","expression":"y=log₃(x−1)","domain":"x>1","asymptote":"x=1","inverse":"y=3^x+1","monotonicity":"increasing"},"anchors":["log_3(x-1)","x>1","3^x+1"]},
    {"slug":"25_suncheon_woman_q3_exp_shift","questionUid":"25_순천여고_1학기_중간_고2_대수::q3","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js","id":3,"kind":"exp_shift","facts":{"type":"exp_transform","original":"(1/2)^x+1","after_y_reflection":"2^x+1","target":"2^(x−3)+5","horizontal_shift":3,"vertical_shift":4,"product":12},"anchors":["1/2","2^{x-3}","12"]},
    {"slug":"25_suncheon_woman_q8_inverse_point","questionUid":"25_순천여고_1학기_중간_고2_대수::q8","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js","id":8,"kind":"inverse_point","facts":{"type":"inverse_graph","function":"f(x)=log₂(x−a)+2","given_inverse_point":["a+4","a+2"],"mapped_original_point":["a+2","a+4"],"a":-1},"anchors":["역함수","a+4","a+2","-1"]},
    {"slug":"25_suncheon_woman_q10_log_statements","questionUid":"25_순천여고_1학기_중간_고2_대수::q10","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js","id":10,"kind":"log_statements","facts":{"type":"log_graph","expression":"y=2log(x+1)+1","point":[0,1],"asymptote":"x=−1","quadrant_iv":False,"true_statements":["ㄱ","ㄷ"]},"anchors":["2\\log","(0, 1)","x+1"]},
    {"slug":"25_suncheon_woman_q18_periodic_log","questionUid":"25_순천여고_1학기_중간_고2_대수::q18","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js","id":18,"kind":"periodic_log","facts":{"type":"periodic_vs_log","period":2,"intersection_count":98,"base":99,"n":33,"peak_height":1},"anchors":["f(x+2)","98","33"]},
    {"slug":"25_suncheon_woman_q19_piecewise_roots","questionUid":"25_순천여고_1학기_중간_고2_대수::q19","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js","id":19,"kind":"piecewise_roots","facts":{"type":"piecewise_graph","right_root":8,"left_root":3,"AB":5,"a":2,"b":"2^(−1/3)","value":4},"anchors":["f(12)","AB","(ab)^3","4"]},
    {"slug":"25_jeil_mid_q1_exp_basic","questionUid":"25_제일고_1학기_중간_고2_대수::q1","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":1,"kind":"exp_basic","facts":{"type":"exponential_graph","expression":"y=a^x","domain":"all real","range":"y>0","point":[0,1],"asymptote":"y=0","wrong_statement":"y-axis asymptote"},"anchors":["a^x","실수 전체","점근선"]},
    {"slug":"25_jeil_mid_q7_log_asymptote","questionUid":"25_제일고_1학기_중간_고2_대수::q7","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":7,"kind":"log_line","facts":{"type":"log_asymptote","log_expression":"y=log₃(x−1)","asymptote":"x=1","line":"y=2^(−x)+t","intersection_on_x_axis":[1,0],"t":"−1/2"},"anchors":["점근선","x=1","-1/2"]},
    {"slug":"25_hyochon_mid_q7_exp_reflect","questionUid":"25_효천고_1학기_중간_고2_대수::q7","sourceJsPath":"archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js","id":7,"kind":"exp_reflect","facts":{"type":"exponential_transform","expression":"y=2^(−x)−3","origin":"y=2^x","reflection":"y-axis","vertical_shift":-3,"asymptote":"y=−3","wrong_statement":"x-axis reflection"},"anchors":["2^{-x}","y=-3","x축"]},
    {"slug":"25_hyochon_mid_q11_abs_exp","questionUid":"25_효천고_1학기_중간_고2_대수::q11","sourceJsPath":"archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js","id":11,"kind":"abs_exp","facts":{"type":"absolute_exponential","expression":"y=2^{|x−2|}+3","minimum":4,"minimum_at":2,"no_intersection":"k<4"},"anchors":["|x-2|","최솟값 4","k<4"]},
]


def graph_body(kind, f):
    if kind == "cycle":
        vals = [8, 2, 5]
        body = axes(0, 4, 0, 10)
        coords = [(150, 170), (360, 90), (570, 170)]
        for i, (x, y) in enumerate(coords):
            nx, ny = coords[(i + 1) % 3]
            body += f'<circle class="point" cx="{x}" cy="{y}" r="7"/>{text(x, y-15, vals[i], "label", "middle")}'
            body += f'<path class="mark" d="M{x+10},{y} Q{(x+nx)/2},{(y+ny)/2-35} {nx-10},{ny}" marker-end="url(#arrow)"/>'
        body += text(360, 310, "3주기: 8 → 2 → 5 → 8; a₃부터 시작", "label", "middle")
        return body
    if kind == "trig_interval":
        body = text(360, 30, "삼각부등식 공통해", "label", "middle")
        y1, y2, y3 = 110, 205, 300
        for y, label, a, b in [(y1,"sin x > √2/2",math.pi/4,3*math.pi/4),(y2,"cos x < 1/2",math.pi/3,5*math.pi/3),(y3,"공통: π/3 < x < 3π/4",math.pi/3,3*math.pi/4)]:
            body += line(90,y,650,y)+text(90,y-18,label,"label")
            sx1=90+560*(a/(2*math.pi)); sx2=90+560*(b/(2*math.pi))
            body += f'<line class="mark" x1="{sx1:.1f}" y1="{y}" x2="{sx2:.1f}" y2="{y}" stroke-width="8"/>'
            body += text(sx1,y+28,"π/4" if abs(a-math.pi/4)<.01 else "π/3","small","middle")
            body += text(sx2,y+28,"3π/4" if abs(b-3*math.pi/4)<.01 else "5π/3","small","middle")
        return body
    if kind == "two_circles":
        body = line(150,220,540,220,"guide")
        body += '<circle class="mark" cx="240" cy="220" r="150"/><circle class="mark" cx="450" cy="220" r="150"/>'
        body += line(90,220,240,220,"guide")+line(240,220,450,220,"guide")
        body += '<line class="guide" x1="240" y1="220" x2="145" y2="125"/><line class="guide" x1="450" y1="220" x2="585" y2="125"/>'
        for x,y,l in [(240,220,"O₁"),(450,220,"O₂"),(90,220,"A"),(145,125,"B"),(145,315,"C"),(585,125,"D")]:
            body += f'<circle class="point" cx="{x}" cy="{y}" r="5"/>'+text(x+8,y-8,l,"label")
        body += text(360,40,"R=O₁O₂=O₁A=O₂D,  C–O₂–D", "label","middle")+text(360,390,"CO₂·O₂D = 14", "label","middle")
        return body
    if kind == "quadratic":
        xa, xb, ya, yb = -1, 3, -3, 5
        body = axes(xa,xb,ya,yb)
        body += polyline(points(lambda t:t*t-2*t,xa,xb,ya,yb),"curve")
        body += line(*xy(0,0,xr=(xa,xb),yr=(ya,yb)),*xy(0,0,xr=(xa,xb),yr=(ya,yb)),"guide") if False else ""
        body += text(360,40,"t = log₂x,  t²−2t−log₂k ≥ 0", "label","middle")+text(360,390,"D≤0  ⇒  0<k≤1/2", "label","middle")
        return body
    if kind == "log_shift":
        xa, xb, ya, yb = 1.1, 8, -5, 2
        body = axes(xa,xb,ya,yb)
        body += line(*xy(2,ya,xr=(xa,xb),yr=(ya,yb)),*xy(2,yb,xr=(xa,xb),yr=(ya,yb)),"guide")
        body += polyline(points(lambda x: math.log(x-2,1/3)-1,xa,xb,ya,yb),"curve")
        px,py=xy(3,-1,xr=(xa,xb),yr=(ya,yb)); body += f'<circle class="point" cx="{px:.2f}" cy="{py:.2f}" r="5"/>'
        return body+text(360,40,"y=log₁⁄₃(x−2)−1  ↓  x=2", "label","middle")
    if kind == "graph_compare":
        xa,xb,ya,yb=-4,4,-3,4; body=axes(xa,xb,ya,yb)
        body += polyline(points(lambda x: 0.25*(x+3)*(x+1)*(x-2),xa,xb,ya,yb),"curve")+polyline(points(lambda x:0,xa,xb,ya,yb),"curve2")
        for x in [-3,-1,2]:
            sx,sy=xy(x,0,xr=(xa,xb),yr=(ya,yb)); body += f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="4"/>'
        return body+text(360,40,"f(x)>g(x)  ⇔  −3<x<−1 또는 x>2", "label","middle")
    if kind == "exp_compare":
        body=axes(-4,2,0,8)
        body += polyline(points(lambda x:1.6**x,-4,2,0,8),"curve")+polyline(points(lambda x:2.5**x,-4,2,0,8),"curve2")
        return body+text(360,40,"x<0에서 a^x>b^x ⇔ a<b", "label","middle")+text(360,390,"ㄱ, ㄷ", "label","middle")
    if kind == "cos_params" or kind == "sine_params":
        expr = "y=2cos((4/5)(x−5π/8))+1" if kind=="cos_params" else "y=2sin(2x+3π/2)+1"
        fn = (lambda x: 2*math.cos((4/5)*(x-5*math.pi/8))+1) if kind=="cos_params" else (lambda x:2*math.sin(2*x+3*math.pi/2)+1)
        xa,xb=-math.pi,3*math.pi; body=axes(xa,xb,-2,4)
        body += polyline(points(fn,xa,xb,-2,4),"curve")+line(70,sy if False else 0,0,0,"guide") if False else ""
        return body+text(360,40,expr,"label","middle")+text(360,390,"최대 3, 최소 −1, 주기/위상으로 계수 확정", "small","middle")
    if kind == "log_transform":
        body=axes(0.1,10,-5,3)
        body += polyline(points(lambda x:math.log(x,2),0.1,10,-5,3),"curve2")+polyline(points(lambda x:-math.log(x,2)+3,0.1,10,-5,3),"curve")
        body += line(*xy(8,-5,xr=(0.1,10),yr=(-5,3)),*xy(8,3,xr=(0.1,10),yr=(-5,3)),"guide")
        return body+text(360,40,"y=log₂x → down 3 → x-axis reflection", "label","middle")+text(360,390,"result: log₁⁄₂(x/8),  a+b=5/8", "small","middle")
    if kind == "exp_log_triangle":
        body=axes(2,9,0,8)
        body += line(*xy(2,6,xr=(2,9),yr=(0,8)),*xy(9,0,xr=(2,9),yr=(0,8)),"guide")
        body += polyline(points(lambda x:(81/4)**(x-3),2,6,0,8),"curve")+polyline(points(lambda x:math.log(x-3,81/4),3.01,9,0,8),"curve2")
        ax,ay=xy(3.5,4.5,xr=(2,9),yr=(0,8)); cx,cy=xy(3,0,xr=(2,9),yr=(0,8))
        body += f'<circle class="point" cx="{ax:.2f}" cy="{ay:.2f}" r="5"/>{text(ax+8,ay,"A","label")}<circle class="point" cx="{cx:.2f}" cy="{cy:.2f}" r="5"/>{text(cx+8,cy,"C","label")}'
        return body+text(360,40,"A=(7/2,9/2), C=(3,0), a=81/4", "label","middle")
    if kind == "sector_max":
        body='<path class="region" d="M170 285 L170 120 A165 165 0 0 1 500 285 Z"/><path class="mark" d="M240 285 L240 165 A120 120 0 0 1 480 285 Z"/>'
        body += line(170,285,500,285,"guide")+text(335,330,"x=r₂−r₁", "label","middle")
        return body+text(360,45,"S=−x²+24x=−(x−12)²+144", "label","middle")+text(360,390,"최대일 때 AC=x=12", "label","middle")
    if kind == "log_inverse":
        body=axes(0.1,8,-3,3)
        body += polyline(points(lambda x:math.log(x-1,3),1.01,8,-3,3),"curve")+polyline(points(lambda x:3**x+1,-2,1.8,-3,3),"curve2")
        body += line(*xy(1,-3,xr=(0.1,8),yr=(-3,3)),*xy(1,3,xr=(0.1,8),yr=(-3,3)),"guide")
        return body+text(360,40,"y=log₃(x−1)  ↔  y=3ˣ+1", "label","middle")
    if kind == "exp_shift":
        body=axes(-4,7,0,13)
        body += polyline(points(lambda x:2**x+1,-4,4,0,13),"curve2")+polyline(points(lambda x:2**(x-3)+5,-2,7,0,13),"curve")
        return body+text(360,40,"reflection: (1/2)ˣ+1 → 2ˣ+1 → 2⁽ˣ⁻³⁾+5", "label","middle")+text(360,390,"a=3, b=4, ab=12", "small","middle")
    if kind == "inverse_point":
        body=axes(-4,5,-4,5); body += line(*xy(-4,-4,xr=(-4,5),yr=(-4,5)),*xy(5,5,xr=(-4,5),yr=(-4,5)),"guide")
        body += polyline(points(lambda x:math.log(x+1,2)+2,-.99,5,-4,5),"curve")
        return body+text(360,40,"inverse point swaps (a+4,a+2) ↔ (a+2,a+4)", "label","middle")+text(360,390,"a=−1", "label","middle")
    if kind == "log_statements":
        body=axes(-.9,8,-5,5); body += polyline(points(lambda x:2*math.log10(x+1)+1,-.99,8,-5,5),"curve")
        body += line(*xy(-1,-5,xr=(-.9,8),yr=(-5,5)),*xy(-1,5,xr=(-.9,8),yr=(-5,5)),"guide")
        return body+text(360,40,"y=2log(x+1)+1; (0,1); asymptote x=−1", "label","middle")+text(360,390,"true: ㄱ, ㄷ", "small","middle")
    if kind == "periodic_log":
        body=axes(0,12,0,2); pts=[]
        for k in range(6):
            body += f'<path class="curve" d="M{70+k*95:.1f},300 L{70+k*95+47.5:.1f},160 L{70+k*95+95:.1f},300"/>'
        body += polyline(points(lambda x:math.log(x,99),1,12,0,2),"curve2")
        return body+text(360,40,"period 2 sawtooth vs log₉₉x", "label","middle")+text(360,390,"98 intersections ⇒ 3n=99 ⇒ n=33", "small","middle")
    if kind == "piecewise_roots":
        body=axes(0,10,-3,5); body += polyline(points(lambda x:math.log(x-4,2)-2,6.01,10,-3,5),"curve")+polyline(points(lambda x:2**(x-6)-2,0,6,-3,5),"curve2")
        for x in [3,8]:
            sx,sy=xy(x,0,xr=(0,10),yr=(-3,5)); body += f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>'
        return body+text(360,40,"roots: x=3,8;  AB=5;  a=2", "label","middle")
    if kind == "exp_basic":
        body=axes(-4,4,-1,6); body += polyline(points(lambda x:2**x,-4,4,-1,6),"curve")+line(*xy(-4,0,xr=(-4,4),yr=(-1,6)),*xy(4,0,xr=(-4,4),yr=(-1,6)),"guide")
        return body+text(360,40,"y=aˣ: domain ℝ, range y>0, asymptote y=0", "label","middle")
    if kind == "log_line":
        body=axes(-.5,5,-3,3); body += polyline(points(lambda x:math.log(x-1,3),1.01,5,-3,3),"curve")+polyline(points(lambda x:2**(-x)-.5,-.5,5,-3,3),"curve2")
        body += line(*xy(1,-3,xr=(-.5,5),yr=(-3,3)),*xy(1,3,xr=(-.5,5),yr=(-3,3)),"guide")
        return body+text(360,40,"asymptote x=1, line through (1,0) ⇒ t=−1/2", "label","middle")
    if kind == "exp_reflect":
        body=axes(-4,4,-4,6); body += polyline(points(lambda x:2**(-x)-3,-4,4,-4,6),"curve")+line(*xy(-4,-3,xr=(-4,4),yr=(-4,6)),*xy(4,-3,xr=(-4,4),yr=(-4,6)),"guide")
        return body+text(360,40,"y=2⁻ˣ−3: y-axis reflection + down 3", "label","middle")
    if kind == "abs_exp":
        body=axes(-2,6,3,15); body += polyline(points(lambda x:2**abs(x-2)+3,-2,6,3,15),"curve")
        sx,sy=xy(2,4,xr=(-2,6),yr=(3,15)); body += f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>'
        return body+text(360,40,"y=2^{|x−2|}+3, minimum 4 at x=2", "label","middle")+text(360,390,"no intersection: k<4", "small","middle")
    raise ValueError(kind)


def main():
    records = []
    for spec in SPECS:
        body = graph_body(spec["kind"], spec["facts"])
        svg, digest = base_svg(spec["slug"], spec["kind"], body, spec["facts"], spec["questionUid"])
        ref = (OUT / (spec["slug"] + ".svg")).relative_to(ROOT).as_posix()
        (ROOT / ref).write_text(svg, encoding="utf-8")
        records.append({**spec, "candidateRef": ref, "factHash": digest, "v1":"PENDING", "v2":"PENDING", "v3":"PENDING", "status":"CANDIDATE_GENERATED"})
    (OUT / "add_general_specs.json").write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"generated": len(records), "out": str(OUT)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
