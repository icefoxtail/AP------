"""Pure STANDARD builder and candidate-only CLI orchestration."""
import argparse
import hashlib
import html
import re
import json
import math
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path
from . import ENGINE_VERSION
from .semantic_model import validate
from .geometry_model import Circle,CircularArc,Line,clip_line,finite
from .math_expression import parse as _parse_expression,evaluate as _evaluate_expression

def _exact_float(text):
    """The float of an exact value string: a rational 'a/b' or an expression with sqrt (the surd endpoint of a quadratic's source interval)."""
    try:return float(Fraction(text))
    except (ValueError,ZeroDivisionError):return float(_evaluate_expression(_parse_expression(text),{}))
from .viewport import for_spec
from .function_sampling import sample
from .math_expression import Expr,parse,serialize,evaluate,exact_coordinate
from .label_layout import Box,layout,approximate_size,DIRECTIONS
from .svg_composer import compose
from .style_tokens import load
from .config import resolve_output

ROOT=Path(__file__).resolve().parents[4]

def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def sha(value):return hashlib.sha256(value.encode('utf-8')).hexdigest()

def mark_label(label_id,target,text,label_kind,at,extra):
    """A math label for a mark: 'DEGREE' = the expression followed by the degree sign (40 -> 40°, x -> x°), 'NAME' = the angle written by its letters (ABC -> ∠ABC)."""
    tokens=load()
    if label_kind=='NAME':
        if not re.fullmatch(r'[A-Z][A-Z0-9]{1,3}',text):raise ValueError('ANGLE_LABEL_NAME_INVALID')
        plain='∠'+text;markup=html.escape(plain);tex='\\angle '+text
    elif label_kind=='DEGREE':
        tree=Expr('degree','',(parse(text),));plain=serialize(tree,'plain');markup=serialize(tree,'svg');tex=serialize(tree,'tex')
    else:raise ValueError('ANGLE_LABEL_KIND_INVALID')
    label={'id':label_id,'kind':'EQUATION_LABEL','target':target,'text':plain,'markup':markup,'tex':tex,'math':True,'sourceMath':text,'font':tokens['mathLabel'],'priority':0,'at':list(at),'allowSuppress':False,**extra}
    label['layoutText']=''.join(ET.fromstring('<text>'+markup+'</text>').itertext())
    return label

def prepare(spec):
    semantic=validate(spec);spec=semantic['spec'];geometry=semantic['geometry'];tokens=load();critical=[]
    axis_option=spec.get('axes',True)
    show_x=axis_option if isinstance(axis_option,bool) else axis_option['x']
    show_y=axis_option if isinstance(axis_option,bool) else axis_option['y']
    symbols={name:evaluate(parse(expression)) for name,expression in spec['displayFacts'].get('symbolDefinitions',{}).items()}
    for name,value in symbols.items():
        if not name.isalpha() or isinstance(value,(bool,tuple,complex)) or not math.isfinite(float(value)):raise ValueError('INVALID_EXACT_SYMBOL_DEFINITION')
    for value in geometry.values():
        if isinstance(value,Circle):
            x,y=value.center;r=value.radius;critical.extend([(x-r,y-r),(x+r,y+r)])
        elif isinstance(value,CircularArc):critical.extend(value.critical_points())
        elif isinstance(value,tuple) and len(value)==2 and isinstance(value[0],float):critical.append(value)
        elif isinstance(value,tuple):critical.extend(value)
    piecewise_features=spec['displayFacts'].get('piecewiseFeatures')
    if piecewise_features is not None:
        if piecewise_features.get('schemaVersion')!='PIECEWISE_AFFINE_FEATURES_v1':raise ValueError('PIECEWISE_MARKER_INVENTORY_REQUIRED')
        for marker in piecewise_features.get('markers',[]):critical.append((float(Fraction(marker['x'])),float(Fraction(marker['y']))))
    interval_features=spec['displayFacts'].get('intervalFeatures')
    if interval_features is not None:
        if interval_features.get('schemaVersion')!='POLYNOMIAL_INTERVAL_FEATURES_v1':raise ValueError('POLYNOMIAL_INTERVAL_INVENTORY_REQUIRED')
        for endpoint in interval_features.get('endpoints',[]):critical.append((_exact_float(endpoint['x']),_exact_float(endpoint['y'])))
    reference_interval_features=spec['displayFacts'].get('referenceIntervalFeatures')
    if reference_interval_features is not None:
        if not isinstance(reference_interval_features,list):raise ValueError('REFERENCE_INTERVAL_INVENTORY_REQUIRED')
        for row in reference_interval_features:
            critical.append((_exact_float(row['lo']),_exact_float(row['startY'])))
            critical.append((_exact_float(row['hi']),_exact_float(row['endY'])))
    exponential_features=spec['displayFacts'].get('exponentialFeatures')
    if exponential_features is not None:
        if exponential_features.get('schemaVersion')!='EXPONENTIAL_AFFINE_FEATURES_v1':raise ValueError('EXPONENTIAL_FEATURE_INVENTORY_REQUIRED')
        reference=exponential_features['referencePoint'];critical.append((float(Fraction(reference['x'])),float(Fraction(reference['y']))))
    logarithmic_features=spec['displayFacts'].get('logarithmicFeatures')
    if logarithmic_features is not None:
        if logarithmic_features.get('schemaVersion')!='LOGARITHMIC_AFFINE_FEATURES_v1':raise ValueError('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED')
        reference=logarithmic_features['referencePoint'];critical.append((float(Fraction(reference['x'])),float(Fraction(reference['y']))))
    trig_features=spec['displayFacts'].get('trigFeatures')
    if trig_features is not None:
        if trig_features.get('schemaVersion')!='TRIGONOMETRIC_FEATURES_v1':raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        if trig_features.get('function') in {'SIN','COS'}:
            critical.extend((float(Fraction(row['xPiMultiple']))*math.pi,float(Fraction(row['y']))) for row in trig_features.get('phasePoints',[]))
        elif trig_features.get('referencePoint'):
            reference=trig_features['referencePoint'];critical.append((float(Fraction(reference['xPiMultiple']))*math.pi,float(Fraction(reference['y']))))
    if isinstance(axis_option,bool) and axis_option:critical.extend([(0,0),(1,0),(0,1)])
    vp=for_spec(spec,critical)
    if not vp.equal and any(isinstance(v,(Circle,CircularArc)) for v in geometry.values()):raise ValueError('CIRCLE_REQUIRES_EQUAL_UNITS')
    primitives=[];labels=[];obstacles=[];sampling=[]
    def primitive(p,obstacle=None):
        primitives.append(p)
        if obstacle:obstacles.append({'id':p['id'],'kind':obstacle,'role':p.get('role'),'axis':p.get('axis'),'value':p.get('value'),'geometry':p.get('points', [p.get('from'),p.get('to')]) if obstacle not in {'point','circle'} else (*p['at'],p['radius'])})
    if show_x or show_y:
        xmin,xmax,ymin,ymax=vp.bounds
        axes=[]
        if show_x:axes.append(('x-axis',(xmin,0),(xmax,0)))
        if show_y:axes.append(('y-axis',(0,ymin),(0,ymax)))
        for oid,a,b in axes:
            primitive({'id':oid,'kind':'line','from':vp.screen(a),'to':vp.screen(b),'token':'axis','layer':30,'role':'axis','axis':oid[0]},'axis')
        axis_tick_values=spec['displayFacts'].get('axisTickValues')
        if axis_tick_values is not None:
            if not isinstance(axis_tick_values,dict):raise ValueError('INVALID_AXIS_TICK_VALUES')
            for axis in ('x','y'):
                values=axis_tick_values.get(axis,[])
                if not isinstance(values,list) or len(values)!=len(set(map(str,values))):raise ValueError('INVALID_AXIS_TICK_VALUES:'+axis)
                for raw_value in values:
                    try:value=float(Fraction(str(raw_value)))
                    except (TypeError,ValueError,ZeroDivisionError):raise ValueError('INVALID_AXIS_TICK_VALUE:'+axis) from None
                    if not math.isfinite(value) or abs(value)<=1e-12:raise ValueError('INVALID_AXIS_TICK_VALUE:'+axis)
                    if not (xmin<=value<=xmax if axis=='x' else ymin<=value<=ymax):raise ValueError('AXIS_TICK_VALUE_OUT_OF_VIEW:'+axis)
        raw_tick_callouts=spec['displayFacts'].get('tickLabelCallouts',[])
        if not isinstance(raw_tick_callouts,list):raise ValueError('INVALID_TICK_LABEL_CALLOUTS')
        tick_callouts={}
        for callout in raw_tick_callouts:
            if (not isinstance(callout,dict) or set(callout)!={'axis','value','offsetUser'} or callout.get('axis')!='x'
                or callout.get('value')!='-6' or callout.get('offsetUser')!=[28,-22]):
                raise ValueError('INVALID_TICK_LABEL_CALLOUTS')
            key=(callout['axis'],float(Fraction(callout['value'])))
            if key in tick_callouts:raise ValueError('DUPLICATE_TICK_LABEL_CALLOUT')
            tick_callouts[key]=callout
        unit_ticks=[]
        if axis_tick_values is None:
            if show_x and xmin<=1<=xmax:unit_ticks.append(('model-x-unit','x',1,(1,0),(0,4)))
            if show_y and ymin<=1<=ymax:unit_ticks.append(('model-y-unit','y',1,(0,1),(-4,0)))
        for oid,axis,value,at,delta in unit_ticks:
            p=vp.screen(at);primitive({'id':oid,'kind':'line','from':p,'to':(p[0]+delta[0],p[1]+delta[1]),'token':'indicator','layer':30,'role':'tick','axis':axis,'value':value},'line')
        axis_labels=[]
        if show_x:axis_labels.append(('axis-x',(xmax,0),spec['displayFacts'].get('axisVariable','x')))
        if show_y:axis_labels.append(('axis-y',(0,ymax),'y'))
        for oid,at,text in axis_labels:
            labels.append({'id':oid,'kind':'GRAPH_ANNOTATION','at':vp.screen(at),'text':text,'font':13,'priority':4,'allowSuppress':True,'math':True})
        visible_axes=[]
        if show_x:visible_axes.append(('x',xmin,xmax))
        if show_y:visible_axes.append(('y',ymin,ymax))
        for axis,lo,hi in visible_axes:
            if axis_tick_values is None:
                raw=(hi-lo)/5;power=10**math.floor(math.log10(raw));step=next(v*power for v in (1,2,5,10) if v*power>=raw)
                values=[(index*step,index) for index in range(math.ceil(lo/step),math.floor(hi/step)+1)]
            else:
                values=[(float(Fraction(str(raw_value))),None) for raw_value in axis_tick_values.get(axis,[])]
            for value,index in values:
                if abs(value)<1e-12:continue
                at=(value,0) if axis=='x' else (0,value);p=vp.screen(at);delta=(0,4) if axis=='x' else (-4,0)
                display_token=str(int(value)) if float(value).is_integer() else f'{value:.10g}'
                id_token=str(index) if index is not None else display_token
                oid=f'tick-{axis}-{id_token}'
                if abs(value-1)<=1e-12:
                    oid='model-x-unit' if axis=='x' else 'model-y-unit'
                    if axis_tick_values is not None and not any(item['id']==oid for item in primitives):primitive({'id':oid,'kind':'line','from':p,'to':(p[0]+delta[0],p[1]+delta[1]),'token':'indicator','layer':30,'role':'tick','axis':axis,'value':value},'line')
                else:primitive({'id':oid,'kind':'line','from':p,'to':(p[0]+delta[0],p[1]+delta[1]),'token':'indicator','layer':30,'role':'tick','axis':axis,'value':value},'line')
                text=display_token.replace('-','−')
                tick_id=('model-x-unit' if axis=='x' else 'model-y-unit') if abs(value-1)<=1e-12 else oid
                label_id=f'tick-{axis}-{id_token}-label'
                tick_primitive=next((item for item in primitives if item['id']==tick_id),None)
                if tick_primitive is None:raise ValueError('TICK_LABEL_REQUIRED_PRIMITIVE_MISSING:'+label_id)
                tick_primitive['requiredLabelId']=label_id
                label={'id':label_id,'kind':'TICK_LABEL','tickId':tick_id,'target':tick_id,'owner':tick_id,'tickAxis':axis,'tickValue':value,'tickDisplayValue':text,'at':p,'text':text,'font':tokens['tickLabel'],'priority':0,'allowSuppress':False,'preferred':'S' if axis=='x' else 'W','directions':('S','N') if axis=='x' else ('W','E'),'gaps':(8,12),'centered':True,'math':True}
                callout=tick_callouts.pop((axis,value),None)
                if callout is not None:
                    label['tickLabelCallout']={'schemaVersion':'TICK_LABEL_OWNER_LEADER_v1','tickId':tick_id,'axis':axis,'value':value,'sourceAt':list(p),'offsetUser':list(callout['offsetUser'])}
                labels.append(label)
        if tick_callouts:raise ValueError('TICK_LABEL_CALLOUT_OWNER_NOT_FOUND')
    rational_features=spec['displayFacts'].get('rationalGraphFeatures')
    if rational_features is not None:
        if rational_features.get('schemaVersion')!='RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1':raise ValueError('RATIONAL_FEATURE_INVENTORY_REQUIRED')
        xmin,xmax,ymin,ymax=vp.bounds
        horizontal=float(Fraction(rational_features['horizontalAsymptoteY']))
        a,b=vp.screen((xmin,horizontal)),vp.screen((xmax,horizontal))
        primitive({'id':'rational-asymptote-horizontal','kind':'line','from':a,'to':b,'token':'auxiliary','layer':25,'role':'asymptote','dash':'5 4'},'line')
        singularity=rational_features['singularity'];singular_x=float(Fraction(singularity['x']))
        if singularity['kind']=='VERTICAL_POLE':
            a,b=vp.screen((singular_x,ymin)),vp.screen((singular_x,ymax))
            primitive({'id':'rational-asymptote-vertical','kind':'line','from':a,'to':b,'token':'auxiliary','layer':25,'role':'asymptote','dash':'5 4'},'line')
        elif singularity['kind']=='REMOVABLE_HOLE':
            at=vp.screen((singular_x,float(Fraction(singularity['y']))))
            rational_policy=spec['displayFacts'].get('rationalGraphPolicy',{})
            marker_radius=rational_policy.get('holeMarkerRadiusIntrinsicPx')
            if not isinstance(marker_radius,(int,float)) or isinstance(marker_radius,bool) or marker_radius<=0:raise ValueError('RATIONAL_HOLE_MARKER_POLICY_REQUIRED')
            primitive({'id':'rational-removable-hole','kind':'circle','at':at,'radius':marker_radius,'token':'indicator','layer':65,'role':'hole','fill':'#fff'},'circle')
        else:raise ValueError('INVALID_RATIONAL_SINGULARITY_KIND')
    sqrt_features=spec['displayFacts'].get('sqrtFeatures')
    if sqrt_features is not None:
        if sqrt_features.get('schemaVersion')!='SQRT_AFFINE_FEATURES_v1':raise ValueError('SQRT_ENDPOINT_INVENTORY_REQUIRED')
        policy=spec['displayFacts'].get('sqrtFeaturePolicy',{});radius=policy.get('endpointMarkerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('SQRT_ENDPOINT_MARKER_POLICY_REQUIRED')
        for index,endpoint in enumerate(sqrt_features.get('sourceEndpoints',[])):
            if endpoint.get('state')!='CLOSED':raise ValueError('UNSUPPORTED_OPEN_SQRT_SOURCE_ENDPOINT')
            at=vp.screen((float(Fraction(endpoint['x'])),float(endpoint['y'])))
            primitive({'id':'sqrt-domain-endpoint-'+str(index),'kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'domain-endpoint','fill':'#111'},'circle')
    absolute_features=spec['displayFacts'].get('absoluteFeatures')
    if absolute_features is not None:
        if absolute_features.get('schemaVersion')!='ABSOLUTE_VALUE_FEATURES_v1':raise ValueError('ABSOLUTE_VALUE_FEATURE_INVENTORY_REQUIRED')
        policy=spec['displayFacts'].get('absoluteFeaturePolicy',{});radius=policy.get('cornerMarkerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('ABSOLUTE_VALUE_CORNER_MARKER_POLICY_REQUIRED')
        corner=absolute_features.get('corner')
        if not isinstance(corner,dict) or corner.get('state')!='CLOSED':raise ValueError('UNSUPPORTED_ABSOLUTE_VALUE_CORNER_STATE')
        at=vp.screen((float(Fraction(corner['x'])),float(Fraction(corner['y']))))
        primitive({'id':'absolute-value-corner','kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'absolute-corner','fill':'#111'},'circle')
    piecewise_features=spec['displayFacts'].get('piecewiseFeatures')
    if piecewise_features is not None:
        if piecewise_features.get('schemaVersion')!='PIECEWISE_AFFINE_FEATURES_v1':raise ValueError('PIECEWISE_MARKER_INVENTORY_REQUIRED')
        policy=spec['displayFacts'].get('piecewiseFeaturePolicy',{});radius=policy.get('markerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('PIECEWISE_MARKER_POLICY_REQUIRED')
        for marker in piecewise_features.get('markers',[]):
            if marker.get('state') not in {'OPEN','CLOSED'} or marker.get('owner') not in {'LEFT','RIGHT'}:raise ValueError('INVALID_PIECEWISE_MARKER')
            at=vp.screen((float(Fraction(marker['x'])),float(Fraction(marker['y']))));fill='#fff' if marker['state']=='OPEN' else '#111'
            role='piecewise-source-endpoint' if marker.get('kind')=='SOURCE_ENDPOINT' else 'piecewise-breakpoint'
            primitive({'id':'piecewise-'+marker['id'],'kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':role,'fill':fill,'state':marker['state'],'owner':marker['owner']},'circle')
    if interval_features is not None:
        policy=spec['displayFacts'].get('intervalFeaturePolicy',{});radius=policy.get('markerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('POLYNOMIAL_INTERVAL_MARKER_POLICY_REQUIRED')
        for endpoint in interval_features.get('endpoints',[]):
            if endpoint.get('state') not in {'OPEN','CLOSED'} or endpoint.get('side') not in {'START','END'}:raise ValueError('INVALID_POLYNOMIAL_INTERVAL_ENDPOINT')
            # A closed end is a filled dot, an open end a hollow one, drawn over the curve end.
            at=vp.screen((_exact_float(endpoint['x']),_exact_float(endpoint['y'])))
            primitive({'id':'interval-endpoint-'+endpoint['side'].lower(),'kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'interval-endpoint','fill':'#fff' if endpoint['state']=='OPEN' else '#111','state':endpoint['state']},'circle')
    if reference_interval_features is not None:
        policy=spec['displayFacts'].get('referenceIntervalFeaturePolicy',{});radius=policy.get('markerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('REFERENCE_INTERVAL_MARKER_POLICY_REQUIRED')
        for row in reference_interval_features:
            for side,state,x_text,y_text in (('start',row['startState'],row['lo'],row['startY']),('end',row['endState'],row['hi'],row['endY'])):
                if state not in ('OPEN','CLOSED'):raise ValueError('INVALID_REFERENCE_INTERVAL_ENDPOINT')
                at=vp.screen((_exact_float(x_text),_exact_float(y_text)))
                primitive({'id':'ref-endpoint-'+row['id']+'-'+side,'kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'reference-endpoint','fill':'#fff' if state=='OPEN' else '#111','state':state},'circle')
    exponential_features=spec['displayFacts'].get('exponentialFeatures')
    if exponential_features is not None:
        if exponential_features.get('schemaVersion')!='EXPONENTIAL_AFFINE_FEATURES_v1':raise ValueError('EXPONENTIAL_FEATURE_INVENTORY_REQUIRED')
        policy=spec['displayFacts'].get('exponentialFeaturePolicy',{});radius=policy.get('referenceMarkerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('EXPONENTIAL_REFERENCE_MARKER_POLICY_REQUIRED')
        y=float(Fraction(exponential_features['horizontalAsymptote']['y']));xmin,xmax,ymin,ymax=vp.bounds
        primitive({'id':'exponential-horizontal-asymptote','kind':'line','from':vp.screen((xmin,y)),'to':vp.screen((xmax,y)),'token':'auxiliary','layer':25,'role':'exponential-asymptote','dash':'5 4'},'line')
        reference=exponential_features['referencePoint'];at=vp.screen((float(Fraction(reference['x'])),float(Fraction(reference['y']))))
        primitive({'id':'exponential-reference-point','kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'exponential-reference','fill':'#111','state':'CLOSED'},'circle')
    logarithmic_features=spec['displayFacts'].get('logarithmicFeatures')
    if logarithmic_features is not None:
        if logarithmic_features.get('schemaVersion')!='LOGARITHMIC_AFFINE_FEATURES_v1':raise ValueError('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED')
        policy=spec['displayFacts'].get('logarithmicFeaturePolicy',{});radius=policy.get('referenceMarkerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('LOGARITHMIC_REFERENCE_MARKER_POLICY_REQUIRED')
        x=float(Fraction(logarithmic_features['naturalDomainBoundaryX']));xmin,xmax,ymin,ymax=vp.bounds
        primitive({'id':'logarithmic-domain-boundary','kind':'line','from':vp.screen((x,ymin)),'to':vp.screen((x,ymax)),'token':'auxiliary','layer':25,'role':'logarithmic-domain-boundary','dash':'5 4'},'line')
        reference=logarithmic_features['referencePoint'];at=vp.screen((float(Fraction(reference['x'])),float(Fraction(reference['y']))))
        primitive({'id':'logarithmic-reference-point','kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'logarithmic-reference','fill':'#111','state':'CLOSED'},'circle')
    trig_features=spec['displayFacts'].get('trigFeatures')
    if trig_features is not None:
        if trig_features.get('schemaVersion')!='TRIGONOMETRIC_FEATURES_v1':raise ValueError('TRIG_FEATURE_INVENTORY_REQUIRED')
        policy=spec['displayFacts'].get('trigFeaturePolicy',{});radius=policy.get('markerRadiusIntrinsicPx')
        if not isinstance(radius,(int,float)) or isinstance(radius,bool) or radius<=0:raise ValueError('TRIG_MARKER_POLICY_REQUIRED')
        if trig_features.get('function') in {'SIN','COS'}:
            for feature in trig_features.get('phasePoints',[]):
                at=vp.screen((float(Fraction(feature['xPiMultiple']))*math.pi,float(Fraction(feature['y']))))
                primitive({'id':'trig-'+feature['id'],'kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'trig-feature','fill':'#111','owner':feature['id'],'featureKind':feature['kind']},'circle')
        elif trig_features.get('function')=='TAN':
            xmin,xmax,ymin,ymax=vp.bounds
            for pole in trig_features.get('poles',[]):
                x=float(Fraction(pole['xPiMultiple']))*math.pi
                primitive({'id':'trig-'+pole['id'],'kind':'line','from':vp.screen((x,ymin)),'to':vp.screen((x,ymax)),'token':'auxiliary','layer':25,'role':'trig-pole','dash':'5 4','poleSide':pole['side']},'line')
            reference=trig_features['referencePoint'];at=vp.screen((float(Fraction(reference['xPiMultiple']))*math.pi,float(Fraction(reference['y']))))
            primitive({'id':'trig-reference-point','kind':'circle','at':at,'radius':radius,'token':'indicator','layer':65,'role':'trig-reference','fill':'#111'},'circle')
    point_marks=[vp.screen(geometry[v['id']]) for v in spec['objects'] if v['kind']=='POINT']
    mark_spots=[]   # where equal ticks / parallel arrows already stand: a second mark on the same segment keeps clear of the first
    by_id={v['id']:v for v in spec['objects']}
    tangent_lines={v['refs'][0] for v in spec['objects'] if v['kind']=='TANGENT'}
    # Drawn lines ax+by+c=0, for SEGMENTs that lie on one (they would vanish under the heavier line stroke).
    drawn_lines=[(v['id'],[float(c) for c in v['coefficients']]) for v in spec['objects'] if v['kind']=='LINE']
    graph_index=0
    named={v.get('target') for v in spec['objects'] if v['kind'] in {'POINT_NAME','COORDINATE_LABEL'}}
    for obj in spec['objects']:
        oid=obj['id'];kind=obj['kind'];value=geometry.get(oid)
        if kind=='POINT':
            primitive({'id':oid,'kind':'circle','at':vp.screen(value),'radius':tokens['criticalPoint'] if obj.get('priority')==0 else tokens['point'],'layer':70,'role':'point','token':'indicator'},'point')
            point_names=semantic.get('publication',{}).get('sourcePointLabels',{})
            point_name=point_names.get(oid,obj.get('name',oid))
            if oid not in named and point_name is not None:labels.append({'id':oid+'-name','kind':'POINT_NAME','target':oid,'text':point_name,'at':vp.screen(value),'font':tokens['pointName'],'priority':obj.get('priority',1)})
        elif kind in {'LINE','AUXILIARY_LINE'}:
            hits=clip_line(value,vp.bounds)
            if len(hits)==2:primitive({'id':oid,'kind':'line','from':vp.screen(hits[0]),'to':vp.screen(hits[1]),'token':'auxiliary' if kind=='AUXILIARY_LINE' else 'tangent' if oid in tangent_lines else 'mainShape','layer':20 if kind=='AUXILIARY_LINE' else 40,'role':'auxiliary' if kind=='AUXILIARY_LINE' else 'line','dash':'4 3' if kind=='AUXILIARY_LINE' else ''},'auxiliary' if kind=='AUXILIARY_LINE' else 'line')
        elif kind in {'SEGMENT','LEADER_LINE'}:
            a,b=vp.screen(value[0]),vp.screen(value[1]);origin=vp.screen((0,0));overlap=None
            # A SEGMENT lying on a displayed axis (both ends within 0.5 screen px of it) is hidden under the thinner axis stroke: draw it heavier and above the axis.
            if kind=='SEGMENT':
                if show_x and abs(a[1]-origin[1])<=.5 and abs(b[1]-origin[1])<=.5:overlap='x'
                elif show_y and abs(a[0]-origin[0])<=.5 and abs(b[0]-origin[0])<=.5:overlap='y'
                # The same for a SEGMENT on a drawn line (both ends within 0.5 screen px of it): heavier and above the line.
                elif any(math.hypot(l[0],l[1])>0 and all(abs(l[0]*p[0]+l[1]*p[1]+l[2])/math.hypot(l[0],l[1])*vp.sx<=.5 for p in value) for _,l in drawn_lines):overlap='line'
            primitive({'id':oid,'kind':'line','from':a,'to':b,'token':'leaderLine' if kind=='LEADER_LINE' else 'axisOverlapShape' if overlap else 'secondaryShape','layer':80 if kind=='LEADER_LINE' else 45 if overlap=='line' else 35 if overlap else 30,'role':'leader' if kind=='LEADER_LINE' else 'line',**({'axisOverlap':overlap} if overlap else {}),**({'dash':'6 4'} if kind=='SEGMENT' and obj.get('dash') else {})},'leader' if kind=='LEADER_LINE' else 'line')
            if kind=='SEGMENT' and obj.get('arrow'):
                # A ray / extension: arrowheads whose tips stand exactly on the segment's end points (START = the first point, END = the second).
                if obj['arrow'] not in {'START','END','BOTH'}:raise ValueError('INVALID_SEGMENT_ARROW')
                length=math.dist(a,b)
                if length<=24:raise ValueError('MARK_SEGMENT_TOO_SHORT:'+oid)
                for end,(tip,back) in {'START':(a,b),'END':(b,a)}.items():
                    if obj['arrow']!='BOTH' and obj['arrow']!=end:continue
                    ux,uy=(tip[0]-back[0])/length,(tip[1]-back[1])/length
                    base=(tip[0]-ux*10,tip[1]-uy*10)
                    primitive({'id':oid+'-arrow-'+end.lower(),'kind':'polygon','points':[tip,(base[0]-uy*3.6,base[1]+ux*3.6),(base[0]+uy*3.6,base[1]-ux*3.6)],'token':'indicator','layer':62,'role':'indicator','fill':'#111','mark':'arrow','markId':oid,'markEnd':end},'curve')
        elif kind=='CIRCLE':
            primitive({'id':oid,'kind':'circle','at':vp.screen(value.center),'radius':value.radius*vp.sx,'token':'mainShape','layer':40,'role':'circle'},'circle')
        elif kind=='CIRCULAR_ARC':
            primitive({'id':oid,'kind':'polyline','points':[vp.screen(p) for p in value.sample_points()],
                       'token':'axisOverlapShape' if obj.get('highlight') else 'mainShape','layer':46 if obj.get('highlight') else 40,'role':'circularArc',
                       'ownerPoints':[obj['startPoint'],obj['endPoint']],
                       'centerPoint':obj['centerPoint'],'ownerRadius':value.radius,'sweep':value.sweep,
                       **({'mark':'arc','markId':oid} if obj.get('highlight') else {})},'curve')
            if obj.get('labelText') is not None:
                middle=value.start_angle+value.sweep_radians/2;outward=vp.screen((value.center[0]+value.radius*math.cos(middle),value.center[1]+value.radius*math.sin(middle)))
                centre=vp.screen(value.center);ox,oy=outward[0]-centre[0],outward[1]-centre[1];norm=math.hypot(ox,oy)
                # Only directions that point away from the circle's centre: the label names the arc from outside.
                def alignment(direction):
                    dx=1 if 'E' in direction else -1 if 'W' in direction else 0;dy=1 if 'S' in direction else -1 if 'N' in direction else 0
                    return -(dx*ox+dy*oy)/(norm*math.hypot(dx,dy))
                directions=sorted(DIRECTIONS,key=alignment)
                labels.append(mark_label(oid+'-label',oid,obj['labelText'],obj.get('labelKind','DEGREE'),outward,{'directions':tuple(directions[:5]),'gaps':(14,24,32,48),'leaderOwned':[oid]}))
        elif kind=='FUNCTION_GRAPH':
            result=sample(obj['expression'],obj['domain'],vp,critical_x=obj.get('criticalX',[]),breaks=obj.get('breaks',[]))
            sampling.append({'id':oid,**{k:v for k,v in result.items() if k!='branches'}})
            # The pieces of one piecewise function (branch PIECE_n) are all the main curve, not a first curve and secondary ones.
            main=graph_index==0 or str(obj.get('branch','')).startswith('PIECE_')
            for index,branch in enumerate(result['branches']):
                primitive({'id':oid+'-branch-'+str(index),'kind':'polyline','points':[vp.screen(p) for p in branch],'token':'mainCurve' if main else 'secondaryCurve','layer':40 if main else 35,'role':'curve',**({'branch':obj['branch']} if 'branch' in obj else {})},'curve')
            graph_index+=1
        elif kind=='PERPENDICULAR_MARK':
            at=vp.screen(obj['at']);vectors=[]
            for ref in obj['refs']:
                line=geometry[ref];dx,dy=line.b*vp.sx,line.a*vp.sy;norm=math.hypot(dx,dy)
                vectors.append((dx/norm*tokens['rightAngleSize'],dy/norm*tokens['rightAngleSize']))
            u,v=vectors
            pts=[(at[0]+u[0],at[1]+u[1]),(at[0]+u[0]+v[0],at[1]+u[1]+v[1]),(at[0]+v[0],at[1]+v[1])]
            primitive({'id':oid,'kind':'polyline','points':pts,'token':'indicator','layer':60,'role':'indicator'},'curve')
        elif kind=='ANGLE_MARK':
            if not vp.equal:raise ValueError('ANGLE_REQUIRES_EQUAL_UNITS')
            a,v,b=(vp.screen(geometry[r]) for r in obj['refs']);start=math.atan2(a[1]-v[1],a[0]-v[0]);end=math.atan2(b[1]-v[1],b[0]-v[0]);delta=(end-start+math.pi)%(2*math.pi)-math.pi
            if obj.get('outer') is True:delta=delta-2*math.pi if delta>0 else delta+2*math.pi
            pts=[(v[0]+tokens['angleArcRadius']*math.cos(start+delta*i/32),v[1]+tokens['angleArcRadius']*math.sin(start+delta*i/32)) for i in range(33)]
            if oid in spec['displayFacts'].get('squareAngleIds',[]):
                if abs(obj['value']-90)>1e-9:raise ValueError('SQUARE_REQUIRES_RIGHT_ANGLE')
                size=tokens['rightAngleSize'];u=[(a[i]-v[i])/math.dist(a,v)*size for i in range(2)];w=[(b[i]-v[i])/math.dist(b,v)*size for i in range(2)]
                pts=[(v[0]+u[0],v[1]+u[1]),(v[0]+u[0]+w[0],v[1]+u[1]+w[1]),(v[0]+w[0],v[1]+w[1])]
            elif obj.get('arcs') is not None:
                # Textbook angle arcs: 1-3 concentric arcs (equal angles share the count) around the vertex, from one ray to the other.
                count=obj['arcs'];rays=min(math.dist(a,v),math.dist(b,v))
                if isinstance(count,bool) or not isinstance(count,int) or not 1<=count<=3:raise ValueError('ANGLE_ARC_COUNT_INVALID')
                ring=obj.get('ring',1);first=min(28.0,max(16.0,.25*rays))+9.0*(ring-1)
                if rays<first+4.5*(count-1)+8:raise ValueError('MARK_SEGMENT_TOO_SHORT:'+oid)
                steps=max(16,math.ceil(abs(math.degrees(delta))/4));outer_radius=first+4.5*(count-1)
                for k in range(count):
                    radius=first+4.5*k
                    primitive({'id':oid+'-arc-'+str(k+1),'kind':'polyline','points':[(v[0]+radius*math.cos(start+delta*i/steps),v[1]+radius*math.sin(start+delta*i/steps)) for i in range(steps+1)],'token':'secondaryShape','layer':60,'role':'indicator','ownerPoints':obj['refs'],'mark':'angle','markId':oid,'markIndex':k+1,'markCount':count,'markSide':'OUTER' if obj.get('outer') is True else 'INNER'},'curve')
                if obj.get('labelText') is not None:
                    middle=start+delta/2;anchor=(v[0]+outer_radius*math.cos(middle),v[1]+outer_radius*math.sin(middle))
                    labels.append(mark_label(oid+'-label',oid,obj['labelText'],obj.get('labelKind','DEGREE'),anchor,{'wedgeSearch':{'vertex':list(v),'bisector':middle,'start':start,'delta':delta,'rMin':outer_radius+4.0,'rMax':max(outer_radius+12.0,min(outer_radius+44.0,.9*rays)),'rFar':max(outer_radius+12.0,.92*rays),'arcRadius':outer_radius},'gaps':(24,32,48,64),'leaderOwned':[oid+'-arc-'+str(k+1) for k in range(count)]}))
                continue
            primitive({'id':oid,'kind':'polyline','points':pts,'token':'indicator','layer':60,'role':'indicator'},'curve')
        elif kind in {'EQUAL_MARK','PARALLEL_MARK'}:
            ends=[(vp.screen(geometry[r][0]),vp.screen(geometry[r][1])) for r in obj['refs']];count=obj['count']
            reference=(ends[0][1][0]-ends[0][0][0],ends[0][1][1]-ends[0][0][1])
            for ref,(p,q) in zip(obj['refs'],ends):
                length=math.dist(p,q)
                if length<30+6*count:raise ValueError('MARK_SEGMENT_TOO_SHORT:'+ref)
                d=((q[0]-p[0])/length,(q[1]-p[1])/length);n=(-d[1],d[0])
                # The marks sit at the middle of the segment, or at the nearest of a few other places that keeps clear of any displayed point (a midpoint M, a foot H).
                spots=[.5,.3,.7,.2,.8];room=lambda t:min([math.dist((p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t),at) for at in [*point_marks,*mark_spots] if math.dist(at,p)>1e-6 and math.dist(at,q)>1e-6]+[1e9])
                spot=next((t for t in spots if room(t)>=10*count+12),max(spots,key=room))
                mid=(p[0]+(q[0]-p[0])*spot,p[1]+(q[1]-p[1])*spot);mark_spots.append(mid)
                if kind=='PARALLEL_MARK' and d[0]*reference[0]+d[1]*reference[1]<0:d=(-d[0],-d[1]);n=(-d[1],d[0])
                for i in range(count):
                    shift=(i-(count-1)/2)*(5 if kind=='EQUAL_MARK' else 6);c=(mid[0]+d[0]*shift,mid[1]+d[1]*shift)
                    if kind=='EQUAL_MARK':
                        primitive({'id':oid+'-'+ref+'-'+str(i+1),'kind':'line','from':(c[0]-n[0]*5.5,c[1]-n[1]*5.5),'to':(c[0]+n[0]*5.5,c[1]+n[1]*5.5),'token':'secondaryShape','layer':55,'role':'indicator','mark':'equal','markId':oid,'markSegment':ref,'markIndex':i+1,'markCount':count},'curve')
                    else:
                        tip=(c[0]+d[0]*3.5,c[1]+d[1]*3.5);back=(c[0]-d[0]*3.5,c[1]-d[1]*3.5)
                        primitive({'id':oid+'-'+ref+'-'+str(i+1),'kind':'polyline','points':[(back[0]+n[0]*4.5,back[1]+n[1]*4.5),tip,(back[0]-n[0]*4.5,back[1]-n[1]*4.5)],'token':'secondaryShape','layer':55,'role':'indicator','mark':'parallel','markId':oid,'markSegment':ref,'markIndex':i+1,'markCount':count},'curve')
        elif kind in {'POINT_NAME','COORDINATE_LABEL','EQUATION_LABEL','GRAPH_ANNOTATION','CONDITION_BOX','LENGTH_LABEL'}:
            label={**obj,'font':tokens['pointName'] if kind=='POINT_NAME' else tokens['coordinateLabel'] if kind=='COORDINATE_LABEL' else tokens['conditionBox'] if kind=='CONDITION_BOX' else tokens['mathLabel'],'priority':obj.get('priority',1 if kind in {'POINT_NAME','CONDITION_BOX'} else 2)}
            label['at']=vp.screen(geometry[obj['target']]) if kind in {'POINT_NAME','COORDINATE_LABEL'} else vp.screen(obj['at'])
            if 'alternateAt' in obj:label['alternateAt']=[list(vp.screen(value)) for value in obj['alternateAt']]
            if kind=='COORDINATE_LABEL':
                exact=[exact_coordinate(v,n,bool(obj.get('sourceDecimalEvidence')),symbols) for v,n in zip(obj['exact'],geometry[obj['target']])]
                label['text']='('+','.join(exact)+')';label['panelText']=obj['target']+': '+label['text']
                label['panelPrefix']=obj['target']+': '
                trees=[parse(v) for v in obj['exact']]
                trees=[parse(str(value)) if isinstance(value:=evaluate(tree,symbols),Fraction) else tree for tree in trees]
                label.update(markup='('+','.join(serialize(tree,'svg') for tree in trees)+')',tex='('+','.join(serialize(tree,'tex') for tree in trees)+')',math=True)
            elif kind=='CONDITION_BOX':
                rows=[{'text':row,'math':False} if isinstance(row,str) else row for row in obj['lines']]
                label['renderedLines']=[{**row,'markup':serialize(parse(row['text']),'svg') if row['math'] else None} for row in rows]
                label['lines']=[serialize(parse(row['text']),'plain') if row['math'] else row['text'] for row in rows]
                label['text']='\n'.join(label['lines']);label['hasMath']=any(v['math'] for v in rows)
            elif kind in {'EQUATION_LABEL','LENGTH_LABEL'} or obj.get('math'):
                tree=parse(obj['text']);notation=spec['displayFacts'].get('notationByLabel',{}).get(oid,{})
                entity=notation.get('entity')
                if entity and tree.kind=='binary' and tree.value=='=' and tree.args[0].kind=='symbol' and tree.args[0].value==entity:tree=Expr('binary','=',(Expr('entity',entity),tree.args[1]))
                if notation.get('unit'):
                    if tree.kind=='binary' and tree.value=='=':tree=Expr('binary','=',(tree.args[0],Expr('unit',notation['unit'],(tree.args[1],))))
                    else:tree=Expr('unit',notation['unit'],(tree,))
                label.update(text=serialize(tree,'plain'),markup=serialize(tree,'svg'),tex=serialize(tree,'tex'),sourceMath=obj['text'],math=True)
                label['layoutText']=''.join(ET.fromstring('<text>'+label['markup']+'</text>').itertext())
                if kind=='LENGTH_LABEL' and abs(float(evaluate(parse(obj['text'])))-obj['value'])>1e-9:raise ValueError('DISPLAY_LENGTH_PARITY_FAIL')
            labels.append(label)
    equation_centers=spec['displayFacts'].get('equationLabelCenters',{})
    if not isinstance(equation_centers,dict):raise ValueError('INVALID_EQUATION_LABEL_CENTERS')
    for label_id,center in equation_centers.items():
        matches=[label for label in labels if label['id']==label_id and label['kind']=='EQUATION_LABEL']
        if len(matches)!=1 or not isinstance(center,list) or len(center)!=2:raise ValueError('INVALID_EQUATION_LABEL_CENTER')
        matches[0]['candidateCenters']=[[finite(value) for value in center]]
    prepared = {'primitives':primitives,'title':spec.get('title','도형과 핵심 점'),'factHash':sha(canonical(spec['sourceFacts']))}
    if 'publication' in semantic:
        from .publication import decorate
        decorate(prepared, labels, obstacles, vp, semantic)
    return prepared,labels,obstacles,vp,semantic,sampling

def build(spec,measurements=None,fragments=None,strict_measured_fragments=False):
    prepared,labels,obstacles,vp,semantic,sampling=prepare(spec)
    if strict_measured_fragments:
        if not isinstance(measurements,dict) or not isinstance(fragments,dict):raise ValueError('BROWSER_MEASURED_TYPOGRAPHY_REQUIRED')
        label_ids={label['id'] for label in labels}
        if set(fragments)!=label_ids:raise ValueError('FROZEN_FRAGMENT_INVENTORY_MISMATCH')
        if set(measurements)-label_ids:raise ValueError('BROWSER_MEASUREMENT_INVENTORY_MISMATCH')
        missing_measurements=sorted(label_ids-set(measurements))
        if missing_measurements:raise ValueError('BROWSER_LABEL_MEASUREMENT_REQUIRED:'+missing_measurements[0])
        for label_id,fragment in fragments.items():
            if not isinstance(fragment,dict):raise ValueError('INVALID_FROZEN_FRAGMENT:'+label_id)
            fragment_hash=fragment.get('fragmentSha256');intrinsic=fragment.get('intrinsic')
            if (fragment.get('labelId')!=label_id or not fragment.get('owner') or not fragment.get('factRole')
                or not isinstance(fragment.get('svg'),str) or '<svg' not in fragment['svg']
                or not isinstance(fragment_hash,str) or not fragment_hash.startswith('sha256:')
                or len(fragment_hash)!=71 or not all(c in '0123456789abcdef' for c in fragment_hash[7:])
                or not isinstance(intrinsic,dict)):
                raise ValueError('INVALID_FROZEN_FRAGMENT:'+label_id)
            if fragment_hash!='sha256:'+hashlib.sha256(fragment['svg'].encode('utf-8')).hexdigest():raise ValueError('FROZEN_FRAGMENT_HASH_MISMATCH:'+label_id)
            try:intrinsic_width=finite(intrinsic.get('width'));intrinsic_height=finite(intrinsic.get('height'))
            except ValueError:raise ValueError('INVALID_FROZEN_FRAGMENT:'+label_id) from None
            if intrinsic_width<=0 or intrinsic_height<=0:raise ValueError('INVALID_FROZEN_FRAGMENT:'+label_id)
        for label in labels:
            if label['kind'] in {'POINT_NAME','COORDINATE_LABEL'}:
                fragment=fragments[label['id']]
                if fragment['owner']!=label.get('target'):raise ValueError('FROZEN_FRAGMENT_OWNER_MISMATCH:'+label['id'])
                label['measuredFragmentSha256']=fragment['fragmentSha256']
                label['measuredFragmentOwner']=fragment['owner']
                label['measuredFactRole']=fragment['factRole']
            elif label['kind']=='TICK_LABEL' and fragments[label['id']]['owner']!=label['tickId']:
                raise ValueError('FROZEN_FRAGMENT_TICK_OWNER_MISMATCH:'+label['id'])
    if fragments is not None:
        prepared['fragmentProfile']='fragment-publication-spike-v1'
        for label in labels:
            label['allowSuppress']=False
            if label['kind']=='GRAPH_ANNOTATION':
                label['gaps']=(12,20,32,48)
                if label['id'].startswith('tick-y-'):label['directions']=('W','E');label['priority']=0
                elif label['id'].startswith('tick-x-'):label['directions']=('S','N');label['priority']=0
    label_margin=12 if fragments is not None else vp.margin
    safe=Box(label_margin,label_margin,vp.width-2*label_margin,vp.height-2*label_margin)
    panel=Box(vp.width-vp.margin-vp.panel,vp.margin,vp.panel,vp.height-2*vp.margin)
    result=layout(labels,obstacles,safe,panel,measurements,require_measurements=strict_measured_fragments)
    if fragments is not None:result['basis']='BROWSER_MEASURED_FROZEN_FRAGMENTS'
    if 'publication' in semantic:
        from .publication import finalize
        finalize(prepared, result, obstacles)
    svg=compose(prepared,result,vp,fragments=fragments)
    from .tikz_adapter import draft
    tex=draft(prepared,result)
    witness={'engineVersion':ENGINE_VERSION,'authority':'BUILD_SIDE_ONLY','publicationAuthorized':False,
        'classification':'STANDARD','visualSpecSha256':sha(canonical(spec)),'normalizedSvgSha256':sha(svg),
        'texSha256':sha(tex),'coordinateModel':vp.model(),'relations':semantic['relations'],
        'layout':result,'sampling':sampling,'semanticStatus':'PASS',
        'status':'POLISH_REQUIRED' if result['unresolved'] or any(v['status']!='PASS' for v in sampling) else 'CANDIDATE_REQUIRES_QA'}
    if 'publication' in semantic:
        witness['publicationProfile'] = prepared['publicationProfile']
        witness['requiredGates'] = ['INDEPENDENT_PUBLICATION_AUDIT','RENDERED_LAYOUT','ARCHIVE_MODE_SOL_390','INDEPENDENT_VISUAL_REVIEW']
        witness['publicationSpecSha256'] = sha(canonical(spec['publication']))
        coordinate_evidence = spec['sourceFacts']['coordinateEvidence']
        witness['coordinateEvidenceMode'] = coordinate_evidence['mode']
        witness['coordinateEvidenceSha256'] = sha(canonical(coordinate_evidence))
        witness['texStatus'] = 'LEGACY_DRAFT_NOT_PUBLICATION_PARITY'
    witness['semanticWitnessSha256']=sha(canonical({'sourceFacts':spec['sourceFacts'],'derivedFacts':spec['derivedFacts'],'displayFacts':spec['displayFacts'],'objects':spec['objects'],'relations':semantic['relations']}))
    return {'svg':svg,'tex':tex,'witness':witness,'spec':spec}

def output_root(config):
    return resolve_output(config)

def write_candidate(spec,config,measurements=None):
    root=output_root(config);oid=spec['id']
    if not oid or not all(c.isalnum() or c in '_-' for c in oid):raise ValueError('INVALID_SPEC_ID')
    folder=(root/'candidate'/oid).resolve()
    if not folder.is_relative_to(root):raise ValueError('PRODUCTION_WRITE_FORBIDDEN')
    result=build(spec,measurements);folder.mkdir(parents=True,exist_ok=True)
    for name,value in [('visual.svg',result['svg']),('visual.tex',result['tex']),('witness.json',json.dumps(result['witness'],ensure_ascii=False,indent=2)+'\n'),('spec.json',json.dumps(spec,ensure_ascii=False,indent=2)+'\n')]:
        target=(folder/name).resolve()
        if not target.is_relative_to(root):raise ValueError('PRODUCTION_WRITE_FORBIDDEN')
        target.write_text(value,encoding='utf-8',newline='\n')
    return result

def cli():
    p=argparse.ArgumentParser();p.add_argument('--config',required=True);p.add_argument('--spec',required=True);p.add_argument('--measurements');a=p.parse_args()
    config=json.loads(Path(a.config).read_text(encoding='utf-8'));spec=json.loads(Path(a.spec).read_text(encoding='utf-8'))
    measurements=json.loads(Path(a.measurements).read_text(encoding='utf-8')) if a.measurements else None
    result=write_candidate(spec,config,measurements);print(json.dumps({'status':result['witness']['status'],'id':spec['id']}))

if __name__=='__main__':cli()
