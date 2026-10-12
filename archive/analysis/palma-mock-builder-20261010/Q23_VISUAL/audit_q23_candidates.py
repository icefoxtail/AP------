from __future__ import annotations
import hashlib,json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]; HERE=Path(__file__).resolve().parent
PACKAGE_REL='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json'
CANDIDATE_ROOT=ROOT/'.tmp/archive/palma-q23-visual-20261010/alive-palma25-2mid-q23'
AUDIT_ROOT=CANDIDATE_ROOT/'static-audit'; AUDIT_ROOT.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(ROOT/'archive/tools/geometry-equation'))
from audit_publication import audit

def sha(raw):return hashlib.sha256(raw).hexdigest()
def blob(raw):return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
def write(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True);raw=(json.dumps(obj,ensure_ascii=False,indent=2,allow_nan=False)+'\n').encode('utf-8');path.write_bytes(raw);return raw

package=json.loads((ROOT/PACKAGE_REL).read_text(encoding='utf-8')); items={x['slot']:x for x in package['items']}
summary=[]
asset_slot={'A1':'A1','A2':'A2','A3':'A3','B1':'B1','B2':'B2','B3':'B3','C1':'C1','C2':'C2','C3':'C3'}
for slot in ['A1','A2','A3','B1','B2','B3','C1','C2','C3']:
    item=items[slot];review_path=HERE/f"{item['uid']}.geometry-review.json"
    review=json.loads(review_path.read_text(encoding='utf-8'))
    candidate=CANDIDATE_ROOT/'candidate'/f"palma-q23-{asset_slot[slot].lower()}"/'visual.svg'
    result=audit(candidate.read_bytes(),review,source_bytes=item['stem'].encode('utf-8'),solution_bytes=item['solution'].encode('utf-8'))
    raw=write(AUDIT_ROOT/f'{item["uid"]}.static-audit.json',result)
    summary.append({'slot':slot,'uid':item['uid'],'svgPath':candidate.relative_to(ROOT).as_posix(),'svgSha256':sha(candidate.read_bytes()),
                    'svgGitBlobSha1':blob(candidate.read_bytes()),'reviewPath':review_path.relative_to(ROOT).as_posix(),'reviewSha256':sha(review_path.read_bytes()),
                    'auditPath':(AUDIT_ROOT/f'{item["uid"]}.static-audit.json').relative_to(ROOT).as_posix(),'auditSha256':sha(raw),
                    'status':result['status'],'errors':result.get('errors',[]),'coverage':result.get('coverage')})
summary_doc={'schemaVersion':'PALMA_Q23_INDEPENDENT_STATIC_AUDIT_SUMMARY_V1','auditor':'archive/tools/geometry-equation/audit_publication.py','authority':'INDEPENDENT_STATIC_OBSERVER','publicationAuthorized':False,
             'denominator':9,'passCount':sum(x['status']=='PASS' for x in summary),'failCount':sum(x['status']!='PASS' for x in summary),'items':summary}
write(AUDIT_ROOT/'Q23_static_audit_summary.json',summary_doc)
print(json.dumps(summary_doc,ensure_ascii=False,indent=2))
if summary_doc['failCount']:raise SystemExit(1)

