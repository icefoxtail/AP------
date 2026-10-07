"""Bounded adaptive sampling with domain signatures and polynomial pole isolation."""
import math
from .math_expression import parse,evaluate
from .geometry_model import finite,point

def polynomial(node):
    k=node.kind;a=node.args
    if k=='number':return [float(node.value)]
    if k=='symbol' and node.value=='x':return [0,1]
    if k=='group':return polynomial(a[0])
    if k=='unary':return [v*(-1 if node.value=='-' else 1) for v in polynomial(a[0])]
    if k!='binary':raise ValueError('NONPOLYNOMIAL')
    p,q=polynomial(a[0]),polynomial(a[1]);op=node.value
    if op in ('+','-'):
        return [(p[i] if i<len(p) else 0)+(1 if op=='+' else -1)*(q[i] if i<len(q) else 0) for i in range(max(len(p),len(q)))]
    if op=='/' and len(q)==1:return [v/q[0] for v in p]
    if op=='^' and len(q)==1 and q[0].is_integer() and 0<=q[0]<=4:
        result=[1]
        for _ in range(int(q[0])):result=poly_mul(result,p)
        return result
    if op in ('*','implicit'):return poly_mul(p,q)
    raise ValueError('NONPOLYNOMIAL')

def poly_mul(p,q):
    out=[0]*(len(p)+len(q)-1)
    for i,v in enumerate(p):
        for j,w in enumerate(q):out[i+j]+=v*w
    if len(out)>9:raise ValueError('POLYNOMIAL_DEGREE_LIMIT')
    return out

def poly_value(p,x):
    value=0
    for a in reversed(p):value=value*x+a
    return value

def roots(p,lo,hi):
    p=list(p)
    while len(p)>1 and abs(p[-1])<1e-14:p.pop()
    if len(p)<=1:return []
    if len(p)==2:
        x=-p[0]/p[1];return [x] if lo<=x<=hi else []
    cuts=[lo,*roots([i*p[i] for i in range(1,len(p))],lo,hi),hi]
    hits=[x for x in cuts if abs(poly_value(p,x))<1e-10]
    for l,r in zip(cuts,cuts[1:]):
        if poly_value(p,l)*poly_value(p,r)>=0:continue
        for _ in range(60):
            mid=(l+r)/2
            if poly_value(p,l)*poly_value(p,mid)<=0:r=mid
            else:l=mid
        hits.append((l+r)/2)
    return sorted(set(round(x,12) for x in hits))

def constraints(tree):
    found=[]
    def visit(n):
        if n.kind=='binary' and n.value=='/':found.append(('denominator',n.args[1]))
        if n.kind=='call' and n.args[0].kind=='symbol' and n.args[0].value in {'log','ln','sqrt','tan'}:
            found.append((n.args[0].value,n.args[1]))
        for v in n.args:visit(v)
    visit(tree);return found

def sample(expression,domain,viewport,critical_x=(),breaks=(),max_depth=12):
    tree=parse(expression);lo,hi=point(domain)
    if lo>=hi or not 1<=max_depth<=16:raise ValueError('INVALID_SAMPLING_CONFIG')
    guards=constraints(tree);cuts=[lo,hi,*[finite(x) for x in breaks if lo<x<hi]];hard_cuts=set(breaks);critical=list(critical_x)
    for kind,n in guards:
        if kind in {'denominator','log','sqrt'}:
            try:
                hits=roots(polynomial(n),lo,hi);cuts.extend(hits)
                if kind!='sqrt':hard_cuts.update(hits)
            except ValueError:pass
    try:
        p=polynomial(tree)
        for _ in range(3):
            critical.extend(roots(p,lo,hi));p=[i*p[i] for i in range(1,len(p))]
    except ValueError:pass
    cuts=sorted(set(cuts));warnings=[];cache={};max_error=0
    def at(x):
        if x in cache:return cache[x]
        try:
            value=evaluate(tree,{'x':x})
            if isinstance(value,(bool,tuple,complex)):raise ValueError('NONSCALAR_GRAPH')
            y=finite(float(value));signature=[]
            for kind,n in guards:
                z=finite(float(evaluate(n,{'x':x})))
                if kind=='denominator':
                    if abs(z)<1e-14:raise ValueError('POLE')
                    signature.append(1 if z>0 else -1)
                elif kind in {'log','ln'}:
                    if z<=0:raise ValueError('LOG_DOMAIN')
                elif kind=='sqrt':
                    if z<0:raise ValueError('SQRT_DOMAIN')
                elif kind=='tan':signature.append(math.floor((z+math.pi/2)/math.pi))
            result=(x,y,tuple(signature))
        except (ValueError,ZeroDivisionError,OverflowError,TypeError):result=None
        cache[x]=result;return result
    def refine(x0,x1,depth):
        nonlocal max_error
        p,q=at(x0),at(x1);xm=(x0+x1)/2;m=at(xm)
        if p is None or q is None or m is None:return [p,None,q]
        if p[2]!=q[2] or m[2]!=p[2]:return [p,None,q]
        error=abs(m[1]-(p[1]+q[1])/2)*viewport.sy
        chord=math.hypot((x1-x0)*viewport.sx,(q[1]-p[1])*viewport.sy)
        outside=(p[1]<viewport.yMin and q[1]<viewport.yMin and m[1]<viewport.yMin) or (p[1]>viewport.yMax and q[1]>viewport.yMax and m[1]>viewport.yMax)
        if outside:return [p,q]
        if error>.35 or chord>16:
            if depth>=max_depth:
                warnings.append({'code':'REFINEMENT_CAP','interval':[x0,x1],'errorPx':error})
                return [p,None,q]
            return refine(x0,xm,depth+1)[:-1]+refine(xm,x1,depth+1)
        max_error=max(max_error,error);return [p,q]
    branches=[]
    def emit(raw):
        current=[];previous=None
        for p in raw:
            if p is None:
                if len(current)>1:branches.append(current)
                current=[];previous=None;continue
            xy=p[:2]
            if viewport.yMin<=p[1]<=viewport.yMax:
                if not current and previous is not None and previous[2]==p[2] and not viewport.yMin<=previous[1]<=viewport.yMax:
                    bound=viewport.yMax if previous[1]>viewport.yMax else viewport.yMin
                    t=(bound-previous[1])/(p[1]-previous[1])
                    current.append((previous[0]+t*(p[0]-previous[0]),bound))
                if not current or xy!=current[-1]:current.append(xy)
            else:
                if current:
                    last=current[-1];bound=viewport.yMax if p[1]>viewport.yMax else viewport.yMin
                    t=(bound-last[1])/(p[1]-last[1]);current.append((last[0]+t*(p[0]-last[0]),bound))
                    if len(current)>1:branches.append(current)
                current=[]
            previous=p
        if len(current)>1:branches.append(current)
    for index,(l,r) in enumerate(zip(cuts,cuts[1:])):
        eps=max(1e-10,(r-l)*1e-9)
        start=l+(eps if l in hard_cuts else 0);end=r-(eps if r in hard_cuts else 0)
        count=max(300 if guards else 200,math.ceil(viewport.plotWidth/(1 if guards else 1.5)))
        positions=sorted(set([start+(end-start)*i/count for i in range(count+1)]+[x for x in critical if start<=x<=end]))
        raw=[]
        for a,b in zip(positions,positions[1:]):raw.extend(refine(a,b,0)[:-1])
        raw.append(at(end));emit(raw)
    # Clipping can leave fewer than the required branch density even though
    # the source domain was densely sampled. Re-evaluate each visible branch;
    # never densify by interpolating a curve's y values.
    dense=[]
    density=max(300 if guards else 200,math.ceil(viewport.plotWidth/(1 if guards else 1.5)))
    for branch in branches:
        extra={p[0]:p for p in branch}
        start,end=branch[0][0],branch[-1][0]
        for i in range(1,density):
            x=start+(end-start)*i/density;p=at(x)
            if p is not None and viewport.yMin<=p[1]<=viewport.yMax:extra[x]=p[:2]
        dense.append([extra[x] for x in sorted(extra)])
    branches=dense
    if not branches:warnings.append({'code':'NO_VISIBLE_BRANCH'})
    return {'branches':branches,'sampleCount':sum(map(len,branches)),'branchCount':len(branches),
        'adaptive':True,'screenSpaceChordErrorPx':max_error,'warnings':warnings,'domainCuts':cuts,
        'criticalX':sorted(set(critical)),'status':'POLISH_REQUIRED' if warnings else 'PASS'}
