"""Independent observer for `ellipse-figure-v1` (separate process, no producer imports).

It re-derives everything from the authored plan with its own exact code and then reads the FINAL
SVG.  Nothing the producer computed is trusted:

  * the two coordinate axes fix the pixel origin, and the drawn ellipse fixes the uniform scale;
    the centre and both semi-axes are then recomputed and compared with the plan;
  * every vertex, focus, mirror point and tangency is recomputed exactly with SymPy;
  * every point marker, segment, polygon and clipped line found in the SVG must sit at the
    recomputed position, and no undeclared one may exist;
  * the tangency claim itself is re-checked exactly (discriminant zero), not read from a label;
  * every drawn neutral name must be the plan's name, inside the canvas, next to its own point,
    and must not cover another point.
"""
import hashlib
import json
import math
import re
import sys
import xml.etree.ElementTree as ET

import sympy as S

from worker import read_request, VERSION

NS='{http://www.w3.org/2000/svg}'
PIXEL_TOLERANCE=0.9
UNIT_TOLERANCE=0.03
LABEL_DISTANCE=72.0
LIGHT_FILL='#eeeeee'
MEDIUM_FILL='#d8d8d8'
POINT_ID=re.compile(r"^[A-Z][0-9']?$")
VALUE_CHARS=re.compile(r"^[0-9+\-*/(). a-z]+$")


class Refuse(Exception):
    pass


def exact_scalar(text):
    if not isinstance(text,str):
        raise Refuse('ELLIPSE_VALUE_INVALID')
    raw=text.strip()
    if not raw or len(raw)>120 or not VALUE_CHARS.fullmatch(raw):
        raise Refuse('ELLIPSE_VALUE_INVALID')
    if re.search(r'[a-z]',raw.replace('sqrt','')):
        raise Refuse('ELLIPSE_VALUE_INVALID')
    try:
        value=S.sympify(raw,locals={'sqrt':S.sqrt},rational=True,evaluate=True)
    except (S.SympifyError,TypeError,ValueError):
        raise Refuse('ELLIPSE_VALUE_INVALID')
    if value.is_real is not True:
        raise Refuse('ELLIPSE_VALUE_INVALID')
    return S.nsimplify(value,rational=False)


def derive(ellipse):
    if not isinstance(ellipse,dict) or set(ellipse)!={'center','semiAxisSquared','majorAxis'}:
        raise Refuse('ELLIPSE_PLAN_INVALID')
    center=ellipse['center']
    if not isinstance(center,list) or len(center)!=2:
        raise Refuse('ELLIPSE_CENTER_INVALID')
    cx,cy=exact_scalar(center[0]),exact_scalar(center[1])
    axes=ellipse['semiAxisSquared']
    if not isinstance(axes,dict) or set(axes)!={'major','minor'}:
        raise Refuse('ELLIPSE_AXES_INVALID')
    major,minor=exact_scalar(axes['major']),exact_scalar(axes['minor'])
    if major<=0 or minor<=0 or major<=minor:
        raise Refuse('ELLIPSE_AXES_INVALID')
    orientation=ellipse['majorAxis']
    if orientation not in ('X','Y'):
        raise Refuse('ELLIPSE_MAJOR_AXIS_UNSUPPORTED')
    A=S.sqrt(major);B=S.sqrt(minor);c=S.sqrt(major-minor)
    ax,ay=(A,B) if orientation=='X' else (B,A)
    return {'cx':cx,'cy':cy,'A':A,'B':B,'c':c,'ax':ax,'ay':ay,'orientation':orientation,
            'major2':major,'minor2':minor}


def resolve(shape,raw):
    kind=raw.get('kind')
    cx,cy,A,B,c=shape['cx'],shape['cy'],shape['A'],shape['B'],shape['c']
    if kind=='ORIGIN':
        if set(raw)!={'id','kind'}: raise Refuse('ELLIPSE_POINT_INVALID')
        return S.Integer(0),S.Integer(0)
    if kind=='FOCUS':
        if set(raw)-{'id','kind','side','label'} or raw.get('side') not in (1,-1):
            raise Refuse('ELLIPSE_POINT_INVALID')
        side=raw['side']
        return (cx+side*c,cy) if shape['orientation']=='X' else (cx,cy+side*c)
    if kind=='VERTEX':
        extra=set(raw)-{'id','kind','end','label'}
        if extra: raise Refuse('ELLIPSE_POINT_INVALID')
        end=raw.get('end')
        table={'MAJOR_POS':(A,0) if shape['orientation']=='X' else (0,A),
               'MAJOR_NEG':(-A,0) if shape['orientation']=='X' else (0,-A),
               'MINOR_POS':(0,B) if shape['orientation']=='X' else (B,0),
               'MINOR_NEG':(0,-B) if shape['orientation']=='X' else (-B,0)}
        if end not in table: raise Refuse('ELLIPSE_POINT_INVALID')
        dx,dy=table[end]
        return cx+dx,cy+dy
    if kind=='ON_ELLIPSE':
        if set(raw)-{'id','kind','x','y','branch','label'}: raise Refuse('ELLIPSE_POINT_INVALID')
        branch=raw.get('branch','POS')
        if branch not in ('POS','NEG'): raise Refuse('ELLIPSE_POINT_INVALID')
        sign=1 if branch=='POS' else -1
        has_x,has_y='x' in raw,'y' in raw
        if has_x==has_y: raise Refuse('ELLIPSE_POINT_INVALID')
        if has_x:
            x=exact_scalar(raw['x'])
            rest=1-((x-cx)/shape['ax'])**2
            if rest.is_negative: raise Refuse('ELLIPSE_POINT_NOT_ON_ELLIPSE')
            return x,cy+sign*shape['ay']*S.sqrt(rest)
        y=exact_scalar(raw['y'])
        rest=1-((y-cy)/shape['ay'])**2
        if rest.is_negative: raise Refuse('ELLIPSE_POINT_NOT_ON_ELLIPSE')
        return cx+sign*shape['ax']*S.sqrt(rest),y
    if kind=='POINT':
        if set(raw)-{'id','kind','x','y','label'}: raise Refuse('ELLIPSE_POINT_INVALID')
        if 'x' not in raw or 'y' not in raw: raise Refuse('ELLIPSE_POINT_INVALID')
        return exact_scalar(raw['x']),exact_scalar(raw['y'])
    raise Refuse('ELLIPSE_POINT_INVALID')


def derive_all(plan):
    if not isinstance(plan,dict):
        raise Refuse('ELLIPSE_PLAN_INVALID')
    if plan.get('capability')!='ellipse-figure-v1':
        raise Refuse('ELLIPSE_PLAN_INVALID')
    shape=derive(plan['ellipse'])
    points={}
    pending=[]
    order=[]
    for raw in plan.get('points',[]) or []:
        pid=raw.get('id')
        if not isinstance(pid,str) or not POINT_ID.fullmatch(pid) or pid in points or pid in order:
            raise Refuse('ELLIPSE_POINT_ID_INVALID')
        order.append(pid)
        if raw.get('kind')=='OPPOSITE':
            pending.append(raw)
        else:
            points[pid]=resolve(shape,raw)
    for _round in range(3):
        if not pending: break
        remaining=[]
        for raw in pending:
            if set(raw)-{'id','kind','of','label'}: raise Refuse('ELLIPSE_POINT_INVALID')
            target=raw.get('of')
            if target not in points:
                remaining.append(raw);continue
            px,py=points[target]
            points[raw['id']]=(2*shape['cx']-px,2*shape['cy']-py)
        if len(remaining)==len(pending): raise Refuse('ELLIPSE_POINT_UNKNOWN')
        pending=remaining
    if pending: raise Refuse('ELLIPSE_POINT_UNKNOWN')
    labels={raw['id']:raw.get('label',True) for raw in (plan.get('points',[]) or [])}
    segments=plan.get('segments',[]) or []
    polygons=plan.get('polygons',[]) or []
    lines=plan.get('lines',[]) or []
    for raw in segments:
        if raw.get('from') not in points or raw.get('to') not in points or raw.get('from')==raw.get('to'):
            raise Refuse('ELLIPSE_SEGMENT_INVALID')
    for raw in polygons:
        members=raw.get('points')
        if not isinstance(members,list) or not (3<=len(members)<=6) or len(set(members))!=len(members):
            raise Refuse('ELLIPSE_POLYGON_INVALID')
        if any(pid not in points for pid in members): raise Refuse('ELLIPSE_POLYGON_INVALID')
    return shape,points,labels,segments,polygons,lines


def _floats(value):
    return float(value.evalf(17))


def _attr_float(element,name,errors,code):
    raw=element.get(name)
    try:
        return float(raw)
    except (TypeError,ValueError):
        errors.append('%s:%s'%(code,name));return 0.0


def _find(elements,role,attr=None):
    found=[element for element in elements if element.get('data-role')==role]
    if attr is None: return found
    return [element for element in found if element.get(attr) is not None]


def _line_coords(element,errors,code):
    return [_attr_float(element,name,errors,code) for name in ('x1','y1','x2','y2')]


def _box_of(element):
    raw=element.get('data-box')
    if not raw: return None
    try:
        parts=[float(value) for value in raw.split(',')]
    except ValueError:
        return None
    if len(parts)!=4: return None
    return {'x':parts[0],'y':parts[1],'width':parts[2],'height':parts[3]}


def _point_in_box(x,y,box,margin=0.0):
    return (box['x']-margin<=x<=box['x']+box['width']+margin and
            box['y']-margin<=y<=box['y']+box['height']+margin)


def _box_distance(x,y,box):
    dx=max(box['x']-x,0.0,x-(box['x']+box['width']))
    dy=max(box['y']-y,0.0,y-(box['y']+box['height']))
    return math.hypot(dx,dy)


def audit(plan,svg):
    """Return {status, errors, finalSvgSha256, checks} for one plan against one final SVG."""
    errors=[]
    checks={'capability':'ellipse-figure-v1'}
    digest='sha256:'+hashlib.sha256(svg.encode('utf-8')).hexdigest()
    try:
        shape,points,labels,segments,polygons,lines=derive_all(plan)
    except Refuse as error:
        return {'status':'FAIL','errors':['PLAN_REFUSED:%s'%error],'finalSvgSha256':digest,'checks':checks}
    try:
        root=ET.fromstring(svg)
    except ET.ParseError:
        return {'status':'FAIL','errors':['SVG_NOT_WELL_FORMED'],'finalSvgSha256':digest,'checks':checks}
    if root.tag!=NS+'svg':
        errors.append('SVG_ROOT_NOT_SVG')
    elements=[element for element in root.iter()]
    width=root.get('width');height=root.get('height')
    try:
        canvas={'width':float(width),'height':float(height)}
    except (TypeError,ValueError):
        errors.append('SVG_INTRINSIC_MISSING');canvas={'width':0.0,'height':0.0}
    if root.get('transform'):
        errors.append('SVG_TRANSFORM_UNSUPPORTED')

    axes={}
    for element in _find(elements,'axis','data-axis'):
        name=element.get('data-axis')
        if name in axes: errors.append('AXIS_DUPLICATE:%s'%name)
        axes[name]=_line_coords(element,errors,'AXIS_COORDINATE_INVALID')
    for name in ('x','y'):
        if name not in axes: errors.append('AXIS_MISSING:%s'%name)
    if len(errors):
        return {'status':'FAIL','errors':errors,'finalSvgSha256':digest,'checks':checks}
    ox=axes['y'][0];oy=axes['x'][1]
    checks['originPixel']={'x':ox,'y':oy}
    # The arrowhead must sit on the positive end of its own axis (x: right, y: top); the delivered
    # figure once put the y head on the negative end, so this is read back from the final SVG.
    heads={}
    for element in _find(elements,'axis-head','data-axis'):
        heads.setdefault(element.get('data-axis'),[]).append(element)
    for name in ('x','y'):
        found=heads.get(name,[])
        if len(found)!=1:
            errors.append('AXIS_HEAD_MISSING_OR_AMBIGUOUS:%s'%name);continue
        try:
            head_points=[[float(value) for value in part.split(',')]
                         for part in (found[0].get('points') or '').split()]
        except ValueError:
            errors.append('AXIS_HEAD_GEOMETRY_INVALID:%s'%name);continue
        if len(head_points)!=3 or any(len(point)!=2 for point in head_points):
            errors.append('AXIS_HEAD_GEOMETRY_INVALID:%s'%name);continue
        tip=head_points[0]
        x1,y1,x2,y2=axes[name]
        if name=='x':
            if tip[0]<max(x1,x2)-PIXEL_TOLERANCE or abs(tip[1]-oy)>PIXEL_TOLERANCE:
                errors.append('AXIS_HEAD_DIRECTION_INVALID:x')
        else:
            if tip[1]>min(y1,y2)+PIXEL_TOLERANCE or abs(tip[0]-ox)>PIXEL_TOLERANCE:
                errors.append('AXIS_HEAD_DIRECTION_INVALID:y')
        checks.setdefault('axisHeads',{})[name]={'tip':tip}
    if len(errors):
        return {'status':'FAIL','errors':errors,'finalSvgSha256':digest,'checks':checks}

    ellipses=_find(elements,'ellipse')
    if len(ellipses)!=1:
        errors.append('ELLIPSE_COUNT_INVALID:%d'%len(ellipses))
        return {'status':'FAIL','errors':errors,'finalSvgSha256':digest,'checks':checks}
    ellipse=ellipses[0]
    if ellipse.get('transform'): errors.append('ELLIPSE_TRANSFORM_UNSUPPORTED')
    ecx=_attr_float(ellipse,'cx',errors,'ELLIPSE_COORDINATE_INVALID')
    ecy=_attr_float(ellipse,'cy',errors,'ELLIPSE_COORDINATE_INVALID')
    erx=_attr_float(ellipse,'rx',errors,'ELLIPSE_COORDINATE_INVALID')
    ery=_attr_float(ellipse,'ry',errors,'ELLIPSE_COORDINATE_INVALID')
    if erx<=0 or ery<=0:
        errors.append('ELLIPSE_RADII_INVALID')
        return {'status':'FAIL','errors':errors,'finalSvgSha256':digest,'checks':checks}
    along_x=shape['A'] if shape['orientation']=='X' else shape['B']
    along_y=shape['B'] if shape['orientation']=='X' else shape['A']
    scale=erx/float(along_x)
    checks['scale']=scale
    if shape['orientation']=='X' and erx<=ery:
        errors.append('ELLIPSE_MAJOR_AXIS_MISMATCH:X major but rx<=ry')
    if shape['orientation']=='Y' and ery<=erx:
        errors.append('ELLIPSE_MAJOR_AXIS_MISMATCH:Y major but ry<=rx')
    if abs(ery-float(along_y)*scale)>PIXEL_TOLERANCE:
        errors.append('ELLIPSE_SCALE_MISMATCH:ry=%.3f expected=%.3f'%(ery,float(along_y)*scale))
    expected_cx=ox+float(shape['cx'])*scale
    expected_cy=oy-float(shape['cy'])*scale
    if abs(ecx-expected_cx)>PIXEL_TOLERANCE:
        errors.append('ELLIPSE_CENTER_MISMATCH:x %.3f vs %.3f'%(ecx,expected_cx))
    if abs(ecy-expected_cy)>PIXEL_TOLERANCE:
        errors.append('ELLIPSE_CENTER_MISMATCH:y %.3f vs %.3f'%(ecy,expected_cy))
    checks['ellipse']={'cx':ecx,'cy':ecy,'rx':erx,'ry':ery}

    def pixel(x,y):
        return ox+float(x)*scale,oy-float(y)*scale

    # every declared point marker, exactly one per id
    markers={}
    for element in _find(elements,'point','data-point'):
        pid=element.get('data-point')
        if pid in markers: errors.append('POINT_DUPLICATE:%s'%pid)
        markers[pid]=(_attr_float(element,'cx',errors,'POINT_COORDINATE_INVALID'),
                      _attr_float(element,'cy',errors,'POINT_COORDINATE_INVALID'))
    for pid,(px,py) in points.items():
        if pid not in markers:
            errors.append('POINT_MISSING:%s'%pid);continue
        ex,ey=pixel(px,py)
        mx,my=markers[pid]
        if math.hypot(mx-ex,my-ey)>PIXEL_TOLERANCE:
            errors.append('POINT_MOVED:%s (%.2f,%.2f) vs (%.2f,%.2f)'%(pid,mx,my,ex,ey))
    for pid in markers:
        if pid not in points: errors.append('POINT_UNDECLARED:%s'%pid)

    # segments: endpoints are the point markers
    found_segments={}
    for element in _find(elements,'segment','data-from'):
        key=(element.get('data-from'),element.get('data-to'))
        if key in found_segments: errors.append('SEGMENT_DUPLICATE:%s-%s'%key)
        found_segments[key]=_line_coords(element,errors,'SEGMENT_COORDINATE_INVALID')
    for raw in segments:
        key=(raw['from'],raw['to'])
        if key not in found_segments:
            errors.append('SEGMENT_MISSING:%s'%raw.get('id'));continue
        sx1,sy1,sx2,sy2=found_segments[key]
        for pid,got in ((raw['from'],(sx1,sy1)),(raw['to'],(sx2,sy2))):
            ex,ey=pixel(*points[pid])
            if math.hypot(got[0]-ex,got[1]-ey)>PIXEL_TOLERANCE:
                errors.append('SEGMENT_ENDPOINT_MOVED:%s:%s'%(raw.get('id'),pid))
    declared_segments={(raw['from'],raw['to']) for raw in segments}|{(raw['to'],raw['from']) for raw in segments}
    for key in found_segments:
        if key not in declared_segments: errors.append('SEGMENT_UNDECLARED:%s-%s'%key)

    # polygons: every vertex recomputed; the fill states the source class only
    found_polygons={}
    for element in _find(elements,'polygon','data-points'):
        found_polygons[element.get('data-points')]=element
    declared_polygons={','.join(raw['points']):raw for raw in polygons}
    for key,raw in declared_polygons.items():
        element=found_polygons.get(key)
        if element is None:
            errors.append('POLYGON_MISSING:%s'%raw.get('id'));continue
        raw_points=(element.get('points') or '').split()
        if len(raw_points)!=len(raw['points']):
            errors.append('POLYGON_VERTEX_COUNT:%s'%raw.get('id'));continue
        for pid,text in zip(raw['points'],raw_points):
            try:
                gx,gy=[float(value) for value in text.split(',')]
            except ValueError:
                errors.append('POLYGON_VERTEX_INVALID:%s'%raw.get('id'));break
            ex,ey=pixel(*points[pid])
            if math.hypot(gx-ex,gy-ey)>PIXEL_TOLERANCE:
                errors.append('POLYGON_VERTEX_MOVED:%s:%s'%(raw.get('id'),pid))
        expected={'LIGHT':LIGHT_FILL,'MEDIUM':MEDIUM_FILL}.get(raw.get('fill','LIGHT'),'none')
        if (element.get('fill') or '').lower()!=expected:
            errors.append('POLYGON_FILL_MISMATCH:%s'%raw.get('id'))
    for key in found_polygons:
        if key not in declared_polygons: errors.append('POLYGON_UNDECLARED:%s'%key)

    # lines: the drawn segment must lie on the declared exact line, and a tangent claim is re-proved
    symbol=S.Symbol('x')
    found_lines={}
    for element in _find(elements,'line','data-line'):
        found_lines[element.get('data-line')]=_line_coords(element,errors,'LINE_COORDINATE_INVALID')
    for raw in lines:
        lid=raw.get('id')
        if lid not in found_lines:
            errors.append('LINE_MISSING:%s'%lid);continue
        slope=exact_scalar(raw['slope']);intercept=exact_scalar(raw['intercept'])
        x1,y1,x2,y2=found_lines[lid]
        for gx,gy in ((x1,y1),(x2,y2)):
            mx=(gx-ox)/scale;my=(oy-gy)/scale
            if abs(float(slope)*mx+float(intercept)-my)>UNIT_TOLERANCE:
                errors.append('LINE_OFF_EQUATION:%s'%lid);break
        if raw.get('tangent') is True:
            expr=((symbol-shape['cx'])/shape['ax'])**2+((slope*symbol+intercept-shape['cy'])/shape['ay'])**2-1
            poly=S.Poly(S.expand(S.together(expr)),symbol)
            if S.discriminant(poly)!=0:
                errors.append('TANGENT_CLAIM_FALSE:%s'%lid)
                continue
            tx=S.simplify(-poly.coeff_monomial(symbol)/(2*poly.LC()))
            ty=S.simplify(slope*tx+intercept)
            touching=[pid for pid,(px,py) in points.items()
                      if S.simplify(px-tx)==0 and S.simplify(py-ty)==0]
            if not touching:
                errors.append('TANGENCY_POINT_NOT_DECLARED:%s'%lid)
            checks.setdefault('tangency',[]).append({'line':lid,'x':str(tx),'y':str(ty),'point':touching[0] if touching else None})
    for lid in found_lines:
        if not any(raw.get('id')==lid for raw in lines): errors.append('LINE_UNDECLARED:%s'%lid)

    # neutral names: present, inside the canvas, next to their own point, never over another point
    label_elements={}
    for element in elements:
        if element.get('data-label-role')=='point' and element.get('data-point'):
            label_elements[element.get('data-point')]=element
    for pid,wanted in labels.items():
        if not wanted: continue
        element=label_elements.get(pid)
        if element is None:
            errors.append('LABEL_MISSING:%s'%pid);continue
        shown=element.get('data-tex')
        if shown is None: shown=element.get('data-text')
        if shown!=pid: errors.append('LABEL_TEXT_MISMATCH:%s:%s'%(pid,shown))
        box=_box_of(element)
        if box is None:
            errors.append('LABEL_BOX_MISSING:%s'%pid);continue
        if (box['x']<0 or box['y']<0 or box['x']+box['width']>canvas['width'] or
                box['y']+box['height']>canvas['height']):
            errors.append('LABEL_OUT_OF_CANVAS:%s'%pid)
        ex,ey=pixel(*points[pid])
        if _box_distance(ex,ey,box)>LABEL_DISTANCE:
            errors.append('LABEL_TOO_FAR:%s'%pid)
        for other,(oxp,oyp) in points.items():
            if other==pid: continue
            gx,gy=pixel(oxp,oyp)
            if _point_in_box(gx,gy,box,2.0):
                errors.append('LABEL_COVERS_POINT:%s:%s'%(pid,other))
    for pid in label_elements:
        if pid not in points: errors.append('LABEL_UNDECLARED:%s'%pid)

    # measure labels must sit beside the midpoint of their own segment
    segment_labels={element.get('data-segment'):element for element in elements
                    if element.get('data-label-role')=='measure'}
    for raw in segments:
        if not raw.get('label'): continue
        element=segment_labels.get(raw.get('id'))
        if element is None:
            errors.append('MEASURE_LABEL_MISSING:%s'%raw.get('id'));continue
        shown=element.get('data-tex') if element.get('data-tex') is not None else element.get('data-text')
        if shown!=raw['label']: errors.append('MEASURE_LABEL_TEXT_MISMATCH:%s'%raw.get('id'))
        box=_box_of(element)
        if box is None: continue
        (ax,ay),(bx,by)=points[raw['from']],points[raw['to']]
        mx,my=pixel((ax+bx)/2,(ay+by)/2)
        if _box_distance(mx,my,box)>LABEL_DISTANCE:
            errors.append('MEASURE_LABEL_TOO_FAR:%s'%raw.get('id'))

    returns={'status':'PASS' if not errors else 'FAIL','errors':errors,'finalSvgSha256':digest,'checks':checks}
    return returns


def main():
    input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
    try:
        result=audit(payload['ellipsePlan'],payload['svg'])
        status='OK'
    except (ValueError,KeyError,TypeError,IndexError,ZeroDivisionError) as error:
        result,status={'code':str(error)},'ERROR'
    print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,
                      'result':result},ensure_ascii=False,allow_nan=False))


if __name__=='__main__':
    main()
