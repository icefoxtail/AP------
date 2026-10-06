"""Independent final-polyline observer. Does not import producer/sampler helpers.

Scope: rational-coefficient degree <=4 polynomial, rational with denominator
degree <=2, sqrt of a positive-slope affine polynomial. Uses conservative
second-derivative bounds; sqrt boundary uses its exact secant envelope.
"""
import math
import re
import xml.etree.ElementTree as ET
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
    family=plan['family'];holes=[];poles=[];boundary=[]
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
    else: raise ValueError('UNSUPPORTED_GRAPH_FAMILY')
    lo,hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport']
    if not all(math.isfinite(v) for v in [lo,hi,xmin,xmax,ymin,ymax]) or not lo<hi or not xmin<xmax or not ymin<ymax: raise ValueError('INVALID_GRAPH_DOMAIN')
    lo=max(lo,xmin,boundary[0] if boundary else lo);hi=min(hi,xmax)
    cuts=[lo,hi,*holes,*poles,*boundary]
    for level in [ymin,ymax]:
        if family=='sqrt-affine':
            if level>=0:cuts.extend(r for r,_ in real_roots(S.Poly(p.as_expr()-S.Rational(str(level))**2,x),lo,hi))
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
    return f,den,p,evaluate,{'holes':holes,'poles':poles,'boundary':boundary,'visibleIntervals':visible,'roots':real_roots(p,*plan['domain'])}

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

def audit(plan,svg,transform):
    try:f,den,poly,evaluate,topology=resolve(plan)
    except (ValueError,KeyError,TypeError) as error:return {'status':'UNSUPPORTED','errors':[str(error)]}
    if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(v) for v in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0: return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
    tolerance=.35;scale=transform['sy']*transform['displayScale'];errors=[];rows=[];intervals=[];markers=[];observed_roots=[];actual_points=[]
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
            if abs(ya)<1e-9:observed_roots.append(a)
            if abs(yb)<1e-9:observed_roots.append(b)
            if ya*yb<0:observed_roots.append(a+(b-a)*(-ya)/(yb-ya))
            try:
                fa,fb=float(evaluate(a)),float(evaluate(b));vertex=max(abs(ya-fa),abs(yb-fb))*scale
                if plan['family']=='sqrt-affine':
                    m=(fb-fa)/(b-a);t=(float(poly.nth(1))/(2*m))**2 if m else 0
                    at=(t-float(poly.nth(0)))/float(poly.nth(1));at=max(a,min(b,at))
                    bound=abs(float(evaluate(at))-(fa+m*(at-a)))*scale
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
    else:overview=overview_audit(plan,poly,actual_points,transform) if plan.get('shapeIntent')=='OVERVIEW' else {'status':'NOT_REQUESTED'}
    if overview['status'] in ('FAIL','UNSUPPORTED'):errors.extend(overview['errors'])
    status='UNSUPPORTED' if overview['status']=='UNSUPPORTED' else 'FAIL' if errors else 'PASS'
    return {'status':status,'errors':sorted(set(errors)),'topology':topology,'segments':rows,'overview':overview,'maxChordErrorPx':tolerance,'verificationMethod':'INDEPENDENT_SOURCE_INTERVAL_AND_SECOND_DERIVATIVE_BOUND'}
