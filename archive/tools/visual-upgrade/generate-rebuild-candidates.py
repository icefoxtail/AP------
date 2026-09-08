from __future__ import annotations

import json
import math
import sys
import importlib.util
from pathlib import Path

HERE = Path(__file__).resolve().parent
module_spec = importlib.util.spec_from_file_location("add_general_helpers", HERE / "generate-add-general-candidates.py")
helpers = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(helpers)
ROOT, REPORT = helpers.ROOT, helpers.REPORT
axes, base_svg, line, polyline, points, text, xy = helpers.axes, helpers.base_svg, helpers.line, helpers.polyline, helpers.points, helpers.text, helpers.xy

OUT = REPORT / "candidates" / "rebuild-general"
OUT.mkdir(parents=True, exist_ok=True)

SPECS = [
    {"slug":"24_geumdang_q16_exp_log_triangle","questionUid":"24_금당고_1학기_중간_고2_대수::q16","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":16,"kind":"triangle_log","facts":{"type":"exp_log_triangle","A":[2,6],"B":[6,2],"C":[8,0],"D":[216,6],"ratio":"BC:CA=2:1","area":428},"anchors":["B=(2,6)","C=(6,2)","428"]},
    {"slug":"24_geumdang_q17_cos_counts","questionUid":"24_금당고_1학기_중간_고2_대수::q17","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":17,"kind":"cos_counts","facts":{"type":"piecewise_cos","k_values":[1,2,3,4,5],"counts":[2,2,1,2,2],"sum":9},"anchors":["a_1+a_2","cos x","9"]},
    {"slug":"24_geumdang_q19_abs_sine_range","questionUid":"24_금당고_1학기_중간_고2_대수::q19","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":19,"kind":"abs_sine","facts":{"type":"absolute_sine","expression":"|6sin2x+3|","f3":7,"target_count":4,"t_range":"3<t<9"},"anchors":["|6\\sin 2x+3|","3<t<9","f(3)"]},
    {"slug":"25_suncheon_q5_exp_shift_graph","questionUid":"25_순천고_1학기_중간_고2_대수::q5","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":5,"kind":"exp_shift_graph","facts":{"type":"exponential_graph","expression":"y=2^(x+2)−2","asymptote":"y=−2","point":[0,2],"a":-2,"b":-2,"product":4},"anchors":["점근선","y=-2","4"]},
    {"slug":"25_suncheon_q13_sector_annulus","questionUid":"25_순천고_1학기_중간_고2_대수::q13","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":13,"kind":"sector_annulus","facts":{"type":"sector_annulus","outer_arc":"2π","inner_arc":"4π/3","area":"5π","angle":"2π/9","answer":"2π/9"},"anchors":["부채꼴","5\\pi","2\\pi/9"]},
    {"slug":"25_suncheon_q24_inverse_graph","questionUid":"25_순천고_1학기_중간_고2_대수::q24","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":24,"kind":"inverse_line","facts":{"type":"shifted_inverse_graph","symmetry":"y=x−2","line":"y=−x+6","C":[0,6],"M":[4,2],"A":[3,3],"B":[5,1],"a":3},"anchors":["M(4,2)","A=(3,3)","a=3"]},
    {"slug":"25_jeil_q13_relation_limit","questionUid":"25_제일고_1학기_중간_고2_대수::q13","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":13,"kind":"relation_limit","facts":{"type":"graph_fact_limit","known":"1<b<a","undetermined":"a versus b²","examples":["(3,2): a<b²","(8,2): a>b²"],"status":"underdetermined"},"anchors":["1<b<a","b^2","조건 불충분"]},
    {"slug":"25_jeil_q18_exp_three_curves","questionUid":"25_제일고_1학기_중간_고2_대수::q18","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":18,"kind":"exp_three_curves","facts":{"type":"three_exponential_curves","P_x_ratio":"1:2","t":"1/3","curves":["t·2^x","2^(−x)","−2^x+4"]},"anchors":["P","Q","1/3"]},
    {"slug":"25_jeil_q19_parabola_log_bound","questionUid":"25_제일고_1학기_중간_고2_대수::q19","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":19,"kind":"parabola_log_bound","facts":{"type":"parabola_log_inequality","function":"f(x)=(x−2)(x−4)","domain":"x<2 or x>4","bound":"0≤x≤6","integer_solutions":[0,1,5,6],"count":4},"anchors":["(2, 0)","(4, 0)","총 4개"]},
    {"slug":"25_jeil_q20_parallelogram","questionUid":"25_제일고_1학기_중간_고2_대수::q20","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":20,"kind":"parallelogram","facts":{"type":"parallelogram","A":[5,5],"B":[2,1.5],"C":[1,-3],"D":[4,0.5],"area":10},"anchors":["평행사변형","넓이","10"]},
    {"slug":"25_hyochon_q5_exp_graph","questionUid":"25_효천고_1학기_중간_고2_대수::q5","sourceJsPath":"archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js","id":5,"kind":"exp_graph_2","facts":{"type":"exponential_graph","asymptote":"y=2","y_intercept":"7/3","expression":"y=3^(x−1)+2","choice":3},"anchors":["점근선","7/3","3^{x-1}"]},
    {"slug":"25_hyochon_q9_sector_paper","questionUid":"25_효천고_1학기_중간_고2_대수::q9","sourceJsPath":"archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js","id":9,"kind":"sector_paper","facts":{"type":"sector_annulus","angle":"2π/3","outer_radius":12,"inner_radius":6,"area":"36π"},"anchors":["2\\pi/3","12","36\\pi"]},
    {"slug":"25_hyochon_q16_quarter_circle_sum","questionUid":"25_효천고_1학기_중간_고2_대수::q16","sourceJsPath":"archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js","id":16,"kind":"quarter_circle","facts":{"type":"quarter_circle_projection","angles":"iπ/18, i=1..8","paired_identity":"cos²θ+cos²(π/2−θ)=1","sum":4},"anchors":["보각","cos^2","4"]},
    {"slug":"25_hyochon_q21_cos_count","questionUid":"25_효천고_1학기_중간_고2_대수::q21","sourceJsPath":"archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js","id":21,"kind":"cos_count","facts":{"type":"cosine_root_count","a":14,"b":13,"period":"1/7","root_count":28,"answer":13},"anchors":["-\\cos a\\pi x","28","13"]},
]


def body(kind, facts):
    if kind == "triangle_log":
        b = axes(0, 10, 0, 8)+line(70,304,650,72,"guide")+line(70,304,650,304,"axis")
        pts = [(2,6),(6,2),(8,0),(6,6)]
        for x,y in pts:
            sx,sy=xy(x,y,xr=(0,10),yr=(0,8)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>{text(sx+8,sy-8,f"({x},{y})","small")}'
        b += line(*xy(2,6,xr=(0,10),yr=(0,8)),*xy(6,6,xr=(0,10),yr=(0,8)),"guide")
        return b+text(360,40,"B=(2,6), C=(6,2), D=(216,6), area=428","label","middle")
    if kind == "cos_counts":
        b=axes(0,2*math.pi,-1.2,1.2); b+=polyline(points(math.cos,0,2*math.pi,-1.2,1.2),"curve")
        return b+text(360,40,"k : 1  2  3  4  5   →   aₖ : 2  2  1  2  2","label","middle")+text(360,390,"합 = 9","label","middle")
    if kind == "abs_sine":
        b=axes(0,2*math.pi,0,10); b+=polyline(points(lambda x:abs(6*math.sin(2*x)+3),0,2*math.pi,0,10),"curve")
        b+=line(70,xy(3,0,xr=(0,2*math.pi),yr=(0,10))[1],650,xy(3,0,xr=(0,2*math.pi),yr=(0,10))[1],"guide")
        return b+text(360,40,"f(x)=|6sin2x+3|, f(3)=7","label","middle")+text(360,390,"f(t)=4  ⇔  3<t<9","small","middle")
    if kind == "exp_shift_graph":
        b=axes(-4,4,-3,6); b+=polyline(points(lambda x:2**(x+2)-2,-4,4,-3,6),"curve")+line(70,xy(-4,-2,xr=(-4,4),yr=(-3,6))[1],650,xy(4,-2,xr=(-4,4),yr=(-3,6))[1],"guide")
        sx,sy=xy(0,2,xr=(-4,4),yr=(-3,6)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>'
        return b+text(360,40,"y=2^(x+2)−2, asymptote y=−2, (0,2)","label","middle")+text(360,390,"a=b=−2 ⇒ ab=4","small","middle")
    if kind == "sector_annulus":
        b='<path class="region" d="M360 300 L150 300 A250 250 0 0 1 576 178 Z"/><path class="mark" d="M360 300 L220 300 A166 166 0 0 1 503 217 Z"/>'
        return b+text(360,45,"호 AB=2π, 호 CD=4π/3, 색칠 넓이=5π","label","middle")+text(360,390,"θ=2π/9","label","middle")
    if kind == "inverse_line":
        b=axes(0,8,0,8); b+=line(*xy(0,6,xr=(0,8),yr=(0,8)),*xy(6,0,xr=(0,8),yr=(0,8)),"mark")+line(*xy(0,2,xr=(0,8),yr=(0,8)),*xy(8,10,xr=(0,8),yr=(0,8)),"guide")
        for x,y,l in [(0,6,"C"),(4,2,"M"),(3,3,"A"),(5,1,"B")]:
            sx,sy=xy(x,y,xr=(0,8),yr=(0,8)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>{text(sx+8,sy-8,l,"label")}'
        return b+text(360,40,"symmetry axis y=x−2; line y=−x+6","label","middle")+text(360,390,"A=(3,3) ⇒ a=3","small","middle")
    if kind == "relation_limit":
        b=text(360,65,"log_b x above log_a x  ⇒  1<b<a","label","middle")
        b+=f'<rect class="region" x="90" y="105" width="540" height="70" rx="10"/><rect class="region" x="90" y="205" width="540" height="70" rx="10"/>'
        b+=text(360,148,"a<b²  →  (a/b)^x−b^x < 0  (x>0)","small","middle")+text(360,248,"a>b²  →  (a/b)^x−b^x > 0  (x>0)","small","middle")
        return b+text(360,350,"a vs b² is not supplied: answer graph is underdetermined","label","middle")
    if kind == "exp_three_curves":
        b=axes(-3,4,-1,5); b+=polyline(points(lambda x:(1/3)*2**x,-3,4,-1,5),"curve")+polyline(points(lambda x:2**(-x),-3,4,-1,5),"curve2")+polyline(points(lambda x:-2**x+4,-3,4,-1,5),"mark")
        return b+text(360,40,"P: t·2ˣ=2⁻ˣ, Q: t·2ˣ=−2ˣ+4","label","middle")+text(360,390,"x_P:x_Q=1:2 ⇒ t=1/3","small","middle")
    if kind == "parabola_log_bound":
        b=axes(-1,7,-3,10); b+=polyline(points(lambda x:(x-2)*(x-4),-1,7,-3,10),"curve")
        for x in [2,4]:
            sx,sy=xy(x,0,xr=(-1,7),yr=(-3,10)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="4"/>'
        return b+text(360,40,"f(x)=(x−2)(x−4),  log₂f(x)≤3","label","middle")+text(360,390,"integer x: 0,1,5,6  →  4개","small","middle")
    if kind == "parallelogram":
        b=axes(0,6,-4,6); pts=[]
        for x,y in [(5,5),(2,1.5),(1,-3),(4,.5)]: pts.append(xy(x,y,xr=(0,6),yr=(-4,6)))
        b+=f'<polygon class="region" points="{" ".join(f"{x:.2f},{y:.2f}" for x,y in pts)}"/>'
        for (x,y),l in zip([(5,5),(2,1.5),(1,-3),(4,.5)],"ABCD"):
            sx,sy=xy(x,y,xr=(0,6),yr=(-4,6)); b+=text(sx+8,sy-8,f"{l}({x},{y})","small")
        return b+text(360,40,"평행사변형 ABCD","label","middle")+text(360,390,"넓이 = 10","small","middle")
    if kind == "exp_graph_2":
        b=axes(-3,4,0,7); b+=polyline(points(lambda x:3**(x-1)+2,-3,4,0,7),"curve")+line(70,xy(-3,2,xr=(-3,4),yr=(0,7))[1],650,xy(4,2,xr=(-3,4),yr=(0,7))[1],"guide")
        sx,sy=xy(0,7/3,xr=(-3,4),yr=(0,7)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>'
        return b+text(360,40,"asymptote y=2, y-intercept 7/3","label","middle")+text(360,390,"y=3^(x−1)+2  (③)","small","middle")
    if kind == "sector_paper":
        b='<path class="region" d="M360 300 L155 300 A245 245 0 0 1 565 300 Z"/><path class="mark" d="M360 300 L255 300 A125 125 0 0 1 465 300 Z"/>'
        return b+text(360,45,"θ=2π/3, R=12, r=6","label","middle")+text(360,390,"종이 넓이 = ½·(2π/3)·(12²−6²)=36π","small","middle")
    if kind == "quarter_circle":
        b='<path class="mark" d="M110 330 A220 220 0 0 1 330 110"/><line class="axis" x1="110" y1="330" x2="350" y2="330"/><line class="axis" x1="110" y1="330" x2="110" y2="90"/>'
        for i in range(1,9):
            a=i*math.pi/18; x=110+220*math.cos(a); y=330-220*math.sin(a); b+=line(x,y,x,330,"guide")+f'<circle class="point" cx="{x:.2f}" cy="{y:.2f}" r="3"/>'
        return b+text(500,70,"cos²(iπ/18)","label","middle")+text(500,115,"보각 쌍 4개 × 1", "small","middle")+text(500,390,"합=4","label","middle")
    if kind == "cos_count":
        b=axes(0,4,-1.2,1.2); b+=polyline(points(lambda x:-math.cos(14*math.pi*x),0,4,-1.2,1.2),"curve")
        return b+text(360,40,"y=−cos(14πx), period=1/7","label","middle")+text(360,390,"대칭 root count = 28, b=13","small","middle")
    raise ValueError(kind)


def main():
    records=[]
    for spec in SPECS:
        svg,digest=base_svg(spec["slug"],spec["kind"],body(spec["kind"],spec["facts"]),spec["facts"],spec["questionUid"])
        ref=(OUT/(spec["slug"]+".svg")).relative_to(ROOT).as_posix(); (ROOT/ref).write_text(svg,encoding="utf-8")
        records.append({**spec,"candidateRef":ref,"factHash":digest,"v1":"PENDING","v2":"PENDING","v3":"PENDING","status":"REBUILD_GENERATED"})
    (OUT/"rebuild_general_specs.json").write_text(json.dumps(records,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"generated":len(records),"out":str(OUT)},ensure_ascii=False))


if __name__ == "__main__": main()
