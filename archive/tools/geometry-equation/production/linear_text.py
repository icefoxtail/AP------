"""Exact reading of a free line-equation text (E31): "y=ax+6", "x-1=0", "ax+y+4=0".

The text of a line label that is not generated from the line's coefficients (a symbolic equation, a vertical line written x=1) is read as a linear
equation in x and y with exact rational arithmetic. `values` gives the number a letter other than x and y stands for in the drawing
({"a":"3/2"}: the figure shows the line for a=3/2). A letter without a value makes the text symbolic: its coefficients cannot be compared with a drawn line
and the reader answers None (the label is shown as written, not verified). A malformed or non-linear text is refused with its own code.

Used by the graph framer for graphPlan.overlays.lines[].label; the independent observers carry their own readers.
"""
import re
from fractions import Fraction

TEXT_PATTERN=re.compile(r'[0-9A-Za-z=+\-*/().^ ]{1,40}')
_TOKEN=re.compile(r'\s*(?:(\d+(?:\.\d+)?)|([A-Za-z])|([=+\-*/().^]))')

class _Symbolic:
    """An expression that holds a letter with no value: only its being there matters."""

def _tokens(text):
    out=[];position=0;text=text.strip()
    while position<len(text):
        match=_TOKEN.match(text,position)
        if match is None:raise ValueError('LINE_TEXT_INVALID')
        number,letter,symbol=match.groups();out.append(('n',Fraction(number)) if number else ('l',letter) if letter else ('s',symbol));position=match.end()
    return out

def _add(a,b,sign=1):
    if isinstance(a,_Symbolic) or isinstance(b,_Symbolic):return _Symbolic()
    out=dict(a)
    for key,value in b.items():out[key]=out.get(key,Fraction(0))+sign*value
    return out

def _is_constant(value):return not isinstance(value,_Symbolic) and all(key=='1' or coefficient==0 for key,coefficient in value.items())

def _times(a,b):
    if isinstance(a,_Symbolic) or isinstance(b,_Symbolic):return _Symbolic()
    if _is_constant(a):scale,other=a.get('1',Fraction(0)),b
    elif _is_constant(b):scale,other=b.get('1',Fraction(0)),a
    else:raise ValueError('LINE_TEXT_NOT_LINEAR')
    return {key:scale*value for key,value in other.items()}

def _divide(a,b):
    if isinstance(b,_Symbolic):return _Symbolic()
    if not _is_constant(b):raise ValueError('LINE_TEXT_NOT_LINEAR')
    divisor=b.get('1',Fraction(0))
    if divisor==0:raise ValueError('LINE_TEXT_INVALID')
    if isinstance(a,_Symbolic):return a
    return {key:value/divisor for key,value in a.items()}

class _Reader:
    def __init__(self,tokens,values):self.tokens=tokens;self.at=0;self.values=values
    def peek(self):return self.tokens[self.at] if self.at<len(self.tokens) else None
    def take(self):token=self.peek();self.at+=1;return token
    def side(self):
        value=self.term()
        while self.peek() in (('s','+'),('s','-')):
            sign=1 if self.take()[1]=='+' else -1;value=_add(value,self.term(),sign)
        return value
    def starts_atom(self):
        token=self.peek();return token is not None and (token[0] in 'nl' or token==('s','('))
    def term(self):
        value=self.unary()
        while True:
            token=self.peek()
            if token==('s','*'):self.take();value=_times(value,self.unary())
            elif token==('s','/'):self.take();value=_divide(value,self.unary())
            elif self.starts_atom():value=_times(value,self.unary())      # implicit product: 2x, ax, 3(x-1)
            else:return value
    def unary(self):
        token=self.peek()
        if token in (('s','-'),('s','+')):
            self.take();inner=self.unary();return inner if token[1]=='+' else _times({'1':Fraction(-1)},inner)
        return self.power()
    def power(self):
        base=self.atom()
        if self.peek()==('s','^'):
            self.take();exponent=self.take()
            if exponent is None or exponent[0]!='n' or exponent[1] not in (0,1):raise ValueError('LINE_TEXT_NOT_LINEAR')
            return {'1':Fraction(1)} if exponent[1]==0 else base
        return base
    def atom(self):
        token=self.take()
        if token is None:raise ValueError('LINE_TEXT_INVALID')
        if token[0]=='n':return {'1':token[1]}
        if token[0]=='l':
            letter=token[1]
            if letter in ('x','y'):return {letter:Fraction(1)}
            if letter in self.values:return {'1':self.values[letter]}
            return _Symbolic()
        if token==('s','('):
            value=self.side()
            if self.take()!=('s',')'):raise ValueError('LINE_TEXT_INVALID')
            return value
        raise ValueError('LINE_TEXT_INVALID')

def read_values(values):
    """{"a":"3/2"} -> {"a":Fraction(3,2)}: single letters other than x and y, exact integer or fraction strings."""
    if values is None:return {}
    if not isinstance(values,dict):raise ValueError('LINE_TEXT_VALUES_INVALID')
    out={}
    for letter,text in values.items():
        if not isinstance(letter,str) or not re.fullmatch(r'[A-Za-z]',letter) or letter in ('x','y') or not isinstance(text,str) or not re.fullmatch(r'-?\d+(?:/\d+)?',text):raise ValueError('LINE_TEXT_VALUES_INVALID')
        if re.fullmatch(r'-?\d+/0+',text):raise ValueError('LINE_TEXT_VALUES_INVALID')
        out[letter]=Fraction(text)
    return out

def read_equation(text,values=None):
    """The text as (A,B,C) with A*x+B*y+C=0 (exact Fractions, lhs minus rhs), or None when it holds a letter with no value. Raises
    LINE_TEXT_INVALID (not an equation of one '=', characters outside the grammar) or LINE_TEXT_NOT_LINEAR (x*y, a power, a division by x or y)."""
    if not isinstance(text,str) or TEXT_PATTERN.fullmatch(text) is None or text.count('=')!=1:raise ValueError('LINE_TEXT_INVALID')
    tokens=_tokens(text);cut=tokens.index(('s','='))
    sides=[]
    for part in (tokens[:cut],tokens[cut+1:]):
        if not part:raise ValueError('LINE_TEXT_INVALID')
        reader=_Reader(part,read_values(values));value=reader.side()
        if reader.peek() is not None:raise ValueError('LINE_TEXT_INVALID')
        sides.append(value)
    if isinstance(sides[0],_Symbolic) or isinstance(sides[1],_Symbolic):return None
    diff=_add(sides[0],sides[1],-1)
    return diff.get('x',Fraction(0)),diff.get('y',Fraction(0)),diff.get('1',Fraction(0))

def same_line(equation,coefficients):
    """True when A x + B y + C = 0 (the read text) and a x + b y + c = 0 are the same line: the two coefficient triples are proportional, neither all zero."""
    a1,b1,c1=equation;a2,b2,c2=coefficients
    if (a1==0 and b1==0) or (a2==0 and b2==0):return False
    return a1*b2==a2*b1 and a1*c2==a2*c1 and b1*c2==b2*c1
