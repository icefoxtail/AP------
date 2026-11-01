"""Independent reader of point display names (no producer imports).

A display name is one capital letter, optional prime(s), optional subscript digits 1-9 (at most two). The spellings T_1, T_{1}, T₁, A', A′ are equivalent.
expected_tex() is the TeX a label must carry in the final SVG (data-tex): T_{1}, A', A''.
"""
import re

SUBSCRIPTS = '₁₂₃₄₅₆₇₈₉'
_NAME = re.compile(r"([A-Z])(′′|″|''|′|')?(?:_\{([1-9]{1,2})\}|_([1-9])|([₁-₉]{1,2}))?")


_COORD = re.compile(r"\(\s*(-?\d{1,3}|[A-Za-z])\s*,\s*(-?\d{1,3}|[A-Za-z])\s*\)")


def parse(name):
    pair = _COORD.fullmatch(name) if isinstance(name, str) else None
    if pair is not None:
        # a coordinate-pair name with a letter in it, (2,k) (G12-3): returned as ((first, second), None, None)
        if not re.search('[A-Za-z]', pair.group(1) + pair.group(2)): raise ValueError('POINT_DISPLAY_NAME_INVALID')
        return (pair.group(1), pair.group(2)), None, None
    m = _NAME.fullmatch(name) if isinstance(name, str) else None
    if m is None: raise ValueError('POINT_DISPLAY_NAME_INVALID')
    primes = {None: 0, "'": 1, '′': 1, "''": 2, '′′': 2, '″': 2}[m.group(2)]
    sub = m.group(3) or m.group(4) or ''.join(str(SUBSCRIPTS.index(c) + 1) for c in (m.group(5) or ''))
    return m.group(1), primes, sub


def expected_tex(name):
    letter, primes, sub = parse(name)
    if primes is None: return '(%s,%s)' % letter
    return letter + "'" * primes + ('_{%s}' % sub if sub else '')


def tex_map(point_names, ids):
    """{point id: expected data-tex}: the id itself when the plan gives it no display name. Unknown targets and duplicate shown names are errors."""
    point_names = point_names or {}
    if not isinstance(point_names, dict): raise ValueError('POINT_DISPLAY_NAME_INVALID')
    ids = list(ids)
    for point_id in point_names:
        if point_id not in ids: raise ValueError('POINT_NAME_TARGET_UNKNOWN:' + str(point_id))
    result = {point_id: expected_tex(point_names[point_id]) if point_id in point_names else point_id for point_id in ids}
    if len(set(result.values())) != len(result): raise ValueError('POINT_DISPLAY_NAME_DUPLICATE')
    return result
