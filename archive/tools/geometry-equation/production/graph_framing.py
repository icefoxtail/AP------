"""Bounded overview fitting. Display windows do not change source domains."""
import math
import re
from fractions import Fraction
import sympy as S

_x=S.Symbol('x',real=True)

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
    roots=_real_root_rows(polynomial)
    if any(multiplicity!=1 for _,multiplicity in roots):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_REPEATED_ROOT')
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
    coordinates=[0.0,*feature_x,*required_x]
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
    if degree==4:
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
    values=[evaluate(lo),evaluate(hi),0.0,*[row['y'] for row in math_features],*required_y]
    low,high=min(values),max(values);span=max(1.0,high-low,abs(low),abs(high));padding=.15*span
    ymin=min(0.0,low)-padding;ymax=max(0.0,high)+padding
    sign=1 if polynomial.LC()>0 else -1
    left_sign=sign if degree%2==0 else -sign
    end_directions={'left':'UP' if left_sign>0 else 'DOWN','right':'UP' if sign>0 else 'DOWN'}
    end_slope_directions={'left':'DOWN' if end_directions['left']=='UP' else 'UP','right':end_directions['right']}
    tail_features=[{'id':'tail-left','kind':'TAIL_DIRECTION','side':'LEFT','endpointX':lo,'direction':end_directions['left'],'slopeDirection':end_slope_directions['left']},{'id':'tail-right','kind':'TAIL_DIRECTION','side':'RIGHT','endpointX':hi,'direction':end_directions['right'],'slopeDirection':end_slope_directions['right']}]
    features=[*math_features,*tail_features]
    feature_policy={'schemaVersion':'POLYNOMIAL_CUBIC_QUARTIC_FEATURE_POLICY_v1','repeatedSourceRootPolicy':'UNSUPPORTED','minimumDistinctFeatureSeparationCssPx':1,'stationaryInflectionPolicy':'MERGE_ROLES_AT_SAME_POINT'}
    fitted={**plan,'domain':[lo,hi],'viewport':[lo,hi,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','overviewFeatures':features,'overviewFeaturePolicy':feature_policy,'overviewEndDirections':end_directions}
    return {'graphPlan':fitted,'policy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def fit_overview(plan):
    if plan.get('family')=='rational':return _fit_rational_overview(plan)
    if plan.get('family')=='sqrt-affine':return _fit_sqrt_affine_overview(plan)
    if plan.get('family')=='absolute-value':return _fit_absolute_value_overview(plan)
    if plan.get('family')=='piecewise-affine':return _fit_piecewise_affine_overview(plan)
    if plan.get('family')=='exponential-affine':return _fit_exponential_affine_overview(plan)
    if plan.get('family')=='logarithmic-affine':return _fit_logarithmic_affine_overview(plan)
    if plan.get('family')=='trigonometric':return _fit_trigonometric_overview(plan)
    if plan.get('family')=='piecewise-polynomial':return fit_piecewise_polynomial(plan)
    if plan.get('family')!='polynomial':raise ValueError('UNSUPPORTED_OVERVIEW_FAMILY')
    values=plan.get('coefficients')
    if not isinstance(values,list) or not 1<=len(values)<=5 or any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values):raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    try:c=[Fraction(v) for v in values]
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_FRAMING_COEFFICIENTS') from None
    while len(c)>1 and c[-1]==0:c.pop()
    if len(c) in (4,5):return _fit_cubic_quartic(plan,c)
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
    radius=min(hf-lo,hi-hf)/1.15
    if any(not lo<=p['x']<=hi for p in required):raise ValueError('REQUIRED_FEATURE_OUTSIDE_REVIEWED_DRAW_INTERVAL')
    # The curve is drawn over [lo,hi], so its height there decides the frame (radius alone left the drawn ends above ymax).
    span=max(hf-lo,hi-hf)
    rise=max([abs(af)*span*span]+[1.15*abs(p['y']-kf) for p in required+line_points])
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
    points=[(0.0,0.0),(hf,kf),(hf-natural,kf+rise),(hf+natural,kf+rise)]+[(p['x'],p['y']) for p in required+line_points]
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
    radius=max(6.0,abs(singularity_x)*1.25+.5,abs(root_x-singularity_x)*1.2+1.0,*[abs(px-singularity_x)*1.2 for px in required_x])
    lo,hi=singularity_x-radius,singularity_x+radius
    def evaluate_exact(x_value):
        exact_x=Fraction(str(x_value));den=numerator[0]*0+denominator[0]+denominator[1]*exact_x
        if den==0:raise ValueError('RATIONAL_FRAME_ENDPOINT_IS_SINGULAR')
        return float((numerator[0]+numerator[1]*exact_x)/den)
    endpoint_values=[evaluate_exact(lo),evaluate_exact(hi)]
    key_values=[0.0,float(horizontal),*required_y]
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

def _fit_trigonometric_overview(plan):
    function=plan.get('function')
    if function not in {'SIN','COS','TAN'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
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
            phase_offset*=1 if index>=0 else 1
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

# ---- piecewise polynomial: one continuous y=g(x) of up to three pieces (degree <= 2 each) plus up to three horizontal lines y=c ----------
# The plan claims the breakpoint values, marks every corner and every vertex inside a piece as a requiredPoint, and lists the exact x of every
# intersection with each line. All of it is recomputed here exactly (Fractions, SymPy surds) and a disagreement refuses the plan.
PIECEWISE_POLY_FIELDS={'family','pieces','breakpoints','sourceDomain','formula','referenceLines','requiredPoints','exactCoordinates','axisTickValues','domain','viewport','axisSqueeze','plotHeightLimit'}
PIECEWISE_POLY_MIN_ARM_PX=12
PIECEWISE_POLY_MIN_FEATURE_GAP_PX=4

def _pp_rational(value,code):
    """An exact rational: a decimal integer, an 'a/b' string, or a JSON integer."""
    if isinstance(value,bool) or not (isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value)):raise ValueError(code)
    try:return Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None

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
    return sum((c*x_value**i for i,c in enumerate(coefficients)),Fraction(0))

def piecewise_polynomial_source(plan):
    """Exact pieces, breakpoints, source interval and the piece intervals (None for an unbounded end); the grammar checks of the family."""
    unknown=sorted(set(plan)-PIECEWISE_POLY_FIELDS)
    if unknown:raise ValueError('PIECEWISE_POLY_FIELD_UNKNOWN:'+unknown[0])
    raw_pieces=plan.get('pieces');raw_breaks=plan.get('breakpoints',[])
    if not isinstance(raw_pieces,list) or not 1<=len(raw_pieces)<=3:raise ValueError('PIECEWISE_POLY_PIECE_COUNT_INVALID')
    if not isinstance(raw_breaks,list) or len(raw_breaks)!=len(raw_pieces)-1:raise ValueError('PIECEWISE_POLY_BREAKPOINT_COUNT_INVALID')
    pieces=[]
    for piece in raw_pieces:
        if not isinstance(piece,dict) or set(piece)!={'coefficients'} or not isinstance(piece['coefficients'],list) or not 1<=len(piece['coefficients'])<=3:raise ValueError('PIECEWISE_POLY_PIECE_INVALID')
        pieces.append([_pp_rational(value,'PIECEWISE_POLY_COEFFICIENT_INVALID') for value in piece['coefficients']]+[Fraction(0)]*(3-len(piece['coefficients'])))
    breaks=[]
    for row in raw_breaks:
        if not isinstance(row,dict) or set(row)!={'x','y'}:raise ValueError('PIECEWISE_POLY_BREAKPOINT_INVALID')
        breaks.append((_pp_rational(row['x'],'PIECEWISE_POLY_BREAKPOINT_INVALID'),_pp_rational(row['y'],'PIECEWISE_POLY_BREAKPOINT_INVALID')))
    if any(not left[0]<right[0] for left,right in zip(breaks,breaks[1:])):raise ValueError('PIECEWISE_POLY_BREAKPOINTS_NOT_INCREASING')
    source=plan.get('sourceDomain')
    if source=={'kind':'ALL_REALS'}:lo=hi=None;states=['CLOSED','CLOSED']
    elif isinstance(source,dict) and source.get('kind')=='INTERVAL':
        try:lo,hi,states=quadratic_source_interval(source)
        except ValueError:raise ValueError('PIECEWISE_POLY_SOURCE_DOMAIN_INVALID') from None
        if any(not lo<x_value<hi for x_value,_ in breaks):raise ValueError('PIECEWISE_POLY_BREAKPOINT_OUTSIDE_SOURCE_INTERVAL')
    else:raise ValueError('PIECEWISE_POLY_SOURCE_DOMAIN_INVALID')
    cuts=[lo,*[x_value for x_value,_ in breaks],hi]
    intervals=list(zip(cuts,cuts[1:]))
    for index,(x_value,y_value) in enumerate(breaks):
        left,right=_pp_poly_value(pieces[index],x_value),_pp_poly_value(pieces[index+1],x_value)
        if left!=right:raise ValueError('PIECEWISE_POLY_DISCONTINUOUS:'+str(x_value))
        if left!=y_value:raise ValueError('PIECEWISE_POLY_BREAKPOINT_VALUE_MISMATCH:'+str(x_value))
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
        h=-c1/(2*c2)
        if _pp_inside(h,interval,True):rows.append((h,_pp_poly_value(coefficients,h),'MAX' if c2<0 else 'MIN'))
    return rows

def piecewise_polynomial_crossings(pieces,intervals,level,source):
    """Every x where g(x)=level, exactly (SymPy; quadratic surds allowed), each once, in increasing order. A piece equal to the level is refused."""
    lo,hi,states=source;found=[]
    for coefficients,(a,b) in zip(pieces,intervals):
        poly=S.Poly(sum(S.Rational(c.numerator,c.denominator)*_x**i for i,c in enumerate(coefficients))-S.Rational(level.numerator,level.denominator),_x)
        if poly.is_zero:raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE')
        for root in S.roots(poly,filter='R'):
            if a is not None and root<S.Rational(a.numerator,a.denominator) or b is not None and root>S.Rational(b.numerator,b.denominator):continue
            if lo is not None and (root==S.Rational(lo.numerator,lo.denominator) and states[0]=='OPEN' or root==S.Rational(hi.numerator,hi.denominator) and states[1]=='OPEN'):continue
            if not any(S.simplify(root-other)==0 for other in found):found.append(root)
    return sorted(found,key=lambda value:float(value))

def _pp_text(value):return str(Fraction(value))

def fit_piecewise_polynomial(plan):
    pieces,breaks,source,intervals=piecewise_polynomial_source(plan)
    lo,hi,states=source
    def g(x_value):
        x_value=Fraction(x_value)
        for coefficients,interval in zip(pieces,intervals):
            if _pp_inside(x_value,interval,False):return _pp_poly_value(coefficients,x_value)
        raise ValueError('PIECEWISE_POLY_POINT_OUTSIDE_SOURCE_DOMAIN')
    def g_float(x_value):
        for coefficients,(a,b) in zip(pieces,intervals):
            if (a is None or a<=x_value+1e-12) and (b is None or x_value-1e-12<=b):return sum(float(c)*x_value**i for i,c in enumerate(coefficients))
        raise ValueError('PIECEWISE_POLY_POINT_OUTSIDE_SOURCE_DOMAIN')
    corners=[(x_value,y_value) for x_value,y_value in breaks]
    extrema=piecewise_polynomial_extrema(pieces,intervals)
    # Key points the author marks: every corner and every vertex inside a piece must be among them (the claim), and each lies on the curve.
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_xy=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[k],bool) or not isinstance(point[k],(int,float)) or not math.isfinite(point[k]) or abs(point[k])>1e6 for k in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id'])
        if lo is not None and (not lo<=Fraction(str(point['x']))<=hi or Fraction(str(point['x']))==lo and states[0]=='OPEN' or Fraction(str(point['x']))==hi and states[1]=='OPEN'):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_OUTSIDE_SOURCE_DOMAIN:'+point['id'])
        if abs(g_float(float(point['x']))-point['y'])>1e-8*max(1,abs(point['y'])):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        required_xy.append((float(point['x']),float(point['y'])))
    marked=lambda x_value,y_value:any(abs(px-float(x_value))<=1e-9*max(1,abs(px)) and abs(py-float(y_value))<=1e-9*max(1,abs(py)) for px,py in required_xy)
    for x_value,y_value in corners:
        if not marked(x_value,y_value):raise ValueError('PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value))
    for x_value,y_value,_ in extrema:
        if not marked(x_value,y_value):raise ValueError('PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value))
    # The display formula (optional) must be the same function as the pieces: exact values at nine points of every piece.
    formula=plan.get('formula')
    if formula is not None:
        for coefficients,(a,b) in zip(pieces,intervals):
            if a is not None and b is not None:samples=[a+(b-a)*k/8 for k in range(9)]
            elif b is not None:samples=[b-Fraction(k,2) for k in range(9)]+[b-10,b-100]
            elif a is not None:samples=[a+Fraction(k,2) for k in range(9)]+[a+10,a+100]
            else:samples=[Fraction(k-4,2) for k in range(9)]+[Fraction(-100),Fraction(100)]
            for x_value in samples:
                if pp_formula_value(formula,x_value)!=_pp_poly_value(coefficients,x_value):raise ValueError('PIECEWISE_POLY_FORMULA_MISMATCH:'+_pp_text(x_value))
    # Horizontal lines: the claimed intersection x values must be exactly the engine's own crossings, in increasing order.
    lines=plan.get('referenceLines',[])
    if not isinstance(lines,list) or len(lines)>3:raise ValueError('PIECEWISE_POLY_REFERENCE_LINES_INVALID')
    crossings=[];line_ids=set()
    for line in lines:
        if not isinstance(line,dict) or not {'id','y','intersectionX'}<=set(line)<={'id','y','intersectionX','labelIntersections'} or not isinstance(line['id'],str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',line['id']) or line['id'] in line_ids or not isinstance(line['intersectionX'],list) or len(line['intersectionX'])>6 or line.get('labelIntersections',False) not in (True,False):raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        line_ids.add(line['id']);level=_pp_rational(line['y'],'PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        exact=piecewise_polynomial_crossings(pieces,intervals,level,source)
        claimed=sorted(((text,pp_exact_value(text)) for text in line['intersectionX']),key=lambda row:float(row[1]))
        if len(claimed)!=len(exact) or any(S.simplify(value-root)!=0 for (_,value),root in zip(claimed,exact)):
            raise ValueError('PIECEWISE_POLY_INTERSECTION_MISMATCH:'+line['id']+':engine finds '+str(len(exact))+' intersection(s)')
        # A crossing that is also a marked key point (a touching vertex, a corner on the line) is drawn once, as that key point.
        def key_at(x_value,y_value):
            return next((point['id'] for point in required if abs(point['x']-x_value)<=1e-9*max(1,abs(x_value)) and abs(point['y']-y_value)<=1e-9*max(1,abs(y_value))),None)
        crossings.append({'lineId':line['id'],'y':_pp_text(level),'points':[{'x':text.replace(' ',''),'xValue':float(root),**({'keyPoint':key_at(float(root),float(level))} if key_at(float(root),float(level)) else {})} for (text,_),root in zip(claimed,exact)]})
    key=[(float(x_value),float(y_value)) for x_value,y_value in corners]+[(float(x_value),float(y_value)) for x_value,y_value,_ in extrema]+required_xy
    key+=[(point['xValue'],float(Fraction(row['y']))) for row in crossings for point in row['points']]
    key+=[(0.0,float(Fraction(row['y']))) for row in crossings if not row['points']]
    limit=plot_height_limit(plan)
    if lo is not None:
        ends=[(float(lo),float(g(lo))),(float(hi),float(g(hi)))]
    else:
        # Unbounded outer pieces: each arm runs on beyond the outermost key point, by a fifth of the key width (at least 1), but stops where it
        # leaves the key heights by a quarter of their range (at least 1), so a steep arm never flattens the figure.
        xs=[p[0] for p in key] or [0.0];ys=[p[1] for p in key] or [0.0]
        span=max(xs)-min(xs);extend=max(1.0,.2*span);ylo,yhi=min(ys),max(ys);band=max(1.0,.25*(yhi-ylo))
        def arm(start,direction):
            far=start+direction*extend
            if ylo-band<=g_float(far)<=yhi+band:return far
            near=start
            for _ in range(60):
                mid=(near+far)/2
                if ylo-band<=g_float(mid)<=yhi+band:near=mid
                else:far=mid
            return near
        left_x,right_x=arm(min(xs),-1),arm(max(xs),1)
        ends=[(left_x,g_float(left_x)),(right_x,g_float(right_x))]
    for attempt in range(2):
        points=[(0.0,0.0)]+key+ends
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
    marks=sorted(set(key))
    for index,(ax,ay) in enumerate(marks):
        for bx,by in marks[index+1:]:
            if math.hypot((ax-bx)*scale,(ay-by)*scale*ratio)<PIECEWISE_POLY_MIN_FEATURE_GAP_PX:raise ValueError('PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION')
    draw=[ends[0][0],ends[1][0]]
    piece_rows=[]
    for coefficients,(a,b) in zip(pieces,intervals):
        start=draw[0] if a is None else float(a);end=draw[1] if b is None else float(b)
        piece_rows.append({'coefficients':[_pp_text(c) for c in coefficients],'interval':[None if a is None else _pp_text(a),None if b is None else _pp_text(b)],'drawInterval':[start,end]})
    features={'schemaVersion':'PIECEWISE_POLYNOMIAL_FEATURES_v1','pieces':piece_rows,'corners':[{'x':_pp_text(x_value),'y':_pp_text(y_value)} for x_value,y_value in corners],'extrema':[{'x':_pp_text(x_value),'y':_pp_text(y_value),'kind':kind} for x_value,y_value,kind in extrema],'intersections':crossings}
    fitted={key_name:value for key_name,value in plan.items() if key_name not in ('domain','viewport')}
    fitted.update({'domain':draw,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','piecewisePolynomialFeatures':features,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}})
    if lo is not None:
        fitted['intervalFeatures']={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':_pp_text(lo),'y':_pp_text(g(lo)),'state':states[0]},{'side':'END','x':_pp_text(hi),'y':_pp_text(g(hi)),'state':states[1]}]}
        fitted['intervalFeaturePolicy']={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    return {'graphPlan':fitted,'policy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}
