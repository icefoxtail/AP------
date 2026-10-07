"""Adapter reusing the legacy sampler; observer remains a separate module."""
import sys
import math
from fractions import Fraction
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.function_sampling import sample
from visual_engine.viewport import Viewport

def expression(plan):
    def poly(values):
        return '('+'+'.join('('+v+')*x^'+str(i) for i,v in enumerate(values))+')'
    if plan['family']=='polynomial':return poly(plan['coefficients'])
    if plan['family']=='rational':return poly(plan['numerator'])+'/'+poly(plan['denominator'])
    if plan['family']=='sqrt-affine':return 'sqrt('+poly(plan['radicand'])+')'
    if plan['family']=='absolute-value':
        b,a,scale,offset=plan['coefficients']
        return '(('+scale+')*abs(('+a+')*x+('+b+'))+('+offset+'))'
    if plan['family']=='exponential-affine':
        a,k,c=plan['coefficients'];return f'({a})*exp(({k})*x)+({c})'
    if plan['family']=='logarithmic-affine':
        a,k,b,c=plan['coefficients'];return f'({a})*log(({k})*x+({b}))+({c})'
    if plan['family']=='trigonometric':
        a,k,c=plan['coefficients'];fn=plan['function'].lower();return f'({a})*{fn}(({k})*x+({plan["phasePi"]})*pi)+({c})'
    raise ValueError('UNSUPPORTED_GRAPH_FAMILY')

def svg_number(value):
    text=f'{value:.9f}'.rstrip('0').rstrip('.')
    return text if text and text!='-0' else '0'

def produce(plan):
    vp=Viewport(*plan['viewport'],width=420,height=280,panel=0,margin=32,equal=False)
    if plan.get('family')=='piecewise-affine':return _produce_piecewise_affine(plan,vp)
    critical=[p['x'] for p in plan.get('requiredPoints',[])]+[feature['x'] for feature in plan.get('overviewFeatures',[]) if feature.get('kind')!='TAIL_DIRECTION']
    if plan['family']=='sqrt-affine':
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
    if plan['family']=='logarithmic-affine' and plan.get('overviewPolicy')=='LOGARITHMIC_AFFINE_OVERVIEW_v1':critical.append(float(Fraction(plan['logarithmicFeatures']['referencePoint']['x'])))
    if plan['family']=='trigonometric' and plan.get('overviewPolicy')=='TRIGONOMETRIC_PERIODIC_OVERVIEW_v1':
        features=plan.get('trigFeatures',{})
        if plan.get('function') in {'SIN','COS'}:critical.extend(float(Fraction(row['xPiMultiple']))*math.pi for row in features.get('phasePoints',[]))
        elif features.get('referencePoint'):critical.append(float(Fraction(features['referencePoint']['xPiMultiple']))*math.pi)
    result=sample(expression(plan),plan['domain'],vp,critical_x=critical)
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
    if plan['family']=='sqrt-affine' and plan.get('overviewPolicy')=='SQRT_AFFINE_ENDPOINT_OVERVIEW_v1':
        features=plan.get('sqrtFeatures');policy=plan.get('sqrtFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='SQRT_AFFINE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('SQRT_ENDPOINT_INVENTORY_REQUIRED')
        radius=float(policy['endpointMarkerRadiusIntrinsicPx'])
        for index,endpoint in enumerate(features.get('sourceEndpoints',[])):
            if endpoint.get('state')!='CLOSED':raise ValueError('UNSUPPORTED_OPEN_SQRT_SOURCE_ENDPOINT')
            at=vp.screen((float(Fraction(endpoint['x'])),float(endpoint['y'])))
            curves.append(f'<circle id="sqrt-domain-endpoint-{index}" data-role="domain-endpoint" data-endpoint-state="CLOSED" cx="{at[0]:.12g}" cy="{at[1]:.12g}" r="{radius:.12g}" fill="black" stroke="black" stroke-width="1"/>')
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
    if plan['family']=='logarithmic-affine' and plan.get('overviewPolicy')=='LOGARITHMIC_AFFINE_OVERVIEW_v1':
        features=plan.get('logarithmicFeatures');policy=plan.get('logarithmicFeaturePolicy')
        if not isinstance(features,dict) or features.get('schemaVersion')!='LOGARITHMIC_AFFINE_FEATURES_v1' or not isinstance(policy,dict):raise ValueError('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED')
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
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">'+''.join(curves)+'</svg>'
    return {'svg':svg,'sampling':result,'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}

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
