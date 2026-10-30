# usage: publish-exam.py <exam> <srcRel> <reviewJson> <rowsJson(review rows: ord->png in run dir)> [extra ord:dir ...]
import json,sys,os
exam,src,review,rows=sys.argv[1:5]
R='/home/user/AP------/.tmp/svg-m1/runs/'
rv={r['ord']:r['A']['verdict'] for r in json.load(open(review))}
import subprocess
nullkeys=set(json.loads(subprocess.run(['node','-e',"const vm=require('vm'),fs=require('fs');const c={window:{}};vm.runInNewContext(fs.readFileSync('/home/user/AP------/'+process.argv[1],'utf8'),c);console.log(JSON.stringify(c.window.questionBank.map((q,i)=>[i+1,('solutionImage' in q)&&!q.solutionImage]).filter(x=>x[1]).map(x=>x[0])))",src],capture_output=True,text=True).stdout or '[]'))
adir='/home/user/AP------/archive/assets/images/'+os.path.basename(src)[:-3]+'/'
def nextv(o):
    k=2
    while os.path.exists(adir+f'q{o}-solution-v{k}.svg'): k+=1
    return f'q{o}-solution-v{k}.svg'
g='M2' if '_중2_' in exam else 'M3' if '_중3_' in exam else 'M1'
out=[]
for r in json.load(open(rows)):
    o=r['ord']
    if rv.get(o)!='PASS': continue
    d=os.path.dirname(r['A']); svg=d+'/out/figure-solution.svg'
    if not os.path.exists(svg): svg=d+'/figure-solution.svg'
    pj=json.load(open(d+'/publish.json'))
    alt=pj['alt'] if pj['alt'].startswith('해설 그림') else '해설 그림: '+pj['alt']
    out.append({'src':src,'ord':o,'svg':svg,'key':f'{g.lower()}-{o}','fam':g,'alt':alt,'caption':pj['caption'],'size':pj.get('size','medium'),**({'replace':True,'asset':nextv(o)} if r.get('replace') else {'replace':True,'asset':f'q{o}-solution.svg'} if o in nullkeys else {})})
json.dump(out,open(R+f'publish-rows-{exam}.json','w'),ensure_ascii=False,indent=1); print(exam,len(out),'rows; PASS ords',sorted(o for o,v in rv.items() if v=='PASS'),'FAIL',sorted(o for o,v in rv.items() if v!='PASS'))
