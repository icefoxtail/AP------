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
        points=' '.join(','.join(f'{v:.12g}' for v in vp.screen(p)) for p in branch)
        curves.append(f'<polyline id="curve-{i}" data-role="curve" points="{points}" fill="none" stroke="black"/>')
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">'+''.join(curves)+'</svg>'
    return {'svg':svg,'sampling':result,'transform':{**{k:v for k,v in vp.model().items() if k!='aspectPolicy'},'displayScale':plan.get('displayScale',1)}}
