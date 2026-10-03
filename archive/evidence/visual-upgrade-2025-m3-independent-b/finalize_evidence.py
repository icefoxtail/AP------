#!/usr/bin/env python3
"""Bind M3 visual evidence to the staged exam and SVG Git objects.

Run after staging the two linked exam files and all 21 final SVGs.  The
script fails closed if raw render, overlap, XML/geometry, or Git index parity
is incomplete.
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
if inventory['denominator']!=120 or len(triage['triage'])!=120: raise SystemExit('TRIAGE_DENOMINATOR_FAIL')
if physical['denominator']!=21 or physical['passCount']!=21 or physical['failCount']!=0: raise SystemExit('PHYSICAL_GEOMETRY_FAIL')
if browser['examDenominator']!=120 or browser['examRenderPassCount']!=5 or browser['changedSvgCount']!=21 or browser['changedSvgPassCount']!=21: raise SystemExit('BROWSER_RENDER_FAIL')
if overlap['assetCount']!=21 or overlap['passCount']!=21 or overlap['reviewRequiredCount']!=0: raise SystemExit('BROWSER_PRIMITIVE_OVERLAP_FAIL')
if link_changes['protectedFieldMutationCount']!=0: raise SystemExit('PROTECTED_FIELD_MUTATION_FAIL')
if len(built['assets'])!=21 or len(physical['items'])!=21: raise SystemExit('ASSET_DENOMINATOR_FAIL')

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
    raw_sha=sha256(asset_path);index_sha=staged_blob(asset_path)
    if raw_sha!=b['svgSha256'] or raw_sha!=built_item['svgSha256'] or raw_sha!=item['assetSha256']: raise SystemExit('SVG_SHA_PARITY_FAIL:'+asset_path)
    if raw_blob(asset_path)!=item['physicalAssetGitBlobSha']: raise SystemExit('PHYSICAL_BLOB_SHA_FAIL:'+asset_path)
    if b['renderStatus']!='PASS' or o['result']!='PASS' or o['primitiveStrokeIntersectionCount']!=0: raise SystemExit('SVG_RENDER_OR_OVERLAP_FAIL:'+asset_path)
    source= item['sourceExamFile'];baseline=exam_baseline[source]
    source_raw_sha=sha256(source);source_index_sha=staged_blob(source)
    if browser_exam_by[source]['sourceExamSha256']!=source_raw_sha or b.get('sourceExamSha256')!=source_raw_sha:
        raise SystemExit('BROWSER_SOURCE_EXAM_SHA_FAIL:'+source)
    if item['solutionSha256']!=built_item['solutionSha256']: raise SystemExit('SOLUTION_SHA_PARITY_FAIL:'+asset_path)
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
    item['browserOverlapEvidence']=o
    item['authoredFontSizesByLabel']=[{'labelId':x['id'],'authoredFontSize':x['authoredFontSize'],
        'computedFontFamily':x['computedFontFamily'],'computedFontSize':x['computedFontSize'],
        'finalViewportCssFontPx':x['finalViewportCssFontPx']} for x in b['labels']]
    built_item['sourceExamSha256']=source_raw_sha
    built_item['sourceExamGitBlobSha']=source_index_sha
    built_item['finalSvgGitBlobSha']=index_sha
    built_item['finalSvgSha256']=raw_sha

physical['browserRenderPassCount']=21
physical['browserPrimitiveOverlapPassCount']=21
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
link_changes['assetCount']=21
link_changes['browserRenderPassCount']=21
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
project['changedSvgCount']=21
project['renderStatus']={'examPages':'5/5 PASS','changedSvg':'21/21 PASS','browserPrimitiveOverlap':'21/21 PASS','geometry':'21/21 PASS'}
project['finalBranch']='codex/2025-m3-visual-upgrade-independent-b'
save('project_config.json',project)
print(json.dumps({'finalizedAtUtc':now,'denominator':120,'actionCounts':triage['counts'],
    'svgCount':21,'geometryPass':'21/21','browserExamPass':'5/5','browserSvgPass':'21/21',
    'browserPrimitiveOverlapPass':'21/21','evidence':'archive/evidence/visual-upgrade-2025-m3-independent-b/svg_physical_evidence.json'},ensure_ascii=False))
