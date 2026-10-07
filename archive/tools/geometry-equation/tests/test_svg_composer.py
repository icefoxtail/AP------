import sys,unittest,xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.svg_composer import compose,validate_fragment_font
from visual_engine.viewport import Viewport
from visual_engine.math_expression import parse,serialize
from visual_engine.style_tokens import load

def fixtures():
    return {'title':'원과 접점','primitives':[{'id':'point','kind':'circle','at':[100,100],'radius':2,'layer':70,'role':'point','token':'indicator'},{'id':'line','kind':'line','from':[32,200],'to':[400,200],'layer':40}]},{'labels':[{'id':'label','kind':'EQUATION_LABEL','text':'x^2-3x+4','markup':serialize(parse('x^2-3x+4'),'svg'),'math':True,'font':13.5,'baseline':[440,80],'box':{'x':440,'y':64,'width':120,'height':20}}]}

class ComposerTests(unittest.TestCase):
    def test_compacted_legacy_math_font_is_rejected_before_render(self):
        def fragment(width):
            return ET.fromstring(f'<svg width="{width}" height="13.32" viewBox="0 0 {width} 13.32"><svg width="{width}" height="13.32" viewBox="0 -666 500 666"><g data-mml-node="math"/></svg></svg>')
        validate_fragment_font(fragment(10),20)
        with self.assertRaisesRegex(ValueError,'FROZEN_FRAGMENT_FONT_SCALE_CHANGED'):validate_fragment_font(fragment(4.5),20)
    def test_frozen_outline_dimensions_cannot_be_compacted(self):
        root=ET.fromstring('<svg width="10" height="13.32" viewBox="0 0 10 13.32" data-outline-width="10" data-outline-height="13.32"><g/></svg>')
        validate_fragment_font(root,20)
        root.set('width','4.5');root.set('viewBox','0 0 4.5 13.32')
        with self.assertRaisesRegex(ValueError,'FROZEN_FRAGMENT_FONT_SCALE_CHANGED'):validate_fragment_font(root,20)
    def test_structural_and_hangul(self):
        p,l=fixtures();s=compose(p,l,Viewport(-2,2,-2,2));root=ET.fromstring(s)
        self.assertEqual(root.attrib['preserveAspectRatio'],'xMidYMid meet')
        self.assertIn('원과 접점',s);self.assertNotIn('\\frac',s)
    def test_layer_order(self):
        p,l=fixtures();s=compose(p,l,Viewport(-2,2,-2,2));self.assertLess(s.index('id="line"'),s.index('id="point"'));self.assertLess(s.index('id="point"'),s.index('id="label"'))
    def test_measured_tick_knockout_is_painted_over_graph_and_under_label(self):
        prepared={'title':'함수 그래프','primitives':[{'id':'f-branch-0','kind':'line','from':[20,20],'to':[180,180],'layer':50,'role':'curve'}]}
        label={'id':'tick-x-1-label','kind':'TICK_LABEL','text':'1','font':13,'math':True,'centered':True,
               'tickId':'tick-x-1','tickAxis':'x','tickValue':1,'tickDisplayValue':'1','owner':'tick-x-1',
               'at':[100,100],'baseline':[100,118],'box':{'x':94,'y':112,'width':12,'height':12}}
        knockout={'schemaVersion':'TICK_LABEL_GRAPH_KNOCKOUT_v1','labelId':label['id'],'tickOwner':'tick-x-1','axis':'x','value':1,
                  'obstacleIds':['f-branch-0'],'box':label['box'],'padding':6.0,'clearancePx':'SVG_USER_SPACE','reason':'PRESERVED_GRAPH_STROKE_CLEARANCE'}
        layout={'labels':[{**label,'tickLabelKnockout':knockout}],
                'trace':[{'id':label['id'],'fallback':'TICK_LABEL_GRAPH_KNOCKOUT_S','tickLabelKnockout':knockout}]}
        svg=compose(prepared,layout,Viewport(-2,2,-2,2,width=200,height=200,panel=0))
        root=ET.fromstring(svg)
        mask=root.find('.//*[@data-role="tick-label-knockout"]')
        self.assertIsNotNone(mask)
        self.assertEqual(mask.attrib['data-owner-label'],label['id'])
        self.assertEqual(mask.attrib['data-occluded-primitives'],'f-branch-0')
        self.assertLess(svg.index('id="f-branch-0"'),svg.index('data-role="tick-label-knockout"'))
        self.assertLess(svg.index('data-role="tick-label-knockout"'),svg.index('id="tick-x-1-label"'))
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
