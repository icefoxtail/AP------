r"""Value labels of a segment or a line in an ellipse / conic figure, read back as numbers (observer side, B04).

A segment label such as `10`, `3\sqrt{5}` or `\frac{24}{5}` is the length of its segment, and a line label such as `y=-2x+7`, `y=3x/4` or `x=4` is the line itself.
These functions only parse: a label that is not a plain number (a name, a word, an expression with other letters) or not a line in x and y returns None, and the caller then checks
nothing about its value (a name like `l_1` or `a+b` is the author's, not a measurement). A label that does parse is compared by the caller with the exact figure; a mismatch is an error.
"""
import re

import sympy as S
from sympy.parsing.sympy_parser import parse_expr

_X = S.Symbol('x', real=True)
_MAX_LENGTH = 40


def _plain(text):
    r"""The label as a plain expression string (\frac, \sqrt, \cdot, \left \right and the unicode minus rewritten), or None when it is not one of those forms."""
    if not isinstance(text, str) or not 0 < len(text) <= _MAX_LENGTH: return None
    value = text.replace('\u2212', '-').replace('\\left', '').replace('\\right', '').replace('\\cdot', '*').replace('\\times', '*').replace(' ', '')
    for _ in range(4):
        value = re.sub(r'\\frac\{([^{}]*)\}\{([^{}]*)\}', r'((\1)/(\2))', value)
        value = re.sub(r'\\sqrt\{([^{}]*)\}', r'sqrt(\1)', value)
    return value if '\\' not in value and '{' not in value and '}' not in value else None


def _parse(expression, symbols):
    # the characters are limited before parsing: digits, + - * / ( ) . the word sqrt and the symbols of the call; nothing else reaches the parser
    if not re.fullmatch(r'[0-9+\-*/().%s]*' % ''.join(sorted(symbols)), expression.replace('sqrt', '')): return None
    try:
        local = {name: S.Symbol(name, real=True) for name in symbols}
        local['sqrt'] = S.sqrt
        return parse_expr(expression, local_dict=local, transformations='all', evaluate=True)
    except Exception:
        return None


def numeric_label_value(text):
    """The number a label states (a rational, a surd, a fraction of surds), or None when it states no pure number."""
    expression = _plain(text)
    if expression is None: return None
    value = _parse(expression, '')
    if value is None or not getattr(value, 'is_number', False) or value.free_symbols: return None
    try:
        if value.is_real is not True: return None
    except TypeError:
        return None
    return value


def line_label_matches(text, line):
    """True / False when `text` states a line (y = ... x ..., x = c) and it equals / differs from line=(a, b, c) meaning a*x + b*y = c; None when the label states no such line."""
    expression = _plain(text)
    if expression is None or expression.count('=') != 1: return None
    left, right = expression.split('=')
    a, b, c = line
    if left == 'y':
        rhs = _parse(right, 'x')
        if rhs is None or not (rhs.has(_X) or getattr(rhs, 'is_number', False)): return None
        if rhs.has(_X) and S.degree(S.expand(rhs), _X) > 1: return None
        slope, intercept = S.simplify(S.diff(rhs, _X)), S.simplify(rhs.subs(_X, 0))
        if S.simplify(b) == 0: return False
        return S.simplify(-a / b - slope) == 0 and S.simplify(c / b - intercept) == 0
    if left == 'x':
        rhs = _parse(right, '')
        if rhs is None or rhs.free_symbols or not getattr(rhs, 'is_number', False): return None
        if S.simplify(a) == 0: return False
        return S.simplify(b) == 0 and S.simplify(c / a - rhs) == 0
    return None


def segment_label_mismatch(label, a, b):
    """True when `label` states a number and it is not the distance between the points a and b (exact coordinates); a label that states no number is never a mismatch."""
    value = numeric_label_value(label)
    if value is None: return False
    length = S.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
    return abs(float(S.N(length - value, 30))) > 1e-6
