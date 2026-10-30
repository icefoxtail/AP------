"""Adapter reusing the legacy sampler; observer remains a separate module."""
import sys
import math
from fractions import Fraction
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.function_sampling import sample
from visual_engine.viewport import Viewport

def _exp_log_base_expression(row):
    """The sampler expression of one exp/log curve. A non-natural base is written with ln(base) only inside the expression; the framing and
    observer keep the exact base and recompute the curve independently."""
    base=row.get('base')
    if row['family']=='exponential-affine':
        a,k,c=row['coefficients'];shift=row.get('shiftX','0');natural=base in (None,'e')
        if natural and shift=='0':return f'({a})*exp(({k})*x)+({c})'
        exponent=f'({k})*(x-({shift}))' if natural else f'({k})*ln({base})*(x-({shift}))'
        return f'({a})*exp({exponent})+({c})'
    if row['family']=='logarithmic-affine':
        a,k,b,c=row['coefficients']
        if base in (None,'e'):return f'({a})*log(({k})*x+({b}))+({c})'
        return f'({a})*log(({k})*x+({b}))/ln({base})+({c})'
    raise ValueError('UNSUPPORTED_GRAPH_FAMILY')


def _sqrt_exact_text(value):
    return str(value).replace(' ','')

def _sqrt_general_expression(plan):
    """y = q + s*k*sqrt(c + b*x): every coefficient is an exact string, so the sampler evaluates exactly the source function."""
    radicand=plan['radicand'];amplitude=plan.get('amplitude','1');sign=plan.get('sign',1);offset=plan.get('offset','0')
    scale=f'({sign})*({amplitude})' if sign==-1 or str(amplitude)!='1' else '1'
    return f'({offset})+({scale})*sqrt((({radicand[0]})+({radicand[1]})*x))'

def expression(plan):
    def poly(values):
        return '('+'+'.join('('+v+')*x^'+str(i) for i,v in enumerate(values))+')'
    if plan['family']=='polynomial':return poly(plan['coefficients'])
    if plan['family']=='rational':return poly(plan['numerator'])+'/'+poly(plan['denominator'])
    if plan['family']=='sqrt-affine':
        if plan.get('overviewPolicy')=='SQRT_AFFINE_GENERAL_OVERVIEW_v1':return _sqrt_general_expression(plan)
        return 'sqrt('+poly(plan['radicand'])+')'
    if plan['family']=='absolute-value':
        b,a,scale,offset=plan['coefficients']
        return '(('+scale+')*abs(('+a+')*x+('+b+'))+('+offset+'))'
    if plan['family'] in {'exponential-affine','logarithmic-affine'}:return _exp_log_base_expression(plan)
    if plan['family']=='trigonometric':
        fn=plan['function'].lower();rate_pi=plan.get('ratePi')
        if rate_pi is not None:a,c=plan['coefficients'];rate=f'({rate_pi})*pi'
        else:a,k,c=plan['coefficients'];rate=f'({k})'
        phase=f'({plan["phasePi"]})*pi' if plan.get('phasePi') is not None else f'({plan["phase"]})'
        return f'({a})*{fn}(({rate})*x+({phase}))+({c})'
    raise ValueError('UNSUPPORTED_GRAPH_FAMILY')

def svg_number(value):
    text=f'{value:.9f}'.rstrip('0').rstrip('.')
    return text if text and text!='-0' else '0'

def _produce(plan):
    # A graph framed at one scale is modelled at its own plot size, so the model's px measures match the final figure's. Cubic/quartic
    # overviews are composed on the 610x420 overview canvas (phase2 GRAPH_OVERVIEW_CANVAS, panel 140): the model uses the same plot so its
    # tail/feature px measures are the ones the final figure has.
    plot=plan.get('plotCanvas') if plan.get('equalUnits') is True else None
    degree=max((index for index,value in enumerate(plan.get('coefficients',[])) if value!='0'),default=0) if plan.get('family')=='polynomial' else 0
    overview=plan.get('family')=='polynomial' and degree>=3
    vp=Viewport(*plan['viewport'],width=plot['width']+64 if plot else 610 if overview else 420,height=plot['height']+64 if plot else 420 if overview else 280,panel=140 if overview else 0,margin=32,equal=plan.get('equalUnits') is True and plan.get('axisRatio',1)==1)
    if plan.get('family')=='piecewise-affine':return _produce_piecewise_affine(plan,vp)
    if plan.get('family')=='piecewise-polynomial':return _produce_piecewise_polynomial(plan,vp)
    if plan.get('family')=='piecewise-discontinuous':return _produce_piecewise_discontinuous(plan,vp)
    if plan.get('family')=='multi-curve':return _produce_multi_curve(plan,vp)
    if plan.get('family')=='exp-log-pair':return _produce_exp_log_pair(plan,vp)
    critical=[p['x'] for p in plan.get('requiredPoints',[])]+[feature['x'] for feature in plan.get('overviewFeatures',[]) if feature.get('kind')!='TAIL_DIRECTION']
    if plan['family']=='sqrt-affine' and plan.get('overviewPolicy')=='SQRT_AFFINE_GENERAL_OVERVIEW_v1':
        from graph_framing import pp_exact_float
        c,b=pp_exact_float(plan['radicand'][0]),pp_exact_float(plan['radicand'][1])
        amplitude=pp_exact_float(plan.get('amplitude','1'));sign=plan.get('sign',1);scale=sign*amplitude
        boundary=-c/b
        # The boundary secant gap grows with |scale|*sqrt(|b|*dx); reserve margin below .35px.
        step=(1.2/(vp.sy*abs(scale)*math.sqrt(abs(b))))**2
        if b>0 and plan['domain'][0]<=boundary<plan['domain'][1]:critical.append(boundary+step)
        if b<0 and plan['domain'][0]<boundary<=plan['domain'][1]:critical.append(boundary-step)
    elif plan['family']=='sqrt-affine':
        b,a=[float(Fraction(v)) for v in plan['radicand']]
        if a<=0:raise ValueError('UNSUPPORTED_SQRT_RADICAND')
        boundary=-b/a
        # sqrt's boundary secant gap is sqrt(a*dx)/4; reserve margin below .35px.
        step=(1.2/(vp.sy*math.sqrt(a)))**2
        if plan['domain'][0]<=boundary<plan['domain'][1]:critical.append(boundary+step)
    if plan['family']=='absolute-value' and plan.get('overviewPolicy')=='ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1':
        critical.append(float(Fraction(plan['absoluteFeatures']['corner']['x'])))
        critical.extend(float(Fraction(value)) for value in plan['absoluteFeatures']['xIntercepts'])
    if plan['family']=='exponential-affine' and plan.get('overviewPolicy')=='EXPONENTIAL_AFFINE_OVERVIEW_v1':critical.append(0.0)
    if plan['family']=='exponential-affine' and plan.get('overviewPolicy')=='EXPONENTIAL_BASE_OVERVIEW_v1':critical.append(float(Fraction(plan['exponentialFeatures']['referencePoint']['x'])))
    if plan['family']=='logarithmic-affine' and plan.get('overviewPolicy')=='LOGARITHMIC_AFFINE_OVERVIEW_v1':critical.append(float(Fraction(plan['logarithmicFeatures']['referencePoint']['x'])))
    if plan['family']=='logarithmic-affine' and plan.get('overviewPolicy')=='LOGARITHMIC_BASE_OVERVIEW_v1':critical.append(float(Fraction(plan['logarithmicFeatures']['referencePoint']['x'])))
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_PERIODIC_OVERVIEW_v1':
        features=plan.get('trigFeatures',{})
        if plan.get('function') in {'SIN','COS'}:critical.extend(float(Fraction(row['xPiMultiple']))*math.pi for row in features.get('phasePoints',[]))
        elif features.get('referencePoint'):critical.append(float(Fraction(features['referencePoint']['xPiMultiple']))*math.pi)
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_INTERVAL_OVERVIEW_v1':
        critical.extend(point['x'] for row in plan.get('trigIntervalFeatures',{}).get('lines',[]) for point in row['intersections'])
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_PERIODIC_OVERVIEW_v2':
        features=plan.get('trigFeatures',{})
        if plan.get('function') in {'SIN','COS'}:critical.extend(float(Fraction(row['x'])) for row in features.get('phasePoints',[]))
        elif features.get('referencePoint'):critical.append(float(Fraction(features['referencePoint']['x'])))
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_INTERVAL_OVERVIEW_v2':
        features=plan.get('trigIntervalFeatures',{});factor=math.pi if features.get('axisUnit')=='PI' else 1.0
        critical.extend(point['x'] for row in features.get('lines',[]) for point in row['intersections'])
        critical.extend(float(Fraction(row['x']))*factor for row in features.get('keyPoints',[]))
        critical.extend(float(Fraction(row['x']))*factor for row in features.get('poles',[]))
    result=sample(expression(plan),plan['domain'],vp,critical_x=critical)
    # A tangent branch near a pole can exceed the finite wire range in its refinement-cap report; the code is the evidence, not the huge px.
    for warning in result.get('warnings',[]):
        if isinstance(warning,dict) and 'errorPx' in warning and not (math.isfinite(warning['errorPx']) and abs(warning['errorPx'])<=9007199254740991):warning['errorPx']=None
    if not (math.isfinite(result.get('screenSpaceChordErrorPx',0)) and abs(result.get('screenSpaceChordErrorPx',0))<=9007199254740991):result['screenSpaceChordErrorPx']=None
    curves=[]
    for i,branch in enumerate(result['branches']):
        points=' '.join(','.join(svg_number(v) for v in vp.screen(p)) for p in branch)
        curves.append(f'<polyline id="curve-{i}" data-role="curve" points="{points}" fill="none" stroke="black"/>')
    features=plan.get('rationalFeatures')
    if plan['family']=='rational' and plan.get('overviewPolicy')=='RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1':
        if not isinstance(features,dict) or features.get('schemaVersion')!='RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1':raise ValueError('RATIONAL_FEATURE_INVENTORY_REQUIRED')
        xmin,xmax,ymin,ymax=plan['viewport'];asymptote=float(Fraction(features['horizontalAsymptoteY']))
        a,b=vp.screen((xmin,asymptote)),vp.screen((xmax,asymptote))
        curves.append(f'<line id="rational-asymptote-horizontal" data-role="asymptote" data-axis="horizontal" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        singularity=features['singularity'];singular_x=float(Fraction(singularity['x']))
        if singularity['kind']=='VERTICAL_POLE':
            a,b=vp.screen((singular_x,ymin)),vp.screen((singular_x,ymax))
            curves.append(f'<line id="rational-asymptote-vertical" data-role="asymptote" data-axis="vertical" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        elif singularity['kind']=='REMOVABLE_HOLE':
            cx,cy=vp.screen((singular_x,float(Fraction(singularity['y']))))
            radius=float(plan['rationalFeaturePolicy']['holeMarkerRadiusIntrinsicPx'])
            curves.append(f'<circle id="rational-removable-hole" data-role="hole" cx="{cx:.12g}" cy="{cy:.12g}" r="{radius:.12g}" fill="white" stroke="black" stroke-width="1"/>')
        else:raise ValueError('INVALID_RATIONAL_SINGULARITY_KIND')
    if plan['family']=='rational' and plan.get('overviewPolicy')=='RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_v1':
        # Inverse proportion: an asymptote that lies on a coordinate axis is the axis itself and gets no dashed line (the horizontal one always,
        # the vertical one when the pole is x=0); the required points are dots on the curve.
        if not isinstance(features,dict) or features.get('schemaVersion')!='RATIONAL_CONSTANT_OVER_LINEAR_FEATURES_v1':raise ValueError('RATIONAL_FEATURE_INVENTORY_REQUIRED')
        xmin,xmax,ymin,ymax=plan['viewport'];vertical=features['asymptotes']['vertical']
        if vertical['drawn']:
            singular_x=float(Fraction(vertical['x']));a,b=vp.screen((singular_x,ymin)),vp.screen((singular_x,ymax))
            curves.append(f'<line id="rational-asymptote-vertical" data-role="asymptote" data-axis="vertical" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        for index,point in enumerate(plan.get('requiredPoints',[]),1):
            cx,cy=vp.screen((point['x'],point['y']))
            curves.append(f'<circle id="required-point-{index}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
    if plan['family']=='sqrt-affine' and plan.get('overviewPolicy') in {'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1','SQRT_AFFINE_GENERAL_OVERVIEW_v1'}:
        from graph_framing import pp_exact_float
        features=plan.get('sqrtFeatures');policy=plan.get('sqrtFeaturePolicy')
        general=plan.get('overviewPolicy')=='SQRT_AFFINE_GENERAL_OVERVIEW_v1'
        schema='SQRT_AFFINE_GENERAL_FEATURES_v1' if general else 'SQRT_AFFINE_FEATURES_v1'
        if not isinstance(features,dict) or features.get('schemaVersion')!=schema or not isinstance(policy,dict):raise ValueError('SQRT_ENDPOINT_INVENTORY_REQUIRED')
        radius=float(policy['endpointMarkerRadiusIntrinsicPx'])
        for index,endpoint in enumerate(features.get('sourceEndpoints',[])):
            if endpoint.get('state')!='CLOSED':raise ValueError('UNSUPPORTED_OPEN_SQRT_SOURCE_ENDPOINT')
            at=vp.screen((pp_exact_float(endpoint['x']) if general else float(Fraction(endpoint['x'])),float(endpoint['y'])))
            curves.append(f'<circle id="sqrt-domain-endpoint-{index}" data-role="domain-endpoint" data-endpoint-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='polynomial' and plan.get('overviewPolicy')=='POLYNOMIAL_INTERVAL_OVERVIEW_v1':
        features=plan.get('intervalFeatures');policy=plan.get('intervalFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='POLYNOMIAL_INTERVAL_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('POLYNOMIAL_INTERVAL_INVENTORY_REQUIRED')
        radius=float(policy['markerRadiusIntrinsicPx'])
        for endpoint in features.get('endpoints',[]):
            if endpoint.get('state') not in {'CLOSED','OPEN'} or endpoint.get('side') not in {'START','END'}:raise ValueError('INVALID_POLYNOMIAL_INTERVAL_ENDPOINT')
            at=vp.screen((float(Fraction(endpoint['x'])),float(Fraction(endpoint['y']))))
            curves.append(f'<circle id="interval-endpoint-{endpoint["side"].lower()}" data-role="interval-endpoint" data-endpoint-state="{endpoint["state"]}" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="{"white" if endpoint["state"]=="OPEN" else "black"}" stroke="black" stroke-width="1"/>')
    if plan['family']=='absolute-value' and plan.get('overviewPolicy')=='ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1':
        features=plan.get('absoluteFeatures');policy=plan.get('absoluteFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='ABSOLUTE_VALUE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('ABSOLUTE_VALUE_FEATURE_INVENTORY_REQUIRED')
        corner=features['corner'];at=vp.screen((float(Fraction(corner['x'])),float(Fraction(corner['y']))));radius=float(policy['cornerMarkerRadiusIntrinsicPx'])
        curves.append(f'<circle id="absolute-value-corner" data-role="absolute-corner" data-endpoint-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='exponential-affine' and plan.get('overviewPolicy')=='EXPONENTIAL_AFFINE_OVERVIEW_v1':
        features=plan.get('exponentialFeatures');policy=plan.get('exponentialFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='EXPONENTIAL_AFFINE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('EXPONENTIAL_FEATURE_INVENTORY_REQUIRED')
        asymptote=float(Fraction(features['horizontalAsymptote']['y']));a,b=vp.screen((plan['viewport'][0],asymptote)),vp.screen((plan['viewport'][1],asymptote))
        curves.append(f'<line id="exponential-horizontal-asymptote" data-role="exponential-asymptote" data-axis="horizontal" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        ref=features['referencePoint'];at=vp.screen((float(Fraction(ref['x'])),float(Fraction(ref['y']))));radius=float(policy['referenceMarkerRadiusIntrinsicPx'])
        curves.append(f'<circle id="exponential-reference-point" data-role="exponential-reference" data-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='exponential-affine' and plan.get('overviewPolicy')=='EXPONENTIAL_BASE_OVERVIEW_v1':
        features=plan.get('exponentialFeatures');policy=plan.get('exponentialFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='EXPONENTIAL_BASE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('EXPONENTIAL_FEATURE_INVENTORY_REQUIRED')
        asymptote=float(Fraction(features['horizontalAsymptote']['y']));a,b=vp.screen((plan['viewport'][0],asymptote)),vp.screen((plan['viewport'][1],asymptote))
        curves.append(f'<line id="exponential-horizontal-asymptote" data-role="exponential-asymptote" data-axis="horizontal" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        ref=features['referencePoint'];at=vp.screen((float(Fraction(ref['x'])),float(Fraction(ref['y']))));radius=float(policy['referenceMarkerRadiusIntrinsicPx'])
        curves.append(f'<circle id="exponential-reference-point" data-role="exponential-reference" data-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='logarithmic-affine' and plan.get('overviewPolicy')=='LOGARITHMIC_AFFINE_OVERVIEW_v1':
        features=plan.get('logarithmicFeatures');policy=plan.get('logarithmicFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='LOGARITHMIC_AFFINE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED')
        boundary=float(Fraction(features['naturalDomainBoundaryX']));a,b=vp.screen((boundary,plan['viewport'][2])),vp.screen((boundary,plan['viewport'][3]))
        curves.append(f'<line id="logarithmic-domain-boundary" data-role="logarithmic-domain-boundary" data-axis="vertical" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        ref=features['referencePoint'];at=vp.screen((float(Fraction(ref['x'])),float(Fraction(ref['y']))));radius=float(policy['referenceMarkerRadiusIntrinsicPx'])
        curves.append(f'<circle id="logarithmic-reference-point" data-role="logarithmic-reference" data-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='logarithmic-affine' and plan.get('overviewPolicy')=='LOGARITHMIC_BASE_OVERVIEW_v1':
        features=plan.get('logarithmicFeatures');policy=plan.get('logarithmicFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='LOGARITHMIC_BASE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED')
        boundary=float(Fraction(features['naturalDomainBoundaryX']));a,b=vp.screen((boundary,plan['viewport'][2])),vp.screen((boundary,plan['viewport'][3]))
        curves.append(f'<line id="logarithmic-domain-boundary" data-role="logarithmic-domain-boundary" data-axis="vertical" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        ref=features['referencePoint'];at=vp.screen((float(Fraction(ref['x'])),float(Fraction(ref['y']))));radius=float(policy['referenceMarkerRadiusIntrinsicPx'])
        curves.append(f'<circle id="logarithmic-reference-point" data-role="logarithmic-reference" data-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_PERIODIC_OVERVIEW_v1':
        features=plan.get('trigFeatures');policy=plan.get('trigFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='TRIGONOMETRIC_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        radius=float(policy['markerRadiusIntrinsicPx'])
        if plan['function'] in {'SIN','COS'}:
            for feature in features.get('phasePoints',[]):
                at=vp.screen((float(Fraction(feature['xPiMultiple']))*math.pi,float(Fraction(feature['y']))))
                curves.append(f'<circle id="trig-{feature["id"]}" data-role="trig-feature" data-feature-kind="{feature["kind"]}" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
        else:
            lo,hi,ylo,yhi=plan['viewport']
            for pole in features.get('poles',[]):
                pole_x=float(Fraction(pole['xPiMultiple']))*math.pi;a,b=vp.screen((pole_x,ylo)),vp.screen((pole_x,yhi))
                curves.append(f'<line id="trig-{pole["id"]}" data-role="trig-pole" data-pole-side="{pole["side"]}" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
            ref=features['referencePoint'];at=vp.screen((float(Fraction(ref['xPiMultiple']))*math.pi,float(Fraction(ref['y']))))
            curves.append(f'<circle id="trig-reference-point" data-role="trig-reference" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_PERIODIC_OVERVIEW_v2':
        features=plan.get('trigFeatures');policy=plan.get('trigFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='TRIGONOMETRIC_FEATURES_v2' or not isinstance(policy,dict):raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        radius=float(policy['markerRadiusIntrinsicPx'])
        if plan['function'] in {'SIN','COS'}:
            for feature in features.get('phasePoints',[]):
                at=vp.screen((float(Fraction(feature['x'])),float(Fraction(feature['y']))))
                curves.append(f'<circle id="trig-{feature["id"]}" data-role="trig-feature" data-feature-kind="{feature["kind"]}" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
        else:
            lo,hi,ylo,yhi=plan['viewport']
            for pole in features.get('poles',[]):
                pole_x=float(Fraction(pole['x']));a,b=vp.screen((pole_x,ylo)),vp.screen((pole_x,yhi))
                curves.append(f'<line id="trig-{pole["id"]}" data-role="trig-pole" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
            ref=features['referencePoint'];at=vp.screen((float(Fraction(ref['x'])),float(Fraction(ref['y']))))
            curves.append(f'<circle id="trig-reference-point" data-role="trig-reference" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_INTERVAL_OVERVIEW_v1':
        features=plan.get('trigIntervalFeatures');interval=plan.get('intervalFeatures');interval_policy=plan.get('intervalFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='TRIGONOMETRIC_INTERVAL_FEATURES_v1' or not isinstance(interval,dict) or not isinstance(interval_policy,dict):raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        xmin,xmax,ymin,ymax=plan['viewport']
        for row in features['lines']:
            slope,intercept=float(Fraction(row['slope'])),float(Fraction(row['intercept']))
            if row['kind']=='HORIZONTAL':a,b=vp.screen((xmin,intercept)),vp.screen((xmax,intercept))
            else:
                ends=sorted([(ymin-intercept)/slope,(ymax-intercept)/slope]);left,right=max(xmin,ends[0]),min(xmax,ends[1])
                if not left<right:raise ValueError('TRIG_LINE_OUTSIDE_VIEW:'+row['id'])
                a,b=vp.screen((left,slope*left+intercept)),vp.screen((right,slope*right+intercept))
            curves.append(f'<line id="line-{row["id"]}" data-role="line" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black"/>')
            for k,point in enumerate(row['intersections'],1):
                cx,cy=vp.screen((point['x'],point['y']))
                curves.append(f'<circle id="intersection-{row["id"]}-{k}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
        for endpoint in interval['endpoints']:
            cx,cy=vp.screen((float(Fraction(endpoint['x'])),float(Fraction(endpoint['y']))))
            curves.append(f'<circle id="interval-endpoint-{endpoint["side"].lower()}" data-role="interval-endpoint" data-state="{endpoint["state"]}" cx="{cx:.12g}" cy="{cy:.12g}" r="{float(interval_policy["markerRadiusIntrinsicPx"]):.12g}" fill="{"#fff" if endpoint["state"]=="OPEN" else "#111"}" stroke="black" stroke-width="1"/>')
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_INTERVAL_OVERVIEW_v2':
        features=plan.get('trigIntervalFeatures');interval=plan.get('intervalFeatures');interval_policy=plan.get('intervalFeaturePolicy');policy=plan.get('trigIntervalPolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='TRIGONOMETRIC_INTERVAL_FEATURES_v2' or not isinstance(interval,dict) or not isinstance(interval_policy,dict):raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        factor=math.pi if features.get('axisUnit')=='PI' else 1.0;radius=float(policy['markerRadiusIntrinsicPx'])
        xmin,xmax,ymin,ymax=plan['viewport']
        for row in features['lines']:
            slope,intercept=float(Fraction(row['slope'])),float(Fraction(row['intercept']))
            if row['kind']=='HORIZONTAL':a,b=vp.screen((xmin,intercept)),vp.screen((xmax,intercept))
            else:
                ends=sorted([(ymin-intercept)/slope,(ymax-intercept)/slope]);left,right=max(xmin,ends[0]),min(xmax,ends[1])
                if not left<right:raise ValueError('TRIG_LINE_OUTSIDE_VIEW:'+row['id'])
                a,b=vp.screen((left,slope*left+intercept)),vp.screen((right,slope*right+intercept))
            curves.append(f'<line id="line-{row["id"]}" data-role="line" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black"/>')
            for k,point in enumerate(row['intersections'],1):
                cx,cy=vp.screen((point['x'],point['y']))
                curves.append(f'<circle id="intersection-{row["id"]}-{k}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
        for row in features.get('keyPoints',[]):
            at=vp.screen((float(Fraction(row['x']))*factor,float(Fraction(row['y']))))
            curves.append(f'<circle id="trig-{row["id"]}" data-role="trig-key-point" data-feature-kind="{row["kind"]}" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
        lo,hi,ylo,yhi=plan['viewport']
        for pole in features.get('poles',[]):
            pole_x=float(Fraction(pole['x']))*factor;a,b=vp.screen((pole_x,ylo)),vp.screen((pole_x,yhi))
            curves.append(f'<line id="trig-{pole["id"]}" data-role="trig-pole" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
        for endpoint in interval['endpoints']:
            cx,cy=vp.screen((float(Fraction(endpoint['x'])),float(Fraction(endpoint['y']))))
            curves.append(f'<circle id="interval-endpoint-{endpoint["side"].lower()}" data-role="interval-endpoint" data-state="{endpoint["state"]}" cx="{cx:.12g}" cy="{cy:.12g}" r="{float(interval_policy["markerRadiusIntrinsicPx"]):.12g}" fill="{"#fff" if endpoint["state"]=="OPEN" else "#111"}" stroke="black" stroke-width="1"/>')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{vp.width:.12g}" height="{vp.height:.12g}" viewBox="0 0 {vp.width:.12g} {vp.height:.12g}">'+''.join(curves)+'</svg>'
    return {'svg':svg,'sampling':result,'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

def _produce_exp_log_pair(plan,vp):
    """Two exp/log curves in one plane (optionally with the identity line y=x), each tagged with its curve id so the observer can bind every
    polyline, asymptote/boundary and reference marker to the exact curve it belongs to."""
    features=plan.get('expLogPairFeatures');policy=plan.get('expLogPairPolicy')
    if not isinstance(features,dict) or features.get('schemaVersion')!='EXP_LOG_PAIR_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('EXP_LOG_PAIR_FEATURE_INVENTORY_REQUIRED')
    rows=features.get('curves')
    if not isinstance(rows,list) or len(rows)!=2:raise ValueError('EXP_LOG_PAIR_FEATURE_INVENTORY_REQUIRED')
    parts=[];samplings=[]
    for row in rows:
        result=sample(_exp_log_base_expression(row),row['domain'],vp,critical_x=[float(Fraction(row['referencePoint']['x']))])
        samplings.append({'id':'curve-'+row['id'],**{key:value for key,value in result.items() if key!='branches'}})
        for index,branch in enumerate(result['branches']):
            points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in branch)
            parts.append(f'<polyline id="curve-{row["id"]}-{index}" data-role="curve" data-branch="REF_{row["id"]}" points="{points}" fill="none" stroke="black"/>')
        reference=row['referencePoint'];cx,cy=vp.screen((float(Fraction(reference['x'])),float(Fraction(reference['y']))));radius=float(policy['referenceMarkerRadiusIntrinsicPx'])
        if row['family']=='exponential-affine':
            asymptote=float(Fraction(row['horizontalAsymptote']['y']));a,b=vp.screen((plan['viewport'][0],asymptote)),vp.screen((plan['viewport'][1],asymptote))
            parts.append(f'<line id="asymptote-{row["id"]}" data-role="exponential-asymptote" data-branch="{row["id"]}" data-axis="horizontal" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
            parts.append(f'<circle id="reference-{row["id"]}" data-role="exponential-reference" data-branch="{row["id"]}" data-state="CLOSED" cx="{cx:.12g}" cy="{cy:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
        else:
            boundary=float(Fraction(row['naturalDomainBoundaryX']));a,b=vp.screen((boundary,plan['viewport'][2])),vp.screen((boundary,plan['viewport'][3]))
            parts.append(f'<line id="boundary-{row["id"]}" data-role="logarithmic-domain-boundary" data-branch="{row["id"]}" data-axis="vertical" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="5 4"/>')
            parts.append(f'<circle id="reference-{row["id"]}" data-role="logarithmic-reference" data-branch="{row["id"]}" data-state="CLOSED" cx="{cx:.12g}" cy="{cy:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
    if features.get('identityLine'):
        xmin,xmax,ymin,ymax=plan['viewport'];lo=max(xmin,ymin);hi=min(xmax,ymax)
        if not lo<hi:raise ValueError('EXP_LOG_PAIR_IDENTITY_OUTSIDE_VIEWPORT')
        a,b=vp.screen((lo,lo)),vp.screen((hi,hi))
        parts.append(f'<line id="identity-line" data-role="auxiliary" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black" stroke-dasharray="4 3"/>')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{vp.width:.12g}" height="{vp.height:.12g}" viewBox="0 0 {vp.width:.12g} {vp.height:.12g}">'+''.join(parts)+'</svg>'
    return {'svg':svg,'sampling':{'branches':samplings,'branchCount':len(samplings),'status':'PASS' if all(row['status']=='PASS' for row in samplings) else 'POLISH_REQUIRED'},'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

def _produce_piecewise_affine(plan,vp):
    from fractions import Fraction
    from xml.sax.saxutils import escape
    features=plan.get('piecewiseFeatures');policy=plan.get('piecewiseFeaturePolicy');spec=plan.get('piecewise')
    if not isinstance(features,dict) or features.get('schemaVersion')!='PIECEWISE_AFFINE_FEATURES_v1' or not isinstance(policy,dict) or not isinstance(spec,dict):raise ValueError('PIECEWISE_FEATURE_INVENTORY_REQUIRED')
    domain=plan.get('domain');source=features.get('sourceInterval');breakpoint=features.get('breakpoint')
    if not isinstance(domain,list) or len(domain)!=2 or not isinstance(source,dict) or not isinstance(breakpoint,dict):raise ValueError('PIECEWISE_SOURCE_INTERVAL_REQUIRED')
    lo,hi=Fraction(source['lo']),Fraction(source['hi'])
    br=Fraction(breakpoint['x'])
    if domain!=[float(lo),float(hi)] or not lo<br<hi:raise ValueError('PIECEWISE_PRODUCER_DOMAIN_MISMATCH')
    vp_model=vp.model()
    pieces=[];sampling=[]
    for side,left,right,coeff in [('left',float(lo),float(br),spec['left']),('right',float(br),float(hi),spec['right'])]:
        slope,intercept=coeff
        expr=f'({slope})*x+({intercept})'
        result=sample(expr,[left,right],vp)
        sampling.append({'id':'curve-'+side,**{key:value for key,value in result.items() if key!='branches'}})
        if len(result['branches'])!=1:raise ValueError('PIECEWISE_BRANCH_SAMPLING_FAILED')
        points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in result['branches'][0])
        pieces.append(f'<polyline id="curve-{side}" data-role="curve" data-branch="{side.upper()}" points="{points}" fill="none" stroke="black"/>')
    for marker in features.get('markers',[]):
        if not isinstance(marker,dict) or marker.get('state') not in {'OPEN','CLOSED'}:raise ValueError('INVALID_PIECEWISE_MARKER')
        x_value,y_value=float(Fraction(marker['x'])),float(Fraction(marker['y']))
        cx,cy=vp.screen((x_value,y_value));fill='white' if marker['state']=='OPEN' else 'black'
        role='piecewise-source-endpoint' if marker['kind']=='SOURCE_ENDPOINT' else 'piecewise-breakpoint'
        pieces.append(f'<circle id="piecewise-{escape(marker["id"])}" data-role="{role}" data-state="{marker["state"]}" data-owner="{marker["owner"]}" cx="{cx:.12g}" cy="{cy:.12g}" r="{policy["markerRadiusIntrinsicPx"]:.12g}" fill="{fill}" stroke="black" stroke-width="1"/>')
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">'+''.join(pieces)+'</svg>'
    return {'svg':svg,'sampling':{'branches':sampling,'branchCount':2,'status':'PASS'},'transform':{**{key:value for key,value in vp_model.items() if key!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

def _polynomial_text(coefficients):
    return '('+'+'.join('('+value+')*x^'+str(index) for index,value in enumerate(coefficients))+')'

def _region_boundary_points(rows,vp):
    from graph_framing import pp_exact_float
    points=[]
    for row in rows:
        domain=[pp_exact_float(row['interval'][0]),pp_exact_float(row['interval'][1])]
        result=sample(_polynomial_text(row['coefficients']),domain,vp,critical_x=[])
        if len(result['branches'])!=1 or not result['branches'][0]:raise ValueError('GRAPH_REGION_BOUNDARY_SAMPLING_FAILED')
        pts=[vp.screen(value) for value in result['branches'][0]]
        if points and pts and abs(points[-1][0]-pts[0][0])<=1e-9:pts=pts[1:]
        points.extend(pts)
    return points

def _region_parts(features,vp):
    """The model-stage drawing of graphPlan.regions: one even-odd fill path and its plain label, with the same ids the final figure uses. The
    independent observer re-reads both the model SVG and the composed final SVG through the same code path."""
    import html
    fills=[];labels=[]
    for region in features.get('regions',[]):
        upper=_region_boundary_points(region['upperRows'],vp);lower=_region_boundary_points(region['lowerRows'],vp)
        if len(upper)<2 or len(lower)<2:raise ValueError('GRAPH_REGION_BOUNDARY_SAMPLING_FAILED')
        polygon=upper+list(reversed(lower))
        path='M'+','.join(svg_number(value) for value in polygon[0])+' '+' '.join('L'+','.join(svg_number(value) for value in point) for point in polygon[1:])+' Z'
        fill={'LIGHT':'#e4e7ec','MEDIUM':'#c7ccd5'}[region.get('fill','LIGHT')]
        fills.append(f'<path id="region-{region["id"]}" data-role="region" data-mark="graph-region" data-mark-id="{region["id"]}" fill="{fill}" fill-rule="evenodd" stroke="none" d="{path}"/>')
        if region.get('label') is not None:
            # A point inside the band: halfway between the two boundaries at the middle x (never a centroid that a concave band could leave).
            mid=(min(point[0] for point in polygon)+max(point[0] for point in polygon))/2
            upper_at=min(upper,key=lambda point:abs(point[0]-mid));lower_at=min(lower,key=lambda point:abs(point[0]-mid))
            cx,cy=(upper_at[0]+lower_at[0])/2,(upper_at[1]+lower_at[1])/2
            labels.append(f'<text id="region-{region["id"]}-label" x="{cx:.12g}" y="{cy:.12g}" text-anchor="middle" font-size="12">{html.escape(region["label"])}</text>')
    return fills,labels

def _produce_multi_curve(plan,vp):
    """Three to six independent quadratic arcs, each drawn only on its own branch interval, with the data-branch ids the
    final composed figure uses (CURVE_<id> for y=f(x), CURVE_<id>_POS/_NEG for the two branches of x=g(y))."""
    from graph_framing import pp_exact_float
    from xml.sax.saxutils import escape
    features=plan.get('multiCurveFeatures')
    if not isinstance(features,dict) or features.get('schemaVersion')!='MULTI_CURVE_FEATURES_v1' or not isinstance(features.get('curves'),list):raise ValueError('MULTI_CURVE_FEATURE_INVENTORY_REQUIRED')
    parts=[];sampling=[]
    for curve in features['curves']:
        ident=curve.get('id')
        if curve.get('kind')=='Y_OF_X':
            intervals=curve.get('branches') or []
            if len(intervals)!=1:raise ValueError('MULTI_CURVE_BRANCH_INVENTORY_REQUIRED:'+str(ident))
            branch=intervals[0];domain=[pp_exact_float(value) for value in branch['xInterval']]
            result=sample(_polynomial_text(curve['coefficients']),domain,vp,critical_x=domain)
            if len(result['branches'])!=1:raise ValueError('MULTI_CURVE_SAMPLING_FAILED:'+str(ident))
            sampling.append({'id':'curve-'+str(ident),**{key:value for key,value in result.items() if key!='branches'}})
            points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in result['branches'][0])
            parts.append(f'<polyline id="curve-{escape(str(ident))}" data-role="curve" data-branch="CURVE_{escape(str(ident))}" points="{points}" fill="none" stroke="black"/>')
            continue
        if curve.get('kind')!='X_OF_Y':raise ValueError('MULTI_CURVE_KIND_INVALID:'+str(ident))
        for branch in curve.get('branches') or []:
            side=branch.get('side')
            if side not in ('POSITIVE','NEGATIVE') or not branch.get('expression'):raise ValueError('MULTI_CURVE_BRANCH_INVENTORY_REQUIRED:'+str(ident))
            domain=[pp_exact_float(value) for value in branch['xInterval']]
            result=sample(branch['expression'],domain,vp,critical_x=domain)
            if len(result['branches'])!=1:raise ValueError('MULTI_CURVE_SAMPLING_FAILED:'+str(ident))
            tag='POS' if side=='POSITIVE' else 'NEG'
            sampling.append({'id':'curve-'+str(ident)+'-'+tag.lower(),**{key:value for key,value in result.items() if key!='branches'}})
            points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in result['branches'][0])
            parts.append(f'<polyline id="curve-{escape(str(ident))}-{tag.lower()}" data-role="curve" data-branch="CURVE_{escape(str(ident))}_{tag}" points="{points}" fill="none" stroke="black"/>')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{vp.width:.12g}" height="{vp.height:.12g}" viewBox="0 0 {vp.width:.12g} {vp.height:.12g}">'+''.join(parts)+'</svg>'
    return {'svg':svg,'sampling':{'branches':sampling,'branchCount':len(sampling),'status':'PASS' if all(row['status']=='PASS' for row in sampling) else 'POLISH_REQUIRED'},'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

def _produce_piecewise_polynomial(plan,vp):
    """The framed pieces (each on its draw interval), the key points, the horizontal lines and their intersection dots, with the ids the
    final figure uses, so the graph observer reads the model and the final SVG the same way."""
    from fractions import Fraction
    from graph_framing import pp_exact_float
    features=plan.get('piecewisePolynomialFeatures')
    if not isinstance(features,dict) or features.get('schemaVersion')!='PIECEWISE_POLYNOMIAL_FEATURES_v1':raise ValueError('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED')
    parts=[];sampling=[]
    region_fills,region_labels=_region_parts(features,vp)
    for index,piece in enumerate(features['pieces'],1):
        result=sample(_polynomial_text(piece['coefficients']),piece['drawInterval'],vp,critical_x=[p['x'] for p in plan.get('requiredPoints',[])]+[point['xValue'] for row in features['intersections'] for point in row['points']])
        if len(result['branches'])!=1:raise ValueError('PIECEWISE_POLY_PIECE_SAMPLING_FAILED')
        sampling.append({'id':'curve-piece-'+str(index),**{key:value for key,value in result.items() if key!='branches'}})
        points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in result['branches'][0])
        parts.append(f'<polyline id="curve-piece-{index}" data-role="curve" data-branch="PIECE_{index}" points="{points}" fill="none" stroke="black"/>')
    # Reference curves (referenceCurves): a quadratic is one polyline tagged REF_<id>; a piecewise curve is one polyline per piece tagged
    # REF_<id> (one piece) or REF_<id>_<n>, each only over its own draw interval.
    critical_curve=[p['x'] for p in plan.get('requiredPoints',[])]+[point['xValue'] for row in features.get('curveIntersections',[]) for point in row['points']]
    for curve in features.get('referenceCurves',[]):
        if 'pieces' in curve:
            rows=[(piece['coefficients'],piece['drawInterval'],'REF_'+curve['id'] if len(curve['pieces'])==1 else 'REF_'+curve['id']+'_'+str(index)) for index,piece in enumerate(curve['pieces'],1)]
            extra=[pp_exact_float(row['x']) for row in curve.get('corners',[])+curve.get('extrema',[])]
            source=curve.get('sourceInterval')
            if source:extra.extend([pp_exact_float(source['lo']),pp_exact_float(source['hi'])])
        else:
            rows=[(curve['coefficients'],curve['drawInterval'],'REF_'+curve['id'])];extra=[]
        for coefficients,draw_interval,branch in rows:
            critical=[value for value in critical_curve+extra if draw_interval[0]<=value<=draw_interval[1]]
            result=sample(_polynomial_text(coefficients),draw_interval,vp,critical_x=critical)
            if len(result['branches'])!=1:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SAMPLING_FAILED')
            sampling.append({'id':'curve-ref-'+branch.split('_',1)[1],**{key:value for key,value in result.items() if key!='branches'}})
            points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in result['branches'][0])
            parts.append(f'<polyline id="curve-ref-{branch[4:]}" data-role="curve" data-branch="{branch}" points="{points}" fill="none" stroke="black"/>')
        source=curve.get('sourceInterval')
        if source:
            for side,state,x_text,y_text in [('start',source['startState'],source['lo'],source['startY']),('end',source['endState'],source['hi'],source['endY'])]:
                cx,cy=vp.screen((pp_exact_float(x_text),pp_exact_float(y_text)))
                fill='white' if state=='OPEN' else 'black'
                parts.append(f'<circle id="ref-endpoint-{curve["id"]}-{side}" data-role="reference-endpoint" data-state="{state}" cx="{cx:.12g}" cy="{cy:.12g}" r="4" fill="{fill}" stroke="black" stroke-width="1"/>')
    for row in features.get('curveIntersections',[]):
        for k,point in enumerate(row['points'],1):
            if point.get('keyPoint'):continue
            cx,cy=vp.screen((point['xValue'],point['yValue']))
            parts.append(f'<circle id="intersection-{row["curveId"]}-{k}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
    xmin,xmax=plan['viewport'][0],plan['viewport'][1]
    ymin,ymax=plan['viewport'][2],plan['viewport'][3]
    for row in features['intersections']:
        if 'slope' in row:
            # A slanted line y=m*x+c is drawn where it is inside the viewport (clipped on x and on y).
            m,c=pp_exact_float(row['slope']),pp_exact_float(row['intercept']);ends=sorted([(ymin-c)/m,(ymax-c)/m]);left,right=max(xmin,ends[0]),min(xmax,ends[1])
            if not left<right:raise ValueError('PIECEWISE_POLY_SLANTED_LINE_OUTSIDE_VIEW')
            a,b=vp.screen((left,m*left+c)),vp.screen((right,m*right+c))
        else:
            level=pp_exact_float(row['y']);a,b=vp.screen((xmin,level)),vp.screen((xmax,level))
        parts.append(f'<line id="line-{row["lineId"]}" data-role="line" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black"/>')
        for k,point in enumerate(row['points'],1):
            if point.get('keyPoint'):continue
            cx,cy=vp.screen((point['xValue'],point['yValue'] if 'slope' in row else level))
            parts.append(f'<circle id="intersection-{row["lineId"]}-{k}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
    for index,point in enumerate(plan.get('requiredPoints',[]),1):
        cx,cy=vp.screen((point['x'],point['y']))
        parts.append(f'<circle id="required-point-{index}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
    interval=plan.get('intervalFeatures')
    if interval is not None:
        for endpoint in interval['endpoints']:
            cx,cy=vp.screen((pp_exact_float(endpoint['x']),pp_exact_float(endpoint['y'])))
            parts.append(f'<circle id="interval-endpoint-{endpoint["side"].lower()}" data-role="interval-endpoint" data-state="{endpoint["state"]}" cx="{cx:.12g}" cy="{cy:.12g}" r="4" fill="{"#fff" if endpoint["state"]=="OPEN" else "#111"}" stroke="black" stroke-width="1"/>')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{vp.width:.12g}" height="{vp.height:.12g}" viewBox="0 0 {vp.width:.12g} {vp.height:.12g}">'+''.join(region_fills+parts+region_labels)+'</svg>'
    return {'svg':svg,'sampling':{'branches':sampling,'branchCount':len(sampling),'status':'PASS' if all(row['status']=='PASS' for row in sampling) else 'POLISH_REQUIRED'},'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

def _produce_piecewise_discontinuous(plan,vp):
    """Each discontinuous piece on its own draw interval (so a jump is never bridged by a connecting segment), the endpoint/value dots
    (filled CLOSED, hollow OPEN), the reference lines and their crossing dots, and the key points - with the ids the final figure uses."""
    from graph_framing import pp_exact_float
    features=plan.get('piecewiseDiscontinuousFeatures')
    if not isinstance(features,dict) or features.get('schemaVersion')!='PIECEWISE_DISCONTINUOUS_FEATURES_v1':raise ValueError('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED')
    required_x=[p['x'] for p in plan.get('requiredPoints',[])]
    cross_x=[point['xValue'] for row in features.get('intersections',[]) for point in row['points']]
    parts=[];sampling=[]
    for index,piece in enumerate(features['pieces'],1):
        critical=[value for value in required_x+cross_x if piece['drawInterval'][0]<=value<=piece['drawInterval'][1]]
        result=sample(_polynomial_text(piece['coefficients']),piece['drawInterval'],vp,critical_x=critical)
        if len(result['branches'])!=1:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_SAMPLING_FAILED')
        sampling.append({'id':'curve-piece-'+str(index),**{key:value for key,value in result.items() if key!='branches'}})
        points=' '.join(','.join(svg_number(value) for value in vp.screen(point)) for point in result['branches'][0])
        parts.append(f'<polyline id="curve-piece-{index}" data-role="curve" data-branch="PIECE_{index}" points="{points}" fill="none" stroke="black"/>')
    xmin,xmax=plan['viewport'][0],plan['viewport'][1]
    for row in features.get('intersections',[]):
        level=pp_exact_float(row['y']);a,b=vp.screen((xmin,level)),vp.screen((xmax,level))
        parts.append(f'<line id="line-{row["lineId"]}" data-role="line" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black"/>')
        for k,point in enumerate(row['points'],1):
            if point.get('keyPoint') or point.get('marker'):continue
            cx,cy=vp.screen((point['xValue'],level))
            parts.append(f'<circle id="intersection-{row["lineId"]}-{k}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
    for marker in features.get('markers',[]):
        cx,cy=vp.screen((pp_exact_float(marker['x']),pp_exact_float(marker['y'])))
        fill='#fff' if marker['state']=='OPEN' else '#111'
        parts.append(f'<circle id="discontinuous-{marker["id"]}" data-role="discontinuous-endpoint" data-state="{marker["state"]}" cx="{cx:.12g}" cy="{cy:.12g}" r="4" fill="{fill}" stroke="black" stroke-width="1"/>')
    for index,point in enumerate(plan.get('requiredPoints',[]),1):
        cx,cy=vp.screen((point['x'],point['y']))
        parts.append(f'<circle id="required-point-{index}" data-role="point" cx="{cx:.12g}" cy="{cy:.12g}" r="3.2" fill="#111" stroke="black"/>')
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="{vp.width:.12g}" height="{vp.height:.12g}" viewBox="0 0 {vp.width:.12g} {vp.height:.12g}">'+''.join(parts)+'</svg>'
    return {'svg':svg,'sampling':{'branches':sampling,'branchCount':len(sampling),'status':'PASS' if all(row['status']=='PASS' for row in sampling) else 'POLISH_REQUIRED'},'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

# ---------------------------------------------------------------------------
# Graph overlays (G1): the model SVG carries the same overlay ids and shapes the final figure does (the observed model is read back by the
# same independent observer), so every overlay line, vertical line, segment, guide, polygon and extra point is checked before and after
# composition. The labels are composed by the final spec, not here.
def _overlay_model_svg(plan,transform):
    features=plan.get('overlaysFeatures')
    if not isinstance(features,dict) or features.get('schemaVersion')!='GRAPH_OVERLAYS_FEATURES_v1':return ''
    ox,oy,sx,sy=[transform[key] for key in ('originX','originY','sx','sy')]
    xmin,xmax,ymin,ymax=plan['viewport']
    screen=lambda x,y:(ox+x*sx,oy-y*sy)
    parts=[]
    def clip_line(kind):
        if kind['kind']=='VERTICAL':
            x=float(kind['xValue'])
            if not xmin<x<xmax:raise ValueError('OVERLAY_LINE_OUTSIDE_VIEWPORT:'+kind['id'])
            return (x,ymin),(x,ymax)
        m=float(kind['slopeValue']);q=float(kind['interceptValue']);ends=[]
        for x in (xmin,xmax):
            y=m*x+q
            if ymin-1e-9<=y<=ymax+1e-9:ends.append((x,max(ymin,min(ymax,y))))
        for y in (ymin,ymax):
            if m!=0:
                x=(y-q)/m
                if xmin-1e-9<=x<=xmax+1e-9 and not any(abs(x-a)<1e-9 and abs(y-b)<1e-9 for a,b in ends):ends.append((max(xmin,min(xmax,x)),y))
        if len(ends)<2:raise ValueError('OVERLAY_LINE_OUTSIDE_VIEWPORT:'+kind['id'])
        return ends[0],ends[1]
    for line in features['lines']:
        a,b=clip_line(line);p,q=screen(*a),screen(*b)
        parts.append(f'<line id="overlay-line-{line["id"]}" data-role="overlayLine" x1="{p[0]:.12g}" y1="{p[1]:.12g}" x2="{q[0]:.12g}" y2="{q[1]:.12g}" stroke="black"/>')
    points={point['id']:point for point in features['points']}
    def at(ident):
        point=points.get(ident)
        if point is None:raise ValueError('OVERLAY_POINT_UNKNOWN:'+str(ident))
        return screen(point['x'],point['y'])
    for segment in features['segments']:
        a,b=at(segment['from']),at(segment['to'])
        dash=' stroke-dasharray="6 4"' if segment['dashed'] else ''
        parts.append(f'<line id="overlay-segment-{segment["id"]}" data-role="overlaySegment" x1="{a[0]:.12g}" y1="{a[1]:.12g}" x2="{b[0]:.12g}" y2="{b[1]:.12g}" stroke="black"{dash}/>')
    for guide in features['guides']:
        point=points[guide['from']];origin=screen(point['x'],point['y']);axis=guide['axis'];dash=' stroke-dasharray="6 4"' if guide['dashed'] else ''
        if axis in ('x','BOTH'):
            end=screen(point['x'],0.0);parts.append(f'<line id="overlay-guide-{guide["id"]}-x" data-role="overlayGuide" x1="{origin[0]:.12g}" y1="{origin[1]:.12g}" x2="{end[0]:.12g}" y2="{end[1]:.12g}" stroke="black"{dash}/>')
        if axis in ('y','BOTH'):
            end=screen(0.0,point['y']);parts.append(f'<line id="overlay-guide-{guide["id"]}-y" data-role="overlayGuide" x1="{origin[0]:.12g}" y1="{origin[1]:.12g}" x2="{end[0]:.12g}" y2="{end[1]:.12g}" stroke="black"{dash}/>')
    for polygon in features['polygons']:
        vertices=[at(ident) for ident in polygon['points']]
        outline=' '.join(f'{x:.12g},{y:.12g}' for x,y in vertices)
        if polygon['fill']!='NONE':
            parts.append(f'<polygon id="overlay-polygon-{polygon["id"]}-fill" data-role="region" points="{outline}" fill="#eef2f7" stroke="none"/>')
        parts.append(f'<polyline id="overlay-polygon-{polygon["id"]}" data-role="overlayPolygon" points="{outline} {vertices[0][0]:.12g},{vertices[0][1]:.12g}" fill="none" stroke="black"/>')
    for point in features['points']:
        x,y=screen(point['x'],point['y'])
        parts.append(f'<circle id="{point["id"]}" data-role="point" data-overlay="true" cx="{x:.12g}" cy="{y:.12g}" r="3.2" fill="#111" stroke="black"/>')
    lattice=features.get('latticePoints')
    if lattice:
        token=lambda value:'n'+str(-value) if value<0 else str(value)
        for dot in lattice['points']:
            x,y=screen(dot['x'],dot['y'])
            parts.append(f'<circle id="overlay-lattice-x{token(dot["x"])}y{token(dot["y"])}" data-role="point" data-overlay="true" cx="{x:.12g}" cy="{y:.12g}" r="2.4" fill="#111" stroke="black"/>')
    return ''.join(parts)

def produce(plan):
    result=_produce(plan)
    extra=_overlay_model_svg(plan,result['transform'])
    if extra:
        svg=result['svg'];result['svg']=svg[:-len('</svg>')]+extra+'</svg>'
    return result
