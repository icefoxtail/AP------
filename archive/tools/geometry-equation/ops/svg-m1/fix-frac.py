# usage: python3 fix-frac.py <exam.js>... : in auto-math lines (no '$'), rewrite \dfrac/\frac/\tfrac with brace-less args to braced form.
import re,sys
CMD=re.compile(rb'\\\\([dt]?frac)')
def arg(l,i):
    while i<len(l) and l[i:i+1]==b' ': i+=1
    if l[i:i+1]==b'{':
        d=0;j=i
        while j<len(l):
            c=l[j:j+1]; d+= c==b'{'; d-= c==b'}'
            if d==0: return l[i+1:j],j+1
            j+=1
        return None,i
    if l[i:i+2]==b'\\\\':  # escaped TeX command as argument: leave alone
        return None,i
    return l[i:i+1],i+1
for p in sys.argv[1:]:
    b=open(p,'rb').read(); lines=b.split(b'\n'); total=0
    for n,l in enumerate(lines):
        if b'$' in l or not CMD.search(l): continue
        out=b'';i=0
        while True:
            m=CMD.search(l,i)
            if not m: out+=l[i:]; break
            out+=l[i:m.end()]; j=m.end()
            a1,j1=arg(l,j)
            if a1 is None or l[j:j+1]==b'{' and l[j1:j1+1]==b'{': i=j; continue
            a2,j2=arg(l,j1)
            if a2 is None: i=j; continue
            out+=b'{'+a1+b'}{'+a2+b'}'; i=j2; total+=1
        lines[n]=out
    open(p,'wb').write(b'\n'.join(lines)); print(p.split('/')[-1],'fixed',total)
