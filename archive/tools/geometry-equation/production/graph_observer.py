"""Independent final-polyline observer. Does not import producer/sampler helpers.

Scope: rational-coefficient degree <=4 polynomial, rational with denominator
degree <=2, sqrt of a positive-slope affine polynomial. Uses conservative
second-derivative bounds; sqrt boundary uses its exact secant envelope.
"""
import bisect
import math
import re
import xml.etree.ElementTree as ET
from fractions import Fraction
import sympy as S
x = S.Symbol('x', real=True)

def polynomial(values, limit):
    if not isinstance(values,list) or not 1<=len(values)<=limit+1: raise ValueError('UNSUPPORTED_POLYNOMIAL_DEGREE')
    if any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values): raise ValueError('INVALID_COEFFICIENT')
    if any('/' in value and int(value.split('/',1)[1])==0 for value in values):raise ValueError('INVALID_COEFFICIENT')
    return S.Poly(sum(S.Rational(v)*x**i for i,v in enumerate(values)),x)

def real_roots(poly,lo,hi):
    if poly.is_zero: return []
    # Exact rational root isolation, retaining multiplicity and clustered roots.
    return [(float((a+b)/2),multiplicity) for (a,b),multiplicity in poly.intervals(eps=S.Rational(1,10**14)) if float(b)>=lo and float(a)<=hi]

# A repeated root is the touch/crossing point of the curve with the x-axis. These checks read only the FINAL polyline: the point where it
# meets the axis, the sign on each side, and (for multiplicity 3 or 4) how wide the flat band around the axis is. The multiplicities
# themselves are recomputed from the source polynomial by real_roots, never taken from the producer.
ROOT_AXIS_PROBE_CSS_PX=10.0
ROOT_AXIS_TOUCH_TOLERANCE_CSS_PX=.35
ROOT_FLAT_BAND_CSS_PX=3.0
ROOT_FLAT_MIN_WIDTH_CSS_PX=12.0

def root_axis_behaviour_errors(roots,points,transform):
    errors=[]
    if not roots or not points:return errors
    sx=transform['sx']*transform['displayScale'];sy=transform['sy']*transform['displayScale']
    if not math.isfinite(sx) or not math.isfinite(sy) or sx<=0 or sy<=0:return errors
    ordered=sorted(points,key=lambda point:point[0])
    xs=[point[0] for point in ordered]
    def value_at(x):
        index=bisect.bisect_left(xs,x)
        if index<len(ordered) and abs(xs[index]-x)<=1e-12:return ordered[index][1]
        if index==0:return ordered[0][1] if (ordered[0][0]-x)*sx<=ROOT_AXIS_PROBE_CSS_PX else None
        if index>=len(ordered):return ordered[-1][1] if (x-ordered[-1][0])*sx<=ROOT_AXIS_PROBE_CSS_PX else None
        (x0,y0),(x1,y1)=ordered[index-1],ordered[index]
        if x1==x0:return y1
        return y0+(y1-y0)*(x-x0)/(x1-x0)
    def sign(value):
        return 1 if value>0 else -1 if value<0 else 0
    for root,multiplicity in roots:
        if not xs[0]-1e-12<=root<=xs[-1]+1e-12:continue
        on_axis=value_at(root)
        if on_axis is None or abs(on_axis)*sy>ROOT_AXIS_TOUCH_TOLERANCE_CSS_PX:errors.append('OVERVIEW_ROOT_NOT_ON_OBSERVED_AXIS')
        probe=ROOT_AXIS_PROBE_CSS_PX/sx
        left,right=value_at(root-probe),value_at(root+probe)
        if left is None or right is None:errors.append('OVERVIEW_ROOT_NEIGHBOURHOOD_MISSING');continue
        left_sign,right_sign=sign(left),sign(right)
        if multiplicity%2==0:
            if left_sign*right_sign<0 or left_sign==0 or right_sign==0:errors.append('OVERVIEW_EVEN_ROOT_CROSSES_AXIS')
        else:
            if left_sign*right_sign>=0:errors.append('OVERVIEW_ODD_ROOT_DOES_NOT_CROSS_AXIS')
            if multiplicity>=3:
                # Crossing with flattening: the curve stays inside a thin band around the axis over a readable width (a straight crossing
                # would leave it almost at once).
                band=[point for point in ordered if abs(point[1])*sy<=ROOT_FLAT_BAND_CSS_PX and abs(point[0]-root)*sx<=60]
                width=(max(point[0] for point in band)-min(point[0] for point in band))*sx if len(band)>=2 else 0.0
                if width<ROOT_FLAT_MIN_WIDTH_CSS_PX:errors.append('OVERVIEW_ODD_ROOT_NOT_FLAT')
    return errors

def polynomial_feature_inventory(poly,lo,hi):
    groups=[]
    def add(root,role,key,multiplicity):
        value=float(poly.eval(S.Rational(str(root))))
        row=next((item for item in groups if abs(item['x']-root)<=1e-12*max(1,abs(root)) and abs(item['y']-value)<=1e-12*max(1,abs(value))),None)
        if row is None:
            row={'x':root,'y':value,'roles':set(),'multiplicity':{'root':None,'derivative':None,'secondDerivative':None}}
            groups.append(row)
        row['roles'].add(role);row['multiplicity'][key]=int(multiplicity)
    for root,multiplicity in real_roots(poly,lo,hi):add(root,'ROOT','root',multiplicity)
    for root,multiplicity in real_roots(poly.diff(),lo,hi):add(root,'STATIONARY_EXTREMUM' if multiplicity%2 else 'STATIONARY_INFLECTION','derivative',multiplicity)
    for root,multiplicity in real_roots(poly.diff().diff(),lo,hi):
        if multiplicity%2:add(root,'INFLECTION','secondDerivative',multiplicity)
    order={'ROOT':0,'STATIONARY_EXTREMUM':1,'STATIONARY_INFLECTION':2,'INFLECTION':3}
    groups.sort(key=lambda row:(row['x'],row['y']))
    rows=[{'id':f'feature-{index}','kind':'POLYNOMIAL_FEATURE','x':row['x'],'y':row['y'],'roles':sorted(row['roles'],key=lambda role:order[role]),'multiplicity':row['multiplicity']} for index,row in enumerate(groups,1)]
    directions=expected_end_directions(poly);left_slope='DOWN' if directions['left']=='UP' else 'UP'
    rows.extend([{'id':'tail-left','kind':'TAIL_DIRECTION','side':'LEFT','endpointX':lo,'direction':directions['left'],'slopeDirection':left_slope},{'id':'tail-right','kind':'TAIL_DIRECTION','side':'RIGHT','endpointX':hi,'direction':directions['right'],'slopeDirection':directions['right']}])
    return rows

def expected_end_directions(poly):
    degree=poly.degree();leading=poly.LC();sign=1 if leading>0 else -1
    left=sign if degree%2==0 else -sign
    return {'left':'UP' if left>0 else 'DOWN','right':'UP' if sign>0 else 'DOWN'}

def cubic_quartic_overview_audit(plan,poly,points,transform):
    if poly.degree() not in (3,4):return {'status':'UNSUPPORTED','errors':['UNSUPPORTED_CUBIC_QUARTIC_OVERVIEW_DEGREE']}
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:return {'status':'UNSUPPORTED','errors':['CUBIC_QUARTIC_SOURCE_DOMAIN_UNSUPPORTED']}
    if plan.get('overviewPolicy')!='POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1':return {'status':'UNSUPPORTED','errors':['CUBIC_QUARTIC_OVERVIEW_POLICY_REQUIRED']}
    xmin,xmax,ymin,ymax=plan['viewport'];lo,hi=plan['domain'];errors=[]
    roots=real_roots(poly,lo,hi)
    expected=polynomial_feature_inventory(poly,lo,hi);declared=plan.get('overviewFeatures')
    feature_policy={'schemaVersion':'POLYNOMIAL_CUBIC_QUARTIC_FEATURE_POLICY_v1','repeatedSourceRootPolicy':'EXACT_MULTIPLICITY','tangencyPolicy':'TOUCHES_AXIS_EVEN_CROSSES_ODD','minimumDistinctFeatureSeparationCssPx':1,'stationaryInflectionPolicy':'MERGE_ROLES_AT_SAME_POINT'}
    if plan.get('overviewFeaturePolicy')!=feature_policy:errors.append('OVERVIEW_FEATURE_POLICY_BINDING_MISMATCH')
    if not isinstance(declared,list) or len(declared)!=len(expected):errors.append('OVERVIEW_FEATURE_INVENTORY_MISMATCH')
    else:
        for actual,wanted in zip(declared,expected):
            if not isinstance(actual,dict):errors.append('OVERVIEW_FEATURE_INVENTORY_MISMATCH');break
            if wanted['kind']=='TAIL_DIRECTION':
                if set(actual)!={'id','kind','side','endpointX','direction','slopeDirection'} or actual.get('id')!=wanted['id'] or actual.get('side')!=wanted['side'] or actual.get('direction')!=wanted['direction'] or actual.get('slopeDirection')!=wanted['slopeDirection'] or not isinstance(actual.get('endpointX'),(int,float)) or abs(actual['endpointX']-wanted['endpointX'])>1e-10:
                    errors.append('OVERVIEW_TAIL_DIRECTION_INVENTORY_MISMATCH');break
            else:
                if set(actual)!={'id','kind','x','y','roles','multiplicity'}:
                    errors.append('OVERVIEW_FEATURE_INVENTORY_MISMATCH');break
                tolerance_x=1e-8*max(1,abs(wanted['x']));tolerance_y=1e-8*max(1,abs(wanted['y']))
                if actual['id']!=wanted['id'] or actual['kind']!=wanted['kind'] or actual['roles']!=wanted['roles'] or actual['multiplicity']!=wanted['multiplicity'] or not isinstance(actual['x'],(int,float)) or not isinstance(actual['y'],(int,float)) or not math.isfinite(actual['x']) or not math.isfinite(actual['y']) or abs(actual['x']-wanted['x'])>tolerance_x or abs(actual['y']-wanted['y'])>tolerance_y:
                    errors.append('OVERVIEW_FEATURE_INVENTORY_MISMATCH');break
    end_directions=expected_end_directions(poly)
    if plan.get('overviewEndDirections')!=end_directions:errors.append('OVERVIEW_END_DIRECTION_BINDING_MISMATCH')
    width=(xmax-xmin)*transform['sx']*transform['displayScale'];height=(ymax-ymin)*transform['sy']*transform['displayScale']
    if not (xmin<0<xmax and ymin<0<ymax):errors.append('OVERVIEW_AXES_ORIGIN_NOT_VISIBLE')
    feature_rows=[{'id':row['id'],'kind':row['kind'],'modelPoint':[row['x'],row['y']],'roles':row['roles'],'multiplicity':row['multiplicity']} for row in expected if row['kind']=='POLYNOMIAL_FEATURE']
    px_tol=.35/max(1e-12,transform['sx']*transform['displayScale']);py_tol=.35/max(1e-12,transform['sy']*transform['displayScale'])
    math_features=[feature for feature in expected if feature['kind']=='POLYNOMIAL_FEATURE']
    for feature in math_features:
        fx,fy=feature['x'],feature['y']
        if not xmin+.05*(xmax-xmin)<fx<xmax-.05*(xmax-xmin) or not ymin+.05*(ymax-ymin)<fy<ymax-.05*(ymax-ymin):errors.append('OVERVIEW_FEATURE_OUTSIDE_INTERIOR:'+feature['id'])
        if not any(abs(point[0]-fx)<=px_tol and abs(point[1]-fy)<=py_tol for point in points):errors.append('OVERVIEW_FEATURE_NOT_OBSERVED:'+feature['id'])
    required=plan.get('requiredPoints',[])
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'}:errors.append('INVALID_REQUIRED_GRAPH_POINT');continue
        px,py=float(point['x']),float(point['y'])
        if not xmin+.05*(xmax-xmin)<=px<=xmax-.05*(xmax-xmin) or not ymin+.05*(ymax-ymin)<=py<=ymax-.05*(ymax-ymin):errors.append('OVERVIEW_REQUIRED_FEATURE_CLIPPED:'+point['id'])
        if not any(abs(q[0]-px)<=px_tol and abs(q[1]-py)<=py_tol for q in points):errors.append('OVERVIEW_REQUIRED_FEATURE_NOT_OBSERVED:'+point['id'])
        exact_y=float(poly.eval(S.Rational(str(px))))
        if abs(exact_y-py)>1e-8:errors.append('OVERVIEW_REQUIRED_FEATURE_NOT_ON_CURVE:'+point['id'])
    critical=[row for row in math_features if any(role.startswith('STATIONARY_') for role in row['roles'])]
    if not critical:critical=[row for row in math_features if 'INFLECTION' in row['roles']]
    sorted_points=sorted(points,key=lambda point:point[0]);tails={row['side']:row for row in expected if row['kind']=='TAIL_DIRECTION'};arms=[]
    if not critical:errors.append('OVERVIEW_CRITICAL_FEATURE_MISSING')
    elif len(sorted_points)<3:errors.append('OVERVIEW_FINAL_CURVE_POINTS_MISSING')
    else:
        if abs(sorted_points[0][0]-lo)*transform['sx']*transform['displayScale']>.5:errors.append('OVERVIEW_LEFT_END_EXIT_MISSING')
        if abs(sorted_points[-1][0]-hi)*transform['sx']*transform['displayScale']>.5:errors.append('OVERVIEW_RIGHT_END_EXIT_MISSING')
        left_anchor=min(critical,key=lambda row:row['x']);right_anchor=max(critical,key=lambda row:row['x'])
        for side,anchor in [('LEFT',left_anchor),('RIGHT',right_anchor)]:
            arm=[point for point in sorted_points if point[0]<=anchor['x']+px_tol] if side=='LEFT' else [point for point in sorted_points if point[0]>=anchor['x']-px_tol]
            if len(arm)<3:errors.append('OVERVIEW_'+side+'_END_ARM_MISSING');arms.append({'side':side,'status':'FAIL'});continue
            horizontal=max(abs(point[0]-anchor['x'])*transform['sx']*transform['displayScale'] for point in arm)
            vertical=max(abs(point[1]-anchor['y'])*transform['sy']*transform['displayScale'] for point in arm)
            edge=arm[:3] if side=='LEFT' else arm[-3:];delta=edge[-1][1]-edge[0][1];trend=abs(delta)*transform['sy']*transform['displayScale']
            tail=tails.get(side);direction=tail['direction'] if tail else None;slope=tail['slopeDirection'] if tail else None
            trend_matches=(delta>0 and slope=='UP') or (delta<0 and slope=='DOWN')
            if horizontal<max(20,width*.12):errors.append('OVERVIEW_'+side+'_ARM_TOO_NARROW')
            if vertical<max(50,height*.18):errors.append('OVERVIEW_'+side+'_ARM_TOO_SHORT')
            if not trend_matches or trend<5:errors.append('OVERVIEW_'+side+'_END_DIRECTION_UNREADABLE')
            arms.append({'side':side,'horizontalCssPx':horizontal,'verticalExcursionCssPx':vertical,'endDirection':direction,'observedSlopeDirection':'UP' if delta>0 else 'DOWN','observedTrendCssPx':trend})
    min_feature_px=feature_policy['minimumDistinctFeatureSeparationCssPx']
    for index,left_feature in enumerate(math_features):
        for right_feature in math_features[index+1:]:
            dx=(right_feature['x']-left_feature['x'])*transform['sx']*transform['displayScale'];dy=(right_feature['y']-left_feature['y'])*transform['sy']*transform['displayScale']
            if math.hypot(dx,dy)<min_feature_px:return {'status':'UNSUPPORTED','errors':['OVERVIEW_FEATURES_BELOW_DISPLAY_RESOLUTION'],'features':feature_rows,'endDirections':end_directions}
    distinct_roots=sorted(root for root,_ in roots)
    if any((right-left)*transform['sx']*transform['displayScale']<1 for left,right in zip(distinct_roots,distinct_roots[1:])):
        return {'status':'UNSUPPORTED','errors':['OVERVIEW_ROOTS_BELOW_DISPLAY_RESOLUTION'],'features':feature_rows,'endDirections':end_directions}
    errors.extend(root_axis_behaviour_errors(roots,points,transform))
    return {'status':'FAIL' if errors else 'PASS','errors':sorted(set(errors)),'degree':poly.degree(),'plotCssSize':[width,height],'features':feature_rows,'endDirections':end_directions,'arms':arms if critical else [],'policy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','mathMethod':'EXACT_RATIONAL_SOURCE_ROOT_ISOLATION','rootMultiplicities':[{'x':root,'multiplicity':multiplicity} for root,multiplicity in roots]}

def resolve(plan):
    family=plan['family'];holes=[];poles=[];boundary=[];corners=[];root_inventory=None
    if family=='polynomial':
        p=polynomial(plan['coefficients'],4);f=p.as_expr();den=S.Poly(1,x)
    elif family=='rational':
        p=polynomial(plan['numerator'],4);den=polynomial(plan['denominator'],2)
        if den.is_zero: raise ValueError('ZERO_DENOMINATOR')
        f=p.as_expr()/den.as_expr()
        for root,multiplicity in real_roots(den,*plan['domain']):
            # Classify with exact gcd multiplicity; preserve uncancelled source domain.
            g=S.gcd(p,den)
            matches=[m for r,m in real_roots(g,*plan['domain']) if abs(root-r)<1e-12]
            (holes if matches and matches[0]>=multiplicity else poles).append(root)
    elif family=='sqrt-affine':
        p=polynomial(plan['radicand'],1)
        if p.degree()!=1 or p.nth(1)<=0: raise ValueError('UNSUPPORTED_SQRT_RADICAND')
        f=S.sqrt(p.as_expr());den=S.Poly(1,x);boundary=[float(-p.nth(0)/p.nth(1))]
    elif family=='absolute-value':
        values=plan.get('coefficients')
        if not isinstance(values,list) or len(values)!=4 or any(not isinstance(value,str) for value in values):raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_GRAMMAR')
        b,a,scale,offset=(S.Rational(value) for value in values)
        if a==0 or scale==0:raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_DEGENERACY')
        p=S.Poly(a*x+b,x);den=S.Poly(1,x);corner=-b/a;corners=[float(corner)];f=scale*S.Abs(p.as_expr())+offset
        threshold=-offset/scale
        if threshold<0:root_inventory=[]
        elif threshold==0:root_inventory=[(float(corner),2)]
        else:
            delta=threshold/abs(a);root_inventory=sorted([(float(corner-delta),1),(float(corner+delta),1)])
    else: raise ValueError('UNSUPPORTED_GRAPH_FAMILY')
    lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport']
    if not all(math.isfinite(v) for v in [lo,hi,xmin,xmax,ymin,ymax]) or not lo<hi or not xmin<xmax or not ymin<ymax: raise ValueError('INVALID_GRAPH_DOMAIN')
    lo=max(lo,xmin,boundary[0] if boundary else lo);hi=min(hi,xmax)
    cuts=[lo,hi,*holes,*poles,*boundary,*corners]
    for level in [ymin,ymax]:
        if family=='sqrt-affine':
            if level>=0:cuts.extend(r for r,_ in real_roots(S.Poly(p.as_expr()-S.Rational(str(level))**2,x),lo,hi))
        elif family=='absolute-value':
            distance=(S.Rational(str(level))-offset)/scale
            if distance>=0:
                delta=distance/abs(a);cuts.extend([float(corner-delta),float(corner+delta)])
        else:
            equation=S.together(f-S.Rational(str(level))).as_numer_denom()[0]
            cuts.extend(r for r,_ in real_roots(S.Poly(equation,x),lo,hi))
    cuts=sorted(set(v for v in cuts if lo<=v<=hi));evaluate=S.lambdify(x,f,'math')
    visible=[]
    for a,b in zip(cuts,cuts[1:]):
        if a==b:continue
        mid=(a+b)/2
        try:
            y=float(evaluate(mid))
            if ymin<=y<=ymax:visible.append([a,b])
        except (ValueError,ZeroDivisionError): pass
    return f,den,p,evaluate,{'holes':holes,'poles':poles,'boundary':boundary,'corners':corners,'visibleIntervals':visible,'roots':root_inventory if root_inventory is not None else real_roots(p,*plan['domain'])}

INTERVAL_STATE_FILLS={'CLOSED':{'#111','black','#000'},'OPEN':{'#fff','white','#ffffff'}}

def polynomial_interval_audit(plan,poly,points,transform,svg_root):
    """Independent: the interval and its end states from sourceDomain, the end values from the coefficients, then the drawn curve and dots."""
    source=plan.get('sourceDomain');errors=[];unsupported=[]
    try:
        if not isinstance(source,dict) or source.get('kind')!='INTERVAL' or set(source)-{'kind','range','states'}:raise ValueError
        raw=source['range'];states=source.get('states',['CLOSED','CLOSED'])
        if not isinstance(raw,list) or len(raw)!=2 or any(isinstance(v,bool) or not isinstance(v,(int,float,str)) for v in raw):raise ValueError
        if not isinstance(states,list) or len(states)!=2 or any(state not in INTERVAL_STATE_FILLS for state in states):raise ValueError
        lo,hi=(S.Rational(str(v)) for v in raw)
        if not lo<hi:raise ValueError
    except (ValueError,TypeError,KeyError,S.SympifyError):return {'status':'UNSUPPORTED','errors':['POLYNOMIAL_SOURCE_INTERVAL_INVALID']}
    if poly.degree()!=2:return {'status':'UNSUPPORTED','errors':['POLYNOMIAL_INTERVAL_QUADRATIC_ONLY']}
    if plan.get('overviewPolicy')!='POLYNOMIAL_INTERVAL_OVERVIEW_v1':return {'status':'UNSUPPORTED','errors':['POLYNOMIAL_INTERVAL_OVERVIEW_POLICY_REQUIRED']}
    policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    endpoints=[{'side':'START','x':str(lo),'y':str(poly.eval(lo)),'state':states[0]},{'side':'END','x':str(hi),'y':str(poly.eval(hi)),'state':states[1]}]
    if plan.get('intervalFeaturePolicy')!=policy:errors.append('POLYNOMIAL_INTERVAL_POLICY_MISMATCH')
    if plan.get('intervalFeatures')!={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':endpoints}:errors.append('POLYNOMIAL_INTERVAL_INVENTORY_MISMATCH')
    if plan.get('domain')!=[float(lo),float(hi)]:errors.append('POLYNOMIAL_INTERVAL_DRAW_DOMAIN_CHANGED')
    if plan.get('equalUnits') is not True:errors.append('EQUAL_UNIT_DECLARATION_MISSING')
    errors.extend(axis_ratio_errors(plan,transform))
    errors.extend(application_axes_errors(plan,transform))
    xmin,xmax,ymin,ymax=plan['viewport'];sx=transform['sx']*transform['displayScale'];sy=transform['sy']*transform['displayScale']
    if not xmin<0<xmax or not ymin<0<ymax:errors.append('POLYNOMIAL_INTERVAL_AXES_OUTSIDE_VIEW')
    if not points:return {'status':'FAIL','errors':['POLYNOMIAL_INTERVAL_CURVE_MISSING']}
    ordered=sorted(points,key=lambda point:point[0]);ends=[(float(lo),float(poly.eval(lo))),(float(hi),float(poly.eval(hi)))]
    if any(x<ends[0][0]-.35/sx or x>ends[1][0]+.35/sx for x,_ in ordered):errors.append('POLYNOMIAL_CURVE_OUTSIDE_SOURCE_INTERVAL')
    for got,(ex,ey),side in ((ordered[0],ends[0],'START'),(ordered[-1],ends[1],'END')):
        if abs(got[0]-ex)*sx>.35 or abs(got[1]-ey)*sy>.35:errors.append('POLYNOMIAL_INTERVAL_'+side+'_NOT_AT_CURVE_END')
    for point in plan.get('requiredPoints',[]):
        px=S.Rational(str(point['x']))
        if not lo<=px<=hi:errors.append('POLYNOMIAL_REQUIRED_POINT_OUTSIDE_SOURCE_INTERVAL:'+point['id'])
        elif px==lo and states[0]=='OPEN' or px==hi and states[1]=='OPEN':errors.append('POLYNOMIAL_REQUIRED_POINT_AT_OPEN_ENDPOINT:'+point['id'])
    markers=[]
    for node in svg_root.iter():
        if node.tag.split('}')[-1]=='circle' and node.get('data-role')=='interval-endpoint':
            try:markers.append({'point':((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy']),'radius':float(node.get('r')),'fill':node.get('fill'),'stroke':node.get('stroke'),'strokeWidth':float(node.get('stroke-width'))})
            except (TypeError,ValueError):errors.append('POLYNOMIAL_INTERVAL_MARKER_INVALID')
    if len(markers)!=2:errors.append('POLYNOMIAL_INTERVAL_MARKER_COUNT_MISMATCH')
    for (ex,ey),state,side in zip(ends,states,('START','END')):
        found=[m for m in markers if abs(m['point'][0]-ex)*sx<=.35 and abs(m['point'][1]-ey)*sy<=.35]
        if len(found)!=1:errors.append('POLYNOMIAL_INTERVAL_'+side+'_MARKER_MISSING');continue
        marker=found[0]
        if marker['fill'] not in INTERVAL_STATE_FILLS[state] or marker['stroke'] in (None,'none','') or marker['strokeWidth']<=0 or marker['radius']<policy['markerRadiusIntrinsicPx']-.01:errors.append('POLYNOMIAL_INTERVAL_'+side+'_MARKER_STATE_MISMATCH')
        if 2*marker['radius']*transform['displayScale']<policy['minimumMarkerDiameterCssPx']:unsupported.append('POLYNOMIAL_INTERVAL_MARKER_BELOW_DISPLAY_RESOLUTION')
    return {'status':'UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS','errors':sorted(set(errors+unsupported)),'endpoints':endpoints,'observedEndpointMarkers':len(markers),'plotCssSize':[(xmax-xmin)*sx,(ymax-ymin)*sy],'policy':'POLYNOMIAL_INTERVAL_OVERVIEW_v1'}

def poly_abs_upper(poly,a,b):
    # Triangle inequality on powers, with exact coefficients from the source.
    m=max(abs(a),abs(b))
    return sum(abs(float(coef))*m**power[0] for power,coef in poly.terms())

def denominator_lower(poly,a,b):
    # Exact rational enclosure in t=x-a, t in [0,b-a]. No sampled minimum.
    start=S.Rational(str(a));width=S.Rational(str(b))-start
    shifted=S.Poly(poly.as_expr().subs(x,x+start),x)
    low=high=shifted.nth(0)
    for degree in range(1,shifted.degree()+1):
        extent=shifted.nth(degree)*width**degree
        low+=min(0,extent);high+=max(0,extent)
    bound=low if low>0 else -high if high<0 else S.Integer(0)
    return max(0,float(bound)*(1-1e-12))

def axis_ratio_errors(plan,transform):
    """One scale on both axes, or y at the recorded axisRatio (between 1/2 and 1, a squeeze after a failure at one scale) times the x scale."""
    ratio=plan.get('axisRatio',1)
    if plan.get('applicationAxes') is True:
        # Application-problem axes (a count against a money amount): each axis has its own scale, so any positive ratio is the declared one.
        if isinstance(ratio,bool) or not isinstance(ratio,(int,float)) or not ratio>0 or plan.get('overviewPolicy')!='POLYNOMIAL_INTERVAL_OVERVIEW_v1':return ['AXIS_RATIO_INVALID']
    elif isinstance(ratio,bool) or not isinstance(ratio,(int,float)) or not .5-1e-12<=ratio<=1:return ['AXIS_RATIO_INVALID']
    return ['EQUAL_UNIT_SCALE_MISMATCH'] if abs(transform['sy']-ratio*transform['sx'])>1e-6*transform['sx'] else []

def application_ticks_valid(values,lo,hi):
    """Independent copy of the tick rule: 2 to 8 distinct nonzero values in an arithmetic progression with step 1, 2 or 5 times a power of ten,
    each a multiple of the step and inside the viewport."""
    try:ticks=sorted(float(S.Rational(str(v))) for v in values)
    except (TypeError,ValueError,S.SympifyError):return False
    if not 2<=len(ticks)<=8 or any(abs(v)<1e-12 or not lo<=v<=hi for v in ticks):return False
    step=ticks[1]-ticks[0]
    if step<=0 or any(abs((b-a)-step)>1e-9*max(1,abs(step)) for a,b in zip(ticks,ticks[1:])):return False
    mantissa=step/10**math.floor(math.log10(step))
    return any(abs(mantissa-m)<1e-9 for m in (1,2,5)) and all(abs(v/step-round(v/step))<1e-9 for v in ticks)

def application_axes_errors(plan,transform):
    """applicationAxes: each axis has its own scale. The plot canvas must equal the viewport span times that axis scale on both axes, and the ticks
    must be the real values on a 1/2/5 grid."""
    if plan.get('applicationAxes') is not True:return []
    errors=[];xmin,xmax,ymin,ymax=plan['viewport'];canvas=plan.get('plotCanvas') or {}
    sx=transform['sx'];sy=transform['sy']
    if abs((xmax-xmin)*sx-canvas.get('width',-1))>1e-6*max(1,sx) or abs((ymax-ymin)*sy-canvas.get('height',-1))>1e-6*max(1,sy):errors.append('APPLICATION_AXES_SCALE_MISMATCH')
    ticks=plan.get('axisTickValues')
    for axis,(lo,hi) in (('x',(xmin,xmax)),('y',(ymin,ymax))):
        if not isinstance(ticks,dict) or set(ticks)!={'x','y'} or not isinstance(ticks[axis],list) or not application_ticks_valid(ticks[axis],lo,hi):errors.append('APPLICATION_AXES_TICKS_INVALID:'+axis)
    return errors

def equal_unit_overview_audit(plan,poly,points,transform):
    """A quadratic drawn at one scale (QUADRATIC_EQUAL_UNIT_OVERVIEW_v1): the same px per unit on both axes, the vertex inside, the natural
    arms (half-span 2/sqrt|a|) drawn on both sides and wide enough to read, the key points inside and on the curve."""
    a=poly.nth(2);h=-poly.nth(1)/(2*a);k=poly.eval(h);h,k,a=map(float,(h,k,a));errors=[]
    xmin,xmax,ymin,ymax=plan['viewport'];lo,hi=plan['domain'];sx=transform['sx']*transform['displayScale'];sy=transform['sy']*transform['displayScale']
    if plan.get('equalUnits') is not True:errors.append('EQUAL_UNIT_DECLARATION_MISSING')
    errors.extend(axis_ratio_errors(plan,transform))
    if not xmin+.05*(xmax-xmin)<h<xmax-.05*(xmax-xmin) or not ymin+.05*(ymax-ymin)<k<ymax-.05*(ymax-ymin):errors.append('OVERVIEW_VERTEX_OUTSIDE_INTERIOR')
    natural=2/math.sqrt(abs(a))
    if min(h-lo,hi-h)<natural*(1-1e-9):errors.append('OVERVIEW_DOMAIN_TOO_NARROW')
    if (hi-lo)*sx<28 or 2*natural*sx<14:errors.append('EQUAL_UNIT_PARABOLA_TOO_NARROW')
    for point in plan.get('requiredPoints',[]):
        px,py=point['x'],point['y']
        if not xmin+.05*(xmax-xmin)<=px<=xmax-.05*(xmax-xmin) or not ymin+.05*(ymax-ymin)<=py<=ymax-.05*(ymax-ymin):errors.append('OVERVIEW_REQUIRED_FEATURE_CLIPPED:'+point['id'])
        if not any(abs(q[0]-px)*sx<=.35 and abs(q[1]-py)*sy<=.35 for q in points):errors.append('OVERVIEW_REQUIRED_FEATURE_NOT_OBSERVED:'+point['id'])
    for name,arm in [('LEFT',[p for p in points if p[0]<=h]),('RIGHT',[p for p in points if p[0]>=h])]:
        if max((abs(p[0]-h) for p in arm),default=0)<natural*(1-1e-6):errors.append('OVERVIEW_'+name+'_ARM_TOO_NARROW')
    return {'status':'FAIL' if errors else 'PASS','errors':errors,'vertex':[h,k],'opening':'UP' if a>0 else 'DOWN','plotCssSize':[(xmax-xmin)*sx,(ymax-ymin)*sy],'naturalWindowCssPx':2*natural*sx,'policy':'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1'}

def overview_audit(plan,poly,points,transform):
    """Independent shape adequacy from source coefficients and observed curves."""
    if poly.degree()==2 and plan.get('overviewPolicy')=='QUADRATIC_EQUAL_UNIT_OVERVIEW_v1':return equal_unit_overview_audit(plan,poly,points,transform)
    if poly.degree() in (3,4):return cubic_quartic_overview_audit(plan,poly,points,transform)
    if poly.degree()!=2:return {'status':'UNSUPPORTED','errors':['UNSUPPORTED_OVERVIEW_DEGREE']}
    a=poly.nth(2);h=-poly.nth(1)/(2*a);k=poly.eval(h);h,k,a=map(float,(h,k,a))
    xmin,xmax,ymin,ymax=plan['viewport'];lo,hi=plan['domain'];errors=[]
    width=(xmax-xmin)*transform['sx']*transform['displayScale'];height=(ymax-ymin)*transform['sy']*transform['displayScale']
    if not xmin+.05*(xmax-xmin)<h<xmax-.05*(xmax-xmin) or not ymin+.05*(ymax-ymin)<k<ymax-.05*(ymax-ymin):errors.append('OVERVIEW_VERTEX_OUTSIDE_INTERIOR')
    natural=2/math.sqrt(abs(a))
    if min(h-lo,hi-h)<natural*(1-1e-9):errors.append('OVERVIEW_DOMAIN_TOO_NARROW')
    for point in plan.get('requiredPoints',[]):
        px,py=point['x'],point['y']
        if not xmin+.05*(xmax-xmin)<=px<=xmax-.05*(xmax-xmin) or not ymin+.05*(ymax-ymin)<=py<=ymax-.05*(ymax-ymin):errors.append('OVERVIEW_REQUIRED_FEATURE_CLIPPED:'+point['id'])
        if not any(abs(q[0]-px)*transform['sx']*transform['displayScale']<=.35 and abs(q[1]-py)*transform['sy']*transform['displayScale']<=.35 for q in points):errors.append('OVERVIEW_REQUIRED_FEATURE_NOT_OBSERVED:'+point['id'])
    left=[p for p in points if p[0]<=h];right=[p for p in points if p[0]>=h]
    measured=[]
    for name,arm in [('LEFT',left),('RIGHT',right)]:
        horizontal=max((abs(p[0]-h)*transform['sx']*transform['displayScale'] for p in arm),default=0)
        rise=max(((p[1]-k)*(1 if a>0 else -1)*transform['sy']*transform['displayScale'] for p in arm),default=0)
        if horizontal<max(40,width*.22):errors.append('OVERVIEW_'+name+'_ARM_TOO_NARROW')
        if rise<max(50,height*.45):errors.append('OVERVIEW_'+name+'_ARM_TOO_SHORT')
        measured.append({'arm':name,'horizontalCssPx':horizontal,'riseCssPx':rise})
    return {'status':'FAIL' if errors else 'PASS','errors':errors,'vertex':[h,k],'opening':'UP' if a>0 else 'DOWN','plotCssSize':[width,height],'arms':measured,'policy':'QUADRATIC_OVERVIEW_v1'}

def absolute_value_overview_audit(plan,poly,points,transform,topology,svg_root):
    errors=[];unsupported=[]
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:return {'status':'UNSUPPORTED','errors':['ABSOLUTE_VALUE_SOURCE_DOMAIN_REQUIRES_ALL_REALS']}
    values=plan.get('coefficients')
    if not isinstance(values,list) or len(values)!=4 or any(not isinstance(value,str) or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in values):return {'status':'UNSUPPORTED','errors':['UNSUPPORTED_ABSOLUTE_VALUE_GRAMMAR']}
    try:b,a,scale,offset=(S.Rational(value) for value in values)
    except (TypeError,ValueError):return {'status':'UNSUPPORTED','errors':['INVALID_ABSOLUTE_VALUE_COEFFICIENT']}
    if a==0 or scale==0:return {'status':'UNSUPPORTED','errors':['ABSOLUTE_VALUE_NONZERO_SCALE_REQUIRED']}
    corner=-b/a;direction='UP' if scale>0 else 'DOWN';threshold=-offset/scale
    if threshold<0:roots=[]
    elif threshold==0:roots=[corner]
    else:
        delta=threshold/abs(a);roots=sorted([corner-delta,corner+delta])
    expected={'schemaVersion':'ABSOLUTE_VALUE_FEATURES_v1','corner':{'x':str(corner),'y':str(offset),'state':'CLOSED'},'xIntercepts':[str(value) for value in roots],'leftTailDirection':direction,'rightTailDirection':direction,'leftArmSlope':str(-scale*abs(a)),'rightArmSlope':str(scale*abs(a))}
    policy={'schemaVersion':'ABSOLUTE_VALUE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','grammar':'K_ABS_AX_PLUS_B_PLUS_C','cornerMarkerRadiusIntrinsicPx':4,'minimumCornerMarkerDiameterCssPx':3,'minimumArmSpanCssPx':50,'minimumArmRiseCssPx':24}
    if plan.get('overviewPolicy')!='ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1':return {'status':'UNSUPPORTED','errors':['ABSOLUTE_VALUE_OVERVIEW_POLICY_REQUIRED']}
    if plan.get('absoluteFeaturePolicy')!=policy:errors.append('ABSOLUTE_VALUE_FEATURE_POLICY_MISMATCH')
    actual=plan.get('absoluteFeatures')
    if actual!=expected:errors.append('ABSOLUTE_VALUE_FEATURE_INVENTORY_MISMATCH')
    if topology.get('corners')!=[float(corner)]:errors.append('ABSOLUTE_VALUE_TOPOLOGY_CORNER_MISMATCH')
    lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];sx=transform['sx']*transform['displayScale'];sy=transform['sy']*transform['displayScale'];width=(xmax-xmin)*sx;height=(ymax-ymin)*sy
    if not lo<float(corner)<hi or not xmin< float(corner)<xmax or not ymin<float(offset)<ymax:errors.append('ABSOLUTE_VALUE_CORNER_OUTSIDE_OVERVIEW')
    if not points:return {'status':'FAIL','errors':['ABSOLUTE_VALUE_CURVE_MISSING']}
    ordered=sorted(points,key=lambda point:point[0]);left=[point for point in ordered if point[0]<float(corner)];right=[point for point in ordered if point[0]>float(corner)]
    if not left or not right:return {'status':'FAIL','errors':['ABSOLUTE_VALUE_CORNER_ARM_MISSING']}
    corner_point=min(ordered,key=lambda point:abs(point[0]-float(corner)))
    if abs(corner_point[0]-float(corner))*sx>.35 or abs(corner_point[1]-float(offset))*sy>.35:errors.append('ABSOLUTE_VALUE_CORNER_NOT_OBSERVED')
    left_span=(float(corner)-left[0][0])*sx;right_span=(right[-1][0]-float(corner))*sx
    sign=1 if scale>0 else -1
    left_rise=max((point[1]-float(offset))*sign*sy for point in left);right_rise=max((point[1]-float(offset))*sign*sy for point in right)
    if left_span<policy['minimumArmSpanCssPx']:unsupported.append('ABSOLUTE_VALUE_LEFT_ARM_BELOW_PROFILE_FLOOR')
    if right_span<policy['minimumArmSpanCssPx']:unsupported.append('ABSOLUTE_VALUE_RIGHT_ARM_BELOW_PROFILE_FLOOR')
    if left_rise<policy['minimumArmRiseCssPx']:unsupported.append('ABSOLUTE_VALUE_LEFT_RISE_BELOW_PROFILE_FLOOR')
    if right_rise<policy['minimumArmRiseCssPx']:unsupported.append('ABSOLUTE_VALUE_RIGHT_RISE_BELOW_PROFILE_FLOOR')
    corner_x_tolerance=.35/max(1e-12,sx)
    left_near=max((point for point in left if point[0]<float(corner)-corner_x_tolerance),key=lambda point:point[0],default=None)
    right_near=min((point for point in right if point[0]>float(corner)+corner_x_tolerance),key=lambda point:point[0],default=None)
    if left_near is None or right_near is None:return {'status':'UNSUPPORTED','errors':['ABSOLUTE_VALUE_ONE_SIDED_TREND_BELOW_DISPLAY_RESOLUTION'],'features':expected,'plotCssSize':[width,height]}
    observed_left=(float(offset)-left_near[1])/(float(corner)-left_near[0]);observed_right=(right_near[1]-float(offset))/(right_near[0]-float(corner))
    if abs(observed_left-float(-scale*abs(a)))>1e-5*max(1,abs(float(scale*a))):errors.append('ABSOLUTE_VALUE_LEFT_TANGENT_DIRECTION_MISMATCH')
    if abs(observed_right-float(scale*abs(a)))>1e-5*max(1,abs(float(scale*a))):errors.append('ABSOLUTE_VALUE_RIGHT_TANGENT_DIRECTION_MISMATCH')
    if abs(ordered[0][0]-lo)*sx>.5 or abs(ordered[-1][0]-hi)*sx>.5:errors.append('ABSOLUTE_VALUE_VISIBLE_ARM_COVERAGE_MISSING')
    for root_value in roots:
        if not any(abs(px-float(root_value))*sx<=.35 and abs(py)*sy<=.35 for px,py in points):errors.append('ABSOLUTE_VALUE_X_INTERCEPT_NOT_OBSERVED')
    markers=[]
    for node in svg_root.iter():
        if node.tag.split('}')[-1]=='circle' and node.get('data-role')=='absolute-corner':
            try:markers.append({'point':((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy']),'radius':float(node.get('r')),'fill':node.get('fill'),'stroke':node.get('stroke'),'strokeWidth':float(node.get('stroke-width'))})
            except (TypeError,ValueError):errors.append('ABSOLUTE_VALUE_CORNER_MARKER_INVALID')
    if len(markers)!=1:errors.append('ABSOLUTE_VALUE_CORNER_MARKER_MISSING_OR_DUPLICATED')
    else:
        marker=markers[0]
        if abs(marker['point'][0]-float(corner))*sx>.35 or abs(marker['point'][1]-float(offset))*sy>.35:errors.append('ABSOLUTE_VALUE_CORNER_MARKER_POSITION_MISMATCH')
        if marker['fill'] not in {'black','#111','#000'} or marker['stroke'] in (None,'none','') or marker['strokeWidth']<=0 or marker['radius']<policy['cornerMarkerRadiusIntrinsicPx']-.01:errors.append('ABSOLUTE_VALUE_CORNER_MARKER_NOT_CLOSED_AND_OUTLINED')
        if 2*marker['radius']*transform['displayScale']<policy['minimumCornerMarkerDiameterCssPx']:unsupported.append('ABSOLUTE_VALUE_CORNER_MARKER_BELOW_PROFILE_FLOOR')
    return {'status':'UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS','errors':sorted(set(errors+unsupported)),'features':expected,'plotCssSize':[width,height],'arms':[{'side':'LEFT','spanCssPx':left_span,'riseCssPx':left_rise},{'side':'RIGHT','spanCssPx':right_span,'riseCssPx':right_rise}],'observedCornerMarkers':len(markers),'topology':{'corner':topology.get('corners'),'roots':topology.get('roots')},'mathMethod':'EXACT_ABS_AFFINE_CORNER_AND_BRANCHES'}

def rational_overview_audit(plan,poly,points,transform,topology,svg_root):
    errors=[]
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:return {'status':'UNSUPPORTED','errors':['RATIONAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS']}
    if plan.get('overviewPolicy')!='RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1':return {'status':'UNSUPPORTED','errors':['RATIONAL_OVERVIEW_POLICY_REQUIRED']}
    try:
        numerator=polynomial(plan.get('numerator'),1);denominator=polynomial(plan.get('denominator'),1)
    except (ValueError,TypeError):return {'status':'UNSUPPORTED','errors':['RATIONAL_LINEAR_OVER_LINEAR_GRAMMAR_REQUIRED']}
    if numerator.degree()!=1 or denominator.degree()!=1:return {'status':'UNSUPPORTED','errors':['RATIONAL_LINEAR_OVER_LINEAR_GRAMMAR_REQUIRED']}
    singularity_x=-denominator.nth(0)/denominator.nth(1)
    numerator_root=-numerator.nth(0)/numerator.nth(1)
    horizontal=numerator.LC()/denominator.LC()
    is_hole=numerator.eval(singularity_x)==0
    expected={'schemaVersion':'RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1','singularity':{'kind':'REMOVABLE_HOLE','x':str(singularity_x),'y':str(horizontal)} if is_hole else {'kind':'VERTICAL_POLE','x':str(singularity_x)},'horizontalAsymptoteY':str(horizontal),'xIntercept':None if is_hole else str(numerator_root)}
    policy={'schemaVersion':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_POLICY_v1','sourceDomain':'ALL_REALS_WITH_DENOMINATOR_EXCLUSION','degreeGrammar':'LINEAR_OVER_LINEAR','singularityPolicy':'ONE_SIMPLE_REAL_POLE_OR_ONE_REMOVABLE_HOLE','horizontalAsymptotePolicy':'EXACT_LEADING_COEFFICIENT_RATIO','minimumFeatureSeparationCssPx':1,'holeMarkerRadiusIntrinsicPx':4,'minimumHoleMarkerDiameterCssPx':4.5}
    if plan.get('rationalFeatures')!=expected:errors.append('RATIONAL_FEATURE_INVENTORY_MISMATCH')
    if plan.get('rationalFeaturePolicy')!=policy:errors.append('RATIONAL_FEATURE_POLICY_MISMATCH')
    x0,x1,y0,y1=plan['viewport'];lo,hi=plan['domain'];sx=transform['sx']*transform['displayScale'];sy=transform['sy']*transform['displayScale']
    width=(x1-x0)*sx;height=(y1-y0)*sy
    pole=float(singularity_x);asym=float(horizontal);root_x=float(numerator_root)
    if not x0+.05*(x1-x0)<pole<x1-.05*(x1-x0):errors.append('RATIONAL_SINGULARITY_OUTSIDE_OVERVIEW')
    if not x0<0<x1 or not y0<0<y1:errors.append('RATIONAL_AXES_ORIGIN_NOT_VISIBLE')
    if not y0+.05*(y1-y0)<asym<y1-.05*(y1-y0):errors.append('RATIONAL_HORIZONTAL_ASYMPTOTE_OUTSIDE_OVERVIEW')
    if is_hole:
        hole_y=float(horizontal)
        if not x0+.05*(x1-x0)<pole<x1-.05*(x1-x0) or not y0+.05*(y1-y0)<hole_y<y1-.05*(y1-y0):errors.append('RATIONAL_HOLE_OUTSIDE_OVERVIEW')
    else:
        if not x0+.05*(x1-x0)<root_x<x1-.05*(x1-x0):errors.append('RATIONAL_NUMERATOR_ZERO_OUTSIDE_OVERVIEW')
        if abs(root_x-pole)*sx<1:return {'status':'UNSUPPORTED','errors':['RATIONAL_ROOT_FEATURE_BELOW_DISPLAY_RESOLUTION'],'features':expected}
    pole_list=topology.get('poles',[]);hole_list=topology.get('holes',[])
    if is_hole:
        if len(hole_list)!=1 or abs(hole_list[0]-pole)>.00000001 or pole_list:errors.append('RATIONAL_HOLE_TOPOLOGY_MISMATCH')
    elif len(pole_list)!=1 or abs(pole_list[0]-pole)>.00000001 or hole_list:errors.append('RATIONAL_POLE_TOPOLOGY_MISMATCH')
    x_tolerance=.35/max(1e-12,sx);left_points=[point for point in points if point[0]<pole];right_points=[point for point in points if point[0]>pole]
    if not left_points or not right_points:errors.append('RATIONAL_BRANCH_SIDE_MISSING')
    branch_width_floor=max(20,width*.10)
    if left_points and (pole-min(point[0] for point in left_points))*sx<branch_width_floor:errors.append('RATIONAL_LEFT_BRANCH_TOO_NARROW')
    if right_points and (max(point[0] for point in right_points)-pole)*sx<branch_width_floor:errors.append('RATIONAL_RIGHT_BRANCH_TOO_NARROW')
    if not is_hole and left_points and right_points:
        residue=float((numerator.eval(singularity_x)/denominator.diff().eval(singularity_x)))
        left_edge=y1 if residue<0 else y0
        right_edge=y1 if residue>0 else y0
        nearest_left=max(left_points,key=lambda point:point[0]);nearest_right=min(right_points,key=lambda point:point[0])
        if abs(nearest_left[1]-left_edge)*sy>1.25:errors.append('RATIONAL_LEFT_POLE_BRANCH_WRONG_SIDE')
        if abs(nearest_right[1]-right_edge)*sy>1.25:errors.append('RATIONAL_RIGHT_POLE_BRANCH_WRONG_SIDE')
        if max(abs(point[1]-asym) for point in left_points)*sy<max(18,height*.12):errors.append('RATIONAL_LEFT_BRANCH_TOO_SHORT')
        if max(abs(point[1]-asym) for point in right_points)*sy<max(18,height*.12):errors.append('RATIONAL_RIGHT_BRANCH_TOO_SHORT')
        left_end=min(points,key=lambda point:point[0]);right_end=max(points,key=lambda point:point[0])
        if abs(left_end[1]-asym)*sy>height*.35 or abs(right_end[1]-asym)*sy>height*.35:errors.append('RATIONAL_HORIZONTAL_TAIL_NOT_VISIBLE')
    elif is_hole and left_points and right_points:
        nearest_left=max(left_points,key=lambda point:point[0]);nearest_right=min(right_points,key=lambda point:point[0])
        if abs(nearest_left[0]-pole)*sx>.35 or abs(nearest_right[0]-pole)*sx>.35:errors.append('RATIONAL_HOLE_BRANCH_GAP_TOO_WIDE')
    asymptote_lines=[]
    for node in svg_root.iter():
        if node.tag.split('}')[-1]=='line' and node.get('data-role')=='asymptote':
            if not node.get('stroke-dasharray'):errors.append('RATIONAL_ASYMPTOTE_MUST_BE_DASHED')
            try:asymptote_lines.append(tuple(float(node.get(key)) for key in ('x1','y1','x2','y2')))
            except (TypeError,ValueError):errors.append('RATIONAL_ASYMPTOTE_LINE_INVALID')
    expected_line_count=2 if not is_hole else 1
    if len(asymptote_lines)!=expected_line_count:errors.append('RATIONAL_ASYMPTOTE_INVENTORY_MISMATCH')
    seen_horizontal=seen_vertical=0
    px_tolerance=.5/max(1e-12,sx);py_tolerance=.5/max(1e-12,sy)
    for x_a,y_a,x_b,y_b in asymptote_lines:
        mx_a,mx_b=(x_a-transform['originX'])/transform['sx'],(x_b-transform['originX'])/transform['sx']
        my_a,my_b=(transform['originY']-y_a)/transform['sy'],(transform['originY']-y_b)/transform['sy']
        if abs(my_a-asym)<=py_tolerance and abs(my_b-asym)<=py_tolerance and abs(mx_a-x0)<=px_tolerance and abs(mx_b-x1)<=px_tolerance:seen_horizontal+=1
        elif not is_hole and abs(mx_a-pole)<=px_tolerance and abs(mx_b-pole)<=px_tolerance and abs(my_a-y0)<=py_tolerance and abs(my_b-y1)<=py_tolerance:seen_vertical+=1
        else:errors.append('RATIONAL_ASYMPTOTE_GEOMETRY_MISMATCH')
    if seen_horizontal!=1:errors.append('RATIONAL_HORIZONTAL_ASYMPTOTE_MISSING_OR_WRONG')
    if not is_hole and seen_vertical!=1:errors.append('RATIONAL_VERTICAL_ASYMPTOTE_MISSING_OR_WRONG')
    expected_hole=[]
    for node in svg_root.iter():
        if node.tag.split('}')[-1]=='circle' and node.get('data-role')=='hole' and node.get('fill') in {'white','#fff','#ffffff'}:
            try:expected_hole.append({'point':((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy']),'radius':float(node.get('r')),'stroke':node.get('stroke'),'strokeWidth':float(node.get('stroke-width'))})
            except (TypeError,ValueError):errors.append('RATIONAL_HOLE_MARKER_INVALID')
    if is_hole:
        if len(expected_hole)!=1:errors.append('REMOVABLE_HOLE_MARKER_MISSING_OR_WRONG')
        else:
            marker=expected_hole[0]
            if abs(marker['point'][0]-pole)*sx>.35 or abs(marker['point'][1]-asym)*sy>.35:errors.append('REMOVABLE_HOLE_MARKER_MISSING_OR_WRONG')
            if marker['radius']<policy['holeMarkerRadiusIntrinsicPx']-.01 or marker['stroke'] in (None,'none','') or marker['strokeWidth']<=0:errors.append('RATIONAL_HOLE_MARKER_OUTLINE_INVALID')
            if 2*marker['radius']*transform['displayScale']<policy['minimumHoleMarkerDiameterCssPx']:return {'status':'UNSUPPORTED','errors':['RATIONAL_HOLE_MARKER_BELOW_DISPLAY_RESOLUTION'],'features':expected,'plotCssSize':[width,height]}
    elif expected_hole:errors.append('UNEXPECTED_RATIONAL_HOLE_MARKER')
    return {'status':'FAIL' if errors else 'PASS','errors':sorted(set(errors)),'features':expected,'plotCssSize':[width,height],'topology':{'poles':pole_list,'holes':hole_list,'visibleIntervals':topology.get('visibleIntervals')},'asymptoteLines':len(asymptote_lines),'branchSideCounts':[len(left_points),len(right_points)],'mathMethod':'EXACT_LINEAR_OVER_LINEAR_RATIONAL_TOPOLOGY'}

def sqrt_affine_overview_audit(plan,poly,points,transform,topology,svg_root):
    errors=[];unsupported=[]
    try:radicand=polynomial(plan.get('radicand'),1)
    except (ValueError,TypeError):return {'status':'UNSUPPORTED','errors':['SQRT_AFFINE_GRAMMAR_REQUIRED']}
    if radicand.degree()!=1 or radicand.nth(1)<=0:return {'status':'UNSUPPORTED','errors':['SQRT_AFFINE_POSITIVE_SLOPE_REQUIRED']}
    boundary=-radicand.nth(0)/radicand.nth(1);source_domain=plan.get('sourceDomain')
    if source_domain=={'kind':'NATURAL_SQRT_AFFINE'}:
        mode='NATURAL_SQRT_AFFINE';source_range=None
        endpoints=[{'x':str(boundary),'y':0.0,'state':'CLOSED','source':'NATURAL_RADICAND_BOUNDARY'}]
    elif isinstance(source_domain,dict) and set(source_domain)=={'kind','range'} and source_domain.get('kind')=='CLOSED_INTERVAL':
        raw_range=source_domain['range']
        if not isinstance(raw_range,list) or len(raw_range)!=2 or any(not isinstance(value,str) for value in raw_range):return {'status':'UNSUPPORTED','errors':['INVALID_SQRT_SOURCE_INTERVAL']}
        try:exact_range=[S.Rational(value) for value in raw_range]
        except (TypeError,ValueError):return {'status':'UNSUPPORTED','errors':['INVALID_SQRT_SOURCE_INTERVAL']}
        if not exact_range[0]<exact_range[1] or exact_range[0]<boundary:return {'status':'UNSUPPORTED','errors':['SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY']}
        mode='CLOSED_INTERVAL';source_range=[float(value) for value in exact_range]
        endpoints=[{'x':str(exact_range[0]),'y':math.sqrt(float(radicand.eval(exact_range[0]))),'state':'CLOSED','source':'SOURCE_INTERVAL_START'},{'x':str(exact_range[1]),'y':math.sqrt(float(radicand.eval(exact_range[1]))),'state':'CLOSED','source':'SOURCE_INTERVAL_END'}]
    else:return {'status':'UNSUPPORTED','errors':['SQRT_SOURCE_DOMAIN_UNSUPPORTED']}
    policy={'schemaVersion':'SQRT_AFFINE_FEATURE_POLICY_v1','sourceDomainMode':mode,'boundaryPolicy':'NATURAL_NONNEGATIVE_RADICAND','endpointState':'CLOSED','rightTailDirection':'UP','endpointMarkerRadiusIntrinsicPx':4,'minimumEndpointMarkerDiameterCssPx':3,'minimumEndpointToTailSpanCssPx':48}
    wanted={'schemaVersion':'SQRT_AFFINE_FEATURES_v1','radicandBoundaryX':str(boundary),'sourceEndpoints':endpoints,'rightTailDirection':'UP'}
    if plan.get('overviewPolicy')!='SQRT_AFFINE_ENDPOINT_OVERVIEW_v1':return {'status':'UNSUPPORTED','errors':['SQRT_AFFINE_OVERVIEW_POLICY_REQUIRED']}
    if plan.get('sqrtFeaturePolicy')!=policy:errors.append('SQRT_FEATURE_POLICY_MISMATCH')
    actual=plan.get('sqrtFeatures')
    if not isinstance(actual,dict) or set(actual)!={'schemaVersion','radicandBoundaryX','sourceEndpoints','rightTailDirection'} or actual.get('schemaVersion')!=wanted['schemaVersion'] or actual.get('radicandBoundaryX')!=wanted['radicandBoundaryX'] or actual.get('rightTailDirection')!='UP' or not isinstance(actual.get('sourceEndpoints'),list) or len(actual['sourceEndpoints'])!=len(endpoints):errors.append('SQRT_ENDPOINT_INVENTORY_MISMATCH')
    else:
        for got,expected in zip(actual['sourceEndpoints'],endpoints):
            if not isinstance(got,dict) or set(got)!=set(expected) or any(got.get(key)!=expected[key] for key in ('x','state','source')) or not isinstance(got.get('y'),(int,float)) or not math.isfinite(got['y']) or abs(got['y']-expected['y'])>1e-8:errors.append('SQRT_ENDPOINT_INVENTORY_MISMATCH');break
    lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];sx=transform['sx']*transform['displayScale'];sy=transform['sy']*transform['displayScale'];x_tol=.35/max(1e-12,sx);y_tol=.35/max(1e-12,sy)
    start=source_range[0] if mode=='CLOSED_INTERVAL' else float(boundary);end=source_range[1] if mode=='CLOSED_INTERVAL' else hi
    if mode=='CLOSED_INTERVAL':
        if lo!=source_range[0] or hi!=source_range[1]:errors.append('SQRT_SOURCE_INTERVAL_EXPANDED_OR_SHRUNK')
    elif abs(lo-start)>1e-10:errors.append('SQRT_NATURAL_DOMAIN_START_MISMATCH')
    if not xmin+1e-6<start<xmax-1e-6 or not ymin<0<ymax:errors.append('SQRT_ENDPOINT_OR_AXES_OUTSIDE_OVERVIEW')
    endpoint_to_tail_span_css=(end-start)*sx
    if endpoint_to_tail_span_css<policy['minimumEndpointToTailSpanCssPx']:unsupported.append('SQRT_ENDPOINT_TO_TAIL_SPAN_BELOW_PROFILE_FLOOR')
    if lo<start-1e-10 or hi>end+1e-10:errors.append('SQRT_SAMPLED_OUTSIDE_SOURCE_DOMAIN')
    if not points:return {'status':'FAIL','errors':['SQRT_FINAL_CURVE_MISSING']}
    ordered=sorted(points,key=lambda point:point[0])
    if ordered[0][0]<start-x_tol:errors.append('SQRT_CURVE_BEFORE_SOURCE_DOMAIN')
    if abs(ordered[0][0]-start)*sx>.35 or abs(ordered[0][1]-endpoints[0]['y'])*sy>.35:errors.append('SQRT_SOURCE_START_ENDPOINT_NOT_OBSERVED')
    if abs(ordered[-1][0]-end)*sx>.5:errors.append('SQRT_SOURCE_END_ENDPOINT_NOT_OBSERVED')
    if len(ordered)>1 and ordered[1][1]<=ordered[0][1]:errors.append('SQRT_ONE_SIDED_TREND_NOT_INCREASING')
    if ordered[-1][1]<=ordered[0][1]:errors.append('SQRT_RIGHT_TAIL_NOT_INCREASING')
    for point in plan.get('requiredPoints',[]):
        px,py=float(point['x']),float(point['y']);exact_value=radicand.eval(S.Rational(str(px)))
        if exact_value<0 or abs(py*py-float(exact_value))>1e-8:errors.append('SQRT_REQUIRED_POINT_NOT_ON_CURVE:'+point['id']);continue
        if mode=='CLOSED_INTERVAL' and not source_range[0]<=px<=source_range[1]:errors.append('SQRT_REQUIRED_POINT_OUTSIDE_SOURCE_INTERVAL:'+point['id'])
        if not any(abs(x-px)<=x_tol and abs(y-py)<=y_tol for x,y in points):errors.append('SQRT_REQUIRED_POINT_NOT_OBSERVED:'+point['id'])
    markers=[]
    for node in svg_root.iter():
        if node.tag.split('}')[-1]=='circle' and node.get('data-role')=='domain-endpoint':
            try:markers.append({'point':((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy']),'radius':float(node.get('r')),'fill':node.get('fill'),'stroke':node.get('stroke'),'strokeWidth':float(node.get('stroke-width'))})
            except (TypeError,ValueError):errors.append('SQRT_ENDPOINT_MARKER_INVALID')
    if len(markers)!=len(endpoints):errors.append('SQRT_ENDPOINT_MARKER_COUNT_MISMATCH')
    else:
        for marker,endpoint in zip(markers,endpoints):
            x,y=float(S.Rational(endpoint['x'])),float(endpoint['y'])
            if abs(marker['point'][0]-x)*sx>.35 or abs(marker['point'][1]-y)*sy>.35:errors.append('SQRT_ENDPOINT_MARKER_POSITION_MISMATCH')
            if marker['fill'] not in {'#111','black','#000'} or marker['stroke'] in (None,'none','') or marker['strokeWidth']<=0 or marker['radius']<policy['endpointMarkerRadiusIntrinsicPx']-.01:errors.append('SQRT_ENDPOINT_MARKER_MUST_BE_CLOSED_AND_OUTLINED')
            if 2*marker['radius']*transform['displayScale']<policy['minimumEndpointMarkerDiameterCssPx']:unsupported.append('SQRT_ENDPOINT_MARKER_BELOW_DISPLAY_RESOLUTION')
    return {'status':'UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS','errors':sorted(set(errors+unsupported)),'features':wanted,'plotCssSize':[(xmax-xmin)*sx,(ymax-ymin)*sy],'endpointToTailSpanCss':endpoint_to_tail_span_css,'minimumEndpointToTailSpanCss':policy['minimumEndpointToTailSpanCssPx'],'topology':{'boundary':topology.get('boundary'),'visibleIntervals':topology.get('visibleIntervals')},'observedEndpointMarkers':len(markers),'rightTailDirection':'UP','mathMethod':'EXACT_AFFINE_RADICAND_DOMAIN_AND_ENDPOINT'}

def _piecewise_rational(value,code):
    if not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'(?:0|-?[1-9]\d*)(?:/[1-9]\d*)?',value):raise ValueError(code)
    try:parsed=Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None
    if str(parsed)!=value:raise ValueError(code)
    return parsed

def piecewise_affine_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        source=plan.get('sourceDomain');piecewise=plan.get('piecewise');features=plan.get('piecewiseFeatures');policy=plan.get('piecewiseFeaturePolicy')
        if not isinstance(source,dict) or set(source)!={'kind','range'} or source.get('kind')!='CLOSED_INTERVAL' or not isinstance(source.get('range'),list) or len(source['range'])!=2:raise ValueError('PIECEWISE_SOURCE_DOMAIN_REQUIRES_CLOSED_INTERVAL')
        lo,hi=(_piecewise_rational(value,'INVALID_PIECEWISE_SOURCE_ENDPOINT') for value in source['range'])
        if not lo<hi:raise ValueError('INVALID_PIECEWISE_SOURCE_INTERVAL')
        if plan.get('domain')!=[float(lo),float(hi)]:errors.append('PIECEWISE_DRAW_DOMAIN_EXPANDED_OR_CHANGED')
        if not isinstance(piecewise,dict) or set(piecewise)!={'breakX','owner','left','right'} or piecewise.get('owner') not in {'LEFT','RIGHT'}:raise ValueError('INVALID_PIECEWISE_GRAMMAR')
        br=_piecewise_rational(piecewise.get('breakX'),'INVALID_PIECEWISE_BREAKPOINT')
        if not lo<br<hi:raise ValueError('PIECEWISE_BREAKPOINT_OUTSIDE_SOURCE_INTERIOR')
        coeff={}
        for side in ('left','right'):
            values=piecewise.get(side)
            if not isinstance(values,list) or len(values)!=2:raise ValueError('INVALID_PIECEWISE_BRANCH')
            coeff[side]=tuple(_piecewise_rational(value,'INVALID_PIECEWISE_COEFFICIENT') for value in values)
        left_m,left_c=coeff['left'];right_m,right_c=coeff['right']
        left_start=left_m*lo+left_c;left_limit=left_m*br+left_c;right_limit=right_m*br+right_c;right_end=right_m*hi+right_c
        owner_value=left_limit if piecewise['owner']=='LEFT' else right_limit
        continuity='CONTINUOUS' if left_limit==right_limit else 'JUMP'
        expected_markers=[{'id':'source-start','kind':'SOURCE_ENDPOINT','x':str(lo),'y':str(left_start),'state':'CLOSED','owner':'LEFT'}, {'id':'source-end','kind':'SOURCE_ENDPOINT','x':str(hi),'y':str(right_end),'state':'CLOSED','owner':'RIGHT'}]
        if continuity=='CONTINUOUS':expected_markers.append({'id':'breakpoint-closed','kind':'BREAKPOINT','x':str(br),'y':str(owner_value),'state':'CLOSED','owner':piecewise['owner']})
        else:
            other='RIGHT' if piecewise['owner']=='LEFT' else 'LEFT';other_value=right_limit if other=='RIGHT' else left_limit
            expected_markers.extend([{'id':'breakpoint-owner-closed','kind':'BREAKPOINT','x':str(br),'y':str(owner_value),'state':'CLOSED','owner':piecewise['owner']},{'id':'breakpoint-limit-open','kind':'BREAKPOINT','x':str(br),'y':str(other_value),'state':'OPEN','owner':other}])
        expected_features={'schemaVersion':'PIECEWISE_AFFINE_FEATURES_v1','sourceInterval':{'lo':str(lo),'hi':str(hi),'startState':'CLOSED','endState':'CLOSED'},'breakpoint':{'x':str(br),'owner':piecewise['owner'],'leftLimitY':str(left_limit),'rightLimitY':str(right_limit),'valueY':str(owner_value),'continuity':continuity},'markers':expected_markers}
        expected_policy={'schemaVersion':'PIECEWISE_AFFINE_FEATURE_POLICY_v1','sourceDomainMode':'CLOSED_INTERVAL','breakpointOwnership':piecewise['owner'],'outerEndpointState':'CLOSED','jumpPolicy':'OWNER_CLOSED_OTHER_LIMIT_OPEN','continuousJoinPolicy':'ONE_CLOSED_MARKER','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3,'minimumBranchSpanCssPx':32}
        if features!=expected_features:errors.append('PIECEWISE_FEATURE_INVENTORY_MISMATCH')
        if policy!=expected_policy:errors.append('PIECEWISE_FEATURE_POLICY_MISMATCH')
        if plan.get('overviewPolicy')!='PIECEWISE_AFFINE_TWO_BRANCH_OVERVIEW_v1':errors.append('PIECEWISE_OVERVIEW_POLICY_REQUIRED')
        transform_keys={'originX','originY','sx','sy','displayScale'}
        if set(transform)!=transform_keys or any(not isinstance(value,(int,float)) or not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root=ET.fromstring(svg);sx=transform['sx'];sy=transform['sy'];display=transform['displayScale'];x_tol=.35/max(1e-12,sx*display);y_tol=.35/max(1e-12,sy*display)
        paths=[node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve']
        branches={node.get('data-branch'):node for node in paths}
        if len(paths)!=2 or set(branches)!={'LEFT','RIGHT'}:errors.append('PIECEWISE_BRANCH_PRIMITIVE_INVENTORY_MISMATCH')
        branch_rows=[];all_points=[]
        for side,(start,end,(slope,intercept)) in {'LEFT':(lo,br,coeff['left']),'RIGHT':(br,hi,coeff['right'])}.items():
            node=branches.get(side)
            if node is None:continue
            values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('points',''))]
            if len(values)<4 or len(values)%2 or not all(math.isfinite(value) for value in values):errors.append('PIECEWISE_CURVE_POINTS_INVALID');continue
            points=[((values[index]-transform['originX'])/sx,(transform['originY']-values[index+1])/sy) for index in range(0,len(values),2)]
            all_points.extend(points)
            if any(right[0]<=left[0] for left,right in zip(points,points[1:])):errors.append('PIECEWISE_BRANCH_NOT_STRICTLY_INCREASING_X')
            if points[0][0]<float(start)-x_tol or points[-1][0]>float(end)+x_tol:errors.append('PIECEWISE_BRANCH_CROSSES_OWNERSHIP_INTERVAL')
            if abs(points[0][0]-float(start))>x_tol or abs(points[-1][0]-float(end))>x_tol:errors.append('PIECEWISE_BRANCH_ENDPOINT_COVERAGE_FAIL:'+side)
            for px,py in points:
                exact_y=slope*Fraction(str(px))+intercept
                if abs(py-float(exact_y))>y_tol:errors.append('PIECEWISE_WRONG_BRANCH_EQUATION:'+side);break
                if not plan['viewport'][0]-x_tol<=px<=plan['viewport'][1]+x_tol or not plan['viewport'][2]-y_tol<=py<=plan['viewport'][3]+y_tol:errors.append('PIECEWISE_CURVE_CLIPPED:'+side)
            if any(left[0]<float(br)-x_tol and right[0]>float(br)+x_tol for left,right in zip(points,points[1:])):errors.append('PIECEWISE_CROSS_BREAK_CHORD:'+side)
            branch_span=(float(end-start))*sx*display
            if branch_span<policy['minimumBranchSpanCssPx']:unsupported.append('PIECEWISE_BRANCH_BELOW_PROFILE_FLOOR:'+side)
            branch_rows.append({'side':side,'sourceInterval':[str(start),str(end)],'points':len(points),'branchSpanCssPx':branch_span})
        markers=[]
        for node in root.iter():
            role=node.get('data-role')
            if node.tag.split('}')[-1]=='circle' and role in {'piecewise-source-endpoint','piecewise-breakpoint'}:
                try:markers.append({'id':node.get('id'),'kind':role,'state':node.get('data-state'),'owner':node.get('data-owner'),'point':((float(node.get('cx'))-transform['originX'])/sx,(transform['originY']-float(node.get('cy')))/sy),'radius':float(node.get('r')),'fill':node.get('fill'),'stroke':node.get('stroke'),'strokeWidth':float(node.get('stroke-width'))})
                except (TypeError,ValueError):errors.append('PIECEWISE_MARKER_INVALID')
        expected_rows=[{'id':'piecewise-'+marker['id'],'kind':'piecewise-source-endpoint' if marker['kind']=='SOURCE_ENDPOINT' else 'piecewise-breakpoint','state':marker['state'],'owner':marker['owner'],'point':(float(Fraction(marker['x'])),float(Fraction(marker['y'])))} for marker in expected_markers]
        if len(markers)!=len(expected_rows):errors.append('PIECEWISE_MARKER_COUNT_MISMATCH')
        else:
            unused=list(markers)
            for expected in expected_rows:
                found=next((marker for marker in unused if marker['id']==expected['id']),None)
                if found is None:errors.append('PIECEWISE_MARKER_ID_MISMATCH');continue
                unused.remove(found)
                if found['kind']!=expected['kind'] or found['state']!=expected['state'] or found['owner']!=expected['owner']:errors.append('PIECEWISE_MARKER_OWNERSHIP_MISMATCH')
                if abs(found['point'][0]-expected['point'][0])*sx*display>.35 or abs(found['point'][1]-expected['point'][1])*sy*display>.35:errors.append('PIECEWISE_MARKER_POSITION_MISMATCH')
                fill_ok=found['fill'] in ({'white','#fff','#ffffff'} if expected['state']=='OPEN' else {'black','#111','#000'})
                if not fill_ok or found['stroke'] in (None,'none','') or found['strokeWidth']<=0 or found['radius']<policy['markerRadiusIntrinsicPx']-.01:errors.append('PIECEWISE_MARKER_STATE_STYLE_MISMATCH')
                if 2*found['radius']*display<policy['minimumMarkerDiameterCssPx']:unsupported.append('PIECEWISE_MARKER_BELOW_PROFILE_FLOOR:'+expected['id'])
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        topology={'sourceInterval':[str(lo),str(hi)],'breakpointOwnership':piecewise['owner'],'continuity':continuity,'leftIntervalState':['CLOSED','CLOSED' if piecewise['owner']=='LEFT' else 'OPEN'],'rightIntervalState':['CLOSED' if piecewise['owner']=='RIGHT' else 'OPEN','CLOSED'],'visibleIntervals':[[float(lo),float(br)],[float(br),float(hi)]]}
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':expected_features,'branchCoverage':branch_rows,'markers':markers,'topology':topology,'maximumMarkerDiameterCssFloor':policy['minimumMarkerDiameterCssPx'],'minimumBranchSpanCssFloor':policy['minimumBranchSpanCssPx'],'mathMethod':'EXACT_RATIONAL_TWO_BRANCH_SOURCE_INTERVAL_AND_OWNER_RECOMPUTATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,ET.ParseError) as error:
        return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'PIECEWISE_SOURCE_OR_SVG_SCHEMA_INVALID']}

def _observed_svg_points(root,transform):
    sx,sy,display=transform['sx'],transform['sy'],transform['displayScale']
    paths=[node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve']
    if len(paths)!=1:return [],['GRAPH_CURVE_PRIMITIVE_INVENTORY_MISMATCH']
    values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',paths[0].get('points',''))]
    if len(values)<4 or len(values)%2 or not all(math.isfinite(value) for value in values):return [],['GRAPH_CURVE_POINTS_INVALID']
    return [((values[i]-transform['originX'])/sx,(transform['originY']-values[i+1])/sy) for i in range(0,len(values),2)],[ ]

def _audit_feature_line(root,role,axis,coordinate,transform):
    nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='line' and node.get('data-role')==role]
    if len(nodes)!=1:return ['GRAPH_ASYMPTOTE_PRIMITIVE_MISSING_OR_DUPLICATED']
    node=nodes[0]
    try:
        a=((float(node.get('x1'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y1')))/transform['sy'])
        b=((float(node.get('x2'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y2')))/transform['sy'])
    except (TypeError,ValueError):return ['GRAPH_ASYMPTOTE_PRIMITIVE_INVALID']
    tol=.35/(transform['sx']*transform['displayScale'] if axis=='vertical' else transform['sy']*transform['displayScale'])
    if node.get('stroke-dasharray') not in {'5 4','5,4'}:return ['GRAPH_ASYMPTOTE_MUST_BE_DASHED']
    if axis=='horizontal' and (abs(a[1]-coordinate)>tol or abs(b[1]-coordinate)>tol or a[0]>=b[0]):return ['GRAPH_HORIZONTAL_ASYMPTOTE_POSITION_MISMATCH']
    if axis=='vertical' and (abs(a[0]-coordinate)>tol or abs(b[0]-coordinate)>tol or a[1]>=b[1]):return ['GRAPH_VERTICAL_DOMAIN_CUE_POSITION_MISMATCH']
    return []

def _audit_reference_marker(root,role,point,policy,transform):
    nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='circle' and node.get('data-role')==role]
    if len(nodes)!=1:return ['GRAPH_REFERENCE_MARKER_MISSING_OR_DUPLICATED'],None
    node=nodes[0]
    try:
        observed=((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy'])
        radius=float(node.get('r'));stroke_width=float(node.get('stroke-width'))
    except (TypeError,ValueError):return ['GRAPH_REFERENCE_MARKER_INVALID'],None
    errors=[]
    if node.get('fill') not in {'black','#111','#000'} or node.get('stroke') in (None,'none','') or stroke_width<=0 or radius<policy['referenceMarkerRadiusIntrinsicPx']-.01:errors.append('GRAPH_REFERENCE_MARKER_STYLE_MISMATCH')
    if abs(observed[0]-point[0])*transform['sx']*transform['displayScale']>.35 or abs(observed[1]-point[1])*transform['sy']*transform['displayScale']>.35:errors.append('GRAPH_REFERENCE_MARKER_POSITION_MISMATCH')
    if 2*radius*transform['displayScale']<policy['minimumReferenceMarkerDiameterCssPx']:errors.append('GRAPH_REFERENCE_MARKER_BELOW_PROFILE_FLOOR')
    return errors,observed

def exponential_affine_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        values=plan.get('coefficients');a,k,c=(_piecewise_rational(value,'INVALID_EXPONENTIAL_COEFFICIENT') for value in values)
        if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
        if a==0 or k==0:raise ValueError('EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED')
        lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];features=plan.get('exponentialFeatures');policy=plan.get('exponentialFeaturePolicy')
        expected_features={'schemaVersion':'EXPONENTIAL_AFFINE_FEATURES_v1','referencePoint':{'x':'0','y':str(a+c)},'horizontalAsymptote':{'y':str(c),'side':'LEFT' if k>0 else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if a*k>0 else 'DECREASING','growthSide':'RIGHT' if k>0 else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
        expected_policy={'schemaVersion':'EXPONENTIAL_AFFINE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','referenceArgument':'EXPONENT_ZERO','asymptotePolicy':'EXACT_VERTICAL_SHIFT','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumAsymptoteSeparationCssPx':2,'minimumBranchSpanCssPx':32}
        if features!=expected_features:errors.append('EXPONENTIAL_FEATURE_INVENTORY_MISMATCH')
        if policy!=expected_policy:errors.append('EXPONENTIAL_FEATURE_POLICY_MISMATCH')
        if plan.get('overviewPolicy')!='EXPONENTIAL_AFFINE_OVERVIEW_v1':errors.append('EXPONENTIAL_OVERVIEW_POLICY_REQUIRED')
        if not xmin<0<xmax:errors.append('EXPONENTIAL_REFERENCE_OUTSIDE_VIEWPORT')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root=ET.fromstring(svg);points,point_errors=_observed_svg_points(root,transform);errors.extend(point_errors)
        if points:
            points=sorted(points,key=lambda point:point[0]);scale=transform['sy']*transform['displayScale'];xscale=transform['sx']*transform['displayScale'];x_tol=.35/max(1e-12,xscale)
            if abs(points[0][0]-lo)>x_tol or abs(points[-1][0]-hi)>x_tol:errors.append('EXPONENTIAL_DRAW_DOMAIN_COVERAGE_FAIL')
            direction=1 if a*k>0 else -1
            if any((right[1]-left[1])*direction< -1e-8 for left,right in zip(points,points[1:])):errors.append('EXPONENTIAL_MONOTONICITY_FAIL')
            for px,py in points:
                expected=float(a)*math.exp(float(k)*px)+float(c)
                if not math.isfinite(expected) or abs(py-expected)*scale>.35:errors.append('EXPONENTIAL_WRONG_CURVE');break
            if (hi-lo)*xscale<policy['minimumBranchSpanCssPx']:unsupported.append('EXPONENTIAL_BRANCH_BELOW_PROFILE_FLOOR')
        asym=float(c);errors.extend(_audit_feature_line(root,'exponential-asymptote','horizontal',asym,transform))
        ref=(0.0,float(a+c));marker_errors,marker=_audit_reference_marker(root,'exponential-reference',ref,policy,transform);errors.extend(marker_errors)
        separation=abs(float(a))*transform['sy']*transform['displayScale']
        if separation<policy['minimumAsymptoteSeparationCssPx']:unsupported.append('EXPONENTIAL_REFERENCE_ASYMPTOTE_BELOW_PROFILE_FLOOR')
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':expected_features,'monotonicity':expected_features['monotonicity'],'curvePoints':len(points),'referenceMarker':marker,'referenceAsymptoteSeparationCssPx':separation,'mathMethod':'EXACT_RATIONAL_COEFFICIENTS_AND_INDEPENDENT_EXPONENTIAL_EVALUATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'EXPONENTIAL_SOURCE_SCHEMA_INVALID']}

def logarithmic_affine_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        a,k,b,c=(_piecewise_rational(value,'INVALID_LOGARITHMIC_COEFFICIENT') for value in plan.get('coefficients'))
        if plan.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
        if a==0 or k==0:raise ValueError('LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED')
        root=-b/k;reference=(1-b)/k;lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];features=plan.get('logarithmicFeatures');policy=plan.get('logarithmicFeaturePolicy')
        boundary_side='RIGHT' if k>0 else 'LEFT';limit_direction='DOWN' if a>0 else 'UP';monotonicity='INCREASING' if a*k>0 else 'DECREASING'
        expected_features={'schemaVersion':'LOGARITHMIC_AFFINE_FEATURES_v1','naturalDomainBoundaryX':str(root),'boundarySide':boundary_side,'boundaryLimitDirection':limit_direction,'referencePoint':{'x':str(reference),'y':str(c),'argument':'1'},'monotonicity':monotonicity,'sampleBoundaryArgument':'1/8','sampleDomain':plan['domain']}
        expected_policy={'schemaVersion':'LOGARITHMIC_AFFINE_FEATURE_POLICY_v1','sourceDomain':'kx+b>0','domainBoundaryPolicy':'NATURAL_OPEN_BOUNDARY','referenceArgument':'1','sampleBoundaryArgument':'1/8','boundaryCue':'DASHED_VERTICAL_LINE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32}
        if features!=expected_features:errors.append('LOGARITHMIC_FEATURE_INVENTORY_MISMATCH')
        if policy!=expected_policy:errors.append('LOGARITHMIC_FEATURE_POLICY_MISMATCH')
        if plan.get('overviewPolicy')!='LOGARITHMIC_AFFINE_OVERVIEW_v1':errors.append('LOGARITHMIC_OVERVIEW_POLICY_REQUIRED')
        if not (lo<hi and (float(root)<lo if k>0 else hi<float(root))):errors.append('LOGARITHMIC_DRAW_DOMAIN_WRONG_SIDE_OF_BOUNDARY')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root_svg=ET.fromstring(svg);points,point_errors=_observed_svg_points(root_svg,transform);errors.extend(point_errors)
        if points:
            points=sorted(points,key=lambda point:point[0]);xscale=transform['sx']*transform['displayScale'];yscale=transform['sy']*transform['displayScale'];x_tol=.35/max(1e-12,xscale)
            if abs(points[0][0]-lo)>x_tol or abs(points[-1][0]-hi)>x_tol:errors.append('LOGARITHMIC_DRAW_DOMAIN_COVERAGE_FAIL')
            sign=1 if a*k>0 else -1
            if any((right[1]-left[1])*sign< -1e-8 for left,right in zip(points,points[1:])):errors.append('LOGARITHMIC_MONOTONICITY_FAIL')
            for px,py in points:
                argument=float(k)*px+float(b)
                if argument<=0:errors.append('LOGARITHMIC_CURVE_OUTSIDE_NATURAL_DOMAIN');break
                expected=float(a)*math.log(argument)+float(c)
                if not math.isfinite(expected) or abs(py-expected)*yscale>.35:errors.append('LOGARITHMIC_WRONG_CURVE');break
            near_boundary=points[0][0] if k>0 else points[-1][0];gap=abs(near_boundary-float(root))*xscale
            if gap<policy['minimumBoundaryApproachGapCssPx']:unsupported.append('LOGARITHMIC_BOUNDARY_GAP_BELOW_PROFILE_FLOOR')
            if (hi-lo)*xscale<policy['minimumBranchSpanCssPx']:unsupported.append('LOGARITHMIC_BRANCH_BELOW_PROFILE_FLOOR')
        else:gap=0.0
        errors.extend(_audit_feature_line(root_svg,'logarithmic-domain-boundary','vertical',float(root),transform))
        reference_point=(float(reference),float(c));marker_errors,marker=_audit_reference_marker(root_svg,'logarithmic-reference',reference_point,policy,transform);errors.extend(marker_errors)
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':expected_features,'monotonicity':monotonicity,'curvePoints':len(points),'boundaryApproachGapCssPx':gap,'referenceMarker':marker,'mathMethod':'EXACT_AFFINE_LOG_DOMAIN_AND_INDEPENDENT_NATURAL_LOG_EVALUATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'LOGARITHMIC_SOURCE_SCHEMA_INVALID']}

def _exp_log_observer_base(value,code):
    """Independent exact base parser (never imports the producer). None/'e' is the natural base e."""
    if value in (None,'e'):return {'text':'e','kind':'NATURAL','exact':S.E,'greaterThanOne':True,'float':math.e}
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

def _exp_log_base_fields(base):
    return {'base':base['text'],'baseKind':base['kind'],'baseGreaterThanOne':base['greaterThanOne']}

def _exp_log_exact_value(row,x_value):
    """Recompute one exp/log curve at an x coordinate from its exact coefficients/base (floats only for the final comparison)."""
    if row['family']=='exponential-affine':
        a,k,c=row['_coefficients']
        return float(a)*(row['_base']['float']**(float(k)*(float(x_value)-float(row['_shift']))))+float(c)
    a,k,b,c=row['_coefficients']
    argument=float(k)*float(x_value)+float(b)
    if argument<=0:raise ValueError('LOGARITHMIC_CURVE_OUTSIDE_NATURAL_DOMAIN')
    return float(a)*math.log(argument)/math.log(row['_base']['float'])+float(c)

def _observed_curve_branches(root,transform):
    rows={}
    for node in root.iter():
        if node.tag.split('}')[-1]!='polyline' or node.get('data-role')!='curve':continue
        branch=node.get('data-branch')
        if not branch:return {},['GRAPH_CURVE_BRANCH_TAG_MISSING']
        values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('points',''))]
        if len(values)<4 or len(values)%2 or not all(math.isfinite(value) for value in values):return {},['GRAPH_CURVE_POINTS_INVALID']
        rows.setdefault(branch,[]).append([((values[i]-transform['originX'])/transform['sx'],(transform['originY']-values[i+1])/transform['sy']) for i in range(0,len(values),2)])
    return rows,[]

def _audit_id_line(root,element_id,axis,coordinate,transform,dashed=True):
    nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='line' and node.get('id')==element_id]
    if len(nodes)!=1:return ['GRAPH_ID_LINE_MISSING_OR_DUPLICATED:'+element_id]
    node=nodes[0]
    try:
        a=((float(node.get('x1'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y1')))/transform['sy'])
        b=((float(node.get('x2'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y2')))/transform['sy'])
    except (TypeError,ValueError):return ['GRAPH_ID_LINE_INVALID:'+element_id]
    tol=.35/(transform['sx']*transform['displayScale'] if axis=='vertical' else transform['sy']*transform['displayScale'])
    if dashed and node.get('stroke-dasharray') not in {'5 4','5,4','4 3','4,3'}:return ['GRAPH_ID_LINE_MUST_BE_DASHED:'+element_id]
    if axis=='horizontal' and (abs(a[1]-coordinate)>tol or abs(b[1]-coordinate)>tol or a[0]>=b[0]):return ['GRAPH_HORIZONTAL_ASYMPTOTE_POSITION_MISMATCH:'+element_id]
    if axis=='vertical' and (abs(a[0]-coordinate)>tol or abs(b[0]-coordinate)>tol or a[1]>=b[1]):return ['GRAPH_VERTICAL_DOMAIN_CUE_POSITION_MISMATCH:'+element_id]
    return []

def _audit_id_marker(root,element_id,point,policy,transform):
    nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='circle' and node.get('id')==element_id]
    if len(nodes)!=1:return ['GRAPH_REFERENCE_MARKER_MISSING_OR_DUPLICATED:'+element_id],None
    node=nodes[0]
    try:
        observed=((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy'])
        radius=float(node.get('r'));stroke_width=float(node.get('stroke-width'))
    except (TypeError,ValueError):return ['GRAPH_REFERENCE_MARKER_INVALID:'+element_id],None
    errors=[]
    if node.get('fill') not in {'black','#111','#000'} or node.get('stroke') in (None,'none','') or stroke_width<=0 or radius<policy['referenceMarkerRadiusIntrinsicPx']-.01:errors.append('GRAPH_REFERENCE_MARKER_STYLE_MISMATCH:'+element_id)
    if abs(observed[0]-point[0])*transform['sx']*transform['displayScale']>.35 or abs(observed[1]-point[1])*transform['sy']*transform['displayScale']>.35:errors.append('GRAPH_REFERENCE_MARKER_POSITION_MISMATCH:'+element_id)
    if 2*radius*transform['displayScale']<policy['minimumReferenceMarkerDiameterCssPx']:errors.append('GRAPH_REFERENCE_MARKER_BELOW_PROFILE_FLOOR:'+element_id)
    return errors,observed

def exponential_base_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        a,k,c=(_piecewise_rational(value,'INVALID_EXPONENTIAL_COEFFICIENT') for value in plan.get('coefficients'))
        base=_exp_log_observer_base(plan.get('base'),'EXPONENTIAL')
        shift=_piecewise_rational(plan.get('shiftX','0'),'INVALID_EXPONENTIAL_SHIFT')
        if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
        if a==0 or k==0:raise ValueError('EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED')
        growth=(k>0)==base['greaterThanOne'];lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];features=plan.get('exponentialFeatures');policy=plan.get('exponentialFeaturePolicy')
        expected_features={'schemaVersion':'EXPONENTIAL_BASE_FEATURES_v1',**_exp_log_base_fields(base),'shiftX':str(shift),'referencePoint':{'x':str(shift),'y':str(a+c)},'horizontalAsymptote':{'y':str(c),'side':'LEFT' if growth else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if (a>0)==growth else 'DECREASING','growthSide':'RIGHT' if growth else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
        expected_policy={'schemaVersion':'EXPONENTIAL_BASE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','referenceArgument':'EXPONENT_ZERO','asymptotePolicy':'EXACT_VERTICAL_SHIFT','basePolicy':'POSITIVE_BASE_NOT_ONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumAsymptoteSeparationCssPx':2,'minimumBranchSpanCssPx':32}
        if features!=expected_features:errors.append('EXPONENTIAL_FEATURE_INVENTORY_MISMATCH')
        if policy!=expected_policy:errors.append('EXPONENTIAL_FEATURE_POLICY_MISMATCH')
        if plan.get('overviewPolicy')!='EXPONENTIAL_BASE_OVERVIEW_v1':errors.append('EXPONENTIAL_OVERVIEW_POLICY_REQUIRED')
        if not xmin<float(shift)<xmax:errors.append('EXPONENTIAL_REFERENCE_OUTSIDE_VIEWPORT')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root=ET.fromstring(svg);points,point_errors=_observed_svg_points(root,transform);errors.extend(point_errors)
        if points:
            points=sorted(points,key=lambda point:point[0]);scale=transform['sy']*transform['displayScale'];xscale=transform['sx']*transform['displayScale'];x_tol=.35/max(1e-12,xscale)
            if abs(points[0][0]-lo)>x_tol or abs(points[-1][0]-hi)>x_tol:errors.append('EXPONENTIAL_DRAW_DOMAIN_COVERAGE_FAIL')
            direction=1 if (a>0)==growth else -1
            if any((right[1]-left[1])*direction< -1e-8 for left,right in zip(points,points[1:])):errors.append('EXPONENTIAL_MONOTONICITY_FAIL')
            for px,py in points:
                try:expected=float(a)*(base['float']**(float(k)*(px-float(shift))))+float(c)
                except OverflowError:errors.append('EXPONENTIAL_WRONG_CURVE');break
                if not math.isfinite(expected) or abs(py-expected)*scale>.35:errors.append('EXPONENTIAL_WRONG_CURVE');break
            if (hi-lo)*xscale<policy['minimumBranchSpanCssPx']:unsupported.append('EXPONENTIAL_BRANCH_BELOW_PROFILE_FLOOR')
        asym=float(c);errors.extend(_audit_feature_line(root,'exponential-asymptote','horizontal',asym,transform))
        ref=(float(shift),float(a+c));marker_errors,marker=_audit_reference_marker(root,'exponential-reference',ref,policy,transform);errors.extend(marker_errors)
        separation=abs(float(a))*transform['sy']*transform['displayScale']
        if separation<policy['minimumAsymptoteSeparationCssPx']:unsupported.append('EXPONENTIAL_REFERENCE_ASYMPTOTE_BELOW_PROFILE_FLOOR')
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':expected_features,'monotonicity':expected_features['monotonicity'],'curvePoints':len(points),'referenceMarker':marker,'referenceAsymptoteSeparationCssPx':separation,'mathMethod':'EXACT_POSITIVE_BASE_AND_INDEPENDENT_BASE_EXPONENTIAL_EVALUATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'EXPONENTIAL_SOURCE_SCHEMA_INVALID']}

def logarithmic_base_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        a,k,b,c=(_piecewise_rational(value,'INVALID_LOGARITHMIC_COEFFICIENT') for value in plan.get('coefficients'))
        base=_exp_log_observer_base(plan.get('base'),'LOGARITHMIC')
        if plan.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
        if a==0 or k==0:raise ValueError('LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED')
        root_x=-b/k;reference=(1-b)/k;lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];features=plan.get('logarithmicFeatures');policy=plan.get('logarithmicFeaturePolicy')
        increasing=(a*k>0)==base['greaterThanOne']
        expected_features={'schemaVersion':'LOGARITHMIC_BASE_FEATURES_v1',**_exp_log_base_fields(base),'naturalDomainBoundaryX':str(root_x),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':str(reference),'y':str(c),'argument':'1'},'monotonicity':'INCREASING' if increasing else 'DECREASING','sampleBoundaryArgument':'1/8','sampleDomain':plan['domain']}
        expected_policy={'schemaVersion':'LOGARITHMIC_BASE_FEATURE_POLICY_v1','sourceDomain':'kx+b>0','domainBoundaryPolicy':'NATURAL_OPEN_BOUNDARY','referenceArgument':'1','sampleBoundaryArgument':'1/8','boundaryCue':'DASHED_VERTICAL_LINE','basePolicy':'POSITIVE_BASE_NOT_ONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32}
        if features!=expected_features:errors.append('LOGARITHMIC_FEATURE_INVENTORY_MISMATCH')
        if policy!=expected_policy:errors.append('LOGARITHMIC_FEATURE_POLICY_MISMATCH')
        if plan.get('overviewPolicy')!='LOGARITHMIC_BASE_OVERVIEW_v1':errors.append('LOGARITHMIC_OVERVIEW_POLICY_REQUIRED')
        if not (lo<hi and (float(root_x)<lo if k>0 else hi<float(root_x))):errors.append('LOGARITHMIC_DRAW_DOMAIN_WRONG_SIDE_OF_BOUNDARY')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root_svg=ET.fromstring(svg);points,point_errors=_observed_svg_points(root_svg,transform);errors.extend(point_errors)
        if points:
            points=sorted(points,key=lambda point:point[0]);xscale=transform['sx']*transform['displayScale'];yscale=transform['sy']*transform['displayScale'];x_tol=.35/max(1e-12,xscale)
            if abs(points[0][0]-lo)>x_tol or abs(points[-1][0]-hi)>x_tol:errors.append('LOGARITHMIC_DRAW_DOMAIN_COVERAGE_FAIL')
            direction=1 if increasing else -1
            if any((right[1]-left[1])*direction< -1e-8 for left,right in zip(points,points[1:])):errors.append('LOGARITHMIC_MONOTONICITY_FAIL')
            for px,py in points:
                argument=float(k)*px+float(b)
                if argument<=0:errors.append('LOGARITHMIC_CURVE_OUTSIDE_NATURAL_DOMAIN');break
                expected=float(a)*math.log(argument)/math.log(base['float'])+float(c)
                if not math.isfinite(expected) or abs(py-expected)*yscale>.35:errors.append('LOGARITHMIC_WRONG_CURVE');break
            near_boundary=points[0][0] if k>0 else points[-1][0];gap=abs(near_boundary-float(root_x))*xscale
            if gap<policy['minimumBoundaryApproachGapCssPx']:unsupported.append('LOGARITHMIC_BOUNDARY_GAP_BELOW_PROFILE_FLOOR')
            if (hi-lo)*xscale<policy['minimumBranchSpanCssPx']:unsupported.append('LOGARITHMIC_BRANCH_BELOW_PROFILE_FLOOR')
        else:gap=0.0
        errors.extend(_audit_feature_line(root_svg,'logarithmic-domain-boundary','vertical',float(root_x),transform))
        reference_point=(float(reference),float(c));marker_errors,marker=_audit_reference_marker(root_svg,'logarithmic-reference',reference_point,policy,transform);errors.extend(marker_errors)
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':expected_features,'monotonicity':expected_features['monotonicity'],'curvePoints':len(points),'boundaryApproachGapCssPx':gap,'referenceMarker':marker,'mathMethod':'EXACT_POSITIVE_BASE_AND_INDEPENDENT_BASE_LOGARITHM_EVALUATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'LOGARITHMIC_SOURCE_SCHEMA_INVALID']}

def exp_log_pair_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        features=plan.get('expLogPairFeatures');policy=plan.get('expLogPairPolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='EXP_LOG_PAIR_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('EXP_LOG_PAIR_FEATURE_INVENTORY_REQUIRED')
        if plan.get('overviewPolicy')!='EXP_LOG_PAIR_OVERVIEW_v1':raise ValueError('EXP_LOG_PAIR_OVERVIEW_POLICY_REQUIRED')
        rows=features.get('curves')
        if not isinstance(rows,list) or len(rows)!=2:raise ValueError('EXP_LOG_PAIR_FEATURE_INVENTORY_REQUIRED')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root=ET.fromstring(svg);expected_rows=[]
        for row in rows:
            if not isinstance(row,dict) or row.get('family') not in {'exponential-affine','logarithmic-affine'}:raise ValueError('EXP_LOG_PAIR_FEATURE_INVENTORY_REQUIRED')
            coefficients=tuple(_piecewise_rational(value,'INVALID_EXP_LOG_PAIR_COEFFICIENT') for value in row.get('coefficients',[]))
            if len(coefficients)!=(3 if row['family']=='exponential-affine' else 4):raise ValueError('INVALID_EXP_LOG_PAIR_COEFFICIENT')
            base=_exp_log_observer_base(row.get('base'),'EXP_LOG_PAIR')
            a,k=coefficients[0],coefficients[1]
            if a==0 or k==0:raise ValueError('EXP_LOG_PAIR_NONZERO_SCALE_AND_RATE_REQUIRED')
            if row['family']=='exponential-affine':
                shift=_piecewise_rational(row.get('shiftX','0'),'INVALID_EXP_LOG_PAIR_SHIFT')
                growth=(k>0)==base['greaterThanOne'];c=coefficients[2]
                expected={'id':row.get('id'),'family':row['family'],**_exp_log_base_fields(base),'coefficients':[str(value) for value in coefficients],'shiftX':str(shift),'domain':row.get('domain'),'referencePoint':{'x':str(shift),'y':str(a+c)},'horizontalAsymptote':{'y':str(c),'side':'LEFT' if growth else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if (a>0)==growth else 'DECREASING','growthSide':'RIGHT' if growth else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
                reference=(float(shift),float(a+c));asymptote=float(c)
            else:
                b=coefficients[2];c=coefficients[3];root_x=-b/k;reference_x=(1-b)/k;increasing=(a*k>0)==base['greaterThanOne']
                expected={'id':row.get('id'),'family':row['family'],**_exp_log_base_fields(base),'coefficients':[str(value) for value in coefficients],'domain':row.get('domain'),'naturalDomainBoundaryX':str(root_x),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':str(reference_x),'y':str(c),'argument':'1'},'monotonicity':'INCREASING' if increasing else 'DECREASING'}
                reference=(float(reference_x),float(c));asymptote=float(root_x)
            if expected!=row:errors.append('EXP_LOG_PAIR_FEATURE_INVENTORY_MISMATCH:'+str(row.get('id')))
            domain=row.get('domain')
            if not isinstance(domain,list) or len(domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in domain) or not domain[0]<domain[1]:raise ValueError('EXP_LOG_PAIR_DOMAIN_INVALID')
            if row['family']=='logarithmic-affine' and not (float(root_x)<domain[0] if k>0 else domain[1]<float(root_x)):errors.append('LOGARITHMIC_DRAW_DOMAIN_WRONG_SIDE_OF_BOUNDARY:'+str(row.get('id')))
            expected_rows.append({**expected,'_coefficients':coefficients,'_base':base,'_shift':shift if row['family']=='exponential-affine' else Fraction(0),'_reference':reference,'_asymptote':asymptote})
        branches,branch_errors=_observed_curve_branches(root,transform);errors.extend(branch_errors)
        if set(branches)!={'REF_'+row['id'] for row in expected_rows}:errors.append('EXP_LOG_PAIR_CURVE_BRANCH_INVENTORY_MISMATCH')
        xscale=transform['sx']*transform['displayScale'];yscale=transform['sy']*transform['displayScale']
        for row in expected_rows:
            curves=branches.get('REF_'+row['id'],[])
            if len(curves)!=1:errors.append('EXP_LOG_PAIR_CURVE_BRANCH_MISSING_OR_DUPLICATED:'+str(row['id']));continue
            points=sorted(curves[0],key=lambda point:point[0]);lo,hi=row['domain'];x_tol=.35/max(1e-12,xscale);y_tol=.35/max(1e-12,yscale)
            if points[0][0]<lo-x_tol or points[-1][0]>hi+x_tol:errors.append('EXP_LOG_PAIR_DRAW_DOMAIN_COVERAGE_FAIL:'+str(row['id']))
            # The display window clips tall/steep parts of a curve: an end that is not at the domain endpoint must sit on the top/bottom edge.
            ymin,ymax=plan['viewport'][2],plan['viewport'][3]
            for index,endpoint in ((0,lo),(-1,hi)):
                try:expected=_exp_log_exact_value(row,endpoint)
                except (ValueError,OverflowError):expected=None
                if expected is not None and ymin-1e-9<=expected<=ymax+1e-9:
                    if abs(points[index][0]-endpoint)>x_tol:errors.append('EXP_LOG_PAIR_DRAW_DOMAIN_COVERAGE_FAIL:'+str(row['id']))
                elif not (abs(points[index][1]-ymin)<=y_tol or abs(points[index][1]-ymax)<=y_tol):errors.append('EXP_LOG_PAIR_DRAW_DOMAIN_CLIP_FAIL:'+str(row['id']))
            direction=1 if row['monotonicity']=='INCREASING' else -1
            if any((right[1]-left[1])*direction< -1e-8 for left,right in zip(points,points[1:])):errors.append('EXP_LOG_PAIR_MONOTONICITY_FAIL:'+str(row['id']))
            for px,py in points:
                try:expected=_exp_log_exact_value(row,px)
                except (ValueError,OverflowError):errors.append('EXP_LOG_PAIR_WRONG_CURVE:'+str(row['id']));break
                if not math.isfinite(expected) or abs(py-expected)*yscale>.35:errors.append('EXP_LOG_PAIR_WRONG_CURVE:'+str(row['id']));break
            if (points[-1][0]-points[0][0])*xscale<policy['minimumBranchSpanCssPx']:unsupported.append('EXP_LOG_PAIR_BRANCH_BELOW_PROFILE_FLOOR:'+str(row['id']))
            marker_errors,marker=_audit_id_marker(root,'reference-'+str(row['id']),row['_reference'],policy,transform);errors.extend(marker_errors)
            if row['family']=='exponential-affine':
                errors.extend(_audit_id_line(root,'asymptote-'+str(row['id']),'horizontal',row['_asymptote'],transform))
                separation=abs(float(row['_coefficients'][0]))*yscale
                if separation<policy['minimumAsymptoteSeparationCssPx']:unsupported.append('EXP_LOG_PAIR_REFERENCE_ASYMPTOTE_BELOW_PROFILE_FLOOR:'+str(row['id']))
            else:
                errors.extend(_audit_id_line(root,'boundary-'+str(row['id']),'vertical',row['_asymptote'],transform))
                near=points[0][0] if row['_coefficients'][1]>0 else points[-1][0]
                if abs(near-row['_asymptote'])*xscale<policy['minimumBoundaryApproachGapCssPx']:unsupported.append('EXP_LOG_PAIR_BOUNDARY_GAP_BELOW_PROFILE_FLOOR:'+str(row['id']))
        identity_nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='line' and node.get('id')=='identity-line']
        if features.get('identityLine') is True:
            if len(identity_nodes)!=1:errors.append('EXP_LOG_PAIR_IDENTITY_LINE_MISSING_OR_DUPLICATED')
            else:
                node=identity_nodes[0]
                try:
                    a=((float(node.get('x1'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y1')))/transform['sy'])
                    b=((float(node.get('x2'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y2')))/transform['sy'])
                except (TypeError,ValueError):errors.append('EXP_LOG_PAIR_IDENTITY_LINE_INVALID')
                else:
                    if abs(a[1]-a[0])*yscale>.35 or abs(b[1]-b[0])*yscale>.35:errors.append('EXP_LOG_PAIR_IDENTITY_LINE_POSITION_MISMATCH')
                    if node.get('stroke-dasharray') not in {'4 3','4,3'}:errors.append('EXP_LOG_PAIR_IDENTITY_LINE_MUST_BE_DASHED')
        elif identity_nodes:errors.append('EXP_LOG_PAIR_UNEXPECTED_IDENTITY_LINE')
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'curves':[{key:value for key,value in row.items() if not key.startswith('_')} for row in expected_rows],'curveBranches':{key:len(value) for key,value in branches.items()},'identityLine':features.get('identityLine') is True,'mathMethod':'EXACT_BASES_AND_INDEPENDENT_MODEL_RECOMPUTATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError,ET.ParseError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'EXP_LOG_PAIR_SOURCE_SCHEMA_INVALID']}

def trigonometric_overview_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        function=plan.get('function');a,k,c=(_piecewise_rational(value,'INVALID_TRIGONOMETRIC_COEFFICIENT') for value in plan.get('coefficients'));phase=_piecewise_rational(plan.get('phasePi'),'INVALID_TRIGONOMETRIC_PHASE')
        if function not in {'SIN','COS','TAN'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
        expected_source={'kind':'ALL_REALS'} if function in {'SIN','COS'} else {'kind':'ALL_REALS_WITH_TAN_POLES'}
        if plan.get('sourceDomain')!=expected_source:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
        if a==0 or k==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
        center=-phase/k;rate=abs(k);features=plan.get('trigFeatures');policy=plan.get('trigFeaturePolicy');domain=plan.get('domain');viewport=plan.get('viewport')
        if function in {'SIN','COS'}:
            center_x=float(center)*math.pi;radius=math.pi/float(rate);expected_domain=[center_x-radius,center_x+radius];phase_points=[];sign_k=1 if k>0 else -1
            for index in range(-2,3):
                x_pi=center+Fraction(index,2)/rate
                factor=(0 if index in {-2,0,2} else sign_k if index>0 else -sign_k) if function=='SIN' else (1 if index==0 else 0 if abs(index)==1 else -1)
                y=a*factor+c;kind='X_INTERCEPT' if y==0 and factor==0 else 'MIDLINE_CROSSING' if factor==0 else 'EXTREMUM'
                row={'id':f'phase-{index+2}','kind':kind,'index':index,'xPiMultiple':str(x_pi),'y':str(y)}
                if kind=='EXTREMUM':row['extreme']='MAXIMUM' if y>c else 'MINIMUM'
                phase_points.append(row)
            center_behavior=('INCREASING' if a*k>0 else 'DECREASING') if function=='SIN' else ('MAXIMUM' if a>0 else 'MINIMUM')
            expected_features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v1','function':function,'phasePi':str(phase),'cycleCenterPi':str(center),'periodPiMultiple':str(Fraction(2,1)/rate),'amplitude':str(a),'midline':str(c),'centerBehavior':center_behavior,'phasePoints':phase_points}
            expected_policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v1','function':function,'sourceDomain':'ALL_REALS','displayWindow':'ONE_FULL_PERIOD','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':80,'minimumAmplitudeCssPx':20}
        else:
            left_pole=center-Fraction(1,2)/rate;right_pole=center+Fraction(1,2)/rate;epsilon=Fraction(3,25)/rate
            expected_domain=[float(left_pole)*math.pi+float(epsilon),float(right_pole)*math.pi-float(epsilon)]
            expected_features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v1','function':'TAN','phasePi':str(phase),'cycleCenterPi':str(center),'periodPiMultiple':str(Fraction(1,1)/rate),'amplitude':str(a),'midline':str(c),'centerBehavior':'INCREASING' if a*k>0 else 'DECREASING','referencePoint':{'xPiMultiple':str(center),'y':str(c)},'poles':[{'id':'pole-left','xPiMultiple':str(left_pole),'side':'LEFT'},{'id':'pole-right','xPiMultiple':str(right_pole),'side':'RIGHT'}],'sampleBoundaryDistance':'3/25'}
            expected_policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v1','function':'TAN','sourceDomain':'ALL_REALS_WITH_TAN_POLES','displayWindow':'ONE_COMPLETE_POLE_TO_POLE_BRANCH','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':80}
        if features!=expected_features:errors.append('TRIG_FEATURE_INVENTORY_MISMATCH')
        if policy!=expected_policy:errors.append('TRIG_FEATURE_POLICY_MISMATCH')
        if plan.get('overviewPolicy')!='TRIGONOMETRIC_PERIODIC_OVERVIEW_v1':errors.append('TRIG_OVERVIEW_POLICY_REQUIRED')
        if not isinstance(domain,list) or len(domain)!=2 or any(not isinstance(value,(int,float)) or isinstance(value,bool) or not math.isfinite(value) for value in domain):raise ValueError('TRIG_DRAW_INTERVAL_INVALID')
        if any(abs(actual-expected)>1e-9*max(1.0,abs(expected)) for actual,expected in zip(domain,expected_domain)):errors.append('TRIG_DRAW_WINDOW_MISMATCH')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root=ET.fromstring(svg);points,point_errors=_observed_svg_points(root,transform);errors.extend(point_errors)
        if not points:return {'status':'FAIL','errors':sorted(set(errors+['TRIG_FINAL_CURVE_MISSING']))}
        points=[point for index,point in enumerate(points) if index==0 or abs(point[0]-points[index-1][0])>1e-12 or abs(point[1]-points[index-1][1])>1e-12]
        points=sorted(points,key=lambda point:point[0]);xscale=transform['sx']*transform['displayScale'];yscale=transform['sy']*transform['displayScale'];x_tol=.35/max(1e-12,xscale)
        if any(right[0]<=left[0] for left,right in zip(points,points[1:])):errors.append('TRIG_CURVE_NOT_MONOTONE_IN_X')
        if abs(points[0][0]-domain[0])>x_tol or abs(points[-1][0]-domain[1])>x_tol:errors.append('TRIG_DRAW_DOMAIN_COVERAGE_FAIL')
        evaluator={'SIN':math.sin,'COS':math.cos,'TAN':math.tan}[function]
        for px,py in points:
            angle=float(k)*px+float(phase)*math.pi
            try:expected=float(a)*evaluator(angle)+float(c)
            except (ValueError,OverflowError):errors.append('TRIG_NONREAL_OR_POLE_SAMPLE');break
            if not math.isfinite(expected) or abs(py-expected)*yscale>.35:errors.append('TRIG_WRONG_FUNCTION_CURVE');break
        span=(domain[1]-domain[0])*xscale
        if function in {'SIN','COS'}:
            amplitude=abs(float(a))*yscale
            if span<policy['minimumPeriodSpanCssPx']:unsupported.append('TRIG_PERIOD_BELOW_PROFILE_FLOOR')
            if amplitude<policy['minimumAmplitudeCssPx']:unsupported.append('TRIG_AMPLITUDE_BELOW_PROFILE_FLOOR')
            marker_nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='circle' and node.get('data-role')=='trig-feature']
            if len(marker_nodes)!=len(phase_points):errors.append('TRIG_FEATURE_MARKER_COUNT_MISMATCH')
            for feature in phase_points:
                wanted=(float(Fraction(feature['xPiMultiple']))*math.pi,float(Fraction(feature['y'])));node=next((item for item in marker_nodes if item.get('id')=='trig-'+feature['id']),None)
                if node is None:errors.append('TRIG_FEATURE_MARKER_MISSING:'+feature['id']);continue
                try:observed=((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy']);radius=float(node.get('r'));stroke=float(node.get('stroke-width'))
                except (TypeError,ValueError):errors.append('TRIG_FEATURE_MARKER_INVALID:'+feature['id']);continue
                if node.get('data-feature-kind')!=feature['kind'] or abs(observed[0]-wanted[0])*xscale>.35 or abs(observed[1]-wanted[1])*yscale>.35:errors.append('TRIG_FEATURE_MARKER_POSITION_OR_KIND_MISMATCH:'+feature['id'])
                if node.get('fill') not in {'black','#111','#000'} or node.get('stroke') in (None,'none','') or stroke<=0 or radius<policy['markerRadiusIntrinsicPx']-.01:errors.append('TRIG_FEATURE_MARKER_STYLE_MISMATCH:'+feature['id'])
                if 2*radius*transform['displayScale']<policy['minimumMarkerDiameterCssPx']:unsupported.append('TRIG_FEATURE_MARKER_BELOW_PROFILE_FLOOR:'+feature['id'])
            feature_points=[(float(Fraction(row['xPiMultiple']))*math.pi,float(Fraction(row['y']))) for row in phase_points]
            for left,right in zip(feature_points,feature_points[1:]):
                if math.hypot((right[0]-left[0])*xscale,(right[1]-left[1])*yscale)<policy['minimumFeatureSeparationCssPx']:unsupported.append('TRIG_PHASE_FEATURES_BELOW_PROFILE_FLOOR')
            feature_detail={'amplitudeCssPx':amplitude,'periodSpanCssPx':span,'phasePointCount':len(phase_points)}
        else:
            poles=[]
            for pole in expected_features['poles']:
                expected_x=float(Fraction(pole['xPiMultiple']))*math.pi
                nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='line' and node.get('data-role')=='trig-pole' and node.get('data-pole-side')==pole['side']]
                if len(nodes)!=1:errors.append('TRIG_POLE_CUE_MISSING_OR_DUPLICATED:'+pole['side']);continue
                node=nodes[0]
                try:x1=(float(node.get('x1'))-transform['originX'])/transform['sx'];x2=(float(node.get('x2'))-transform['originX'])/transform['sx'];y1=(transform['originY']-float(node.get('y1')))/transform['sy'];y2=(transform['originY']-float(node.get('y2')))/transform['sy']
                except (TypeError,ValueError):errors.append('TRIG_POLE_CUE_INVALID:'+pole['side']);continue
                if abs(x1-expected_x)*xscale>.35 or abs(x2-expected_x)*xscale>.35 or y1>=y2 or node.get('stroke-dasharray') not in {'5 4','5,4'}:errors.append('TRIG_POLE_CUE_POSITION_OR_STYLE_FAIL:'+pole['side'])
                poles.append(expected_x)
            reference=expected_features['referencePoint'];ref_point=(float(Fraction(reference['xPiMultiple']))*math.pi,float(Fraction(reference['y'])));ref_nodes=[node for node in root.iter() if node.tag.split('}')[-1]=='circle' and node.get('data-role')=='trig-reference']
            if len(ref_nodes)!=1:errors.append('TRIG_REFERENCE_MARKER_MISSING')
            else:
                node=ref_nodes[0]
                try:rx=(float(node.get('cx'))-transform['originX'])/transform['sx'];ry=(transform['originY']-float(node.get('cy')))/transform['sy'];radius=float(node.get('r'))
                except (TypeError,ValueError):errors.append('TRIG_REFERENCE_MARKER_INVALID');rx=ry=0;radius=0
                if abs(rx-ref_point[0])*xscale>.35 or abs(ry-ref_point[1])*yscale>.35:errors.append('TRIG_REFERENCE_MARKER_POSITION_MISMATCH')
                if 2*radius*transform['displayScale']<policy['minimumMarkerDiameterCssPx']:unsupported.append('TRIG_REFERENCE_MARKER_BELOW_PROFILE_FLOOR')
            near_gap=min(abs(domain[0]-poles[0]),abs(domain[1]-poles[-1]))*xscale if len(poles)==2 else 0
            if near_gap<policy['minimumBoundaryApproachGapCssPx']:unsupported.append('TRIG_TAN_POLE_APPROACH_BELOW_PROFILE_FLOOR')
            if span<policy['minimumBranchSpanCssPx']:unsupported.append('TRIG_TAN_BRANCH_BELOW_PROFILE_FLOOR')
            if len(poles)==2 and not (poles[0]<domain[0]<domain[1]<poles[1]):errors.append('TRIG_TAN_BRANCH_OUTSIDE_ADJACENT_POLES')
            if len(poles)==2 and any(px<=poles[0] or px>=poles[1] for px,_ in points):errors.append('TRIG_TAN_BRANCH_OUTSIDE_ADJACENT_POLES')
            monotone_sign=1 if a*k>0 else -1
            if any((right[1]-left[1])*monotone_sign< -1e-8 for left,right in zip(points,points[1:])):errors.append('TRIG_TAN_MONOTONICITY_FAIL')
            feature_detail={'poleXs':poles,'boundaryApproachGapCssPx':near_gap,'branchSpanCssPx':span}
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':expected_features,'featureDetail':feature_detail,'curvePoints':len(points),'mathMethod':'EXACT_RATIONAL_PI_MULTIPLE_PHASE_PERIOD_POLES_AND_INDEPENDENT_TRIGONOMETRIC_EVALUATION'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'TRIGONOMETRIC_SOURCE_SCHEMA_INVALID']}

def _pp_rational(value):
    if isinstance(value,bool) or not (isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value)):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    return Fraction(value)

def _pp_exact(text):
    """Own parser for an exact value string (integers, a/b, sqrt, + - * /, parentheses): a SymPy number."""
    if not isinstance(text,str) or not re.fullmatch(r'[0-9+\-*/()sqrt]{1,64}',text):raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID')
    tokens=re.findall(r'sqrt|\d+|[+\-*/()]',text);position=[0]
    if ''.join(tokens)!=text:raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID')
    def take():
        token=tokens[position[0]] if position[0]<len(tokens) else None;position[0]+=1;return token
    def peek():return tokens[position[0]] if position[0]<len(tokens) else None
    def unit():
        token=take()
        if token in ('-','+'):value=unit();return -value if token=='-' else value
        if token=='sqrt' and take()=='(':
            value=sum_();
            if take()==')' and not value.is_negative:return S.sqrt(value)
        elif token=='(':
            value=sum_()
            if take()==')':return value
        elif token is not None and token.isdigit():return S.Integer(int(token))
        raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID')
    def product():
        value=unit()
        while peek() in ('*','/'):
            op=take();right=unit()
            if op=='/' and right==0:raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID')
            value=value*right if op=='*' else value/right
        return value
    def sum_():
        value=product()
        while peek() in ('+','-'):op=take();right=product();value=value+right if op=='+' else value-right
        return value
    value=sum_()
    if position[0]!=len(tokens):raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID')
    return value

def _pp_coeff(value):
    """An exact coefficient/coordinate/line value: an integer, an 'a/b' string or p+q*sqrt(r) (own reading, then the form is checked here
    again: one radical of squarefree r, no nested or higher roots). A normalised SymPy number."""
    if isinstance(value,bool):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    if isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value):return S.Rational(value)
    if not isinstance(value,str):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    number=S.radsimp(S.expand(_pp_exact(value.replace(' ',''))))
    if number.is_Rational:return number
    powers=list(number.atoms(S.Pow))
    if not powers or any(power.exp!=S.Rational(1,2) or not power.base.is_Integer for power in powers) or len({power.base for power in powers})!=1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED')
    return number

def _pp_same(a,b):
    """Equal as exact numbers (60 digits for nested radicals that do not simplify)."""
    difference=S.sympify(a)-S.sympify(b)
    return difference==0 or abs(S.N(difference,60))<S.Float('1e-40',60)

def _pp_real_roots(poly):
    """The distinct real roots (60 digits, increasing) of a polynomial of degree <= 2 with exact coefficients, found by the discriminant and
    SymPy's numeric root finder (not by the engine's closed formula); None when it is identically zero."""
    if poly.is_zero:return None
    poly=S.Poly(S.expand(poly.as_expr()),x)
    if poly.degree()<=0:return []
    if poly.degree()==1:
        c1,c0=poly.all_coeffs();return [S.N(-c0/c1,60)]
    c2,c1,c0=poly.all_coeffs();disc=S.N(S.expand(c1**2-4*c2*c0),80)
    if abs(disc)<S.Float('1e-60',80):return [S.N(-c1/(2*c2),60)]
    if disc<0:return []
    return sorted(S.re(S.N(root,60)) for root in poly.nroots(n=60,maxsteps=500))

def _pp_formula(text):
    """Own reading of the display formula as a SymPy expression in x (integers, x, abs, + - * / ^, parentheses, implicit products)."""
    if not isinstance(text,str) or not re.fullmatch(r'[0-9x+\-*/^()abs ]{1,120}',text):raise ValueError('PIECEWISE_POLY_FORMULA_INVALID')
    compact=text.replace(' ','');tokens=re.findall(r'abs|\d+|x|[+\-*/^()]',compact)
    if ''.join(tokens)!=compact:raise ValueError('PIECEWISE_POLY_FORMULA_INVALID')
    spaced=[]
    for token in tokens:
        # An implicit product (2x, 3(x+1), x abs(...), )( ) becomes an explicit one; a number after x or ) is not allowed.
        if spaced and (token in ('x','abs','(') and (spaced[-1] in ('x',')') or spaced[-1].isdigit())):spaced.append('*')
        elif spaced and token.isdigit() and spaced[-1] in ('x',')'):raise ValueError('PIECEWISE_POLY_FORMULA_INVALID')
        spaced.append({'abs':'Abs','^':'**'}.get(token,token))
    try:value=S.sympify(''.join(spaced),locals={'x':x,'Abs':S.Abs},rational=True)
    except (S.SympifyError,SyntaxError,TypeError):raise ValueError('PIECEWISE_POLY_FORMULA_INVALID') from None
    if value.free_symbols-{x}:raise ValueError('PIECEWISE_POLY_FORMULA_INVALID')
    return value

def _pp_eval_poly(poly,value):
    degree=poly.degree()
    if not isinstance(degree,int) or degree<0:return 0.0
    return sum(float(poly.nth(k))*value**k for k in range(degree+1))

def _pp_in_closed(value,interval):
    tolerance=S.Float('1e-40',60);a,b=interval
    return (a is None or value>=S.N(a,60)-tolerance) and (b is None or value<=S.N(b,60)+tolerance)

def _pp_in_source(value,source):
    tolerance=S.Float('1e-40',60);lo,hi,states=source
    if lo is not None and (value<S.N(lo,60)-tolerance or states[0]=='OPEN' and abs(value-S.N(lo,60))<tolerance):return False
    if hi is not None and (value>S.N(hi,60)+tolerance or states[1]=='OPEN' and abs(value-S.N(hi,60))<tolerance):return False
    return True

def _pp_in_domain(value,interval,source):return _pp_in_closed(value,interval) and _pp_in_source(value,source)

def _pp_reference_source(entry):
    raw=entry.get('sourceDomain',{'kind':'ALL_REALS'})
    if raw=={'kind':'ALL_REALS'}:return None,None,['CLOSED','CLOSED']
    if isinstance(raw,dict) and raw.get('kind')=='INTERVAL' and not set(raw)-{'kind','range','states'}:
        lo,hi=(_pp_rational(v if isinstance(v,(str,int)) else str(v)) for v in raw['range']);states=list(raw.get('states',['CLOSED','CLOSED']))
        if not lo<hi or len(states)!=2 or any(state not in INTERVAL_STATE_FILLS for state in states):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID')
        return S.Rational(lo.numerator,lo.denominator),S.Rational(hi.numerator,hi.denominator),states
    raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID')

def _pp_reference_row(entry,errors):
    """Independently rebuild one referenceCurves entry: a quadratic (coefficients) or its own piecewise function with its own domain."""
    if not isinstance(entry,dict) or not isinstance(entry.get('id'),str):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    ref_id=entry['id'];claimed=entry.get('intersectionX')
    if not isinstance(claimed,list) or len(claimed)>8:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
    if ('coefficients' in entry)==('pieces' in entry):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    row={'id':ref_id,'entry':entry,'claimed':claimed,'kind':'piecewise'}
    if 'coefficients' in entry:
        values=entry['coefficients']
        if not isinstance(values,list) or len(values)!=3:raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
        refpoly=S.Poly(sum(_pp_coeff(v)*x**i for i,v in enumerate(values)),x)
        if refpoly.degree()!=2:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC:'+ref_id)
        row.update(kind='quadratic',pieces=[refpoly],intervals=[(None,None)],source=(None,None,['CLOSED','CLOSED']),corners=[],extrema=[])
        return row
    raw_pieces=entry['pieces'];raw_breaks=entry.get('breakpoints',[])
    if not isinstance(raw_pieces,list) or not 1<=len(raw_pieces)<=4 or not isinstance(raw_breaks,list) or len(raw_breaks)!=len(raw_pieces)-1:raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    ref_pieces=[]
    for piece in raw_pieces:
        values=piece.get('coefficients') if isinstance(piece,dict) else None
        if not isinstance(values,list) or not 1<=len(values)<=3:raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
        ref_pieces.append(S.Poly(sum(_pp_coeff(v)*x**i for i,v in enumerate(values)),x))
    ref_breaks=[(_pp_coeff(breakpoint['x']),_pp_coeff(breakpoint['y'])) for breakpoint in raw_breaks]
    if any(not a[0]<b[0] for a,b in zip(ref_breaks,ref_breaks[1:])):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
    ref_lo,ref_hi,ref_states=_pp_reference_source(entry)
    cuts=[ref_lo,*[at for at,_ in ref_breaks],ref_hi];ref_intervals=list(zip(cuts,cuts[1:]))
    for index,(at,claimed_y) in enumerate(ref_breaks):
        left,right=ref_pieces[index].eval(S.sympify(at)),ref_pieces[index+1].eval(S.sympify(at))
        if not _pp_same(left,right):errors.append('PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS:'+ref_id+':'+str(at))
        elif not _pp_same(left,S.sympify(claimed_y)):errors.append('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_CLAIM_MISMATCH:'+ref_id+':'+str(at))
    corners=[(at,ref_pieces[index].eval(S.sympify(at))) for index,(at,_) in enumerate(ref_breaks)]
    extrema=[]
    for poly,(a,b) in zip(ref_pieces,ref_intervals):
        if poly.degree()==2:
            h=S.radsimp(S.expand(-poly.nth(1)/(2*poly.nth(2))))
            if (a is None or h>a) and (b is None or h<b):extrema.append((h,S.radsimp(S.expand(poly.eval(h))),'MAX' if poly.nth(2)<0 else 'MIN'))
    row.update(pieces=ref_pieces,intervals=ref_intervals,source=(ref_lo,ref_hi,ref_states),corners=corners,extrema=extrema)
    return row

def _pp_ref_value(row,value):
    for poly,(a,b) in zip(row['pieces'],row['intervals']):
        if _pp_in_domain(value,(a,b),row['source']):return poly.eval(value)
    return None

def _pp_ref_boundary_value(row,value):
    for poly,(a,b) in zip(row['pieces'],row['intervals']):
        if _pp_in_closed(value,(a,b)):return poly.eval(value)
    return None

def _pp_ref_crossings(pieces,intervals,source,row):
    found=[]
    for poly,(a,b) in zip(pieces,intervals):
        for other,(c,d) in zip(row['pieces'],row['intervals']):
            roots=_pp_real_roots(poly-other)
            if roots is None:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE')
            for root in roots:
                at=S.N(root,60)
                if not _pp_in_domain(at,(a,b),source) or not _pp_in_domain(at,(c,d),row['source']):continue
                if not any(abs(at-seen)<S.Float('1e-40',60) for seen in found):found.append(at)
    return sorted(found)


GRAPH_REGION_FILLS={'LIGHT':'#e4e7ec','MEDIUM':'#c7ccd5'}
GRAPH_REGION_BOUNDARY_TOLERANCE=0.75   # svg px: a fill boundary against the boundary curve at sample x
GRAPH_REGION_OUTSIDE=0.02              # relative band height: how far outside counts as outside the fill

def _region_rows(plan,pieces,intervals,refs,name,from_x,to_x,region_id):
    """One band side recomputed from the plan's exact fields (no producer rows are trusted): 'f', 'axis', a reference curve id or a line id."""
    def polynomial_rows(rows):
        out=[]
        for poly,(a,b) in rows:
            start=from_x if a is None else max(from_x,a);end=to_x if b is None else min(to_x,b)
            if start<end:out.append(([poly.nth(index) if hasattr(poly,'nth') else poly[index] for index in range(3)],(start,end)))
        out.sort(key=lambda row:float(row[1][0]))
        return out
    if from_x>=to_x:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id)
    if name=='axis':rows=[([S.Integer(0),S.Integer(0),S.Integer(0)],(from_x,to_x))]
    elif name=='f':rows=polynomial_rows(list(zip(pieces,intervals)))
    else:
        match=[ref for ref in refs if ref['id']==name];rows=[]
        if match:
            ref=match[0];rows=polynomial_rows(list(zip(ref['pieces'],ref['intervals'])))
        else:
            line=next((entry for entry in plan.get('referenceLines',[]) if entry.get('id')==name),None)
            if line is None:raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+region_id+':'+str(name))
            if 'slope' in line:m=_pp_coeff(line['slope']);level=_pp_coeff(line['intercept'])
            else:m=S.Integer(0);level=_pp_coeff(line['y'])
            rows=[([level,m,S.Integer(0)],(from_x,to_x))]
    if not rows or abs(float(rows[0][1][0])-float(from_x))>1e-9 or abs(float(rows[-1][1][1])-float(to_x))>1e-9:
        raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+str(name))
    for (_,first),(_,(next_start,_)) in zip(rows,rows[1:]):
        if abs(float(first[1])-float(next_start))>1e-9:raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+str(name))
    return rows

def _region_value(rows,x_value):
    for coefficients,(a,b) in rows:
        if float(a)<=x_value<=float(b):
            return float(coefficients[0])+float(coefficients[1])*x_value+float(coefficients[2])*x_value*x_value
    raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED')

def _region_polygon(node):
    d=node.get('d') or ''
    if not d.strip().startswith('M') or not d.strip().endswith('Z'):raise ValueError('GRAPH_REGION_PATH_INVALID')
    if re.search(r'[AaCcQqSsTt]',d):raise ValueError('GRAPH_REGION_PATH_INVALID')
    values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',d)]
    if len(values)<6 or len(values)%2:raise ValueError('GRAPH_REGION_PATH_INVALID')
    return [(values[i],values[i+1]) for i in range(0,len(values),2)]

def _region_inside(polygon,point):
    x,y=point;hit=False
    for (ax,ay),(bx,by) in zip(polygon,polygon[1:]+polygon[:1]):
        if (ay>y)!=(by>y) and x<(bx-ax)*(y-ay)/(by-ay)+ax:hit=not hit
    return hit

def _region_crossings(polygon,x):
    ys=[]
    for (ax,ay),(bx,by) in zip(polygon,polygon[1:]+polygon[:1]):
        if (ax>x)!=(bx>x):ys.append(ay+(by-ay)*(x-ax)/(bx-ax))
    return sorted(ys)

def _region_label_box(elements,label_id):
    node=elements.get(label_id)
    if node is None:return None
    kind=node.tag.split('}')[-1]
    if kind=='text':
        try:return (float(node.get('x')),float(node.get('y')),0.0,0.0)
        except (TypeError,ValueError):return None
    if kind=='g' and node.get('transform'):
        match=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',node.get('transform'))
        inner=next((child for child in node if child.tag.split('}')[-1]=='svg'),None)
        if match and inner is not None:
            try:return (float(match.group(1)),float(match.group(2)),float(inner.get('width')),float(inner.get('height')))
            except (TypeError,ValueError):return None
    return None

def graph_region_audit(plan,svg,transform,pieces,intervals,refs,features,root):
    """Independent graph-region check on the FINAL SVG: the expected band is rebuilt from the plan's exact fields; the drawn fill path must
    follow both boundaries, stay inside [from,to], be painted beneath every stroke, carry the declared fill and hold its label inside."""
    errors=[];observations=[]
    declared=plan.get('regions') or []
    frozen=features.get('regions') or []
    if not isinstance(declared,list) or not isinstance(frozen,list):raise ValueError('GRAPH_REGION_INVENTORY_REQUIRED')
    frozen_by={row.get('id'):row for row in frozen if isinstance(row,dict)}
    if sorted(frozen_by)!=sorted(row.get('id') for row in declared if isinstance(row,dict)):errors.append('GRAPH_REGION_INVENTORY_MISMATCH')
    elements={node.get('id'):node for node in root.iter() if node.get('id')}
    order={id(node):index for index,node in enumerate(root.iter())}
    paths={node.get('id'):node for node in root.iter() if node.tag.split('}')[-1]=='path' and node.get('data-mark')=='graph-region'}
    declared_ids=set();polygons=[]
    for entry in declared:
        if not isinstance(entry,dict):errors.append('GRAPH_REGION_INVENTORY_MISMATCH');continue
        region_id=entry.get('id')
        if not isinstance(region_id,str):errors.append('GRAPH_REGION_INVENTORY_MISMATCH');continue
        declared_ids.add(region_id)
        frozen_row=frozen_by.get(region_id)
        try:
            from_x=_pp_exact(str(entry.get('from')).replace(' ',''));to_x=_pp_exact(str(entry.get('to')).replace(' ',''))
            if from_x>=to_x:raise ValueError
            upper=_region_rows(plan,pieces,intervals,refs,entry.get('upper'),from_x,to_x,region_id)
            lower=_region_rows(plan,pieces,intervals,refs,entry.get('lower'),from_x,to_x,region_id)
        except (ValueError,KeyError,TypeError):
            errors.append('GRAPH_REGION_INVENTORY_MISMATCH:'+str(region_id));continue
        fill=entry.get('fill','LIGHT')
        if fill not in GRAPH_REGION_FILLS:errors.append('GRAPH_REGION_FILL_UNSUPPORTED:'+region_id)
        if frozen_row is not None:
            try:
                frozen_same=(abs(float(_pp_exact(str(frozen_row.get('from')).replace(' ','')))-float(from_x))<=1e-9*max(1,abs(float(from_x)))
                    and abs(float(_pp_exact(str(frozen_row.get('to')).replace(' ','')))-float(to_x))<=1e-9*max(1,abs(float(to_x)))
                    and frozen_row.get('upper')==entry.get('upper') and frozen_row.get('lower')==entry.get('lower')
                    and frozen_row.get('fill')==fill and frozen_row.get('label')==entry.get('label'))
            except (ValueError,TypeError):frozen_same=False
            if not frozen_same:errors.append('GRAPH_REGION_INVENTORY_MISMATCH:'+region_id)
        node=paths.get('region-'+region_id)
        if node is None:errors.append('GRAPH_REGION_MISSING:'+region_id);continue
        if node.get('fill')!=GRAPH_REGION_FILLS.get(fill):errors.append('GRAPH_REGION_FILL_MISMATCH:'+region_id)
        if node.get('fill-rule')!='evenodd':errors.append('GRAPH_REGION_FILL_RULE_MISMATCH:'+region_id)
        if node.get('stroke') not in {None,'none'}:errors.append('GRAPH_REGION_STROKE_PRESENT:'+region_id)
        try:polygon=[((px-transform['originX'])/transform['sx'],(transform['originY']-py)/transform['sy']) for px,py in _region_polygon(node)]
        except ValueError as error:errors.append(str(error)+':'+region_id);continue
        if not polygon:errors.append('GRAPH_REGION_PATH_INVALID:'+region_id);continue
        polygons.append((region_id,polygon))
        xscale=transform['sx']*transform['displayScale'];yscale=transform['sy']*transform['displayScale']
        xtol=GRAPH_REGION_BOUNDARY_TOLERANCE/max(1e-12,xscale);ytol=GRAPH_REGION_BOUNDARY_TOLERANCE/max(1e-12,yscale)
        if abs(min(x for x,_ in polygon)-float(from_x))>xtol or abs(max(x for x,_ in polygon)-float(to_x))>xtol:errors.append('GRAPH_REGION_OUTSIDE_INTERVAL:'+region_id)
        if any(x<float(from_x)-xtol or x>float(to_x)+xtol for x,_ in polygon):errors.append('GRAPH_REGION_OUTSIDE_INTERVAL:'+region_id)
        checks=0
        for index in range(1,10):
            x=float(from_x)+(float(to_x)-float(from_x))*index/10
            try:yu=_region_value(upper,x);yl=_region_value(lower,x)
            except ValueError:errors.append('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id);break
            if yu<=yl:errors.append('GRAPH_REGION_BOUNDARIES_CROSS:'+region_id);break
            crossings=_region_crossings(polygon,x)
            if len(crossings)!=2:
                nudged=_region_crossings(polygon,x+1e-7*max(1,abs(x)))
                if len(nudged)!=2:errors.append('GRAPH_REGION_BOUNDARY_MISMATCH:'+region_id);continue
                crossings=nudged
            if abs(crossings[-1]-yu)>ytol or abs(crossings[0]-yl)>ytol:errors.append('GRAPH_REGION_BOUNDARY_MISMATCH:'+region_id)
            band=max(abs(yu-yl),1e-9)
            if not _region_inside(polygon,(x,(yu+yl)/2)):errors.append('GRAPH_REGION_INTERIOR_MISSING:'+region_id)
            if _region_inside(polygon,(x,yu+max(4*ytol,GRAPH_REGION_OUTSIDE*band))):errors.append('GRAPH_REGION_OUTSIDE_BOUNDARY:'+region_id)
            if _region_inside(polygon,(x,yl-max(4*ytol,GRAPH_REGION_OUTSIDE*band))):errors.append('GRAPH_REGION_OUTSIDE_BOUNDARY:'+region_id)
            checks+=1
        mine=order[id(node)]
        if any(order[id(other)]<mine and (other.tag.split('}')[-1] in {'line','circle','polyline','polygon'} or (other.tag.split('}')[-1]=='path' and other.get('data-mark')!='graph-region')) for other in root.iter()):
            errors.append('GRAPH_REGION_NOT_BENEATH_STROKES:'+region_id)
        if entry.get('label') is not None:
            box=_region_label_box(elements,'region-'+region_id+'-label')
            if box is None:errors.append('GRAPH_REGION_LABEL_MISSING:'+region_id)
            else:
                x,y,w,h=box
                to_model=lambda px,py:((px-transform['originX'])/transform['sx'],(transform['originY']-py)/transform['sy'])
                corners=[to_model(x,y),to_model(x+w,y),to_model(x,y+h),to_model(x+w,y+h)]
                if not _region_inside(polygon,to_model(x+w/2,y+h/2)) or any(not _region_inside(polygon,corner) for corner in corners):errors.append('GRAPH_REGION_LABEL_OUTSIDE:'+region_id)
        observations.append({'id':region_id,'type':'GRAPH_REGION','fill':fill,'from':float(from_x),'to':float(to_x),'samples':checks,'areaPx2':abs(0.5*sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(polygon,polygon[1:]+polygon[:1])))})
    for path_id in paths:
        if path_id not in {'region-'+region_id for region_id in declared_ids}:errors.append('GRAPH_REGION_UNDECLARED:'+str(path_id))
    for index,(left_id,left) in enumerate(polygons):
        for right_id,right in polygons[index+1:]:
            xs=sorted({point[0] for point in left});ys=sorted({point[1] for point in left})
            found=False
            for i in range(1,10):
                for j in range(1,10):
                    point=(xs[0]+(xs[-1]-xs[0])*i/10,ys[0]+(ys[-1]-ys[0])*j/10)
                    if _region_inside(left,point) and _region_inside(right,point):errors.append('GRAPH_REGION_OVERLAP:'+left_id+':'+right_id);found=True;break
                if found:break
    return sorted(set(errors)),observations

def piecewise_polynomial_audit(plan,svg,transform):
    """Independent: the pieces, continuity, breakpoint claims, vertices, every crossing with each horizontal line and the display formula are
    recomputed from the source fields; then the drawn pieces, key points, lines, crossing dots and interval end dots are read from the SVG."""
    errors=[];unsupported=[]
    try:
        pieces=[]
        for piece in plan.get('pieces') or []:
            values=piece.get('coefficients') if isinstance(piece,dict) else None
            if not isinstance(values,list) or not 1<=len(values)<=3:raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
            pieces.append(S.Poly(sum(_pp_coeff(v)*x**i for i,v in enumerate(values)),x))
        breaks=[(_pp_coeff(row['x']),_pp_coeff(row['y'])) for row in plan.get('breakpoints') or []]
        if not 1<=len(pieces)<=4 or len(breaks)!=len(pieces)-1 or any(not a[0]<b[0] for a,b in zip(breaks,breaks[1:])):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
        # referenceCurves: a quadratic or its own piecewise function, rebuilt again from the plan's own exact fields and its own domain.
        ref_rows=plan.get('referenceCurves') or []
        if not isinstance(ref_rows,list) or len(ref_rows)>2:raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
        refs=[_pp_reference_row(entry,errors) for entry in ref_rows]
        for ref in refs:
            if ref['kind']=='quadratic':
                poly=ref['pieces'][0];h=S.radsimp(S.expand(-poly.nth(1)/(2*poly.nth(2))));ref['vertex']=(h,S.radsimp(S.expand(poly.eval(h))))
            else:ref['vertex']=None
        source=plan.get('sourceDomain')
        if source=={'kind':'ALL_REALS'}:lo=hi=None;states=['CLOSED','CLOSED']
        elif isinstance(source,dict) and source.get('kind')=='INTERVAL' and not set(source)-{'kind','range','states'}:
            lo,hi=(_pp_rational(v if isinstance(v,(str,int)) else str(v)) for v in source['range']);states=source.get('states',['CLOSED','CLOSED'])
            if not lo<hi or states[0] not in INTERVAL_STATE_FILLS or states[1] not in INTERVAL_STATE_FILLS or any(not lo<b<hi for b,_ in breaks):raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
        else:raise ValueError('PIECEWISE_POLY_SOURCE_INVALID')
        rational=lambda value:S.sympify(value)
        cuts=[lo,*[b for b,_ in breaks],hi];intervals=list(zip(cuts,cuts[1:]))
        for index,(bx,by) in enumerate(breaks):
            left,right=pieces[index].eval(rational(bx)),pieces[index+1].eval(rational(bx))
            if not _pp_same(left,right):errors.append('PIECEWISE_POLY_DISCONTINUOUS:'+str(bx))
            elif not _pp_same(left,rational(by)):errors.append('PIECEWISE_POLY_BREAKPOINT_CLAIM_MISMATCH:'+str(bx))
        inside=lambda value,a,b,strict:(a is None or (value>rational(a) if strict else value>=rational(a))) and (b is None or (value<rational(b) if strict else value<=rational(b)))
        extrema_exact=[]
        for poly,(a,b) in zip(pieces,intervals):
            if poly.degree()==2:
                h=S.radsimp(S.expand(-poly.nth(1)/(2*poly.nth(2))))
                if inside(h,a,b,True):extrema_exact.append((h,S.radsimp(S.expand(poly.eval(h))),'MAX' if poly.nth(2)<0 else 'MIN'))
        corners_exact=[(bx,by,None) for bx,by in breaks]
        extrema=[{'x':str(h),'y':str(y),'kind':kind} for h,y,kind in extrema_exact]
        corners=[{'x':str(bx),'y':str(by)} for bx,by,_ in corners_exact]
        features=plan.get('piecewisePolynomialFeatures')
        if not isinstance(features,dict) or features.get('schemaVersion')!='PIECEWISE_POLYNOMIAL_FEATURES_v1':raise ValueError('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED')
        def rows_match(frozen,expected):
            # The frozen inventory is compared as exact numbers, not as text (a surd can be written in several equal ways).
            if not isinstance(frozen,list) or len(frozen)!=len(expected):return False
            for row,(ex,ey,kind) in zip(frozen,expected):
                try:
                    if not _pp_same(_pp_exact(row['x'].replace(' ','')),ex) or not _pp_same(_pp_exact(row['y'].replace(' ','')),ey) or row.get('kind')!=kind:return False
                except (ValueError,KeyError,AttributeError,TypeError):return False
            return True
        if not rows_match(features.get('corners'),corners_exact):errors.append('PIECEWISE_POLY_CORNER_INVENTORY_MISMATCH')
        if not rows_match(features.get('extrema'),extrema_exact):errors.append('PIECEWISE_POLY_EXTREMUM_INVENTORY_MISMATCH')
        required=plan.get('requiredPoints',[])
        def g_exact(value):
            for poly,(a,b) in zip(pieces,intervals):
                if inside(value,a,b,False):return poly.eval(value)
            return None
        for point in required:
            gy=g_exact(S.Rational(str(point['x'])))
            near=lambda value:abs(float(value)-point['y'])<=1e-8*max(1,abs(point['y']))
            if not ((gy is not None and near(gy)) or any((value:=_pp_ref_value(ref,S.Rational(str(point['x'])))) is not None and near(value) for ref in refs)):errors.append('PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:'+str(point.get('id')))
        ref_vertices=[]
        for ref in refs:
            if ref['kind']=='quadratic':ref_vertices.append((*ref['vertex'],ref['id']))
            else:
                ref_vertices.extend((at,value,ref['id']) for at,value in ref['corners'])
                ref_vertices.extend((at,value,ref['id']) for at,value,_ in ref['extrema'])
        for fx,fy,_ in corners_exact+extrema_exact+[(a,b,None) for a,b,_ in ref_vertices]:
            if not any(abs(p['x']-float(fx))<=1e-9*max(1,abs(p['x'])) and abs(p['y']-float(fy))<=1e-9*max(1,abs(p['y'])) for p in required):errors.append('PIECEWISE_POLY_FEATURE_NOT_MARKED:'+str(fx))
        formula=plan.get('formula')
        if formula is not None:
            expression=_pp_formula(formula)
            for poly,(a,b) in zip(pieces,intervals):
                if a is not None and b is not None:samples=[rational(a)+(rational(b)-rational(a))*S.Rational(k,7) for k in range(8)]
                elif b is not None:samples=[rational(b)-S.Rational(k,3) for k in range(8)]+[rational(b)-50]
                elif a is not None:samples=[rational(a)+S.Rational(k,3) for k in range(8)]+[rational(a)+50]
                else:samples=[S.Rational(k-4,3) for k in range(9)]
                if any(S.simplify(expression.subs(x,value)-poly.eval(value))!=0 for value in samples):errors.append('PIECEWISE_POLY_FORMULA_MISMATCH');break
        # Crossings with each horizontal line, recomputed and compared with the claimed exact x values (and the frozen inventory).
        lines=plan.get('referenceLines',[]);expected_rows=[]
        claimed_rows={row.get('lineId'):row for row in features.get('intersections',[]) if isinstance(row,dict)}
        if len(claimed_rows)!=len(lines):errors.append('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH')
        for line in lines:
            # Horizontal {y} or slanted {slope,intercept}: m*x+c with m=0 for the horizontal one.
            slanted='slope' in line
            if slanted and (set(line)-{'id','intersectionX','labelIntersections','slope','intercept'} or 'intercept' not in line):raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
            m=_pp_coeff(line['slope']) if slanted else S.Integer(0)
            level=_pp_coeff(line['intercept'] if slanted else line['y']);roots=[]
            if slanted and m==0:raise ValueError('PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO')
            tolerance=S.Float('1e-40',60)
            for poly,(a,b) in zip(pieces,intervals):
                shifted=poly-S.Poly(m*x+level,x)
                found=_pp_real_roots(shifted)
                if found is None:errors.append('PIECEWISE_POLY_LINE_CONTAINS_A_PIECE');continue
                for root in found:
                    if a is not None and root<S.N(rational(a),60)-tolerance or b is not None and root>S.N(rational(b),60)+tolerance:continue
                    if lo is not None and (abs(root-S.N(rational(lo),60))<tolerance and states[0]=='OPEN' or abs(root-S.N(rational(hi),60))<tolerance and states[1]=='OPEN'):continue
                    if not any(abs(root-other)<tolerance for other in roots):roots.append(root)
            roots.sort(key=float)
            claimed=sorted((_pp_exact(text.replace(' ','')) for text in line.get('intersectionX',[])),key=float)
            if len(claimed)!=len(roots) or any(abs(S.N(c,60)-r)>tolerance for c,r in zip(claimed,roots)):errors.append('PIECEWISE_POLY_INTERSECTION_CLAIM_MISMATCH:'+str(line.get('id')))
            frozen=claimed_rows.get(line.get('id'))
            # A crossing at a marked key point is drawn once, as that key point.
            heights=[float(m*r+level) for r in roots]
            keys=[next((p['id'] for p in required if abs(p['x']-float(r))<=1e-9*max(1,abs(float(r))) and abs(p['y']-h)<=1e-9*max(1,abs(h))),None) for r,h in zip(roots,heights)]
            def frozen_same(key,value):
                try:return _pp_same(_pp_exact(str(frozen.get(key)).replace(' ','')),value)
                except ValueError:return False
            if slanted and (not frozen or not frozen_same('slope',m) or not frozen_same('intercept',level) or any(abs(p.get('yValue',math.nan)-h)>1e-9*max(1,abs(h)) for p,h in zip(frozen.get('points',[]),heights))):errors.append('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:'+str(line.get('id')))
            if not frozen or (not slanted and not frozen_same('y',level)) or len(frozen.get('points',[]))!=len(roots) or any(abs(p.get('xValue',math.nan)-float(r))>1e-9*max(1,abs(float(r))) or p.get('keyPoint')!=key for p,r,key in zip(frozen.get('points',[]),roots,keys)):errors.append('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:'+str(line.get('id')))
            expected_rows.append((line.get('id'),float(level),[float(r) for r in roots],keys,float(m),heights))
        # Crossings with each reference curve, recomputed piece pair by piece pair from the plan's own fields (a root outside either piece's
        # domain, or at an open end, is not a crossing), then compared with the claim and with the frozen inventory.
        curve_rows=[];claimed_curves={row.get('curveId'):row for row in features.get('curveIntersections',[]) if isinstance(row,dict)}
        if len(claimed_curves)!=len(refs) or sorted(claimed_curves)!=sorted(ref['id'] for ref in refs):errors.append('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH')
        frozen_refs={row.get('id'):row for row in features.get('referenceCurves',[]) if isinstance(row,dict)}
        for ref in refs:
            ref_id=ref['id'];tolerance=S.Float('1e-40',60)
            try:roots=_pp_ref_crossings(pieces,intervals,(lo,hi,states),ref)
            except ValueError as error:
                if 'CONTAINS_A_PIECE' in str(error):errors.append('PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE');roots=[]
                else:raise
            claimed=sorted((_pp_exact(text.replace(' ','')) for text in ref['claimed']),key=float)
            if len(claimed)!=len(roots) or any(abs(S.N(c,60)-r)>tolerance for c,r in zip(claimed,roots)):errors.append('PIECEWISE_POLY_INTERSECTION_CLAIM_MISMATCH:'+ref_id)
            heights=[float(_pp_ref_value(ref,r)) for r in roots]
            keys=[next((p['id'] for p in required if abs(p['x']-float(r))<=1e-9*max(1,abs(float(r))) and abs(p['y']-h)<=1e-9*max(1,abs(h))),None) for r,h in zip(roots,heights)]
            frozen=claimed_curves.get(ref_id) or {}
            if len(frozen.get('points',[]))!=len(roots) or any(abs(q.get('xValue',math.nan)-float(r))>1e-9*max(1,abs(float(r))) or abs(q.get('yValue',math.nan)-h)>1e-9*max(1,abs(h)) or q.get('keyPoint')!=key for q,r,h,key in zip(frozen.get('points',[]),roots,heights,keys)):errors.append('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:'+ref_id)
            frozen_draw=frozen_refs.get(ref_id)
            if ref['kind']=='quadratic':
                try:inventory_same=frozen_draw is not None and len(frozen_draw.get('coefficients',[]))==3 and all(_pp_same(_pp_exact(str(v).replace(' ','')),ref['pieces'][0].nth(i)) for i,v in enumerate(frozen_draw.get('coefficients',[])))
                except ValueError:inventory_same=False
            else:
                # The frozen draught of a piecewise reference is its own pieces, draw intervals, corners, extrema and source ends.
                # A reference piece entirely outside the drawn window is not frozen; the drawn branches are checked below.
                inventory_same=isinstance(frozen_draw,dict) and isinstance(frozen_draw.get('pieces'),list) and 1<=len(frozen_draw['pieces'])<=len(ref['pieces'])
                if inventory_same:
                    for frozen_piece,poly,(a,b) in zip(frozen_draw['pieces'],ref['pieces'],ref['intervals']):
                        try:
                            coefficients_same=all(_pp_same(_pp_exact(str(v).replace(' ','')),poly.nth(i)) for i,v in enumerate(frozen_piece.get('coefficients',[])))
                        except (ValueError,AttributeError):coefficients_same=False
                        if not coefficients_same or not isinstance(frozen_piece.get('drawInterval'),list):inventory_same=False;break
                    if inventory_same:
                        frozen_corners=frozen_draw.get('corners') or []
                        inventory_same=len(frozen_corners)==len(ref['corners']) and all(_pp_same(_pp_exact(c['x'].replace(' ','')),at) and _pp_same(_pp_exact(c['y'].replace(' ','')),value) for c,(at,value) in zip(frozen_corners,ref['corners']))
                    if inventory_same:
                        frozen_extrema=frozen_draw.get('extrema') or []
                        inventory_same=len(frozen_extrema)==len(ref['extrema']) and all(_pp_same(_pp_exact(e['x'].replace(' ','')),at) and _pp_same(_pp_exact(e['y'].replace(' ','')),value) and e.get('kind')==kind for e,(at,value,kind) in zip(frozen_extrema,ref['extrema']))
                    if inventory_same:
                        expected_source=ref['source']
                        frozen_source=frozen_draw.get('sourceInterval')
                        if expected_source[0] is None:inventory_same=frozen_source is None
                        else:inventory_same=isinstance(frozen_source,dict) and _pp_same(_pp_exact(frozen_source['lo'].replace(' ','')),expected_source[0]) and _pp_same(_pp_exact(frozen_source['hi'].replace(' ','')),expected_source[1]) and frozen_source.get('startState')==expected_source[2][0] and frozen_source.get('endState')==expected_source[2][1]
            if not inventory_same:errors.append('PIECEWISE_POLY_REFERENCE_CURVE_INVENTORY_MISMATCH:'+ref_id)
            curve_rows.append((ref_id,ref,[float(r) for r in roots],keys,heights))
        # The drawn window: each piece on its own interval cut to the draw domain; outer arms of an all-real source go past every key point.
        domain=plan.get('domain');draw_rows=features.get('pieces',[])
        if not isinstance(domain,list) or len(domain)!=2 or not domain[0]<domain[1] or len(draw_rows)!=len(pieces):raise ValueError('PIECEWISE_POLY_DRAW_DOMAIN_INVALID')
        expected_draw=[[domain[0] if a is None else float(a),domain[1] if b is None else float(b)] for a,b in intervals]
        if [row.get('drawInterval') for row in draw_rows]!=expected_draw:errors.append('PIECEWISE_POLY_DRAW_INTERVAL_MISMATCH')
        if lo is not None and domain!=[float(lo),float(hi)]:errors.append('PIECEWISE_POLY_DRAW_DOMAIN_CHANGED')
        if plan.get('equalUnits') is not True:errors.append('EQUAL_UNIT_DECLARATION_MISSING')
        errors.extend(axis_ratio_errors(plan,transform))
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not isinstance(v,(int,float)) or not math.isfinite(v) for v in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        sx,sy,display=transform['sx'],transform['sy'],transform['displayScale'];x_tol=.35/(sx*display);y_tol=.35/(sy*display)
        key_x=[float(fx) for fx,_,_ in corners_exact+extrema_exact]+[p['x'] for p in required]+[v for _,_,xs,_,_,_ in expected_rows for v in xs]+[v for _,_,xs,_,_ in curve_rows for v in xs]+[float(fx) for fx,_,_ in ref_vertices]+[float(at) for ref in refs if ref['source'][0] is not None and ref['kind']=='piecewise' for at in (ref['source'][0],ref['source'][1])]
        if lo is None and key_x and (min(key_x)-domain[0])*sx*display<8 or lo is None and key_x and (domain[1]-max(key_x))*sx*display<8:errors.append('PIECEWISE_POLY_ARM_TOO_SHORT')
        root=ET.fromstring(svg);xmin,xmax,ymin,ymax=plan['viewport']
        to_model=lambda px,py:((px-transform['originX'])/sx,(transform['originY']-py)/sy)
        curves=[node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve']
        by_piece={};by_ref={}
        for node in curves:(by_ref if (node.get('data-branch') or '').startswith('REF_') else by_piece).setdefault(node.get('data-branch'),[]).append(node)
        if sorted(by_piece)!=sorted('PIECE_'+str(i) for i in range(1,len(pieces)+1)) or any(len(nodes)!=1 for nodes in by_piece.values()):errors.append('PIECEWISE_POLY_PIECE_PRIMITIVE_INVENTORY_MISMATCH')
        coverage=[]
        for index,(poly,(start,end)) in enumerate(zip(pieces,expected_draw),1):
            nodes=by_piece.get('PIECE_'+str(index))
            if not nodes:continue
            values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',nodes[0].get('points',''))]
            if len(values)<4 or len(values)%2:errors.append('PIECEWISE_POLY_CURVE_POINTS_INVALID');continue
            points=[to_model(values[i],values[i+1]) for i in range(0,len(values),2)]
            if any(b[0]<=a[0] for a,b in zip(points,points[1:])):errors.append('PIECEWISE_POLY_PIECE_NOT_INCREASING_X:'+str(index))
            if abs(points[0][0]-start)>x_tol or abs(points[-1][0]-end)>x_tol:errors.append('PIECEWISE_POLY_PIECE_COVERAGE_FAIL:'+str(index))
            if any(px<start-x_tol or px>end+x_tol for px,_ in points):errors.append('PIECEWISE_POLY_PIECE_CROSSES_ITS_INTERVAL:'+str(index))
            curvature=abs(float(poly.nth(2)))*2 if poly.degree()==2 else 0.0;worst=0.0
            evaluate=lambda value:_pp_eval_poly(poly,value)
            for (ax,ay),(bx,by) in zip(points,points[1:]):
                bound=(max(abs(ay-evaluate(ax)),abs(by-evaluate(bx)))+curvature*(bx-ax)**2/8)*sy*display
                worst=max(worst,bound)
            for px,py in points:
                if not (xmin-x_tol<=px<=xmax+x_tol and ymin-y_tol<=py<=ymax+y_tol):errors.append('PIECEWISE_POLY_CURVE_OUTSIDE_VIEW:'+str(index));break
            if worst>.35:errors.append('PIECEWISE_POLY_CURVE_INTERIOR_BOUND_FAIL:'+str(index))
            coverage.append({'piece':index,'interval':[start,end],'points':len(points),'maxErrorCssPx':worst})
        # Every reference piece is drawn only on its own interval clipped to the drawn window, under the id scheme the producer uses.
        expected_ref_draws=[]
        for ref in refs:
            rows=[]
            for poly,(a,b) in zip(ref['pieces'],ref['intervals']):
                start=domain[0] if a is None else max(domain[0],float(a));end=domain[1] if b is None else min(domain[1],float(b))
                if end-start<=1e-9:continue
                rows.append((poly,start,end))
            expected_ref_draws.append((ref,rows))
        expected_branches=[]
        for ref,rows in expected_ref_draws:
            if not rows:continue
            for index,(_,start,end) in enumerate(rows,1):
                branch='REF_'+ref['id'] if len(rows)==1 else 'REF_'+ref['id']+'_'+str(index)
                expected_branches.append((branch,rows[index-1]))
        if sorted(by_ref)!=sorted(branch for branch,_ in expected_branches) or any(len(nodes)!=1 for nodes in by_ref.values()):errors.append('PIECEWISE_POLY_REFERENCE_CURVE_PRIMITIVE_MISSING')
        for branch,(refpoly,start,end) in expected_branches:
            nodes=by_ref.get(branch)
            if not nodes:continue
            ref_id=branch[4:]
            values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',nodes[0].get('points',''))]
            if len(values)<4 or len(values)%2:errors.append('PIECEWISE_POLY_CURVE_POINTS_INVALID');continue
            points=[to_model(values[i],values[i+1]) for i in range(0,len(values),2)]
            if any(b[0]<=a[0] for a,b in zip(points,points[1:])):errors.append('PIECEWISE_POLY_PIECE_NOT_INCREASING_X:'+ref_id)
            if abs(points[0][0]-start)>x_tol or abs(points[-1][0]-end)>x_tol:errors.append('PIECEWISE_POLY_REFERENCE_CURVE_COVERAGE_FAIL:'+ref_id)
            if any(px<start-x_tol or px>end+x_tol for px,_ in points):errors.append('PIECEWISE_POLY_REFERENCE_PIECE_CROSSES_ITS_INTERVAL:'+ref_id)
            curvature=abs(float(refpoly.nth(2)))*2 if refpoly.degree()==2 else 0.0;worst=0.0
            evaluate=lambda value,refpoly=refpoly:_pp_eval_poly(refpoly,value)
            for (ax,ay),(bx,by) in zip(points,points[1:]):
                worst=max(worst,(max(abs(ay-evaluate(ax)),abs(by-evaluate(bx)))+curvature*(bx-ax)**2/8)*sy*display)
            for px,py in points:
                if not (xmin-x_tol<=px<=xmax+x_tol and ymin-y_tol<=py<=ymax+y_tol):errors.append('PIECEWISE_POLY_CURVE_OUTSIDE_VIEW:'+ref_id);break
            if worst>.35:errors.append('PIECEWISE_POLY_CURVE_INTERIOR_BOUND_FAIL:'+ref_id)
        circles={node.get('id'):node for node in root.iter() if node.tag.split('}')[-1]=='circle'}
        def dot_at(node_id,wx,wy,role='point'):
            node=circles.get(node_id)
            if node is None or node.get('data-role')!=role:return False
            mx,my=to_model(float(node.get('cx')),float(node.get('cy')))
            return abs(mx-wx)<=x_tol and abs(my-wy)<=y_tol
        for index,point in enumerate(required,1):
            if not dot_at('required-point-'+str(index),point['x'],point['y']):errors.append('PIECEWISE_POLY_KEY_POINT_DOT_MISSING:'+str(point.get('id')))
        for line_id,level,xs,keys,m,heights in expected_rows:
            node=next((n for n in root.iter() if n.tag.split('}')[-1]=='line' and n.get('id')=='line-'+str(line_id)),None)
            if node is None:errors.append('PIECEWISE_POLY_REFERENCE_LINE_MISSING:'+str(line_id));continue
            (ax,ay),(bx,by)=to_model(float(node.get('x1')),float(node.get('y1'))),to_model(float(node.get('x2')),float(node.get('y2')))
            if m==0:
                if abs(ay-level)>y_tol or abs(by-level)>y_tol or min(ax,bx)>domain[0]+x_tol or max(ax,bx)<domain[1]-x_tol:errors.append('PIECEWISE_POLY_REFERENCE_LINE_POSITION_MISMATCH:'+str(line_id))
            else:
                # A slanted line is clipped by the view: both ends lie on y=m*x+c, the segment is long enough to read and it reaches every crossing.
                if abs(m*ax+level-ay)>y_tol+abs(m)*x_tol or abs(m*bx+level-by)>y_tol+abs(m)*x_tol or math.hypot((bx-ax)*sx*display,(by-ay)*sy*display)<40 or xs and (min(ax,bx)>min(xs)+x_tol or max(ax,bx)<max(xs)-x_tol):errors.append('PIECEWISE_POLY_REFERENCE_LINE_POSITION_MISMATCH:'+str(line_id))
            dots=[node_id for node_id in circles if node_id.startswith('intersection-'+str(line_id)+'-')]
            if len(dots)!=sum(key is None for key in keys):errors.append('PIECEWISE_POLY_INTERSECTION_DOT_COUNT_MISMATCH:'+str(line_id))
            for k,(value,key,height) in enumerate(zip(xs,keys,heights),1):
                if key is None and not dot_at('intersection-'+str(line_id)+'-'+str(k),value,height):errors.append('PIECEWISE_POLY_INTERSECTION_DOT_MISSING:'+str(line_id)+'-'+str(k))
        for ref_id,_,xs,keys,heights in curve_rows:
            dots=[node_id for node_id in circles if node_id.startswith('intersection-'+ref_id+'-')]
            if len(dots)!=sum(key is None for key in keys):errors.append('PIECEWISE_POLY_INTERSECTION_DOT_COUNT_MISMATCH:'+ref_id)
            for k,(value,key,height) in enumerate(zip(xs,keys,heights),1):
                if key is None and not dot_at('intersection-'+ref_id+'-'+str(k),value,height):errors.append('PIECEWISE_POLY_INTERSECTION_DOT_MISSING:'+ref_id+'-'+str(k))
        if lo is not None:
            ends=[(float(lo),float(pieces[0].eval(rational(lo))),states[0],'start'),(float(hi),float(pieces[-1].eval(rational(hi))),states[1],'end')]
            for wx,wy,state,side in ends:
                node=circles.get('interval-endpoint-'+side)
                if node is None or not dot_at('interval-endpoint-'+side,wx,wy,'interval-endpoint') or node.get('fill') not in INTERVAL_STATE_FILLS[state]:errors.append('PIECEWISE_POLY_INTERVAL_END_MARKER_MISMATCH:'+side)
        # A piecewise reference curve's own domain ends are hollow (OPEN) or filled (CLOSED) dots.
        for ref,rows in expected_ref_draws:
            source=ref['source']
            if source[0] is None:continue
            for side,state,at in (('start',source[2][0],source[0]),('end',source[2][1],source[1])):
                value=_pp_ref_boundary_value(ref,at)
                node=circles.get('ref-endpoint-'+ref['id']+'-'+side)
                if node is None or node.get('data-role')!='reference-endpoint' or not dot_at('ref-endpoint-'+ref['id']+'-'+side,float(at),float(value),'reference-endpoint') or node.get('fill') not in INTERVAL_STATE_FILLS[state]:errors.append('PIECEWISE_POLY_REFERENCE_ENDPOINT_MARKER_MISMATCH:'+ref['id']+'-'+side)
        # Shaded regions: rebuild each band from the plan's exact fields and read the final fill path back.
        region_errors,region_observations=graph_region_audit(plan,svg,transform,pieces,intervals,refs,features,root)
        errors.extend(region_errors)
        # Marks closer than one CSS pixel cannot be told apart at this size.
        marks=[]
        for mark in sorted(set([(float(fx),float(fy)) for fx,fy,_ in corners_exact+extrema_exact]+[(v,h) for _,_,xs,_,_,heights in expected_rows for v,h in zip(xs,heights)]+[(v,h) for _,_,xs,_,heights in curve_rows for v,h in zip(xs,heights)]+[(float(a),float(b)) for a,b,_ in ref_vertices])):
            if not any(abs(mark[0]-m[0])<=1e-9*max(1,abs(m[0])) and abs(mark[1]-m[1])<=1e-9*max(1,abs(m[1])) for m in marks):marks.append(mark)
        if any(math.hypot((a[0]-b[0])*sx*display,(a[1]-b[1])*sy*display)<1 for i,a in enumerate(marks) for b in marks[i+1:]):unsupported.append('PIECEWISE_POLY_FEATURES_BELOW_DISPLAY_RESOLUTION')
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'corners':corners,'extrema':extrema,'intersections':[{'lineId':i,**({'slope':m,'intercept':l} if m else {'y':l}),'x':xs,'keyPoints':keys} for i,l,xs,keys,m,_ in expected_rows],'coverage':coverage,'topology':{'pieces':len(pieces),'continuity':'CONTINUOUS' if not any(e.startswith('PIECEWISE_POLY_DISCONTINUOUS') for e in errors) else 'BROKEN'},'regions':region_observations,'policy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','mathMethod':'EXACT_RATIONAL_PIECES_AND_SYMPY_SURD_CROSSINGS'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,ET.ParseError) as error:
        return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'PIECEWISE_POLY_SOURCE_OR_SVG_SCHEMA_INVALID']}

def _trig_interval_expected(plan):
    """The source fields of an interval trigonometric plan, read again by SymPy: the curve expression, the interval, and every crossing with each reference line.
    Crossings are found without the engine's closed form: the gap curve and its derivative are evaluated at 40 digits (mpmath) and refined by bisection on every
    sign change of the gap, and a root of the derivative where the gap vanishes is a touching (double) crossing."""
    import mpmath
    function=plan.get('function')
    if function not in {'SIN','COS'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
    a,k,c=(_piecewise_rational(value,'INVALID_TRIGONOMETRIC_COEFFICIENT') for value in plan.get('coefficients'));phase=_piecewise_rational(plan.get('phasePi'),'INVALID_TRIGONOMETRIC_PHASE')
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or source.get('kind')!='INTERVAL_PI' or set(source)-{'kind','rangePi','states'} or not isinstance(source.get('rangePi'),list) or len(source['rangePi'])!=2:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi=(_piecewise_rational(value,'INVALID_TRIG_INTERVAL') for value in source['rangePi']);states=source.get('states',['CLOSED','CLOSED'])
    if not lo<hi or not isinstance(states,list) or len(states)!=2 or any(state not in INTERVAL_STATE_FILLS for state in states):raise ValueError('INVALID_TRIG_INTERVAL')
    if a==0 or k==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    periods=(hi-lo)*abs(k)/2
    if periods<Fraction(1,4) or periods>12:raise ValueError('TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
    trig=S.sin if function=='SIN' else S.cos
    rat=lambda value:S.Rational(value.numerator,value.denominator)
    expression=rat(a)*trig(rat(k)*x+rat(phase)*S.pi)+rat(c)
    x0=rat(lo)*S.pi;x1=rat(hi)*S.pi
    mpmath.mp.dps=40
    lo_f,hi_f=mpmath.mpf(str(x0.evalf(45))),mpmath.mpf(str(x1.evalf(45)))
    def refine(fn,left,right):
        fl=fn(left)
        for _ in range(140):
            mid=(left+right)/2;fm=fn(mid)
            if fl*fm<=0:right=mid
            else:left,fl=mid,fm
        return (left+right)/2
    lines=[]
    for row in plan.get('referenceLines') or []:
        if not isinstance(row,dict) or not isinstance(row.get('id'),str):raise ValueError('TRIG_REFERENCE_LINES_INVALID')
        if 'y' in row:slope=Fraction(0);intercept=_piecewise_rational(row['y'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id'])
        else:slope=_piecewise_rational(row.get('slope'),'TRIG_LINE_COEFFICIENT_INVALID:'+row['id']);intercept=_piecewise_rational(row.get('intercept'),'TRIG_LINE_COEFFICIENT_INVALID:'+row['id'])
        gap=expression-(rat(slope)*x+rat(intercept))
        g=S.lambdify(x,gap,'mpmath');dg=S.lambdify(x,S.diff(gap,x),'mpmath')
        steps=max(4000,int(800*float(hi-lo)))
        grid=[lo_f+(hi_f-lo_f)*i/steps for i in range(steps+1)]
        values=[g(t) for t in grid];slopes=[dg(t) for t in grid];roots=[]
        for i in range(steps):
            if values[i]==0:roots.append(grid[i])
            elif values[i]*values[i+1]<0:roots.append(refine(g,grid[i],grid[i+1]))
        if values[-1]==0:roots.append(grid[-1])
        for i in range(steps):
            if slopes[i]*slopes[i+1]<0:
                critical=refine(dg,grid[i],grid[i+1])
                if abs(g(critical))<mpmath.mpf(10)**-25:roots.append(critical)
        unique=[]
        for r in sorted(roots):
            if not unique or abs(r-unique[-1])>mpmath.mpf(10)**-12:unique.append(r)
        eps=mpmath.mpf(10)**-12
        kept=[r for r in unique if (r>lo_f+eps if states[0]=='OPEN' else r>=lo_f-eps) and (r<hi_f-eps if states[1]=='OPEN' else r<=hi_f+eps)]
        lines.append({'id':row['id'],'kind':'HORIZONTAL' if 'y' in row else 'SLANTED','slope':slope,'intercept':intercept,'claim':row.get('intersectionCount'),'x':[float(r) for r in kept]})
    f=S.lambdify(x,expression,'mpmath')
    return {'function':function,'a':a,'k':k,'c':c,'phase':phase,'lo':lo,'hi':hi,'states':states,'x0':float(x0),'x1':float(x1),'f':f,'lines':lines,'endY':[float(f(lo_f)),float(f(hi_f))]}

def trigonometric_interval_audit(plan,svg,transform):
    errors=[];unsupported=[]
    try:
        import mpmath
        want=_trig_interval_expected(plan);features=plan.get('trigIntervalFeatures');policy=plan.get('trigIntervalPolicy')
        if plan.get('overviewPolicy')!='TRIGONOMETRIC_INTERVAL_OVERVIEW_v1':errors.append('TRIG_OVERVIEW_POLICY_REQUIRED')
        if not isinstance(features,dict) or features.get('schemaVersion')!='TRIGONOMETRIC_INTERVAL_FEATURES_v1' or not isinstance(policy,dict) or policy.get('schemaVersion')!='TRIGONOMETRIC_INTERVAL_POLICY_v1':raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        head={'schemaVersion':'TRIGONOMETRIC_INTERVAL_FEATURES_v1','function':want['function'],'phasePi':str(want['phase']),'periodPiMultiple':str(Fraction(2,1)/abs(want['k'])),'amplitude':str(want['a']),'midline':str(want['c']),'sourceInterval':{'loPi':str(want['lo']),'hiPi':str(want['hi']),'states':want['states']}}
        if {key:value for key,value in features.items() if key!='lines'}!=head:errors.append('TRIG_FEATURE_INVENTORY_MISMATCH')
        domain=plan.get('domain')
        if not isinstance(domain,list) or len(domain)!=2 or any(abs(actual-expected)>1e-9*max(1.0,abs(expected)) for actual,expected in zip(domain,[want['x0'],want['x1']])):errors.append('TRIG_DRAW_WINDOW_MISMATCH')
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(value) for value in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        root=ET.fromstring(svg);points,point_errors=_observed_svg_points(root,transform);errors.extend(point_errors)
        if not points:return {'status':'FAIL','errors':sorted(set(errors+['TRIG_FINAL_CURVE_MISSING']))}
        xscale=transform['sx']*transform['displayScale'];yscale=transform['sy']*transform['displayScale'];x_tol=.35/max(1e-12,xscale)
        points=sorted(points,key=lambda point:point[0])
        if abs(points[0][0]-want['x0'])>x_tol or abs(points[-1][0]-want['x1'])>x_tol:errors.append('TRIG_DRAW_DOMAIN_COVERAGE_FAIL')
        for px,py in points:
            if not want['x0']-x_tol<=px<=want['x1']+x_tol:errors.append('TRIG_CURVE_OUTSIDE_INTERVAL');break
            if abs(py-float(want['f'](mpmath.mpf(px))))*yscale>.35:errors.append('TRIG_WRONG_FUNCTION_CURVE');break
        span=(want['x1']-want['x0'])*xscale;amplitude=abs(float(want['a']))*yscale
        if span<policy['minimumPeriodSpanCssPx']:unsupported.append('TRIG_PERIOD_BELOW_PROFILE_FLOOR')
        if amplitude<policy['minimumAmplitudeCssPx']:unsupported.append('TRIG_AMPLITUDE_BELOW_PROFILE_FLOOR')
        circles={n.get('id'):n for n in root.iter() if n.tag.split('}')[-1]=='circle'};line_nodes={n.get('id'):n for n in root.iter() if n.tag.split('}')[-1]=='line'}
        def read_circle(node_id):
            node=circles.get(node_id)
            if node is None:return None
            try:return ((float(node.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('cy')))/transform['sy'],node)
            except (TypeError,ValueError):return None
        for side,(wx,wy),state in zip(('start','end'),((want['x0'],want['endY'][0]),(want['x1'],want['endY'][1])),want['states']):
            got=read_circle('interval-endpoint-'+side)
            if got is None or abs(got[0]-wx)*xscale>.35 or abs(got[1]-wy)*yscale>.35 or got[2].get('fill') not in INTERVAL_STATE_FILLS[state]:errors.append('TRIG_INTERVAL_END_MARKER_MISMATCH:'+side)
        frozen=features.get('lines');frozen_ids=[row.get('id') for row in frozen] if isinstance(frozen,list) else None
        if frozen_ids!=[row['id'] for row in want['lines']]:errors.append('TRIG_LINE_INVENTORY_MISMATCH')
        detail=[];all_marks=[]
        for index,row in enumerate(want['lines']):
            xs=row['x'];count=len(xs)
            if row['claim']!=count:errors.append('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:'+row['id']+':observer finds '+str(count)+' intersection(s)')
            slope,intercept=float(row['slope']),float(row['intercept']);ys=[slope*t+intercept for t in xs]
            if isinstance(frozen,list) and index<len(frozen) and frozen[index].get('id')==row['id']:
                got=frozen[index].get('intersections')
                if not isinstance(got,list) or len(got)!=count or any(abs(g['x']-t)>1e-6*max(1.0,abs(t)) or abs(g['y']-v)>1e-6*max(1.0,abs(v)) for g,t,v in zip(got,xs,ys)):errors.append('TRIG_LINE_INTERSECTION_INVENTORY_MISMATCH:'+row['id'])
                if frozen[index].get('slope')!=str(row['slope']) or frozen[index].get('intercept')!=str(row['intercept']) or frozen[index].get('kind')!=row['kind']:errors.append('TRIG_LINE_INVENTORY_MISMATCH')
            node=line_nodes.get('line-'+row['id'])
            if node is None:errors.append('TRIG_LINE_MISSING:'+row['id'])
            else:
                try:
                    p1=((float(node.get('x1'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y1')))/transform['sy']);p2=((float(node.get('x2'))-transform['originX'])/transform['sx'],(transform['originY']-float(node.get('y2')))/transform['sy'])
                    if any(abs(p[1]-(slope*p[0]+intercept))*yscale>.35 for p in (p1,p2)):errors.append('TRIG_LINE_POSITION_MISMATCH:'+row['id'])
                    if xs and not (min(p1[0],p2[0])<=min(xs)+x_tol and max(p1[0],p2[0])>=max(xs)-x_tol):errors.append('TRIG_LINE_DOES_NOT_SPAN_CROSSINGS:'+row['id'])
                except (TypeError,ValueError):errors.append('TRIG_LINE_INVALID:'+row['id'])
            dots=[node_id for node_id in circles if node_id and node_id.startswith('intersection-'+row['id']+'-')]
            if len(dots)!=count:errors.append('TRIG_INTERSECTION_DOT_COUNT_MISMATCH:'+row['id'])
            for k,(tx,ty) in enumerate(zip(xs,ys),1):
                got=read_circle('intersection-'+row['id']+'-'+str(k))
                if got is None or abs(got[0]-tx)*xscale>.35 or abs(got[1]-ty)*yscale>.35:errors.append('TRIG_INTERSECTION_DOT_MISSING:'+row['id']+'-'+str(k))
            all_marks.extend(zip(xs,ys));detail.append({'id':row['id'],'kind':row['kind'],'crossings':count,'x':xs})
        if any(math.hypot((p[0]-q[0])*xscale,(p[1]-q[1])*yscale)<policy['minimumFeatureSeparationCssPx'] for i,p in enumerate(all_marks) for q in all_marks[i+1:]):unsupported.append('TRIG_INTERSECTIONS_BELOW_PROFILE_FLOOR')
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'features':head,'lines':detail,'curvePoints':len(points),'mathMethod':'SYMPY_EXACT_EXPRESSION_AND_MPMATH_40_DIGIT_ROOT_SCAN_OF_THE_GAP_AND_ITS_DERIVATIVE'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,OverflowError,ET.ParseError) as error:return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'TRIGONOMETRIC_SOURCE_SCHEMA_INVALID']}

def _pd_pieces(plan):
    """The pieces read again from the plan's own fields (pieces or a step block), exact and ordered."""
    if ('pieces' in plan)==('step' in plan):raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
    if 'step' in plan:
        step=plan['step']
        if not isinstance(step,dict) or set(step)!={'values','xFrom','xTo'}:raise ValueError('STEP_INTERVAL_INVALID')
        values=step['values']
        if not isinstance(values,list) or not 1<=len(values)<=6:raise ValueError('STEP_INTERVAL_INVALID')
        x_from=_pp_rational(step['xFrom']);x_to=_pp_rational(step['xTo'])
        if not x_from<x_to:raise ValueError('STEP_INTERVAL_INVALID')
        heights=[_pp_coeff(value) for value in values]
        width=S.Rational(x_to-x_from,len(heights))
        return [{'coefficients':[height,S.Integer(0),S.Integer(0)],'a':S.Rational(x_from+index*width),'b':S.Rational(x_from+(index+1)*width),'start':'CLOSED','end':'CLOSED' if index==len(heights)-1 else 'OPEN'} for index,height in enumerate(heights)]
    raw=plan['pieces']
    if not isinstance(raw,list) or not 1<=len(raw)<=6:raise ValueError('PIECEWISE_TOO_MANY_PIECES')
    pieces=[]
    for entry in raw:
        if not isinstance(entry,dict) or set(entry)-{'coefficients','domain','start','end'} or 'coefficients' not in entry or 'domain' not in entry:raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
        values=entry['coefficients']
        if not isinstance(values,list) or not 1<=len(values)<=3:raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
        coefficients=[_pp_coeff(value) for value in values]+[S.Integer(0)]*(3-len(values))
        domain=entry['domain']
        if not isinstance(domain,list) or len(domain)!=2:raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
        a=None if domain[0] is None else _pp_coeff(domain[0]);b=None if domain[1] is None else _pp_coeff(domain[1])
        if a is not None and b is not None and not a<b:raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
        start=entry.get('start','CLOSED');end=entry.get('end','CLOSED')
        if start not in INTERVAL_STATE_FILLS or end not in INTERVAL_STATE_FILLS:raise ValueError('PIECEWISE_ENDPOINT_STATE_INVALID')
        if a is None and start=='OPEN' or b is None and end=='OPEN':raise ValueError('PIECEWISE_ENDPOINT_STATE_INVALID')
        pieces.append({'coefficients':coefficients,'a':a,'b':b,'start':start,'end':end})
    for index,piece in enumerate(pieces):
        if piece['a'] is None and index!=0 or piece['b'] is None and index!=len(pieces)-1:raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
    for previous,current in zip(pieces,pieces[1:]):
        if previous['b'] is None or current['a'] is None:raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
        if previous['b']>current['a']:raise ValueError('PIECEWISE_DOMAIN_OVERLAP')
    return pieces

def _pd_defines(piece,value):
    tolerance=S.Float('1e-40',60);a,b=piece['a'],piece['b']
    if a is not None and (value<S.N(a,60)-tolerance or abs(value-S.N(a,60))<tolerance and piece['start']=='OPEN'):return False
    if b is not None and (value>S.N(b,60)+tolerance or abs(value-S.N(b,60))<tolerance and piece['end']=='OPEN'):return False
    return True

def _pd_value(piece,value):
    poly=S.Poly(sum(coefficient*x**index for index,coefficient in enumerate(piece['coefficients'])),x)
    return poly.eval(value)

def _pd_jumps(plan,pieces):
    raw=plan.get('jumpValues',[])
    if not isinstance(raw,list) or len(raw)>8:raise ValueError('PIECEWISE_DISCONTINUOUS_JUMP_VALUES_INVALID')
    rows=[]
    for entry in raw:
        if not isinstance(entry,dict) or set(entry)!={'x','y'}:raise ValueError('PIECEWISE_DISCONTINUOUS_JUMP_VALUES_INVALID')
        at=_pp_coeff(entry['x']);value=_pp_coeff(entry['y'])
        if any(_pp_same(at,other[0]) for other in rows):raise ValueError('PIECEWISE_VALUE_CONFLICT')
        rows.append((at,value))
    for at,value in rows:
        for piece in pieces:
            if _pd_defines(piece,at) and not _pp_same(_pd_value(piece,at),value):raise ValueError('PIECEWISE_VALUE_CONFLICT')
    for previous,current in zip(pieces,pieces[1:]):
        if previous['b'] is None or current['a'] is None or not _pp_same(previous['b'],current['a']):continue
        left,right=previous['end']=='CLOSED',current['start']=='CLOSED'
        if left and right:raise ValueError('PIECEWISE_DOMAIN_OVERLAP')
        declared=[value for at,value in rows if _pp_same(at,current['a'])]
        if not left and not right:
            if not declared:raise ValueError('PIECEWISE_DISCONTINUITY_UNDECLARED')
        elif declared:
            expected=_pd_value(previous if left else current,current['a'])
            if any(not _pp_same(value,expected) for value in declared):raise ValueError('PIECEWISE_VALUE_CONFLICT')
    return rows

def _pd_markers(pieces,jumps):
    rows=[]
    def add(at,value,state):
        for row in rows:
            if _pp_same(row[0],at) and _pp_same(row[1],value):
                if state=='CLOSED':row[2]='CLOSED'
                return
        rows.append([at,value,state])
    for piece in pieces:
        if piece['a'] is not None:add(piece['a'],_pd_value(piece,piece['a']),piece['start'])
        if piece['b'] is not None:add(piece['b'],_pd_value(piece,piece['b']),piece['end'])
    for at,value in jumps:add(at,value,'CLOSED')
    return sorted(rows,key=lambda row:(float(row[0]),float(row[1])))

def _pd_extrema(pieces):
    rows=[]
    for piece in pieces:
        poly=S.Poly(sum(coefficient*x**index for index,coefficient in enumerate(piece['coefficients'])),x)
        if poly.degree()!=2:continue
        h=S.radsimp(S.expand(-poly.nth(1)/(2*poly.nth(2))))
        if (piece['a'] is None or h>piece['a']) and (piece['b'] is None or h<piece['b']):rows.append((h,S.radsimp(S.expand(poly.eval(h))),'MAX' if poly.nth(2)<0 else 'MIN'))
    return rows

def _pd_crossings(pieces,level,jumps):
    tolerance=S.Float('1e-40',60);found=[]
    for piece in pieces:
        poly=S.Poly(sum(coefficient*x**index for index,coefficient in enumerate(piece['coefficients'])),x)-S.Poly(level,x)
        roots=_pp_real_roots(poly)
        if roots is None:raise ValueError('PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE')
        for root in roots:
            if not _pd_defines(piece,root):continue
            if not any(abs(root-other)<tolerance for other in found):found.append(root)
    for at,value in jumps:
        if _pp_same(value,level) and not any(abs(S.N(at,60)-other)<tolerance for other in found):found.append(S.N(at,60))
    return sorted(found)

def piecewise_discontinuous_audit(plan,svg,transform):
    """Independent: the pieces, their endpoint states and jumps, the declared values, the in-piece vertices and every crossing with each
    horizontal line are recomputed from the plan; then the drawn pieces (one polyline per piece, never bridged across a jump), the
    hollow/filled endpoint dots and the crossing dots are read from the final SVG."""
    errors=[];unsupported=[]
    try:
        pieces=_pd_pieces(plan);jumps=_pd_jumps(plan,pieces)
        extrema=_pd_extrema(pieces)
        required=plan.get('requiredPoints',[])
        if not isinstance(required,list):raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
        def defined_value(value):
            for piece in pieces:
                if _pd_defines(piece,value):return _pd_value(piece,value)
            return None
        for point in required:
            at=_pp_coeff(str(point['x']));near=lambda value:abs(float(value)-point['y'])<=1e-8*max(1,abs(point['y']))
            value=defined_value(at)
            if not ((value is not None and near(value)) or any(_pp_same(at,at_value) and near(declared) for at_value,declared in jumps)):errors.append('PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_NOT_ON_CURVE:'+str(point.get('id')))
        for at,value,_ in extrema:
            if not any(abs(p['x']-float(at))<=1e-9*max(1,abs(p['x'])) and abs(p['y']-float(value))<=1e-9*max(1,abs(p['y'])) for p in required):errors.append('PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_MARKED:'+str(at))
        markers=_pd_markers(pieces,jumps)
        features=plan.get('piecewiseDiscontinuousFeatures')
        if not isinstance(features,dict) or features.get('schemaVersion')!='PIECEWISE_DISCONTINUOUS_FEATURES_v1':raise ValueError('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED')
        # The frozen inventory must be exactly what the plan says (pieces, endpoint states, declared values, vertices).
        frozen_pieces=features.get('pieces')
        if not isinstance(frozen_pieces,list) or len(frozen_pieces)!=len(pieces):errors.append('PIECEWISE_DISCONTINUOUS_PIECE_INVENTORY_MISMATCH')
        else:
            for row,piece in zip(frozen_pieces,pieces):
                try:
                    coefficients_same=all(_pp_same(_pp_coeff(str(value)),piece['coefficients'][index]) for index,value in enumerate(row.get('coefficients',[]))) and len(row.get('coefficients',[]))==3
                except (ValueError,AttributeError):coefficients_same=False
                interval=row.get('interval')
                interval_same=isinstance(interval,list) and len(interval)==2 and ((piece['a'] is None and interval[0] is None) or (piece['a'] is not None and interval[0] is not None and _pp_same(_pp_coeff(interval[0]),piece['a']))) and ((piece['b'] is None and interval[1] is None) or (piece['b'] is not None and interval[1] is not None and _pp_same(_pp_coeff(interval[1]),piece['b'])))
                if not coefficients_same or not interval_same or row.get('start')!=piece['start'] or row.get('end')!=piece['end']:errors.append('PIECEWISE_DISCONTINUOUS_PIECE_INVENTORY_MISMATCH')
        frozen_markers=features.get('markers')
        if not isinstance(frozen_markers,list) or len(frozen_markers)!=len(markers):errors.append('PIECEWISE_DISCONTINUOUS_MARKER_INVENTORY_MISMATCH')
        else:
            for index,(row,(at,value,state)) in enumerate(zip(frozen_markers,markers),1):
                try:same=_pp_same(_pp_coeff(str(row.get('x'))),at) and _pp_same(_pp_coeff(str(row.get('y'))),value)
                except (ValueError,AttributeError):same=False
                if not same or row.get('state')!=state or row.get('id')!='endpoint-'+str(index):errors.append('PIECEWISE_DISCONTINUOUS_MARKER_INVENTORY_MISMATCH')
        frozen_extrema=features.get('extrema')
        if not isinstance(frozen_extrema,list) or len(frozen_extrema)!=len(extrema):errors.append('PIECEWISE_DISCONTINUOUS_EXTREMUM_INVENTORY_MISMATCH')
        else:
            for row,(at,value,kind) in zip(frozen_extrema,extrema):
                try:same=_pp_same(_pp_coeff(str(row.get('x'))),at) and _pp_same(_pp_coeff(str(row.get('y'))),value)
                except (ValueError,AttributeError):same=False
                if not same or row.get('kind')!=kind:errors.append('PIECEWISE_DISCONTINUOUS_EXTREMUM_INVENTORY_MISMATCH')
        # Reference lines: the claimed exact crossings are recomputed piece by piece; the frozen inventory is compared too.
        lines=plan.get('referenceLines',[])
        if not isinstance(lines,list):raise ValueError('PIECEWISE_REFERENCE_LINES_INVALID')
        claimed_rows={row.get('lineId'):row for row in features.get('intersections',[]) if isinstance(row,dict)}
        if len(claimed_rows)!=len(lines):errors.append('PIECEWISE_INTERSECTION_INVENTORY_MISMATCH')
        expected=[]
        for line in lines:
            level=_pp_coeff(line['y']);roots=_pd_crossings(pieces,level,jumps)
            claimed=sorted((_pp_coeff(str(text)) for text in line.get('intersectionX',[])),key=float)
            if len(claimed)!=len(roots) or any(not _pp_same(value,root) for value,root in zip(claimed,[S.N(root,60) for root in roots])):errors.append('PIECEWISE_INTERSECTION_CLAIM_MISMATCH:'+str(line.get('id')))
            frozen=claimed_rows.get(line.get('id')) or {}
            keys=[next((p.get('id') for p in required if abs(p['x']-root)<=1e-9*max(1,abs(root)) and abs(p['y']-float(level))<=1e-9*max(1,abs(float(level)))),None) for root in roots]
            marker_flags=[key is None and any(abs(float(at)-root)<=1e-9*max(1,abs(root)) and abs(float(value)-float(level))<=1e-9*max(1,abs(float(level))) for at,value,_ in markers) for root,key in zip(roots,keys)]
            if len(frozen.get('points',[]))!=len(roots) or any(abs(point.get('xValue',math.nan)-root)>1e-9*max(1,abs(root)) or point.get('keyPoint')!=key or bool(point.get('marker'))!=flag for point,root,key,flag in zip(frozen.get('points',[]),roots,keys,marker_flags)):errors.append('PIECEWISE_INTERSECTION_INVENTORY_MISMATCH:'+str(line.get('id')))
            expected.append((line.get('id'),float(level),roots,keys,marker_flags))
        if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not isinstance(v,(int,float)) or not math.isfinite(v) for v in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0:return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
        sx,sy,display=transform['sx'],transform['sy'],transform['displayScale'];x_tol=.35/(sx*display);y_tol=.35/(sy*display)
        root=ET.fromstring(svg);xmin,xmax,ymin,ymax=plan['viewport']
        to_model=lambda px,py:((px-transform['originX'])/sx,(transform['originY']-py)/sy)
        domain=plan.get('domain')
        if not isinstance(domain,list) or len(domain)!=2 or not domain[0]<domain[1]:raise ValueError('PIECEWISE_DISCONTINUOUS_DRAW_DOMAIN_INVALID')
        expected_draw=[[domain[0] if piece['a'] is None else float(piece['a']),domain[1] if piece['b'] is None else float(piece['b'])] for piece in pieces]
        for row,draw in zip(frozen_pieces or [],expected_draw):
            if row.get('drawInterval')!=draw:errors.append('PIECEWISE_DISCONTINUOUS_DRAW_INTERVAL_MISMATCH')
        if plan.get('equalUnits') is not True:errors.append('EQUAL_UNIT_DECLARATION_MISSING')
        errors.extend(axis_ratio_errors(plan,transform))
        # One polyline per piece, on its own interval only: a jump is never bridged by a connecting segment.
        curves=[node for node in root.iter() if node.get('data-role')=='curve']
        if any(node.tag.split('}')[-1]!='polyline' for node in curves):errors.append('PIECEWISE_DISCONTINUOUS_STRAY_CURVE_PRIMITIVE')
        by_piece={}
        for node in curves:by_piece.setdefault(node.get('data-branch'),[]).append(node)
        if sorted(by_piece)!=sorted('PIECE_'+str(index) for index in range(1,len(pieces)+1)) or any(len(nodes)!=1 for nodes in by_piece.values()):errors.append('PIECEWISE_DISCONTINUOUS_PIECE_PRIMITIVE_INVENTORY_MISMATCH')
        coverage=[]
        for index,(piece,(start,end)) in enumerate(zip(pieces,expected_draw),1):
            nodes=by_piece.get('PIECE_'+str(index))
            if not nodes:continue
            values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',nodes[0].get('points',''))]
            if len(values)<4 or len(values)%2:errors.append('PIECEWISE_DISCONTINUOUS_CURVE_POINTS_INVALID');continue
            points=[to_model(values[i],values[i+1]) for i in range(0,len(values),2)]
            if any(b[0]<=a[0] for a,b in zip(points,points[1:])):errors.append('PIECEWISE_DISCONTINUOUS_PIECE_NOT_INCREASING_X:'+str(index))
            if abs(points[0][0]-start)>x_tol or abs(points[-1][0]-end)>x_tol:errors.append('PIECEWISE_DISCONTINUOUS_PIECE_COVERAGE_FAIL:'+str(index))
            if any(px<start-x_tol or px>end+x_tol for px,_ in points):errors.append('PIECEWISE_DISCONTINUOUS_PIECE_CROSSES_ITS_INTERVAL:'+str(index))
            poly=S.Poly(sum(coefficient*x**k for k,coefficient in enumerate(piece['coefficients'])),x)
            curvature=abs(float(poly.nth(2)))*2 if poly.degree()==2 else 0.0;worst=0.0
            for (ax,ay),(bx,by) in zip(points,points[1:]):
                worst=max(worst,(max(abs(ay-_pp_eval_poly(poly,ax)),abs(by-_pp_eval_poly(poly,bx)))+curvature*(bx-ax)**2/8)*sy*display)
            for px,py in points:
                if not (xmin-x_tol<=px<=xmax+x_tol and ymin-y_tol<=py<=ymax+y_tol):errors.append('PIECEWISE_DISCONTINUOUS_CURVE_OUTSIDE_VIEW:'+str(index));break
            if worst>.35:errors.append('PIECEWISE_DISCONTINUOUS_CURVE_INTERIOR_BOUND_FAIL:'+str(index))
            coverage.append({'piece':index,'interval':[start,end],'points':len(points),'maxErrorCssPx':worst})
        circles={node.get('id'):node for node in root.iter() if node.tag.split('}')[-1]=='circle'}
        def dot_at(node_id,wx,wy):
            node=circles.get(node_id)
            if node is None:return False
            mx,my=to_model(float(node.get('cx')),float(node.get('cy')))
            return abs(mx-wx)<=x_tol and abs(my-wy)<=y_tol
        marker_nodes=[node for node in root.iter() if node.get('data-role')=='discontinuous-endpoint']
        if len(marker_nodes)!=len(markers):errors.append('PIECEWISE_DISCONTINUOUS_MARKER_COUNT_MISMATCH')
        for index,(at,value,state) in enumerate(markers,1):
            node=circles.get('discontinuous-endpoint-'+str(index))
            if node is None or node.get('data-role')!='discontinuous-endpoint' or not dot_at('discontinuous-endpoint-'+str(index),float(at),float(value)) or node.get('fill') not in INTERVAL_STATE_FILLS[state]:errors.append('PIECEWISE_DISCONTINUOUS_ENDPOINT_MARKER_MISMATCH:'+str(index))
        for index,point in enumerate(required,1):
            if not dot_at('required-point-'+str(index),point['x'],point['y']):errors.append('PIECEWISE_DISCONTINUOUS_KEY_POINT_DOT_MISSING:'+str(point.get('id')))
        for line_id,level,roots,keys,marker_flags in expected:
            node=next((n for n in root.iter() if n.tag.split('}')[-1]=='line' and n.get('id')=='line-'+str(line_id)),None)
            if node is None:errors.append('PIECEWISE_REFERENCE_LINE_MISSING:'+str(line_id));continue
            (ax,ay),(bx,by)=to_model(float(node.get('x1')),float(node.get('y1'))),to_model(float(node.get('x2')),float(node.get('y2')))
            if abs(ay-level)>y_tol or abs(by-level)>y_tol or min(ax,bx)>domain[0]+x_tol or max(ax,bx)<domain[1]-x_tol:errors.append('PIECEWISE_REFERENCE_LINE_POSITION_MISMATCH:'+str(line_id))
            dots=[node_id for node_id in circles if node_id and node_id.startswith('intersection-'+str(line_id)+'-')]
            if len(dots)!=sum(key is None and not flag for key,flag in zip(keys,marker_flags)):errors.append('PIECEWISE_INTERSECTION_DOT_COUNT_MISMATCH:'+str(line_id))
            for k,(value,key,flag) in enumerate(zip(roots,keys,marker_flags),1):
                if key is None and not flag and not dot_at('intersection-'+str(line_id)+'-'+str(k),value,level):errors.append('PIECEWISE_INTERSECTION_DOT_MISSING:'+str(line_id)+'-'+str(k))
        marks=[]
        for mark in sorted(set([(float(at),float(value)) for at,value,_ in markers]+[(float(at),float(value)) for at,value,_ in extrema]+[(float(root),level) for _,level,roots,_,_ in expected for root in roots])):
            if not any(abs(mark[0]-other[0])<=1e-9*max(1,abs(mark[0])) and abs(mark[1]-other[1])<=1e-9*max(1,abs(mark[1])) for other in marks):marks.append(mark)
        if any(math.hypot((a[0]-b[0])*sx*display,(a[1]-b[1])*sy*display)<1 for i,a in enumerate(marks) for b in marks[i+1:]):unsupported.append('PIECEWISE_DISCONTINUOUS_FEATURES_BELOW_DISPLAY_RESOLUTION')
        status='UNSUPPORTED' if unsupported else 'FAIL' if errors else 'PASS'
        return {'status':status,'errors':sorted(set(errors+unsupported)),'markers':[{'x':float(at),'y':float(value),'state':state} for at,value,state in markers],'extrema':[{'x':float(at),'y':float(value),'kind':kind} for at,value,kind in extrema],'intersections':[{'lineId':line_id,'y':level,'x':[float(root) for root in roots],'keyPoints':keys} for line_id,level,roots,keys,marker_flags in expected],'coverage':coverage,'topology':{'pieces':len(pieces),'discontinuous':True},'policy':'PIECEWISE_DISCONTINUOUS_OVERVIEW_v1','mathMethod':'EXACT_RATIONAL_PIECES_WITH_ENDPOINT_STATES_AND_SYMPY_ROOT_SCAN'}
    except (ValueError,KeyError,TypeError,ZeroDivisionError,ET.ParseError) as error:
        return {'status':'UNSUPPORTED','errors':[str(error) if isinstance(error,ValueError) else 'PIECEWISE_DISCONTINUOUS_SOURCE_OR_SVG_SCHEMA_INVALID']}

def audit(plan,svg,transform):
    if plan.get('family')=='piecewise-polynomial':
        return piecewise_polynomial_audit(plan,svg,transform)
    if plan.get('family')=='piecewise-discontinuous':
        return piecewise_discontinuous_audit(plan,svg,transform)
    if plan.get('family')=='piecewise-affine' and plan.get('shapeIntent')=='OVERVIEW':
        return piecewise_affine_overview_audit(plan,svg,transform)
    if plan.get('family')=='exponential-affine' and plan.get('shapeIntent')=='OVERVIEW':
        if plan.get('overviewPolicy')=='EXPONENTIAL_BASE_OVERVIEW_v1':return exponential_base_overview_audit(plan,svg,transform)
        return exponential_affine_overview_audit(plan,svg,transform)
    if plan.get('family')=='logarithmic-affine' and plan.get('shapeIntent')=='OVERVIEW':
        if plan.get('overviewPolicy')=='LOGARITHMIC_BASE_OVERVIEW_v1':return logarithmic_base_overview_audit(plan,svg,transform)
        return logarithmic_affine_overview_audit(plan,svg,transform)
    if plan.get('family')=='exp-log-pair' and plan.get('shapeIntent')=='OVERVIEW':
        return exp_log_pair_overview_audit(plan,svg,transform)
    if plan.get('family')=='trigonometric' and plan.get('shapeIntent')=='OVERVIEW':
        if plan.get('overviewPolicy')=='TRIGONOMETRIC_INTERVAL_OVERVIEW_v1':return trigonometric_interval_audit(plan,svg,transform)
        return trigonometric_overview_audit(plan,svg,transform)
    try:f,den,poly,evaluate,topology=resolve(plan)
    except (ValueError,KeyError,TypeError) as error:return {'status':'UNSUPPORTED','errors':[str(error)]}
    if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(v) for v in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0: return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
    tolerance=.35;scale=transform['sy']*transform['displayScale'];errors=[];rows=[];intervals=[];markers=[];observed_roots=[];actual_points=[]
    corner_x_tolerance=.35/max(1e-12,transform['sx']*transform['displayScale'])
    required_roots=[r for r,_ in topology['roots'] if plan['viewport'][0]<=r<=plan['viewport'][1] and not any(abs(r-h)<1e-9 for h in topology['holes']+topology['poles'])] if plan['viewport'][2]<=0<=plan['viewport'][3] else []
    if any((b-a)*transform['sx']*transform['displayScale']<1 for a,b in zip(required_roots,required_roots[1:])):return {'status':'UNSUPPORTED','errors':['GRAPH_ROOT_FEATURE_BELOW_DISPLAY_RESOLUTION'],'topology':topology}
    root=ET.fromstring(svg)
    paths=[n for n in root.iter() if n.tag.split('}')[-1]=='polyline' and n.get('data-role')=='curve']
    if not paths:return {'status':'FAIL','errors':['NO_CURVE_PRIMITIVE']}
    if len(paths)>32 or sum(len(n.get('points','')) for n in paths)>500000:return {'status':'UNSUPPORTED','errors':['OBSERVER_BUDGET_EXCEEDED']}
    second=S.together(S.diff(f,x,2));second_num,second_den=second.as_numer_denom()
    for n in root.iter():
        if n.tag.split('}')[-1]=='circle' and n.get('data-role')=='hole' and n.get('fill') in {'white','#fff','#ffffff'}:
            markers.append(((float(n.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(n.get('cy')))/transform['sy']))
    for path in paths:
        values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',path.get('points',''))]
        if len(values)<4 or len(values)%2 or not all(math.isfinite(v) for v in values):errors.append('INVALID_CURVE_POINTS');continue
        points=[((values[i]-transform['originX'])/transform['sx'],(transform['originY']-values[i+1])/transform['sy']) for i in range(0,len(values),2)]
        actual_points.extend(points)
        for (a,ya),(b,yb) in zip(points,points[1:]):
            if a==b and ya==yb:continue  # identical SVG-quantized vertex, no segment
            if not a<b: errors.append('NONMONOTONE_SEGMENT');continue
            if any(a<r<b for r in topology['holes']+topology['poles']+topology['boundary']):errors.append('DOMAIN_CROSSING');continue
            if any(a<r-corner_x_tolerance and b>r+corner_x_tolerance for r in topology.get('corners',[])):errors.append('DOMAIN_CROSSING');continue
            if abs(ya)<1e-9:observed_roots.append(a)
            if abs(yb)<1e-9:observed_roots.append(b)
            if ya*yb<0:observed_roots.append(a+(b-a)*(-ya)/(yb-ya))
            try:
                fa,fb=float(evaluate(a)),float(evaluate(b));vertex=max(abs(ya-fa),abs(yb-fb))*scale
                if plan['family']=='sqrt-affine':
                    m=(fb-fa)/(b-a);t=(float(poly.nth(1))/(2*m))**2 if m else 0
                    at=(t-float(poly.nth(0)))/float(poly.nth(1));at=max(a,min(b,at))
                    bound=abs(float(evaluate(at))-(fa+m*(at-a)))*scale
                elif plan['family']=='absolute-value':
                    bound=0.0
                else:
                    upper=poly_abs_upper(S.Poly(second_num,x),a,b)
                    lower=denominator_lower(S.Poly(second_den,x),a,b)
                    if lower<=0:
                        errors.append('CURVE_INTERIOR_BOUND_UNVERIFIED')
                        rows.append({'interval':[a,b],'vertexErrorPx':vertex,'interiorBoundPx':None,'totalBoundPx':None})
                        continue
                    bound=upper/lower*(b-a)**2/8*scale
                error_bound=vertex+bound
                rows.append({'interval':[a,b],'vertexErrorPx':vertex,'interiorBoundPx':bound,'totalBoundPx':error_bound})
                if error_bound>tolerance:errors.append('CURVE_INTERIOR_BOUND_FAIL')
                xmin,xmax,ymin,ymax=plan['viewport']
                if any(not (xmin-1e-7<=xx<=xmax+1e-7 and ymin-1e-7<=yy<=ymax+1e-7) for xx,yy in [(a,ya),(b,yb)]):errors.append('UNCLIPPED_CURVE')
                intervals.append([a,b])
            except (ValueError,ZeroDivisionError,TypeError):errors.append('NONREAL_CURVE')
    # Coverage comes from source/viewport intersection, never producer branchCount.
    x_tol=.35/(transform['sx']*transform['displayScale'])
    for r in required_roots:
        if any(abs(r-o)<=x_tol for o in observed_roots):continue
        # A repeated (tangent) root never changes sign, so it is observed as the curve touching the axis at that x, not as a crossing.
        near=min(actual_points,key=lambda point:abs(point[0]-r)) if actual_points else None
        if near is not None and abs(near[0]-r)<=x_tol and abs(near[1])*scale<=tolerance:continue
        errors.append('REQUIRED_ROOT_FEATURE_MISSING')
    merged=[]
    for a,b in sorted(intervals):
        if merged and a<=merged[-1][1]+1e-9:merged[-1][1]=max(b,merged[-1][1])
        else:merged.append([a,b])
    for a,b in topology['visibleIntervals']:
        cursor=a
        for c,d in merged:
            if d<a or c>b:continue
            if c>cursor+x_tol:errors.append('VISIBLE_COVERAGE_GAP')
            cursor=max(cursor,d)
        if cursor<b-x_tol:errors.append('VISIBLE_COVERAGE_GAP')
    for hole in topology['holes']:
        lim=float(S.limit(f,x,S.Rational(str(hole))))
        if plan['viewport'][2]<=lim<=plan['viewport'][3] and not any(abs(mx-hole)<1e-7 and abs(my-lim)*scale<=tolerance for mx,my in markers):errors.append('REMOVABLE_HOLE_MARKER_MISSING')
    if plan.get('family')=='rational' and plan.get('shapeIntent')=='OVERVIEW':overview=rational_overview_audit(plan,poly,actual_points,transform,topology,root)
    elif plan.get('family')=='sqrt-affine' and plan.get('shapeIntent')=='OVERVIEW':overview=sqrt_affine_overview_audit(plan,poly,actual_points,transform,topology,root)
    elif plan.get('family')=='absolute-value' and plan.get('shapeIntent')=='OVERVIEW':overview=absolute_value_overview_audit(plan,poly,actual_points,transform,topology,root)
    elif plan.get('family')=='polynomial' and isinstance(plan.get('sourceDomain'),dict) and plan['sourceDomain'].get('kind')=='INTERVAL':overview=polynomial_interval_audit(plan,poly,actual_points,transform,root)
    else:overview=overview_audit(plan,poly,actual_points,transform) if plan.get('shapeIntent')=='OVERVIEW' else {'status':'NOT_REQUESTED'}
    if overview['status'] in ('FAIL','UNSUPPORTED'):errors.extend(overview['errors'])
    status='UNSUPPORTED' if overview['status']=='UNSUPPORTED' else 'FAIL' if errors else 'PASS'
    return {'status':status,'errors':sorted(set(errors)),'topology':topology,'segments':rows,'overview':overview,'maxChordErrorPx':tolerance,'verificationMethod':'INDEPENDENT_SOURCE_INTERVAL_AND_SECOND_DERIVATIVE_BOUND'}
