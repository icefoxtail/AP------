from __future__ import annotations
import hashlib, json, math, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[4]
HERE=Path(__file__).resolve().parent
PACKAGE_REL='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json'
EXPECTED_PATH=HERE/'expected-facts-freeze.json'
CANDIDATE_ROOT=ROOT/'.tmp/archive/palma-q23-visual-20261010/alive-palma25-2mid-q23'
OUT=HERE
sys.path.insert(0,str(ROOT/'archive/tools/geometry-equation'))
from visual_engine.entrypoints import build_independent
from visual_engine.engine import canonical, sha
from visual_engine.viewport import for_spec


def dump(path,value):
    path.parent.mkdir(parents=True,exist_ok=True)
    raw=(json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False)+'\n').encode('utf-8')
    path.write_bytes(raw)
    return raw


def rawsha(raw): return hashlib.sha256(raw).hexdigest()

def exact_text(v):
    return str(int(v)) if float(v).is_integer() else str(v)

def point_names():
    return {'P0':'P','P1':'Q','P2':'R','P3':'S','H0':'H','H1':'K'}

def make_objects(row):
    pts=row['pointCoordinates']; names=point_names()
    objects=[{'id':pid,'kind':'POINT','name':names[pid],'at':coords} for pid,coords in pts.items()]
    refs={}
    pairs=[('edge-P0-P1','P0','P1'),('edge-P1-P2','P1','P2'),('edge-P2-P3','P2','P3'),('edge-P0-P3','P0','P3'),('height-H0-H1','H0','H1')]
    for sid,a,b in pairs:
        objects.append({'id':sid,'kind':'SEGMENT','from':pts[a],'to':pts[b]})
        refs[sid]=[a,b]
    return objects,refs


def frame_for(spec):
    # Independent equal-unit framing from the frozen bounds, before any SVG exists.
    v=spec['viewport']; xlo,xhi,ylo,yhi=[float(v[k]) for k in ('xMin','xMax','yMin','yMax')]
    width=float(v['width']);height=float(v['height']);margin=float(v['margin']);panel=float(v['panel']);topin=float(v['topInset'])
    plotw=width-2*margin-panel; ploth=height-2*margin-topin
    sx=min(plotw/(xhi-xlo),ploth/(yhi-ylo));sy=sx
    left=margin+(plotw-sx*(xhi-xlo))/2;top=margin+topin+(ploth-sy*(yhi-ylo))/2
    ox=left+(0-xlo)*sx;oy=top+(yhi-0)*sy
    return {'originX':ox,'originY':oy,'sx':sx,'sy':sy}


def title_for(slot):
    if slot=='C3': return 'S=5ab · a+b=7 · (a,b)=(3,4)'
    return '두 평행선 쌍의 네 교점'


def make_spec(uid,row):
    slot=row['slot']
    points=row['pointCoordinates']; objects,segment_refs=make_objects(row)
    xmin=min(p[0] for p in points.values());xmax=max(p[0] for p in points.values())
    ymin=min(p[1] for p in points.values());ymax=max(p[1] for p in points.values())
    viewport={'xMin':xmin-3,'xMax':xmax+3,'yMin':ymin-3,'yMax':ymax+3,
              'width':390,'height':380,'panel':0,'margin':32,'topInset':32}
    area=float(row['area']); area_text=row['areaExact']
    if row['mode']=='HORIZONTAL_Y_STRIP':
        base_owner='edge-P0-P1';base_value=row['sideLengths']['horizontalSide'];base_text=row['exactSideLengths']['horizontalSide'];base_side=-1
    else:
        base_owner='edge-P0-P3';base_value=row['sideLengths']['verticalSide'];base_text=row['exactSideLengths']['verticalSide'];base_side=1
    height_owner='height-H0-H1';height_value=row['sideLengths']['perpendicularStripWidth'];height_text=row['exactSideLengths']['perpendicularStripWidth']
    annotations=[
        {'id':'baseLength','kind':'LENGTH','owner':base_owner,'value':base_value,'text':base_text,'factRole':'DERIVED_INTERMEDIATE','mode':'DIMENSION','side':base_side,'unit':''},
        {'id':'stripWidth','kind':'LENGTH','owner':height_owner,'value':height_value,'text':height_text,'factRole':'DERIVED_INTERMEDIATE','mode':'DIMENSION','side':1,'unit':''},
    ]
    if slot in {'C1','C2'}:
        # C1/C2 use one shared diagram; both actual side lengths are 5 there.
        annotations.append({'id':'obliqueSideLength','kind':'LENGTH','owner':'edge-P0-P1','value':row['sideLengths']['slantedSide'],
                            'text':row['exactSideLengths']['slantedSide'],'factRole':'DERIVED_INTERMEDIATE','mode':'DIMENSION','side':-1,'unit':''})
    elif slot=='C2':
        annotations.append({'id':'obliqueSideLength','kind':'LENGTH','owner':'edge-P0-P1','value':row['sideLengths']['slantedSide'],
                            'text':row['exactSideLengths']['slantedSide'],'factRole':'DERIVED_INTERMEDIATE','mode':'DIMENSION','side':-1,'unit':''})
    annotations.append({'id':'parallelogramArea','kind':'REGION','refs':['P0','P1','P2','P3'],'value':area,'text':area_text,
                        'factRole':row['factRoles']['areaOrPerimeterRelation']})
    fact_payload={'sourceQid':23,'sourceExamBlobSha1':'4cfce909c023e5c4df4a759945c8cc3e0a63ec76',
                  'geometryMode':row['mode'],'sourceEquation':row['sourceEquation'],
                  'sourceIntersectionCoordinates':row['sourceIntersectionCoordinates'],
                  'pointCoordinatesExact':row['pointCoordinatesExact'],'areaExact':row['areaExact'],
                  'coordinateEvidence':row['coordinateEvidence']}
    fact_hash=sha(canonical(fact_payload))
    spec={'id':'palma-q23-'+slot.lower(),'title':title_for(slot),'visualType':'coordinate_geometry','viewport':viewport,'axes':False,
          'sourceFacts':{'independentFactHash':fact_hash,'sourceQid':23,'sourceExamPath':'archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js',
                         'sourceExamBlobSha1':'4cfce909c023e5c4df4a759945c8cc3e0a63ec76','geometryMode':row['mode'],
                         'coordinateEvidence':row['coordinateEvidence']},
          'derivedFacts':{'areaExact':row['areaExact'],'perimeter':row.get('perimeter')},'displayFacts':{},'objects':objects,
          'publication':{'profile':'geometry-publication-v1','fontSize':15,
                         'sourcePointLabels':point_names(),'pointLabelAnchors':{},'segmentPointRefs':segment_refs,
                         'annotations':annotations}}
    return spec,fact_payload


def review_for(item,row,spec):
    items=[]
    segment_refs={'edge-P0-P1':['P0','P1'],'edge-P1-P2':['P1','P2'],'edge-P2-P3':['P2','P3'],
                  'edge-P0-P3':['P0','P3'],'height-H0-H1':['H0','H1']}
    names=point_names()
    points=[{'id':pid,'at':coords,'name':names[pid]} for pid,coords in row['pointCoordinates'].items()]
    segments=[{'id':sid,'points':refs} for sid,refs in segment_refs.items()]
    if row['mode']=='HORIZONTAL_Y_STRIP':
        base_owner='edge-P0-P1';base_value=row['sideLengths']['horizontalSide'];base_text=row['exactSideLengths']['horizontalSide']
    else:
        base_owner='edge-P0-P3';base_value=row['sideLengths']['verticalSide'];base_text=row['exactSideLengths']['verticalSide']
    lengths=[{'id':'baseLength','segment':base_owner,'value':base_value,'text':base_text,'unit':'','mode':'DIMENSION','factRole':'DERIVED_INTERMEDIATE'},
             {'id':'stripWidth','segment':'height-H0-H1','value':row['sideLengths']['perpendicularStripWidth'],
              'text':row['exactSideLengths']['perpendicularStripWidth'],'unit':'','mode':'DIMENSION','factRole':'DERIVED_INTERMEDIATE'}]
    if item['slot'] in {'C1','C2'}:
        lengths.append({'id':'obliqueSideLength','segment':'edge-P0-P1','value':row['sideLengths']['slantedSide'],
                        'text':row['exactSideLengths']['slantedSide'],'unit':'','mode':'DIMENSION','factRole':'DERIVED_INTERMEDIATE'})
    region_role=row['factRoles']['areaOrPerimeterRelation']
    regions=[{'id':'parallelogramArea','points':['P0','P1','P2','P3'],'value':row['area'],'text':row['areaExact'],'factRole':region_role}]
    return {'schemaVersion':'geometry-publication-review-v1','sourceSha256':rawsha(item['stem'].encode('utf-8')),
            'solutionSha256':rawsha(item['solution'].encode('utf-8')),'coordinateModel':frame_for(spec),'points':points,'segments':segments,
            'circles':[],'arcs':[],'incidences':[],'lines':[],'angles':[],'lengths':lengths,'regions':regions,'otherLabels':[],
            'coordinateEvidence':row['coordinateEvidence']}


def main():
    freeze=json.loads(EXPECTED_PATH.read_text(encoding='utf-8')); package=json.loads((ROOT/PACKAGE_REL).read_text(encoding='utf-8'))
    rows={r['slot']:r for r in freeze['items']}; items={r['slot']:r for r in package['items']}
    assert len(rows)==len(items)==9 and freeze['packageIdentity']['packageMutation']=='NONE'
    # No candidate is materialized until the frozen point conditions and all exact intersections are present.
    schema_path=ROOT/'archive/tools/geometry-equation/visual_engine/visual_spec.schema.json'
    schema_raw=schema_path.read_bytes(); schema=json.loads(schema_raw)
    CANDIDATE_ROOT.mkdir(parents=True,exist_ok=True)
    summary=[]; built={}
    for slot in ['A1','A2','A3','B1','B2','B3','C1','C2','C3']:
        row=rows[slot];item=items[slot];uid=item['uid']
        spec,fact_payload=make_spec(slot,row)
        fact_hash=sha(canonical(fact_payload))
        assert spec['sourceFacts']['independentFactHash']==fact_hash
        # The frozen audit input is written before asking the existing builder for candidate bytes.
        review=review_for(item,row,spec)
        review_path=OUT/f'{uid}.geometry-review.json'
        review_raw=dump(review_path,review)
        spec_path=OUT/f'{uid}.visual-spec.json'
        spec_raw=dump(spec_path,spec)
        result=build_independent({'qKey':uid},{'independentFactHash':fact_hash,'visualSpec':spec})
        svg=result['svg'].encode('utf-8')
        witness=result['witness']
        assert witness['coordinateEvidenceMode']=='CONSTRUCTED_REALIZATION'
        assert witness['coordinateEvidenceSha256']==sha(canonical(spec['sourceFacts']['coordinateEvidence']))
        folder=CANDIDATE_ROOT/'candidate'/spec['id'];folder.mkdir(parents=True,exist_ok=True)
        (folder/'visual.svg').write_bytes(svg)
        dump(folder/'witness.json',witness)
        dump(folder/'spec.json',spec)
        (folder/'visual.tex').write_text(result['tex'],encoding='utf-8',newline='\n')
        built[slot]={'assetPath':(folder/'visual.svg').relative_to(ROOT).as_posix(),'svgSha256':rawsha(svg),
                     'svgGitBlobSha1':hashlib.sha1(b'blob '+str(len(svg)).encode()+b'\0'+svg).hexdigest(),
                     'specPath':spec_path.relative_to(ROOT).as_posix(),'specSha256':rawsha(spec_raw),
                     'reviewPath':review_path.relative_to(ROOT).as_posix(),'reviewSha256':rawsha(review_raw),
                     'witnessPath':(folder/'witness.json').relative_to(ROOT).as_posix(),'witnessSha256':rawsha((folder/'witness.json').read_bytes()),
                     'builderStatus':witness['status'],'primitiveCount':len(result['witness'].get('layout',{}).get('labels',[])),
                     'sharedSourceSlots':[slot]}
        summary.append({'slot':slot,'uid':uid,**built[slot]})
    output={'schemaVersion':'PALMA_Q23_VISUAL_CANDIDATE_BUILD_V1','backend':'geometry-publication-v1','backendSchemaPath':schema_path.relative_to(ROOT).as_posix(),'backendSchemaSha256':rawsha(schema_raw),'specValidation':'EXISTING_ENGINE_SEMANTIC_VALIDATOR','candidateRoot':CANDIDATE_ROOT.relative_to(ROOT).as_posix(),
            'createdFinalArchiveAssets':False,'counts':{'uidDenominator':9,'uniqueSvgCandidates':len(built),'reviewInputs':9,
                                                       'builderCandidateStatus':{k:sum(1 for v in built.values() if v['builderStatus']==k) for k in sorted({v['builderStatus'] for v in built.values()})}},
            'items':summary}
    dump(OUT/'Q23_candidate_build_summary.json',output)
    print(json.dumps(output,ensure_ascii=False,indent=2))

if __name__=='__main__': main()







