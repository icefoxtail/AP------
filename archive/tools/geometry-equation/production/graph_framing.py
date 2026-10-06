"""Bounded overview fitting. Display windows do not change source domains."""
import math
import re
from fractions import Fraction

def fit_overview(plan):
    if plan.get('family')!='polynomial':raise ValueError('UNSUPPORTED_OVERVIEW_FAMILY')
    values=plan.get('coefficients')
    if not isinstance(values,list) or not 1<=len(values)<=5 or any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values):raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    c=[Fraction(v) for v in values]
    while len(c)>1 and c[-1]==0:c.pop()
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
