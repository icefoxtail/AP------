"""Bounded overview fitting. Display windows do not change source domains."""
import math
import re
from fractions import Fraction
import sympy as S

_x=S.Symbol('x',real=True)
# A repeated real root of a cubic/quartic is a root of gcd(p,p'), a degree<=2 factor of rational coefficients: it is either rational or
# p+q*sqrt(r). The isolating interval pins its location; a width beyond this bound means the location is not representable.
REPEATED_ROOT_MAX_ISOLATION_WIDTH=S.Rational(1,10**9)

def _real_root_rows(poly):
    if poly.is_zero:return []
    return [((a+b)/2,int(multiplicity)) for (a,b),multiplicity in poly.intervals(eps=S.Rational(1,10**13))]


def _fit_cubic_quartic(plan,coefficients):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:
        raise ValueError('CUBIC_QUARTIC_REQUIRES_ALL_REALS_SOURCE_DOMAIN')
    original_domain=plan.get('domain')
    original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or not all(isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v) for v in original_domain) or not original_domain[0]<original_domain[1]:
        raise ValueError('INVALID_CUBIC_QUARTIC_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or not all(isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v) for v in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:
        raise ValueError('INVALID_CUBIC_QUARTIC_VIEWPORT')
    polynomial=S.Poly(sum(S.Rational(c.numerator,c.denominator)*_x**i for i,c in enumerate(coefficients)),_x)
    degree=polynomial.degree()
    if degree not in (3,4):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_DEGREE')
    root_intervals=[] if polynomial.is_zero else list(polynomial.intervals(eps=S.Rational(1,10**13)))
    roots=[((a+b)/2,int(multiplicity)) for (a,b),multiplicity in root_intervals]
    # Repeated real roots are exact: even multiplicity touches the x-axis (a local extremum on the axis), odd multiplicity crosses with a
    # flattening. A repeated root of degree<=4 is a root of a rational quadratic factor, so its isolating interval is tight; a wider interval
    # would mean the touch point is not representable and the graph is refused instead of drawn at a guessed location.
    for (left,right),multiplicity in root_intervals:
        if multiplicity>=2 and right-left>REPEATED_ROOT_MAX_ISOLATION_WIDTH:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_REPEATED_ROOT_IMPRECISE')
    critical=_real_root_rows(polynomial.diff())
    inflections=[row for row in _real_root_rows(polynomial.diff().diff()) if row[1]%2==1]
    groups=[]
    def add_feature(exact_x,role,multiplicity_key,multiplicity):
        feature_x=float(exact_x);feature_y=float(polynomial.eval(exact_x))
        if not all(math.isfinite(v) and abs(v)<=1e9 for v in (feature_x,feature_y)):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
        existing=next((row for row in groups if abs(row['x']-feature_x)<=1e-12*max(1,abs(feature_x)) and abs(row['y']-feature_y)<=1e-12*max(1,abs(feature_y))),None)
        if existing is None:
            existing={'x':feature_x,'y':feature_y,'roles':set(),'multiplicity':{'root':None,'derivative':None,'secondDerivative':None}}
            groups.append(existing)
        existing['roles'].add(role);existing['multiplicity'][multiplicity_key]=int(multiplicity)
    for exact_x,multiplicity in roots:add_feature(exact_x,'ROOT','root',multiplicity)
    for exact_x,multiplicity in critical:add_feature(exact_x,'STATIONARY_EXTREMUM' if multiplicity%2 else 'STATIONARY_INFLECTION','derivative',multiplicity)
    for exact_x,multiplicity in inflections:add_feature(exact_x,'INFLECTION','secondDerivative',multiplicity)
    role_order={'ROOT':0,'STATIONARY_EXTREMUM':1,'STATIONARY_INFLECTION':2,'INFLECTION':3}
    groups.sort(key=lambda row:(row['x'],row['y']))
    math_features=[{'id':f'feature-{index}','kind':'POLYNOMIAL_FEATURE','x':row['x'],'y':row['y'],'roles':sorted(row['roles'],key=lambda value:role_order[value]),'multiplicity':row['multiplicity']} for index,row in enumerate(groups,1)]
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_x=[];required_y=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[k],bool) or not isinstance(point[k],(int,float)) or not math.isfinite(point[k]) or abs(point[k])>1e6 for k in ('x','y')):
            raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);x_value=S.Rational(str(point['x']));expected=float(polynomial.eval(x_value))
        if abs(expected-float(point['y']))>1e-8:raise ValueError('REQUIRED_GRAPH_POINT_NOT_ON_CURVE')
        required_x.append(float(point['x']));required_y.append(float(point['y']))
    feature_x=[row['x'] for row in math_features]
    anchor_points=plan.get('overlayAnchors',[])
    coordinates=[0.0,*feature_x,*required_x,*[x for x,_ in anchor_points]]
    feature_extent=max(abs(value) for value in coordinates)
    leading=abs(float(coefficients[-1]))
    if not math.isfinite(leading) or leading<=0:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_LEADING_COEFFICIENT')
    scales=[]
    for index,coefficient in enumerate(coefficients[:-1]):
        if coefficient:
            ratio=abs(float(coefficient)/leading)
            scale=ratio**(1/(degree-index))
            if not math.isfinite(scale) or scale>1e6:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
            scales.append(scale)
    characteristic=max([1.0,*scales])
    radius=max(feature_extent*1.2,characteristic*1.1,1.0)
    # Keep the coordinate origin in frame. Quartic roots/critical points can
    # sit close to one tail boundary (for example x^4-x has its right root at
    # x=1); reserve common display-only room beyond the outer feature so unit
    # ticks remain distinct from both the frame edge and the curve.
    if degree==4 or anchor_points:
        tail_margin=max(.4,feature_extent*.25)
        lo=min(-radius,min(coordinates)-tail_margin)
        hi=max(radius,max(coordinates)+tail_margin)
    else:
        lo,hi=-radius,radius
    if not all(math.isfinite(v) and abs(v)<=1e6 for v in (lo,hi)):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
    def evaluate(value):
        result=float(polynomial.eval(S.Rational(str(value))))
        if not math.isfinite(result) or abs(result)>1e12:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
        return result
    values=[evaluate(lo),evaluate(hi),0.0,*[row['y'] for row in math_features],*required_y,*[y for _,y in anchor_points]]
    low,high=min(values),max(values);span=max(1.0,high-low,abs(low),abs(high));padding=.15*span
    ymin=min(0.0,low)-padding;ymax=max(0.0,high)+padding
    sign=1 if polynomial.LC()>0 else -1
    left_sign=sign if degree%2==0 else -sign
    end_directions={'left':'UP' if left_sign>0 else 'DOWN','right':'UP' if sign>0 else 'DOWN'}
    end_slope_directions={'left':'DOWN' if end_directions['left']=='UP' else 'UP','right':end_directions['right']}
    tail_features=[{'id':'tail-left','kind':'TAIL_DIRECTION','side':'LEFT','endpointX':lo,'direction':end_directions['left'],'slopeDirection':end_slope_directions['left']},{'id':'tail-right','kind':'TAIL_DIRECTION','side':'RIGHT','endpointX':hi,'direction':end_directions['right'],'slopeDirection':end_slope_directions['right']}]
    features=[*math_features,*tail_features]
    feature_policy={'schemaVersion':'POLYNOMIAL_CUBIC_QUARTIC_FEATURE_POLICY_v1','repeatedSourceRootPolicy':'EXACT_MULTIPLICITY','tangencyPolicy':'TOUCHES_AXIS_EVEN_CROSSES_ODD','minimumDistinctFeatureSeparationCssPx':1,'stationaryInflectionPolicy':'MERGE_ROLES_AT_SAME_POINT'}
    fitted={**plan,'domain':[lo,hi],'viewport':[lo,hi,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','overviewFeatures':features,'overviewFeaturePolicy':feature_policy,'overviewEndDirections':end_directions}
    return {'graphPlan':fitted,'policy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _fit_overview_family(plan):
    if 'regions' in plan and plan.get('family')!='piecewise-polynomial':raise ValueError('GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL')
    if 'applicationAxes' in plan and not (plan.get('family')=='polynomial' and isinstance(plan.get('sourceDomain'),dict) and plan['sourceDomain'].get('kind')=='INTERVAL'):raise ValueError('APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL')
    if plan.get('family')=='rational':return _fit_rational_overview(plan)
    if plan.get('family')=='sqrt-affine':return _fit_sqrt_affine_general_overview(plan) if _sqrt_affine_general_plan(plan) else _fit_sqrt_affine_overview(plan)
    if plan.get('family')=='absolute-value':return _fit_absolute_value_overview(plan)
    if plan.get('family')=='piecewise-affine':return _fit_piecewise_affine_overview(plan)
    if plan.get('family')=='exponential-affine':return _fit_exponential_base_overview(plan) if plan.get('base') is not None or plan.get('shiftX') is not None else _fit_exponential_affine_overview(plan)
    if plan.get('family')=='logarithmic-affine':return _fit_logarithmic_base_overview(plan) if plan.get('base') is not None else _fit_logarithmic_affine_overview(plan)
    if plan.get('family')=='exp-log-pair':return _fit_exp_log_pair_overview(plan)
    if plan.get('family')=='trigonometric':return _fit_trigonometric_overview(plan)
    if plan.get('family')=='piecewise-polynomial':return fit_piecewise_polynomial(plan)
    if plan.get('family')!='polynomial':raise ValueError('UNSUPPORTED_OVERVIEW_FAMILY')
    values=plan.get('coefficients')
    if not isinstance(values,list) or not 1<=len(values)<=5 or any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values):raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    try:c=[Fraction(v) for v in values]
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_FRAMING_COEFFICIENTS') from None
    while len(c)>1 and c[-1]==0:c.pop()
    if len(c) in (4,5):
        if 'applicationAxes' in plan:raise ValueError('APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL')
        return _fit_cubic_quartic(plan,c)
    if len(c)!=3:raise ValueError('UNSUPPORTED_OVERVIEW_DEGREE')
    constant,linear,a=c;h=-linear/(2*a);k=constant-linear*linear/(4*a)
    hf,kf,af=map(float,(h,k,a))
    if not all(math.isfinite(v) and abs(v)<=1e6 for v in (hf,kf,af)) or abs(af)<1e-9:raise ValueError('UNSUPPORTED_FRAMING_NUMERIC_SCOPE')
    natural=2/math.sqrt(abs(af))
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    for point in required:
        if set(point)!={'id','x','y'} or not all(isinstance(point[v],(int,float)) and math.isfinite(point[v]) and abs(point[v])<=1e6 for v in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        expected=af*(point['x']-hf)**2+kf
        if abs(expected-point['y'])>1e-8:raise ValueError('REQUIRED_GRAPH_POINT_NOT_ON_CURVE')
    # Points on an added straight line (graphPlan.linePoints, not necessarily on the curve) must be framed too.
    line_points=plan.get('linePoints',[])
    if not isinstance(line_points,list) or len(line_points)>4:raise ValueError('INVALID_LINE_POINTS')
    for point in line_points:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not all(isinstance(point[v],(int,float)) and not isinstance(point[v],bool) and math.isfinite(point[v]) and abs(point[v])<=1e6 for v in ('x','y')):raise ValueError('INVALID_LINE_POINT')
    source_domain=plan.get('sourceDomain')
    if isinstance(source_domain,dict) and source_domain.get('kind')=='INTERVAL':return _fit_quadratic_interval(plan,c,source_domain,required,line_points)
    if source_domain is not None and source_domain!={'kind':'ALL_REALS'}:raise ValueError('RESTRICTED_SOURCE_DOMAIN_NEEDS_CONTEXT_VIEW')
    if source_domain=={'kind':'ALL_REALS'}:return _fit_quadratic_equal_unit(plan,hf,kf,af,natural,required,line_points)
    # No sourceDomain: older frozen draw intervals are retained (legacy unequal frame). Never silently enlarge a
    # potentially source-restricted domain to make a prettier picture.
    lo,hi=plan['domain']
    if not lo<hf<hi or min(hf-lo,hi-hf)<natural:raise ValueError('OVERVIEW_DRAW_INTERVAL_TOO_NARROW_REVIEW_DOMAIN')
    if any(not lo<=p['x']<=hi for p in required):raise ValueError('REQUIRED_FEATURE_OUTSIDE_REVIEWED_DRAW_INTERVAL')
    anchors=plan.get('overlayAnchors',[])
    if anchors:
        lo=min(lo,min(x for x,_ in anchors)-.5);hi=max(hi,max(x for x,_ in anchors)+.5)
    radius=min(hf-lo,hi-hf)/1.15
    # The curve is drawn over [lo,hi], so its height there decides the frame (radius alone left the drawn ends above ymax).
    span=max(hf-lo,hi-hf)
    rise=max([abs(af)*span*span]+[1.15*abs(p['y']-kf) for p in required+line_points]+[1.15*abs(y-kf) for _,y in anchors])
    ymin=min(0,kf-.15*rise) if af>0 else min(0,kf-1.15*rise)
    ymax=max(0,kf+1.15*rise) if af>0 else max(0,kf+.15*rise)
    xpad=(hi-lo)*.1 if required or line_points else 0
    fitted={**plan,'domain':[lo,hi],'viewport':[lo-xpad,hi+xpad,ymin,ymax],'shapeIntent':'OVERVIEW'}
    return {'graphPlan':fitted,'policy':'QUADRATIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':{'vertex':[hf,kf],'opening':'UP' if af>0 else 'DOWN','naturalHalfSpan':natural},'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

# Quadratic graphs keep one scale on both axes (user direction 2026-10-22): the figure is the true shape, never squeezed to fill the canvas.
QUADRATIC_PLOT_WIDTH=448
QUADRATIC_PLOT_HEIGHT=(160,640)
EQUAL_UNIT_EDGE_PX=40
EQUAL_UNIT_MIN_CURVE_PX=48
EQUAL_UNIT_MIN_NATURAL_PX=24

def plot_height_limit(plan):
    """plotHeightLimit is set by composite-candidate-svg-v1 for panels of a stack; a single figure may be up to 640 high."""
    limit=plan.get('plotHeightLimit',QUADRATIC_PLOT_HEIGHT[1])
    if isinstance(limit,bool) or not isinstance(limit,(int,float)) or not 120<=limit<=QUADRATIC_PLOT_HEIGHT[1]:raise ValueError('INVALID_PLOT_HEIGHT_LIMIT')
    return float(limit)

AXIS_SQUEEZE_MIN_RATIO=.5

def equal_unit_frame(points,height_limit,ratio=1.0):
    """One scale for both axes (or y at ratio times the x scale). The points fill the 448-wide plot with 40 px clear at each edge unless that
    would be taller than the limit; then the plot is the limit high and the x range widens. Returns the viewport, the integer plot height and
    the x scale (px per unit); the y scale is ratio times it."""
    if ratio!=1.0:
        viewport,height,scale=equal_unit_frame([(x,y*ratio) for x,y in points],height_limit)
        return [viewport[0],viewport[1],viewport[2]/ratio,viewport[3]/ratio],height,scale
    xs=[p[0] for p in points];ys=[p[1] for p in points];xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    inner_w=QUADRATIC_PLOT_WIDTH-2*EQUAL_UNIT_EDGE_PX;inner_h=height_limit-2*EQUAL_UNIT_EDGE_PX
    scale=min(inner_w/xspan if xspan>0 else math.inf,inner_h/yspan if yspan>0 else math.inf)
    if not math.isfinite(scale) or scale<=0:raise ValueError('EQUAL_UNIT_FRAME_DEGENERATE')
    height=float(min(int(height_limit),math.ceil(max(QUADRATIC_PLOT_HEIGHT[0],yspan*scale+2*EQUAL_UNIT_EDGE_PX))))
    cx,cy=(min(xs)+max(xs))/2,(min(ys)+max(ys))/2;half_w=QUADRATIC_PLOT_WIDTH/scale/2;half_h=height/scale/2
    viewport=[cx-half_w,cx+half_w,cy-half_h,cy+half_h]
    if not all(math.isfinite(v) and abs(v)<=1e6 for v in viewport):raise ValueError('UNSUPPORTED_FRAMING_NUMERIC_SCOPE')
    return viewport,height,scale

def squeeze_ratio(points,height_limit):
    """The y/x scale ratio (at least 1/2) at which the points fill the plot width without passing the height limit: one scale when it fits."""
    xs=[p[0] for p in points];ys=[p[1] for p in points];xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    if xspan<=0 or yspan<=0:return 1.0
    fit=((height_limit-2*EQUAL_UNIT_EDGE_PX)/yspan)/((QUADRATIC_PLOT_WIDTH-2*EQUAL_UNIT_EDGE_PX)/xspan)
    return max(AXIS_SQUEEZE_MIN_RATIO,min(1.0,fit))

def axis_ratios(plan,points,height_limit):
    """One scale first; a squeeze (y at most halved) only after a failure: axisSqueeze (set by the runner after a layout failure) asks for it
    straight away, and a figure too narrow at one scale tries it next."""
    squeeze=plan.get('axisSqueeze',False)
    if squeeze not in (True,False):raise ValueError('INVALID_AXIS_SQUEEZE')
    ratio=squeeze_ratio(points,height_limit)
    return [ratio] if squeeze else [1.0]+([ratio] if ratio<1.0 else [])

def _fit_quadratic_equal_unit(plan,hf,kf,af,natural,required,line_points):
    """All reals: the vertex, the natural arms (half-span 2/sqrt|a|, rise 4), the key and line points and the origin, at one scale; the curve
    runs to just inside the top (or bottom) edge."""
    rise=4 if af>0 else -4
    points=[(0.0,0.0),(hf,kf),(hf-natural,kf+rise),(hf+natural,kf+rise)]+[(p['x'],p['y']) for p in required+line_points]+[(x,y) for x,y in plan.get('overlayAnchors',[])]
    limit=plot_height_limit(plan)
    for ratio in axis_ratios(plan,points,limit):
        viewport,height,scale=equal_unit_frame(points,limit,ratio)
        edge=viewport[3] if af>0 else viewport[2];dx=math.sqrt(.96*(edge-kf)/af)
        lo,hi=max(viewport[0],hf-dx),min(viewport[1],hf+dx)
        # Too narrow to read: the drawn curve under 48 px wide, or the vertex region (natural window) under 24 px.
        if (hi-lo)*scale>=EQUAL_UNIT_MIN_CURVE_PX and 2*natural*scale>=EQUAL_UNIT_MIN_NATURAL_PX:break
    else:raise ValueError('EQUAL_UNIT_PARABOLA_TOO_NARROW')
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1','equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}
    return {'graphPlan':fitted,'policy':'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':{'vertex':[hf,kf],'opening':'UP' if af>0 else 'DOWN','naturalHalfSpan':natural,'scalePxPerUnit':scale},'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

INTERVAL_STATES={'CLOSED','OPEN'}

def quadratic_source_interval(source_domain):
    """{kind:'INTERVAL',range:[lo,hi],states:[start,end]}: exact ends (numbers or rational strings); states CLOSED (default) or OPEN."""
    if set(source_domain)-{'kind','range','states'}:raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
    raw=source_domain.get('range');states=source_domain.get('states',['CLOSED','CLOSED'])
    if not isinstance(raw,list) or len(raw)!=2 or not isinstance(states,list) or len(states)!=2 or any(state not in INTERVAL_STATES for state in states):raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
    ends=[]
    for value in raw:
        if isinstance(value,bool) or not (isinstance(value,(int,float)) and math.isfinite(value) and abs(value)<=1e6 or isinstance(value,str) and re.fullmatch(r'-?\d+(?:/\d+)?',value)):raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
        try:ends.append(Fraction(str(value)))
        except (ValueError,ZeroDivisionError):raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL') from None
    if not ends[0]<ends[1]:raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
    return ends[0],ends[1],list(states)

# Application-problem axes (opt-in graphPlan.applicationAxes:true): a word problem whose axes measure different quantities (a count 0..50 and a
# profit 0..45000) gets its own scale on each axis, so ticks are the real values on each axis. Pure mathematical graphs keep one scale: the flag is
# accepted only for a quadratic on a restricted source interval (a word problem always restricts its variable).
APPLICATION_PLOT_HEIGHT=360

def application_axes_frame(points):
    """Separate scales on the two axes: the points fill the 448-wide plot with 40 px clear at each edge and the plot is APPLICATION_PLOT_HEIGHT
    high. Returns the viewport, the integer plot height, the x scale (px per x unit) and the y/x scale ratio."""
    xs=[p[0] for p in points];ys=[p[1] for p in points];xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    if xspan<=0 or yspan<=0:raise ValueError('APPLICATION_AXES_FRAME_DEGENERATE')
    height=APPLICATION_PLOT_HEIGHT
    sx=(QUADRATIC_PLOT_WIDTH-2*EQUAL_UNIT_EDGE_PX)/xspan;sy=(height-2*EQUAL_UNIT_EDGE_PX)/yspan
    viewport=[min(xs)-EQUAL_UNIT_EDGE_PX/sx,max(xs)+EQUAL_UNIT_EDGE_PX/sx,min(ys)-EQUAL_UNIT_EDGE_PX/sy,max(ys)+EQUAL_UNIT_EDGE_PX/sy]
    if not all(math.isfinite(v) and abs(v)<=1e9 for v in viewport) or not math.isfinite(sy/sx) or sy/sx<=0:raise ValueError('UNSUPPORTED_FRAMING_NUMERIC_SCOPE')
    return viewport,height,sx,sy/sx

def application_ticks_valid(values,lo,hi):
    """The author's tick values for one application axis: 2 to 8 distinct nonzero values in an arithmetic progression whose step is 1, 2 or 5 times a
    power of ten, every value a multiple of the step and inside the viewport."""
    try:ticks=sorted(float(Fraction(str(v))) for v in values)
    except (TypeError,ValueError,ZeroDivisionError):return False
    if not 2<=len(ticks)<=8 or any(abs(v)<1e-12 or not lo<=v<=hi for v in ticks):return False
    step=ticks[1]-ticks[0]
    if step<=0 or any(abs((b-a)-step)>1e-9*max(1,abs(step)) for a,b in zip(ticks,ticks[1:])):return False
    mantissa=step/10**math.floor(math.log10(step))
    if not any(abs(mantissa-m)<1e-9 for m in (1,2,5)):return False
    return all(abs(v/step-round(v/step))<1e-9 for v in ticks)

def _fit_quadratic_interval(plan,c,source_domain,required,line_points):
    """The curve only on the source interval, with its endpoint dots; the frame holds the interval, its values, the key points and the axes."""
    lo,hi,states=quadratic_source_interval(source_domain)
    def f(t):return c[0]+c[1]*t+c[2]*t*t
    for point in required:
        at=Fraction(str(point['x']))
        if not lo<=at<=hi:raise ValueError('REQUIRED_GRAPH_POINT_OUTSIDE_SOURCE_INTERVAL:'+point['id'])
        if at==lo and states[0]=='OPEN' or at==hi and states[1]=='OPEN':raise ValueError('REQUIRED_GRAPH_POINT_AT_OPEN_ENDPOINT:'+point['id'])
    h=-c[1]/(2*c[2])
    values=[f(lo),f(hi)]+([f(h)] if lo<h<hi else [])
    xs=[float(lo),float(hi)]+([float(h)] if lo<h<hi else [])
    points=[(0.0,0.0)]+list(zip(xs,[float(v) for v in values]))+[(p['x'],p['y']) for p in required+line_points]
    application=plan.get('applicationAxes')
    if not application:points=points+[(x,y) for x,y in plan.get('overlayAnchors',[])]
    if application not in (None,True):raise ValueError('INVALID_APPLICATION_AXES')
    if application:
        if plan.get('axisSqueeze') is not None or plan.get('plotCanvas') is not None:raise ValueError('INVALID_APPLICATION_AXES')
        viewport,height,scale,ratio=application_axes_frame(points)
        if float(hi-lo)*scale<EQUAL_UNIT_MIN_CURVE_PX:raise ValueError('APPLICATION_AXES_CURVE_TOO_NARROW')
        ticks=plan.get('axisTickValues')
        for axis,(lo_v,hi_v) in (('x',viewport[0:2]),('y',viewport[2:4])):
            if not isinstance(ticks,dict) or set(ticks)!={'x','y'} or not isinstance(ticks[axis],list) or not application_ticks_valid(ticks[axis],lo_v,hi_v):raise ValueError('APPLICATION_AXES_TICKS_INVALID:'+axis)
    else:
        limit=plot_height_limit(plan)
        for ratio in axis_ratios(plan,points,limit):
            viewport,height,scale=equal_unit_frame(points,limit,ratio)
            if float(hi-lo)*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
        else:raise ValueError('EQUAL_UNIT_CURVE_TOO_NARROW')
    features={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':str(lo),'y':str(f(lo)),'state':states[0]},{'side':'END','x':str(hi),'y':str(f(hi)),'state':states[1]}]}
    policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    fitted={**plan,'domain':[float(lo),float(hi)],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'POLYNOMIAL_INTERVAL_OVERVIEW_v1','intervalFeatures':features,'intervalFeaturePolicy':policy,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}
    return {'graphPlan':fitted,'policy':'POLYNOMIAL_INTERVAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

def _rational_coefficients(values,name):
    if not isinstance(values,list) or len(values)!=2 or any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values):
        raise ValueError('UNSUPPORTED_RATIONAL_'+name.upper()+'_GRAMMAR')
    try:coefficients=[Fraction(value) for value in values]
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_RATIONAL_'+name.upper()+'_COEFFICIENT') from None
    if coefficients[1]==0:raise ValueError('UNSUPPORTED_RATIONAL_'+name.upper()+'_DEGREE')
    return coefficients

def _fraction_text(value):
    return str(Fraction(value))

def _fit_rational_overview(plan):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:
        raise ValueError('RATIONAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or not all(isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v) for v in original_domain) or not original_domain[0]<original_domain[1]:
        raise ValueError('INVALID_RATIONAL_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or not all(isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v) for v in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:
        raise ValueError('INVALID_RATIONAL_VIEWPORT')
    numerator=_rational_coefficients(plan.get('numerator'),'numerator')
    denominator=_rational_coefficients(plan.get('denominator'),'denominator')
    pole_or_hole=-denominator[0]/denominator[1]
    numerator_root=-numerator[0]/numerator[1]
    horizontal=numerator[1]/denominator[1]
    is_hole=(numerator[0]+numerator[1]*pole_or_hole)==0
    if is_hole:
        singularity={'kind':'REMOVABLE_HOLE','x':_fraction_text(pole_or_hole),'y':_fraction_text(horizontal)}
        x_intercept=None
    else:
        singularity={'kind':'VERTICAL_POLE','x':_fraction_text(pole_or_hole)}
        x_intercept=_fraction_text(numerator_root)
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_x=[];required_y=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[k],bool) or not isinstance(point[k],(int,float)) or not math.isfinite(point[k]) or abs(point[k])>1e6 for k in ('x','y')):
            raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);exact_x=Fraction(str(point['x']))
        exact_denominator=denominator[0]+denominator[1]*exact_x
        if exact_denominator==0:raise ValueError('REQUIRED_GRAPH_POINT_OUTSIDE_RATIONAL_DOMAIN')
        expected=(numerator[0]+numerator[1]*exact_x)/exact_denominator
        if abs(float(expected)-float(point['y']))>1e-8:raise ValueError('REQUIRED_GRAPH_POINT_NOT_ON_CURVE')
        required_x.append(float(exact_x));required_y.append(float(point['y']))
    singularity_x=float(pole_or_hole);root_x=float(numerator_root)
    if any(not math.isfinite(value) or abs(value)>1e6 for value in (singularity_x,root_x,float(horizontal))):raise ValueError('UNSUPPORTED_RATIONAL_NUMERIC_SCOPE')
    # Keep the singularity, intercept and unit ticks in one readable local
    # overview. A very wide all-real display compresses the y-axis tick column
    # against both the nearby branch and the pole cue without adding useful
    # information about the source function.
    anchors=plan.get('overlayAnchors',[])
    radius=max(6.0,abs(singularity_x)*1.25+.5,abs(root_x-singularity_x)*1.2+1.0,*[abs(px-singularity_x)*1.2 for px in required_x],*[abs(ax-singularity_x)*1.2 for ax,_ in anchors])
    lo,hi=singularity_x-radius,singularity_x+radius
    def evaluate_exact(x_value):
        exact_x=Fraction(str(x_value));den=numerator[0]*0+denominator[0]+denominator[1]*exact_x
        if den==0:raise ValueError('RATIONAL_FRAME_ENDPOINT_IS_SINGULAR')
        return float((numerator[0]+numerator[1]*exact_x)/den)
    endpoint_values=[evaluate_exact(lo),evaluate_exact(hi)]
    key_values=[0.0,float(horizontal),*required_y,*[y for _,y in anchors]]
    if x_intercept is not None:key_values.append(0.0)
    if is_hole:key_values.append(float(singularity['y']))
    low=min([*endpoint_values,*key_values]);high=max([*endpoint_values,*key_values])
    span=max(1.0,high-low,abs(low),abs(high));padding=.35*span
    ymin=min(0.0,low)-padding;ymax=max(0.0,high)+padding
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,ymin,ymax)):raise ValueError('UNSUPPORTED_RATIONAL_NUMERIC_SCOPE')
    features={'schemaVersion':'RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1','singularity':singularity,'horizontalAsymptoteY':_fraction_text(horizontal),'xIntercept':x_intercept}
    policy={'schemaVersion':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_POLICY_v1','sourceDomain':'ALL_REALS_WITH_DENOMINATOR_EXCLUSION','degreeGrammar':'LINEAR_OVER_LINEAR','singularityPolicy':'ONE_SIMPLE_REAL_POLE_OR_ONE_REMOVABLE_HOLE','horizontalAsymptotePolicy':'EXACT_LEADING_COEFFICIENT_RATIO','minimumFeatureSeparationCssPx':1,'holeMarkerRadiusIntrinsicPx':4,'minimumHoleMarkerDiameterCssPx':4.5}
    fitted={**plan,'domain':[lo,hi],'viewport':[lo,hi,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1','rationalFeatures':features,'rationalFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _sqrt_coefficients(values):
    if not isinstance(values,list) or len(values)!=2 or any(not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in values):
        raise ValueError('UNSUPPORTED_SQRT_AFFINE_GRAMMAR')
    try:constant,slope=(Fraction(value) for value in values)
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_SQRT_AFFINE_COEFFICIENT') from None
    if slope<=0:raise ValueError('UNSUPPORTED_SQRT_AFFINE_SLOPE')
    return constant,slope

def _fit_sqrt_affine_overview(plan):
    constant,slope=_sqrt_coefficients(plan.get('radicand'))
    boundary=-constant/slope
    source_domain=plan.get('sourceDomain')
    if source_domain=={'kind':'NATURAL_SQRT_AFFINE'}:
        mode='NATURAL_SQRT_AFFINE';source_interval=None;source_interval_exact=None
    elif isinstance(source_domain,dict) and set(source_domain)=={'kind','range'} and source_domain.get('kind')=='CLOSED_INTERVAL':
        source_interval=source_domain.get('range')
        if not isinstance(source_interval,list) or len(source_interval)!=2 or any(not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in source_interval):
            raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        try:source_interval_exact=[Fraction(value) for value in source_interval]
        except (ValueError,ZeroDivisionError):raise ValueError('INVALID_SQRT_SOURCE_INTERVAL') from None
        if not source_interval_exact[0]<source_interval_exact[1]:raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        if source_interval_exact[0]<boundary:raise ValueError('SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY')
        source_interval=[float(value) for value in source_interval_exact];mode='CLOSED_INTERVAL'
    else:raise ValueError('SQRT_SOURCE_DOMAIN_UNSUPPORTED')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_domain) or not original_domain[0]<original_domain[1]:raise ValueError('INVALID_SQRT_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:raise ValueError('INVALID_SQRT_VIEWPORT')
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_points=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[key],bool) or not isinstance(point[key],(int,float)) or not math.isfinite(point[key]) or abs(point[key])>1e6 for key in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);exact_x=Fraction(str(point['x']));radicand_value=constant+slope*exact_x
        if radicand_value<0 or point['y']<0 or abs(float(point['y'])**2-float(radicand_value))>1e-8:raise ValueError('REQUIRED_SQRT_POINT_NOT_ON_CURVE')
        required_points.append({'id':point['id'],'x':float(exact_x),'y':float(point['y'])})
    boundary_x=float(boundary)
    if not math.isfinite(boundary_x) or abs(boundary_x)>1e6:raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    if mode=='NATURAL_SQRT_AFFINE':
        span=max(4.0,4.0/math.sqrt(float(slope)),abs(boundary_x)*.25+4.0,*[max(0.0,point['x']-boundary_x)*1.2 for point in required_points])
        lo=boundary_x;hi=max(float(original_domain[1]),boundary_x+span,*[point['x']+span*.1 for point in required_points])
    else:
        lo,hi=source_interval
        if original_domain!=source_interval:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_SOURCE_INTERVAL')
        if any(not lo<=point['x']<=hi for point in required_points):raise ValueError('REQUIRED_SQRT_POINT_OUTSIDE_SOURCE_INTERVAL')
    if lo<boundary_x or not lo<hi:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    def root_y_exact(x_value):
        value=constant+slope*x_value
        if value<0:raise ValueError('SQRT_ENDPOINT_BELOW_NATURAL_BOUNDARY')
        return math.sqrt(float(value))
    def root_y(x_value):
        return root_y_exact(Fraction(str(x_value)))
    if mode=='NATURAL_SQRT_AFFINE':
        endpoints=[{'x':_fraction_text(boundary),'y':0.0,'state':'CLOSED','source':'NATURAL_RADICAND_BOUNDARY'}]
    else:
        endpoints=[{'x':_fraction_text(source_interval_exact[0]),'y':root_y_exact(source_interval_exact[0]),'state':'CLOSED','source':'SOURCE_INTERVAL_START'},{'x':_fraction_text(source_interval_exact[1]),'y':root_y_exact(source_interval_exact[1]),'state':'CLOSED','source':'SOURCE_INTERVAL_END'}]
    endpoint_y=[endpoint['y'] for endpoint in endpoints]
    required_y=[point['y'] for point in required_points]
    hi_y=root_y(hi)
    low=min([0.0,hi_y,*endpoint_y,*required_y]);high=max([0.0,hi_y,*endpoint_y,*required_y])
    yspan=max(1.0,high-low,abs(low),abs(high));ypad=.15*yspan
    xspan=max(1.0,hi-lo);left_margin=.1*xspan;right_margin=0 if mode=='NATURAL_SQRT_AFFINE' else .1*xspan
    xmin=lo-left_margin;xmax=hi+right_margin
    ymin=min(0.0,low)-ypad;ymax=max(0.0,high)+ypad
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,xmin,xmax,ymin,ymax)):raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    features={'schemaVersion':'SQRT_AFFINE_FEATURES_v1','radicandBoundaryX':_fraction_text(boundary),'sourceEndpoints':endpoints,'rightTailDirection':'UP'}
    policy={'schemaVersion':'SQRT_AFFINE_FEATURE_POLICY_v1','sourceDomainMode':mode,'boundaryPolicy':'NATURAL_NONNEGATIVE_RADICAND','endpointState':'CLOSED','rightTailDirection':'UP','endpointMarkerRadiusIntrinsicPx':4,'minimumEndpointMarkerDiameterCssPx':3,'minimumEndpointToTailSpanCssPx':48}
    fitted={**plan,'domain':[lo,hi],'viewport':[xmin,xmax,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1','sqrtFeatures':features,'sqrtFeaturePolicy':policy,'requiredPoints':required_points}
    return {'graphPlan':fitted,'policy':'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

# ---- General square-root functions y = s*k*sqrt(a(x-p)) + q (sqrt-affine family, GENERAL policy) -------------
# The plan keeps the affine radicand [constant, x coefficient] (the coefficient may now be negative, so the domain is
# x <= p) and adds three optional exact fields: amplitude k (> 0), sign s (+1 or -1) and offset q. Every coefficient is
# an exact rational or p+q*sqrt(r) string. The starting point is (p, q); the branch opens to the right of p when the
# radicand slope is positive and to the left when it is negative.
def _sqrt_affine_general_plan(plan):
    if plan.get('amplitude') is not None or plan.get('sign') is not None or plan.get('offset') is not None:return True
    if plan.get('domainRangeLabels') is not None:return True
    radicand=plan.get('radicand')
    if isinstance(radicand,list) and len(radicand)==2:
        if any(isinstance(value,str) and 'sqrt' in value for value in radicand):return True
        try:
            constant=pp_surd(radicand[0],'UNSUPPORTED_SQRT_AFFINE_GRAMMAR');slope=pp_surd(radicand[1],'UNSUPPORTED_SQRT_AFFINE_GRAMMAR')
        except (ValueError,TypeError):return False
        return slope<0 or not constant.is_Rational or not slope.is_Rational
    return False

def _sqrt_general_surd(value,code):
    try:return pp_surd(value,code)
    except ValueError as error:
        if 'IRRATIONAL_FORM' in str(error):raise ValueError('SQRT_AFFINE_IRRATIONAL_FORM_UNSUPPORTED') from None
        raise

def _sqrt_affine_general_fields(plan):
    radicand=plan.get('radicand')
    if not isinstance(radicand,list) or len(radicand)!=2:
        raise ValueError('UNSUPPORTED_SQRT_AFFINE_GRAMMAR')
    constant=_sqrt_general_surd(radicand[0],'INVALID_SQRT_AFFINE_COEFFICIENT')
    slope=_sqrt_general_surd(radicand[1],'INVALID_SQRT_AFFINE_COEFFICIENT')
    if slope==0:raise ValueError('UNSUPPORTED_SQRT_AFFINE_SLOPE')
    amplitude=_sqrt_general_surd(plan.get('amplitude','1'),'INVALID_SQRT_AMPLITUDE')
    if amplitude.is_real is False or amplitude<=0:raise ValueError('SQRT_AMPLITUDE_MUST_BE_POSITIVE')
    sign=plan.get('sign',1)
    if isinstance(sign,bool) or sign not in (1,-1):raise ValueError('INVALID_SQRT_SIGN')
    offset=_sqrt_general_surd(plan.get('offset','0'),'INVALID_SQRT_OFFSET')
    scale=S.Integer(int(sign))*amplitude
    boundary=-constant/slope
    if boundary.is_real is False:raise ValueError('UNSUPPORTED_SQRT_AFFINE_COEFFICIENT')
    return constant,slope,amplitude,int(sign),offset,scale,boundary

def _sqrt_general_point_on_curve(constant,slope,offset,scale,point):
    try:x_exact=S.Rational(str(point.get('x')))
    except (ValueError,TypeError):x_exact=S.Float(str(point.get('x')),40)
    try:y_exact=S.Rational(str(point.get('y')))
    except (ValueError,TypeError):y_exact=S.Float(str(point.get('y')),40)
    radicand_value=constant+slope*x_exact
    if radicand_value.is_real is False or radicand_value<0:return False
    root_term=(y_exact-offset)/scale
    if root_term.is_real is False or root_term<0:return False
    return abs(S.N(root_term*root_term-radicand_value,40))<S.Float('1e-25',40)

def _fit_sqrt_affine_general_overview(plan):
    constant,slope,amplitude,sign,offset,scale,boundary=_sqrt_affine_general_fields(plan)
    right=slope>0
    boundary_f=float(boundary);offset_f=float(offset)
    source_domain=plan.get('sourceDomain')
    if source_domain=={'kind':'NATURAL_SQRT_AFFINE'}:
        mode='NATURAL_SQRT_AFFINE';source_interval_exact=None
    elif isinstance(source_domain,dict) and set(source_domain)=={'kind','range'} and source_domain.get('kind')=='CLOSED_INTERVAL':
        raw=source_domain.get('range')
        if not isinstance(raw,list) or len(raw)!=2:raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        source_interval_exact=[_pp_rational(value,'INVALID_SQRT_SOURCE_INTERVAL') for value in raw]
        if not source_interval_exact[0]<source_interval_exact[1]:raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        if right and source_interval_exact[0]<boundary:raise ValueError('SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY')
        if not right and source_interval_exact[1]>boundary:raise ValueError('SQRT_SOURCE_INTERVAL_BEYOND_NATURAL_BOUNDARY')
        mode='CLOSED_INTERVAL'
    else:raise ValueError('SQRT_SOURCE_DOMAIN_UNSUPPORTED')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_domain) or not original_domain[0]<original_domain[1]:raise ValueError('INVALID_SQRT_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:raise ValueError('INVALID_SQRT_VIEWPORT')
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_points=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[key],bool) or not isinstance(point[key],(int,float)) or not math.isfinite(point[key]) or abs(point[key])>1e6 for key in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        if not _sqrt_general_point_on_curve(constant,slope,offset,scale,point):raise ValueError('REQUIRED_SQRT_POINT_NOT_ON_CURVE')
        ids.add(point['id']);required_points.append({'id':point['id'],'x':float(point['x']),'y':float(point['y'])})
    if not math.isfinite(boundary_f) or abs(boundary_f)>1e6:raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    span=max(4.0,4.0/math.sqrt(abs(float(slope))),abs(boundary_f)*.25+4.0,*[max(0.0,abs(point['x']-boundary_f))*.25+2.0 for point in required_points])
    if mode=='NATURAL_SQRT_AFFINE':
        if right:
            lo=boundary_f
            hi=max(float(original_domain[1]),boundary_f+span,*[point['x']+span*.25 for point in required_points])
        else:
            hi=boundary_f
            lo=min(float(original_domain[0]),boundary_f-span,*[point['x']-span*.25 for point in required_points])
    else:
        lo,hi=(float(value) for value in source_interval_exact)
        if original_domain!=[lo,hi]:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_SOURCE_INTERVAL')
        if any(not lo<=point['x']<=hi for point in required_points):raise ValueError('REQUIRED_SQRT_POINT_OUTSIDE_SOURCE_INTERVAL')
    if right and lo<boundary_f:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    if not right and hi>boundary_f:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    if not lo<hi:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    def curve_y_exact(x_text):
        radicand_value=constant+slope*S.Rational(x_text)
        if radicand_value<0:raise ValueError('SQRT_ENDPOINT_BELOW_NATURAL_BOUNDARY')
        return offset+scale*S.sqrt(radicand_value)
    if mode=='NATURAL_SQRT_AFFINE':
        endpoints=[{'x':pp_surd_text(boundary),'y':float(offset),'state':'CLOSED','source':'NATURAL_RADICAND_BOUNDARY'}]
    else:
        endpoints=[]
        for value,source_name in ((source_interval_exact[0],'SOURCE_INTERVAL_START'),(source_interval_exact[1],'SOURCE_INTERVAL_END')):
            endpoints.append({'x':str(value),'y':float(curve_y_exact(str(value))),'state':'CLOSED','source':source_name})
    tail_x=hi if right else lo
    try:tail_exact=S.Rational(str(tail_x))
    except (ValueError,TypeError):tail_exact=S.Float(str(tail_x),40)
    tail_value=float(offset+scale*S.sqrt(constant+slope*tail_exact))
    endpoint_y=[endpoint['y'] for endpoint in endpoints]
    required_y=[point['y'] for point in required_points]
    low=min([offset_f,tail_value,*endpoint_y,*required_y]);high=max([offset_f,tail_value,*endpoint_y,*required_y])
    yspan=max(1.0,high-low,abs(high-offset_f));ypad=.15*yspan
    xspan=max(1.0,hi-lo)
    xmin=lo-.1*xspan if right else lo
    xmax=hi if right else hi+.1*xspan
    ymin=low-ypad;ymax=high+ypad
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,xmin,xmax,ymin,ymax)):raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    tail_direction='UP' if scale>0 else 'DOWN'
    features={'schemaVersion':'SQRT_AFFINE_GENERAL_FEATURES_v1','endpoint':{'x':pp_surd_text(boundary),'y':pp_surd_text(offset)},'radicandBoundaryX':pp_surd_text(boundary),'branchDirection':'RIGHT' if right else 'LEFT','tailDirection':tail_direction,'rangeDirection':'ABOVE' if scale>0 else 'BELOW','sourceEndpoints':endpoints}
    policy={'schemaVersion':'SQRT_AFFINE_GENERAL_FEATURE_POLICY_v1','sourceDomainMode':mode,'boundaryPolicy':'NATURAL_NONNEGATIVE_RADICAND','endpointState':'CLOSED','branchDirection':features['branchDirection'],'tailDirection':tail_direction,'rangeDirection':features['rangeDirection'],'endpointMarkerRadiusIntrinsicPx':4,'minimumEndpointMarkerDiameterCssPx':3,'minimumEndpointToTailSpanCssPx':48}
    fitted={**plan,'domain':[lo,hi],'viewport':[xmin,xmax,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'SQRT_AFFINE_GENERAL_OVERVIEW_v1','sqrtFeatures':features,'sqrtFeaturePolicy':policy,'requiredPoints':required_points}
    return {'graphPlan':fitted,'policy':'SQRT_AFFINE_GENERAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _fit_absolute_value_overview(plan):
    values=plan.get('coefficients')
    if not isinstance(values,list) or len(values)!=4 or any(not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in values):raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_GRAMMAR')
    try:b,a,scale,offset=(Fraction(value) for value in values)
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_ABSOLUTE_VALUE_COEFFICIENT') from None
    if a==0:raise ValueError('ABSOLUTE_VALUE_NONZERO_INNER_SLOPE_REQUIRED')
    if scale==0:raise ValueError('ABSOLUTE_VALUE_NONZERO_OUTER_SCALE_REQUIRED')
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('ABSOLUTE_VALUE_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in original_domain) or not original_domain[0]<original_domain[1]:raise ValueError('INVALID_ABSOLUTE_VALUE_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:raise ValueError('INVALID_ABSOLUTE_VALUE_VIEWPORT')
    corner=-b/a
    def exact_y(x_value):return scale*abs(a*x_value+b)+offset
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_points=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[key],bool) or not isinstance(point[key],(int,float)) or not math.isfinite(point[key]) or abs(point[key])>1e6 for key in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);exact_x=Fraction(str(point['x']));expected=exact_y(exact_x)
        if abs(float(expected)-point['y'])>1e-8:raise ValueError('REQUIRED_ABSOLUTE_VALUE_POINT_NOT_ON_CURVE')
        required_points.append({'id':point['id'],'x':float(exact_x),'y':float(expected)})
    span=max(4.0,abs(float(original_domain[0])-float(corner)),abs(float(original_domain[1])-float(corner)),4.0/float(abs(a)),*[abs(point['x']-float(corner))*1.2 for point in required_points])
    if not math.isfinite(span) or span<=0 or span>1e6:raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_NUMERIC_SCOPE')
    lo=min([float(corner)-span,*[point['x']-span*.1 for point in required_points]]);hi=max([float(corner)+span,*[point['x']+span*.1 for point in required_points]])
    left_y=float(exact_y(Fraction(str(lo))));right_y=float(exact_y(Fraction(str(hi))));corner_y=float(offset);required_y=[point['y'] for point in required_points]
    low=min(0.0,left_y,right_y,corner_y,*required_y);high=max(0.0,left_y,right_y,corner_y,*required_y);ypad=.18*max(1.0,high-low,abs(low),abs(high))
    xpad=.1*(hi-lo);xmin=lo-xpad;xmax=hi+xpad;ymin=min(0.0,low)-ypad;ymax=max(0.0,high)+ypad
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,xmin,xmax,ymin,ymax)):raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_NUMERIC_SCOPE')
    threshold=-offset/scale
    if threshold<0:x_intercepts=[]
    elif threshold==0:x_intercepts=[_fraction_text(corner)]
    else:
        delta=threshold/abs(a);x_intercepts=sorted({_fraction_text(corner-delta),_fraction_text(corner+delta)},key=Fraction)
    direction='UP' if scale>0 else 'DOWN'
    features={'schemaVersion':'ABSOLUTE_VALUE_FEATURES_v1','corner':{'x':_fraction_text(corner),'y':_fraction_text(offset),'state':'CLOSED'},'xIntercepts':x_intercepts,'leftTailDirection':direction,'rightTailDirection':direction,'leftArmSlope':_fraction_text(-scale*abs(a)),'rightArmSlope':_fraction_text(scale*abs(a))}
    policy={'schemaVersion':'ABSOLUTE_VALUE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','grammar':'K_ABS_AX_PLUS_B_PLUS_C','cornerMarkerRadiusIntrinsicPx':4,'minimumCornerMarkerDiameterCssPx':3,'minimumArmSpanCssPx':50,'minimumArmRiseCssPx':24}
    fitted={**plan,'domain':[lo,hi],'viewport':[xmin,xmax,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1','absoluteFeatures':features,'absoluteFeaturePolicy':policy,'requiredPoints':required_points}
    return {'graphPlan':fitted,'policy':'ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _piecewise_fraction(value,code):
    if not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'(?:0|-?[1-9]\d*)(?:/[1-9]\d*)?',value):raise ValueError(code)
    try:parsed=Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None
    if str(parsed)!=value:raise ValueError(code)
    return parsed

def _fit_piecewise_affine_overview(plan):
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or set(source)!={'kind','range'} or source.get('kind')!='CLOSED_INTERVAL' or not isinstance(source.get('range'),list) or len(source['range'])!=2:
        raise ValueError('PIECEWISE_SOURCE_DOMAIN_REQUIRES_CLOSED_INTERVAL')
    lo_exact,hi_exact=(_piecewise_fraction(value,'INVALID_PIECEWISE_SOURCE_ENDPOINT') for value in source['range'])
    if not lo_exact<hi_exact:raise ValueError('INVALID_PIECEWISE_SOURCE_INTERVAL')
    numeric_domain=plan.get('domain')
    if not isinstance(numeric_domain,list) or len(numeric_domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in numeric_domain) or numeric_domain!=[float(lo_exact),float(hi_exact)]:
        raise ValueError('PIECEWISE_DRAW_DOMAIN_MUST_EQUAL_SOURCE_INTERVAL')
    original_viewport=plan.get('viewport')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:
        raise ValueError('INVALID_PIECEWISE_VIEWPORT')
    piecewise=plan.get('piecewise')
    if not isinstance(piecewise,dict) or set(piecewise)!={'breakX','owner','left','right'} or piecewise.get('owner') not in {'LEFT','RIGHT'}:
        raise ValueError('INVALID_PIECEWISE_GRAMMAR')
    break_exact=_piecewise_fraction(piecewise.get('breakX'),'INVALID_PIECEWISE_BREAKPOINT')
    if not lo_exact<break_exact<hi_exact:raise ValueError('PIECEWISE_BREAKPOINT_OUTSIDE_SOURCE_INTERIOR')
    branches={}
    for side in ('left','right'):
        raw=piecewise.get(side)
        if not isinstance(raw,list) or len(raw)!=2:raise ValueError('INVALID_PIECEWISE_'+side.upper()+'_BRANCH')
        branches[side]=[_piecewise_fraction(value,'INVALID_PIECEWISE_'+side.upper()+'_COEFFICIENT') for value in raw]
    left_m,left_c=branches['left'];right_m,right_c=branches['right']
    left_value=left_m*break_exact+left_c;right_value=right_m*break_exact+right_c
    left_start=left_m*lo_exact+left_c;right_end=right_m*hi_exact+right_c
    owner_value=left_value if piecewise['owner']=='LEFT' else right_value
    continuous=left_value==right_value
    markers=[{'id':'source-start','kind':'SOURCE_ENDPOINT','x':str(lo_exact),'y':str(left_start),'state':'CLOSED','owner':'LEFT'},
             {'id':'source-end','kind':'SOURCE_ENDPOINT','x':str(hi_exact),'y':str(right_end),'state':'CLOSED','owner':'RIGHT'}]
    if continuous:
        markers.append({'id':'breakpoint-closed','kind':'BREAKPOINT','x':str(break_exact),'y':str(owner_value),'state':'CLOSED','owner':piecewise['owner']})
    else:
        non_owner='RIGHT' if piecewise['owner']=='LEFT' else 'LEFT'
        markers.extend([
            {'id':'breakpoint-owner-closed','kind':'BREAKPOINT','x':str(break_exact),'y':str(owner_value),'state':'CLOSED','owner':piecewise['owner']},
            {'id':'breakpoint-limit-open','kind':'BREAKPOINT','x':str(break_exact),'y':str(right_value if non_owner=='RIGHT' else left_value),'state':'OPEN','owner':non_owner}
        ])
    endpoint_values=[float(left_start),float(right_end),float(left_value),float(right_value)]
    low=min(0.0,*endpoint_values);high=max(0.0,*endpoint_values)
    ypad=.15*max(1.0,high-low,abs(low),abs(high))
    xspan=float(hi_exact-lo_exact);xpad=.04*xspan
    viewport=[float(lo_exact)-xpad,float(hi_exact)+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in viewport):raise ValueError('UNSUPPORTED_PIECEWISE_NUMERIC_SCOPE')
    feature_policy={'schemaVersion':'PIECEWISE_AFFINE_FEATURE_POLICY_v1','sourceDomainMode':'CLOSED_INTERVAL','breakpointOwnership':piecewise['owner'],'outerEndpointState':'CLOSED','jumpPolicy':'OWNER_CLOSED_OTHER_LIMIT_OPEN','continuousJoinPolicy':'ONE_CLOSED_MARKER','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3,'minimumBranchSpanCssPx':32}
    features={'schemaVersion':'PIECEWISE_AFFINE_FEATURES_v1','sourceInterval':{'lo':str(lo_exact),'hi':str(hi_exact),'startState':'CLOSED','endState':'CLOSED'},'breakpoint':{'x':str(break_exact),'owner':piecewise['owner'],'leftLimitY':str(left_value),'rightLimitY':str(right_value),'valueY':str(owner_value),'continuity':'CONTINUOUS' if continuous else 'JUMP'},'markers':markers}
    fitted={**plan,'domain':[float(lo_exact),float(hi_exact)],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'PIECEWISE_AFFINE_TWO_BRANCH_OVERVIEW_v1','piecewiseFeatures':features,'piecewiseFeaturePolicy':feature_policy}
    return {'graphPlan':fitted,'policy':'PIECEWISE_AFFINE_TWO_BRANCH_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':numeric_domain,'viewport':original_viewport}}

def _exp_log_coefficients(values,arity,code):
    if not isinstance(values,list) or len(values)!=arity:raise ValueError(code+'_GRAMMAR_UNSUPPORTED')
    parsed=[_piecewise_fraction(value,code+'_COEFFICIENT_INVALID') for value in values]
    return parsed

def _valid_exp_log_display(plan,code):
    domain=plan.get('domain');viewport=plan.get('viewport')
    if not isinstance(domain,list) or len(domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in domain) or not domain[0]<domain[1]:raise ValueError('INVALID_'+code+'_DRAW_INTERVAL')
    if not isinstance(viewport,list) or len(viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in viewport) or not viewport[0]<viewport[1] or not viewport[2]<viewport[3]:raise ValueError('INVALID_'+code+'_VIEWPORT')

def exp_log_base(value,code):
    """The exact base of a base-a exponential/logarithm: a positive integer, a reduced fraction of positive integers, or sqrt(n) with n a
    square-free integer > 1. None means the natural base e. Symbolic, nested, decimal and non-positive bases are refused."""
    if value is None:return None
    if not isinstance(value,str) or len(value)>32:raise ValueError(code+'_BASE_GRAMMAR_REQUIRED')
    text=value.strip()
    if re.fullmatch(r'-?\d+',text):
        parsed=Fraction(int(text));kind='INTEGER'
    elif re.fullmatch(r'-?\d+/[1-9]\d*',text):
        parsed=Fraction(text);kind='RATIONAL'
    elif re.fullmatch(r'sqrt\([1-9]\d*\)',text):
        n=int(text[5:-1]);root=math.isqrt(n)
        if root*root==n or any(n%(prime*prime)==0 for prime in range(2,root+1)):raise ValueError(code+'_BASE_RADICAL_NOT_SQUARE_FREE')
        parsed=None;kind='RADICAL'
    else:raise ValueError(code+'_BASE_GRAMMAR_REQUIRED')
    if kind=='RATIONAL' and parsed.denominator==1:kind='INTEGER'
    if kind!='RADICAL' and (parsed<=0 or parsed==1):raise ValueError(code+'_BASE_OUT_OF_RANGE')
    exact=S.Integer(int(text)) if kind=='INTEGER' else S.Rational(parsed.numerator,parsed.denominator) if kind=='RATIONAL' else S.sqrt(int(text[5:-1]))
    greater=kind=='RADICAL' or parsed>1
    return {'text':str(int(parsed)) if kind=='INTEGER' else str(parsed) if kind=='RATIONAL' else 'sqrt('+text[5:-1]+')','kind':kind,'exact':exact,'greaterThanOne':greater,'float':float(exact.evalf(30))}

def natural_exp_log_base():
    """The natural base e represented in the base features (used only when a shift is given without an explicit base)."""
    return {'text':'e','kind':'NATURAL','exact':S.E,'greaterThanOne':True,'float':math.e}

def exp_log_shift(value,code):
    if value is None:return Fraction(0),'0'
    parsed=_piecewise_fraction(value,code)
    return parsed,_fraction_text(parsed)

def _exp_log_base_features(base):
    return {'base':base['text'],'baseKind':base['kind'],'baseGreaterThanOne':base['greaterThanOne']}

def _fit_exponential_base_overview(plan):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    _valid_exp_log_display(plan,'EXPONENTIAL')
    base=exp_log_base(plan.get('base'),'EXPONENTIAL') or natural_exp_log_base()
    a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'EXPONENTIAL')
    shift,shift_text=exp_log_shift(plan.get('shiftX'),'EXPONENTIAL_SHIFT_INVALID')
    if a==0 or k==0:raise ValueError('EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED')
    rate=abs(float(k)*math.log(base['float']))
    if not math.isfinite(rate) or rate<=0 or rate>1e6:raise ValueError('EXPONENTIAL_BASE_RATE_INVALID')
    radius=3/rate;lo=float(shift)-radius;hi=float(shift)+radius
    def evaluate(value):
        try:result=float(a)*(base['float']**(float(k)*(value-float(shift))))+float(c)
        except OverflowError:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE') from None
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE')
        return result
    endpoint_values=[evaluate(lo),evaluate(hi)];reference_y=float(a+c);low=min(float(c),reference_y,*endpoint_values);high=max(float(c),reference_y,*endpoint_values);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    growth_positive=(k>0)==base['greaterThanOne']
    features={'schemaVersion':'EXPONENTIAL_BASE_FEATURES_v1',**_exp_log_base_features(base),'shiftX':shift_text,'referencePoint':{'x':_fraction_text(shift),'y':_fraction_text(a+c)},'horizontalAsymptote':{'y':_fraction_text(c),'side':'LEFT' if growth_positive else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if (a>0)==growth_positive else 'DECREASING','growthSide':'RIGHT' if growth_positive else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
    policy={'schemaVersion':'EXPONENTIAL_BASE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','referenceArgument':'EXPONENT_ZERO','asymptotePolicy':'EXACT_VERTICAL_SHIFT','basePolicy':'POSITIVE_BASE_NOT_ONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumAsymptoteSeparationCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'base':base['text'],'shiftX':shift_text,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'EXPONENTIAL_BASE_OVERVIEW_v1','exponentialFeatures':features,'exponentialFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'EXPONENTIAL_BASE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _fit_logarithmic_base_overview(plan):
    if plan.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
    _valid_exp_log_display(plan,'LOGARITHMIC')
    base=exp_log_base(plan.get('base'),'LOGARITHMIC') or natural_exp_log_base()
    a,k,b,c=_exp_log_coefficients(plan.get('coefficients'),4,'LOGARITHMIC')
    if a==0 or k==0:raise ValueError('LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    root=-b/k;reference=(1-b)/k;root_f=float(root);reference_f=float(reference);rate=abs(float(k));epsilon=.125/rate
    if k>0:lo=root_f+epsilon;hi=reference_f+3/rate
    else:lo=reference_f-3/rate;hi=root_f-epsilon
    if not lo<hi:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_INVALID')
    log_base=math.log(base['float'])
    def evaluate(value):
        argument=float(k)*value+float(b)
        if argument<=0:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_CROSSES_DOMAIN_BOUNDARY')
        try:result=float(a)*math.log(argument)/log_base+float(c)
        except (ValueError,ZeroDivisionError,OverflowError):raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE') from None
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE')
        return result
    start_y=evaluate(lo);end_y=evaluate(hi);reference_y=float(c);low=min(0.0,start_y,end_y,reference_y);high=max(0.0,start_y,end_y,reference_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=max(.16*(hi-lo),.5/rate)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    increasing=(a*k>0)==base['greaterThanOne']
    features={'schemaVersion':'LOGARITHMIC_BASE_FEATURES_v1',**_exp_log_base_features(base),'naturalDomainBoundaryX':_fraction_text(root),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':_fraction_text(reference),'y':_fraction_text(c),'argument':'1'},'monotonicity':'INCREASING' if increasing else 'DECREASING','sampleBoundaryArgument':'1/8','sampleDomain':[lo,hi]}
    policy={'schemaVersion':'LOGARITHMIC_BASE_FEATURE_POLICY_v1','sourceDomain':'kx+b>0','domainBoundaryPolicy':'NATURAL_OPEN_BOUNDARY','referenceArgument':'1','sampleBoundaryArgument':'1/8','boundaryCue':'DASHED_VERTICAL_LINE','basePolicy':'POSITIVE_BASE_NOT_ONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'base':base['text'],'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'LOGARITHMIC_BASE_OVERVIEW_v1','logarithmicFeatures':features,'logarithmicFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'LOGARITHMIC_BASE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _exp_log_curve_spec(row,index,code):
    if not isinstance(row,dict):raise ValueError(code)
    allowed={'id','family','base','coefficients','sourceDomain','shiftX'}
    if set(row)-allowed:raise ValueError(code)
    curve_id=row.get('id')
    if not isinstance(curve_id,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',curve_id):raise ValueError(code+'_ID_INVALID')
    family=row.get('family')
    if family not in {'exponential-affine','logarithmic-affine'}:raise ValueError(code+'_FAMILY_UNSUPPORTED')
    base=exp_log_base(row.get('base'),'EXP_LOG_PAIR') or natural_exp_log_base()
    coefficients=_exp_log_coefficients(row.get('coefficients'),3 if family=='exponential-affine' else 4,'EXP_LOG_PAIR')
    if coefficients[0]==0 or coefficients[1]==0:raise ValueError(code+'_NONZERO_SCALE_AND_RATE_REQUIRED')
    if family=='exponential-affine':
        if row.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
        shift,shift_text=exp_log_shift(row.get('shiftX'),'EXP_LOG_PAIR_SHIFT_INVALID')
        return {'id':curve_id,'family':family,'base':base,'coefficients':coefficients,'shift':shift,'shiftText':shift_text}
    if row.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
    if row.get('shiftX') is not None:raise ValueError(code+'_SHIFT_UNSUPPORTED')
    a,k,b,c=coefficients
    return {'id':curve_id,'family':family,'base':base,'coefficients':coefficients,'boundary':-b/k,'reference':(1-b)/k}

def _fit_exp_log_pair_overview(plan):
    code='EXP_LOG_PAIR_PLAN_INVALID'
    if plan.get('sourceDomain') is not None or plan.get('domain') is not None or plan.get('viewport') is not None:raise ValueError(code)
    rows=plan.get('curves')
    if not isinstance(rows,list) or len(rows)!=2:raise ValueError(code)
    curves=[_exp_log_curve_spec(row,index,code) for index,row in enumerate(rows)]
    if len({row['id'] for row in curves})!=2:raise ValueError(code+'_ID_DUPLICATE')
    identity=plan.get('identityLine',False)
    if not isinstance(identity,bool):raise ValueError(code+'_IDENTITY_LINE_INVALID')
    spans=[]
    for row in curves:
        base=row['base'];a,k,c=row['coefficients'][:3]
        if row['family']=='exponential-affine':
            rate=abs(float(k)*math.log(base['float']))
            if not math.isfinite(rate) or rate<=0:raise ValueError('EXP_LOG_PAIR_SCALE_UNSUPPORTED')
            half=3/rate
            if not math.isfinite(half) or half>8:raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
            row['display']=(float(row['shift'])-half,float(row['shift'])+half)
            row['referencePoint']=(float(row['shift']),float(a+c))
        else:
            rate=abs(float(k));half=3/rate;epsilon=.125/rate
            if k>0:row['display']=(float(row['boundary'])+epsilon,float(row['reference'])+half)
            else:row['display']=(float(row['reference'])-half,float(row['boundary'])-epsilon)
            row['referencePoint']=(float(row['reference']),float(c))
        lo_display,hi_display=row['display']
        if not (math.isfinite(lo_display) and math.isfinite(hi_display) and lo_display<hi_display):raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
        spans.append((lo_display,hi_display))
    lo=max(spans[0][0],spans[1][0]);hi=min(spans[0][1],spans[1][1])
    if not lo<hi:raise ValueError('EXP_LOG_PAIR_NO_SHARED_WINDOW')
    anchors=[row['referencePoint'][0] for row in curves]
    lo=min(lo,*anchors);hi=max(hi,*anchors)
    if not math.isfinite(lo) or not math.isfinite(hi) or hi-lo>16:raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
    pad=max(.75,.18*(hi-lo));lo-=pad;hi+=pad
    def exp_value(row,value):
        a,k,c=row['coefficients'];base=row['base']['float']
        try:result=float(a)*(base**(float(k)*(value-float(row['shift']))))+float(c)
        except OverflowError:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE') from None
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE')
        return result
    def log_value(row,value):
        a,k,b,c=row['coefficients'];argument=float(k)*value+float(b)
        if argument<=0:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_CROSSES_DOMAIN_BOUNDARY')
        result=float(a)*math.log(argument)/math.log(row['base']['float'])+float(c)
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE')
        return result
    feature_rows=[];ys=[0.0,lo,hi]
    for row in curves:
        draw_lo=max(lo,row['display'][0]);draw_hi=min(hi,row['display'][1])
        if not draw_lo<draw_hi:raise ValueError('EXP_LOG_PAIR_NO_SHARED_WINDOW')
        if row['family']=='exponential-affine':
            values=[exp_value(row,draw_lo),exp_value(row,draw_hi),row['referencePoint'][1],float(row['coefficients'][2])]
            growth_positive=(row['coefficients'][1]>0)==row['base']['greaterThanOne'];a=row['coefficients'][0];c=row['coefficients'][2]
            feature_rows.append({'id':row['id'],'family':row['family'],**_exp_log_base_features(row['base']),'coefficients':[_fraction_text(value) for value in row['coefficients']],'shiftX':row['shiftText'],'domain':[draw_lo,draw_hi],'referencePoint':{'x':_fraction_text(row['shift']),'y':_fraction_text(a+c)},'horizontalAsymptote':{'y':_fraction_text(c),'side':'LEFT' if growth_positive else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if (a>0)==growth_positive else 'DECREASING','growthSide':'RIGHT' if growth_positive else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'})
        else:
            values=[log_value(row,draw_lo),log_value(row,draw_hi),row['referencePoint'][1]]
            a,k,b,c=row['coefficients'];increasing=(a*k>0)==row['base']['greaterThanOne']
            feature_rows.append({'id':row['id'],'family':row['family'],**_exp_log_base_features(row['base']),'coefficients':[_fraction_text(value) for value in row['coefficients']],'domain':[draw_lo,draw_hi],'naturalDomainBoundaryX':_fraction_text(row['boundary']),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':_fraction_text(row['reference']),'y':_fraction_text(c),'argument':'1'},'monotonicity':'INCREASING' if increasing else 'DECREASING'})
        ys.extend(values)
    # The inverse-pair figure is drawn at ONE scale on both axes (the dashed y=x must read at 45 degrees). The display window keeps both
    # reference points, the identity line over the shared x window, and enough height for both curves to be recognisable; the sampler clips
    # the parts above/below this window.
    anchors=[0.0,lo,hi,*[row['referencePoint'][1] for row in curves]]
    center=(min(anchors)+max(anchors))/2;half=max((hi-lo)*.8,(max(anchors)-min(anchors))/2+.15)
    low=center-half;high=center+half
    viewport=[lo,hi,low,high]
    if not all(math.isfinite(value) and abs(value)<=1e8 for value in viewport):raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
    features={'schemaVersion':'EXP_LOG_PAIR_FEATURES_v1','identityLine':identity,'curves':feature_rows,'sampleBoundaryArgument':'1/8'}
    policy={'schemaVersion':'EXP_LOG_PAIR_POLICY_v1','identityLinePolicy':'DASHED_4_3' if identity else 'NONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32,'minimumAsymptoteSeparationCssPx':2}
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'EXP_LOG_PAIR_OVERVIEW_v1','expLogPairFeatures':features,'expLogPairPolicy':policy,'equalUnits':True,'axisRatio':1}
    return {'graphPlan':fitted,'policy':'EXP_LOG_PAIR_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':None,'viewport':None}}

def _fit_exponential_affine_overview(plan):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    _valid_exp_log_display(plan,'EXPONENTIAL')
    a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'EXPONENTIAL')
    if a==0 or k==0:raise ValueError('EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED')
    radius=3/abs(float(k));lo,hi=-radius,radius
    def evaluate(value):
        result=float(a)*math.exp(float(k)*value)+float(c)
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE')
        return result
    endpoint_values=[evaluate(lo),evaluate(hi)];reference=float(a+c);low=min(float(c),reference,*endpoint_values);high=max(float(c),reference,*endpoint_values);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    features={'schemaVersion':'EXPONENTIAL_AFFINE_FEATURES_v1','referencePoint':{'x':'0','y':_fraction_text(a+c)},'horizontalAsymptote':{'y':_fraction_text(c),'side':'LEFT' if k>0 else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if a*k>0 else 'DECREASING','growthSide':'RIGHT' if k>0 else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
    policy={'schemaVersion':'EXPONENTIAL_AFFINE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','referenceArgument':'EXPONENT_ZERO','asymptotePolicy':'EXACT_VERTICAL_SHIFT','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumAsymptoteSeparationCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'EXPONENTIAL_AFFINE_OVERVIEW_v1','exponentialFeatures':features,'exponentialFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'EXPONENTIAL_AFFINE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _fit_logarithmic_affine_overview(plan):
    if plan.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
    _valid_exp_log_display(plan,'LOGARITHMIC')
    a,k,b,c=_exp_log_coefficients(plan.get('coefficients'),4,'LOGARITHMIC')
    if a==0 or k==0:raise ValueError('LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    root=-b/k;reference=(1-b)/k;root_f=float(root);reference_f=float(reference);rate=abs(float(k));epsilon=.125/rate
    if k>0:lo=root_f+epsilon;hi=reference_f+3/rate
    else:lo=reference_f-3/rate;hi=root_f-epsilon
    if not lo<hi:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_INVALID')
    def evaluate(value):
        argument=float(k)*value+float(b)
        if argument<=0:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_CROSSES_DOMAIN_BOUNDARY')
        result=float(a)*math.log(argument)+float(c)
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE')
        return result
    start_y=evaluate(lo);end_y=evaluate(hi);reference_y=float(c);low=min(0.0,start_y,end_y,reference_y);high=max(0.0,start_y,end_y,reference_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=max(.16*(hi-lo),.5/rate)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    features={'schemaVersion':'LOGARITHMIC_AFFINE_FEATURES_v1','naturalDomainBoundaryX':_fraction_text(root),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':_fraction_text(reference),'y':_fraction_text(c),'argument':'1'},'monotonicity':'INCREASING' if a*k>0 else 'DECREASING','sampleBoundaryArgument':'1/8','sampleDomain':[lo,hi]}
    policy={'schemaVersion':'LOGARITHMIC_AFFINE_FEATURE_POLICY_v1','sourceDomain':'kx+b>0','domainBoundaryPolicy':'NATURAL_OPEN_BOUNDARY','referenceArgument':'1','sampleBoundaryArgument':'1/8','boundaryCue':'DASHED_VERTICAL_LINE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'LOGARITHMIC_AFFINE_OVERVIEW_v1','logarithmicFeatures':features,'logarithmicFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'LOGARITHMIC_AFFINE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

# ---- sine / cosine on an explicit interval (several periods) with horizontal or slanted reference lines -----------------------------------
# sourceDomain {kind:'INTERVAL_PI',rangePi:[lo,hi],states:[start,end]} (exact multiples of pi) replaces the one-period window; referenceLines
# [{id,y}|{id,slope,intercept}] each carry the author's claim intersectionCount. The engine finds every crossing (closed form for a horizontal
# line, sign-change bisection for a slanted one); the observer finds them again with SymPy and refuses a different count or position.
TRIG_INTERVAL_MAX_PERIODS=12
TRIG_INTERVAL_MAX_CROSSINGS=40

def trig_line_specs(plan,code='TRIG_LINE'):
    rows=plan.get('referenceLines')
    if rows is None:return []
    if not isinstance(rows,list) or len(rows)>3:raise ValueError('TRIG_REFERENCE_LINES_INVALID')
    out=[];seen=set()
    for row in rows:
        if not isinstance(row,dict) or not isinstance(row.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',row['id']) or row['id'] in seen:raise ValueError('TRIG_REFERENCE_LINES_INVALID')
        seen.add(row['id'])
        count=row.get('intersectionCount')
        if isinstance(count,bool) or not isinstance(count,int) or not 0<=count<=TRIG_INTERVAL_MAX_CROSSINGS:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_INVALID:'+row['id'])
        if set(row)-{'id','y','slope','intercept','intersectionCount'}:raise ValueError('TRIG_REFERENCE_LINES_INVALID')
        if 'y' in row:
            if 'slope' in row or 'intercept' in row:raise ValueError('TRIG_LINE_FORM_INVALID:'+row['id'])
            out.append({'id':row['id'],'slope':Fraction(0),'intercept':_piecewise_fraction(row['y'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id']),'claim':count,'horizontal':True})
        else:
            if 'slope' not in row or 'intercept' not in row:raise ValueError('TRIG_LINE_FORM_INVALID:'+row['id'])
            slope=_piecewise_fraction(row['slope'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id']);intercept=_piecewise_fraction(row['intercept'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id'])
            if slope==0:raise ValueError('TRIG_LINE_SLOPE_ZERO:'+row['id'])
            out.append({'id':row['id'],'slope':slope,'intercept':intercept,'claim':count,'horizontal':False})
    return out

def trig_interval_source(plan):
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or set(source)-{'kind','rangePi','states'} or not isinstance(source.get('rangePi'),list) or len(source['rangePi'])!=2:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi=(_piecewise_fraction(value,'INVALID_TRIG_INTERVAL') for value in source['rangePi'])
    states=source.get('states',['CLOSED','CLOSED'])
    if not lo<hi or not isinstance(states,list) or len(states)!=2 or any(state not in {'OPEN','CLOSED'} for state in states):raise ValueError('INVALID_TRIG_INTERVAL')
    return lo,hi,list(states)

def trig_line_crossings(function,a,rate,phase,c,x0,x1,states,line):
    """Every x (radians, x0<x<x1) where a*F(rate*x+phase)+c meets the line, with its y. Closed form for a horizontal line, sign changes for a
    slanted one. rate and phase are already the effective radian rate and phase (pi already folded in)."""
    slope,intercept=float(line['slope']),float(line['intercept'])
    def inside(x):
        eps=1e-9*max(1.0,abs(x))
        return (x>x0+eps if states[0]=='OPEN' else x>=x0-eps) and (x<x1-eps if states[1]=='OPEN' else x<=x1+eps)
    found=[]
    if line['horizontal']:
        t=(intercept-float(c))/float(a)
        if abs(t)<=1:
            base=math.asin(t) if function=='SIN' else math.acos(t)
            thetas=[base,math.pi-base] if function=='SIN' else [base,-base]
            rate_f=float(rate);shift=float(phase)
            reach=sorted([rate_f*x0+shift,rate_f*x1+shift])
            for theta in thetas:
                first=math.floor((reach[0]-theta)/(2*math.pi))-1;last=math.ceil((reach[1]-theta)/(2*math.pi))+1
                for j in range(first,last+1):found.append((theta+2*math.pi*j-shift)/rate_f)
    else:
        rate_f=float(rate);shift=float(phase);af=float(a);cf=float(c);fn=math.sin if function=='SIN' else math.cos
        gap=lambda x:af*fn(rate_f*x+shift)+cf-(slope*x+intercept)
        steps=max(2000,int(400*(x1-x0)/math.pi));previous=x0;value=gap(previous)
        for index in range(1,steps+1):
            current=x0+(x1-x0)*index/steps;now=gap(current)
            if value==0:found.append(previous)
            elif value*now<0:
                left,right,gl=previous,current,value
                for _ in range(80):
                    mid=(left+right)/2;gm=gap(mid)
                    if gl*gm<=0:right=mid
                    else:left,gl=mid,gm
                found.append((left+right)/2)
            previous,value=current,now
        if value==0:found.append(previous)
    unique=[]
    for x in sorted(found):
        if inside(x) and (not unique or x-unique[-1]>1e-7*max(1.0,abs(x))):unique.append(x)
    return [(x,slope*x+intercept) for x in unique]

def _fit_trigonometric_interval(plan,function):
    if function not in {'SIN','COS'}:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi,states=trig_interval_source(plan)
    if 'domain' in plan or 'viewport' in plan:
        _valid_exp_log_display(plan,'TRIGONOMETRIC')
    a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'TRIGONOMETRIC');phase=_piecewise_fraction(plan.get('phasePi'),'INVALID_TRIGONOMETRIC_PHASE')
    if a==0 or k==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    rate=abs(k);periods=(hi-lo)*rate/2
    if periods<Fraction(1,4) or periods>TRIG_INTERVAL_MAX_PERIODS:raise ValueError('TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
    x0,x1=float(lo)*math.pi,float(hi)*math.pi
    rows=[];ys=[float(c-abs(a)),float(c+abs(a)),0.0]
    for line in trig_line_specs(plan):
        crossings=trig_line_crossings(function,float(a),float(k),float(phase)*math.pi,float(c),x0,x1,states,line)
        if len(crossings)!=line['claim']:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:'+line['id']+':engine finds '+str(len(crossings))+' intersection(s)')
        for x,_ in crossings:
            if (states[0]=='CLOSED' and abs(x-x0)<1e-9) or (states[1]=='CLOSED' and abs(x-x1)<1e-9):raise ValueError('TRIG_LINE_THROUGH_INTERVAL_END:'+line['id'])
        ys.append(float(line['intercept']) if line['horizontal'] else 0.0);ys.extend(y for _,y in crossings)
        rows.append({'id':line['id'],'kind':'HORIZONTAL' if line['horizontal'] else 'SLANTED','slope':str(line['slope']),'intercept':str(line['intercept']),'intersections':[{'x':x,'y':y} for x,y in crossings]})
    evaluator=math.sin if function=='SIN' else math.cos
    end_y=[float(a)*evaluator(float(k)*x+float(phase)*math.pi)+float(c) for x in (x0,x1)]
    xpad=max(.04*(x1-x0),.3);low=min(ys);high=max(ys);ypad=.18*max(1.0,high-low)
    viewport=[x0-xpad,x1+xpad,low-ypad,high+ypad]
    features={'schemaVersion':'TRIGONOMETRIC_INTERVAL_FEATURES_v1','function':function,'phasePi':str(phase),'periodPiMultiple':str(Fraction(2,1)/rate),'amplitude':str(a),'midline':str(c),'sourceInterval':{'loPi':str(lo),'hiPi':str(hi),'states':states},'lines':rows}
    policy={'schemaVersion':'TRIGONOMETRIC_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':3.2,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':40,'minimumAmplitudeCssPx':20}
    interval={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':repr(x0),'y':repr(end_y[0]),'state':states[0]},{'side':'END','x':repr(x1),'y':repr(end_y[1]),'state':states[1]}]}
    interval_policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in [x0,x1,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
    fitted={**plan,'domain':[x0,x1],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v1','trigIntervalFeatures':features,'trigIntervalPolicy':policy,'intervalFeatures':interval,'intervalFeaturePolicy':interval_policy}
    return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

# ---- general trigonometric parameters (rate or phase carrying pi, plain x interval, tan branches) --------------------------------
# The v1 grammar above stays byte-compatible. The additive grammar is:
#   graphPlan.ratePi  an exact rational m: the rate is m*pi and coefficients are [A,C] (rate without pi stays [A,k,C]).
#   graphPlan.phase   an exact rational phase in radians; phasePi stays the phase as a rational multiple of pi (exactly one is given).
#   sourceDomain {kind:'INTERVAL',range:[lo,hi],states:[start,end]} measures x in plain units (a time or month axis) and requires ratePi.
#   sourceDomain {kind:'INTERVAL_PI',...} keeps the pi-unit x axis; a rate carrying pi is refused there.
#   keyPoints:true marks every exact extremum and midline crossing inside the interval (SIN/COS with a pi-multiple phase).
#   axisTickPi:true labels the x ticks (axisTickValues.x, exact multiples of pi) as pi/2, pi, 3*pi/2 on a pi-unit axis.
TRIG_KEY_POINT_MAX=60

def trig_spec(plan):
    """The exact general trigonometric parameters, parsed once for the several display forms."""
    function=plan.get('function')
    if function not in {'SIN','COS','TAN'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
    coefficients=plan.get('coefficients');rate_field=plan.get('ratePi')
    if rate_field is not None:
        rate=_piecewise_fraction(rate_field,'INVALID_TRIGONOMETRIC_RATE')
        if not isinstance(coefficients,list) or len(coefficients)!=2:raise ValueError('TRIG_GRAMMAR_UNSUPPORTED')
        a,c=(_piecewise_fraction(value,'TRIGONOMETRIC_COEFFICIENT_INVALID') for value in coefficients)
        rate_has_pi=True
    else:
        if not isinstance(coefficients,list) or len(coefficients)!=3:raise ValueError('TRIG_GRAMMAR_UNSUPPORTED')
        a,rate,c=(_piecewise_fraction(value,'TRIGONOMETRIC_COEFFICIENT_INVALID') for value in coefficients)
        rate_has_pi=False
    phase_pi=plan.get('phasePi');phase_plain=plan.get('phase')
    if (phase_pi is None)==(phase_plain is None):raise ValueError('INVALID_TRIGONOMETRIC_PHASE')
    if phase_pi is not None:
        phase=_piecewise_fraction(phase_pi,'INVALID_TRIGONOMETRIC_PHASE');phase_has_pi=True
    else:
        phase=_piecewise_fraction(phase_plain,'INVALID_TRIGONOMETRIC_PHASE');phase_has_pi=False
    if a==0 or rate==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    return {'function':function,'a':a,'c':c,'rate':rate,'rateHasPi':rate_has_pi,'phase':phase,'phaseHasPi':phase_has_pi}

def trig_effective(spec):
    """The radian rate and phase (the pi factors folded in) used by display and evaluation."""
    rate=float(spec['rate'])*(math.pi if spec['rateHasPi'] else 1.0)
    phase=float(spec['phase'])*(math.pi if spec['phaseHasPi'] else 1.0)
    return rate,phase

def trig_axis_period(spec):
    """One period measured in axis units: 2/|rate| (SIN/COS) or 1/|rate| (TAN) whichever unit the pi factor and the interval use."""
    return Fraction(2,1)/abs(spec['rate']) if spec['function'] in {'SIN','COS'} else Fraction(1,1)/abs(spec['rate'])

def trig_interval_v2_source(plan):
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or source.get('kind') not in {'INTERVAL','INTERVAL_PI'}:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    kind=source['kind'];key='range' if kind=='INTERVAL' else 'rangePi'
    if set(source)-{'kind',key,'states'} or not isinstance(source.get(key),list) or len(source[key])!=2:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi=(_piecewise_fraction(value,'INVALID_TRIG_INTERVAL') for value in source[key])
    states=source.get('states',['CLOSED','CLOSED'])
    if not lo<hi or not isinstance(states,list) or len(states)!=2 or any(state not in {'OPEN','CLOSED'} for state in states):raise ValueError('INVALID_TRIG_INTERVAL')
    return kind,lo,hi,list(states)

def trig_key_points(spec,lo,hi,states):
    """Every extremum and midline crossing inside the interval, with exact axis coordinates (phase must be a pi multiple)."""
    if spec['function'] not in {'SIN','COS'}:raise ValueError('TRIG_KEY_POINTS_REQUIRE_SIN_COS')
    if not spec['phaseHasPi']:raise ValueError('TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE')
    function=spec['function'];rate=spec['rate'];phase=spec['phase'];a=spec['a'];c=spec['c']
    first=math.ceil(float((rate*lo+phase)*2)-1e-12);last=math.floor(float((rate*hi+phase)*2)+1e-12)
    rows=[]
    for m in range(first,last+1):
        x=(Fraction(m,2)-phase)/rate
        if not lo<x<hi:continue
        if function=='SIN':factor=Fraction(0) if m%2==0 else (Fraction(1) if m%4==1 else Fraction(-1))
        else:factor=(Fraction(1) if m%4==0 else Fraction(-1)) if m%2==0 else Fraction(0)
        y=a*factor+c
        if factor==0:kind='X_INTERCEPT' if y==0 else 'MIDLINE_CROSSING'
        else:kind='MAXIMUM' if y>c else 'MINIMUM'
        rows.append({'id':'key-'+str(m),'kind':kind,'x':str(x),'y':str(y)})
    if len(rows)>TRIG_KEY_POINT_MAX:raise ValueError('TRIG_KEY_POINTS_TOO_MANY')
    return rows

def trig_interval_poles(spec,lo,hi):
    """Every pole of tan strictly inside the interval, with its exact axis coordinate (phase must be a pi multiple)."""
    if spec['function']!='TAN':return []
    if not spec['phaseHasPi']:raise ValueError('TRIG_TAN_REQUIRES_PI_PHASE')
    rate=spec['rate'];phase=spec['phase']
    first=math.ceil(float(rate*lo+phase-Fraction(1,2))-1e-12);last=math.floor(float(rate*hi+phase-Fraction(1,2))+1e-12)
    rows=[]
    for n in range(first,last+1):
        x=(Fraction(1,2)+n-phase)/rate
        if x==lo or x==hi:raise ValueError('TRIG_TAN_POLE_AT_INTERVAL_END')
        if lo<x<hi:rows.append({'id':'pole-'+str(len(rows)+1),'x':str(x),'side':'LEFT' if rate>0 else 'RIGHT'})
    if not rows:raise ValueError('TRIG_TAN_INTERVAL_NO_POLE')
    return rows

def trig_pi_ticks(plan,kind,x0,x1):
    """Validate pi-unit x tick multiples. Returns the exact multiples (axis units) when axisTickPi is on."""
    flag=plan.get('axisTickPi')
    if flag is None or flag is False:return []
    if flag is not True:raise ValueError('INVALID_TRIG_TICK_PI_FLAG')
    if kind!='INTERVAL_PI':raise ValueError('TRIG_TICK_PI_REQUIRES_PI_AXIS')
    values=plan.get('axisTickValues')
    if not isinstance(values,dict) or set(values)!={'x','y'} or not isinstance(values.get('x'),list) or not isinstance(values.get('y'),list):raise ValueError('INVALID_TRIG_AXIS_TICK_VALUES')
    multiples=[]
    for value in values['x']:
        multiple=_piecewise_fraction(value,'TRIG_PI_TICK_VALUE_INVALID')
        if multiple==0:raise ValueError('TRIG_PI_TICK_VALUE_INVALID')
        position=float(multiple)*math.pi
        if not x0<position<x1:raise ValueError('TRIG_PI_TICK_OUTSIDE_VIEW')
        multiples.append(multiple)
    return multiples

def _fit_trigonometric_interval_v2(plan,spec):
    function=spec['function'];a=spec['a'];rate=spec['rate'];c=spec['c']
    kind,lo,hi,states=trig_interval_v2_source(plan)
    if kind=='INTERVAL' and not spec['rateHasPi']:raise ValueError('TRIG_INTERVAL_REQUIRES_RATE_PI')
    if kind=='INTERVAL_PI' and spec['rateHasPi']:raise ValueError('TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL')
    if kind=='INTERVAL_PI' and not spec['phaseHasPi']:raise ValueError('TRIG_INTERVAL_PI_PHASE_MUST_BE_PI')
    if 'domain' in plan or 'viewport' in plan:_valid_exp_log_display(plan,'TRIGONOMETRIC')
    period=trig_axis_period(spec);axis_unit='PI' if kind=='INTERVAL_PI' else 'ONE'
    periods=(hi-lo)/period
    if periods<Fraction(1,4) or periods>TRIG_INTERVAL_MAX_PERIODS:raise ValueError('TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
    x0=float(lo)*(math.pi if axis_unit=='PI' else 1.0);x1=float(hi)*(math.pi if axis_unit=='PI' else 1.0)
    rate_eff,phase_eff=trig_effective(spec)
    rows=[];ys=[float(c-abs(a)),float(c+abs(a)),0.0]
    key_rows=[];pole_rows=[]
    if plan.get('keyPoints') is not None and not isinstance(plan.get('keyPoints'),bool):raise ValueError('INVALID_TRIG_KEY_POINTS')
    if plan.get('keyPoints') is True and function not in {'SIN','COS'}:raise ValueError('TRIG_KEY_POINTS_REQUIRE_SIN_COS')
    if function=='TAN':
        if plan.get('referenceLines'):raise ValueError('TRIG_TAN_REFERENCE_LINES_UNSUPPORTED')
        pole_rows=trig_interval_poles(spec,lo,hi)
    else:
        for line in trig_line_specs(plan):
            crossings=trig_line_crossings(function,float(a),rate_eff,phase_eff,float(c),x0,x1,states,line)
            if len(crossings)!=line['claim']:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:'+line['id']+':engine finds '+str(len(crossings))+' intersection(s)')
            for x,_ in crossings:
                if (states[0]=='CLOSED' and abs(x-x0)<1e-9) or (states[1]=='CLOSED' and abs(x-x1)<1e-9):raise ValueError('TRIG_LINE_THROUGH_INTERVAL_END:'+line['id'])
            ys.append(float(line['intercept']) if line['horizontal'] else 0.0);ys.extend(y for _,y in crossings)
            rows.append({'id':line['id'],'kind':'HORIZONTAL' if line['horizontal'] else 'SLANTED','slope':str(line['slope']),'intercept':str(line['intercept']),'intersections':[{'x':x,'y':y} for x,y in crossings]})
        if plan.get('keyPoints') is True:
            key_rows=trig_key_points(spec,lo,hi,states);ys.extend(float(Fraction(row['y'])) for row in key_rows)
    trig_pi_ticks(plan,kind,x0,x1)
    evaluator=math.sin if function=='SIN' else math.cos if function=='COS' else math.tan
    end_y=[float(a)*evaluator(rate_eff*x+phase_eff)+float(c) for x in (x0,x1)]
    xpad=max(.04*(x1-x0),.3)
    if function=='TAN':
        half=max(1.0,2.2*abs(float(a)));low=min(0.0,float(c)-half);high=max(0.0,float(c)+half);ypad=.05*max(1.0,high-low)
    else:
        low=min(ys);high=max(ys);ypad=.18*max(1.0,high-low)
    viewport=[x0-xpad,x1+xpad,low-ypad,high+ypad]
    features={'schemaVersion':'TRIGONOMETRIC_INTERVAL_FEATURES_v2','function':function,'rate':str(rate),'rateHasPi':spec['rateHasPi'],'phase':str(spec['phase']),'phaseHasPi':spec['phaseHasPi'],'period':str(period),'axisUnit':axis_unit,'amplitude':str(a),'midline':str(c),'sourceInterval':{'kind':kind,'lo':str(lo),'hi':str(hi),'states':states},'lines':rows,'keyPoints':key_rows,'poles':pole_rows}
    policy={'schemaVersion':'TRIGONOMETRIC_INTERVAL_POLICY_v2','markerRadiusIntrinsicPx':3.2,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':40,'minimumAmplitudeCssPx':20,'minimumPoleApproachGapCssPx':2}
    interval={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':repr(x0),'y':repr(end_y[0]),'state':states[0]},{'side':'END','x':repr(x1),'y':repr(end_y[1]),'state':states[1]}]}
    interval_policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in [x0,x1,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
    fitted={**plan,'domain':[x0,x1],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2','trigIntervalFeatures':features,'trigIntervalPolicy':policy,'intervalFeatures':interval,'intervalFeaturePolicy':interval_policy}
    return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

def _fit_trigonometric_period_v2(plan,spec):
    function=spec['function'];a=spec['a'];rate=spec['rate'];c=spec['c']
    expected={'kind':'ALL_REALS'} if function in {'SIN','COS'} else {'kind':'ALL_REALS_WITH_TAN_POLES'}
    if plan.get('sourceDomain')!=expected:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    if not spec['phaseHasPi']:raise ValueError('TRIG_PHASE_RATIONAL_REQUIRES_INTERVAL')
    _valid_exp_log_display(plan,'TRIGONOMETRIC')
    rate_eff,phase_eff=trig_effective(spec);center=-phase_eff/rate_eff;radius=math.pi/abs(rate_eff)
    period=trig_axis_period(spec)
    if function in {'SIN','COS'}:
        lo,hi=center-radius,center+radius;rows=[]
        for index in range(-2,3):
            x_pi=(Fraction(index,2)-spec['phase'])/rate
            x=float(x_pi)
            if function=='SIN':factor=Fraction(0) if index%2==0 else (Fraction(1) if index%4==1 else Fraction(-1))
            else:factor=(Fraction(1) if index%4==0 else Fraction(-1)) if index%2==0 else Fraction(0)
            y=a*factor+c
            if factor==0:kind='X_INTERCEPT' if y==0 else 'MIDLINE_CROSSING'
            else:kind='EXTREMUM'
            row={'id':f'phase-{index+2}','kind':kind,'index':index,'x':str(x_pi),'y':str(y)}
            if kind=='EXTREMUM':row['extreme']='MAXIMUM' if y>c else 'MINIMUM'
            rows.append(row)
        points=[(float(Fraction(row['x'])),float(Fraction(row['y']))) for row in rows]
        ymin=min(float(c-abs(a)),*(point[1] for point in points));ymax=max(float(c+abs(a)),*(point[1] for point in points));ypad=.15*max(1.0,ymax-ymin,abs(ymin),abs(ymax));xpad=.04*(hi-lo)
        viewport=[lo-xpad,hi+xpad,min(0.0,ymin)-ypad,max(0.0,ymax)+ypad]
        center_behavior=('INCREASING' if a*rate>0 else 'DECREASING') if function=='SIN' else ('MAXIMUM' if a>0 else 'MINIMUM')
        features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v2','function':function,'rate':str(rate),'rateHasPi':spec['rateHasPi'],'phase':str(spec['phase']),'phaseHasPi':spec['phaseHasPi'],'period':str(period),'amplitude':str(a),'midline':str(c),'centerBehavior':center_behavior,'phasePoints':rows}
        policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v2','function':function,'sourceDomain':'ALL_REALS','displayWindow':'ONE_FULL_PERIOD','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':80,'minimumAmplitudeCssPx':20}
        domain=[lo,hi]
    else:
        epsilon=Fraction(3,25)/abs(rate);first_pole=(-spec['phase']-Fraction(1,2))/rate;second_pole=(-spec['phase']+Fraction(1,2))/rate
        left_pole,right_pole=sorted((first_pole,second_pole))
        lo=float(left_pole)+float(epsilon);hi=float(right_pole)-float(epsilon)
        def evaluate(value):
            result=float(a)*math.tan(rate_eff*value+phase_eff)+float(c)
            if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_TANGENT_NUMERIC_SCOPE')
            return result
        start_y=evaluate(lo);end_y=evaluate(hi);low=min(float(c),start_y,end_y);high=max(float(c),start_y,end_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
        viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
        features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v2','function':'TAN','rate':str(rate),'rateHasPi':spec['rateHasPi'],'phase':str(spec['phase']),'phaseHasPi':spec['phaseHasPi'],'period':str(period),'amplitude':str(a),'midline':str(c),'centerBehavior':'INCREASING' if a*rate>0 else 'DECREASING','referencePoint':{'x':str(-spec['phase']/rate),'y':str(c)},'poles':[{'id':'pole-left','x':str(left_pole)},{'id':'pole-right','x':str(right_pole)}],'sampleBoundaryDistance':'3/25'}
        policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v2','function':'TAN','sourceDomain':'ALL_REALS_WITH_TAN_POLES','displayWindow':'ONE_COMPLETE_POLE_TO_POLE_BRANCH','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':80}
        domain=[lo,hi]
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in [*domain,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
    fitted={**plan,'domain':domain,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2','trigFeatures':features,'trigFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _fit_trigonometric_overview(plan):
    function=plan.get('function')
    if function not in {'SIN','COS','TAN'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
    source=plan.get('sourceDomain')
    if isinstance(source,dict) and source.get('kind') in {'INTERVAL_PI','INTERVAL'}:
        legacy=source.get('kind')=='INTERVAL_PI' and plan.get('ratePi') is None and plan.get('phase') is None and plan.get('axisTickPi') is None and plan.get('keyPoints') is not True and function in {'SIN','COS'}
        if legacy:return _fit_trigonometric_interval(plan,function)
        return _fit_trigonometric_interval_v2(plan,trig_spec(plan))
    if plan.get('referenceLines') is not None:raise ValueError('TRIG_REFERENCE_LINES_REQUIRE_INTERVAL_PI')
    if plan.get('ratePi') is None and plan.get('phase') is None:
        expected_domain={'kind':'ALL_REALS'} if function in {'SIN','COS'} else {'kind':'ALL_REALS_WITH_TAN_POLES'}
        if plan.get('sourceDomain')!=expected_domain:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
        _valid_exp_log_display(plan,'TRIGONOMETRIC')
        a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'TRIGONOMETRIC');phase=_piecewise_fraction(plan.get('phasePi'),'INVALID_TRIGONOMETRIC_PHASE')
        if a==0 or k==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
        center=-phase/k;rate=abs(k);center_f=float(center);rate_f=float(rate);sign_k=1 if k>0 else -1
        if function in {'SIN','COS'}:
            radius=math.pi/rate_f;lo=center_f*math.pi-radius;hi=center_f*math.pi+radius
            rows=[]
            for index in range(-2,3):
                phase_offset=Fraction(index,2*1)/rate
                x_pi=center+phase_offset
                factor=(0 if index in {-2,0,2} else (sign_k if index>0 else -sign_k)) if function=='SIN' else (1 if index==0 else 0 if abs(index)==1 else -1)
                y=a*factor+c
                kind='X_INTERCEPT' if y==0 and factor==0 else 'MIDLINE_CROSSING' if factor==0 else 'EXTREMUM'
                row={'id':f'phase-{index+2}','kind':kind,'index':index,'xPiMultiple':str(x_pi),'y':str(y)}
                if kind=='EXTREMUM':row['extreme']='MAXIMUM' if y>c else 'MINIMUM'
                rows.append(row)
            points=[(float(_piecewise_fraction(row['xPiMultiple'],'INVALID_TRIG_FEATURE_X'))*math.pi,float(Fraction(row['y']))) for row in rows]
            ymin=min(float(c-abs(a)),*([point[1] for point in points]));ymax=max(float(c+abs(a)),*([point[1] for point in points]));ypad=.15*max(1.0,ymax-ymin,abs(ymin),abs(ymax));xpad=.04*(hi-lo)
            viewport=[lo-xpad,hi+xpad,min(0.0,ymin)-ypad,max(0.0,ymax)+ypad]
            center_behavior=('INCREASING' if a*k>0 else 'DECREASING') if function=='SIN' else ('MAXIMUM' if a>0 else 'MINIMUM')
            features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v1','function':function,'phasePi':str(phase),'cycleCenterPi':str(center),'periodPiMultiple':str(Fraction(2,1)/rate),'amplitude':str(a),'midline':str(c),'centerBehavior':center_behavior,'phasePoints':rows}
            policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v1','function':function,'sourceDomain':'ALL_REALS','displayWindow':'ONE_FULL_PERIOD','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':80,'minimumAmplitudeCssPx':20}
            domain=[lo,hi]
        else:
            epsilon=.12/rate_f;left_pole=center_f*math.pi-math.pi/(2*rate_f);right_pole=center_f*math.pi+math.pi/(2*rate_f)
            lo=left_pole+epsilon;hi=right_pole-epsilon
            def evaluate(value):
                angle=float(k)*value+float(phase)*math.pi
                result=float(a)*math.tan(angle)+float(c)
                if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_TANGENT_NUMERIC_SCOPE')
                return result
            start_y=evaluate(lo);end_y=evaluate(hi);low=min(float(c),start_y,end_y);high=max(float(c),start_y,end_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
            viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
            left_pole_pi=center-Fraction(1,2)/rate;right_pole_pi=center+Fraction(1,2)/rate
            features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v1','function':'TAN','phasePi':str(phase),'cycleCenterPi':str(center),'periodPiMultiple':str(Fraction(1,1)/rate),'amplitude':str(a),'midline':str(c),'centerBehavior':'INCREASING' if a*k>0 else 'DECREASING','referencePoint':{'xPiMultiple':str(center),'y':str(c)},'poles':[{'id':'pole-left','xPiMultiple':str(left_pole_pi),'side':'LEFT'},{'id':'pole-right','xPiMultiple':str(right_pole_pi),'side':'RIGHT'}],'sampleBoundaryDistance':str(Fraction(3,25))}
            policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v1','function':'TAN','sourceDomain':'ALL_REALS_WITH_TAN_POLES','displayWindow':'ONE_COMPLETE_POLE_TO_POLE_BRANCH','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':80}
            domain=[lo,hi]
        if not all(math.isfinite(value) and abs(value)<=1e6 for value in [*domain,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
        fitted={**plan,'domain':domain,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v1','trigFeatures':features,'trigFeaturePolicy':policy}
        return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}
    return _fit_trigonometric_period_v2(plan,trig_spec(plan))

# ---- piecewise polynomial: one continuous y=g(x) of up to three pieces (degree <= 2 each) plus up to three horizontal lines y=c ----------
# The plan claims the breakpoint values, marks every corner and every vertex inside a piece as a requiredPoint, and lists the exact x of every
# intersection with each line. All of it is recomputed here exactly (Fractions, SymPy surds) and a disagreement refuses the plan.
PIECEWISE_POLY_FIELDS={'family','pieces','breakpoints','sourceDomain','formula','referenceLines','requiredPoints','exactCoordinates','axisTickValues','domain','viewport','axisSqueeze','plotHeightLimit','referenceCurves','functionName','sampleNote','overlays','overlayAnchors','regions'}
PIECEWISE_POLY_MIN_ARM_PX=12
PIECEWISE_POLY_MIN_FEATURE_GAP_PX=4
# Four pieces cover the two-piecewise exam items (f and g both piecewise); a fifth piece is refused.
PIECEWISE_POLY_MAX_PIECES=4
# A reference curve may list as many crossings as four piece pairs can produce in a readable figure.
PIECEWISE_POLY_MAX_CURVE_INTERSECTIONS=8
PIECEWISE_POLY_MAX_REQUIRED_POINTS=24
# Shaded regions between two drawn boundaries (the function, a reference curve, a reference line or the x-axis).
PIECEWISE_POLY_REGION_FIELDS={'id','upper','lower','from','to','fill','label'}
PIECEWISE_POLY_MAX_REGIONS=4
PIECEWISE_POLY_REGION_FILLS=('LIGHT','MEDIUM')

def _pp_rational(value,code):
    """An exact rational: a decimal integer, an 'a/b' string, or a JSON integer."""
    if isinstance(value,bool) or not (isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value)):raise ValueError(code)
    try:return Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None

def _pp_norm(value):
    """Canonical form of a one-radical exact value (a+b*sqrt(r), r squarefree): radicals in a denominator are rationalised, products expanded."""
    return S.radsimp(S.expand(S.sympify(value)))

def pp_surd_split(value,code):
    """(p, q, r) with value = p + q*sqrt(r) for an exact real value (p, q rational, r a squarefree integer > 1; q = 0 and r = None for a
    rational). Anything else (nested radicals, a second radical, a root of higher order) is refused with `code`."""
    normal=_pp_norm(value)
    if normal.is_Rational:return normal,S.Integer(0),None
    powers=list(normal.atoms(S.Pow))
    if not powers or any(power.exp!=S.Rational(1,2) or not power.base.is_Integer or power.base<2 for power in powers) or len({power.base for power in powers})!=1:raise ValueError(code)
    radicand=powers[0].base;p=normal.subs(S.sqrt(radicand),0);q=S.simplify((normal-p)/S.sqrt(radicand))
    if not p.is_Rational or not q.is_Rational or q==0:raise ValueError(code)
    return p,q,radicand

def pp_surd(value,code):
    """An exact coefficient: a decimal integer, an 'a/b' string, or p+q*sqrt(r) written in the exact-value grammar. Returns a SymPy number."""
    if isinstance(value,bool):raise ValueError(code)
    if isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value):
        try:return S.Rational(value)
        except (ValueError,ZeroDivisionError):raise ValueError(code) from None
    if not isinstance(value,str):raise ValueError(code)
    try:number=pp_exact_value(value)
    except ValueError:raise ValueError(code) from None
    pp_surd_split(number,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED:'+value[:32])
    return _pp_norm(number)

def pp_radicand(value):
    """The one radicand of an exact value (None for a rational)."""
    return pp_surd_split(value,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED')[2]

def pp_surd_text(value):
    """A canonical exact-value string of a rational or p+q*sqrt(r): '-3+2*sqrt(3)', '1/2+3*sqrt(2)/2', '-sqrt(5)'."""
    p,q,r=pp_surd_split(value,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED')
    def rat(number):return str(Fraction(int(number.p),int(number.q)))
    if r is None:return rat(p)
    magnitude=abs(q);root='sqrt('+str(r)+')'
    body=('' if magnitude.p==1 else str(int(magnitude.p))+'*')+root+('' if magnitude.q==1 else '/'+str(int(magnitude.q)))
    head='' if p==0 else rat(p)
    return head+('-' if q<0 else '+' if p!=0 else '')+body

def pp_exact_float(text):
    """The float of an exact-value string (a rational or a sqrt expression)."""
    if isinstance(text,str) and re.fullmatch(r'-?\d+(?:/\d+)?',text):return float(Fraction(text))
    return float(pp_exact_value(text))

def pp_same(a,b):
    """Two exact algebraic numbers are equal: exactly after simplification, or equal to 50 digits (nested radicals that do not simplify)."""
    difference=S.sympify(a)-S.sympify(b)
    return difference==0 or S.simplify(difference)==0 or abs(S.N(difference,60))<S.Float('1e-40',60)

def pp_exact_value(text):
    """An exact value string (integers, a/b, sqrt(...), + - * / and parentheses, as in '(-3-sqrt(53))/2') as a SymPy number. Never eval."""
    def bad():raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID:'+str(text)[:32])
    if not isinstance(text,str) or not text or len(text)>64 or not re.fullmatch(r'[0-9+\-*/()sqrt ]+',text):bad()
    compact=text.replace(' ','');tokens=re.findall(r'sqrt|\d+|[+\-*/()]',compact)
    if ''.join(tokens)!=compact:bad()
    at=[0]
    def peek():return tokens[at[0]] if at[0]<len(tokens) else None
    def take():token=peek();at[0]+=1;return token
    def factor():
        token=take()
        if token=='-':return -factor()
        if token=='+':return factor()
        if token=='sqrt':
            if take()!='(':bad()
            value=expr()
            if take()!=')' or value.is_negative:bad()
            return S.sqrt(value)
        if token=='(':
            value=expr()
            if take()!=')':bad()
            return value
        if token is not None and token.isdigit():return S.Integer(int(token))
        bad()
    def term():
        value=factor()
        while peek() in ('*','/'):
            op=take();right=factor()
            if op=='/' and right==0:bad()
            value=value*right if op=='*' else value/right
        return value
    def expr():
        value=term()
        while peek() in ('+','-'):
            op=take();right=term();value=value+right if op=='+' else value-right
        return value
    value=expr()
    if at[0]!=len(tokens) or not value.is_real:bad()
    return value

def pp_formula_value(text,x_value):
    """The exact value at a rational x of a display formula in x: integers, x, abs(...), + - * / ^ (small integer powers), parentheses and an
    implicit product such as 2x. Returns a Fraction; anything else is PIECEWISE_POLY_FORMULA_INVALID."""
    def bad():raise ValueError('PIECEWISE_POLY_FORMULA_INVALID')
    if not isinstance(text,str) or not text or len(text)>120 or not re.fullmatch(r'[0-9x+\-*/^()abs ]+',text):bad()
    compact=text.replace(' ','');tokens=re.findall(r'abs|\d+|x|[+\-*/^()]',compact)
    if ''.join(tokens)!=compact:bad()
    at=[0]
    def peek():return tokens[at[0]] if at[0]<len(tokens) else None
    def take():token=peek();at[0]+=1;return token
    def atom():
        token=take()
        if token=='x':return Fraction(x_value)
        if token=='abs':
            if take()!='(':bad()
            value=expr()
            if take()!=')':bad()
            return abs(value)
        if token=='(':
            value=expr()
            if take()!=')':bad()
            return value
        if token is not None and token.isdigit():return Fraction(int(token))
        bad()
    def power():
        base=atom()
        if peek()=='^':
            take();exponent=take()
            if exponent is None or not exponent.isdigit() or int(exponent)>4:bad()
            return base**int(exponent)
        return base
    def unary():
        if peek()=='-':take();return -unary()
        if peek()=='+':take();return unary()
        return power()
    def term():
        value=unary()
        while peek() in ('*','/','x','abs','(') or (peek() or '').isdigit():
            op=take() if peek() in ('*','/') else '*'
            if op=='*' and (peek() or '').isdigit() and tokens[at[0]-1] not in ('*',):bad()
            right=unary()
            if op=='/' and right==0:bad()
            value=value*right if op=='*' else value/right
        return value
    def expr():
        value=term()
        while peek() in ('+','-'):
            op=take();right=term();value=value+right if op=='+' else value-right
        return value
    value=expr()
    if at[0]!=len(tokens):bad()
    return value

def _pp_poly_value(coefficients,x_value):
    return _pp_norm(sum((c*S.sympify(x_value)**i for i,c in enumerate(coefficients)),S.Integer(0)))

def piecewise_polynomial_source(plan):
    """Exact pieces, breakpoints, source interval and the piece intervals (None for an unbounded end); the grammar checks of the family."""
    unknown=sorted(set(plan)-PIECEWISE_POLY_FIELDS)
    if unknown:raise ValueError('PIECEWISE_POLY_FIELD_UNKNOWN:'+unknown[0])
    raw_pieces=plan.get('pieces');raw_breaks=plan.get('breakpoints',[])
    if not isinstance(raw_pieces,list) or not 1<=len(raw_pieces)<=PIECEWISE_POLY_MAX_PIECES:raise ValueError('PIECEWISE_POLY_PIECE_COUNT_INVALID')
    if not isinstance(raw_breaks,list) or len(raw_breaks)!=len(raw_pieces)-1:raise ValueError('PIECEWISE_POLY_BREAKPOINT_COUNT_INVALID')
    pieces=[]
    for piece in raw_pieces:
        if not isinstance(piece,dict) or set(piece)!={'coefficients'} or not isinstance(piece['coefficients'],list) or not 1<=len(piece['coefficients'])<=3:raise ValueError('PIECEWISE_POLY_PIECE_INVALID')
        pieces.append([pp_surd(value,'PIECEWISE_POLY_COEFFICIENT_INVALID') for value in piece['coefficients']]+[S.Integer(0)]*(3-len(piece['coefficients'])))
    breaks=[]
    for row in raw_breaks:
        if not isinstance(row,dict) or set(row)!={'x','y'}:raise ValueError('PIECEWISE_POLY_BREAKPOINT_INVALID')
        breaks.append((pp_surd(row['x'],'PIECEWISE_POLY_BREAKPOINT_INVALID'),pp_surd(row['y'],'PIECEWISE_POLY_BREAKPOINT_INVALID')))
    if any(not left[0]<right[0] for left,right in zip(breaks,breaks[1:])):raise ValueError('PIECEWISE_POLY_BREAKPOINTS_NOT_INCREASING')
    source=plan.get('sourceDomain')
    if source=={'kind':'ALL_REALS'}:lo=hi=None;states=['CLOSED','CLOSED']
    elif isinstance(source,dict) and source.get('kind')=='INTERVAL':
        try:lo,hi,states=quadratic_source_interval(source)
        except ValueError:raise ValueError('PIECEWISE_POLY_SOURCE_DOMAIN_INVALID') from None
        lo,hi=S.Rational(lo.numerator,lo.denominator),S.Rational(hi.numerator,hi.denominator)
        if any(not lo<x_value<hi for x_value,_ in breaks):raise ValueError('PIECEWISE_POLY_BREAKPOINT_OUTSIDE_SOURCE_INTERVAL')
    else:raise ValueError('PIECEWISE_POLY_SOURCE_DOMAIN_INVALID')
    cuts=[lo,*[x_value for x_value,_ in breaks],hi]
    intervals=list(zip(cuts,cuts[1:]))
    for index,(x_value,y_value) in enumerate(breaks):
        left,right=_pp_poly_value(pieces[index],x_value),_pp_poly_value(pieces[index+1],x_value)
        if left!=right:raise ValueError('PIECEWISE_POLY_DISCONTINUOUS:'+_pp_text(x_value))
        if left!=y_value:raise ValueError('PIECEWISE_POLY_BREAKPOINT_VALUE_MISMATCH:'+_pp_text(x_value))
    # One radical for the whole plan: every irrational number lives in the same field Q(sqrt(r)), so equality is exact.
    radicands={r for r in (pp_radicand(v) for v in [c for piece in pieces for c in piece]+[v for pair in breaks for v in pair]) if r is not None}
    if len(radicands)>1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:'+','.join(str(r) for r in sorted(radicands)))
    return pieces,breaks,(lo,hi,states),intervals

def _pp_inside(x_value,interval,strict):
    a,b=interval
    if strict:return (a is None or a<x_value) and (b is None or x_value<b)
    return (a is None or a<=x_value) and (b is None or x_value<=b)

def piecewise_polynomial_extrema(pieces,intervals):
    """The vertex of each quadratic piece strictly inside its own interval: exact (x, y, MAX|MIN)."""
    rows=[]
    for coefficients,interval in zip(pieces,intervals):
        c0,c1,c2=coefficients
        if c2==0:continue
        h=_pp_norm(-c1/(2*c2))
        if _pp_inside(h,interval,True):rows.append((h,_pp_poly_value(coefficients,h),'MAX' if c2<0 else 'MIN'))
    return rows

def pp_quadratic_roots(c0,c1,c2):
    """The distinct real roots of c0+c1*x+c2*x^2 (exact, increasing); None when the polynomial is identically zero. The coefficients are
    p+q*sqrt(r) numbers, so the discriminant is one too and its sign and zero are decided exactly; a root may be a nested radical."""
    c0,c1,c2=_pp_norm(c0),_pp_norm(c1),_pp_norm(c2)
    if c2==0:
        if c1==0:return None if c0==0 else []
        return [_pp_norm(-c0/c1)]
    disc=_pp_norm(c1*c1-4*c2*c0)
    if disc==0:return [_pp_norm(-c1/(2*c2))]
    if S.N(disc,60)<0:return []
    root=S.sqrtdenest(S.sqrt(disc));found=[]
    for sign in (-1,1):
        value=(-c1+sign*root)/(2*c2)
        try:
            normal=_pp_norm(value)
            if abs(S.N(normal-value,60))<S.Float('1e-40',60):value=normal
        except (TypeError,ValueError,S.PolynomialError):pass
        found.append(value)
    return sorted(found,key=lambda value:float(value))

def piecewise_polynomial_crossings(pieces,intervals,level,source,slope=S.Integer(0),curve=None):
    """Every x where g(x)=slope*x+level, exactly (quadratic surds allowed), each once, in increasing order (slope 0: the horizontal line y=level).
    A piece equal to the line is refused. With curve=[c0,c1,c2] the reference is that quadratic instead (a referenceCurves entry)."""
    lo,hi,states=source;found=[]
    reference=list(curve) if curve is not None else [level,slope,S.Integer(0)]
    for coefficients,(a,b) in zip(pieces,intervals):
        roots=pp_quadratic_roots(coefficients[0]-reference[0],coefficients[1]-reference[1],coefficients[2]-reference[2])
        if roots is None:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE' if curve is not None else 'PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE')
        for root in roots:
            if a is not None and root<a or b is not None and root>b:continue
            if lo is not None and (root==lo and states[0]=='OPEN' or root==hi and states[1]=='OPEN'):continue
            if not any(pp_same(root,other) for other in found):found.append(root)
    return sorted(found,key=lambda value:float(value))

def _pp_text(value):return pp_surd_text(value)

def pp_in_closed(x_value,interval):
    """x inside the closed piece interval, where an unbounded end is None."""
    a,b=interval
    return (a is None or a<=x_value) and (b is None or x_value<=b)

def pp_in_source(x_value,source):
    """x inside the source domain; an OPEN end excludes its own value."""
    lo,hi,states=source
    if lo is not None and (x_value<lo or x_value==lo and states[0]=='OPEN'):return False
    if hi is not None and (x_value>hi or x_value==hi and states[1]=='OPEN'):return False
    return True

def pp_in_domain(x_value,interval,source):
    return pp_in_closed(x_value,interval) and pp_in_source(x_value,source)

def _pp_reference_source(entry,ref_id,breaks):
    """{kind:'ALL_REALS'} (default) or {kind:'INTERVAL',range,states} for a reference curve; exact ends, breakpoints strictly inside."""
    raw=entry.get('sourceDomain',{'kind':'ALL_REALS'})
    if raw=={'kind':'ALL_REALS'}:return None,None,['CLOSED','CLOSED']
    if isinstance(raw,dict) and raw.get('kind')=='INTERVAL':
        try:lo,hi,states=quadratic_source_interval(raw)
        except ValueError:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID:'+ref_id) from None
        lo,hi=S.Rational(lo.numerator,lo.denominator),S.Rational(hi.numerator,hi.denominator)
        if any(not lo<x_value<hi for x_value,_ in breaks):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_OUTSIDE_SOURCE_INTERVAL:'+ref_id)
        return lo,hi,list(states)
    raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID:'+ref_id)

def piecewise_ref_formula_ok(formula,ref_id,pieces,intervals):
    """A reference curve's optional display formula is the same function as its pieces: exact values at nine points of every piece."""
    if any(pp_radicand(c) is not None for piece in pieces for c in piece):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_IRRATIONAL_UNSUPPORTED:'+ref_id)
    for coefficients,(a,b) in zip(pieces,intervals):
        if a is not None and b is not None:samples=[a+(b-a)*k/8 for k in range(9)]
        elif b is not None:samples=[b-S.Rational(k,2) for k in range(9)]+[b-10,b-100]
        elif a is not None:samples=[a+S.Rational(k,2) for k in range(9)]+[a+10,a+100]
        else:samples=[S.Rational(k-4,2) for k in range(9)]+[S.Integer(-100),S.Integer(100)]
        for x_value in samples:
            value=pp_formula_value(formula,x_value)
            if S.Rational(value.numerator,value.denominator)!=_pp_poly_value(coefficients,x_value):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH:'+ref_id+':'+_pp_text(x_value))

def piecewise_reference_curves(plan,pieces,breaks,source,intervals):
    """The referenceCurves of a piecewise plan (at most two). Each is either the legacy quadratic {id,name?,coefficients,intersectionX} defined
    on the whole line, or a piecewise curve {id,name?,pieces,breakpoints?,sourceDomain?,formula?,intersectionX} with its own up to four
    continuous pieces and its own domain (open/closed ends). Exact coefficients (one radical for the whole plan), short ASCII ids, and the
    exact x of every crossing with the function that both are defined at."""
    raw=plan.get('referenceCurves',[])
    if not isinstance(raw,list) or len(raw)>2:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
    rows=[];ids=set()
    for entry in raw:
        if not isinstance(entry,dict) or set(entry)-{'id','name','coefficients','pieces','breakpoints','sourceDomain','formula','intersectionX'} or not isinstance(entry.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',entry['id']) or entry['id'] in ids:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        if 'name' in entry and not (isinstance(entry['name'],str) and re.fullmatch(r'[a-hj-wz]',entry['name'])):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        claimed=entry.get('intersectionX')
        if not isinstance(claimed,list) or len(claimed)>PIECEWISE_POLY_MAX_CURVE_INTERSECTIONS:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        ids.add(entry['id'])
        if ('coefficients' in entry)==('pieces' in entry):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        if 'coefficients' in entry:
            if 'breakpoints' in entry or 'sourceDomain' in entry or 'formula' in entry:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
            values=entry['coefficients']
            if not isinstance(values,list) or len(values)!=3:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
            coefficients=[pp_surd(value,'PIECEWISE_POLY_COEFFICIENT_INVALID') for value in values]
            if coefficients[2]==0:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC:'+entry['id'])
            rows.append({'id':entry['id'],'name':entry.get('name'),'kind':'quadratic','coefficients':coefficients,'pieces':[coefficients],'intervals':[(None,None)],'source':(None,None,['CLOSED','CLOSED']),'corners':[],'extrema':[],'intersectionX':claimed,'formula':None})
            continue
        raw_pieces=entry['pieces'];raw_breaks=entry.get('breakpoints',[])
        if not isinstance(raw_pieces,list) or not 1<=len(raw_pieces)<=PIECEWISE_POLY_MAX_PIECES:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID:'+entry['id'])
        if not isinstance(raw_breaks,list) or len(raw_breaks)!=len(raw_pieces)-1:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_COUNT_INVALID:'+entry['id'])
        ref_pieces=[]
        for piece in raw_pieces:
            if not isinstance(piece,dict) or set(piece)!={'coefficients'} or not isinstance(piece['coefficients'],list) or not 1<=len(piece['coefficients'])<=3:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_PIECE_INVALID:'+entry['id'])
            ref_pieces.append([pp_surd(value,'PIECEWISE_POLY_COEFFICIENT_INVALID') for value in piece['coefficients']]+[S.Integer(0)]*(3-len(piece['coefficients'])))
        ref_breaks=[]
        for row in raw_breaks:
            if not isinstance(row,dict) or set(row)!={'x','y'}:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID:'+entry['id'])
            ref_breaks.append((pp_surd(row['x'],'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID:'+entry['id']),pp_surd(row['y'],'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID:'+entry['id'])))
        if any(not left[0]<right[0] for left,right in zip(ref_breaks,ref_breaks[1:])):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINTS_NOT_INCREASING:'+entry['id'])
        ref_lo,ref_hi,ref_states=_pp_reference_source(entry,entry['id'],ref_breaks)
        cuts=[ref_lo,*[x_value for x_value,_ in ref_breaks],ref_hi];ref_intervals=list(zip(cuts,cuts[1:]))
        corners=[]
        for index,(x_value,y_value) in enumerate(ref_breaks):
            left,right=_pp_poly_value(ref_pieces[index],x_value),_pp_poly_value(ref_pieces[index+1],x_value)
            if left!=right:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS:'+entry['id']+':'+_pp_text(x_value))
            if left!=y_value:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_VALUE_MISMATCH:'+entry['id']+':'+_pp_text(x_value))
            corners.append((x_value,y_value))
        formula=entry.get('formula')
        if formula is not None:piecewise_ref_formula_ok(formula,entry['id'],ref_pieces,ref_intervals)
        rows.append({'id':entry['id'],'name':entry.get('name'),'kind':'piecewise','coefficients':None,'pieces':ref_pieces,'intervals':ref_intervals,'source':(ref_lo,ref_hi,ref_states),'corners':corners,'extrema':piecewise_polynomial_extrema(ref_pieces,ref_intervals),'intersectionX':claimed,'formula':formula})
    radicands={r for r in (pp_radicand(v) for v in [c for piece in pieces for c in piece]+[v for pair in breaks for v in pair]+[c for row in rows for piece in row['pieces'] for c in piece]+[v for row in rows for pair in row['corners'] for v in pair]) if r is not None}
    if len(radicands)>1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:'+','.join(str(r) for r in sorted(radicands)))
    return rows

def piecewise_reference_crossings(pieces,intervals,source,ref):
    """Every x where the function and a reference curve are both defined and equal, exactly and once (piece pair by piece pair, so a root
    outside either piece's domain or at an OPEN end is never counted). A piece equal to a reference piece is refused."""
    found=[]
    for coefficients,(a,b) in zip(pieces,intervals):
        for other,(c,d) in zip(ref['pieces'],ref['intervals']):
            roots=pp_quadratic_roots(coefficients[0]-other[0],coefficients[1]-other[1],coefficients[2]-other[2])
            if roots is None:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE')
            for root in roots:
                if not pp_in_domain(root,(a,b),source) or not pp_in_domain(root,(c,d),ref['source']):continue
                if not any(pp_same(root,seen) for seen in found):found.append(root)
    return sorted(found,key=lambda value:float(value))


def _pp_region_rows(name,from_x,to_x,pieces,intervals,refs,line_specs,region_id):
    """The exact boundary rows of one region side, clipped to [from,to]. A boundary must cover the whole interval: a gap is refused."""
    if name=='axis':
        return [([S.Integer(0),S.Integer(0),S.Integer(0)],(from_x,to_x))]
    if name=='f':
        rows=[]
        for coefficients,(a,b) in zip(pieces,intervals):
            start=from_x if a is None else max(from_x,a);end=to_x if b is None else min(to_x,b)
            if start<end:rows.append((coefficients,(start,end)))
    else:
        rows=[]
        match=[row for row in refs if row['id']==name]
        if match:
            for coefficients,(a,b) in zip(match[0]['pieces'],match[0]['intervals']):
                start=from_x if a is None else max(from_x,a);end=to_x if b is None else min(to_x,b)
                if start<end:rows.append((coefficients,(start,end)))
        elif name in line_specs:
            slope,intercept=line_specs[name]
            rows.append(([intercept,slope,S.Integer(0)],(from_x,to_x)))
        else:raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+region_id+':'+name)
    rows.sort(key=lambda row:float(row[1][0]))
    if not rows or not pp_same(rows[0][1][0],from_x):raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+name)
    for (_,first),(_,(next_start,_)) in zip(rows,rows[1:]):
        if not pp_same(first[1],next_start):raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+name)
    if not pp_same(rows[-1][1][1],to_x):raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+name)
    return rows

def _pp_region_crossings(upper_rows,lower_rows,region_id):
    """Refuse a region whose upper boundary does not stay strictly above its lower one inside (from,to). Endpoint touching is allowed."""
    for upper,upper_interval in upper_rows:
        for lower,lower_interval in lower_rows:
            start=max(upper_interval[0],lower_interval[0]);end=min(upper_interval[1],lower_interval[1])
            if not start<end:continue
            difference=[upper[i]-lower[i] for i in range(3)]
            roots=pp_quadratic_roots(*difference)
            if roots is None:raise ValueError('GRAPH_REGION_EMPTY:'+region_id)
            if any(start<root<end for root in roots):raise ValueError('GRAPH_REGION_BOUNDARIES_CROSS:'+region_id)
            if float(_pp_poly_value(difference,(start+end)/2))<=0:raise ValueError('GRAPH_REGION_BOUNDARIES_CROSS:'+region_id)

def piecewise_polynomial_regions(plan,pieces,intervals,refs,line_specs):
    """Validate graphPlan.regions and freeze their exact boundary rows. A region is a closed band between two drawn boundaries over [from,to]:
    upper/lower name 'f' (the function), 'axis' (y=0), a referenceCurve id or a referenceLine id. The engine samples the rows, so the
    boundary is the drawn curve itself; the independent observer recomputes the same rows and checks the final fill polygon."""
    raw=plan.get('regions')
    if raw is None:return []
    if not isinstance(raw,list) or len(raw)>PIECEWISE_POLY_MAX_REGIONS:raise ValueError('GRAPH_REGION_COUNT_INVALID')
    ids=set();rows=[]
    for entry in raw:
        if not isinstance(entry,dict):raise ValueError('GRAPH_REGION_FIELD_INVALID')
        unknown=sorted(set(entry)-PIECEWISE_POLY_REGION_FIELDS)
        if unknown:raise ValueError('GRAPH_REGION_FIELD_UNKNOWN:'+str(unknown[0]))
        if not {'id','upper','lower','from','to'}<=set(entry):raise ValueError('GRAPH_REGION_FIELD_INVALID')
        region_id=entry['id']
        if not isinstance(region_id,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,31}',region_id):raise ValueError('GRAPH_REGION_ID_INVALID')
        if region_id in ids:raise ValueError('GRAPH_REGION_ID_DUPLICATE:'+region_id)
        ids.add(region_id)
        if not isinstance(entry['upper'],str) or not isinstance(entry['lower'],str):raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        try:from_x=pp_exact_value(entry['from']);to_x=pp_exact_value(entry['to'])
        except ValueError:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id) from None
        if not float(from_x)<float(to_x) or abs(float(from_x))>1e6 or abs(float(to_x))>1e6:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id)
        fill=entry.get('fill','LIGHT')
        if fill not in PIECEWISE_POLY_REGION_FILLS:raise ValueError('GRAPH_REGION_FILL_UNSUPPORTED:'+region_id)
        label=entry.get('label')
        if label is not None and (not isinstance(label,str) or not label.strip() or len(label)>40):raise ValueError('GRAPH_REGION_LABEL_INVALID:'+region_id)
        upper=_pp_region_rows(entry['upper'],from_x,to_x,pieces,intervals,refs,line_specs,region_id)
        lower=_pp_region_rows(entry['lower'],from_x,to_x,pieces,intervals,refs,line_specs,region_id)
        _pp_region_crossings(upper,lower,region_id)
        rows.append({'id':region_id,'upper':entry['upper'],'lower':entry['lower'],'from':_pp_text(from_x),'to':_pp_text(to_x),'fromValue':float(from_x),'toValue':float(to_x),
                     'fill':fill,**({'label':label} if label is not None else {}),
                     'upperRows':[{'coefficients':[_pp_text(value) for value in coefficients],'interval':[_pp_text(interval[0]),_pp_text(interval[1])]} for coefficients,interval in upper],
                     'lowerRows':[{'coefficients':[_pp_text(value) for value in coefficients],'interval':[_pp_text(interval[0]),_pp_text(interval[1])]} for coefficients,interval in lower]})
    return rows

def fit_piecewise_polynomial(plan):
    if 'functionName' in plan and not (isinstance(plan['functionName'],str) and re.fullmatch(r'[a-hj-wz]',plan['functionName'])):raise ValueError('PIECEWISE_POLY_FUNCTION_NAME_INVALID')
    if 'sampleNote' in plan and (not isinstance(plan['sampleNote'],str) or not re.fullmatch(r'[0-9A-Za-z=+\-*/(). ]{1,32}',plan['sampleNote']) or not plan['sampleNote'].strip()):raise ValueError('PIECEWISE_POLY_SAMPLE_NOTE_INVALID')
    pieces,breaks,source,intervals=piecewise_polynomial_source(plan)
    lo,hi,states=source
    refs=piecewise_reference_curves(plan,pieces,breaks,source,intervals)
    def ref_value(row,x_value):
        """The exact value of a reference curve at x, or None when x is outside its own domain (open ends excluded)."""
        at=S.sympify(x_value)
        for coefficients,(a,b) in zip(row['pieces'],row['intervals']):
            if pp_in_domain(at,(a,b),row['source']):return _pp_poly_value(coefficients,at)
        return None
    def ref_float(row,x_value):
        try:at=S.Rational(str(x_value))
        except (TypeError,ValueError):at=S.Float(x_value)
        value=ref_value(row,at)
        return None if value is None else float(value)
    def ref_boundary_value(row,x_value):
        """The value at a source-domain end, including an OPEN end (its dot is drawn there even though the point is excluded)."""
        at=S.sympify(x_value)
        for coefficients,(a,b) in zip(row['pieces'],row['intervals']):
            if pp_in_closed(at,(a,b)):return _pp_poly_value(coefficients,at)
        return None
    def g(x_value):
        x_value=S.sympify(x_value)
        for coefficients,interval in zip(pieces,intervals):
            if _pp_inside(x_value,interval,False):return _pp_poly_value(coefficients,x_value)
        raise ValueError('PIECEWISE_POLY_POINT_OUTSIDE_SOURCE_DOMAIN')
    def g_float(x_value):
        for coefficients,(a,b) in zip(pieces,intervals):
            if (a is None or float(a)<=x_value+1e-12) and (b is None or x_value-1e-12<=float(b)):return sum(float(c)*x_value**i for i,c in enumerate(coefficients))
        raise ValueError('PIECEWISE_POLY_POINT_OUTSIDE_SOURCE_DOMAIN')
    corners=[(x_value,y_value) for x_value,y_value in breaks]
    extrema=piecewise_polynomial_extrema(pieces,intervals)
    # Key points the author marks: every corner and every vertex inside a piece must be among them (the claim), and each lies on the curve.
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>PIECEWISE_POLY_MAX_REQUIRED_POINTS:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_xy=[];exact_points={};normalized=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids:raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        # A coordinate is a number or an exact string (for an irrational key point such as the vertex '-3/2+sqrt(3)/2'); the exact strings become
        # the point's exactCoordinates and the figure keeps the float.
        floats={};exact={}
        for k in ('x','y'):
            value=point[k]
            if isinstance(value,str):
                try:exact[k]=pp_exact_value(value);floats[k]=float(exact[k])
                except ValueError:raise ValueError('INVALID_REQUIRED_GRAPH_POINT') from None
            elif isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
            else:floats[k]=value
            if abs(floats[k])>1e6:raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);at=exact['x'] if 'x' in exact else S.Rational(str(floats['x']))
        if lo is not None and (not lo<=at<=hi or at==lo and states[0]=='OPEN' or at==hi and states[1]=='OPEN'):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_OUTSIDE_SOURCE_DOMAIN:'+point['id'])
        # A key point lies on the function or, with referenceCurves, on one of those curves inside that curve's own domain.
        near=lambda value:abs(value-floats['y'])<=1e-8*max(1,abs(floats['y']))
        if not (near(g_float(floats['x'])) or any((value:=ref_float(row,floats['x'])) is not None and near(value) for row in refs)):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        if len(exact)==2:
            tiny=S.Float('1e-40',60)
            on_ref=lambda row:ref_value(row,exact['x']) is not None and abs(S.N(ref_value(row,exact['x'])-exact['y'],60))<=tiny
            if abs(S.N(g(exact['x'])-exact['y'],60))>tiny and not any(on_ref(row) for row in refs):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        if exact:
            exact_points[point['id']]=[pp_surd_text(exact[k]) if k in exact else (str(Fraction(str(floats[k]))) if floats[k]==int(floats[k]) else None) for k in ('x','y')]
            if None in exact_points[point['id']]:raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_MIXED_EXACT:'+point['id'])
        normalized.append({'id':point['id'],'x':floats['x'],'y':floats['y']});required_xy.append((floats['x'],floats['y']))
    required=normalized
    marked=lambda x_value,y_value:any(abs(px-float(x_value))<=1e-9*max(1,abs(px)) and abs(py-float(y_value))<=1e-9*max(1,abs(py)) for px,py in required_xy)
    for x_value,y_value in corners:
        if not marked(x_value,y_value):raise ValueError('PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value))
    for x_value,y_value,_ in extrema:
        if not marked(x_value,y_value):raise ValueError('PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value))
    # The vertex of a quadratic reference curve, and every corner and in-piece vertex of a piecewise one, is a key point the author must mark.
    for row in refs:
        if row['kind']=='quadratic':
            h=_pp_norm(-row['coefficients'][1]/(2*row['coefficients'][2]))
            row['vertex']=(h,ref_value(row,h))
            if not marked(h,row['vertex'][1]):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS:'+row['id']+':'+_pp_text(h))
            continue
        row['vertex']=None
        for x_value,y_value in row['corners']:
            if not marked(x_value,y_value):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS:'+row['id']+':'+_pp_text(x_value))
        for x_value,y_value,_ in row['extrema']:
            if not marked(x_value,y_value):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_EXTREMUM_NOT_IN_REQUIRED_POINTS:'+row['id']+':'+_pp_text(x_value))
    # The display formula (optional) must be the same function as the pieces: exact values at nine points of every piece.
    formula=plan.get('formula')
    if formula is not None:
        if any(pp_radicand(c) is not None for piece in pieces for c in piece):raise ValueError('PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED')
        for coefficients,(a,b) in zip(pieces,intervals):
            if a is not None and b is not None:samples=[a+(b-a)*k/8 for k in range(9)]
            elif b is not None:samples=[b-S.Rational(k,2) for k in range(9)]+[b-10,b-100]
            elif a is not None:samples=[a+S.Rational(k,2) for k in range(9)]+[a+10,a+100]
            else:samples=[S.Rational(k-4,2) for k in range(9)]+[S.Integer(-100),S.Integer(100)]
            for x_value in samples:
                if S.Rational(pp_formula_value(formula,x_value).numerator,pp_formula_value(formula,x_value).denominator)!=_pp_poly_value(coefficients,x_value):raise ValueError('PIECEWISE_POLY_FORMULA_MISMATCH:'+_pp_text(x_value))
    # Reference lines: horizontal y=c ({id,y,intersectionX}) or slanted y=m*x+c ({id,slope,intercept,intersectionX}, m and c exact rationals, m != 0).
    # The claimed intersection x values must be exactly the engine's own crossings, in increasing order.
    lines=plan.get('referenceLines',[])
    if not isinstance(lines,list) or len(lines)>3:raise ValueError('PIECEWISE_POLY_REFERENCE_LINES_INVALID')
    crossings=[];line_ids=set();line_specs={}
    for line in lines:
        if not isinstance(line,dict) or not isinstance(line.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',line['id']) or line['id'] in line_ids or not isinstance(line.get('intersectionX'),list) or len(line['intersectionX'])>6 or line.get('labelIntersections',False) not in (True,False):raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        keys=set(line)-{'id','intersectionX','labelIntersections'}
        if keys=={'y'}:slope=S.Integer(0)
        elif keys=={'slope','intercept'}:slope=None
        else:raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        line_ids.add(line['id'])
        if slope is None:
            slope=pp_surd(line['slope'],'PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID');level=pp_surd(line['intercept'],'PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID')
            if slope==0:raise ValueError('PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO')
            if line.get('labelIntersections',False):raise ValueError('PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED')
        else:level=pp_surd(line['y'],'PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        line_specs[line['id']]=(slope,level)
        line_radicands={r for r in (pp_radicand(slope),pp_radicand(level)) if r is not None}|{r for r in (pp_radicand(c) for piece in pieces for c in piece) if r is not None}|{r for r in (pp_radicand(v) for pair in breaks for v in pair) if r is not None}
        if len(line_radicands)>1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:'+','.join(str(r) for r in sorted(line_radicands)))
        exact=piecewise_polynomial_crossings(pieces,intervals,level,source,slope)
        claimed=sorted(((text,pp_exact_value(text)) for text in line['intersectionX']),key=lambda row:float(row[1]))
        if len(claimed)!=len(exact) or any(not pp_same(value,root) for (_,value),root in zip(claimed,exact)):
            raise ValueError('PIECEWISE_POLY_INTERSECTION_MISMATCH:'+line['id']+':engine finds '+str(len(exact))+' intersection(s)')
        # A crossing that is also a marked key point (a touching vertex, a corner on the line) is drawn once, as that key point.
        def key_at(x_value,y_value):
            return next((point for point in required if abs(point['x']-x_value)<=1e-9*max(1,abs(x_value)) and abs(point['y']-y_value)<=1e-9*max(1,abs(y_value))),None)
        height=lambda root:float(slope)*float(root)+float(level)
        def crossing_point(text,root):
            # A crossing that is also a marked key point takes that point's float coordinates (one value for the dot, the label and the sampler).
            x_float=float(root);y_float=height(root) if slope!=0 else float(level);key_point=key_at(x_float,y_float)
            if key_point is not None:x_float,y_float=key_point['x'],key_point['y']
            row={'x':text.replace(' ',''),'xValue':x_float}
            if slope!=0:row['yValue']=y_float
            if key_point is not None:row['keyPoint']=key_point['id']
            return row
        if slope==0:crossings.append({'lineId':line['id'],'y':_pp_text(level),'points':[crossing_point(text,root) for (text,_),root in zip(claimed,exact)]})
        else:crossings.append({'lineId':line['id'],'slope':_pp_text(slope),'intercept':_pp_text(level),'points':[crossing_point(text,root) for (text,_),root in zip(claimed,exact)]})
    # Reference curves: every crossing with the function, claimed exactly (as for a line), drawn once as a dot or as the key point it coincides with.
    curve_crossings=[]
    for row in refs:
        if row['id'] in line_ids:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        exact=piecewise_reference_crossings(pieces,intervals,source,row)
        claimed=sorted(((text,pp_exact_value(text)) for text in row['intersectionX']),key=lambda item:float(item[1]))
        if len(claimed)!=len(exact) or any(not pp_same(value,root) for (_,value),root in zip(claimed,exact)):
            raise ValueError('PIECEWISE_POLY_INTERSECTION_MISMATCH:'+row['id']+':engine finds '+str(len(exact))+' intersection(s)')
        points=[]
        for (text,_),root in zip(claimed,exact):
            x_float=float(root);y_float=float(ref_value(row,root))
            key_point=next((point for point in required if abs(point['x']-x_float)<=1e-9*max(1,abs(x_float)) and abs(point['y']-y_float)<=1e-9*max(1,abs(y_float))),None)
            if key_point is not None:x_float,y_float=key_point['x'],key_point['y']
            entry={'x':text.replace(' ',''),'xValue':x_float,'yValue':y_float}
            if key_point is not None:entry['keyPoint']=key_point['id']
            points.append(entry)
        curve_crossings.append({'curveId':row['id'],'points':points})
    # Shaded graph regions (graphPlan.regions): exact boundary rows against the function, the x-axis, a reference curve or a line.
    regions=piecewise_polynomial_regions(plan,pieces,intervals,refs,line_specs)
    key=[(float(x_value),float(y_value)) for x_value,y_value in corners]+[(float(x_value),float(y_value)) for x_value,y_value,_ in extrema]+required_xy
    key+=[(point['xValue'],point['yValue'] if 'slope' in row else pp_exact_float(row['y'])) for row in crossings for point in row['points']]
    key+=[(0.0,pp_exact_float(row['intercept'] if 'slope' in row else row['y'])) for row in crossings if not row['points']]
    key+=[(point['xValue'],point['yValue']) for row in curve_crossings for point in row['points']]
    key+=[(float(row['vertex'][0]),float(row['vertex'][1])) for row in refs if row.get('vertex')]
    key+=[(x,y) for x,y in plan.get('overlayAnchors',[])]
    # A piecewise reference curve also contributes its own corners, in-piece vertices and its domain ends (drawn as hollow/filled dots).
    for row in refs:
        if row['kind']!='piecewise':continue
        key+=[(float(x_value),float(y_value)) for x_value,y_value in row['corners']]
        key+=[(float(x_value),float(y_value)) for x_value,y_value,_ in row['extrema']]
        ref_lo,ref_hi,_=row['source']
        if ref_lo is not None:key.append((float(ref_lo),float(ref_boundary_value(row,ref_lo))))
        if ref_hi is not None:key.append((float(ref_hi),float(ref_boundary_value(row,ref_hi))))
    limit=plot_height_limit(plan)
    if lo is not None:
        ends=[(float(lo),float(g(lo))),(float(hi),float(g(hi)))]
    else:
        # Unbounded outer pieces: each arm runs on beyond the outermost key point, by a fifth of the key width (at least 1), but stops where it
        # leaves the key heights by a quarter of their range (at least 1), so a steep arm never flattens the figure.
        xs=[p[0] for p in key] or [0.0];ys=[p[1] for p in key] or [0.0]
        span=max(xs)-min(xs);extend=max(1.0,.2*span);ylo,yhi=min(ys),max(ys);band=max(1.0,.25*(yhi-ylo))
        ref_heights=lambda at:[value for value in (ref_float(row,at) for row in refs) if value is not None]
        inband=lambda at:all(ylo-band<=height<=yhi+band for height in [g_float(at)]+ref_heights(at))
        def arm(start,direction):
            far=start+direction*extend
            if inband(far):return far
            near=start
            for _ in range(60):
                mid=(near+far)/2
                if inband(mid):near=mid
                else:far=mid
            return near
        left_x,right_x=arm(min(xs),-1),arm(max(xs),1)
        ends=[(left_x,g_float(left_x)),(right_x,g_float(right_x))]
    for region in regions:
        if region['fromValue']<ends[0][0]-1e-9 or region['toValue']>ends[1][0]+1e-9:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region['id'])
    for attempt in range(2):
        ref_end_points=[(end[0],value) for end in ends for value in (ref_float(row,end[0]) for row in refs) if value is not None]
        points=[(0.0,0.0)]+key+ends+ref_end_points
        for ratio in axis_ratios(plan,points,limit):
            viewport,height,scale=equal_unit_frame(points,limit,ratio)
            if (ends[1][0]-ends[0][0])*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
        else:raise ValueError('PIECEWISE_POLY_CURVE_TOO_NARROW')
        if lo is not None or attempt:break
        # An arm shorter than 12 px beyond the outermost key point is lengthened once and the figure framed again.
        key_lo,key_hi=min([p[0] for p in key] or [0.0]),max([p[0] for p in key] or [0.0])
        if (key_lo-ends[0][0])*scale>=PIECEWISE_POLY_MIN_ARM_PX and (ends[1][0]-key_hi)*scale>=PIECEWISE_POLY_MIN_ARM_PX:break
        left_x=min(ends[0][0],key_lo-PIECEWISE_POLY_MIN_ARM_PX/scale);right_x=max(ends[1][0],key_hi+PIECEWISE_POLY_MIN_ARM_PX/scale)
        ends=[(left_x,g_float(left_x)),(right_x,g_float(right_x))]
    # Distinct marked features closer than 4 px could not be told apart.
    marks=[]
    for mark in sorted(set(key)):
        if not any(abs(mark[0]-m[0])<=1e-9*max(1,abs(m[0])) and abs(mark[1]-m[1])<=1e-9*max(1,abs(m[1])) for m in marks):marks.append(mark)
    for index,(ax,ay) in enumerate(marks):
        for bx,by in marks[index+1:]:
            if math.hypot((ax-bx)*scale,(ay-by)*scale*ratio)<PIECEWISE_POLY_MIN_FEATURE_GAP_PX:raise ValueError('PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION')
    draw=[ends[0][0],ends[1][0]]
    piece_rows=[]
    for coefficients,(a,b) in zip(pieces,intervals):
        start=draw[0] if a is None else float(a);end=draw[1] if b is None else float(b)
        piece_rows.append({'coefficients':[_pp_text(c) for c in coefficients],'interval':[None if a is None else _pp_text(a),None if b is None else _pp_text(b)],'drawInterval':[start,end]})
    features={'schemaVersion':'PIECEWISE_POLYNOMIAL_FEATURES_v1','pieces':piece_rows,'corners':[{'x':_pp_text(x_value),'y':_pp_text(y_value)} for x_value,y_value in corners],'extrema':[{'x':_pp_text(x_value),'y':_pp_text(y_value),'kind':kind} for x_value,y_value,kind in extrema],'intersections':crossings}
    if regions:
        features['regions']=[{'id':row['id'],'upper':row['upper'],'lower':row['lower'],'from':row['from'],'to':row['to'],'domain':[row['fromValue'],row['toValue']],'fill':row['fill'],**({'label':row['label']} if 'label' in row else {}),'upperRows':row['upperRows'],'lowerRows':row['lowerRows']} for row in regions]
    if refs:
        ref_rows=[]
        for row in refs:
            if row['kind']=='quadratic':
                ref_rows.append({'id':row['id'],'coefficients':[_pp_text(c) for c in row['coefficients']],'drawInterval':draw})
                continue
            drawn=[]
            for coefficients,(a,b) in zip(row['pieces'],row['intervals']):
                start=draw[0] if a is None else max(draw[0],float(a));end=draw[1] if b is None else min(draw[1],float(b))
                if end-start<=1e-9:continue
                drawn.append({'coefficients':[_pp_text(c) for c in coefficients],'interval':[None if a is None else _pp_text(a),None if b is None else _pp_text(b)],'drawInterval':[start,end]})
            if not drawn:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_OUTSIDE_VIEW:'+row['id'])
            entry={'id':row['id'],'pieces':drawn,'corners':[{'x':_pp_text(x_value),'y':_pp_text(y_value)} for x_value,y_value in row['corners']],'extrema':[{'x':_pp_text(x_value),'y':_pp_text(y_value),'kind':kind} for x_value,y_value,kind in row['extrema']]}
            ref_lo,ref_hi,ref_states=row['source']
            if ref_lo is not None:entry['sourceInterval']={'lo':_pp_text(ref_lo),'hi':_pp_text(ref_hi),'startState':ref_states[0],'endState':ref_states[1],'startY':_pp_text(ref_boundary_value(row,ref_lo)),'endY':_pp_text(ref_boundary_value(row,ref_hi))}
            if row.get('name') is not None:entry['name']=row['name']
            if row.get('formula') is not None:entry['formula']=row['formula']
            ref_rows.append(entry)
        features['referenceCurves']=ref_rows;features['curveIntersections']=curve_crossings
    fitted={key_name:value for key_name,value in plan.items() if key_name not in ('domain','viewport')}
    if exact_points:
        merged=dict(plan.get('exactCoordinates') or {})
        if any(point_id in merged and merged[point_id]!=pair for point_id,pair in exact_points.items()):raise ValueError('PIECEWISE_POLY_EXACT_COORDINATES_CONFLICT')
        merged.update(exact_points);fitted['exactCoordinates']=merged
    fitted['requiredPoints']=required
    fitted.update({'domain':draw,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','piecewisePolynomialFeatures':features,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}})
    if lo is not None:
        fitted['intervalFeatures']={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':_pp_text(lo),'y':_pp_text(g(lo)),'state':states[0]},{'side':'END','x':_pp_text(hi),'y':_pp_text(g(hi)),'state':states[1]}]}
        fitted['intervalFeaturePolicy']={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    return {'graphPlan':fitted,'policy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

# ---------------------------------------------------------------------------
# Graph overlays (G1): one general graphPlan.overlays object draws lines, vertical lines, segments between named points, dashed guide
# segments to the axes, simple polygons and extra named points on the curve. Every coordinate is recomputed here exactly; the plan names
# the points and the elements, never raw derived coordinates. The fitted plan carries overlaysFeatures (numeric, for the model/spec) and
# the independent graph observer recomputes the same values from the raw overlays field and reads the FINAL SVG back.
OVERLAY_LIMITS={'points':8,'lines':6,'segments':6,'guides':4,'polygons':2}

def _overlay_fail(code,ident=None):
    raise ValueError(code if ident is None else code+':'+str(ident))

def _overlay_exact(value,ident):
    try:
        number=pp_exact_value(value)
    except ValueError:
        _overlay_fail('OVERLAY_VALUE_INVALID',ident)
    if not number.is_real or not number.is_finite:
        _overlay_fail('OVERLAY_VALUE_INVALID',ident)
    return number

def _overlay_id(value,kind):
    if not isinstance(value,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_\']{0,11}',value):
        _overlay_fail('OVERLAY_ID_INVALID',kind)
    return value

def _overlay_base(value):
    if value in (None,'e'):return S.E
    try:
        return exp_log_base(value,'OVERLAY_BASE_INVALID')['exact']
    except (ValueError,KeyError,TypeError):
        _overlay_fail('OVERLAY_BASE_INVALID',str(value))

def _overlay_curve_exact(plan,x_value,curve_id=None):
    """The exact y of the plan's drawn function at x, from the same exact coefficients the family framer used. Raises
    OVERLAY_POINT_NOT_ON_CURVE when the curve is undefined there (outside a source domain, pole, negative radicand, ...)."""
    family=plan.get('family')
    try:
        if family=='polynomial':
            return sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['coefficients'])),S.Integer(0))
        if family=='rational':
            numerator=sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['numerator'])),S.Integer(0))
            denominator=sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['denominator'])),S.Integer(0))
            if denominator==0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
            return numerator/denominator
        if family=='sqrt-affine':
            radicand=sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['radicand'])),S.Integer(0))
            if radicand<0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
            return S.sqrt(radicand)
        if family=='absolute-value':
            b,a,scale,offset=(_overlay_exact(value,'curve') for value in plan['coefficients'])
            return scale*S.Abs(a*x_value+b)+offset
        if family=='piecewise-affine':
            source=plan.get('sourceDomain') or {};interval=source.get('range')
            if interval:
                lo,hi=(_overlay_exact(value,'curve') for value in interval)
                if not lo<=x_value<=hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',str(x_value))
            break_x=_overlay_exact(plan['piecewise']['breakX'],'curve');owner=plan['piecewise'].get('owner','RIGHT')
            left=plan['piecewise']['left'];right=plan['piecewise']['right'];coefficients=left if x_value<break_x or (x_value==break_x and owner=='LEFT') else right
            return _overlay_exact(coefficients[0],'curve')*x_value+_overlay_exact(coefficients[1],'curve')
        if family=='exponential-affine':
            a,k,c=(_overlay_exact(value,'curve') for value in plan['coefficients']);base=_overlay_base(plan.get('base'));shift=_overlay_exact(plan.get('shiftX','0'),'curve')
            return a*base**(k*(x_value-shift))+c
        if family=='logarithmic-affine':
            a,k,b,c=(_overlay_exact(value,'curve') for value in plan['coefficients']);base=_overlay_base(plan.get('base'));argument=k*x_value+b
            if argument<=0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
            return a*S.log(argument)/S.log(base)+c
        if family=='trigonometric':
            a,k,c=(_overlay_exact(value,'curve') for value in plan['coefficients']);phase=_overlay_exact(plan.get('phasePi','0'),'curve')
            argument=k*x_value+phase*S.pi;function=plan.get('function','SIN')
            value={'SIN':S.sin,'COS':S.cos,'TAN':S.tan}.get(function)
            if value is None:_overlay_fail('OVERLAY_CURVE_UNSUPPORTED',function)
            return a*value(argument)+c
        if family=='piecewise-polynomial':
            pieces=plan.get('pieces') or [];breaks=plan.get('breakpoints') or [];source=plan.get('sourceDomain') or {}
            lo=hi=None
            if source.get('kind')=='INTERVAL':
                range_=source.get('range') or [None,None];lo,hi=(None if value is None else _overlay_exact(value,'curve') for value in range_)
            if lo is not None and x_value<lo or hi is not None and x_value>hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',str(x_value))
            cut=[_overlay_exact(breakpoint['x'],'curve') for breakpoint in breaks]
            for index,piece in enumerate(pieces):
                left=None if index==0 else cut[index-1];right=None if index==len(pieces)-1 else cut[index]
                if (left is None or left<=x_value) and (right is None or x_value<=right):
                    return sum((_overlay_exact(coefficient,'curve')*x_value**power for power,coefficient in enumerate(piece.get('coefficients') or [])),S.Integer(0))
            _overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
        if family=='exp-log-pair':
            rows=plan.get('curves') or []
            row=next((item for item in rows if item.get('id')==curve_id),None)
            if row is None:_overlay_fail('OVERLAY_CURVE_UNKNOWN',str(curve_id))
            if row.get('family')=='exponential-affine':
                a,k,c=(_overlay_exact(value,'curve') for value in row['coefficients']);base=_overlay_base(row.get('base'));shift=_overlay_exact(row.get('shiftX','0'),'curve')
                return a*base**(k*(x_value-shift))+c
            if row.get('family')=='logarithmic-affine':
                a,k,b,c=(_overlay_exact(value,'curve') for value in row['coefficients']);base=_overlay_base(row.get('base'));argument=k*x_value+b
                if argument<=0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
                return a*S.log(argument)/S.log(base)+c
            _overlay_fail('OVERLAY_CURVE_UNSUPPORTED',str(curve_id))
    except (KeyError,IndexError,TypeError):
        _overlay_fail('OVERLAY_CURVE_UNSUPPORTED',family)
    _overlay_fail('OVERLAY_CURVE_UNSUPPORTED',family)

def _overlay_number(value):
    return float(S.N(value,30))

def _overlay_line_text(line):
    if line.get('label') is not None:
        if not isinstance(line['label'],str) or not re.fullmatch(r'[0-9A-Za-z=+\-*/().\^ ]{1,40}',line['label']):
            _overlay_fail('OVERLAY_LABEL_INVALID',line.get('id'))
        return line['label']
    if line['kind']=='VERTICAL':return 'x='+pp_surd_text(line['x'])
    slope,intercept=line['slope'],line['intercept']
    if slope=='0':return 'y='+pp_surd_text(intercept)
    slope_text='x' if slope=='1' else '-x' if slope=='-1' else (slope if re.fullmatch(r'-?\d+(?:/\d+)?',slope) else '('+slope+')')+'*x'
    if intercept=='0':return 'y='+slope_text
    sign='-' if intercept.startswith('-') else '+'
    return 'y='+slope_text+sign+pp_surd_text(intercept).lstrip('-')

def _overlay_label_anchor(viewport,line):
    xmin,xmax,ymin,ymax=viewport;spanx=xmax-xmin;spany=ymax-ymin
    if line['kind']=='VERTICAL':return [_overlay_number(line['x']),ymax-spany*.08]
    m=_overlay_number(line['slope']);q=_overlay_number(line['intercept'])
    for fraction in (.85,.15,.5):
        x=xmin+spanx*fraction;y=m*x+q
        if ymin+spany*.05<=y<=ymax-spany*.05:return [x,y]
    if m!=0:
        y=ymax-spany*.05;x=(y-q)/m
        if xmin+spanx*.05<=x<=xmax-spanx*.05:return [x,y]
    return [xmin+spanx*.85,ymax-spany*.08]

def _overlay_line_crosses_view(viewport,line):
    xmin,xmax,ymin,ymax=viewport
    if line['kind']=='VERTICAL':return xmin<_overlay_number(pp_exact_value(line['x']))<xmax
    m=_overlay_number(pp_exact_value(line['slope']));q=_overlay_number(pp_exact_value(line['intercept']))
    y_left=m*xmin+q;y_right=m*xmax+q
    if ymin<=y_left<=ymax or ymin<=y_right<=ymax:return True
    if m==0:return ymin<q<ymax
    x_bottom=(ymin-q)/m;x_top=(ymax-q)/m
    return max(xmin,min(x_bottom,x_top))<min(xmax,max(x_bottom,x_top))

def _overlay_features(plan):
    raw=plan.get('overlays')
    if raw is None:return None
    if not isinstance(raw,dict) or set(raw)-set(OVERLAY_LIMITS):_overlay_fail('OVERLAY_PLAN_INVALID')
    for key,limit in OVERLAY_LIMITS.items():
        rows=raw.get(key,[])
        if not isinstance(rows,list) or len(rows)>limit:_overlay_fail('OVERLAY_TOO_MANY',key)
    seen=set()
    def claim(ident,code='OVERLAY_ID_DUPLICATE'):
        if ident in seen:_overlay_fail(code,ident)
        seen.add(ident)
    lines=[]
    for entry in raw.get('lines',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_LINE_INVALID','line')
        if set(entry)-{'id','slope','intercept','x','label'}:_overlay_fail('OVERLAY_LINE_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'line');claim('line:'+ident)
        if 'x' in entry:
            if 'slope' in entry or 'intercept' in entry:_overlay_fail('OVERLAY_LINE_INVALID',ident)
            x=_overlay_exact(entry['x'],ident)
            line={'id':ident,'kind':'VERTICAL','x':pp_surd_text(x),'xValue':_overlay_number(x),'label':entry.get('label')}
        else:
            if 'slope' not in entry or 'intercept' not in entry:_overlay_fail('OVERLAY_LINE_INVALID',ident)
            slope=_overlay_exact(entry['slope'],ident);intercept=_overlay_exact(entry['intercept'],ident)
            line={'id':ident,'kind':'LINE','slope':pp_surd_text(slope),'intercept':pp_surd_text(intercept),'slopeValue':_overlay_number(slope),'interceptValue':_overlay_number(intercept),'label':entry.get('label')}
        line['text']=_overlay_line_text(line)
        if not _overlay_line_crosses_view(plan['viewport'],line):_overlay_fail('OVERLAY_LINE_OUTSIDE_VIEWPORT',ident)
        line['labelAt']=_overlay_label_anchor(plan['viewport'],line)
        lines.append(line)
    by_line={line['id']:line for line in lines}
    points=[];by_point={}
    required_ids={point.get('id') for point in plan.get('requiredPoints',[]) if isinstance(point,dict)}
    for entry in raw.get('points',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_POINT_INVALID','point')
        if set(entry)-{'id','curveX','curve','x','y','axis','value','intersect'}:_overlay_fail('OVERLAY_POINT_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'point')
        if ident in required_ids:_overlay_fail('OVERLAY_POINT_ID_CONFLICT',ident)
        claim('point:'+ident)
        forms=sum(1 for key in ('curveX','intersect','axis','x') if key in entry)
        if forms!=1 or ('curve' in entry and 'curveX' not in entry) or ('value' in entry)!=(entry.get('axis') is not None):_overlay_fail('OVERLAY_POINT_INVALID',ident)
        if 'curveX' in entry:
            x=_overlay_exact(entry['curveX'],ident)
            curve_id=entry.get('curve')
            if plan.get('family')=='exp-log-pair' and curve_id is None:_overlay_fail('OVERLAY_CURVE_REQUIRED',ident)
            if plan.get('family')!='exp-log-pair' and curve_id is not None:_overlay_fail('OVERLAY_CURVE_UNKNOWN',ident)
            lo,hi=plan['domain']
            if not lo<=float(S.N(x,30))<=hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',ident)
            y=_overlay_curve_exact(plan,x,curve_id)
        elif 'intersect' in entry:
            pair=entry['intersect']
            if not isinstance(pair,list) or len(pair)!=2 or len(set(pair))!=2:_overlay_fail('OVERLAY_POINT_INVALID',ident)
            first=by_line.get(pair[0]);second=by_line.get(pair[1])
            if first is None or second is None:_overlay_fail('OVERLAY_POINT_UNKNOWN',ident)
            if first['kind']=='VERTICAL' and second['kind']=='VERTICAL':_overlay_fail('OVERLAY_LINE_PARALLEL',ident)
            if first['kind']=='VERTICAL':x=pp_exact_value(first['x']);y=pp_exact_value(second['slope'])*x+pp_exact_value(second['intercept'])
            elif second['kind']=='VERTICAL':x=pp_exact_value(second['x']);y=pp_exact_value(first['slope'])*x+pp_exact_value(first['intercept'])
            else:
                m1=pp_exact_value(first['slope']);q1=pp_exact_value(first['intercept']);m2=pp_exact_value(second['slope']);q2=pp_exact_value(second['intercept'])
                if m1==m2:_overlay_fail('OVERLAY_LINE_PARALLEL',ident)
                x=(q2-q1)/(m1-m2);y=m1*x+q1
        elif 'axis' in entry:
            axis=entry.get('axis');value=_overlay_exact(entry.get('value'),ident)
            if axis=='x':x,y=value,S.Integer(0)
            elif axis=='y':x,y=S.Integer(0),value
            else:_overlay_fail('OVERLAY_POINT_INVALID',ident)
        else:
            x=_overlay_exact(entry['x'],ident);y=_overlay_exact(entry['y'],ident)
        xmin,xmax,ymin,ymax=plan['viewport'];xf,yf=_overlay_number(x),_overlay_number(y)
        if not (xmin<xf<xmax and ymin<yf<ymax):_overlay_fail('OVERLAY_POINT_OUTSIDE_VIEWPORT',ident)
        row={'id':ident,'x':xf,'y':yf,'xExact':pp_surd_text(x),'yExact':pp_surd_text(y)}
        points.append(row);by_point[ident]=row
    def point_ref(value,ident):
        if not isinstance(value,str) or value not in by_point:_overlay_fail('OVERLAY_POINT_UNKNOWN',ident)
        return value
    segments=[]
    for entry in raw.get('segments',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_SEGMENT_INVALID','segment')
        if set(entry)-{'id','from','to','dashed'}:_overlay_fail('OVERLAY_SEGMENT_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'segment');claim('segment:'+ident)
        start=point_ref(entry.get('from'),ident);end=point_ref(entry.get('to'),ident)
        if start==end:_overlay_fail('OVERLAY_SEGMENT_DEGENERATE',ident)
        dashed=entry.get('dashed',False)
        if not isinstance(dashed,bool):_overlay_fail('OVERLAY_SEGMENT_INVALID',ident)
        segments.append({'id':ident,'from':start,'to':end,'dashed':dashed})
    guides=[]
    for entry in raw.get('guides',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_GUIDE_INVALID','guide')
        if set(entry)-{'id','from','axis','dashed'}:_overlay_fail('OVERLAY_GUIDE_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'guide');claim('guide:'+ident)
        start=point_ref(entry.get('from'),ident);axis=entry.get('axis','BOTH')
        if axis not in ('x','y','BOTH'):_overlay_fail('OVERLAY_GUIDE_INVALID',ident)
        dashed=entry.get('dashed',True)
        if not isinstance(dashed,bool):_overlay_fail('OVERLAY_GUIDE_INVALID',ident)
        guides.append({'id':ident,'from':start,'axis':axis,'dashed':dashed})
    polygons=[]
    for entry in raw.get('polygons',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_POLYGON_INVALID','polygon')
        if set(entry)-{'id','points','fill'}:_overlay_fail('OVERLAY_POLYGON_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'polygon');claim('polygon:'+ident)
        refs=entry.get('points')
        if not isinstance(refs,list) or not 3<=len(refs)<=6 or len(set(refs))!=len(refs):_overlay_fail('OVERLAY_POLYGON_INVALID',ident)
        refs=[point_ref(value,ident) for value in refs]
        fill=entry.get('fill','LIGHT')
        if fill not in ('LIGHT','MEDIUM','NONE'):_overlay_fail('OVERLAY_FILL_INVALID',ident)
        coords=[(by_point[value]['x'],by_point[value]['y']) for value in refs]
        area=sum(coords[i][0]*coords[(i+1)%len(coords)][1]-coords[(i+1)%len(coords)][0]*coords[i][1] for i in range(len(coords)))
        if abs(area)<1e-9:_overlay_fail('OVERLAY_POLYGON_DEGENERATE',ident)
        polygons.append({'id':ident,'points':refs,'fill':fill})
    return {'schemaVersion':'GRAPH_OVERLAYS_FEATURES_v1','points':points,'lines':lines,'segments':segments,'guides':guides,'polygons':polygons}

def _overlay_anchor_points(plan):
    """Best-effort exact coordinates of every declared overlay point, computed before framing so the family framer can put the whole
    declared overlay inside its window (a point in the source domain still needs the frame to reach it). Validation is not done here:
    _overlay_features remains the single authority after framing, so a bad entry still gets its own explicit error code."""
    raw=plan.get('overlays')
    if not isinstance(raw,dict):return []
    lines={}
    for entry in raw.get('lines') or []:
        if not isinstance(entry,dict):continue
        try:
            if 'x' in entry:lines[entry.get('id')]=('V',_overlay_exact(entry['x'],'line'))
            elif 'slope' in entry and 'intercept' in entry:lines[entry.get('id')]=('L',(_overlay_exact(entry['slope'],'line'),_overlay_exact(entry['intercept'],'line')))
        except (ValueError,TypeError):continue
    viewport=plan.get('viewport');domain=plan.get('domain');anchors=[]
    for entry in raw.get('points') or []:
        if not isinstance(entry,dict):continue
        try:
            on_curve=False
            if 'curveX' in entry:
                x=_overlay_exact(entry['curveX'],'point');y=_overlay_curve_exact(plan,x,entry.get('curve'));on_curve=True
            elif 'intersect' in entry:
                pair=entry['intersect'];first=lines.get(pair[0]);second=lines.get(pair[1])
                if first is None or second is None:continue
                if first[0]=='V' and second[0]=='V':continue
                if first[0]=='V':x=first[1];y=second[1][0]*x+second[1][1]
                elif second[0]=='V':x=second[1];y=first[1][0]*x+first[1][1]
                else:
                    m1,q1=first[1];m2,q2=second[1]
                    if m1==m2:continue
                    x=(q2-q1)/(m1-m2);y=m1*x+q1
            elif 'axis' in entry:
                value=_overlay_exact(entry.get('value'),'point')
                x,y=(value,S.Integer(0)) if entry.get('axis')=='x' else (S.Integer(0),value)
            elif 'x' in entry and 'y' in entry:
                x,y=_overlay_exact(entry['x'],'point'),_overlay_exact(entry['y'],'point')
            else:continue
            xf,yf=float(S.N(x,30)),float(S.N(y,30))
            if not (math.isfinite(xf) and math.isfinite(yf)):continue
            # A declared point outside the author's reviewed draw interval or viewport is not a frame anchor: the framer must not
            # enlarge its window to make an invalid claim look valid (the overlay validator then refuses it).
            if on_curve and isinstance(domain,list) and len(domain)==2 and not (domain[0]-1e-9<=xf<=domain[1]+1e-9):continue
            if isinstance(viewport,list) and len(viewport)==4 and not (viewport[0]-1e-9<=xf<=viewport[1]+1e-9 and viewport[2]-1e-9<=yf<=viewport[3]+1e-9):continue
            anchors.append((xf,yf))
        except (ValueError,KeyError,TypeError,ZeroDivisionError):continue
    return anchors

def fit_overview(plan):
    """The family framer, then the optional graph overlays: every overlay coordinate is recomputed exactly and must stay inside the
    framed viewport. The fitted plan carries overlaysFeatures for the model/spec; the independent observer recomputes them from the raw
    overlays field. Unsupported or out-of-view overlays are refused, never silently dropped."""
    anchors=_overlay_anchor_points(plan)
    framed=_fit_overview_family({**plan,'overlayAnchors':anchors} if anchors else plan)
    framed['graphPlan'].pop('overlayAnchors',None)
    features=_overlay_features(framed['graphPlan'])
    if features is None:return framed
    framed['graphPlan']={**framed['graphPlan'],'overlaysFeatures':features}
    return framed
