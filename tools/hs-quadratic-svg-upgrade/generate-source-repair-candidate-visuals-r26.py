from __future__ import annotations
import hashlib, importlib.util, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2];REPORT=ROOT/'reports'/'hs-quadratic-svg-upgrade-20260908';FACTS=REPORT/'343_source_repair_v1_expected_facts_r26.json';OUT_ROOT=ROOT/'archive'/'_generated'/'hs-quadratic-svg-upgrade-20260908'/'candidate-r26-repair'/'assets';MANIFEST=REPORT/'346_source_repair_candidate_visual_manifest_r26.json';BASE_PATH=Path(__file__).with_name('generate-deterministic-candidate-visuals-r11.py');spec=importlib.util.spec_from_file_location('base_visuals_r26',BASE_PATH);base=importlib.util.module_from_spec(spec);assert spec.loader is not None;spec.loader.exec_module(base)
def digest(value:bytes)->str:return hashlib.sha256(value).digest().hex()
def fact_digest(fact:dict)->str:return digest(json.dumps(fact,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode('utf-8'))
def main():
    data=json.loads(FACTS.read_text(encoding='utf-8'));rows=[]
    for index,item in enumerate(data['rows'],1):
        case_id=f'hs-r26-repair-{index:03d}';out=OUT_ROOT/f'{case_id}.svg';out.parent.mkdir(parents=True,exist_ok=True);svg=base.cartesian(case_id,item['expectedFacts'],'이차함수 그래프와 핵심 조건').replace('candidate_builder_python_r11','candidate_builder_python_r26_repair');out.write_text(svg,encoding='utf-8',newline='\n');raw=out.read_bytes();rows.append({'questionUid':item['questionUid'],'caseId':case_id,'assetPath':out.relative_to(ROOT).as_posix(),'assetBytes':len(raw),'assetSha256':digest(raw),'factSha256':fact_digest(item['expectedFacts']),'status':'CANDIDATE_GENERATED_NO_PASS'})
    output={'schemaVersion':'HS_QUADRATIC_SOURCE_REPAIR_CANDIDATE_VISUAL_MANIFEST_R26','status':'CANDIDATE_GENERATED_NO_PASS','productionAuthorized':False,'v1Facts':FACTS.relative_to(ROOT).as_posix(),'rows':rows,'note':'Regenerated 11 affected visual artifacts from fresh source-only facts; no final PASS is claimed.'};MANIFEST.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps({'status':output['status'],'generated':len(rows)},ensure_ascii=False,indent=2))
if __name__=='__main__':main()
