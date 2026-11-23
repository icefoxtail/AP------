"""Named SVG mutations for the semantic golden table (ops/semantic-golden/table.json).

Each one takes a figure that the engine and its observer accept and makes the single mistake a student would read wrongly, so the observer has to refuse it
with a known code. Standard library only (no SymPy, no browser): tests/semantic-golden.test.mjs runs these on a hand-made SVG in CI.
A mutation that finds nothing to change raises MutationNotApplicable: a silent no-op would make a row pass for the wrong reason.
"""
import re


class MutationNotApplicable(Exception):
    pass


def _path_tag(code):
    """A <path ... data-c="CODE" ...> element, self-closed or with an empty body (MathJax writes the second form)."""
    return re.compile(r'<path\b[^>]*\bdata-c="%s"[^>]*?(?:/>|>\s*</path>)' % re.escape(code), re.I)


def glue_exp_factor(svg):
    """3*2^(x+1) drawn as 32^(x+1): the multiplication dot between the factor and the base is gone, so the two numbers read as one."""
    changed, count = _path_tag('22C5').subn('', svg)
    if count == 0:
        raise MutationNotApplicable('no multiplication dot (U+22C5) glyph in the label')
    return changed


def degree_label_add_pi(svg, before_code='2218'):
    """An angle drawn 70 degrees gets a pi glyph in front of its degree sign (4 pi degrees): a radian value carrying a degree sign."""
    tag = re.search(r'<path\b[^>]*\bdata-c="%s"[^>]*>' % re.escape(before_code), svg, re.I)
    if tag is None:
        raise MutationNotApplicable('no degree sign glyph (U+%s) in the label' % before_code)
    return svg[:tag.start()] + '<path data-c="3C0" d="M0 0 L5 0"/>' + svg[tag.start():]


def rename_axis_title(svg, axis, to):
    """The title of an axis drawn as another letter (x axis named Z): every glyph code of that axis title group becomes the code of the new text."""
    group = re.search(r'<g\b[^>]*\bid="axis-%s"[^>]*>.*?</g>' % re.escape(axis), svg, re.S)
    if group is None:
        raise MutationNotApplicable('no axis-%s title group' % axis)
    codes = [format(ord(ch), 'X') for ch in to]
    counter = iter(codes)
    seen = []

    def swap(match):
        seen.append(1)
        code = next(counter, None)
        return '' if code is None else match.group(1) + code + match.group(2)

    body = re.sub(r'(<path\b[^>]*\bdata-c=")[0-9A-Fa-f]+(")', swap, group.group(0))
    if not seen:
        raise MutationNotApplicable('the axis-%s title has no glyph path to rename' % axis)
    # the drawn title now says `to`; keep its text attribute (a plain-text title) in step too
    body = re.sub(r'(\bdata-text=")[^"]*(")', lambda m: m.group(1) + to + m.group(2), body)
    return svg[:group.start()] + body + svg[group.end():]


SVG_MUTATIONS = {
    'glue-exp-factor': glue_exp_factor,
    'degree-label-add-pi': degree_label_add_pi,
    'rename-axis-title': rename_axis_title,
}
