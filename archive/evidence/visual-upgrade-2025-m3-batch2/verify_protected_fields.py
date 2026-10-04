"""Compare every locked student field to its frozen baseline digest."""
import hashlib, json
from pathlib import Path

E=Path('archive/evidence/visual-upgrade-2025-m3-batch2')
SNAP=json.loads((E/'protected_fields_snapshot.json').read_text(encoding='utf-8'))
INV=json.loads((E/'inventory.json').read_text(encoding='utf-8'))
errors=[];rows=0
for exam in INV['exams']:
    source=Path(exam['sourcePath']).read_text(encoding='utf-8')
    marker='window.questionBank'
    at=source.find(marker)
    if at<0:errors.append({'path':exam['sourcePath'],'error':'questionBank assignment missing'});continue
    start=source.find('[',at+len(marker))
    try:bank,_=json.JSONDecoder().raw_decode(source[start:])
    except Exception as e:errors.append({'path':exam['sourcePath'],'error':'questionBank JSON parse failed: '+str(e)});continue
    current={q.get('id'):q for q in bank}
    for frozen in exam['questions']:
        rows+=1;q=current.get(frozen['qid'])
        if q is None:errors.append({'questionUid':frozen['questionUid'],'error':'question missing'});continue
        for field,sig in frozen['protectedFieldHashes'].items():
            present=field in q
            # The inventory's canonical hash encodes absent values as JSON null.
            raw=json.dumps(q.get(field),ensure_ascii=False,separators=(',',':')).encode('utf-8')
            sha='sha256:'+hashlib.sha256(raw).hexdigest()
            if present!=sig['present'] or sha!=sig['sha256']:
                errors.append({'questionUid':frozen['questionUid'],'field':field,'expected':sig,'actual':{'present':present,'sha256':sha}})
out={'schemaVersion':'M3_VISUAL_UPGRADE_PROTECTED_FIELDS_CHECK_v1','lockedFields':SNAP['lockedFields'],'questionCount':rows,'failureCount':len(errors),'status':'PASS' if not errors else 'FAIL','failures':errors}
(E/'protected_fields_check.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'questionCount':rows,'failureCount':len(errors),'status':out['status'],'report':'archive/evidence/visual-upgrade-2025-m3-batch2/protected_fields_check.json'},ensure_ascii=False))
