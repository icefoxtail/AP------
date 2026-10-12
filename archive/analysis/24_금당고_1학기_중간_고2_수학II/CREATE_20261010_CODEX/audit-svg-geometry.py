import json, math, hashlib
import xml.etree.ElementTree as ET
from pathlib import Path

root=Path(r'C:\Users\USER\Desktop\AP-worktrees\h2-1mid-20261010\AP------')
e=root/'archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX'
a=root/'archive/assets/images/24_금당고_1학기_중간_고2_수학II'
checks_out=[]

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def elements(svg,tag):
    return [x for x in svg.iter() if x.tag.split('}')[-1]==tag]
def close(a,b,tol=1e-5): return abs(a-b)<=tol
def transform(spec,svg):
    w=float(svg.attrib['width']);h=float(svg.attrib['height']);xl,xh=spec['xRange'];yl,yh=spec['yRange'];m=32.0
    def tx(x): return m+(x-xl)*(w-2*m)/(xh-xl)
    def ty(y): return h-m-(y-yl)*(h-2*m)/(yh-yl)
    def ix(x): return xl+(x-m)*(xh-xl)/(w-2*m)
    def iy(y): return yl+((h-m-y)*(yh-yl)/(h-2*m))
    return tx,ty,ix,iy,(w-2*m)/(xh-xl),(h-2*m)/(yh-yl)
def line_models(spec,svg):
    tx,ty,ix,iy,_,_=transform(spec,svg)
    return [(e, (ix(float(e.attrib['x1'])),iy(float(e.attrib['y1']))),(ix(float(e.attrib['x2'])),iy(float(e.attrib['y2'])))) for e in elements(svg,'line')]
def curve_models(spec,svg):
    tx,ty,ix,iy,*_=transform(spec,svg); out=[]
    for e in elements(svg,'polyline'):
        if e.attrib.get('class')!='curve': continue
        pts=[]
        for token in e.attrib['points'].split():
            x,y=token.split(',');pts.append((ix(float(x)),iy(float(y))))
        out.append(pts)
    return out
def circle_models(spec,svg):
    tx,ty,ix,iy,xs,ys=transform(spec,svg)
    return [(ix(float(e.attrib['cx'])),iy(float(e.attrib['cy'])),float(e.attrib['r'])/xs) for e in elements(svg,'circle') if e.attrib.get('class')=='shape']
def audit(qid, expected):
    sp=e/f'q{qid}-solution.json'; ap=a/f'q{qid}-solution.svg'; pp=e/f'q{qid}-solution.static-preview.png'
    spec=json.loads(sp.read_text(encoding='utf-8'));svg=ET.fromstring(ap.read_text(encoding='utf-8')); facts=[]
    facts.append({'expected':'actual SVG bytes are the final UID-bound asset','observed':{'assetSha256':sha(ap),'staticPreviewSha256':sha(pp),'rendererReportSha256':sha(e/f'q{qid}-solution.render-report.json')},'method':'SOURCE_PIXEL'})
    result=expected(spec,svg)
    facts.extend(result['facts'])
    if not all(x['pass'] for x in result['checks']): raise SystemExit(f'GEOMETRY_PARITY_FAIL:q{qid}:'+','.join(x['name'] for x in result['checks'] if not x['pass']))
    checks_out.append({'qid':qid,'assetRef':'assets/images/24_금당고_1학기_중간_고2_수학II/q%d-solution.svg'%qid,'assetSha256':sha(ap),'expectedFacts':facts,'observedFacts':result['observed'],'checks':result['checks'],'geometryMethod':['COORDINATE_COMPUTE','TOPOLOGY_COMPUTE'],'staticPreview':{'path':str(pp),'sha256':sha(pp),'status':'STATIC_PREVIEW_RENDERED_NOT_BROWSER'},'archiveBrowserRender':'NOT_RUN'})

def q7(spec,svg):
    lines=line_models(spec,svg); t=[x for x in lines if x[0].attrib.get('class')=='tangent'];curves=curve_models(spec,svg)
    assert len(t)==1 and len(curves)==1
    (x1,y1),(x2,y2)=t[0][1:];slope=(y2-y1)/(x2-x1);inter=y1-slope*x1
    point=(1,5);line_ok=close(slope,1) and close(inter,4) and close(point[1],slope*point[0]+inter)
    curve_has=any(close(x,1) and close(y,5) for x,y in curves[0])
    return {'facts':[{'expected':'tangent y=x+4 at A(1,5)','observed':{'slope':slope,'yIntercept':inter,'contactPointOnTangent':line_ok,'contactPointOnSampledCurve':curve_has},'method':'COORDINATE_COMPUTE'}],
      'observed':{'tangentModelEndpoints':[[x1,y1],[x2,y2]],'curvePointCount':len(curves[0])},
      'checks':[{'name':'tangent_line_slope_and_intercept','pass':line_ok},{'name':'curve_contains_exact_contact_point','pass':curve_has}]}
def q12(spec,svg):
    lines=line_models(spec,svg);t=[x for x in lines if x[0].attrib.get('class')=='tangent'];cs=curve_models(spec,svg)
    assert len(t)==2 and len(cs)==1
    vals=[]
    for _,p1,p2 in t:
        m=(p2[1]-p1[1])/(p2[0]-p1[0]);b=p1[1]-m*p1[0];vals.append((m,b,p1,p2))
    contact=[any(close(x,0) and close(y,1) for x,y in cs[0]),any(close(x,2) and close(y,3) for x,y in cs[0])]
    ok=close(vals[0][0],3) and close(vals[1][0],3) and close(vals[0][1],1) and close(vals[1][1],-3) and all(contact)
    return {'facts':[{'expected':'tangents y=3x+1 at (0,1) and y=3x−3 at (2,3)','observed':{'slopes':[v[0] for v in vals],'intercepts':[v[1] for v in vals],'curveContactsPresent':contact},'method':'COORDINATE_COMPUTE'}],
      'observed':{'tangentModelEndpoints':[[v[2],v[3]] for v in vals]},
      'checks':[{'name':'both_tangent_lines_have_slope_3_and_correct_intercepts','pass':ok},{'name':'curve_sample_contains_both_contacts','pass':all(contact)}]}
def q15(spec,svg):
    lines=line_models(spec,svg);segments=[x for x in lines if x[0].attrib.get('class') in ('shape','perpendicular')];circles=sorted(circle_models(spec,svg),key=lambda v:v[2]);angles=[x for x in elements(svg,'polyline') if x.attrib.get('class')=='right-angle']
    h=(36/25,48/25);dist=math.hypot(*h);ab=3*h[0]+4*h[1]
    has_alt=False
    for _,p1,p2 in segments:
        if (close(p1[0],0) and close(p1[1],0) and close(p2[0],h[0]) and close(p2[1],h[1])) or (close(p2[0],0) and close(p2[1],0) and close(p1[0],h[0]) and close(p1[1],h[1])):has_alt=True
    radii=[x[2] for x in circles]
    ok=len(circles)==3 and all(close(x[0],0) and close(x[1],0) for x in circles) and all(close(a,b) for a,b in zip(radii,[2.4,3,4])) and close(dist,2.4) and close(ab,12) and has_alt and len(angles)>=1
    return {'facts':[{'expected':'concentric thresholds r=12/5,3,4; H=(36/25,48/25) lies on AB and OH⊥AB','observed':{'circleCentersAndRadii':circles,'footDistance':dist,'lineResidualAtH':ab,'altitudeSegmentPresent':has_alt,'rightAngleMarkerCount':len(angles)},'method':'COORDINATE_COMPUTE'}],
      'observed':{'circleCentersAndRadii':circles,'altitudeModelSegmentPresent':has_alt},
      'checks':[{'name':'three_exact_concentric_radius_thresholds','pass':len(circles)==3 and all(close(x[0],0) and close(x[1],0) for x in circles) and all(close(a,b) for a,b in zip(radii,[2.4,3,4]))},{'name':'perpendicular_foot_and_distance_12_over_5','pass':close(dist,2.4) and close(ab,12) and has_alt and len(angles)>=1}]}
def q16(spec,svg):
    curves=curve_models(spec,svg);okshape=len(curves)==2 and all(all(close(y,(x+1)**2+4) for x,y in curves[0] if x<=-1+1e-7) and all(close(y,-(x+1)**2+4) for x,y in curves[1] if x>=-1-1e-7) for _ in [0])
    meet=[any(close(x,-1) and close(y,4) for x,y in c) for c in curves];root=any(close(x,1) and close(y,0) for x,y in curves[1])
    return {'facts':[{'expected':'left branch (x+1)^2+4, right branch −(x+1)^2+4; common join (−1,4); right zero (1,0)','observed':{'curveCount':len(curves),'joinPresentByBranch':meet,'rightZeroPresent':root},'method':'COORDINATE_COMPUTE'}],
      'observed':{'curvePointCounts':[len(c) for c in curves]},
      'checks':[{'name':'each_piece_matches_derived_quadratic','pass':okshape},{'name':'join_and_zero_coordinates','pass':all(meet) and root}]}
def q19(spec,svg):
    lines=line_models(spec,svg);t=[x for x in lines if x[0].attrib.get('class')=='tangent'];cs=circle_models(spec,svg);cir=[c for c in cs if c[2]>1];assert len(t)==1 and len(cir)==1
    m=(t[0][2][1]-t[0][1][1])/(t[0][2][0]-t[0][1][0]);b=t[0][1][1]-m*t[0][1][0];cx,cy,r=cir[0];P=(1,4);Pdist=math.hypot(cx-P[0],cy-P[1]);resid=abs(2*cx-cy+2)/math.sqrt(5)
    tx,ty,_,_,*_=transform(spec,svg); T=(2*math.sqrt(5)-1,0);tangentOk=close(m,2) and close(b,2) and close(P[1],m*P[0]+b)
    circleOk=close(cx,2*math.sqrt(5)-1) and close(cy,5-math.sqrt(5)) and close(r,5-math.sqrt(5)) and close(Pdist,r) and close(resid,r) and close(cy,r)
    return {'facts':[{'expected':'circle center (2√5−1,5−√5), radius 5−√5; l:y=2x+2 tangent at P and x-axis tangent at T','observed':{'center':[cx,cy],'radius':r,'tangentLineSlopeIntercept':[m,b],'PDistanceToCenter':Pdist,'centerToLineDistance':resid,'centerHeight':cy},'method':'COORDINATE_COMPUTE'}],
      'observed':{'circleCenterAndRadius':[cx,cy,r]},
      'checks':[{'name':'circle_center_radius_and_tangencies','pass':circleOk},{'name':'line_l_passes_P_with_slope_2','pass':tangentOk}]}

audit(7,q7);audit(12,q12);audit(15,q15);audit(16,q16);audit(19,q19)
out={'schemaVersion':'JS_ARCHIVE_CREATE_VISUAL_GEOMETRY_PARITY_V1','examUid':'24_금당고_1학기_중간_고2_수학II','renderer':'alive/engine/visual_renderer.py@0.5.2-circle-geometry-label-layout','renderBasis':'STATIC_PREVIEW_RENDERED_NOT_BROWSER','rows':checks_out}
p=e/'CREATE.visual-geometry-parity.json';p.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'path':str(p),'qidCount':len(checks_out),'sha256':sha(p),'checks':[{'qid':r['qid'],'checks':r['checks']} for r in checks_out]},ensure_ascii=False,indent=2))
