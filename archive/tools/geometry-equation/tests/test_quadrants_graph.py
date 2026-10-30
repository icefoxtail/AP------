"""E31 (5): graphPlan.overlays.quadrants (the coordinate quadrant tinted and/or named in plain Korean text) and the independent graph observer on a real composed figure
(tests/e31-fixtures/quadrants-graph.json). The coordinate figure's planeMarks.quadrants is read back by tests/quadrants.test.mjs."""
import copy
import json
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'e31-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['3','-1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-4,6],'viewport':[-4,6,-4,6],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'points':[{'id':'A','x':'3','y':'0','unnamed':True,'coordinates':True},{'id':'B','x':'0','y':'3','unnamed':True,'coordinates':True}],
                  'quadrants':[{'id':'q1','quadrant':1,'label':'제1사분면'},{'id':'q2','quadrant':2,'label':'제2사분면','fill':'LIGHT'},
                               {'id':'q3','quadrant':3,'label':'제3사분면'},{'id':'q4','quadrant':4,'label':'제4사분면','fill':'MEDIUM'}]}}
def with_quadrants(rows):
    plan=copy.deepcopy(BASE);plan['overlays']['quadrants']=rows;return plan
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_the_example_carries_its_rows(self):
        rows=fit_overview(copy.deepcopy(BASE))['graphPlan']['overlaysFeatures']['quadrants']
        self.assertEqual([(row['id'],row['quadrant'],row.get('label'),row.get('fill')) for row in rows],[('q1',1,'제1사분면',None),('q2',2,'제2사분면','LIGHT'),('q3',3,'제3사분면',None),('q4',4,'제4사분면','MEDIUM')])
    def test_a_plan_without_quadrants_has_no_row(self):
        plan=copy.deepcopy(BASE);del plan['overlays']['quadrants']
        self.assertNotIn('quadrants',fit_overview(plan)['graphPlan']['overlaysFeatures'])
    def test_refusals_have_their_own_codes(self):
        cases=(([{'id':'q1','quadrant':5,'label':'x'}],'OVERLAY_QUADRANT_INVALID:q1'),([{'id':'q1','quadrant':True,'label':'x'}],'OVERLAY_QUADRANT_INVALID:q1'),
               ([{'id':'q1','quadrant':'2','label':'x'}],'OVERLAY_QUADRANT_INVALID:q1'),([{'id':'q1','quadrant':1,'color':'red'}],'OVERLAY_QUADRANT_INVALID:q1'),
               ([{'id':'q1','quadrant':1,'label':'가'},{'id':'q2','quadrant':1,'label':'나'}],'OVERLAY_QUADRANT_DUPLICATE:q2'),
               ([{'id':'q1','quadrant':1}],'OVERLAY_QUADRANT_EMPTY:q1'),
               ([{'id':'q1','quadrant':1,'label':'제1사분면$'}],'OVERLAY_QUADRANT_LABEL_INVALID:q1'),([{'id':'q1','quadrant':1,'label':' 제1사분면'}],'OVERLAY_QUADRANT_LABEL_INVALID:q1'),
               ([{'id':'q1','quadrant':1,'label':'열세글자를넘는사분면이름입니다'}],'OVERLAY_QUADRANT_LABEL_INVALID:q1'),
               ([{'id':'q1','quadrant':1,'fill':'DARK'}],'OVERLAY_QUADRANT_FILL_INVALID:q1'),
               ([{'id':'q1','quadrant':1,'label':'가'},{'id':'q1','quadrant':2,'label':'나'}],'OVERLAY_ID_DUPLICATE:quadrant:q1'))
        for rows,code in cases:self.assertEqual(refused(with_quadrants(rows)),code,rows)
    def test_at_most_four_quadrants(self):
        self.assertEqual(refused(with_quadrants([{'id':'q%d'%i,'quadrant':1,'label':'가'} for i in range(5)])),'OVERLAY_TOO_MANY:quadrants')

class QuadrantObjects(unittest.TestCase):
    """The semantic engine's QUADRANT object: a tinted rectangle out to the window's edge and a plain-text name, and its own refusals."""
    def spec(self,*objects,axes=True,window=(-3,3,-3,3)):
        return {'id':'quadrants','title':'사분면','visualType':'function_graph','axes':axes,'viewport':{'xMin':window[0],'xMax':window[1],'yMin':window[2],'yMax':window[3],'width':512,'height':512,'equalUnits':True},
                'sourceFacts':{},'derivedFacts':{},'displayFacts':{'axisTickValues':{'x':[],'y':[]}},'objects':list(objects)}
    def build(self,*objects,**kw):
        from visual_engine.engine import build
        return build(self.spec(*objects,**kw))
    def test_the_fill_is_a_polygon_under_the_strokes_and_the_name_is_text(self):
        result=self.build({'id':'q2','kind':'QUADRANT','quadrant':2,'fill':'LIGHT','labelText':'제2사분면'})
        root=ET.fromstring(result['svg']);fill=next(n for n in root.iter() if n.get('id')=='q2-fill')
        self.assertEqual((fill.get('data-role'),fill.get('fill'),fill.get('data-mark'),fill.get('data-mark-id')),('region','#e4e7ec','quadrant','q2'))
        self.assertEqual(len(fill.get('points').split()),4);self.assertEqual(result['witness']['layout']['unresolved'],[])
        placed={label['id']:label for label in result['witness']['layout']['labels']}
        self.assertEqual(placed['q2-label']['text'],'제2사분면')
        # the origin always lies inside the drawn window (the axes force it), so a quadrant's corner at the origin is inside it
        self.assertEqual(self.build({'id':'q','kind':'QUADRANT','quadrant':1,'fill':'LIGHT'},window=(1,5,1,5))['witness']['layout']['unresolved'],[])
    def test_a_quadrant_needs_the_axes(self):
        from visual_engine.engine import build
        for spec,code in ((self.spec({'id':'q','kind':'QUADRANT','quadrant':1,'fill':'LIGHT'},axes=False),'QUADRANT_REQUIRES_AXES:q'),
                          (self.spec({'id':'q','kind':'QUADRANT','quadrant':1,'fill':'DARK'}),'QUADRANT_FILL_UNSUPPORTED:q'),
                          (self.spec({'id':'q','kind':'QUADRANT','quadrant':7,'fill':'LIGHT'}),'INVALID_QUADRANT:q'),
                          (self.spec({'id':'q','kind':'QUADRANT','quadrant':True,'fill':'LIGHT'}),'INVALID_QUADRANT:q'),
                          (self.spec({'id':'q','kind':'EQUATION_LABEL','at':[0,0],'text':'x','quadrant':1}),'INVALID_QUADRANT:q'),
                          (self.spec({'id':'q','kind':'QUADRANT','fill':'LIGHT'}),'UNKNOWN_OR_MISSING_COMPONENT_FIELD')):
            with self.assertRaises(ValueError) as caught:build(spec)
            self.assertEqual(str(caught.exception),code)

class Fixture:
    def __init__(self):
        data=json.loads((FIXTURES/'quadrants-graph.json').read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None,plan=None):return audit(plan or self.plan,svg or self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)
    @staticmethod
    def shift(root,ident,dx,dy):
        group=Fixture.node(root,ident);m=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',group.get('transform'))
        group.set('transform','translate(%s %s)'%(float(m.group(1))+dx,float(m.group(2))+dy))

class ComposedFigure(unittest.TestCase):
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean(self):
        self.assertEqual(self.fx.errors(),[])
        for ident in ('overlay-quadrant-q2-fill','overlay-quadrant-q4-fill','overlay-quadrant-q1-label','overlay-quadrant-q3-label'):self.assertIn('id="%s"'%ident,self.fx.svg)
        self.assertNotIn('overlay-quadrant-q1-fill',self.fx.svg)
    def test_the_fill_is_the_rectangle_to_the_end_of_the_axes_in_the_stated_tone(self):
        def move(root):
            node=self.fx.node(root,'overlay-quadrant-q2-fill');pts=[p.split(',') for p in node.get('points').split()];pts[2][0]=str(float(pts[2][0])+30)
            node.set('points',' '.join(','.join(p) for p in pts))
        self.assertIn('OVERLAY_QUADRANT_FILL_MISMATCH:q2',self.fx.errors(self.fx.edit(move)))
        self.assertIn('OVERLAY_QUADRANT_FILL_TONE_MISMATCH:q2',self.fx.errors(self.fx.edit(lambda r:self.fx.node(r,'overlay-quadrant-q2-fill').set('fill','#c7ccd5'))))
        self.assertIn('OVERLAY_QUADRANT_FILL_MISSING:q4',self.fx.errors(self.fx.edit(lambda r:[p.remove(c) for p in r.iter() for c in list(p) if c.get('id')=='overlay-quadrant-q4-fill'])))
    def test_a_fill_the_plan_does_not_declare_is_refused(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['quadrants'][1].pop('fill')
        self.assertIn('OVERLAY_QUADRANT_FILL_UNDECLARED:q2',self.fx.errors(plan=plan))
    def test_a_name_is_plain_text_inside_its_quadrant(self):
        self.assertIn('OVERLAY_QUADRANT_LABEL_TEXT_MISMATCH:q1',self.fx.errors(self.fx.edit(lambda r:self.fx.node(r,'overlay-quadrant-q1-label').set('data-text','제2사분면'))))
        self.assertIn('OVERLAY_QUADRANT_LABEL_TEXT_MISMATCH:q1',self.fx.errors(self.fx.edit(lambda r:self.fx.node(r,'overlay-quadrant-q1-label').set('data-tex','x'))))
        self.assertIn('OVERLAY_QUADRANT_LABEL_OUTSIDE:q1',self.fx.errors(self.fx.edit(lambda r:self.fx.shift(r,'overlay-quadrant-q1-label',-400,0))))
        self.assertIn('OVERLAY_QUADRANT_LABEL_MISSING:q3',self.fx.errors(self.fx.edit(lambda r:[p.remove(c) for p in r.iter() for c in list(p) if c.get('id')=='overlay-quadrant-q3-label'])))
    def test_a_name_the_plan_does_not_declare_is_refused(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['quadrants'][0].pop('label');plan['overlays']['quadrants'][0]['fill']='LIGHT'
        errors=self.fx.errors(plan=plan)
        self.assertIn('OVERLAY_QUADRANT_LABEL_UNDECLARED:q1',errors)
    def test_a_quadrant_the_plan_leaves_out_is_an_undeclared_element(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['quadrants']=plan['overlays']['quadrants'][:3]
        self.assertTrue(any(e.startswith('OVERLAY_UNDECLARED:overlay-quadrant-q4') for e in self.fx.errors(plan=plan)),self.fx.errors(plan=plan))

if __name__=='__main__':unittest.main()
