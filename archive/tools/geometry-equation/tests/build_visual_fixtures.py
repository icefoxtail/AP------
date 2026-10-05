"""Bounded code regression fixtures, not GOLD iterations or FULL PILOT."""
import argparse,sys,json,math,hashlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import write_candidate,ROOT

RUN=None
CONFIG=None

def save(path,value):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')

def cases():
    common={'sourceFacts':{'independentFactHash':'code-regression-source-freeze-v1'},'derivedFacts':{},'displayFacts':{}}
    circle={**common,'id':'circle-source','title':'중심과 반지름','visualType':'line_circle_geometry','viewport':{'xMin':-4,'xMax':4,'yMin':-1,'yMax':6},'objects':[
        {'id':'C','kind':'POINT','at':[-1,3],'priority':0},{'id':'R','kind':'POINT','at':[1,3]},
        {'id':'circle','kind':'CIRCLE','center':[-1,3],'radius':2},{'id':'radius','kind':'SEGMENT','from':[-1,3],'to':[1,3]},
        {'id':'C-coordinate','kind':'COORDINATE_LABEL','target':'C','exact':['-1','3']},
        {'id':'equation','kind':'EQUATION_LABEL','text':'(x+1)^2+(y-3)^2=2^2','at':[2,5]},
        {'id':'condition','kind':'CONDITION_BOX','at':[2,1],'lines':['중심 C',{'text':'r=2','math':True}]}]}
    m=(3-math.sqrt(2)/3)/2;M=(3+math.sqrt(2)/3)/2
    cluster={**common,'id':'circle-cluster','title':'원과 접점','visualType':'line_circle_geometry','viewport':{'xMin':0,'xMax':3,'yMin':0,'yMax':3},'displayFacts':{'symbolDefinitions':{'m':'(3-sqrt(2)/3)/2','M':'(3+sqrt(2)/3)/2'}},'objects':[
        {'id':'C1','kind':'POINT','name':'C₁','at':[m,m],'priority':0},{'id':'C2','kind':'POINT','name':'C₂','at':[M,M],'priority':0},{'id':'T','kind':'POINT','at':[1.5,1.5],'priority':0},
        {'id':'circle1','kind':'CIRCLE','center':[m,m],'radius':1/3},{'id':'circle2','kind':'CIRCLE','center':[M,M],'radius':1/3},
        {'id':'tangent','kind':'LINE','coefficients':[1,1,-3]},
        {'id':'t1','kind':'TANGENT','refs':['tangent','circle1'],'at':[1.5,1.5]},{'id':'t2','kind':'TANGENT','refs':['tangent','circle2'],'at':[1.5,1.5]},
        {'id':'coord1','kind':'COORDINATE_LABEL','target':'C1','exact':['m','m']},{'id':'coord2','kind':'COORDINATE_LABEL','target':'C2','exact':['M','M']},{'id':'coordT','kind':'COORDINATE_LABEL','target':'T','exact':['3/2','3/2']},
        {'id':'m-definition','kind':'EQUATION_LABEL','text':'m=(3-sqrt(2)/3)/2','at':[2.5,2.7]},
        {'id':'M-definition','kind':'EQUATION_LABEL','text':'M=(3+sqrt(2)/3)/2','at':[2.5,2.4]}]}
    result=[(circle,{'points':{'C':[-1,3],'R':[1,3]},'extraFacts':[{'type':'CIRCLE','element':'circle','center':[-1,3],'radius':2}],
        'labels':[{'id':'C-coordinate','visible':['(−1,3)','C: (−1,3)']},{'id':'equation','visible':'(x+1)2+(y−3)2=22','powers':['2','2','2']},{'id':'condition','visible':'중심 Cr=2'}]}),
        (cluster,{'points':{'C1':[m,m],'C2':[M,M],'T':[1.5,1.5]},'lineFacts':[{'factId':'tangent-slope','type':'LINE_SLOPE','element':'tangent','expected':-1},{'factId':'tangent-intercept','type':'INTERCEPT','element':'tangent','expected':{'x':3,'y':3}}],'extraFacts':[{'type':'CIRCLE','element':'circle1','center':[m,m],'radius':1/3},{'type':'CIRCLE','element':'circle2','center':[M,M],'radius':1/3}],
        'labels':[{'id':'coord1','visible':['(m,m)','C1: (m,m)']},{'id':'coord2','visible':['(M,M)','C2: (M,M)']},{'id':'coordT','visible':['(3/2,3/2)','T: (3/2,3/2)']},{'id':'m-definition','visible':'m=(3−√(2)/3)/2'},{'id':'M-definition','visible':'M=(3+√(2)/3)/2'}]})]
    families=[
        ('quadratic','x^2',['^','x',2],[0,0],[-3,3],[-1,10],'f(x)=x2',['2'],[],[]),
        ('cubic','x^3-4x',['-',['^','x',3],['*',4,'x']],[1,-3],[-3,3],[-16,16],'f(x)=x3−4x',['3'],[],[]),
        ('quartic','x^4-5x^2+4',['+',['-',['^','x',4],['*',5,['^','x',2]]],4],[0,4],[-3,3],[-5,12],'f(x)=x4−5x2+4',['4','2'],[],[]),
        ('rational','1/x',['/',1,'x'],[1,1],[-3,3],[-5,5],'f(x)=1/x',[],[0],[]),
        ('radical','sqrt(x)',['sqrt','x'],[0,0],[-2,4],[-1,3],'f(x)=√(x)',[],[],[]),
        ('exp','exp(x)',['exp','x'],[0,1],[-3,3],[-1,22],'f(x)=exp(x)',[],[],[]),
        ('log','log(x)',['log','x'],[1,0],[-2,4],[-5,3],'f(x)=log(x)',[],[0],[]),
        ('sin','sin(x)',['sin','x'],[0,0],[-4,4],[-2,2],'f(x)=sin(x)',[],[],[]),
        ('cos','cos(x)',['cos','x'],[0,1],[-4,4],[-2,2],'f(x)=cos(x)',[],[],[]),
        ('tan','tan(x)',['tan','x'],[0,0],[-4,4],[-5,5],'f(x)=tan(x)',[],[-math.pi/2,math.pi/2],[]),
        ('segmented','x','x',[0,0],[-2,2],[-2,2],'f(x)=x',[],[],[.5])]
    for name,expression,frozen,at,domain,yrange,visible,powers,poles,breaks in families:
        case={**common,'id':'graph-'+name,'title':'함수와 핵심 점','visualType':'function_graph','viewport':{'xMin':domain[0],'xMax':domain[1],'yMin':yrange[0],'yMax':yrange[1]},'objects':[{'id':'g','kind':'FUNCTION_GRAPH','expression':expression,'domain':domain,'breaks':breaks,'criticalX':[at[0]]},{'id':'P','kind':'POINT','at':at,'priority':0},{'id':'coord','kind':'COORDINATE_LABEL','target':'P','exact':[str(at[0]),str(at[1])]},{'id':'equation','kind':'EQUATION_LABEL','text':'f(x)='+expression,'at':[domain[1]*.65,yrange[1]*.85]}]}
        extra={'points':{'P':at},'extraFacts':[{'type':'FUNCTION_GRAPH','prefix':'g','expression':frozen,'poles':poles}],'labels':[{'id':'coord','visible':['('+','.join(str(v).replace('-','−') for v in at)+')','P: ('+','.join(str(v).replace('-','−') for v in at)+')']},{'id':'equation','visible':visible,'powers':powers}]}
        if name=='cubic':
            case['objects'][1].update(id='A',name='A');case['objects'][2]['target']='A'
            case['objects'][3]['text']='y='+expression;extra['labels'][1]['visible']='y=x3−4x'
            case['objects'] += [{'id':'B','kind':'POINT','at':[-2,0],'priority':0},{'id':'coordB','kind':'COORDINATE_LABEL','target':'B','exact':['-2','0']},{'id':'tangent','kind':'LINE','coefficients':[1,1,2]},{'id':'t','kind':'TANGENT','refs':['tangent','g'],'at':[1,-3]}, {'id':'tangentB','kind':'LINE','coefficients':[-8,1,-16]},{'id':'tB','kind':'TANGENT','refs':['tangentB','g'],'at':[-2,0]}, {'id':'equationA','kind':'EQUATION_LABEL','text':'y=-x-2','at':[2.7,-4.7]},{'id':'equationB','kind':'EQUATION_LABEL','text':'y=8x+16','at':[-.4,12.8]}]
            extra['points']={'A':[1,-3],'B':[-2,0]};extra['lineFacts']=[{'factId':'slope','type':'LINE_SLOPE','element':'tangent','expected':-1},{'factId':'intercept','type':'INTERCEPT','element':'tangent','expected':{'x':-2,'y':-2}},{'factId':'slopeB','type':'LINE_SLOPE','element':'tangentB','expected':8},{'factId':'interceptB','type':'INTERCEPT','element':'tangentB','expected':{'x':-2,'y':16}}]
            extra['labels'][0]['visible']=['(1,−3)','A: (1,−3)'];extra['labels'] += [{'id':'coordB','visible':['(−2,0)','B: (−2,0)']},{'id':'equationA','visible':'y=−x−2'},{'id':'equationB','visible':'y=8x+16'}]
        result.append((case,extra))
    return result

def main():
    save(RUN/'config/run.json',CONFIG);manifest=[]
    for spec,expected in cases():
        # Literal expected numeric/display facts are frozen before generation.
        save(RUN/'fixtures'/spec['id']/'source-expected.json',expected)
        save(RUN/'fixtures'/spec['id']/'spec.json',spec)
        result=write_candidate(spec,CONFIG)
        model=result['witness']['coordinateModel']
        model['anchors']={'origin':{'type':'INTERSECTION','elements':['x-axis','y-axis'],'expected':[0,0]},'xAxis':{'element':'model-x-unit','expected':[1,0]},'yAxis':{'element':'model-y-unit','expected':[0,1]}}
        prefix=RUN.relative_to(ROOT).as_posix()+'/candidate/'+spec['id']
        inp={'svg':prefix+'/visual.svg','witness':prefix+'/witness.json','sourceFactStatus':'PASS','expectedFactStatus':'PASS','coordinateModel':model,'expectedFacts':[{'factId':k,'type':'POINT','element':k,'expected':v} for k,v in expected['points'].items()]+expected.get('lineFacts',[]),'extraFacts':expected['extraFacts'],'expectedLabels':expected['labels']}
        save(RUN/'fixtures'/spec['id']/'static-input.json',inp)
        manifest.append({'id':spec['id'],'spec':str((RUN/'fixtures'/spec['id']/'spec.json').relative_to(ROOT)).replace('\\','/'),'svg':prefix+'/visual.svg','staticInput':str((RUN/'fixtures'/spec['id']/'static-input.json').relative_to(ROOT)).replace('\\','/'),'status':result['witness']['status']})
    save(RUN/'fixtures/manifest.json',manifest)
    print(json.dumps({'fixtures':len(manifest),'unresolved':sum(v['status']=='POLISH_REQUIRED' for v in manifest)}))
    if any(v['status']=='POLISH_REQUIRED' for v in manifest):raise SystemExit(1)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--run',default='archive/_generated/geometry-visual-engine/main-integration-v1');args=parser.parse_args()
    RUN=(ROOT/args.run).resolve();family=(ROOT/'archive/_generated/geometry-visual-engine').resolve()
    if not RUN.is_relative_to(family):raise ValueError('EVIDENCE_OUTPUT_SCOPE_VIOLATION')
    CONFIG={'engineVersion':'geometry-visual-v1','runId':RUN.name,'outputRoot':RUN.relative_to(ROOT).as_posix(),'productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False,'maxRelayoutPasses':3}
    main()
