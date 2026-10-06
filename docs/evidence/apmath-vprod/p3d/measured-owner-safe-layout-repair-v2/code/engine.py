"""Pure STANDARD builder and candidate-only CLI orchestration."""
import argparse
import hashlib
import json
import math
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path
from . import ENGINE_VERSION
from .semantic_model import validate
from .geometry_model import Circle,Line,clip_line,finite
from .viewport import for_spec
from .function_sampling import sample
from .math_expression import Expr,parse,serialize,evaluate,exact_coordinate
from .label_layout import Box,layout,approximate_size
from .svg_composer import compose
from .style_tokens import load
from .config import resolve_output

ROOT=Path(__file__).resolve().parents[4]

def canonical(value):return json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False)
def sha(value):return hashlib.sha256(value.encode('utf-8')).hexdigest()

def prepare(spec):
    semantic=validate(spec);spec=semantic['spec'];geometry=semantic['geometry'];tokens=load();critical=[]
    symbols={name:evaluate(parse(expression)) for name,expression in spec['displayFacts'].get('symbolDefinitions',{}).items()}
    for name,value in symbols.items():
        if not name.isalpha() or isinstance(value,(bool,tuple,complex)) or not math.isfinite(float(value)):raise ValueError('INVALID_EXACT_SYMBOL_DEFINITION')
    for value in geometry.values():
        if isinstance(value,Circle):
            x,y=value.center;r=value.radius;critical.extend([(x-r,y-r),(x+r,y+r)])
        elif isinstance(value,tuple) and len(value)==2 and isinstance(value[0],float):critical.append(value)
        elif isinstance(value,tuple):critical.extend(value)
    if spec.get('axes',True):critical.extend([(0,0),(1,0),(0,1)])
    vp=for_spec(spec,critical)
    if not vp.equal and any(isinstance(v,Circle) for v in geometry.values()):raise ValueError('CIRCLE_REQUIRES_EQUAL_UNITS')
    primitives=[];labels=[];obstacles=[];sampling=[]
    def primitive(p,obstacle=None):
        primitives.append(p)
        if obstacle:obstacles.append({'id':p['id'],'kind':obstacle,'geometry':p.get('points', [p.get('from'),p.get('to')]) if obstacle not in {'point','circle'} else (*p['at'],p['radius'])})
    if spec.get('axes',True):
        xmin,xmax,ymin,ymax=vp.bounds
        for oid,a,b in [('x-axis',(xmin,0),(xmax,0)),('y-axis',(0,ymin),(0,ymax))]:
            primitive({'id':oid,'kind':'line','from':vp.screen(a),'to':vp.screen(b),'token':'axis','layer':30,'role':'axis'},'axis')
        for oid,at,delta in [('model-x-unit',(1,0),(0,4)),('model-y-unit',(0,1),(-4,0))]:
            p=vp.screen(at);primitive({'id':oid,'kind':'line','from':p,'to':(p[0]+delta[0],p[1]+delta[1]),'token':'indicator','layer':30,'role':'tick'},'line')
        for oid,at,text in [('axis-x',(xmax,0),'x'),('axis-y',(0,ymax),'y')]:
            labels.append({'id':oid,'kind':'GRAPH_ANNOTATION','at':vp.screen(at),'text':text,'font':13,'priority':4,'allowSuppress':True,'math':True})
        for axis,lo,hi in [('x',xmin,xmax),('y',ymin,ymax)]:
            raw=(hi-lo)/5;power=10**math.floor(math.log10(raw));step=next(v*power for v in (1,2,5,10) if v*power>=raw)
            for index in range(math.ceil(lo/step),math.floor(hi/step)+1):
                value=index*step
                if abs(value)<1e-12:continue
                at=(value,0) if axis=='x' else (0,value);p=vp.screen(at);delta=(0,4) if axis=='x' else (-4,0)
                oid=f'tick-{axis}-{index}'
                if abs(value-1)>1e-12:primitive({'id':oid,'kind':'line','from':p,'to':(p[0]+delta[0],p[1]+delta[1]),'token':'indicator','layer':30,'role':'tick'},'line')
                text=(str(int(value)) if float(value).is_integer() else f'{value:.10g}').replace('-','−')
                labels.append({'id':oid+'-label','kind':'GRAPH_ANNOTATION','target':axis+'-axis','at':p,'text':text,'font':tokens['tickLabel'],'priority':4,'allowSuppress':True,'preferred':'S' if axis=='x' else 'W','gaps':(8,12)})
    by_id={v['id']:v for v in spec['objects']}
    tangent_lines={v['refs'][0] for v in spec['objects'] if v['kind']=='TANGENT'}
    graph_index=0
    named={v.get('target') for v in spec['objects'] if v['kind']=='POINT_NAME'}
    for obj in spec['objects']:
        oid=obj['id'];kind=obj['kind'];value=geometry.get(oid)
        if kind=='POINT':
            primitive({'id':oid,'kind':'circle','at':vp.screen(value),'radius':tokens['criticalPoint'] if obj.get('priority')==0 else tokens['point'],'layer':70,'role':'point','token':'indicator'},'point')
            if oid not in named:labels.append({'id':oid+'-name','kind':'POINT_NAME','target':oid,'text':obj.get('name',oid),'at':vp.screen(value),'font':tokens['pointName'],'priority':obj.get('priority',1)})
        elif kind in {'LINE','AUXILIARY_LINE'}:
            hits=clip_line(value,vp.bounds)
            if len(hits)==2:primitive({'id':oid,'kind':'line','from':vp.screen(hits[0]),'to':vp.screen(hits[1]),'token':'auxiliary' if kind=='AUXILIARY_LINE' else 'tangent' if oid in tangent_lines else 'mainShape','layer':20 if kind=='AUXILIARY_LINE' else 40,'role':'auxiliary' if kind=='AUXILIARY_LINE' else 'line','dash':'4 3' if kind=='AUXILIARY_LINE' else ''},'auxiliary' if kind=='AUXILIARY_LINE' else 'line')
        elif kind in {'SEGMENT','LEADER_LINE'}:
            primitive({'id':oid,'kind':'line','from':vp.screen(value[0]),'to':vp.screen(value[1]),'token':'leaderLine' if kind=='LEADER_LINE' else 'secondaryShape','layer':80 if kind=='LEADER_LINE' else 30,'role':'leader' if kind=='LEADER_LINE' else 'line'},'leader' if kind=='LEADER_LINE' else 'line')
        elif kind=='CIRCLE':
            primitive({'id':oid,'kind':'circle','at':vp.screen(value.center),'radius':value.radius*vp.sx,'token':'mainShape','layer':40,'role':'circle'},'circle')
        elif kind=='FUNCTION_GRAPH':
            result=sample(obj['expression'],obj['domain'],vp,critical_x=obj.get('criticalX',[]),breaks=obj.get('breaks',[]))
            sampling.append({'id':oid,**{k:v for k,v in result.items() if k!='branches'}})
            for index,branch in enumerate(result['branches']):
                primitive({'id':oid+'-branch-'+str(index),'kind':'polyline','points':[vp.screen(p) for p in branch],'token':'mainCurve' if graph_index==0 else 'secondaryCurve','layer':40 if graph_index==0 else 35,'role':'curve'},'curve')
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
            pts=[(v[0]+tokens['angleArcRadius']*math.cos(start+delta*i/32),v[1]+tokens['angleArcRadius']*math.sin(start+delta*i/32)) for i in range(33)]
            if oid in spec['displayFacts'].get('squareAngleIds',[]):
                if abs(obj['value']-90)>1e-9:raise ValueError('SQUARE_REQUIRES_RIGHT_ANGLE')
                size=tokens['rightAngleSize'];u=[(a[i]-v[i])/math.dist(a,v)*size for i in range(2)];w=[(b[i]-v[i])/math.dist(b,v)*size for i in range(2)]
                pts=[(v[0]+u[0],v[1]+u[1]),(v[0]+u[0]+w[0],v[1]+u[1]+w[1]),(v[0]+w[0],v[1]+w[1])]
            primitive({'id':oid,'kind':'polyline','points':pts,'token':'indicator','layer':60,'role':'indicator'},'curve')
        elif kind in {'POINT_NAME','COORDINATE_LABEL','EQUATION_LABEL','GRAPH_ANNOTATION','CONDITION_BOX','LENGTH_LABEL'}:
            label={**obj,'font':tokens['pointName'] if kind=='POINT_NAME' else tokens['coordinateLabel'] if kind=='COORDINATE_LABEL' else tokens['conditionBox'] if kind=='CONDITION_BOX' else tokens['mathLabel'],'priority':obj.get('priority',1 if kind in {'POINT_NAME','CONDITION_BOX'} else 2)}
            label['at']=vp.screen(geometry[obj['target']]) if kind in {'POINT_NAME','COORDINATE_LABEL'} else vp.screen(obj['at'])
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
