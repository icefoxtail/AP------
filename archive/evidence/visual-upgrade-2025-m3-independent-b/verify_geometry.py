"""Independent raw-SVG geometry/owner verifier for generated M3 assets.

The builder emits pixels from explicit Python models. This verifier then
reopens only the final SVG bytes, parses XML and recomputes each relation from
the serialized primitive coordinates. Text and data attributes never provide
observed numeric facts.
"""
import hashlib, json, math, re, xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path.cwd()
EVID=Path('archive/evidence/visual-upgrade-2025-m3-independent-b')
NS='{http://www.w3.org/2000/svg}'
BUILT=json.loads((EVID/'build_outputs.json').read_text(encoding='utf-8'))
INV=json.loads((EVID/'inventory.json').read_text(encoding='utf-8'))
TRI=json.loads((EVID/'triage.json').read_text(encoding='utf-8'))
TRI_BY={x['questionUid']:x for x in TRI['triage']}
INV_BY={q['questionUid']:(exam,q) for exam in INV['exams'] for q in exam['questions']}

def sha(b): return 'sha256:'+hashlib.sha256(b).hexdigest()
def physical_blob(b): return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def xy(element,x='x',y='y'): return (float(element.attrib[x]),float(element.attrib[y]))
def vec(a,b): return (b[0]-a[0],b[1]-a[1])
def norm(v): return math.hypot(v[0],v[1])
def distance(a,b): return norm(vec(a,b))
def dot(a,b): return a[0]*b[0]+a[1]*b[1]
def cross(a,b): return a[0]*b[1]-a[1]*b[0]
def relative_residual(a,b):
    d=norm(a)*norm(b)
    return abs(dot(a,b))/d if d else None
def line_dist(point,a,b):
    v=vec(a,b);n=norm(v)
    return (abs(cross(v,vec(a,point)))/n if n else None,
            dot(vec(a,point),v)/(n*n) if n else None)
def screen_angle(vertex,a,b):
    u=vec(vertex,a);v=vec(vertex,b)
    return abs(math.degrees(math.atan2(cross(u,v),dot(u,v))))
def line_id(segmap,name):
    key=name if name in segmap else 'seg-'+name
    if key not in segmap: raise KeyError('MISSING_SEGMENT:seg-'+name)
    el=segmap[key]
    return xy(el,'x1','y1'),xy(el,'x2','y2')
def roundv(x): return round(x,12) if isinstance(x,(int,float)) else x

def extract(svg_bytes):
    root=ET.fromstring(svg_bytes)
    ids={}
    for e in root.iter():
        ident=e.attrib.get('id')
        if ident:
            if ident in ids: raise ValueError('DUPLICATE_ID:'+ident)
            ids[ident]=e
    pts={k[3:]:xy(e,'cx','cy') for k,e in ids.items() if k.startswith('pt-')}
    segs={k[4:]:e for k,e in ids.items() if k.startswith('seg-')}
    circles={k[7:]:{'center':xy(e,'cx','cy'),'r':float(e.attrib['r']),'element':e}
             for k,e in ids.items() if k.startswith('circle-')}
    labels={k:e for k,e in ids.items() if k.startswith('label-')}
    prim=[]
    for e in root.iter():
        name=e.tag.rsplit('}',1)[-1]
        if name in {'circle','line','polyline','polygon','path','rect'}:
            prim.append({'id':e.attrib.get('id'),'tag':name,
                         'attributes':dict(e.attrib)})
    return root,ids,pts,segs,circles,labels,prim

def observed_check(check, pts, segs, circles):
    typ=check['type'];expected=check.get('expected');tol=check.get('tolerance',1e-6)
    base={'id':check['id'],'type':typ,'expected':expected,'tolerance':tol}
    if typ=='distance':
        px=distance(pts[check['points'][0]],pts[check['points'][1]])
        observed=px/check['scalePxPerUnit'];delta=observed-expected
        return {**base,'observed':roundv(observed),'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='ratio':
        n1,n2=check['segments'];a1,b1=line_id(segs,n1);a2,b2=line_id(segs,n2)
        observed=distance(a1,b1)/distance(a2,b2);delta=observed-expected
        return {**base,'observed':roundv(observed),'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='perpendicular':
        s1,s2=check['segments'];a,b=line_id(segs,s1);c,d=line_id(segs,s2)
        residual=relative_residual(vec(a,b),vec(c,d))
        return {**base,'observed':{'normalizedDotResidual':roundv(residual)},
                'delta':roundv(residual),'result':'PASS' if residual is not None and residual<=tol else 'FAIL'}
    if typ=='parallel':
        s1,s2=check['segments'];a,b=line_id(segs,s1);c,d=line_id(segs,s2)
        va=vec(a,b);vb=vec(c,d);den=norm(va)*norm(vb);res=abs(cross(va,vb))/den if den else None
        return {**base,'observed':{'normalizedCrossResidual':roundv(res)},'delta':roundv(res),
                'result':'PASS' if res is not None and res<=tol else 'FAIL'}
    if typ=='angle':
        v=pts[check['vertex']];a=pts[check['rays'][0]];b=pts[check['rays'][1]]
        observed=screen_angle(v,a,b);delta=observed-expected
        return {**base,'ownerVertex':check['vertex'],'ownerRays':check['rays'],
                'observed':roundv(observed),'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='midpoint':
        mid=pts[check['point']];a=pts[check['ends'][0]];b=pts[check['ends'][1]]
        derived=((a[0]+b[0])/2,(a[1]+b[1])/2);err=distance(mid,derived)
        return {**base,'ownerPoint':check['point'],'ownerSegment':check['ends'],
                'observed':{'midpoint':list(map(roundv,mid)),'derived':list(map(roundv,derived))},
                'deltaPx':roundv(err),'result':'PASS' if err<=tol else 'FAIL'}
    if typ=='circle_point':
        c=circles[check['circle']];r=distance(c['center'],pts[check['point']]);delta=(r-c['r'])/check['scalePxPerUnit']
        return {**base,'observed':{'center':list(map(roundv,c['center'])),'radiusPx':roundv(c['r']),
                                   'pointRadiusPx':roundv(r),'point':check['point']},
                'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='area':
        a,b,c=(pts[x] for x in check['triangle']);px=abs(cross(vec(a,b),vec(a,c)))/2
        observed=px/(check['scalePxPerUnit']**2);delta=observed-expected
        return {**base,'observed':roundv(observed),'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='quad_area':
        p=[pts[x] for x in check['points']]
        area=abs(sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p)))/2)
        observed=area/(check['scalePxPerUnit']**2);delta=observed-expected
        return {**base,'observed':roundv(observed),'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='line_slope':
        a,b=line_id(segs,check['segment']);ox,oy=check['origin'];s=check['scalePxPerUnit']
        mx1=(a[0]-ox)/s;my1=(oy-a[1])/s;mx2=(b[0]-ox)/s;my2=(oy-b[1])/s
        observed=(my2-my1)/(mx2-mx1);delta=observed-expected
        return {**base,'observed':roundv(observed),'mathEndpoints':[[roundv(mx1),roundv(my1)],[roundv(mx2),roundv(my2)]],
                'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='line_intercept':
        a,b=line_id(segs,check['segment']);ox,oy=check['origin'];s=check['scalePxPerUnit']
        x1=(a[0]-ox)/s;y1=(oy-a[1])/s;x2=(b[0]-ox)/s;y2=(oy-b[1])/s;m=(y2-y1)/(x2-x1)
        observed=y1-m*x1;delta=observed-expected
        return {**base,'observed':roundv(observed),'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='height_sum':
        vals=[]
        for name in check['segments']:
            a,b=line_id(segs,name);vals.append(distance(a,b)/check['scalePxPerUnit'])
        observed=sum(vals);delta=observed-check['expected']
        return {**base,'observed':roundv(observed),'summandLengths':list(map(roundv,vals)),
                'delta':roundv(delta),'result':'PASS' if abs(delta)<=tol else 'FAIL'}
    if typ=='equal':
        vals=[]
        if 'segments' in check:
            for sid in check['segments']:
                a,b=line_id(segs,sid);vals.append(distance(a,b))
        elif 'points' in check:
            for pair in check['points']:vals.append(distance(pts[pair[0]],pts[pair[1]]))
        delta=(max(vals)-min(vals)) if vals else math.inf
        return {**base,'observedLengthsPx':list(map(roundv,vals)),'deltaPx':roundv(delta),
                'result':'PASS' if delta<=tol else 'FAIL'}
    if typ=='incircle_tangent':
        circle=circles[check['circle']];center=circle['center'];radius=circle['r'];rows=[]
        for point,side in zip(check['points'],check['sides']):
            a,b=line_id(segs,side);d,t=line_dist(pts[point],a,b);on_circle=distance(center,pts[point])
            rows.append({'point':point,'side':side,'projectionFraction':roundv(t),
                         'pointLineDistancePx':roundv(d),'circleRadiusPx':roundv(radius),
                         'pointOnCircleDeltaPx':roundv(on_circle-radius),
                         'perpendicularityDeltaPx':roundv(d-radius)})
        ok=all(-.001<=r['projectionFraction']<=1.001 and abs(r['pointOnCircleDeltaPx'])<=tol and
               abs(r['perpendicularityDeltaPx'])<=tol for r in rows)
        return {**base,'observed':rows,'result':'PASS' if ok else 'FAIL'}
    raise ValueError('UNSUPPORTED_CHECK:'+typ)

def owner_evidence(root,pts,segs,circles,labels):
    out={'pointLabels':[],'lengthLabels':[],'angleLabels':[],'rightAngleMarks':[],'ticks':[]}
    for ident,e in labels.items():
        kind=e.attrib.get('data-label-kind');pos=xy(e)
        if kind=='point':
            owner=e.attrib.get('data-owner-point');target=pts[owner[3:]];delta=distance(pos,target)
            out['pointLabels'].append({'labelId':ident,'text':''.join(e.itertext()),'ownerPoint':owner,
                'labelAnchor':[roundv(x) for x in pos],'pointCoordinate':[roundv(x) for x in target],
                'anchorToPointDistancePx':roundv(delta),'ownerAnchorToleranceSvgUnits':40,
                'result':'PASS' if delta<=40 else 'FAIL'})
        elif kind=='length':
            owner=e.attrib.get('data-owner-segment');sid=owner[4:];a,b=line_id(segs,sid);d,t=line_dist(pos,a,b)
            out['lengthLabels'].append({'labelId':ident,'text':''.join(e.itertext()),'ownerSegment':owner,
                'labelAnchor':[roundv(x) for x in pos],'projectionFraction':roundv(t),
                'perpendicularClearancePx':roundv(d),'ownerProjectionTolerance':[-0.12,1.12],
                'ownerClearanceToleranceSvgUnits':40,
                'result':'PASS' if -0.12<=t<=1.12 and d<=40 else 'FAIL'})
        elif kind=='angle':
            vertex=e.attrib.get('data-owner-vertex');rays=e.attrib.get('data-owner-rays','').split()
            v=pts[vertex[3:]];s1=rays[0][4:];s2=rays[1][4:];a,b=line_id(segs,s1);c,d=line_id(segs,s2)
            # For angle owner rays, recover their endpoints from the referenced segment.
            def other_end(sid,at):
                seg=next(s for s in root.iter() if s.attrib.get('id')=='seg-'+sid)
                p1=xy(seg,'x1','y1');p2=xy(seg,'x2','y2')
                return p2 if distance(p1,at)<=1e-5 else p1
            r1=other_end(s1,v);r2=other_end(s2,v);u=(r1[0]-v[0],r1[1]-v[1]);w=(r2[0]-v[0],r2[1]-v[1]);z=(pos[0]-v[0],pos[1]-v[1])
            delta=math.atan2(cross(u,z),dot(u,z));sector=math.atan2(cross(u,w),dot(u,w));inside=(0<=delta<=sector+1e-6) if sector>=0 else (sector-1e-6<=delta<=0)
            radius=norm(z)
            out['angleLabels'].append({'labelId':ident,'text':''.join(e.itertext()),'ownerVertex':vertex,
                'ownerRays':rays,'labelAnchor':[roundv(x) for x in pos],'angularDeltaFromRay1Deg':roundv(math.degrees(delta)),
                'ownerSectorDeg':roundv(math.degrees(sector)),'distanceFromVertexPx':roundv(radius),
                'insideOwnerWedge':inside,'ownerRadiusToleranceSvgUnits':[22,70],
                'result':'PASS' if inside and 22<=radius<=70 else 'FAIL'})
    for e in root.iter():
        ident=e.attrib.get('id','')
        if ident.startswith('right-angle-'):
            out['rightAngleMarks'].append({'id':ident,'ownerVertex':e.attrib.get('data-owner-vertex'),
                'ownerRays':e.attrib.get('data-owner-rays'),'polylinePoints':e.attrib.get('points')})
        if ident.startswith('tick-'):
            out['ticks'].append({'id':ident,'ownerSegment':e.attrib.get('data-owner-segment'),
                'endpoints':[[float(x) for x in pair.split(',')] for pair in e.attrib.get('points','').split()]})
    return out

def main():
    results=[]
    for item in BUILT['assets']:
        path=Path(item['svgPath']);raw=path.read_bytes();root,ids,pts,segs,circles,labels,prims=extract(raw)
        offset=item['coordinateModel'].get('layoutTranslationPx',[0,0])
        checks=[]
        for check in item['structuredExpectedFacts']:
            check=dict(check)
            if 'origin' in check:
                check['origin']=[check['origin'][0]+offset[0],check['origin'][1]+offset[1]]
            checks.append(check)
        fact_rows=[observed_check(check,pts,segs,circles) for check in checks]
        owners=owner_evidence(root,pts,segs,circles,labels)
        owner_failures=sum(row['result']!='PASS' for key in ('pointLabels','lengthLabels','angleLabels') for row in owners[key])
        right_count=sum(1 for e in root.iter() if e.attrib.get('id','').startswith('right-angle-'))
        tick_count=sum(1 for e in root.iter() if e.attrib.get('id','').startswith('tick-'))
        font_sizes=sorted({e.attrib.get('font-size') for e in root.iter() if e.tag==NS+'text'})
        structural=[]
        if root.tag!=NS+'svg':structural.append('SVG_ROOT_INVALID')
        if root.attrib.get('viewBox')!='0 0 420 300':structural.append('VIEWBOX_INVALID')
        if len(ids)!=len(set(ids)):structural.append('DUPLICATE_IDS')
        if any(row['result']!='PASS' for row in fact_rows):structural.append('EXPECTED_OBSERVED_RELATION_FAIL')
        if owner_failures:structural.append('LABEL_OWNER_BINDING_FAIL')
        t=TRI_BY[item['questionUid']]
        exam,sourceq=INV_BY[item['questionUid']]
        result={'schemaVersion':'M3_SVG_PHYSICAL_EVIDENCE_v1','baseCommit':INV['baseCommit'],
            'questionUid':item['questionUid'],'qid':item['qid'],'action':item['action'],
            'sourceExamFile':item['sourcePath'],'sourceExamSha256':item['baselineSourceExamSha256'],
            'baselineSourceGitBlobSha':exam['sourceGitBlobSha'],'solutionSha256':item['solutionSha256'],
            'problemImagePath':sourceq['problemImagePath'],'problemImageSha256':sourceq['problemImageSha256'],
            'assetPath':item['svgPath'],'assetSha256':sha(raw),'physicalAssetGitBlobSha':physical_blob(raw),
            'expectedFacts':item['expectedFacts'],'structuredExpectedFacts':item['structuredExpectedFacts'],
            'pythonInputs':item['pythonInputs'],'pythonCalculatedOutputs':item['pythonOutputs'],
            'coordinateModel':item['coordinateModel'],'actualSvgPrimitives':prims,
            'observedFacts':fact_rows,'labelOwnerBindings':owners,
            'authoredFontSizes':font_sizes,'xmlParse':{'result':'PASS','rootTag':'svg','namespace':NS[1:-1],
                'elementCount':sum(1 for _ in root.iter()),'uniqueIdCount':len(ids),'parseBytes':len(raw)},
            'browserRenderStatus':'PENDING','renderEvidencePath':None,
            'geometryResult':'FAIL' if structural else 'PASS','failures':structural}
        results.append(result)
    out={'schemaVersion':'M3_SVG_PHYSICAL_EVIDENCE_LEDGER_v1','denominator':len(results),
         'passCount':sum(x['geometryResult']=='PASS' for x in results),
         'failCount':sum(x['geometryResult']!='PASS' for x in results),'items':results}
    (EVID/'svg_physical_evidence.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'denominator':out['denominator'],'passCount':out['passCount'],'failCount':out['failCount'],
                      'failures':[{'qid':x['questionUid'],'reasons':x['failures']} for x in results if x['failures']],
                      'output':'archive/evidence/visual-upgrade-2025-m3-independent-b/svg_physical_evidence.json'},ensure_ascii=False))

if __name__=='__main__':main()
