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
    'PARALLEL_THROUGH': (['POINT','LINE'],'LINE'),
    'ANGLE_BISECTOR': (['POINT','POINT','POINT'],'LINE'),
    'PERPENDICULAR_FOOT': (['POINT','LINE'],'POINT'),
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
        expected={'SOURCE_POINT':{'coordinates'},'NORMALIZATION_ORIGIN':set(),'NORMALIZATION_AXIS':{'length'},'CIRCLE_CENTER_RADIUS':{'radius'},'ANGLE_BISECTOR':{'mode'}}.get(node['op'],set())
        if set(node['args'])!=expected: raise ValueError('UNSUPPORTED_NODE_ARGS')
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
            points[key]={'exact':[exact(v) for v in value],'approximation':numeric,'precisionDigits':17}
        elif nodes[key]['outputType']=='SCALAR':scalars[key]={'exact':exact(value),'approximation':float(value.evalf(17))}
        elif nodes[key]['outputType']=='LINE':
            coefficients=list(value.coefficients)
            numeric=[float(term.evalf(17)) for term in coefficients]
            if not all(math.isfinite(v) for v in numeric):raise ValueError('NONFINITE_LINE')
            lines[key]={'exact':[exact(term) for term in coefficients],'approximation':numeric}
        elif nodes[key]['outputType']=='CIRCLE':
            center=value.center;radius=value.radius;numeric=[float(center.x.evalf(17)),float(center.y.evalf(17)),float(radius.evalf(17))]
            if not all(math.isfinite(v) for v in numeric):raise ValueError('NONFINITE_CIRCLE')
            circles[key]={'centerExact':[exact(center.x),exact(center.y)],'radiusExact':exact(radius),'approximation':numeric}
        elif nodes[key]['outputType']=='POINT_SET':
            if not isinstance(value,(list,tuple)):raise ValueError('INVALID_POINT_SET')
            rows=[]
            for point_value in value:
                if not isinstance(point_value,S.Point2D):raise ValueError('INVALID_POINT_SET_MEMBER')
                numeric=[float(v.evalf(17)) for v in point_value]
                if not all(math.isfinite(v) for v in numeric):raise ValueError('NONFINITE_POINT_SET')
                rows.append({'exact':[exact(v) for v in point_value],'approximation':numeric})
            point_sets[key]=rows
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
    return {'engine':'SymPy','version':S.__version__,'points':points,'scalars':scalars,'lines':lines,'circles':circles,'pointSets':point_sets,'conditionAudits':condition_rows,'transcript':transcript,'order':order,'coordinateMode':'CONSTRUCTED_REALIZATION' if 'realization' in graph else 'SOURCE_COORDINATES'}
