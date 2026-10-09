"""Validated semantic objects, independent of SVG and label coordinates."""
from __future__ import annotations
from copy import deepcopy
import math
from .geometry_model import (Line,Circle,CircularArc,point,finite,line_intersection,
    parallel_check,perpendicular_check,point_on_line,tangent_check)

KINDS = {'POINT','POINT_NAME','COORDINATE_LABEL','LINE','SEGMENT','CIRCLE','CIRCULAR_ARC',
    'FUNCTION_GRAPH','INTERSECTION','TANGENT','PARALLEL','PERPENDICULAR',
    'PERPENDICULAR_MARK','ANGLE_MARK','LENGTH_LABEL','EQUATION_LABEL',
    'GRAPH_ANNOTATION','CONDITION_BOX','AUXILIARY_LINE','LEADER_LINE'}
VISUAL_TYPES={'coordinate_geometry','line_circle_geometry','function_graph','calculus_graph','explanation_card'}
RELATIONS={'INTERSECTION','TANGENT','PARALLEL','PERPENDICULAR','PERPENDICULAR_MARK','ANGLE_MARK','LENGTH_LABEL'}
FIELDS={'id','kind','at','from','to','center','radius','centerPoint','startPoint','endPoint','sweep','coefficients','expression','domain','text','target','refs','value','exact','priority','name','math','lines','breaks','criticalX','allowSuppress','sourceDecimalEvidence','branch'}
REQUIRED={'POINT':{'at'},'POINT_NAME':{'target','text'},'COORDINATE_LABEL':{'target','exact'},'LINE':{'coefficients'},'AUXILIARY_LINE':{'coefficients'},'SEGMENT':{'from','to'},'LEADER_LINE':{'from','to'},'CIRCLE':{'center','radius'},'CIRCULAR_ARC':{'centerPoint','startPoint','endPoint','sweep'},'FUNCTION_GRAPH':{'expression','domain'},'INTERSECTION':{'refs','target'},'PARALLEL':{'refs'},'PERPENDICULAR':{'refs'},'PERPENDICULAR_MARK':{'refs','at'},'TANGENT':{'refs','at'},'ANGLE_MARK':{'refs','value'},'LENGTH_LABEL':{'refs','value','at','text'},'EQUATION_LABEL':{'text','at'},'GRAPH_ANNOTATION':{'text','at'},'CONDITION_BOX':{'at','lines'}}

def parity(a,b):
    if isinstance(a,bool) or isinstance(b,bool): return a is b
    if isinstance(a,(int,float)) and isinstance(b,(int,float)):
        return math.isfinite(a) and math.isfinite(b) and abs(a-b)<=1e-9
    if isinstance(a,dict) and isinstance(b,dict):
        return a.keys()==b.keys() and all(parity(a[k],b[k]) for k in a)
    if isinstance(a,(list,tuple)) and isinstance(b,(list,tuple)):
        return len(a)==len(b) and all(parity(x,y) for x,y in zip(a,b))
    return type(a)==type(b) and a==b

def validate(spec):
    if isinstance(spec, dict) and "publication" in spec:
        from .publication import normalize, validate_annotations
        core, config = normalize(spec)
        result = validate(core)
        result["publication"] = validate_annotations(config, core, result["geometry"])
        return result
    allowed={'id','visualType','viewport','sourceFacts','derivedFacts','displayFacts','objects','axes','title'}
    if not isinstance(spec,dict) or set(spec)-allowed:
        raise ValueError('UNKNOWN_SPEC_FIELD')
    if not {'id','visualType','viewport','objects','sourceFacts','derivedFacts','displayFacts'} <= spec.keys():
        raise ValueError('MISSING_SPEC_FIELD')
    axes=spec.get('axes',True)
    if not isinstance(axes,bool) and (not isinstance(axes,dict) or set(axes)!={'x','y'} or any(not isinstance(value,bool) for value in axes.values())):
        raise ValueError('INVALID_AXIS_POLICY')
    if not isinstance(spec['id'],str) or not spec['id'] or spec['visualType'] not in VISUAL_TYPES:
        raise ValueError('INVALID_VISUAL_TYPE_OR_ID')
    for key in ('sourceFacts','derivedFacts','displayFacts'):
        if not isinstance(spec[key],dict): raise ValueError('FACT_MAP_REQUIRED')
    for key in spec['sourceFacts'].keys() & spec['derivedFacts'].keys():
        if not parity(spec['sourceFacts'][key],spec['derivedFacts'][key]):
            raise ValueError('SOURCE_DERIVED_PARITY_FAIL:'+key)
    vp=spec['viewport']
    bounds=tuple(finite(vp[k]) for k in ('xMin','xMax','yMin','yMax'))
    if bounds[0]>=bounds[1] or bounds[2]>=bounds[3]: raise ValueError('INVALID_VIEWPORT')
    if not isinstance(spec['objects'],list): raise ValueError('OBJECT_ARRAY_REQUIRED')
    objects={}; geometry={}; relations=[]
    for obj in spec['objects']:
        if not isinstance(obj,dict) or obj.get('kind') not in KINDS: raise ValueError('UNKNOWN_COMPONENT')
        if set(obj)-FIELDS or not REQUIRED[obj['kind']]<=obj.keys():raise ValueError('UNKNOWN_OR_MISSING_COMPONENT_FIELD')
        if 'priority' in obj and (isinstance(obj['priority'],bool) or not isinstance(obj['priority'],int) or not 0<=obj['priority']<=4):raise ValueError('INVALID_PRIORITY')
        if 'refs' in obj and (not isinstance(obj['refs'],list) or not all(isinstance(v,str) for v in obj['refs'])):raise ValueError('INVALID_REFS')
        for key in ('math','allowSuppress'):
            if key in obj and not isinstance(obj[key],bool):raise ValueError('INVALID_COMPONENT_FLAG')
        oid=obj.get('id'); kind=obj['kind']
        if not isinstance(oid,str) or not oid or not all(c.isalnum() or c in '_-' for c in oid):
            raise ValueError('INVALID_OBJECT_ID')
        if oid in objects: raise ValueError('DUPLICATE_OBJECT_ID:'+oid)
        objects[oid]=obj
        if kind=='POINT': geometry[oid]=point(obj['at'])
        elif kind in {'LINE','AUXILIARY_LINE'}: geometry[oid]=Line(*obj['coefficients'])
        elif kind=='CIRCLE': geometry[oid]=Circle(obj['center'],obj['radius'])
        elif kind in {'SEGMENT','LEADER_LINE'}:
            p,q=point(obj['from']),point(obj['to'])
            if p==q: raise ValueError('DEGENERATE_SEGMENT')
            geometry[oid]=(p,q)
        elif kind=='FUNCTION_GRAPH':
            if not isinstance(obj.get('expression'),str): raise ValueError('EXPRESSION_REQUIRED')
            lo,hi=point(obj['domain'])
            if lo>=hi: raise ValueError('INVALID_DOMAIN')
            if 'branch' in obj and obj['branch'] not in {'LEFT','RIGHT'}:raise ValueError('INVALID_GRAPH_BRANCH_TAG')
        elif kind in {'EQUATION_LABEL','GRAPH_ANNOTATION','CONDITION_BOX'}:
            point(obj['at'])
            if kind=='CONDITION_BOX':
                if not obj.get('lines') or not all(isinstance(v,str) or (isinstance(v,dict) and isinstance(v.get('text'),str) and isinstance(v.get('math',False),bool) and not set(v)-{'text','math'}) for v in obj['lines']):
                    raise ValueError('CONDITION_LINES_REQUIRED')
            elif not isinstance(obj.get('text'),str): raise ValueError('LABEL_TEXT_REQUIRED')
    for obj in spec['objects']:
        if obj['kind'] != 'CIRCULAR_ARC': continue
        refs=(obj['centerPoint'],obj['startPoint'],obj['endPoint'])
        if len(set(refs)) != 3 or any(objects.get(ref,{}).get('kind') != 'POINT' for ref in refs):
            raise ValueError('CIRCULAR_ARC_POINT_REFS_REQUIRED:'+obj['id'])
        arc=CircularArc(geometry[refs[0]],geometry[refs[1]],geometry[refs[2]],obj['sweep'])
        geometry[obj['id']]=arc
        relations.append({'id':obj['id'],'kind':'CIRCULAR_ARC','status':'PASS','observed':arc.degrees})
    for obj in spec['objects']:
        kind=obj['kind']; refs=obj.get('refs',[])
        if any(ref not in objects for ref in refs): raise ValueError('UNKNOWN_REF')
        if kind == 'CIRCULAR_ARC': continue
        if kind in {'POINT_NAME','COORDINATE_LABEL'}:
            if obj.get('target') not in geometry or objects[obj['target']]['kind']!='POINT': raise ValueError('POINT_TARGET_REQUIRED')
            if kind=='POINT_NAME' and not isinstance(obj.get('text'),str): raise ValueError('POINT_NAME_REQUIRED')
            if kind=='COORDINATE_LABEL' and ('exact' not in obj or len(obj['exact'])!=2): raise ValueError('EXACT_COORDINATES_REQUIRED')
        if kind not in RELATIONS: continue
        ok=False; observed=None
        try:
            if kind in {'PARALLEL','PERPENDICULAR','PERPENDICULAR_MARK'}:
                if len(refs)!=2 or not all(isinstance(geometry.get(r),Line) for r in refs): raise ValueError('LINE_REFS_REQUIRED')
                l,m=(geometry[r] for r in refs)
                ok=(parallel_check if kind=='PARALLEL' else perpendicular_check)(l,m)
                if kind=='PERPENDICULAR_MARK':
                    observed=line_intersection(l,m)
                    ok=ok and parity(point(obj['at']),observed)
            elif kind=='INTERSECTION':
                if len(refs)!=2 or not all(isinstance(geometry.get(r),Line) for r in refs): raise ValueError('LINE_REFS_REQUIRED')
                observed=line_intersection(*(geometry[r] for r in refs))
                ok=objects.get(obj.get('target'),{}).get('kind')=='POINT' and parity(observed,geometry[obj['target']])
            elif kind=='TANGENT':
                if len(refs)!=2: raise ValueError('TANGENT_REFS_REQUIRED')
                l,c=(geometry.get(r) for r in refs)
                if not isinstance(l,Line): raise ValueError('LINE_TANGENT_REF_REQUIRED')
                observed=point(obj['at'])
                if isinstance(c,Circle):ok=tangent_check(c,l,observed)
                elif objects[refs[1]]['kind']=='FUNCTION_GRAPH':
                    from .math_expression import parse
                    from .differential import value_derivative
                    graph=objects[refs[1]];y,d=value_derivative(parse(graph['expression']),observed[0])
                    ok=math.isfinite(y) and math.isfinite(d) and graph['domain'][0]<=observed[0]<=graph['domain'][1] and parity(y,observed[1]) and point_on_line(observed,l) and abs(l.a+l.b*d)<=1e-9
                else:raise ValueError('UNSUPPORTED_TANGENCY')
            elif kind=='LENGTH_LABEL':
                if len(refs)!=1 or objects[refs[0]]['kind']!='SEGMENT': raise ValueError('SEGMENT_REF_REQUIRED')
                observed=math.dist(*geometry[refs[0]])
                ok=parity(observed,finite(obj['value']))
                point(obj['at'])
            elif kind=='ANGLE_MARK':
                if len(refs)!=3 or any(objects[r]['kind']!='POINT' for r in refs): raise ValueError('ANGLE_POINT_REFS_REQUIRED')
                a,v,b=(geometry[r] for r in refs)
                u=(a[0]-v[0],a[1]-v[1]); w=(b[0]-v[0],b[1]-v[1])
                if math.hypot(*u)==0 or math.hypot(*w)==0: raise ValueError('DEGENERATE_ANGLE')
                observed=math.degrees(math.acos(max(-1,min(1,(u[0]*w[0]+u[1]*w[1])/(math.hypot(*u)*math.hypot(*w))))))
                ok=parity(observed,finite(obj['value']))
        except (KeyError,TypeError,ValueError) as exc:
            raise ValueError('UNVERIFIED_SEMANTIC_MARK:'+obj['id']) from exc
        if not ok: raise ValueError('UNVERIFIED_SEMANTIC_MARK:'+obj['id'])
        relations.append({'id':obj['id'],'kind':kind,'status':'PASS','observed':observed})
    return {'spec':deepcopy(spec),'geometry':geometry,'relations':relations,'semanticStatus':'PASS'}
