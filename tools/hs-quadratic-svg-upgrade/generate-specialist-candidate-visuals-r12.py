from __future__ import annotations
import hashlib, html, importlib.util, json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REPORT = ROOT / "reports" / "hs-quadratic-svg-upgrade-20260908"
FACTS = REPORT / "81_specialist_v1_expected_facts_r12.json"
OUT_ROOT = ROOT / "archive" / "_generated" / "hs-quadratic-svg-upgrade-20260908" / "candidate-r12" / "assets"
MANIFEST = REPORT / "82_specialist_candidate_visual_manifest_r12.json"
BASE_PATH = Path(__file__).with_name("generate-deterministic-candidate-visuals-r11.py")
spec = importlib.util.spec_from_file_location("base_visuals", BASE_PATH)
base = importlib.util.module_from_spec(spec); assert spec.loader is not None; spec.loader.exec_module(base)

def digest(value: bytes) -> str: return hashlib.sha256(value).hexdigest()
def fact_digest(fact: dict) -> str: return digest(json.dumps(fact, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8"))
def esc(value: str) -> str: return html.escape(value, quote=True)
def fmt(value: float) -> str: return base.fmt(value)

def table(case_id: str, fact: dict, title: str) -> str:
    width, height = 780, 420
    style = ".bg{fill:#fff}.head{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:15px;fill:#111}.cell{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:13px;fill:#111}.true{fill:#eef5e9;stroke:#536d3f}.false{fill:#fff1f1;stroke:#a55}.box{stroke-width:1}.annotation{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:13px;fill:#111}"
    body=[f'<rect width="{width}" height="{height}" class="bg"/>',f'<text x="48" y="32" class="head">{esc(title)}</text>']
    body.append('<text x="62" y="62" class="cell">판정</text><text x="145" y="62" class="cell">판정 결과</text><text x="300" y="62" class="cell">근거 구조</text>')
    for index, row in enumerate(fact["cases"]):
        y=78+index*62; truth = row.get("verdict","") != "거짓"; cls="true" if truth else "false"
        body.append(f'<rect x="48" y="{y}" width="684" height="50" rx="6" class="box {cls}"/>')
        body.append(f'<text x="62" y="{y+30}" class="cell">{esc(str(row.get("id","")))}</text><text x="145" y="{y+30}" class="cell">{esc(str(row.get("verdict","")))}</text><text x="300" y="{y+30}" class="cell">{esc(str(row.get("reason","")))}</text>')
    if fact.get("trueCases"): body.append(f'<text x="48" y="390" class="annotation">항상 성립: {esc(", ".join(fact["trueCases"]))}</text>')
    if fact.get("maximum"): body.append(f'<text x="48" y="390" class="annotation">{esc(str(fact["maximum"]))}</text>')
    return f'<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" data-visual-case="{case_id}" data-fact-hash="{fact_digest(fact)}" data-visual-provenance="candidate_builder_python_r12"><title>{esc(title)}</title><desc>{esc(title)}</desc><style>{style}</style>\n'+'\n'.join(body)+'\n</svg>\n'

def parameter_line(case_id: str, fact: dict, title: str) -> str:
    width,height=760,330; left,right,y=80,620,125; low,high=-2.25,0.1
    def px(v): return left+(v-low)*(right-left)/(high-low)
    body=[f'<rect width="{width}" height="{height}" fill="#fff"/>',f'<line x1="{left}" y1="{y}" x2="{right}" y2="{y}" class="axis"/><path d="M {right} {y} l -8 -4 l 0 8 z" class="arrow"/>']
    for v in [-2,-1.5,-1,-.5,0]: body.append(f'<line x1="{fmt(px(v))}" y1="{y-7}" x2="{fmt(px(v))}" y2="{y+7}" class="axis"/><text x="{fmt(px(v))}" y="{y+28}" text-anchor="middle" class="label">{fmt(v)}</text>')
    for v in fact["parameterCandidates"]:
        cls="closed" if v==-.5 else "point"; body.append(f'<circle cx="{fmt(px(v))}" cy="{y}" r="7" class="{cls}"/><text x="{fmt(px(v))}" y="{y-18}" text-anchor="middle" class="small label">{fmt(v)}</text>')
    body.append(f'<line x1="{fmt(px(-.5)-7)}" y1="{y}" x2="{fmt(px(-.5)+7)}" y2="{y}" class="answer"/>')
    body.append('<text x="80" y="55" class="annotation">음수 p 후보 중 조건을 만족하는 값</text>')
    body.append('<rect x="80" y="215" width="540" height="65" rx="8" class="box"/><text x="98" y="245" class="panel">p=−1/2 · 정수해 −2,−1,0,1,2,3 · 개수 6</text>')
    return base.shell(case_id,fact,title,width,height,body)

def render(case_id: str, item: dict) -> str:
    fact=item["expectedFacts"]
    if "parameterCandidates" in fact: return parameter_line(case_id,fact,"조건을 만족하는 음수 p의 최댓값")
    if item["expectedVisualType"]=="case-table": return table(case_id,fact,"조건별 판정과 핵심 근거")
    return base.number_line(case_id,fact,"부등식 해집합 수직선") if item["expectedVisualType"]=="number-line" else base.cartesian(case_id,fact,"이차함수 그래프와 핵심 조건")

def main():
    data=json.loads(FACTS.read_text(encoding="utf-8")); rows=[]
    for index,item in enumerate(data["rows"],1):
        case_id=f"hs-r12-{index:03d}"; out=OUT_ROOT/f"{case_id}.svg"; out.parent.mkdir(parents=True,exist_ok=True); out.write_text(render(case_id,item),encoding="utf-8",newline="\n"); raw=out.read_bytes(); rows.append({"questionUid":item["questionUid"],"caseId":case_id,"assetPath":out.relative_to(ROOT).as_posix(),"assetBytes":len(raw),"assetSha256":digest(raw),"factSha256":fact_digest(item["expectedFacts"]),"status":"CANDIDATE_GENERATED_NO_PASS"})
    output={"schemaVersion":"HS_QUADRATIC_SPECIALIST_CANDIDATE_VISUAL_MANIFEST_R12","status":"CANDIDATE_GENERATED_NO_PASS","productionAuthorized":False,"v1Facts":FACTS.relative_to(ROOT).as_posix(),"rows":rows,"note":"Generated from 18 fresh source-only specialist-ready facts. Case-table and parameter number-line visuals are explicit; all remain candidate until independent artifact V2/V3 and render review."}; MANIFEST.write_text(json.dumps(output,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"); print(json.dumps({"status":output["status"],"generated":len(rows)},ensure_ascii=False,indent=2))
if __name__=="__main__": main()
