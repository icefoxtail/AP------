"""Independent final-polyline observer. Does not import producer/sampler helpers.

Scope: rational-coefficient degree <=4 polynomial, rational with denominator
degree <=2, sqrt of a positive-slope affine polynomial. Uses conservative
second-derivative bounds; sqrt boundary uses its exact secant envelope.
"""
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
    if any(multiplicity!=1 for _,multiplicity in roots):return {'status':'UNSUPPORTED','errors':['OVERVIEW_REPEATED_ROOT_UNSUPPORTED']}
    expected=polynomial_feature_inventory(poly,lo,hi);declared=plan.get('overviewFeatures')
    feature_policy={'schemaVersion':'POLYNOMIAL_CUBIC_QUARTIC_FEATURE_POLICY_v1','repeatedSourceRootPolicy':'UNSUPPORTED','minimumDistinctFeatureSeparationCssPx':1,'stationaryInflectionPolicy':'MERGE_ROLES_AT_SAME_POINT'}
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
    return {'status':'FAIL' if errors else 'PASS','errors':sorted(set(errors)),'degree':poly.degree(),'plotCssSize':[width,height],'features':feature_rows,'endDirections':end_directions,'arms':arms if critical else [],'policy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','mathMethod':'EXACT_RATIONAL_SOURCE_ROOT_ISOLATION'}

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

def overview_audit(plan,poly,points,transform):
    """Independent shape adequacy from source coefficients and observed curves."""
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

def audit(plan,svg,transform):
    if plan.get('family')=='piecewise-affine' and plan.get('shapeIntent')=='OVERVIEW':
        return piecewise_affine_overview_audit(plan,svg,transform)
    if plan.get('family')=='exponential-affine' and plan.get('shapeIntent')=='OVERVIEW':
        return exponential_affine_overview_audit(plan,svg,transform)
    if plan.get('family')=='logarithmic-affine' and plan.get('shapeIntent')=='OVERVIEW':
        return logarithmic_affine_overview_audit(plan,svg,transform)
    if plan.get('family')=='trigonometric' and plan.get('shapeIntent')=='OVERVIEW':
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
        if not any(abs(r-o)<=x_tol for o in observed_roots):errors.append('REQUIRED_ROOT_FEATURE_MISSING')
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
    else:overview=overview_audit(plan,poly,actual_points,transform) if plan.get('shapeIntent')=='OVERVIEW' else {'status':'NOT_REQUESTED'}
    if overview['status'] in ('FAIL','UNSUPPORTED'):errors.extend(overview['errors'])
    status='UNSUPPORTED' if overview['status']=='UNSUPPORTED' else 'FAIL' if errors else 'PASS'
    return {'status':status,'errors':sorted(set(errors)),'topology':topology,'segments':rows,'overview':overview,'maxChordErrorPx':tolerance,'verificationMethod':'INDEPENDENT_SOURCE_INTERVAL_AND_SECOND_DERIVATIVE_BOUND'}
