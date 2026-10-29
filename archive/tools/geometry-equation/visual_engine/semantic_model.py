"""Validated semantic objects, independent of SVG and label coordinates."""
from __future__ import annotations
from copy import deepcopy
import math
import re
from .geometry_model import (Line,Circle,CircularArc,point,finite,line_intersection,
    parallel_check,perpendicular_check,point_on_line,tangent_check)

KINDS = {'POINT','POINT_NAME','COORDINATE_LABEL','LINE','SEGMENT','CIRCLE','CIRCULAR_ARC','TRACE_ARC',
    'FUNCTION_GRAPH','INTERSECTION','TANGENT','PARALLEL','PERPENDICULAR',
    'PERPENDICULAR_MARK','ANGLE_MARK','LENGTH_LABEL','EQUATION_LABEL','EQUAL_MARK','PARALLEL_MARK',
    'GRAPH_ANNOTATION','CONDITION_BOX','AUXILIARY_LINE','LEADER_LINE','FILL_REGION','POLYGON','GRAPH_REGION'}
VISUAL_TYPES={'coordinate_geometry','line_circle_geometry','function_graph','calculus_graph','explanation_card'}
RELATIONS={'INTERSECTION','TANGENT','PARALLEL','PERPENDICULAR','PERPENDICULAR_MARK','ANGLE_MARK','LENGTH_LABEL','EQUAL_MARK','PARALLEL_MARK'}
FIELDS={'id','kind','at','from','to','center','radius','centerPoint','startPoint','endPoint','sweep','coefficients','expression','domain','text','target','refs','value','exact','priority','name','math','lines','breaks','criticalX','allowSuppress','sourceDecimalEvidence','branch','preferred','lineOwned','alternateAt','arcs','ring','outer','style','labelText','labelKind','highlight','dash','arrow','count','directions','gaps','leaderOwned','loops','fill','pattern','through','spanDeg','radiusPoint','radiusSegment','upper','lower','marker','unit','emphasis','emphasisGroup','markerRadius','lineFallback'}
REQUIRED={'POINT':{'at'},'POINT_NAME':{'target','text'},'COORDINATE_LABEL':{'target','exact'},'LINE':{'coefficients'},'AUXILIARY_LINE':{'coefficients'},'SEGMENT':{'from','to'},'LEADER_LINE':{'from','to'},'CIRCLE':{'center','radius'},'CIRCULAR_ARC':{'centerPoint','startPoint','endPoint','sweep'},'TRACE_ARC':{'centerPoint','through'},'FUNCTION_GRAPH':{'expression','domain'},'INTERSECTION':{'refs','target'},'PARALLEL':{'refs'},'PERPENDICULAR':{'refs'},'PERPENDICULAR_MARK':{'refs','at'},'TANGENT':{'refs','at'},'ANGLE_MARK':{'refs','value'},'EQUAL_MARK':{'refs','count'},'PARALLEL_MARK':{'refs','count'},'LENGTH_LABEL':{'refs','value','at','text'},'EQUATION_LABEL':{'text','at'},'GRAPH_ANNOTATION':{'text','at'},'CONDITION_BOX':{'at','lines'},'FILL_REGION':{'loops','fill'},'POLYGON':{'refs'},'GRAPH_REGION':{'upper','lower','domain','fill'}}

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
        # marker:'NONE' is a nameless POINT that draws no dot at all (a plane figure's hiddenPointStyle NONE); nothing else carries a marker.
        if 'marker' in obj and (obj['kind']!='POINT' or obj['marker']!='NONE' or 'name' not in obj or obj['name'] is not None):raise ValueError('INVALID_POINT_MARKER')
        # A fill pattern belongs to a plane region only; no other object carries one.
        if 'pattern' in obj and obj['kind']!='FILL_REGION':raise ValueError('UNKNOWN_OR_MISSING_COMPONENT_FIELD')
        # emphasis (BOLD, ACCENT) singles out one drawn segment; nothing else carries it.
        if 'emphasis' in obj and (obj['kind']!='SEGMENT' or obj['emphasis'] not in {'BOLD','ACCENT'}):raise ValueError('INVALID_SEGMENT_EMPHASIS')
        # emphasisGroup (1..3) colours the arcs of one angle mark; nothing else carries it.
        if 'emphasisGroup' in obj and (obj['kind']!='ANGLE_MARK' or isinstance(obj['emphasisGroup'],bool) or obj['emphasisGroup'] not in {1,2,3}):raise ValueError('INVALID_ANGLE_EMPHASIS_GROUP')
        # A plane mark label is plain TEXT or math; a unit (cm, m, mm) follows a math label of an expression label, a circular arc or a trace only.
        if 'unit' in obj:
            if obj['kind'] not in {'EQUATION_LABEL','CIRCULAR_ARC','TRACE_ARC'}:raise ValueError('UNKNOWN_OR_MISSING_COMPONENT_FIELD')
            if obj['unit'] not in {'cm','m','mm'}:raise ValueError('MARK_UNIT_INVALID:'+str(obj.get('id')))
            if obj['kind']!='EQUATION_LABEL' and obj.get('labelText') is None:raise ValueError('MARK_UNIT_REQUIRES_LABEL:'+str(obj.get('id')))
            if obj.get('labelKind','DEGREE' if obj['kind']=='CIRCULAR_ARC' else 'MATH')!='MATH':raise ValueError('MARK_UNIT_REQUIRES_MATH_LABEL:'+str(obj.get('id')))
        if 'labelKind' in obj and obj['kind'] in {'EQUATION_LABEL','CIRCULAR_ARC','TRACE_ARC'}:
            if obj['labelKind'] not in ({'MATH','TEXT'} if obj['kind']!='CIRCULAR_ARC' else {'DEGREE','NAME','MATH','TEXT'}):raise ValueError('MARK_LABEL_KIND_INVALID:'+str(obj.get('id')))
        # A first layout direction for a label at its point (the layout still tries the other directions).
        if 'preferred' in obj and (obj['kind'] not in {'POINT_NAME','COORDINATE_LABEL'} or obj['preferred'] not in {'N','NE','E','SE','S','SW','W','NW'}):raise ValueError('INVALID_LABEL_PREFERRED_DIRECTION')
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
            if 'branch' in obj and obj['branch'] not in {'LEFT','RIGHT','PIECE_1','PIECE_2','PIECE_3','PIECE_4','PIECE_5','PIECE_6'} and not re.fullmatch(r'REF_[A-Za-z][A-Za-z0-9]{0,7}(?:_[1-4])?',str(obj['branch'])):raise ValueError('INVALID_GRAPH_BRANCH_TAG')
        elif kind in {'EQUATION_LABEL','GRAPH_ANNOTATION','CONDITION_BOX'}:
            point(obj['at'])
            if kind=='CONDITION_BOX':
                if not obj.get('lines') or not all(isinstance(v,str) or (isinstance(v,dict) and isinstance(v.get('text'),str) and isinstance(v.get('math',False),bool) and not set(v)-{'text','math'}) for v in obj['lines']):
                    raise ValueError('CONDITION_LINES_REQUIRED')
            elif not isinstance(obj.get('text'),str): raise ValueError('LABEL_TEXT_REQUIRED')
    for obj in spec['objects']:
        if obj['kind'] != 'TRACE_ARC': continue
        # A construction trace: thin compass arcs of one radius around the intersections the plan says they produce.
        center_id=obj['centerPoint']
        if objects.get(center_id,{}).get('kind')!='POINT':raise ValueError('TRACE_ARC_POINT_REFS_REQUIRED:'+obj['id'])
        has_point='radiusPoint' in obj;has_segment='radiusSegment' in obj
        if has_point==has_segment:raise ValueError('TRACE_ARC_RADIUS_REQUIRED:'+obj['id'])
        through=obj.get('through')
        if not isinstance(through,list) or not 1<=len(through)<=8 or any(objects.get(pid,{}).get('kind')!='POINT' for pid in through):
            raise ValueError('TRACE_ARC_POINT_REFS_REQUIRED:'+obj['id'])
        if len(set(through))!=len(through) or center_id in through:raise ValueError('TRACE_TARGETS_DEGENERATE:'+obj['id'])
        center=geometry[center_id]
        if has_point:
            pid=obj['radiusPoint']
            if objects.get(pid,{}).get('kind')!='POINT' or pid==center_id:raise ValueError('TRACE_ARC_RADIUS_REQUIRED:'+obj['id'])
            radius=math.dist(center,geometry[pid])
        else:
            sid=obj['radiusSegment']
            if objects.get(sid,{}).get('kind')!='SEGMENT':raise ValueError('TRACE_ARC_RADIUS_REQUIRED:'+obj['id'])
            radius=math.dist(*geometry[sid])
        if radius<=0:raise ValueError('TRACE_ARC_RADIUS_REQUIRED:'+obj['id'])
        span=obj.get('spanDeg',24)
        if isinstance(span,bool) or not isinstance(span,(int,float)) or not math.isfinite(span) or not 2<=span<=120:
            raise ValueError('TRACE_SPAN_INVALID:'+obj['id'])
        rows=[]
        for pid in through:
            target=geometry[pid];distance=math.dist(center,target)
            if abs(distance-radius)>1e-6*max(1,radius):raise ValueError('TRACE_TARGET_NOT_ON_ARC:'+pid)
            rows.append((pid,target,math.atan2(target[1]-center[1],target[0]-center[0])))
        geometry[obj['id']]={'center':center,'radius':radius,'through':rows,'spanDeg':float(span)}
        relations.append({'id':obj['id'],'kind':'TRACE_ARC','status':'PASS','observed':radius})
    for obj in spec['objects']:
        if obj['kind'] != 'CIRCULAR_ARC': continue
        refs=(obj['centerPoint'],obj['startPoint'],obj['endPoint'])
        if len(set(refs)) != 3 or any(objects.get(ref,{}).get('kind') != 'POINT' for ref in refs):
            raise ValueError('CIRCULAR_ARC_POINT_REFS_REQUIRED:'+obj['id'])
        arc=CircularArc(geometry[refs[0]],geometry[refs[1]],geometry[refs[2]],obj['sweep'])
        geometry[obj['id']]=arc
        relations.append({'id':obj['id'],'kind':'CIRCULAR_ARC','status':'PASS','observed':arc.degrees})
    for obj in spec['objects']:
        if obj['kind'] != 'FILL_REGION': continue
        # A region is closed chains of straight edges and circular arcs between displayed points (even-odd fill: shapes minus holes).
        loops=obj['loops']
        if obj['fill'] not in {'LIGHT','MEDIUM'}: raise ValueError('REGION_FILL_UNSUPPORTED:'+obj['id'])
        # pattern HATCH paints real diagonal strokes clipped to this even-odd area: the source says 빗금친.
        if obj.get('pattern') not in (None,'HATCH'): raise ValueError('REGION_PATTERN_UNSUPPORTED:'+obj['id'])
        if obj.get('labelKind','MATH') not in {'MATH','TEXT'}: raise ValueError('REGION_FIELD_INVALID:labelKind:'+obj['id'])
        if 'labelKind' in obj and 'labelText' not in obj: raise ValueError('REGION_FIELD_INVALID:labelKind:'+obj['id'])
        if not isinstance(loops,list) or not loops: raise ValueError('REGION_BOUNDARY_UNKNOWN:'+obj['id'])
        for loop in loops:
            if not isinstance(loop,dict) or set(loop)!={'start','steps'} or not isinstance(loop['steps'],list) or len(loop['steps'])<1:
                raise ValueError('REGION_BOUNDARY_UNKNOWN:'+obj['id'])
            names=[loop['start']]+[step.get('to') for step in loop['steps']]
            if any(objects.get(name,{}).get('kind')!='POINT' for name in names): raise ValueError('REGION_BOUNDARY_UNKNOWN:'+obj['id'])
            if names[-1]!=names[0]: raise ValueError('REGION_NOT_CLOSED:'+obj['id'])
            for before,step in zip(names,loop['steps']):
                if set(step)-{'to','arc'}: raise ValueError('REGION_BOUNDARY_UNKNOWN:'+obj['id'])
                arc=step.get('arc')
                full=isinstance(arc,dict) and arc.get('full') is True
                if before==step['to'] and not full: raise ValueError('REGION_DEGENERATE_EDGE:'+obj['id'])
                if arc is None: continue
                if set(arc)-{'center','sweep','full'} or not {'center','sweep'}<=set(arc) or arc['sweep'] not in {'CCW','CW'} or objects.get(arc['center'],{}).get('kind')!='POINT' or (full and before!=step['to']):
                    raise ValueError('REGION_BOUNDARY_UNKNOWN:'+obj['id'])
                c=geometry[arc['center']];r=math.dist(geometry[before],c)
                if r<=0 or abs(math.dist(geometry[step['to']],c)-r)>1e-6*max(1,r): raise ValueError('REGION_ARC_ENDPOINT_NOT_ON_CIRCLE:'+obj['id'])
        geometry[obj['id']]={'loops':loops}
        relations.append({'id':obj['id'],'kind':'FILL_REGION','status':'PASS','observed':len(loops)})
    for obj in spec['objects']:
        if obj['kind'] != 'POLYGON': continue
        # A simple closed polygon of displayed points (a triangle OAB, a trapezoid of two chords): its own outline, optionally filled.
        refs=obj['refs']
        if len(refs)<3 or len(set(refs))!=len(refs) or any(objects.get(ref,{}).get('kind')!='POINT' for ref in refs): raise ValueError('POLYGON_POINT_REFS_REQUIRED:'+obj['id'])
        if 'fill' in obj and obj['fill'] not in {'LIGHT','MEDIUM','NONE'}: raise ValueError('REGION_FILL_UNSUPPORTED:'+obj['id'])
        geometry[obj['id']]=[geometry[ref] for ref in refs]
        relations.append({'id':obj['id'],'kind':'POLYGON','status':'PASS','observed':len(refs)})
    for obj in spec['objects']:
        if obj['kind'] != 'GRAPH_REGION': continue
        # A graph region is a band between two sampled function boundaries over [lo,hi]: each side is rows of {expression, domain} that
        # exactly cover the interval in order (the engine samples those expressions; the boundary is the drawn curve itself).
        if obj['fill'] not in {'LIGHT','MEDIUM'}: raise ValueError('GRAPH_REGION_FILL_UNSUPPORTED:'+obj['id'])
        lo,hi=point(obj['domain'])
        if not lo<hi: raise ValueError('GRAPH_REGION_DOMAIN_INVALID:'+obj['id'])
        for side in ('upper','lower'):
            rows=obj[side]
            if not isinstance(rows,list) or not rows: raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+obj['id'])
            cursor=lo
            for row in rows:
                if not isinstance(row,dict) or set(row)!={'expression','domain'} or not isinstance(row.get('expression'),str) or not row['expression'].strip():
                    raise ValueError('GRAPH_REGION_BOUNDARY_UNKNOWN:'+obj['id'])
                a,b=point(row['domain'])
                if not a<b or a>cursor+1e-9 or b>hi+1e-9: raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+obj['id'])
                cursor=b
            if cursor<hi-1e-9: raise ValueError('GRAPH_REGION_BOUNDARY_UNDEFINED:'+obj['id'])
        if obj.get('labelText') is not None and (not isinstance(obj['labelText'],str) or not obj['labelText'].strip() or len(obj['labelText'])>40):
            raise ValueError('GRAPH_REGION_LABEL_INVALID:'+obj['id'])
        geometry[obj['id']]={'upper':obj['upper'],'lower':obj['lower'],'domain':list(obj['domain'])}
        relations.append({'id':obj['id'],'kind':'GRAPH_REGION','status':'PASS','observed':len(obj['upper'])+len(obj['lower'])})
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
                if obj.get('outer') is True:observed=360-observed
                ok=parity(observed,finite(obj['value']))
            elif kind in {'EQUAL_MARK','PARALLEL_MARK'}:
                if len(refs)<2 or len(set(refs))!=len(refs) or any(objects[r]['kind']!='SEGMENT' for r in refs):raise ValueError('SEGMENT_REFS_REQUIRED')
                if isinstance(obj.get('count'),bool) or not isinstance(obj.get('count'),int) or not 1<=obj['count']<=(3 if kind=='EQUAL_MARK' else 2):raise ValueError('MARK_COUNT_INVALID')
                if kind=='EQUAL_MARK':
                    lengths=[math.dist(*geometry[r]) for r in refs];observed=lengths
                    ok=all(abs(length-lengths[0])<=1e-6*max(1,lengths[0]) for length in lengths)
                    if not ok:raise ValueError('EQUAL_MARK_LENGTH_MISMATCH:'+obj['id'])
                else:
                    def unit(r):
                        p,q=geometry[r];n=math.dist(p,q);return ((q[0]-p[0])/n,(q[1]-p[1])/n)
                    units=[unit(r) for r in refs];observed=[abs(u[0]*units[0][1]-u[1]*units[0][0]) for u in units]
                    ok=all(value<=math.sin(math.radians(0.5)) for value in observed)
                    if not ok:raise ValueError('PARALLEL_MARK_NOT_PARALLEL:'+obj['id'])
        except (KeyError,TypeError,ValueError) as exc:
            if str(exc).startswith(('EQUAL_MARK_LENGTH_MISMATCH','PARALLEL_MARK_NOT_PARALLEL')):raise
            raise ValueError('UNVERIFIED_SEMANTIC_MARK:'+obj['id']) from exc
        if not ok: raise ValueError('UNVERIFIED_SEMANTIC_MARK:'+obj['id'])
        relations.append({'id':obj['id'],'kind':kind,'status':'PASS','observed':observed})
    return {'spec':deepcopy(spec),'geometry':geometry,'relations':relations,'semanticStatus':'PASS'}
