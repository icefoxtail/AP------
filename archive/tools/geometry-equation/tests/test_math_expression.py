import sys,unittest,xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.math_expression import parse,serialize,evaluate,exact_coordinate

class MathTests(unittest.TestCase):
    def test_gold_regression(self):
        expected={ '(x+1)^2+(y-3)^2=2^2':'(x+1)^{2}+(y-3)^{2}=2^{2}', 'x^2-3x+4':'x^{2}-3x+4', '3(x-1)^2-3':'3(x-1)^{2}-3', 'x^3-4x':'x^{3}-4x', 'sqrt(5)':r'\sqrt{5}', '1/2':r'\frac{1}{2}', '-3/2':r'\frac{-3}{2}', "f'(x)":r'f^{\prime}(x)', 'x<=2':r'x\le 2'}
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
    def test_relation(self):
        self.assertTrue(evaluate(parse('x<=2'),{'x':1}))
        self.assertFalse(evaluate(parse('x=2'),{'x':1}))

if __name__=='__main__':unittest.main()
