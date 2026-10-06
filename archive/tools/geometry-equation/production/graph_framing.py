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
    # Keep the coordinate origin as the visual center. Translation-heavy or
    # sub-resolution features then fail the independent profile gate rather
    # than being silently recentered into a different educational frame.
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
    source_domain=plan.get('sourceDomain')
    if source_domain is not None and source_domain!={'kind':'ALL_REALS'}:raise ValueError('RESTRICTED_SOURCE_DOMAIN_NEEDS_CONTEXT_VIEW')
    if source_domain=={'kind':'ALL_REALS'}:
        radius=max(natural,1.2*abs(hf),math.sqrt(1.25*abs(kf)/abs(af)))
        radius=max([radius]+[1.2*abs(p['x']-hf) for p in required])
        lo,hi=hf-radius*1.15,hf+radius*1.15
    else:
        # Older frozen draw intervals are retained. Never silently enlarge a
        # potentially source-restricted domain to make a prettier picture.
        lo,hi=plan['domain']
        if not lo<hf<hi or min(hf-lo,hi-hf)<natural:raise ValueError('OVERVIEW_DRAW_INTERVAL_TOO_NARROW_REVIEW_DOMAIN')
        radius=min(hf-lo,hi-hf)/1.15
        if any(not lo<=p['x']<=hi for p in required):raise ValueError('REQUIRED_FEATURE_OUTSIDE_REVIEWED_DRAW_INTERVAL')
    rise=max([abs(af)*radius*radius]+[1.15*abs(p['y']-kf) for p in required])
    ymin=min(0,kf-.15*rise) if af>0 else min(0,kf-1.15*rise)
    ymax=max(0,kf+1.15*rise) if af>0 else max(0,kf+.15*rise)
    xpad=(hi-lo)*.1 if required else 0
    fitted={**plan,'domain':[lo,hi],'viewport':[lo-xpad,hi+xpad,ymin,ymax],'shapeIntent':'OVERVIEW'}
    return {'graphPlan':fitted,'policy':'QUADRATIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':{'vertex':[hf,kf],'opening':'UP' if af>0 else 'DOWN','naturalHalfSpan':natural},'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

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
    radius=max(8.0,abs(singularity_x)*1.25+.5,abs(root_x-singularity_x)*4,*[abs(px-singularity_x)*1.2 for px in required_x])
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
