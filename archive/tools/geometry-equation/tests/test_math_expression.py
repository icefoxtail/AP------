import sys,unittest,xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.math_expression import parse,serialize,evaluate,exact_coordinate

class MathTests(unittest.TestCase):
    def test_gold_regression(self):
        expected={ '(x+1)^2+(y-3)^2=2^2':'(x+1)^{2}+(y-3)^{2}=2^{2}', 'x^2-3x+4':'x^{2}-3x+4', '3(x-1)^2-3':'3(x-1)^{2}-3', 'x^3-4x':'x^{3}-4x', 'sqrt(5)':r'\sqrt{5}', '1/2':r'{\displaystyle\frac{1}{2}}', '-3/2':r'-{\displaystyle\frac{3}{2}}', "f'(x)":r'f^{\prime}(x)', 'x<=2':r'x\le 2'}
        for source,tex in expected.items():
            with self.subTest(source=source):
                self.assertEqual(serialize(parse(source)),tex)
                self.assertNotIn('\\\\',serialize(parse(source)))
    def test_exponent_display_scope(self):
        markup=serialize(parse('x^2-3x+4'),'svg')
        root=ET.fromstring('<text>'+markup+'</text>')
        sup=root.find("tspan[@baseline-shift='super']")
        self.assertEqual(''.join(sup.itertext()),'2')
        self.assertIn('−3',sup.tail)
    def test_precedence(self):
        for source,value in (('-x^2',-9),('2^3^2',512),('3(x-1)^2-3',9),('x^3-4x',15)):
            self.assertEqual(evaluate(parse(source),{'x':3}),value)
    def test_coordinate_tuple_and_subscript(self):
        self.assertEqual(evaluate(parse('(1/2,-3/2)')),(0.5,-1.5))
        self.assertEqual(serialize(parse('x_1')), 'x_{1}')
    def test_functions(self):
        for source in ('sin(0)','cos(0)','tan(0)','log(1)','exp(0)','abs(-2)','sqrt(5)'):
            self.assertIsNotNone(evaluate(parse(source)))
    def test_coordinate_accuracy(self):
        self.assertEqual(exact_coordinate('2/4',.5),'1/2')
        self.assertEqual(exact_coordinate('-3/2',-1.5),'−3/2')
        self.assertEqual(exact_coordinate('sqrt(2)',2**.5),'√(2)')
        for source,value in (('0.6667',2/3),('1/2',1/3),('x',1)):
            with self.assertRaises(ValueError):exact_coordinate(source,value)
    def test_decimal_source_exception(self):
        self.assertEqual(exact_coordinate('0.5',.5,True),'1/2')
    def test_unsafe_rejection(self):
        for source in (r'x\\frac{1}{2}','x.__class__','__import__(x)','[x]','sin(1,2)','x;3','(x+1','x^',"'x"):
            with self.subTest(source=source),self.assertRaises(ValueError):parse(source)
    def test_limits(self):
        for source in ('('*40+'x'+')'*40,'x+'*300+'x'):
            with self.assertRaises(ValueError):parse(source)
    def test_textbook_notation(self):
        cases={'-3/2':(r'-{\displaystyle\frac{3}{2}}','−3/2'),'-3/2*x':(r'-{\displaystyle\frac{3}{2}}x','−3/2·x'),'3*x':('3x','3x'),'-2*x':('-2x','−2x'),'2*sqrt(5)':(r'2\sqrt{5}','2√(5)'),'2*3':(r'2\cdot 3','2·3'),
               '(1/2)*sqrt(34)':(r'{\displaystyle\frac{\sqrt{34}}{2}}','√(34)/2'),'(-1/2)*sqrt(34)':(r'-{\displaystyle\frac{\sqrt{34}}{2}}','−√(34)/2'),
               '(-5/2)*sqrt(3)':(r'-{\displaystyle\frac{5\sqrt{3}}{2}}','(−5√(3))/2'),'(8/5)*sqrt(10)':(r'{\displaystyle\frac{8\sqrt{10}}{5}}','(8√(10))/5')}
        for source,(tex,plain) in cases.items():
            with self.subTest(source=source):
                self.assertEqual(serialize(parse(source),'tex'),tex);self.assertEqual(serialize(parse(source),'plain'),plain)
    def test_degree_notation(self):
        self.assertEqual(serialize(parse('15°')),r'15^{\circ}')
        self.assertEqual(serialize(parse('15°'),'plain'),'15°')
        self.assertEqual(serialize(parse('15°'),'svg'),'15°')
        self.assertEqual(serialize(parse('-15°'),'plain'),'−15°')
        self.assertEqual(serialize(parse('2x+15°'),'plain'),'2x+15°')
        self.assertEqual(''.join(ET.fromstring('<text>'+serialize(parse('15°'),'svg')+'</text>').itertext()),'15°')
    def test_relation(self):
        self.assertTrue(evaluate(parse('x<=2'),{'x':1}))
        self.assertFalse(evaluate(parse('x=2'),{'x':1}))

class VectorNameTests(unittest.TestCase):
    """(G3) vec(a) / vec(AB) are the only way a label names a vector; every other expression reads and writes exactly as before."""
    def test_tex(self):
        for source,tex in {'vec(a)':r'\vec{a}','vec(AB)':r'\overrightarrow{AB}','vec(a)+vec(b)':r'\vec{a}+\vec{b}','2vec(a)-vec(b)':r'2\vec{a}-\vec{b}',
                           '(-3vec(a)+vec(b))/4':r'{\displaystyle\frac{-3\vec{a}+\vec{b}}{4}}','vec(AB)+vec(AF)':r'\overrightarrow{AB}+\overrightarrow{AF}','-vec(a)':r'-\vec{a}'}.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source)),tex)
    def test_plain_and_svg_text_carry_the_arrow(self):
        self.assertEqual(serialize(parse('vec(a)+vec(b)'),'plain'),'a\u20d7+b\u20d7')
        self.assertEqual(''.join(ET.fromstring('<text>'+serialize(parse('2vec(a)-vec(AB)'),'svg')+'</text>').itertext()),'2a\u20d7−AB\u20d7')
    def test_bad_names_are_refused(self):
        for source in ('vec()','vec(ab)','vec(vec(a))','vec(1)','vec(A)','vec(AAB)','vec(a','vec(a,b)'):
            with self.subTest(source=source),self.assertRaises(ValueError) as caught:parse(source)
            self.assertEqual(str(caught.exception),'VECTOR_LABEL_INVALID')
    def test_a_backslash_is_still_refused(self):
        with self.assertRaises(ValueError):parse(r'\vec{a}')
    def test_other_expressions_are_unchanged(self):
        for source,tex in {'v':'v','vec':'vec','x+1':'x+1','2v':'2v','vector':'vector'}.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source)),tex)

if __name__=='__main__':unittest.main()
