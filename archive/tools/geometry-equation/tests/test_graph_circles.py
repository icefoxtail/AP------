"""G6 (graphPlan.overlays.circles): exact framing of a circle on a function graph, the line x circle intersection and the on-circle check,
fail-closed claims, and the independent observer on the model SVG (centre, radius, one scale) including tampering."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

PLAN={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],
      'requiredPoints':[{'id':'O','x':0,'y':0}],'axisTickValues':{'x':[],'y':[]},
      'overlays':{'circles':[{'id':'C','center':['0','0'],'radiusSquared':'2'}],
                  'lines':[{'id':'L','slope':'7/10','intercept':'0'}],
                  'points':[{'id':'P','intersect':['L','C'],'pick':'MAX_X'},{'id':'Q','curveX':'7/10'},{'id':'A','curveX':'1','onCircle':'C'}],
                  'segments':[{'id':'PQ','from':'P','to':'Q'}]}}

def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def variant(mutate):
    plan=copy.deepcopy(PLAN);mutate(plan['overlays']);return plan
def observed(plan,svg=None,transform=None):
    model=produce(plan);return audit(plan,svg if svg is not None else model['svg'],transform or model['transform']),model

class CircleFraming(unittest.TestCase):
    def test_features_are_exact(self):
        plan=fitted(PLAN);features=plan['overlaysFeatures']
        self.assertEqual(plan['equalUnits'],True)
        circle=features['circles'][0]
        self.assertEqual((circle['id'],circle['cx'],circle['cy'],circle['radiusSquared']),('C',0.0,0.0,'2'))
        self.assertAlmostEqual(circle['r'],2**.5,9)
        p=[point for point in features['points'] if point['id']=='P'][0]
        self.assertAlmostEqual(p['x']**2+p['y']**2,2.0,9);self.assertAlmostEqual(p['y'],.7*p['x'],9);self.assertGreater(p['x'],0)

    def test_the_frame_reaches_the_circle(self):
        v=fitted(PLAN)['viewport'];r=2**.5
        self.assertLessEqual(v[0],-r);self.assertGreaterEqual(v[1],r);self.assertLessEqual(v[2],-r);self.assertGreaterEqual(v[3],r)

    def test_min_x_picks_the_other_root(self):
        plan=fitted(variant(lambda o:o['points'][0].update(pick='MIN_X')));p=[point for point in plan['overlaysFeatures']['points'] if point['id']=='P'][0]
        self.assertLess(p['x'],0);self.assertAlmostEqual(p['x']**2+p['y']**2,2.0,9)

    def test_vertical_line_pick_and_tangent(self):
        plan=fitted(variant(lambda o:(o.update(lines=[{'id':'L','x':'1'}]),o['points'][0].update(pick='MIN_Y'))))
        p=[point for point in plan['overlaysFeatures']['points'] if point['id']=='P'][0]
        self.assertAlmostEqual(p['x'],1.0,9);self.assertAlmostEqual(p['y'],-1.0,9)
        plan=fitted(variant(lambda o:(o.update(lines=[{'id':'L','x':'sqrt(2)'}]),o['points'][0].pop('pick'),o['points'][2].pop('onCircle'),o.update(segments=[]),o['points'].pop(1),o['points'].pop(1))))
        p=[point for point in plan['overlaysFeatures']['points'] if point['id']=='P'][0]
        self.assertAlmostEqual(p['y'],0.0,9)

    def test_claims_fail_closed(self):
        cases={
            'OVERLAY_CIRCLE_INVALID:C':lambda o:o['circles'][0].update(radiusSquared='0'),
            'OVERLAY_POINT_NOT_ON_CIRCLE:A':lambda o:o['points'][2].update(curveX='1/2'),
            'OVERLAY_CIRCLE_PICK_REQUIRED:P':lambda o:o['points'][0].pop('pick'),
            'OVERLAY_CIRCLE_PICK_INVALID:P':lambda o:o['points'][0].update(pick='MAX_Y'),
            'OVERLAY_CIRCLE_LINE_NO_INTERSECTION:P':lambda o:o.update(lines=[{'id':'L','slope':'0','intercept':'9/5'}]),
            'OVERLAY_CIRCLE_INVALID:C':lambda o:o['circles'].append(dict(o['circles'][0])),
            'OVERLAY_CIRCLE_INVALID:circle':lambda o:o.update(circles=[5]),
        }
        for code,mutate in cases.items():
            with self.subTest(code=code):self.assertEqual(refused(variant(mutate)),code)

    def test_a_graph_without_equal_units_refuses_a_circle(self):
        plan={'family':'logarithmic-affine','base':'3','coefficients':['2','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'},'domain':[0.1,4],'viewport':[-1,5,-5,5],
              'overlays':{'circles':[{'id':'C','center':['1','0'],'radiusSquared':'1'}]}}
        self.assertTrue(refused(plan).startswith('OVERLAY_CIRCLE_REQUIRES_EQUAL_UNITS'))

    def test_a_plan_without_circles_is_unchanged(self):
        plan=copy.deepcopy(PLAN);plan['overlays'].pop('circles');plan['overlays']['points']=[plan['overlays']['points'][1]];plan['overlays']['lines']=[];plan['overlays']['segments']=[]
        self.assertNotIn('circles',fitted(plan)['overlaysFeatures'])

class CircleObserver(unittest.TestCase):
    def test_model_passes(self):
        report,model=observed(fitted(PLAN))
        self.assertEqual(report['status'],'PASS',report)
        self.assertIn('id="overlay-circle-C"',model['svg'])

    def test_a_moved_radius_fails(self):
        plan=fitted(PLAN);model=produce(plan)
        svg=re.sub(r'(id="overlay-circle-C"[^>]* r=")([^"]+)',lambda m:m.group(1)+str(float(m.group(2))*1.08),model['svg'])
        report=audit(plan,svg,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_RADIUS_MISMATCH:C',report['errors'])

    def test_a_moved_centre_fails(self):
        plan=fitted(PLAN);model=produce(plan)
        svg=re.sub(r'(id="overlay-circle-C"[^>]* cx=")([^"]+)',lambda m:m.group(1)+str(float(m.group(2))+9),model['svg'])
        report=audit(plan,svg,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_CENTER_MISMATCH:C',report['errors'])

    def test_a_missing_circle_fails(self):
        plan=fitted(PLAN);model=produce(plan)
        svg=re.sub(r'<circle id="overlay-circle-C"[^>]*/>','',model['svg'])
        report=audit(plan,svg,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_MISSING:C',report['errors'])

    def test_an_ellipse_scale_fails(self):
        plan=fitted(PLAN);model=produce(plan);transform=dict(model['transform']);transform['sy']=transform['sx']*1.03
        report=audit(plan,model['svg'],transform);self.assertEqual(report['status'],'FAIL')
        self.assertIn('OVERLAY_CIRCLE_NOT_EQUAL_SCALE:C',report['errors'])

    def test_an_undeclared_circle_fails(self):
        plan=fitted(variant(lambda o:(o['points'].pop(2),o['points'].pop(0),o.update(lines=[],segments=[]))));model=produce(plan)
        self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS')
        extra=copy.deepcopy(plan);extra['overlays'].pop('circles');extra['overlaysFeatures'].pop('circles')
        report=audit(extra,model['svg'],model['transform']);self.assertEqual(report['status'],'FAIL')
        self.assertIn('OVERLAY_UNDECLARED:overlay-circle-C',report['errors'])

    def test_a_moved_intersection_point_fails(self):
        plan=fitted(PLAN);model=produce(plan)
        svg=re.sub(r'(id="P"[^>]* cx=")([^"]+)',lambda m:m.group(1)+str(float(m.group(2))+9),model['svg'])
        report=audit(plan,svg,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_POINT_MISMATCH:P',report['errors'])

if __name__=='__main__':unittest.main()
