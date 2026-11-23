"""Unit tests of the named SVG mutations (standard library only; no SymPy, no browser). Run: python -m unittest test_semantic_mutations (from this folder)."""
import unittest

from semantic_mutations import MutationNotApplicable, SVG_MUTATIONS, degree_label_add_pi, glue_exp_factor, rename_axis_title

FORMULA = '<svg><g id="formula"><path data-c="1D466" d="M0 0"/><path data-c="3D" d="M0 0"></path><path data-c="33" d="M0 0"/><path data-c="22C5" d="M0 0"></path><path data-c="32" d="M0 0"/></g></svg>'
DEGREE = '<svg><g id="aA-label"><path data-c="37" d="M0 0"/><path data-c="30" d="M0 0"/><path data-c="2218" d="M0 0"/></g></svg>'
AXES = ('<svg><g id="axis-x" data-label-kind="GRAPH_ANNOTATION"><svg><path data-c="1D465" d="M0 0"/></svg></g>'
        '<g id="axis-y" data-label-kind="GRAPH_ANNOTATION"><svg><path data-c="1D466" d="M0 0"/></svg></g></svg>')


class Mutations(unittest.TestCase):
    def test_glue_removes_only_the_multiplication_dot(self):
        out = glue_exp_factor(FORMULA)
        self.assertNotIn('22C5', out)
        for code in ('1D466', '3D', '33', '32'):
            self.assertIn('data-c="%s"' % code, out)

    def test_degree_add_pi_puts_a_pi_glyph_before_the_degree_sign(self):
        out = degree_label_add_pi(DEGREE)
        self.assertLess(out.index('data-c="3C0"'), out.index('data-c="2218"'))
        self.assertEqual(out.count('data-c="3C0"'), 1)

    def test_rename_changes_only_the_named_axis(self):
        out = rename_axis_title(AXES, 'x', 'Z')
        self.assertIn('data-c="5A"', out)
        self.assertNotIn('data-c="1D465"', out)
        self.assertIn('data-c="1D466"', out, 'the y title is untouched')

    def test_a_mutation_with_nothing_to_change_is_refused_not_silent(self):
        with self.assertRaises(MutationNotApplicable):
            glue_exp_factor(DEGREE)
        with self.assertRaises(MutationNotApplicable):
            degree_label_add_pi(FORMULA)
        with self.assertRaises(MutationNotApplicable):
            rename_axis_title(AXES, 'z', 'Z')

    def test_every_mutation_changes_its_figure(self):
        samples = {'glue-exp-factor': (FORMULA, {}), 'degree-label-add-pi': (DEGREE, {}), 'rename-axis-title': (AXES, {'axis': 'x', 'to': 'Z'})}
        self.assertEqual(set(samples), set(SVG_MUTATIONS))
        for name, (svg, args) in samples.items():
            self.assertNotEqual(SVG_MUTATIONS[name](svg, **args), svg, name)


if __name__ == '__main__':
    unittest.main()
