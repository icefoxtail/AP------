"""Independent observer for the conic (parabola) figures of `ellipse-figure-v1` (plan root field `conic`).

Like `ellipse_figure_observer.py` it never trusts the producer: it re-derives the focus, directrix,
curve points, intersections and feet of perpendiculars from the authored plan with its own code (SymPy
`solve`, not the producer's formulas) and then reads the FINAL SVG:

  * the two coordinate axes fix the pixel origin; the drawn parabola fixes the uniform scale (its vertex
    and its farthest sample), and every drawn sample must satisfy the exact equation (0.6 px);
  * every point marker, segment, polygon, line (directrix included), foot of a perpendicular and
    right-angle mark is checked against the recomputed position, and no undeclared one may exist;
  * a point on the parabola must satisfy the definition |PF| = distance to the directrix (1e-6 model
    units), computed here from the plan alone;
  * every drawn name (point, line, segment length) must be the plan's text, inside the canvas, next to its
    owner (or joined to it by a leader that starts at the name and ends on the owner).
"""
import hashlib
import math
import xml.etree.ElementTree as ET

import sympy as S

from ellipse_figure_observer import (
    Refuse,NS,PIXEL_TOLERANCE,LABEL_DISTANCE,LIGHT_FILL,MEDIUM_FILL,POINT_ID,exact_scalar,
    _find,_attr_float,_line_coords,_box_of,_point_in_box,_box_distance,_point_segment_distance,
    _box_boundary_distance,_line_interior_points)

CURVE_TOLERANCE_PX=0.6
FOOT_ANGLE_DEGREES=0.5
DEFINITION_TOLERANCE=1e-6
SUPPORTED_KINDS=('PARABOLA','HYPERBOLA')
ASYMPTOTE_ANGLE_DEGREES=0.3
X,Y=S.symbols('X Y',real=True)


def _scalar(text,code='CONIC_PARAMETER_INVALID'):
    try:
        return exact_scalar(text)
    except Refuse:
        raise Refuse(code)


def _fl(value):
    return float(S.N(value,25))


def _real(value):
    return abs(float(S.N(S.im(value),25)))<1e-12


def hyperbola_of(raw):
    if set(raw)-{'kind','center','aSquared','bSquared','transverse'}: raise Refuse('CONIC_PARAMETER_INVALID')
    center=raw.get('center')
    if not isinstance(center,list) or len(center)!=2: raise Refuse('CONIC_PARAMETER_INVALID')
    h,k=_scalar(center[0]),_scalar(center[1])
    a2,b2=_scalar(raw.get('aSquared')),_scalar(raw.get('bSquared'))
    axis=raw.get('transverse')
    if axis not in ('X','Y') or _fl(a2)<=0 or _fl(b2)<=0: raise Refuse('CONIC_PARAMETER_INVALID')
    on_x=axis=='X'
    equation=(X-h)**2/a2-(Y-k)**2/b2-1 if on_x else (Y-k)**2/a2-(X-h)**2/b2-1
    c=S.sqrt(a2+b2);a=S.sqrt(a2)
    foci={side:((h+side*c,k) if on_x else (h,k+side*c)) for side in (1,-1)}
    vertices={side:((h+side*a,k) if on_x else (h,k+side*a)) for side in (1,-1)}
    # the asymptotes are the two lines of the degenerate equation (right side 0): solved for Y, their slopes are the +/- values
    roots=S.solve(S.expand(equation+1),Y)
    slopes={}
    for root in roots:
        slope=S.simplify(S.diff(root,X))
        slopes[1 if _fl(slope)>0 else -1]=slope
    if set(slopes)!={1,-1}: raise Refuse('CONIC_PARAMETER_INVALID')
    return {'kind':'HYPERBOLA','h':h,'k':k,'a2':a2,'b2':b2,'a':a,'axis':axis,'equation':equation,
            'foci':foci,'vertices':vertices,'slopes':slopes}


def conic_of(raw):
    if isinstance(raw,dict) and raw.get('kind')=='HYPERBOLA': return hyperbola_of(raw)
    return parabola_of(raw)


def parabola_of(raw):
    if not isinstance(raw,dict) or set(raw)-{'kind','vertex','p','axis'}: raise Refuse('CONIC_PARAMETER_INVALID')
    if not isinstance(raw.get('kind'),str): raise Refuse('CONIC_PARAMETER_INVALID')
    if raw['kind'] not in SUPPORTED_KINDS: raise Refuse('CONIC_KIND_UNSUPPORTED')
    vertex=raw.get('vertex')
    if not isinstance(vertex,list) or len(vertex)!=2: raise Refuse('CONIC_PARAMETER_INVALID')
    h,k=_scalar(vertex[0]),_scalar(vertex[1])
    p=_scalar(raw.get('p'))
    axis=raw.get('axis')
    if p==0 or axis not in ('X','Y'): raise Refuse('CONIC_PARAMETER_INVALID')
    equation=(Y-k)**2-4*p*(X-h) if axis=='X' else (X-h)**2-4*p*(Y-k)
    focus=(h+p,k) if axis=='X' else (h,k+p)
    # directrix as a*X+b*Y=c
    directrix=(S.Integer(1),S.Integer(0),h-p) if axis=='X' else (S.Integer(0),S.Integer(1),k-p)
    return {'kind':'PARABOLA','h':h,'k':k,'p':p,'axis':axis,'equation':equation,'focus':focus,'directrix':directrix}


def on_curve(par,point):
    return S.simplify(par['equation'].subs({X:point[0],Y:point[1]}))==0


def line_distance(line,point):
    a,b,c=line
    return abs(_fl(a*point[0]+b*point[1]-c))/math.hypot(_fl(a),_fl(b))


def hyperbola_definition_errors(par,points):
    """| |PF| - |PF'| | equals 2a for every declared point that lies on the hyperbola."""
    errors=[];first,second=par['foci'][1],par['foci'][-1];twice=2*_fl(par['a'])
    for pid,point in points.items():
        if not on_curve(par,point): continue
        d1=math.hypot(_fl(point[0]-first[0]),_fl(point[1]-first[1]));d2=math.hypot(_fl(point[0]-second[0]),_fl(point[1]-second[1]))
        if abs(abs(d1-d2)-twice)>DEFINITION_TOLERANCE: errors.append('CONIC_DEFINITION_MISMATCH:%s'%pid)
    return errors


def definition_errors(par,points,focus=None,directrix=None):
    """|PF| equals the distance to the directrix for every declared point that lies on the parabola."""
    if par['kind']=='HYPERBOLA': return hyperbola_definition_errors(par,points)
    focus=focus or par['focus'];directrix=directrix or par['directrix']
    errors=[]
    for pid,point in points.items():
        if not on_curve(par,point): continue
        to_focus=math.hypot(_fl(point[0]-focus[0]),_fl(point[1]-focus[1]))
        if abs(to_focus-line_distance(directrix,point))>DEFINITION_TOLERANCE:
            errors.append('CONIC_DEFINITION_MISMATCH:%s'%pid)
    return errors


def _intersections(par,line):
    a,b,c=line
    solutions=S.solve([a*X+b*Y-c,par['equation']],[X,Y],dict=True)
    found=[]
    for row in solutions:
        x,y=row.get(X),row.get(Y)
        if x is None or y is None or not (_real(x) and _real(y)): continue
        found.append((S.simplify(S.re(x)),S.simplify(S.re(y))))
    unique=[]
    for point in sorted(found,key=lambda pt:(round(_fl(pt[0]),12),round(_fl(pt[1]),12))):
        if not unique or any(abs(_fl(point[i]-unique[-1][i]))>1e-12 for i in (0,1)): unique.append(point)
    return unique


def derive(plan):
    if not isinstance(plan,dict): raise Refuse('ELLIPSE_PLAN_INVALID')
    if 'ellipse' in plan or 'ellipses' in plan: raise Refuse('CONIC_PLAN_CONFLICT')
    if plan.get('capability')!='ellipse-figure-v1': raise Refuse('ELLIPSE_PLAN_INVALID')
    par=conic_of(plan.get('conic'))
    raw_points=plan.get('points',[]) or [];raw_lines=plan.get('lines',[]) or []
    ids=[]
    for raw in raw_points:
        if not isinstance(raw,dict): raise Refuse('ELLIPSE_POINT_INVALID')
        pid=raw.get('id')
        if not isinstance(pid,str) or not POINT_ID.fullmatch(pid) or pid in ids: raise Refuse('ELLIPSE_POINT_ID_INVALID')
        ids.append(pid)
    line_ids=[raw.get('id') for raw in raw_lines if isinstance(raw,dict)]
    points={};lines={};feet={};meets={};joins={}
    pending_points=list(raw_points);pending_lines=list(raw_lines)
    h,k,p=par['h'],par['k'],par.get('p')
    for _round in range(len(raw_points)+len(raw_lines)+2):
        if not pending_points and not pending_lines: break
        progress=False
        for raw in list(pending_lines):
            if raw.get('role')=='DIRECTRIX':
                if par['kind']!='PARABOLA': raise Refuse('CONIC_DIRECTRIX_REQUIRES_PARABOLA')
                lines[raw['id']]=par['directrix']
            elif raw.get('role')=='ASYMPTOTE':
                if par['kind']!='HYPERBOLA': raise Refuse('CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA')
                if raw.get('sign') not in (1,-1): raise Refuse('CONIC_PARAMETER_INVALID')
                m=par['slopes'][raw['sign']];lines[raw['id']]=(-m,S.Integer(1),S.simplify(k-m*h))
            elif 'x' in raw: lines[raw['id']]=(S.Integer(1),S.Integer(0),_scalar(raw['x'],'ELLIPSE_VALUE_INVALID'))
            elif 'y' in raw: lines[raw['id']]=(S.Integer(0),S.Integer(1),_scalar(raw['y'],'ELLIPSE_VALUE_INVALID'))
            elif 'slope' in raw:
                lines[raw['id']]=(-_scalar(raw['slope'],'ELLIPSE_VALUE_INVALID'),S.Integer(1),_scalar(raw['intercept'],'ELLIPSE_VALUE_INVALID'))
            elif isinstance(raw.get('through'),list) and len(raw['through'])==2:
                first,second=raw['through']
                if first not in points or second not in points: continue
                (x1,y1),(x2,y2)=points[first],points[second]
                a=S.simplify(y2-y1);b=S.simplify(x1-x2)
                if a==0 and b==0: raise Refuse('ELLIPSE_LINE_INVALID')
                lines[raw['id']]=(a,b,S.simplify(a*x1+b*y1))
            else: raise Refuse('ELLIPSE_LINE_INVALID')
            pending_lines.remove(raw);progress=True
        for raw in list(pending_points):
            kind=raw.get('kind');pid=raw['id']
            if kind=='ORIGIN': value=(S.Integer(0),S.Integer(0))
            elif kind=='FOCUS' or kind=='VERTEX':
                if par['kind']=='HYPERBOLA':
                    if raw.get('side') not in (1,-1): raise Refuse('ELLIPSE_POINT_INVALID')
                    value=(par['foci'] if kind=='FOCUS' else par['vertices'])[raw['side']]
                else: value=par['focus'] if kind=='FOCUS' else (h,k)
            elif kind=='POINT': value=(_scalar(raw.get('x'),'ELLIPSE_VALUE_INVALID'),_scalar(raw.get('y'),'ELLIPSE_VALUE_INVALID'))
            elif kind=='ON_CONIC':
                has_x,has_y='x' in raw,'y' in raw
                if has_x==has_y: raise Refuse('ELLIPSE_POINT_INVALID')
                if has_x:
                    x0=_scalar(raw['x'],'ELLIPSE_VALUE_INVALID')
                    roots=[S.simplify(r) for r in S.solve(par['equation'].subs(X,x0),Y) if _real(r)]
                    value_list=[(x0,r) for r in roots]
                    coordinate=1
                else:
                    y0=_scalar(raw['y'],'ELLIPSE_VALUE_INVALID')
                    roots=[S.simplify(r) for r in S.solve(par['equation'].subs(Y,y0),X) if _real(r)]
                    value_list=[(r,y0) for r in roots]
                    coordinate=0
                if not value_list: raise Refuse('CONIC_POINT_NOT_ON_CURVE')
                if len(value_list)==1: value=value_list[0]
                else:
                    branch=raw.get('branch')
                    if par['kind']=='HYPERBOLA':
                        # the root list is the branch (other coordinate given) or the half of the other axis (transverse given)
                        branch=raw.get('sign') if has_x==(par['axis']=='X') else branch
                    if branch not in (None,'POS','NEG'): raise Refuse('ELLIPSE_POINT_INVALID')
                    choose=min if branch=='NEG' else max   # POS is the larger of the two roots
                    value=choose(value_list,key=lambda pt:_fl(pt[coordinate]))
            elif kind=='LINE_CONIC':
                if raw.get('line') not in lines: continue
                found=_intersections(par,lines[raw['line']])
                which=raw.get('which')
                if not found: raise Refuse('CONIC_LINE_NO_INTERSECTION')
                if which not in (1,2) or which>len(found): raise Refuse('CONIC_INTERSECTION_INDEX_INVALID')
                value=found[which-1]
                meets[pid]={'line':raw['line'],'which':which,'found':found}
            elif kind=='LINE_LINE':
                pair=raw.get('lines')
                if not isinstance(pair,list) or len(pair)!=2 or any(lid not in line_ids for lid in pair): raise Refuse('ELLIPSE_LINE_INVALID')
                if pair[0] not in lines or pair[1] not in lines: continue
                solved=S.solve([lines[pair[0]][0]*X+lines[pair[0]][1]*Y-lines[pair[0]][2],
                                lines[pair[1]][0]*X+lines[pair[1]][1]*Y-lines[pair[1]][2]],[X,Y],dict=True)
                if len(solved)!=1 or X not in solved[0] or Y not in solved[0]: raise Refuse('CONIC_LINES_PARALLEL')
                value=(S.simplify(solved[0][X]),S.simplify(solved[0][Y]))
                joins[pid]=tuple(pair)
            elif kind=='FOOT':
                if raw.get('from') not in points or raw.get('onto') not in lines:
                    if raw.get('onto') not in line_ids: raise Refuse('CONIC_FOOT_INVALID')
                    continue
                a,b,c=lines[raw['onto']];origin=points[raw['from']]
                t=S.Symbol('t',real=True)
                solved=S.solve(a*(origin[0]+t*a)+b*(origin[1]+t*b)-c,t)
                value=(S.simplify(origin[0]+solved[0]*a),S.simplify(origin[1]+solved[0]*b))
                feet[pid]={'from':raw['from'],'onto':raw['onto'],'rightAngle':raw.get('rightAngle') is True}
            else: raise Refuse('ELLIPSE_POINT_INVALID')
            points[pid]=value;pending_points.remove(raw);progress=True
        if not progress: raise Refuse('ELLIPSE_POINT_UNKNOWN')
    if pending_points or pending_lines: raise Refuse('ELLIPSE_POINT_UNKNOWN')
    labels={raw['id']:raw.get('label',True) for raw in raw_points}
    segments=plan.get('segments',[]) or [];polygons=plan.get('polygons',[]) or []
    for raw in segments:
        if raw.get('from') not in points or raw.get('to') not in points or raw.get('from')==raw.get('to'):
            raise Refuse('ELLIPSE_SEGMENT_INVALID')
    for raw in polygons:
        members=raw.get('points')
        if not isinstance(members,list) or not (3<=len(members)<=6) or len(set(members))!=len(members) \
                or any(pid not in points for pid in members): raise Refuse('ELLIPSE_POLYGON_INVALID')
    return par,points,lines,feet,meets,labels,segments,polygons,raw_lines,joins


def _parse_runs(element):
    d=element.get('d') or ''
    runs=[];tokens=d.replace(',',' ').split()
    index=0
    while index<len(tokens):
        token=tokens[index]
        command=token[0]
        if command in 'ML':
            if len(token)>1: head=token[1:];rest=[head,tokens[index+1]];step=2
            else: rest=[tokens[index+1],tokens[index+2]];step=3
            try: point=(float(rest[0]),float(rest[1]))
            except (ValueError,IndexError): return None
            if command=='M': runs.append([])
            elif not runs: return None
            runs[-1].append(point)
            index+=step
        else: return None
    return runs


def _curve_scale(par,samples,ox,oy,hx,ky,pv):
    """Pixels per model unit, from the drawn parabola alone.

    A rough value comes from the extreme sample (the vertex, up to the 0.01 px rounding of the path) and the
    farthest sample; the exact one is the root of the equation that the farthest sample must satisfy for the
    unknown scale s, taken nearest to the rough value."""
    opens=1 if pv>0 else -1
    if par['axis']=='X': vertex=min(samples,key=lambda pt:opens*pt[0])
    else: vertex=max(samples,key=lambda pt:opens*pt[1])
    far=max(samples,key=lambda pt:math.hypot(pt[0]-vertex[0],pt[1]-vertex[1]))
    dpx,dpy=far[0]-vertex[0],far[1]-vertex[1]
    if par['axis']=='X': rough=(dpy*dpy)/(4*abs(pv)*abs(dpx)) if abs(dpx)>=1.0 else None
    else: rough=(dpx*dpx)/(4*abs(pv)*abs(dpy)) if abs(dpy)>=1.0 else None
    if not rough: return None
    u,v=oy-far[1],far[0]-ox
    if par['axis']=='X': a,b,c=ky*ky+4*pv*hx,-(2*u*ky+4*pv*v),u*u     # (u-k s)^2 = 4p s (v-h s)
    else: a,b,c=hx*hx+4*pv*ky,-(2*v*hx+4*pv*u),v*v                   # (v-h s)^2 = 4p s (u-k s)
    if abs(a)<1e-12: roots=[-c/b] if abs(b)>1e-12 else []
    else:
        disc=b*b-4*a*c
        roots=[] if disc<0 else [(-b-math.sqrt(disc))/(2*a),(-b+math.sqrt(disc))/(2*a)]
    roots=[root for root in roots if root>0]
    return min(roots,key=lambda root:abs(root-rough)) if roots else None


def _hyperbola_scale(par,samples,ox,oy):
    """Pixels per model unit read from the drawn branches alone (no declared point to measure by).

    A drawn sample (px,py) is ((px-ox)/s, (oy-py)/s); the equation of the hyperbola then is a quadratic in 1/s.
    The root that makes every sample satisfy it best is taken."""
    h,k,a2,b2=_fl(par['h']),_fl(par['k']),_fl(par['a2']),_fl(par['b2'])
    on_x=par['axis']=='X'
    best=None
    for sample in samples[::max(1,len(samples)//6)]:
        dx,dy=sample[0]-ox,oy-sample[1]
        # with r=1/s: (r*dx-h)^2/a2-(r*dy-k)^2/b2=1  (X transverse); roles swapped otherwise
        tu,tv,cu,cv=(dx,dy,h,k) if on_x else (dy,dx,k,h)
        A=tu*tu/a2-tv*tv/b2;B=-2*cu*tu/a2+2*cv*tv/b2;C=cu*cu/a2-cv*cv/b2-1
        roots=[]
        if abs(A)<1e-12: roots=[-C/B] if abs(B)>1e-12 else []
        else:
            disc=B*B-4*A*C
            if disc>=0: roots=[(-B-math.sqrt(disc))/(2*A),(-B+math.sqrt(disc))/(2*A)]
        for r in roots:
            if r<=0: continue
            scale=1.0/r;worst=0.0
            for pt in samples[::max(1,len(samples)//40)]:
                mx,my=(pt[0]-ox)/scale,(oy-pt[1])/scale
                value=((mx-h)**2/a2-(my-k)**2/b2-1) if on_x else ((my-k)**2/a2-(mx-h)**2/b2-1)
                worst=max(worst,abs(value))
            if best is None or worst<best[0]: best=(worst,scale)
    return best[1] if best else None


def audit(plan,svg):
    errors=[];checks={'capability':'ellipse-figure-v1','conic':True}
    digest='sha256:'+hashlib.sha256(svg.encode('utf-8')).hexdigest()
    result=lambda:{'status':'PASS' if not errors else 'FAIL','errors':errors,'finalSvgSha256':digest,'checks':checks}
    try:
        par,points,lines,feet,meets,labels,segments,polygons,raw_lines,joins=derive(plan)
    except Refuse as error:
        return {'status':'FAIL','errors':['PLAN_REFUSED:%s'%error],'finalSvgSha256':digest,'checks':checks}
    errors.extend(definition_errors(par,points))
    try: root=ET.fromstring(svg)
    except ET.ParseError:
        return {'status':'FAIL','errors':['SVG_NOT_WELL_FORMED'],'finalSvgSha256':digest,'checks':checks}
    if root.tag!=NS+'svg': errors.append('SVG_ROOT_NOT_SVG')
    elements=[element for element in root.iter()]
    try: canvas={'width':float(root.get('width')),'height':float(root.get('height'))}
    except (TypeError,ValueError): errors.append('SVG_INTRINSIC_MISSING');canvas={'width':0.0,'height':0.0}
    if root.get('transform'): errors.append('SVG_TRANSFORM_UNSUPPORTED')

    axes={}
    for element in _find(elements,'axis','data-axis'):
        name=element.get('data-axis')
        if name in axes: errors.append('AXIS_DUPLICATE:%s'%name)
        axes[name]=_line_coords(element,errors,'AXIS_COORDINATE_INVALID')
    for name in ('x','y'):
        if name not in axes: errors.append('AXIS_MISSING:%s'%name)
    if errors: return result()
    ox=axes['y'][0];oy=axes['x'][1]
    heads={}
    for element in _find(elements,'axis-head','data-axis'): heads.setdefault(element.get('data-axis'),[]).append(element)
    for name in ('x','y'):
        found=heads.get(name,[])
        if len(found)!=1: errors.append('AXIS_HEAD_MISSING_OR_AMBIGUOUS:%s'%name);continue
        try: head_points=[[float(v) for v in part.split(',')] for part in (found[0].get('points') or '').split()]
        except ValueError: errors.append('AXIS_HEAD_GEOMETRY_INVALID:%s'%name);continue
        if len(head_points)!=3 or any(len(pt)!=2 for pt in head_points): errors.append('AXIS_HEAD_GEOMETRY_INVALID:%s'%name);continue
        tip=head_points[0];x1,y1,x2,y2=axes[name]
        if name=='x':
            if tip[0]<max(x1,x2)-PIXEL_TOLERANCE or abs(tip[1]-oy)>PIXEL_TOLERANCE: errors.append('AXIS_HEAD_DIRECTION_INVALID:x')
        elif tip[1]>min(y1,y2)+PIXEL_TOLERANCE or abs(tip[0]-ox)>PIXEL_TOLERANCE: errors.append('AXIS_HEAD_DIRECTION_INVALID:y')
    if errors: return result()

    # --- the curve: scale from its vertex and farthest sample, then every sample (and chord midpoint) on the equation ------------------------
    curves=_find(elements,'curve')
    hyperbola=par['kind']=='HYPERBOLA'
    if hyperbola:
        found_branches=sorted(element.get('data-branch') or '' for element in curves if element.tag==NS+'path')
        if found_branches!=['NEG','POS']:
            errors.append('CONIC_HYPERBOLA_BRANCH_MISSING:%s'%','.join(found_branches) if found_branches else 'CONIC_HYPERBOLA_BRANCH_MISSING')
            return result()
    if len(curves)!=(2 if hyperbola else 1) or any(element.tag!=NS+'path' for element in curves):
        errors.append('CONIC_CURVE_COUNT_INVALID:%d'%len(curves));return result()
    branch_runs={}
    runs=[]
    for curve in curves:
        if curve.get('data-curve')!=par['kind']: errors.append('CONIC_CURVE_KIND_MISMATCH')
        if curve.get('transform'): errors.append('CONIC_CURVE_TRANSFORM_UNSUPPORTED')
        one=_parse_runs(curve)
        if not one or any(len(run)<2 for run in one):
            errors.append('CONIC_CURVE_GEOMETRY_INVALID');return result()
        branch_runs[curve.get('data-branch') or '']=one;runs.extend(one)
    samples=[pt for run in runs for pt in run]
    markers={}
    for element in _find(elements,'point','data-point'):
        pid=element.get('data-point')
        if pid in markers: errors.append('POINT_DUPLICATE:%s'%pid)
        markers[pid]=(_attr_float(element,'cx',errors,'POINT_COORDINATE_INVALID'),_attr_float(element,'cy',errors,'POINT_COORDINATE_INVALID'))
    hx,ky=_fl(par['h']),_fl(par['k']);pv=_fl(par['p']) if not hyperbola else 0.0
    # A parabola alone fixes only (p x scale), so the scale is read from the declared point markers (median of
    # their distances from the drawn origin over the exact ones); the curve is then checked against it.
    candidates=[]
    for pid,value in points.items():
        reach=math.hypot(_fl(value[0]),_fl(value[1]))
        if pid in markers and reach>=0.5: candidates.append(math.hypot(markers[pid][0]-ox,markers[pid][1]-oy)/reach)
    candidates.sort()
    if hyperbola: scale=candidates[len(candidates)//2] if candidates else _hyperbola_scale(par,samples,ox,oy)
    else: scale=candidates[len(candidates)//2] if candidates else _curve_scale(par,samples,ox,oy,hx,ky,pv)
    if not scale:
        errors.append('CONIC_CURVE_OFF_EQUATION:scale');return result()
    checks['scale']=scale
    # the drawn curve passes through its vertex
    if hyperbola:
        for side,vertex in par['vertices'].items():
            vx,vy=ox+_fl(vertex[0])*scale,oy-_fl(vertex[1])*scale
            if min(math.hypot(pt[0]-vx,pt[1]-vy) for pt in samples)>PIXEL_TOLERANCE:
                errors.append('CONIC_CURVE_OFF_EQUATION:vertex%d'%side)
    elif min(math.hypot(pt[0]-(ox+hx*scale),pt[1]-(oy-ky*scale)) for pt in samples)>PIXEL_TOLERANCE:
        errors.append('CONIC_CURVE_OFF_EQUATION:vertex')

    def pixel(x,y): return ox+_fl(x)*scale,oy-_fl(y)*scale
    def model_of(px,py): return (px-ox)/scale,(oy-py)/scale
    def curve_distance(px,py):
        mx,my=model_of(px,py)
        if hyperbola:
            a2,b2=_fl(par['a2']),_fl(par['b2'])
            if par['axis']=='X': value=(mx-hx)**2/a2-(my-ky)**2/b2-1;grad=math.hypot(2*(mx-hx)/a2,2*(my-ky)/b2)
            else: value=(my-ky)**2/a2-(mx-hx)**2/b2-1;grad=math.hypot(2*(my-ky)/a2,2*(mx-hx)/b2)
        elif par['axis']=='X': value=(my-ky)**2-4*pv*(mx-hx);grad=math.hypot(2*(my-ky),4*pv)
        else: value=(mx-hx)**2-4*pv*(my-ky);grad=math.hypot(2*(mx-hx),4*pv)
        return abs(value)/grad*scale
    worst=0.0
    for run in runs:
        for index,pt in enumerate(run):
            worst=max(worst,curve_distance(*pt))
            if index: worst=max(worst,curve_distance((pt[0]+run[index-1][0])/2,(pt[1]+run[index-1][1])/2))
    checks['curveWorstPx']=worst
    if hyperbola:   # each branch lies on its own side of the centre (POS = larger transverse coordinate)
        center_px=ox+hx*scale if par['axis']=='X' else oy-ky*scale
        for name,rows in branch_runs.items():
            for run in rows:
                for pt in run:
                    delta=(pt[0]-center_px) if par['axis']=='X' else (center_px-pt[1])
                    if (delta>0)!=(name=='POS'): errors.append('CONIC_HYPERBOLA_BRANCH_MISSING:side-%s'%name);break
    if worst>CURVE_TOLERANCE_PX: errors.append('CONIC_CURVE_OFF_EQUATION:%.3fpx'%worst)
    for element in elements:
        if element.tag==NS+'path' and element not in curves and element.get('data-role'): errors.append('PATH_UNDECLARED')
        if element.tag==NS+'ellipse': errors.append('ELLIPSE_UNDECLARED')

    # --- point markers -----------------------------------------------------------------------------------------------------------------------
    for pid,value in points.items():
        if pid not in markers: errors.append('POINT_MISSING:%s'%pid);continue
        ex,ey=pixel(*value)
        if math.hypot(markers[pid][0]-ex,markers[pid][1]-ey)>PIXEL_TOLERANCE:
            errors.append('POINT_MOVED:%s (%.2f,%.2f) vs (%.2f,%.2f)'%(pid,markers[pid][0],markers[pid][1],ex,ey))
        if on_curve(par,value) and curve_distance(*markers[pid])>PIXEL_TOLERANCE:
            errors.append('CONIC_POINT_OFF_CURVE:%s'%pid)
    for pid in markers:
        if pid not in points: errors.append('POINT_UNDECLARED:%s'%pid)
    # a LINE_CONIC point is the which-th intersection (ordered by x, then y) of its line and the parabola
    for pid,info in meets.items():
        if pid not in markers: continue
        mx,my=model_of(*markers[pid])
        if line_distance(lines[info['line']],(S.Float(mx,20),S.Float(my,20)))*scale>PIXEL_TOLERANCE:
            errors.append('CONIC_INTERSECTION_MISMATCH:%s:not-on-line'%pid)
        expected=pixel(*info['found'][info['which']-1])
        if math.hypot(markers[pid][0]-expected[0],markers[pid][1]-expected[1])>PIXEL_TOLERANCE:
            for index,other in enumerate(info['found']):
                if index!=info['which']-1 and math.hypot(markers[pid][0]-pixel(*other)[0],markers[pid][1]-pixel(*other)[1])<=PIXEL_TOLERANCE:
                    errors.append('CONIC_INTERSECTION_MISMATCH:%s:order'%pid)

    # a LINE_LINE point lies on both of its lines
    for pid,pair in joins.items():
        if pid not in markers: continue
        mx,my=model_of(*markers[pid])
        if any(line_distance(lines[lid],(S.Float(mx,20),S.Float(my,20)))*scale>PIXEL_TOLERANCE for lid in pair):
            errors.append('CONIC_LINE_LINE_MISMATCH:%s'%pid)

    # --- segments and polygons -------------------------------------------------------------------------------------------------------------
    found_segments={}
    for element in _find(elements,'segment','data-from'):
        key=(element.get('data-from'),element.get('data-to'))
        if key in found_segments: errors.append('SEGMENT_DUPLICATE:%s-%s'%key)
        found_segments[key]=_line_coords(element,errors,'SEGMENT_COORDINATE_INVALID')
    for raw in segments:
        key=(raw['from'],raw['to'])
        if key not in found_segments: errors.append('SEGMENT_MISSING:%s'%raw.get('id'));continue
        sx1,sy1,sx2,sy2=found_segments[key]
        for pid,got in ((raw['from'],(sx1,sy1)),(raw['to'],(sx2,sy2))):
            ex,ey=pixel(*points[pid])
            if math.hypot(got[0]-ex,got[1]-ey)>PIXEL_TOLERANCE: errors.append('SEGMENT_ENDPOINT_MOVED:%s:%s'%(raw.get('id'),pid))
    declared_segments={(raw['from'],raw['to']) for raw in segments}|{(raw['to'],raw['from']) for raw in segments}
    for key in found_segments:
        if key not in declared_segments: errors.append('SEGMENT_UNDECLARED:%s-%s'%key)
    found_polygons={element.get('data-points'):element for element in _find(elements,'polygon','data-points')}
    declared_polygons={','.join(raw['points']):raw for raw in polygons}
    for key,raw in declared_polygons.items():
        element=found_polygons.get(key)
        if element is None: errors.append('POLYGON_MISSING:%s'%raw.get('id'));continue
        parts=(element.get('points') or '').split()
        if len(parts)!=len(raw['points']): errors.append('POLYGON_VERTEX_COUNT:%s'%raw.get('id'));continue
        for pid,text in zip(raw['points'],parts):
            try: gx,gy=[float(v) for v in text.split(',')]
            except ValueError: errors.append('POLYGON_VERTEX_INVALID:%s'%raw.get('id'));break
            ex,ey=pixel(*points[pid])
            if math.hypot(gx-ex,gy-ey)>PIXEL_TOLERANCE: errors.append('POLYGON_VERTEX_MOVED:%s:%s'%(raw.get('id'),pid))
        expected={'LIGHT':LIGHT_FILL,'MEDIUM':MEDIUM_FILL}.get(raw.get('fill','LIGHT'),'none')
        if (element.get('fill') or '').lower()!=expected: errors.append('POLYGON_FILL_MISMATCH:%s'%raw.get('id'))
    for key in found_polygons:
        if key not in declared_polygons: errors.append('POLYGON_UNDECLARED:%s'%key)

    # --- lines: each drawn line lies on its exact equation; the directrix is x=h-p (or y=k-p); hidden lines are not drawn --------------------------
    found_lines={}
    for element in _find(elements,'line','data-line'):
        found_lines[element.get('data-line')]=(element,_line_coords(element,errors,'LINE_COORDINATE_INVALID'))
    drawn_lines={}
    for raw in raw_lines:
        lid=raw['id'];exact=lines[lid]
        if raw.get('hidden') is True:
            if lid in found_lines: errors.append('LINE_HIDDEN_DRAWN:%s'%lid)
            continue
        if lid not in found_lines: errors.append('LINE_MISSING:%s'%lid);continue
        element,(x1,y1,x2,y2)=found_lines[lid];drawn_lines[lid]=((x1,y1),(x2,y2))
        code={'DIRECTRIX':'CONIC_DIRECTRIX_MISMATCH','ASYMPTOTE':'CONIC_ASYMPTOTE_MISMATCH'}.get(raw.get('role'),'LINE_OFF_EQUATION')
        if raw.get('role')=='ASYMPTOTE' and math.hypot(x2-x1,y2-y1)>=1.0:
            # slope within 0.3 degrees of the exact asymptote, and the drawn line passes through the centre
            m=_fl(par['slopes'][raw['sign']]);want=math.atan2(m,1.0);got=math.atan2(-(y2-y1),(x2-x1))
            turn=abs((got-want+math.pi/2)%math.pi-math.pi/2)
            cx,cy=ox+hx*scale,oy-ky*scale
            through=abs((x2-x1)*(cy-y1)-(y2-y1)*(cx-x1))/math.hypot(x2-x1,y2-y1)
            if math.degrees(turn)>ASYMPTOTE_ANGLE_DEGREES or through>PIXEL_TOLERANCE: errors.append('CONIC_ASYMPTOTE_MISMATCH:%s'%lid)
        for gx,gy in ((x1,y1),(x2,y2)):
            mx,my=model_of(gx,gy)
            if line_distance(exact,(S.Float(mx,20),S.Float(my,20)))*scale>PIXEL_TOLERANCE: errors.append('%s:%s'%(code,lid));break
        if math.hypot(x2-x1,y2-y1)<20: errors.append('LINE_TOO_SHORT:%s'%lid)
        if (element.get('stroke-dasharray') is not None)!=(raw.get('dashed') is True): errors.append('LINE_DASH_MISMATCH:%s'%lid)
    for lid in found_lines:
        if lid not in lines: errors.append('LINE_UNDECLARED:%s'%lid)

    # --- feet of perpendiculars: on the line, AM perpendicular to it, and the right-angle mark where it was asked --------------------------------
    marks={element.get('data-foot'):element for element in elements
           if element.tag==NS+'polyline' and element.get('data-role')=='right-angle'}
    for element in elements:
        if element.tag==NS+'polyline' and element.get('data-role')!='right-angle': errors.append('POLYLINE_UNDECLARED')
    for pid,info in feet.items():
        if pid not in markers or info['from'] not in markers: continue
        a,b,c=lines[info['onto']]
        mpx,mpy=markers[pid];apx,apy=markers[info['from']]
        mx,my=model_of(mpx,mpy)
        if line_distance(lines[info['onto']],(S.Float(mx,20),S.Float(my,20)))*scale>PIXEL_TOLERANCE:
            errors.append('CONIC_FOOT_MISMATCH:%s:not-on-line'%pid)
        reach=math.hypot(apx-mpx,apy-mpy)
        normal=(_fl(a),-_fl(b))   # the line's normal in pixel orientation
        if reach>=6.0:
            cross=abs((apx-mpx)*normal[1]-(apy-mpy)*normal[0])/(reach*math.hypot(*normal))
            if math.degrees(math.asin(min(1.0,cross)))>FOOT_ANGLE_DEGREES: errors.append('CONIC_FOOT_MISMATCH:%s:not-perpendicular'%pid)
        mark=marks.get(pid)
        if not info['rightAngle']:
            if mark is not None: errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-undeclared'%pid)
            continue
        if mark is None: errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-missing'%pid);continue
        try: corner=[[float(v) for v in part.split(',')] for part in (mark.get('points') or '').split()]
        except ValueError: corner=[]
        if len(corner)!=3 or any(len(pt)!=2 for pt in corner): errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-geometry'%pid);continue
        arm=math.hypot(corner[0][0]-mpx,corner[0][1]-mpy)
        toward=((apx-mpx)/reach,(apy-mpy)/reach) if reach else (0.0,0.0)
        if not (3.0<=arm<=12.0) or math.hypot(corner[0][0]-(mpx+toward[0]*arm),corner[0][1]-(mpy+toward[1]*arm))>0.6:
            errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-arm'%pid);continue
        along=(corner[2][0]-mpx,corner[2][1]-mpy)
        if abs(math.hypot(*along)-arm)>0.6 or abs(along[0]*toward[0]+along[1]*toward[1])>0.6 \
                or math.hypot(corner[1][0]-(corner[0][0]+along[0]),corner[1][1]-(corner[0][1]+along[1]))>0.6:
            errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-shape'%pid);continue
        # the second arm runs along the line (parallel to its direction)
        direction=(_fl(b),_fl(a))
        if abs(along[0]*direction[1]-along[1]*direction[0])/(arm*math.hypot(*direction))>0.02:
            errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-not-on-line'%pid)
    for pid in marks:
        if pid not in feet: errors.append('CONIC_FOOT_MISMATCH:%s:rightangle-undeclared'%pid)

    # --- names ------------------------------------------------------------------------------------------------------------------------------
    label_elements={}
    for element in elements:
        if element.get('data-label-role')=='point' and element.get('data-point'): label_elements[element.get('data-point')]=element
    for pid,wanted in labels.items():
        if not wanted: continue
        element=label_elements.get(pid)
        if element is None: errors.append('LABEL_MISSING:%s'%pid);continue
        shown=element.get('data-tex') if element.get('data-tex') is not None else element.get('data-text')
        if shown!=pid: errors.append('LABEL_TEXT_MISMATCH:%s:%s'%(pid,shown))
        box=_box_of(element)
        if box is None: errors.append('LABEL_BOX_MISSING:%s'%pid);continue
        if box['x']<0 or box['y']<0 or box['x']+box['width']>canvas['width'] or box['y']+box['height']>canvas['height']:
            errors.append('LABEL_OUT_OF_CANVAS:%s'%pid)
        ex,ey=pixel(*points[pid])
        if _box_distance(ex,ey,box)>LABEL_DISTANCE: errors.append('LABEL_TOO_FAR:%s'%pid)
        for other,value in points.items():
            if other==pid: continue
            gx,gy=pixel(*value)
            if _point_in_box(gx,gy,box,2.0): errors.append('LABEL_COVERS_POINT:%s:%s'%(pid,other))
    for pid in label_elements:
        if pid not in points: errors.append('LABEL_UNDECLARED:%s'%pid)

    segment_labels={element.get('data-segment'):element for element in elements if element.get('data-label-role')=='measure'}
    line_labels={element.get('data-line'):element for element in elements if element.get('data-label-role')=='line'}
    label_counts={}
    for raw in segments:
        if raw.get('label'): label_counts[raw['label']]=label_counts.get(raw['label'],0)+1
    required_leaders={raw.get('id') for raw in segments if raw.get('label') and label_counts.get(raw['label'],0)>1}
    leaders_by_label={}
    for element in elements:
        if element.tag==NS+'line' and element.get('data-role')=='leader':
            key=element.get('data-owner-label')
            if not key or key in leaders_by_label: errors.append('MEASURE_LEADER_DUPLICATE_OR_UNOWNED')
            else: leaders_by_label[key]=element
    named_lines={raw['id'] for raw in raw_lines if raw.get('label') and raw.get('hidden') is not True}
    allowed_leader_keys={'measure-'+sid for sid in required_leaders}|{'line-'+lid for lid in named_lines}
    for key in leaders_by_label:
        if key not in allowed_leader_keys: errors.append('MEASURE_LEADER_UNDECLARED:%s'%key)

    strokes=[]
    for element in elements:
        if element.tag==NS+'line' and element.get('data-role') in ('axis','segment','line'):
            c=_line_coords(element,errors,'LEADER_STROKE_COORDINATE_INVALID')
            strokes.append((element.get('data-role'),element.get('id'),((c[0],c[1]),(c[2],c[3]))))
    for element in marks.values():
        try: corner=[tuple(float(v) for v in part.split(',')) for part in (element.get('points') or '').split()]
        except ValueError: continue
        for index in range(1,len(corner)): strokes.append(('right-angle',element.get('id'),(corner[index-1],corner[index])))
    curve_samples=[]
    for run in runs:
        for index,pt in enumerate(run):
            curve_samples.append(pt)
            if index:
                prev=run[index-1];steps=max(1,int(math.hypot(pt[0]-prev[0],pt[1]-prev[1])/1.5))
                for step in range(1,steps): curve_samples.append((prev[0]+(pt[0]-prev[0])*step/steps,prev[1]+(pt[1]-prev[1])*step/steps))

    def leader_clear(leader_key,leader):
        x1,y1,x2,y2=_line_coords(leader,errors,'MEASURE_LEADER_COORDINATE_INVALID')
        a,b=(x1,y1),(x2,y2);samples=_line_interior_points(a,b)
        for role,lid,stroke in strokes:
            for sample in samples:
                if _point_segment_distance(sample,*stroke)<2.4:
                    errors.append('MEASURE_LEADER_CROSSES_STROKE:%s:%s'%(leader_key,lid or role));break
        for pid,value in points.items():
            if _point_segment_distance(pixel(*value),a,b)<3.0: errors.append('MEASURE_LEADER_CROSSES_POINT:%s:%s'%(leader_key,pid))
        if any(_point_segment_distance(sample,a,b)<2.2 for sample in curve_samples):
            errors.append('MEASURE_LEADER_CROSSES_CURVE:%s'%leader_key)
        for element in elements:
            if element.get('data-box') is None: continue
            box=_box_of(element)
            if not box: continue
            if element.get('id')==leader_key:
                if any(_point_in_box(px,py,box,-0.5) for px,py in samples): errors.append('MEASURE_LEADER_CROSSES_OWN_LABEL:%s'%leader_key)
            elif any(_point_in_box(px,py,box,1.2) for px,py in samples):
                errors.append('MEASURE_LEADER_CROSSES_LABEL:%s:%s'%(leader_key,element.get('id')))
        for other_key,other in leaders_by_label.items():
            if other_key==leader_key: continue
            ox1,oy1,ox2,oy2=_line_coords(other,errors,'MEASURE_LEADER_COORDINATE_INVALID')
            if any(_point_segment_distance(sample,(ox1,oy1),(ox2,oy2))<2.5 for sample in samples):
                errors.append('MEASURE_LEADER_CROSSES_LEADER:%s:%s'%(leader_key,other_key))

    def leader_geometry(leader,box,anchor,owner_start,owner_end,key,label_id,owner_attr,owner_value):
        """The leader belongs to its label, starts on the label box and ends at the owner's anchor, not running along the owner."""
        if leader.get('id')!='leader-'+key or leader.get(owner_attr)!=owner_value or leader.get('data-label')!=key:
            errors.append('MEASURE_LEADER_OWNER_MISMATCH:%s'%label_id)
        x1,y1,x2,y2=_line_coords(leader,errors,'MEASURE_LEADER_COORDINATE_INVALID')
        if anchor(x2,y2): errors.append('MEASURE_LEADER_NOT_AT_OWNER:%s'%label_id)
        if _box_boundary_distance((x1,y1),box)>2.5: errors.append('MEASURE_LEADER_NOT_AT_LABEL_BOX:%s'%label_id)
        length=math.hypot(x2-x1,y2-y1)
        if length<8 or length>64: errors.append('MEASURE_LEADER_LENGTH_INVALID:%s'%label_id)
        cross=abs((x2-x1)*(owner_end[1]-owner_start[1])-(y2-y1)*(owner_end[0]-owner_start[0]))
        if cross<0.2*max(1.0,length*math.hypot(owner_end[0]-owner_start[0],owner_end[1]-owner_start[1])):
            errors.append('MEASURE_LEADER_OVERLAPS_OWNER:%s'%label_id)
        leader_clear(key,leader)

    for raw in segments:
        if not raw.get('label'): continue
        sid=raw.get('id');element=segment_labels.get(sid)
        if element is None: errors.append('MEASURE_LABEL_MISSING:%s'%sid);continue
        shown=element.get('data-tex') if element.get('data-tex') is not None else element.get('data-text')
        if shown!=raw['label']: errors.append('MEASURE_LABEL_TEXT_MISMATCH:%s'%sid)
        box=_box_of(element)
        if box is None: continue
        (ax,ay),(bx,by)=points[raw['from']],points[raw['to']]
        mx,my=pixel((ax+bx)/2,(ay+by)/2)
        if _box_distance(mx,my,box)>LABEL_DISTANCE: errors.append('MEASURE_LABEL_TOO_FAR:%s'%sid)
        leader_key='measure-'+str(sid)
        if sid in required_leaders:
            leader=leaders_by_label.get(leader_key)
            if leader is None: errors.append('MEASURE_LEADER_MISSING:%s'%sid);continue
            owner_start=pixel(*points[raw['from']]);owner_end=pixel(*points[raw['to']])
            leader_geometry(leader,box,lambda x2,y2:math.hypot(x2-mx,y2-my)>1.5,owner_start,owner_end,leader_key,sid,'data-owner-segment',sid)
        elif leader_key in leaders_by_label: errors.append('MEASURE_LEADER_UNEXPECTED:%s'%sid)

    for raw in raw_lines:
        if not raw.get('label') or raw.get('hidden') is True: continue
        lid=raw['id'];element=line_labels.get(lid)
        if element is None: errors.append('CONIC_LINE_LABEL_MISMATCH:%s:missing'%lid);continue
        shown=element.get('data-tex') if element.get('data-tex') is not None else element.get('data-text')
        if shown!=raw['label']: errors.append('CONIC_LINE_LABEL_MISMATCH:%s:text'%lid)
        box=_box_of(element)
        if box is None or lid not in drawn_lines: errors.append('CONIC_LINE_LABEL_MISMATCH:%s:box'%lid);continue
        if box['x']<0 or box['y']<0 or box['x']+box['width']>canvas['width'] or box['y']+box['height']>canvas['height']:
            errors.append('LABEL_OUT_OF_CANVAS:line-%s'%lid)
        start,end=drawn_lines[lid]
        centre=(box['x']+box['width']/2,box['y']+box['height']/2)
        own=_point_segment_distance(centre,start,end)
        others=[_point_segment_distance(centre,*seg) for other,seg in drawn_lines.items() if other!=lid]
        key='line-'+lid;leader=leaders_by_label.get(key)
        if leader is None:
            if own>box['width']/2+box['height']/2+16: errors.append('CONIC_LINE_LABEL_MISMATCH:%s:not-adjacent'%lid)
            if others and min(others)<own: errors.append('CONIC_LINE_LABEL_MISMATCH:%s:nearer-to-another-line'%lid)
        else:
            leader_geometry(leader,box,lambda x2,y2,s=start,e=end:_point_segment_distance((x2,y2),s,e)>1.5,start,end,key,'line-'+lid,'data-owner-line',lid)

    for key,leader in leaders_by_label.items():
        if key.startswith('line-') and key[5:] not in named_lines: errors.append('MEASURE_LEADER_UNDECLARED:%s'%key)
    return result()
