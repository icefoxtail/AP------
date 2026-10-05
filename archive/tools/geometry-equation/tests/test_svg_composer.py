import sys,unittest,xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.svg_composer import compose
from visual_engine.viewport import Viewport
from visual_engine.math_expression import parse,serialize
from visual_engine.style_tokens import load

def fixtures():
    return {'title':'원과 접점','primitives':[{'id':'point','kind':'circle','at':[100,100],'radius':2,'layer':70,'role':'point','token':'indicator'},{'id':'line','kind':'line','from':[32,200],'to':[400,200],'layer':40}]},{'labels':[{'id':'label','kind':'EQUATION_LABEL','text':'x^2-3x+4','markup':serialize(parse('x^2-3x+4'),'svg'),'math':True,'font':13.5,'baseline':[440,80],'box':{'x':440,'y':64,'width':120,'height':20}}]}

class ComposerTests(unittest.TestCase):
    def test_structural_and_hangul(self):
        p,l=fixtures();s=compose(p,l,Viewport(-2,2,-2,2));root=ET.fromstring(s)
        self.assertEqual(root.attrib['preserveAspectRatio'],'xMidYMid meet')
        self.assertIn('원과 접점',s);self.assertNotIn('\\frac',s)
    def test_layer_order(self):
        p,l=fixtures();s=compose(p,l,Viewport(-2,2,-2,2));self.assertLess(s.index('id="line"'),s.index('id="point"'));self.assertLess(s.index('id="point"'),s.index('id="label"'))
    def test_duplicate_label(self):
        p,l=fixtures();l['labels'].append({**l['labels'][0],'id':'label2'})
        with self.assertRaisesRegex(ValueError,'DUPLICATE_SEMANTIC'):compose(p,l,Viewport(-2,2,-2,2))
    def test_bad_decimal(self):
        p,l=fixtures();l['labels'][0].update(kind='COORDINATE_LABEL',text='(0.6667,1)',markup=None)
        with self.assertRaisesRegex(ValueError,'INVALID_STUDENT_DECIMAL'):compose(p,l,Viewport(-2,2,-2,2))
    def test_multiline_condition(self):
        p,l=fixtures();l['labels'][0].update(kind='CONDITION_BOX',lines=['접선','반지름 1/3'],math=False,markup=None)
        s=compose(p,l,Viewport(-2,2,-2,2));self.assertIn('conditionBox',s);self.assertIn('반지름 1/3',s);self.assertNotIn('<br',s)
    def test_escape_and_markup_security(self):
        p,l=fixtures();p['title']='<script>&';s=compose(p,l,Viewport(-2,2,-2,2));self.assertIn('&lt;script&gt;',s)
        l['labels'][0]['markup']='<script>alert(1)</script>'
        with self.assertRaises(ValueError):compose(p,l,Viewport(-2,2,-2,2))
    def test_tokens_and_deterministic(self):
        t=load();self.assertGreater(t['mainShape'],t['axis'])
        p,l=fixtures();self.assertEqual(compose(p,l,Viewport(-2,2,-2,2)),compose(p,l,Viewport(-2,2,-2,2)))

if __name__=='__main__':unittest.main()
