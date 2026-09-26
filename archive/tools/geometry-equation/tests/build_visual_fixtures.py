"""Bounded code regression fixtures, not GOLD iterations or FULL PILOT."""
import sys,json,math,hashlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.engine import write_candidate,ROOT

RUN=ROOT/'archive/_generated/geometry-visual-engine/upgrade-v1'
CONFIG={'engineVersion':'geometry-visual-v1','runId':'upgrade-v1','outputRoot':'archive/_generated/geometry-visual-engine/upgrade-v1','productionBaselinePolicy':'READ_ONLY','allowProductionWrite':False,'maxRelayoutPasses':3}

def save(path,value):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

def cases():
    common={'sourceFacts':{'independentFactHash':'code-regression-source-freeze-v1'},'derivedFacts':{},'displayFacts':{}}
    circle={**common,'id':'circle-source','title':'중심과 반지름','visualType':'line_circle_geometry','viewport':{'xMin':-4,'xMax':4,'yMin':-1,'yMax':6},'objects':[
        {'id':'C','kind':'POINT','at':[-1,3],'priority':0},{'id':'R','kind':'POINT','at':[1,3]},
        {'id':'circle','kind':'CIRCLE','center':[-1,3],'radius':2},{'id':'radius','kind':'SEGMENT','from':[-1,3],'to':[1,3]},
        {'id':'C-coordinate','kind':'COORDINATE_LABEL','target':'C','exact':['-1','3']},
        {'id':'equation','kind':'EQUATION_LABEL','text':'(x+1)^2+(y-3)^2=2^2','at':[2,5]}]}
    m=(3-math.sqrt(2)/3)/2;M=(3+math.sqrt(2)/3)/2
    cluster={**common,'id':'circle-cluster','title':'원과 접점','visualType':'line_circle_geometry','viewport':{'xMin':0,'xMax':3,'yMin':0,'yMax':3},'displayFacts':{'symbolDefinitions':{'m':'(3-sqrt(2)/3)/2','M':'(3+sqrt(2)/3)/2'}},'objects':[
        {'id':'C1','kind':'POINT','name':'C₁','at':[m,m],'priority':0},{'id':'C2','kind':'POINT','name':'C₂','at':[M,M],'priority':0},{'id':'T','kind':'POINT','at':[1.5,1.5],'priority':0},
        {'id':'circle1','kind':'CIRCLE','center':[m,m],'radius':1/3},{'id':'circle2','kind':'CIRCLE','center':[M,M],'radius':1/3},
        {'id':'tangent','kind':'LINE','coefficients':[1,1,-3]},
        {'id':'t1','kind':'TANGENT','refs':['tangent','circle1'],'at':[1.5,1.5]},{'id':'t2','kind':'TANGENT','refs':['tangent','circle2'],'at':[1.5,1.5]},
        {'id':'coord1','kind':'COORDINATE_LABEL','target':'C1','exact':['m','m']},{'id':'coord2','kind':'COORDINATE_LABEL','target':'C2','exact':['M','M']},{'id':'coordT','kind':'COORDINATE_LABEL','target':'T','exact':['3/2','3/2']},
        {'id':'m-definition','kind':'EQUATION_LABEL','text':'m=(3-sqrt(2)/3)/2','at':[2.5,2.7]},
        {'id':'M-definition','kind':'EQUATION_LABEL','text':'M=(3+sqrt(2)/3)/2','at':[2.5,2.4]}]}
    return [(circle,{'points':{'C':[-1,3],'R':[1,3]},'extraFacts':[{'type':'CIRCLE','element':'circle','center':[-1,3],'radius':2}],
        'labels':[{'id':'C-coordinate','visible':['(−1,3)','C: (−1,3)']},{'id':'equation','visible':'(x+1)2+(y−3)2=22','powers':['2','2','2']}]}),
        (cluster,{'points':{'C1':[m,m],'C2':[M,M],'T':[1.5,1.5]},'lineFacts':[{'factId':'tangent-slope','type':'LINE_SLOPE','element':'tangent','expected':-1},{'factId':'tangent-intercept','type':'INTERCEPT','element':'tangent','expected':{'x':3,'y':3}}],'extraFacts':[{'type':'CIRCLE','element':'circle1','center':[m,m],'radius':1/3},{'type':'CIRCLE','element':'circle2','center':[M,M],'radius':1/3}],
        'labels':[{'id':'coord1','visible':['(m,m)','C1: (m,m)']},{'id':'coord2','visible':['(M,M)','C2: (M,M)']},{'id':'coordT','visible':['(3/2,3/2)','T: (3/2,3/2)']},{'id':'m-definition','visible':'m=(3−√(2)/3)/2'},{'id':'M-definition','visible':'M=(3+√(2)/3)/2'}]})]

def main():
    save(RUN/'config/run.json',CONFIG);manifest=[]
    for spec,expected in cases():
        # Literal expected numeric/display facts are frozen before generation.
        save(RUN/'fixtures'/spec['id']/'source-expected.json',expected)
        save(RUN/'fixtures'/spec['id']/'spec.json',spec)
        result=write_candidate(spec,CONFIG)
        model=result['witness']['coordinateModel']
        model['anchors']={'origin':{'type':'INTERSECTION','elements':['x-axis','y-axis'],'expected':[0,0]},'xAxis':{'element':'model-x-unit','expected':[1,0]},'yAxis':{'element':'model-y-unit','expected':[0,1]}}
        prefix='archive/_generated/geometry-visual-engine/upgrade-v1/candidate/'+spec['id']
        inp={'svg':prefix+'/visual.svg','witness':prefix+'/witness.json','sourceFactStatus':'PASS','expectedFactStatus':'PASS','coordinateModel':model,'expectedFacts':[{'factId':k,'type':'POINT','element':k,'expected':v} for k,v in expected['points'].items()]+expected.get('lineFacts',[]),'extraFacts':expected['extraFacts'],'expectedLabels':expected['labels']}
        save(RUN/'fixtures'/spec['id']/'static-input.json',inp)
        manifest.append({'id':spec['id'],'spec':str((RUN/'fixtures'/spec['id']/'spec.json').relative_to(ROOT)).replace('\\','/'),'svg':prefix+'/visual.svg','staticInput':str((RUN/'fixtures'/spec['id']/'static-input.json').relative_to(ROOT)).replace('\\','/'),'status':result['witness']['status']})
    save(RUN/'fixtures/manifest.json',manifest)
    print(json.dumps({'fixtures':len(manifest),'unresolved':sum(v['status']=='POLISH_REQUIRED' for v in manifest)}))
    if any(v['status']=='POLISH_REQUIRED' for v in manifest):raise SystemExit(1)

if __name__=='__main__':main()
