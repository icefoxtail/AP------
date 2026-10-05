"""Independent final XML observations; no producer geometry/layout imports."""
import hashlib
import json
import math
import sys
import xml.etree.ElementTree as ET
from worker import read_request,VERSION

def audit(p):
    svg=p['svg'];root=ET.fromstring(svg);errors=[];observations=[]
    ids=[n.get('id') for n in root.iter() if n.get('id')]
    if len(ids)!=len(set(ids)):errors.append('DUPLICATE_SVG_ID')
    model=p['transform'];ox,oy,sx,sy=[model[k] for k in ('originX','originY','sx','sy')]
    if not all(math.isfinite(v) for v in [ox,oy,sx,sy]) or min(sx,sy)<=0:raise ValueError('INVALID_FRAME')
    inverse=lambda x,y:((x-ox)/sx,(oy-y)/sy)
    elements={n.get('id'):n for n in root.iter() if n.get('id')}
    parents={child:parent for parent in root.iter() for child in parent}
    for n in root.iter():
        if n.get('data-role') not in {'point','line','axis','tick','indicator','circle','curve','auxiliary'}:continue
        ancestor=n
        while ancestor is not None:
            if ancestor.get('transform') or any(token in ancestor.get('style','').lower() for token in ('transform','opacity','visibility','display:','url(')):errors.append('UNSUPPORTED_GEOMETRY_TRANSFORM_OR_VISIBILITY')
            ancestor=parents.get(ancestor)
    if 'model-x-axis' in elements:
        a,b=elements['model-x-axis'],elements['model-y-axis']
        if abs(float(a.get('y1'))-float(a.get('y2')))>1e-8 or abs(float(b.get('x1'))-float(b.get('x2')))>1e-8 or abs(float(a.get('y1'))-oy)>1e-8 or abs(float(b.get('x1'))-ox)>1e-8:errors.append('OBSERVED_AXIS_FRAME_MISMATCH')
        for oid,coordinate in [('model-x-unit',(1,0)),('model-y-unit',(0,1))]:
            n=elements[oid];value=inverse(float(n.get('x1')),float(n.get('y1')))
            if math.dist(value,coordinate)>1e-8:errors.append('OBSERVED_UNIT_MISMATCH')
    if p.get('coordinateMode')=='CONSTRUCTED_REALIZATION' and abs(sx-sy)>1e-9:errors.append('UNEQUAL_GEOMETRY_UNITS')
    for oid,expected in (p.get('points') or {}).items():
        n=elements.get(oid)
        if n is None or n.tag.split('}')[-1]!='circle' or n.get('data-role')!='point':errors.append('POINT_MISSING:'+oid);continue
        value=inverse(float(n.get('cx')),float(n.get('cy')));delta=math.dist(value,expected)
        observations.append({'id':oid,'expected':expected,'observed':value,'delta':delta,'tolerance':1e-8})
        if delta>1e-8:errors.append('POINT_COORDINATE_MISMATCH:'+oid)
    for segment in p.get('segments',[]):
        n=elements.get(segment['id'])
        if n is None or n.tag.split('}')[-1]!='line':errors.append('SEGMENT_MISSING:'+segment['id']);continue
        actual=[inverse(float(n.get('x1')),float(n.get('y1'))),inverse(float(n.get('x2')),float(n.get('y2')))]
        expected=[p['points'][r] for r in segment['refs']]
        if any(math.dist(a,b)>1e-8 for a,b in zip(actual,expected)):errors.append('SEGMENT_OWNER_MISMATCH:'+segment['id'])
        observations.append({'id':segment['id'],'observedEndpoints':actual,'expectedEndpoints':expected})
    for angle in p.get('rightAngles',[]):
        n=elements.get(angle['id'])
        if n is None or n.tag.split('}')[-1]!='polyline':errors.append('RIGHT_ANGLE_MARK_MISSING:'+angle['id']);continue
        values=[float(v) for part in n.get('points','').split() for v in part.split(',')]
        if len(values)!=6:errors.append('INVALID_RIGHT_ANGLE_MARK');continue
        coords=[inverse(values[i],values[i+1]) for i in range(0,6,2)]
        a,v,b=[p['points'][r] for r in angle['refs']]
        u=[a[i]-v[i] for i in range(2)];w=[b[i]-v[i] for i in range(2)]
        norm=math.hypot(*u)*math.hypot(*w)
        if norm<=0 or abs(sum(u[i]*w[i] for i in range(2)))/norm>1e-8:errors.append('SOURCE_RIGHT_ANGLE_NOT_SATISFIED')
        for target,ray in [(coords[0],u),(coords[2],w)]:
            offset=[target[i]-v[i] for i in range(2)]
            if abs(offset[0]*ray[1]-offset[1]*ray[0])>1e-8 or sum(offset[i]*ray[i] for i in range(2))<=0:errors.append('RIGHT_ANGLE_RAY_OWNER_MISMATCH')
        if math.dist(coords[1],[coords[0][i]+coords[2][i]-v[i] for i in range(2)])>1e-8:errors.append('RIGHT_ANGLE_CORNER_MISMATCH')
        observations.append({'id':angle['id'],'ownerPoints':angle['refs'],'observedMarkPoints':coords})
    wrappers=[n for n in root.iter() if n.get('data-fragment-sha')]
    if set(n.get('id') for n in wrappers)!=set(p['fragments']):errors.append('FRAGMENT_INVENTORY_MISMATCH')
    for oid,f in p['fragments'].items():
        expected='sha256:'+hashlib.sha256(f['svg'].encode('utf-8')).hexdigest()
        if expected!=f['fragmentSha256'] or svg.count(f['svg'])!=1:errors.append('FRAGMENT_BYTES_MISMATCH:'+oid)
        n=elements.get(oid)
        if n is None or n.get('data-owner')!=f['owner'] or n.get('data-fragment-sha')!=expected:errors.append('FRAGMENT_OWNER_MISMATCH:'+oid)
        def tree(node):return (node.tag,tuple(sorted(node.attrib.items())),node.text or '',tuple(tree(c) for c in node))
        if n is not None and (len(n)!=1 or tree(n[0])!=tree(ET.fromstring(f['svg']))):errors.append('ACTUAL_GLYPH_TREE_MISMATCH:'+oid)
    return {'status':'FAIL' if errors else 'PASS','errors':errors,'observations':observations,'finalSvgSha256':'sha256:'+hashlib.sha256(svg.encode('utf-8')).hexdigest(),'fragmentCount':len(wrappers),'strategy':'FINAL_XML_POINTS_SEGMENTS_FRAME_AND_BOUND_GLYPH_BYTES'}

input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
try:result,status=audit(payload),'OK'
except (ValueError,KeyError,TypeError,ET.ParseError) as error:result,status={'code':str(error)},'ERROR'
print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
