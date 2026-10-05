"""Analytic chain rules on the safe expression tree; no eval or slope guesses."""
import math
from .math_expression import evaluate

def value_derivative(node,x):
    k=node.kind;a=node.args
    if k=='number':return float(evaluate(node)),0.
    if k=='symbol':
        if node.value=='x':return x,1.
        return float(evaluate(node)),0.
    if k=='group':return value_derivative(a[0],x)
    if k=='unary':
        v,d=value_derivative(a[0],x);return (-v,-d) if node.value=='-' else (v,d)
    if k=='binary':
        u,du=value_derivative(a[0],x);v,dv=value_derivative(a[1],x);op=node.value
        if op=='+':return u+v,du+dv
        if op=='-':return u-v,du-dv
        if op in {'*','implicit'}:return u*v,du*v+u*dv
        if op=='/':return u/v,(du*v-u*dv)/(v*v)
        if op=='^':
            if abs(v)>64:raise ValueError('POWER_LIMIT')
            if dv==0:
                if v==0:return 1.,0.
                return u**v,v*u**(v-1)*du
            if u<=0:raise ValueError('NONDIFFERENTIABLE_POWER')
            value=u**v;return value,value*(dv*math.log(u)+v*du/u)
    if k=='call' and a[0].kind=='symbol':
        u,du=value_derivative(a[1],x);name=a[0].value
        if name=='sin':return math.sin(u),math.cos(u)*du
        if name=='cos':return math.cos(u),-math.sin(u)*du
        if name=='tan':return math.tan(u),du/math.cos(u)**2
        if name=='exp':return math.exp(u),math.exp(u)*du
        if name=='log':return math.log(u),du/u
        if name=='sqrt':return math.sqrt(u),du/(2*math.sqrt(u))
        if name=='abs':
            if u==0:raise ValueError('NONDIFFERENTIABLE_ABS')
            return abs(u),du*(1 if u>0 else -1)
    raise ValueError('UNSUPPORTED_DERIVATIVE')
