from __future__ import annotations
import hashlib, json, math, subprocess
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PACKAGE_REL = 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q23_PACKAGE.json'
APPROVAL_REL = 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/2025/25_팔마고_2학기_중간_고1/GPT_QID9_Q17_Q23_USER_DIRECTED_APPROVAL_20261010.json'
SOURCE_REL = 'archive/exams/original/high/h1/2mid/25_팔마고_2학기_중간_고1_기출.js'
SOURCE_SVG_REL = 'archive/assets/images/25_팔마고_2학기_중간_고1_기출/q23-solution.svg'
APPROVED_SOURCE_BLOB = '4cfce909c023e5c4df4a759945c8cc3e0a63ec76'
OUT = Path(__file__).with_name('expected-facts-freeze.json')
TOL = 1e-9


def sha(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def git_blob(raw: bytes) -> str:
    return hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()


def canonical_json(value) -> bytes:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False).encode('utf-8')

def git_clean_blob(path: str) -> str:
    status=subprocess.check_output(['git','status','--porcelain','--',path],cwd=ROOT).decode().strip()
    if status: raise ValueError('WORKTREE_SOURCE_DIFF_REQUIRES_SEPARATE_CANONICAL_BINDING:'+path)
    return subprocess.check_output(['git','rev-parse',f'HEAD:{path}'],cwd=ROOT).decode().strip()


def frac(v: Fraction | int) -> str:
    v = Fraction(v)
    return str(v.numerator) if v.denominator == 1 else f'{v.numerator}/{v.denominator}'


def fxy(p):
    return [frac(p[0]), frac(p[1])]


def pfloat(p):
    return [float(p[0]), float(p[1])]


def d2(a,b):
    return math.dist(a,b)


def cross(a,b,c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])


def exact_source_points_x(a, A, B, C, D):
    # Loci x=±a and A*x+B*y+C=±D. Order is cyclic around the resulting parallelogram.
    def point(x, sign):
        return (Fraction(x), Fraction(sign*D-A*x-C, B))
    return [point(-a, 1), point(a, 1), point(a, -1), point(-a, -1)]


def build_x_case(item, a, b, A, B, C=0):
    norm = math.isqrt(A*A+B*B)
    assert norm*norm == A*A+B*B and B != 0
    D = b*norm
    src = exact_source_points_x(a, A, B, C, D)
    # Source equations and distances are independently evaluated before the rigid normalization.
    distance_rows = []
    for idx,(x,y) in enumerate(src):
        distance_x = abs(x)
        distance_line = abs(A*x+B*y+C) / norm
        assert distance_x == a and distance_line == b
        distance_rows.append({
            'pointId': f'P{idx}',
            'xFromVerticalLine': frac(distance_x), 'expectedXDistance': frac(a), 'xDistanceResidual': 0.0,
            'lineValue': frac(A*x+B*y+C), 'lineNormalLength': norm,
            'expectedLineDistance': frac(b), 'observedLineDistance': frac(distance_line), 'lineDistanceResidual': 0.0,
        })
    # Reflection plus translation sends P0 to the origin and P3 to the positive x-axis; distances and angles are preserved.
    local = [(y-src[0][1], x-src[0][0]) for x,y in src]
    V = local[3][0]
    H = local[1][1]
    shear = local[1][0]
    assert local[0] == (Fraction(0), Fraction(0))
    assert local[3] == (V, Fraction(0)) and V > 0 and H > 0
    assert local[2] == (V+shear, H)
    assert local[1] == (shear,H)
    assert Fraction(0) < shear < V
    xh = (shear+V)/2
    coords = {
        'P0': local[0], 'P1': local[1], 'P2': local[2], 'P3': local[3],
        'H0': (xh, Fraction(0)), 'H1': (xh, H),
    }
    side_oblique = math.hypot(float(shear), float(H))
    area = float(V*H)
    perimeter = 2*(float(V)+side_oblique)
    return {
        'slot': item['slot'], 'uid': item['uid'], 'mode': 'VERTICAL_X_STRIP',
        'distanceParameters': {'a': a, 'b': b, 'lineCoefficients': [A,B,C], 'normalLength': norm, 'offsetD': D},
        'sourceEquation': {'first': 'x=±a', 'second': f'{A}x{B:+d}y{C:+d}=±{D}'},
        'sourceIntersectionCoordinates': {f'P{i}': fxy(p) for i,p in enumerate(src)},
        'sourceConditionResiduals': distance_rows,
        'pointCoordinates': {k:pfloat(v) for k,v in coords.items()},
        'pointCoordinatesExact': {k:fxy(v) for k,v in coords.items()},
        'sideLengths': {'verticalSide': float(V), 'slantedSide': side_oblique, 'perpendicularStripWidth': float(H)},
        'exactSideLengths': {'verticalSide': frac(V), 'perpendicularStripWidth': frac(H),
                             'slantedSide': frac(Fraction(2*a*norm, abs(B)))},
        'area': area, 'areaExact': frac(V*H), 'perimeter': perimeter,
        'heightOwnerPoints': ['H0','H1'], 'normalizationOrigin': 'P0', 'normalizationXAxisPoint': 'P3', 'normalizationUnitScale': float(V),
    }


def build_y_case(item, horizontal_distance, oblique_distance, A, B):
    norm = math.isqrt(A*A+B*B)
    assert norm*norm == A*A+B*B
    D = oblique_distance*norm
    # Intersections of y=±horizontal_distance with A*x+B*y=±D; cyclic source-space order.
    def x_at(y, sign):
        return Fraction(sign*D-B*y, A)
    src = [
        (x_at(horizontal_distance,-1), Fraction(horizontal_distance)),
        (x_at(horizontal_distance, 1), Fraction(horizontal_distance)),
        (x_at(-horizontal_distance,1), Fraction(-horizontal_distance)),
        (x_at(-horizontal_distance,-1), Fraction(-horizontal_distance)),
    ]
    distance_rows=[]
    for idx,(x,y) in enumerate(src):
        dy=abs(y)
        dl=abs(A*x+B*y)/norm
        assert dy==horizontal_distance and dl==oblique_distance
        distance_rows.append({'pointId':f'P{idx}','yFromHorizontalLine':frac(dy),'expectedYDistance':frac(horizontal_distance),
                              'yDistanceResidual':0.0,'lineValue':frac(A*x+B*y),'lineNormalLength':norm,
                              'expectedLineDistance':frac(oblique_distance),'observedLineDistance':frac(dl),'lineDistanceResidual':0.0})
    # Congruent axis-preserving translation: source horizontal edge becomes local P0P1.
    p0=src[0]
    local=[(x-p0[0], y-p0[1]) for x,y in src]
    width=local[1][0]
    drop=-local[3][1]
    assert local[0]==(Fraction(0),Fraction(0)) and local[1]==(width,Fraction(0))
    assert local[2]==(width+local[3][0],-drop) and local[3][1]==-drop
    xh=(local[1][0]+local[3][0])/2
    coords={'P0':local[0],'P1':local[1],'P2':local[2],'P3':local[3],
            'H0':(xh,Fraction(0)),'H1':(xh,Fraction(-drop))}
    side_oblique=math.hypot(float(local[3][0]),float(drop))
    area=float(width*drop)
    return {
        'slot':item['slot'],'uid':item['uid'],'mode':'HORIZONTAL_Y_STRIP',
        'distanceParameters':{'horizontalDistance':horizontal_distance,'obliqueDistance':oblique_distance,'lineCoefficients':[A,B,0],
                              'normalLength':norm,'offsetD':D},
        'sourceEquation':{'first':'y=±h','second':f'{A}x{B:+d}y=±{D}'},
        'sourceIntersectionCoordinates':{f'P{i}':fxy(p) for i,p in enumerate(src)},
        'sourceConditionResiduals':distance_rows,
        'pointCoordinates':{k:pfloat(v) for k,v in coords.items()},
        'pointCoordinatesExact':{k:fxy(v) for k,v in coords.items()},
        'sideLengths':{'horizontalSide':float(width),'slantedSide':side_oblique,'perpendicularStripWidth':float(drop)},
        'exactSideLengths':{'horizontalSide':frac(width),'perpendicularStripWidth':frac(drop)},
        'area':area,'areaExact':frac(width*drop),
        'heightOwnerPoints':['H0','H1'],'normalizationOrigin':'P0','normalizationXAxisPoint':'P1','normalizationUnitScale':float(width),
    }


def condition(kind, refs, expected=None, cid=None):
    row={'id':cid or kind.lower()+'-'+''.join(refs),'kind':kind,'refs':refs,'tolerance':TOL}
    if expected is not None: row['expected']=float(expected)
    return row


def condition_residual(coords,row):
    p=[coords[x] for x in row['refs']]
    if row['kind']=='DISTANCE': return abs(d2(p[0],p[1])-float(row['expected']))
    if row['kind']=='PERPENDICULAR':
        u=(p[1][0]-p[0][0],p[1][1]-p[0][1]);v=(p[3][0]-p[2][0],p[3][1]-p[2][1])
        return abs(u[0]*v[0]+u[1]*v[1])/(math.hypot(*u)*math.hypot(*v))
    if row['kind']=='PARALLEL':
        u=(p[1][0]-p[0][0],p[1][1]-p[0][1]);v=(p[3][0]-p[2][0],p[3][1]-p[2][1])
        return abs(u[0]*v[1]-u[1]*v[0])/(math.hypot(*u)*math.hypot(*v))
    if row['kind']=='COLLINEAR':
        u=(p[1][0]-p[0][0],p[1][1]-p[0][1]);v=(p[2][0]-p[0][0],p[2][1]-p[0][1])
        return abs(u[0]*v[1]-u[1]*v[0])/(math.hypot(*u)*math.hypot(*v))
    raise ValueError(row['kind'])


def coord_evidence(row):
    coords=row['pointCoordinates']
    p0,p1,p2,p3,h0,h1=(coords[k] for k in ['P0','P1','P2','P3','H0','H1'])
    if row['mode']=='HORIZONTAL_Y_STRIP':
        base_pair=['P0','P1']; opposite_base_pair=['P3','P2']
        oblique_pair=['P1','P2']; opposite_oblique_pair=['P3','P0']
        conditions=[
            condition('DISTANCE',base_pair,row['sideLengths']['horizontalSide'],'base-side-length'),
            condition('DISTANCE',opposite_base_pair,row['sideLengths']['horizontalSide'],'opposite-base-side-length'),
            condition('DISTANCE',oblique_pair,row['sideLengths']['slantedSide'],'first-oblique-side-length'),
            condition('DISTANCE',opposite_oblique_pair,row['sideLengths']['slantedSide'],'opposite-oblique-side-length'),
            condition('DISTANCE',['H0','H1'],row['sideLengths']['perpendicularStripWidth'],'strip-height-length'),
            condition('PARALLEL',['P0','P1','P3','P2'],cid='parallel-base-sides'),
            condition('PARALLEL',['P1','P2','P0','P3'],cid='parallel-oblique-sides'),
            condition('PERPENDICULAR',['P0','P1','H0','H1'],cid='height-perpendicular-to-base'),
            condition('COLLINEAR',['P0','P1','H0'],cid='height-foot-on-base'),
            condition('COLLINEAR',['P3','P2','H1'],cid='height-head-on-opposite-base'),
        ]
    else:
        conditions=[
            condition('DISTANCE',['P0','P3'],row['sideLengths']['verticalSide'],'base-side-length'),
            condition('DISTANCE',['P1','P2'],row['sideLengths']['verticalSide'],'opposite-base-side-length'),
            condition('DISTANCE',['P0','P1'],row['sideLengths']['slantedSide'],'first-oblique-side-length'),
            condition('DISTANCE',['P3','P2'],row['sideLengths']['slantedSide'],'opposite-oblique-side-length'),
            condition('DISTANCE',['H0','H1'],row['sideLengths']['perpendicularStripWidth'],'strip-height-length'),
            condition('PARALLEL',['P0','P3','P1','P2'],cid='parallel-base-sides'),
            condition('PARALLEL',['P0','P1','P3','P2'],cid='parallel-oblique-sides'),
            condition('PERPENDICULAR',['P0','P3','H0','H1'],cid='height-perpendicular-to-base'),
            condition('COLLINEAR',['P0','P3','H0'],cid='height-foot-on-base'),
            condition('COLLINEAR',['P1','P2','H1'],cid='height-head-on-opposite-base'),
        ]
    residuals=[{'conditionId':r['id'],'residual':condition_residual(coords,r),'tolerance':r['tolerance']} for r in conditions]
    assert all(r['residual'] <= r['tolerance'] for r in residuals)
    metric=abs(cross(p0,p1,p3))/(d2(p0,p1)*d2(p0,p3))
    assert metric > 1e-8
    variables=[]
    for key,value in row['distanceParameters'].items():
        if isinstance(value,(int,float)) and not isinstance(value,bool): variables.append({'id': ''.join(c for c in key if c.isalnum())[:80] or 'v','value':value})
        elif isinstance(value,list):
            for i,entry in enumerate(value): variables.append({'id':f'{key}{i}','value':entry})
    # Ensure unique legal IDs.
    seen=set(); unique=[]
    for v in variables:
        name=v['id']
        if name in seen: name += 'x'
        seen.add(name); v['id']=name; unique.append(v)
    steps=[{'id':'construct-'+pid.lower(),'operation':'INTERSECTION_AND_ISOMETRIC_NORMALIZATION','output':pid,'inputs':[]} for pid in ['P0','P1','P2','P3']]
    steps += [{'id':'construct-height-foot','operation':'PERPENDICULAR_HEIGHT_FOOT','output':'H0','inputs':['P0','P3','P1','P2']},
              {'id':'construct-height-head','operation':'PARALLEL_SIDE_HEIGHT_HEAD','output':'H1','inputs':['P1','P2','H0']}]
    return {
        'mode':'CONSTRUCTED_REALIZATION',
        'rationale':'Original coordinates are intersections of the two stated distance-locus line pairs. The diagram uses a rigid translation/reflection of those four exact intersections so the first base lies on the positive x-axis; perpendicular strip width, both parallel side pairs, exact side lengths, and area are preserved. These are constructed coordinates, not source coordinate claims.',
        'normalization':{'originPoint':row['normalizationOrigin'],'xAxisPoint':row['normalizationXAxisPoint'],'unitScale':row['normalizationUnitScale']},
        'freeVariables':unique,
        'pointCoordinates':coords,
        'conditions':conditions,
        'constructionSteps':steps,
        'residualChecks':residuals,
        'degeneracyChecks':[{'id':'parallelogram-nondegenerate','kind':'NONCOLLINEAR','refs':['P0','P1','P3'],'observed':metric,'minimum':1e-8},
                            {'id':'height-endpoints-distinct','kind':'DISTINCT_POINTS','refs':['H0','H1'],'observed':d2(h0,h1),'minimum':1e-8}],
    }


def main():
    package_path=ROOT/PACKAGE_REL; approval_path=ROOT/APPROVAL_REL; source_path=ROOT/SOURCE_REL; source_svg_path=ROOT/SOURCE_SVG_REL
    package_raw=package_path.read_bytes(); package=json.loads(package_raw); approval_raw=approval_path.read_bytes(); approval=json.loads(approval_raw)
    package_head=subprocess.check_output(['git','show',f'HEAD:{PACKAGE_REL}'],cwd=ROOT)
    package_row=next(r for r in approval['packages'] if r['sourceQid']==23)
    assert package_row['sha256']==sha(package_head) and package_row['gitBlobSha1']==git_blob(package_head)
    assert package_row['gitBlobSha1']=='bf8028c151f991592631e399459171363e59ec0a'
    assert approval['source']['gitBlobSha1']==APPROVED_SOURCE_BLOB
    approved_source=subprocess.check_output(['git','cat-file','blob',APPROVED_SOURCE_BLOB],cwd=ROOT)
    assert git_blob(approved_source)==APPROVED_SOURCE_BLOB
    items={row['slot']:row for row in package['items']}
    assert len(items)==9 and all(row['sourceQid']==23 for row in items.values())
    configs={
        'A1':('x',3,2,3,-4,0),
        'A2':('x',3,4,5,-12,0),
        'A3':('x',5,3,8,-15,0),
        'B1':('y',2,3,3,4,0),
        'B2':('x',3,4,3,-4,0),
        'B3':('x',2,3,3,-4,7),
        'C1':('x',2,2,3,-4,0),
        'C2':('x',2,2,3,-4,0),
        'C3':('x',3,4,3,-4,0),
    }
    rows=[]
    for slot,item in items.items():
        typ,a,b,A,B,C=configs[slot]
        row=build_x_case(item,a,b,A,B,C) if typ=='x' else build_y_case(item,a,b,A,B)
        if slot=='C3':
            row['representativeConfiguration']={'a':3,'b':4,'constraint':'a+b=7','selectedFromAllowedPositiveIntegerPairs':True}
            row['allAllowedConfigurations']=[{'a':a0,'b':7-a0,'area':5*a0*(7-a0)} for a0 in range(1,7)]
            assert [x['area'] for x in row['allAllowedConfigurations']]==[30,50,60,60,50,30]
        witness=item['mathWitness']
        expected_area={'A1':30,'A2':52,'A3':68,'B1':40,'B2':60,'B3':30,'C1':20,'C2':20,'C3':60}
        assert float(row['area'])==expected_area[slot], (slot,row['area'],expected_area[slot])
        if 'area' in witness:
            assert float(witness['area'])==expected_area[slot], (slot,witness['area'])
            solutionRelation={'kind':'DIRECT_AREA_WITNESS','value':witness['area'],'verified':True}
        elif slot=='B2':
            assert witness['areaFormula']=='15t' and witness['positiveDistance']==4 and witness['targetArea']==60
            assert 15*witness['positiveDistance']==row['area']
            solutionRelation={'kind':'INVERSE_DISTANCE_TARGET_AREA','expression':'15t','t':4,'targetArea':60,'verified':True}
        elif slot=='C1':
            k=Fraction(witness['solutionK'])
            assert witness['areaFormula']=='16sqrt(k^2+1)' and witness['targetArea']==20
            assert 16*Fraction(5,4)==20 and k==Fraction(3,4) and k*k+1==Fraction(25,16)
            solutionRelation={'kind':'SLOPE_INVERSE_TARGET_AREA','expression':'16sqrt(k^2+1)','k':frac(k),'targetArea':20,'verified':True}
        elif slot=='C2':
            assert witness['verticalSide']==5 and witness['slantedSide']==5 and witness['perimeter']==20
            assert 2*(witness['verticalSide']+witness['slantedSide'])==20 and row['areaExact']=='20'
            solutionRelation={'kind':'PERIMETER_AND_PARALLELOGRAM_AREA','sideLengths':[5,5],'perimeter':20,'area':20,'verified':True}
        elif slot=='C3':
            assert witness['areaFormula']=='5ab' and witness['sum']==7
            assert witness['allowedA']==[1,2,3,4,5,6]
            assert [5*a0*(7-a0) for a0 in witness['allowedA']]==[30,50,60,60,50,30]
            assert witness['min']==30 and witness['max']==60 and row['areaExact']=='60'
            solutionRelation={'kind':'EXHAUSTIVE_POSITIVE_INTEGER_PAIRS','formula':'5ab','allowedAreas':[30,50,60,60,50,30],
                              'minimum':30,'maximum':60,'representativeArea':60,'verified':True}
        else:
            raise AssertionError('UNHANDLED_APPROVED_SOLUTION_WITNESS:'+slot)
        row['approvedSolutionWitnessValidation']=solutionRelation
        if slot=='C3':
            assert witness['sum']==7 and witness['allowedA']==[1,2,3,4,5,6]
            assert [5*a0*(7-a0) for a0 in witness['allowedA']]==[30,50,60,60,50,30]
            assert witness['min']==30 and witness['max']==60 and row['areaExact']=='60'
        row['packageSolutionSha256']=sha(item['solution'].encode('utf-8'))
        row['packageStemSha256']=sha(item['stem'].encode('utf-8'))
        row['problemVisualDecision']=item['visualDecision']['problem']
        row['solutionVisualDecision']=item['visualDecision']['solution']
        row['problemVisualReason']=item['visualDecision']['reason']
        row['solutionVisualReason']='The four distance-locus intersections form a parallelogram; owner-bound base/strip dimensions make the area or perimeter relation easier to see while the solution prose retains the algebra and conclusion.'
        row['coordinateEvidence']=coord_evidence(row)
        row['sourceConditionCoverage']=[
            '첫 번째 거리 조건의 두 평행 경계와 그 위 네 교점',
            '두 번째 점-직선 거리 조건의 ± 경계와 그 위 네 교점',
            '두 평행선 쌍이 만드는 단순·비퇴화 평행사변형',
            '면적·둘레 또는 매개변수에 직접 쓰이는 base/strip 치수',
        ]
        if slot=='C3': row['sourceConditionCoverage'] += ['양의 정수 a+b=7의 여섯 허용쌍; 도형은 (a,b)=(3,4) 대표 구성']
        row['decisiveRelationCovered']=True
        row['uncoveredCriticalConditions']=[]
        row['factRoles']={
            'distanceLoci':'GIVEN','oppositeParallelSides':'DERIVED_INTERMEDIATE',
            'perpendicularStripWidth':'DERIVED_INTERMEDIATE','areaOrPerimeterRelation':'CONCLUSION' if slot not in {'B2','C1','C2'} else ('GIVEN' if slot in {'B2','C1'} else 'DERIVED_INTERMEDIATE')}
        rows.append(row)
    rows.sort(key=lambda r:['A1','A2','A3','B1','B2','B3','C1','C2','C3'].index(r['slot']))
    source_current=source_path.read_bytes(); source_svg=source_svg_path.read_bytes()
    result={
        'schemaVersion':'PALMA_Q23_EXPECTED_FACTS_FREEZE_V1',
        'createdBeforeSvgConstruction':True,
        'freezeBasis':'APPROVED_Q23_PACKAGE_CURRENT_HEAD_BLOB_AND_APPROVAL_RECEIPT; ORIGINAL_Q23_SOURCE_SVG_READ; EXACT_DISTANCE_INTERSECTION_RECOMPUTATION',
        'sourceIdentity':{'sourceExamPath':SOURCE_REL,'approvedSourceExamGitBlobSha1':APPROVED_SOURCE_BLOB,
                          'approvedSourceExamBlobSha256':sha(approved_source),'currentWorkingSourceExamSha256':sha(source_current),
                          'currentWorkingSourceExamRawBlobObjectSha1':git_blob(source_current),'currentWorkingSourceExamGitBlobSha1':git_clean_blob(SOURCE_REL),'sourceSvgPath':SOURCE_SVG_REL,
                          'sourceSvgSha256':sha(source_svg),'sourceSvgGitBlobSha1':git_blob(source_svg)},
        'packageIdentity':{'path':PACKAGE_REL,'approvedHeadCanonicalSha256':sha(package_head),'approvedGitBlobSha1':git_blob(package_head),
                           'currentWorkingRawSha256':sha(package_raw),'currentWorkingRawBlobObjectSha1':git_blob(package_raw),'currentWorkingGitBlobSha1':git_clean_blob(PACKAGE_REL),
                           'approvalReceiptPath':APPROVAL_REL,'approvalReceiptSha256':sha(approval_raw),'approvalReceiptWorkingRawBlobObjectSha1':git_blob(approval_raw),'approvalReceiptGitBlobSha1':git_clean_blob(APPROVAL_REL),
                           'packageMutation':'NONE'},
        'visualTriage':{'problem':'NO_VISUAL for all nine UID because the distance conditions are fully stated and no source diagram is required to read the task.',
                        'solution':'BENEFICIAL for all nine UID because the intersections, parallel sides, strip width, and owner-bound dimensions materially clarify the area/perimeter relation.',
                        'sourceOriginalSvgRelation':'Original Q23 has a different numerical/orientation diagram (x=±2, 4x−3y=±10, area 80/3). It is preserved and is not treated as absent or reused for generated variants.'},
        'items':rows,
    }
    OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'path':OUT.relative_to(ROOT).as_posix(),'sha256':sha(OUT.read_bytes()),'count':len(rows),
                      'slots':{r['slot']:{'area':r['areaExact'],'base':r['exactSideLengths'].get('verticalSide',r['exactSideLengths'].get('horizontalSide')),
                                          'width':r['exactSideLengths']['perpendicularStripWidth']} for r in rows}},ensure_ascii=False,indent=2))

if __name__=='__main__': main()





