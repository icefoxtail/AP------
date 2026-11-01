"""Conic (parabola) solution figures inside `ellipse-figure-v1` (plan root field `conic`).

The capability name stays `ellipse-figure-v1`; a plan that carries a root `conic` field is derived here
instead of in `ellipse_figure.py`, so every existing `ellipse` / `ellipses` plan keeps its own code path.
The author states the standard-form parabola and the fact-level points and lines the stored solution
uses; every focus, directrix, intersection and foot of a perpendicular is derived exactly with SymPy.
The independent observer `conic_figure_observer.py` re-derives them with its own code and reads the
FINAL SVG.

  {capability: "ellipse-figure-v1",
   conic: {kind: "PARABOLA", vertex: [h, k], p: "p", axis: "X"|"Y"},   # (y-k)^2=4p(x-h) | (x-h)^2=4p(y-k)
        | {kind: "HYPERBOLA", center: [h, k], aSquared, bSquared, transverse: "X"|"Y"},   # (x-h)^2/a2-(y-k)^2/b2=1 | (y-k)^2/a2-(x-h)^2/b2=1
        | {kind: "CIRCLE", center: [h, k], rSquared},                                      # (x-h)^2+(y-k)^2=r2
        | {kind: "ELLIPSE", center: [h, k], aSquared, bSquared, major: "X"|"Y"},           # (x-h)^2/a2+(y-k)^2/b2=1 (a2 along `major`, a2 > b2)
   conics: [{id, ...one of the shapes above}, ...]     # instead of `conic`: one or two curves, each with an id
   points: [{id, kind: FOCUS|VERTEX|CENTER|ORIGIN|POINT|ON_CONIC|LINE_CONIC|LINE_LINE|FOOT|CONIC_CONIC|TANGENT_FROM, label?: bool,
             curve?: id,                                # which curve a curve-bound point or line belongs to (required with two curves)
             curves?: [id, id],                         # CONIC_CONIC: the which-th (1..4, x then y ascending) meeting of the two curves
             from?, which?: 1|2,                        # TANGENT_FROM: the 1st/2nd point of contact (x ascending) of the tangents from `from`
             side?: 1|-1,                              # hyperbola FOCUS / VERTEX (required there, refused on a parabola)
             x?, y?, branch?: POS|NEG, sign?: POS|NEG, # POINT / ON_CONIC (hyperbola: branch = side of the transverse axis, sign = other coordinate)
             lines?: [k1, k2],                         # LINE_LINE: the meeting point of two lines
             line?, which?: 1|2,                       # LINE_CONIC: the line and the 1st/2nd intersection
             from?, onto?, rightAngle?: bool}],        # FOOT: foot of the perpendicular from `from` onto line `onto`
   segments: [{id, from, to, label?, dashed?}],
   polygons: [{id, points, fill?}],
   lines: [{id, role?: "DIRECTRIX"|"ASYMPTOTE", sign?: 1|-1, x? | y? | slope+intercept | through: [P, Q] | at: P, label?, dashed?, hidden?,
            tangent?: true,                  # the line touches the curve (discriminant 0); `at: P` makes the tangent at the curve point P
            curve?: id}],
   caption, sourceConditions, newVisualInformation}

Adding a curve kind later means one more branch in `_curve`, `_residual`, `_intersections`
and the window extras in `produce`; the point and line machinery here is curve-independent.
"""
import re
import sympy as S

from ellipse_figure import exact_scalar,_value,_text,MODEL_VERSION,CAPABILITY,POINT_ID

LINE_ID=re.compile(r"^[A-Za-z][A-Za-z0-9_]{0,7}$")
TOP_KEYS={'capability','conic','conics','points','segments','polygons','lines','caption',
          'sourceConditions','newVisualInformation','sourceQuote'}
CONIC_KEYS={'kind','vertex','p','axis'}
HYPERBOLA_KEYS={'kind','center','aSquared','bSquared','transverse'}
CIRCLE_KEYS={'kind','center','rSquared'}
ELLIPSE_KEYS={'kind','center','aSquared','bSquared','major'}
MAX_CURVES=2
SEGMENT_KEYS={'id','from','to','label','dashed'}
POLYGON_KEYS={'id','points','fill'}
LINE_KEYS={'id','role','label','dashed','hidden','x','y','slope','intercept','through','sign','tangent','at','curve'}
POINT_KIND_KEYS={
    'ORIGIN':{'id','kind','label'},
    'FOCUS':{'id','kind','label','side','curve'},
    'VERTEX':{'id','kind','label','side','curve'},
    'CENTER':{'id','kind','label','curve'},
    'POINT':{'id','kind','x','y','label'},
    'ON_CONIC':{'id','kind','x','y','branch','sign','label','curve'},
    'LINE_CONIC':{'id','kind','line','which','label','curve'},
    'LINE_LINE':{'id','kind','lines','label'},
    'FOOT':{'id','kind','from','onto','rightAngle','label'},
    'CONIC_CONIC':{'id','kind','curves','which','label'},
    'TANGENT_FROM':{'id','kind','from','which','label','curve'},
}
SUPPORTED_KINDS=('PARABOLA','HYPERBOLA','CIRCLE','ELLIPSE')
LABEL_LIMIT=40


def _fail(code):
    raise ValueError(code)


def _scalar(text,code='CONIC_PARAMETER_INVALID'):
    try:
        return exact_scalar(text)
    except ValueError:
        _fail(code)


def _conic(raw):
    if not isinstance(raw,dict) or not isinstance(raw.get('kind'),str): _fail('CONIC_PARAMETER_INVALID')
    if raw['kind']=='HYPERBOLA': return _hyperbola(raw)
    if raw['kind']=='CIRCLE': return _circle(raw)
    if raw['kind']=='ELLIPSE': return _ellipse(raw)
    return _parabola(raw)


def _positive(value):
    sign=value.is_positive
    return sign if sign is not None else float(value.evalf(30))>0


def _hyperbola(raw):
    if set(raw)-HYPERBOLA_KEYS: _fail('CONIC_PARAMETER_INVALID')
    center=raw.get('center')
    if not isinstance(center,list) or len(center)!=2: _fail('CONIC_PARAMETER_INVALID')
    h,k=_scalar(center[0]),_scalar(center[1])
    a2,b2=_scalar(raw.get('aSquared')),_scalar(raw.get('bSquared'))
    if not _positive(a2) or not _positive(b2): _fail('CONIC_PARAMETER_INVALID')
    axis=raw.get('transverse')
    if axis not in ('X','Y'): _fail('CONIC_PARAMETER_INVALID')
    a,b,c=S.sqrt(a2),S.sqrt(b2),S.sqrt(a2+b2)
    if axis=='X':
        foci={side:(h+side*c,k) for side in (1,-1)};vertices={side:(h+side*a,k) for side in (1,-1)}
        slope=b/a
    else:
        foci={side:(h,k+side*c) for side in (1,-1)};vertices={side:(h,k+side*a) for side in (1,-1)}
        slope=a/b
    return {'kind':'HYPERBOLA','h':h,'k':k,'a2':a2,'b2':b2,'a':a,'b':b,'c':c,'axis':axis,
            'foci':foci,'vertices':vertices,'asymptoteSlope':S.simplify(slope)}


def _circle(raw):
    if set(raw)-CIRCLE_KEYS: _fail('CONIC_PARAMETER_INVALID')
    center=raw.get('center')
    if not isinstance(center,list) or len(center)!=2: _fail('CONIC_PARAMETER_INVALID')
    h,k=_scalar(center[0]),_scalar(center[1])
    r2=_scalar(raw.get('rSquared'))
    if not _positive(r2): _fail('CONIC_PARAMETER_INVALID')
    return {'kind':'CIRCLE','h':h,'k':k,'r2':r2,'r':S.sqrt(r2),'axis':None}


def _ellipse(raw):
    if set(raw)-ELLIPSE_KEYS: _fail('CONIC_PARAMETER_INVALID')
    center=raw.get('center')
    if not isinstance(center,list) or len(center)!=2: _fail('CONIC_PARAMETER_INVALID')
    h,k=_scalar(center[0]),_scalar(center[1])
    a2,b2=_scalar(raw.get('aSquared')),_scalar(raw.get('bSquared'))
    if not _positive(a2) or not _positive(b2): _fail('CONIC_PARAMETER_INVALID')
    if _is_zero(a2-b2) or not _positive(a2-b2): _fail('CONIC_PARAMETER_INVALID')   # a=b is a circle; aSquared is the longer axis
    axis=raw.get('major')
    if axis not in ('X','Y'): _fail('CONIC_PARAMETER_INVALID')
    a,b,c=S.sqrt(a2),S.sqrt(b2),S.sqrt(S.simplify(a2-b2))
    if axis=='X':
        foci={side:(h+side*c,k) for side in (1,-1)};vertices={side:(h+side*a,k) for side in (1,-1)}
    else:
        foci={side:(h,k+side*c) for side in (1,-1)};vertices={side:(h,k+side*a) for side in (1,-1)}
    return {'kind':'ELLIPSE','h':h,'k':k,'a2':a2,'b2':b2,'a':a,'b':b,'c':c,'axis':axis,'foci':foci,'vertices':vertices}


def _extent_squares(par):
    """(squared semi-extent along x, along y) of a circle or an ellipse."""
    if par['kind']=='CIRCLE': return par['r2'],par['r2']
    return (par['a2'],par['b2']) if par['axis']=='X' else (par['b2'],par['a2'])


def _side(raw):
    side=raw.get('side')
    if side not in (1,-1) or isinstance(side,bool): _fail('ELLIPSE_POINT_INVALID')
    return side


def _parabola(raw):
    if set(raw)-CONIC_KEYS: _fail('CONIC_PARAMETER_INVALID')
    kind=raw['kind']
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
    h,k=par['h'],par['k']
    if par['kind']=='HYPERBOLA':
        if par['axis']=='X': return (x-h)**2/par['a2']-(y-k)**2/par['b2']-1
        return (y-k)**2/par['a2']-(x-h)**2/par['b2']-1
    if par['kind']=='CIRCLE': return (x-h)**2+(y-k)**2-par['r2']
    if par['kind']=='ELLIPSE':
        rx2,ry2=_extent_squares(par)
        return (x-h)**2/rx2+(y-k)**2/ry2-1
    p=par['p']
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


def _solve_hyperbola_x(h,k,a2,b2,a,b,c):
    """Intersections of a*x+b*y=c with (x-h)^2/a2-(y-k)^2/b2=1 (a line parallel to an asymptote meets it once)."""
    if b!=0:
        m=-a/b;n=c/b
        A=b2-a2*m**2;B=-2*b2*h-2*a2*m*(n-k);C=b2*h**2-a2*(n-k)**2-a2*b2
        A,B,C=S.simplify(A),S.simplify(B),S.simplify(C)
        if A==0:
            if B==0: return []
            x=S.simplify(-C/B);return [(x,S.simplify(m*x+n))]
        D=S.simplify(B**2-4*A*C)
        if _negative(D): return []
        if _is_zero(D): xs=[-B/(2*A)]
        else:
            root=S.sqrt(D);xs=[(-B-root)/(2*A),(-B+root)/(2*A)]
        return [(S.simplify(x),S.simplify(m*x+n)) for x in xs]
    x0=c/a
    R=S.simplify(b2*((x0-h)**2/a2-1))
    if _negative(R): return []
    if _is_zero(R): return [(x0,k)]
    root=S.sqrt(R)
    return [(x0,S.simplify(k-root)),(x0,S.simplify(k+root))]


def _line_quadratic(par,line):
    """Substitute the line a*x+b*y=c into the curve: (variable, point-of-variable, [A, B, C]) of A t^2 + B t + C = 0.
    The variable is x when the line is not vertical, y otherwise; a missing leading coefficient comes back as 0."""
    a,b,c=line
    t=S.Symbol('t')
    if b!=0: expr=_residual(par,t,(c-a*t)/b);at=lambda value:(value,S.simplify((c-a*value)/b))
    else: expr=_residual(par,c/a,t);at=lambda value:(S.simplify(c/a),value)
    poly=S.Poly(S.expand(S.together(expr)),t)
    coeffs=[S.simplify(poly.coeff_monomial(t**power)) for power in (2,1,0)]
    return at,coeffs


def _generic_intersections(par,line):
    at,(A,B,C)=_line_quadratic(par,line)
    if A==0:
        if B==0: return []
        return [at(S.simplify(-C/B))]
    D=S.simplify(B**2-4*A*C)
    if _negative(D): return []
    if _is_zero(D): ts=[-B/(2*A)]
    else:
        root=S.sqrt(D);ts=[(-B-root)/(2*A),(-B+root)/(2*A)]
    return [at(S.simplify(t)) for t in ts]


def _tangent_point(par,line):
    """The point where the line touches the curve (discriminant 0 of the substituted quadratic), or None."""
    at,(A,B,C)=_line_quadratic(par,line)
    if A==0 or not _is_zero(B**2-4*A*C): return None
    return at(S.simplify(-B/(2*A)))


def _gradient(par,point):
    x,y=S.symbols('x y')
    expr=_residual(par,x,y)
    return S.simplify(S.diff(expr,x).subs({x:point[0],y:point[1]})),S.simplify(S.diff(expr,y).subs({x:point[0],y:point[1]}))


def _tangent_from_points(par,q):
    """The two points of contact of the tangents from an outside point q: they lie on the polar line of q
    (gradient . (q - P) = 0 and R(P) = 0 leave a linear condition), found by intersecting that line with the curve."""
    x,y=S.symbols('x y')
    expr=_residual(par,x,y)
    polar=S.Poly(S.expand(S.diff(expr,x)*(q[0]-x)+S.diff(expr,y)*(q[1]-y)+2*expr),x,y)
    a,b=polar.coeff_monomial(x),polar.coeff_monomial(y)
    if _is_zero(a) and _is_zero(b): return []
    found=_intersections(par,(S.simplify(a),S.simplify(b),S.simplify(-polar.coeff_monomial(1))))
    return found if len(found)==2 else []


def _curve_curve(first,second):
    """The real meeting points of two curves (SymPy solves the pair of quadratics), sorted by x then y."""
    x,y=S.symbols('x y',real=True)
    try: rows=S.solve([_residual(first,x,y),_residual(second,x,y)],[x,y],dict=True)
    except (NotImplementedError,ValueError,TypeError): rows=[]
    found=[]
    for row in rows:
        px,py=row.get(x),row.get(y)
        if px is None or py is None or not (px.is_number and py.is_number): _fail('CONIC_PARAMETER_INVALID')
        if abs(complex(px.evalf(30)).imag)>1e-12 or abs(complex(py.evalf(30)).imag)>1e-12: continue
        found.append((S.simplify(S.re(px)),S.simplify(S.re(py))))
    unique=[]
    for point in sorted(found,key=lambda pt:(round(float(pt[0].evalf(17)),12),round(float(pt[1].evalf(17)),12))):
        if not unique or abs(float((point[0]-unique[-1][0]).evalf(30)))>1e-12 or abs(float((point[1]-unique[-1][1]).evalf(30)))>1e-12:
            unique.append(point)
    return unique


def _intersections(par,line):
    a,b,c=line
    if par['kind'] in ('CIRCLE','ELLIPSE'):
        found=_generic_intersections(par,line)
    elif par['kind']=='HYPERBOLA':
        if par['axis']=='X': found=_solve_hyperbola_x(par['h'],par['k'],par['a2'],par['b2'],a,b,c)
        else: found=[(y,x) for (x,y) in _solve_hyperbola_x(par['k'],par['h'],par['a2'],par['b2'],b,a,c)]
    elif par['axis']=='X':
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


def _pick(raw,curves):
    """The curve a point or line belongs to: its `curve` id, or the only curve of the plan."""
    cid=raw.get('curve')
    if cid is None:
        if len(curves)>1: _fail('CONIC_CURVE_REQUIRED')
        return next(iter(curves.values()))
    if not isinstance(cid,str) or cid not in curves: _fail('CONIC_CURVE_UNKNOWN')
    return curves[cid]


def _check_line_shape(raw,curves):
    if not isinstance(raw,dict) or set(raw)-LINE_KEYS: _fail('ELLIPSE_LINE_INVALID')
    if not isinstance(raw.get('id'),str) or not LINE_ID.fullmatch(raw['id']): _fail('ELLIPSE_LINE_INVALID')
    role=raw.get('role')
    if role is not None and role not in ('DIRECTRIX','ASYMPTOTE'): _fail('ELLIPSE_LINE_INVALID')
    if raw.get('tangent') not in (None,True,False): _fail('ELLIPSE_LINE_INVALID')
    if 'at' in raw and (raw.get('tangent') is not True or not isinstance(raw['at'],str)): _fail('ELLIPSE_LINE_INVALID')
    if raw.get('tangent') is True and role is not None: _fail('ELLIPSE_LINE_INVALID')
    # a role or a tangent claim speaks about one curve: with two curves the line must say which
    owner=_pick(raw,curves) if (role is not None or raw.get('tangent') is True or 'curve' in raw) else None
    par=owner if owner is not None else next(iter(curves.values()))
    hyperbola=par['kind']=='HYPERBOLA'
    if role=='DIRECTRIX' and par['kind']!='PARABOLA': _fail('CONIC_DIRECTRIX_REQUIRES_PARABOLA')
    if role=='ASYMPTOTE' and not hyperbola: _fail('CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA')
    if role=='ASYMPTOTE':
        if raw.get('sign') not in (1,-1) or isinstance(raw.get('sign'),bool): _fail('CONIC_PARAMETER_INVALID')
    elif 'sign' in raw: _fail('ELLIPSE_LINE_INVALID')
    if 'label' in raw:
        label=raw['label']
        if not isinstance(label,str) or not label.strip() or len(label)>LABEL_LIMIT: _fail('CONIC_LINE_LABEL_INVALID')
    for flag in ('dashed','hidden'):
        if raw.get(flag) not in (None,True,False): _fail('ELLIPSE_LINE_INVALID')
    geometry=[key for key in ('x','y','through','at') if key in raw]
    if 'slope' in raw or 'intercept' in raw:
        if 'slope' not in raw or 'intercept' not in raw: _fail('ELLIPSE_LINE_INVALID')
        geometry.append('slope')
    if role in ('DIRECTRIX','ASYMPTOTE'):
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


def _hyperbola_point(par,raw):
    """A point of the hyperbola from one coordinate: the transverse one needs `sign` (which half of the other axis);
    the other one needs `branch` (which side of the transverse axis)."""
    has_x,has_y='x' in raw,'y' in raw
    if has_x==has_y: _fail('ELLIPSE_POINT_INVALID')
    branch,sign=raw.get('branch'),raw.get('sign')
    if branch not in (None,'POS','NEG') or sign not in (None,'POS','NEG'): _fail('ELLIPSE_POINT_INVALID')
    on_x=par['axis']=='X'
    ct,co=(par['h'],par['k']) if on_x else (par['k'],par['h'])
    if has_x==on_x:   # the transverse coordinate is given
        u=_scalar(raw['x' if on_x else 'y'],'ELLIPSE_VALUE_INVALID')
        rest=S.simplify(par['b2']*((u-ct)**2/par['a2']-1))
        if _negative(rest): _fail('CONIC_POINT_NOT_ON_CURVE')
        if branch is not None and (branch=='POS')!=_positive(u-ct): _fail('CONIC_POINT_NOT_ON_CURVE')
        if _is_zero(rest): v=co
        else:
            if sign is None: _fail('ELLIPSE_POINT_INVALID')
            v=S.simplify(co+(1 if sign=='POS' else -1)*S.sqrt(rest))
    else:
        v0=_scalar(raw['y' if on_x else 'x'],'ELLIPSE_VALUE_INVALID')
        if sign is not None or branch is None: _fail('ELLIPSE_POINT_INVALID')
        u=S.simplify(ct+(1 if branch=='POS' else -1)*S.sqrt(S.simplify(par['a2']*(1+(v0-co)**2/par['b2']))))
        v=v0
    return (u,v) if on_x else (v,u)


def _round_point(par,raw):
    """A point of a circle or an ellipse from one coordinate; `branch` picks the larger (POS) or smaller (NEG) other coordinate."""
    has_x,has_y='x' in raw,'y' in raw
    if has_x==has_y: _fail('ELLIPSE_POINT_INVALID')
    branch=raw.get('branch')
    if branch not in (None,'POS','NEG') or 'sign' in raw: _fail('ELLIPSE_POINT_INVALID')
    rx2,ry2=_extent_squares(par)
    h,k=par['h'],par['k']
    if has_x:
        x=_scalar(raw['x'],'ELLIPSE_VALUE_INVALID');rest=S.simplify(ry2*(1-(x-h)**2/rx2))
    else:
        y=_scalar(raw['y'],'ELLIPSE_VALUE_INVALID');rest=S.simplify(rx2*(1-(y-k)**2/ry2))
    if _negative(rest): _fail('CONIC_POINT_NOT_ON_CURVE')
    if _is_zero(rest): offset=S.Integer(0)
    else:
        if branch is None: _fail('ELLIPSE_POINT_INVALID')
        offset=(1 if branch=='POS' else -1)*S.sqrt(rest)
    return (x,S.simplify(k+offset)) if has_x else (S.simplify(h+offset),y)


def _curves(plan):
    """{id: curve} of the plan: the single `conic` (id None) or the one or two entries of `conics`."""
    if 'conic' in plan and 'conics' in plan: _fail('CONIC_PLAN_CONFLICT')
    if 'conics' not in plan: return {None:_conic(plan.get('conic'))}
    rows=plan['conics']
    if not isinstance(rows,list) or not rows: _fail('CONIC_PARAMETER_INVALID')
    if len(rows)>MAX_CURVES: _fail('CONIC_TOO_MANY_CURVES')
    curves={}
    for row in rows:
        if not isinstance(row,dict) or not isinstance(row.get('id'),str) or not LINE_ID.fullmatch(row['id']) or row['id'] in curves:
            _fail('CONIC_PARAMETER_INVALID')
        curves[row['id']]=_conic({key:value for key,value in row.items() if key!='id'})
    return curves


def _conic_public(par):
    point_of=lambda pt:{'x':_value(pt[0]),'y':_value(pt[1])}
    equation=_text(_residual(par,S.Symbol('x'),S.Symbol('y')))
    h,k=par['h'],par['k']
    if par['kind']=='HYPERBOLA':
        return {'kind':'HYPERBOLA','transverse':par['axis'],'center':{'x':_value(h),'y':_value(k)},
                'aSquared':_value(par['a2']),'bSquared':_value(par['b2']),'cSquared':_value(par['a2']+par['b2']),
                'foci':[point_of(par['foci'][1]),point_of(par['foci'][-1])],
                'vertices':[point_of(par['vertices'][1]),point_of(par['vertices'][-1])],
                'asymptoteSlope':_value(par['asymptoteSlope']),'equation':equation}
    if par['kind']=='CIRCLE':
        return {'kind':'CIRCLE','center':{'x':_value(h),'y':_value(k)},'rSquared':_value(par['r2']),'equation':equation}
    if par['kind']=='ELLIPSE':
        return {'kind':'ELLIPSE','major':par['axis'],'center':{'x':_value(h),'y':_value(k)},
                'aSquared':_value(par['a2']),'bSquared':_value(par['b2']),'cSquared':_value(S.simplify(par['a2']-par['b2'])),
                'foci':[point_of(par['foci'][1]),point_of(par['foci'][-1])],
                'vertices':[point_of(par['vertices'][1]),point_of(par['vertices'][-1])],'equation':equation}
    d=par['directrix']
    return {'kind':par['kind'],'axis':par['axis'],'vertex':{'x':_value(h),'y':_value(k)},'p':_value(par['p']),
            'focus':{'x':_value(par['focus'][0]),'y':_value(par['focus'][1])},
            'directrix':{'orientation':d['orientation'],'value':_value(d['value'])},'equation':equation}


def _window_ends(par):
    """(x values, y values, extra points) a curve adds to the window; the plane always shows its characteristic points."""
    h,k=par['h'],par['k']
    if par['kind']=='HYPERBOLA':
        # both branches stay visible: the vertices and foci, and the points a half-width (b) off the transverse axis
        ends=list(par['foci'].values())+list(par['vertices'].values())
        reach=S.sqrt(2*par['a2'])
        for side in (1,-1):
            for off in (1,-1):
                if par['axis']=='X': ends.append((h+side*reach,k+off*par['b']))
                else: ends.append((h+off*par['b'],k+side*reach))
        return [h],[k],ends
    if par['kind'] in ('CIRCLE','ELLIPSE'):
        rx2,ry2=_extent_squares(par);rx,ry=S.sqrt(rx2),S.sqrt(ry2)
        return [h],[k],[(h+rx,k),(h-rx,k),(h,k+ry),(h,k-ry)]
    p=par['p']
    # the open end of the curve: the latus rectum ends keep a visible stretch of the curve in the window
    if par['axis']=='X': ends=[(h+p,k+2*abs(p)),(h+p,k-2*abs(p))]
    else: ends=[(h+2*abs(p),k+p),(h-2*abs(p),k+p)]
    return [h,par['focus'][0]],[k,par['focus'][1]],ends


def produce(plan):
    if not isinstance(plan,dict): _fail('ELLIPSE_PLAN_INVALID')
    if 'ellipse' in plan or 'ellipses' in plan: _fail('CONIC_PLAN_CONFLICT')
    if set(plan)-TOP_KEYS: _fail('ELLIPSE_PLAN_INVALID')
    if plan.get('capability')!=CAPABILITY: _fail('ELLIPSE_PLAN_INVALID')
    curves=_curves(plan)
    multi='conics' in plan
    par=next(iter(curves.values()))
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
        if kind in ('FOCUS','VERTEX'):
            cp=_pick(raw,curves)
            if cp['kind'] in ('HYPERBOLA','ELLIPSE'): _side(raw)
            elif cp['kind']=='CIRCLE' or 'side' in raw: _fail('ELLIPSE_POINT_INVALID')
        elif kind=='CENTER':
            if _pick(raw,curves)['kind']=='PARABOLA': _fail('ELLIPSE_POINT_INVALID')
        elif kind in ('ON_CONIC','LINE_CONIC'): _pick(raw,curves)
        if 'sign' in raw and _pick(raw,curves)['kind']!='HYPERBOLA': _fail('ELLIPSE_POINT_INVALID')
        if kind=='CONIC_CONIC':
            pair=raw.get('curves')
            if not isinstance(pair,list) or len(pair)!=2 or pair[0]==pair[1] or any(cid is None or cid not in curves for cid in pair):
                _fail('CONIC_CURVE_UNKNOWN')
            if raw.get('which') not in (1,2,3,4) or isinstance(raw.get('which'),bool): _fail('CONIC_INTERSECTION_INDEX_INVALID')
        if kind=='TANGENT_FROM':
            _pick(raw,curves)
            if raw.get('which') not in (1,2) or isinstance(raw.get('which'),bool): _fail('CONIC_INTERSECTION_INDEX_INVALID')
            if raw.get('from')==pid or raw.get('from') not in [r.get('id') for r in raw_points if isinstance(r,dict)]:
                _fail('ELLIPSE_POINT_UNKNOWN')
    line_roles={};line_ids=[]
    for raw in raw_lines:
        role=_check_line_shape(raw,curves)
        if raw['id'] in line_ids: _fail('ELLIPSE_LINE_INVALID')
        line_ids.append(raw['id']);line_roles[raw['id']]=role
    for raw in raw_points:
        kind=raw['kind']
        if kind=='LINE_CONIC' and raw.get('line') not in line_ids: _fail('ELLIPSE_LINE_INVALID')
        if kind=='LINE_LINE':
            pair=raw.get('lines')
            if not isinstance(pair,list) or len(pair)!=2 or pair[0]==pair[1] or any(lid not in line_ids for lid in pair):
                _fail('ELLIPSE_LINE_INVALID')
        if kind=='FOOT':
            if raw.get('onto') not in line_ids: _fail('CONIC_FOOT_INVALID')
            if raw.get('from') not in point_ids or raw['from']==raw['id']: _fail('ELLIPSE_POINT_UNKNOWN')
            if raw.get('rightAngle') not in (None,True,False): _fail('ELLIPSE_POINT_INVALID')
    for raw in raw_lines:
        for pid in (raw.get('through') or [])+([raw['at']] if 'at' in raw else []):
            if pid not in point_ids: _fail('ELLIPSE_POINT_UNKNOWN')

    resolved={};lines={};foot_info={};tangent_info={}
    pending_points=list(raw_points);pending_lines=list(raw_lines)
    h,k=par['h'],par['k']
    for _round in range(len(raw_points)+len(raw_lines)+2):
        if not pending_points and not pending_lines: break
        progress=False
        for raw in list(pending_lines):
            owner=_pick(raw,curves) if (raw.get('role') or raw.get('tangent') is True) else par
            if raw.get('role')=='DIRECTRIX': lines[raw['id']]=owner['directrix']['line']
            elif raw.get('role')=='ASYMPTOTE':
                m=raw['sign']*owner['asymptoteSlope'];lines[raw['id']]=(-m,S.Integer(1),S.simplify(owner['k']-m*owner['h']))
            elif 'at' in raw:
                if raw['at'] not in resolved: continue
                touch=resolved[raw['at']]
                if not _is_zero(_residual(owner,touch[0],touch[1])): _fail('CONIC_POINT_NOT_ON_CURVE')
                gx,gy=_gradient(owner,touch)
                lines[raw['id']]=(gx,gy,S.simplify(gx*touch[0]+gy*touch[1]))
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
            if raw.get('tangent') is True:
                touch=_tangent_point(owner,lines[raw['id']])
                if touch is None: _fail('CONIC_TANGENT_CLAIM_FALSE')
                tangent_info[raw['id']]=touch
            pending_lines.remove(raw);progress=True
        for raw in list(pending_points):
            kind=raw['kind'];pid=raw['id']
            cp=_pick(raw,curves) if kind in ('FOCUS','VERTEX','CENTER','ON_CONIC','LINE_CONIC','TANGENT_FROM') else par
            ch,ck,p=cp['h'],cp['k'],cp.get('p')
            if kind=='ORIGIN': value=(S.Integer(0),S.Integer(0))
            elif kind=='FOCUS': value=cp['foci'][raw['side']] if cp['kind'] in ('HYPERBOLA','ELLIPSE') else cp['focus']
            elif kind=='VERTEX': value=cp['vertices'][raw['side']] if cp['kind'] in ('HYPERBOLA','ELLIPSE') else (ch,ck)
            elif kind=='CENTER': value=(ch,ck)
            elif kind=='POINT':
                if 'x' not in raw or 'y' not in raw: _fail('ELLIPSE_POINT_INVALID')
                value=(_scalar(raw['x'],'ELLIPSE_VALUE_INVALID'),_scalar(raw['y'],'ELLIPSE_VALUE_INVALID'))
            elif kind=='LINE_LINE':
                first,second=raw['lines']
                if first not in lines or second not in lines: continue
                a1,b1,c1=lines[first];a2,b2,c2=lines[second]
                det=S.simplify(a1*b2-a2*b1)
                if det==0: _fail('CONIC_LINES_PARALLEL')
                value=(S.simplify((c1*b2-c2*b1)/det),S.simplify((a1*c2-a2*c1)/det))
            elif kind=='ON_CONIC' and cp['kind']=='HYPERBOLA': value=_hyperbola_point(cp,raw)
            elif kind=='ON_CONIC' and cp['kind'] in ('CIRCLE','ELLIPSE'): value=_round_point(cp,raw)
            elif kind=='ON_CONIC':
                has_x,has_y='x' in raw,'y' in raw
                if has_x==has_y: _fail('ELLIPSE_POINT_INVALID')
                branch=raw.get('branch')
                if branch not in (None,'POS','NEG'): _fail('ELLIPSE_POINT_INVALID')
                sign=-1 if branch=='NEG' else 1
                # the coordinate along the axis of symmetry's perpendicular fixes the point without a branch
                free=(has_x and cp['axis']=='Y') or (has_y and cp['axis']=='X')
                if free:
                    if branch is not None: _fail('ELLIPSE_POINT_INVALID')
                    if cp['axis']=='X':
                        y=_scalar(raw['y'],'ELLIPSE_VALUE_INVALID');value=(S.simplify(ch+(y-ck)**2/(4*p)),y)
                    else:
                        x=_scalar(raw['x'],'ELLIPSE_VALUE_INVALID');value=(x,S.simplify(ck+(x-ch)**2/(4*p)))
                else:
                    if cp['axis']=='X':
                        x=_scalar(raw['x'],'ELLIPSE_VALUE_INVALID');rest=S.simplify(4*p*(x-ch))
                        if _negative(rest): _fail('CONIC_POINT_NOT_ON_CURVE')
                        value=(x,S.simplify(ck+sign*S.sqrt(rest)))
                    else:
                        y=_scalar(raw['y'],'ELLIPSE_VALUE_INVALID');rest=S.simplify(4*p*(y-ck))
                        if _negative(rest): _fail('CONIC_POINT_NOT_ON_CURVE')
                        value=(S.simplify(ch+sign*S.sqrt(rest)),y)
            elif kind=='LINE_CONIC':
                if raw['line'] not in lines: continue
                which=raw.get('which')
                if which not in (1,2) or isinstance(which,bool): _fail('ELLIPSE_POINT_INVALID')
                found=_intersections(cp,lines[raw['line']])
                if not found: _fail('CONIC_LINE_NO_INTERSECTION')
                if which>len(found): _fail('CONIC_INTERSECTION_INDEX_INVALID')
                value=found[which-1]
            elif kind=='CONIC_CONIC':
                found=_curve_curve(curves[raw['curves'][0]],curves[raw['curves'][1]])
                if raw['which']>len(found): _fail('CONIC_INTERSECTION_INDEX_INVALID')
                value=found[raw['which']-1]
            elif kind=='TANGENT_FROM':
                if raw['from'] not in resolved: continue
                touches=_tangent_from_points(cp,resolved[raw['from']])
                if not touches: _fail('CONIC_TANGENT_FROM_INVALID')
                value=touches[raw['which']-1]
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
        entry={'id':pid,'kind':raw['kind'],'x':_value(px),'y':_value(py),'labels':_label_flag(raw),
               'onCurve':any(bool(_is_zero(_residual(one,px,py))) for one in curves.values()),'foot':foot_info.get(pid)}
        if multi: entry['onCurves']=[cid for cid,one in curves.items() if _is_zero(_residual(one,px,py))]
        points.append(entry)
    # one name per spot: a second labelled point on the same place would print two names on one dot
    for index,first in enumerate(points):
        for second in points[index+1:]:
            if first['labels'] and second['labels'] and _is_zero(resolved[first['id']][0]-resolved[second['id']][0]) \
                    and _is_zero(resolved[first['id']][1]-resolved[second['id']][1]):
                _fail('CONIC_POINT_COINCIDENT')
    lines_public=[_line_public(raw,lines[raw['id']],line_roles[raw['id']]) for raw in raw_lines]
    for entry in lines_public:
        if entry['id'] in tangent_info:
            touch=tangent_info[entry['id']]
            entry['tangent']=True;entry['tangencyPoint']={'x':_value(touch[0]),'y':_value(touch[1])}
        if multi and (entry['role'] or entry['tangent']): entry['curve']=next(raw for raw in raw_lines if raw['id']==entry['id']).get('curve')

    xs=[S.Integer(0)];ys=[S.Integer(0)]
    for one in curves.values():
        more_x,more_y,ends=_window_ends(one)
        xs.extend(more_x);ys.extend(more_y)
        for x,y in ends: xs.append(x);ys.append(y)
    for px,py in resolved.values(): xs.append(px);ys.append(py)
    for entry in lines_public:
        if entry['hidden']: continue
        if entry['type']=='VERTICAL': xs.append(exact_scalar(entry['x']['exact']));ys.append(k)
        elif entry['type']=='HORIZONTAL': ys.append(exact_scalar(entry['y']['exact']));xs.append(h)
    bbox={'minX':float(min(xs).evalf(17)),'maxX':float(max(xs).evalf(17)),
          'minY':float(min(ys).evalf(17)),'maxY':float(max(ys).evalf(17))}
    model={'modelVersion':MODEL_VERSION,'capability':CAPABILITY,'mode':'CONIC'}
    if multi: model['conics']=[dict(_conic_public(one),id=cid) for cid,one in curves.items()]
    else: model['conic']=_conic_public(par)
    model.update({'points':points,'segments':segments,'polygons':polygons,'lines':lines_public,'bbox':bbox})
    return model
