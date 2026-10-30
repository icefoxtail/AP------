"""E30 item 6: graphPlan.axisScale {x,y} (each axis at the scale the author gives, minutes against kilometres) and overlays.names (a Korean name beside
an overlay segment, an overlay line or the drawn curve). Framing, the independent observer on the model and on a real composed figure (fixture),
with tampering. No Chrome here: the typeset figure is exercised by tests/graph-axis-scale-names.test.mjs."""
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
from graph_spike import produce
from graph_observer import audit

FIXTURES=Path(__file__).resolve().parent/'e30-fixtures'

BASE={'family':'piecewise-polynomial','pieces':[{'coefficients':['0']},{'coefficients':['-2/3','1/15']},{'coefficients':['2']}],
      'breakpoints':[{'x':'10','y':'0'},{'x':'40','y':'2'}],'sourceDomain':{'kind':'INTERVAL','range':['0','70'],'states':['CLOSED','CLOSED']},
      'requiredPoints':[{'id':'A','x':10,'y':0},{'id':'B','x':40,'y':2}],'axisTickValues':{'x':['20','60'],'y':['2']},'axisScale':{'x':1,'y':12},
      'overlays':{'points':[{'id':'O','x':'0','y':'0'},{'id':'Z','x':'70','y':'7/3','unnamed':True}],'segments':[{'id':'sT','from':'O','to':'Z'}],
                  'names':[{'id':'nR','text':'토끼','curveX':'50','labelDirection':'N'},{'id':'nT','text':'거북이','segment':'sT'}]}}

def plan_with(**change):
    plan=copy.deepcopy(BASE)
    for key,value in change.items():
        if value is None:plan.pop(key,None)
        else:plan[key]=value
    return plan
def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def with_overlays(**change):
    overlays=copy.deepcopy(BASE['overlays'])
    for key,value in change.items():overlays[key]=value
    return plan_with(overlays=overlays)

class AxisScaleFraming(unittest.TestCase):
    def test_the_figure_is_drawn_at_the_authors_proportion(self):
        plan=fitted(BASE);self.assertEqual(plan['axisRatio'],12.0);self.assertTrue(plan['equalUnits'])
        model=produce(plan);transform=model['transform']
        self.assertAlmostEqual(transform['sy']/transform['sx'],12.0,places=9)
    def test_other_proportions_follow_the_numbers(self):
        for scale,ratio in (({'x':2,'y':'3/2'},.75),({'x':'1/2','y':3},6.0),({'x':'2.5','y':5},2.0),({'x':3,'y':1},1/3),({'x':1,'y':1},1.0)):
            plan=fitted(plan_with(axisScale=scale));self.assertAlmostEqual(plan['axisRatio'],ratio,places=12,msg=str(scale))
            transform=produce(plan)['transform'];self.assertAlmostEqual(transform['sy']/transform['sx'],ratio,places=9)
    def test_without_the_field_nothing_changes(self):
        plan=fitted(plan_with(axisScale=None));self.assertEqual(plan['axisRatio'],1.0);self.assertNotIn('axisScale',plan)
    def test_the_field_is_checked(self):
        for scale in ({'x':1},{'y':1},{'x':1,'y':2,'z':3},{'x':True,'y':2},{'x':0,'y':2},{'x':-1,'y':2},{'x':1,'y':'abc'},{'x':1,'y':1.5},{'x':'1/0','y':2},[1,2],'1:12',{'x':'1e3','y':1}):
            self.assertEqual(refused(plan_with(axisScale=scale)),'INVALID_AXIS_SCALE',scale)
        self.assertEqual(refused(plan_with(axisScale={'x':1,'y':65})),'AXIS_SCALE_RATIO_OUT_OF_RANGE')
        self.assertEqual(refused(plan_with(axisScale={'x':65,'y':1})),'AXIS_SCALE_RATIO_OUT_OF_RANGE')
        self.assertIsNone(refused(plan_with(axisScale={'x':1,'y':64})));self.assertIsNone(refused(plan_with(axisScale={'x':64,'y':1})))
    def test_a_squeeze_never_follows_an_author_scale(self):
        self.assertEqual(refused(plan_with(axisSqueeze=True)),'AXIS_SCALE_WITH_SQUEEZE')
        self.assertIsNone(refused(plan_with(axisSqueeze=False)))
    def test_only_the_piecewise_polynomial_family_takes_it(self):
        quadratic={'family':'polynomial','coefficients':['0','0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-3,3,-1,9],'axisScale':{'x':1,'y':2}}
        self.assertEqual(refused(quadratic),'AXIS_SCALE_UNSUPPORTED_FAMILY')
        self.assertIsNone(refused({k:v for k,v in quadratic.items() if k!='axisScale'}))
    def test_a_flat_figure_gets_room_to_read(self):
        flat=fitted(plan_with(axisScale=None));scaled=fitted(BASE)
        self.assertLess(flat['plotCanvas']['height'],scaled['plotCanvas']['height'])

class AxisScaleObserver(unittest.TestCase):
    def setUp(self):
        self.plan=fitted(BASE);self.model=produce(self.plan)
    def errors(self,plan=None,transform=None):return audit(plan or self.plan,self.model['svg'],transform or self.model['transform'])
    def test_the_model_passes(self):
        result=self.errors();self.assertEqual(result['errors'],[]);self.assertEqual(result['status'],'PASS')
    def test_a_wrong_drawn_proportion_is_named(self):
        sx=self.model['transform']['sx']
        for factor in (1.0,6.0,24.0):
            self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',self.errors(transform={**self.model['transform'],'sy':sx*factor})['errors'],factor)
        self.assertNotIn('EQUAL_UNIT_SCALE_MISMATCH',self.errors(transform={**self.model['transform'],'sy':sx*12})['errors'])
    def test_the_recorded_ratio_must_repeat_the_authors(self):
        for ratio in (1.0,6.0,12.5):
            self.assertIn('AXIS_SCALE_RATIO_MISMATCH',self.errors({**self.plan,'axisRatio':ratio})['errors'])
        self.assertIn('AXIS_SCALE_RATIO_MISMATCH',self.errors({k:v for k,v in self.plan.items() if k!='axisRatio'})['errors'])
    def test_a_changed_scale_is_not_a_free_pass(self):
        # the author's numbers changed after framing: the recorded ratio and the drawn figure no longer follow them
        self.assertIn('AXIS_SCALE_RATIO_MISMATCH',self.errors({**self.plan,'axisScale':{'x':1,'y':10}})['errors'])
    def test_a_malformed_scale_is_refused_by_the_observer_itself(self):
        for scale in ({'x':1},{'x':1,'y':0},{'x':1,'y':'abc'},{'x':1,'y':100},{'x':True,'y':2},{'x':1,'y':2,'z':1}):
            self.assertIn('AXIS_SCALE_INVALID',self.errors({**self.plan,'axisScale':scale})['errors'],scale)
        self.assertIn('AXIS_SCALE_INVALID',self.errors({**self.plan,'axisSqueeze':True})['errors'])
        self.assertIn('AXIS_SCALE_INVALID',self.errors({**self.plan,'overviewPolicy':'POLYNOMIAL_INTERVAL_OVERVIEW_v1'})['errors'])
    def test_without_it_the_old_rule_stays(self):
        plain=fitted(plan_with(axisScale=None));model=produce(plain)
        self.assertEqual(audit(plain,model['svg'],model['transform'])['errors'],[])
        wrong={**model['transform'],'sy':model['transform']['sx']*3}
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(plain,model['svg'],wrong)['errors'])
        self.assertIn('AXIS_RATIO_INVALID',audit({**plain,'axisRatio':3},model['svg'],model['transform'])['errors'])

class OverlayNameFraming(unittest.TestCase):
    def test_rows_carry_exact_anchors(self):
        rows={row['id']:row for row in fitted(BASE)['overlaysFeatures']['names']}
        self.assertEqual(rows['nR']['kind'],'CURVE');self.assertEqual(rows['nR']['at'],[50.0,2.0]);self.assertEqual(rows['nR']['labelDirection'],'N')
        self.assertEqual(rows['nT']['kind'],'SEGMENT');self.assertEqual(rows['nT']['ref'],'sT')
        self.assertEqual(rows['nT']['at'],[35.0,7/6]);self.assertEqual(len(rows['nT']['alternateAt']),2)
    def test_a_line_name_stands_at_the_lines_label_anchor(self):
        plan=with_overlays(lines=[{'id':'L','slope':'1/30','intercept':'0'}],names=[{'id':'nL','text':'거북이','line':'L'}])
        row=fitted(plan)['overlaysFeatures']['names'][0];self.assertEqual((row['kind'],row['ref']),('LINE','L'))
        self.assertEqual(row['at'],fitted(plan)['overlaysFeatures']['lines'][0]['labelAt'])
    def test_plans_without_names_have_no_names_row(self):
        plan=fitted({**BASE,'overlays':{k:v for k,v in BASE['overlays'].items() if k!='names'}})
        self.assertNotIn('names',plan['overlaysFeatures'])
    def test_refusals_have_their_own_codes(self):
        cases=(
            ([{'id':'n','text':'토끼$','curveX':'50'}],'OVERLAY_NAME_TEXT_INVALID:n'),
            ([{'id':'n','text':'','curveX':'50'}],'OVERLAY_NAME_TEXT_INVALID:n'),
            ([{'id':'n','text':' 토끼','curveX':'50'}],'OVERLAY_NAME_TEXT_INVALID:n'),
            ([{'id':'n','text':'열두글자가넘는이름입니다','curveX':'50'}],'OVERLAY_NAME_TEXT_INVALID:n'),
            ([{'id':'n','text':7,'curveX':'50'}],'OVERLAY_NAME_TEXT_INVALID:n'),
            ([{'id':'n','text':'토끼'}],'OVERLAY_NAME_INVALID:n'),
            ([{'id':'n','text':'토끼','curveX':'50','segment':'sT'}],'OVERLAY_NAME_INVALID:n'),
            ([{'id':'n','text':'토끼','curveX':'50','curve':'f'}],'OVERLAY_CURVE_UNKNOWN:n'),
            ([{'id':'n','text':'토끼','curveX':'50','color':'red'}],'OVERLAY_NAME_INVALID:n'),
            ([{'id':'n','text':'토끼','segment':'zz'}],'OVERLAY_NAME_TARGET_UNKNOWN:n'),
            ([{'id':'n','text':'토끼','line':'zz'}],'OVERLAY_NAME_TARGET_UNKNOWN:n'),
            ([{'id':'n','text':'토끼','curveX':'99'}],'OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:n'),
            ([{'id':'n','text':'토끼','curveX':'50','labelDirection':'UP'}],'OVERLAY_LABEL_DIRECTION_INVALID:n'),
            ([{'id':'n','text':'토끼','curveX':'50'},{'id':'n','text':'거북이','segment':'sT'}],'OVERLAY_ID_DUPLICATE:name:n'),
            ([{'id':'9n','text':'토끼','curveX':'50'}],'OVERLAY_ID_INVALID:name'),
            ('x','OVERLAY_TOO_MANY:names'),
            ([{'id':'n%d'%i,'text':'가','curveX':'50'} for i in range(5)],'OVERLAY_TOO_MANY:names'),
        )
        for names,code in cases:
            self.assertEqual(refused(with_overlays(names=names)),code,str(names))
    def test_a_name_may_be_ascii(self):
        row=fitted(with_overlays(names=[{'id':'n','text':'직선 l','curveX':'50'}]))['overlaysFeatures']['names'][0];self.assertEqual(row['text'],'직선 l')

class OverlayNameObserverOnTheModel(unittest.TestCase):
    """The observer re-reads the raw names field itself (the model SVG has no labels, so only the plan side is exercised here)."""
    def setUp(self):
        self.plan=fitted(BASE);self.model=produce(self.plan)
    def audit(self,names):
        plan={**self.plan,'overlays':{**self.plan['overlays'],'names':names}}
        return audit(plan,self.model['svg'],self.model['transform'])
    def test_the_good_plan_passes(self):
        self.assertEqual(self.audit(BASE['overlays']['names'])['errors'],[])
    def test_a_bad_name_is_unsupported_with_its_code(self):
        for names,code in (([{'id':'n','text':'토끼$','curveX':'50'}],'OVERLAY_NAME_INVALID'),([{'id':'n','text':'토끼'}],'OVERLAY_NAME_INVALID'),
                           ([{'id':'n','text':'토끼','segment':'zz'}],'OVERLAY_NAME_TARGET_UNKNOWN'),([{'id':'n','text':'토끼','line':'zz'}],'OVERLAY_NAME_TARGET_UNKNOWN'),
                           ([{'id':'n','text':'토끼','curveX':'99'}],'OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN'),
                           ([{'id':'n','text':'토끼','curveX':'50'},{'id':'n','text':'거북이','segment':'sT'}],'OVERLAY_NAME_INVALID')):
            result=self.audit(names);self.assertEqual(result['status'],'UNSUPPORTED',names);self.assertIn(code,result['errors'])

class Fixture:
    """A real composed figure: the final SVG, its fitted graph plan and the observed frame (tests/e30-fixtures)."""
    def __init__(self,name='q6-axis-scale-names'):
        data=json.loads((FIXTURES/(name+'.json')).read_text(encoding='utf-8'));self.plan=data['plan'];self.transform=data['transform'];self.svg=data['svg']
    def errors(self,svg=None,plan=None):return audit(plan or self.plan,svg if svg is not None else self.svg,self.transform)['errors']
    def edit(self,change):
        root=ET.fromstring(self.svg);change(root);return ET.tostring(root,encoding='unicode')
    @staticmethod
    def node(root,ident):return next(n for n in root.iter() if n.get('id')==ident)
    @staticmethod
    def shift(root,ident,dx,dy):
        group=Fixture.node(root,ident);m=re.fullmatch(r'translate\(([-\d.eE+]+)[ ,]([-\d.eE+]+)\)',group.get('transform'))
        group.set('transform','translate(%s %s)'%(float(m.group(1))+dx,float(m.group(2))+dy))
    @staticmethod
    def remove(root,ident):
        for parent in root.iter():
            for child in list(parent):
                if child.get('id')==ident:parent.remove(child);return
        raise KeyError(ident)

class ComposedFigure(unittest.TestCase):
    """The observer on the real figure of 23_금당중 q6: clean, and each tampering is named."""
    def setUp(self):self.fx=Fixture()
    def test_the_figure_is_clean(self):
        self.assertEqual(self.fx.errors(),[])
        self.assertIn('data-text="토끼"',self.fx.svg);self.assertIn('data-text="거북이"',self.fx.svg)
        self.assertEqual(self.fx.plan['axisScale'],{'x':1,'y':12});self.assertEqual(self.fx.plan['axisRatio'],12.0)
        self.assertAlmostEqual(self.fx.transform['sy']/self.fx.transform['sx'],12.0,places=9)
    def test_the_drawn_proportion_is_read_from_the_figure_frame(self):
        flat={**self.fx.transform,'sy':self.fx.transform['sx']}
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(self.fx.plan,self.fx.svg,flat)['errors'])
    def test_a_name_must_exist_and_read_as_written(self):
        fx=self.fx
        self.assertIn('OVERLAY_NAME_LABEL_MISSING:nR',fx.errors(fx.edit(lambda r:fx.remove(r,'overlay-name-nR'))))
        self.assertIn('OVERLAY_NAME_LABEL_MISSING:nT',fx.errors(fx.edit(lambda r:fx.remove(r,'overlay-name-nT'))))
        self.assertIn('OVERLAY_NAME_LABEL_TEXT_MISMATCH:nR',fx.errors(fx.edit(lambda r:fx.node(r,'overlay-name-nR').set('data-text','거북이'))))
        self.assertIn('OVERLAY_NAME_LABEL_TEXT_MISMATCH:nT',fx.errors(fx.edit(lambda r:fx.node(r,'overlay-name-nT').set('data-text','토끼'))))
        # a name that is typeset as math (glyph codes, TeX) is not the plain-text label the plan asks for
        self.assertIn('OVERLAY_NAME_LABEL_TEXT_MISMATCH:nR',fx.errors(fx.edit(lambda r:fx.node(r,'overlay-name-nR').set('data-tex','x'))))
    def test_a_name_beside_a_segment_belongs_to_that_segment(self):
        fx=self.fx
        self.assertIn('OVERLAY_NAME_LABEL_OWNER_MISMATCH:nT',fx.errors(fx.edit(lambda r:fx.node(r,'overlay-name-nT').set('data-owner','overlay-segment-other'))))
        leader='overlay-name-nT-owner-leader';self.assertIn(leader,fx.svg)
        start=fx.errors(fx.edit(lambda r:(fx.node(r,leader).set('x1',str(float(fx.node(r,leader).get('x1'))+60)),fx.node(r,leader).set('y1',str(float(fx.node(r,leader).get('y1'))-60)))))
        self.assertIn('OVERLAY_NAME_LEADER_NOT_ON_OWNER:overlay-name-nT',start)
        end=fx.errors(fx.edit(lambda r:fx.node(r,leader).set('x2',str(float(fx.node(r,leader).get('x2'))+60))))
        self.assertIn('OVERLAY_NAME_LEADER_NOT_ON_LABEL:overlay-name-nT',end)
        # without its leader the label would have to stand beside its own segment: it stands well away, so it is refused
        self.assertTrue(any(e.startswith('OVERLAY_NAME_LABEL_NOT_NEAR_OWNER') for e in fx.errors(fx.edit(lambda r:fx.remove(r,leader)))),fx.errors(fx.edit(lambda r:fx.remove(r,leader))))
    def test_a_name_beside_the_curve_stands_at_its_anchor_and_clearly_near_the_curve(self):
        fx=self.fx
        self.assertIn('OVERLAY_NAME_LABEL_NOT_AT_CURVE:nR',fx.errors(fx.edit(lambda r:fx.shift(r,'overlay-name-nR',-200,60))))
        self.assertIn('OVERLAY_NAME_LABEL_NOT_NEAR_CURVE:nR',fx.errors(fx.edit(lambda r:fx.shift(r,'overlay-name-nR',0,-30))))
        ambiguous=fx.errors(fx.edit(lambda r:fx.shift(r,'overlay-name-nR',-20,95)))
        self.assertTrue(any(e.startswith('OVERLAY_NAME_LABEL_') and e.endswith(':nR') for e in ambiguous),ambiguous)
    def test_an_undeclared_name_is_refused(self):
        plan=copy.deepcopy(self.fx.plan);plan['overlays']['names']=[plan['overlays']['names'][0]]
        self.assertIn('OVERLAY_UNDECLARED:overlay-name-nT',self.fx.errors(plan=plan))

if __name__=='__main__':unittest.main()
