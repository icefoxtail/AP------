"""Python side of the semantic golden runner (semantic-golden.mjs).

Reads {"phase": "generator"|"observer", "rows": [...], "neutralize": [...]} from standard input and prints one JSON result per row.
Every figure here is built by the engine's own code with no browser; every check is an existing observer function, called as it is: nothing is re-implemented.
Where a test file already builds the normal figure (a built spec with hand-written label groups), that file's own class is imported and reused.

generator phase: row -> {"verdict": "PASS"|"REJECT", "code": ..., "facts": {...}}
observer phase:  row (+ the normal figure's facts) -> {"normal": [errors of the normal figure], "mutations": [{"name", "errors"|"notApplicable"}]}
"""
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).resolve().parent
GEOMETRY = HERE.parents[1]
PRODUCTION = GEOMETRY / 'production'
TESTS = GEOMETRY / 'tests'
for folder in (HERE, GEOMETRY, PRODUCTION, TESTS):
    sys.path.insert(0, str(folder))

from semantic_mutations import SVG_MUTATIONS, MutationNotApplicable  # noqa: E402


def refusal(error):
    """The code a refusal carries: its message up to the first colon-free token (the engine's refusals are `CODE` or `CODE:detail`)."""
    return str(error).strip().splitlines()[0] if str(error).strip() else type(error).__name__


def verdict_of(errors):
    return {'verdict': 'PASS', 'code': None} if not errors else {'verdict': 'REJECT', 'code': errors[0]}


# ---------------------------------------------------------------------------------------------------------------- generators

def gen_math_label_serialize(row):
    """The shared label serializer on a label text (visual_engine.math_expression): a degree sign after a pi value is refused there."""
    from visual_engine.math_expression import parse, serialize
    text = row['plan']['text']
    try:
        tex = serialize(parse(text))
    except ValueError as error:
        return {'verdict': 'REJECT', 'code': refusal(error), 'facts': {}}
    return {'verdict': 'PASS', 'code': None, 'facts': {'tex': tex}}


def gen_exp_label_tex(row):
    """The formula text the engine writes under an exponential graph (computed by the node side from the plan, `generatedText`) and the TeX the serializer makes of it."""
    from visual_engine.math_expression import parse, serialize
    spec = row['generator']
    text = row['generatedText']
    tex = serialize(parse(text))
    ok = text == spec['expectText'] and tex == spec['expectTex']
    return {'verdict': 'PASS' if ok else 'REJECT', 'code': None if ok else 'EXP_LABEL_TEXT_CHANGED:%s|%s' % (text, tex),
            'facts': {'text': text, 'tex': tex}}


def _region_module():
    import test_plane_region_leader as module
    case = module.ObserverTests('test_label_text_is_recomputed_from_the_plan')
    module.ObserverTests.setUpClass()
    return module, case


def _angle_module():
    import test_plane_angle_leader as module
    return module, module.Fixture()


def gen_region_fixture(row):
    """The region label on a leader, as tests/test_plane_region_leader.py builds it (the engine's own layout, label group written by hand): the observer accepts it."""
    module, case = _region_module()
    return verdict_of(case.fixture.audit()['errors']) | {'facts': {}}


def gen_angle_fixture(row):
    """An angle drawn in degrees, as tests/test_plane_angle_leader.py builds it: the observer accepts it."""
    module, fixture = _angle_module()
    return verdict_of(fixture.audit()['errors']) | {'facts': {}}


def _axis_title_figure(plan_spec):
    import copy
    from graph_framing import fit_overview
    from graph_spike import produce
    plan = fit_overview(copy.deepcopy(plan_spec))['graphPlan']
    return plan, produce(plan)


def gen_axis_titles_model(row):
    """A graph plan with axisTitles through framing and the model: the model audit passes (same as AxisTitles in tests/test_graph_window_lattice.py)."""
    from graph_observer import audit
    plan, model = _axis_title_figure(row['plan'])
    result = audit(plan, model['svg'], model['transform'])
    return verdict_of(result['errors']) | {'facts': {}}


def gen_axis_value_layout(row):
    """The layout of a label naming a value on the x axis (the minus pi interval end): it is put beside its own tick or the figure is refused."""
    from visual_engine.label_layout import Box, layout
    spec = row['plan']
    axis = {'id': 'x-axis', 'kind': 'axis', 'role': 'axis', 'axis': 'x', 'geometry': [(0, 160), (300, 160)]}
    item = {'id': 'interval-end-label', 'kind': 'GRAPH_ANNOTATION', 'at': list(spec['at']), 'text': spec['text'], 'font': 13, 'priority': 0,
            'gaps': (12, 20, 32, 48), 'axisValue': 'x', 'axisAnchor': [100.0, 160.0]}
    result = layout([item], [axis], Box(0, 0, 300, 240), measurements={item['id']: tuple(spec['size'])}, require_measurements=True)
    if result['unresolved']:
        return {'verdict': 'REJECT', 'code': 'LAYOUT_UNRESOLVED:' + ','.join(result['unresolved']), 'facts': {}}
    return {'verdict': 'PASS', 'code': None, 'facts': {'box': result['labels'][0]['box'], 'axisY': 160.0, 'axisX': 100.0}}


GENERATORS = {
    'math-label-serialize': gen_math_label_serialize,
    'exp-label-tex': gen_exp_label_tex,
    'region-fixture': gen_region_fixture,
    'angle-fixture': gen_angle_fixture,
    'axis-titles-model': gen_axis_titles_model,
    'axis-value-layout': gen_axis_value_layout,
}


# ---------------------------------------------------------------------------------------------------------------- observers
# Each observer has: base(row, facts) -> subject, observe(subject) -> [error strings]; its mutations are listed in MUTATIONS[kind].

def _wrap_glyph_svg(svg):
    """A typeset label (MathJax output) as the group the observer reads: <svg><g id=formula>...</g></svg>."""
    paths = ''.join(re.findall(r'<path\b[^>]*\bdata-c="[0-9A-Fa-f]+"[^>]*?(?:/>|>\s*</path>)', svg))
    return '<svg xmlns="http://www.w3.org/2000/svg"><g id="formula">%s</g></svg>' % paths


def exp_base(row, facts):
    return {'svg': _wrap_glyph_svg(facts['baseSvg'])}


def exp_observe(subject, row):
    import graph_observer
    plan = row['plan']['graphPlan']
    a, k, c = (Fraction(value) for value in plan['coefficients'])
    base = graph_observer._exp_log_observer_base(plan.get('base'), 'EXPONENTIAL')
    shift = Fraction(plan.get('shiftX', '0'))
    return graph_observer._exp_formula_label_errors(ET.fromstring(subject['svg']), 'formula', a, k, c, base, shift)


def angle_base(row, facts):
    module, fixture = _angle_module()
    return {'fixture': fixture, 'svg': fixture.svg()}


def angle_observe(subject, row):
    return subject['fixture'].audit(svg=subject['svg'])['errors']


def region_base(row, facts):
    module, case = _region_module()
    return {'case': case, 'svg': case.fixture.svg()}


def region_observe(subject, row):
    case = subject['case']
    marks = case.value_marks(**row['plan'].get('marksRow', {})) if subject.get('tampered') else None
    return case.fixture.audit(svg=subject['svg'], marks=marks)['errors']


def mutate_area_label_onto_side(subject, text='6', arc=False):
    """A region's value drawn right beside one of its sides, a short leader: the number reads as that side's length (tests/test_plane_region_leader.py tampered_beside_side)."""
    case = subject['case']
    return {**subject, 'svg': case.tampered_beside_side(arc=arc, text=text), 'tampered': True}


def axis_base(row, facts):
    plan, model = _axis_title_figure(row['plan'])
    transform = model['transform']
    xmax, ymax = plan['viewport'][1], plan['viewport'][3]
    end_x = (transform['originX'] + xmax * transform['sx'], transform['originY'])
    end_y = (transform['originX'], transform['originY'] - ymax * transform['sy'])
    import graph_observer
    groups = []
    for axis, at in (('x', (end_x[0] + 6, end_x[1] - 20)), ('y', (end_y[0] + 6, end_y[1] - 18))):
        text = plan['axisTitles'][axis]
        if graph_observer._axis_title_is_math(text):
            # a math title: one glyph per letter, the codes the observer works out from the plan text (the first allowed code of each position)
            codes = [sorted(allowed)[0] for allowed in graph_observer._axis_title_codes(text)]
            paths = ''.join('<path data-c="%s" d="M0 0"/>' % code for code in codes)
            groups.append('<g id="axis-%s" data-label-kind="GRAPH_ANNOTATION" data-owner="axis-%s" transform="translate(%s %s)"><svg width="40" height="14">%s</svg></g>' % (axis, axis, at[0], at[1], paths))
        else:
            groups.append('<g id="axis-%s" data-label-kind="GRAPH_ANNOTATION" data-owner="axis-%s" data-text="%s" transform="translate(%s %s)"><svg width="40" height="14"><path d="M0 0"/></svg></g>' % (axis, axis, text, at[0], at[1]))
    return {'plan': plan, 'transform': transform, 'svg': model['svg'].replace('</svg>', ''.join(groups) + '</svg>')}


def axis_observe(subject, row):
    from graph_observer import audit
    return audit(subject['plan'], subject['svg'], subject['transform'])['errors']


class Observer:
    def __init__(self, base, observe, mutations):
        self.base, self.observe, self.mutations = base, observe, mutations


def _svg_mutation(name):
    function = SVG_MUTATIONS[name]
    return lambda subject, **args: {**subject, 'svg': function(subject['svg'], **args)}


OBSERVERS = {
    'exp-formula-glyphs': Observer(exp_base, exp_observe, {'glue-exp-factor': _svg_mutation('glue-exp-factor')}),
    'angle-label': Observer(angle_base, angle_observe, {'degree-label-add-pi': _svg_mutation('degree-label-add-pi')}),
    'region-label': Observer(region_base, region_observe, {'area-label-onto-side': mutate_area_label_onto_side}),
    'axis-titles': Observer(axis_base, axis_observe, {'rename-axis-title': _svg_mutation('rename-axis-title')}),
}


def run_observer(row, facts, neutralize):
    observer = OBSERVERS[row['observer']['kind']]
    subject = observer.base(row, facts)
    result = {'normal': observer.observe(subject, row), 'mutations': []}
    for entry in row.get('mutations', []):
        name = entry['name']
        function = observer.mutations.get(name)
        if function is None:
            result['mutations'].append({'name': name, 'error': 'UNKNOWN_MUTATION'})
            continue
        if name in neutralize:
            mutated = subject                      # the mutation is switched off: the observer must then have nothing to refuse
        else:
            try:
                mutated = function(subject, **entry.get('args', {}))
            except MutationNotApplicable as error:
                result['mutations'].append({'name': name, 'notApplicable': str(error)})
                continue
        result['mutations'].append({'name': name, 'errors': observer.observe(mutated, row)})
    return result


def main():
    request = json.loads(sys.stdin.read())
    if request['phase'] == 'registry':   # the names the table may use (semantic-golden.test.mjs compares them with the runner's lists)
        print(json.dumps({'generators': sorted(GENERATORS), 'observers': {kind: sorted(o.mutations) for kind, o in OBSERVERS.items()}}))
        return
    neutralize = set(request.get('neutralize', []))
    out = []
    for row in request['rows']:
        try:
            if request['phase'] == 'generator':
                out.append({'id': row['id'], **GENERATORS[row['generator']['kind']](row)})
            else:
                out.append({'id': row['id'], **run_observer(row, row.get('facts', {}), neutralize)})
        except Exception as error:  # a crash in one row must not hide the others
            out.append({'id': row['id'], 'crash': '%s: %s' % (type(error).__name__, error)})
    sys.stdout.reconfigure(encoding='utf8')
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
