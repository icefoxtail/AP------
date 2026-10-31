"""Small closed SymPy Geometry spike, not a general constraint solver."""
import math
import re
from decimal import Decimal
from graphlib import TopologicalSorter, CycleError
import sympy as S
import mpmath
if S.__version__!='1.14.0' or mpmath.__version__!='1.3.0': raise ValueError('PYTHON_DEPENDENCY_VERSION_MISMATCH')

PLANE_RECIPE='PLANE_FIGURE_v1'
POLAR_DIGITS=30

SIGNATURES = {
    'SOURCE_POINT': ([], 'POINT'), 'NORMALIZATION_ORIGIN': ([], 'POINT'),
    'NORMALIZATION_AXIS': ([], 'POINT'), 'MIDPOINT': (['POINT','POINT'],'POINT'),
    'LINE_THROUGH': (['POINT','POINT'],'LINE'), 'SOURCE_LINE': ([],'LINE'),
    'PARALLEL_THROUGH': (['POINT','LINE'],'LINE'),
    'ANGLE_BISECTOR': (['POINT','POINT','POINT'],'LINE'),
    'PERPENDICULAR_FOOT': (['POINT','LINE'],'POINT'),
    'DIVISION_POINT': (['POINT','POINT'],'POINT'), 'CENTROID': (['POINT','POINT','POINT'],'POINT'),
    'POINT_REFLECTION': (['POINT','POINT'],'POINT'), 'LINE_REFLECTION': (['POINT','LINE'],'POINT'),
    'PERPENDICULAR_THROUGH': (['POINT','LINE'],'LINE'),
    'TRANSLATE_POINT': (['POINT'],'POINT'), 'TRANSLATE_LINE': (['LINE'],'LINE'),
    'POLAR_POINT': (['POINT','POINT'],'POINT'),
    'VECTOR_SUM_POINT': (['POINT','POINT','POINT'],'POINT'), 'VECTOR_SCALE_POINT': (['POINT','POINT'],'POINT'),
    'CIRCLE_CENTER_RADIUS': (['POINT'],'CIRCLE'),
    'CIRCLE_THROUGH_3': (['POINT','POINT','POINT'],'CIRCLE'),
    'CIRCLE_THROUGH_POINT': (['POINT','POINT'],'CIRCLE'),
    'TANGENT_AT_POINT': (['CIRCLE','POINT'],'LINE'),
    'INTERSECTION': (None,'POINT_SET'), 'SELECT_POINT': (['POINT_SET'],'POINT'),
    'LINE_INTERSECTION': (['LINE','LINE'],'POINT'),
    'SEGMENT_LENGTH': (['POINT','POINT'],'SCALAR'), 'SCALAR_SQUARE': (['SCALAR'],'SCALAR'), 'SCALAR_RATIO': (['SCALAR','SCALAR'],'SCALAR'),
}

def scalar(value, depth=0):
    if depth > 24 or not isinstance(value,dict): raise ValueError('INVALID_EXACT_SCALAR')
    kind = value.get('kind')
    def integer(text):
        if not isinstance(text,str) or len(text)>256 or not re.fullmatch(r'0|-?[1-9][0-9]*',text): raise ValueError('INVALID_EXACT_INTEGER')
        return S.Integer(text)
    if kind=='integer' and set(value)=={'kind','value'}: return integer(value['value'])
    if kind=='rational' and set(value)=={'kind','numerator','denominator'}:
        n,d=integer(value['numerator']),integer(value['denominator'])
        if d<=0: raise ValueError('INVALID_DENOMINATOR')
        return S.Rational(n,d)
    if kind=='constant' and set(value)=={'kind','name'} and value['name'] in ('pi','e'): return S.pi if value['name']=='pi' else S.E
    arities={'add':2,'sub':2,'mul':2,'div':2,'pow':2,'sqrt':1,'neg':1}
    if kind!='expression' or set(value)!={'kind','op','args'} or value['op'] not in arities or len(value['args'])!=arities[value['op']]: raise ValueError('INVALID_SCALAR_AST')
    a=[scalar(v,depth+1) for v in value['args']];op=value['op']
    if op=='add': return a[0]+a[1]
    if op=='sub': return a[0]-a[1]
    if op=='mul': return a[0]*a[1]
    if op=='div':
        if a[1]==0: raise ValueError('SCALAR_DIVISION_ZERO')
        return a[0]/a[1]
    if op=='pow':
        if not a[1].is_Integer or abs(a[1])>16: raise ValueError('POWER_LIMIT')
        return a[0]**a[1]
    if op=='sqrt':
        if a[0].is_nonnegative is not True: raise ValueError('NONREAL_SCALAR')
        return S.sqrt(a[0])
    return -a[0]

def exact(value):
    if value.is_Integer: return {'kind':'integer','value':str(value)}
    if value.is_Rational: return {'kind':'rational','numerator':str(value.p),'denominator':str(value.q)}
    if value==S.pi or value==S.E: return {'kind':'constant','name':'pi' if value==S.pi else 'e'}
    if value.is_Pow: return {'kind':'expression','op':'pow','args':[exact(v) for v in value.args]} if value.args[1]!=S.Rational(1,2) else {'kind':'expression','op':'sqrt','args':[exact(value.args[0])]}
    if value.is_Add or value.is_Mul:
        op='add' if value.is_Add else 'mul';args=list(value.args);result=exact(args[0])
        for v in args[1:]: result={'kind':'expression','op':op,'args':[result,exact(v)]}
        return result
    raise ValueError('UNSUPPORTED_EXACT_OUTPUT')

DECIMAL_ZERO_BELOW=S.Float('1e-30',34)

def plain_decimal(value,digits=34):
    """A decimal string of value to `digits` significant digits in plain positional form (no exponent). SymPy prints an expression that is exactly zero
    but not simplified as 0.e-149 (a mantissa-less float), which no number grammar accepts; a result that small is the number 0."""
    number=S.N(value,digits)
    if number==0 or abs(number)<DECIMAL_ZERO_BELOW:return '0'
    return format(Decimal(str(number)),'f')

def exact_or_decimal(value):
    """The exact typed scalar, or - for a value without a short closed form (a point placed by a non-special angle) - a 34 digit decimal."""
    def small(node):
        if node['kind']=='integer':return abs(int(node['value']))<=1000000
        if node['kind']=='rational':return abs(int(node['numerator']))<=1000000000 and int(node['denominator'])<=1000000000
        return all(small(child) for child in node.get('args',[]))
    try:
        result=exact(value)
        if len(str(result))<=480 and small(result):return result
    except (ValueError,RecursionError):pass
    return {'kind':'decimal','value':plain_decimal(value)}

def _rational_from_mp(x):
    from fractions import Fraction
    fraction=Fraction(mpmath.nstr(x,POLAR_DIGITS-8,min_fixed=-80,max_fixed=80))
    return S.Rational(fraction.numerator,fraction.denominator)

def trig_pair(angle_degrees):
    """cos and sin of an angle in degrees: sympy radicals when they exist (multiples of 15), otherwise 22 digit rationals computed by mpmath."""
    theta=S.pi*angle_degrees/180
    c,s=S.cos(theta),S.sin(theta)
    if not c.has(S.cos,S.sin) and not s.has(S.cos,S.sin):return c,s
    mpmath.mp.dps=2*POLAR_DIGITS
    radians=mpmath.mpf(str(S.N(theta,2*POLAR_DIGITS)))
    return _rational_from_mp(mpmath.cos(radians)),_rational_from_mp(mpmath.sin(radians))

def polar_point(center,reference,length,angle_degrees,turn):
    """The point at distance length from center, on the ray that is the direction center->reference turned by angle_degrees (CCW or CW)."""
    vx,vy=reference.x-center.x,reference.y-center.y
    norm=S.sqrt(vx**2+vy**2)
    c,s=trig_pair(angle_degrees)
    s=s if turn=='CCW' else -s
    ux,uy=vx/norm,vy/norm
    return S.Point(center.x+length*(ux*c-uy*s),center.y+length*(ux*s+uy*c))

def dependencies(node):
    refs=list(node['inputs'])
    if node['op']=='SELECT_POINT': refs.extend(node['branch']['refs'])
    # Phase 1 supports literal scalar args only, rather than ignoring hidden refs.
    def reject_ref(v):
        if isinstance(v,dict):
            if 'ref' in v: raise ValueError('UNSUPPORTED_SCALAR_REF')
            for child in v.values(): reject_ref(child)
        elif isinstance(v,list):
            for child in v: reject_ref(child)
    reject_ref(node.get('args',{}))
    return sorted(set(refs))

def validate(graph):
    if graph.get('schemaVersion')!='construction-spike-v1' or set(graph)-{'schemaVersion','nodes','realization','conditionAudits'}: raise ValueError('UNSUPPORTED_GRAPH_SCHEMA')
    if not isinstance(graph['nodes'],list) or not 1<=len(graph['nodes'])<=64: raise ValueError('NODE_BUDGET')
    nodes={}
    for node in graph['nodes']:
        if set(node)-{'id','op','inputs','args','outputType','factRole','branch'} or not re.fullmatch(r'[A-Za-z][A-Za-z0-9]{0,31}',node['id']): raise ValueError('INVALID_NODE')
        if node['id'] in nodes: raise ValueError('DUPLICATE_NODE')
        if node['op'] not in SIGNATURES: raise ValueError('UNSUPPORTED_OPERATION')
        if node['factRole'] not in ('GIVEN','DERIVED_INTERMEDIATE','CONCLUSION'): raise ValueError('INVALID_FACT_ROLE')
        if not isinstance(node['inputs'],list) or not isinstance(node['args'],dict): raise ValueError('INVALID_NODE_ARGS')
        if node['outputType']!=SIGNATURES[node['op']][1]: raise ValueError('OUTPUT_TYPE_MISMATCH')
        if node['op']=='SELECT_POINT':
            b=node.get('branch',{})
            if set(b)!={'kind','refs','sign'} or b['kind']!='SIDE_OF_ORIENTED_LINE' or len(b['refs'])!=2 or b['sign'] not in (-1,1): raise ValueError('INVALID_BRANCH')
        elif 'branch' in node: raise ValueError('UNEXPECTED_BRANCH')
        expected={'SOURCE_POINT':{'coordinates'},'NORMALIZATION_ORIGIN':set(),'NORMALIZATION_AXIS':{'length'},'CIRCLE_CENTER_RADIUS':{'radius'},'ANGLE_BISECTOR':{'mode'},'SOURCE_LINE':{'a','b','c'},'DIVISION_POINT':{'m','n','mode'},'TRANSLATE_POINT':{'dx','dy'},'TRANSLATE_LINE':{'dx','dy'},'POLAR_POINT':{'length','angleDeg','turn'},'VECTOR_SCALE_POINT':{'k'}}.get(node['op'],set())
        if set(node['args'])!=expected: raise ValueError('UNSUPPORTED_NODE_ARGS')
        if node['op']=='POLAR_POINT' and node['args']['turn'] not in ('CCW','CW'):raise ValueError('INVALID_POLAR_TURN')
        if node['op']=='DIVISION_POINT' and node['args']['mode'] not in ('INTERNAL','EXTERNAL'):raise ValueError('INVALID_DIVISION_MODE')
        if node['op']=='ANGLE_BISECTOR' and node['args']['mode'] not in ('INTERNAL','EXTERNAL'):raise ValueError('INVALID_ANGLE_BISECTOR_MODE')
        nodes[node['id']]=node
    deps={key:dependencies(n) for key,n in nodes.items()}
    for key,n in nodes.items():
        if any(r not in nodes for r in deps[key]): raise ValueError('UNKNOWN_REFERENCE')
        types=[nodes[r]['outputType'] for r in n['inputs']]
        expected=SIGNATURES[n['op']][0]
        if expected is not None and types!=expected: raise ValueError('INPUT_TYPE_MISMATCH')
        if n['op']=='INTERSECTION' and types not in (['LINE','CIRCLE'],['CIRCLE','CIRCLE'],['LINE','LINE']): raise ValueError('UNSUPPORTED_INTERSECTION_TYPES')
        if n['op']=='SELECT_POINT' and any(nodes[r]['outputType']!='POINT' for r in n['branch']['refs']): raise ValueError('BRANCH_REFERENCE_TYPE')
        if n['op']=='SELECT_POINT' and nodes[n['inputs'][0]]['op']=='INTERSECTION' and [nodes[r]['outputType'] for r in nodes[n['inputs'][0]]['inputs']]==['LINE','LINE']:raise ValueError('UNIQUE_INTERSECTION_HAS_NO_BRANCH')
    conditions=graph.get('conditionAudits',[])
    if not isinstance(conditions,list) or len(conditions)>128:raise ValueError('CONDITION_AUDIT_BUDGET')
    condition_types={'INCIDENCE_POINT_ON_LINE':['POINT','LINE'],'DISTANCE_EQUALS':['POINT','POINT'],'EQUAL_DISTANCE':['POINT','POINT','POINT','POINT'],'MIDPOINT_RATIO':['POINT','POINT','POINT'],'PERPENDICULAR':['LINE','LINE'],'PARALLEL':['LINE','LINE'],'CIRCLE_MEMBERSHIP':['CIRCLE','POINT'],'TANGENCY_AT_POINT':['CIRCLE','POINT','LINE'],'ORIENTED_SIDE':['POINT','POINT','POINT']}
    seen_condition_ids=set()
    for condition in conditions:
        kind=condition.get('kind') if isinstance(condition,dict) else None
        expected_keys={'id','kind','refs','sourceConditionId'}|({'expected'} if kind in {'DISTANCE_EQUALS','MIDPOINT_RATIO'} else {'sign'} if kind=='ORIENTED_SIDE' else set())
        if not isinstance(condition,dict) or set(condition)!=expected_keys or kind not in condition_types or not isinstance(condition.get('id'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,63}',condition['id']) or condition['id'] in seen_condition_ids or not isinstance(condition.get('sourceConditionId'),str) or not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]{0,63}',condition['sourceConditionId']) or not isinstance(condition.get('refs'),list) or len(condition['refs'])!=len(condition_types[kind]):
            raise ValueError('INVALID_CONDITION_AUDIT')
        seen_condition_ids.add(condition['id'])
        if any(reference not in nodes for reference in condition['refs']):raise ValueError('UNKNOWN_CONDITION_REFERENCE')
        if [nodes[reference]['outputType'] for reference in condition['refs']]!=condition_types[kind]:raise ValueError('CONDITION_AUDIT_TYPE_MISMATCH')
        if kind in {'DISTANCE_EQUALS','MIDPOINT_RATIO'}:condition['_expectedValue']=scalar(condition['expected'])
        if kind=='ORIENTED_SIDE' and (isinstance(condition.get('sign'),bool) or condition.get('sign') not in (-1,1)):raise ValueError('INVALID_ORIENTED_SIDE_SIGN')
        if any(nodes[reference]['op']=='SELECT_POINT' for reference in condition['refs']) and kind not in {'INCIDENCE_POINT_ON_LINE','CIRCLE_MEMBERSHIP','TANGENCY_AT_POINT','ORIENTED_SIDE','EQUAL_DISTANCE','MIDPOINT_RATIO','DISTANCE_EQUALS'}:raise ValueError('UNSUPPORTED_SELECTED_CONDITION_REFERENCE')
    try:
        sorter=TopologicalSorter(deps);sorter.prepare();order=[]
        while sorter.is_active():
            ready=sorted(sorter.get_ready());order.extend(ready);sorter.done(*ready)
    except CycleError: raise ValueError('CONSTRUCTION_CYCLE') from None
    recipe_plane=graph.get('realization',{})
    if recipe_plane.get('recipeId')==PLANE_RECIPE:
        # Axis-free plane figure: every point has exact (or high-precision) internal coordinates, no frame helpers, no axes drawn.
        if recipe_plane.get('unit')!='source-length' or recipe_plane.get('reflectionEquivalent') is not False or set(recipe_plane)-{'recipeId','unit','reflectionEquivalent'}:raise ValueError('REALIZATION_RECIPE_REQUIRED')
        if any(n['op'].startswith('NORMALIZATION_') for n in nodes.values()):raise ValueError('PLANE_FIGURE_HAS_FRAME_HELPERS')
        if not any(n['op']=='SOURCE_POINT' for n in nodes.values()):raise ValueError('PLANE_FIGURE_SOURCE_POINT_REQUIRED')
    elif any(n['op'].startswith('NORMALIZATION_') for n in nodes.values()):
        recipe=graph.get('realization',{})
        source_axes=recipe.get('recipeId')=='SOURCE_COORDINATE_AXES_v1' and recipe.get('unit')=='source-coordinate' and recipe.get('reflectionEquivalent') is False
        if source_axes:
            if not any(n['op'] in ('SOURCE_POINT','SOURCE_LINE') for n in nodes.values()):raise ValueError('SOURCE_COORDINATE_POINTS_REQUIRED')
            origins=[n for n in nodes.values() if n['op']=='NORMALIZATION_ORIGIN']
            axes=[n for n in nodes.values() if n['op']=='NORMALIZATION_AXIS']
            if len(origins)!=1 or len(axes)!=1:raise ValueError('SOURCE_COORDINATE_FRAME_REFERENCES_REQUIRED')
            if scalar(axes[0]['args']['length'])!=1:raise ValueError('SOURCE_COORDINATE_UNIT_AXIS_REQUIRED')
        elif recipe.get('recipeId')!='SSS_POSITIVE_SIDE_v1' or recipe.get('unit')!='source-length' or recipe.get('reflectionEquivalent') is not True: raise ValueError('REALIZATION_RECIPE_REQUIRED')
    return nodes,deps,order

def execute(graph):
    nodes,deps,order=validate(graph);objects={};transcript=[]
    for key in order:
        n=nodes[key];op=n['op'];a=[objects[r] for r in n['inputs']];args=n['args']
        if op=='SOURCE_POINT':
            if len(args['coordinates'])!=2: raise ValueError('POINT_ARITY')
            value=S.Point(*[scalar(v) for v in args['coordinates']])
        elif op=='NORMALIZATION_ORIGIN': value=S.Point(0,0)
        elif op=='NORMALIZATION_AXIS':
            length=scalar(args['length'])
            if length.is_positive is not True: raise ValueError('INVALID_SOURCE_LENGTH')
            value=S.Point(length,0)
        elif op=='POLAR_POINT':
            length,angle=scalar(args['length']),scalar(args['angleDeg'])
            if length.is_positive is not True:raise ValueError('INVALID_POLAR_LENGTH')
            if angle.is_positive is not True or not (angle<360):raise ValueError('INVALID_POLAR_ANGLE')
            if a[0]==a[1]:raise ValueError('DEGENERATE_POLAR_REFERENCE')
            value=polar_point(a[0],a[1],length,angle,args['turn'])
        elif op=='MIDPOINT': value=a[0].midpoint(a[1])
        elif op=='SOURCE_LINE':
            # A line given only by its equation ax+by+c=0 (exact coefficients): two exact points on it, then the same Line as LINE_THROUGH.
            ca,cb,cc=scalar(args['a']),scalar(args['b']),scalar(args['c'])
            if ca==0 and cb==0: raise ValueError('DEGENERATE_LINE')
            if cb!=0: value=S.Line(S.Point(0,-cc/cb),S.Point(1,(-cc-ca)/cb))
            else: value=S.Line(S.Point(-cc/ca,0),S.Point(-cc/ca,1))
        elif op=='LINE_THROUGH':
            if a[0]==a[1]: raise ValueError('DEGENERATE_LINE')
            value=S.Line(*a)
        elif op=='PARALLEL_THROUGH':
            point,line=a
            direction=line.direction
            value=S.Line(point,S.Point(point.x+direction.x,point.y+direction.y))
        elif op=='ANGLE_BISECTOR':
            first,vertex,last=a;u=S.Matrix([first.x-vertex.x,first.y-vertex.y]);v=S.Matrix([last.x-vertex.x,last.y-vertex.y])
            nu=S.sqrt(u.dot(u));nv=S.sqrt(v.dot(v))
            if nu==0 or nv==0:raise ValueError('DEGENERATE_ANGLE_RAY')
            direction=u/nu+(v/nv if args['mode']=='INTERNAL' else -v/nv)
            if direction[0]==0 and direction[1]==0:raise ValueError('DEGENERATE_ANGLE_BISECTOR')
            value=S.Line(vertex,S.Point(vertex.x+direction[0],vertex.y+direction[1]))
        elif op=='PERPENDICULAR_FOOT': value=a[1].projection(a[0])
        elif op=='DIVISION_POINT':
            # Point dividing A->B in the ratio AP:PB = m:n. INTERNAL P=(nA+mB)/(m+n); EXTERNAL P=(mB-nA)/(m-n), outside segment AB.
            first,second=a;m,k=scalar(args['m']),scalar(args['n'])
            if first==second:raise ValueError('DEGENERATE_DIVISION_SEGMENT')
            if m.is_positive is not True or k.is_positive is not True:raise ValueError('INVALID_DIVISION_RATIO')
            if args['mode']=='INTERNAL':value=S.Point((k*first.x+m*second.x)/(m+k),(k*first.y+m*second.y)/(m+k))
            else:
                if m==k:raise ValueError('EXTERNAL_DIVISION_EQUAL_RATIO')
                value=S.Point((m*second.x-k*first.x)/(m-k),(m*second.y-k*first.y)/(m-k))
        elif op=='VECTOR_SUM_POINT':
            # (G3) the sum of the vectors base->first and base->second, from the same start: the fourth corner of their parallelogram, first+second-base.
            base,first,second=a
            if (first.x-base.x)*(second.y-base.y)-(first.y-base.y)*(second.x-base.x)==0:raise ValueError('VECTOR_SUM_DEGENERATE')
            value=S.Point(first.x+second.x-base.x,first.y+second.y-base.y)
        elif op=='VECTOR_SCALE_POINT':
            # (G3) the end of the vector first->second scaled by the rational k from its start: first+k(second-first). k=0 and k=1 scale nothing.
            first,second=a;k=scalar(args['k'])
            if first==second or not k.is_rational or k==0 or k==1:raise ValueError('VECTOR_SCALE_INVALID')
            value=S.Point(first.x+k*(second.x-first.x),first.y+k*(second.y-first.y))
        elif op=='CENTROID':
            if S.Point.is_collinear(*a):raise ValueError('DEGENERATE_TRIANGLE')
            value=S.Point(sum(p.x for p in a)/3,sum(p.y for p in a)/3)
        elif op=='POINT_REFLECTION':
            point,center=a
            if point==center:raise ValueError('REFLECTION_POINT_AT_CENTER')
            value=S.Point(2*center.x-point.x,2*center.y-point.y)
        elif op=='LINE_REFLECTION':
            point,line=a
            if line.contains(point):raise ValueError('REFLECTION_POINT_ON_LINE')
            foot=line.projection(point);value=S.Point(2*foot.x-point.x,2*foot.y-point.y)
        elif op=='PERPENDICULAR_THROUGH':
            point,line=a;direction=line.direction
            value=S.Line(point,S.Point(point.x-direction.y,point.y+direction.x))
        elif op in ('TRANSLATE_POINT','TRANSLATE_LINE'):
            dx,dy=scalar(args['dx']),scalar(args['dy'])
            if dx==0 and dy==0:raise ValueError('ZERO_TRANSLATION')
            if op=='TRANSLATE_POINT':value=S.Point(a[0].x+dx,a[0].y+dy)
            else:
                through=a[0].p1;direction=a[0].direction
                value=S.Line(S.Point(through.x+dx,through.y+dy),S.Point(through.x+dx+direction.x,through.y+dy+direction.y))
        elif op=='SEGMENT_LENGTH': value=a[0].distance(a[1])
        elif op=='SCALAR_SQUARE': value=a[0]**2
        elif op=='SCALAR_RATIO':
            if a[1]==0:raise ValueError('SCALAR_RATIO_DIVISION_ZERO')
            value=a[0]/a[1]
        elif op=='CIRCLE_CENTER_RADIUS':
            radius=scalar(args['radius'])
            if radius.is_positive is not True: raise ValueError('INVALID_RADIUS')
            value=S.Circle(a[0],radius)
        elif op=='CIRCLE_THROUGH_3':
            if S.Line(a[0],a[1]).contains(a[2]):raise ValueError('COLLINEAR_CIRCLE_POINTS')
            value=S.Circle(*a)
        elif op=='CIRCLE_THROUGH_POINT':
            if a[0]==a[1]:raise ValueError('DEGENERATE_CIRCLE_RADIUS')
            value=S.Circle(a[0],a[0].distance(a[1]))
        elif op=='TANGENT_AT_POINT':
            circle,contact=a
            if not isinstance(circle,S.Circle):raise ValueError('CIRCLE_TANGENT_REQUIRES_CIRCLE')
            if circle.center.distance(contact)!=circle.radius:raise ValueError('TANGENT_POINT_NOT_ON_CIRCLE')
            radial=S.Matrix([contact.x-circle.center.x,contact.y-circle.center.y]);direction=S.Matrix([-radial[1],radial[0]])
            if direction[0]==0 and direction[1]==0:raise ValueError('DEGENERATE_CIRCLE_TANGENT')
            value=S.Line(contact,S.Point(contact.x+direction[0],contact.y+direction[1]))
        elif op=='LINE_INTERSECTION':
            hits=a[0].intersection(a[1])
            if len(hits)!=1 or not isinstance(hits[0],S.Point2D):raise ValueError('UNIQUE_LINE_INTERSECTION_REQUIRED')
            value=hits[0]
        elif op=='INTERSECTION':
            value=a[0].intersection(a[1])
            if any(not isinstance(p,S.Point2D) for p in value): raise ValueError('COINCIDENT_INTERSECTION')
        elif op=='SELECT_POINT':
            p,q=[objects[r] for r in n['branch']['refs']];sign=n['branch']['sign']
            matches=[]
            for v in a[0]:
                cross=(q.x-p.x)*(v.y-p.y)-(q.y-p.y)*(v.x-p.x)
                if cross.is_real is not True: raise ValueError('UNDECIDABLE_BRANCH')
                if cross*sign>0: matches.append(v)
            if len(matches)!=1: raise ValueError('AMBIGUOUS_BRANCH')
            value=matches[0]
        objects[key]=value
        transcript.append({'nodeId':key,'op':op,'dependencies':deps[key]})
    points={};scalars={};lines={};circles={};point_sets={}
    for key,value in objects.items():
        if isinstance(value,S.Point2D):
            numeric=[float(v.evalf(17)) for v in value]
            if not all(math.isfinite(v) for v in numeric): raise ValueError('NONFINITE_POINT')
            points[key]={'exact':[exact_or_decimal(v) for v in value],'approximation':numeric,'precisionDigits':17}
        elif nodes[key]['outputType']=='SCALAR':scalars[key]={'exact':exact_or_decimal(value),'approximation':float(value.evalf(17))}
        elif nodes[key]['outputType']=='LINE':
            coefficients=list(value.coefficients)
            numeric=[float(term.evalf(17)) for term in coefficients]
            if not all(math.isfinite(v) for v in numeric):raise ValueError('NONFINITE_LINE')
            lines[key]={'exact':[exact_or_decimal(term) for term in coefficients],'approximation':numeric}
        elif nodes[key]['outputType']=='CIRCLE':
            center=value.center;radius=value.radius;numeric=[float(center.x.evalf(17)),float(center.y.evalf(17)),float(radius.evalf(17))]
            if not all(math.isfinite(v) for v in numeric):raise ValueError('NONFINITE_CIRCLE')
            circles[key]={'centerExact':[exact_or_decimal(center.x),exact_or_decimal(center.y)],'radiusExact':exact_or_decimal(radius),'approximation':numeric}
        elif nodes[key]['outputType']=='POINT_SET':
            if not isinstance(value,(list,tuple)):raise ValueError('INVALID_POINT_SET')
            rows=[]
            for point_value in value:
                if not isinstance(point_value,S.Point2D):raise ValueError('INVALID_POINT_SET_MEMBER')
                numeric=[float(v.evalf(17)) for v in point_value]
                if not all(math.isfinite(v) for v in numeric):raise ValueError('NONFINITE_POINT_SET')
                rows.append({'exact':[exact_or_decimal(v) for v in point_value],'approximation':numeric})
            point_sets[key]=rows
        else:raise ValueError('UNEMITTED_NODE_OUTPUT:'+key)
    condition_rows=[]
    for condition in graph.get('conditionAudits',[]):
        refs=[objects[reference] for reference in condition['refs']];kind=condition['kind'];observed=None;expected=None;valid=False
        if kind=='INCIDENCE_POINT_ON_LINE':
            observed=refs[1].distance(refs[0]);valid=observed==0
        elif kind=='DISTANCE_EQUALS':
            observed=refs[0].distance(refs[1]);expected=condition['_expectedValue'];valid=observed==expected
        elif kind=='EQUAL_DISTANCE':
            first=refs[0].distance(refs[1]);second=refs[2].distance(refs[3]);observed=first-second;valid=observed==0
        elif kind=='MIDPOINT_RATIO':
            start,middle,end=refs;expected=condition['_expectedValue'];distance_start= start.distance(middle);distance_end=middle.distance(end)
            aligned=S.Line(start,end).contains(middle);between=S.Matrix([middle.x-start.x,middle.y-start.y]).dot(S.Matrix([middle.x-end.x,middle.y-end.y]))<=0
            if distance_end==0:raise ValueError('MIDPOINT_RATIO_ZERO_DENOMINATOR')
            observed=distance_start/distance_end;valid=aligned and between and observed==expected
        elif kind in {'PERPENDICULAR','PARALLEL'}:
            observed=refs[0].is_perpendicular(refs[1]) if kind=='PERPENDICULAR' else refs[0].is_parallel(refs[1]);valid=observed is True
        elif kind=='CIRCLE_MEMBERSHIP':
            observed=refs[0].center.distance(refs[1])-refs[0].radius;valid=observed==0
        elif kind=='TANGENCY_AT_POINT':
            circle,contact,line=refs;radial=S.Line(circle.center,contact);observed=circle.center.distance(contact)-circle.radius
            valid=observed==0 and line.contains(contact) and line.is_perpendicular(radial)
        elif kind=='ORIENTED_SIDE':
            start,end,target=refs;cross=(end.x-start.x)*(target.y-start.y)-(end.y-start.y)*(target.x-start.x);observed=cross;valid=cross*condition['sign']>0
        if not valid:raise ValueError('CONDITION_AUDIT_FAIL:'+condition['id']+':'+kind)
        checks={'INCIDENCE_POINT_ON_LINE':['POINT_ON_LINE'],'DISTANCE_EQUALS':['EXACT_POINT_DISTANCE'],'EQUAL_DISTANCE':['DISTANCES_EQUAL'],'MIDPOINT_RATIO':['COLLINEAR','BETWEEN_ENDPOINTS','DISTANCE_RATIO'],'PERPENDICULAR':['DIRECTION_VECTORS_PERPENDICULAR'],'PARALLEL':['DIRECTION_VECTORS_PARALLEL'],'CIRCLE_MEMBERSHIP':['POINT_ON_CIRCLE'],'TANGENCY_AT_POINT':['POINT_ON_CIRCLE','TANGENT_CONTAINS_CONTACT','TANGENT_PERPENDICULAR_TO_RADIUS'],'ORIENTED_SIDE':['STRICT_ORIENTED_HALF_PLANE']}[kind]
        row={'id':condition['id'],'sourceConditionId':condition['sourceConditionId'],'kind':kind,'status':'PASS','checks':checks,'observed':exact(observed) if isinstance(observed,S.Basic) else observed}
        if expected is not None:row['expected']=exact(expected)
        if kind=='ORIENTED_SIDE':row['sign']=condition['sign']
        condition_rows.append(row)
    source_axes=graph.get('realization',{}).get('recipeId')=='SOURCE_COORDINATE_AXES_v1'
    return {'engine':'SymPy','version':S.__version__,'points':points,'scalars':scalars,'lines':lines,'circles':circles,'pointSets':point_sets,'conditionAudits':condition_rows,'transcript':transcript,'order':order,'coordinateMode':'CONSTRUCTED_REALIZATION' if 'realization' in graph and not source_axes else 'SOURCE_COORDINATES'}
