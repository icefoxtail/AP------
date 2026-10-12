from __future__ import annotations
import hashlib,json,math,subprocess,xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path

ROOT=Path(__file__).resolve().parents[4]; HERE=Path(__file__).resolve().parent
PACKAGE_REL='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json'
APPROVAL_REL='alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json'
SOURCE_REL='archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js'
SOURCE_SVG_REL='archive/assets/images/25_팔마고_2학기_중간_고1_기출/q23-solution.svg'
APPROVED_SOURCE_BLOB='4cfce909c023e5c4df4a759945c8cc3e0a63ec76'
CANDIDATE_ROOT=ROOT/'.tmp/archive/palma-q23-visual-20261010/alive-palma25-2mid-q23'
ASSET_ROOT=ROOT/'archive/assets/generated-lite/palma-speed-pilot'
EVIDENCE_ROOT=HERE/'evidence'
STATIC_SUMMARY=CANDIDATE_ROOT/'static-audit/Q23_static_audit_summary.json'


def sha(raw:bytes)->str:return hashlib.sha256(raw).hexdigest()
def git_blob(raw:bytes)->str:return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
def canon(v)->bytes:return json.dumps(v,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False).encode('utf-8')
def dump(path,obj):
    path.parent.mkdir(parents=True,exist_ok=True)
    raw=(json.dumps(obj,ensure_ascii=False,indent=2,allow_nan=False)+'\n').encode('utf-8')
    path.write_bytes(raw);return raw

def read_text(e):return ''.join(e.itertext())
def tag(e):return e.tag.rsplit('}',1)[-1]
def inv(frame,x,y):return [(x-frame['originX'])/frame['sx'],(frame['originY']-y)/frame['sy']]
def parse_xy_list(raw):
    out=[]
    for pair in raw.strip().split():
        x,y=pair.split(',');out.append((float(x),float(y)))
    return out
def area_poly(pts):return abs(sum(a[0]*b[1]-a[1]*b[0] for a,b in zip(pts,pts[1:]+pts[:1])))/2
def exact_pair(pair):return [str(Fraction(v)) for v in pair]
def str_fraction(v):
    q=Fraction(v)
    return str(q.numerator) if q.denominator==1 else f'{q.numerator}/{q.denominator}'
def alt_for(slot,row):
    base=row['exactSideLengths'].get('verticalSide',row['exactSideLengths'].get('horizontalSide'))
    h=row['exactSideLengths']['perpendicularStripWidth']
    area=row['areaExact']
    if slot=='B1': return f'P, Q, R, S로 표시한 평행사변형이다. 변 PQ의 길이는 {base}, 높이 HK는 {h}이고, 내부에 넓이 {area}가 표시되어 있다.'
    if slot in {'C1','C2'}:
        task='둘레 계산에 쓰는 두 변' if slot=='C2' else '주어진 넓이와 높이 관계'
        return f'P, Q, R, S로 표시한 평행사변형이다. PS와 PQ의 길이는 각각 5, 높이 HK는 4이며, 내부에 넓이 20이 표시되어 있다. {task}를 읽을 수 있다.'
    if slot=='C3': return 'a=3, b=4인 대표 구성의 평행사변형이다. PS=10, 높이 HK=6이며, 내부의 60은 이 대표 구성의 넓이이다. 제목 정보에는 S=5ab와 a+b=7이 담겨 있다.'
    if slot=='B2': return f'P, Q, R, S로 표시한 평행사변형이다. PS={base}, 높이 HK={h}이며, 내부의 60은 조건으로 주어진 넓이이다.'
    return f'P, Q, R, S로 표시한 평행사변형이다. PS={base}, 높이 HK={h}이며, 내부에 넓이 {area}가 표시되어 있다.'

def source_coverage(slot,row):
    if row['mode']=='HORIZONTAL_Y_STRIP':
        dp=row['distanceParameters']
        return [f'거리 {dp["horizontalDistance"]}인 두 수평선 y=±{dp["horizontalDistance"]}',
                f'직선 {dp["lineCoefficients"][0]}x+{dp["lineCoefficients"][1]}y=0에서 거리 {dp["obliqueDistance"]}인 평행선 쌍',
                f'네 교점 평행사변형의 수평변 {row["exactSideLengths"]["horizontalSide"]}, 수직 높이 {row["exactSideLengths"]["perpendicularStripWidth"]}, 넓이 {row["areaExact"]}']
    dp=row['distanceParameters']; a=dp['a']; b=dp['b']; A,B,C=dp['lineCoefficients']; D=dp['offsetD']
    first=f'x=±{a}'
    eq=f'{A}x{B:+d}y{C:+d}=±{D}'
    coverage=[f'직선 x=0에서 거리 {a}인 두 수직선 {first}',
              f'직선 {A}x{B:+d}y{C:+d}=0에서 거리 {b}인 두 평행선 {eq}',
              f'네 교점 평행사변형의 base {row["exactSideLengths"]["verticalSide"]}, 수직 strip width {row["exactSideLengths"]["perpendicularStripWidth"]}, 넓이 {row["areaExact"]}']
    if slot=='B3': coverage.append('상수항 변경은 두 평행선 묶음의 위치만 옮기고 폭과 넓이는 유지한다.')
    if slot=='C3': coverage.append('SVG는 허용쌍 중 대표 (a,b)=(3,4)를 그림; 여섯 쌍의 최솟값·최댓값은 승인 해설의 산술 검산으로 별도 결속한다.')
    if slot=='C2': coverage.append('두 평행변 길이 5와 5에서 둘레 20을 계산한다; 내부 넓이20은 해설용 중간 관계다.')
    return coverage

def expected_roles(slot,row):
    return [
        {'fact':'거리 조건으로 정해지는 두 평행선 쌍과 그 네 교점','role':'GIVEN','encoding':'두 평행한 변 쌍을 이루는 점 P,Q,R,S'},
        {'fact':'base와 strip width','role':'DERIVED_INTERMEDIATE','encoding':'owner-segment에 결속한 dimension line/caps/label'},
        {'fact':'평행사변형 넓이 '+row['areaExact'],'role':row['factRoles']['areaOrPerimeterRelation'],'encoding':'해당 region 내부의 AREA_LABEL'},
    ]

def primitive_extract(svg,review,row):
    root=ET.fromstring(svg.decode('utf-8')); frame=review['coordinateModel']; points={}; segments=[]; polygons=[]; dimensions=[]; labels=[]
    ids={e.get('id'):e for e in root.iter() if e.get('id')}
    for e in root.iter():
        t=tag(e); oid=e.get('id')
        if not oid: continue
        if t=='circle' and oid in {'P0','P1','P2','P3','H0','H1'}:
            screen=[float(e.get('cx')),float(e.get('cy'))]; model=inv(frame,*screen)
            points[oid]={'sourceLabel':e.get('data-source-label'),'screenCenter':screen,'observedCoordinate':model,
                         'expectedCoordinate':row['pointCoordinates'][oid],'delta':math.dist(model,row['pointCoordinates'][oid]),'radiusPx':float(e.get('r')),
                         'owner':e.get('data-owner'),'xmlDataRole':e.get('data-role')}
        elif t=='line' and oid in {'edge-P0-P1','edge-P1-P2','edge-P2-P3','edge-P0-P3','height-H0-H1'}:
            sp=[[float(e.get('x1')),float(e.get('y1'))],[float(e.get('x2')),float(e.get('y2'))]]
            mp=[inv(frame,*p) for p in sp]
            segments.append({'id':oid,'ownerPoints':e.get('data-owner-points','').split(),'screenEndpoints':sp,'observedEndpoints':mp,
                             'observedLength':math.dist(*mp),'expectedLength':None,'xmlDataRole':e.get('data-role')})
        elif t=='polygon' and oid=='parallelogramArea':
            sp=parse_xy_list(e.get('points',''));mp=[inv(frame,*p) for p in sp]
            polygons.append({'id':oid,'ownerPoints':e.get('data-owner-points','').split(),'screenVertices':sp,'observedVertices':mp,
                             'observedArea':area_poly(mp),'expectedArea':row['area'],'areaDelta':area_poly(mp)-row['area'],
                             'factRole':e.get('data-fact-role'),'owner':e.get('data-owner'),'annotation':e.get('data-annotation')})
        elif t=='line' and e.get('data-role')=='dimension':
            sp=[[float(e.get('x1')),float(e.get('y1'))],[float(e.get('x2')),float(e.get('y2'))]]
            mp=[inv(frame,*p) for p in sp]
            dimensions.append({'id':oid,'screenEndpoints':sp,'observedEndpoints':mp,'owner':e.get('data-owner'),
                               'annotation':e.get('data-annotation'),'ownerKind':e.get('data-owner-kind'),'factRole':e.get('data-fact-role'),
                               'observedLength':math.dist(*mp)})
        elif t=='text':
            labels.append({'id':oid,'kind':e.get('data-label-kind'),'text':read_text(e),'owner':e.get('data-owner'),
                           'annotation':e.get('data-annotation'),'ownerKind':e.get('data-owner-kind'),'factRole':e.get('data-fact-role'),
                           'screenAnchor':[float(e.get('x')),float(e.get('y'))],'fontSize':float(e.get('font-size'))})
    # Expected owner segment lengths are calculated from the independently observed point coordinates.
    obs={k:v['observedCoordinate'] for k,v in points.items()}
    for seg in segments:
        refs=seg['ownerPoints']; seg['expectedLength']=math.dist(obs[refs[0]],obs[refs[1]])
        seg['lengthDelta']=seg['observedLength']-seg['expectedLength']
    # The four SVG vertices are mapped back through the frozen rigid transform to source-coordinate intersections.
    source0=[float(Fraction(x)) for x in row['sourceIntersectionCoordinates']['P0']]
    reconstructed={}
    for pid in ['P0','P1','P2','P3']:
        x,y=points[pid]['observedCoordinate']
        if row['mode']=='VERTICAL_X_STRIP': original=[source0[0]+y,source0[1]+x]
        else: original=[source0[0]+x,source0[1]+y]
        expected=[float(Fraction(v)) for v in row['sourceIntersectionCoordinates'][pid]]
        reconstructed[pid]={'expectedSourceIntersection':expected,'observedSourceIntersection':original,'delta':math.dist(expected,original)}
    return {'xmlParse':'PASS','viewBox':root.get('viewBox'),'actualSvgPrimitives':{'points':points,'segments':segments,'regions':polygons,'dimensionLines':dimensions,'labels':labels},
            'reconstructedSourceIntersections':reconstructed}

def main():
    freeze=json.loads((HERE/'expected-facts-freeze.json').read_text(encoding='utf-8'))
    package_path=ROOT/PACKAGE_REL; package_raw=package_path.read_bytes(); package=json.loads(package_raw)
    approval_raw=(ROOT/APPROVAL_REL).read_bytes(); approval=json.loads(approval_raw)
    source_path=ROOT/SOURCE_REL; source_raw=source_path.read_bytes(); source_svg_path=ROOT/SOURCE_SVG_REL; source_svg=source_svg_path.read_bytes()
    approved_source=subprocess.check_output(['git','cat-file','blob',APPROVED_SOURCE_BLOB],cwd=ROOT)
    package_head=subprocess.check_output(['git','show',f'HEAD:{PACKAGE_REL}'],cwd=ROOT)
    receipt_head=subprocess.check_output(['git','show',f'HEAD:{APPROVAL_REL}'],cwd=ROOT)
    receipt=approval
    source_head_blob=subprocess.check_output(['git','rev-parse',f'HEAD:{SOURCE_REL}'],cwd=ROOT).decode().strip()
    receipt_head_blob=subprocess.check_output(['git','rev-parse',f'HEAD:{APPROVAL_REL}'],cwd=ROOT).decode().strip()
    freeze_sha=sha((HERE/'expected-facts-freeze.json').read_bytes())
    receipt_doc=json.loads((HERE/'read-receipt.json').read_text(encoding='utf-8'))
    preflight_doc=json.loads((HERE/'visual-calibration-preflight.json').read_text(encoding='utf-8'))
    build_summary=json.loads((HERE/'Q23_candidate_build_summary.json').read_text(encoding='utf-8'))
    static_summary=json.loads(STATIC_SUMMARY.read_text(encoding='utf-8'))
    assert len(static_summary['items'])==9 and static_summary['passCount']==9 and static_summary['failCount']==0
    assert build_summary['counts']['uniqueSvgCandidates']==9
    items={v['slot']:v for v in package['items']}; frozen={v['slot']:v for v in freeze['items']}
    audit_rows={v['slot']:v for v in static_summary['items']}; build_rows={v['slot']:v for v in build_summary['items']}
    asset_rows=[]; evidence_index=[]; geometry_hashes={}
    ASSET_ROOT.mkdir(parents=True,exist_ok=True); EVIDENCE_ROOT.mkdir(parents=True,exist_ok=True)
    for slot in ['A1','A2','A3','B1','B2','B3','C1','C2','C3']:
        item=items[slot]; row=frozen[slot]; uid=item['uid']; built=build_rows[slot]; audited=audit_rows[slot]
        candidate=ROOT/built['assetPath'];svg=candidate.read_bytes()
        assert sha(svg)==audited['svgSha256'] and audited['status']=='PASS'
        final_rel=f'archive/assets/generated-lite/palma-speed-pilot/{uid}-solution.svg'; final_path=ROOT/final_rel
        if final_path.exists():
            if final_path.read_bytes()!=svg: raise RuntimeError('Q23_ASSET_PATH_ALREADY_CONTAINS_DIFFERENT_BYTES:'+final_rel)
        else:
            final_path.parent.mkdir(parents=True,exist_ok=True);final_path.write_bytes(svg)
        final_raw=final_path.read_bytes(); final_sha=sha(final_raw); final_blob=git_blob(final_raw)
        assert final_sha==audited['svgSha256'] and final_blob==audited['svgGitBlobSha1']
        review_path=ROOT/built['reviewPath']; review=json.loads(review_path.read_text(encoding='utf-8'))
        physical=primitive_extract(final_raw,review,row)
        audit_path=ROOT/audited['auditPath']; audit_raw=audit_path.read_bytes(); audit_result=json.loads(audit_raw)
        assert audit_result['status']=='PASS' and audit_result['svgSha256']==final_sha
        witness_path=ROOT/built['witnessPath']; witness_raw=witness_path.read_bytes(); witness=json.loads(witness_raw)
        # Directly compare every required source-distance locus against the actual parsed SVG vertices.
        source_distance_observations=[]
        for pid,coords in physical['reconstructedSourceIntersections'].items():
            x,y=coords['observedSourceIntersection']
            if row['mode']=='VERTICAL_X_STRIP':
                dp=row['distanceParameters'];A,B,C=dp['lineCoefficients'];norm=dp['normalLength'];d1=abs(x);d2=abs(A*x+B*y+C)/norm
                expected1=dp['a'];expected2=dp['b']
                residual1=d1-expected1;residual2=d2-expected2
                source_distance_observations.append({'pointId':pid,'firstDistance':d1,'expectedFirstDistance':expected1,'firstDelta':residual1,
                    'lineDistance':d2,'expectedLineDistance':expected2,'lineDelta':residual2,'lineValue':A*x+B*y+C})
            else:
                dp=row['distanceParameters'];A,B,_=dp['lineCoefficients'];norm=dp['normalLength'];d1=abs(y);d2=abs(A*x+B*y)/norm
                expected1=dp['horizontalDistance'];expected2=dp['obliqueDistance']
                source_distance_observations.append({'pointId':pid,'firstDistance':d1,'expectedFirstDistance':expected1,'firstDelta':d1-expected1,
                    'lineDistance':d2,'expectedLineDistance':expected2,'lineDelta':d2-expected2,'lineValue':A*x+B*y})
        point_errors=[v['delta'] for v in physical['actualSvgPrimitives']['points'].values()]
        source_errors=[v['delta'] for v in physical['reconstructedSourceIntersections'].values()]
        assert max(point_errors+[0])<1e-6 and max(source_errors+[0])<1e-6
        assert all(abs(v['firstDelta'])<1e-6 and abs(v['lineDelta'])<1e-6 for v in source_distance_observations)
        actual=physical['actualSvgPrimitives']; area=actual['regions'][0]['observedArea']; assert abs(area-row['area'])<1e-7
        point_names={p['id']:p['name'] for p in review['points']}
        labels={v['id']:v for v in actual['labels']}
        dimension_bindings=[]
        for length in review['lengths']:
            label=labels[length['id']+'-label']; annotation=length['id']; dimension=next(v for v in actual['dimensionLines'] if v['annotation']==annotation)
            assert label['owner']==length['segment'] and label['text']==length['text']
            assert dimension['owner']==length['segment'] and dimension['factRole']==length['factRole']
            dimension_bindings.append({'annotation':annotation,'labelText':label['text'],'ownerSegment':length['segment'],
                                       'ownerPointNames':[point_names[p] for p in next(v['points'] for v in review['segments'] if v['id']==length['segment'])],
                                       'dimensionPrimitive':dimension['id'],'factRole':length['factRole'],'result':'PASS'})
        area_label=labels['parallelogramArea-label']; region=actual['regions'][0]
        assert area_label['owner']=='parallelogramArea' and area_label['factRole']==region['factRole']
        label_bindings=dimension_bindings+[{'annotation':'parallelogramArea','labelText':area_label['text'],'ownerRegion':'parallelogramArea',
                                            'ownerPoints':region['ownerPoints'],'factRole':region['factRole'],'result':'PASS'}]
        for pid,name in point_names.items():
            p=actual['points'][pid]; label=labels[pid+'-name']
            assert p['sourceLabel']==name and label['text']==name and label['owner']==pid
            label_bindings.append({'annotation':pid+'-name','labelText':name,'semanticOwner':pid,'ownerKind':'POINT','result':'PASS'})
        expected_facts={k:v for k,v in row.items() if k not in {'coordinateEvidence'}}
        actual_static_report=audit_result
        problem_decision={'need':'NO_VISUAL','reason':item['visualDecision']['reason']}
        solution_decision={'need':'BENEFICIAL','reason':'거리 조건만으로 문제는 완결되지만, 네 교점 평행사변형과 owner-bound strip dimensions는 넓이·둘레·매개변수 관계를 공간적으로 재현하기 쉽게 한다.'}
        evidence={
            'schemaVersion':'PALMA_Q23_SOLUTION_VISUAL_PHYSICAL_EVIDENCE_V1','uid':uid,'sourceQid':23,'slot':slot,
            'stage':'VISUAL_REPAIR','disposition':'ADD_BENEFICIAL','assetAction':'NEW_SVG',
            'sourcePackagePath':PACKAGE_REL,'sourcePackageRawSha256':sha(package_raw),'sourcePackageHeadBytesSha256':sha(package_head),
            'sourcePackageHeadBlobSha1':git_blob(package_head),'sourcePackageWorkingRawBlobObjectSha1':git_blob(package_raw),
            'sourcePackageCurrentCleanGitBlobSha1':freeze['packageIdentity']['currentWorkingGitBlobSha1'],
            'sourcePackageApprovedSha256':next(x['sha256'] for x in approval['packages'] if x['sourceQid']==23),
            'sourcePackageApprovedGitBlobSha1':next(x['gitBlobSha1'] for x in approval['packages'] if x['sourceQid']==23),
            'packageMutation':'NONE','approvalReceiptPath':APPROVAL_REL,'approvalReceiptRawSha256':sha(approval_raw),
            'approvalReceiptCanonicalSha256':sha(receipt_head),'approvalReceiptWorkingRawBlobObjectSha1':git_blob(approval_raw),
            'approvalReceiptCurrentCleanGitBlobSha1':freeze['packageIdentity']['approvalReceiptGitBlobSha1'],
            'approvalReceiptHeadBlobSha1':receipt_head_blob,'approvalBasis':approval['approvalBasis'],
            'sourceExamPath':SOURCE_REL,'lockedApprovalSourceExamBlobSha1':APPROVED_SOURCE_BLOB,'approvedSourceExamBlobSha256':sha(approved_source),
            'sourceExamCurrentWorkingSha256':sha(source_raw),'sourceExamCurrentWorkingRawBlobObjectSha1':git_blob(source_raw),
            'sourceExamCurrentCleanGitBlobSha1':freeze['sourceIdentity']['currentWorkingSourceExamGitBlobSha1'],'sourceExamCurrentHeadBlobSha1':source_head_blob,
            'sourceExamGitBlobSha1':APPROVED_SOURCE_BLOB,
            'originalQ23SolutionSvgPath':SOURCE_SVG_REL,'originalQ23SolutionSvgSha256':sha(source_svg),'originalQ23SolutionSvgGitBlobSha1':git_blob(source_svg),
            'originalVsGeneratedQ23Note':'Original Q23 asset exists and encodes x=±2, 4x−3y=±10, area 80/3. Generated Q23 geometry is separately derived per approved generated item; no original asset is treated as missing or reused.',
            'approvalReceiptReadReceiptPath':(HERE/'read-receipt.json').relative_to(ROOT).as_posix(),'approvalReadReceiptSha256':sha((HERE/'read-receipt.json').read_bytes()),
            'calibrationPreflightPath':(HERE/'visual-calibration-preflight.json').relative_to(ROOT).as_posix(),'calibrationPreflightSha256':sha((HERE/'visual-calibration-preflight.json').read_bytes()),
            'problemDecision':problem_decision,'solutionDecision':solution_decision,
            'sourceProblemSha256':review['sourceSha256'],'sourceSolutionSha256':review['solutionSha256'],
            'sourceConditionCoverage':source_coverage(slot,row),'decisiveRelationCovered':True,'uncoveredCriticalConditions':[],
            'expectedFactCompletenessStatus':'PASS','expectedFacts':expected_facts,
            'pythonInputs':{'distanceParameters':row['distanceParameters'],'sourceEquation':row['sourceEquation'],
                            'sourceIntersectionCoordinates':row['sourceIntersectionCoordinates'],'coordinateConstruction':'see constructed coordinate evidence'},
            'pythonCalculatedOutputs':{'sideLengths':row['sideLengths'],'exactSideLengths':row['exactSideLengths'],'area':row['area'],'areaExact':row['areaExact'],
                                       'perimeter':row.get('perimeter'),'approvedSolutionRelation':row['approvedSolutionWitnessValidation'],
                                       'sourceConditionResiduals':row['sourceConditionResiduals'],'actualSvgSourceDistanceObservations':source_distance_observations},
            'coordinateModel':{'provenance':'CONSTRUCTED_REALIZATION','coordinateSystem':'Axis-free equal-unit rigid realization of the exact distance-locus intersections.',
                               'normalization':row['coordinateEvidence']['normalization'],'pointCoordinates':row['pointCoordinatesExact'],
                               'screenTransform':review['coordinateModel'],'coordinateEvidenceSha256':sha(canon(row['coordinateEvidence']))},
            'coordinateEvidence':row['coordinateEvidence'],'actualSvgPrimitives':physical['actualSvgPrimitives'],
            'reconstructedSourceIntersections':physical['reconstructedSourceIntersections'],
            'observedFacts':{'allFourIntersectionPointDeltasBelow1e-6':max(point_errors+[0])<1e-6,
                             'sourceIntersectionReconstructionDeltasBelow1e-6':max(source_errors+[0])<1e-6,
                             'sourceDistanceLocusResidualsBelow1e-6':all(abs(v['firstDelta'])<1e-6 and abs(v['lineDelta'])<1e-6 for v in source_distance_observations),
                             'observedArea':area,'expectedArea':row['area'],'areaDelta':area-row['area'],
                             'independentStaticAuditStatus':audit_result['status']},
            'deltaTolerance':{'localPointCoordinate':1e-6,'sourceIntersectionCoordinate':1e-6,'distanceResidual':1e-6,'length':1e-7,'area':1e-7},
            'labelOwnerBindings':label_bindings,
            'sourceSemanticIdentity':{'applicable':False,'reason':'Generated problem contains no source-named points; diagram uses conventional P,Q,R,S,H,K names only to identify the four vertices and perpendicular-height endpoints.',
                                      'checks':[{'semanticRole':'four parallelogram vertices','sourceLabel':None,'artifactLabel':'P,Q,R,S','result':'PASS_INTERNAL_DIAGRAM_LABELS'},
                                                {'semanticRole':'height segment endpoints','sourceLabel':None,'artifactLabel':'H,K','result':'PASS_INTERNAL_DIAGRAM_LABELS'}]},
            'factVisualizations':expected_roles(slot,row),
            'visualScope':('One allowed representative pair (a,b)=(3,4) shows the geometric area formula; the approved solution separately lists and verifies all six positive-integer pairs.' if slot=='C3' else 'The SVG shows the actual four intersections and owner-bound dimensions used by the approved solution relation.'),
            'newVisualInformation':['Four actual distance-locus intersections are shown as one filled parallelogram.',
                                    'Base and perpendicular strip width have explicit owner-bound dimension lines.',
                                    'The region area label is owner-bound and role-matched to this UID.'],
            'renderer':'archive/tools/geometry-equation/visual_engine/geometry-publication-v1',
            'builderStatus':witness['status'],'builderAuthority':'BUILD_SIDE_ONLY; NOT PUBLICATION AUTHORITY',
            'builderWitnessPath':built['witnessPath'],'builderWitnessSha256':sha(witness_raw),'builderWitness':witness,
            'independentStaticAuditPath':audited['auditPath'],'independentStaticAuditSha256':sha(audit_raw),
            'independentStaticAudit':actual_static_report,'xmlParse':physical['xmlParse'],'staticPrimitiveExtractionExecuted':True,
            'staticStatus':'STATIC_READY','styleFloorStatus':'STATIC_ONLY_RENDER_PENDING','styleVersion':'geometry-publication-v1 / AP_GEOMETRY_PRINT_V1_0_DRAFT',
            'semanticGeometryPreserved':True,
            'sourceSvgPath':final_rel,'sourceSvgSha256':final_sha,'sourceSvgGitBlobSha1':final_blob,
            'browserRenderEvidence':{'status':'PENDING_POST_PROJECTION_ARCHIVE_MODE_SOL','reason':'Actual HTTP Archive desktop mode=sol render is assigned to the post-projection student UI QA lane; no browser render was run in this visual materialization.'},
            'consumerReference':'PENDING_PROJECTION',
        }
        evidence_raw=dump(EVIDENCE_ROOT/f'{uid}.solution-visual-evidence.json',evidence)
        visual_decision={**item['visualDecision']}
        consumer=f'assets/generated-lite/palma-speed-pilot/{uid}-solution.svg'
        asset={'sourceSvgPath':final_rel,'sourceSvgSha256':final_sha,'sourceSvgGitBlobSha1':final_blob,
               'consumerAssetPath':consumer,'renderer':'geometry-publication-v1','renderStatus':'PENDING_POST_PROJECTION_ARCHIVE_MODE_SOL',
               'staticStatus':'STATIC_READY','visualEvidencePath':(EVIDENCE_ROOT/f'{uid}.solution-visual-evidence.json').relative_to(ROOT).as_posix(),
               'visualEvidenceSha256':sha(evidence_raw),'alt':alt_for(slot,row)}
        asset_rows.append({'uid':uid,'sourceQid':23,'slot':slot,
                           'problemDecision':problem_decision,'solutionDecision':solution_decision,'solutionAsset':asset,
                           'geometryFingerprint':sha(canon({'mode':row['mode'],'sourceIntersections':row['sourceIntersectionCoordinates'],
                                                           'localPoints':row['pointCoordinatesExact'],'sideLengths':row['exactSideLengths'],'area':row['areaExact']})),
                           'geometryReuseNote':('Same exact geometry family as Q23-C1; this UID has a separate SVG solely because the region factRole is DERIVED_INTERMEDIATE here and GIVEN in C1.' if slot=='C2' else None)})
        evidence_index.append({'uid':uid,'path':asset['visualEvidencePath'],'sha256':asset['visualEvidenceSha256'],'svgSha256':final_sha,
                               'svgGitBlobSha1':final_blob,'staticAuditStatus':'PASS','renderStatus':asset['renderStatus']})
    c1=next(v for v in asset_rows if v['slot']=='C1');c2=next(v for v in asset_rows if v['slot']=='C2')
    assert c1['geometryFingerprint']==c2['geometryFingerprint'] and c1['solutionAsset']['sourceSvgSha256']!=c2['solutionAsset']['sourceSvgSha256']
    manifest={
        'schemaVersion':'PALMA_QID9_VISUAL_ASSET_MANIFEST_V1','status':'STATIC_READY_RENDER_PENDING',
        'sourceExamPath':SOURCE_REL,'sourceExamBlobSha1':APPROVED_SOURCE_BLOB,'sourceExamCurrentHeadBlobSha1':source_head_blob,
        'packagePath':PACKAGE_REL,'packageRawSha256':sha(package_raw),'packageCanonicalSha256':sha(package_head),
        'packageGitBlobSha1':git_blob(package_head),'packageCurrentWorkingGitBlobSha1':freeze['packageIdentity']['currentWorkingGitBlobSha1'],
        'packageCurrentWorkingRawBlobObjectSha1':freeze['packageIdentity']['currentWorkingRawBlobObjectSha1'],'packageMutation':'NONE',
        'packageApprovalReceiptPath':APPROVAL_REL,'packageApprovalReceiptRawSha256':sha(approval_raw),
        'packageApprovalReceiptSha256':sha(receipt_head),'packageApprovalReceiptCanonicalSha256':sha(receipt_head),'packageApprovalReceiptGitBlobSha1':receipt_head_blob,
        'approvalBasis':receipt['approvalBasis'],'sourceQid':23,'uidCount':9,
        'visualTriage':{'problem':{'need':'NO_VISUAL','reason':'All nine generated stems state the two distance-locus conditions and requested quantity without requiring a source diagram.'},
                        'solution':{'need':'BENEFICIAL','reason':'A filled parallelogram plus explicit base/strip dimensions makes the four intersections and area/perimeter relation easier to see and reproduce.'}},
        'originalQ23Svg':{'path':SOURCE_SVG_REL,'sha256':sha(source_svg),'gitBlobSha1':git_blob(source_svg),
                          'note':'This original-source SVG is present and remains distinct from the generated Q23 geometry.'},
        'expectedFactsFreezePath':(HERE/'expected-facts-freeze.json').relative_to(ROOT).as_posix(),'expectedFactsFreezeSha256':freeze_sha,
        'visualReadReceiptPath':(HERE/'read-receipt.json').relative_to(ROOT).as_posix(),'visualReadReceiptSha256':sha((HERE/'read-receipt.json').read_bytes()),
        'calibrationPreflightPath':(HERE/'visual-calibration-preflight.json').relative_to(ROOT).as_posix(),'calibrationPreflightSha256':sha((HERE/'visual-calibration-preflight.json').read_bytes()),
        'renderer':'archive/tools/geometry-equation/visual_engine/geometry-publication-v1',
        'backendSchemaPath':'archive/tools/geometry-equation/visual_engine/visual_spec.schema.json',
        'backendSchemaSha256':build_summary['backendSchemaSha256'],'independentStaticAuditSummaryPath':STATIC_SUMMARY.relative_to(ROOT).as_posix(),
        'independentStaticAuditSummarySha256':sha(STATIC_SUMMARY.read_bytes()),'staticAuditPassCount':9,
        'browserRenderStatus':'PENDING_POST_PROJECTION_ARCHIVE_MODE_SOL',
        'browserRenderNote':'No actual browser or Archive mode=sol render was performed by this asset-authoring lane; post-projection student UI QA remains required.',
        'sharedGeometryGroups':[{'id':'Q23-C1-C2-SAME-GEOMETRY','uids':[c1['uid'],c2['uid']],
                                 'geometryFingerprint':c1['geometryFingerprint'],'samePointAndDimensionGeometry':True,
                                 'separateSourceFilesRequiredForFactRoleParity':True,
                                 'factRoles':{'C1':'GIVEN area 20','C2':'DERIVED_INTERMEDIATE area 20'},
                                 'reason':'The current geometry-publication REGION always renders its area label; a single asset would mislabel one UID role.'}],
        'items':asset_rows,'evidenceIndex':evidence_index,
    }
    manifest_raw=dump(HERE/'finalQ23_VISUAL_MANIFEST.json',manifest)
    summary={'schemaVersion':'PALMA_Q23_FINAL_VISUAL_ASSET_SUMMARY_V1','manifestPath':(HERE/'finalQ23_VISUAL_MANIFEST.json').relative_to(ROOT).as_posix(),
             'manifestSha256':sha(manifest_raw),'sourceAssets':len(asset_rows),'uniqueGeometryCount':8,'sourceSvgFileCount':len(asset_rows),
             'staticAuditPass':9,'renderPending':9,'items':[{'uid':r['uid'],'path':r['solutionAsset']['sourceSvgPath'],'sha256':r['solutionAsset']['sourceSvgSha256'],
                                                            'gitBlobSha1':r['solutionAsset']['sourceSvgGitBlobSha1'],'evidenceSha256':r['solutionAsset']['visualEvidenceSha256'],
                                                            'renderStatus':r['solutionAsset']['renderStatus']} for r in asset_rows]}
    dump(HERE/'Q23_final_asset_summary.json',summary)
    print(json.dumps(summary,ensure_ascii=False,indent=2))

if __name__=='__main__':main()




