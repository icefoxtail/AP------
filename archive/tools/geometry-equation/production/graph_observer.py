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
    return S.Poly(sum(S.Rational(v)*x**i for i,v in enumerate(values)),x)

def real_roots(poly,lo,hi):
    if poly.is_zero: return []
    # Exact rational root isolation, retaining multiplicity and clustered roots.
    return [(float((a+b)/2),multiplicity) for (a,b),multiplicity in poly.intervals(eps=S.Rational(1,10**14)) if float(b)>=lo and float(a)<=hi]

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

def audit(plan,svg,transform):
    try:f,den,poly,evaluate,topology=resolve(plan)
    except (ValueError,KeyError,TypeError) as error:return {'status':'UNSUPPORTED','errors':[str(error)]}
    if set(transform)!={'originX','originY','sx','sy','displayScale'} or any(not math.isfinite(v) for v in transform.values()) or min(transform['sx'],transform['sy'],transform['displayScale'])<=0: return {'status':'FAIL','errors':['INVALID_OBSERVED_TRANSFORM']}
    tolerance=.35;scale=transform['sy']*transform['displayScale'];errors=[];rows=[];intervals=[];markers=[]
    root=ET.fromstring(svg)
    paths=[n for n in root.iter() if n.tag.split('}')[-1]=='polyline' and n.get('data-role')=='curve']
    if not paths:return {'status':'FAIL','errors':['NO_CURVE_PRIMITIVE']}
    if len(paths)>32 or sum(len(n.get('points','')) for n in paths)>500000:return {'status':'UNSUPPORTED','errors':['OBSERVER_BUDGET_EXCEEDED']}
    second=S.together(S.diff(f,x,2));second_num,second_den=second.as_numer_denom()
    for n in root.iter():
        if n.tag.split('}')[-1]=='circle' and n.get('data-role')=='hole' and n.get('fill')=='white':
            markers.append(((float(n.get('cx'))-transform['originX'])/transform['sx'],(transform['originY']-float(n.get('cy')))/transform['sy']))
    for path in paths:
        values=[float(v) for v in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',path.get('points',''))]
        if len(values)<4 or len(values)%2 or not all(math.isfinite(v) for v in values):errors.append('INVALID_CURVE_POINTS');continue
        points=[((values[i]-transform['originX'])/transform['sx'],(transform['originY']-values[i+1])/transform['sy']) for i in range(0,len(values),2)]
        for (a,ya),(b,yb) in zip(points,points[1:]):
            if not a<b: errors.append('NONMONOTONE_SEGMENT');continue
            if any(a<r<b for r in topology['holes']+topology['poles']+topology['boundary']):errors.append('DOMAIN_CROSSING');continue
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
    return {'status':'FAIL' if errors else 'PASS','errors':sorted(set(errors)),'topology':topology,'segments':rows,'maxChordErrorPx':tolerance,'verificationMethod':'INDEPENDENT_SOURCE_INTERVAL_AND_SECOND_DERIVATIVE_BOUND'}
