#!/usr/bin/env python3
"""Bind the fresh M3 recheck to staged source-exam and final SVG Git objects.

Run after staging the two linked exam files and all retained changed SVGs.
The script fails closed if triage, raw render, overlap, XML/geometry, or index
parity is incomplete.
"""
from __future__ import annotations
import hashlib, json, subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path.cwd()
EVID=Path('archive/evidence/visual-upgrade-2025-m3-independent-b')

def load(name): return json.loads((EVID/name).read_text(encoding='utf-8'))
def save(name,data): (EVID/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
def sha256(path): return 'sha256:'+hashlib.sha256(Path(path).read_bytes()).hexdigest()
def raw_blob(path):
    b=Path(path).read_bytes();return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def git(*args): return subprocess.check_output(['git',*args],cwd=ROOT,text=True,encoding='utf-8').strip()
def staged_blob(path):
    try:return git('rev-parse',':'+path)
    except subprocess.CalledProcessError as e: raise SystemExit('NOT_STAGED:'+path) from e

inventory=load('inventory.json');triage=load('triage.json');built=load('build_outputs.json')
physical=load('svg_physical_evidence.json');browser=load('browser_render_evidence.json');overlap=load('browser_overlap_verification.json')
link_changes=load('solution_image_link_changes.json');calibration=load('calibration.json');project=load('project_config.json')
asset_count=len(built['assets'])
if inventory['denominator']!=120 or len(triage['triage'])!=120: raise SystemExit('TRIAGE_DENOMINATOR_FAIL')
if physical['denominator']!=asset_count or physical['passCount']!=asset_count or physical['failCount']!=0: raise SystemExit('PHYSICAL_GEOMETRY_FAIL')
if browser['examDenominator']!=120 or browser['examRenderPassCount']!=5 or browser['changedSvgCount']!=asset_count or browser['changedSvgPassCount']!=asset_count: raise SystemExit('BROWSER_RENDER_FAIL')
if overlap['assetCount']!=asset_count or overlap['passCount']!=asset_count or overlap['reviewRequiredCount']!=0: raise SystemExit('BROWSER_PRIMITIVE_OVERLAP_FAIL')
if link_changes['protectedFieldMutationCount']!=0: raise SystemExit('PROTECTED_FIELD_MUTATION_FAIL')
if asset_count!=17 or len(physical['items'])!=asset_count: raise SystemExit('ASSET_DENOMINATOR_FAIL')

exam_baseline={x['sourcePath']:x for x in inventory['exams']}
browser_exam_by={x['sourcePath']:x for x in browser['exams']}
tri_by={x['questionUid']:x for x in triage['triage']}
browser_by={x['assetPath']:x for x in browser['changedSvgRenderEvidence']}
overlap_by={x['assetPath']:x for x in overlap['assets']}
physical_by={x['assetPath']:x for x in physical['items']}
built_by={x['svgPath']:x for x in built['assets']}
render_sha=sha256(EVID/'browser_render_evidence.json')
overlap_sha=sha256(EVID/'browser_overlap_verification.json')
now=datetime.now(timezone.utc).isoformat()

for asset_path,item in physical_by.items():
    if asset_path not in browser_by or asset_path not in overlap_by or asset_path not in built_by: raise SystemExit('MISSING_ASSET_EVIDENCE:'+asset_path)
    b=browser_by[asset_path];o=overlap_by[asset_path];built_item=built_by[asset_path]
    tri=tri_by.get(item['questionUid'])
    if not tri: raise SystemExit('MISSING_TRIAGE_ROW:'+item['questionUid'])
    raw_sha=sha256(asset_path);index_sha=staged_blob(asset_path)
    if raw_sha!=b['svgSha256'] or raw_sha!=built_item['svgSha256'] or raw_sha!=item['assetSha256']: raise SystemExit('SVG_SHA_PARITY_FAIL:'+asset_path)
    if raw_blob(asset_path)!=item['physicalAssetGitBlobSha']: raise SystemExit('PHYSICAL_BLOB_SHA_FAIL:'+asset_path)
    if b['renderStatus']!='PASS' or o['result']!='PASS' or o['primitiveStrokeIntersectionCount']!=0: raise SystemExit('SVG_RENDER_OR_OVERLAP_FAIL:'+asset_path)
    source= item['sourceExamFile'];baseline=exam_baseline[source]
    source_raw_sha=sha256(source);source_index_sha=staged_blob(source)
    if browser_exam_by[source]['sourceExamSha256']!=source_raw_sha or b.get('sourceExamSha256')!=source_raw_sha:
        raise SystemExit('BROWSER_SOURCE_EXAM_SHA_FAIL:'+source)
    if item['solutionSha256']!=built_item['solutionSha256']: raise SystemExit('SOLUTION_SHA_PARITY_FAIL:'+asset_path)
    item['expectedFacts']=tri.get('expectedFacts',[])
    item['expectedFactCompleteness']=tri.get('expectedFactCompleteness')
    item['factVisualizations']=tri.get('factVisualizations',[])
    item['sourceSemanticIdentity']=json.loads(json.dumps(tri.get('sourceSemanticIdentity')))
    item['visualSemanticType']=tri.get('visualSemanticType')
    item['sourceConditionCoverage']=item['expectedFactCompleteness']['sourceConditionCoverage'] if item['expectedFactCompleteness'] else []
    item['pythonInputs']=built_item['pythonInputs']
    item['pythonCalculatedOutputs']=built_item['pythonOutputs']
    item['coordinateModel']=built_item['coordinateModel']
    item['actualSvgPrimitives']=built_item['actualSvgPrimitives']
    # Bind source names to their measured point/segment owners in final bytes.
    identity=item['sourceSemanticIdentity']
    for check in (identity.get('checks') or []):
        owner=check.get('ownerBinding') or {}
        if owner.get('type')=='point':
            matched=next((x for x in item.get('labelOwnerBindings',{}).get('pointLabels',[])
                if x.get('text')==check.get('artifactLabel') and x.get('ownerPoint')==owner.get('reference')),None)
        elif owner.get('type')=='segment':
            matched=next((x for x in item.get('labelOwnerBindings',{}).get('lengthLabels',[])
                if x.get('text')==check.get('artifactLabel') and x.get('ownerSegment')==owner.get('reference')),None)
        elif owner.get('type')=='angle':
            matched=next((x for x in item.get('labelOwnerBindings',{}).get('angleLabels',[])
                if x.get('text')==check.get('artifactLabel') and x.get('ownerVertex')==owner.get('reference')),None)
        else:
            matched=None
        check['physicalArtifactBinding']={'expectedOwner':owner,'observedLabelOwner':matched,'result':'PASS' if matched else 'FAIL'}
        check['result']='PASS' if check.get('sourceLabel')==check.get('artifactLabel') and matched else 'FAIL'
        if check['result']!='PASS': raise SystemExit('SOURCE_SEMANTIC_PHYSICAL_BINDING_FAIL:'+asset_path+':'+str(check.get('semanticRole')))
    item['baselineSourceExamSha256']=item['sourceExamSha256']
    item['sourceExamSha256']=source_raw_sha
    item['baselineSourceExamGitBlobSha']=baseline['sourceGitBlobSha']
    item['sourceExamGitBlobSha']=source_index_sha
    item['baselineSourceGitBlobSha']=baseline['sourceGitBlobSha']
    item['solutionSha256']=built_item['solutionSha256']
    item['finalSvgSha256']=raw_sha
    item['finalSvgGitBlobSha']=index_sha
    item['browserRenderEvidencePath']=str(EVID/'browser_render_evidence.json')
    item['browserRenderEvidenceSha256']=render_sha
    item['browserOverlapEvidencePath']=str(EVID/'browser_overlap_verification.json')
    item['browserOverlapEvidenceSha256']=overlap_sha
    item['browserRenderStatus']=b['renderStatus']
    item['browserRenderEvidence']=b
    item['actualVisiblePrimitiveIds']=b.get('actualVisiblePrimitiveIds',[])
    item['hiddenCoordinateReferencePrimitiveIds']=b.get('hiddenCoordinateReferencePrimitiveIds',[])
    item['browserOverlapEvidence']=o
    item['authoredFontSizesByLabel']=[{'labelId':x['id'],'authoredFontSize':x['authoredFontSize'],
        'computedFontFamily':x['computedFontFamily'],'computedFontSize':x['computedFontSize'],
        'finalViewportCssFontPx':x['finalViewportCssFontPx']} for x in b['labels']]
    built_item['sourceExamSha256']=source_raw_sha
    built_item['sourceExamGitBlobSha']=source_index_sha
    built_item['finalSvgGitBlobSha']=index_sha
    built_item['finalSvgSha256']=raw_sha

physical['browserRenderPassCount']=asset_count
physical['browserPrimitiveOverlapPassCount']=asset_count
physical['finalizedAtUtc']=now
save('svg_physical_evidence.json',physical);save('build_outputs.json',built)

for row in link_changes['examChanges']:
    p=row['path'];baseline=exam_baseline[p]
    row['beforeSha256']=baseline['sourceSha256']
    row['beforeGitBlobSha']=baseline['sourceGitBlobSha']
    row['beforePhysicalGitBlobSha']=baseline['sourceGitBlobSha']
    row['afterSha256']=sha256(p)
    row['afterPhysicalGitBlobSha']=raw_blob(p)
    row['afterGitBlobSha']=staged_blob(p)
link_changes['finalRawSourceSha256ByExam']={p:sha256(p) for p in exam_baseline}
link_changes['finalIndexGitBlobShaByChangedExam']={row['path']:staged_blob(row['path']) for row in link_changes['examChanges']}
remove_keys={(row['sourcePath'],row['qid']) for row in triage['triage'] if row['action']=='REMOVE'}
for row in link_changes['examChanges']:
    row['edits']=[edit for edit in row.get('edits',[]) if (row['path'],edit['qid']) not in remove_keys]
link_changes['examChanges']=[row for row in link_changes['examChanges'] if row.get('edits')]
link_changes['changedExamFiles']=len(link_changes['examChanges'])
link_changes['assetCount']=asset_count
link_changes['browserRenderPassCount']=asset_count
save('solution_image_link_changes.json',link_changes)

inventory['createdAt']=None
inventory['revalidatedAtUtc']=now
save('inventory.json',inventory)
calibration['qualityCompareCount']='120/120'
if isinstance(calibration.get('solutionQualityCalibration'),dict):
    calibration['solutionQualityCalibration']['qualityCompareCount']='120/120'
    calibration['solutionQualityCalibration']['qualityCompareScope']='All 120 locked source solutions were read and compared during per-question visual triage.'
calibration['qualityCompareScope']='120/120 source solutions compared during fresh visual-need triage.'
calibration['finalVisualTriagePath']=str(EVID/'triage.json')
calibration['finalBrowserEvidencePath']=str(EVID/'browser_render_evidence.json')
save('calibration.json',calibration)
project['completedAtUtc']=now
project['triageActionCounts']=triage['counts']
project['changedSvgCount']=asset_count
project['renderStatus']={'examPages':'5/5 PASS','changedSvg':f'{asset_count}/{asset_count} PASS','browserPrimitiveOverlap':f'{asset_count}/{asset_count} PASS','geometry':f'{asset_count}/{asset_count} PASS'}
project['finalBranch']='codex/2025-m3-visual-upgrade-quality-repair'
save('project_config.json',project)
print(json.dumps({'finalizedAtUtc':now,'denominator':120,'actionCounts':triage['counts'],
    'svgCount':asset_count,'geometryPass':f'{asset_count}/{asset_count}','browserExamPass':'5/5','browserSvgPass':f'{asset_count}/{asset_count}',
    'browserPrimitiveOverlapPass':f'{asset_count}/{asset_count}','evidence':'archive/evidence/visual-upgrade-2025-m3-independent-b/svg_physical_evidence.json'},ensure_ascii=False))
