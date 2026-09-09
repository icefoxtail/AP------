from __future__ import annotations

import json
import math
import sys
import importlib.util
import os
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
    {"slug":"24_geumdang_q16_exp_log_triangle","questionUid":"24_금당고_1학기_중간_고2_대수::q16","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":16,"kind":"triangle_log","facts":{"type":"exp_log_triangle","A":[8,0],"B":[2,6],"C":[6,2],"D":[216,6],"ratio":"BC:CA=2:1","area":428},"anchors":["B=(2,6)","C=(6,2)","428"]},
    {"slug":"24_geumdang_q17_cos_counts","questionUid":"24_금당고_1학기_중간_고2_대수::q17","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":17,"kind":"cos_counts","facts":{"type":"piecewise_cos","k_values":[1,2,3,4,5],"counts":[2,2,1,2,2],"sum":9},"anchors":["a_1+a_2","cos x","9"]},
    {"slug":"24_geumdang_q19_abs_sine_range","questionUid":"24_금당고_1학기_중간_고2_대수::q19","sourceJsPath":"archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js","id":19,"kind":"abs_sine","facts":{"type":"absolute_sine","expression":"|6sin2x+3|","f3":7,"target_count":4,"t_range":"3<t<9"},"anchors":["|6\\sin 2x+3|","3<t<9","f(3)"]},
    {"slug":"25_suncheon_q5_exp_shift_graph","questionUid":"25_순천고_1학기_중간_고2_대수::q5","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":5,"kind":"exp_shift_graph","facts":{"type":"exponential_graph","expression":"y=2^(x+2)−2","asymptote":"y=−2","point":[0,2],"a":-2,"b":-2,"product":4},"anchors":["점근선","y=-2","4"]},
    {"slug":"25_suncheon_q13_sector_annulus","questionUid":"25_순천고_1학기_중간_고2_대수::q13","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":13,"kind":"sector_annulus","facts":{"type":"sector_annulus","outer_arc":"2π","inner_arc":"4π/3","area":"5π","angle":"2π/9","answer":"2π/9"},"anchors":["부채꼴","5\\pi","2\\pi/9"]},
    {"slug":"25_suncheon_q24_inverse_graph","questionUid":"25_순천고_1학기_중간_고2_대수::q24","sourceJsPath":"archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js","id":24,"kind":"inverse_line","facts":{"type":"shifted_inverse_graph","symmetry":"y=x−2","line":"y=−x+6","C":[0,6],"M":[4,2],"A":[3,3],"B":[5,1],"a":3},"anchors":["M(4,2)","A=(3,3)","a=3"]},
    {"slug":"25_jeil_q13_relation_limit","questionUid":"25_제일고_1학기_중간_고2_대수::q13","sourceJsPath":"archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js","id":13,"kind":"relation_limit","facts":{"type":"graph_fact_limit","known":"1<b<a","condition":"a<b²","conclusion":"(a/b)^x−b^x<0 for x>0","passes_origin":True,"answer":"③"},"anchors":["로그 그래프","a\\lt b","원점"]},
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
        xr, yr = (0, 230), (0, 8)
        b = axes(*xr, *yr)
        pts = [(8,0),(2,6),(6,2),(216,6)]
        tri = [xy(2,6,xr=xr,yr=yr), xy(6,2,xr=xr,yr=yr), xy(216,6,xr=xr,yr=yr)]
        b += f'<polygon class="region" points="{" ".join(f"{x:.2f},{y:.2f}" for x,y in tri)}"/>'
        b += line(*xy(8,0,xr=xr,yr=yr), *xy(6,2,xr=xr,yr=yr), "mark")
        b += line(*xy(2,6,xr=xr,yr=yr), *xy(6,2,xr=xr,yr=yr), "guide")
        b += line(*xy(2,6,xr=xr,yr=yr), *xy(216,6,xr=xr,yr=yr), "mark")
        for x,y in pts:
            sx,sy=xy(x,y,xr=xr,yr=yr); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>{text(sx+8,sy-8,f"({x},{y})","small")}'
        return b+text(360,24,"A=(8,0), B=(2,6), C=(6,2), D=(216,6)","label","middle")+text(360,404,"[BCD] = ½·(216−2)·(6−2) = 428","small","middle")
    if kind == "cos_counts":
        w, gap, left, top, panel_h = 120, 8, 34, 70, 270
        b = text(360,28,"각 k에서 f(x)와 y=cos(kπ/3)의 교점","label","middle")
        for k in range(1,6):
            x0 = left + (k-1)*(w+gap); x1 = x0+w; y0, y1 = top, top+panel_h; c=math.cos(k*math.pi/3)
            def sx(t): return x0 + t/(2*math.pi)*w
            def sy(v): return y0 + (2.2-v)/4.4*panel_h
            b += line(x0,sy(0),x1,sy(0),"axis")+line(sx(0),y0,sx(0),y1,"axis")+line(x0,sy(c),x1,sy(c),"guide")
            def piece(t): return math.cos(t) if t <= k*math.pi/3 else 2*c-math.cos(t)
            pts=[]
            for i in range(241):
                t=2*math.pi*i/240; pts.append(f"{sx(t):.2f},{sy(piece(t)):.2f}")
            b += f'<polyline class="curve" points="{" ".join(pts)}"/>'
            roots = {1:[math.pi/3,5*math.pi/3],2:[2*math.pi/3,4*math.pi/3],3:[math.pi],4:[2*math.pi/3,4*math.pi/3],5:[2*math.pi/3,4*math.pi/3]}[k]
            for t in roots: b += f'<circle class="point" cx="{sx(t):.2f}" cy="{sy(c):.2f}" r="4"/>'
            b += text((x0+x1)/2, y0-18, f"k={k}", "label", "middle")+text((x0+x1)/2, y1+28, f"aₖ={len(roots)}", "small", "middle")
        return b+text(360,405,"a₁+a₂+a₃+a₄+a₅ = 2+2+1+2+2 = 9","label","middle")
    if kind == "abs_sine":
        b=axes(0,2*math.pi,0,10); b+=polyline(points(lambda x:abs(6*math.sin(2*x)+3),0,2*math.pi,0,10),"curve")
        b+=line(70,xy(3,0,xr=(0,2*math.pi),yr=(0,10))[1],650,xy(3,0,xr=(0,2*math.pi),yr=(0,10))[1],"guide")
        return b+text(360,40,"f(x)=|6sin2x+3|, f(3)=7","label","middle")+text(360,390,"f(t)=4  ⇔  3<t<9","small","middle")
    if kind == "exp_shift_graph":
        b=axes(-4,4,-3,6); b+=polyline(points(lambda x:2**(x+2)-2,-4,4,-3,6),"curve")+line(70,xy(-4,-2,xr=(-4,4),yr=(-3,6))[1],650,xy(4,-2,xr=(-4,4),yr=(-3,6))[1],"guide")
        sx,sy=xy(0,2,xr=(-4,4),yr=(-3,6)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>'
        return b+text(360,40,"y=2^(x+2)−2, asymptote y=−2, (0,2)","label","middle")+text(360,390,"a=b=−2 ⇒ ab=4","small","middle")
    if kind == "sector_annulus":
        cx, cy, a0, a1 = 360, 292, -math.pi/2, -math.pi/2 + 2*math.pi/9
        def p(r, a): return cx+r*math.cos(a), cy+r*math.sin(a)
        os, oe, ins, ine = p(190,a0), p(190,a1), p(126.6666667,a0), p(126.6666667,a1)
        b = f'<path class="region" d="M{cx},{cy} L{os[0]:.2f},{os[1]:.2f} A190 190 0 0 1 {oe[0]:.2f},{oe[1]:.2f} Z"/><path class="inner" d="M{cx},{cy} L{ins[0]:.2f},{ins[1]:.2f} A126.6667 126.6667 0 0 1 {ine[0]:.2f},{ine[1]:.2f} Z"/>'
        b += f'<line class="guide" x1="{os[0]:.2f}" y1="{os[1]:.2f}" x2="{ins[0]:.2f}" y2="{ins[1]:.2f}"/><line class="guide" x1="{oe[0]:.2f}" y1="{oe[1]:.2f}" x2="{ine[0]:.2f}" y2="{ine[1]:.2f}"/>'
        b += text(cx+10,cy+20,"O","label")+text(475,130,"R=9","small")+text(404,184,"r=6","small")
        return b+text(360,34,"공통 중심 O, 공통 시작·끝 반직선","label","middle")+text(360,404,"θ=2π/9,  arc(R)=2π, arc(r)=4π/3, 색칠 넓이=5π","small","middle")
    if kind == "inverse_line":
        b=axes(0,8,0,8); b+=line(*xy(0,6,xr=(0,8),yr=(0,8)),*xy(6,0,xr=(0,8),yr=(0,8)),"mark")+line(*xy(2,0,xr=(0,8),yr=(0,8)),*xy(8,6,xr=(0,8),yr=(0,8)),"guide")
        for x,y,l in [(0,6,"C"),(4,2,"M"),(3,3,"A"),(5,1,"B")]:
            sx,sy=xy(x,y,xr=(0,8),yr=(0,8)); b+=f'<circle class="point" cx="{sx:.2f}" cy="{sy:.2f}" r="5"/>{text(sx+8,sy-8,l,"label")}'
        return b+text(360,40,"symmetry axis y=x−2; line y=−x+6","label","middle")+text(360,390,"A=(3,3) ⇒ a=3","small","middle")
    if kind == "relation_limit":
        b=axes(-3,3,-4,3)
        b+=polyline(points(lambda x:-0.6*(2**x-1),-3,3,-4,3),"curve")
        b+=text(360,45,"1<b<a and a<b²; f(x)=(a/b)^x−b^x","label","middle")
        b+=text(360,390,"f(0)=0,  x>0 ⇒ f(x)<0  →  choice ③","small","middle")
        return b
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
        cx, cy, a0, a1 = 360, 220, math.pi, math.pi + 2*math.pi/3
        def p(r, a): return cx+r*math.cos(a), cy+r*math.sin(a)
        os, oe, ins, ine = p(150,a0), p(150,a1), p(75,a0), p(75,a1)
        b = f'<path class="region" d="M{cx},{cy} L{os[0]:.2f},{os[1]:.2f} A150 150 0 0 1 {oe[0]:.2f},{oe[1]:.2f} Z"/><path class="inner" d="M{cx},{cy} L{ins[0]:.2f},{ins[1]:.2f} A75 75 0 0 1 {ine[0]:.2f},{ine[1]:.2f} Z"/>'
        b += f'<line class="guide" x1="{os[0]:.2f}" y1="{os[1]:.2f}" x2="{ins[0]:.2f}" y2="{ins[1]:.2f}"/><line class="guide" x1="{oe[0]:.2f}" y1="{oe[1]:.2f}" x2="{ine[0]:.2f}" y2="{ine[1]:.2f}"/>'
        return b+text(360,34,"공통 중심 O, 같은 두 반직선; θ=2π/3, R=12, r=6","label","middle")+text(360,404,"색칠 넓이 = ½·(2π/3)·(12²−6²) = 36π","small","middle")
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
    requested = {value for value in os.environ.get("AP_VISUAL_TARGET_SLUGS", "").split(",") if value}
    selected = [spec for spec in SPECS if not requested or spec["slug"] in requested]
    for spec in selected:
        svg,digest=base_svg(spec["slug"],spec["kind"],body(spec["kind"],spec["facts"]),spec["facts"],spec["questionUid"])
        ref=(OUT/(spec["slug"]+".svg")).relative_to(ROOT).as_posix(); (ROOT/ref).write_text(svg,encoding="utf-8")
        records.append({**spec,"candidateRef":ref,"factHash":digest,"v1":"PENDING","v2":"PENDING","v3":"PENDING","status":"REBUILD_GENERATED"})
    spec_path = OUT / "rebuild_general_specs.json"
    if requested and spec_path.exists():
        merged = json.loads(spec_path.read_text(encoding="utf-8"))
        replacements = {row["slug"]: row for row in records}
        merged = [replacements.get(row.get("slug"), row) for row in merged]
    else:
        merged = records
    spec_path.write_text(json.dumps(merged,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"generated":len(records),"out":str(OUT),"targeted":bool(requested)},ensure_ascii=False))


if __name__ == "__main__": main()
