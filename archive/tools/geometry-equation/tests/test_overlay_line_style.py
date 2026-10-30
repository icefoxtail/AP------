"""E31 (6): graphPlan.overlays.lines[].style DASHED (a line shifted from another, an auxiliary line drawn thin and dashed) and the independent graph observer on a real composed
figure (tests/e31-fixtures/dashed-overlay-line.json: y=-3/4x-3 solid and its parallel y=-3/4x+3 dashed, each equation on a leader or beside its line)."""
import copy
import json
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'e31-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['-3','-3/4']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-10,9],'viewport':[-10,9,-9,8],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'lines':[{'id':'par','slope':'-3/4','intercept':'3','style':'DASHED'}],'points':[{'id':'Xi','axis':'x','value':'-4','coordinates':True,'unnamed':True},{'id':'Yi','axis':'y','value':'-3','coordinates':True,'unnamed':True},{'id':'Z','axis':'y','value':'3','unnamed':True}]}}
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_the_style_reaches_the_feature_rows_only_when_dashed(self):
        rows=fit_overview(copy.deepcopy(BASE))['graphPlan']['overlaysFeatures']['lines']
        self.assertEqual(rows[0]['style'],'DASHED')
        plan=copy.deepcopy(BASE);plan['overlays']['lines'][0]['style']='SOLID'
        self.assertNotIn('style',fit_overview(plan)['graphPlan']['overlaysFeatures']['lines'][0])
    def test_an_unknown_style_is_refused_with_its_code(self):
        for style in ('DOTTED','dashed',None,True,1):
            plan=copy.deepcopy(BASE);plan['overlays']['lines'][0]['style']=style
            self.assertEqual(refused(plan),'OVERLAY_LINE_STYLE_INVALID:par',style)

class Fixture:
    def __init__(self):
        data=json.loads((FIXTURES/'dashed-overlay-line.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None,plan=None):return audit(plan or self.plan,svg or self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)

class ComposedFigure(unittest.TestCase):
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean_and_the_line_is_dashed(self):
        self.assertEqual(self.fx.errors(),[]);self.assertEqual(self.fx.plan['overlays']['lines'][0]['style'],'DASHED')
        line=self.fx.node(ET.fromstring(self.fx.svg),'overlay-line-par');self.assertIsNotNone(line.get('stroke-dasharray'))
    def test_a_solid_line_for_a_dashed_claim_is_named(self):
        def solid(root):
            line=self.fx.node(root,'overlay-line-par');del line.attrib['stroke-dasharray']
        self.assertIn('OVERLAY_LINE_STYLE_MISMATCH:par',self.fx.errors(self.fx.edit(solid)))
    def test_a_dashed_line_for_a_solid_claim_is_named(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['lines'][0]['style']='SOLID'
        self.assertIn('OVERLAY_LINE_STYLE_MISMATCH:par',self.fx.errors(plan=plan))
        plan['overlays']['lines'][0].pop('style')
        self.assertIn('OVERLAY_LINE_STYLE_MISMATCH:par',self.fx.errors(plan=plan))
    def test_a_bad_style_in_the_plan_is_unsupported_with_its_code(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['lines'][0]['style']='DOTTED'
        result=audit(plan,self.fx.svg,self.fx.transform);self.assertEqual(result['status'],'UNSUPPORTED');self.assertIn('OVERLAY_LINE_STYLE_INVALID',result['errors'])

class EngineLine(unittest.TestCase):
    def test_a_dashed_line_is_a_thin_dashed_line_that_keeps_its_role(self):
        from visual_engine.engine import build
        spec={'id':'dashed','title':'평행','visualType':'function_graph','axes':True,'viewport':{'xMin':-3,'xMax':3,'yMin':-3,'yMax':3,'width':512,'height':512,'equalUnits':True},'sourceFacts':{},'derivedFacts':{},
              'displayFacts':{'axisTickValues':{'x':[],'y':[]}},'objects':[{'id':'l','kind':'LINE','coefficients':[1,-1,0],'dash':True},{'id':'m','kind':'LINE','coefficients':[1,-1,1]}]}
        root=ET.fromstring(build(spec)['svg']);dashed=next(n for n in root.iter() if n.get('id')=='l');plain=next(n for n in root.iter() if n.get('id')=='m')
        self.assertEqual((dashed.get('data-role'),dashed.get('stroke-dasharray')),('line','4 3'));self.assertIsNone(plain.get('stroke-dasharray'))
        self.assertLess(float(dashed.get('stroke-width')),float(plain.get('stroke-width')))
        spec['objects'][0]['dash']=False
        with self.assertRaises(ValueError) as caught:build(spec)
        self.assertEqual(str(caught.exception),'INVALID_LINE_DASH:l')

if __name__=='__main__':unittest.main()
