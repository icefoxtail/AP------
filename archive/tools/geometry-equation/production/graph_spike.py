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
    raise ValueError('UNSUPPORTED_GRAPH_FAMILY')

def svg_number(value):
    text=f'{value:.9f}'.rstrip('0').rstrip('.')
    return text if text and text!='-0' else '0'

def produce(plan):
    vp=Viewport(*plan['viewport'],width=420,height=280,panel=0,margin=32,equal=False)
    critical=[p['x'] for p in plan.get('requiredPoints',[])]+[feature['x'] for feature in plan.get('overviewFeatures',[]) if feature.get('kind')!='TAIL_DIRECTION']
    if plan['family']=='sqrt-affine':
        b,a=[float(Fraction(v)) for v in plan['radicand']]
        if a<=0:raise ValueError('UNSUPPORTED_SQRT_RADICAND')
        boundary=-b/a
        # sqrt's boundary secant gap is sqrt(a*dx)/4; reserve margin below .35px.
        step=(1.2/(vp.sy*math.sqrt(a)))**2
        if plan['domain'][0]<=boundary<plan['domain'][1]:critical.append(boundary+step)
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
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">'+''.join(curves)+'</svg>'
    return {'svg':svg,'sampling':result,'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}
