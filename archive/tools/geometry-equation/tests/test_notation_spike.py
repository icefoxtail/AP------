import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.math_expression import Expr,serialize,parse,evaluate

class NotationSpike(unittest.TestCase):
    def test_programmatic_precedence(self):
        x,y,z=[Expr('symbol',v) for v in 'xyz']
        number=Expr('number','2')
        tree=Expr('binary','*',(Expr('binary','+',(x,Expr('number','1'))),number))
        self.assertEqual(evaluate(tree,{'x':3}),8)
        self.assertEqual(serialize(tree),r'(x+1)\cdot 2')
        self.assertEqual(serialize(Expr('binary','-',(x,Expr('binary','-',(y,z))))),'x-(y-z)')
        self.assertEqual(serialize(Expr('binary','^',(Expr('binary','^',(x,number)),number))),'(x^{2})^{2}')
    def test_constant_entity_product_suffix(self):
        self.assertEqual(serialize(parse('pi')),r'\pi')
        self.assertEqual(serialize(Expr('variable','pi')),'pi')
        self.assertEqual(serialize(Expr('entity','AB')),r'\mathrm{AB}')
        self.assertEqual(serialize(parse('A*B')),r'A\cdot B')
        self.assertEqual(serialize(Expr('degree',args=(Expr('number','40'),))),r'40^{\circ}')
        self.assertEqual(serialize(Expr('unit','cm',(Expr('number','5'),))),r'5\,\mathrm{cm}')
    def test_expected_notation_from_source(self):
        golden={'40/3':r'\frac{40}{3}','sqrt(2)':r'\sqrt{2}','x^2':'x^{2}','x_1':'x_{1}',"f'(x)":r'f^{\prime}(x)','π':r'\pi'}
        for source,expected in golden.items():self.assertEqual(serialize(parse(source)),expected)

if __name__=='__main__':unittest.main()
