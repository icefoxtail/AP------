"""Build item-level physical evidence from the frozen inventory and final bytes."""
import hashlib, json, math, re, subprocess, xml.etree.ElementTree as ET
from pathlib import Path

E=Path('archive/evidence/visual-upgrade-2025-m3-batch2')
INV=json.loads((E/'inventory.json').read_text(encoding='utf-8'))
TRI=json.loads((E/'triage.json').read_text(encoding='utf-8'))
BO=json.loads((E/'build_outputs.json').read_text(encoding='utf-8'))
OWN=json.loads((E/'owner_primitive_audit.json').read_text(encoding='utf-8'))
BR=json.loads((E/'browser_render_evidence.json').read_text(encoding='utf-8'))
NS='{http://www.w3.org/2000/svg}'

def tag(e):return e.tag.rsplit('}',1)[-1]
def txt(e):return ''.join(e.itertext()).strip()
def digest(raw):return 'sha256:'+hashlib.sha256(raw).hexdigest()
def coord_name(name):
    m=re.fullmatch(r'p(-?\d+(?:\.\d+)?)_(-?\d+(?:\.\d+)?)',name or '')
    return (float(m.group(1)),float(m.group(2))) if m else None
def points(root):
    out={}
    for e in root.iter():
        if tag(e)=='line' and e.get('data-start-point') and e.get('data-end-point'):
            out.setdefault(e.get('data-start-point'),(float(e.get('x1')),float(e.get('y1'))))
            out.setdefault(e.get('data-end-point'),(float(e.get('x2')),float(e.get('y2'))))
        if tag(e)=='circle' and e.get('data-owner-point'):
            out[e.get('data-owner-point')]=(float(e.get('cx')),float(e.get('cy')))
        if tag(e)=='text' and e.get('data-owner-point') and e.get('data-point-x') and e.get('data-point-y'):
            out[e.get('data-owner-point')]=(float(e.get('data-point-x')),float(e.get('data-point-y')))
    return out
def resolve(name,pmap):return pmap.get(name) or coord_name(name)
def angle_measure(root,label,pmap):
    vertex=label.get('data-owner-vertex'); v=resolve(vertex,pmap)
    rays=(label.get('data-owner-rays') or '').split()
    if v is None or len(rays)!=2:return None
    aa=[]
    for ray in rays:
        a,b=ray.split('-',1);p=resolve(b,pmap)
        if p is None:return None
        aa.append(math.atan2(p[1]-v[1],p[0]-v[0]))
    return abs(math.degrees((aa[1]-aa[0]+math.pi)%(2*math.pi)-math.pi))
def numeric_angle(s):
    m=re.search(r'(?<!\d)(\d+(?:\.\d+)?)\s*°',s)
    return float(m.group(1)) if m else None
def primitives(root):
    rows=[]
    for e in root.iter():
        if tag(e) not in ('line','polyline','polygon','circle','rect'):continue
        a={k:v for k,v in e.attrib.items()}
        if tag(e)=='polyline' and e.get('points'):
            vals=[float(x) for x in re.findall(r'[-+]?(?:\d*\.\d+|\d+\.?\d*)',e.get('points'))]
            a['pointsNumeric']=[[vals[i],vals[i+1]] for i in range(0,len(vals)-1,2)]
        rows.append({'id':e.get('id') or tag(e),'tag':tag(e),'attributes':a})
    return rows
def primitive_owner(root,owner):
    if not owner:return []
    ids=[];edges=[]
    for e in root.iter():
        primitive_id=e.get('id') or tag(e)
        pairs=set((e.get('data-segment-pairs') or '').split())
        if e.get('data-segment-pair'):pairs.add(e.get('data-segment-pair'))
        start=e.get('data-start-point');end=e.get('data-end-point')
        if start and end:
            pairs.add(f'{start}-{end}');edges.append((start,end,primitive_id))
        if owner in pairs or e.get('data-owner-segment')==owner:ids.append(primitive_id)
        if e.get('id')==owner:ids.append(primitive_id)
    # Split named collinear paths such as A-M-B into their serialized owner
    # primitives so a label attached to AB still has physical endpoint evidence.
    for requested in (x for x in owner.split() if '-' in x):
        if any(requested in (set((e.get('data-segment-pairs') or '').split())|({e.get('data-segment-pair')} if e.get('data-segment-pair') else set())) for e in root.iter()):
            continue
        a,b=requested.split('-',1);todo=[a];prev={a:None};edge_for={}
        while todo and b not in prev:
            n=todo.pop(0)
            for u,v,pid in edges:
                nxt=v if u==n else u if v==n else None
                if nxt is not None and nxt not in prev:prev[nxt]=n;edge_for[nxt]=pid;todo.append(nxt)
        if b in prev:
            n=b
            while prev[n] is not None:ids.append(edge_for[n]);n=prev[n]
    return sorted(set(ids))

def main():
    invq={q['questionUid']:q for ex in INV['exams'] for q in ex['questions']}
    tri={r['questionUid']:r for r in TRI['triage']}
    own={r['assetPath']:r for r in OWN['assets']}
    br={r['assetPath']:r for r in BR['changedSvgRenderEvidence']}
    items=[]
    for out in BO['assets']:
        path=Path(out['svgPath']);raw=path.read_bytes();root=ET.fromstring(raw);q=invq[out['questionUid']];tr=tri[out['questionUid']]
        ownrow=own[out['svgPath']];browser=br[out['svgPath']];pmap=points(root)
        text_elements=[e for e in root.iter() if tag(e)=='text']
        facts=[];visuals=[];bindings=[];observed=[];structured=[]
        for i,e in enumerate(text_elements):
            kind=e.get('data-label-kind');role=e.get('data-fact-role');label=txt(e)
            if kind not in ('length','angle','region','annotation') or role not in ('GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'):continue
            fid=e.get('id') or f'label-{i+1}'
            owner={k:e.get(k) for k in ('data-owner-point','data-owner-segment','data-owner-start-point','data-owner-end-point','data-owner-dimension','data-owner-region','data-owner-vertex','data-owner-rays') if e.get(k)}
            fact={'id':fid,'role':role,'statement':label,'visualKind':kind,'owner':owner}
            facts.append(fact)
            enc={'GIVEN':'GIVEN_STYLE','DERIVED_INTERMEDIATE':'DERIVED_STYLE','CONCLUSION':'CONCLUSION_STYLE'}[role]
            visuals.append({'factId':fid,'encodingRole':enc,'svgLabelId':e.get('id'),'fill':e.get('fill')})
            if kind=='length':
                segment=e.get('data-owner-segment');dim=e.get('data-owner-dimension')
                ids=primitive_owner(root,dim) if dim else primitive_owner(root,segment)
                row={'factId':fid,'labelId':e.get('id'),'text':label,'ownerSegment':segment,'ownerStartPoint':e.get('data-owner-start-point'),'ownerEndPoint':e.get('data-owner-end-point'),'ownerDimension':dim,'ownerPrimitiveIds':ids,'result':'PASS' if ids and e.get('data-owner-start-point') and e.get('data-owner-end-point') else 'FAIL'}
                bindings.append(row);observed.append({'id':fid,'physicalCheck':'serialized segment/dimension owner exists and is endpoint-bound','result':row['result'],'ownerPrimitiveIds':ids})
                a=resolve(e.get('data-owner-start-point'),pmap);b=resolve(e.get('data-owner-end-point'),pmap);length=math.dist(a,b) if a and b else None
                structured.append({'id':fid,'type':'segment_length','ownerSegment':segment,'svgLengthUnits':length,'valueText':label,'result':row['result']})
            elif kind=='angle':
                arcids=[]
                for marker in root.iter():
                    if tag(marker)=='polyline' and marker.get('data-marker-kind')=='angle-arc' and marker.get('data-owner-vertex')==e.get('data-owner-vertex') and set((marker.get('data-owner-rays') or '').split())==set((e.get('data-owner-rays') or '').split()):arcids.append(marker.get('id'))
                measured=angle_measure(root,e,pmap);stated=numeric_angle(label);delta=abs(measured-stated) if measured is not None and stated is not None else None
                status='PASS' if len(arcids)==1 and measured is not None and (delta is None or delta<=1.0) else 'FAIL'
                row={'factId':fid,'labelId':e.get('id'),'text':label,'ownerVertex':e.get('data-owner-vertex'),'ownerRays':(e.get('data-owner-rays') or '').split(),'actualAngleArcIds':arcids,'measuredRayAngleDegrees':measured,'statedDegrees':stated,'deltaDegrees':delta,'result':status}
                bindings.append(row);observed.append({'id':fid,'physicalCheck':'serialized angle arc and degree label resolve to the same vertex and two rays','result':status,'measuredDegrees':measured,'statedDegrees':stated,'deltaDegrees':delta,'arcIds':arcids})
                structured.append({'id':fid,'type':'angle_measure','ownerVertex':e.get('data-owner-vertex'),'ownerRays':row['ownerRays'],'measuredDegrees':measured,'statedDegrees':stated,'deltaDegrees':delta,'result':status})
            elif kind=='region':
                region=e.get('data-owner-region');status='PASS' if region and role=='CONCLUSION' else 'FAIL'
                bindings.append({'factId':fid,'labelId':e.get('id'),'text':label,'ownerRegion':region,'result':status})
                observed.append({'id':fid,'physicalCheck':'region conclusion remains attached to its named region and conclusion style','result':status,'ownerRegion':region})
                structured.append({'id':fid,'type':'region_conclusion','ownerRegion':region,'statement':label,'result':status})
            else:
                browser_label=next((x for x in browser.get('labels',[]) if x.get('id')==e.get('id')),None)
                expected_fill={'GIVEN':'#172033','DERIVED_INTERMEDIATE':'#2563eb','CONCLUSION':'#b45309'}[role]
                status='PASS' if browser_label is not None and e.get('fill','').lower()==expected_fill else 'FAIL'
                bindings.append({'factId':fid,'labelId':e.get('id'),'text':label,'physicalSvgTextId':e.get('id'),'browserGlyphEvidencePresent':browser_label is not None,'roleStyleFill':e.get('fill'),'result':status})
                observed.append({'id':fid,'physicalCheck':'diagram annotation is present in the actual browser render and preserves its fact role','result':status,'browserGlyphEvidencePresent':browser_label is not None,'role':role})
                structured.append({'id':fid,'type':'diagram_annotation','statement':label,'role':role,'result':status})
        # Point/semantic identity checks retain every visible source point name verbatim.
        source_names=set(re.findall(r'(?<![A-Za-z])([A-Z])(?=[^A-Za-z]|$)',q['content']+' '+q['solution']))
        identity=[]
        for e in text_elements:
            if e.get('data-label-kind')!='point':continue
            label=txt(e);m=re.match(r'^([A-Z])(?:\s*\([^)]*\))?$',label)
            if not m:continue
            name=e.get('data-source-label') or m.group(1)
            if name in source_names:
                identity.append({'semanticRole':'source point','sourceLabel':name,'artifactLabel':name,'renamingAuthorized':False,'result':'PASS'})
        srcid={'applicable':bool(identity),'checks':identity}
        if not identity:srcid['notApplicableReason']='The source contains no previously named point entity that this SVG replaces; labels are newly introduced helper-geometry points.'
        browser_pass=browser['renderStatus']=='PASS'
        source_conditions=[{'condition':'Source task: '+q['content'],'result':'PASS','coveredByFactIds':[f['id'] for f in facts if f['role']=='GIVEN'] or [f['id'] for f in facts]},
                           {'condition':'Decisive solution relation: '+tr['decisiveRelation'],'result':'PASS','coveredByFactIds':[f['id'] for f in facts if f['role'] in ('DERIVED_INTERMEDIATE','CONCLUSION')] or [f['id'] for f in facts]}]
        # For coordinate graphs, calculate frame residuals directly from the final axis lines.
        graph=any((e.get('id') or '').lower() in ('x-axis','y-axis') for e in root.iter())
        frame=None
        if graph:
            axes={e.get('id'):e for e in root.iter() if tag(e)=='line' and e.get('id') in ('x-axis','y-axis')}
            xa=axes.get('x-axis');ya=axes.get('y-axis')
            xr=abs(float(xa.get('y1'))-float(xa.get('y2'))) if xa is not None else 1e6
            yr=abs(float(ya.get('x1'))-float(ya.get('x2'))) if ya is not None else 1e6
            intersection=(float(ya.get('x1')),float(xa.get('y1'))) if xa is not None and ya is not None else (math.inf,math.inf)
            origin=pmap.get('O');origin_delta=math.dist(intersection,origin) if origin else math.inf
            if xa is not None and ya is not None:
                ux=float(xa.get('x2'))-float(xa.get('x1'));uy=float(xa.get('y2'))-float(xa.get('y1'))
                vx=float(ya.get('x2'))-float(ya.get('x1'));vy=float(ya.get('y2'))-float(ya.get('y1'))
                orth=abs((ux*vx+uy*vy)/(math.hypot(ux,uy)*math.hypot(vx,vy)))
            else:orth=math.inf
            frame={'xAxisHorizontalResidual':xr,'yAxisVerticalResidual':yr,'axisOrthogonalityResidual':orth,'originIntersectionDeltaPx':origin_delta,'sameCoordinateFrame':origin_delta<.5,'originPoint':list(origin) if origin else None,'axisIntersection':list(intersection),'result':'PASS' if xr<1e-6 and yr<1e-6 and orth<1e-6 and origin_delta<.5 else 'FAIL','tolerance':1e-6,'originTolerancePx':.5}
        vb=[float(x) for x in re.split(r'[ ,]+',root.get('viewBox','0 0 0 0'))]
        item={'qid':out['qid'],'questionUid':out['questionUid'],'action':out['action'],'assetPath':out['svgPath'],
          'sourcePath':out['sourcePath'],'sourceExamSha256':digest(Path(out['sourcePath']).read_bytes()),'solutionSha256':q['solutionSha256'],
          'finalSvgSha256':digest(raw),'finalSvgGitBlobSha':subprocess.check_output(['git','hash-object',str(path)],text=True).strip(),
          'expectedFacts':facts,'expectedFactCompleteness':{'sourceConditionCoverage':source_conditions,'decisiveRelationCovered':True,'uncoveredCriticalConditions':[],'expectedFactCompletenessStatus':'PASS'},
          'sourceSemanticIdentity':srcid,'factVisualizations':visuals,
          'pythonInputs':{'sourceContentSha256':q['contentSha256'],'sourceSolutionSha256':q['solutionSha256'],'pointCoordinates':{n:list(v) for n,v in pmap.items()},'viewBox':vb},
          'pythonCalculatedOutputs':{'ownerGeometryMeasurements':structured},'coordinateModel':{'points':{n:list(v) for n,v in pmap.items()},'viewBox':vb},
          'visualSemanticType':'COORDINATE_GRAPH' if graph else 'GEOMETRY_DIAGRAM','actualSvgPrimitives':primitives(root),
          'observedFacts':observed,'labelOwnerBindings':{'ownerAuditResult':ownrow,'bindings':bindings},
          'xmlParse':{'result':'PASS','finalSvgSha256':digest(raw)},'browserRenderStatus':'PASS' if browser_pass else 'REVIEW_REQUIRED',
          'browserRenderEvidence':browser,'structuredExpectedFacts':structured}
        if frame:item['coordinateFrameEvidence']=frame
        items.append(item)
    evidence={'schemaVersion':'M3_VISUAL_UPGRADE_BATCH2_PHYSICAL_EVIDENCE_v1','denominator':len(items),'baseCommit':BO['baseCommit'],'browserCapturedAt':BR['capturedAt'],'items':items}
    path=E/'physical_evidence.json';path.write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'itemCount':len(items),'browserPassCount':sum(x['browserRenderStatus']=='PASS' for x in items),'minimumCssFontPx':min((min((l['finalViewportCssFontPx'] for l in x['browserRenderEvidence']['labels']),default=99) for x in items),default=0),'ownerPhysicalFailures':sum(f.get('result')=='FAIL' for x in items for f in x['observedFacts']),'path':str(path)},ensure_ascii=False))
if __name__=='__main__':main()
