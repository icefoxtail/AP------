"""Conic (parabola) solution figures inside `ellipse-figure-v1` (plan root field `conic`).

The capability name stays `ellipse-figure-v1`; a plan that carries a root `conic` field is derived here
instead of in `ellipse_figure.py`, so every existing `ellipse` / `ellipses` plan keeps its own code path.
The author states the standard-form parabola and the fact-level points and lines the stored solution
uses; every focus, directrix, intersection and foot of a perpendicular is derived exactly with SymPy.
The independent observer `conic_figure_observer.py` re-derives them with its own code and reads the
FINAL SVG.

  {capability: "ellipse-figure-v1",
   conic: {kind: "PARABOLA", vertex: [h, k], p: "p", axis: "X"|"Y"},   # (y-k)^2=4p(x-h) | (x-h)^2=4p(y-k)
   points: [{id, kind: FOCUS|VERTEX|ORIGIN|POINT|ON_CONIC|LINE_CONIC|FOOT, label?: bool,
             x?, y?, branch?: POS|NEG,                 # POINT / ON_CONIC
             line?, which?: 1|2,                       # LINE_CONIC: the line and the 1st/2nd intersection
             from?, onto?, rightAngle?: bool}],        # FOOT: foot of the perpendicular from `from` onto line `onto`
   segments: [{id, from, to, label?, dashed?}],
   polygons: [{id, points, fill?}],
   lines: [{id, role?: "DIRECTRIX", x? | y? | slope+intercept | through: [P, Q], label?, dashed?, hidden?}],
   caption, sourceConditions, newVisualInformation}

Adding a curve kind later (hyperbola, ...) means one more branch in `_curve`, `_residual`, `_intersections`
and the window extras in `produce`; the point and line machinery here is curve-independent.
"""
import re
import sympy as S

from ellipse_figure import exact_scalar,_value,_text,MODEL_VERSION,CAPABILITY,POINT_ID

LINE_ID=re.compile(r"^[A-Za-z][A-Za-z0-9_]{0,7}$")
TOP_KEYS={'capability','conic','points','segments','polygons','lines','caption',
          'sourceConditions','newVisualInformation','sourceQuote'}
CONIC_KEYS={'kind','vertex','p','axis'}
SEGMENT_KEYS={'id','from','to','label','dashed'}
POLYGON_KEYS={'id','points','fill'}
LINE_KEYS={'id','role','label','dashed','hidden','x','y','slope','intercept','through'}
POINT_KIND_KEYS={
    'ORIGIN':{'id','kind','label'},
    'FOCUS':{'id','kind','label'},
    'VERTEX':{'id','kind','label'},
    'POINT':{'id','kind','x','y','label'},
    'ON_CONIC':{'id','kind','x','y','branch','label'},
    'LINE_CONIC':{'id','kind','line','which','label'},
    'FOOT':{'id','kind','from','onto','rightAngle','label'},
}
SUPPORTED_KINDS=('PARABOLA',)
LABEL_LIMIT=40


def _fail(code):
    raise ValueError(code)


def _scalar(text,code='CONIC_PARAMETER_INVALID'):
    try:
        return exact_scalar(text)
    except ValueError:
        _fail(code)


def _parabola(raw):
    if not isinstance(raw,dict) or set(raw)-CONIC_KEYS: _fail('CONIC_PARAMETER_INVALID')
    kind=raw.get('kind')
    if not isinstance(kind,str): _fail('CONIC_PARAMETER_INVALID')
    if kind not in SUPPORTED_KINDS: _fail('CONIC_KIND_UNSUPPORTED')
    vertex=raw.get('vertex')
    if not isinstance(vertex,list) or len(vertex)!=2: _fail('CONIC_PARAMETER_INVALID')
    h,k=_scalar(vertex[0]),_scalar(vertex[1])
    p=_scalar(raw.get('p'))
    if p==0: _fail('CONIC_PARAMETER_INVALID')
    axis=raw.get('axis')
    if axis not in ('X','Y'): _fail('CONIC_PARAMETER_INVALID')
    if axis=='X':
        focus=(h+p,k);directrix={'orientation':'VERTICAL','value':h-p,'line':(S.Integer(1),S.Integer(0),h-p)}
    else:
        focus=(h,k+p);directrix={'orientation':'HORIZONTAL','value':k-p,'line':(S.Integer(0),S.Integer(1),k-p)}
    return {'kind':kind,'h':h,'k':k,'p':p,'axis':axis,'focus':focus,'directrix':directrix}


def _residual(par,x,y):
    """Zero exactly on the curve (curve-kind branch point)."""
    h,k,p=par['h'],par['k'],par['p']
    if par['axis']=='X': return (y-k)**2-4*p*(x-h)
    return (x-h)**2-4*p*(y-k)


def _negative(expr):
    sign=expr.is_negative
    return sign if sign is not None else float(expr.evalf(30))<0


def _is_zero(expr):
    return S.simplify(expr)==0


def _solve_axis_x(h,k,p,a,b,c):
    """Intersections of a*x+b*y=c with (y-k)^2=4p(x-h), as exact (x,y) pairs, unsorted."""
    if b!=0:
        m=-a/b;n=c/b
        if m==0:
            y=n;return [(h+(y-k)**2/(4*p),y)]
        A=m**2;B=2*m*(n-k)-4*p;C=(n-k)**2+4*p*h
        D=S.simplify(B**2-4*A*C)
        if _negative(D): return []
        if _is_zero(D): xs=[-B/(2*A)]
        else:
            root=S.sqrt(D);xs=[(-B-root)/(2*A),(-B+root)/(2*A)]
        return [(S.simplify(x),S.simplify(m*x+n)) for x in xs]
    x0=c/a
    R=S.simplify(4*p*(x0-h))
    if _negative(R): return []
    if _is_zero(R): return [(x0,k)]
    root=S.sqrt(R)
    return [(x0,S.simplify(k-root)),(x0,S.simplify(k+root))]


def _intersections(par,line):
    a,b,c=line
    if par['axis']=='X':
        found=_solve_axis_x(par['h'],par['k'],par['p'],a,b,c)
    else:
        found=[(y,x) for (x,y) in _solve_axis_x(par['k'],par['h'],par['p'],b,a,c)]
    return sorted(found,key=lambda pt:(round(float(pt[0].evalf(17)),12),round(float(pt[1].evalf(17)),12)))


def _foot(point,line):
    a,b,c=line
    t=(a*point[0]+b*point[1]-c)/(a**2+b**2)
    return S.simplify(point[0]-t*a),S.simplify(point[1]-t*b)


def _line_kind(line):
    a,b,c=line
    if b==0: return 'VERTICAL'
    if a==0: return 'HORIZONTAL'
    return 'SLOPE'


def _line_public(raw,line,role):
    a,b,c=line
    kind=_line_kind(line)
    entry={'id':raw['id'],'role':role,'type':kind,'label':raw.get('label'),
           'dashed':raw.get('dashed') is True,'hidden':raw.get('hidden') is True,
           'through':raw.get('through'),'tangent':False,
           'general':{'a':_value(a),'b':_value(b),'c':_value(c)}}
    if kind=='VERTICAL': entry['x']=_value(c/a)
    elif kind=='HORIZONTAL': entry['y']=_value(c/b)
    else:
        entry['slope']=_value(-a/b);entry['intercept']=_value(c/b)
    return entry


def _check_line_shape(raw):
    if not isinstance(raw,dict) or set(raw)-LINE_KEYS: _fail('ELLIPSE_LINE_INVALID')
    if not isinstance(raw.get('id'),str) or not LINE_ID.fullmatch(raw['id']): _fail('ELLIPSE_LINE_INVALID')
    role=raw.get('role')
    if role is not None and role!='DIRECTRIX': _fail('ELLIPSE_LINE_INVALID')
    if 'label' in raw:
        label=raw['label']
        if not isinstance(label,str) or not label.strip() or len(label)>LABEL_LIMIT: _fail('CONIC_LINE_LABEL_INVALID')
    for flag in ('dashed','hidden'):
        if raw.get(flag) not in (None,True,False): _fail('ELLIPSE_LINE_INVALID')
    geometry=[key for key in ('x','y','through') if key in raw]
    if 'slope' in raw or 'intercept' in raw:
        if 'slope' not in raw or 'intercept' not in raw: _fail('ELLIPSE_LINE_INVALID')
        geometry.append('slope')
    if role=='DIRECTRIX':
        if geometry: _fail('ELLIPSE_LINE_INVALID')
    elif len(geometry)!=1: _fail('ELLIPSE_LINE_INVALID')
    if 'through' in raw:
        pair=raw['through']
        if not isinstance(pair,list) or len(pair)!=2 or pair[0]==pair[1]: _fail('ELLIPSE_LINE_INVALID')
    return role


def _label_flag(raw):
    label=raw.get('label',True)
    if label not in (True,False): _fail('ELLIPSE_POINT_INVALID')
    return label


def produce(plan):
    if not isinstance(plan,dict): _fail('ELLIPSE_PLAN_INVALID')
    if 'ellipse' in plan or 'ellipses' in plan: _fail('CONIC_PLAN_CONFLICT')
    if set(plan)-TOP_KEYS: _fail('ELLIPSE_PLAN_INVALID')
    if plan.get('capability')!=CAPABILITY: _fail('ELLIPSE_PLAN_INVALID')
    par=_parabola(plan.get('conic'))
    raw_points=plan.get('points',[]) or []
    if not isinstance(raw_points,list) or len(raw_points)>10: _fail('ELLIPSE_POINT_INVALID')
    raw_lines=plan.get('lines',[]) or []
    if not isinstance(raw_lines,list): _fail('ELLIPSE_LINE_INVALID')

    point_ids=[]
    for raw in raw_points:
        if not isinstance(raw,dict): _fail('ELLIPSE_POINT_INVALID')
        pid=raw.get('id')
        if not isinstance(pid,str) or not POINT_ID.fullmatch(pid): _fail('ELLIPSE_POINT_ID_INVALID')
        if pid in point_ids: _fail('ELLIPSE_POINT_ID_DUPLICATE')
        point_ids.append(pid)
        kind=raw.get('kind')
        if kind not in POINT_KIND_KEYS or set(raw)-POINT_KIND_KEYS[kind]: _fail('ELLIPSE_POINT_INVALID')
    line_roles={};line_ids=[]
    for raw in raw_lines:
        role=_check_line_shape(raw)
        if raw['id'] in line_ids: _fail('ELLIPSE_LINE_INVALID')
        line_ids.append(raw['id']);line_roles[raw['id']]=role
    for raw in raw_points:
        kind=raw['kind']
        if kind=='LINE_CONIC' and raw.get('line') not in line_ids: _fail('ELLIPSE_LINE_INVALID')
        if kind=='FOOT':
            if raw.get('onto') not in line_ids: _fail('CONIC_FOOT_INVALID')
            if raw.get('from') not in point_ids or raw['from']==raw['id']: _fail('ELLIPSE_POINT_UNKNOWN')
            if raw.get('rightAngle') not in (None,True,False): _fail('ELLIPSE_POINT_INVALID')
    for raw in raw_lines:
        for pid in raw.get('through') or []:
            if pid not in point_ids: _fail('ELLIPSE_POINT_UNKNOWN')

    resolved={};lines={};foot_info={}
    pending_points=list(raw_points);pending_lines=list(raw_lines)
    h,k,p=par['h'],par['k'],par['p']
    for _round in range(len(raw_points)+len(raw_lines)+2):
        if not pending_points and not pending_lines: break
        progress=False
        for raw in list(pending_lines):
            if raw.get('role')=='DIRECTRIX': lines[raw['id']]=par['directrix']['line']
            elif 'x' in raw:
                lines[raw['id']]=(S.Integer(1),S.Integer(0),_scalar(raw['x'],'ELLIPSE_VALUE_INVALID'))
            elif 'y' in raw:
                lines[raw['id']]=(S.Integer(0),S.Integer(1),_scalar(raw['y'],'ELLIPSE_VALUE_INVALID'))
            elif 'slope' in raw:
                m=_scalar(raw['slope'],'ELLIPSE_VALUE_INVALID');n=_scalar(raw['intercept'],'ELLIPSE_VALUE_INVALID')
                lines[raw['id']]=(-m,S.Integer(1),n)
            else:
                first,second=raw['through']
                if first not in resolved or second not in resolved: continue
                (x1,y1),(x2,y2)=resolved[first],resolved[second]
                if _is_zero(x2-x1) and _is_zero(y2-y1): _fail('ELLIPSE_LINE_INVALID')
                a=S.simplify(y2-y1);b=S.simplify(x1-x2)
                lines[raw['id']]=(a,b,S.simplify(a*x1+b*y1))
            pending_lines.remove(raw);progress=True
        for raw in list(pending_points):
            kind=raw['kind'];pid=raw['id']
            if kind=='ORIGIN': value=(S.Integer(0),S.Integer(0))
            elif kind=='FOCUS': value=par['focus']
            elif kind=='VERTEX': value=(h,k)
            elif kind=='POINT':
                if 'x' not in raw or 'y' not in raw: _fail('ELLIPSE_POINT_INVALID')
                value=(_scalar(raw['x'],'ELLIPSE_VALUE_INVALID'),_scalar(raw['y'],'ELLIPSE_VALUE_INVALID'))
            elif kind=='ON_CONIC':
                has_x,has_y='x' in raw,'y' in raw
                if has_x==has_y: _fail('ELLIPSE_POINT_INVALID')
                branch=raw.get('branch')
                if branch not in (None,'POS','NEG'): _fail('ELLIPSE_POINT_INVALID')
                sign=-1 if branch=='NEG' else 1
                # the coordinate along the axis of symmetry's perpendicular fixes the point without a branch
                free=(has_x and par['axis']=='Y') or (has_y and par['axis']=='X')
                if free:
                    if branch is not None: _fail('ELLIPSE_POINT_INVALID')
                    if par['axis']=='X':
                        y=_scalar(raw['y'],'ELLIPSE_VALUE_INVALID');value=(S.simplify(h+(y-k)**2/(4*p)),y)
                    else:
                        x=_scalar(raw['x'],'ELLIPSE_VALUE_INVALID');value=(x,S.simplify(k+(x-h)**2/(4*p)))
                else:
                    if par['axis']=='X':
                        x=_scalar(raw['x'],'ELLIPSE_VALUE_INVALID');rest=S.simplify(4*p*(x-h))
                        if _negative(rest): _fail('CONIC_POINT_NOT_ON_CURVE')
                        value=(x,S.simplify(k+sign*S.sqrt(rest)))
                    else:
                        y=_scalar(raw['y'],'ELLIPSE_VALUE_INVALID');rest=S.simplify(4*p*(y-k))
                        if _negative(rest): _fail('CONIC_POINT_NOT_ON_CURVE')
                        value=(S.simplify(h+sign*S.sqrt(rest)),y)
            elif kind=='LINE_CONIC':
                if raw['line'] not in lines: continue
                which=raw.get('which')
                if which not in (1,2) or isinstance(which,bool): _fail('ELLIPSE_POINT_INVALID')
                found=_intersections(par,lines[raw['line']])
                if not found: _fail('CONIC_LINE_NO_INTERSECTION')
                if which>len(found): _fail('CONIC_INTERSECTION_INDEX_INVALID')
                value=found[which-1]
            else:   # FOOT
                if raw['from'] not in resolved or raw['onto'] not in lines: continue
                value=_foot(resolved[raw['from']],lines[raw['onto']])
                if _is_zero(value[0]-resolved[raw['from']][0]) and _is_zero(value[1]-resolved[raw['from']][1]):
                    _fail('CONIC_FOOT_INVALID')
                foot_info[pid]={'from':raw['from'],'onto':raw['onto'],'rightAngle':raw.get('rightAngle') is True}
            resolved[pid]=value;pending_points.remove(raw);progress=True
        if not progress: _fail('ELLIPSE_POINT_UNKNOWN')
    if pending_points or pending_lines: _fail('ELLIPSE_POINT_UNKNOWN')

    def known(pid):
        if pid not in resolved: _fail('ELLIPSE_POINT_UNKNOWN')
        return pid

    segments=[]
    for raw in plan.get('segments',[]) or []:
        if not isinstance(raw,dict) or set(raw)-SEGMENT_KEYS: _fail('ELLIPSE_SEGMENT_INVALID')
        start,end=raw.get('from'),raw.get('to')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_SEGMENT_INVALID')
        if start==end: _fail('ELLIPSE_SEGMENT_INVALID')
        known(start);known(end)
        if raw.get('dashed') not in (None,True,False): _fail('ELLIPSE_SEGMENT_INVALID')
        if 'label' in raw and (not isinstance(raw['label'],str) or not raw['label']): _fail('ELLIPSE_SEGMENT_INVALID')
        segments.append({'id':raw['id'],'from':start,'to':end,'label':raw.get('label'),'dashed':raw.get('dashed') is True})
    polygons=[]
    for raw in plan.get('polygons',[]) or []:
        if not isinstance(raw,dict) or set(raw)-POLYGON_KEYS: _fail('ELLIPSE_POLYGON_INVALID')
        members=raw.get('points')
        if not isinstance(members,list) or not (3<=len(members)<=6) or len(set(members))!=len(members): _fail('ELLIPSE_POLYGON_INVALID')
        for pid in members: known(pid)
        fill=raw.get('fill','LIGHT')
        if fill not in ('LIGHT','MEDIUM','NONE'): _fail('ELLIPSE_POLYGON_INVALID')
        coords=[resolved[pid] for pid in members];area=S.Integer(0)
        for index in range(len(coords)):
            x1,y1=coords[index];x2,y2=coords[(index+1)%len(coords)]
            area+=x1*y2-x2*y1
        if S.simplify(area)==0: _fail('ELLIPSE_POLYGON_INVALID')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_POLYGON_INVALID')
        polygons.append({'id':raw['id'],'points':members,'fill':fill})

    points=[]
    for raw in raw_points:
        pid=raw['id'];px,py=resolved[pid]
        points.append({'id':pid,'kind':raw['kind'],'x':_value(px),'y':_value(py),'labels':_label_flag(raw),
                       'onCurve':bool(_is_zero(_residual(par,px,py))),'foot':foot_info.get(pid)})
    # one name per spot: a second labelled point on the same place would print two names on one dot
    for index,first in enumerate(points):
        for second in points[index+1:]:
            if first['labels'] and second['labels'] and _is_zero(resolved[first['id']][0]-resolved[second['id']][0]) \
                    and _is_zero(resolved[first['id']][1]-resolved[second['id']][1]):
                _fail('CONIC_POINT_COINCIDENT')
    lines_public=[_line_public(raw,lines[raw['id']],line_roles[raw['id']]) for raw in raw_lines]

    xs=[S.Integer(0),h,par['focus'][0]];ys=[S.Integer(0),k,par['focus'][1]]
    # the open end of the curve: the latus rectum ends keep a visible stretch of the curve in the window
    if par['axis']=='X': ends=[(h+p,k+2*abs(p)),(h+p,k-2*abs(p))]
    else: ends=[(h+2*abs(p),k+p),(h-2*abs(p),k+p)]
    for x,y in ends: xs.append(x);ys.append(y)
    for px,py in resolved.values(): xs.append(px);ys.append(py)
    for entry in lines_public:
        if entry['hidden']: continue
        if entry['type']=='VERTICAL': xs.append(exact_scalar(entry['x']['exact']));ys.append(k)
        elif entry['type']=='HORIZONTAL': ys.append(exact_scalar(entry['y']['exact']));xs.append(h)
    bbox={'minX':float(min(xs).evalf(17)),'maxX':float(max(xs).evalf(17)),
          'minY':float(min(ys).evalf(17)),'maxY':float(max(ys).evalf(17))}
    d=par['directrix']
    conic={'kind':par['kind'],'axis':par['axis'],'vertex':{'x':_value(h),'y':_value(k)},'p':_value(p),
           'focus':{'x':_value(par['focus'][0]),'y':_value(par['focus'][1])},
           'directrix':{'orientation':d['orientation'],'value':_value(d['value'])},
           'equation':_text(_residual(par,S.Symbol('x'),S.Symbol('y')))}
    return {'modelVersion':MODEL_VERSION,'capability':CAPABILITY,'mode':'CONIC','conic':conic,
            'points':points,'segments':segments,'polygons':polygons,'lines':lines_public,'bbox':bbox}
