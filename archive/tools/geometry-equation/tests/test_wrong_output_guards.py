"""Pure-function checks for the guards against figures that pass the engine but teach something wrong:
the formula glyphs of an exponential label, overlay lines on an asymptote (thin and dashed), and a dot on an OPEN end of the source interval (hollow)."""
import sys
import unittest
from fractions import Fraction
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'production'))
sys.path.insert(0, str(ROOT))
import graph_framing as framing
import graph_observer as observer
import sympy as S


def base(text):
    return observer._exp_log_observer_base(text, 'EXPONENTIAL')


class FormulaGlyphs(unittest.TestCase):
    D = lambda self, text: [format(ord(ch), 'X') for ch in text]

    def test_the_reported_case_has_a_dot_between_3_and_2(self):
        # y = 3 · 2^(x+1) - 2
        want = ['1D466', '3D', '33', '22C5', '32', '1D465', '2B', '31', '2212', '32']
        self.assertEqual(observer._exp_formula_glyphs(Fraction(3), Fraction(1), Fraction(-2), base('2'), Fraction(-1)), want)

    def test_hand_worked_cases(self):
        glyphs = observer._exp_formula_glyphs
        y_eq = ['1D466', '3D']
        # y = 2^x
        self.assertEqual(glyphs(Fraction(1), Fraction(1), Fraction(0), base('2'), Fraction(0)), y_eq + ['32', '1D465'])
        # y = -2^x  (no dot: the factor is only a sign)
        self.assertEqual(glyphs(Fraction(-1), Fraction(1), Fraction(0), base('2'), Fraction(0)), y_eq + ['2212', '32', '1D465'])
        # y = -3 · 2^x
        self.assertEqual(glyphs(Fraction(-3), Fraction(1), Fraction(0), base('2'), Fraction(0)), y_eq + ['2212', '33', '22C5', '32', '1D465'])
        # y = 10 · 2^x : both numbers are two digits and a dot keeps them apart
        self.assertEqual(glyphs(Fraction(10), Fraction(1), Fraction(0), base('2'), Fraction(0)), y_eq + ['31', '30', '22C5', '32', '1D465'])
        # y = 1/2 · 2^x : a stacked fraction, numerator then denominator, then the dot
        self.assertEqual(glyphs(Fraction(1, 2), Fraction(1), Fraction(0), base('2'), Fraction(0)), y_eq + ['31', '32', '22C5', '32', '1D465'])
        # y = 3 (1/2)^x : a bracketed fraction base follows its factor directly
        self.assertEqual(glyphs(Fraction(3), Fraction(1), Fraction(0), base('1/2'), Fraction(0)), y_eq + ['33', '28', '31', '32', '29', '1D465'])
        # y = 3 e^x
        self.assertEqual(glyphs(Fraction(3), Fraction(1), Fraction(0), base(None), Fraction(0)), y_eq + ['33', '1D452', '1D465'])
        # y = 2^(2x) + 1
        self.assertEqual(glyphs(Fraction(1), Fraction(2), Fraction(1), base('2'), Fraction(0)), y_eq + ['32', '32', '1D465', '2B', '31'])
        # y = 2^(-(x-1))
        self.assertEqual(glyphs(Fraction(1), Fraction(-1), Fraction(0), base('2'), Fraction(1)), y_eq + ['32', '2212', '28', '1D465', '2212', '31', '29'])
        # y = 2^(x/2): the fraction x over 2
        self.assertEqual(glyphs(Fraction(1), Fraction(1, 2), Fraction(0), base('2'), Fraction(0)), y_eq + ['32', '1D465', '32'])

    def test_missing_product_sign_is_a_mismatch(self):
        import xml.etree.ElementTree as ET
        def label(codes):
            return ET.fromstring('<svg><g id="formula">' + ''.join('<path data-c="%s"/>' % c for c in codes) + '</g></svg>')
        a, k, c, b, shift = Fraction(3), Fraction(1), Fraction(-2), base('2'), Fraction(-1)
        right = observer._exp_formula_glyphs(a, k, c, b, shift)
        self.assertEqual(observer._exp_formula_label_errors(label(right), 'formula', a, k, c, b, shift), [])
        glued = [code for code in right if code != '22C5']            # 3 and 2 side by side: "32^(x+1)-2"
        self.assertEqual(observer._exp_formula_label_errors(label(glued), 'formula', a, k, c, b, shift), ['EXPONENTIAL_FORMULA_LABEL_MISMATCH:formula'])
        self.assertEqual(observer._exp_formula_label_errors(ET.fromstring('<svg/>'), 'formula', a, k, c, b, shift), [], 'a label that is not drawn is not an error here')


class AsymptoteLines(unittest.TestCase):
    def test_exponential_and_logarithmic_single_curves(self):
        exp = {'family': 'exponential-affine', 'coefficients': ['3', '1', '-2']}
        log = {'family': 'logarithmic-affine', 'coefficients': ['1', '2', '-2', '0']}
        self.assertEqual(framing._overlay_asymptote_values(exp), [('h', S.Integer(-2))])
        self.assertEqual(framing._overlay_asymptote_values(log), [('v', S.Integer(1))])
        self.assertEqual(observer._ov_asymptote_values(exp), [('h', S.Integer(-2))])
        self.assertEqual(observer._ov_asymptote_values(log), [('v', S.Integer(1))])

    def test_multi_curve_and_pair_and_axes_are_left_alone(self):
        plan = {'family': 'multi-curve', 'curves': [
            {'id': 'f', 'kind': 'LOGARITHMIC', 'base': '3', 'coefficients': ['1', '1', '-1', '0']},
            {'id': 'g', 'kind': 'EXPONENTIAL', 'base': '3', 'coefficients': ['1', '1', '1']},
            {'id': 'h', 'kind': 'EXPONENTIAL', 'base': '2', 'coefficients': ['1', '1', '0']},   # y=0 is the x axis, not an extra line
            {'id': 'l', 'kind': 'LINE', 'coefficients': ['0', '1']}]}
        want = [('v', S.Integer(1)), ('h', S.Integer(1))]
        self.assertEqual(framing._overlay_asymptote_values(plan), want)
        self.assertEqual(observer._ov_asymptote_values(plan), want)
        pair = {'family': 'exp-log-pair', 'curves': [{'id': 'f', 'family': 'exponential-affine', 'coefficients': ['1', '1', '2']}]}
        self.assertEqual(observer._ov_asymptote_values(pair), [('h', S.Integer(2))])
        self.assertEqual(observer._ov_asymptote_values({'family': 'polynomial', 'coefficients': ['0', '1']}), [])

    def test_a_folded_curve_approaches_the_absolute_value(self):
        # y=|3^x-2| tends to |-2| = 2 (not -2); a log curve keeps its vertical boundary; a rational y=|(1+2x)/(-1+x)| tends to |2|
        plan = {'family': 'multi-curve', 'curves': [
            {'id': 'f', 'kind': 'EXPONENTIAL', 'base': '3', 'coefficients': ['1', '1', '-2'], 'abs': True},
            {'id': 'g', 'kind': 'LOGARITHMIC', 'base': '3', 'coefficients': ['1', '1', '-1', '0'], 'abs': True},
            {'id': 'h', 'kind': 'RATIONAL', 'numerator': ['1', '-2'], 'denominator': ['-1', '1'], 'abs': True}]}
        want = [('h', S.Integer(2)), ('v', S.Integer(1)), ('v', S.Integer(1)), ('h', S.Integer(2))]
        self.assertEqual(framing._overlay_asymptote_values(plan), want)
        self.assertEqual(observer._ov_asymptote_values(plan), want)
        plain = {'family': 'multi-curve', 'curves': [{'id': 'f', 'kind': 'EXPONENTIAL', 'base': '3', 'coefficients': ['1', '1', '-2']}]}
        self.assertEqual(framing._overlay_asymptote_values(plain), [('h', S.Integer(-2))])
        self.assertEqual(observer._ov_asymptote_values(plain), [('h', S.Integer(-2))])

    def test_rational_asymptotes(self):
        plan = {'family': 'rational', 'numerator': ['1', '2'], 'denominator': ['-1', '1']}   # y=(1+2x)/(-1+x): x=1, y=2
        want = [('v', S.Integer(1)), ('h', S.Integer(2))]
        self.assertEqual(framing._overlay_asymptote_values(plan), want)
        self.assertEqual(observer._ov_asymptote_values(plan), want)

    def test_an_unstyled_line_on_an_asymptote_becomes_dashed_and_a_styled_one_is_untouched(self):
        plan = {'family': 'multi-curve', 'curves': [{'id': 'g', 'kind': 'EXPONENTIAL', 'base': '3', 'coefficients': ['1', '1', '1']}]}
        lines = [observer._ov_line({'id': 'hy', 'slope': '0', 'intercept': '1'}),
                 observer._ov_line({'id': 'other', 'slope': '0', 'intercept': '2'}),
                 observer._ov_line({'id': 'solid', 'slope': '0', 'intercept': '1', 'style': 'SOLID'}),
                 observer._ov_line({'id': 'blue', 'slope': '0', 'intercept': '1', 'color': 'BLUE'}),
                 observer._ov_line({'id': 'vx', 'x': '1'})]
        observer._ov_mark_asymptote_lines(plan, lines)
        self.assertEqual([line.get('style') for line in lines], ['DASHED', None, 'SOLID', None, None])
        self.assertTrue(lines[0].get('asymptote'))
        self.assertFalse(any(line.get('asymptote') for line in lines[1:]))
        # framing side
        for entry, hit in (({'id': 'hy', 'slope': '0', 'intercept': '1'}, True), ({'id': 'o', 'slope': '0', 'intercept': '2'}, False), ({'id': 'v', 'slope': '1', 'intercept': '1'}, False)):
            line = {'id': entry['id'], 'kind': 'LINE', 'slope': entry['slope'], 'intercept': entry['intercept']}
            self.assertEqual(framing._overlay_line_is_asymptote(plan, line), hit, entry)


class OpenEndpoints(unittest.TestCase):
    PLAN = {'family': 'piecewise-polynomial', 'pieces': [{'coefficients': ['5', '-3']}], 'breakpoints': [], 'domain': [-4, 2],
            'sourceDomain': {'kind': 'INTERVAL', 'range': ['-4', '2'], 'states': ['OPEN', 'CLOSED']}}

    def test_only_the_open_end_is_listed_with_the_curve_limit(self):
        self.assertEqual(framing._overlay_open_endpoints(self.PLAN), [(S.Integer(-4), S.Integer(17))])
        self.assertEqual(observer._ov_open_endpoints(self.PLAN), [(S.Integer(-4), S.Integer(17))])

    def test_closed_or_absent_intervals_list_nothing(self):
        closed = {**self.PLAN, 'sourceDomain': {**self.PLAN['sourceDomain'], 'states': ['CLOSED', 'CLOSED']}}
        self.assertEqual(framing._overlay_open_endpoints(closed), [])
        self.assertEqual(observer._ov_open_endpoints(closed), [])
        self.assertEqual(framing._overlay_open_endpoints({'family': 'polynomial'}), [])


if __name__ == '__main__':
    unittest.main()
