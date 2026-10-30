import re,sys
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
heads=[i for i,l in enumerate(lines) if re.match(r'#{1,3} ',l)]
def sec(prefix,first=True):
    for k,i in enumerate(heads):
        if lines[i].lstrip('#').strip().startswith(prefix):
            j=heads[k+1] if k+1<len(heads) else len(lines); return '\n'.join(lines[i:j])
    raise SystemExit('missing '+prefix)
core=['유사문제','1.','2.','3. 어떤','4.','5.','6.','7.','8.']
fam={'plane':['3-1.','3-8.','3-9.','3-10.','3-16.','3-41.','3-46.'],'solid':['3-입체.'],'stat':['3-11.','3-43.'],'graph':['3-2.','3-14.','3-50.'],'numline':[]}
out=sys.argv[2]
open(out+'/guide-core.md','w',encoding='utf-8',newline='\n').write('\n\n'.join(sec(p) for p in core))
for f,ps in fam.items():
    if ps: open(out+f'/guide-{f}.md','w',encoding='utf-8',newline='\n').write('\n\n'.join(sec(p) for p in ps))
