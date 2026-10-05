"""Small closed SymPy Geometry spike, not a general constraint solver."""
import math
import re
from graphlib import TopologicalSorter, CycleError
import sympy as S
import mpmath
if S.__version__!='1.14.0' or mpmath.__version__!='1.3.0': raise ValueError('PYTHON_DEPENDENCY_VERSION_MISMATCH')

SIGNATURES = {
    'SOURCE_POINT': ([], 'POINT'), 'NORMALIZATION_ORIGIN': ([], 'POINT'),
    'NORMALIZATION_AXIS': ([], 'POINT'), 'MIDPOINT': (['POINT','POINT'],'POINT'),
    'LINE_THROUGH': (['POINT','POINT'],'LINE'),
    'PERPENDICULAR_FOOT': (['POINT','LINE'],'POINT'),
    'CIRCLE_CENTER_RADIUS': (['POINT'],'CIRCLE'),
    'INTERSECTION': (None,'POINT_SET'), 'SELECT_POINT': (['POINT_SET'],'POINT'),
    'SEGMENT_LENGTH': (['POINT','POINT'],'SCALAR'), 'SCALAR_SQUARE': (['SCALAR'],'SCALAR'),
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
    if graph.get('schemaVersion')!='construction-spike-v1' or set(graph)-{'schemaVersion','nodes','realization'}: raise ValueError('UNSUPPORTED_GRAPH_SCHEMA')
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
        expected={'SOURCE_POINT':{'coordinates'},'NORMALIZATION_ORIGIN':set(),'NORMALIZATION_AXIS':{'length'},'CIRCLE_CENTER_RADIUS':{'radius'}}.get(node['op'],set())
        if set(node['args'])!=expected: raise ValueError('UNSUPPORTED_NODE_ARGS')
        nodes[node['id']]=node
    deps={key:dependencies(n) for key,n in nodes.items()}
    for key,n in nodes.items():
        if any(r not in nodes for r in deps[key]): raise ValueError('UNKNOWN_REFERENCE')
        types=[nodes[r]['outputType'] for r in n['inputs']]
        expected=SIGNATURES[n['op']][0]
        if expected is not None and types!=expected: raise ValueError('INPUT_TYPE_MISMATCH')
        if n['op']=='INTERSECTION' and types not in (['LINE','CIRCLE'],['CIRCLE','CIRCLE'],['LINE','LINE']): raise ValueError('UNSUPPORTED_INTERSECTION_TYPES')
        if n['op']=='SELECT_POINT' and any(nodes[r]['outputType']!='POINT' for r in n['branch']['refs']): raise ValueError('BRANCH_REFERENCE_TYPE')
    try:
        sorter=TopologicalSorter(deps);sorter.prepare();order=[]
        while sorter.is_active():
            ready=sorted(sorter.get_ready());order.extend(ready);sorter.done(*ready)
    except CycleError: raise ValueError('CONSTRUCTION_CYCLE') from None
    if any(n['op'].startswith('NORMALIZATION_') for n in nodes.values()):
        recipe=graph.get('realization',{})
        if recipe.get('recipeId')!='SSS_POSITIVE_SIDE_v1' or recipe.get('unit')!='source-length' or recipe.get('reflectionEquivalent') is not True: raise ValueError('REALIZATION_RECIPE_REQUIRED')
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
        elif op=='MIDPOINT': value=S.Segment(*a).midpoint
        elif op=='LINE_THROUGH':
            if a[0]==a[1]: raise ValueError('DEGENERATE_LINE')
            value=S.Line(*a)
        elif op=='PERPENDICULAR_FOOT': value=a[1].projection(a[0])
        elif op=='SEGMENT_LENGTH': value=a[0].distance(a[1])
        elif op=='SCALAR_SQUARE': value=a[0]**2
        elif op=='CIRCLE_CENTER_RADIUS':
            radius=scalar(args['radius'])
            if radius.is_positive is not True: raise ValueError('INVALID_RADIUS')
            value=S.Circle(a[0],radius)
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
    points={};scalars={}
    for key,value in objects.items():
        if isinstance(value,S.Point2D):
            numeric=[float(v.evalf(17)) for v in value]
            if not all(math.isfinite(v) for v in numeric): raise ValueError('NONFINITE_POINT')
            points[key]={'exact':[exact(v) for v in value],'approximation':numeric,'precisionDigits':17}
        elif nodes[key]['outputType']=='SCALAR':scalars[key]={'exact':exact(value),'approximation':float(value.evalf(17))}
    return {'engine':'SymPy','version':S.__version__,'points':points,'scalars':scalars,'transcript':transcript,'order':order,'coordinateMode':'CONSTRUCTED_REALIZATION' if 'realization' in graph else 'SOURCE_COORDINATES'}
