"""Bounded overview fitting. Display windows do not change source domains."""
import math
import re
import sys
from fractions import Fraction
from pathlib import Path
import sympy as S

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.palette import PALETTE_NAMES as OVERLAY_COLOR_NAMES   # (G12-2) the colour-group names of the plane figures (BLUE WARM GREEN ROSE VIOLET)
_x=S.Symbol('x',real=True)

class HintedValueError(ValueError):
    """A refusal that also carries machine-readable repair data for the author's result file. str(error) is the unchanged code (tests and
    callers match on it); worker.py sends hint_data beside the code as result.hintData, and render-plan.mjs turns it into result.fix.
    hint_data holds only values the engine computed itself (exact point coordinates, intervals), never a free text."""
    def __init__(self,message,hint_data=None):
        super().__init__(message)
        self.hint_data=hint_data
# A repeated real root of a cubic/quartic is a root of gcd(p,p'), a degree<=2 factor of rational coefficients: it is either rational or
# p+q*sqrt(r). The isolating interval pins its location; a width beyond this bound means the location is not representable.
REPEATED_ROOT_MAX_ISOLATION_WIDTH=S.Rational(1,10**9)

def _real_root_rows(poly):
    if poly.is_zero:return []
    return [((a+b)/2,int(multiplicity)) for (a,b),multiplicity in poly.intervals(eps=S.Rational(1,10**13))]


def _quadratic_field_root_rows(poly):
    """Exact real roots when a polynomial splits into linear factors over its coefficient field."""
    if poly.is_zero:return []
    rows=[]
    try:factors=poly.factor_list()[1]
    except (NotImplementedError,ValueError,TypeError):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_FACTORISATION') from None
    if not factors or any(factor.degree()!=1 for factor,_ in factors):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_FACTORISATION')
    for factor,multiplicity in factors:
        leading=factor.nth(1)
        if leading==0:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_FACTORISATION')
        root=S.cancel(-factor.nth(0)/leading)
        if root.is_real is not True:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_FACTORISATION')
        rows.append((root,int(multiplicity)))
    return sorted(rows,key=lambda row:float(row[0]))


def _quadratic_field_coefficients(values):
    """Parse exact coefficients in one square-free Q(sqrt(r)); never approximate or mix fields."""
    if not isinstance(values,list) or not values or any(not isinstance(value,str) or len(value)>64 for value in values):raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    radicands={int(value) for text in values for value in re.findall(r'sqrt\((\d+)\)',text)}
    if len(radicands)!=1:raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    radicand=next(iter(radicands))
    if radicand<=1 or any(power!=1 for power in S.factorint(radicand).values()):raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    radical=S.sqrt(radicand);field=S.QQ.algebraic_field(radical)
    try:
        coefficients=[pp_exact_value(text) for text in values]
        for coefficient in coefficients:field.from_sympy(coefficient)
    except (ValueError,TypeError,NotImplementedError):raise ValueError('INVALID_FRAMING_COEFFICIENTS') from None
    return radical,coefficients


def _fit_cubic_quartic(plan,coefficients,radical=None):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:
        raise ValueError('CUBIC_QUARTIC_REQUIRES_ALL_REALS_SOURCE_DOMAIN')
    original_domain=plan.get('domain')
    original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or not all(isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v) for v in original_domain) or not original_domain[0]<original_domain[1]:
        raise ValueError('INVALID_CUBIC_QUARTIC_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or not all(isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v) for v in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:
        raise ValueError('INVALID_CUBIC_QUARTIC_VIEWPORT')
    expression=sum(S.sympify(c)*_x**i for i,c in enumerate(coefficients))
    polynomial=S.Poly(expression,_x,**({'extension':radical} if radical is not None else {}))
    degree=polynomial.degree()
    if degree not in (3,4):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_DEGREE')
    algebraic=radical is not None
    root_intervals=[] if algebraic or polynomial.is_zero else list(polynomial.intervals(eps=S.Rational(1,10**13)))
    roots=_quadratic_field_root_rows(polynomial) if algebraic else [((a+b)/2,int(multiplicity)) for (a,b),multiplicity in root_intervals]
    # Repeated real roots are exact: even multiplicity touches the x-axis (a local extremum on the axis), odd multiplicity crosses with a
    # flattening. A repeated root of degree<=4 is a root of a rational quadratic factor, so its isolating interval is tight; a wider interval
    # would mean the touch point is not representable and the graph is refused instead of drawn at a guessed location.
    for (left,right),multiplicity in root_intervals:
        if multiplicity>=2 and right-left>REPEATED_ROOT_MAX_ISOLATION_WIDTH:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_REPEATED_ROOT_IMPRECISE')
    critical=_quadratic_field_root_rows(polynomial.diff()) if algebraic else _real_root_rows(polynomial.diff())
    inflection_rows=_quadratic_field_root_rows(polynomial.diff().diff()) if algebraic else _real_root_rows(polynomial.diff().diff())
    inflections=[row for row in inflection_rows if row[1]%2==1]
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
    anchor_points=plan.get('overlayAnchors',[])
    coordinates=[0.0,*feature_x,*required_x,*[x for x,_ in anchor_points]]
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
    # Keep the coordinate origin in frame. Quartic roots/critical points can
    # sit close to one tail boundary (for example x^4-x has its right root at
    # x=1); reserve common display-only room beyond the outer feature so unit
    # ticks remain distinct from both the frame edge and the curve.
    if degree==4 or anchor_points:
        tail_margin=max(.4,feature_extent*.25)
        lo=min(-radius,min(coordinates)-tail_margin)
        hi=max(radius,max(coordinates)+tail_margin)
    else:
        lo,hi=-radius,radius
    if not all(math.isfinite(v) and abs(v)<=1e6 for v in (lo,hi)):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
    window_policy=plan.get('overviewWindowPolicy')
    if window_policy not in (None,'FEATURE_BAND'):raise ValueError('INVALID_OVERVIEW_WINDOW_POLICY')
    def evaluate(value):
        result=float(polynomial.eval(S.Rational(str(value))))
        if not math.isfinite(result) or abs(result)>1e12:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
        return result
    def display_y_bounds(left,right):
        values=[evaluate(left),evaluate(right),0.0,*[row['y'] for row in math_features],*required_y,*[y for _,y in anchor_points]]
        low,high=min(values),max(values);span=max(1.0,high-low,abs(low),abs(high));padding=.15*span
        return min(0.0,low)-padding,max(0.0,high)+padding
    ymin,ymax=display_y_bounds(lo,hi)
    # An opt-in feature-band window for a source whose whole-curve tails dwarf the compared key values (for
    # example a cubic whose two extrema are 11% of the overview height apart): trim the display x-window to a
    # small margin beyond the outer recorded features instead of the default 20% of the largest feature
    # coordinate. The source domain stays ALL_REALS; the observer floors and the sampling are unchanged. The
    # default window is untouched, so previously reviewed overviews keep their exact bytes.
    if window_policy=='FEATURE_BAND':
        focus=[0.0,*[row['x'] for row in math_features],*required_x,*[x for x,_ in anchor_points]]
        focus_lo,focus_hi=min(focus),max(focus)
        margin=max(.5,.12*(focus_hi-focus_lo))
        lo,hi=focus_lo-margin,focus_hi+margin
        if not all(math.isfinite(v) and abs(v)<=1e6 for v in (lo,hi)):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
        ymin,ymax=display_y_bounds(lo,hi)
    # The final overview audit requires each end arm to travel at least 18% of the plot height away from its outer
    # stationary point. An asymmetric source (for example roots -2, 2, a with a>2) can leave one arm on a boundary only
    # a fraction of a unit past the last critical point, so extend that short side of the display window (never both
    # unconditionally) until the arm clears the audit with a small margin. The audit itself is unchanged.
    critical_rows=[row for row in math_features if any(str(role).startswith('STATIONARY_') for role in row['roles'])] or [row for row in math_features if 'INFLECTION' in row['roles']]
    if critical_rows:
        left_anchor=min(critical_rows,key=lambda row:row['x']);right_anchor=max(critical_rows,key=lambda row:row['x'])
        for _ in range(60):
            total=ymax-ymin;step=max(.15,.05*(hi-lo));changed=False
            if abs(evaluate(lo)-left_anchor['y'])<.182*total:lo-=step;changed=True
            if abs(evaluate(hi)-right_anchor['y'])<.182*total:hi+=step;changed=True
            if not changed:break
            ymin,ymax=display_y_bounds(lo,hi)
    if not all(math.isfinite(v) and abs(v)<=1e6 for v in (lo,hi)):raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_NUMERIC_SCOPE')
    sign=1 if polynomial.LC()>0 else -1
    left_sign=sign if degree%2==0 else -sign
    end_directions={'left':'UP' if left_sign>0 else 'DOWN','right':'UP' if sign>0 else 'DOWN'}
    end_slope_directions={'left':'DOWN' if end_directions['left']=='UP' else 'UP','right':end_directions['right']}
    tail_features=[{'id':'tail-left','kind':'TAIL_DIRECTION','side':'LEFT','endpointX':lo,'direction':end_directions['left'],'slopeDirection':end_slope_directions['left']},{'id':'tail-right','kind':'TAIL_DIRECTION','side':'RIGHT','endpointX':hi,'direction':end_directions['right'],'slopeDirection':end_slope_directions['right']}]
    features=[*math_features,*tail_features]
    feature_policy={'schemaVersion':'POLYNOMIAL_CUBIC_QUARTIC_FEATURE_POLICY_v1','repeatedSourceRootPolicy':'EXACT_MULTIPLICITY','tangencyPolicy':'TOUCHES_AXIS_EVEN_CROSSES_ODD','minimumDistinctFeatureSeparationCssPx':1,'stationaryInflectionPolicy':'MERGE_ROLES_AT_SAME_POINT'}
    fitted={**plan,'domain':[lo,hi],'viewport':[lo,hi,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','overviewFeatures':features,'overviewFeaturePolicy':feature_policy,'overviewEndDirections':end_directions,**({'overviewWindowPolicy':'FEATURE_BAND'} if window_policy else {})}
    if algebraic and 'regions' in plan:
        rows=piecewise_polynomial_regions(plan,[coefficients],[(None,None)],[],{})
        fitted['graphRegionFeatures']={'regions':rows}
    return {'graphPlan':fitted,'policy':'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

# ---- graphPlan.hideLabels / graphPlan.formulaTex of a single rational or square-root curve (G18a) ---------------------------------------------------------
# hideLabels: a list of the automatic texts the figure does not show. 'formula' = the curve's formula text, 'asymptotes' (rational) = the x=p and y=q texts
# (the dashed lines stay), 'start' (square root) = the texts that name its start / end (domain and range inequalities, x=end). A point or a line is never hidden.
# Why: a drawn asymptote value can be the answer of the question, the automatic form (1-2*x)/(x-3) can differ from the form of the solution, and a formula label
# may find no room. formulaTex: the formula label in the author's own form (-\frac{8}{x-1}-4); it must be the same function as the plan, which framing and
# the independent observer both check numerically.
SINGLE_CURVE_HIDEABLE={'rational':('formula','asymptotes'),'sqrt-affine':('formula','start')}

def tex_formula_ascii(text):
    """The ASCII math string (the form the label machinery typesets) of a formula written in simple TeX; ValueError('FORMULA_TEX_INVALID') when it is not one."""
    if not isinstance(text,str) or not text.strip() or len(text)>80:raise ValueError('FORMULA_TEX_INVALID')
    try:value=_mc_label_ascii(text.strip(),'formula')
    except ValueError:raise ValueError('FORMULA_TEX_INVALID') from None
    value=re.sub(r'^(?:y|f\(x\))\s*=\s*','',value)
    if not value or value!=value.strip():raise ValueError('FORMULA_TEX_INVALID')
    return value

def evaluate_formula_text(text,x_value):
    """The value of an ASCII formula (digits, x, + - * / ^, parentheses, sqrt( ), implicit products such as 2x or 3(x-1)) at x, as a float; None where it is undefined.
    Own recursive-descent reader, never eval."""
    tokens=re.findall(r'sqrt|\d+(?:\.\d+)?|x|[-+*/^()]',text.replace(' ',''))
    if ''.join(tokens)!=text.replace(' ',''):raise ValueError('FORMULA_TEX_INVALID')
    position=[0]
    def peek():return tokens[position[0]] if position[0]<len(tokens) else None
    def take():
        token=peek();position[0]+=1;return token
    def starts_factor(token):return token is not None and (token in ('x','sqrt','(') or token[0].isdigit())
    def expression():
        value=term()
        while peek() in ('+','-'):
            sign=take();right=term();value=None if value is None or right is None else (value+right if sign=='+' else value-right)
        return value
    def term():
        value=unary()
        while peek() in ('*','/') or starts_factor(peek()):
            operator=take() if peek() in ('*','/') else '*';right=unary()
            if value is None or right is None:value=None
            elif operator=='*':value=value*right
            else:value=None if right==0 else value/right
        return value
    def unary():
        if peek()=='-':take();value=unary();return None if value is None else -value
        if peek()=='+':take();return unary()
        return power()
    def power():
        base=atom()
        if peek()=='^':
            take();exponent=unary()
            if base is None or exponent is None:return None
            try:return base**exponent
            except (ZeroDivisionError,OverflowError,ValueError):return None
        return base
    def atom():
        token=take()
        if token is None:raise ValueError('FORMULA_TEX_INVALID')
        if token=='x':return x_value
        if token[0].isdigit():return float(token)
        if token=='(':
            value=expression()
            if take()!=')':raise ValueError('FORMULA_TEX_INVALID')
            return value
        if token=='sqrt':
            if take()!='(':raise ValueError('FORMULA_TEX_INVALID')
            value=expression()
            if take()!=')':raise ValueError('FORMULA_TEX_INVALID')
            return None if value is None or value<0 else math.sqrt(value)
        raise ValueError('FORMULA_TEX_INVALID')
    value=expression()
    if position[0]!=len(tokens):raise ValueError('FORMULA_TEX_INVALID')
    return value

def single_curve_function(plan):
    """A float function x -> y (None where undefined) of a rational or square-root plan, from its exact fields."""
    if plan.get('family')=='rational':
        n=[float(Fraction(v)) for v in plan['numerator']];d=[float(Fraction(v)) for v in plan['denominator']]
        return lambda x_value:None if abs(d[0]+d[1]*x_value)<1e-12 else (n[0]+n[1]*x_value)/(d[0]+d[1]*x_value)
    radicand=[pp_exact_float(v) for v in plan['radicand']];amplitude=pp_exact_float(plan.get('amplitude','1'));sign=plan.get('sign',1);offset=pp_exact_float(plan.get('offset','0'))
    return lambda x_value:None if radicand[0]+radicand[1]*x_value<0 else offset+sign*amplitude*math.sqrt(radicand[0]+radicand[1]*x_value)

def formula_text_matches(plan,ascii_text):
    """True when the ASCII formula is the plan's function on a spread of x (at least five points where both are defined, relative error 1e-9)."""
    function=single_curve_function(plan);compared=0
    for step in range(-40,41):
        x_value=step*0.37+0.0123
        want=function(x_value)
        try:got=evaluate_formula_text(ascii_text,x_value)
        except (ValueError,OverflowError,ZeroDivisionError):return False
        if want is None and got is None:continue
        if want is None or got is None or abs(want-got)>1e-9*max(1.0,abs(want)):return False
        compared+=1
    return compared>=5

def _with_label_options(plan,result):
    """hideLabels / formulaTex (G18a) of a rational or square-root plan, validated; the fitted plan carries hideLabels and formulaAscii."""
    hide=plan.get('hideLabels');tex=plan.get('formulaTex')
    if hide is None and tex is None:return result
    family=plan['family'];allowed=SINGLE_CURVE_HIDEABLE[family]
    if hide is not None and (not isinstance(hide,list) or not hide or len(set(hide))!=len(hide) or any(item not in allowed for item in hide)):raise ValueError('HIDE_LABELS_INVALID')
    if family=='rational' and (plan.get('numerator') or [None,None])[1] in ('0',0):raise ValueError('HIDE_LABELS_UNSUPPORTED_FOR_INVERSE_PROPORTION')
    hidden=set(hide or [])
    if 'asymptotes' in hidden and (plan.get('asymptoteLabelAt') is not None or plan.get('verticalAsymptoteLabelAt') not in (None,'NONE')):raise ValueError('HIDE_LABELS_INVALID')
    fitted={**result['graphPlan']}
    if hide is not None:fitted['hideLabels']=[item for item in allowed if item in hidden]
    if tex is not None:
        if 'formula' in hidden:raise ValueError('HIDE_LABELS_INVALID')
        ascii_text=tex_formula_ascii(tex)
        if not formula_text_matches(fitted,ascii_text):raise ValueError('FORMULA_TEX_NOT_THE_FUNCTION')
        fitted['formulaAscii']=ascii_text
    return {**result,'graphPlan':fitted}

def _fit_overview_family(plan):
    if 'regions' in plan and plan.get('family') not in ('piecewise-polynomial','multi-curve','rational') and not (plan.get('family')=='polynomial' and isinstance(plan.get('coefficients'),list) and any(isinstance(value,str) and 'sqrt' in value for value in plan['coefficients'])):raise ValueError('GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL')   # (G18c) multi-curve regions plus exact Q(sqrt(r)) cubic regions
    if 'applicationAxes' in plan and not (plan.get('family')=='polynomial' and isinstance(plan.get('sourceDomain'),dict) and plan['sourceDomain'].get('kind')=='INTERVAL'):raise ValueError('APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL')
    if 'axisScale' in plan and plan.get('family') not in ('piecewise-polynomial','multi-curve'):raise ValueError('AXIS_SCALE_UNSUPPORTED_FAMILY')   # (G18c) a multi-curve figure may stretch y too (horizontal lines a unit apart need room for their labels)
    if 'displayWindow' in plan and plan.get('family')!='rational':raise ValueError('DISPLAY_WINDOW_UNSUPPORTED_FAMILY')
    if 'formulaAt' in plan and plan.get('family')!='rational':raise ValueError('FORMULA_AT_UNSUPPORTED_FAMILY')
    if 'asymptoteOnly' in plan and plan.get('family')!='rational':raise ValueError('ASYMPTOTE_ONLY_REQUIRES_RATIONAL')
    if plan.get('family')=='rational':return _with_label_options(plan,_fit_rational_overview(plan))
    if plan.get('family')=='sqrt-affine':
        if 'displaySize' in plan and plan['displaySize']!='full':raise ValueError('SQRT_DISPLAY_SIZE_INVALID')
        return _with_label_options(plan,_fit_sqrt_affine_general_overview(plan) if _sqrt_affine_general_plan(plan) else _fit_sqrt_affine_overview(plan))
    if plan.get('family')=='absolute-value':return _fit_absolute_value_overview(plan)
    if plan.get('family')=='piecewise-affine':return _fit_piecewise_affine_overview(plan)
    if plan.get('family')=='exponential-affine':return _fit_exponential_base_overview(plan) if plan.get('base') is not None or plan.get('shiftX') is not None else _fit_exponential_affine_overview(plan)
    if plan.get('family')=='logarithmic-affine':return _fit_logarithmic_base_overview(plan) if plan.get('base') is not None else _fit_logarithmic_affine_overview(plan)
    if plan.get('family')=='exp-log-pair':return _fit_exp_log_pair_overview(plan)
    if plan.get('family')=='trigonometric':return _fit_trigonometric_overview(plan)
    if plan.get('family')=='piecewise-polynomial':return fit_piecewise_polynomial(plan)
    if plan.get('family')=='piecewise-discontinuous':return fit_piecewise_discontinuous(plan)
    if plan.get('family')=='multi-curve':return fit_multi_curve(plan)
    if plan.get('family')!='polynomial':raise ValueError('UNSUPPORTED_OVERVIEW_FAMILY')
    values=plan.get('coefficients')
    if not isinstance(values,list) or not 1<=len(values)<=5:raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    if any(isinstance(value,str) and 'sqrt' in value for value in values):
        radical,c=_quadratic_field_coefficients(values)
        if 'applicationAxes' in plan:raise ValueError('APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL')
        while len(c)>1 and c[-1]==0:c.pop()
        if len(c)!=4:raise ValueError('UNSUPPORTED_CUBIC_QUARTIC_ALGEBRAIC_DEGREE')
        return _fit_cubic_quartic(plan,c,radical=radical)
    if any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values):raise ValueError('INVALID_FRAMING_COEFFICIENTS')
    try:c=[Fraction(v) for v in values]
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_FRAMING_COEFFICIENTS') from None
    while len(c)>1 and c[-1]==0:c.pop()
    if len(c) in (4,5):
        if 'applicationAxes' in plan:raise ValueError('APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL')
        return _fit_cubic_quartic(plan,c)
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
    # Points on an added straight line (graphPlan.linePoints, not necessarily on the curve) must be framed too.
    line_points=plan.get('linePoints',[])
    if not isinstance(line_points,list) or len(line_points)>4:raise ValueError('INVALID_LINE_POINTS')
    for point in line_points:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not all(isinstance(point[v],(int,float)) and not isinstance(point[v],bool) and math.isfinite(point[v]) and abs(point[v])<=1e6 for v in ('x','y')):raise ValueError('INVALID_LINE_POINT')
    source_domain=plan.get('sourceDomain')
    if isinstance(source_domain,dict) and source_domain.get('kind')=='INTERVAL':return _fit_quadratic_interval(plan,c,source_domain,required,line_points)
    if source_domain is not None and source_domain!={'kind':'ALL_REALS'}:raise ValueError('RESTRICTED_SOURCE_DOMAIN_NEEDS_CONTEXT_VIEW')
    if source_domain=={'kind':'ALL_REALS'}:return _fit_quadratic_equal_unit(plan,hf,kf,af,natural,required,line_points)
    # No sourceDomain: older frozen draw intervals are retained (legacy unequal frame). Never silently enlarge a
    # potentially source-restricted domain to make a prettier picture.
    lo,hi=plan['domain']
    if not lo<hf<hi or min(hf-lo,hi-hf)<natural:raise ValueError('OVERVIEW_DRAW_INTERVAL_TOO_NARROW_REVIEW_DOMAIN')
    if any(not lo<=p['x']<=hi for p in required):raise ValueError('REQUIRED_FEATURE_OUTSIDE_REVIEWED_DRAW_INTERVAL')
    anchors=plan.get('overlayAnchors',[])
    if anchors:
        lo=min(lo,min(x for x,_ in anchors)-.5);hi=max(hi,max(x for x,_ in anchors)+.5)
    radius=min(hf-lo,hi-hf)/1.15
    # The curve is drawn over [lo,hi], so its height there decides the frame (radius alone left the drawn ends above ymax).
    span=max(hf-lo,hi-hf)
    rise=max([abs(af)*span*span]+[1.15*abs(p['y']-kf) for p in required+line_points]+[1.15*abs(y-kf) for _,y in anchors])
    ymin=min(0,kf-.15*rise) if af>0 else min(0,kf-1.15*rise)
    ymax=max(0,kf+1.15*rise) if af>0 else max(0,kf+.15*rise)
    xpad=(hi-lo)*.1 if required or line_points else 0
    fitted={**plan,'domain':[lo,hi],'viewport':[lo-xpad,hi+xpad,ymin,ymax],'shapeIntent':'OVERVIEW'}
    return {'graphPlan':fitted,'policy':'QUADRATIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':{'vertex':[hf,kf],'opening':'UP' if af>0 else 'DOWN','naturalHalfSpan':natural},'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

# Quadratic graphs keep one scale on both axes (user direction 2026-10-22): the figure is the true shape, never squeezed to fill the canvas.
QUADRATIC_PLOT_WIDTH=448
VERTICAL_ASYMPTOTE_LABEL_PLACES=('TOP_LEFT','TOP_RIGHT','BOTTOM_LEFT','BOTTOM_RIGHT','NONE')   # (G13a) graphPlan.verticalAsymptoteLabelAt
QUADRATIC_PLOT_HEIGHT=(160,640)
EQUAL_UNIT_EDGE_PX=40
EQUAL_UNIT_MIN_CURVE_PX=48
EQUAL_UNIT_MIN_NATURAL_PX=24
EQUAL_UNITS_MIN_SCALE_PX=10   # G18b equalUnits on a rational / square root: fewer px per unit than this is refused (EQUAL_UNITS_WINDOW_TOO_WIDE)

def plot_height_limit(plan):
    """plotHeightLimit is set by composite-candidate-svg-v1 for panels of a stack; a single figure may be up to 640 high."""
    limit=plan.get('plotHeightLimit',QUADRATIC_PLOT_HEIGHT[1])
    if isinstance(limit,bool) or not isinstance(limit,(int,float)) or not 120<=limit<=QUADRATIC_PLOT_HEIGHT[1]:raise ValueError('INVALID_PLOT_HEIGHT_LIMIT')
    return float(limit)

AXIS_SQUEEZE_MIN_RATIO=.5

def equal_unit_frame(points,height_limit,ratio=1.0):
    """One scale for both axes (or y at ratio times the x scale). The points fill the 448-wide plot with 40 px clear at each edge unless that
    would be taller than the limit; then the plot is the limit high and the x range widens. Returns the viewport, the integer plot height and
    the x scale (px per unit); the y scale is ratio times it."""
    if ratio!=1.0:
        viewport,height,scale=equal_unit_frame([(x,y*ratio) for x,y in points],height_limit)
        return [viewport[0],viewport[1],viewport[2]/ratio,viewport[3]/ratio],height,scale
    xs=[p[0] for p in points];ys=[p[1] for p in points];xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    inner_w=QUADRATIC_PLOT_WIDTH-2*EQUAL_UNIT_EDGE_PX;inner_h=height_limit-2*EQUAL_UNIT_EDGE_PX
    scale=min(inner_w/xspan if xspan>0 else math.inf,inner_h/yspan if yspan>0 else math.inf)
    if not math.isfinite(scale) or scale<=0:raise ValueError('EQUAL_UNIT_FRAME_DEGENERATE')
    height=float(min(int(height_limit),math.ceil(max(QUADRATIC_PLOT_HEIGHT[0],yspan*scale+2*EQUAL_UNIT_EDGE_PX))))
    cx,cy=(min(xs)+max(xs))/2,(min(ys)+max(ys))/2;half_w=QUADRATIC_PLOT_WIDTH/scale/2;half_h=height/scale/2
    viewport=[cx-half_w,cx+half_w,cy-half_h,cy+half_h]
    if not all(math.isfinite(v) and abs(v)<=1e6 for v in viewport):raise ValueError('UNSUPPORTED_FRAMING_NUMERIC_SCOPE')
    return viewport,height,scale

def squeeze_ratio(points,height_limit):
    """The y/x scale ratio (at least 1/2) at which the points fill the plot width without passing the height limit: one scale when it fits."""
    xs=[p[0] for p in points];ys=[p[1] for p in points];xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    if xspan<=0 or yspan<=0:return 1.0
    fit=((height_limit-2*EQUAL_UNIT_EDGE_PX)/yspan)/((QUADRATIC_PLOT_WIDTH-2*EQUAL_UNIT_EDGE_PX)/xspan)
    return max(AXIS_SQUEEZE_MIN_RATIO,min(1.0,fit))

# graphPlan.axisScale {x,y} (piecewise-polynomial only): the author's own scale for each axis, for a graph whose axes measure different things (minutes
# against kilometres). Only the proportion counts: {x:1,y:12} draws one y unit twelve times as long as one x unit. Positive integers, decimals or
# rational strings, and the proportion stays within 1:64 .. 64:1.
AXIS_SCALE_MAX_RATIO=Fraction(64)

def axis_scale_ratio(plan):
    """The y/x scale proportion of an axisScale, or None when the plan has none."""
    if 'axisScale' not in plan:return None
    scale=plan['axisScale']
    if not isinstance(scale,dict) or set(scale)!={'x','y'}:raise ValueError('INVALID_AXIS_SCALE')
    parts=[]
    for axis in ('x','y'):
        value=scale[axis]
        if isinstance(value,bool) or not (isinstance(value,int) or isinstance(value,str) and re.fullmatch(r'\d{1,6}(?:/\d{1,6}|\.\d{1,6})?',value)):raise ValueError('INVALID_AXIS_SCALE')
        try:parts.append(Fraction(str(value)))
        except (ValueError,ZeroDivisionError):raise ValueError('INVALID_AXIS_SCALE') from None
        if parts[-1]<=0:raise ValueError('INVALID_AXIS_SCALE')
    ratio=parts[1]/parts[0]
    if not 1/AXIS_SCALE_MAX_RATIO<=ratio<=AXIS_SCALE_MAX_RATIO:raise ValueError('AXIS_SCALE_RATIO_OUT_OF_RANGE')
    return float(ratio)

def axis_ratios(plan,points,height_limit):
    """One scale first; a squeeze (y at most halved) only after a failure: axisSqueeze (set by the runner after a layout failure) asks for it
    straight away, and a figure too narrow at one scale tries it next. An author's axisScale is the one ratio, and no squeeze may follow it."""
    declared=axis_scale_ratio(plan)
    if declared is not None:
        if plan.get('axisSqueeze') not in (None,False):raise ValueError('AXIS_SCALE_WITH_SQUEEZE')
        return [declared]
    squeeze=plan.get('axisSqueeze',False)
    if squeeze not in (True,False):raise ValueError('INVALID_AXIS_SQUEEZE')
    ratio=squeeze_ratio(points,height_limit)
    return [ratio] if squeeze else [1.0]+([ratio] if ratio<1.0 else [])

def _fit_quadratic_equal_unit(plan,hf,kf,af,natural,required,line_points):
    """All reals: the vertex, the natural arms (half-span 2/sqrt|a|, rise 4), the key and line points and the origin, at one scale; the curve
    runs to just inside the top (or bottom) edge."""
    rise=4 if af>0 else -4
    points=[(0.0,0.0),(hf,kf),(hf-natural,kf+rise),(hf+natural,kf+rise)]+[(p['x'],p['y']) for p in required+line_points]+[(x,y) for x,y in plan.get('overlayAnchors',[])]
    limit=plot_height_limit(plan)
    for ratio in axis_ratios(plan,points,limit):
        viewport,height,scale=equal_unit_frame(points,limit,ratio)
        edge=viewport[3] if af>0 else viewport[2];dx=math.sqrt(.96*(edge-kf)/af)
        lo,hi=max(viewport[0],hf-dx),min(viewport[1],hf+dx)
        # Too narrow to read: the drawn curve under 48 px wide, or the vertex region (natural window) under 24 px.
        if (hi-lo)*scale>=EQUAL_UNIT_MIN_CURVE_PX and 2*natural*scale>=EQUAL_UNIT_MIN_NATURAL_PX:break
    else:raise ValueError('EQUAL_UNIT_PARABOLA_TOO_NARROW')
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1','equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}
    return {'graphPlan':fitted,'policy':'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':{'vertex':[hf,kf],'opening':'UP' if af>0 else 'DOWN','naturalHalfSpan':natural,'scalePxPerUnit':scale},'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

INTERVAL_STATES={'CLOSED','OPEN'}

def quadratic_source_interval(source_domain):
    """{kind:'INTERVAL',range:[lo,hi],states:[start,end]}: exact ends (numbers or rational strings); states CLOSED (default) or OPEN."""
    if set(source_domain)-{'kind','range','states'}:raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
    raw=source_domain.get('range');states=source_domain.get('states',['CLOSED','CLOSED'])
    if not isinstance(raw,list) or len(raw)!=2 or not isinstance(states,list) or len(states)!=2 or any(state not in INTERVAL_STATES for state in states):raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
    ends=[]
    for value in raw:
        if isinstance(value,bool) or not (isinstance(value,(int,float)) and math.isfinite(value) and abs(value)<=1e6 or isinstance(value,str) and re.fullmatch(r'-?\d+(?:/\d+)?',value)):raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
        try:ends.append(Fraction(str(value)))
        except (ValueError,ZeroDivisionError):raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL') from None
    if not ends[0]<ends[1]:raise ValueError('INVALID_POLYNOMIAL_SOURCE_INTERVAL')
    return ends[0],ends[1],list(states)

# Application-problem axes (opt-in graphPlan.applicationAxes:true): a word problem whose axes measure different quantities (a count 0..50 and a
# profit 0..45000) gets its own scale on each axis, so ticks are the real values on each axis. Pure mathematical graphs keep one scale: the flag is
# accepted only for a quadratic on a restricted source interval (a word problem always restricts its variable).
APPLICATION_PLOT_HEIGHT=360

def application_axes_frame(points):
    """Separate scales on the two axes: the points fill the 448-wide plot with 40 px clear at each edge and the plot is APPLICATION_PLOT_HEIGHT
    high. Returns the viewport, the integer plot height, the x scale (px per x unit) and the y/x scale ratio."""
    xs=[p[0] for p in points];ys=[p[1] for p in points];xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    if xspan<=0 or yspan<=0:raise ValueError('APPLICATION_AXES_FRAME_DEGENERATE')
    height=APPLICATION_PLOT_HEIGHT
    sx=(QUADRATIC_PLOT_WIDTH-2*EQUAL_UNIT_EDGE_PX)/xspan;sy=(height-2*EQUAL_UNIT_EDGE_PX)/yspan
    viewport=[min(xs)-EQUAL_UNIT_EDGE_PX/sx,max(xs)+EQUAL_UNIT_EDGE_PX/sx,min(ys)-EQUAL_UNIT_EDGE_PX/sy,max(ys)+EQUAL_UNIT_EDGE_PX/sy]
    if not all(math.isfinite(v) and abs(v)<=1e9 for v in viewport) or not math.isfinite(sy/sx) or sy/sx<=0:raise ValueError('UNSUPPORTED_FRAMING_NUMERIC_SCOPE')
    return viewport,height,sx,sy/sx

def application_ticks_valid(values,lo,hi):
    """The author's tick values for one application axis: 2 to 8 distinct nonzero values in an arithmetic progression whose step is 1, 2 or 5 times a
    power of ten, every value a multiple of the step and inside the viewport."""
    try:ticks=sorted(float(Fraction(str(v))) for v in values)
    except (TypeError,ValueError,ZeroDivisionError):return False
    if not 2<=len(ticks)<=8 or any(abs(v)<1e-12 or not lo<=v<=hi for v in ticks):return False
    step=ticks[1]-ticks[0]
    if step<=0 or any(abs((b-a)-step)>1e-9*max(1,abs(step)) for a,b in zip(ticks,ticks[1:])):return False
    mantissa=step/10**math.floor(math.log10(step))
    if not any(abs(mantissa-m)<1e-9 for m in (1,2,5)):return False
    return all(abs(v/step-round(v/step))<1e-9 for v in ticks)

def _fit_quadratic_interval(plan,c,source_domain,required,line_points):
    """The curve only on the source interval, with its endpoint dots; the frame holds the interval, its values, the key points and the axes."""
    lo,hi,states=quadratic_source_interval(source_domain)
    def f(t):return c[0]+c[1]*t+c[2]*t*t
    for point in required:
        at=Fraction(str(point['x']))
        if not lo<=at<=hi:raise ValueError('REQUIRED_GRAPH_POINT_OUTSIDE_SOURCE_INTERVAL:'+point['id'])
        if at==lo and states[0]=='OPEN' or at==hi and states[1]=='OPEN':raise ValueError('REQUIRED_GRAPH_POINT_AT_OPEN_ENDPOINT:'+point['id'])
    h=-c[1]/(2*c[2])
    values=[f(lo),f(hi)]+([f(h)] if lo<h<hi else [])
    xs=[float(lo),float(hi)]+([float(h)] if lo<h<hi else [])
    points=[(0.0,0.0)]+list(zip(xs,[float(v) for v in values]))+[(p['x'],p['y']) for p in required+line_points]
    application=plan.get('applicationAxes')
    if not application:points=points+[(x,y) for x,y in plan.get('overlayAnchors',[])]
    if application not in (None,True):raise ValueError('INVALID_APPLICATION_AXES')
    if application:
        if plan.get('axisSqueeze') is not None or plan.get('plotCanvas') is not None:raise ValueError('INVALID_APPLICATION_AXES')
        viewport,height,scale,ratio=application_axes_frame(points)
        if float(hi-lo)*scale<EQUAL_UNIT_MIN_CURVE_PX:raise ValueError('APPLICATION_AXES_CURVE_TOO_NARROW')
        ticks=plan.get('axisTickValues')
        for axis,(lo_v,hi_v) in (('x',viewport[0:2]),('y',viewport[2:4])):
            if not isinstance(ticks,dict) or set(ticks)!={'x','y'} or not isinstance(ticks[axis],list) or not application_ticks_valid(ticks[axis],lo_v,hi_v):raise ValueError('APPLICATION_AXES_TICKS_INVALID:'+axis)
    else:
        limit=plot_height_limit(plan)
        for ratio in axis_ratios(plan,points,limit):
            viewport,height,scale=equal_unit_frame(points,limit,ratio)
            if float(hi-lo)*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
        else:raise ValueError('EQUAL_UNIT_CURVE_TOO_NARROW')
    features={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':str(lo),'y':str(f(lo)),'state':states[0]},{'side':'END','x':str(hi),'y':str(f(hi)),'state':states[1]}]}
    policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    fitted={**plan,'domain':[float(lo),float(hi)],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'POLYNOMIAL_INTERVAL_OVERVIEW_v1','intervalFeatures':features,'intervalFeaturePolicy':policy,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}
    return {'graphPlan':fitted,'policy':'POLYNOMIAL_INTERVAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

# ---- graphPlan.regions of an inverse proportion (rational-spike-v1, y=k/(d0+d1*x)) ----------------------------------------------------------------------
# One region form, the one the multi-curve figure uses: {id, under:"f", from, to, fill?, label?}: the area between the curve and the x-axis over [from,to]
# (the area under the curve of a positive k, the area above it of a negative k). The stretch may END at the asymptote (from or to equal to the pole: the curve then
# leaves the window through its top or bottom edge and the fill is closed along that edge) but must not contain it (GRAPH_REGION_BOUNDARY_UNDEFINED) and must lie in
# the drawn window (GRAPH_REGION_DOMAIN_INVALID). The fill is clipped to the plot window: its corners are on the window edge, never outside it.
RATIONAL_REGION_FIELDS={'id','under','from','to','fill','label'}

def _rational_inverse_regions(plan,result,k,denominator):
    raw=plan.get('regions')
    if raw is None:return result
    if not isinstance(raw,list) or not 1<=len(raw)<=MULTI_CURVE_MAX_REGIONS:raise ValueError('GRAPH_REGION_COUNT_INVALID')
    fitted=result['graphPlan'];x0,x1,y0,y1=(float(value) for value in fitted['viewport'])
    pole=-denominator[0]/denominator[1];c=k/denominator[1]
    rows=[];ids=set()
    for entry in raw:
        if not isinstance(entry,dict):raise ValueError('GRAPH_REGION_FIELD_INVALID')
        unknown=sorted(set(entry)-RATIONAL_REGION_FIELDS)
        if unknown:raise ValueError('GRAPH_REGION_FIELD_UNKNOWN:'+str(unknown[0]))
        region_id=entry.get('id')
        if not isinstance(region_id,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,31}',region_id):raise ValueError('GRAPH_REGION_ID_INVALID')
        if region_id in ids:raise ValueError('GRAPH_REGION_ID_DUPLICATE:'+region_id)
        ids.add(region_id)
        if not {'under','from','to'}<=set(entry):raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        if not isinstance(entry['under'],str):raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        if entry['under']!='f':raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+region_id+':'+entry['under'])
        fill=entry.get('fill','LIGHT')
        if fill not in PIECEWISE_POLY_REGION_FILLS:raise ValueError('GRAPH_REGION_FILL_UNSUPPORTED:'+region_id)
        label=entry.get('label')
        if label is not None and (not isinstance(label,str) or not label.strip() or len(label)>40):raise ValueError('GRAPH_REGION_LABEL_INVALID:'+region_id)
        start=_mc_fraction(entry['from'],'GRAPH_REGION_DOMAIN_INVALID:'+region_id);end=_mc_fraction(entry['to'],'GRAPH_REGION_DOMAIN_INVALID:'+region_id)
        if not start<end or float(start)<x0-1e-9 or float(end)>x1+1e-9:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id)
        if start<pole<end:raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':f')   # a pole strictly inside: the area is unbounded on both sides of it
        far=end if pole<=start else start   # the end farthest from the pole: the curve is lowest there
        far_value=float(c/(far-pole))
        if not y0-1e-9<=far_value<=y1+1e-9:raise ValueError('GRAPH_REGION_CURVE_NOT_VISIBLE:'+region_id)
        positive=c/((start+end)/2-pole)>0
        rows.append({'id':region_id,'kind':'UNDER','upper':'f' if positive else 'axis','lower':'axis' if positive else 'f','from':_mc_text(start),'to':_mc_text(end),
                     'fromValue':float(start),'toValue':float(end),'fill':fill,**({'label':label} if label is not None else {})})
    return {**result,'graphPlan':{**fitted,'graphRegionFeatures':{'regions':rows}}}

def _rational_coefficients(values,name,allow_constant=False):
    if not isinstance(values,list) or len(values)!=2 or any(not isinstance(v,str) or len(v)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',v) for v in values):
        raise ValueError('UNSUPPORTED_RATIONAL_'+name.upper()+'_GRAMMAR')
    try:coefficients=[Fraction(value) for value in values]
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_RATIONAL_'+name.upper()+'_COEFFICIENT') from None
    if coefficients[1]==0:
        # A nonzero constant numerator (inverse proportion y=k/(d0+d1*x)) is its own grammar; zero is not a function to draw.
        if allow_constant and coefficients[0]!=0:return coefficients
        if allow_constant:raise ValueError('UNSUPPORTED_RATIONAL_NUMERATOR_ZERO')
        raise ValueError('UNSUPPORTED_RATIONAL_'+name.upper()+'_DEGREE')
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
    numerator=_rational_coefficients(plan.get('numerator'),'numerator',allow_constant=True)
    denominator=_rational_coefficients(plan.get('denominator'),'denominator')
    # asymptoteLabelAt (G12-5): START | END puts the label of the horizontal asymptote at that end of its dashed line, on the side away from the curve (default: near the middle, above)
    if 'asymptoteLabelAt' in plan:
        if plan['asymptoteLabelAt'] not in ('START','END'):raise ValueError('ASYMPTOTE_LABEL_AT_INVALID')
        if numerator[1]==0:raise ValueError('ASYMPTOTE_LABEL_AT_UNSUPPORTED')
    # verticalAsymptoteLabelAt (G13a): TOP_LEFT | TOP_RIGHT | BOTTOM_LEFT | BOTTOM_RIGHT puts the label x=p on that side of the dashed vertical asymptote, at its top or bottom end; NONE draws
    # no automatic label (the author writes it, for example as a callout). The default place is kept without the field.
    if 'verticalAsymptoteLabelAt' in plan and plan['verticalAsymptoteLabelAt'] not in VERTICAL_ASYMPTOTE_LABEL_PLACES:raise ValueError('VERTICAL_ASYMPTOTE_LABEL_AT_INVALID')
    asymptote_only='asymptoteOnly' in plan
    if asymptote_only:
        if plan['asymptoteOnly'] is not True:raise ValueError('ASYMPTOTE_ONLY_INVALID')
        if numerator[1]==0:raise ValueError('ASYMPTOTE_ONLY_REQUIRES_LINEAR_NUMERATOR')
        if (plan.get('hideLabels')!=['formula'] or plan.get('axisTickValues',{'x':[],'y':[]})!={'x':[],'y':[]} or
            any(key in plan for key in ('axisTitles','formulaTex','formulaLabel','overlays','regions','asymptoteLabelAt','verticalAsymptoteLabelAt')) or
            plan.get('requiredPoints',[])!=[]):
            raise ValueError('ASYMPTOTE_ONLY_REQUIRES_ASYMPTOTES_WITHOUT_OTHER_LABELS')
    if numerator[1]==0:return _rational_inverse_regions(plan,_fit_rational_constant_numerator(plan,numerator[0],denominator,original_domain,original_viewport),numerator[0],denominator)
    if 'regions' in plan:raise ValueError('GRAPH_REGION_REQUIRES_INVERSE_PROPORTION')   # regions of a rational: the inverse proportion y=k/(d0+d1*x) only (the shaded stretch must not meet a second asymptote or the x-intercept)
    if plan.get('displayWindow') is not None:raise ValueError('DISPLAY_WINDOW_REQUIRES_INVERSE_PROPORTION')
    if plan.get('formulaAt') is not None:raise ValueError('FORMULA_AT_REQUIRES_DISPLAY_WINDOW')
    if plan.get('formulaLabel') is not None:raise ValueError('RATIONAL_FORMULA_LABEL_REQUIRES_CONSTANT_NUMERATOR')
    pole_or_hole=-denominator[0]/denominator[1]
    numerator_root=-numerator[0]/numerator[1]
    horizontal=numerator[1]/denominator[1]
    is_hole=(numerator[0]+numerator[1]*pole_or_hole)==0
    if asymptote_only and is_hole:raise ValueError('ASYMPTOTE_ONLY_REQUIRES_VERTICAL_POLE')
    if is_hole:
        singularity={'kind':'REMOVABLE_HOLE','x':_fraction_text(pole_or_hole),'y':_fraction_text(horizontal)}
        x_intercept=None
    else:
        singularity={'kind':'VERTICAL_POLE','x':_fraction_text(pole_or_hole)}
        x_intercept=_fraction_text(numerator_root)
    required_x,required_y=_rational_required_points(plan,numerator,denominator)
    singularity_x=float(pole_or_hole);root_x=float(numerator_root)
    if any(not math.isfinite(value) or abs(value)>1e6 for value in (singularity_x,root_x,float(horizontal))):raise ValueError('UNSUPPORTED_RATIONAL_NUMERIC_SCOPE')
    # Keep the singularity, intercept and unit ticks in one readable local
    # overview. A very wide all-real display compresses the y-axis tick column
    # against both the nearby branch and the pole cue without adding useful
    # information about the source function.
    anchors=plan.get('overlayAnchors',[])
    radius=max(6.0,abs(singularity_x)*1.25+.5,abs(root_x-singularity_x)*1.2+1.0,*[abs(px-singularity_x)*1.2 for px in required_x],*[abs(ax-singularity_x)*1.2 for ax,_ in anchors])
    lo,hi=singularity_x-radius,singularity_x+radius
    def evaluate_exact(x_value):
        exact_x=Fraction(str(x_value));den=numerator[0]*0+denominator[0]+denominator[1]*exact_x
        if den==0:raise ValueError('RATIONAL_FRAME_ENDPOINT_IS_SINGULAR')
        return float((numerator[0]+numerator[1]*exact_x)/den)
    endpoint_values=[evaluate_exact(lo),evaluate_exact(hi)]
    key_values=[0.0,float(horizontal),*required_y,*[y for _,y in anchors]]
    if x_intercept is not None:key_values.append(0.0)
    if is_hole:key_values.append(float(singularity['y']))
    low=min([*endpoint_values,*key_values]);high=max([*endpoint_values,*key_values])
    span=max(1.0,high-low,abs(low),abs(high));padding=.35*span
    ymin=min(0.0,low)-padding;ymax=max(0.0,high)+padding
    # G18a: the drawing engine adds (0,0), (1,0) and (0,1) to the frame as axis facts and silently widens the whole frame by 8% when one of them is not strictly inside.
    # A rational with k<0 (left branch above, right branch below the asymptote) can end below y=1, which made the drawn frame larger than the plan's frame
    # and every dashed asymptote, branch end and clip edge missed the audit. Keep (0,1) comfortably inside the planned frame, so the two frames stay one.
    if ymax<1.0+.005*(ymax-ymin):ymax=1.0+.12*(ymax-ymin)   # same trigger as the engine (ymax<=1) plus a hair, so frames of rationals whose ymax is already above 1 are untouched
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,ymin,ymax)):raise ValueError('UNSUPPORTED_RATIONAL_NUMERIC_SCOPE')
    equal_fields={}
    if plan.get('equalUnits') is not None:
        # G18b: equalUnits:true draws one x unit and one y unit the same length (y=x at 45 degrees, a circle a circle). The window is the one above, framed at one scale (the plot
        # grows taller, up to the height limit, or the x range widens); a window that would need more than the limit to keep the pole, the curve ends and the origin readable is refused.
        if plan.get('equalUnits') is not True or 'axisScale' in plan or plan.get('axisSqueeze') not in (None,False):raise ValueError('EQUAL_UNITS_INVALID')
        viewport,height,scale=equal_unit_frame([(lo,ymin),(hi,ymax),(0.0,0.0),(0.0,1.0),(1.0,0.0)],plot_height_limit(plan),1.0)
        if scale<EQUAL_UNITS_MIN_SCALE_PX or min(singularity_x-viewport[0],viewport[1]-singularity_x)*scale<EQUAL_UNIT_MIN_CURVE_PX:raise ValueError('EQUAL_UNITS_WINDOW_TOO_WIDE')
        lo,hi,ymin,ymax=viewport[0],viewport[1],viewport[2],viewport[3]
        equal_fields={'equalUnits':True,'axisRatio':1.0,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height},'clipRefine':True}
    features={'schemaVersion':'RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1','singularity':singularity,'horizontalAsymptoteY':_fraction_text(horizontal),'xIntercept':x_intercept}
    policy={'schemaVersion':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_POLICY_v1','sourceDomain':'ALL_REALS_WITH_DENOMINATOR_EXCLUSION','degreeGrammar':'LINEAR_OVER_LINEAR','singularityPolicy':'ONE_SIMPLE_REAL_POLE_OR_ONE_REMOVABLE_HOLE','horizontalAsymptotePolicy':'EXACT_LEADING_COEFFICIENT_RATIO','minimumFeatureSeparationCssPx':1,'holeMarkerRadiusIntrinsicPx':4,'minimumHoleMarkerDiameterCssPx':4.5}
    fitted={**plan,'domain':[lo,hi],'viewport':[lo,hi,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1','rationalFeatures':features,'rationalFeaturePolicy':policy,**equal_fields}
    return {'graphPlan':fitted,'policy':'RATIONAL_LINEAR_OVER_LINEAR_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

# ---- inverse proportion y=k/(d0+d1*x): a nonzero CONSTANT numerator over a linear denominator (middle school 반비례, y=k/x) ----------------
# The curve is the rectangular hyperbola y=c/(x-p) with c=k/d1 and p=-d0/d1: one vertical pole at x=p and the horizontal asymptote y=0, which is
# the x-axis itself (the numerator never vanishes, so no x-intercept and no hole). An asymptote that coincides with a coordinate axis is the axis:
# no dashed line is drawn over it (always the case for y=0; for the pole only when p=0, i.e. y=k/x). It is framed like every other graph that
# keeps its true shape: one scale on both axes (a vertical squeeze of at most 1/2 only after a failure), the frame centred on the pole with the
# half-window RATIONAL_CONSTANT_WINDOW_VERTEX_MULTIPLES vertex distances (sqrt|c|) wide, widened to hold the origin, every required point and
# every overlay point, so both branches are always visible.
RATIONAL_CONSTANT_WINDOW_VERTEX_MULTIPLES=3.0
RATIONAL_CONSTANT_LABEL_PATTERN=r'[0-9A-Za-z=+\-*/().\^ ]{1,40}'

def _rational_required_points(plan,numerator,denominator):
    """The required points of a rational plan, each checked exactly against the curve: (x list, y list). Shared by both rational grammars."""
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
    return required_x,required_y

# ---- author display window (E22): graphPlan.displayWindow = [xmin,xmax,ymin,ymax] ------------------------------------------------------
# The automatic frame centres the pole and shows both branches, which makes a small figure (a square of side 4 near the origin) tiny. An
# author may instead name the window to show: the frame is exactly that window at one scale on both axes (the plot is 448 px wide and as tall
# as the window's aspect needs, the y range is widened by less than one pixel to a whole pixel height), the curve is clipped to it, a pole or
# a branch outside it is simply not drawn, and nothing is enlarged silently (a point or line outside is refused). The origin must be inside so
# both axes are drawn. Inverse proportion (nonzero constant numerator) only; the independent observer recomputes which parts of the curve
# must be visible from the exact coefficients.
DISPLAY_WINDOW_POLICY='AUTHOR_DISPLAY_WINDOW_EQUAL_UNITS_v1'

def _display_window(plan):
    window=plan.get('displayWindow')
    if window is None:return None
    if not isinstance(window,list) or len(window)!=4 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or abs(v)>1e6 for v in window):raise ValueError('DISPLAY_WINDOW_INVALID')
    xmin,xmax,ymin,ymax=(float(v) for v in window)
    if not xmin<xmax or not ymin<ymax:raise ValueError('DISPLAY_WINDOW_INVALID')
    if not (xmin<0<xmax and ymin<0<ymax):raise ValueError('DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN')
    return [xmin,xmax,ymin,ymax]

def _fit_rational_constant_window(plan,k,denominator,original_domain,original_viewport,window):
    if plan.get('axisSqueeze') not in (None,False):raise ValueError('DISPLAY_WINDOW_FORBIDS_AXIS_SQUEEZE')
    label=plan.get('formulaLabel')
    if label is not None and (not isinstance(label,str) or not re.fullmatch(RATIONAL_CONSTANT_LABEL_PATTERN,label)):raise ValueError('RATIONAL_FORMULA_LABEL_INVALID')
    pole=-denominator[0]/denominator[1];c=k/denominator[1]
    required_x,required_y=_rational_required_points(plan,[k,Fraction(0)],denominator)
    pole_x=float(pole);c_value=float(c)
    if any(not math.isfinite(value) or abs(value)>1e6 for value in (pole_x,c_value)):raise ValueError('UNSUPPORTED_RATIONAL_NUMERIC_SCOPE')
    xmin,xmax,ymin,ymax=window
    formula_at=plan.get('formulaAt')
    if formula_at is not None and (not isinstance(formula_at,list) or len(formula_at)!=2 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in formula_at)):raise ValueError('FORMULA_AT_INVALID')
    if formula_at is not None and not (xmin<formula_at[0]<xmax and ymin<formula_at[1]<ymax):raise ValueError('FORMULA_AT_OUTSIDE_WINDOW')
    scale=QUADRATIC_PLOT_WIDTH/(xmax-xmin)
    exact_height=(ymax-ymin)*scale
    if exact_height<QUADRATIC_PLOT_HEIGHT[0]-1e-9:raise ValueError('DISPLAY_WINDOW_TOO_FLAT')
    if exact_height>plot_height_limit(plan)+1e-9:raise ValueError('DISPLAY_WINDOW_TOO_TALL')
    height=float(math.ceil(exact_height-1e-9));center=(ymin+ymax)/2;half_height=height/scale/2
    viewport=[xmin,xmax,center-half_height,center+half_height]
    for index,(px,py) in enumerate(zip(required_x,required_y)):
        if not (viewport[0]<px<viewport[1] and viewport[2]<py<viewport[3]):raise ValueError('REQUIRED_GRAPH_POINT_OUTSIDE_DISPLAY_WINDOW:'+str(plan['requiredPoints'][index]['id']))
    # Some part of the curve must be in the window (a window that shows no curve at all is a mistake, not a figure).
    visible=False
    for step in range(1,400):
        x_value=xmin+(xmax-xmin)*step/400
        if abs(x_value-pole_x)<1e-9:continue
        y_value=c_value/(x_value-pole_x)
        if viewport[2]<=y_value<=viewport[3]:visible=True;break
    if not visible:raise ValueError('DISPLAY_WINDOW_CURVE_NOT_VISIBLE')
    if abs(pole_x-xmin)<1e-9 or abs(pole_x-xmax)<1e-9:raise ValueError('DISPLAY_WINDOW_POLE_ON_EDGE')
    pole_inside=xmin<pole_x<xmax
    drawn_vertical=pole!=0 and pole_inside
    vertical={'x':_fraction_text(pole),'drawn':drawn_vertical}
    if not drawn_vertical:vertical['reason']='ON_Y_AXIS' if pole==0 else 'OUTSIDE_WINDOW'
    features={'schemaVersion':'RATIONAL_CONSTANT_OVER_LINEAR_FEATURES_v1','constant':_fraction_text(k),'singularity':{'kind':'VERTICAL_POLE','x':_fraction_text(pole)},
              'horizontalAsymptoteY':'0','xIntercept':None,'poleDirection':{'left':'DOWN' if c>0 else 'UP','right':'UP' if c>0 else 'DOWN'},
              'asymptotes':{'horizontal':{'y':'0','drawn':False,'reason':'ON_X_AXIS'},'vertical':vertical}}
    policy={'schemaVersion':'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_POLICY_v1','sourceDomain':'ALL_REALS_WITH_DENOMINATOR_EXCLUSION','degreeGrammar':'CONSTANT_OVER_LINEAR','singularityPolicy':'ONE_SIMPLE_REAL_POLE','horizontalAsymptotePolicy':'Y_EQUALS_ZERO_IS_THE_X_AXIS_NOT_DRAWN','asymptoteOnAxisPolicy':'AXIS_IS_THE_ASYMPTOTE_NO_DASHED_LINE','minimumFeatureSeparationCssPx':1,'windowPolicy':DISPLAY_WINDOW_POLICY}
    fitted={**plan,'domain':[viewport[0],viewport[1]],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_v1','rationalFeatures':features,'rationalFeaturePolicy':policy,'equalUnits':True,'axisRatio':1.0,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}
    return {'graphPlan':fitted,'policy':'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _fit_rational_constant_numerator(plan,k,denominator,original_domain,original_viewport):
    window=_display_window(plan)
    if window is not None:return _fit_rational_constant_window(plan,k,denominator,original_domain,original_viewport,window)
    if plan.get('formulaAt') is not None:raise ValueError('FORMULA_AT_REQUIRES_DISPLAY_WINDOW')
    label=plan.get('formulaLabel')
    if label is not None and (not isinstance(label,str) or not re.fullmatch(RATIONAL_CONSTANT_LABEL_PATTERN,label)):raise ValueError('RATIONAL_FORMULA_LABEL_INVALID')
    pole=-denominator[0]/denominator[1];c=k/denominator[1]
    required_x,required_y=_rational_required_points(plan,[k,Fraction(0)],denominator)
    pole_x=float(pole);c_value=float(c)
    if any(not math.isfinite(value) or abs(value)>1e6 for value in (pole_x,c_value)):raise ValueError('UNSUPPORTED_RATIONAL_NUMERIC_SCOPE')
    half=RATIONAL_CONSTANT_WINDOW_VERTEX_MULTIPLES*math.sqrt(abs(c_value))
    points=[(0.0,0.0),(pole_x-half,-half),(pole_x+half,half),*zip(required_x,required_y),*[(ax,ay) for ax,ay in plan.get('overlayAnchors',[])]]
    limit=plot_height_limit(plan)
    for ratio in axis_ratios(plan,points,limit):
        viewport,height,scale=equal_unit_frame(points,limit,ratio)
        if min(pole_x-viewport[0],viewport[1]-pole_x)*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
    else:raise ValueError('EQUAL_UNIT_CURVE_TOO_NARROW')
    drawn_vertical=pole!=0
    features={'schemaVersion':'RATIONAL_CONSTANT_OVER_LINEAR_FEATURES_v1','constant':_fraction_text(k),'singularity':{'kind':'VERTICAL_POLE','x':_fraction_text(pole)},
              'horizontalAsymptoteY':'0','xIntercept':None,'poleDirection':{'left':'DOWN' if c>0 else 'UP','right':'UP' if c>0 else 'DOWN'},
              'asymptotes':{'horizontal':{'y':'0','drawn':False,'reason':'ON_X_AXIS'},'vertical':{'x':_fraction_text(pole),'drawn':drawn_vertical,**({} if drawn_vertical else {'reason':'ON_Y_AXIS'})}}}
    policy={'schemaVersion':'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_POLICY_v1','sourceDomain':'ALL_REALS_WITH_DENOMINATOR_EXCLUSION','degreeGrammar':'CONSTANT_OVER_LINEAR','singularityPolicy':'ONE_SIMPLE_REAL_POLE','horizontalAsymptotePolicy':'Y_EQUALS_ZERO_IS_THE_X_AXIS_NOT_DRAWN','asymptoteOnAxisPolicy':'AXIS_IS_THE_ASYMPTOTE_NO_DASHED_LINE','minimumFeatureSeparationCssPx':1}
    fitted={**plan,'domain':[viewport[0],viewport[1]],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_v1','rationalFeatures':features,'rationalFeaturePolicy':policy,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}
    return {'graphPlan':fitted,'policy':'RATIONAL_CONSTANT_OVER_LINEAR_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _sqrt_coefficients(values):
    if not isinstance(values,list) or len(values)!=2 or any(not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in values):
        raise ValueError('UNSUPPORTED_SQRT_AFFINE_GRAMMAR')
    try:constant,slope=(Fraction(value) for value in values)
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_SQRT_AFFINE_COEFFICIENT') from None
    if slope<=0:raise ValueError('UNSUPPORTED_SQRT_AFFINE_SLOPE')
    return constant,slope

def _sqrt_overlay_window(plan,xmin,xmax,ymin,ymax):
    """(G18b) A square-root figure with overlays shows both axes: the engine draws an axis only when the window reaches it, and an overlay line is cut by the window the figure is drawn in,
    which the observer recomputes from the plan's window. So the window of a plan with overlays holds the origin and the unit points (1,0), (0,1) strictly inside (widened by 8 % of
    the span otherwise, the rule of visual_engine/viewport.py). Plans without overlays keep their window."""
    if not isinstance(plan.get('overlays'),dict):return [xmin,xmax,ymin,ymax]
    unit_points=((0.0,0.0),(1.0,0.0),(0.0,1.0))
    anchors=[(float(x),float(y)) for x,y in plan.get('overlayAnchors',[])]   # the declared overlay points: the window reaches them too
    if all(xmin<x<xmax and ymin<y<ymax for x,y in unit_points+tuple(anchors)):return [xmin,xmax,ymin,ymax]
    xs=[xmin,xmax]+[x for x,_ in unit_points+tuple(anchors)];ys=[ymin,ymax]+[y for _,y in unit_points+tuple(anchors)]
    lo_x,hi_x,lo_y,hi_y=min(xs),max(xs),min(ys),max(ys);dx=(hi_x-lo_x)*.08;dy=(hi_y-lo_y)*.08
    return [lo_x-dx,hi_x+dx,lo_y-dy,hi_y+dy]

def _sqrt_equal_units(plan,xmin,xmax,ymin,ymax,lo,hi):
    """(G18b) equalUnits on a square-root curve: the window above reframed at one scale on both axes (the origin and the unit points stay inside). Returns the viewport and the plan
    fields; refuses a window that would need fewer than EQUAL_UNITS_MIN_SCALE_PX px per unit."""
    xmin,xmax,ymin,ymax=_sqrt_overlay_window(plan,xmin,xmax,ymin,ymax)
    refine={'clipRefine':True} if isinstance(plan.get('overlays'),dict) else {}   # the widened window of a square root with overlays is sampled finely (see function_sampling.sample clip_refine)
    if plan.get('equalUnits') is None:return [xmin,xmax,ymin,ymax],refine
    if plan.get('equalUnits') is not True or 'axisScale' in plan or plan.get('axisSqueeze') not in (None,False):raise ValueError('EQUAL_UNITS_INVALID')
    points=[(xmin,ymin),(xmax,ymax),(0.0,0.0),(1.0,0.0),(0.0,1.0)]+[(x,y) for x,y in plan.get('overlayAnchors',[])]
    viewport,height,scale=equal_unit_frame(points,plot_height_limit(plan),1.0)
    if scale<EQUAL_UNITS_MIN_SCALE_PX or (hi-lo)*scale<EQUAL_UNIT_MIN_CURVE_PX:raise ValueError('EQUAL_UNITS_WINDOW_TOO_WIDE')
    return viewport,{'equalUnits':True,'axisRatio':1.0,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height},'clipRefine':True}

def _fit_sqrt_affine_overview(plan):
    constant,slope=_sqrt_coefficients(plan.get('radicand'))
    boundary=-constant/slope
    source_domain=plan.get('sourceDomain')
    if source_domain=={'kind':'NATURAL_SQRT_AFFINE'}:
        mode='NATURAL_SQRT_AFFINE';source_interval=None;source_interval_exact=None
    elif isinstance(source_domain,dict) and set(source_domain)=={'kind','range'} and source_domain.get('kind')=='CLOSED_INTERVAL':
        source_interval=source_domain.get('range')
        if not isinstance(source_interval,list) or len(source_interval)!=2 or any(not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in source_interval):
            raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        try:source_interval_exact=[Fraction(value) for value in source_interval]
        except (ValueError,ZeroDivisionError):raise ValueError('INVALID_SQRT_SOURCE_INTERVAL') from None
        if not source_interval_exact[0]<source_interval_exact[1]:raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        if source_interval_exact[0]<boundary:raise ValueError('SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY')
        source_interval=[float(value) for value in source_interval_exact];mode='CLOSED_INTERVAL'
    else:raise ValueError('SQRT_SOURCE_DOMAIN_UNSUPPORTED')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_domain) or not original_domain[0]<original_domain[1]:raise ValueError('INVALID_SQRT_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:raise ValueError('INVALID_SQRT_VIEWPORT')
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_points=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[key],bool) or not isinstance(point[key],(int,float)) or not math.isfinite(point[key]) or abs(point[key])>1e6 for key in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);exact_x=Fraction(str(point['x']));radicand_value=constant+slope*exact_x
        if radicand_value<0 or point['y']<0 or abs(float(point['y'])**2-float(radicand_value))>1e-8:raise ValueError('REQUIRED_SQRT_POINT_NOT_ON_CURVE')
        required_points.append({'id':point['id'],'x':float(exact_x),'y':float(point['y'])})
    boundary_x=float(boundary)
    if not math.isfinite(boundary_x) or abs(boundary_x)>1e6:raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    if mode=='NATURAL_SQRT_AFFINE':
        span=max(4.0,4.0/math.sqrt(float(slope)),abs(boundary_x)*.25+4.0,*[max(0.0,point['x']-boundary_x)*1.2 for point in required_points])
        lo=boundary_x;hi=max(float(original_domain[1]),boundary_x+span,*[point['x']+span*.1 for point in required_points])
    else:
        lo,hi=source_interval
        if original_domain!=source_interval:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_SOURCE_INTERVAL')
        if any(not lo<=point['x']<=hi for point in required_points):raise ValueError('REQUIRED_SQRT_POINT_OUTSIDE_SOURCE_INTERVAL')
    if lo<boundary_x or not lo<hi:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    def root_y_exact(x_value):
        value=constant+slope*x_value
        if value<0:raise ValueError('SQRT_ENDPOINT_BELOW_NATURAL_BOUNDARY')
        return math.sqrt(float(value))
    def root_y(x_value):
        return root_y_exact(Fraction(str(x_value)))
    if mode=='NATURAL_SQRT_AFFINE':
        endpoints=[{'x':_fraction_text(boundary),'y':0.0,'state':'CLOSED','source':'NATURAL_RADICAND_BOUNDARY'}]
    else:
        endpoints=[{'x':_fraction_text(source_interval_exact[0]),'y':root_y_exact(source_interval_exact[0]),'state':'CLOSED','source':'SOURCE_INTERVAL_START'},{'x':_fraction_text(source_interval_exact[1]),'y':root_y_exact(source_interval_exact[1]),'state':'CLOSED','source':'SOURCE_INTERVAL_END'}]
    endpoint_y=[endpoint['y'] for endpoint in endpoints]
    required_y=[point['y'] for point in required_points]
    hi_y=root_y(hi)
    low=min([0.0,hi_y,*endpoint_y,*required_y]);high=max([0.0,hi_y,*endpoint_y,*required_y])
    yspan=max(1.0,high-low,abs(low),abs(high));ypad=.15*yspan
    xspan=max(1.0,hi-lo);left_margin=.1*xspan;right_margin=0 if mode=='NATURAL_SQRT_AFFINE' else .1*xspan
    xmin=lo-left_margin;xmax=hi+right_margin
    ymin=min(0.0,low)-ypad;ymax=max(0.0,high)+ypad
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,xmin,xmax,ymin,ymax)):raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    features={'schemaVersion':'SQRT_AFFINE_FEATURES_v1','radicandBoundaryX':_fraction_text(boundary),'sourceEndpoints':endpoints,'rightTailDirection':'UP'}
    policy={'schemaVersion':'SQRT_AFFINE_FEATURE_POLICY_v1','sourceDomainMode':mode,'boundaryPolicy':'NATURAL_NONNEGATIVE_RADICAND','endpointState':'CLOSED','rightTailDirection':'UP','endpointMarkerRadiusIntrinsicPx':4,'minimumEndpointMarkerDiameterCssPx':3,'minimumEndpointToTailSpanCssPx':48}
    window,equal_fields=_sqrt_equal_units(plan,xmin,xmax,ymin,ymax,lo,hi)
    fitted={**plan,'domain':[lo,hi],'viewport':window,'shapeIntent':'OVERVIEW','overviewPolicy':'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1','sqrtFeatures':features,'sqrtFeaturePolicy':policy,'requiredPoints':required_points,**equal_fields}
    return {'graphPlan':fitted,'policy':'SQRT_AFFINE_ENDPOINT_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

# ---- General square-root functions y = s*k*sqrt(a(x-p)) + q (sqrt-affine family, GENERAL policy) -------------
# The plan keeps the affine radicand [constant, x coefficient] (the coefficient may now be negative, so the domain is
# x <= p) and adds three optional exact fields: amplitude k (> 0), sign s (+1 or -1) and offset q. Every coefficient is
# an exact rational or p+q*sqrt(r) string. The starting point is (p, q); the branch opens to the right of p when the
# radicand slope is positive and to the left when it is negative.
def _sqrt_affine_general_plan(plan):
    if plan.get('amplitude') is not None or plan.get('sign') is not None or plan.get('offset') is not None:return True
    if plan.get('domainRangeLabels') is not None:return True
    radicand=plan.get('radicand')
    if isinstance(radicand,list) and len(radicand)==2:
        if any(isinstance(value,str) and 'sqrt' in value for value in radicand):return True
        try:
            constant=pp_surd(radicand[0],'UNSUPPORTED_SQRT_AFFINE_GRAMMAR');slope=pp_surd(radicand[1],'UNSUPPORTED_SQRT_AFFINE_GRAMMAR')
        except (ValueError,TypeError):return False
        return slope<0 or not constant.is_Rational or not slope.is_Rational
    return False

def _sqrt_general_surd(value,code):
    try:return pp_surd(value,code)
    except ValueError as error:
        if 'IRRATIONAL_FORM' in str(error):raise ValueError('SQRT_AFFINE_IRRATIONAL_FORM_UNSUPPORTED') from None
        raise

def _sqrt_affine_general_fields(plan):
    radicand=plan.get('radicand')
    if not isinstance(radicand,list) or len(radicand)!=2:
        raise ValueError('UNSUPPORTED_SQRT_AFFINE_GRAMMAR')
    constant=_sqrt_general_surd(radicand[0],'INVALID_SQRT_AFFINE_COEFFICIENT')
    slope=_sqrt_general_surd(radicand[1],'INVALID_SQRT_AFFINE_COEFFICIENT')
    if slope==0:raise ValueError('UNSUPPORTED_SQRT_AFFINE_SLOPE')
    amplitude=_sqrt_general_surd(plan.get('amplitude','1'),'INVALID_SQRT_AMPLITUDE')
    if amplitude.is_real is False or amplitude<=0:raise ValueError('SQRT_AMPLITUDE_MUST_BE_POSITIVE')
    sign=plan.get('sign',1)
    if isinstance(sign,bool) or sign not in (1,-1):raise ValueError('INVALID_SQRT_SIGN')
    offset=_sqrt_general_surd(plan.get('offset','0'),'INVALID_SQRT_OFFSET')
    scale=S.Integer(int(sign))*amplitude
    boundary=-constant/slope
    if boundary.is_real is False:raise ValueError('UNSUPPORTED_SQRT_AFFINE_COEFFICIENT')
    return constant,slope,amplitude,int(sign),offset,scale,boundary

def _sqrt_general_point_on_curve(constant,slope,offset,scale,point):
    try:x_exact=S.Rational(str(point.get('x')))
    except (ValueError,TypeError):x_exact=S.Float(str(point.get('x')),40)
    try:y_exact=S.Rational(str(point.get('y')))
    except (ValueError,TypeError):y_exact=S.Float(str(point.get('y')),40)
    radicand_value=constant+slope*x_exact
    if radicand_value.is_real is False or radicand_value<0:return False
    root_term=(y_exact-offset)/scale
    if root_term.is_real is False or root_term<0:return False
    return abs(S.N(root_term*root_term-radicand_value,40))<S.Float('1e-25',40)

def _fit_sqrt_affine_general_overview(plan):
    constant,slope,amplitude,sign,offset,scale,boundary=_sqrt_affine_general_fields(plan)
    right=slope>0
    boundary_f=float(boundary);offset_f=float(offset)
    source_domain=plan.get('sourceDomain')
    if source_domain=={'kind':'NATURAL_SQRT_AFFINE'}:
        mode='NATURAL_SQRT_AFFINE';source_interval_exact=None
    elif isinstance(source_domain,dict) and set(source_domain)=={'kind','range'} and source_domain.get('kind')=='CLOSED_INTERVAL':
        raw=source_domain.get('range')
        if not isinstance(raw,list) or len(raw)!=2:raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        source_interval_exact=[_pp_rational(value,'INVALID_SQRT_SOURCE_INTERVAL') for value in raw]
        if not source_interval_exact[0]<source_interval_exact[1]:raise ValueError('INVALID_SQRT_SOURCE_INTERVAL')
        if right and source_interval_exact[0]<boundary:raise ValueError('SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY')
        if not right and source_interval_exact[1]>boundary:raise ValueError('SQRT_SOURCE_INTERVAL_BEYOND_NATURAL_BOUNDARY')
        mode='CLOSED_INTERVAL'
    else:raise ValueError('SQRT_SOURCE_DOMAIN_UNSUPPORTED')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_domain) or not original_domain[0]<original_domain[1]:raise ValueError('INVALID_SQRT_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:raise ValueError('INVALID_SQRT_VIEWPORT')
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_points=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[key],bool) or not isinstance(point[key],(int,float)) or not math.isfinite(point[key]) or abs(point[key])>1e6 for key in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        if not _sqrt_general_point_on_curve(constant,slope,offset,scale,point):raise ValueError('REQUIRED_SQRT_POINT_NOT_ON_CURVE')
        ids.add(point['id']);required_points.append({'id':point['id'],'x':float(point['x']),'y':float(point['y'])})
    if not math.isfinite(boundary_f) or abs(boundary_f)>1e6:raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    span=max(4.0,4.0/math.sqrt(abs(float(slope))),abs(boundary_f)*.25+4.0,*[max(0.0,abs(point['x']-boundary_f))*.25+2.0 for point in required_points])
    if mode=='NATURAL_SQRT_AFFINE':
        if right:
            lo=boundary_f
            hi=max(float(original_domain[1]),boundary_f+span,*[point['x']+span*.25 for point in required_points])
        else:
            hi=boundary_f
            lo=min(float(original_domain[0]),boundary_f-span,*[point['x']-span*.25 for point in required_points])
    else:
        lo,hi=(float(value) for value in source_interval_exact)
        if original_domain!=[lo,hi]:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_SOURCE_INTERVAL')
        if any(not lo<=point['x']<=hi for point in required_points):raise ValueError('REQUIRED_SQRT_POINT_OUTSIDE_SOURCE_INTERVAL')
    if right and lo<boundary_f:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    if not right and hi>boundary_f:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    if not lo<hi:raise ValueError('SQRT_DRAW_INTERVAL_MUST_PRESERVE_ENDPOINT')
    def curve_y_exact(x_text):
        radicand_value=constant+slope*S.Rational(x_text)
        if radicand_value<0:raise ValueError('SQRT_ENDPOINT_BELOW_NATURAL_BOUNDARY')
        return offset+scale*S.sqrt(radicand_value)
    if mode=='NATURAL_SQRT_AFFINE':
        endpoints=[{'x':pp_surd_text(boundary),'y':float(offset),'state':'CLOSED','source':'NATURAL_RADICAND_BOUNDARY'}]
    else:
        endpoints=[]
        for value,source_name in ((source_interval_exact[0],'SOURCE_INTERVAL_START'),(source_interval_exact[1],'SOURCE_INTERVAL_END')):
            endpoints.append({'x':str(value),'y':float(curve_y_exact(str(value))),'state':'CLOSED','source':source_name})
    tail_x=hi if right else lo
    try:tail_exact=S.Rational(str(tail_x))
    except (ValueError,TypeError):tail_exact=S.Float(str(tail_x),40)
    tail_value=float(offset+scale*S.sqrt(constant+slope*tail_exact))
    endpoint_y=[endpoint['y'] for endpoint in endpoints]
    required_y=[point['y'] for point in required_points]
    low=min([offset_f,tail_value,*endpoint_y,*required_y]);high=max([offset_f,tail_value,*endpoint_y,*required_y])
    yspan=max(1.0,high-low,abs(high-offset_f));ypad=.15*yspan
    xspan=max(1.0,hi-lo)
    xmin=lo-.1*xspan if right else lo
    xmax=hi if right else hi+.1*xspan
    ymin=low-ypad;ymax=high+ypad
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,xmin,xmax,ymin,ymax)):raise ValueError('UNSUPPORTED_SQRT_NUMERIC_SCOPE')
    tail_direction='UP' if scale>0 else 'DOWN'
    features={'schemaVersion':'SQRT_AFFINE_GENERAL_FEATURES_v1','endpoint':{'x':pp_surd_text(boundary),'y':pp_surd_text(offset)},'radicandBoundaryX':pp_surd_text(boundary),'branchDirection':'RIGHT' if right else 'LEFT','tailDirection':tail_direction,'rangeDirection':'ABOVE' if scale>0 else 'BELOW','sourceEndpoints':endpoints}
    policy={'schemaVersion':'SQRT_AFFINE_GENERAL_FEATURE_POLICY_v1','sourceDomainMode':mode,'boundaryPolicy':'NATURAL_NONNEGATIVE_RADICAND','endpointState':'CLOSED','branchDirection':features['branchDirection'],'tailDirection':tail_direction,'rangeDirection':features['rangeDirection'],'endpointMarkerRadiusIntrinsicPx':4,'minimumEndpointMarkerDiameterCssPx':3,'minimumEndpointToTailSpanCssPx':48}
    window,equal_fields=_sqrt_equal_units(plan,xmin,xmax,ymin,ymax,lo,hi)
    fitted={**plan,'domain':[lo,hi],'viewport':window,'shapeIntent':'OVERVIEW','overviewPolicy':'SQRT_AFFINE_GENERAL_OVERVIEW_v1','sqrtFeatures':features,'sqrtFeaturePolicy':policy,'requiredPoints':required_points,**equal_fields}
    return {'graphPlan':fitted,'policy':'SQRT_AFFINE_GENERAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _fit_absolute_value_overview(plan):
    values=plan.get('coefficients')
    if not isinstance(values,list) or len(values)!=4 or any(not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'-?\d+(?:/\d+)?',value) for value in values):raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_GRAMMAR')
    try:b,a,scale,offset=(Fraction(value) for value in values)
    except (ValueError,ZeroDivisionError):raise ValueError('INVALID_ABSOLUTE_VALUE_COEFFICIENT') from None
    if a==0:raise ValueError('ABSOLUTE_VALUE_NONZERO_INNER_SLOPE_REQUIRED')
    if scale==0:raise ValueError('ABSOLUTE_VALUE_NONZERO_OUTER_SCALE_REQUIRED')
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('ABSOLUTE_VALUE_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    original_domain=plan.get('domain');original_viewport=plan.get('viewport')
    if not isinstance(original_domain,list) or len(original_domain)!=2 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in original_domain) or not original_domain[0]<original_domain[1]:raise ValueError('INVALID_ABSOLUTE_VALUE_DRAW_INTERVAL')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) for v in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:raise ValueError('INVALID_ABSOLUTE_VALUE_VIEWPORT')
    corner=-b/a
    def exact_y(x_value):return scale*abs(a*x_value+b)+offset
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>16:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_points=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids or any(isinstance(point[key],bool) or not isinstance(point[key],(int,float)) or not math.isfinite(point[key]) or abs(point[key])>1e6 for key in ('x','y')):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);exact_x=Fraction(str(point['x']));expected=exact_y(exact_x)
        if abs(float(expected)-point['y'])>1e-8:raise ValueError('REQUIRED_ABSOLUTE_VALUE_POINT_NOT_ON_CURVE')
        required_points.append({'id':point['id'],'x':float(exact_x),'y':float(expected)})
    span=max(4.0,abs(float(original_domain[0])-float(corner)),abs(float(original_domain[1])-float(corner)),4.0/float(abs(a)),*[abs(point['x']-float(corner))*1.2 for point in required_points])
    if not math.isfinite(span) or span<=0 or span>1e6:raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_NUMERIC_SCOPE')
    lo=min([float(corner)-span,*[point['x']-span*.1 for point in required_points]]);hi=max([float(corner)+span,*[point['x']+span*.1 for point in required_points]])
    left_y=float(exact_y(Fraction(str(lo))));right_y=float(exact_y(Fraction(str(hi))));corner_y=float(offset);required_y=[point['y'] for point in required_points]
    low=min(0.0,left_y,right_y,corner_y,*required_y);high=max(0.0,left_y,right_y,corner_y,*required_y);ypad=.18*max(1.0,high-low,abs(low),abs(high))
    xpad=.1*(hi-lo);xmin=lo-xpad;xmax=hi+xpad;ymin=min(0.0,low)-ypad;ymax=max(0.0,high)+ypad
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in (lo,hi,xmin,xmax,ymin,ymax)):raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_NUMERIC_SCOPE')
    threshold=-offset/scale
    if threshold<0:x_intercepts=[]
    elif threshold==0:x_intercepts=[_fraction_text(corner)]
    else:
        delta=threshold/abs(a);x_intercepts=sorted({_fraction_text(corner-delta),_fraction_text(corner+delta)},key=Fraction)
    direction='UP' if scale>0 else 'DOWN'
    features={'schemaVersion':'ABSOLUTE_VALUE_FEATURES_v1','corner':{'x':_fraction_text(corner),'y':_fraction_text(offset),'state':'CLOSED'},'xIntercepts':x_intercepts,'leftTailDirection':direction,'rightTailDirection':direction,'leftArmSlope':_fraction_text(-scale*abs(a)),'rightArmSlope':_fraction_text(scale*abs(a))}
    policy={'schemaVersion':'ABSOLUTE_VALUE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','grammar':'K_ABS_AX_PLUS_B_PLUS_C','cornerMarkerRadiusIntrinsicPx':4,'minimumCornerMarkerDiameterCssPx':3,'minimumArmSpanCssPx':50,'minimumArmRiseCssPx':24}
    fitted={**plan,'domain':[lo,hi],'viewport':[xmin,xmax,ymin,ymax],'shapeIntent':'OVERVIEW','overviewPolicy':'ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1','absoluteFeatures':features,'absoluteFeaturePolicy':policy,'requiredPoints':required_points}
    return {'graphPlan':fitted,'policy':'ABSOLUTE_VALUE_AFFINE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':original_domain,'viewport':original_viewport}}

def _piecewise_fraction(value,code):
    if not isinstance(value,str) or len(value)>64 or not re.fullmatch(r'(?:0|-?[1-9]\d*)(?:/[1-9]\d*)?',value):raise ValueError(code)
    try:parsed=Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None
    if str(parsed)!=value:raise ValueError(code)
    return parsed

def _fit_piecewise_affine_overview(plan):
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or set(source)!={'kind','range'} or source.get('kind')!='CLOSED_INTERVAL' or not isinstance(source.get('range'),list) or len(source['range'])!=2:
        raise ValueError('PIECEWISE_SOURCE_DOMAIN_REQUIRES_CLOSED_INTERVAL')
    lo_exact,hi_exact=(_piecewise_fraction(value,'INVALID_PIECEWISE_SOURCE_ENDPOINT') for value in source['range'])
    if not lo_exact<hi_exact:raise ValueError('INVALID_PIECEWISE_SOURCE_INTERVAL')
    numeric_domain=plan.get('domain')
    if not isinstance(numeric_domain,list) or len(numeric_domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in numeric_domain) or numeric_domain!=[float(lo_exact),float(hi_exact)]:
        raise ValueError('PIECEWISE_DRAW_DOMAIN_MUST_EQUAL_SOURCE_INTERVAL')
    original_viewport=plan.get('viewport')
    if not isinstance(original_viewport,list) or len(original_viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in original_viewport) or not original_viewport[0]<original_viewport[1] or not original_viewport[2]<original_viewport[3]:
        raise ValueError('INVALID_PIECEWISE_VIEWPORT')
    piecewise=plan.get('piecewise')
    if not isinstance(piecewise,dict) or set(piecewise)!={'breakX','owner','left','right'} or piecewise.get('owner') not in {'LEFT','RIGHT'}:
        raise ValueError('INVALID_PIECEWISE_GRAMMAR')
    break_exact=_piecewise_fraction(piecewise.get('breakX'),'INVALID_PIECEWISE_BREAKPOINT')
    if not lo_exact<break_exact<hi_exact:raise ValueError('PIECEWISE_BREAKPOINT_OUTSIDE_SOURCE_INTERIOR')
    branches={}
    for side in ('left','right'):
        raw=piecewise.get(side)
        if not isinstance(raw,list) or len(raw)!=2:raise ValueError('INVALID_PIECEWISE_'+side.upper()+'_BRANCH')
        branches[side]=[_piecewise_fraction(value,'INVALID_PIECEWISE_'+side.upper()+'_COEFFICIENT') for value in raw]
    left_m,left_c=branches['left'];right_m,right_c=branches['right']
    left_value=left_m*break_exact+left_c;right_value=right_m*break_exact+right_c
    left_start=left_m*lo_exact+left_c;right_end=right_m*hi_exact+right_c
    owner_value=left_value if piecewise['owner']=='LEFT' else right_value
    continuous=left_value==right_value
    markers=[{'id':'source-start','kind':'SOURCE_ENDPOINT','x':str(lo_exact),'y':str(left_start),'state':'CLOSED','owner':'LEFT'},
             {'id':'source-end','kind':'SOURCE_ENDPOINT','x':str(hi_exact),'y':str(right_end),'state':'CLOSED','owner':'RIGHT'}]
    if continuous:
        markers.append({'id':'breakpoint-closed','kind':'BREAKPOINT','x':str(break_exact),'y':str(owner_value),'state':'CLOSED','owner':piecewise['owner']})
    else:
        non_owner='RIGHT' if piecewise['owner']=='LEFT' else 'LEFT'
        markers.extend([
            {'id':'breakpoint-owner-closed','kind':'BREAKPOINT','x':str(break_exact),'y':str(owner_value),'state':'CLOSED','owner':piecewise['owner']},
            {'id':'breakpoint-limit-open','kind':'BREAKPOINT','x':str(break_exact),'y':str(right_value if non_owner=='RIGHT' else left_value),'state':'OPEN','owner':non_owner}
        ])
    endpoint_values=[float(left_start),float(right_end),float(left_value),float(right_value)]
    low=min(0.0,*endpoint_values);high=max(0.0,*endpoint_values)
    ypad=.15*max(1.0,high-low,abs(low),abs(high))
    xspan=float(hi_exact-lo_exact);xpad=.04*xspan
    viewport=[float(lo_exact)-xpad,float(hi_exact)+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in viewport):raise ValueError('UNSUPPORTED_PIECEWISE_NUMERIC_SCOPE')
    feature_policy={'schemaVersion':'PIECEWISE_AFFINE_FEATURE_POLICY_v1','sourceDomainMode':'CLOSED_INTERVAL','breakpointOwnership':piecewise['owner'],'outerEndpointState':'CLOSED','jumpPolicy':'OWNER_CLOSED_OTHER_LIMIT_OPEN','continuousJoinPolicy':'ONE_CLOSED_MARKER','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3,'minimumBranchSpanCssPx':32}
    features={'schemaVersion':'PIECEWISE_AFFINE_FEATURES_v1','sourceInterval':{'lo':str(lo_exact),'hi':str(hi_exact),'startState':'CLOSED','endState':'CLOSED'},'breakpoint':{'x':str(break_exact),'owner':piecewise['owner'],'leftLimitY':str(left_value),'rightLimitY':str(right_value),'valueY':str(owner_value),'continuity':'CONTINUOUS' if continuous else 'JUMP'},'markers':markers}
    fitted={**plan,'domain':[float(lo_exact),float(hi_exact)],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'PIECEWISE_AFFINE_TWO_BRANCH_OVERVIEW_v1','piecewiseFeatures':features,'piecewiseFeaturePolicy':feature_policy}
    return {'graphPlan':fitted,'policy':'PIECEWISE_AFFINE_TWO_BRANCH_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':numeric_domain,'viewport':original_viewport}}

def _exp_log_coefficients(values,arity,code):
    if not isinstance(values,list) or len(values)!=arity:raise ValueError(code+'_GRAMMAR_UNSUPPORTED')
    parsed=[_piecewise_fraction(value,code+'_COEFFICIENT_INVALID') for value in values]
    return parsed

def _valid_exp_log_display(plan,code):
    domain=plan.get('domain');viewport=plan.get('viewport')
    if not isinstance(domain,list) or len(domain)!=2 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in domain) or not domain[0]<domain[1]:raise ValueError('INVALID_'+code+'_DRAW_INTERVAL')
    if not isinstance(viewport,list) or len(viewport)!=4 or any(isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) for value in viewport) or not viewport[0]<viewport[1] or not viewport[2]<viewport[3]:raise ValueError('INVALID_'+code+'_VIEWPORT')

def exp_log_base(value,code):
    """The exact base of a base-a exponential/logarithm: a positive integer, a reduced fraction of positive integers, or sqrt(n) with n a
    square-free integer > 1. None means the natural base e. Symbolic, nested, decimal and non-positive bases are refused."""
    if value is None:return None
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

def natural_exp_log_base():
    """The natural base e represented in the base features (used only when a shift is given without an explicit base)."""
    return {'text':'e','kind':'NATURAL','exact':S.E,'greaterThanOne':True,'float':math.e}

def exp_log_shift(value,code):
    if value is None:return Fraction(0),'0'
    parsed=_piecewise_fraction(value,code)
    return parsed,_fraction_text(parsed)

def _exp_log_base_features(base):
    return {'base':base['text'],'baseKind':base['kind'],'baseGreaterThanOne':base['greaterThanOne']}

def _fit_exponential_base_overview(plan):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    _valid_exp_log_display(plan,'EXPONENTIAL')
    base=exp_log_base(plan.get('base'),'EXPONENTIAL') or natural_exp_log_base()
    a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'EXPONENTIAL')
    shift,shift_text=exp_log_shift(plan.get('shiftX'),'EXPONENTIAL_SHIFT_INVALID')
    if a==0 or k==0:raise ValueError('EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED')
    rate=abs(float(k)*math.log(base['float']))
    if not math.isfinite(rate) or rate<=0 or rate>1e6:raise ValueError('EXPONENTIAL_BASE_RATE_INVALID')
    radius=3/rate;lo=float(shift)-radius;hi=float(shift)+radius
    def evaluate(value):
        try:result=float(a)*(base['float']**(float(k)*(value-float(shift))))+float(c)
        except OverflowError:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE') from None
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE')
        return result
    endpoint_values=[evaluate(lo),evaluate(hi)];reference_y=float(a+c);low=min(float(c),reference_y,*endpoint_values);high=max(float(c),reference_y,*endpoint_values);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    growth_positive=(k>0)==base['greaterThanOne']
    features={'schemaVersion':'EXPONENTIAL_BASE_FEATURES_v1',**_exp_log_base_features(base),'shiftX':shift_text,'referencePoint':{'x':_fraction_text(shift),'y':_fraction_text(a+c)},'horizontalAsymptote':{'y':_fraction_text(c),'side':'LEFT' if growth_positive else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if (a>0)==growth_positive else 'DECREASING','growthSide':'RIGHT' if growth_positive else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
    policy={'schemaVersion':'EXPONENTIAL_BASE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','referenceArgument':'EXPONENT_ZERO','asymptotePolicy':'EXACT_VERTICAL_SHIFT','basePolicy':'POSITIVE_BASE_NOT_ONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumAsymptoteSeparationCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'base':base['text'],'shiftX':shift_text,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'EXPONENTIAL_BASE_OVERVIEW_v1','exponentialFeatures':features,'exponentialFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'EXPONENTIAL_BASE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _fit_logarithmic_base_overview(plan):
    if plan.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
    _valid_exp_log_display(plan,'LOGARITHMIC')
    base=exp_log_base(plan.get('base'),'LOGARITHMIC') or natural_exp_log_base()
    a,k,b,c=_exp_log_coefficients(plan.get('coefficients'),4,'LOGARITHMIC')
    if a==0 or k==0:raise ValueError('LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    root=-b/k;reference=(1-b)/k;root_f=float(root);reference_f=float(reference);rate=abs(float(k));epsilon=.125/rate
    if k>0:lo=root_f+epsilon;hi=reference_f+3/rate
    else:lo=reference_f-3/rate;hi=root_f-epsilon
    if not lo<hi:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_INVALID')
    log_base=math.log(base['float'])
    def evaluate(value):
        argument=float(k)*value+float(b)
        if argument<=0:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_CROSSES_DOMAIN_BOUNDARY')
        try:result=float(a)*math.log(argument)/log_base+float(c)
        except (ValueError,ZeroDivisionError,OverflowError):raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE') from None
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE')
        return result
    start_y=evaluate(lo);end_y=evaluate(hi);reference_y=float(c);low=min(0.0,start_y,end_y,reference_y);high=max(0.0,start_y,end_y,reference_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=max(.16*(hi-lo),.5/rate)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    increasing=(a*k>0)==base['greaterThanOne']
    features={'schemaVersion':'LOGARITHMIC_BASE_FEATURES_v1',**_exp_log_base_features(base),'naturalDomainBoundaryX':_fraction_text(root),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':_fraction_text(reference),'y':_fraction_text(c),'argument':'1'},'monotonicity':'INCREASING' if increasing else 'DECREASING','sampleBoundaryArgument':'1/8','sampleDomain':[lo,hi]}
    policy={'schemaVersion':'LOGARITHMIC_BASE_FEATURE_POLICY_v1','sourceDomain':'kx+b>0','domainBoundaryPolicy':'NATURAL_OPEN_BOUNDARY','referenceArgument':'1','sampleBoundaryArgument':'1/8','boundaryCue':'DASHED_VERTICAL_LINE','basePolicy':'POSITIVE_BASE_NOT_ONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'base':base['text'],'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'LOGARITHMIC_BASE_OVERVIEW_v1','logarithmicFeatures':features,'logarithmicFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'LOGARITHMIC_BASE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _exp_log_curve_spec(row,index,code):
    if not isinstance(row,dict):raise ValueError(code)
    allowed={'id','family','base','coefficients','sourceDomain','shiftX'}
    if set(row)-allowed:raise ValueError(code)
    curve_id=row.get('id')
    if not isinstance(curve_id,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',curve_id):raise ValueError(code+'_ID_INVALID')
    family=row.get('family')
    if family not in {'exponential-affine','logarithmic-affine'}:raise ValueError(code+'_FAMILY_UNSUPPORTED')
    base=exp_log_base(row.get('base'),'EXP_LOG_PAIR') or natural_exp_log_base()
    coefficients=_exp_log_coefficients(row.get('coefficients'),3 if family=='exponential-affine' else 4,'EXP_LOG_PAIR')
    if coefficients[0]==0 or coefficients[1]==0:raise ValueError(code+'_NONZERO_SCALE_AND_RATE_REQUIRED')
    if family=='exponential-affine':
        if row.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
        shift,shift_text=exp_log_shift(row.get('shiftX'),'EXP_LOG_PAIR_SHIFT_INVALID')
        return {'id':curve_id,'family':family,'base':base,'coefficients':coefficients,'shift':shift,'shiftText':shift_text}
    if row.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
    if row.get('shiftX') is not None:raise ValueError(code+'_SHIFT_UNSUPPORTED')
    a,k,b,c=coefficients
    return {'id':curve_id,'family':family,'base':base,'coefficients':coefficients,'boundary':-b/k,'reference':(1-b)/k}

def _fit_exp_log_pair_overview(plan):
    code='EXP_LOG_PAIR_PLAN_INVALID'
    if plan.get('sourceDomain') is not None or plan.get('domain') is not None or plan.get('viewport') is not None:raise ValueError(code)
    rows=plan.get('curves')
    if not isinstance(rows,list) or len(rows)!=2:raise ValueError(code)
    curves=[_exp_log_curve_spec(row,index,code) for index,row in enumerate(rows)]
    if len({row['id'] for row in curves})!=2:raise ValueError(code+'_ID_DUPLICATE')
    identity=plan.get('identityLine',False)
    if not isinstance(identity,bool):raise ValueError(code+'_IDENTITY_LINE_INVALID')
    spans=[]
    for row in curves:
        base=row['base'];a,k,c=row['coefficients'][:3]
        if row['family']=='exponential-affine':
            rate=abs(float(k)*math.log(base['float']))
            if not math.isfinite(rate) or rate<=0:raise ValueError('EXP_LOG_PAIR_SCALE_UNSUPPORTED')
            half=3/rate
            if not math.isfinite(half) or half>8:raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
            row['display']=(float(row['shift'])-half,float(row['shift'])+half)
            row['referencePoint']=(float(row['shift']),float(a+c))
        else:
            rate=abs(float(k));half=3/rate;epsilon=.125/rate
            if k>0:row['display']=(float(row['boundary'])+epsilon,float(row['reference'])+half)
            else:row['display']=(float(row['reference'])-half,float(row['boundary'])-epsilon)
            row['referencePoint']=(float(row['reference']),float(c))
        lo_display,hi_display=row['display']
        if not (math.isfinite(lo_display) and math.isfinite(hi_display) and lo_display<hi_display):raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
        spans.append((lo_display,hi_display))
    lo=max(spans[0][0],spans[1][0]);hi=min(spans[0][1],spans[1][1])
    if not lo<hi:raise ValueError('EXP_LOG_PAIR_NO_SHARED_WINDOW')
    anchors=[row['referencePoint'][0] for row in curves]
    lo=min(lo,*anchors);hi=max(hi,*anchors)
    if not math.isfinite(lo) or not math.isfinite(hi) or hi-lo>16:raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
    pad=max(.75,.18*(hi-lo));lo-=pad;hi+=pad
    def exp_value(row,value):
        a,k,c=row['coefficients'];base=row['base']['float']
        try:result=float(a)*(base**(float(k)*(value-float(row['shift']))))+float(c)
        except OverflowError:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE') from None
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE')
        return result
    def log_value(row,value):
        a,k,b,c=row['coefficients'];argument=float(k)*value+float(b)
        if argument<=0:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_CROSSES_DOMAIN_BOUNDARY')
        result=float(a)*math.log(argument)/math.log(row['base']['float'])+float(c)
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE')
        return result
    feature_rows=[];ys=[0.0,lo,hi]
    for row in curves:
        draw_lo=max(lo,row['display'][0]);draw_hi=min(hi,row['display'][1])
        if not draw_lo<draw_hi:raise ValueError('EXP_LOG_PAIR_NO_SHARED_WINDOW')
        if row['family']=='exponential-affine':
            values=[exp_value(row,draw_lo),exp_value(row,draw_hi),row['referencePoint'][1],float(row['coefficients'][2])]
            growth_positive=(row['coefficients'][1]>0)==row['base']['greaterThanOne'];a=row['coefficients'][0];c=row['coefficients'][2]
            feature_rows.append({'id':row['id'],'family':row['family'],**_exp_log_base_features(row['base']),'coefficients':[_fraction_text(value) for value in row['coefficients']],'shiftX':row['shiftText'],'domain':[draw_lo,draw_hi],'referencePoint':{'x':_fraction_text(row['shift']),'y':_fraction_text(a+c)},'horizontalAsymptote':{'y':_fraction_text(c),'side':'LEFT' if growth_positive else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if (a>0)==growth_positive else 'DECREASING','growthSide':'RIGHT' if growth_positive else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'})
        else:
            values=[log_value(row,draw_lo),log_value(row,draw_hi),row['referencePoint'][1]]
            a,k,b,c=row['coefficients'];increasing=(a*k>0)==row['base']['greaterThanOne']
            feature_rows.append({'id':row['id'],'family':row['family'],**_exp_log_base_features(row['base']),'coefficients':[_fraction_text(value) for value in row['coefficients']],'domain':[draw_lo,draw_hi],'naturalDomainBoundaryX':_fraction_text(row['boundary']),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':_fraction_text(row['reference']),'y':_fraction_text(c),'argument':'1'},'monotonicity':'INCREASING' if increasing else 'DECREASING'})
        ys.extend(values)
    # The inverse-pair figure is drawn at ONE scale on both axes (the dashed y=x must read at 45 degrees). The display window keeps both
    # reference points, the identity line over the shared x window, and enough height for both curves to be recognisable; the sampler clips
    # the parts above/below this window.
    anchors=[0.0,lo,hi,*[row['referencePoint'][1] for row in curves]]
    center=(min(anchors)+max(anchors))/2;half=max((hi-lo)*.8,(max(anchors)-min(anchors))/2+.15)
    low=center-half;high=center+half
    viewport=[lo,hi,low,high]
    if not all(math.isfinite(value) and abs(value)<=1e8 for value in viewport):raise ValueError('EXP_LOG_PAIR_WINDOW_TOO_WIDE')
    features={'schemaVersion':'EXP_LOG_PAIR_FEATURES_v1','identityLine':identity,'curves':feature_rows,'sampleBoundaryArgument':'1/8'}
    policy={'schemaVersion':'EXP_LOG_PAIR_POLICY_v1','identityLinePolicy':'DASHED_4_3' if identity else 'NONE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32,'minimumAsymptoteSeparationCssPx':2}
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'EXP_LOG_PAIR_OVERVIEW_v1','expLogPairFeatures':features,'expLogPairPolicy':policy,'equalUnits':True,'axisRatio':1}
    return {'graphPlan':fitted,'policy':'EXP_LOG_PAIR_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':None,'viewport':None}}

def _fit_exponential_affine_overview(plan):
    if plan.get('sourceDomain')!={'kind':'ALL_REALS'}:raise ValueError('EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS')
    _valid_exp_log_display(plan,'EXPONENTIAL')
    a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'EXPONENTIAL')
    if a==0 or k==0:raise ValueError('EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED')
    radius=3/abs(float(k));lo,hi=-radius,radius
    def evaluate(value):
        result=float(a)*math.exp(float(k)*value)+float(c)
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_EXPONENTIAL_NUMERIC_SCOPE')
        return result
    endpoint_values=[evaluate(lo),evaluate(hi)];reference=float(a+c);low=min(float(c),reference,*endpoint_values);high=max(float(c),reference,*endpoint_values);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    features={'schemaVersion':'EXPONENTIAL_AFFINE_FEATURES_v1','referencePoint':{'x':'0','y':_fraction_text(a+c)},'horizontalAsymptote':{'y':_fraction_text(c),'side':'LEFT' if k>0 else 'RIGHT','approachedFrom':'ABOVE' if a>0 else 'BELOW'},'monotonicity':'INCREASING' if a*k>0 else 'DECREASING','growthSide':'RIGHT' if k>0 else 'LEFT','growthDirection':'UP' if a>0 else 'DOWN'}
    policy={'schemaVersion':'EXPONENTIAL_AFFINE_FEATURE_POLICY_v1','sourceDomain':'ALL_REALS','referenceArgument':'EXPONENT_ZERO','asymptotePolicy':'EXACT_VERTICAL_SHIFT','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumAsymptoteSeparationCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'EXPONENTIAL_AFFINE_OVERVIEW_v1','exponentialFeatures':features,'exponentialFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'EXPONENTIAL_AFFINE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _fit_logarithmic_affine_overview(plan):
    if plan.get('sourceDomain')!={'kind':'NATURAL_LOG_AFFINE'}:raise ValueError('LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE')
    _valid_exp_log_display(plan,'LOGARITHMIC')
    a,k,b,c=_exp_log_coefficients(plan.get('coefficients'),4,'LOGARITHMIC')
    if a==0 or k==0:raise ValueError('LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    root=-b/k;reference=(1-b)/k;root_f=float(root);reference_f=float(reference);rate=abs(float(k));epsilon=.125/rate
    if k>0:lo=root_f+epsilon;hi=reference_f+3/rate
    else:lo=reference_f-3/rate;hi=root_f-epsilon
    if not lo<hi:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_INVALID')
    def evaluate(value):
        argument=float(k)*value+float(b)
        if argument<=0:raise ValueError('LOGARITHMIC_DRAW_INTERVAL_CROSSES_DOMAIN_BOUNDARY')
        result=float(a)*math.log(argument)+float(c)
        if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_LOGARITHMIC_NUMERIC_SCOPE')
        return result
    start_y=evaluate(lo);end_y=evaluate(hi);reference_y=float(c);low=min(0.0,start_y,end_y,reference_y);high=max(0.0,start_y,end_y,reference_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=max(.16*(hi-lo),.5/rate)
    viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
    features={'schemaVersion':'LOGARITHMIC_AFFINE_FEATURES_v1','naturalDomainBoundaryX':_fraction_text(root),'boundarySide':'RIGHT' if k>0 else 'LEFT','boundaryLimitDirection':'DOWN' if a>0 else 'UP','referencePoint':{'x':_fraction_text(reference),'y':_fraction_text(c),'argument':'1'},'monotonicity':'INCREASING' if a*k>0 else 'DECREASING','sampleBoundaryArgument':'1/8','sampleDomain':[lo,hi]}
    policy={'schemaVersion':'LOGARITHMIC_AFFINE_FEATURE_POLICY_v1','sourceDomain':'kx+b>0','domainBoundaryPolicy':'NATURAL_OPEN_BOUNDARY','referenceArgument':'1','sampleBoundaryArgument':'1/8','boundaryCue':'DASHED_VERTICAL_LINE','referenceMarkerRadiusIntrinsicPx':4,'minimumReferenceMarkerDiameterCssPx':3,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':32}
    fitted={**plan,'domain':[lo,hi],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'LOGARITHMIC_AFFINE_OVERVIEW_v1','logarithmicFeatures':features,'logarithmicFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'LOGARITHMIC_AFFINE_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

# ---- sine / cosine on an explicit interval (several periods) with horizontal or slanted reference lines -----------------------------------
# sourceDomain {kind:'INTERVAL_PI',rangePi:[lo,hi],states:[start,end]} (exact multiples of pi) replaces the one-period window; referenceLines
# [{id,y}|{id,slope,intercept}] each carry the author's claim intersectionCount. The engine finds every crossing (closed form for a horizontal
# line, sign-change bisection for a slanted one); the observer finds them again with SymPy and refuses a different count or position.
TRIG_INTERVAL_MAX_PERIODS=12
TRIG_INTERVAL_MAX_CROSSINGS=40

TRIG_LINE_ROW_KEYS={'id','y','x','slope','intercept','intersectionCount','color','endCrossing','perPi'}
TRIG_LINE_COLORS=('BLUE','WARM','GREEN','ROSE','VIOLET')   # the colour-group palette of the function curves and overlay lines (visual_engine/palette.py)

def trig_level(value,code):
    """An exact horizontal level: a rational string, or p+q*sqrt(r) in the exact-value grammar (y=-sqrt(3)/2). Rational -> Fraction, surd -> SymPy number."""
    if isinstance(value,str) and re.fullmatch(r'(?:0|-?[1-9]\d*)(?:/[1-9]\d*)?',value):return _piecewise_fraction(value,code)
    if isinstance(value,str) and 'sqrt' in value:
        number=pp_surd(value,code)
        if number.is_Rational:raise ValueError(code)
        return number
    raise ValueError(code)

def trig_level_text(value):
    return str(value) if isinstance(value,Fraction) else pp_surd_text(value)

def trig_line_specs(plan,code='TRIG_LINE'):
    rows=plan.get('referenceLines')
    if rows is None:return []
    if not isinstance(rows,list) or len(rows)>3:raise ValueError('TRIG_REFERENCE_LINES_INVALID')
    out=[];seen=set()
    for row in rows:
        if not isinstance(row,dict) or not isinstance(row.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',row['id']) or row['id'] in seen:raise ValueError('TRIG_REFERENCE_LINES_INVALID')
        seen.add(row['id'])
        count=row.get('intersectionCount')
        if isinstance(count,bool) or not isinstance(count,int) or not 0<=count<=TRIG_INTERVAL_MAX_CROSSINGS:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_INVALID:'+row['id'])
        if set(row)-TRIG_LINE_ROW_KEYS:raise ValueError('TRIG_REFERENCE_LINES_INVALID')
        color=row.get('color')
        if color is not None and color not in TRIG_LINE_COLORS:raise ValueError('TRIG_LINE_COLOR_INVALID:'+row['id'])
        end_crossing=row.get('endCrossing')
        if end_crossing is not None and not isinstance(end_crossing,bool):raise ValueError('TRIG_LINE_END_CROSSING_INVALID:'+row['id'])
        per_pi=row.get('perPi')
        if per_pi is not None and (not isinstance(per_pi,bool) or 'slope' not in row):raise ValueError('TRIG_LINE_FORM_INVALID:'+row['id'])   # perPi: the slope is measured per pi of x (y=2x/(n*pi) is slope 2/n per pi)
        common={'id':row['id'],'claim':count,'color':color,'endCrossing':end_crossing is True,'vertical':False,'perPi':per_pi is True}
        if 'x' in row:
            if 'y' in row or 'slope' in row or 'intercept' in row:raise ValueError('TRIG_LINE_FORM_INVALID:'+row['id'])
            if count>1:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_INVALID:'+row['id'])
            out.append({**common,'slope':None,'intercept':None,'x':_piecewise_fraction(row['x'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id']),'horizontal':False,'vertical':True})
        elif 'y' in row:
            if 'slope' in row or 'intercept' in row:raise ValueError('TRIG_LINE_FORM_INVALID:'+row['id'])
            out.append({**common,'slope':Fraction(0),'intercept':trig_level(row['y'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id']),'horizontal':True})
        else:
            if 'slope' not in row or 'intercept' not in row:raise ValueError('TRIG_LINE_FORM_INVALID:'+row['id'])
            slope=_piecewise_fraction(row['slope'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id']);intercept=_piecewise_fraction(row['intercept'],'TRIG_LINE_COEFFICIENT_INVALID:'+row['id'])
            if slope==0:raise ValueError('TRIG_LINE_SLOPE_ZERO:'+row['id'])
            out.append({**common,'slope':slope,'intercept':intercept,'horizontal':False})
    return out

def trig_interval_source(plan):
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or set(source)-{'kind','rangePi','states'} or not isinstance(source.get('rangePi'),list) or len(source['rangePi'])!=2:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi=(_piecewise_fraction(value,'INVALID_TRIG_INTERVAL') for value in source['rangePi'])
    states=source.get('states',['CLOSED','CLOSED'])
    if not lo<hi or not isinstance(states,list) or len(states)!=2 or any(state not in {'OPEN','CLOSED'} for state in states):raise ValueError('INVALID_TRIG_INTERVAL')
    return lo,hi,list(states)

def trig_line_crossings(function,a,rate,phase,c,x0,x1,states,line,absolute=False):
    """Every x (radians, x0<x<x1) where a*F(rate*x+phase)+c meets the line, with its y. Closed form for a horizontal line, sign changes for a
    slanted one. rate and phase are already the effective radian rate and phase (pi already folded in)."""
    def inside(x):
        eps=1e-9*max(1.0,abs(x))
        return (x>x0+eps if states[0]=='OPEN' else x>=x0-eps) and (x<x1-eps if states[1]=='OPEN' else x<=x1+eps)
    found=[]
    if line.get('vertical'):
        # x=c: one crossing, the curve's value at c, when c lies inside the interval (an open end is not in it)
        rate_f=float(rate);shift=float(phase);fn=math.sin if function=='SIN' else math.cos
        xc=float(line['x'])*(math.pi if line['axisUnit']=='PI' else 1.0)
        value=float(a)*fn(rate_f*xc+shift);value=abs(value) if absolute else value
        return [(xc,value+float(c))] if inside(xc) else []
    slope,intercept=float(line['slope']),float(line['intercept'])
    if line.get('perPi'):slope=slope/math.pi   # the slope was written per pi of x
    if line['horizontal']:
        t=(intercept-float(c))/float(a)
        if (0<=t+1e-12 if absolute else True) and abs(t)<=1:
            t=max(t,0.0) if absolute else t
            base=math.asin(t) if function=='SIN' else math.acos(t)
            thetas=[base,math.pi-base] if function=='SIN' else [base,-base]
            rate_f=float(rate);shift=float(phase);period=math.pi if absolute else 2*math.pi   # |F|=t repeats every pi (F=t and F=-t interleave)
            reach=sorted([rate_f*x0+shift,rate_f*x1+shift])
            for theta in thetas:
                first=math.floor((reach[0]-theta)/period)-1;last=math.ceil((reach[1]-theta)/period)+1
                for j in range(first,last+1):found.append((theta+period*j-shift)/rate_f)
    else:
        rate_f=float(rate);shift=float(phase);af=float(a);cf=float(c);fn=(lambda v:abs(math.sin(v))) if (absolute and function=='SIN') else (lambda v:abs(math.cos(v))) if absolute else math.sin if function=='SIN' else math.cos
        gap=lambda x:af*fn(rate_f*x+shift)+cf-(slope*x+intercept)
        steps=max(2000,int(400*(x1-x0)/math.pi));previous=x0;value=gap(previous)
        for index in range(1,steps+1):
            current=x0+(x1-x0)*index/steps;now=gap(current)
            if value==0:found.append(previous)
            elif value*now<0:
                left,right,gl=previous,current,value
                for _ in range(80):
                    mid=(left+right)/2;gm=gap(mid)
                    if gl*gm<=0:right=mid
                    else:left,gl=mid,gm
                found.append((left+right)/2)
            previous,value=current,now
        if value==0:found.append(previous)
    unique=[]
    for x in sorted(found):
        if inside(x) and (not unique or x-unique[-1]>1e-7*max(1.0,abs(x))):unique.append(x)
    return [(x,slope*x+intercept) for x in unique]

def _fit_trigonometric_interval(plan,function):
    if function not in {'SIN','COS'}:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi,states=trig_interval_source(plan)
    if 'domain' in plan or 'viewport' in plan:
        _valid_exp_log_display(plan,'TRIGONOMETRIC')
    a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'TRIGONOMETRIC');phase=_piecewise_fraction(plan.get('phasePi'),'INVALID_TRIGONOMETRIC_PHASE')
    if a==0 or k==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    rate=abs(k);periods=(hi-lo)*rate/2
    if periods<Fraction(1,4) or periods>TRIG_INTERVAL_MAX_PERIODS:raise ValueError('TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
    x0,x1=float(lo)*math.pi,float(hi)*math.pi
    rows=[];ys=[float(c-abs(a)),float(c+abs(a)),0.0]
    for line in trig_line_specs(plan):
        crossings=trig_line_crossings(function,float(a),float(k),float(phase)*math.pi,float(c),x0,x1,states,line)
        if len(crossings)!=line['claim']:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:'+line['id']+':engine finds '+str(len(crossings))+' intersection(s)')
        for x,_ in crossings:
            if (states[0]=='CLOSED' and abs(x-x0)<1e-9) or (states[1]=='CLOSED' and abs(x-x1)<1e-9):raise ValueError('TRIG_LINE_THROUGH_INTERVAL_END:'+line['id'])
        ys.append(float(line['intercept']) if line['horizontal'] else 0.0);ys.extend(y for _,y in crossings)
        rows.append({'id':line['id'],'kind':'HORIZONTAL' if line['horizontal'] else 'SLANTED','slope':str(line['slope']),'intercept':str(line['intercept']),'intersections':[{'x':x,'y':y} for x,y in crossings]})
    evaluator=math.sin if function=='SIN' else math.cos
    end_y=[float(a)*evaluator(float(k)*x+float(phase)*math.pi)+float(c) for x in (x0,x1)]
    xpad=max(.04*(x1-x0),.3);low=min(ys);high=max(ys);ypad=.18*max(1.0,high-low)
    viewport=[x0-xpad,x1+xpad,low-ypad,high+ypad]
    features={'schemaVersion':'TRIGONOMETRIC_INTERVAL_FEATURES_v1','function':function,'phasePi':str(phase),'periodPiMultiple':str(Fraction(2,1)/rate),'amplitude':str(a),'midline':str(c),'sourceInterval':{'loPi':str(lo),'hiPi':str(hi),'states':states},'lines':rows}
    policy={'schemaVersion':'TRIGONOMETRIC_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':3.2,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':40,'minimumAmplitudeCssPx':20}
    interval={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':repr(x0),'y':repr(end_y[0]),'state':states[0]},{'side':'END','x':repr(x1),'y':repr(end_y[1]),'state':states[1]}]}
    interval_policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in [x0,x1,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
    fitted={**plan,'domain':[x0,x1],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v1','trigIntervalFeatures':features,'trigIntervalPolicy':policy,'intervalFeatures':interval,'intervalFeaturePolicy':interval_policy}
    return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

# ---- general trigonometric parameters (rate or phase carrying pi, plain x interval, tan branches) --------------------------------
# The v1 grammar above stays byte-compatible. The additive grammar is:
#   graphPlan.ratePi  an exact rational m: the rate is m*pi and coefficients are [A,C] (rate without pi stays [A,k,C]).
#   graphPlan.phase   an exact rational phase in radians; phasePi stays the phase as a rational multiple of pi (exactly one is given).
#   sourceDomain {kind:'INTERVAL',range:[lo,hi],states:[start,end]} measures x in plain units (a time or month axis) and requires ratePi.
#   sourceDomain {kind:'INTERVAL_PI',...} keeps the pi-unit x axis; a rate carrying pi is refused there.
#   keyPoints:true marks every exact extremum and midline crossing inside the interval (SIN/COS with a pi-multiple phase).
#   axisTickPi:true labels the x ticks (axisTickValues.x, exact multiples of pi) as pi/2, pi, 3*pi/2 on a pi-unit axis.
TRIG_KEY_POINT_MAX=60

def trig_spec(plan):
    """The exact general trigonometric parameters, parsed once for the several display forms."""
    function=plan.get('function')
    if function not in {'SIN','COS','TAN'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
    coefficients=plan.get('coefficients');rate_field=plan.get('ratePi')
    if rate_field is not None:
        rate=_piecewise_fraction(rate_field,'INVALID_TRIGONOMETRIC_RATE')
        if not isinstance(coefficients,list) or len(coefficients)!=2:raise ValueError('TRIG_GRAMMAR_UNSUPPORTED')
        a,c=(_piecewise_fraction(value,'TRIGONOMETRIC_COEFFICIENT_INVALID') for value in coefficients)
        rate_has_pi=True
    else:
        if not isinstance(coefficients,list) or len(coefficients)!=3:raise ValueError('TRIG_GRAMMAR_UNSUPPORTED')
        a,rate,c=(_piecewise_fraction(value,'TRIGONOMETRIC_COEFFICIENT_INVALID') for value in coefficients)
        rate_has_pi=False
    phase_pi=plan.get('phasePi');phase_plain=plan.get('phase')
    if (phase_pi is None)==(phase_plain is None):raise ValueError('INVALID_TRIGONOMETRIC_PHASE')
    if phase_pi is not None:
        phase=_piecewise_fraction(phase_pi,'INVALID_TRIGONOMETRIC_PHASE');phase_has_pi=True
    else:
        phase=_piecewise_fraction(phase_plain,'INVALID_TRIGONOMETRIC_PHASE');phase_has_pi=False
    if a==0 or rate==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
    absolute=plan.get('absolute')
    if absolute is not None and not isinstance(absolute,bool):raise ValueError('INVALID_TRIG_ABSOLUTE_FLAG')
    return {'function':function,'a':a,'c':c,'rate':rate,'rateHasPi':rate_has_pi,'phase':phase,'phaseHasPi':phase_has_pi,'absolute':absolute is True}

def trig_effective(spec):
    """The radian rate and phase (the pi factors folded in) used by display and evaluation."""
    rate=float(spec['rate'])*(math.pi if spec['rateHasPi'] else 1.0)
    phase=float(spec['phase'])*(math.pi if spec['phaseHasPi'] else 1.0)
    return rate,phase

def trig_axis_period(spec):
    """One period measured in axis units: 2/|rate| (SIN/COS) or 1/|rate| (TAN) whichever unit the pi factor and the interval use."""
    if spec['function'] in {'SIN','COS'} and not spec.get('absolute'):return Fraction(2,1)/abs(spec['rate'])
    return Fraction(1,1)/abs(spec['rate'])   # tan, and |sin| / |cos| (folded: half the plain period)

def trig_interval_v2_source(plan):
    source=plan.get('sourceDomain')
    if not isinstance(source,dict) or source.get('kind') not in {'INTERVAL','INTERVAL_PI'}:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    kind=source['kind'];key='range' if kind=='INTERVAL' else 'rangePi'
    if set(source)-{'kind',key,'states'} or not isinstance(source.get(key),list) or len(source[key])!=2:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    lo,hi=(_piecewise_fraction(value,'INVALID_TRIG_INTERVAL') for value in source[key])
    states=source.get('states',['CLOSED','CLOSED'])
    if not lo<hi or not isinstance(states,list) or len(states)!=2 or any(state not in {'OPEN','CLOSED'} for state in states):raise ValueError('INVALID_TRIG_INTERVAL')
    return kind,lo,hi,list(states)

def trig_key_points(spec,lo,hi,states):
    """Every extremum and midline crossing inside the interval, with exact axis coordinates (phase must be a pi multiple)."""
    if spec['function'] not in {'SIN','COS'}:raise ValueError('TRIG_KEY_POINTS_REQUIRE_SIN_COS')
    if not spec['phaseHasPi']:raise ValueError('TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE')
    function=spec['function'];rate=spec['rate'];phase=spec['phase'];a=spec['a'];c=spec['c']
    first=math.ceil(float((rate*lo+phase)*2)-1e-12);last=math.floor(float((rate*hi+phase)*2)+1e-12)
    rows=[]
    for m in range(first,last+1):
        x=(Fraction(m,2)-phase)/rate
        if not lo<x<hi:continue
        if function=='SIN':factor=Fraction(0) if m%2==0 else (Fraction(1) if m%4==1 else Fraction(-1))
        else:factor=(Fraction(1) if m%4==0 else Fraction(-1)) if m%2==0 else Fraction(0)
        if spec.get('absolute'):
            # a*|F|+c: a cusp where F=0 (y=c), the folded peak (or trough, a<0) where |F|=1 (y=a+c)
            if factor==0:kind='CUSP';y=c
            else:y=a+c;kind='MAXIMUM' if a>0 else 'MINIMUM'
        else:
            y=a*factor+c
            if factor==0:kind='X_INTERCEPT' if y==0 else 'MIDLINE_CROSSING'
            else:kind='MAXIMUM' if y>c else 'MINIMUM'
        rows.append({'id':'key-'+str(m),'kind':kind,'x':str(x),'y':str(y)})
    if len(rows)>TRIG_KEY_POINT_MAX:raise ValueError('TRIG_KEY_POINTS_TOO_MANY')
    return rows

def trig_abs_cusps(spec,lo,hi):
    """Every zero of F inside the interval for a*|F|+c (SIN/COS/TAN): the corner of the folded curve, with its exact axis coordinate. The sampler is told to put a vertex on each."""
    if not spec.get('absolute'):return []
    if not spec['phaseHasPi']:raise ValueError('TRIG_ABSOLUTE_REQUIRES_PI_PHASE')
    rate=spec['rate'];phase=spec['phase'];rows=[];shift=Fraction(1,2) if spec['function']=='COS' else Fraction(0)   # zeros of cos sit at half-integers (in pi units), of sin and tan at integers
    first=math.ceil(float(rate*lo+phase-shift)-1e-12) if rate>0 else math.ceil(float(rate*hi+phase-shift)-1e-12)
    last=math.floor(float(rate*hi+phase-shift)+1e-12) if rate>0 else math.floor(float(rate*lo+phase-shift)+1e-12)
    for n in range(first,last+1):
        x=(Fraction(n)+shift-phase)/rate
        if lo<x<hi:rows.append({'id':'cusp-'+str(len(rows)+1),'x':str(x)})
    return sorted(rows,key=lambda row:Fraction(row['x']))

def trig_interval_poles(spec,lo,hi,states):
    # Exact tangent poles in the interval closure, including excluded source endpoints.
    if not spec['phaseHasPi']:raise ValueError('TRIG_TAN_REQUIRES_PI_PHASE')
    rate=spec['rate'];phase=spec['phase'];half=Fraction(1,2)
    lower,upper=sorted((rate*lo+phase,rate*hi+phase))
    poles=sorted((n+half-phase)/rate for n in range(math.ceil(lower-half),math.floor(upper-half)+1))
    for x,state in zip((lo,hi),states):
        if x in poles and state=='CLOSED':raise ValueError('TRIG_TAN_POLE_AT_INTERVAL_END')
    if not any(lo<x<hi for x in poles):raise ValueError('TRIG_TAN_INTERVAL_NO_POLE')
    return [
        {'id':'pole-'+str(index),'x':str(x),'side':'LEFT' if rate>0 else 'RIGHT',
         **({'boundary':'START'} if x==lo else {'boundary':'END'} if x==hi else {})}
        for index,x in enumerate(poles,1)
    ]

TRIG_PLOT_WIDTH_PX=546         # the drawn plot width of the graph canvas (610 px minus the 32 px margins)
TRIG_PI_TICK_MIN_GAP_PX=58     # least spacing between two pi tick labels (a stacked 5pi/6 is about 30 px wide at the tick font)
TRIG_PI_TICK_END_CLEAR=1.0     # a stepped tick keeps one label gap away from a labelled interval end (the end label needs the room)

def trig_pi_ticks(plan,kind,x0,x1,span=None):
    """Validate pi-unit x tick multiples. Returns the exact multiples (axis units) when axisTickPi is on.
    axisTickValues.x always lists ticks the author needs; axisTickPiStep (an exact positive multiple of pi, e.g. 1/6) adds every multiple of the step inside the interval,
    thinned to every m-th multiple (the smallest m whose spacing fits a stacked fraction label) and never within one label gap of a required tick or a labelled end.
    span is the viewport width in radians (the thinning measures spacing on the plot)."""
    flag=plan.get('axisTickPi')
    if flag is None or flag is False:
        if plan.get('axisTickPiStep') is not None:raise ValueError('TRIG_TICK_PI_REQUIRES_PI_AXIS')
        return []
    if flag is not True:raise ValueError('INVALID_TRIG_TICK_PI_FLAG')
    if kind!='INTERVAL_PI':raise ValueError('TRIG_TICK_PI_REQUIRES_PI_AXIS')
    values=plan.get('axisTickValues')
    if not isinstance(values,dict) or set(values)!={'x','y'} or not isinstance(values.get('x'),list) or not isinstance(values.get('y'),list):raise ValueError('INVALID_TRIG_AXIS_TICK_VALUES')
    multiples=[]
    for value in values['x']:
        multiple=_piecewise_fraction(value,'TRIG_PI_TICK_VALUE_INVALID')
        if multiple==0:raise ValueError('TRIG_PI_TICK_VALUE_INVALID')
        position=float(multiple)*math.pi
        if not x0<position<x1:raise ValueError('TRIG_PI_TICK_OUTSIDE_VIEW')
        multiples.append(multiple)
    step_text=plan.get('axisTickPiStep')
    if step_text is None:return multiples
    step=_piecewise_fraction(step_text,'TRIG_PI_TICK_STEP_INVALID')
    if step<=0 or span is None:raise ValueError('TRIG_PI_TICK_STEP_INVALID')
    gap=TRIG_PI_TICK_MIN_GAP_PX*span/TRIG_PLOT_WIDTH_PX   # label gap in radians
    m=1
    while float(step*m)*math.pi<gap-1e-12:m+=1
    lo_k=math.floor(x0/(math.pi*float(step)))+1;hi_k=math.ceil(x1/(math.pi*float(step)))-1
    labelled_ends=[end for end,text in ((x0,plan['sourceDomain']['rangePi'][0]),(x1,plan['sourceDomain']['rangePi'][1])) if text!='0']
    regular=[]
    for k in range(lo_k,hi_k+1):
        if k==0 or k%m:continue
        value=k*step;position=float(value)*math.pi
        if not x0<position<x1:continue
        if any(abs(position-float(req)*math.pi)<gap for req in multiples):continue
        if any(abs(position-end)<gap*TRIG_PI_TICK_END_CLEAR for end in labelled_ends):continue
        regular.append(value)
    return sorted(set(multiples)|set(regular))

def _fit_trigonometric_interval_v2(plan,spec):
    function=spec['function'];a=spec['a'];rate=spec['rate'];c=spec['c']
    kind,lo,hi,states=trig_interval_v2_source(plan)
    if kind=='INTERVAL' and not spec['rateHasPi']:raise ValueError('TRIG_INTERVAL_REQUIRES_RATE_PI')
    if kind=='INTERVAL_PI' and spec['rateHasPi']:raise ValueError('TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL')
    if kind=='INTERVAL_PI' and not spec['phaseHasPi']:raise ValueError('TRIG_INTERVAL_PI_PHASE_MUST_BE_PI')
    if 'domain' in plan or 'viewport' in plan:_valid_exp_log_display(plan,'TRIGONOMETRIC')
    period=trig_axis_period(spec);axis_unit='PI' if kind=='INTERVAL_PI' else 'ONE'
    periods=(hi-lo)/period
    if periods<Fraction(1,4) or periods>TRIG_INTERVAL_MAX_PERIODS:raise ValueError('TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
    x0=float(lo)*(math.pi if axis_unit=='PI' else 1.0);x1=float(hi)*(math.pi if axis_unit=='PI' else 1.0)
    rate_eff,phase_eff=trig_effective(spec)
    absolute=spec['absolute']
    if plan.get('displaySize') not in {None,'medium','full'}:raise ValueError('TRIG_DISPLAY_SIZE_INVALID')
    rows=[];ys=[float(c),float(c+a),0.0] if absolute else [float(c-abs(a)),float(c+abs(a)),0.0]
    if absolute and function=='TAN':ys=[0.0]
    key_rows=[];pole_rows=[];cusp_rows=trig_abs_cusps(spec,lo,hi)
    xpad=max(.04*(x1-x0),.3)
    if plan.get('keyPoints') is not None and not isinstance(plan.get('keyPoints'),bool):raise ValueError('INVALID_TRIG_KEY_POINTS')
    if plan.get('keyPoints') is True and function not in {'SIN','COS'}:raise ValueError('TRIG_KEY_POINTS_REQUIRE_SIN_COS')
    if function=='TAN':
        if plan.get('referenceLines'):raise ValueError('TRIG_TAN_REFERENCE_LINES_UNSUPPORTED')
        pole_rows=trig_interval_poles(spec,lo,hi,states)
    else:
        for line in trig_line_specs(plan):
            line['axisUnit']=axis_unit
            crossings=trig_line_crossings(function,float(a),rate_eff,phase_eff,float(c),x0,x1,states,line,absolute)
            if len(crossings)!=line['claim']:raise ValueError('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:'+line['id']+':engine finds '+str(len(crossings))+' intersection(s)')
            for x,_ in crossings:
                if not line['endCrossing'] and ((states[0]=='CLOSED' and abs(x-x0)<1e-9) or (states[1]=='CLOSED' and abs(x-x1)<1e-9)):raise ValueError('TRIG_LINE_THROUGH_INTERVAL_END:'+line['id'])
            if line['vertical']:
                ys.extend(y for _,y in crossings)
                row={'id':line['id'],'kind':'VERTICAL','x':str(line['x']),'intersections':[{'x':x,'y':y} for x,y in crossings]}
            else:
                ys.append(float(line['intercept']) if line['horizontal'] else 0.0);ys.extend(y for _,y in crossings)
                row={'id':line['id'],'kind':'HORIZONTAL' if line['horizontal'] else 'SLANTED','slope':str(line['slope']),'intercept':trig_level_text(line['intercept']),'intersections':[{'x':x,'y':y} for x,y in crossings]}
            if line['perPi']:row['perPi']=True
            if line['color'] is not None:row['color']=line['color']
            if line['endCrossing']:row['endCrossing']=True
            rows.append(row)
        if plan.get('keyPoints') is True:
            key_rows=trig_key_points(spec,lo,hi,states);ys.extend(float(Fraction(row['y'])) for row in key_rows)
    tick_multiples=trig_pi_ticks(plan,kind,x0,x1,(x1-x0)+2*xpad)
    evaluator=math.sin if function=='SIN' else math.cos if function=='COS' else math.tan
    if absolute:evaluator=(lambda f:lambda v:abs(f(v)))(evaluator)
    pole_boundaries={row['boundary'] for row in pole_rows if 'boundary' in row}
    endpoints=[]
    for side,x,state in zip(('START','END'),(x0,x1),states):
        if side not in pole_boundaries:
            y=float(a)*evaluator(rate_eff*x+phase_eff)+float(c)
            endpoints.append({'side':side,'x':repr(x),'y':repr(y),'state':state})
    if function=='TAN':
        half=max(1.0,2.2*abs(float(a)));low=min(0.0,float(c)-half);high=max(0.0,float(c)+half);ypad=.05*max(1.0,high-low)
    else:
        low=min(ys);high=max(ys);ypad=.18*max(1.0,high-low)
    viewport=[x0-xpad,x1+xpad,low-ypad,high+ypad]
    features={'schemaVersion':'TRIGONOMETRIC_INTERVAL_FEATURES_v2','function':function,'rate':str(rate),'rateHasPi':spec['rateHasPi'],'phase':str(spec['phase']),'phaseHasPi':spec['phaseHasPi'],'period':str(period),'axisUnit':axis_unit,'amplitude':str(a),'midline':str(c),'sourceInterval':{'kind':kind,'lo':str(lo),'hi':str(hi),'states':states},'lines':rows,'keyPoints':key_rows,'poles':pole_rows}
    if absolute:features['absolute']=True;features['cusps']=cusp_rows
    policy={'schemaVersion':'TRIGONOMETRIC_INTERVAL_POLICY_v2','markerRadiusIntrinsicPx':3.2,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':40,'minimumAmplitudeCssPx':20,'minimumPoleApproachGapCssPx':2}
    interval={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':endpoints}
    interval_policy={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in [x0,x1,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
    # A plan that uses an additive field names its interval ends beside the end dots, on the side the curve does not run into (the older place, on the axis, can sit on the curve)
    additive=absolute or plan.get('axisTickPiStep') is not None or plan.get('displaySize') is not None or any(row.get('color') or row.get('perPi') or row['kind']=='VERTICAL' or 'sqrt' in str(row.get('intercept','')) for row in rows)
    end_sides=None
    if additive:
        delta=1e-3*(x1-x0)
        end_sides=[None,None]
        for endpoint in endpoints:
            index=0 if endpoint['side']=='START' else 1
            step=delta
            if pole_boundaries:
                # Evaluate only between the finite end and its nearest pole.
                pole_x=float(Fraction(pole_rows[0 if index==0 else -1]['x']))*(math.pi if axis_unit=='PI' else 1.0)
                step=min(step,abs(float(endpoint['x'])-pole_x)/2)
            inward=float(endpoint['x'])+(step if index==0 else -step)
            y=float(a)*evaluator(rate_eff*inward+phase_eff)+float(c)
            end_sides[index]='BELOW' if y>float(endpoint['y']) else 'ABOVE'
    fitted={**plan,'domain':[x0,x1],'viewport':viewport,**({'endLabelSides':end_sides} if end_sides else {}),**({'axisTickPiRequired':list(plan['axisTickValues']['x']),'axisTickValues':{'x':[str(value) for value in tick_multiples],'y':plan['axisTickValues']['y']}} if plan.get('axisTickPiStep') is not None else {}),'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2','trigIntervalFeatures':features,'trigIntervalPolicy':policy,'intervalFeatures':interval,'intervalFeaturePolicy':interval_policy}
    return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_INTERVAL_OVERVIEW_v2','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

def _fit_trigonometric_period_v2(plan,spec):
    function=spec['function'];a=spec['a'];rate=spec['rate'];c=spec['c']
    expected={'kind':'ALL_REALS'} if function in {'SIN','COS'} else {'kind':'ALL_REALS_WITH_TAN_POLES'}
    if plan.get('sourceDomain')!=expected:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
    if not spec['phaseHasPi']:raise ValueError('TRIG_PHASE_RATIONAL_REQUIRES_INTERVAL')
    _valid_exp_log_display(plan,'TRIGONOMETRIC')
    rate_eff,phase_eff=trig_effective(spec);center=-phase_eff/rate_eff;radius=math.pi/abs(rate_eff)
    period=trig_axis_period(spec)
    if function in {'SIN','COS'}:
        lo,hi=center-radius,center+radius;rows=[]
        for index in range(-2,3):
            x_pi=(Fraction(index,2)-spec['phase'])/rate
            x=float(x_pi)
            if function=='SIN':factor=Fraction(0) if index%2==0 else (Fraction(1) if index%4==1 else Fraction(-1))
            else:factor=(Fraction(1) if index%4==0 else Fraction(-1)) if index%2==0 else Fraction(0)
            y=a*factor+c
            if factor==0:kind='X_INTERCEPT' if y==0 else 'MIDLINE_CROSSING'
            else:kind='EXTREMUM'
            row={'id':f'phase-{index+2}','kind':kind,'index':index,'x':str(x_pi),'y':str(y)}
            if kind=='EXTREMUM':row['extreme']='MAXIMUM' if y>c else 'MINIMUM'
            rows.append(row)
        points=[(float(Fraction(row['x'])),float(Fraction(row['y']))) for row in rows]
        ymin=min(float(c-abs(a)),*(point[1] for point in points));ymax=max(float(c+abs(a)),*(point[1] for point in points));ypad=.15*max(1.0,ymax-ymin,abs(ymin),abs(ymax));xpad=.04*(hi-lo)
        viewport=[lo-xpad,hi+xpad,min(0.0,ymin)-ypad,max(0.0,ymax)+ypad]
        center_behavior=('INCREASING' if a*rate>0 else 'DECREASING') if function=='SIN' else ('MAXIMUM' if a>0 else 'MINIMUM')
        features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v2','function':function,'rate':str(rate),'rateHasPi':spec['rateHasPi'],'phase':str(spec['phase']),'phaseHasPi':spec['phaseHasPi'],'period':str(period),'amplitude':str(a),'midline':str(c),'centerBehavior':center_behavior,'phasePoints':rows}
        policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v2','function':function,'sourceDomain':'ALL_REALS','displayWindow':'ONE_FULL_PERIOD','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':80,'minimumAmplitudeCssPx':20}
        domain=[lo,hi]
    else:
        epsilon=Fraction(3,25)/abs(rate);first_pole=(-spec['phase']-Fraction(1,2))/rate;second_pole=(-spec['phase']+Fraction(1,2))/rate
        left_pole,right_pole=sorted((first_pole,second_pole))
        lo=float(left_pole)+float(epsilon);hi=float(right_pole)-float(epsilon)
        def evaluate(value):
            result=float(a)*math.tan(rate_eff*value+phase_eff)+float(c)
            if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_TANGENT_NUMERIC_SCOPE')
            return result
        start_y=evaluate(lo);end_y=evaluate(hi);low=min(float(c),start_y,end_y);high=max(float(c),start_y,end_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
        viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
        features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v2','function':'TAN','rate':str(rate),'rateHasPi':spec['rateHasPi'],'phase':str(spec['phase']),'phaseHasPi':spec['phaseHasPi'],'period':str(period),'amplitude':str(a),'midline':str(c),'centerBehavior':'INCREASING' if a*rate>0 else 'DECREASING','referencePoint':{'x':str(-spec['phase']/rate),'y':str(c)},'poles':[{'id':'pole-left','x':str(left_pole)},{'id':'pole-right','x':str(right_pole)}],'sampleBoundaryDistance':'3/25'}
        policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v2','function':'TAN','sourceDomain':'ALL_REALS_WITH_TAN_POLES','displayWindow':'ONE_COMPLETE_POLE_TO_POLE_BRANCH','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':80}
        domain=[lo,hi]
    if not all(math.isfinite(value) and abs(value)<=1e6 for value in [*domain,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
    fitted={**plan,'domain':domain,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2','trigFeatures':features,'trigFeaturePolicy':policy}
    return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}

def _fit_trigonometric_overview(plan):
    function=plan.get('function')
    if function not in {'SIN','COS','TAN'}:raise ValueError('UNSUPPORTED_TRIGONOMETRIC_FUNCTION')
    source=plan.get('sourceDomain')
    if isinstance(source,dict) and source.get('kind') in {'INTERVAL_PI','INTERVAL'}:
        legacy=source.get('kind')=='INTERVAL_PI' and plan.get('ratePi') is None and plan.get('phase') is None and plan.get('axisTickPi') is None and plan.get('keyPoints') is not True and function in {'SIN','COS'}
        # the additive fields (absolute value, stepped pi ticks, display size, line colour / vertical / surd level / end crossing) live on the general interval form only
        legacy=legacy and plan.get('absolute') is None and plan.get('axisTickPiStep') is None and plan.get('displaySize') is None and not any(isinstance(row,dict) and (set(row)-{'id','y','slope','intercept','intersectionCount'} or (isinstance(row.get('y'),str) and 'sqrt' in row['y'])) for row in (plan.get('referenceLines') if isinstance(plan.get('referenceLines'),list) else []))
        if legacy:return _fit_trigonometric_interval(plan,function)
        return _fit_trigonometric_interval_v2(plan,trig_spec(plan))
    if plan.get('referenceLines') is not None:raise ValueError('TRIG_REFERENCE_LINES_REQUIRE_INTERVAL_PI')
    if plan.get('absolute') is not None:raise ValueError('TRIG_ABSOLUTE_REQUIRES_INTERVAL')
    if plan.get('axisTickPiStep') is not None:raise ValueError('TRIG_TICK_PI_REQUIRES_PI_AXIS')
    if plan.get('ratePi') is None and plan.get('phase') is None:
        expected_domain={'kind':'ALL_REALS'} if function in {'SIN','COS'} else {'kind':'ALL_REALS_WITH_TAN_POLES'}
        if plan.get('sourceDomain')!=expected_domain:raise ValueError('TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED')
        _valid_exp_log_display(plan,'TRIGONOMETRIC')
        a,k,c=_exp_log_coefficients(plan.get('coefficients'),3,'TRIGONOMETRIC');phase=_piecewise_fraction(plan.get('phasePi'),'INVALID_TRIGONOMETRIC_PHASE')
        if a==0 or k==0:raise ValueError('TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED')
        center=-phase/k;rate=abs(k);center_f=float(center);rate_f=float(rate);sign_k=1 if k>0 else -1
        if function in {'SIN','COS'}:
            radius=math.pi/rate_f;lo=center_f*math.pi-radius;hi=center_f*math.pi+radius
            rows=[]
            for index in range(-2,3):
                phase_offset=Fraction(index,2*1)/rate
                x_pi=center+phase_offset
                factor=(0 if index in {-2,0,2} else (sign_k if index>0 else -sign_k)) if function=='SIN' else (1 if index==0 else 0 if abs(index)==1 else -1)
                y=a*factor+c
                kind='X_INTERCEPT' if y==0 and factor==0 else 'MIDLINE_CROSSING' if factor==0 else 'EXTREMUM'
                row={'id':f'phase-{index+2}','kind':kind,'index':index,'xPiMultiple':str(x_pi),'y':str(y)}
                if kind=='EXTREMUM':row['extreme']='MAXIMUM' if y>c else 'MINIMUM'
                rows.append(row)
            points=[(float(_piecewise_fraction(row['xPiMultiple'],'INVALID_TRIG_FEATURE_X'))*math.pi,float(Fraction(row['y']))) for row in rows]
            ymin=min(float(c-abs(a)),*([point[1] for point in points]));ymax=max(float(c+abs(a)),*([point[1] for point in points]));ypad=.15*max(1.0,ymax-ymin,abs(ymin),abs(ymax));xpad=.04*(hi-lo)
            viewport=[lo-xpad,hi+xpad,min(0.0,ymin)-ypad,max(0.0,ymax)+ypad]
            center_behavior=('INCREASING' if a*k>0 else 'DECREASING') if function=='SIN' else ('MAXIMUM' if a>0 else 'MINIMUM')
            features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v1','function':function,'phasePi':str(phase),'cycleCenterPi':str(center),'periodPiMultiple':str(Fraction(2,1)/rate),'amplitude':str(a),'midline':str(c),'centerBehavior':center_behavior,'phasePoints':rows}
            policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v1','function':function,'sourceDomain':'ALL_REALS','displayWindow':'ONE_FULL_PERIOD','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumFeatureSeparationCssPx':2,'minimumPeriodSpanCssPx':80,'minimumAmplitudeCssPx':20}
            domain=[lo,hi]
        else:
            epsilon=.12/rate_f;left_pole=center_f*math.pi-math.pi/(2*rate_f);right_pole=center_f*math.pi+math.pi/(2*rate_f)
            lo=left_pole+epsilon;hi=right_pole-epsilon
            def evaluate(value):
                angle=float(k)*value+float(phase)*math.pi
                result=float(a)*math.tan(angle)+float(c)
                if not math.isfinite(result) or abs(result)>1e8:raise ValueError('UNSUPPORTED_TANGENT_NUMERIC_SCOPE')
                return result
            start_y=evaluate(lo);end_y=evaluate(hi);low=min(float(c),start_y,end_y);high=max(float(c),start_y,end_y);ypad=.15*max(1.0,high-low,abs(low),abs(high));xpad=.04*(hi-lo)
            viewport=[lo-xpad,hi+xpad,min(0.0,low)-ypad,max(0.0,high)+ypad]
            left_pole_pi=center-Fraction(1,2)/rate;right_pole_pi=center+Fraction(1,2)/rate
            features={'schemaVersion':'TRIGONOMETRIC_FEATURES_v1','function':'TAN','phasePi':str(phase),'cycleCenterPi':str(center),'periodPiMultiple':str(Fraction(1,1)/rate),'amplitude':str(a),'midline':str(c),'centerBehavior':'INCREASING' if a*k>0 else 'DECREASING','referencePoint':{'xPiMultiple':str(center),'y':str(c)},'poles':[{'id':'pole-left','xPiMultiple':str(left_pole_pi),'side':'LEFT'},{'id':'pole-right','xPiMultiple':str(right_pole_pi),'side':'RIGHT'}],'sampleBoundaryDistance':str(Fraction(3,25))}
            policy={'schemaVersion':'TRIGONOMETRIC_FEATURE_POLICY_v1','function':'TAN','sourceDomain':'ALL_REALS_WITH_TAN_POLES','displayWindow':'ONE_COMPLETE_POLE_TO_POLE_BRANCH','markerRadiusIntrinsicPx':3.5,'minimumMarkerDiameterCssPx':2.5,'minimumBoundaryApproachGapCssPx':2,'minimumBranchSpanCssPx':80}
            domain=[lo,hi]
        if not all(math.isfinite(value) and abs(value)<=1e6 for value in [*domain,*viewport]):raise ValueError('UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE')
        fitted={**plan,'domain':domain,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v1','trigFeatures':features,'trigFeaturePolicy':policy}
        return {'graphPlan':fitted,'policy':'TRIGONOMETRIC_PERIODIC_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan['domain'],'viewport':plan['viewport']}}
    return _fit_trigonometric_period_v2(plan,trig_spec(plan))

# ---- piecewise polynomial: one continuous y=g(x) of up to three pieces (degree <= 2 each) plus up to three horizontal lines y=c ----------
# The plan claims the breakpoint values, marks every corner and every vertex inside a piece as a requiredPoint, and lists the exact x of every
# intersection with each line. All of it is recomputed here exactly (Fractions, SymPy surds) and a disagreement refuses the plan.
PIECEWISE_POLY_FIELDS={'nameVariable','family','pieces','breakpoints','sourceDomain','formula','referenceLines','requiredPoints','exactCoordinates','axisTickValues','domain','viewport','axisSqueeze','axisScale','plotHeightLimit','referenceCurves','functionName','sampleNote','overlays','overlayAnchors','regions','axisTitles','coordinateBand','curveColor'}
PIECEWISE_POLY_MIN_ARM_PX=12
PIECEWISE_POLY_MIN_FEATURE_GAP_PX=4
# Four pieces cover the two-piecewise exam items (f and g both piecewise); a fifth piece is refused.
PIECEWISE_POLY_MAX_PIECES=4
PIECEWISE_POLY_MAX_COEFFICIENTS=5   # constant ... x^4: a piece or reference piece may be cubic or quartic (rational coefficients above degree 2)
# A reference curve may list as many crossings as four piece pairs can produce in a readable figure.
PIECEWISE_POLY_MAX_CURVE_INTERSECTIONS=8
PIECEWISE_POLY_MAX_REQUIRED_POINTS=24
# Shaded regions between two drawn boundaries (the function, a reference curve, a reference line or the x-axis).
PIECEWISE_POLY_REGION_FIELDS={'id','upper','lower','from','to','fill','label'}
PIECEWISE_POLY_MAX_REGIONS=4
PIECEWISE_POLY_REGION_FILLS=('LIGHT','MEDIUM','BLUE','WARM','GREEN','ROSE','VIOLET')   # the gray tints and (C1) the colour-group tints of visual_engine/palette.py

def _pp_rational(value,code):
    """An exact rational: a decimal integer, an 'a/b' string, or a JSON integer."""
    if isinstance(value,bool) or not (isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value)):raise ValueError(code)
    try:return Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None

def _pp_norm(value):
    """Canonical form of a one-radical exact value (a+b*sqrt(r), r squarefree): radicals in a denominator are rationalised, products expanded."""
    return S.radsimp(S.expand(S.sympify(value)))

def pp_surd_split(value,code):
    """(p, q, r) with value = p + q*sqrt(r) for an exact real value (p, q rational, r a squarefree integer > 1; q = 0 and r = None for a
    rational). Anything else (nested radicals, a second radical, a root of higher order) is refused with `code`."""
    normal=_pp_norm(value)
    if normal.is_Rational:return normal,S.Integer(0),None
    powers=list(normal.atoms(S.Pow))
    if not powers or any(power.exp!=S.Rational(1,2) or not power.base.is_Integer or power.base<2 for power in powers) or len({power.base for power in powers})!=1:raise ValueError(code)
    radicand=powers[0].base;p=normal.subs(S.sqrt(radicand),0);q=S.simplify((normal-p)/S.sqrt(radicand))
    if not p.is_Rational or not q.is_Rational or q==0:raise ValueError(code)
    return p,q,radicand

def pp_surd(value,code):
    """An exact coefficient: a decimal integer, an 'a/b' string, or p+q*sqrt(r) written in the exact-value grammar. Returns a SymPy number."""
    if isinstance(value,bool):raise ValueError(code)
    if isinstance(value,int) or isinstance(value,str) and len(value)<=64 and re.fullmatch(r'-?\d+(?:/\d+)?',value):
        try:return S.Rational(value)
        except (ValueError,ZeroDivisionError):raise ValueError(code) from None
    if not isinstance(value,str):raise ValueError(code)
    try:number=pp_exact_value(value)
    except ValueError:raise ValueError(code) from None
    pp_surd_split(number,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED:'+value[:32])
    return _pp_norm(number)

def pp_radicand(value):
    """The one radicand of an exact value (None for a rational)."""
    return pp_surd_split(value,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED')[2]

def pp_surd_text(value):
    """A canonical exact-value string of a rational or p+q*sqrt(r): '-3+2*sqrt(3)', '1/2+3*sqrt(2)/2', '-sqrt(5)'."""
    p,q,r=pp_surd_split(value,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED')
    def rat(number):return str(Fraction(int(number.p),int(number.q)))
    if r is None:return rat(p)
    magnitude=abs(q);root='sqrt('+str(r)+')'
    body=('' if magnitude.p==1 else str(int(magnitude.p))+'*')+root+('' if magnitude.q==1 else '/'+str(int(magnitude.q)))
    head='' if p==0 else rat(p)
    return head+('-' if q<0 else '+' if p!=0 else '')+body

def pp_exact_float(text):
    """The float of an exact-value string (a rational or a sqrt expression)."""
    if isinstance(text,str) and re.fullmatch(r'-?\d+(?:/\d+)?',text):return float(Fraction(text))
    return float(pp_exact_value(text))

def pp_same(a,b):
    """Two exact algebraic numbers are equal: exactly after simplification, or equal to 50 digits (nested radicals that do not simplify)."""
    difference=S.sympify(a)-S.sympify(b)
    return difference==0 or S.simplify(difference)==0 or abs(S.N(difference,60))<S.Float('1e-40',60)

def pp_exact_value(text):
    """An exact value string (integers, a/b, sqrt(...), + - * / and parentheses, as in '(-3-sqrt(53))/2') as a SymPy number. Never eval."""
    def bad():raise ValueError('PIECEWISE_POLY_EXACT_VALUE_INVALID:'+str(text)[:32])
    if not isinstance(text,str) or not text or len(text)>64 or not re.fullmatch(r'[0-9+\-*/()sqrt ]+',text):bad()
    compact=text.replace(' ','');tokens=re.findall(r'sqrt|\d+|[+\-*/()]',compact)
    if ''.join(tokens)!=compact:bad()
    at=[0]
    def peek():return tokens[at[0]] if at[0]<len(tokens) else None
    def take():token=peek();at[0]+=1;return token
    def factor():
        token=take()
        if token=='-':return -factor()
        if token=='+':return factor()
        if token=='sqrt':
            if take()!='(':bad()
            value=expr()
            if take()!=')' or value.is_negative:bad()
            return S.sqrt(value)
        if token=='(':
            value=expr()
            if take()!=')':bad()
            return value
        if token is not None and token.isdigit():return S.Integer(int(token))
        bad()
    def term():
        value=factor()
        while peek() in ('*','/'):
            op=take();right=factor()
            if op=='/' and right==0:bad()
            value=value*right if op=='*' else value/right
        return value
    def expr():
        value=term()
        while peek() in ('+','-'):
            op=take();right=term();value=value+right if op=='+' else value-right
        return value
    value=expr()
    if at[0]!=len(tokens) or not value.is_real:bad()
    return value

def pp_formula_value(text,x_value):
    """The exact value at a rational x of a display formula in x: integers, x, abs(...), + - * / ^ (small integer powers), parentheses and an
    implicit product such as 2x. Returns a Fraction; anything else is PIECEWISE_POLY_FORMULA_INVALID."""
    def bad():raise ValueError('PIECEWISE_POLY_FORMULA_INVALID')
    if not isinstance(text,str) or not text or len(text)>120 or not re.fullmatch(r'[0-9x+\-*/^()abs ]+',text):bad()
    compact=text.replace(' ','');tokens=re.findall(r'abs|\d+|x|[+\-*/^()]',compact)
    if ''.join(tokens)!=compact:bad()
    at=[0]
    def peek():return tokens[at[0]] if at[0]<len(tokens) else None
    def take():token=peek();at[0]+=1;return token
    def atom():
        token=take()
        if token=='x':return Fraction(x_value)
        if token=='abs':
            if take()!='(':bad()
            value=expr()
            if take()!=')':bad()
            return abs(value)
        if token=='(':
            value=expr()
            if take()!=')':bad()
            return value
        if token is not None and token.isdigit():return Fraction(int(token))
        bad()
    def power():
        base=atom()
        if peek()=='^':
            take();exponent=take()
            if exponent is None or not exponent.isdigit() or int(exponent)>4:bad()
            return base**int(exponent)
        return base
    def unary():
        if peek()=='-':take();return -unary()
        if peek()=='+':take();return unary()
        return power()
    def term():
        value=unary()
        while peek() in ('*','/','x','abs','(') or (peek() or '').isdigit():
            op=take() if peek() in ('*','/') else '*'
            if op=='*' and (peek() or '').isdigit() and tokens[at[0]-1] not in ('*',):bad()
            right=unary()
            if op=='/' and right==0:bad()
            value=value*right if op=='*' else value/right
        return value
    def expr():
        value=term()
        while peek() in ('+','-'):
            op=take();right=term();value=value+right if op=='+' else value-right
        return value
    value=expr()
    if at[0]!=len(tokens):bad()
    return value

def _pp_poly_value(coefficients,x_value):
    return _pp_norm(sum((c*S.sympify(x_value)**i for i,c in enumerate(coefficients)),S.Integer(0)))

def piecewise_polynomial_source(plan):
    """Exact pieces, breakpoints, source interval and the piece intervals (None for an unbounded end); the grammar checks of the family."""
    unknown=sorted(set(plan)-PIECEWISE_POLY_FIELDS)
    if unknown:raise ValueError('PIECEWISE_POLY_FIELD_UNKNOWN:'+unknown[0])
    raw_pieces=plan.get('pieces');raw_breaks=plan.get('breakpoints',[])
    if not isinstance(raw_pieces,list) or not 1<=len(raw_pieces)<=PIECEWISE_POLY_MAX_PIECES:raise ValueError('PIECEWISE_POLY_PIECE_COUNT_INVALID')
    if not isinstance(raw_breaks,list) or len(raw_breaks)!=len(raw_pieces)-1:raise ValueError('PIECEWISE_POLY_BREAKPOINT_COUNT_INVALID')
    pieces=[]
    for piece in raw_pieces:
        if not isinstance(piece,dict) or set(piece)!={'coefficients'} or not isinstance(piece['coefficients'],list) or not 1<=len(piece['coefficients'])<=PIECEWISE_POLY_MAX_COEFFICIENTS:raise ValueError('PIECEWISE_POLY_PIECE_INVALID')
        pieces.append(_pp_piece_coefficients(piece['coefficients']))
    breaks=[]
    for row in raw_breaks:
        if not isinstance(row,dict) or set(row)!={'x','y'}:raise ValueError('PIECEWISE_POLY_BREAKPOINT_INVALID')
        breaks.append((pp_surd(row['x'],'PIECEWISE_POLY_BREAKPOINT_INVALID'),pp_surd(row['y'],'PIECEWISE_POLY_BREAKPOINT_INVALID')))
    if any(not left[0]<right[0] for left,right in zip(breaks,breaks[1:])):raise ValueError('PIECEWISE_POLY_BREAKPOINTS_NOT_INCREASING')
    source=plan.get('sourceDomain')
    if source=={'kind':'ALL_REALS'}:lo=hi=None;states=['CLOSED','CLOSED']
    elif isinstance(source,dict) and source.get('kind')=='INTERVAL':
        try:lo,hi,states=quadratic_source_interval(source)
        except ValueError:raise ValueError('PIECEWISE_POLY_SOURCE_DOMAIN_INVALID') from None
        lo,hi=S.Rational(lo.numerator,lo.denominator),S.Rational(hi.numerator,hi.denominator)
        if any(not lo<x_value<hi for x_value,_ in breaks):raise ValueError('PIECEWISE_POLY_BREAKPOINT_OUTSIDE_SOURCE_INTERVAL')
    else:raise ValueError('PIECEWISE_POLY_SOURCE_DOMAIN_INVALID')
    cuts=[lo,*[x_value for x_value,_ in breaks],hi]
    intervals=list(zip(cuts,cuts[1:]))
    for index,(x_value,y_value) in enumerate(breaks):
        left,right=_pp_poly_value(pieces[index],x_value),_pp_poly_value(pieces[index+1],x_value)
        if left!=right:raise ValueError('PIECEWISE_POLY_DISCONTINUOUS:'+_pp_text(x_value))
        if left!=y_value:raise ValueError('PIECEWISE_POLY_BREAKPOINT_VALUE_MISMATCH:'+_pp_text(x_value))
    # One radical for the whole plan: every irrational number lives in the same field Q(sqrt(r)), so equality is exact.
    radicands={r for r in (pp_radicand(v) for v in [c for piece in pieces for c in piece]+[v for pair in breaks for v in pair]) if r is not None}
    if len(radicands)>1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:'+','.join(str(r) for r in sorted(radicands)))
    return pieces,breaks,(lo,hi,states),intervals

def _pp_inside(x_value,interval,strict):
    a,b=interval
    if strict:return (a is None or a<x_value) and (b is None or x_value<b)
    return (a is None or a<=x_value) and (b is None or x_value<=b)

def _pp_piece_coefficients(values):
    """Exact coefficients of one piece: at least three entries (the legacy quadratic shape), trailing zero terms above degree 2 dropped. A cubic
    or quartic piece must have rational coefficients, so its real roots are found exactly by factoring over the rationals."""
    coefficients=[pp_surd(value,'PIECEWISE_POLY_COEFFICIENT_INVALID') for value in values]
    coefficients+=[S.Integer(0)]*(3-len(coefficients))
    while len(coefficients)>3 and coefficients[-1]==0:coefficients.pop()
    if len(coefficients)>3 and any(pp_radicand(value) is not None for value in coefficients):raise ValueError('PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED')
    return coefficients

def pp_sub(a,b):
    """a-b for two coefficient lists of any length (the shorter is padded with zeros); trailing zeros above degree 2 are dropped."""
    size=max(len(a),len(b),3)
    out=[(a[i] if i<len(a) else S.Integer(0))-(b[i] if i<len(b) else S.Integer(0)) for i in range(size)]
    while len(out)>3 and _pp_norm(out[-1])==0:out.pop()
    return out

_PP_X=S.Symbol('x')

def pp_poly_roots(coefficients):
    """The distinct real roots of a polynomial of degree <= 4 (exact, increasing); None when identically zero. Degree <= 2 keeps the closed
    formula. A cubic or quartic with rational coefficients is factored over the rationals and every factor of degree <= 2 is solved exactly;
    an irreducible factor of degree 3 or more has no closed form accepted here (PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM)."""
    values=[_pp_norm(value) for value in coefficients]
    while len(values)>3 and values[-1]==0:values.pop()
    if len(values)<=3:return pp_quadratic_roots(*(values+[S.Integer(0)]*(3-len(values))))
    radical_atoms={atom for value in values for atom in value.atoms(S.Pow) if atom.exp==S.Rational(1,2) and atom.base.is_Integer and atom.base>1}
    if radical_atoms:
        radicands={int(atom.base) for atom in radical_atoms}
        if len(radicands)!=1:raise ValueError('PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED')
        radicand=next(iter(radicands))
        if any(power!=1 for power in S.factorint(radicand).values()):raise ValueError('PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED')
        radical=S.sqrt(radicand);field=S.QQ.algebraic_field(radical)
        try:
            for value in values:field.from_sympy(value)
            poly=S.Poly(sum(value*_PP_X**index for index,value in enumerate(values)),_PP_X,extension=radical)
            if poly.degree()!=3:raise ValueError('PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED')
            roots=[root for root,_ in _quadratic_field_root_rows(poly)]
        except (ValueError,TypeError,NotImplementedError):raise ValueError('PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM') from None
        return sorted(roots,key=lambda value:float(value))
    if any(pp_radicand(value) is not None for value in values):raise ValueError('PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED')
    poly=S.Poly(sum(value*_PP_X**index for index,value in enumerate(values)),_PP_X,domain='QQ')
    found=[]
    for factor,_ in S.factor_list(poly)[1]:
        if factor.degree()>2:raise ValueError('PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM')
        row=[S.Integer(0)]*3
        for index,value in enumerate(reversed(factor.all_coeffs())):row[index]=value
        for root in pp_quadratic_roots(*row) or []:
            if not any(pp_same(root,other) for other in found):found.append(root)
    return sorted(found,key=lambda value:float(value))

def _pp_derivative(coefficients):
    return [index*value for index,value in enumerate(coefficients)][1:]

def piecewise_polynomial_extrema(pieces,intervals):
    """The local extremum of each piece strictly inside its own interval: exact (x, y, MAX|MIN). A quadratic has its vertex; a cubic or
    quartic has every stationary point whose first non-vanishing derivative of order >= 2 has even order (an inflection is not one)."""
    rows=[]
    for coefficients,interval in zip(pieces,intervals):
        if len(coefficients)>3:
            derivatives=[coefficients]
            while derivatives[-1]:derivatives.append(_pp_derivative(derivatives[-1]))
            for h in pp_poly_roots(derivatives[1]) or []:
                for order in range(2,len(derivatives)):
                    value=_pp_poly_value(derivatives[order],h) if derivatives[order] else S.Integer(0)
                    if value!=0:break
                else:continue
                if _pp_inside(h,interval,True) and order%2==0:rows.append((_pp_norm(h),_pp_poly_value(coefficients,h),'MAX' if value<0 else 'MIN'))
            continue
        c0,c1,c2=coefficients
        if c2==0:continue
        h=_pp_norm(-c1/(2*c2))
        if _pp_inside(h,interval,True):rows.append((h,_pp_poly_value(coefficients,h),'MAX' if c2<0 else 'MIN'))
    return rows

def pp_quadratic_roots(c0,c1,c2):
    """The distinct real roots of c0+c1*x+c2*x^2 (exact, increasing); None when the polynomial is identically zero. The coefficients are
    p+q*sqrt(r) numbers, so the discriminant is one too and its sign and zero are decided exactly; a root may be a nested radical."""
    c0,c1,c2=_pp_norm(c0),_pp_norm(c1),_pp_norm(c2)
    if c2==0:
        if c1==0:return None if c0==0 else []
        return [_pp_norm(-c0/c1)]
    disc=_pp_norm(c1*c1-4*c2*c0)
    if disc==0:return [_pp_norm(-c1/(2*c2))]
    if S.N(disc,60)<0:return []
    root=S.sqrtdenest(S.sqrt(disc));found=[]
    for sign in (-1,1):
        value=(-c1+sign*root)/(2*c2)
        try:
            normal=_pp_norm(value)
            if abs(S.N(normal-value,60))<S.Float('1e-40',60):value=normal
        except (TypeError,ValueError,S.PolynomialError):pass
        found.append(value)
    return sorted(found,key=lambda value:float(value))

def piecewise_polynomial_crossings(pieces,intervals,level,source,slope=S.Integer(0),curve=None):
    """Every x where g(x)=slope*x+level, exactly (quadratic surds allowed), each once, in increasing order (slope 0: the horizontal line y=level).
    A piece equal to the line is refused. With curve=[c0,c1,c2] the reference is that quadratic instead (a referenceCurves entry)."""
    lo,hi,states=source;found=[]
    reference=list(curve) if curve is not None else [level,slope,S.Integer(0)]
    for coefficients,(a,b) in zip(pieces,intervals):
        roots=pp_poly_roots(pp_sub(coefficients,reference))
        if roots is None:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE' if curve is not None else 'PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE')
        for root in roots:
            if a is not None and root<a or b is not None and root>b:continue
            if lo is not None and (root==lo and states[0]=='OPEN' or root==hi and states[1]=='OPEN'):continue
            if not any(pp_same(root,other) for other in found):found.append(root)
    return sorted(found,key=lambda value:float(value))

def _pp_text(value):return pp_surd_text(value)

def pp_in_closed(x_value,interval):
    """x inside the closed piece interval, where an unbounded end is None."""
    a,b=interval
    return (a is None or a<=x_value) and (b is None or x_value<=b)

def pp_in_source(x_value,source):
    """x inside the source domain; an OPEN end excludes its own value."""
    lo,hi,states=source
    if lo is not None and (x_value<lo or x_value==lo and states[0]=='OPEN'):return False
    if hi is not None and (x_value>hi or x_value==hi and states[1]=='OPEN'):return False
    return True

def pp_in_domain(x_value,interval,source):
    return pp_in_closed(x_value,interval) and pp_in_source(x_value,source)

def _pp_reference_source(entry,ref_id,breaks):
    """{kind:'ALL_REALS'} (default) or {kind:'INTERVAL',range,states} for a reference curve; exact ends, breakpoints strictly inside."""
    raw=entry.get('sourceDomain',{'kind':'ALL_REALS'})
    if raw=={'kind':'ALL_REALS'}:return None,None,['CLOSED','CLOSED']
    if isinstance(raw,dict) and raw.get('kind')=='INTERVAL':
        try:lo,hi,states=quadratic_source_interval(raw)
        except ValueError:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID:'+ref_id) from None
        lo,hi=S.Rational(lo.numerator,lo.denominator),S.Rational(hi.numerator,hi.denominator)
        if any(not lo<x_value<hi for x_value,_ in breaks):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_OUTSIDE_SOURCE_INTERVAL:'+ref_id)
        return lo,hi,list(states)
    raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID:'+ref_id)

def piecewise_ref_formula_ok(formula,ref_id,pieces,intervals):
    """A reference curve's optional display formula is the same function as its pieces: exact values at nine points of every piece."""
    if any(pp_radicand(c) is not None for piece in pieces for c in piece):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_IRRATIONAL_UNSUPPORTED:'+ref_id)
    for coefficients,(a,b) in zip(pieces,intervals):
        if a is not None and b is not None:samples=[a+(b-a)*k/8 for k in range(9)]
        elif b is not None:samples=[b-S.Rational(k,2) for k in range(9)]+[b-10,b-100]
        elif a is not None:samples=[a+S.Rational(k,2) for k in range(9)]+[a+10,a+100]
        else:samples=[S.Rational(k-4,2) for k in range(9)]+[S.Integer(-100),S.Integer(100)]
        for x_value in samples:
            value=pp_formula_value(formula,x_value)
            if S.Rational(value.numerator,value.denominator)!=_pp_poly_value(coefficients,x_value):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH:'+ref_id+':'+_pp_text(x_value))

def piecewise_reference_curves(plan,pieces,breaks,source,intervals):
    """The referenceCurves of a piecewise plan (at most two). Each is either the legacy quadratic {id,name?,coefficients,intersectionX} defined
    on the whole line, or a piecewise curve {id,name?,pieces,breakpoints?,sourceDomain?,formula?,intersectionX} with its own up to four
    continuous pieces and its own domain (open/closed ends). Exact coefficients (one radical for the whole plan), short ASCII ids, and the
    exact x of every crossing with the function that both are defined at."""
    raw=plan.get('referenceCurves',[])
    if not isinstance(raw,list) or len(raw)>2:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
    rows=[];ids=set()
    for entry in raw:
        if not isinstance(entry,dict) or set(entry)-{'id','name','coefficients','pieces','breakpoints','sourceDomain','formula','intersectionX','color'} or not isinstance(entry.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',entry['id']) or entry['id'] in ids:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        if 'name' in entry and not (isinstance(entry['name'],str) and re.fullmatch(r'[a-hj-wz]',entry['name'])):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        if 'color' in entry:curve_color_name(entry['color'],str(entry['id'])+'.color')
        claimed=entry.get('intersectionX')
        if not isinstance(claimed,list) or len(claimed)>PIECEWISE_POLY_MAX_CURVE_INTERSECTIONS:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        ids.add(entry['id'])
        if ('coefficients' in entry)==('pieces' in entry):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        if 'coefficients' in entry:
            if 'breakpoints' in entry or 'sourceDomain' in entry or 'formula' in entry:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
            values=entry['coefficients']
            if not isinstance(values,list) or len(values)!=3:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
            coefficients=[pp_surd(value,'PIECEWISE_POLY_COEFFICIENT_INVALID') for value in values]
            if coefficients[2]==0:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC:'+entry['id'])
            rows.append({'id':entry['id'],'name':entry.get('name'),'kind':'quadratic','coefficients':coefficients,'pieces':[coefficients],'intervals':[(None,None)],'source':(None,None,['CLOSED','CLOSED']),'corners':[],'extrema':[],'intersectionX':claimed,'formula':None})
            continue
        raw_pieces=entry['pieces'];raw_breaks=entry.get('breakpoints',[])
        if not isinstance(raw_pieces,list) or not 1<=len(raw_pieces)<=PIECEWISE_POLY_MAX_PIECES:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID:'+entry['id'])
        if not isinstance(raw_breaks,list) or len(raw_breaks)!=len(raw_pieces)-1:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_COUNT_INVALID:'+entry['id'])
        ref_pieces=[]
        for piece in raw_pieces:
            if not isinstance(piece,dict) or set(piece)!={'coefficients'} or not isinstance(piece['coefficients'],list) or not 1<=len(piece['coefficients'])<=PIECEWISE_POLY_MAX_COEFFICIENTS:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_PIECE_INVALID:'+entry['id'])
            ref_pieces.append(_pp_piece_coefficients(piece['coefficients']))
        ref_breaks=[]
        for row in raw_breaks:
            if not isinstance(row,dict) or set(row)!={'x','y'}:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID:'+entry['id'])
            ref_breaks.append((pp_surd(row['x'],'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID:'+entry['id']),pp_surd(row['y'],'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID:'+entry['id'])))
        if any(not left[0]<right[0] for left,right in zip(ref_breaks,ref_breaks[1:])):raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINTS_NOT_INCREASING:'+entry['id'])
        ref_lo,ref_hi,ref_states=_pp_reference_source(entry,entry['id'],ref_breaks)
        cuts=[ref_lo,*[x_value for x_value,_ in ref_breaks],ref_hi];ref_intervals=list(zip(cuts,cuts[1:]))
        corners=[]
        for index,(x_value,y_value) in enumerate(ref_breaks):
            left,right=_pp_poly_value(ref_pieces[index],x_value),_pp_poly_value(ref_pieces[index+1],x_value)
            if left!=right:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS:'+entry['id']+':'+_pp_text(x_value))
            if left!=y_value:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_VALUE_MISMATCH:'+entry['id']+':'+_pp_text(x_value))
            corners.append((x_value,y_value))
        formula=entry.get('formula')
        if formula is not None:piecewise_ref_formula_ok(formula,entry['id'],ref_pieces,ref_intervals)
        rows.append({'id':entry['id'],'name':entry.get('name'),'kind':'piecewise','coefficients':None,'pieces':ref_pieces,'intervals':ref_intervals,'source':(ref_lo,ref_hi,ref_states),'corners':corners,'extrema':piecewise_polynomial_extrema(ref_pieces,ref_intervals),'intersectionX':claimed,'formula':formula})
    radicands={r for r in (pp_radicand(v) for v in [c for piece in pieces for c in piece]+[v for pair in breaks for v in pair]+[c for row in rows for piece in row['pieces'] for c in piece]+[v for row in rows for pair in row['corners'] for v in pair]) if r is not None}
    if len(radicands)>1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:'+','.join(str(r) for r in sorted(radicands)))
    return rows

def piecewise_reference_crossings(pieces,intervals,source,ref):
    """Every x where the function and a reference curve are both defined and equal, exactly and once (piece pair by piece pair, so a root
    outside either piece's domain or at an OPEN end is never counted). A piece equal to a reference piece is refused."""
    found=[]
    for coefficients,(a,b) in zip(pieces,intervals):
        for other,(c,d) in zip(ref['pieces'],ref['intervals']):
            roots=pp_poly_roots(pp_sub(coefficients,other))
            if roots is None:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE')
            for root in roots:
                if not pp_in_domain(root,(a,b),source) or not pp_in_domain(root,(c,d),ref['source']):continue
                if not any(pp_same(root,seen) for seen in found):found.append(root)
    return sorted(found,key=lambda value:float(value))


def _pp_region_rows(name,from_x,to_x,pieces,intervals,refs,line_specs,region_id):
    """The exact boundary rows of one region side, clipped to [from,to]. A boundary must cover the whole interval: a gap is refused."""
    if name=='axis':
        return [([S.Integer(0),S.Integer(0),S.Integer(0)],(from_x,to_x))]
    if name=='f':
        rows=[]
        for coefficients,(a,b) in zip(pieces,intervals):
            start=from_x if a is None else max(from_x,a);end=to_x if b is None else min(to_x,b)
            if start<end:rows.append((coefficients,(start,end)))
    else:
        rows=[]
        match=[row for row in refs if row['id']==name]
        if match:
            for coefficients,(a,b) in zip(match[0]['pieces'],match[0]['intervals']):
                start=from_x if a is None else max(from_x,a);end=to_x if b is None else min(to_x,b)
                if start<end:rows.append((coefficients,(start,end)))
        elif name in line_specs:
            slope,intercept=line_specs[name]
            rows.append(([intercept,slope,S.Integer(0)],(from_x,to_x)))
        else:raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+region_id+':'+name)
    rows.sort(key=lambda row:float(row[1][0]))
    if not rows or not pp_same(rows[0][1][0],from_x):raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+name)
    for (_,first),(_,(next_start,_)) in zip(rows,rows[1:]):
        if not pp_same(first[1],next_start):raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+name)
    if not pp_same(rows[-1][1][1],to_x):raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+name)
    return rows

def _pp_real_roots_inside(coefficients,start,end):
    """The exact number of real roots strictly inside (start,end) of a polynomial with rational coefficients, for rational ends that are not roots
    themselves (Sturm); None when that cannot be decided exactly (irrational coefficients or ends, or an end that is a root)."""
    try:
        values=[S.nsimplify(value) if not value.is_Rational else value for value in coefficients]
        if not all(value.is_Rational for value in values) or not (start.is_Rational and end.is_Rational):return None
        poly=S.Poly(sum(value*_PP_X**index for index,value in enumerate(values)),_PP_X,domain='QQ')
        if poly.eval(start)==0 or poly.eval(end)==0:return None
        return poly.count_roots(start,end)
    except (TypeError,ValueError,NotImplementedError,S.PolynomialError):return None

def _pp_region_crossings(upper_rows,lower_rows,region_id):
    """Refuse a region whose upper boundary does not stay strictly above its lower one inside (from,to). Endpoint touching is allowed."""
    for upper,upper_interval in upper_rows:
        for lower,lower_interval in lower_rows:
            start=max(upper_interval[0],lower_interval[0]);end=min(upper_interval[1],lower_interval[1])
            if not start<end:continue
            difference=pp_sub(upper,lower)
            try:roots=pp_poly_roots(difference)
            except ValueError as error:
                # (EXT-20261109-f) an irreducible cubic/quartic has no closed-form root, but only roots INSIDE (start,end) matter: count them exactly (Sturm).
                if str(error)!='PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM' or _pp_real_roots_inside(difference,start,end)!=0:raise
                roots=[]
            if roots is None:raise ValueError('GRAPH_REGION_EMPTY:'+region_id)
            if any(start<root<end for root in roots):raise ValueError('GRAPH_REGION_BOUNDARIES_CROSS:'+region_id)
            if float(_pp_poly_value(difference,(start+end)/2))<=0:raise ValueError('GRAPH_REGION_BOUNDARIES_CROSS:'+region_id)

def piecewise_polynomial_regions(plan,pieces,intervals,refs,line_specs):
    """Validate graphPlan.regions and freeze their exact boundary rows. A region is a closed band between two drawn boundaries over [from,to]:
    upper/lower name 'f' (the function), 'axis' (y=0), a referenceCurve id or a referenceLine id. The engine samples the rows, so the
    boundary is the drawn curve itself; the independent observer recomputes the same rows and checks the final fill polygon."""
    raw=plan.get('regions')
    if raw is None:return []
    if not isinstance(raw,list) or len(raw)>PIECEWISE_POLY_MAX_REGIONS:raise ValueError('GRAPH_REGION_COUNT_INVALID')
    ids=set();rows=[]
    for entry in raw:
        if not isinstance(entry,dict):raise ValueError('GRAPH_REGION_FIELD_INVALID')
        unknown=sorted(set(entry)-PIECEWISE_POLY_REGION_FIELDS)
        if unknown:raise ValueError('GRAPH_REGION_FIELD_UNKNOWN:'+str(unknown[0]))
        if not {'id','upper','lower','from','to'}<=set(entry):raise ValueError('GRAPH_REGION_FIELD_INVALID')
        region_id=entry['id']
        if not isinstance(region_id,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,31}',region_id):raise ValueError('GRAPH_REGION_ID_INVALID')
        if region_id in ids:raise ValueError('GRAPH_REGION_ID_DUPLICATE:'+region_id)
        ids.add(region_id)
        if not isinstance(entry['upper'],str) or not isinstance(entry['lower'],str):raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        try:from_x=pp_exact_value(entry['from']);to_x=pp_exact_value(entry['to'])
        except ValueError:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id) from None
        if not float(from_x)<float(to_x) or abs(float(from_x))>1e6 or abs(float(to_x))>1e6:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id)
        fill=entry.get('fill','LIGHT')
        if fill not in PIECEWISE_POLY_REGION_FILLS:raise ValueError('GRAPH_REGION_FILL_UNSUPPORTED:'+region_id)
        label=entry.get('label')
        if label is not None and (not isinstance(label,str) or not label.strip() or len(label)>40):raise ValueError('GRAPH_REGION_LABEL_INVALID:'+region_id)
        upper=_pp_region_rows(entry['upper'],from_x,to_x,pieces,intervals,refs,line_specs,region_id)
        lower=_pp_region_rows(entry['lower'],from_x,to_x,pieces,intervals,refs,line_specs,region_id)
        _pp_region_crossings(upper,lower,region_id)
        rows.append({'id':region_id,'upper':entry['upper'],'lower':entry['lower'],'from':_pp_text(from_x),'to':_pp_text(to_x),'fromValue':float(from_x),'toValue':float(to_x),
                     'fill':fill,**({'label':label} if label is not None else {}),
                     'upperRows':[{'coefficients':[_pp_text(value) for value in coefficients],'interval':[_pp_text(interval[0]),_pp_text(interval[1])]} for coefficients,interval in upper],
                     'lowerRows':[{'coefficients':[_pp_text(value) for value in coefficients],'interval':[_pp_text(interval[0]),_pp_text(interval[1])]} for coefficients,interval in lower]})
    return rows

def fit_piecewise_polynomial(plan):
    if 'curveColor' in plan:curve_color_name(plan['curveColor'])
    if 'functionName' in plan and not (isinstance(plan['functionName'],str) and re.fullmatch(r'[a-hj-wz]',plan['functionName'])):raise ValueError('PIECEWISE_POLY_FUNCTION_NAME_INVALID')
    # nameVariable (EXT-20261109-b): the letter the function's name is written with, g(y) for a density of y; one lowercase letter that is not the function's own name
    if 'nameVariable' in plan and (not isinstance(plan['nameVariable'],str) or not re.fullmatch(r'[a-z]',plan['nameVariable']) or plan['nameVariable']==plan.get('functionName')):raise ValueError('PIECEWISE_POLY_NAME_VARIABLE_INVALID')
    if 'sampleNote' in plan and (not isinstance(plan['sampleNote'],str) or not re.fullmatch(r'[0-9A-Za-z=+\-*/(). ]{1,32}',plan['sampleNote']) or not plan['sampleNote'].strip()):raise ValueError('PIECEWISE_POLY_SAMPLE_NOTE_INVALID')
    pieces,breaks,source,intervals=piecewise_polynomial_source(plan)
    lo,hi,states=source
    refs=piecewise_reference_curves(plan,pieces,breaks,source,intervals)
    def ref_value(row,x_value):
        """The exact value of a reference curve at x, or None when x is outside its own domain (open ends excluded)."""
        at=S.sympify(x_value)
        for coefficients,(a,b) in zip(row['pieces'],row['intervals']):
            if pp_in_domain(at,(a,b),row['source']):return _pp_poly_value(coefficients,at)
        return None
    def ref_float(row,x_value):
        try:at=S.Rational(str(x_value))
        except (TypeError,ValueError):at=S.Float(x_value)
        value=ref_value(row,at)
        return None if value is None else float(value)
    def ref_boundary_value(row,x_value):
        """The value at a source-domain end, including an OPEN end (its dot is drawn there even though the point is excluded)."""
        at=S.sympify(x_value)
        for coefficients,(a,b) in zip(row['pieces'],row['intervals']):
            if pp_in_closed(at,(a,b)):return _pp_poly_value(coefficients,at)
        return None
    def g(x_value):
        x_value=S.sympify(x_value)
        for coefficients,interval in zip(pieces,intervals):
            if _pp_inside(x_value,interval,False):return _pp_poly_value(coefficients,x_value)
        raise ValueError('PIECEWISE_POLY_POINT_OUTSIDE_SOURCE_DOMAIN')
    def g_float(x_value):
        for coefficients,(a,b) in zip(pieces,intervals):
            if (a is None or float(a)<=x_value+1e-12) and (b is None or x_value-1e-12<=float(b)):return sum(float(c)*x_value**i for i,c in enumerate(coefficients))
        raise ValueError('PIECEWISE_POLY_POINT_OUTSIDE_SOURCE_DOMAIN')
    corners=[(x_value,y_value) for x_value,y_value in breaks]
    extrema=piecewise_polynomial_extrema(pieces,intervals)
    # Key points the author marks: every corner and every vertex inside a piece must be among them (the claim), and each lies on the curve.
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>PIECEWISE_POLY_MAX_REQUIRED_POINTS:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_xy=[];exact_points={};normalized=[]
    for point in required:
        if not isinstance(point,dict) or set(point)-{'id','x','y','marker'} or not {'id','x','y'}<=set(point) or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids:raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        # marker NONE (G12-1): a key point the framing and the claims need (a vertex, a corner) that the picture does not draw: no dot, no name, no coordinates.
        if 'marker' in point and point['marker']!='NONE':raise ValueError('REQUIRED_POINT_MARKER_INVALID:'+point['id'])
        # A coordinate is a number or an exact string (for an irrational key point such as the vertex '-3/2+sqrt(3)/2'); the exact strings become
        # the point's exactCoordinates and the figure keeps the float.
        floats={};exact={}
        for k in ('x','y'):
            value=point[k]
            if isinstance(value,str):
                try:exact[k]=pp_exact_value(value);floats[k]=float(exact[k])
                except ValueError:raise ValueError('INVALID_REQUIRED_GRAPH_POINT') from None
            elif isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
            else:floats[k]=value
            if abs(floats[k])>1e6:raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);at=exact['x'] if 'x' in exact else S.Rational(str(floats['x']))
        if lo is not None and (not lo<=at<=hi or at==lo and states[0]=='OPEN' or at==hi and states[1]=='OPEN'):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_OUTSIDE_SOURCE_DOMAIN:'+point['id'])
        # A key point lies on the function or, with referenceCurves, on one of those curves inside that curve's own domain.
        near=lambda value:abs(value-floats['y'])<=1e-8*max(1,abs(floats['y']))
        if not (near(g_float(floats['x'])) or any((value:=ref_float(row,floats['x'])) is not None and near(value) for row in refs)):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        if len(exact)==2:
            tiny=S.Float('1e-40',60)
            on_ref=lambda row:ref_value(row,exact['x']) is not None and abs(S.N(ref_value(row,exact['x'])-exact['y'],60))<=tiny
            if abs(S.N(g(exact['x'])-exact['y'],60))>tiny and not any(on_ref(row) for row in refs):raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        if exact:
            exact_points[point['id']]=[pp_surd_text(exact[k]) if k in exact else (str(Fraction(str(floats[k]))) if floats[k]==int(floats[k]) else None) for k in ('x','y')]
            if None in exact_points[point['id']]:raise ValueError('PIECEWISE_POLY_REQUIRED_POINT_MIXED_EXACT:'+point['id'])
        normalized.append({'id':point['id'],'x':floats['x'],'y':floats['y'],**({'marker':'NONE'} if point.get('marker')=='NONE' else {})});required_xy.append((floats['x'],floats['y']))
    required=normalized
    marked=lambda x_value,y_value:any(abs(px-float(x_value))<=1e-9*max(1,abs(px)) and abs(py-float(y_value))<=1e-9*max(1,abs(py)) for px,py in required_xy)
    def missing_key_points():
        """Every corner, in-piece vertex and reference-curve vertex that requiredPoints does not mark yet, as exact {x,y} texts (the author adds them all at once)."""
        try:
            rows=list(corners)+[(x_value,y_value) for x_value,y_value,_ in extrema]
            for row in refs:
                if row['kind']=='quadratic':
                    h=_pp_norm(-row['coefficients'][1]/(2*row['coefficients'][2]));rows.append((h,ref_value(row,h)))
                else:rows+=list(row['corners'])+[(x_value,y_value) for x_value,y_value,_ in row['extrema']]
            found=[];seen=set()
            for x_value,y_value in rows:
                if marked(x_value,y_value):continue
                pair=(_pp_text(x_value),_pp_text(y_value))
                if pair not in seen:seen.add(pair);found.append({'x':pair[0],'y':pair[1]})
            return {'kind':'ADD_REQUIRED_POINTS','points':found} if found else None
        except (ValueError,KeyError,TypeError):return None
    for x_value,y_value in corners:
        if not marked(x_value,y_value):raise HintedValueError('PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value),missing_key_points())
    for x_value,y_value,_ in extrema:
        if not marked(x_value,y_value):raise HintedValueError('PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value),missing_key_points())
    # The vertex of a quadratic reference curve, and every corner and in-piece vertex of a piecewise one, is a key point the author must mark.
    for row in refs:
        if row['kind']=='quadratic':
            h=_pp_norm(-row['coefficients'][1]/(2*row['coefficients'][2]))
            row['vertex']=(h,ref_value(row,h))
            if not marked(h,row['vertex'][1]):raise HintedValueError('PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS:'+row['id']+':'+_pp_text(h),missing_key_points())
            continue
        row['vertex']=None
        for x_value,y_value in row['corners']:
            if not marked(x_value,y_value):raise HintedValueError('PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS:'+row['id']+':'+_pp_text(x_value),missing_key_points())
        for x_value,y_value,_ in row['extrema']:
            if not marked(x_value,y_value):raise HintedValueError('PIECEWISE_POLY_REFERENCE_CURVE_EXTREMUM_NOT_IN_REQUIRED_POINTS:'+row['id']+':'+_pp_text(x_value),missing_key_points())
    # The display formula (optional) must be the same function as the pieces: exact values at nine points of every piece.
    formula=plan.get('formula')
    if formula is not None:
        if any(pp_radicand(c) is not None for piece in pieces for c in piece):raise ValueError('PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED')
        for coefficients,(a,b) in zip(pieces,intervals):
            if a is not None and b is not None:samples=[a+(b-a)*k/8 for k in range(9)]
            elif b is not None:samples=[b-S.Rational(k,2) for k in range(9)]+[b-10,b-100]
            elif a is not None:samples=[a+S.Rational(k,2) for k in range(9)]+[a+10,a+100]
            else:samples=[S.Rational(k-4,2) for k in range(9)]+[S.Integer(-100),S.Integer(100)]
            for x_value in samples:
                if S.Rational(pp_formula_value(formula,x_value).numerator,pp_formula_value(formula,x_value).denominator)!=_pp_poly_value(coefficients,x_value):raise ValueError('PIECEWISE_POLY_FORMULA_MISMATCH:'+_pp_text(x_value))
    # Reference lines: horizontal y=c ({id,y,intersectionX}) or slanted y=m*x+c ({id,slope,intercept,intersectionX}, m and c exact rationals, m != 0).
    # The claimed intersection x values must be exactly the engine's own crossings, in increasing order.
    lines=plan.get('referenceLines',[])
    if not isinstance(lines,list) or len(lines)>3:raise ValueError('PIECEWISE_POLY_REFERENCE_LINES_INVALID')
    crossings=[];line_ids=set();line_specs={}
    for line in lines:
        if not isinstance(line,dict) or not isinstance(line.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',line['id']) or line['id'] in line_ids or not isinstance(line.get('intersectionX'),list) or len(line['intersectionX'])>6 or line.get('labelIntersections',False) not in (True,False):raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        keys=set(line)-{'id','intersectionX','labelIntersections','hideLabel'}
        # hideLabel (EXT-20261109-g, opt-in): the line is drawn but its y=... equation text is not written (a region may still name the line as its boundary)
        if 'hideLabel' in line and not isinstance(line['hideLabel'],bool):raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        if keys=={'y'}:slope=S.Integer(0)
        elif keys=={'slope','intercept'}:slope=None
        else:raise ValueError('PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        line_ids.add(line['id'])
        if slope is None:
            slope=pp_surd(line['slope'],'PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID');level=pp_surd(line['intercept'],'PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID')
            if slope==0:raise ValueError('PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO')
            if line.get('labelIntersections',False):raise ValueError('PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED')
        else:level=pp_surd(line['y'],'PIECEWISE_POLY_REFERENCE_LINE_INVALID')
        line_specs[line['id']]=(slope,level)
        line_radicands={r for r in (pp_radicand(slope),pp_radicand(level)) if r is not None}|{r for r in (pp_radicand(c) for piece in pieces for c in piece) if r is not None}|{r for r in (pp_radicand(v) for pair in breaks for v in pair) if r is not None}
        if len(line_radicands)>1:raise ValueError('PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:'+','.join(str(r) for r in sorted(line_radicands)))
        exact=piecewise_polynomial_crossings(pieces,intervals,level,source,slope)
        claimed=sorted(((text,pp_exact_value(text)) for text in line['intersectionX']),key=lambda row:float(row[1]))
        if len(claimed)!=len(exact) or any(not pp_same(value,root) for (_,value),root in zip(claimed,exact)):
            raise ValueError('PIECEWISE_POLY_INTERSECTION_MISMATCH:'+line['id']+':engine finds '+str(len(exact))+' intersection(s)')
        # A crossing that is also a marked key point (a touching vertex, a corner on the line) is drawn once, as that key point.
        def key_at(x_value,y_value):
            return next((point for point in required if abs(point['x']-x_value)<=1e-9*max(1,abs(x_value)) and abs(point['y']-y_value)<=1e-9*max(1,abs(y_value))),None)
        height=lambda root:float(slope)*float(root)+float(level)
        def crossing_point(text,root):
            # A crossing that is also a marked key point takes that point's float coordinates (one value for the dot, the label and the sampler).
            x_float=float(root);y_float=height(root) if slope!=0 else float(level);key_point=key_at(x_float,y_float)
            if key_point is not None:x_float,y_float=key_point['x'],key_point['y']
            row={'x':text.replace(' ',''),'xValue':x_float}
            if slope!=0:row['yValue']=y_float
            if key_point is not None:row['keyPoint']=key_point['id']
            return row
        if slope==0:crossings.append({'lineId':line['id'],'y':_pp_text(level),'points':[crossing_point(text,root) for (text,_),root in zip(claimed,exact)]})
        else:crossings.append({'lineId':line['id'],'slope':_pp_text(slope),'intercept':_pp_text(level),'points':[crossing_point(text,root) for (text,_),root in zip(claimed,exact)]})
    # Reference curves: every crossing with the function, claimed exactly (as for a line), drawn once as a dot or as the key point it coincides with.
    curve_crossings=[]
    for row in refs:
        if row['id'] in line_ids:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVES_INVALID')
        exact=piecewise_reference_crossings(pieces,intervals,source,row)
        claimed=sorted(((text,pp_exact_value(text)) for text in row['intersectionX']),key=lambda item:float(item[1]))
        if len(claimed)!=len(exact) or any(not pp_same(value,root) for (_,value),root in zip(claimed,exact)):
            raise ValueError('PIECEWISE_POLY_INTERSECTION_MISMATCH:'+row['id']+':engine finds '+str(len(exact))+' intersection(s)')
        points=[]
        for (text,_),root in zip(claimed,exact):
            x_float=float(root);y_float=float(ref_value(row,root))
            key_point=next((point for point in required if abs(point['x']-x_float)<=1e-9*max(1,abs(x_float)) and abs(point['y']-y_float)<=1e-9*max(1,abs(y_float))),None)
            if key_point is not None:x_float,y_float=key_point['x'],key_point['y']
            entry={'x':text.replace(' ',''),'xValue':x_float,'yValue':y_float}
            if key_point is not None:entry['keyPoint']=key_point['id']
            points.append(entry)
        curve_crossings.append({'curveId':row['id'],'points':points})
    # Shaded graph regions (graphPlan.regions): exact boundary rows against the function, the x-axis, a reference curve or a line.
    regions=piecewise_polynomial_regions(plan,pieces,intervals,refs,line_specs)
    key=[(float(x_value),float(y_value)) for x_value,y_value in corners]+[(float(x_value),float(y_value)) for x_value,y_value,_ in extrema]+required_xy
    key+=[(point['xValue'],point['yValue'] if 'slope' in row else pp_exact_float(row['y'])) for row in crossings for point in row['points']]
    key+=[(0.0,pp_exact_float(row['intercept'] if 'slope' in row else row['y'])) for row in crossings if not row['points']]
    key+=[(point['xValue'],point['yValue']) for row in curve_crossings for point in row['points']]
    key+=[(float(row['vertex'][0]),float(row['vertex'][1])) for row in refs if row.get('vertex')]
    key+=[(x,y) for x,y in plan.get('overlayAnchors',[])]
    # A piecewise reference curve also contributes its own corners, in-piece vertices and its domain ends (drawn as hollow/filled dots).
    for row in refs:
        if row['kind']!='piecewise':continue
        key+=[(float(x_value),float(y_value)) for x_value,y_value in row['corners']]
        key+=[(float(x_value),float(y_value)) for x_value,y_value,_ in row['extrema']]
        ref_lo,ref_hi,_=row['source']
        if ref_lo is not None:key.append((float(ref_lo),float(ref_boundary_value(row,ref_lo))))
        if ref_hi is not None:key.append((float(ref_hi),float(ref_boundary_value(row,ref_hi))))
    limit=plot_height_limit(plan)
    if lo is not None:
        ends=[(float(lo),float(g(lo))),(float(hi),float(g(hi)))]
    else:
        # Unbounded outer pieces: each arm runs on beyond the outermost key point, by a fifth of the key width (at least 1), but stops where it
        # leaves the key heights by a quarter of their range (at least 1), so a steep arm never flattens the figure.
        xs=[p[0] for p in key] or [0.0];ys=[p[1] for p in key] or [0.0]
        span=max(xs)-min(xs);extend=max(1.0,.2*span);ylo,yhi=min(ys),max(ys);band=max(1.0,.25*(yhi-ylo))
        ref_heights=lambda at:[value for value in (ref_float(row,at) for row in refs) if value is not None]
        inband=lambda at:all(ylo-band<=height<=yhi+band for height in [g_float(at)]+ref_heights(at))
        def arm(start,direction):
            far=start+direction*extend
            if inband(far):return far
            near=start
            for _ in range(60):
                mid=(near+far)/2
                if inband(mid):near=mid
                else:far=mid
            return near
        left_x,right_x=arm(min(xs),-1),arm(max(xs),1)
        ends=[(left_x,g_float(left_x)),(right_x,g_float(right_x))]
    for region in regions:
        if region['fromValue']<ends[0][0]-1e-9 or region['toValue']>ends[1][0]+1e-9:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region['id'])
    for attempt in range(2):
        ref_end_points=[(end[0],value) for end in ends for value in (ref_float(row,end[0]) for row in refs) if value is not None]
        points=[(0.0,0.0)]+key+ends+ref_end_points
        for ratio in axis_ratios(plan,points,limit):
            viewport,height,scale=equal_unit_frame(points,limit,ratio)
            if (ends[1][0]-ends[0][0])*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
        else:raise ValueError('PIECEWISE_POLY_CURVE_TOO_NARROW')
        if lo is not None or attempt:break
        # An arm shorter than 12 px beyond the outermost key point is lengthened once and the figure framed again.
        key_lo,key_hi=min([p[0] for p in key] or [0.0]),max([p[0] for p in key] or [0.0])
        if (key_lo-ends[0][0])*scale>=PIECEWISE_POLY_MIN_ARM_PX and (ends[1][0]-key_hi)*scale>=PIECEWISE_POLY_MIN_ARM_PX:break
        left_x=min(ends[0][0],key_lo-PIECEWISE_POLY_MIN_ARM_PX/scale);right_x=max(ends[1][0],key_hi+PIECEWISE_POLY_MIN_ARM_PX/scale)
        ends=[(left_x,g_float(left_x)),(right_x,g_float(right_x))]
    # Distinct marked features closer than 4 px could not be told apart.
    marks=[]
    for mark in sorted(set(key)):
        if not any(abs(mark[0]-m[0])<=1e-9*max(1,abs(m[0])) and abs(mark[1]-m[1])<=1e-9*max(1,abs(m[1])) for m in marks):marks.append(mark)
    for index,(ax,ay) in enumerate(marks):
        for bx,by in marks[index+1:]:
            if math.hypot((ax-bx)*scale,(ay-by)*scale*ratio)<PIECEWISE_POLY_MIN_FEATURE_GAP_PX:raise ValueError('PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION')
    draw=[ends[0][0],ends[1][0]]
    piece_rows=[]
    for coefficients,(a,b) in zip(pieces,intervals):
        start=draw[0] if a is None else float(a);end=draw[1] if b is None else float(b)
        piece_rows.append({'coefficients':[_pp_text(c) for c in coefficients],'interval':[None if a is None else _pp_text(a),None if b is None else _pp_text(b)],'drawInterval':[start,end]})
    features={'schemaVersion':'PIECEWISE_POLYNOMIAL_FEATURES_v1','pieces':piece_rows,'corners':[{'x':_pp_text(x_value),'y':_pp_text(y_value)} for x_value,y_value in corners],'extrema':[{'x':_pp_text(x_value),'y':_pp_text(y_value),'kind':kind} for x_value,y_value,kind in extrema],'intersections':crossings}
    if regions:
        features['regions']=[{'id':row['id'],'upper':row['upper'],'lower':row['lower'],'from':row['from'],'to':row['to'],'domain':[row['fromValue'],row['toValue']],'fill':row['fill'],**({'label':row['label']} if 'label' in row else {}),'upperRows':row['upperRows'],'lowerRows':row['lowerRows']} for row in regions]
    if refs:
        ref_rows=[]
        for row in refs:
            if row['kind']=='quadratic':
                ref_rows.append({'id':row['id'],'coefficients':[_pp_text(c) for c in row['coefficients']],'drawInterval':draw})
                continue
            drawn=[]
            for coefficients,(a,b) in zip(row['pieces'],row['intervals']):
                start=draw[0] if a is None else max(draw[0],float(a));end=draw[1] if b is None else min(draw[1],float(b))
                if end-start<=1e-9:continue
                drawn.append({'coefficients':[_pp_text(c) for c in coefficients],'interval':[None if a is None else _pp_text(a),None if b is None else _pp_text(b)],'drawInterval':[start,end]})
            if not drawn:raise ValueError('PIECEWISE_POLY_REFERENCE_CURVE_OUTSIDE_VIEW:'+row['id'])
            entry={'id':row['id'],'pieces':drawn,'corners':[{'x':_pp_text(x_value),'y':_pp_text(y_value)} for x_value,y_value in row['corners']],'extrema':[{'x':_pp_text(x_value),'y':_pp_text(y_value),'kind':kind} for x_value,y_value,kind in row['extrema']]}
            ref_lo,ref_hi,ref_states=row['source']
            if ref_lo is not None:entry['sourceInterval']={'lo':_pp_text(ref_lo),'hi':_pp_text(ref_hi),'startState':ref_states[0],'endState':ref_states[1],'startY':_pp_text(ref_boundary_value(row,ref_lo)),'endY':_pp_text(ref_boundary_value(row,ref_hi))}
            if row.get('name') is not None:entry['name']=row['name']
            if row.get('formula') is not None:entry['formula']=row['formula']
            ref_rows.append(entry)
        features['referenceCurves']=ref_rows;features['curveIntersections']=curve_crossings
    fitted={key_name:value for key_name,value in plan.items() if key_name not in ('domain','viewport')}
    if exact_points:
        merged=dict(plan.get('exactCoordinates') or {})
        if any(point_id in merged and merged[point_id]!=pair for point_id,pair in exact_points.items()):raise ValueError('PIECEWISE_POLY_EXACT_COORDINATES_CONFLICT')
        merged.update(exact_points);fitted['exactCoordinates']=merged
    fitted['requiredPoints']=required
    fitted.update({'domain':draw,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','piecewisePolynomialFeatures':features,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}})
    if lo is not None:
        fitted['intervalFeatures']={'schemaVersion':'POLYNOMIAL_INTERVAL_FEATURES_v1','endpoints':[{'side':'START','x':_pp_text(lo),'y':_pp_text(g(lo)),'state':states[0]},{'side':'END','x':_pp_text(hi),'y':_pp_text(g(hi)),'state':states[1]}]}
        fitted['intervalFeaturePolicy']={'schemaVersion':'POLYNOMIAL_INTERVAL_POLICY_v1','markerRadiusIntrinsicPx':4,'minimumMarkerDiameterCssPx':3}
    return {'graphPlan':fitted,'policy':'PIECEWISE_POLYNOMIAL_OVERVIEW_v1','sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

# ---- piecewise discontinuous: one to six polynomial pieces (degree <= 2) on their own intervals, each end OPEN or CLOSED ----------
# Unlike piecewise-polynomial-spike-v1 the pieces need not meet: a junction may jump, the function value there is declared either by a
# CLOSED end or by jumpValues, and a jumpValue may also stand alone as an isolated point. A staircase is written as a step block.
PIECEWISE_DISCONTINUOUS_FIELDS={'family','pieces','step','jumpValues','referenceLines','requiredPoints','exactCoordinates','axisTickValues','functionName','domain','viewport','plotHeightLimit','axisTitles','limitArrows','xWindow','sharedCurve','sharedFeatures','overlays','overlayAnchors','curveColor','nameLabel','axisVariable'}
PIECEWISE_DISCONTINUOUS_OVERVIEW_POLICY='PIECEWISE_DISCONTINUOUS_OVERVIEW_v1'
PIECEWISE_DISCONTINUOUS_MAX_PIECES=12   # up to 12 pieces: a two-function solution figure restores a graph with its mirror image (8), and an even or periodic function joins integer points over [-4,6] (10)
PIECEWISE_DISCONTINUOUS_MAX_STEPS=6
PIECEWISE_DISCONTINUOUS_MAX_JUMP_VALUES=8
PIECEWISE_DISCONTINUOUS_MAX_REQUIRED_POINTS=24
PIECEWISE_DISCONTINUOUS_MIN_FEATURE_GAP_PX=4
PIECEWISE_DISCONTINUOUS_MAX_LIMIT_ARROWS=6
# limitArrows: a short arrow on the curve toward (at, toY) from the LEFT or RIGHT, with dashed guides from that point to both axes. The tip stops
# LIMIT_ARROW_HEAD_GAP_PX (screen px along the curve) short of the point so the open dot stays clear; the tail is up to LIMIT_ARROW_TAIL_PX away and never leaves its piece.
LIMIT_ARROW_HEAD_GAP_PX=11.0
LIMIT_ARROW_TAIL_PX=46.0
LIMIT_ARROW_MIN_LENGTH_PX=30.0

def pd_limit_arrow_inputs(plan,pieces):
    """The authored limitArrows, each checked exactly: the piece the arrow runs along (the one reaching `at` from that side) must approach exactly toY there."""
    raw=plan.get('limitArrows',[])
    if not isinstance(raw,list) or len(raw)>PIECEWISE_DISCONTINUOUS_MAX_LIMIT_ARROWS:raise ValueError('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID')
    rows=[]
    for index,entry in enumerate(raw):
        if not isinstance(entry,dict) or set(entry)-{'curve','at','side','toY'} or not {'at','side','toY'}<=set(entry) or entry['side'] not in ('LEFT','RIGHT') or ('curve' in entry and not isinstance(entry['curve'],str)):raise ValueError('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID:'+str(index+1))
        at=pp_surd(entry['at'],'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID:'+str(index+1));to_y=pp_surd(entry['toY'],'PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_INVALID:'+str(index+1))
        left=entry['side']=='LEFT'
        found=[(k,piece) for k,piece in enumerate(pieces) if (piece['a'] is None or (piece['a']<at if left else piece['a']<=at)) and (piece['b'] is None or (at<=piece['b'] if left else at<piece['b']))]
        if len(found)!=1:raise ValueError('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_AT_INVALID:'+str(index+1))
        k,piece=found[0]
        if not pp_same(pd_piece_value(piece,at),to_y):raise ValueError('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_VALUE_MISMATCH:'+str(index+1)+':the curve approaches '+_pp_text(pd_piece_value(piece,at)))
        rows.append({'index':index+1,'at':at,'toY':to_y,'side':entry['side'],'piece':k})
    return rows

def pd_limit_arrow_features(rows,pieces,draw,scale,ratio):
    """Geometry of every arrow (tail and tip ON the curve, tip short of the target) in model units once the x scale is known."""
    out=[]
    for row in rows:
        piece=pieces[row['piece']];at=float(row['at']);sign=-1.0 if row['side']=='LEFT' else 1.0
        edge=(draw[0] if piece['a'] is None else max(draw[0],float(piece['a']))) if sign<0 else (draw[1] if piece['b'] is None else min(draw[1],float(piece['b'])))
        room=abs(at-edge)
        value=lambda x_value:float(pd_piece_value(piece,x_value));target=float(row['toY'])
        def dx_for(pixels,cap):
            # the x distance from the point at which the curve itself is `pixels` of screen away from it (arc distance grows with x: bisection), never beyond cap
            reach=lambda dx:math.hypot(dx*scale,(value(at+sign*dx)-target)*scale*ratio)
            if reach(cap)<=pixels:return cap
            low,high=0.0,cap
            for _ in range(60):
                mid=(low+high)/2
                if reach(mid)<pixels:low=mid
                else:high=mid
            return (low+high)/2
        head_dx=dx_for(LIMIT_ARROW_HEAD_GAP_PX,.5*room);tail_dx=dx_for(LIMIT_ARROW_TAIL_PX,.85*room)
        tail=(at+sign*tail_dx,value(at+sign*tail_dx));tip=(at+sign*head_dx,value(at+sign*head_dx))
        if math.hypot((tail[0]-tip[0])*scale,(tail[1]-tip[1])*scale*ratio)<LIMIT_ARROW_MIN_LENGTH_PX:raise ValueError('PIECEWISE_DISCONTINUOUS_LIMIT_ARROW_NO_ROOM:'+str(row['index']))
        out.append({'id':'limit-arrow-'+str(row['index']),'at':_pp_text(row['at']),'toY':_pp_text(row['toY']),'atValue':at,'toYValue':float(row['toY']),'side':row['side'],'piece':row['piece']+1,'from':list(tail),'to':list(tip),'guideX':abs(float(row['toY']))>1e-12,'guideY':abs(at)>1e-12})
    return out

PIECEWISE_ARC_FIELDS={'kind','center','radiusSquared','fromX','toX','branch','leftClosed','rightClosed'}

def _pd_arc_piece(entry,index):
    """A circular-arc piece y=cy+-sqrt(r2-(x-cx)^2) on fromX..toX (UPPER or LOWER half of the circle), each end OPEN or CLOSED (leftClosed/rightClosed, default CLOSED)."""
    invalid='PIECEWISE_ARC_INVALID:'+str(index)
    if set(entry)-PIECEWISE_ARC_FIELDS or not {'center','radiusSquared','fromX','toX','branch'}<=set(entry):raise ValueError(invalid)
    center=entry['center']
    if not isinstance(center,list) or len(center)!=2:raise ValueError(invalid)
    cx=pp_surd(center[0],invalid);cy=pp_surd(center[1],invalid);r2=pp_surd(entry['radiusSquared'],invalid)
    a=pp_surd(entry['fromX'],invalid);b=pp_surd(entry['toX'],invalid)
    if entry['branch'] not in ('UPPER','LOWER') or not r2>0 or not a<b:raise ValueError(invalid)
    for flag in ('leftClosed','rightClosed'):
        if flag in entry and not isinstance(entry[flag],bool):raise ValueError(invalid)
    tiny=S.Float('1e-40',60)
    if any(S.N(r2-(value-cx)**2,60)<-tiny for value in (a,b)):raise ValueError('PIECEWISE_ARC_OUT_OF_DOMAIN:'+str(index))
    return {'kind':'ARC','coefficients':[S.Integer(0)]*3,'a':a,'b':b,'start':'CLOSED' if entry.get('leftClosed',True) else 'OPEN','end':'CLOSED' if entry.get('rightClosed',True) else 'OPEN','arc':{'cx':cx,'cy':cy,'r2':r2,'sign':1 if entry['branch']=='UPPER' else -1}}

def pd_arc_extremum(piece):
    """The top (UPPER) or bottom (LOWER) of the circle when it lies strictly inside the arc's own x interval, else None."""
    arc=piece['arc']
    if not (piece['a']<arc['cx']<piece['b']):return None
    return (_pp_norm(arc['cx']),_pp_norm(arc['cy']+arc['sign']*S.sqrt(arc['r2'])),'MAX' if arc['sign']>0 else 'MIN')

def pd_arc_roots(arc,level):
    """Every x where the arc's whole branch of the circle equals the horizontal line y=level (exact)."""
    dy=level-arc['cy']
    if arc['sign']*dy<0:return []
    rest=arc['r2']-dy**2
    if S.N(rest,60)<-S.Float('1e-40',60):return []
    if abs(S.N(rest,60))<=S.Float('1e-40',60):return [_pp_norm(arc['cx'])]
    return [_pp_norm(arc['cx']-S.sqrt(rest)),_pp_norm(arc['cx']+S.sqrt(rest))]

def pd_extrema(pieces):
    rows=[]
    for piece in pieces:
        if piece.get('arc'):
            row=pd_arc_extremum(piece)
            if row is not None:rows.append(row)
        else:rows.extend(piecewise_polynomial_extrema([piece['coefficients']],[(piece['a'],piece['b'])]))
    return rows

def _pd_piece(entry,index):
    """One piece: exact coefficients of degree at most 2 and its own interval, each end OPEN or CLOSED (null = an unbounded end)."""
    if isinstance(entry,dict) and entry.get('kind')=='ARC':return _pd_arc_piece(entry,index)
    if not isinstance(entry,dict) or 'coefficients' not in entry or 'domain' not in entry or set(entry)-{'coefficients','domain','start','end'}:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index))
    raw=entry['coefficients']
    if not isinstance(raw,list) or not 1<=len(raw)<=3:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index))
    coefficients=[pp_surd(value,'PIECEWISE_DISCONTINUOUS_COEFFICIENT_INVALID') for value in raw]+[S.Integer(0)]*(3-len(raw))
    domain=entry['domain']
    if not isinstance(domain,list) or len(domain)!=2:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index))
    a=None if domain[0] is None else pp_surd(domain[0],'PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index))
    b=None if domain[1] is None else pp_surd(domain[1],'PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index))
    if a is not None and b is not None and not a<b:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index))
    start=entry.get('start','CLOSED');end=entry.get('end','CLOSED')
    if start not in INTERVAL_STATES or end not in INTERVAL_STATES:raise ValueError('PIECEWISE_ENDPOINT_STATE_INVALID:'+str(index))
    if a is None and start=='OPEN' or b is None and end=='OPEN':raise ValueError('PIECEWISE_ENDPOINT_STATE_INVALID:'+str(index))
    return {'coefficients':coefficients,'a':a,'b':b,'start':start,'end':end}

def piecewise_discontinuous_step(step):
    """A staircase: values[i] on the i-th equal subinterval of [xFrom,xTo], every piece closed on the left and open on the right except
    the last, which is closed at xTo. Returns the same piece rows as the pieces field."""
    if not isinstance(step,dict) or set(step)!={'values','xFrom','xTo'}:raise ValueError('STEP_INTERVAL_INVALID')
    values=step['values']
    if not isinstance(values,list) or not 1<=len(values)<=PIECEWISE_DISCONTINUOUS_MAX_STEPS:raise ValueError('STEP_INTERVAL_INVALID')
    x_from=pp_surd(step['xFrom'],'STEP_INTERVAL_INVALID');x_to=pp_surd(step['xTo'],'STEP_INTERVAL_INVALID')
    if not x_from<x_to:raise ValueError('STEP_INTERVAL_INVALID')
    heights=[pp_surd(value,'PIECEWISE_DISCONTINUOUS_COEFFICIENT_INVALID') for value in values]
    width=(x_to-x_from)/len(heights)
    pieces=[]
    for index,height in enumerate(heights):
        a=x_from+index*width;b=x_from+(index+1)*width
        pieces.append({'coefficients':[height,S.Integer(0),S.Integer(0)],'a':a,'b':b,'start':'CLOSED','end':'CLOSED' if index==len(heights)-1 else 'OPEN'})
    return pieces

def piecewise_discontinuous_pieces(plan):
    """The exact pieces of a discontinuous plan: either pieces (1 to 6) or a step block (exactly one of them), ordered left to right,
    with at most one unbounded end on each side and no overlapping domain."""
    if ('pieces' in plan)==('step' in plan):raise ValueError('PIECEWISE_DISCONTINUOUS_SOURCE_INVALID')
    if 'step' in plan:
        pieces=piecewise_discontinuous_step(plan['step'])
    else:
        raw=plan['pieces']
        if not isinstance(raw,list) or not 1<=len(raw)<=PIECEWISE_DISCONTINUOUS_MAX_PIECES:raise ValueError('PIECEWISE_TOO_MANY_PIECES')
        pieces=[_pd_piece(entry,index+1) for index,entry in enumerate(raw)]
    if len(pieces)>PIECEWISE_DISCONTINUOUS_MAX_PIECES:raise ValueError('PIECEWISE_TOO_MANY_PIECES')
    for index,piece in enumerate(pieces):
        if piece['a'] is None and index!=0 or piece['b'] is None and index!=len(pieces)-1:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_INVALID:'+str(index+1))
    for previous,current in zip(pieces,pieces[1:]):
        if previous['b'] is None or current['a'] is None:raise ValueError('PIECEWISE_DISCONTINUOUS_PIECE_INVALID')
        if previous['b']>current['a']:raise ValueError('PIECEWISE_DOMAIN_OVERLAP:'+_pp_text(current['a']))
    return pieces

def pd_defines_at(piece,x_value):
    """Whether this piece's own interval contains x (an OPEN end excludes its value)."""
    a,b=piece['a'],piece['b']
    if a is not None and (x_value<a or pp_same(x_value,a) and piece['start']=='OPEN'):return False
    if b is not None and (x_value>b or pp_same(x_value,b) and piece['end']=='OPEN'):return False
    return True

def pd_piece_value(piece,x_value):
    arc=piece.get('arc')
    if arc is not None:return _pp_norm(arc['cy']+arc['sign']*S.sqrt(arc['r2']-(S.sympify(x_value)-arc['cx'])**2))
    return _pp_norm(sum((c*S.sympify(x_value)**i for i,c in enumerate(piece['coefficients'])),S.Integer(0)))

def piecewise_discontinuous_values(plan,pieces):
    """The declared jump values {x,y} (an isolated point or the function value at a jump), checked against the pieces: a value inside a
    piece must be that piece's value, two entries at one x contradict each other, and every junction where neither end is CLOSED needs one."""
    raw=plan.get('jumpValues',[])
    if not isinstance(raw,list) or len(raw)>PIECEWISE_DISCONTINUOUS_MAX_JUMP_VALUES:raise ValueError('PIECEWISE_DISCONTINUOUS_JUMP_VALUES_INVALID')
    rows=[]
    for entry in raw:
        if not isinstance(entry,dict) or set(entry)!={'x','y'}:raise ValueError('PIECEWISE_DISCONTINUOUS_JUMP_VALUES_INVALID')
        x_value=pp_surd(entry['x'],'PIECEWISE_DISCONTINUOUS_JUMP_VALUES_INVALID');y_value=pp_surd(entry['y'],'PIECEWISE_DISCONTINUOUS_JUMP_VALUES_INVALID')
        if any(pp_same(x_value,other[0]) for other in rows):raise ValueError('PIECEWISE_VALUE_CONFLICT:'+_pp_text(x_value))
        rows.append((x_value,y_value))
    for x_value,y_value in rows:
        for piece in pieces:
            if pd_defines_at(piece,x_value) and not pp_same(pd_piece_value(piece,x_value),y_value):raise ValueError('PIECEWISE_VALUE_CONFLICT:'+_pp_text(x_value))
    for previous,current in zip(pieces,pieces[1:]):
        if previous['b'] is None or current['a'] is None or not pp_same(previous['b'],current['a']):continue
        x_value=current['a'];left_closed=previous['end']=='CLOSED';right_closed=current['start']=='CLOSED'
        if left_closed and right_closed:raise ValueError('PIECEWISE_DOMAIN_OVERLAP:'+_pp_text(x_value))
        declared=[value for at,value in rows if pp_same(at,x_value)]
        if not left_closed and not right_closed:
            if not declared:raise ValueError('PIECEWISE_DISCONTINUITY_UNDECLARED:'+_pp_text(x_value))
        elif declared:
            expected=pd_piece_value(previous if left_closed else current,x_value)
            if any(not pp_same(value,expected) for value in declared):raise ValueError('PIECEWISE_VALUE_CONFLICT:'+_pp_text(x_value))
    return rows

def piecewise_discontinuous_markers(pieces,jump_values):
    """The dots of the figure: every bounded piece end (hollow when OPEN, filled when CLOSED) and every declared value, deduplicated by
    point (a filled dot wins over a hollow one at the same coordinates)."""
    markers=[]
    def add(x_value,y_value,state):
        for row in markers:
            if pp_same(row[0],x_value) and pp_same(row[1],y_value):
                if state=='CLOSED':row[2]='CLOSED'
                return
        markers.append([x_value,y_value,state])
    for piece in pieces:
        if piece['a'] is not None:add(piece['a'],pd_piece_value(piece,piece['a']),piece['start'])
        if piece['b'] is not None:add(piece['b'],pd_piece_value(piece,piece['b']),piece['end'])
    for x_value,y_value in jump_values:add(x_value,y_value,'CLOSED')
    return sorted(markers,key=lambda row:(float(row[0]),float(row[1])))

def piecewise_discontinuous_crossings(pieces,level,jump_values):
    """Every x where the function equals the horizontal line y=level, exactly and once: a root inside a piece's interval (an OPEN end is
    not on the graph) or a declared value at that height. A piece equal to the line is refused."""
    found=[]
    for piece in pieces:
        if piece.get('arc'):
            roots=pd_arc_roots(piece['arc'],level)
            for root in roots:
                if pd_defines_at(piece,root) and not any(pp_same(root,other) for other in found):found.append(root)
            continue
        c0,c1,c2=piece['coefficients']
        roots=pp_quadratic_roots(c0-level,c1,c2)
        if roots is None:raise ValueError('PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE')
        for root in roots:
            if not pd_defines_at(piece,root):continue
            if not any(pp_same(root,other) for other in found):found.append(root)
    for x_value,y_value in jump_values:
        if pp_same(y_value,level) and not any(pp_same(x_value,other) for other in found):found.append(x_value)
    return sorted(found,key=lambda value:float(value))

PIECEWISE_SHARED_CURVE_FIELDS={'id','name','style','pieces','step','jumpValues','limitArrows','nameLabel','color'}
PIECEWISE_NAME_LABEL_FIELDS={'text','placement','anchorX'}
PIECEWISE_SHARED_STYLES=('DASHED','ACCENT')
PIECEWISE_SHARED_MIN_DOT_GAP_PX=4.0

def curve_color_name(value,ident='curveColor'):
    """(G12-2) The palette colour a drawn curve wears (BLUE WARM GREEN ROSE VIOLET), or OVERLAY_COLOR_INVALID:<where>."""
    if value not in OVERLAY_COLOR_NAMES:raise ValueError('OVERLAY_COLOR_INVALID:'+str(ident))
    return value

PD_MAIN_NAME_AT=('START','MID','END')
PD_MAIN_NAME_SIDES=('BELOW','ABOVE')
def pd_main_name_label(plan):
    """graphPlan.nameLabel {at:START|MID|END,side?:BELOW|ABOVE} (G12-4): where the name of the function f (f(x)) stands along its curve; absent keeps the old place (near the
    left end, below). Returns the validated row or None."""
    raw=plan.get('nameLabel')
    if raw is None:return None
    if not isinstance(raw,dict) or set(raw)-{'at','side'} or raw.get('at') not in PD_MAIN_NAME_AT or raw.get('side','BELOW') not in PD_MAIN_NAME_SIDES:raise ValueError('CURVE_NAME_LABEL_INVALID')
    if plan.get('functionName') is None:raise ValueError('CURVE_NAME_LABEL_INVALID')
    return {'at':raw['at'],'side':raw.get('side','BELOW')}

def pd_axis_variable(plan):
    """graphPlan.axisVariable (G12-4): the letter the horizontal axis and the function names use instead of x (g(m)); one lowercase letter that is neither y nor the function's own name."""
    value=plan.get('axisVariable')
    if value is None:return None
    if not isinstance(value,str) or not re.fullmatch(r'[a-xz]',value) or value==plan.get('functionName'):raise ValueError('INVALID_AXIS_VARIABLE')
    return value

def _pd_name_label(plan,shared):
    """sharedCurve.nameLabel {text?,placement:'LEADER',anchorX?} (G7c): g's name tied to the curve by a leader that starts ON g at anchorX (an exact value;
    without it the engine takes the middle of g's longest drawn piece) and ends on the label box. Returns the validated frozen row, or None when absent."""
    raw=shared.get('nameLabel')
    if raw is None:return None
    if not isinstance(raw,dict) or set(raw)-PIECEWISE_NAME_LABEL_FIELDS or raw.get('placement')!='LEADER':raise ValueError('CURVE_NAME_LABEL_INVALID')
    row={'placement':'LEADER'}
    if 'text' in raw:
        if not isinstance(raw['text'],str) or not raw['text'].strip():raise ValueError('CURVE_NAME_LABEL_INVALID')
        row['text']=raw['text']
    if 'anchorX' in raw:
        anchor=pp_exact_value(str(raw['anchorX']))
        pieces=piecewise_discontinuous_pieces(shared)
        if not any(pd_defines_at(piece,anchor) for piece in pieces):
            try:defined=[[None if piece['a'] is None else _pp_text(piece['a']),None if piece['b'] is None else _pp_text(piece['b'])] for piece in pieces]
            except (ValueError,KeyError,TypeError):defined=None
            raise HintedValueError('CURVE_NAME_LEADER_ANCHOR_OFF_CURVE',{'kind':'ANCHOR_X_OFF_CURVE','defined':defined} if defined else None)
        row['anchorX']=str(raw['anchorX'])
    return row

def fit_piecewise_discontinuous_shared(plan):
    """Two discontinuous functions on ONE pair of axes (layout SHARED). graphPlan is f's own plan and graphPlan.sharedCurve is g (pieces or step,
    jumpValues, limitArrows, an id, a name and style DASHED|ACCENT: the drawn line style that tells it from f). Both curves are fitted exactly like
    a single function, but at one common frame (one scale on both axes, one x window); the dots where the two curves share a point are listed so
    the second curve's dot can be drawn smaller and both stay visible."""
    shared=plan['sharedCurve']
    if not isinstance(shared,dict) or set(shared)-PIECEWISE_SHARED_CURVE_FIELDS or not isinstance(shared.get('id'),str) or not re.fullmatch(r'[a-hj-wz]',shared['id']):raise ValueError('PAIR_SHARED_CURVE_INVALID')
    if shared.get('style') not in PIECEWISE_SHARED_STYLES:raise ValueError('PAIR_SHARED_CURVES_INDISTINCT')
    if 'color' in shared:curve_color_name(shared['color'],str(shared['id'])+'.color')
    if shared.get('color') is not None and shared['style']=='ACCENT':raise ValueError('OVERLAY_COLOR_INVALID:'+shared['id']+'.color')   # the red ACCENT line style already is its colour
    if plan.get('referenceLines'):raise ValueError('PAIR_SHARED_REFERENCE_LINES_UNSUPPORTED')
    if plan.get('functionName')==shared['id']:raise ValueError('PAIR_SHARED_CURVE_INVALID')
    own={key:value for key,value in plan.items() if key not in ('sharedCurve','sharedFeatures','overlays','overlayAnchors')}
    name_label=_pd_name_label(plan,shared)
    second={'family':plan['family'],'requiredPoints':[],'axisTickValues':{'x':[],'y':[]},'functionName':shared['id'],**{key:value for key,value in shared.items() if key in ('pieces','step','jumpValues','limitArrows')}}
    for key in ('xWindow','plotHeightLimit','axisTitles'):
        if key in plan:second[key]=plan[key]
    first_probe=fit_piecewise_discontinuous(own,probe=True);second_probe=fit_piecewise_discontinuous(second,probe=True)
    points=first_probe['points']+second_probe['points']+[(float(x_value),float(y_value)) for x_value,y_value in plan.get('overlayAnchors',[])];ends=first_probe['ends']+second_probe['ends']
    limit=plot_height_limit(plan)
    for ratio in axis_ratios(plan,points,limit):
        if (first_probe['hasArc'] or second_probe['hasArc']) and ratio!=1.0:raise ValueError('PIECEWISE_ARC_REQUIRES_EQUAL_UNITS')
        viewport,height,scale=equal_unit_frame(points,limit,ratio)
        if (max(x for x,_ in ends)-min(x for x,_ in ends))*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
    else:raise ValueError('PIECEWISE_DISCONTINUOUS_CURVE_TOO_NARROW')
    frame=(viewport,height,scale,ratio)
    first=fit_piecewise_discontinuous(own,frame=frame)['graphPlan'];result=fit_piecewise_discontinuous(second,frame=frame)
    other=result['graphPlan']
    # The dots both curves share (same point): the second curve's dot is drawn smaller; distinct dots under 4 px apart could not be told apart.
    first_markers=first['piecewiseDiscontinuousFeatures']['markers'];second_markers=other['piecewiseDiscontinuousFeatures']['markers']
    coincident=[]
    for a in first_markers:
        ax,ay=pp_exact_float(a['x']),pp_exact_float(a['y'])
        for b in second_markers:
            bx,by=pp_exact_float(b['x']),pp_exact_float(b['y'])
            gap=math.hypot((ax-bx)*scale,(ay-by)*scale*ratio)
            if gap<=1e-6:coincident.append({'first':a['id'],'second':b['id'],'x':a['x'],'y':a['y'],'firstState':a['state'],'secondState':b['state']})
            elif gap<PIECEWISE_SHARED_MIN_DOT_GAP_PX:raise ValueError('PIECEWISE_DISCONTINUOUS_FEATURES_BELOW_RESOLUTION')
    other={**other,'id':shared['id'],'style':shared['style']}
    if 'name' in shared:other['name']=shared['name']
    if name_label is not None:other['nameLabel']=name_label
    if 'color' in shared:other['color']=shared['color']
    if 'overlays' in plan:first['overlays']=plan['overlays']
    first['sharedCurve']=other;first['sharedFeatures']={'schemaVersion':'PIECEWISE_SHARED_FEATURES_v1','coincidentMarkers':coincident}
    return {'graphPlan':first,'policy':PIECEWISE_DISCONTINUOUS_OVERVIEW_POLICY,'sourceDomainPreserved':False,'displayOnly':True,'features':first['piecewiseDiscontinuousFeatures'],'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

def fit_piecewise_discontinuous(plan,frame=None,probe=False):
    if 'sharedCurve' in plan and frame is None and not probe:return fit_piecewise_discontinuous_shared(plan)
    if 'functionName' in plan and not (isinstance(plan['functionName'],str) and re.fullmatch(r'[a-hj-wz]',plan['functionName'])):raise ValueError('PIECEWISE_DISCONTINUOUS_FUNCTION_NAME_INVALID')
    unknown=sorted(set(plan)-PIECEWISE_DISCONTINUOUS_FIELDS)
    if unknown:raise ValueError('PIECEWISE_DISCONTINUOUS_FIELD_UNKNOWN:'+unknown[0])
    if 'curveColor' in plan:curve_color_name(plan['curveColor'])
    pd_main_name_label(plan);pd_axis_variable(plan)
    pieces=piecewise_discontinuous_pieces(plan)
    jumps=piecewise_discontinuous_values(plan,pieces)
    extrema=pd_extrema(pieces)
    has_arc=any(piece.get('arc') for piece in pieces)
    # Reference lines y=level: the claimed exact crossings must be exactly the engine's own (including declared values on the line).
    raw_lines=plan.get('referenceLines',[])
    if not isinstance(raw_lines,list) or len(raw_lines)>3:raise ValueError('PIECEWISE_REFERENCE_LINES_INVALID')
    line_ids=set();lines=[]
    for line in raw_lines:
        if not isinstance(line,dict) or not isinstance(line.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,7}',line['id']) or line['id'] in line_ids or not isinstance(line.get('intersectionX'),list) or len(line['intersectionX'])>6 or line.get('labelIntersections',False) not in (True,False):raise ValueError('PIECEWISE_REFERENCE_LINE_INVALID')
        if set(line)-{'id','y','intersectionX','labelIntersections'}:raise ValueError('PIECEWISE_REFERENCE_LINE_INVALID')
        line_ids.add(line['id'])
        level=pp_surd(line['y'],'PIECEWISE_REFERENCE_LINE_INVALID')
        exact=piecewise_discontinuous_crossings(pieces,level,jumps)
        claimed=sorted(((text,pp_exact_value(text)) for text in line['intersectionX']),key=lambda row:float(row[1]))
        if len(claimed)!=len(exact) or any(not pp_same(value,root) for (_,value),root in zip(claimed,exact)):
            raise ValueError('PIECEWISE_INTERSECTION_MISMATCH:'+line['id']+':engine finds '+str(len(exact))+' intersection(s)')
        lines.append({'id':line['id'],'level':level,'claimed':claimed,'labelIntersections':line.get('labelIntersections',False)})
    # Key points the author marks: every in-piece vertex, each on the function or on a declared value.
    required=plan.get('requiredPoints',[])
    if not isinstance(required,list) or len(required)>PIECEWISE_DISCONTINUOUS_MAX_REQUIRED_POINTS:raise ValueError('INVALID_REQUIRED_GRAPH_FEATURES')
    ids=set();required_xy=[];exact_points={};normalized=[]
    for point in required:
        if not isinstance(point,dict) or set(point)!={'id','x','y'} or not isinstance(point['id'],str) or not point['id'] or point['id'] in ids:raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        floats={};exact={}
        for k in ('x','y'):
            value=point[k]
            if isinstance(value,str):
                try:exact[k]=pp_exact_value(value);floats[k]=float(exact[k])
                except ValueError:raise ValueError('INVALID_REQUIRED_GRAPH_POINT') from None
            elif isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value):raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
            else:floats[k]=value
            if abs(floats[k])>1e6:raise ValueError('INVALID_REQUIRED_GRAPH_POINT')
        ids.add(point['id']);at=exact['x'] if 'x' in exact else S.Rational(str(floats['x']))
        near=lambda value:abs(value-floats['y'])<=1e-8*max(1,abs(floats['y']))
        on_piece=any(pd_defines_at(piece,at) and near(float(pd_piece_value(piece,at))) for piece in pieces)
        on_value=any(pp_same(at,at_value) and near(float(value)) for at_value,value in jumps)
        if not on_piece and not on_value:raise ValueError('PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        if len(exact)==2:
            tiny=S.Float('1e-40',60)
            exact_on=any(pd_defines_at(piece,exact['x']) and abs(S.N(pd_piece_value(piece,exact['x'])-exact['y'],60))<=tiny for piece in pieces) or any(pp_same(exact['x'],at_value) and pp_same(exact['y'],value) for at_value,value in jumps)
            if not exact_on:raise ValueError('PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_NOT_ON_CURVE:'+point['id'])
        if exact:
            exact_points[point['id']]=[pp_surd_text(exact[k]) if k in exact else (str(Fraction(str(floats[k]))) if floats[k]==int(floats[k]) else None) for k in ('x','y')]
            if None in exact_points[point['id']]:raise ValueError('PIECEWISE_DISCONTINUOUS_REQUIRED_POINT_MIXED_EXACT:'+point['id'])
        normalized.append({'id':point['id'],'x':floats['x'],'y':floats['y']});required_xy.append((floats['x'],floats['y']))
    required=normalized
    marked=lambda x_value,y_value:any(abs(px-float(x_value))<=1e-9*max(1,abs(px)) and abs(py-float(y_value))<=1e-9*max(1,abs(py)) for px,py in required_xy)
    def missing_key_points():
        try:
            found=[];seen=set()
            for x_value,y_value,_ in extrema:
                if marked(x_value,y_value):continue
                pair=(_pp_text(x_value),_pp_text(y_value))
                if pair not in seen:seen.add(pair);found.append({'x':pair[0],'y':pair[1]})
            return {'kind':'ADD_REQUIRED_POINTS','points':found} if found else None
        except (ValueError,KeyError,TypeError):return None
    for x_value,y_value,_ in extrema:
        if not marked(x_value,y_value):raise HintedValueError('PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS:'+_pp_text(x_value),missing_key_points())
    def key_at(x_float,y_float):
        return next((point for point in required if abs(point['x']-x_float)<=1e-9*max(1,abs(x_float)) and abs(point['y']-y_float)<=1e-9*max(1,abs(y_float))),None)
    markers=piecewise_discontinuous_markers(pieces,jumps)
    crossings=[]
    for line in lines:
        points=[]
        for text,root in line['claimed']:
            x_float=float(root);key_point=key_at(x_float,float(line['level']))
            row={'x':text.replace(' ',''),'xValue':x_float}
            if key_point is not None:row['keyPoint']=key_point['id']
            elif any(pp_same(root,at) and pp_same(line['level'],value) for at,value,_ in markers):row['marker']=True
            points.append(row)
        crossings.append({'lineId':line['id'],'y':_pp_text(line['level']),'points':points})
    marker_rows=[{'id':'endpoint-'+str(index),'x':_pp_text(x_value),'y':_pp_text(y_value),'state':state} for index,(x_value,y_value,state) in enumerate(markers,1)]
    key=[(float(x_value),float(y_value)) for x_value,y_value,_ in markers]+[(float(x_value),float(y_value)) for x_value,y_value,_ in extrema]+required_xy+[(float(root),float(line['level'])) for line in lines for _,root in line['claimed']]+[(0.0,0.0)]
    def coverage(x_value):
        for piece in pieces:
            a,b=piece['a'],piece['b']
            if (a is None or float(a)<=x_value) and (b is None or x_value<=float(b)):return float(pd_piece_value(piece,x_value))
        raise ValueError('PIECEWISE_DISCONTINUOUS_POINT_OUTSIDE_SOURCE_DOMAIN')
    arrow_rows=pd_limit_arrow_inputs(plan,pieces)
    key=key+[(float(row['at']),float(row['toY'])) for row in arrow_rows]
    window=plan.get('xWindow')
    if window is not None:
        if not isinstance(window,list) or len(window)!=2 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or abs(v)>1e6 for v in window) or not window[0]<window[1]:raise ValueError('PIECEWISE_DISCONTINUOUS_X_WINDOW_INVALID')
        window=[float(window[0]),float(window[1])]
        if any(not window[0]<=px<=window[1] for px,_ in key):
            key_xs=[px for px,_ in key]
            raise HintedValueError('PIECEWISE_DISCONTINUOUS_X_WINDOW_TOO_SMALL',{'kind':'X_WINDOW_TOO_SMALL','window':window,'keyMin':min(key_xs),'keyMax':max(key_xs)})
    xs=[p[0] for p in key];span=max(xs)-min(xs);extend=max(1.0,.2*span)
    ys=[p[1] for p in key];ylo,yhi=min(ys),max(ys);band=max(1.0,.25*(yhi-ylo))
    def arm(anchor,direction):
        far=anchor+direction*extend
        if ylo-band<=coverage(far)<=yhi+band:return far
        near=anchor
        for _ in range(60):
            mid=(near+far)/2
            if ylo-band<=coverage(mid)<=yhi+band:near=mid
            else:far=mid
        return near
    left_x=float(pieces[0]['a']) if pieces[0]['a'] is not None else arm(min(xs),-1)
    right_x=float(pieces[-1]['b']) if pieces[-1]['b'] is not None else arm(max(xs),1)
    ends=[(left_x,coverage(left_x)),(right_x,coverage(right_x))]
    limit=plot_height_limit(plan)
    points=[(0.0,0.0)]+key+ends+([(window[0],0.0),(window[1],0.0)] if window else [])
    if probe:return {'points':points,'ends':ends,'hasArc':has_arc}
    if frame is not None:viewport,height,scale,ratio=frame
    else:
        for ratio in axis_ratios(plan,points,limit):
            if has_arc and ratio!=1.0:raise ValueError('PIECEWISE_ARC_REQUIRES_EQUAL_UNITS')   # a circle squeezed on one axis would be drawn as an ellipse
            viewport,height,scale=equal_unit_frame(points,limit,ratio)
            if (ends[1][0]-ends[0][0])*scale>=EQUAL_UNIT_MIN_CURVE_PX:break
        else:raise ValueError('PIECEWISE_DISCONTINUOUS_CURVE_TOO_NARROW')
    # An unbounded end is drawn out to the edge of the panel (never stopped short of it) while its own height still lies inside
    # the framed viewport, so a graph on |x|>1 does not look as if it ended at the last marked point.
    def reach_edge(anchor,direction):
        edge=viewport[0] if direction<0 else viewport[1]
        if not viewport[2]<=coverage(edge)<=viewport[3]:
            near,far=anchor,edge
            for _ in range(60):
                mid=(near+far)/2
                if viewport[2]<=coverage(mid)<=viewport[3]:near=mid
                else:far=mid
            edge=near
        return edge
    if pieces[0]['a'] is None:left_x=reach_edge(left_x,-1)
    if pieces[-1]['b'] is None:right_x=reach_edge(right_x,1)
    ends=[(left_x,coverage(left_x)),(right_x,coverage(right_x))]
    # Distinct marked features closer than 4 px could not be told apart.
    marks=[]
    for mark in sorted(set(key)):
        if not any(abs(mark[0]-m[0])<=1e-9*max(1,abs(m[0])) and abs(mark[1]-m[1])<=1e-9*max(1,abs(m[1])) for m in marks):marks.append(mark)
    for index,(ax,ay) in enumerate(marks):
        for bx,by in marks[index+1:]:
            if math.hypot((ax-bx)*scale,(ay-by)*scale*ratio)<PIECEWISE_DISCONTINUOUS_MIN_FEATURE_GAP_PX:raise ValueError('PIECEWISE_DISCONTINUOUS_FEATURES_BELOW_RESOLUTION')
    draw=[ends[0][0],ends[1][0]]
    piece_rows=[]
    for piece in pieces:
        start=draw[0] if piece['a'] is None else max(draw[0],float(piece['a']))
        end=draw[1] if piece['b'] is None else min(draw[1],float(piece['b']))
        if piece.get('arc'):
            arc=piece['arc']
            piece_rows.append({'kind':'ARC','center':[_pp_text(arc['cx']),_pp_text(arc['cy'])],'radiusSquared':_pp_text(arc['r2']),'branch':'UPPER' if arc['sign']>0 else 'LOWER','interval':[_pp_text(piece['a']),_pp_text(piece['b'])],'drawInterval':[start,end],'start':piece['start'],'end':piece['end']})
            continue
        piece_rows.append({'coefficients':[_pp_text(c) for c in piece['coefficients']],'interval':[None if piece['a'] is None else _pp_text(piece['a']),None if piece['b'] is None else _pp_text(piece['b'])],'drawInterval':[start,end],'start':piece['start'],'end':piece['end']})
    features={'schemaVersion':'PIECEWISE_DISCONTINUOUS_FEATURES_v1','pieces':piece_rows,'markers':marker_rows,'extrema':[{'x':_pp_text(x_value),'y':_pp_text(y_value),'kind':kind} for x_value,y_value,kind in extrema],'intersections':crossings}
    if arrow_rows:features['limitArrows']=pd_limit_arrow_features(arrow_rows,pieces,draw,scale,ratio)
    fitted={key_name:value for key_name,value in plan.items() if key_name not in ('domain','viewport')}
    if exact_points:
        merged=dict(plan.get('exactCoordinates') or {})
        if any(point_id in merged and merged[point_id]!=pair for point_id,pair in exact_points.items()):raise ValueError('PIECEWISE_DISCONTINUOUS_EXACT_COORDINATES_CONFLICT')
        merged.update(exact_points);fitted['exactCoordinates']=merged
    fitted['requiredPoints']=required
    fitted.update({'domain':draw,'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':PIECEWISE_DISCONTINUOUS_OVERVIEW_POLICY,'piecewiseDiscontinuousFeatures':features,'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}})
    return {'graphPlan':fitted,'policy':PIECEWISE_DISCONTINUOUS_OVERVIEW_POLICY,'sourceDomainPreserved':False,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

# ---------------------------------------------------------------------------
# Graph overlays (G1): one general graphPlan.overlays object draws lines, vertical lines, segments between named points, dashed guide
# segments to the axes, simple polygons and extra named points on the curve. Every coordinate is recomputed here exactly; the plan names
# the points and the elements, never raw derived coordinates. The fitted plan carries overlaysFeatures (numeric, for the model/spec) and
# the independent graph observer recomputes the same values from the raw overlays field and reads the FINAL SVG back.
OVERLAY_LIMITS={'points':12,'lines':6,'segments':6,'guides':4,'polygons':2,'names':4,'quadrants':4,'circles':2,'circleRegions':2,'callouts':6,'rightAngles':3,'angles':4,'equalAngles':2}
# overlays.names: a plain Korean name (토끼, 거북이, 직선 l) written beside one overlay segment, overlay line or the drawn curve at curveX.
OVERLAY_NAME_PATTERN=r'[가-힣A-Za-z0-9 ()]{1,10}'
OVERLAY_CALLOUT_TEXT_PATTERN=r'[가-힣A-Za-z0-9 (),.+\-=αβγθ′√]{1,14}'   # (G18b) a plain-text callout may carry commas (a coordinate pair), Greek letters and a prime
OVERLAY_CALLOUT_PLAIN_MARKS=',αβγθ′√'
OVERLAY_CALLOUT_MATH_PATTERN=re.compile(r'[0-9A-Za-zαβγδθπ′√=+*/().^ ,_-]{1,20}')   # (EXT-20261109-b) a MATH callout may carry a comma (a coordinate pair), a subscript (A_1) and a bracketed fraction ((x+2)/(x-2)), up to 20 characters
OVERLAY_LATTICE_REGIONS=('BELOW_CURVE','ABOVE_CURVE')
OVERLAY_LATTICE_FIELDS={'region','xRange','yMin','yMax','strict','counts','curve','color'}
OVERLAY_POINT_MARKERS=('FILLED','OPEN')   # overlays.points[].marker: FILLED (the default dot) or OPEN (a hollow circle, stroked in the point's colour)
OVERLAY_LATTICE_MAX_POINTS=40
OVERLAY_LATTICE_MAX_COLUMNS=12
OVERLAY_POLYGON_LABEL_KINDS=('MATH','TEXT')
OVERLAY_POLYGON_MATH_LABEL_PATTERN=r'[0-9A-Za-z=+\-*/().\^ ]{1,40}'

# overlays.circles (G6): [{id,center:[x,y],radiusSquared}] draws a circle on a graph at the plot's single scale (a plan without equal units is refused). A point may lie on it
# (points[].onCircle, verified exactly) or be the intersection of an overlay line with it (points[].intersect:[lineId,circleId] with pick MIN_X|MAX_X, or MIN_Y|MAX_Y for a vertical line).
def _overlay_circle_rows(raw):
    rows=[];exact={}
    for entry in raw.get('circles',[]) or []:
        if not isinstance(entry,dict) or set(entry)-{'id','center','radiusSquared','fill'}:_overlay_fail('OVERLAY_CIRCLE_INVALID',entry.get('id') if isinstance(entry,dict) else 'circle')
        ident=_overlay_id(entry.get('id'),'circle')
        center=entry.get('center')
        if not isinstance(center,list) or len(center)!=2 or ident in exact:_overlay_fail('OVERLAY_CIRCLE_INVALID',ident)
        cx=_overlay_exact(center[0],ident);cy=_overlay_exact(center[1],ident);r2=_overlay_exact(entry.get('radiusSquared'),ident)
        if not r2>0:_overlay_fail('OVERLAY_CIRCLE_INVALID',ident)
        radius=S.radsimp(S.sqrt(r2))
        exact[ident]=(cx,cy,r2)
        row={'id':ident,'cx':_overlay_number(cx),'cy':_overlay_number(cy),'r':_overlay_number(radius),'center':[pp_surd_text(cx),pp_surd_text(cy)],'radiusSquared':pp_surd_text(r2)}
        # fill (G6b): the whole disk shaded LIGHT or MEDIUM under every stroke; absent or NONE leaves the circle unshaded.
        fill=entry.get('fill','NONE')
        if fill not in ('NONE','LIGHT','MEDIUM'):_overlay_fail('OVERLAY_CIRCLE_FILL_INVALID',ident)
        if fill!='NONE':row['fill']=fill
        rows.append(row)
    return rows,exact

def _overlay_on_circle(circle,x,y):
    cx,cy,r2=circle
    return S.simplify(S.expand((x-cx)**2+(y-cy)**2-r2))==0

def _overlay_line_circle_point(line,circle,pick,ident):
    """Exact intersection of an overlay line with an overlay circle: the root the author's pick names (MIN_X/MAX_X, MIN_Y/MAX_Y); a tangent line has one root."""
    cx,cy,r2=circle
    if line['kind']=='VERTICAL':
        x0=pp_exact_value(line['x']);disc=r2-(x0-cx)**2
    else:
        m=pp_exact_value(line['slope']);q=pp_exact_value(line['intercept'])
        a=1+m**2;b=2*(m*(q-cy)-cx);c=cx**2+(q-cy)**2-r2;disc=S.expand(b**2-4*a*c)
    if float(S.N(disc,30))<-1e-12:_overlay_fail('OVERLAY_CIRCLE_LINE_NO_INTERSECTION',ident)
    s=S.sqrt(disc)
    if line['kind']=='VERTICAL':pts=[(x0,cy+s),(x0,cy-s)]
    else:pts=[(xr,m*xr+q) for xr in ((-b+s)/(2*a),(-b-s)/(2*a))]
    pts=[(S.radsimp(S.simplify(px)),S.radsimp(S.simplify(py))) for px,py in pts]
    if abs(float(S.N(disc,30)))<1e-12:pts=pts[:1]
    if pick is None:
        if len(pts)!=1:_overlay_fail('OVERLAY_CIRCLE_PICK_REQUIRED',ident)
        return pts[0]
    if pick not in ('MIN_X','MAX_X','MIN_Y','MAX_Y') or (line['kind']=='VERTICAL')!=(pick in ('MIN_Y','MAX_Y')):_overlay_fail('OVERLAY_CIRCLE_PICK_INVALID',ident)
    index=0 if pick.endswith('X') else 1
    return (min if pick.startswith('MIN') else max)(pts,key=lambda point:float(S.N(point[index],30)))

def _overlay_curve_pieces(plan):
    """The plan's drawn curve as exact rational functions of x: [(numerator, denominator, lo, hi)] (lo/hi None = open), or None for a family
    that is not a polynomial / rational function (G6c: those have no exact tangent search)."""
    x=S.Symbol('x',real=True);family=plan.get('family')
    poly=lambda values:sum((_overlay_exact(c,'curve')*x**i for i,c in enumerate(values)),S.Integer(0))
    try:
        if family=='polynomial':return x,[(poly(plan['coefficients']),S.Integer(1),None,None)]
        if family=='rational':return x,[(poly(plan['numerator']),poly(plan['denominator']),None,None)]
        if family=='piecewise-polynomial':
            cut=[_overlay_exact(point['x'],'curve') for point in plan.get('breakpoints') or []];pieces=plan.get('pieces') or []
            return x,[(poly(piece.get('coefficients') or []),S.Integer(1),None if index==0 else cut[index-1],None if index==len(pieces)-1 else cut[index]) for index,piece in enumerate(pieces)]
    except (KeyError,IndexError,TypeError):return None
    return None

def _overlay_tangent_points(plan,circle):
    """Every exact point where the drawn curve touches the overlay circle with a repeated root (G6c): the residual (x-cx)^2+(y-cy)^2-r^2 of a
    polynomial / rational curve is a polynomial in x; its square-free factors of multiplicity >= 2 are the touching points. A touching root
    without an exact (radical) form is refused. Returns None for a family without this exact search."""
    model=_overlay_curve_pieces(plan)
    if model is None:return None
    x,pieces=model;cx,cy,r2=circle;lo,hi=plan['domain'];found=[]
    for numerator,denominator,left,right in pieces:
        residual=S.expand((x-cx)**2*denominator**2+(numerator-cy*denominator)**2-r2*denominator**2)
        if residual==0 or not residual.has(x):continue
        for factor,multiplicity in S.sqf_list(S.Poly(residual,x))[1]:
            if multiplicity<2:continue
            roots=S.roots(factor.as_expr(),x)
            if sum(roots.values())!=factor.degree():
                if any(float(S.N(root,30))>=lo-1e-9 and float(S.N(root,30))<=hi+1e-9 for root in S.Poly(factor,x).nroots(n=30) if abs(S.im(root))<1e-12):_overlay_fail('OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT')
                continue
            for root in roots:
                if not root.is_real:continue
                value=float(S.N(root,30))
                if not lo-1e-9<=value<=hi+1e-9 or left is not None and root<left or right is not None and root>right:continue
                if S.simplify(denominator.subs(x,root))==0:continue
                root=S.radsimp(S.simplify(root));y=S.radsimp(S.simplify((numerator/denominator).subs(x,root)))
                pp_surd_text(root);pp_surd_text(y)
                if not any(abs(float(S.N(root-other[0],30)))<1e-9 for other in found):found.append((root,y))
    return sorted(found,key=lambda point:float(S.N(point[0],30)))

OVERLAY_CURVE_CIRCLE_SAMPLES=400
def _overlay_curve_circle_point(plan,circle,curve_ref,pick,ident):
    """Exact intersection of the drawn curve with an overlay circle (G6b): the curve is scanned over its drawn interval for sign changes of
    (x-cx)^2+(y-cy)^2-r^2, every root is refined, and the root the author's pick names (MIN_X/MAX_X) must have an exact form (a rational, or a
    radical the exact curve check accepts); a root that cannot be written exactly is refused, never rounded."""
    cx,cy,r2=circle
    curve_id=curve_ref.split(':',1)[1] if ':' in curve_ref else None
    if plan.get('family')=='exp-log-pair' and curve_id is None:_overlay_fail('OVERLAY_CURVE_REQUIRED',ident)
    if plan.get('family')!='exp-log-pair' and curve_id is not None:_overlay_fail('OVERLAY_CURVE_UNKNOWN',ident)
    lo,hi=plan['domain'];cxf,cyf,r2f=(float(S.N(v,30)) for v in (cx,cy,r2))
    def residual(x):
        try:y=float(S.N(_overlay_curve_exact(plan,S.Float(x,30),curve_id),30))
        except (ValueError,TypeError,ZeroDivisionError):return None
        return (x-cxf)**2+(y-cyf)**2-r2f if math.isfinite(y) else None
    count=OVERLAY_CURVE_CIRCLE_SAMPLES;xs=[lo+(hi-lo)*i/count for i in range(count+1)];values=[residual(x) for x in xs];roots=[]
    for i in range(count):
        a,b,fa,fb=xs[i],xs[i+1],values[i],values[i+1]
        if fa is None or fb is None or fa*fb>0:continue
        if fa==0:roots.append(a);continue
        for _ in range(60):
            mid=(a+b)/2;fm=residual(mid)
            if fm is None:break
            if fa*fm<=0:b,fb=mid,fm
            else:a,fa=mid,fm
        roots.append((a+b)/2)
    if values and values[-1]==0:roots.append(xs[-1])
    roots=sorted(roots);roots=[root for index,root in enumerate(roots) if index==0 or root-roots[index-1]>1e-7]
    # G6c: roots of multiplicity >= 2 (the curve touches the circle) give no sign change; they are found exactly from the residual polynomial.
    tangents=_overlay_tangent_points(plan,circle) if curve_id is None else None
    if pick=='TANGENT':
        if tangents is None:_overlay_fail('OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT',ident)
        if not tangents:_overlay_fail('OVERLAY_CIRCLE_CURVE_TANGENT_NOT_FOUND',ident)
        if len(tangents)!=1:_overlay_fail('OVERLAY_CIRCLE_CURVE_TANGENT_AMBIGUOUS',ident)
        return tangents[0]
    for tangent in tangents or []:
        value=float(S.N(tangent[0],30))
        if not any(abs(value-root)<=1e-6 for root in roots):roots.append(value)
    roots=sorted(roots)
    if not roots:_overlay_fail('OVERLAY_CIRCLE_CURVE_NO_INTERSECTION',ident)
    if pick is None:
        if len(roots)!=1:_overlay_fail('OVERLAY_CIRCLE_PICK_REQUIRED',ident)
        chosen=roots[0]
    else:
        if pick not in ('MIN_X','MAX_X'):_overlay_fail('OVERLAY_CIRCLE_PICK_INVALID',ident)
        chosen=roots[0] if pick=='MIN_X' else roots[-1]
    for tangent in tangents or []:
        if abs(float(S.N(tangent[0],30))-chosen)<=1e-6:return tangent
    for candidate in (S.nsimplify(chosen,rational=True,tolerance=1e-9),S.nsimplify(chosen,tolerance=1e-9)):
        try:
            y=_overlay_curve_exact(plan,candidate,curve_id)
            if _overlay_on_circle(circle,candidate,y):
                exact=(S.radsimp(S.simplify(candidate)),S.radsimp(S.simplify(y)));pp_surd_text(exact[0]);pp_surd_text(exact[1])   # a rational or one radical: nested radicals are refused
                return exact
        except (ValueError,TypeError,ZeroDivisionError):continue
    _overlay_fail('OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT',ident)

# overlays.circleRegions (G6b): [{id,circle,from,to,side,fill?}] shades the circular segment of overlay circle `circle` cut off by the chord between the
# two named points (both exactly on the circle): the part on the `side` of the chord (ABOVE/BELOW for a chord that is not vertical, LEFT/RIGHT for one that
# is not horizontal). The arc is drawn as a true SVG arc; the observer recomputes the arc from the raw circle and points.
OVERLAY_CIRCLE_REGION_SIDES=('ABOVE','BELOW','LEFT','RIGHT')
# boundary form (G6c): {id,boundary:[piece,...],fill?,label?} fills the closed region bounded by drawn-curve pieces and circle arcs. A piece is
# {curve:'curve'|'curve:ID'|<functionName>,fromX,toX} (the drawn curve between two exact x) or {arc:circleId,from:P,to:Q,sweep:'MINOR'|'MAJOR'} (the shorter or
# longer arc of the circle from point P to point Q). Each piece must start where the one before it ended and the last must end where the first began.
OVERLAY_CIRCLE_REGION_CURVE_SAMPLES=96
OVERLAY_CIRCLE_REGION_LABEL_PATTERN=r'[0-9A-Za-z=+\-*/().\^_ ]{1,40}'   # a math label such as S_1 (the underscore writes a subscript)
def _overlay_region_curve_ref(plan,ref,ident):
    if not isinstance(ref,str):_overlay_fail('OVERLAY_CIRCLE_REGION_CURVE_UNKNOWN',ident)
    if ref=='curve' or ref.startswith('curve:'):return ref
    if plan.get('family')=='exp-log-pair':
        if any(isinstance(row,dict) and row.get('id')==ref for row in plan.get('curves') or []):return 'curve:'+ref
    elif ref==plan.get('functionName'):return 'curve'
    _overlay_fail('OVERLAY_CIRCLE_REGION_CURVE_UNKNOWN',ident)

def _overlay_same_point(first,second):
    return all(S.simplify(S.expand(a-b))==0 for a,b in zip(first,second))

def _overlay_circle_boundary_region(plan,entry,ident,circle_rows,circle_exact,by_point,exact_by_point):
    if set(entry)-{'id','boundary','fill','label'}:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
    fill=entry.get('fill','LIGHT')
    if fill not in ('LIGHT','MEDIUM'):_overlay_fail('OVERLAY_CIRCLE_REGION_FILL_INVALID',ident)
    pieces=entry['boundary']
    if not isinstance(pieces,list) or not 2<=len(pieces)<=4:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
    lo,hi=plan['domain'];rows=[]
    for piece in pieces:
        if not isinstance(piece,dict):_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
        if 'curve' in piece:
            if set(piece)!={'curve','fromX','toX'}:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
            ref=_overlay_region_curve_ref(plan,piece['curve'],ident);curve_id=ref.split(':',1)[1] if ':' in ref else None
            if (plan.get('family')=='exp-log-pair')!=(curve_id is not None):_overlay_fail('OVERLAY_CIRCLE_REGION_CURVE_UNKNOWN',ident)
            x0=_overlay_exact(piece['fromX'],ident);x1=_overlay_exact(piece['toX'],ident)
            if x0==x1 or not all(lo-1e-9<=float(S.N(value,30))<=hi+1e-9 for value in (x0,x1)):_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',ident)
            try:y0=_overlay_curve_exact(plan,x0,curve_id);y1=_overlay_curve_exact(plan,x1,curve_id)
            except ValueError as error:
                if str(error).startswith('OVERLAY_CURVE_UNKNOWN'):_overlay_fail('OVERLAY_CIRCLE_REGION_CURVE_UNKNOWN',ident)
                raise
            a,b=float(S.N(x0,30)),float(S.N(x1,30));count=OVERLAY_CIRCLE_REGION_CURVE_SAMPLES;samples=[]
            for k in range(count+1):
                xv=a+(b-a)*k/count
                yv=float(S.N(y0 if k==0 else y1 if k==count else _overlay_curve_exact(plan,S.Float(xv,30),curve_id),30))
                if not math.isfinite(yv):_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',ident)
                samples.append([xv,yv])
            rows.append({'kind':'CURVE','curve':ref,'fromX':pp_surd_text(x0),'toX':pp_surd_text(x1),'samples':samples,'_start':(x0,y0),'_end':(x1,y1)})
        elif 'arc' in piece:
            if set(piece)!={'arc','from','to','sweep'}:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
            circle=piece['arc'];first=piece['from'];second=piece['to']
            if circle not in circle_exact or first not in by_point or second not in by_point or first==second:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
            if piece['sweep'] not in ('MINOR','MAJOR'):_overlay_fail('OVERLAY_CIRCLE_REGION_SWEEP_INVALID',ident)
            for name in (first,second):
                if not _overlay_on_circle(circle_exact[circle],*exact_by_point[name]):_overlay_fail('OVERLAY_CIRCLE_REGION_ENDPOINT_NOT_ON_CIRCLE',ident+':'+name)
            ring=[row for row in circle_rows if row['id']==circle][0];cx,cy=ring['cx'],ring['cy']
            p0,p1=by_point[first],by_point[second]
            ccw=(math.atan2(p1['y']-cy,p1['x']-cx)-math.atan2(p0['y']-cy,p0['x']-cx))%(2*math.pi)
            if abs(ccw-math.pi)<1e-9:_overlay_fail('OVERLAY_CIRCLE_REGION_SWEEP_INVALID',ident)
            counter=(ccw<math.pi)==(piece['sweep']=='MINOR');angle=ccw if counter else 2*math.pi-ccw
            rows.append({'kind':'ARC','circle':circle,'from':first,'to':second,'sweep':'CCW' if counter else 'CW','large':angle>math.pi+1e-9,'_start':exact_by_point[first],'_end':exact_by_point[second]})
        else:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
    for k,row in enumerate(rows):
        following=rows[(k+1)%len(rows)]
        if not _overlay_same_point(row['_end'],following['_start']):_overlay_fail('OVERLAY_CIRCLE_REGION_BOUNDARY_NOT_CLOSED',ident)
    # a curve piece end that meets an arc must lie on that arc's circle (the exact check of the shared point)
    for k,row in enumerate(rows):
        following=rows[(k+1)%len(rows)]
        if row['kind']=='CURVE' and following['kind']=='ARC' and not _overlay_on_circle(circle_exact[following['circle']],*row['_end']):_overlay_fail('OVERLAY_CIRCLE_REGION_ENDPOINT_NOT_ON_CIRCLE',ident)
        if row['kind']=='ARC' and following['kind']=='CURVE' and not _overlay_on_circle(circle_exact[row['circle']],*following['_start']):_overlay_fail('OVERLAY_CIRCLE_REGION_ENDPOINT_NOT_ON_CIRCLE',ident)
    result={'id':ident,'fill':fill,'boundary':[{key:value for key,value in row.items() if not key.startswith('_')} for row in rows],
            'vertices':[[float(S.N(row['_start'][0],30)),float(S.N(row['_start'][1],30))] for row in rows]}
    label=entry.get('label')
    if label is not None:
        if not isinstance(label,str) or not label.strip() or len(label)>40 or any(ord(char)<32 for char in label) or not re.fullmatch(OVERLAY_CIRCLE_REGION_LABEL_PATTERN,label):_overlay_fail('OVERLAY_CIRCLE_REGION_LABEL_INVALID',ident)
        result['label']=label
    return result

def _overlay_circle_regions(plan,raw,circle_rows,circle_exact,by_point,exact_by_point,claim):
    rows=[]
    for entry in raw.get('circleRegions',[]) or []:
        if isinstance(entry,dict) and 'boundary' in entry:
            ident=_overlay_id(entry.get('id'),'circleRegion');claim('circleRegion:'+ident)
            rows.append(_overlay_circle_boundary_region(plan,entry,ident,circle_rows,circle_exact,by_point,exact_by_point));continue
        if not isinstance(entry,dict) or set(entry)-{'id','circle','from','to','side','fill'}:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',entry.get('id') if isinstance(entry,dict) else 'circleRegion')
        ident=_overlay_id(entry.get('id'),'circleRegion');claim('circleRegion:'+ident)
        circle=entry.get('circle');first=entry.get('from');second=entry.get('to')
        if circle not in circle_exact or first not in by_point or second not in by_point or first==second:_overlay_fail('OVERLAY_CIRCLE_REGION_INVALID',ident)
        for name in (first,second):
            if not _overlay_on_circle(circle_exact[circle],*exact_by_point[name]):_overlay_fail('OVERLAY_POINT_NOT_ON_CIRCLE',name)
        side=entry.get('side');fill=entry.get('fill','LIGHT')
        if side not in OVERLAY_CIRCLE_REGION_SIDES:_overlay_fail('OVERLAY_CIRCLE_REGION_SIDE_INVALID',ident)
        if fill not in ('LIGHT','MEDIUM'):_overlay_fail('OVERLAY_CIRCLE_REGION_FILL_INVALID',ident)
        ring=[row for row in circle_rows if row['id']==circle][0];cx,cy,radius=ring['cx'],ring['cy'],ring['r']
        px,py,qx,qy=by_point[first]['x'],by_point[first]['y'],by_point[second]['x'],by_point[second]['y']
        sweep,large=_circle_region_arc((cx,cy,radius),(px,py),(qx,qy),side,ident)
        rows.append({'id':ident,'circle':circle,'from':first,'to':second,'side':side,'fill':fill,'sweep':sweep,'large':large})
    return rows

def _circle_region_arc(ring,first,second,side,ident):
    """Which way round the circle the arc from `first` to `second` runs (CCW/CW) to lie on `side` of the chord, and whether it is longer than a half circle."""
    cx,cy,radius=ring;a0=math.atan2(first[1]-cy,first[0]-cx);ccw=(math.atan2(second[1]-cy,second[0]-cx)-a0)%(2*math.pi)
    mx,my=cx+radius*math.cos(a0+ccw/2),cy+radius*math.sin(a0+ccw/2)
    if side in ('ABOVE','BELOW'):
        if abs(second[0]-first[0])<1e-9:_overlay_fail('OVERLAY_CIRCLE_REGION_SIDE_INVALID',ident)
        offset=my-(first[1]+(second[1]-first[1])/(second[0]-first[0])*(mx-first[0]));wanted=offset>0 if side=='ABOVE' else offset<0
    else:
        if abs(second[1]-first[1])<1e-9:_overlay_fail('OVERLAY_CIRCLE_REGION_SIDE_INVALID',ident)
        offset=mx-(first[0]+(second[0]-first[0])/(second[1]-first[1])*(my-first[1]));wanted=offset>0 if side=='RIGHT' else offset<0
    angle=ccw if wanted else 2*math.pi-ccw
    return ('CCW' if wanted else 'CW'),angle>math.pi+1e-9

def _overlay_fail(code,ident=None):
    raise ValueError(code if ident is None else code+':'+str(ident))

def _overlay_coordinate_text(value,ident):
    """(G5b) The text a coordinate label writes for an exact coordinate: an integer or a fraction ('3/2'), or one p+q*sqrt(r) over a common denominator
    ('1+sqrt(2)', '2*sqrt(3)', '(1+sqrt(2))/2'; one radical, r squarefree). A nested radical or a second radical is COORDINATE_SURD_FORM_UNSUPPORTED."""
    if value.is_Rational:return str(int(value)) if value.is_Integer else str(int(value.p))+'/'+str(int(value.q))
    try:p,q,r=pp_surd_split(value,'x')
    except ValueError:_overlay_fail('COORDINATE_SURD_FORM_UNSUPPORTED',ident)
    d=S.ilcm(p.q,q.q);a,b=p*d,q*d
    magnitude=abs(b);body=('' if magnitude==1 else str(int(magnitude))+'*')+'sqrt('+str(r)+')'
    text=('' if a==0 else str(int(a)))+('-' if b<0 else '+' if a!=0 else '')+body
    return text if d==1 else '('+text+')/'+str(int(d))

def _overlay_exact(value,ident):
    try:
        number=pp_exact_value(value)
    except ValueError:
        _overlay_fail('OVERLAY_VALUE_INVALID',ident)
    if not number.is_real or not number.is_finite:
        _overlay_fail('OVERLAY_VALUE_INVALID',ident)
    return number

def _overlay_id(value,kind):
    if not isinstance(value,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_\']{0,11}',value):
        _overlay_fail('OVERLAY_ID_INVALID',kind)
    return value

def _overlay_base(value):
    if value in (None,'e'):return S.E
    try:
        return exp_log_base(value,'OVERLAY_BASE_INVALID')['exact']
    except (ValueError,KeyError,TypeError):
        _overlay_fail('OVERLAY_BASE_INVALID',str(value))

def _overlay_curve_exact(plan,x_value,curve_id=None):
    """The exact y of the plan's drawn function at x, from the same exact coefficients the family framer used. Raises
    OVERLAY_POINT_NOT_ON_CURVE when the curve is undefined there (outside a source domain, pole, negative radicand, ...)."""
    family=plan.get('family')
    try:
        if family=='polynomial':
            return sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['coefficients'])),S.Integer(0))
        if family=='rational':
            numerator=sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['numerator'])),S.Integer(0))
            denominator=sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['denominator'])),S.Integer(0))
            if denominator==0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
            return numerator/denominator
        if family=='sqrt-affine':
            radicand=sum((_overlay_exact(c,'curve')*x_value**i for i,c in enumerate(plan['radicand'])),S.Integer(0))
            if radicand<0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
            if any(plan.get(key) is not None for key in ('amplitude','sign','offset')):
                # (G18b) the general square root y = offset + sign*amplitude*sqrt(radicand): the point of curveX is on that curve, not on the bare root
                fields=_sqrt_affine_general_fields(plan);return fields[4]+fields[5]*S.sqrt(radicand)
            return S.sqrt(radicand)
        if family=='absolute-value':
            b,a,scale,offset=(_overlay_exact(value,'curve') for value in plan['coefficients'])
            return scale*S.Abs(a*x_value+b)+offset
        if family=='piecewise-affine':
            source=plan.get('sourceDomain') or {};interval=source.get('range')
            if interval:
                lo,hi=(_overlay_exact(value,'curve') for value in interval)
                if not lo<=x_value<=hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',str(x_value))
            break_x=_overlay_exact(plan['piecewise']['breakX'],'curve');owner=plan['piecewise'].get('owner','RIGHT')
            left=plan['piecewise']['left'];right=plan['piecewise']['right'];coefficients=left if x_value<break_x or (x_value==break_x and owner=='LEFT') else right
            return _overlay_exact(coefficients[0],'curve')*x_value+_overlay_exact(coefficients[1],'curve')
        if family=='exponential-affine':
            a,k,c=(_overlay_exact(value,'curve') for value in plan['coefficients']);base=_overlay_base(plan.get('base'));shift=_overlay_exact(plan.get('shiftX','0'),'curve')
            return a*base**(k*(x_value-shift))+c
        if family=='logarithmic-affine':
            a,k,b,c=(_overlay_exact(value,'curve') for value in plan['coefficients']);base=_overlay_base(plan.get('base'));argument=k*x_value+b
            if argument<=0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
            return a*S.log(argument)/S.log(base)+c
        if family=='trigonometric':
            function=plan.get('function','SIN');value={'SIN':S.sin,'COS':S.cos,'TAN':S.tan}.get(function)
            if value is None:_overlay_fail('OVERLAY_CURVE_UNSUPPORTED',function)
            if plan.get('ratePi') is not None or plan.get('phase') is not None:
                # The general grammar (trig_spec): ratePi writes the rate m*pi and the coefficients as [A,C]; without it they stay [A,k,C]; the
                # phase is `phase` (radians) or `phasePi` (a multiple of pi).
                coefficients=plan['coefficients']
                if plan.get('ratePi') is not None:
                    if not isinstance(coefficients,list) or len(coefficients)!=2:_overlay_fail('OVERLAY_CURVE_UNSUPPORTED','trigonometric')
                    a,c=(_overlay_exact(item,'curve') for item in coefficients);rate=_overlay_exact(plan['ratePi'],'curve')*S.pi
                else:
                    if not isinstance(coefficients,list) or len(coefficients)!=3:_overlay_fail('OVERLAY_CURVE_UNSUPPORTED','trigonometric')
                    a,rate,c=(_overlay_exact(item,'curve') for item in coefficients)
                phase=_overlay_exact(plan['phase'],'curve') if plan.get('phase') is not None else _overlay_exact(plan.get('phasePi','0'),'curve')*S.pi
                return a*value(rate*x_value+phase)+c
            a,k,c=(_overlay_exact(item,'curve') for item in plan['coefficients']);phase=_overlay_exact(plan.get('phasePi','0'),'curve')
            argument=k*x_value+phase*S.pi
            return a*value(argument)+c
        if family=='piecewise-polynomial':
            pieces=plan.get('pieces') or [];breaks=plan.get('breakpoints') or [];source=plan.get('sourceDomain') or {}
            lo=hi=None
            if source.get('kind')=='INTERVAL':
                range_=source.get('range') or [None,None];lo,hi=(None if value is None else _overlay_exact(value,'curve') for value in range_)
            if lo is not None and x_value<lo or hi is not None and x_value>hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',str(x_value))
            cut=[_overlay_exact(breakpoint['x'],'curve') for breakpoint in breaks]
            for index,piece in enumerate(pieces):
                left=None if index==0 else cut[index-1];right=None if index==len(pieces)-1 else cut[index]
                if (left is None or left<=x_value) and (right is None or x_value<=right):
                    return sum((_overlay_exact(coefficient,'curve')*x_value**power for power,coefficient in enumerate(piece.get('coefficients') or [])),S.Integer(0))
            _overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
        if family=='piecewise-discontinuous':return _overlay_pd_value(plan,x_value,curve_id)
        if family=='exp-log-pair':
            rows=plan.get('curves') or []
            row=next((item for item in rows if item.get('id')==curve_id),None)
            if row is None:_overlay_fail('OVERLAY_CURVE_UNKNOWN',str(curve_id))
            if row.get('family')=='exponential-affine':
                a,k,c=(_overlay_exact(value,'curve') for value in row['coefficients']);base=_overlay_base(row.get('base'));shift=_overlay_exact(row.get('shiftX','0'),'curve')
                return a*base**(k*(x_value-shift))+c
            if row.get('family')=='logarithmic-affine':
                a,k,b,c=(_overlay_exact(value,'curve') for value in row['coefficients']);base=_overlay_base(row.get('base'));argument=k*x_value+b
                if argument<=0:_overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))
                return a*S.log(argument)/S.log(base)+c
            _overlay_fail('OVERLAY_CURVE_UNSUPPORTED',str(curve_id))
    except (KeyError,IndexError,TypeError):
        _overlay_fail('OVERLAY_CURVE_UNSUPPORTED',family)
    _overlay_fail('OVERLAY_CURVE_UNSUPPORTED',family)

def _overlay_pd_value(plan,x_value,curve_id):
    """piecewise-discontinuous (SHARED, G7c): the exact y of f (curve_id None or f's name) or of the shared curve g, from the exact pieces; a declared
    isolated value (jumpValues) counts where no piece is defined."""
    body=plan
    if curve_id is not None and curve_id!=plan.get('functionName','f'):
        shared=plan.get('sharedCurve')
        if not isinstance(shared,dict) or shared.get('id')!=curve_id:_overlay_fail('OVERLAY_POINT_CURVE_UNKNOWN',str(curve_id))
        body=shared
    try:
        pieces=piecewise_discontinuous_pieces(body)
        for piece in pieces:
            if pd_defines_at(piece,x_value):return pd_piece_value(piece,x_value)
        for at_value,value in piecewise_discontinuous_values(body,pieces):
            if pp_same(at_value,x_value):return value
    except ValueError as error:
        if str(error).startswith('OVERLAY_'):raise
    _overlay_fail('OVERLAY_POINT_NOT_ON_CURVE',str(x_value))

def _overlay_number(value):
    return float(S.N(value,30))

def _overlay_label_is_the_line(line):
    """A free equation text on an overlay line (E31): when it is an equation of one '=' it is read exactly (labelValues gives the number a letter stands for in the
    drawing) and must be the drawn line. A text with a letter that has no value is symbolic and is shown as written; a text without '=' is a name, not an equation."""
    from linear_text import read_equation,read_values,same_line
    text=line['label'];ident=line.get('id')
    try:values=read_values(line.get('labelValues'))
    except ValueError:_overlay_fail('OVERLAY_LABEL_VALUES_INVALID',ident)
    if text.count('=')!=1:
        if values:_overlay_fail('OVERLAY_LABEL_VALUES_WITHOUT_EQUATION',ident)
        return
    try:equation=read_equation(text,line.get('labelValues'))
    except ValueError as error:
        if str(error)=='LINE_TEXT_NOT_LINEAR':_overlay_fail('OVERLAY_LABEL_NOT_LINEAR',ident)
        return
    if equation is None:
        if values and all(letter not in text for letter in values):_overlay_fail('OVERLAY_LABEL_VALUES_UNUSED',ident)
        return
    if line['kind']=='VERTICAL':
        x=pp_exact_value(line['x']);coefficients=(Fraction(1),Fraction(0),-Fraction(int(x.p),int(x.q))) if x.is_Rational else None
    else:
        slope,intercept=pp_exact_value(line['slope']),pp_exact_value(line['intercept'])
        coefficients=(Fraction(int(slope.p),int(slope.q)),Fraction(-1),Fraction(int(intercept.p),int(intercept.q))) if slope.is_Rational and intercept.is_Rational else None
    if coefficients is not None and not same_line(equation,coefficients):_overlay_fail('OVERLAY_LABEL_NOT_THE_LINE',ident)

def _overlay_line_text(line):
    if line.get('label') is not None:
        if not isinstance(line['label'],str) or not re.fullmatch(r'[0-9A-Za-z=+\-*/().\^ ]{1,40}',line['label']):
            _overlay_fail('OVERLAY_LABEL_INVALID',line.get('id'))
        _overlay_label_is_the_line(line)
        return line['label']
    if line.get('labelValues') is not None:_overlay_fail('OVERLAY_LABEL_VALUES_WITHOUT_LABEL',line.get('id'))
    if line['kind']=='VERTICAL':return 'x='+pp_surd_text(line['x'])
    slope,intercept=line['slope'],line['intercept']
    if slope=='0':return 'y='+pp_surd_text(intercept)
    slope_text='x' if slope=='1' else '-x' if slope=='-1' else (slope if re.fullmatch(r'-?\d+(?:/\d+)?',slope) else '('+slope+')')+'*x'
    if intercept=='0':return 'y='+slope_text
    sign='-' if intercept.startswith('-') else '+'
    return 'y='+slope_text+sign+pp_surd_text(intercept).lstrip('-')

def _overlay_line_at_valid(value):
    return value in ('START','END') or (isinstance(value,(int,float)) and not isinstance(value,bool) and math.isfinite(value) and 0<=value<=1)

def _overlay_label_anchor(viewport,line):
    xmin,xmax,ymin,ymax=viewport;spanx=xmax-xmin;spany=ymax-ymin
    if line['kind']=='VERTICAL':return [_overlay_number(line['x']),ymax-spany*.08]
    m=_overlay_number(line['slope']);q=_overlay_number(line['intercept'])
    for fraction in (.85,.15,.5):
        x=xmin+spanx*fraction;y=m*x+q
        if ymin+spany*.05<=y<=ymax-spany*.05:return [x,y]
    if m!=0:
        y=ymax-spany*.05;x=(y-q)/m
        if xmin+spanx*.05<=x<=xmax-spanx*.05:return [x,y]
    return [xmin+spanx*.85,ymax-spany*.08]

def _overlay_line_crosses_view(viewport,line):
    xmin,xmax,ymin,ymax=viewport
    if line['kind']=='VERTICAL':return xmin<_overlay_number(pp_exact_value(line['x']))<xmax
    m=_overlay_number(pp_exact_value(line['slope']));q=_overlay_number(pp_exact_value(line['intercept']))
    y_left=m*xmin+q;y_right=m*xmax+q
    if ymin<=y_left<=ymax or ymin<=y_right<=ymax:return True
    if m==0:return ymin<q<ymax
    x_bottom=(ymin-q)/m;x_top=(ymax-q)/m
    return max(xmin,min(x_bottom,x_top))<min(xmax,max(x_bottom,x_top))

def _overlay_clip_chord(viewport,line):
    """The two ends of an overlay line inside the viewport rectangle (data coordinates), or None."""
    xmin,xmax,ymin,ymax=viewport
    if line['kind']=='VERTICAL':return ((line['xValue'],ymin),(line['xValue'],ymax))
    m=line['slopeValue'];q=line['interceptValue'];ends=[]
    for x in (xmin,xmax):
        y=m*x+q
        if ymin-1e-9<=y<=ymax+1e-9:ends.append((x,max(ymin,min(ymax,y))))
    if m!=0:
        for y in (ymin,ymax):
            x=(y-q)/m
            if xmin-1e-9<=x<=xmax+1e-9 and not any(abs(x-a)<1e-9 and abs(y-b)<1e-9 for a,b in ends):ends.append((max(xmin,min(xmax,x)),y))
    return (ends[0],ends[1]) if len(ends)>=2 else None

def _overlay_label_alternates(plan,line,lines,points):
    """Anchors on the visible part of an overlay line where its equation could stand when the first anchor found no room: the chord is sampled and
    the places farthest (in px) from the frame edge, the axes, the other overlay lines and the overlay points come first. Used only after the
    first anchor failed (the layout asks for them then), so a figure that already fits keeps its label where it was."""
    viewport=plan['viewport'];chord=_overlay_clip_chord(viewport,line)
    if chord is None:return []
    xmin,xmax,ymin,ymax=viewport;canvas=plan.get('plotCanvas') if isinstance(plan.get('plotCanvas'),dict) else {}
    px=float(canvas.get('width',448))/(xmax-xmin);py=float(canvas.get('height',448))/(ymax-ymin)
    others=[other for other in lines if other['id']!=line['id']]
    def line_distance(point,other):
        if other['kind']=='VERTICAL':return abs(point[0]-other['xValue'])*px
        m=other['slopeValue'];q=other['interceptValue']
        return py*abs(m*point[0]-point[1]+q)/math.sqrt(1+(m*py/px)**2)
    rows=[]
    for step in range(1,40):
        t=step/40;point=(chord[0][0]+(chord[1][0]-chord[0][0])*t,chord[0][1]+(chord[1][1]-chord[0][1])*t)
        edge=min((point[0]-xmin)*px,(xmax-point[0])*px,(point[1]-ymin)*py,(ymax-point[1])*py)
        score=min([edge,abs(point[0])*px,abs(point[1])*py,*[line_distance(point,other) for other in others],*[math.hypot((point[0]-p['x'])*px,(point[1]-p['y'])*py) for p in points]])
        if edge<12:continue
        rows.append((-score,t,point))
    rows.sort()
    chosen=[]
    for _score,_t,point in rows:
        if all(math.hypot((point[0]-other[0])*px,(point[1]-other[1])*py)>=30 for other in chosen):chosen.append(point)
        if len(chosen)==10:break
    return [[round(point[0],9),round(point[1],9)] for point in chosen]

def _overlay_length_row(value,ident):
    """A segment length as the label text the figure shows: an integer (4), a fraction (3/2) or a square-root surd (2*sqrt(5)); nothing else is read back reliably."""
    value=value if value.is_Integer else S.simplify(value)
    if value.is_Integer:return {'text':str(int(value)),'value':float(value)}
    # a fraction (G12-3): 3/2, 9/8 (stacked in the figure; the observer reads numerator then denominator digits)
    if value.is_Rational and value>0:return {'text':str(int(value.p))+'/'+str(int(value.q)),'value':float(value)}
    coefficient,radical=value.as_coeff_Mul()
    if coefficient.is_Integer and coefficient>0 and radical.is_Pow and radical.exp==S.Rational(1,2) and radical.base.is_Integer and radical.base>1:
        base=int(radical.base);return {'text':(str(int(coefficient))+'*' if coefficient!=1 else '')+'sqrt('+str(base)+')','value':float(S.N(value,30))}
    _overlay_fail('OVERLAY_SEGMENT_LENGTH_UNSUPPORTED',ident)

def _overlay_lattice(plan,entry,exact_points):
    """graphPlan.overlays.latticePoints: every integer point strictly (or not) below / above the drawn curve in a column range, enumerated exactly.
    Returns the frozen feature row; every failure is an explicit OVERLAY_LATTICE_* code."""
    if not isinstance(entry,dict) or set(entry)-OVERLAY_LATTICE_FIELDS:_overlay_fail('OVERLAY_LATTICE_INVALID')
    region=entry.get('region')
    if region not in OVERLAY_LATTICE_REGIONS:_overlay_fail('OVERLAY_LATTICE_REGION_INVALID')
    span=entry.get('xRange')
    if not isinstance(span,list) or len(span)!=2 or any(isinstance(v,bool) or not isinstance(v,int) for v in span) or span[0]>span[1]:_overlay_fail('OVERLAY_LATTICE_RANGE_INVALID')
    if span[1]-span[0]+1>OVERLAY_LATTICE_MAX_COLUMNS:_overlay_fail('OVERLAY_LATTICE_TOO_MANY')
    strict=entry.get('strict',True);counts=entry.get('counts',False)
    if not isinstance(strict,bool) or not isinstance(counts,bool):_overlay_fail('OVERLAY_LATTICE_INVALID')
    if 'color' in entry and entry['color'] not in OVERLAY_COLOR_NAMES:_overlay_fail('OVERLAY_COLOR_INVALID','lattice.color')
    bound_key='yMin' if region=='BELOW_CURVE' else 'yMax';other_key='yMax' if region=='BELOW_CURVE' else 'yMin'
    bound=entry.get(bound_key)
    if other_key in entry or isinstance(bound,bool) or not isinstance(bound,int):_overlay_fail('OVERLAY_LATTICE_BOUND_INVALID')
    curve_id=entry.get('curve')
    if plan.get('family')=='exp-log-pair' and curve_id is None:_overlay_fail('OVERLAY_CURVE_REQUIRED','lattice')
    if plan.get('family')!='exp-log-pair' and curve_id is not None:_overlay_fail('OVERLAY_CURVE_UNKNOWN','lattice')
    domain_lo,domain_hi=plan['domain'];xmin,xmax,ymin,ymax=plan['viewport'];points=[];columns=[]
    for x in range(span[0],span[1]+1):
        if not domain_lo<=x<=domain_hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN','lattice')
        try:y_curve=_overlay_curve_exact(plan,S.Integer(x),curve_id)
        except ValueError:_overlay_fail('OVERLAY_LATTICE_COLUMN_UNDEFINED',str(x))
        if not y_curve.is_real or not y_curve.is_finite:_overlay_fail('OVERLAY_LATTICE_COLUMN_UNDEFINED',str(x))
        if region=='BELOW_CURVE':
            top=int(S.ceiling(y_curve))-1 if strict else int(S.floor(y_curve))
            ys=list(range(bound,top+1)) if top-bound+1<=OVERLAY_LATTICE_MAX_POINTS else None
        else:
            low=int(S.floor(y_curve))+1 if strict else int(S.ceiling(y_curve))
            ys=list(range(low,bound+1)) if bound-low+1<=OVERLAY_LATTICE_MAX_POINTS else None
        if ys is None:_overlay_fail('OVERLAY_LATTICE_TOO_MANY')
        if not ys:continue
        columns.append({'x':x,'count':len(ys),'topY':max(ys)})
        points.extend({'x':x,'y':y} for y in ys)
        if len(points)>OVERLAY_LATTICE_MAX_POINTS:_overlay_fail('OVERLAY_LATTICE_TOO_MANY')
    if not points:_overlay_fail('OVERLAY_LATTICE_EMPTY')
    for point in points:
        if not (xmin<point['x']<xmax and ymin<point['y']<ymax):_overlay_fail('OVERLAY_POINT_OUTSIDE_VIEWPORT','lattice')
        if any(abs(point['x']-ex)<1e-9 and abs(point['y']-ey)<1e-9 for ex,ey in exact_points):_overlay_fail('OVERLAY_LATTICE_POINT_COINCIDES',str(point['x'])+','+str(point['y']))
    return {'region':region,'strict':strict,'counts':counts,'xRange':list(span),bound_key:bound,'points':points,'columns':columns,**({'color':entry['color']} if 'color' in entry else {})}

def _overlay_math_name_is_the_curve(plan,entry,ident):
    """A MATH name beside the drawn curve (E31): when the curve is one straight piece with rational coefficients (y=c0+c1*x) and the text is an equation that can be read exactly
    (labelValues gives the number a letter stands for), it must be that line. Other curves, symbolic texts and names without '=' are shown as written."""
    from linear_text import read_equation,read_values,same_line
    text=entry['text']
    try:read_values(entry.get('labelValues'))
    except ValueError:_overlay_fail('OVERLAY_NAME_VALUES_INVALID',ident)
    if text.count('=')!=1:return
    try:equation=read_equation(text,entry.get('labelValues'))
    except ValueError as error:
        if str(error)=='LINE_TEXT_NOT_LINEAR':_overlay_fail('OVERLAY_NAME_NOT_LINEAR',ident)
        return
    pieces=plan.get('pieces')
    if equation is None or plan.get('family')!='piecewise-polynomial' or not isinstance(pieces,list) or len(pieces)!=1:return
    try:values=[pp_exact_value(c) for c in pieces[0].get('coefficients',[])]
    except (ValueError,TypeError,AttributeError):return
    if len(values)>2 and any(v!=0 for v in values[2:]):return
    if not all(v.is_Rational for v in values):return
    c0=values[0] if values else S.Integer(0);c1=values[1] if len(values)>1 else S.Integer(0)
    if not same_line(equation,(Fraction(int(c1.p),int(c1.q)),Fraction(-1),Fraction(int(c0.p),int(c0.q)))):_overlay_fail('OVERLAY_NAME_NOT_THE_CURVE',ident)

def _overlay_names(plan,rows,claim,lines,segments,by_point):
    """overlays.names: {id,text,segment|line|curveX[,curve][,labelDirection]}. The text is a plain name (Korean, letters, digits, spaces, brackets) that
    stands beside the segment or line it names, or beside the drawn curve at curveX. Each anchor is computed here exactly; nothing is dropped."""
    names=[];by_segment={row['id']:row for row in segments};by_line={row['id']:row for row in lines}
    for entry in rows:
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_NAME_INVALID','name')
        if set(entry)-{'id','text','segment','line','curveX','curve','labelDirection','labelKind','labelValues'}:_overlay_fail('OVERLAY_NAME_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'name');claim('name:'+ident)
        text=entry.get('text')
        # labelKind MATH (E31): the equation of the drawn curve written beside it at curveX (y=2x-3/2), typeset as math; the default TEXT is a plain name.
        # EXT-20261109-b: a name without Korean letters beside the drawn curve (f(x), v(t), g) is math like every other letter of the figure; Korean names stay plain text.
        kind=entry.get('labelKind') or ('MATH' if 'curveX' in entry and isinstance(entry.get('text'),str) and re.fullmatch(r'[A-Za-z0-9 ()]{1,10}',entry['text']) else 'TEXT')
        if kind not in ('TEXT','MATH') or ('labelValues' in entry and kind!='MATH'):_overlay_fail('OVERLAY_NAME_INVALID',ident)
        from linear_text import TEXT_PATTERN
        if kind=='MATH':
            if not isinstance(text,str) or text!=text.strip() or TEXT_PATTERN.fullmatch(text) is None:_overlay_fail('OVERLAY_NAME_TEXT_INVALID',ident)
        elif not isinstance(text,str) or text!=text.strip() or not re.fullmatch(OVERLAY_NAME_PATTERN,text):_overlay_fail('OVERLAY_NAME_TEXT_INVALID',ident)
        forms=[key for key in ('segment','line','curveX') if key in entry]
        if len(forms)!=1 or ('curve' in entry and 'curveX' not in entry) or (kind=='MATH' and forms[0]!='curveX'):_overlay_fail('OVERLAY_NAME_INVALID',ident)
        row={'id':ident,'text':text}
        if kind=='MATH':
            row['labelKind']='MATH'
            if 'labelValues' in entry:row['labelValues']=entry['labelValues']
            _overlay_math_name_is_the_curve(plan,entry,ident)
        if forms[0]=='segment':
            target=by_segment.get(entry['segment'])
            if target is None:_overlay_fail('OVERLAY_NAME_TARGET_UNKNOWN',ident)
            (ax,ay),(bx,by)=[(by_point[target[end]]['x'],by_point[target[end]]['y']) for end in ('from','to')]
            row.update({'kind':'SEGMENT','ref':target['id'],'at':[(ax+bx)/2,(ay+by)/2],'alternateAt':[[ax+(bx-ax)*s,ay+(by-ay)*s] for s in (.3,.7)]})
        elif forms[0]=='line':
            target=by_line.get(entry['line'])
            if target is None:_overlay_fail('OVERLAY_NAME_TARGET_UNKNOWN',ident)
            row.update({'kind':'LINE','ref':target['id'],'at':target['labelAt'],'alternateAt':target['labelAlternates']})
        else:
            x=_overlay_exact(entry['curveX'],ident);curve_id=entry.get('curve')
            if plan.get('family')=='exp-log-pair' and curve_id is None:_overlay_fail('OVERLAY_CURVE_REQUIRED',ident)
            if plan.get('family')!='exp-log-pair' and curve_id is not None:_overlay_fail('OVERLAY_CURVE_UNKNOWN',ident)
            lo,hi=plan['domain']
            if not lo<=float(S.N(x,30))<=hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',ident)
            y=_overlay_curve_exact(plan,x,curve_id)
            xmin,xmax,ymin,ymax=plan['viewport'];xf,yf=_overlay_number(x),_overlay_number(y)
            if not (xmin<xf<xmax and ymin<yf<ymax):_overlay_fail('OVERLAY_NAME_OUTSIDE_VIEWPORT',ident)
            row.update({'kind':'CURVE','at':[xf,yf]})
        if 'labelDirection' in entry:
            if entry['labelDirection'] not in ('N','NE','E','SE','S','SW','W','NW'):_overlay_fail('OVERLAY_LABEL_DIRECTION_INVALID',ident)
            row['labelDirection']=entry['labelDirection']
        names.append(row)
    return names

OVERLAY_QUADRANT_LABEL_PATTERN=r'[가-힣A-Za-z0-9 ()]{1,12}'

OVERLAY_CALLOUT_DIRECTIONS=('N','NE','E','SE','S','SW','W','NW')
def _overlay_callouts(plan,rows,claim,by_point):
    """overlays.callouts (G12-1): [{id,point,text,direction?,labelKind?}], a short label pulled out to a free place on a visible leader line that starts ON its point (an overlay
    point, or a requiredPoints id whose dot is drawn). The leader names the owner, so a label that would sit among other strokes is never mistaken for theirs. text is a short
    formula (f(a), a, 2k) written as math, or plain Korean (극대, 접점) written as text; direction is the side to try first. Nothing is dropped: no room is a layout error."""
    from linear_text import TEXT_PATTERN
    if not isinstance(rows,list):_overlay_fail('OVERLAY_CALLOUT_INVALID','callouts')
    required=plan.get('requiredPoints',[]) if isinstance(plan.get('requiredPoints'),list) else []
    out=[]
    for entry in rows:
        if not isinstance(entry,dict) or set(entry)-{'id','point','text','direction','labelKind'}:_overlay_fail('OVERLAY_CALLOUT_INVALID',entry.get('id') if isinstance(entry,dict) else 'callout')
        ident=_overlay_id(entry.get('id'),'callout');claim('callout:'+ident)
        ref=entry.get('point')
        if not isinstance(ref,str):_overlay_fail('OVERLAY_CALLOUT_POINT_UNKNOWN',ident)
        if ref in by_point:dot=ref;at=[by_point[ref]['x'],by_point[ref]['y']]
        else:
            index=next((i for i,point in enumerate(required) if isinstance(point,dict) and point.get('id')==ref),None)
            if index is None:_overlay_fail('OVERLAY_CALLOUT_POINT_UNKNOWN',ident)
            if required[index].get('marker')=='NONE':_overlay_fail('OVERLAY_CALLOUT_POINT_HIDDEN',ident)
            at=[_overlay_number(_overlay_exact(required[index][k],ident)) if isinstance(required[index][k],str) else float(required[index][k]) for k in ('x','y')]
            dot='required-point-'+str(index+1)
        text=entry.get('text')
        kind=entry.get('labelKind')
        if kind is not None and kind not in ('TEXT','MATH'):_overlay_fail('OVERLAY_CALLOUT_TEXT_INVALID',ident)
        if not isinstance(text,str) or text!=text.strip() or not text:_overlay_fail('OVERLAY_CALLOUT_TEXT_INVALID',ident)
        if kind is None:kind='TEXT' if re.search('[가-힣]',text) else 'MATH'
        if kind=='TEXT' and re.fullmatch(OVERLAY_CALLOUT_TEXT_PATTERN if any(mark in text for mark in OVERLAY_CALLOUT_PLAIN_MARKS) else OVERLAY_NAME_PATTERN,text) is None:_overlay_fail('OVERLAY_CALLOUT_TEXT_INVALID',ident)
        if kind=='MATH' and OVERLAY_CALLOUT_MATH_PATTERN.fullmatch(text) is None:_overlay_fail('OVERLAY_CALLOUT_TEXT_INVALID',ident)
        row={'id':ident,'point':ref,'dot':dot,'at':at,'text':text,'labelKind':kind}
        if 'direction' in entry:
            if entry['direction'] not in OVERLAY_CALLOUT_DIRECTIONS:_overlay_fail('OVERLAY_CALLOUT_DIRECTION_INVALID',ident)
            row['direction']=entry['direction']
        out.append(row)
    return out

def _overlay_quadrants(plan,rows,claim):
    """overlays.quadrants:[{id,quadrant,label?,fill?}] (E31): the coordinate quadrant 1..4 tinted (LIGHT | MEDIUM, under every stroke, out to the edge of the drawn window) and/or named
    in plain Korean text inside it. The origin must lie strictly inside the framed window, and a quadrant is named at most once."""
    out=[];seen=set()
    xmin,xmax,ymin,ymax=plan['viewport']
    for entry in rows:
        if not isinstance(entry,dict) or set(entry)-{'id','quadrant','label','fill'}:_overlay_fail('OVERLAY_QUADRANT_INVALID',entry.get('id') if isinstance(entry,dict) else 'quadrant')
        ident=_overlay_id(entry.get('id'),'quadrant');claim('quadrant:'+ident)
        number=entry.get('quadrant')
        if isinstance(number,bool) or number not in (1,2,3,4):_overlay_fail('OVERLAY_QUADRANT_INVALID',ident)
        if number in seen:_overlay_fail('OVERLAY_QUADRANT_DUPLICATE',ident)
        seen.add(number)
        label,fill=entry.get('label'),entry.get('fill')
        if label is None and fill is None:_overlay_fail('OVERLAY_QUADRANT_EMPTY',ident)
        if label is not None and (not isinstance(label,str) or label!=label.strip() or not re.fullmatch(OVERLAY_QUADRANT_LABEL_PATTERN,label)):_overlay_fail('OVERLAY_QUADRANT_LABEL_INVALID',ident)
        if fill is not None and fill not in ('LIGHT','MEDIUM'):_overlay_fail('OVERLAY_QUADRANT_FILL_INVALID',ident)
        if not (xmin<0<xmax and ymin<0<ymax):_overlay_fail('OVERLAY_QUADRANT_ORIGIN_OUTSIDE_VIEW',ident)
        row={'id':ident,'quadrant':number}
        if label is not None:row['label']=label
        if fill is not None:row['fill']=fill
        out.append(row)
    return out

# ---- (G13a) right-angle squares and equal-angle arcs ON a graph -------------------------------------------------------------------------------
# overlays.rightAngles:[{id?,at,from:[P,Q]}] or [{id?,lines:[l1,l2],side?}]: a square at a vertex where two PERPENDICULAR directions meet (checked exactly: dot product 0).
# overlays.angles:[{id?,at,from,to,color?,arcs?}] and overlays.equalAngles:[{angles:[index,...],color,arcs?}]: arcs (and a sector) for angles that are EQUAL (exact check).
# The screen must show what the maths says, so both need one scale on both axes (equalUnits, axisRatio 1).
OVERLAY_ANGLE_SIDES={'N':(0,1),'NE':(1,1),'E':(1,0),'SE':(1,-1),'S':(0,-1),'SW':(-1,-1),'W':(-1,0),'NW':(-1,1)}
OVERLAY_RIGHT_ANGLE_SQUARE_PX=16.0   # the leg of the drawn square (px): bigger than the plane-figure token so it reads on a phone
OVERLAY_RIGHT_ANGLE_MIN_RAY_PX=24.0
OVERLAY_ANGLE_MIN_RAY_PX=44.0
OVERLAY_ANGLE_MIN_DEGREES=5.0

def _overlay_scalar(value,ident):
    if isinstance(value,bool):_overlay_fail('OVERLAY_VALUE_INVALID',ident)
    if isinstance(value,int):return S.Integer(value)
    if isinstance(value,float):return S.Rational(str(value))
    return _overlay_exact(value,ident)

def _overlay_is_zero(expression):
    """Exact zero test of a small algebraic number (integers, fractions, one radical): expand, then simplify, then a 60-digit numeric proof."""
    value=S.expand(expression)
    if value==0:return True
    try:
        if S.simplify(value)==0:return True
    except (ValueError,TypeError,NotImplementedError):pass
    return abs(S.N(value,60))<S.Float('1e-40',60)

def _overlay_angle_marks(plan,raw,claim,exact_by_point,by_line):
    """The drawn marks of rightAngles / angles / equalAngles as rows for the spec: every vertex and ray end is an overlay point (reused) or a hidden helper point."""
    right_rows=raw.get('rightAngles',[]);angle_rows=raw.get('angles',[]);equal_rows=raw.get('equalAngles',[])
    xmin,xmax,ymin,ymax=plan['viewport']
    scale=((plan.get('plotCanvas') or {}).get('width') or QUADRATIC_PLOT_WIDTH)/(xmax-xmin)
    equal_units=plan.get('equalUnits') is True and plan.get('axisRatio',1)==1
    required=plan.get('requiredPoints') if isinstance(plan.get('requiredPoints'),list) else []
    out=[]
    def resolve(name,ident,mark_id,role):
        """(ref, exact (x,y), helper|None): an overlay point is its own dot; a requiredPoints entry (exact x, y) gets a hidden helper at its place."""
        if isinstance(name,str) and name in exact_by_point:return name,exact_by_point[name],None
        row=next((item for item in required if isinstance(item,dict) and item.get('id')==name),None) if isinstance(name,str) else None
        if row is not None and 'x' in row and 'y' in row:
            xy=(_overlay_scalar(row['x'],ident),_overlay_scalar(row['y'],ident));helper='overlay-angle-'+mark_id+'-'+role
            return helper,xy,{'id':helper,'at':[_overlay_number(xy[0]),_overlay_number(xy[1])]}
        _overlay_fail('GRAPH_ANGLE_POINT_UNKNOWN',ident)
    def inside(xy,ident):
        xf,yf=_overlay_number(xy[0]),_overlay_number(xy[1])
        if not (xmin<xf<xmax and ymin<yf<ymax):_overlay_fail('OVERLAY_POINT_OUTSIDE_VIEWPORT',ident)
    def px(a,b):return math.hypot((_overlay_number(a[0])-_overlay_number(b[0]))*scale,(_overlay_number(a[1])-_overlay_number(b[1]))*scale)
    def cosine(vertex,a,b):
        u=(a[0]-vertex[0],a[1]-vertex[1]);w=(b[0]-vertex[0],b[1]-vertex[1])
        return S.expand(u[0]*w[0]+u[1]*w[1]),S.sqrt(S.expand(u[0]**2+u[1]**2))*S.sqrt(S.expand(w[0]**2+w[1]**2))
    # --- right angles
    for index,entry in enumerate(right_rows):
        if not isinstance(entry,dict) or set(entry)-{'id','at','from','lines','side'}:_overlay_fail('GRAPH_RIGHT_ANGLE_INVALID',entry.get('id','ra'+str(index+1)) if isinstance(entry,dict) else 'ra'+str(index+1))
        ident=_overlay_id(entry.get('id','ra'+str(index+1)),'rightAngle');claim('rightangle:'+ident)
        if not equal_units:_overlay_fail('GRAPH_RIGHT_ANGLE_UNEQUAL_UNITS',ident)
        if 'lines' in entry:
            if 'at' in entry or 'from' in entry:_overlay_fail('GRAPH_RIGHT_ANGLE_INVALID',ident)
            pair=entry['lines']
            if not isinstance(pair,list) or len(pair)!=2 or len(set(pair))!=2 or any(not isinstance(name,str) or name not in by_line for name in pair):_overlay_fail('GRAPH_RIGHT_ANGLE_INVALID',ident)
            first,second=by_line[pair[0]],by_line[pair[1]]
            slopes=[None if line['kind']=='VERTICAL' else pp_exact_value(line['slope']) for line in (first,second)]
            if slopes[0] is None and slopes[1] is None:_overlay_fail('GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR',ident)
            if slopes[0] is None or slopes[1] is None:
                perpendicular=(slopes[1] if slopes[0] is None else slopes[0])==0
            else:perpendicular=_overlay_is_zero(slopes[0]*slopes[1]+1)
            if not perpendicular:_overlay_fail('GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR',ident)
            if slopes[0] is None:vx=pp_exact_value(first['x']);vy=slopes[1]*vx+pp_exact_value(second['intercept'])
            elif slopes[1] is None:vx=pp_exact_value(second['x']);vy=slopes[0]*vx+pp_exact_value(first['intercept'])
            else:
                vx=(pp_exact_value(second['intercept'])-pp_exact_value(first['intercept']))/(slopes[0]-slopes[1]);vy=slopes[0]*vx+pp_exact_value(first['intercept'])
            inside((vx,vy),ident)
            def unit(slope):
                if slope is None:return (0.0,1.0)
                m=_overlay_number(slope);n=math.hypot(1.0,m);return (1.0/n,m/n)
            d1,d2=unit(slopes[0]),unit(slopes[1])
            side=entry.get('side','N')
            if side not in OVERLAY_ANGLE_SIDES:_overlay_fail('GRAPH_RIGHT_ANGLE_INVALID',ident)
            want=OVERLAY_ANGLE_SIDES[side];norm=math.hypot(*want);want=(want[0]/norm+1e-6,want[1]/norm)
            best=None
            for s1,s2 in ((1,1),(-1,1),(1,-1),(-1,-1)):
                bx,by=s1*d1[0]+s2*d2[0],s1*d1[1]+s2*d2[1];score=(bx*want[0]+by*want[1])/math.hypot(bx,by)
                if best is None or score>best[0]+1e-9:best=(score,s1,s2)
            _score,s1,s2=best;t=30.0/scale;vf=(_overlay_number(vx),_overlay_number(vy))
            refs=['overlay-angle-r'+ident+'-a','overlay-angle-r'+ident+'-v','overlay-angle-r'+ident+'-b']
            helpers=[{'id':refs[0],'at':[vf[0]+s1*d1[0]*t,vf[1]+s1*d1[1]*t]},{'id':refs[1],'at':[vf[0],vf[1]]},{'id':refs[2],'at':[vf[0]+s2*d2[0]*t,vf[1]+s2*d2[1]*t]}]
        else:
            pair=entry.get('from');at=entry.get('at')
            if not isinstance(pair,list) or len(pair)!=2 or pair[0]==pair[1] or at in pair or 'side' in entry:_overlay_fail('GRAPH_RIGHT_ANGLE_INVALID',ident)
            vref,vertex,vhelper=resolve(at,ident,'r'+ident,'v');aref,a,ahelper=resolve(pair[0],ident,'r'+ident,'a');bref,b,bhelper=resolve(pair[1],ident,'r'+ident,'b')
            dot,norms=cosine(vertex,a,b)
            if norms==0:_overlay_fail('GRAPH_ANGLE_DEGENERATE',ident)
            if not _overlay_is_zero(dot):_overlay_fail('GRAPH_RIGHT_ANGLE_NOT_PERPENDICULAR',ident)
            if px(vertex,a)<OVERLAY_RIGHT_ANGLE_MIN_RAY_PX or px(vertex,b)<OVERLAY_RIGHT_ANGLE_MIN_RAY_PX:_overlay_fail('GRAPH_ANGLE_RAY_TOO_SHORT',ident)
            refs=[aref,vref,bref];helpers=[row for row in (ahelper,vhelper,bhelper) if row is not None]
        out.append({'id':ident,'objectId':'overlay-rightangle-'+ident,'kind':'RIGHT','refs':refs,'helpers':helpers,'value':90.0,'squareSize':OVERLAY_RIGHT_ANGLE_SQUARE_PX})
    # --- angles (arcs), alone or in an equal group
    groups={};group_of={}
    for index,entry in enumerate(equal_rows):
        if not isinstance(entry,dict) or set(entry)-{'angles','color','arcs'}:_overlay_fail('GRAPH_EQUAL_ANGLES_INVALID','equalAngles.'+str(index))
        ids=entry.get('angles')
        if not isinstance(ids,list) or len(ids)<2 or len(set(ids))!=len(ids) or any(isinstance(item,bool) or not isinstance(item,int) or not 0<=item<len(angle_rows) for item in ids):_overlay_fail('GRAPH_EQUAL_ANGLES_INVALID','equalAngles.'+str(index))
        if entry.get('color') not in OVERLAY_COLOR_NAMES:_overlay_fail('OVERLAY_COLOR_INVALID','equalAngles.'+str(index))
        if 'arcs' in entry and (isinstance(entry['arcs'],bool) or entry['arcs'] not in (1,2)):_overlay_fail('GRAPH_EQUAL_ANGLES_INVALID','equalAngles.'+str(index))
        for item in ids:
            if item in group_of:_overlay_fail('GRAPH_EQUAL_ANGLES_INVALID','equalAngles.'+str(index))
            group_of[item]=index
        groups[index]=entry
    measured=[]
    for index,entry in enumerate(angle_rows):
        if not isinstance(entry,dict) or set(entry)-{'id','at','from','to','color','arcs'}:_overlay_fail('GRAPH_ANGLE_INVALID',entry.get('id','ang'+str(index+1)) if isinstance(entry,dict) else 'ang'+str(index+1))
        ident=_overlay_id(entry.get('id','ang'+str(index+1)),'angle');claim('angle:'+ident)
        if not equal_units:_overlay_fail('GRAPH_ANGLE_UNEQUAL_UNITS',ident)
        if entry.get('at') in (entry.get('from'),entry.get('to')) or entry.get('from')==entry.get('to'):_overlay_fail('GRAPH_ANGLE_DEGENERATE',ident)
        vref,vertex,vhelper=resolve(entry.get('at'),ident,ident,'v');aref,a,ahelper=resolve(entry.get('from'),ident,ident,'a');bref,b,bhelper=resolve(entry.get('to'),ident,ident,'b')
        dot,norms=cosine(vertex,a,b)
        if norms==0:_overlay_fail('GRAPH_ANGLE_DEGENERATE',ident)
        degrees=math.degrees(math.acos(max(-1.0,min(1.0,_overlay_number(dot/norms)))))
        if degrees<OVERLAY_ANGLE_MIN_DEGREES or degrees>180-OVERLAY_ANGLE_MIN_DEGREES:_overlay_fail('GRAPH_ANGLE_DEGENERATE',ident)
        if px(vertex,a)<OVERLAY_ANGLE_MIN_RAY_PX or px(vertex,b)<OVERLAY_ANGLE_MIN_RAY_PX:_overlay_fail('GRAPH_ANGLE_RAY_TOO_SHORT',ident)
        color=entry.get('color');group=groups.get(group_of.get(index))
        if color is not None and color not in OVERLAY_COLOR_NAMES:_overlay_fail('OVERLAY_COLOR_INVALID',ident)
        if group is not None:
            if color is not None and color!=group['color']:_overlay_fail('OVERLAY_COLOR_INVALID',ident)
            color=group['color']
        arcs=entry.get('arcs')
        if arcs is not None and (isinstance(arcs,bool) or arcs not in (1,2)):_overlay_fail('GRAPH_ANGLE_INVALID',ident)
        if group is not None and 'arcs' in group:
            if arcs is not None and arcs!=group['arcs']:_overlay_fail('GRAPH_EQUAL_ANGLES_MISMATCH',ident)
            arcs=group['arcs']
        measured.append((ident,dot,norms,color,degrees))
        out.append({'id':ident,'objectId':'overlay-angle-'+ident,'kind':'ANGLE','refs':[aref,vref,bref],'helpers':[row for row in (ahelper,vhelper,bhelper) if row is not None],
                    'value':degrees,'arcs':arcs or 1,**({'color':color} if color else {})})
    def same_angle(first,second):
        # cos equality: dot1/n1 == dot2/n2 (exact, then a 60-digit numeric proof)
        return _overlay_is_zero(first[1]*second[2]-second[1]*first[2])
    for group in groups.values():
        members=[measured[item] for item in group['angles']]
        for other in members[1:]:
            if not same_angle(members[0],other):_overlay_fail('GRAPH_EQUAL_ANGLES_MISMATCH',members[0][0]+'&'+other[0])
    colored={}
    for row in measured:
        if row[3] is None:continue
        if row[3] in colored and not same_angle(colored[row[3]],row):_overlay_fail('GRAPH_EQUAL_ANGLES_MISMATCH',colored[row[3]][0]+'&'+row[0]+':'+row[3])
        colored.setdefault(row[3],row)
    return out

def _overlay_features(plan):
    raw=plan.get('overlays')
    if raw is None:return None
    if not isinstance(raw,dict) or set(raw)-set(OVERLAY_LIMITS)-{'latticePoints'}:_overlay_fail('OVERLAY_PLAN_INVALID')
    for key,limit in OVERLAY_LIMITS.items():
        rows=raw.get(key,[])
        if not isinstance(rows,list) or len(rows)>limit:_overlay_fail('OVERLAY_TOO_MANY',key)
    seen=set()
    def claim(ident,code='OVERLAY_ID_DUPLICATE'):
        if ident in seen:_overlay_fail(code,ident)
        seen.add(ident)
    lines=[]
    for entry in raw.get('lines',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_LINE_INVALID','line')
        if set(entry)-{'id','slope','intercept','x','label','labelAt','labelValues','style','color','ownership'}:_overlay_fail('OVERLAY_LINE_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'line');claim('line:'+ident)
        if 'x' in entry:
            if 'slope' in entry or 'intercept' in entry:_overlay_fail('OVERLAY_LINE_INVALID',ident)
            x=_overlay_exact(entry['x'],ident)
            line={'id':ident,'kind':'VERTICAL','x':pp_surd_text(x),'xValue':_overlay_number(x),'label':entry.get('label')}
            if 'labelValues' in entry:line['labelValues']=entry['labelValues']
        else:
            if 'slope' not in entry or 'intercept' not in entry:_overlay_fail('OVERLAY_LINE_INVALID',ident)
            slope=_overlay_exact(entry['slope'],ident);intercept=_overlay_exact(entry['intercept'],ident)
            line={'id':ident,'kind':'LINE','slope':pp_surd_text(slope),'intercept':pp_surd_text(intercept),'slopeValue':_overlay_number(slope),'interceptValue':_overlay_number(intercept),'label':entry.get('label')}
        if 'labelValues' in entry:line['labelValues']=entry['labelValues']
        # style (E31): SOLID (default) or DASHED, a thin dashed line (a line shifted from another, an auxiliary line).
        if 'style' in entry:
            if entry['style'] not in ('SOLID','DASHED'):_overlay_fail('OVERLAY_LINE_STYLE_INVALID',ident)
            if entry['style']=='DASHED':line['style']='DASHED'
        # color (G12-2): a palette colour of this line (BLUE WARM GREEN ROSE VIOLET); the observer reads it back from the final SVG
        if 'color' in entry:
            if entry['color'] not in OVERLAY_COLOR_NAMES:_overlay_fail('OVERLAY_COLOR_INVALID',ident)
            line['color']=entry['color']
        # ownership (G18c): NEAREST lets the equation stand where its own line is the nearest one by a small margin (horizontal lines a unit apart); STRICT (default) keeps the clear margin
        if 'ownership' in entry:
            if entry['ownership'] not in ('STRICT','NEAREST'):_overlay_fail('OVERLAY_LINE_OWNERSHIP_INVALID',ident)
            if entry['ownership']=='NEAREST':line['ownership']='NEAREST'
        line['text']=_overlay_line_text(line)
        if not _overlay_line_crosses_view(plan['viewport'],line):_overlay_fail('OVERLAY_LINE_OUTSIDE_VIEWPORT',ident)
        line['labelAt']=_overlay_label_anchor(plan['viewport'],line)
        # labelAt (E31): START / END / a fraction 0..1 of the drawn line from its left (lower) end; the layout then keeps the equation label in that part of the line.
        if 'labelAt' in entry:
            if not _overlay_line_at_valid(entry['labelAt']):_overlay_fail('OVERLAY_LINE_LABEL_AT_INVALID',ident)
            line['lineAt']=entry['labelAt']
        lines.append(line)
    by_line={line['id']:line for line in lines}
    circle_rows,circle_exact=_overlay_circle_rows(raw)
    if circle_rows and (plan.get('equalUnits') is not True or plan.get('axisRatio',1)!=1):_overlay_fail('OVERLAY_CIRCLE_REQUIRES_EQUAL_UNITS',circle_rows[0]['id'])
    for row in circle_rows:claim('circle:'+row['id'])
    points=[];by_point={};exact_by_point={}
    required_ids={point.get('id') for point in plan.get('requiredPoints',[]) if isinstance(point,dict)}
    for entry in raw.get('points',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_POINT_INVALID','point')
        if set(entry)-{'id','curveX','curve','on','x','y','axis','value','intersect','coordinates','labelDirection','unnamed','pick','onCircle','marker','color'}:_overlay_fail('OVERLAY_POINT_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'point')
        if ident in required_ids:_overlay_fail('OVERLAY_POINT_ID_CONFLICT',ident)
        claim('point:'+ident)
        forms=sum(1 for key in ('curveX','intersect','axis','x') if key in entry)
        if forms!=1 or ('curve' in entry and 'curveX' not in entry) or ('on' in entry and 'curveX' not in entry) or ('value' in entry)!=(entry.get('axis') is not None):_overlay_fail('OVERLAY_POINT_INVALID',ident)
        if 'curveX' in entry:
            x=_overlay_exact(entry['curveX'],ident)
            if plan.get('family')=='piecewise-discontinuous':
                # SHARED (G7c): `on` names the curve (f's name or g's id; absent = f); the exact pieces decide whether the point exists there.
                if 'curve' in entry:_overlay_fail('OVERLAY_CURVE_UNKNOWN',ident)
                curve_id=entry.get('on')
                if curve_id is not None and curve_id!=plan.get('functionName','f') and not (isinstance(plan.get('sharedCurve'),dict) and plan['sharedCurve'].get('id')==curve_id):_overlay_fail('OVERLAY_POINT_CURVE_UNKNOWN',ident)
                y=_overlay_curve_exact(plan,x,curve_id)
            else:
                if 'on' in entry:_overlay_fail('OVERLAY_POINT_CURVE_UNKNOWN',ident)
                curve_id=entry.get('curve')
                if plan.get('family')=='exp-log-pair' and curve_id is None:_overlay_fail('OVERLAY_CURVE_REQUIRED',ident)
                if plan.get('family')!='exp-log-pair' and curve_id is not None:_overlay_fail('OVERLAY_CURVE_UNKNOWN',ident)
                lo,hi=plan['domain']
                if not lo<=float(S.N(x,30))<=hi:_overlay_fail('OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN',ident)
                y=_overlay_curve_exact(plan,x,curve_id)
        elif 'intersect' in entry:
            pair=entry['intersect']
            if not isinstance(pair,list) or len(pair)!=2 or len(set(pair))!=2:_overlay_fail('OVERLAY_POINT_INVALID',ident)
            first=by_line.get(pair[0]);second=by_line.get(pair[1])
            if isinstance(pair[0],str) and (pair[0]=='curve' or pair[0].startswith('curve:')) and first is None:
                # curve x circle (G6b): the drawn curve and an overlay circle, the root the pick names; it must have an exact form
                if pair[1] not in circle_exact:_overlay_fail('OVERLAY_POINT_UNKNOWN',ident)
                x,y=_overlay_curve_circle_point(plan,circle_exact[pair[1]],pair[0],entry.get('pick'),ident)
            elif (first is None and pair[0] in circle_exact) or (second is None and pair[1] in circle_exact):
                # line x circle (G6): the root the author's pick names
                line=first if first is not None else second;cid=pair[1] if first is not None else pair[0]
                if line is None or cid not in circle_exact:_overlay_fail('OVERLAY_POINT_UNKNOWN',ident)
                x,y=_overlay_line_circle_point(line,circle_exact[cid],entry.get('pick'),ident)
            elif 'pick' in entry:_overlay_fail('OVERLAY_CIRCLE_PICK_INVALID',ident)
            elif first is None or second is None:_overlay_fail('OVERLAY_POINT_UNKNOWN',ident)
            elif first['kind']=='VERTICAL' and second['kind']=='VERTICAL':_overlay_fail('OVERLAY_LINE_PARALLEL',ident)
            elif first['kind']=='VERTICAL':x=pp_exact_value(first['x']);y=pp_exact_value(second['slope'])*x+pp_exact_value(second['intercept'])
            elif second['kind']=='VERTICAL':x=pp_exact_value(second['x']);y=pp_exact_value(first['slope'])*x+pp_exact_value(first['intercept'])
            else:
                m1=pp_exact_value(first['slope']);q1=pp_exact_value(first['intercept']);m2=pp_exact_value(second['slope']);q2=pp_exact_value(second['intercept'])
                if m1==m2:_overlay_fail('OVERLAY_LINE_PARALLEL',ident)
                x=(q2-q1)/(m1-m2);y=m1*x+q1
        elif 'axis' in entry:
            axis=entry.get('axis');value=_overlay_exact(entry.get('value'),ident)
            if axis=='x':x,y=value,S.Integer(0)
            elif axis=='y':x,y=S.Integer(0),value
            else:_overlay_fail('OVERLAY_POINT_INVALID',ident)
        else:
            x=_overlay_exact(entry['x'],ident);y=_overlay_exact(entry['y'],ident)
        if 'onCircle' in entry:
            if entry['onCircle'] not in circle_exact or not _overlay_on_circle(circle_exact[entry['onCircle']],x,y):_overlay_fail('OVERLAY_POINT_NOT_ON_CIRCLE',ident)
        xmin,xmax,ymin,ymax=plan['viewport'];xf,yf=_overlay_number(x),_overlay_number(y)
        if not (xmin<xf<xmax and ymin<yf<ymax):_overlay_fail('OVERLAY_POINT_OUTSIDE_VIEWPORT',ident)
        row={'id':ident,'x':xf,'y':yf,'xExact':pp_surd_text(x),'yExact':pp_surd_text(y)}
        # coordinates:true writes the point's coordinates beside it (A(-6,-3), or (x,y) for an unnamed point): integers or fractions (3/2, -1/3; E31), which the observer reads back.
        if 'coordinates' in entry:
            if not isinstance(entry['coordinates'],bool):_overlay_fail('OVERLAY_COORDINATES_INVALID',ident)
            if entry['coordinates']:
                row['coordinates']=[_overlay_coordinate_text(v,ident) for v in (x,y)]
        # unnamed:true: a dot with no name letter (an unlabelled intersection of the source figure); with coordinates:true it keeps (x,y) alone.
        if 'unnamed' in entry:
            if not isinstance(entry['unnamed'],bool):_overlay_fail('OVERLAY_POINT_UNNAMED_INVALID',ident)
            if entry['unnamed']:row['unnamed']=True
        if 'labelDirection' in entry:
            # A layout hint only (the side to try first); it needs the label it is a hint for.
            if not row.get('coordinates') or entry['labelDirection'] not in ('N','NE','E','SE','S','SW','W','NW'):_overlay_fail('OVERLAY_LABEL_DIRECTION_INVALID',ident)
            row['labelDirection']=entry['labelDirection']
        # marker (OPEN = a hollow circle) and color (a palette group) are optional looks of the dot; absent, the dot is the plain black one and the row carries neither key
        if 'marker' in entry:
            if entry['marker'] not in OVERLAY_POINT_MARKERS:_overlay_fail('OVERLAY_POINT_MARKER_INVALID',ident)
            if entry['marker']=='OPEN':row['marker']='OPEN'
        if 'color' in entry:
            if entry['color'] not in OVERLAY_COLOR_NAMES:_overlay_fail('OVERLAY_COLOR_INVALID',str(ident)+'.color')
            row['color']=entry['color']
        points.append(row);by_point[ident]=row;exact_by_point[ident]=(x,y)
    def point_ref(value,ident):
        if not isinstance(value,str) or value not in by_point:_overlay_fail('OVERLAY_POINT_UNKNOWN',ident)
        return value
    segments=[]
    for entry in raw.get('segments',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_SEGMENT_INVALID','segment')
        if set(entry)-{'id','from','to','dashed','length','labelDirection','color'}:_overlay_fail('OVERLAY_SEGMENT_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'segment');claim('segment:'+ident)
        start=point_ref(entry.get('from'),ident);end=point_ref(entry.get('to'),ident)
        if start==end:_overlay_fail('OVERLAY_SEGMENT_DEGENERATE',ident)
        dashed=entry.get('dashed',False)
        if not isinstance(dashed,bool):_overlay_fail('OVERLAY_SEGMENT_INVALID',ident)
        row={'id':ident,'from':start,'to':end,'dashed':dashed}
        # color (G12-2): a solid segment of a colour group (a dashed one keeps its dashes and no colour)
        if 'color' in entry:
            if entry['color'] not in OVERLAY_COLOR_NAMES or dashed:_overlay_fail('OVERLAY_COLOR_INVALID',ident)
            row['color']=entry['color']
        # length:true writes the segment's exact length beside it: an integer or p*sqrt(q), recomputed from its end points.
        if 'length' in entry:
            if not isinstance(entry['length'],bool):_overlay_fail('OVERLAY_SEGMENT_LENGTH_INVALID',ident)
            if entry['length']:
                (x1,y1),(x2,y2)=exact_by_point[start],exact_by_point[end]
                row['length']=_overlay_length_row(S.sqrt(S.expand((x2-x1)**2+(y2-y1)**2)),ident)
        if 'labelDirection' in entry:
            if not row.get('length') or entry['labelDirection'] not in ('N','NE','E','SE','S','SW','W','NW'):_overlay_fail('OVERLAY_LABEL_DIRECTION_INVALID',ident)
            row['labelDirection']=entry['labelDirection']
        segments.append(row)
    guides=[]
    for entry in raw.get('guides',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_GUIDE_INVALID','guide')
        if set(entry)-{'id','from','axis','dashed'}:_overlay_fail('OVERLAY_GUIDE_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'guide');claim('guide:'+ident)
        start=point_ref(entry.get('from'),ident);axis=entry.get('axis','BOTH')
        if axis not in ('x','y','BOTH'):_overlay_fail('OVERLAY_GUIDE_INVALID',ident)
        dashed=entry.get('dashed',True)
        if not isinstance(dashed,bool):_overlay_fail('OVERLAY_GUIDE_INVALID',ident)
        guides.append({'id':ident,'from':start,'axis':axis,'dashed':dashed})
    polygons=[]
    for entry in raw.get('polygons',[]):
        if not isinstance(entry,dict):_overlay_fail('OVERLAY_POLYGON_INVALID','polygon')
        if set(entry)-{'id','points','fill','label','labelKind'}:_overlay_fail('OVERLAY_POLYGON_INVALID',entry.get('id'))
        ident=_overlay_id(entry.get('id'),'polygon');claim('polygon:'+ident)
        refs=entry.get('points')
        if not isinstance(refs,list) or not 3<=len(refs)<=6 or len(set(refs))!=len(refs):_overlay_fail('OVERLAY_POLYGON_INVALID',ident)
        refs=[point_ref(value,ident) for value in refs]
        fill=entry.get('fill','LIGHT')
        if fill not in ('LIGHT','MEDIUM','NONE',*OVERLAY_COLOR_NAMES):_overlay_fail('OVERLAY_FILL_INVALID',ident)   # (G12-2) a palette colour too
        coords=[(by_point[value]['x'],by_point[value]['y']) for value in refs]
        area=sum(coords[i][0]*coords[(i+1)%len(coords)][1]-coords[(i+1)%len(coords)][0]*coords[i][1] for i in range(len(coords)))
        if abs(area)<1e-9:_overlay_fail('OVERLAY_POLYGON_DEGENERATE',ident)
        row={'id':ident,'points':refs,'fill':fill}
        # An optional short label (a formula such as b, or plain Korean text) goes inside the polygon, where it has the most room.
        label=entry.get('label');label_kind=entry.get('labelKind')
        if label is None:
            if label_kind is not None:_overlay_fail('OVERLAY_POLYGON_LABEL_KIND_WITHOUT_LABEL',ident)
        else:
            if label_kind is None:label_kind='MATH'
            if label_kind not in OVERLAY_POLYGON_LABEL_KINDS:_overlay_fail('OVERLAY_POLYGON_LABEL_KIND_INVALID',ident)
            if not isinstance(label,str) or not label.strip() or len(label)>40 or any(ord(char)<32 for char in label) or (label_kind=='MATH' and not re.fullmatch(OVERLAY_POLYGON_MATH_LABEL_PATTERN,label)):_overlay_fail('OVERLAY_POLYGON_LABEL_INVALID',ident)
            row['label']=label;row['labelKind']=label_kind
        polygons.append(row)
    for line in lines:line['labelAlternates']=_overlay_label_alternates(plan,line,lines,points)
    circle_regions=_overlay_circle_regions(plan,raw,circle_rows,circle_exact,by_point,exact_by_point,claim)
    features={'schemaVersion':'GRAPH_OVERLAYS_FEATURES_v1','points':points,'lines':lines,'segments':segments,'guides':guides,'polygons':polygons}
    if circle_regions:features['circleRegions']=circle_regions
    if circle_rows:
        xmin,xmax,ymin,ymax=plan['viewport']
        for row in circle_rows:
            if not (xmin<=row['cx']-row['r'] and row['cx']+row['r']<=xmax and ymin<=row['cy']-row['r'] and row['cy']+row['r']<=ymax):_overlay_fail('OVERLAY_CIRCLE_OUTSIDE_VIEWPORT',row['id'])
        features['circles']=circle_rows
    if 'names' in raw:features['names']=_overlay_names(plan,raw.get('names'),claim,lines,segments,by_point)
    if raw.get('quadrants'):features['quadrants']=_overlay_quadrants(plan,raw['quadrants'],claim)
    if raw.get('callouts'):features['callouts']=_overlay_callouts(plan,raw['callouts'],claim,by_point)
    if any(raw.get(key) for key in ('rightAngles','angles','equalAngles')):features['angleMarks']=_overlay_angle_marks(plan,raw,claim,exact_by_point,by_line)
    if raw.get('latticePoints') is not None:features['latticePoints']=_overlay_lattice(plan,raw['latticePoints'],[(point['x'],point['y']) for point in points])
    return features

def _overlay_anchor_points(plan):
    """Best-effort exact coordinates of every declared overlay point, computed before framing so the family framer can put the whole
    declared overlay inside its window (a point in the source domain still needs the frame to reach it). Validation is not done here:
    _overlay_features remains the single authority after framing, so a bad entry still gets its own explicit error code."""
    raw=plan.get('overlays')
    if not isinstance(raw,dict):return []
    lines={}
    for entry in raw.get('lines') or []:
        if not isinstance(entry,dict):continue
        try:
            if 'x' in entry:lines[entry.get('id')]=('V',_overlay_exact(entry['x'],'line'))
            elif 'slope' in entry and 'intercept' in entry:lines[entry.get('id')]=('L',(_overlay_exact(entry['slope'],'line'),_overlay_exact(entry['intercept'],'line')))
        except (ValueError,TypeError):continue
    viewport=plan.get('viewport');domain=plan.get('domain');anchors=[]
    try:circle_rows,circle_exact=_overlay_circle_rows(raw)
    except ValueError:circle_rows,circle_exact=[],{}
    for row in circle_rows:anchors.extend([(row['cx']-row['r'],row['cy']-row['r']),(row['cx']+row['r'],row['cy']+row['r'])])
    for entry in raw.get('points') or []:
        if not isinstance(entry,dict):continue
        try:
            on_curve=False
            if 'curveX' in entry:
                x=_overlay_exact(entry['curveX'],'point');y=_overlay_curve_exact(plan,x,entry.get('on') if plan.get('family')=='piecewise-discontinuous' else entry.get('curve'));on_curve=True
            elif 'intersect' in entry:
                pair=entry['intersect'];first=lines.get(pair[0]);second=lines.get(pair[1])
                if (first is None and pair[0] in circle_exact) or (second is None and pair[1] in circle_exact):continue
                if first is None or second is None:continue
                if first[0]=='V' and second[0]=='V':continue
                if first[0]=='V':x=first[1];y=second[1][0]*x+second[1][1]
                elif second[0]=='V':x=second[1];y=first[1][0]*x+first[1][1]
                else:
                    m1,q1=first[1];m2,q2=second[1]
                    if m1==m2:continue
                    x=(q2-q1)/(m1-m2);y=m1*x+q1
            elif 'axis' in entry:
                value=_overlay_exact(entry.get('value'),'point')
                x,y=(value,S.Integer(0)) if entry.get('axis')=='x' else (S.Integer(0),value)
            elif 'x' in entry and 'y' in entry:
                x,y=_overlay_exact(entry['x'],'point'),_overlay_exact(entry['y'],'point')
            else:continue
            xf,yf=float(S.N(x,30)),float(S.N(y,30))
            if not (math.isfinite(xf) and math.isfinite(yf)):continue
            # A declared point outside the author's reviewed draw interval or viewport is not a frame anchor: the framer must not
            # enlarge its window to make an invalid claim look valid (the overlay validator then refuses it).
            if on_curve and isinstance(domain,list) and len(domain)==2 and not (domain[0]-1e-9<=xf<=domain[1]+1e-9):continue
            # (G18b) a multi-curve figure's viewport is only the window the curves are cut by: a declared point (an intersection of a line with the curves, say) outside it widens the frame instead of being refused
            if plan.get('family')!='multi-curve' and isinstance(viewport,list) and len(viewport)==4 and not (viewport[0]-1e-9<=xf<=viewport[1]+1e-9 and viewport[2]-1e-9<=yf<=viewport[3]+1e-9):continue
            anchors.append((xf,yf))
        except (ValueError,KeyError,TypeError,ZeroDivisionError):continue
    # The lattice points are part of the figure: the family framer must reach them (a bad entry is refused later with its own code).
    lattice=raw.get('latticePoints')
    if isinstance(lattice,dict) and isinstance(plan.get('domain'),list) and len(plan['domain'])==2:
        try:
            wide={**plan,'viewport':[-1e9,1e9,-1e9,1e9]}
            row=_overlay_lattice(wide,lattice,[])
            xs=[point['x'] for point in row['points']];ys=[point['y'] for point in row['points']]
            anchors.extend([(float(min(xs)),float(min(ys))),(float(max(xs)),float(max(ys))),(float(min(xs)),float(max(ys))),(float(max(xs)),float(min(ys)))])
        except (ValueError,KeyError,TypeError,ZeroDivisionError):pass
    return anchors

# ---- multi-curve figure: three to six independent nonlinear curves in one plane ---------------------------------
# A source figure bounded by THREE OR MORE distinct nonlinear curves (for example the four parabolas y=2-x^2,
# x=2-y^2, y=x^2-2, x=y^2-2 of 22 효천고 2학기 기말 고2 수학II q10). Each curve is one explicit quadratic arc:
# Y_OF_X is y=c0+c1*x+c2*x^2 on a closed x interval; X_OF_Y is x=c0+c1*y+c2*y^2 on a closed y interval and is
# drawn as its monotone branch(es) above/below its vertex. The framer recomputes the bounding box at one scale
# (vertical squeeze at most 1/2), freezes every branch's exact x interval and sampling expression, and refuses a
# curve it cannot represent. The independent observer recomputes every branch from the same coefficients and reads
# the final SVG; it never trusts a frozen expression.
MULTI_CURVE_FIELDS={'family','curves','axisTickValues','domain','viewport','plotCanvas','axisSqueeze','plotHeightLimit','overlays','overlayAnchors','axisTitles','regions','axisScale'}
# G18a: besides the two quadratic kinds a curve may be LINE (y=c0+c1*x), RATIONAL (y=(a0+a1*x)/(d0+d1*x)) or SQRT (y=offset+amplitude*sqrt(c0+c1*x)), each with
# its own look (color, weight, style, label, hideLabels), or the inverse of another curve (inverseOf). These kinds are not bounded by their own shape, so the
# author names the window (graphPlan.viewport = [xmin,xmax,ymin,ymax]) and a curve is clipped to the frame built around that window.
MULTI_CURVE_KINDS=('Y_OF_X','X_OF_Y','LINE','RATIONAL','SQRT')
MULTI_CURVE_FREE_KINDS=('LINE','RATIONAL','SQRT')
MULTI_CURVE_KIND_KEYS={'Y_OF_X':{'coefficients','domain','branch','abs'},'X_OF_Y':{'coefficients','domain','branch'},'LINE':{'coefficients','domain','domainStates','abs'},'RATIONAL':{'numerator','denominator','domain','domainStates','abs'},'SQRT':{'radicand','amplitude','offset','domain','domainStates','abs'}}
MULTI_CURVE_LOOK_KEYS={'id','kind','label','color','weight','style','hideLabel','hideLabels','inverseOf','emphasis'}
# G18a-4: emphasis:[{from?,to?,color?,fromState?,toState?}] draws only that x stretch of the curve heavier and in a colour, with an open or closed end dot (states OPEN | CLOSED | NONE);
# domain may be written {from,to} as well as [from,to] (the curve is then not drawn outside it).
MULTI_CURVE_EMPHASIS_KEYS={'from','to','color','fromState','toState'}
MULTI_CURVE_EMPHASIS_STATES=('NONE','OPEN','CLOSED')
MULTI_CURVE_DOMAIN_STATES=('NONE','OPEN','CLOSED')
MULTI_CURVE_EMPHASIS_MAX=3
MULTI_CURVE_EMPHASIS_COLOR='WARM'
MULTI_CURVE_HIDE_LABELS=('formula','asymptotes','start')
MULTI_CURVE_WEIGHTS=('BOLD','NORMAL')
MULTI_CURVE_STYLES=('SOLID','DASHED')
_MC_EXACT=r'-?\d+(?:/\d+)?'

MULTI_CURVE_LABEL_PATTERN=r'[0-9A-Za-z=+\-*/().^ ]{1,40}'
MULTI_CURVE_MIN_CURVES=2   # G18a: two curves are enough once a curve can be a rational, a square root or a line (a pair, an inverse pair)
MULTI_CURVE_MAX_CURVES=6
MULTI_CURVE_OVERVIEW_POLICY='MULTI_CURVE_OVERVIEW_v1'
MULTI_CURVE_BRANCHES=('BOTH','POSITIVE','NEGATIVE')

def _mc_coefficients(values,code):
    if not isinstance(values,list) or len(values)!=3:raise ValueError(code)
    return [pp_surd(value,code) for value in values]

def _mc_interval(value,code):
    if not isinstance(value,list) or len(value)!=2:raise ValueError(code)
    lo=pp_surd(value[0],code);hi=pp_surd(value[1],code)
    if not lo<hi:raise ValueError(code)
    return lo,hi

def _mc_sideways_branches(curve):
    """The monotone branches of x=c0+c1*y+c2*y^2 on its y interval. A branch is POSITIVE (y >= vertex) or NEGATIVE
    (y <= vertex); its x interval is [vertexX, x(far y)] sorted, and its sampling expression is y(x) derived exactly."""
    c0,c1,c2=curve['coefficients'];ylo,yhi=curve['interval'];side=curve.get('branch','BOTH')
    yv=-c1/(2*c2);xv=c0+c1*yv+c2*yv*yv
    rows=[]
    if side in ('BOTH','POSITIVE') and yhi>yv:
        xe=c0+c1*yhi+c2*yhi*yhi
        rows.append({'side':'POSITIVE','xInterval':(min(xv,xe),max(xv,xe)),'yInterval':(yv,yhi),'sign':1,'vertex':(xv,yv)})
    if side in ('BOTH','NEGATIVE') and ylo<yv:
        xe=c0+c1*ylo+c2*ylo*ylo
        rows.append({'side':'NEGATIVE','xInterval':(min(xv,xe),max(xv,xe)),'yInterval':(ylo,yv),'sign':-1,'vertex':(xv,yv)})
    if not rows:raise ValueError('MULTI_CURVE_BRANCH_EMPTY:'+curve['id'])
    for row in rows:
        x_vertex,y_vertex=row['vertex']
        row['expression']=f'({_pp_text(y_vertex)})+({row["sign"]})*sqrt((x-({_pp_text(x_vertex)}))/({_pp_text(c2)}))'
    return rows

def _mc_fraction(value,code):
    """An exact integer or a/b string (a JSON integer too) as a Fraction, or the refusal code."""
    if isinstance(value,bool):raise ValueError(code)
    if isinstance(value,int):return Fraction(value)
    if not isinstance(value,str) or len(value)>64 or not re.fullmatch(_MC_EXACT,value):raise ValueError(code)
    try:return Fraction(value)
    except (ValueError,ZeroDivisionError):raise ValueError(code) from None

def _mc_label_ascii(text,ident):
    """A curve's own label: the exact ASCII math string (y=2-x^2), or for the new kinds the TeX form of the same formula (-\\frac{8}{x-1}-4), which is turned
    into the ASCII form the existing math-label machinery typesets (stacked fractions and radicals)."""
    if not isinstance(text,str):raise ValueError('MULTI_CURVE_LABEL_INVALID:'+ident)
    value=text
    for _ in range(8):
        changed=re.sub(r'\\frac\{([^{}]*)\}\{([^{}]*)\}',lambda m:(m.group(1) if re.fullmatch(r'[A-Za-z0-9.]+',m.group(1)) else '('+m.group(1)+')')+'/'+(m.group(2) if re.fullmatch(r'[A-Za-z0-9.]+',m.group(2)) else '('+m.group(2)+')'),value)
        changed=re.sub(r'\\sqrt\{([^{}]*)\}',lambda m:'sqrt('+m.group(1)+')',changed)
        if changed==value:break
        value=changed
    value=value.replace('\\left|','abs(').replace('\\right|',')').replace('\\cdot','*').replace('\\left','').replace('\\right','')   # (G18c) |..| written \left|..\right| is the abs(..) the label machinery typesets
    if not re.fullmatch(MULTI_CURVE_LABEL_PATTERN,value):raise ValueError('MULTI_CURVE_LABEL_INVALID:'+ident)
    return value

def _mc_look(entry,ident,free):
    """color / weight / style / label / hideLabel(s) of a curve (the looks the author may choose), validated; returns the frozen look dict."""
    look={}
    if 'color' in entry:
        if entry['color'] not in OVERLAY_COLOR_NAMES:raise ValueError('MULTI_CURVE_COLOR_INVALID:'+ident)
        look['color']=entry['color']
    if 'weight' in entry:
        if entry['weight'] not in MULTI_CURVE_WEIGHTS:raise ValueError('MULTI_CURVE_WEIGHT_INVALID:'+ident)
        look['weight']=entry['weight']
    if 'style' in entry:
        if entry['style'] not in MULTI_CURVE_STYLES:raise ValueError('MULTI_CURVE_STYLE_INVALID:'+ident)
        look['style']=entry['style']
    hidden=[]
    if 'hideLabel' in entry:
        if entry['hideLabel'] is not True and entry['hideLabel'] is not False:raise ValueError('MULTI_CURVE_HIDE_LABELS_INVALID:'+ident)
        if entry['hideLabel']:hidden.append('formula')
    if 'hideLabels' in entry:
        raw=entry['hideLabels']
        if not isinstance(raw,list) or len(set(raw))!=len(raw) or any(item not in MULTI_CURVE_HIDE_LABELS for item in raw):raise ValueError('MULTI_CURVE_HIDE_LABELS_INVALID:'+ident)
        hidden.extend(item for item in raw if item not in hidden)
    if hidden:look['hideLabels']=[item for item in MULTI_CURVE_HIDE_LABELS if item in hidden]
    if 'label' in entry:
        if free:look['label']=_mc_label_ascii(entry['label'],ident)
        elif not isinstance(entry['label'],str) or not re.fullmatch(MULTI_CURVE_LABEL_PATTERN,entry['label']):raise ValueError('MULTI_CURVE_LABEL_INVALID:'+ident)
        else:look['label']=entry['label']
    return look

def _mc_window(plan):
    raw=plan.get('viewport')
    if raw is None:return None
    if not isinstance(raw,list) or len(raw)!=4 or any(isinstance(v,bool) or not isinstance(v,(int,float)) or not math.isfinite(v) or abs(v)>1e6 for v in raw) or not raw[0]<raw[1] or not raw[2]<raw[3]:raise ValueError('MULTI_CURVE_WINDOW_INVALID')
    return [Fraction(str(v)) for v in raw]

def _mc_interval_fractions(value,code):
    if not isinstance(value,list) or len(value)!=2:raise ValueError(code)
    lo=_mc_fraction(value[0],code);hi=_mc_fraction(value[1],code)
    if not lo<hi:raise ValueError(code)
    return lo,hi

def mc_rational_value(curve,x_value):
    d0,d1=curve['denominator']
    if len(curve['numerator'])==3:
        n0,n1,n2=curve['numerator'];return (n0+n1*x_value+n2*x_value*x_value)/(d0+d1*x_value)   # a quadratic numerator: an oblique asymptote, no horizontal one
    n0,n1=curve['numerator']
    return (n0+n1*x_value)/(d0+d1*x_value)

def mc_sqrt_value(curve,x_value):
    """The exact value of offset+amplitude*sqrt(c0+c1*x) when the radicand is the square of a rational, else None."""
    radicand=curve['radicand'][0]+curve['radicand'][1]*x_value
    if radicand<0:return None
    if radicand==0:return curve['offset']
    product=radicand.numerator*radicand.denominator;root=math.isqrt(product)
    if root*root!=product:return None
    return curve['offset']+curve['amplitude']*Fraction(root,radicand.denominator)

def _mc_to_fraction(value,ident):
    """A sympy rational (a quadratic's exact coefficient) as a Fraction; a surd cannot be turned into an inverse."""
    if isinstance(value,Fraction):return value
    if not getattr(value,'is_Rational',False):raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
    return Fraction(int(value.p),int(value.q))

def _mc_abs_flag(entry,ident):
    """(G18c) abs:true draws y=|f(x)| for a LINE / RATIONAL / SQRT / quadratic curve (the part below the x-axis is folded up)."""
    if 'abs' not in entry:return False
    if entry['abs'] is not True and entry['abs'] is not False:raise ValueError('MULTI_CURVE_ABS_INVALID:'+ident)
    return entry['abs']

def mc_value(curve,x_value):
    """y of a free-kind curve at x as a float (None where it is not defined); |f(x)| for an abs curve."""
    kind=curve['kind']
    if kind=='LINE':value=float(curve['coefficients'][0]+curve['coefficients'][1]*x_value)
    elif kind=='RATIONAL':
        den=curve['denominator'][0]+curve['denominator'][1]*x_value
        if den==0:return None
        value=float(mc_rational_value(curve,x_value))
    else:
        radicand=curve['radicand'][0]+curve['radicand'][1]*x_value
        if radicand<0:return None
        value=float(curve['offset'])+float(curve['amplitude'])*math.sqrt(float(radicand))
    return abs(value) if curve.get('abs') else value

def _mc_free_curve(entry,ident,kind,window,look):
    """LINE / RATIONAL / SQRT from its own fields; the draw interval is the author's domain or the window's."""
    extra=set(entry)-MULTI_CURVE_LOOK_KEYS-MULTI_CURVE_KIND_KEYS[kind]
    if extra:raise ValueError('MULTI_CURVE_CURVE_INVALID:'+ident)
    curve={'id':ident,'kind':kind,'look':look}
    if kind=='LINE':
        raw=entry.get('coefficients')
        if not isinstance(raw,list) or len(raw)!=2:raise ValueError('MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
        curve['coefficients']=[_mc_fraction(v,'MULTI_CURVE_COEFFICIENT_INVALID:'+ident) for v in raw]
    elif kind=='RATIONAL':
        for key in ('numerator','denominator'):
            raw=entry.get(key)
            # the numerator may be a quadratic [c0,c1,c2] (y=(c2x^2+c1x+c0)/(d0+d1x): a vertical and an oblique asymptote); everything else is linear
            if not isinstance(raw,list) or len(raw) not in ((2,3) if key=='numerator' else (2,)):raise ValueError('MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
            curve[key]=[_mc_fraction(v,'MULTI_CURVE_COEFFICIENT_INVALID:'+ident) for v in raw]
        if curve['denominator'][1]==0:raise ValueError('MULTI_CURVE_RATIONAL_DEGENERATE:'+ident)
        pole=-curve['denominator'][0]/curve['denominator'][1]
        if len(curve['numerator'])==3:
            if curve['numerator'][2]==0 or entry.get('abs') is True:raise ValueError('MULTI_CURVE_COEFFICIENT_INVALID:'+ident)   # a zero x^2 coefficient is a linear numerator; |f| of an oblique rational is not drawn
            if curve['numerator'][0]+curve['numerator'][1]*pole+curve['numerator'][2]*pole*pole==0:raise ValueError('MULTI_CURVE_RATIONAL_DEGENERATE:'+ident)
        elif curve['numerator'][0]+curve['numerator'][1]*pole==0:raise ValueError('MULTI_CURVE_RATIONAL_DEGENERATE:'+ident)
    else:
        raw=entry.get('radicand')
        if not isinstance(raw,list) or len(raw)!=2:raise ValueError('MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
        curve['radicand']=[_mc_fraction(v,'MULTI_CURVE_COEFFICIENT_INVALID:'+ident) for v in raw]
        if curve['radicand'][1]==0:raise ValueError('MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
        curve['amplitude']=_mc_fraction(entry.get('amplitude','1'),'MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
        curve['offset']=_mc_fraction(entry.get('offset','0'),'MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
        if curve['amplitude']==0:raise ValueError('MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
    curve['intervalGiven']='domain' in entry
    curve['abs']=_mc_abs_flag(entry,ident)
    raw_states=entry.get('domainStates',['NONE','NONE'])
    if not isinstance(raw_states,list) or len(raw_states)!=2 or any(state not in MULTI_CURVE_DOMAIN_STATES for state in raw_states):raise ValueError('MULTI_CURVE_DOMAIN_STATE_INVALID:'+ident)
    curve['domainStates']=tuple(raw_states)
    if 'domain' in entry:curve['interval']=_mc_interval_fractions(entry['domain'],'MULTI_CURVE_DOMAIN_INVALID:'+ident)
    return curve

def _mc_inverse_curve(entry,ident,source,look):
    """The inverse of a curve, as the other curve it is: RATIONAL -> RATIONAL, LINE -> LINE, SQRT -> the quadratic half Y_OF_X, a quadratic half -> SQRT."""
    extra=set(entry)-MULTI_CURVE_LOOK_KEYS-{'domain'}
    if extra:raise ValueError('MULTI_CURVE_CURVE_INVALID:'+ident)
    kind=source['kind'];curve={'id':ident,'look':look,'inverseOf':source['id']}
    if source.get('abs'):raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)   # |f| is not one-to-one
    if kind=='RATIONAL':
        if len(source['numerator'])!=2:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)   # the inverse of an oblique rational is not a rational
        a0,a1=source['numerator'];d0,d1=source['denominator']
        curve.update({'kind':'RATIONAL','numerator':[a0,-d0],'denominator':[-a1,d1]})
        if curve['denominator'][1]==0:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
        if curve['numerator'][0]+curve['numerator'][1]*(-curve['denominator'][0]/curve['denominator'][1])==0:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
    elif kind=='LINE':
        c0,c1=source['coefficients']
        if c1==0:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
        curve.update({'kind':'LINE','coefficients':[-c0/c1,1/c1]})
    elif kind=='SQRT':
        (c0,c1),amplitude,offset=source['radicand'],source['amplitude'],source['offset']
        q2=1/(amplitude*amplitude*c1)
        curve.update({'kind':'Y_OF_X','coefficients':[offset*offset*q2-c0/c1,-2*offset*q2,q2]})
    elif kind=='Y_OF_X':
        c0,c1,c2=(_mc_to_fraction(value,ident) for value in source['coefficients'])
        lo,hi=(_mc_to_fraction(value,ident) for value in source['interval']);vertex=-c1/(2*c2)
        if lo<vertex<hi:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
        k=c0+c1*vertex+c2*vertex*vertex;side=1 if lo>=vertex else -1
        curve.update({'kind':'SQRT','radicand':[-k/c2,1/c2],'amplitude':Fraction(side),'offset':vertex})
    else:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
    return curve

def multi_curve_source(plan):
    unknown=set(plan)-MULTI_CURVE_FIELDS
    if unknown:raise ValueError('MULTI_CURVE_FIELD_UNKNOWN:'+sorted(unknown)[0])
    raw=plan.get('curves')
    minimum=1 if isinstance(raw,list) and (any(isinstance(entry,dict) and (entry.get('emphasis') or entry.get('abs') is True) for entry in raw) or (isinstance(plan.get('regions'),list) and plan['regions'])) else MULTI_CURVE_MIN_CURVES   # a single curve is a figure when one stretch of it (or the region it bounds) is the point
    if not isinstance(raw,list) or not minimum<=len(raw)<=MULTI_CURVE_MAX_CURVES:raise ValueError('MULTI_CURVE_COUNT_INVALID')
    normalized=[]
    for entry in raw:
        domain=entry.get('domain') if isinstance(entry,dict) else None
        if isinstance(domain,dict):
            if not {'from','to'}<=set(domain) or set(domain)-{'from','to','fromState','toState'}:raise ValueError('MULTI_CURVE_DOMAIN_INVALID:'+str(entry.get('id','')))
            states=[domain.get('fromState','NONE'),domain.get('toState','NONE')]
            entry={**entry,'domain':[domain['from'],domain['to']]}
            if states!=['NONE','NONE']:entry['domainStates']=states
        normalized.append(entry)
    raw=normalized
    window=_mc_window(plan)
    curves=[];ids=set();by_id={}
    for entry in raw:
        if not isinstance(entry,dict):raise ValueError('MULTI_CURVE_CURVE_INVALID')
        ident=entry.get('id')
        if not isinstance(ident,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,15}',ident) or ident in ids:raise ValueError('MULTI_CURVE_ID_INVALID')
        ids.add(ident)
        inverse_of=entry.get('inverseOf')
        if inverse_of is not None:
            source=by_id.get(inverse_of) if isinstance(inverse_of,str) else None
            if source is None or source.get('inverseOf') is not None:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)
            if 'kind' in entry and entry['kind'] not in MULTI_CURVE_KINDS:raise ValueError('MULTI_CURVE_KIND_INVALID:'+ident)
            curve=_mc_inverse_curve(entry,ident,source,_mc_look(entry,ident,True))
            curve['intervalGiven']='domain' in entry
            if 'domain' in entry:curve['interval']=_mc_interval_fractions(entry['domain'],'MULTI_CURVE_DOMAIN_INVALID:'+ident)
            elif curve['kind'] in ('RATIONAL','LINE'):
                if window is None:raise ValueError('MULTI_CURVE_WINDOW_REQUIRED:'+ident)
                curve['interval']=(window[0],window[1])
            else:
                lo,hi=source['interval']
                if source['kind']=='SQRT':
                    ends=[mc_sqrt_value(source,lo),mc_sqrt_value(source,hi)]
                    if None in ends:raise ValueError('MULTI_CURVE_INVERSE_UNSUPPORTED:'+ident)   # the image of an irrational end is not exact: give the inverse its own domain
                    ends.sort();curve['interval']=(ends[0],ends[1])
                else:
                    c0,c1,c2=(_mc_to_fraction(value,ident) for value in source['coefficients']);lo,hi=(_mc_to_fraction(value,ident) for value in (lo,hi))
                    ends=sorted([c0+c1*lo+c2*lo*lo,c0+c1*hi+c2*hi*hi]);curve['interval']=(ends[0],ends[1])
            curves.append(curve);by_id[ident]=curve
            continue
        kind=entry.get('kind')
        if kind not in MULTI_CURVE_KINDS:raise ValueError('MULTI_CURVE_KIND_INVALID:'+ident)
        free=kind in MULTI_CURVE_FREE_KINDS
        if set(entry)-MULTI_CURVE_LOOK_KEYS-MULTI_CURVE_KIND_KEYS[kind]:raise ValueError('MULTI_CURVE_CURVE_INVALID:'+ident)
        look=_mc_look(entry,ident,free)
        if free:
            curve=_mc_free_curve(entry,ident,kind,window,look)
            if 'interval' not in curve:
                if window is None:raise ValueError('MULTI_CURVE_WINDOW_REQUIRED:'+ident)
                if kind=='SQRT':
                    boundary=-curve['radicand'][0]/curve['radicand'][1]
                    curve['interval']=(boundary,window[1]) if curve['radicand'][1]>0 else (window[0],boundary)
                else:curve['interval']=(window[0],window[1])
            if kind=='RATIONAL' and window is None:raise ValueError('MULTI_CURVE_WINDOW_REQUIRED:'+ident)
            if kind=='SQRT':
                boundary=-curve['radicand'][0]/curve['radicand'][1]
                lo,hi=curve['interval']
                if (curve['radicand'][1]>0 and lo<boundary) or (curve['radicand'][1]<0 and hi>boundary):raise ValueError('MULTI_CURVE_DOMAIN_INVALID:'+ident)
                if not lo<hi:raise ValueError('MULTI_CURVE_DOMAIN_INVALID:'+ident)
                start_index=0 if curve['radicand'][1]>0 else 1
                if curve['domainStates'][start_index]=='OPEN' and curve['interval'][start_index]==boundary:raise ValueError('MULTI_CURVE_DOMAIN_STATE_INVALID:'+ident)
            curves.append(curve);by_id[ident]=curve
            continue
        coefficients=_mc_coefficients(entry.get('coefficients'),'MULTI_CURVE_COEFFICIENT_INVALID:'+ident)
        if coefficients[2]==0:raise ValueError('MULTI_CURVE_NOT_QUADRATIC:'+ident)
        interval=_mc_interval(entry.get('domain'),'MULTI_CURVE_DOMAIN_INVALID:'+ident)
        branch=entry.get('branch','BOTH')
        if kind=='Y_OF_X' and 'branch' in entry:raise ValueError('MULTI_CURVE_BRANCH_INVALID:'+ident)
        if kind=='X_OF_Y' and branch not in MULTI_CURVE_BRANCHES:raise ValueError('MULTI_CURVE_BRANCH_INVALID:'+ident)
        curve={'id':ident,'kind':kind,'coefficients':coefficients,'interval':interval,'branch':branch,'look':look,'abs':_mc_abs_flag(entry,ident)}
        curve['branches']=_mc_sideways_branches(curve) if kind=='X_OF_Y' else [{'side':'FUNCTION','xInterval':interval,'yInterval':None}]
        curves.append(curve);by_id[ident]=curve
    # The new kinds and the inverses get their branches here (a quadratic keeps the ones it was given).
    for curve in curves:
        if 'branches' not in curve:curve['branches']=_mc_free_branches(curve,window)
    for entry,curve in zip(raw,curves):
        curve['emphasis']=_mc_emphasis_rows(entry,curve)
    return curves

def _mc_emphasis_rows(entry,curve):
    """The emphasised stretches of a curve (G18a-4), exact: from/to default to the curve's own ends, lie inside its draw interval, are in order and do not overlap, and a
    stretch of a rational never crosses its pole. Only a curve drawn as y(x) with exact ends can carry one."""
    raw=entry.get('emphasis') if isinstance(entry,dict) else None
    ident=curve['id']
    if raw is None:return []
    if not isinstance(raw,list) or not 1<=len(raw)<=MULTI_CURVE_EMPHASIS_MAX:raise ValueError('MULTI_CURVE_EMPHASIS_INVALID:'+ident)
    if curve['kind']=='X_OF_Y':raise ValueError('MULTI_CURVE_EMPHASIS_UNSUPPORTED:'+ident)
    try:lo,hi=(_mc_to_fraction(value,ident) for value in curve['interval'])
    except ValueError:raise ValueError('MULTI_CURVE_EMPHASIS_UNSUPPORTED:'+ident) from None
    rows=[];previous=None
    for index,item in enumerate(raw,1):
        if not isinstance(item,dict) or set(item)-MULTI_CURVE_EMPHASIS_KEYS:raise ValueError('MULTI_CURVE_EMPHASIS_INVALID:'+ident)
        start=lo if item.get('from') is None else _mc_fraction(item['from'],'MULTI_CURVE_EMPHASIS_INVALID:'+ident)
        end=hi if item.get('to') is None else _mc_fraction(item['to'],'MULTI_CURVE_EMPHASIS_INVALID:'+ident)
        if not lo<=start<end<=hi or (previous is not None and start<previous):raise ValueError('MULTI_CURVE_EMPHASIS_INVALID:'+ident)
        color=item.get('color',MULTI_CURVE_EMPHASIS_COLOR)
        if color not in OVERLAY_COLOR_NAMES:raise ValueError('MULTI_CURVE_COLOR_INVALID:'+ident)
        states=[item.get('fromState','NONE'),item.get('toState','NONE')]
        if any(state not in MULTI_CURVE_EMPHASIS_STATES for state in states):raise ValueError('MULTI_CURVE_EMPHASIS_INVALID:'+ident)
        if curve['kind']=='RATIONAL':
            pole=-curve['denominator'][0]/curve['denominator'][1]
            if start<pole<end:raise ValueError('MULTI_CURVE_EMPHASIS_ACROSS_POLE:'+ident)
        rows.append({'from':start,'to':end,'color':color,'fromState':states[0],'toState':states[1]});previous=end
    return rows

def _mc_free_branches(curve,window):
    """The exact branches of a curve that has no vertex split: LINE, SQRT and a quadratic half are one branch; RATIONAL is split at its pole (LEFT / RIGHT)
    when the pole lies inside the draw interval."""
    ident=curve['id'];lo,hi=curve['interval']
    if curve['kind']=='RATIONAL':
        pole=-curve['denominator'][0]/curve['denominator'][1]
        if lo<pole<hi:return [{'side':'LEFT','xInterval':(lo,pole),'yInterval':None},{'side':'RIGHT','xInterval':(pole,hi),'yInterval':None}]
        if pole==lo:
            if curve.get('domainStates',('NONE','NONE'))[0]!='OPEN':raise ValueError('MULTI_CURVE_DOMAIN_INVALID:'+ident)
            return [{'side':'RIGHT','xInterval':(lo,hi),'yInterval':None}]
        if pole==hi:
            if curve.get('domainStates',('NONE','NONE'))[1]!='OPEN':raise ValueError('MULTI_CURVE_DOMAIN_INVALID:'+ident)
            return [{'side':'LEFT','xInterval':(lo,hi),'yInterval':None}]
    return [{'side':'FUNCTION','xInterval':(lo,hi),'yInterval':None}]

def _mc_bbox_points(curves,window=None):
    points=[]
    for curve in curves:
        kind=curve['kind']
        if kind in MULTI_CURVE_FREE_KINDS or curve.get('inverseOf') is not None:
            lo,hi=curve['interval']
            if kind=='Y_OF_X':
                c0,c1,c2=curve['coefficients']
                points.extend([(float(lo),float(c0+c1*lo+c2*lo*lo)),(float(hi),float(c0+c1*hi+c2*hi*hi))])
                vertex=-c1/(2*c2)
                if lo<vertex<hi:points.append((float(vertex),float(c0+c1*vertex+c2*vertex*vertex)))
            elif kind=='RATIONAL':
                pole=-curve['denominator'][0]/curve['denominator'][1]
                if len(curve['numerator'])==3:
                    for edge in (lo,hi):
                        if edge!=pole:points.append((float(edge),float(mc_rational_value(curve,edge))))   # no horizontal asymptote: the curve's own end points frame it
                    continue
                horizontal=curve['numerator'][1]/curve['denominator'][1]
                # A pole that is an open source-domain end has no finite point to contribute to the frame.
                if pole not in (lo,hi):points.append((float(min(max(pole,lo),hi)),float(abs(horizontal) if curve.get('abs') else horizontal)))
            else:
                for edge in (lo,hi):
                    value=mc_value(curve,edge)
                    if value is not None:points.append((float(edge),value))
            continue
        c0,c1,c2=curve['coefficients'];lo,hi=curve['interval']
        if curve['kind']=='Y_OF_X':
            fold=abs if curve.get('abs') else (lambda value:value)
            points.extend([(lo,fold(c0+c1*lo+c2*lo*lo)),(hi,fold(c0+c1*hi+c2*hi*hi))])
            vertex=-c1/(2*c2)
            if lo<vertex<hi:points.append((vertex,fold(c0+c1*vertex+c2*vertex*vertex)))
        else:
            points.extend([(c0+c1*lo+c2*lo*lo,lo),(c0+c1*hi+c2*hi*hi,hi)])
            vertex=-c1/(2*c2)
            if lo<vertex<hi:points.append((c0+c1*vertex+c2*vertex*vertex,vertex))
    result=[(float(x_value),float(y_value)) for x_value,y_value in points]
    if window is not None:
        x0,x1,y0,y1=(float(v) for v in window)
        result.extend([(x0,y0),(x1,y0),(x0,y1),(x1,y1)])
    return result

def _mc_text(value):
    return str(Fraction(value))

def _mc_row(curve):
    """The frozen row of a curve: exact texts of what the engine draws and the observer compares."""
    kind=curve['kind'];row={'id':curve['id'],'kind':kind}
    if kind in ('Y_OF_X','X_OF_Y') and curve.get('inverseOf') is None:
        row['coefficients']=[_pp_text(value) for value in curve['coefficients']];row['interval']=[_pp_text(value) for value in curve['interval']]
        if kind=='X_OF_Y':row['branch']=curve['branch']
    else:
        row['interval']=[_mc_text(value) for value in curve['interval']]
        if curve.get('domainStates',('NONE','NONE'))!=('NONE','NONE'):row['domainStates']=list(curve['domainStates'])
        if kind in ('LINE','Y_OF_X'):row['coefficients']=[_mc_text(value) for value in curve['coefficients']]
        elif kind=='RATIONAL':
            row['numerator']=[_mc_text(value) for value in curve['numerator']];row['denominator']=[_mc_text(value) for value in curve['denominator']]
            pole=-curve['denominator'][0]/curve['denominator'][1]
            horizontal=Fraction(0) if len(curve['numerator'])==3 else curve['numerator'][1]/curve['denominator'][1]   # an oblique rational has no horizontal asymptote (the author draws y=mx+b as an overlay line)
            if curve.get('abs'):horizontal=abs(horizontal)   # the asymptote of |f| is |h|
            lo,hi=curve['interval']
            row['asymptotes']={'vertical':{'x':_mc_text(pole),'drawn':bool(lo<=pole<=hi and pole!=0)},'horizontal':{'y':_mc_text(horizontal),'drawn':bool(horizontal!=0)}}
        else:
            row['radicand']=[_mc_text(value) for value in curve['radicand']];row['amplitude']=_mc_text(curve['amplitude']);row['offset']=_mc_text(curve['offset'])
            boundary=-curve['radicand'][0]/curve['radicand'][1];lo,hi=curve['interval']
            start=lo if curve['radicand'][1]>0 else hi
            row['start']={'x':_mc_text(boundary),'y':_mc_text(abs(curve['offset']) if curve.get('abs') else curve['offset']),'drawn':bool(start==boundary)}   # |f| starts at |offset|
    if curve.get('inverseOf') is not None:row['inverseOf']=curve['inverseOf']
    if curve.get('abs'):row['abs']=True
    for key,value in (curve.get('look') or {}).items():row[key]=value
    if curve.get('emphasis'):row['emphasis']=[{'from':_mc_text(value['from']),'to':_mc_text(value['to']),'color':value['color'],'fromState':value['fromState'],'toState':value['toState']} for value in curve['emphasis']]
    row['branches']=[]
    for branch in curve['branches']:
        entry={'side':branch['side'],'xInterval':[_pp_text(value) if not isinstance(value,Fraction) else _mc_text(value) for value in branch['xInterval']]}
        if branch['yInterval'] is not None:entry['yInterval']=[_pp_text(value) for value in branch['yInterval']]
        if branch.get('expression') is not None:entry['expression']=branch['expression']
        row['branches'].append(entry)
    return row

# ---- (G18c) shaded regions of a multi-curve figure: between two drawn curves, under a curve, or a half-plane / quadrant piece that runs to the frame ----
MULTI_CURVE_REGION_FIELDS={'id','between','under','from','to','halfPlane','and','fill','label'}
MULTI_CURVE_MAX_REGIONS=4
MULTI_CURVE_HALF_PLANE_OPS=('<','<=','>','>=')
MULTI_CURVE_REGION_SAMPLES=41

def _mc_boundary_y(curve,x_value):
    """y of a region boundary ('axis' or a drawn curve of the figure) at x as a float, None where the curve is not defined there."""
    if curve=='axis':return 0.0
    if curve['kind']=='Y_OF_X':
        c0,c1,c2=(float(value) for value in curve['coefficients']);x=float(x_value)
        value=c0+c1*x+c2*x*x
        return abs(value) if curve.get('abs') else value
    if curve['kind']=='X_OF_Y':return None
    return mc_value(curve,Fraction(x_value))

def _mc_region_boundary(curve,ident,region_id,start,end):
    """The boundary must be defined over the whole closed [start,end] inside its own draw interval (no pole of a rational, no start of a square root outside it)."""
    if curve=='axis':return
    if curve['kind']=='X_OF_Y':raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+region_id+':'+ident)
    lo,hi=curve['interval']
    if float(start)<float(lo)-1e-9 or float(end)>float(hi)+1e-9:raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+ident)
    if curve['kind']=='RATIONAL':
        pole=-curve['denominator'][0]/curve['denominator'][1]
        if start<=pole<=end:raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id+':'+ident)

def _mc_regions(plan,curves,viewport):
    """The frozen rows of graphPlan.regions (G18c): BETWEEN {upper,lower,from,to} (two curves, or a curve and 'axis'), or HALF_PLANE {box} (a quadrant piece cut by
    the frame: halfPlane {x|y:'<'|'<='|'>'|'>=',value} and optionally 'and' with the other axis). Everything is recomputed here exactly; the independent observer
    rebuilds it again from the plan."""
    raw=plan.get('regions')
    if raw is None:return []
    if not isinstance(raw,list) or not 1<=len(raw)<=MULTI_CURVE_MAX_REGIONS:raise ValueError('GRAPH_REGION_COUNT_INVALID')
    by_id={curve['id']:curve for curve in curves}
    rows=[];ids=set()
    for entry in raw:
        if not isinstance(entry,dict):raise ValueError('GRAPH_REGION_FIELD_INVALID')
        unknown=sorted(set(entry)-MULTI_CURVE_REGION_FIELDS)
        if unknown:raise ValueError('GRAPH_REGION_FIELD_UNKNOWN:'+str(unknown[0]))
        region_id=entry.get('id')
        if not isinstance(region_id,str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,31}',region_id):raise ValueError('GRAPH_REGION_ID_INVALID')
        if region_id in ids:raise ValueError('GRAPH_REGION_ID_DUPLICATE:'+region_id)
        ids.add(region_id)
        fill=entry.get('fill','LIGHT')
        if fill not in PIECEWISE_POLY_REGION_FILLS:raise ValueError('GRAPH_REGION_FILL_UNSUPPORTED:'+region_id)
        label=entry.get('label')
        if label is not None and (not isinstance(label,str) or not label.strip() or len(label)>40):raise ValueError('GRAPH_REGION_LABEL_INVALID:'+region_id)
        shapes=[key for key in ('between','under','halfPlane') if key in entry]
        if len(shapes)!=1:raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        row={'id':region_id,'fill':fill}
        if label is not None:row['label']=label
        if shapes[0]=='halfPlane':
            if 'from' in entry or 'to' in entry:raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
            sides=[entry['halfPlane']]
            if 'and' in entry:sides.append(entry['and'])
            x0,x1,y0,y1=(float(value) for value in viewport)
            seen=set()
            for side in sides:
                if not isinstance(side,dict) or len(side)!=2 or 'value' not in side:raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
                axis=[key for key in side if key in ('x','y')]
                if len(axis)!=1 or axis[0] in seen or side[axis[0]] not in MULTI_CURVE_HALF_PLANE_OPS:raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
                seen.add(axis[0])
                value=float(_mc_fraction(side['value'],'GRAPH_REGION_FIELD_INVALID:'+region_id))
                low,high=(x0,x1) if axis[0]=='x' else (y0,y1)
                if not low<value<high:raise ValueError('GRAPH_REGION_EMPTY:'+region_id)   # the boundary line must cross the frame, else the region is all or nothing
                less=side[axis[0]] in ('<','<=')
                if axis[0]=='x':x1,x0=(value,x0) if less else (x1,value)
                else:y1,y0=(value,y0) if less else (y1,value)
            row.update({'kind':'HALF_PLANE','box':[x0,x1,y0,y1]})
            rows.append(row);continue
        if shapes[0]=='under':
            names=[entry['under'],'axis']
            if not isinstance(entry['under'],str):raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        else:
            names=entry['between']
            if not isinstance(names,list) or len(names)!=2 or any(not isinstance(name,str) for name in names) or names[0]==names[1]:raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        if not {'from','to'}<=set(entry):raise ValueError('GRAPH_REGION_FIELD_INVALID:'+region_id)
        start=_mc_fraction(entry['from'],'GRAPH_REGION_DOMAIN_INVALID:'+region_id);end=_mc_fraction(entry['to'],'GRAPH_REGION_DOMAIN_INVALID:'+region_id)
        if not start<end:raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+region_id)
        boundaries=[]
        for name in names:
            curve='axis' if name=='axis' else by_id.get(name)
            if curve is None:raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+region_id+':'+name)
            _mc_region_boundary(curve,name,region_id,start,end)
            boundaries.append(curve)
        signs=set()
        for index in range(1,MULTI_CURVE_REGION_SAMPLES):
            x_value=start+(end-start)*Fraction(index,MULTI_CURVE_REGION_SAMPLES)
            a=_mc_boundary_y(boundaries[0],x_value);b=_mc_boundary_y(boundaries[1],x_value)
            if a is None or b is None:raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+region_id)
            if abs(a-b)>1e-9:signs.add(a>b)
        if not signs:raise ValueError('GRAPH_REGION_EMPTY:'+region_id)
        if len(signs)>1:raise ValueError('GRAPH_REGION_BOUNDARIES_CROSS:'+region_id)
        upper,lower=(names[0],names[1]) if signs=={True} else (names[1],names[0])
        row.update({'kind':'BETWEEN','upper':upper,'lower':lower,'from':_mc_text(start),'to':_mc_text(end)})
        rows.append(row)
    return rows

MULTI_CURVE_TALL_PLOT_HEIGHT=1000   # plot height (canvas 1064) reached only when the usual 640 would refuse the figure as too narrow

def fit_multi_curve(plan):
    curves=multi_curve_source(plan)
    window=_mc_window(plan) if any(curve['kind'] in MULTI_CURVE_FREE_KINDS or curve.get('inverseOf') is not None for curve in curves) else None
    points=_mc_bbox_points(curves,window)
    if window is not None:
        # The axes' facts (origin, (1,0), (0,1)) must lie strictly inside the frame: the engine widens the whole frame by 8% when one does not, and then the planned
        # frame and the drawn frame differ (the same fault as the rational overview above).
        points.extend([(0.0,0.0),(1.0,0.0),(0.0,1.0)])
    points.extend((float(x_value),float(y_value)) for x_value,y_value in plan.get('overlayAnchors',[]))
    xs=[point[0] for point in points];ys=[point[1] for point in points]
    xspan,yspan=max(xs)-min(xs),max(ys)-min(ys)
    if not math.isfinite(xspan) or not math.isfinite(yspan) or xspan<=0 or yspan<=0:raise ValueError('MULTI_CURVE_FRAME_DEGENERATE')
    limits=[plot_height_limit(plan)]
    # (TOO_NARROW) A tall, narrow figure at one scale: the usual plot (at most 640 high) leaves the curves under 48 px wide. Before refusing, the plot grows
    # up to MULTI_CURVE_TALL_PLOT_HEIGHT (a figure that still fits the 1099 px display height); the scale stays equal on both axes, only the canvas is taller.
    # A panel of a stack (plotHeightLimit set by the composite) keeps its own limit.
    if 'plotHeightLimit' not in plan:limits.append(MULTI_CURVE_TALL_PLOT_HEIGHT)
    for limit in limits:
        for ratio in axis_ratios(plan,points,limit):
            viewport,height,scale=equal_unit_frame(points,limit,ratio)
            if xspan*scale>=EQUAL_UNIT_MIN_CURVE_PX and yspan*scale*ratio>=EQUAL_UNIT_MIN_CURVE_PX:break
        else:continue
        break
    else:raise ValueError('MULTI_CURVE_TOO_NARROW')
    rows=[_mc_row(curve) for curve in curves]
    features={'schemaVersion':'MULTI_CURVE_FEATURES_v1','curves':rows}
    regions=_mc_regions(plan,curves,viewport)
    if regions:features['regions']=regions
    fitted={key:value for key,value in plan.items() if key not in ('domain','viewport')}
    # A curve's label may have been written in TeX; the plan that travels on carries the ASCII form the label machinery typesets.
    labelled=[]
    for entry,curve in zip(plan['curves'],curves):
        if 'label' in curve['look'] and entry.get('label')!=curve['look']['label']:entry={**entry,'label':curve['look']['label']}
        # the draw interval of a curve the author left to the window (or an inverse's image) is written down, so the observer reads the same interval the engine draws
        if 'domain' not in entry:entry={**entry,'domain':[_mc_text(value) for value in curve['interval']]}
        elif isinstance(entry['domain'],dict):
            domain=entry['domain'];states=[domain.get('fromState','NONE'),domain.get('toState','NONE')]
            entry={**entry,'domain':[domain['from'],domain['to']]}
            if states!=['NONE','NONE']:entry['domainStates']=states
        labelled.append(entry)
    fitted['curves']=labelled
    fitted.update({'domain':[viewport[0],viewport[1]],'viewport':viewport,'shapeIntent':'OVERVIEW','overviewPolicy':MULTI_CURVE_OVERVIEW_POLICY,
                   'equalUnits':True,'axisRatio':ratio,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height},'multiCurveFeatures':features})
    return {'graphPlan':fitted,'policy':MULTI_CURVE_OVERVIEW_POLICY,'sourceDomainPreserved':True,'displayOnly':True,'features':features,'originalDisplay':{'domain':plan.get('domain'),'viewport':plan.get('viewport')}}

OVERLAY_CIRCLE_MIN_RADIUS_PX=24
def _equalize_exp_log_for_circles(plan,framed,anchors):
    """A circle on an exponential or logarithmic graph (G6b): the family window is widened to one scale on both axes (the window only grows, so the
    drawn interval and every curve value stay inside) and the circle is refused only when that single scale leaves it unreadable."""
    raw=plan.get('overlays')
    if plan.get('family') not in ('exponential-affine','logarithmic-affine') or not isinstance(raw,dict) or not raw.get('circles'):return framed
    graph=framed['graphPlan'];window=graph['viewport']
    viewport,height,scale=equal_unit_frame([(window[0],window[2]),(window[1],window[3])]+[(x,y) for x,y in anchors],plot_height_limit(graph))
    rows,_=_overlay_circle_rows(raw)
    for row in rows:
        if row['r']*scale<OVERLAY_CIRCLE_MIN_RADIUS_PX:_overlay_fail('OVERLAY_CIRCLE_TOO_SMALL_AT_EQUAL_UNITS',row['id'])
    if (graph['domain'][1]-graph['domain'][0])*scale<EQUAL_UNIT_MIN_CURVE_PX:_overlay_fail('OVERLAY_EQUAL_UNITS_CURVE_TOO_NARROW',plan.get('family'))
    return {**framed,'graphPlan':{**graph,'viewport':viewport,'equalUnits':True,'axisRatio':1,'plotCanvas':{'width':QUADRATIC_PLOT_WIDTH,'height':height}}}

def _overlay_line_frame_anchor(plan,ident):
    """(CL) One point on the declared overlay line `ident`, inside the span of the plan's own required points, so the framer's window reaches the line."""
    entry=next((row for row in (plan.get('overlays') or {}).get('lines') or [] if isinstance(row,dict) and row.get('id')==ident),None)
    if entry is None:return None
    try:
        xs=[float(row['x']) for row in plan.get('requiredPoints') or [] if isinstance(row,dict) and isinstance(row.get('x'),(int,float))]
        ys=[float(row['y']) for row in plan.get('requiredPoints') or [] if isinstance(row,dict) and isinstance(row.get('y'),(int,float))]
        if 'x' in entry:
            x=float(S.N(_overlay_exact(entry['x'],ident),30));return (x,sum(ys)/len(ys) if ys else 0.0)
        slope=float(S.N(_overlay_exact(entry['slope'],ident),30));intercept=float(S.N(_overlay_exact(entry['intercept'],ident),30))
        x=sum(xs)/len(xs) if xs else 0.0
        return (x,slope*x+intercept)
    except (ValueError,KeyError,TypeError,ZeroDivisionError):return None

def fit_overview(plan):
    """The family framer with the declared overlays. A line that the automatically framed window misses (the points that framed it were hidden or not asked for)
    widens the window once to reach that line (CL); an author-stated viewport is never widened. A plan whose lines the first window already reaches is framed as before."""
    try:return _fit_overview_framed(plan,[])
    except ValueError as error:
        found=re.match(r'^OVERLAY_LINE_OUTSIDE_VIEWPORT:(.+)$',str(error))
        if not found or plan.get('viewport') is not None:raise
        extra=_overlay_line_frame_anchor(plan,found.group(1))
        if extra is None:raise
        return _fit_overview_framed(plan,[extra])

def _fit_overview_framed(plan,extra_anchors):
    """The family framer, then the optional graph overlays: every overlay coordinate is recomputed exactly and must stay inside the
    framed viewport. The fitted plan carries overlaysFeatures for the model/spec; the independent observer recomputes them from the raw
    overlays field. Unsupported or out-of-view overlays are refused, never silently dropped."""
    anchors=_overlay_anchor_points(plan)+extra_anchors
    framed=_fit_overview_family({**plan,'overlayAnchors':anchors} if anchors else plan)
    framed['graphPlan'].pop('overlayAnchors',None)
    framed=_equalize_exp_log_for_circles(plan,framed,anchors)
    features=_overlay_features(framed['graphPlan'])
    if features is None:return framed
    framed['graphPlan']={**framed['graphPlan'],'overlaysFeatures':features}
    return framed
