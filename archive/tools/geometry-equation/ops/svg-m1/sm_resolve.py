import re,ast,sys
p=sys.argv[1]; s=open(p).read()
while True:
    m=re.search(r"<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [^\n]*\n",s,re.S)
    if not m: break
    def parse(block):
        d={}
        for line in block.split('\n'):
            k,v=line.split('=',1); d[k]=v
        return d
    A,B=parse(m.group(1)),parse(m.group(2))
    assert set(A)<= {'FIELDS','REQUIRED'} and set(B)<={'FIELDS','REQUIRED'} and set(A)==set(B),(A.keys(),B.keys())
    out=[]
    if 'FIELDS' in A:
        fa=re.findall(r"'([^']+)'",A['FIELDS']); fb=re.findall(r"'([^']+)'",B['FIELDS'])
        out.append("FIELDS={"+",".join(f"'{x}'" for x in fa+[x for x in fb if x not in set(fa)])+"}")
    if 'REQUIRED' in A:
        ra=ast.literal_eval(A['REQUIRED']); rb=ast.literal_eval(B['REQUIRED'])
        for k,v in rb.items():
            if k in ra: assert ra[k]==v,(k,)
        extra=[k for k in rb if k not in ra]
        req=A['REQUIRED'].rstrip(); req=req[:-1]+''.join(f",'{k}':{{"+','.join(f"'{x}'" for x in sorted(rb[k]))+"}" for k in extra)+'}'
        out.append("REQUIRED="+req)
    s=s[:m.start()]+"\n".join(out)+"\n"+s[m.end():]
open(p,'w').write(s); ast.parse(s); print('resolved',p)
