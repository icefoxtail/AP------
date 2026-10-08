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
    def style_declarations(node):
        declarations={}
        for part in (node.get('style') or '').split(';'):
            if ':' not in part:continue
            key,value=part.split(':',1)
            declarations[key.strip().lower()]=value.strip()
        return declarations
    def presentation_value(node,name):
        value=node.get(name)
        if value is not None:return value.strip()
        return style_declarations(node).get(name)
    def numeric_value(value):
        if value is None:return None
        try:return float(str(value).strip().rstrip('%'))/(100 if str(value).strip().endswith('%') else 1)
        except (TypeError,ValueError):return None
    def chain(node):
        result=[]
        while node is not None:
            result.append(node);node=parents.get(node)
        return result
    def append_visibility_error(code,node):
        token=f'{code}:{node.get("id") or node.get("data-role") or "anonymous"}'
        if token not in errors:errors.append(token)
    def effect_value(node,name):
        value=presentation_value(node,name)
        return value is not None and str(value).strip().lower() not in {'','none','initial','inherit','unset'}
    geometry_roles={'point','line','axis','tick','indicator','circle','curve','auxiliary'}
    for node in root.iter():
        role=node.get('data-role')
        if role in geometry_roles:
            for ancestor in chain(node):
                opacity=numeric_value(presentation_value(ancestor,'opacity'))
                if opacity is not None and opacity<=0:append_visibility_error('HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE',node)
                if str(presentation_value(ancestor,'display') or '').strip().lower()=='none':append_visibility_error('HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE',node)
                if str(presentation_value(ancestor,'visibility') or '').strip().lower() in {'hidden','collapse'}:append_visibility_error('HIDDEN_GEOMETRY_PRESENTATION_ATTRIBUTE',node)
                if effect_value(ancestor,'clip-path') or effect_value(ancestor,'mask'):append_visibility_error('UNSUPPORTED_GEOMETRY_CLIPPING_OR_MASK',node)
            if role in {'line','axis','tick'}:
                if str(presentation_value(node,'stroke') or '').strip().lower()=='none':append_visibility_error('HIDDEN_GEOMETRY_STROKE',node)
                stroke_opacity=numeric_value(presentation_value(node,'stroke-opacity'))
                if stroke_opacity is not None and stroke_opacity<=0:append_visibility_error('HIDDEN_GEOMETRY_STROKE',node)
    for wrapper in [node for node in root.iter() if node.get('data-fragment-sha')]:
        for ancestor in chain(wrapper):
            opacity=numeric_value(presentation_value(ancestor,'opacity'))
            if opacity is not None and opacity<=0:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(ancestor,'display') or '').strip().lower()=='none':append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(ancestor,'visibility') or '').strip().lower() in {'hidden','collapse'}:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if effect_value(ancestor,'clip-path') or effect_value(ancestor,'mask'):append_visibility_error('UNSUPPORTED_FRAGMENT_CLIPPING_OR_MASK',wrapper)
        for descendant in wrapper.iter():
            opacity=numeric_value(presentation_value(descendant,'opacity'))
            if opacity is not None and opacity<=0:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(descendant,'display') or '').strip().lower()=='none':append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if str(presentation_value(descendant,'visibility') or '').strip().lower() in {'hidden','collapse'}:append_visibility_error('HIDDEN_FRAGMENT_PRESENTATION_ATTRIBUTE',wrapper)
            if effect_value(descendant,'clip-path') or effect_value(descendant,'mask'):append_visibility_error('UNSUPPORTED_FRAGMENT_CLIPPING_OR_MASK',wrapper)
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
    for oid,expected in (p.get('lines') or {}).items():
        n=elements.get(oid)
        if n is None or n.tag.split('}')[-1]!='line' or n.get('data-role')!='line':errors.append('LINE_MISSING:'+oid);continue
        try:coefficients=[float(value) for value in expected];actual=[inverse(float(n.get('x1')),float(n.get('y1'))),inverse(float(n.get('x2')),float(n.get('y2')))]
        except (TypeError,ValueError):errors.append('LINE_FACT_INVALID:'+oid);continue
        a,b,c=coefficients;norm=math.hypot(a,b)
        if norm<=1e-12:errors.append('LINE_FACT_DEGENERATE:'+oid);continue
        residuals=[abs(a*x+b*y+c)/norm for x,y in actual]
        if max(residuals)>1e-7:errors.append('LINE_EQUATION_MISMATCH:'+oid)
        observations.append({'id':oid,'type':'LINE','observedEndpoints':actual,'equationResiduals':residuals})
    for oid,expected in (p.get('circles') or {}).items():
        n=elements.get(oid)
        if n is None or n.tag.split('}')[-1]!='circle' or n.get('data-role')!='circle':errors.append('CIRCLE_MISSING:'+oid);continue
        try:center=expected['center'];radius=float(expected['radius']);observed_center=inverse(float(n.get('cx')),float(n.get('cy')));observed_radius=float(n.get('r'))/sx
        except (KeyError,TypeError,ValueError):errors.append('CIRCLE_FACT_INVALID:'+oid);continue
        center_delta=math.dist(observed_center,center);radius_delta=abs(observed_radius-radius)
        if center_delta>1e-7 or radius_delta>1e-7:errors.append('CIRCLE_GEOMETRY_MISMATCH:'+oid)
        observations.append({'id':oid,'type':'CIRCLE','observedCenter':observed_center,'observedRadius':observed_radius,'centerDelta':center_delta,'radiusDelta':radius_delta})
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
    return {'status':'FAIL' if errors else 'PASS','errors':errors,'observations':observations,'finalSvgSha256':'sha256:'+hashlib.sha256(svg.encode('utf-8')).hexdigest(),'fragmentCount':len(wrappers),'strategy':'FINAL_XML_POINTS_SEGMENTS_LINES_CIRCLES_FRAME_AND_BOUND_GLYPH_BYTES'}

input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
try:result,status=audit(payload),'OK'
except (ValueError,KeyError,TypeError,ET.ParseError) as error:result,status={'code':str(error)},'ERROR'
print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
