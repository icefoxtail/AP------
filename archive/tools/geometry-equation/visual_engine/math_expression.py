"""Small bounded expression grammar. Regex lexes tokens; trees serialize math."""
from __future__ import annotations
from dataclasses import dataclass
from fractions import Fraction
import html
import math
import re

FUNCTIONS={'sqrt':math.sqrt,'sin':math.sin,'cos':math.cos,'tan':math.tan,
           'log':math.log,'ln':math.log,'exp':math.exp,'abs':abs}
CALL_SYMBOLS=set('fghpq')
TOKEN=re.compile(r'\s*(\d+(?:\.\d+)?|[A-Za-zαβθπ]+|<=|>=|!=|[+*/^_\-=<>()\x27,])')

@dataclass(frozen=True)
class Expr:
    kind: str
    value: str=''
    args: tuple=()

class Parser:
    def __init__(self,source):
        if not isinstance(source,str) or not source.strip() or len(source)>2048 or '\\' in source:
            raise ValueError('UNRESOLVED_EXPRESSION')
        source=source.strip().replace('−','-')
        self.tokens=[];end=0
        while end<len(source):
            hit=TOKEN.match(source,end)
            if not hit:raise ValueError('UNSUPPORTED_MATH_TOKEN:'+source[end:end+12])
            self.tokens.append(hit[1]);end=hit.end()
        self.tokens.append('EOF');self.i=0;self.nodes=0

    def peek(self):return self.tokens[self.i]
    def take(self):v=self.peek();self.i+=1;return v
    def expect(self,value):
        if self.take()!=value:raise ValueError('MATH_DELIMITER_MISMATCH')
    def node(self,kind,value='',args=()):
        self.nodes+=1
        if self.nodes>256:raise ValueError('EXPRESSION_NODE_LIMIT')
        return Expr(kind,value,tuple(args))

    def expr(self,bp=0,depth=0):
        if depth>32:raise ValueError('EXPRESSION_DEPTH_LIMIT')
        token=self.take()
        if token in ('+','-'):left=self.node('unary',token,(self.expr(25,depth+1),))
        elif token=='(':
            rows=[self.expr(0,depth+1)]
            while self.peek()==',':self.take();rows.append(self.expr(0,depth+1))
            self.expect(')')
            left=self.node('tuple' if len(rows)>1 else 'group',args=rows)
        elif token[0].isdigit():left=self.node('number',token)
        elif token.isalpha() and token!='EOF':
            if token in FUNCTIONS and self.peek()!='(':raise ValueError('FUNCTION_CALL_REQUIRED')
            left=self.node('symbol',token)
        else:raise ValueError('UNEXPECTED_MATH_TOKEN:'+token)
        while True:
            op=self.peek()
            if op in ("'",'_') and bp<=40:
                self.take()
                left=self.node('prime',args=(left,)) if op=="'" else self.node('subscript',args=(left,self.expr(41,depth+1)))
                continue
            base=left
            while base.kind=='prime':base=base.args[0]
            if op=='(' and base.kind=='symbol' and base.value in (FUNCTIONS.keys()|CALL_SYMBOLS) and bp<=40:
                self.take();args=[self.expr(0,depth+1)]
                while self.peek()==',':self.take();args.append(self.expr(0,depth+1))
                self.expect(')')
                if base.value in FUNCTIONS and len(args)!=1:raise ValueError('FUNCTION_ARITY')
                left=self.node('call',args=(left,*args));continue
            powers={'=':5,'<':5,'>':5,'<=':5,'>=':5,'!=':5,'+':10,'-':10,'*':20,'/':20,'^':30}
            implicit=op=='(' or (op!='EOF' and (op[0].isdigit() or op.isalpha()))
            priority=20 if implicit else powers.get(op,-1)
            if priority<bp:break
            if implicit:kind='implicit'
            else:self.take();kind=op
            right=self.expr(priority if op=='^' and not implicit else priority+1,depth+1)
            left=self.node('binary',kind,(left,right))
        return left

def parse(source):
    parser=Parser(source); result=parser.expr()
    if parser.peek()!='EOF':raise ValueError('UNRESOLVED_EXPRESSION')
    return result

def serialize(node,mode='tex'):
    """TeX, readable plain notation, or SVG text runs with real super/subscripts."""
    def s(v):return serialize(v,mode)
    def escape(v):return html.escape(v) if mode=='svg' else v
    k=node.kind; a=node.args
    if k=='number':return node.value
    if k in {'entity','variable','constant','degree','unit'}:
        if k=='entity':
            if not re.fullmatch(r'[A-Za-z]{1,8}',node.value):raise ValueError('INVALID_ENTITY_NOTATION')
            return r'\mathrm{'+node.value+'}' if mode=='tex' else escape(node.value)
        if k=='variable':
            if not re.fullmatch(r'[A-Za-zαβθ]{1,16}',node.value):raise ValueError('INVALID_VARIABLE_NOTATION')
            return escape(node.value)
        if k=='constant':
            if node.value not in {'pi','π','e'}:raise ValueError('UNKNOWN_CONSTANT')
            return (r'\pi' if mode=='tex' else 'π') if node.value in {'pi','π'} else 'e'
        if len(a)!=1:raise ValueError('NOTATION_ARITY')
        if k=='degree':return s(a[0])+(r'^{\circ}' if mode=='tex' else '°')
        if not re.fullmatch(r'[A-Za-z]{1,8}',node.value):raise ValueError('INVALID_UNIT_NOTATION')
        return s(a[0])+(r'\,\mathrm{'+node.value+'}' if mode=='tex' else ' '+escape(node.value))
    if k=='symbol':
        if mode=='svg':return '<tspan font-style="italic">'+escape(node.value)+'</tspan>'
        return {'pi':r'\pi','π':r'\pi','α':r'\alpha','β':r'\beta','θ':r'\theta'}.get(node.value,node.value) if mode=='tex' else ('π' if node.value=='pi' else node.value)
    if k=='group':return '('+s(a[0])+')'
    if k=='tuple':return '('+','.join(s(v) for v in a)+')'
    if k=='unary':
        child=s(a[0]);child='('+child+')' if a[0].kind=='binary' and a[0].value in {'+','-','=','<','>'} else child
        return ('−' if node.value=='-' and mode!='tex' else node.value)+child
    if k in {'prime','subscript'}:
        if k=='prime':
            base=node;count=0
            while base.kind=='prime':count+=1;base=base.args[0]
            return s(base)+('^{'+r'\prime'*count+'}' if mode=='tex' else '′'*count)
        tail='′' if k=='prime' else s(a[1])
        if mode=='tex':return s(a[0])+('^{\\prime}' if k=='prime' else '_{'+tail+'}')
        if mode=='svg' and k=='subscript':return s(a[0])+'<tspan baseline-shift="sub" font-size="70%">'+tail+'</tspan>'
        return s(a[0])+('′' if k=='prime' else '_'+tail)
    if k=='call':
        name=a[0].value if a[0].kind=='symbol' else ''
        if name=='sqrt':return ('\\sqrt{'+s(a[1])+'}') if mode=='tex' else '√('+s(a[1])+')'
        if name=='abs' and mode=='tex':return r'\left|'+s(a[1])+r'\right|'
        if mode=='tex' and name=='ln':fn=r'\ln'
        elif mode=='tex' and name in FUNCTIONS:fn='\\'+name
        else:fn=escape(name) if name in FUNCTIONS else s(a[0])
        return fn+'('+','.join(s(v) for v in a[1:])+')'
    if k=='binary':
        left,right=a;op=node.value
        priorities={'=':5,'<':5,'>':5,'<=':5,'>=':5,'!=':5,'+':10,'-':10,'*':20,'implicit':20,'/':20,'^':30}
        def operand(child,right_side=False):
            text=s(child)
            if child.kind=='unary' and op=='^' and not right_side:return '('+text+')'
            if child.kind!='binary':return text
            low=priorities.get(child.value,0)<priorities.get(op,0)
            equal=priorities.get(child.value,0)==priorities.get(op,0)
            wrap=low or (equal and ((right_side and op in {'-','/','='}) or (op=='^' and not right_side)))
            return '('+text+')' if wrap else text
        if op=='^':
            if mode=='tex':return operand(left)+'^{'+s(right)+'}'
            if mode=='svg':return operand(left)+'<tspan baseline-shift="super" font-size="70%">'+s(right)+'</tspan>'
            return operand(left)+'^('+s(right)+')'
        if op=='/':
            if mode=='tex':return '\\frac{'+s(left)+'}{'+s(right)+'}'
            return (s(left) if left.kind in {'number','symbol','group','call','prime','subscript','unary'} else '('+s(left)+')')+'/'+(s(right) if right.kind in {'number','symbol','group','call','prime','subscript'} else '('+s(right)+')')
        mapped={'implicit':'','*':'\\cdot ' if mode=='tex' else '·','-':'-' if mode=='tex' else '−', '<=':'\\le ' if mode=='tex' else '≤','>=':'\\ge ' if mode=='tex' else '≥','!=':'\\ne ' if mode=='tex' else '≠'}
        return operand(left)+escape(mapped.get(op,op))+operand(right,True)
    raise ValueError('UNKNOWN_AST_NODE')

def evaluate(node,values=None):
    values=values or {};k=node.kind;a=node.args
    e=lambda v:evaluate(v,values)
    if k=='number':return Fraction(node.value)
    if k=='symbol':
        if node.value in values:return values[node.value]
        if node.value in {'pi','π','e'}:return math.e if node.value=='e' else math.pi
        raise ValueError('UNRESOLVED_SYMBOL:'+node.value)
    if k=='group':return e(a[0])
    if k=='tuple':return tuple(e(v) for v in a)
    if k=='unary':return -e(a[0]) if node.value=='-' else e(a[0])
    if k=='call' and a[0].kind=='symbol' and a[0].value in FUNCTIONS:
        return FUNCTIONS[a[0].value](float(e(a[1])))
    if k=='binary':
        l,r=e(a[0]),e(a[1]);op=node.value
        if op=='+':return l+r
        if op=='-':return l-r
        if op in {'*','implicit'}:return l*r
        if op=='/':return l/r
        if op=='^':
            if abs(r)>64:raise ValueError('POWER_LIMIT')
            return l**r
        if op=='=':return l==r
        if op=='!=':return l!=r
        if op=='<':return l<r
        if op=='>':return l>r
        if op=='<=':return l<=r
        if op=='>=':return l>=r
    raise ValueError('UNEVALUABLE_EXPRESSION')

def exact_coordinate(source,numeric,source_decimal=False,values=None):
    tree=parse(source)
    if '.' in source and not source_decimal:raise ValueError('INVALID_STUDENT_DECIMAL_LABEL')
    value=evaluate(tree,values)
    if isinstance(value,(bool,tuple,complex)) or not math.isfinite(float(value)) or abs(float(value)-numeric)>1e-9:
        raise ValueError('DISPLAY_COORDINATE_PARITY_FAIL')
    # Normalize rational coordinate labels, without guessing floats as rationals.
    if isinstance(value,Fraction):
        return str(value).replace('-','−')
    return serialize(tree,'plain')
