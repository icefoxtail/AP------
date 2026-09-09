from __future__ import annotations
import hashlib, html, importlib.util, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];REPORT=ROOT/'reports'/'hs-quadratic-svg-upgrade-20260908';FACTS=REPORT/'204_specialist_v1_expected_facts_r19.json';OUT_ROOT=ROOT/'archive'/'_generated'/'hs-quadratic-svg-upgrade-20260908'/'candidate-r19'/'assets';MANIFEST=REPORT/'205_specialist_candidate_visual_manifest_r19.json';BASE_PATH=Path(__file__).with_name('generate-deterministic-candidate-visuals-r11.py');spec=importlib.util.spec_from_file_location('base_visuals_r19',BASE_PATH);base=importlib.util.module_from_spec(spec);assert spec.loader is not None;spec.loader.exec_module(base)
def digest(value:bytes)->str:return hashlib.sha256(value).hexdigest()
def fact_digest(fact:dict)->str:return digest(json.dumps(fact,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8'))
def esc(value:str)->str:return html.escape(value,quote=True)
def table(case_id:str,fact:dict)->str:
    width,height=780,360;style=".bg{fill:#fff}.head{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:15px;fill:#111}.cell{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:13px;fill:#111}.true{fill:#eef5e9;stroke:#536d3f}.false{fill:#fff1f1;stroke:#a55}.box{stroke-width:1}.annotation{font-family:'Noto Sans KR','Malgun Gothic',sans-serif;font-size:13px;fill:#111}"
    body=[f'<rect width="{width}" height="{height}" class="bg"/>',f'<text x="48" y="32" class="head">조건별 판정과 판별식 근거</text>','<text x="62" y="62" class="cell">문항</text><text x="145" y="62" class="cell">판정</text><text x="300" y="62" class="cell">근거</text>']
    for index,row in enumerate(fact['cases']):
        y=78+index*55;truth=row.get('verdict')!='거짓';cls='true' if truth else 'false';body.append(f'<rect x="48" y="{y}" width="684" height="44" rx="6" class="box {cls}"/>');body.append(f'<text x="62" y="{y+27}" class="cell">{esc(str(row.get("id","")))}</text><text x="145" y="{y+27}" class="cell">{esc(str(row.get("verdict","")))}</text><text x="300" y="{y+27}" class="cell">{esc(str(row.get("reason","")))}</text>')
    body.append(f'<text x="48" y="330" class="annotation">최종 판정: {esc(str(fact.get("result","")))}</text>')
    return f'<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" role="img" data-visual-case="{case_id}" data-fact-hash="{fact_digest(fact)}" data-visual-provenance="candidate_builder_python_r19"><title>조건별 판정과 판별식 근거</title><desc>조건별 판정과 판별식 근거</desc><style>{style}</style>\n'+'\n'.join(body)+'\n</svg>\n'
def render(case_id:str,item:dict)->str:
    fact=item['expectedFacts'];
    if item['expectedVisualType']=='case-table':return table(case_id,fact)
    svg=base.number_line(case_id,fact,'부등식 해집합 수직선') if item['expectedVisualType']=='number-line' else base.cartesian(case_id,fact,'이차함수 그래프와 핵심 조건');return svg.replace('candidate_builder_python_r11','candidate_builder_python_r19')
def main():
    data=json.loads(FACTS.read_text(encoding='utf-8'));rows=[]
    for index,item in enumerate(data['rows'],1):
        case_id=f'hs-r19-{index:03d}';out=OUT_ROOT/f'{case_id}.svg';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(render(case_id,item),encoding='utf-8',newline='\n');raw=out.read_bytes();rows.append({'questionUid':item['questionUid'],'caseId':case_id,'assetPath':out.relative_to(ROOT).as_posix(),'assetBytes':len(raw),'assetSha256':digest(raw),'factSha256':fact_digest(item['expectedFacts']),'status':'CANDIDATE_GENERATED_NO_PASS'})
    output={'schemaVersion':'HS_QUADRATIC_SPECIALIST_CANDIDATE_VISUAL_MANIFEST_R19','status':'CANDIDATE_GENERATED_NO_PASS','productionAuthorized':False,'v1Facts':FACTS.relative_to(ROOT).as_posix(),'rows':rows,'note':'Generated from 14 fresh source-only specialist facts; case-table used for a discriminant statement item and no semantic/final PASS is claimed.'};MANIFEST.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps({'status':output['status'],'generated':len(rows)},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
