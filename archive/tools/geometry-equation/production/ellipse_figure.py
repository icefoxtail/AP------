"""Axis-aligned ellipse solution figures (`ellipse-figure-v1`).

The author states the standard-form ellipse (centre, the two semi-axis squares and which axis is the
major axis) plus only the fact-level points and lines the stored solution uses.  This module derives
every focus, vertex, mirror point and tangency exactly with SymPy, and refuses any shape that is not
an axis-aligned ellipse with a != b (a rotated ellipse, a hyperbola and a circle all get an explicit
code).  The independent observer `ellipse_figure_observer.py` re-derives the same facts with its own
code and reads the FINAL SVG; it never trusts the numbers returned here.

Plan shape (rejected keys are an error, so a rotated ellipse has nowhere to be written):

  {capability: "ellipse-figure-v1",
   ellipse: {center: [ex, ey], semiAxisSquared: {major: e, minor: e}, majorAxis: "X"|"Y"},
   # or, for exactly two axis-aligned ellipses on one shared coordinate plane:
   ellipses: [{id, center: [ex, ey], semiAxisSquared: {major: e, minor: e}, majorAxis: "X"|"Y"}, ...],
   points:  [{id, kind: FOCUS|VERTEX|ON_ELLIPSE|OPPOSITE|ORIGIN|POINT, ellipseId?,
              side?: 1|-1, end?: MAJOR_POS|MAJOR_NEG|MINOR_POS|MINOR_NEG,
              x?, y?, branch?: POS|NEG, of?: pointId, label?: bool}],
   segments: [{id, from, to, label?, dashed?}],
   polygons: [{id, points: [3..6 ids], fill?: LIGHT|MEDIUM|NONE}],
   lines:    [{id, slope, intercept, label?, tangent?}],
   caption, sourceConditions, newVisualInformation}

Every coordinate and coefficient is an exact string such as "-2", "42/5", "sqrt(3)", "sqrt(13)/2".
"""
import math
import re
import sympy as S

CAPABILITY='ellipse-figure-v1'
MODEL_VERSION='ELLIPSE_FIGURE_MODEL_v1'

POINT_ID=re.compile(r"^[A-Z][0-9']?$")
ELLIPSE_ID=re.compile(r"^[A-Za-z][A-Za-z0-9_]{0,7}$")
VALUE_CHARS=re.compile(r"^[0-9+\-*/(). a-z]+$")
TOP_KEYS={'capability','ellipse','ellipses','points','segments','polygons','lines','caption',
          'sourceConditions','newVisualInformation','sourceQuote'}
ELLIPSE_KEYS={'center','semiAxisSquared','majorAxis'}
PAIR_ELLIPSE_KEYS=ELLIPSE_KEYS|{'id'}
AXIS_KEYS={'major','minor'}
POINT_KEYS={'id','kind','side','end','x','y','branch','of','label','ellipseId'}
SEGMENT_KEYS={'id','from','to','label','dashed'}
POLYGON_KEYS={'id','points','fill'}
LINE_KEYS={'id','slope','intercept','label','tangent','ellipseId'}


def _fail(code):
    raise ValueError(code)


def _only(value,keys,code):
    if not isinstance(value,dict) or set(value)-set(keys):
        _fail(code)


def exact_scalar(text):
    """Parse an exact scalar string (integers, fractions, sqrt) into a SymPy real number."""
    if not isinstance(text,str): _fail('ELLIPSE_VALUE_INVALID')
    raw=text.strip()
    if not raw or len(raw)>120 or not VALUE_CHARS.fullmatch(raw): _fail('ELLIPSE_VALUE_INVALID')
    if re.search(r'[a-z]',raw.replace('sqrt','')): _fail('ELLIPSE_VALUE_INVALID')
    try:
        value=S.sympify(raw,locals={'sqrt':S.sqrt},rational=True,evaluate=True)
    except (S.SympifyError,TypeError,ValueError):
        _fail('ELLIPSE_VALUE_INVALID')
    if value.is_real is not True: _fail('ELLIPSE_VALUE_INVALID')
    return S.nsimplify(value,rational=False)


def _text(value):
    text=S.sstr(value)
    return '0' if text=='0' else text


def _value(value):
    return {'exact':_text(value),'value':float(value.evalf(17))}


def _point(x,y):
    return {'x':_value(x),'y':_value(y)}


def _shapes(ellipse):
    _only(ellipse,ELLIPSE_KEYS,'ELLIPSE_PLAN_INVALID')
    center=ellipse.get('center')
    if not isinstance(center,list) or len(center)!=2: _fail('ELLIPSE_CENTER_INVALID')
    cx,cy=exact_scalar(center[0]),exact_scalar(center[1])
    axes=ellipse.get('semiAxisSquared')
    _only(axes,AXIS_KEYS,'ELLIPSE_AXES_INVALID')
    major,minor=exact_scalar(axes['major']),exact_scalar(axes['minor'])
    if major<=0 or minor<=0: _fail('ELLIPSE_AXES_INVALID')
    if major<=minor: _fail('ELLIPSE_AXES_INVALID')
    orientation=ellipse.get('majorAxis')
    if orientation not in ('X','Y'): _fail('ELLIPSE_MAJOR_AXIS_UNSUPPORTED')
    A=S.sqrt(major);B=S.sqrt(minor);c=S.sqrt(major-minor)
    ax,ay=(A,B) if orientation=='X' else (B,A)
    return {'cx':cx,'cy':cy,'major2':major,'minor2':minor,'A':A,'B':B,'c':c,
            'orientation':orientation,'ax':ax,'ay':ay,'c2':major-minor}


def _resolve(shape,raw):
    """Resolve one authored point to exact coordinates (frame order is handled by the caller)."""
    _only(raw,POINT_KEYS,'ELLIPSE_POINT_INVALID')
    kind=raw.get('kind')
    cx,cy,A,B,c=shape['cx'],shape['cy'],shape['A'],shape['B'],shape['c']
    if kind=='ORIGIN':
        return S.Integer(0),S.Integer(0)
    if kind=='FOCUS':
        side=raw.get('side')
        if side not in (1,-1): _fail('ELLIPSE_POINT_INVALID')
        return (cx+side*c,cy) if shape['orientation']=='X' else (cx,cy+side*c)
    if kind=='VERTEX':
        end=raw.get('end')
        if end=='MAJOR_POS': return (cx+A,cy) if shape['orientation']=='X' else (cx,cy+A)
        if end=='MAJOR_NEG': return (cx-A,cy) if shape['orientation']=='X' else (cx,cy-A)
        if end=='MINOR_POS': return (cx,cy+B) if shape['orientation']=='X' else (cx+B,cy)
        if end=='MINOR_NEG': return (cx,cy-B) if shape['orientation']=='X' else (cx-B,cy)
        _fail('ELLIPSE_POINT_INVALID')
    if kind=='ON_ELLIPSE':
        branch=raw.get('branch','POS')
        if branch not in ('POS','NEG'): _fail('ELLIPSE_POINT_INVALID')
        sign=1 if branch=='POS' else -1
        has_x,has_y='x' in raw,'y' in raw
        if has_x==has_y: _fail('ELLIPSE_POINT_INVALID')
        if has_x:
            x=exact_scalar(raw['x'])
            span=shape['ax']
            if span==0: _fail('ELLIPSE_POINT_INVALID')
            rest=1-((x-cx)/span)**2
            if rest.is_negative: _fail('ELLIPSE_POINT_NOT_ON_ELLIPSE')
            return x,cy+sign*shape['ay']*S.sqrt(rest)
        y=exact_scalar(raw['y'])
        span=shape['ay']
        rest=1-((y-cy)/span)**2
        if rest.is_negative: _fail('ELLIPSE_POINT_NOT_ON_ELLIPSE')
        return cx+sign*shape['ax']*S.sqrt(rest),y
    if kind=='POINT':
        if 'x' not in raw or 'y' not in raw: _fail('ELLIPSE_POINT_INVALID')
        return exact_scalar(raw['x']),exact_scalar(raw['y'])
    _fail('ELLIPSE_POINT_INVALID')


def _pair_shapes(plan):
    raw=plan.get('ellipses')
    if not isinstance(raw,list) or len(raw)!=2:
        _fail('ELLIPSE_PAIR_COUNT_INVALID')
    shapes={};order=[]
    for item in raw:
        _only(item,PAIR_ELLIPSE_KEYS,'ELLIPSE_PLAN_INVALID')
        eid=item.get('id')
        if not isinstance(eid,str) or not ELLIPSE_ID.fullmatch(eid):
            _fail('ELLIPSE_ELLIPSE_ID_INVALID')
        if eid in shapes:
            _fail('ELLIPSE_ELLIPSE_ID_DUPLICATE')
        shapes[eid]=_shapes({key:item[key] for key in ('center','semiAxisSquared','majorAxis')})
        order.append(eid)
    return shapes,order


def _shape_public(eid,shape):
    return {'id':eid,'majorAxis':shape['orientation'],
            'center':{'x':_value(shape['cx']),'y':_value(shape['cy'])},
            'semiAxis':{'major':{'squared':_text(shape['major2']),'exact':_text(shape['A']),'value':float(shape['A'].evalf(17))},
                        'minor':{'squared':_text(shape['minor2']),'exact':_text(shape['B']),'value':float(shape['B'].evalf(17))}},
            'focalDistance':{'squared':_text(shape['c2']),'exact':_text(shape['c']),'value':float(shape['c'].evalf(17))},
            'focusSeparation':{'exact':_text(2*shape['c']),'value':float((2*shape['c']).evalf(17))},
            'foci':[{'side':1,'x':_value(shape['cx']+shape['c'] if shape['orientation']=='X' else shape['cx']),
                     'y':_value(shape['cy'] if shape['orientation']=='X' else shape['cy']+shape['c'])},
                    {'side':-1,'x':_value(shape['cx']-shape['c'] if shape['orientation']=='X' else shape['cx']),
                     'y':_value(shape['cy'] if shape['orientation']=='X' else shape['cy']-shape['c'])}]}


def _produce_pair(plan):
    """Exactly two axis-aligned ellipses on one shared plane, with one uniform scale."""
    shapes,order=_pair_shapes(plan)
    raw_points=plan.get('points',[])
    if not isinstance(raw_points,list) or len(raw_points)>10:
        _fail('ELLIPSE_POINT_INVALID')
    ids=[];resolved={};point_shape={};pending=[]
    for raw in raw_points:
        _only(raw,POINT_KEYS,'ELLIPSE_POINT_INVALID')
        pid=raw.get('id')
        if not isinstance(pid,str) or not POINT_ID.fullmatch(pid):
            _fail('ELLIPSE_POINT_ID_INVALID')
        if pid in ids:
            _fail('ELLIPSE_POINT_ID_DUPLICATE')
        ids.append(pid)
        kind=raw.get('kind')
        eid=raw.get('ellipseId')
        if eid is not None and eid not in shapes:
            _fail('ELLIPSE_POINT_ELLIPSE_ID_INVALID')
        if kind in ('FOCUS','VERTEX','ON_ELLIPSE'):
            if eid is None:
                _fail('ELLIPSE_POINT_ELLIPSE_ID_REQUIRED')
            resolved[pid]=_resolve(shapes[eid],raw)
            point_shape[pid]=eid
        elif kind=='OPPOSITE':
            pending.append(raw)
        else:
            resolved[pid]=_resolve(shapes[eid or order[0]],raw)
            point_shape[pid]=eid
    for _round in range(3):
        if not pending: break
        remaining=[]
        for raw in pending:
            if set(raw)-{'id','kind','of','ellipseId','label'}:
                _fail('ELLIPSE_POINT_INVALID')
            target=raw.get('of')
            if target not in resolved:
                remaining.append(raw);continue
            target_shape=point_shape.get(target) or raw.get('ellipseId') or order[0]
            if target_shape not in shapes:
                _fail('ELLIPSE_POINT_ELLIPSE_ID_INVALID')
            if raw.get('ellipseId') is not None and raw['ellipseId']!=target_shape:
                _fail('ELLIPSE_POINT_ELLIPSE_ID_INVALID')
            shape=shapes[target_shape]
            px,py=resolved[target]
            resolved[raw['id']]=(2*shape['cx']-px,2*shape['cy']-py)
            point_shape[raw['id']]=target_shape
        if len(remaining)==len(pending):
            _fail('ELLIPSE_POINT_UNKNOWN')
        pending=remaining
    if pending:
        _fail('ELLIPSE_POINT_UNKNOWN')

    def known(pid):
        if pid not in resolved:
            _fail('ELLIPSE_POINT_UNKNOWN')
        return pid

    segments=[]
    for raw in plan.get('segments',[]) or []:
        _only(raw,SEGMENT_KEYS,'ELLIPSE_SEGMENT_INVALID')
        start,end=raw.get('from'),raw.get('to')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_SEGMENT_INVALID')
        if start==end: _fail('ELLIPSE_SEGMENT_INVALID')
        known(start);known(end)
        if raw.get('dashed') not in (None,True,False): _fail('ELLIPSE_SEGMENT_INVALID')
        if 'label' in raw and (not isinstance(raw['label'],str) or not raw['label']):
            _fail('ELLIPSE_SEGMENT_INVALID')
        segments.append({'id':raw['id'],'from':start,'to':end,
                         'label':raw.get('label'),'dashed':raw.get('dashed') is True})
    polygons=[]
    for raw in plan.get('polygons',[]) or []:
        _only(raw,POLYGON_KEYS,'ELLIPSE_POLYGON_INVALID')
        members=raw.get('points')
        if not isinstance(members,list) or not (3<=len(members)<=6): _fail('ELLIPSE_POLYGON_INVALID')
        if len(set(members))!=len(members): _fail('ELLIPSE_POLYGON_INVALID')
        for pid in members: known(pid)
        fill=raw.get('fill','LIGHT')
        if fill not in ('LIGHT','MEDIUM','NONE'): _fail('ELLIPSE_POLYGON_INVALID')
        coords=[resolved[pid] for pid in members]
        area=S.Integer(0)
        for index in range(len(coords)):
            x1,y1=coords[index];x2,y2=coords[(index+1)%len(coords)]
            area+=x1*y2-x2*y1
        if S.simplify(area)==0: _fail('ELLIPSE_POLYGON_INVALID')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_POLYGON_INVALID')
        polygons.append({'id':raw['id'],'points':members,'fill':fill})
    lines=[]
    x=S.Symbol('x')
    for raw in plan.get('lines',[]) or []:
        _only(raw,LINE_KEYS,'ELLIPSE_LINE_INVALID')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_LINE_INVALID')
        if 'label' in raw: _fail('ELLIPSE_LINE_LABEL_UNSUPPORTED')
        eid=raw.get('ellipseId') or order[0]
        if eid not in shapes: _fail('ELLIPSE_LINE_ELLIPSE_ID_INVALID')
        shape=shapes[eid]
        slope=exact_scalar(raw.get('slope'));intercept=exact_scalar(raw.get('intercept'))
        tangent=raw.get('tangent') is True
        entry={'id':raw['id'],'slope':_value(slope),'intercept':_value(intercept),'tangent':tangent,
               'ellipseId':eid,'tangencyPoint':None}
        if tangent:
            expr=((x-shape['cx'])/shape['ax'])**2+((slope*x+intercept-shape['cy'])/shape['ay'])**2-1
            poly=S.Poly(S.expand(S.together(expr)),x)
            if S.discriminant(poly)!=0: _fail('ELLIPSE_LINE_NOT_TANGENT')
            tx=S.simplify(-poly.coeff_monomial(x)/(2*poly.LC()));ty=S.simplify(slope*tx+intercept)
            entry['tangencyPoint']=_point(tx,ty)
            touching=[pid for pid,(px,py) in resolved.items()
                      if S.simplify(px-tx)==0 and S.simplify(py-ty)==0]
            entry['tangencyPointId']=touching[0] if touching else None
        lines.append(entry)

    points=[]
    for raw in raw_points:
        pid=raw['id'];px,py=resolved[pid]
        label=raw.get('label',True)
        if label not in (True,False): _fail('ELLIPSE_POINT_INVALID')
        eid=point_shape.get(pid)
        if eid:
            shape=shapes[eid]
            on_curve=S.simplify(((px-shape['cx'])/shape['ax'])**2+((py-shape['cy'])/shape['ay'])**2-1)==0
        else:
            on_curve=False
        points.append({'id':pid,'kind':raw['kind'],'x':_value(px),'y':_value(py),
                       'labels':label,'onEllipse':bool(on_curve),'ellipseId':eid})

    xs=[];ys=[S.Integer(0)]
    for eid in order:
        shape=shapes[eid]
        xs.extend([shape['cx']-shape['ax'],shape['cx']+shape['ax']])
        ys.extend([shape['cy']-shape['ay'],shape['cy']+shape['ay']])
    for px,py in resolved.values(): xs.append(px);ys.append(py)
    for entry in lines:
        if entry['tangencyPoint']:
            xs.append(exact_scalar(entry['tangencyPoint']['x']['exact']))
            ys.append(exact_scalar(entry['tangencyPoint']['y']['exact']))
    bbox={'minX':float(min(xs).evalf(17)),'maxX':float(max(xs).evalf(17)),
          'minY':float(min(ys).evalf(17)),'maxY':float(max(ys).evalf(17))}
    return {'modelVersion':MODEL_VERSION,'capability':CAPABILITY,'mode':'PAIR',
            'majorAxis':shapes[order[0]]['orientation'],
            'ellipses':[_shape_public(eid,shapes[eid]) for eid in order],
            'points':points,'segments':segments,'polygons':polygons,'lines':lines,
            'bbox':bbox}


def produce(plan):
    _only(plan,TOP_KEYS,'ELLIPSE_PLAN_INVALID')
    if plan.get('capability')!=CAPABILITY: _fail('ELLIPSE_PLAN_INVALID')
    if 'ellipses' in plan:
        if 'ellipse' in plan: _fail('ELLIPSE_PLAN_INVALID')
        return _produce_pair(plan)
    shape=_shapes(plan['ellipse'])
    raw_points=plan.get('points',[])
    if not isinstance(raw_points,list) or len(raw_points)>10: _fail('ELLIPSE_POINT_INVALID')
    ids=[]
    resolved={}
    pending=[]
    for raw in raw_points:
        _only(raw,POINT_KEYS,'ELLIPSE_POINT_INVALID')
        if 'ellipseId' in raw: _fail('ELLIPSE_POINT_INVALID')
        pid=raw.get('id')
        if not isinstance(pid,str) or not POINT_ID.fullmatch(pid): _fail('ELLIPSE_POINT_ID_INVALID')
        if pid in ids: _fail('ELLIPSE_POINT_ID_DUPLICATE')
        ids.append(pid)
        if raw.get('kind')=='OPPOSITE': pending.append(raw)
        else: resolved[pid]=_resolve(shape,raw)
    for _round in range(3):
        if not pending: break
        remaining=[]
        for raw in pending:
            target=raw.get('of')
            if target not in resolved:
                remaining.append(raw);continue
            if set(raw)-{'id','kind','of'}:
                _fail('ELLIPSE_POINT_INVALID')
            px,py=resolved[target]
            resolved[raw['id']]=(2*shape['cx']-px,2*shape['cy']-py)
        if len(remaining)==len(pending): _fail('ELLIPSE_POINT_UNKNOWN')
        pending=remaining
    if pending: _fail('ELLIPSE_POINT_UNKNOWN')

    def known(pid):
        if pid not in resolved: _fail('ELLIPSE_POINT_UNKNOWN')
        return pid

    segments=[]
    for raw in plan.get('segments',[]) or []:
        _only(raw,SEGMENT_KEYS,'ELLIPSE_SEGMENT_INVALID')
        start,end=raw.get('from'),raw.get('to')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_SEGMENT_INVALID')
        if start==end: _fail('ELLIPSE_SEGMENT_INVALID')
        known(start);known(end)
        if raw.get('dashed') not in (None,True,False): _fail('ELLIPSE_SEGMENT_INVALID')
        if 'label' in raw and (not isinstance(raw['label'],str) or not raw['label']):
            _fail('ELLIPSE_SEGMENT_INVALID')
        segments.append({'id':raw['id'],'from':start,'to':end,
                         'label':raw.get('label'),'dashed':raw.get('dashed') is True})
    polygons=[]
    for raw in plan.get('polygons',[]) or []:
        _only(raw,POLYGON_KEYS,'ELLIPSE_POLYGON_INVALID')
        members=raw.get('points')
        if not isinstance(members,list) or not (3<=len(members)<=6): _fail('ELLIPSE_POLYGON_INVALID')
        if len(set(members))!=len(members): _fail('ELLIPSE_POLYGON_INVALID')
        for pid in members: known(pid)
        fill=raw.get('fill','LIGHT')
        if fill not in ('LIGHT','MEDIUM','NONE'): _fail('ELLIPSE_POLYGON_INVALID')
        coords=[resolved[pid] for pid in members]
        area=S.Integer(0)
        for index in range(len(coords)):
            x1,y1=coords[index];x2,y2=coords[(index+1)%len(coords)]
            area+=x1*y2-x2*y1
        if S.simplify(area)==0: _fail('ELLIPSE_POLYGON_INVALID')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_POLYGON_INVALID')
        polygons.append({'id':raw['id'],'points':members,'fill':fill})
    lines=[]
    x=S.Symbol('x')
    for raw in plan.get('lines',[]) or []:
        _only(raw,LINE_KEYS,'ELLIPSE_LINE_INVALID')
        if 'ellipseId' in raw: _fail('ELLIPSE_LINE_INVALID')
        if not isinstance(raw.get('id'),str) or not raw['id']: _fail('ELLIPSE_LINE_INVALID')
        if 'label' in raw: _fail('ELLIPSE_LINE_LABEL_UNSUPPORTED')
        slope=exact_scalar(raw.get('slope'));intercept=exact_scalar(raw.get('intercept'))
        tangent=raw.get('tangent') is True
        entry={'id':raw['id'],'slope':_value(slope),'intercept':_value(intercept),'tangent':tangent,
               'tangencyPoint':None}
        if tangent:
            expr=((x-shape['cx'])/shape['ax'])**2+((slope*x+intercept-shape['cy'])/shape['ay'])**2-1
            poly=S.Poly(S.expand(S.together(expr)),x)
            if S.discriminant(poly)!=0: _fail('ELLIPSE_LINE_NOT_TANGENT')
            tx=S.simplify(-poly.coeff_monomial(x)/(2*poly.LC()));ty=S.simplify(slope*tx+intercept)
            entry['tangencyPoint']=_point(tx,ty)
            touching=[pid for pid,(px,py) in resolved.items()
                      if S.simplify(px-tx)==0 and S.simplify(py-ty)==0]
            entry['tangencyPointId']=touching[0] if touching else None
        lines.append(entry)

    points=[]
    for raw in raw_points:
        pid=raw['id'];px,py=resolved[pid]
        label=raw.get('label',True)
        if label not in (True,False): _fail('ELLIPSE_POINT_INVALID')
        on_curve=S.simplify(((px-shape['cx'])/shape['ax'])**2+((py-shape['cy'])/shape['ay'])**2-1)==0
        points.append({'id':pid,'kind':raw['kind'],'x':_value(px),'y':_value(py),
                       'labels':label,'onEllipse':bool(on_curve)})

    xs=[shape['cx']-shape['ax'],shape['cx']+shape['ax'],S.Integer(0)]
    ys=[shape['cy']-shape['ay'],shape['cy']+shape['ay'],S.Integer(0)]
    for px,py in resolved.values(): xs.append(px);ys.append(py)
    for entry in lines:
        if entry['tangencyPoint']:
            xs.append(exact_scalar(entry['tangencyPoint']['x']['exact']))
            ys.append(exact_scalar(entry['tangencyPoint']['y']['exact']))
    bbox={'minX':float(min(xs).evalf(17)),'maxX':float(max(xs).evalf(17)),
          'minY':float(min(ys).evalf(17)),'maxY':float(max(ys).evalf(17))}
    return {'modelVersion':MODEL_VERSION,'capability':CAPABILITY,
            'majorAxis':shape['orientation'],
            'center':{'x':_value(shape['cx']),'y':_value(shape['cy'])},
            'semiAxis':{'major':{'squared':_text(shape['major2']),'exact':_text(shape['A']),'value':float(shape['A'].evalf(17))},
                        'minor':{'squared':_text(shape['minor2']),'exact':_text(shape['B']),'value':float(shape['B'].evalf(17))}},
            'focalDistance':{'squared':_text(shape['c2']),'exact':_text(shape['c']),'value':float(shape['c'].evalf(17))},
            'focusSeparation':{'exact':_text(2*shape['c']),'value':float((2*shape['c']).evalf(17))},
            'foci':[{'side':1,'x':_value(shape['cx']+shape['c'] if shape['orientation']=='X' else shape['cx']),
                     'y':_value(shape['cy'] if shape['orientation']=='X' else shape['cy']+shape['c'])},
                    {'side':-1,'x':_value(shape['cx']-shape['c'] if shape['orientation']=='X' else shape['cx']),
                     'y':_value(shape['cy'] if shape['orientation']=='X' else shape['cy']-shape['c'])}],
            'points':points,'segments':segments,'polygons':polygons,'lines':lines,
            'bbox':bbox}
