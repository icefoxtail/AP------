"""G6b: circles on exponential/logarithmic graphs (one-scale window), the curve x circle intersection by name, circle fill and circle regions
(a circular segment drawn as a true arc), each with the independent observer on the model SVG including tampering."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview,_fit_overview_family
from graph_spike import produce
from graph_observer import audit


def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def family_only(plan):return _fit_overview_family(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def observed(plan):
    model=produce(plan);return audit(plan,model['svg'],model['transform']),model

LOG={'family':'logarithmic-affine','base':'27','coefficients':['-1','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'},'domain':[0.1,3.4],'viewport':[-0.5,3.5,-2,2],
     'axisTickValues':{'x':[],'y':[]},
     'overlays':{'circles':[{'id':'C','center':['5/3','0'],'radiusSquared':'17/9'}],
                 'points':[{'id':'P','intersect':['curve','C'],'pick':'MIN_X'},{'id':'Q','intersect':['curve','C'],'pick':'MAX_X'},{'id':'M','x':'5/3','y':'0'}],
                 'segments':[{'id':'PQ','from':'P','to':'Q'}]}}
def log_variant(mutate):
    plan=copy.deepcopy(LOG);mutate(plan['overlays']);return plan


class ExpLogCircles(unittest.TestCase):
    def test_a_logarithmic_graph_with_a_circle_is_framed_at_one_scale(self):
        plan=fitted(LOG);self.assertEqual((plan['equalUnits'],plan['axisRatio']),(True,1));self.assertEqual(plan['plotCanvas']['width'],448)
        v=plan['viewport'];r=17**.5/3
        self.assertLessEqual(v[0],5/3-r);self.assertGreaterEqual(v[1],5/3+r);self.assertLessEqual(v[2],-r);self.assertGreaterEqual(v[3],r)
        family=family_only(LOG);window=family['viewport']
        self.assertLessEqual(v[0],window[0]);self.assertGreaterEqual(v[1],window[1]);self.assertLessEqual(v[2],window[2]);self.assertGreaterEqual(v[3],window[3])
        self.assertEqual(plan['domain'],family['domain'])   # the window only grows: the drawn interval is unchanged

    def test_a_circle_too_small_at_one_scale_is_refused(self):
        plan={'family':'exponential-affine','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-3,3],'viewport':[-4,4,-1,10],
              'overlays':{'circles':[{'id':'C','center':['0','1'],'radiusSquared':'1/4'}]}}
        self.assertTrue((refused(plan) or '').startswith('OVERLAY_CIRCLE_TOO_SMALL_AT_EQUAL_UNITS'),refused(plan))
        plan['overlays']['circles'][0]['radiusSquared']='4'
        self.assertIsNone(refused(plan))

    def test_a_plan_without_a_circle_keeps_its_own_window(self):
        plan=copy.deepcopy(LOG);plan['overlays']={'points':[{'id':'M','x':'5/3','y':'0'}]}
        framed=fitted(plan);self.assertNotIn('equalUnits',framed);self.assertNotIn('plotCanvas',framed)

    def test_the_model_passes_the_observer(self):
        report,_=observed(fitted(LOG));self.assertEqual(report['status'],'PASS',report)


class CurveCircleIntersection(unittest.TestCase):
    def test_the_roots_are_exact(self):
        points={p['id']:p for p in fitted(LOG)['overlaysFeatures']['points']}
        self.assertEqual((points['P']['xExact'],points['P']['yExact']),('1/3','1/3'))
        self.assertEqual((points['Q']['xExact'],points['Q']['yExact']),('3','-1/3'))

    def test_claims_fail_closed(self):
        def far(o):o['circles'][0].update(center=['5/3','9/2'],radiusSquared='1/4')
        cases={
            'OVERLAY_CIRCLE_PICK_REQUIRED:P':lambda o:o['points'][0].pop('pick'),
            'OVERLAY_CIRCLE_PICK_INVALID:P':lambda o:o['points'][0].update(pick='MAX_Y'),
            'OVERLAY_CIRCLE_CURVE_NO_INTERSECTION:P':far,
        }
        for code,mutate in cases.items():
            with self.subTest(code=code):
                plan=log_variant(mutate);plan['viewport']=[-0.5,3.5,-6,6]
                self.assertEqual(refused(plan),code)

    def test_a_root_without_an_exact_form_is_refused(self):
        plan={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],'requiredPoints':[{'id':'O','x':0,'y':0}],
              'axisTickValues':{'x':[],'y':[]},'overlays':{'circles':[{'id':'C','center':['0','0'],'radiusSquared':'3'}],'points':[{'id':'P','intersect':['curve','C'],'pick':'MAX_X'}]}}
        self.assertEqual(refused(plan),'OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT:P')

    def test_a_polynomial_root_is_found(self):
        plan={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],'requiredPoints':[{'id':'O','x':0,'y':0}],
              'axisTickValues':{'x':[],'y':[]},'overlays':{'circles':[{'id':'C','center':['0','0'],'radiusSquared':'2'}],'points':[{'id':'P','intersect':['curve','C'],'pick':'MAX_X'}]}}
        point=fitted(plan)['overlaysFeatures']['points'][0];self.assertEqual((point['xExact'],point['yExact']),('1','1'))

    def test_the_observer_catches_a_moved_intersection(self):
        plan=fitted(LOG);model=produce(plan)
        svg=re.sub(r'(id="Q"[^>]* cx=")([^"]+)',lambda m:m.group(1)+str(float(m.group(2))+9),model['svg'])
        report=audit(plan,svg,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_POINT_MISMATCH:Q',report['errors'])

    def test_the_observer_takes_the_pick_from_the_raw_plan(self):
        plan=fitted(LOG);model=produce(plan);swapped=copy.deepcopy(plan);points=swapped['overlays']['points'];points[0]['pick'],points[1]['pick']='MAX_X','MIN_X'
        report=audit(swapped,model['svg'],model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_POINT_MISMATCH:P',report['errors'])


PARABOLA={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],
          'requiredPoints':[{'id':'O','x':0,'y':0}],'axisTickValues':{'x':[],'y':[]},
          'overlays':{'circles':[{'id':'C','center':['0','0'],'radiusSquared':'2','fill':'LIGHT'}],
                      'lines':[{'id':'L','slope':'7/10','intercept':'0'}],
                      'points':[{'id':'P','intersect':['L','C'],'pick':'MAX_X'},{'id':'A','curveX':'1','onCircle':'C'}],
                      'circleRegions':[{'id':'S','circle':'C','from':'A','to':'P','side':'BELOW','fill':'MEDIUM'}]}}
def parabola_variant(mutate):
    plan=copy.deepcopy(PARABOLA);mutate(plan['overlays']);return plan
def region_svg(plan):
    model=produce(plan);return model,model['svg']


class CircleFillAndRegions(unittest.TestCase):
    def test_the_fill_and_the_region_are_recorded(self):
        features=fitted(PARABOLA)['overlaysFeatures'];self.assertEqual(features['circles'][0]['fill'],'LIGHT')
        region=features['circleRegions'][0];self.assertEqual((region['id'],region['from'],region['to'],region['fill']),('S','A','P','MEDIUM'));self.assertIn(region['sweep'],('CCW','CW'))

    def test_a_plan_without_fill_or_regions_keeps_no_such_field(self):
        plan=parabola_variant(lambda o:(o['circles'][0].pop('fill'),o.pop('circleRegions')))
        features=fitted(plan)['overlaysFeatures'];self.assertNotIn('fill',features['circles'][0]);self.assertNotIn('circleRegions',features)

    def test_claims_fail_closed(self):
        def vertical_chord(o):
            o['lines'].append({'id':'V','x':'1'});o['points'].append({'id':'R','intersect':['V','C'],'pick':'MIN_Y'});o['circleRegions'][0].update(to='A',**{'from':'R'},side='ABOVE')
        cases=[
            ('OVERLAY_CIRCLE_FILL_INVALID:C',lambda o:o['circles'][0].update(fill='DARK')),
            ('OVERLAY_CIRCLE_REGION_INVALID:S',lambda o:o['circleRegions'][0].update(to='A')),
            ('OVERLAY_CIRCLE_REGION_SIDE_INVALID:S',vertical_chord),
            ('OVERLAY_CIRCLE_REGION_SIDE_INVALID:S',lambda o:o['circleRegions'][0].update(side='MIDDLE')),
            ('OVERLAY_POINT_NOT_ON_CIRCLE:Q',lambda o:(o['points'].append({'id':'Q','curveX':'1/2'}),o['circleRegions'][0].update(to='Q'))),
            ('OVERLAY_CIRCLE_REGION_FILL_INVALID:S',lambda o:o['circleRegions'][0].update(fill='NONE')),
        ]
        for code,mutate in cases:
            with self.subTest(code=code):self.assertEqual(refused(parabola_variant(mutate)),code)

    def test_model_passes(self):
        report,model=observed(fitted(PARABOLA));self.assertEqual(report['status'],'PASS',report)
        self.assertIn('id="overlay-circle-C-fill"',model['svg']);self.assertIn('id="overlay-circle-region-S"',model['svg'])

    def test_each_side_gives_the_matching_arc(self):
        rows={}
        for side in ('BELOW','ABOVE'):
            plan=fitted(parabola_variant(lambda o:o['circleRegions'][0].update(side=side)));model=produce(plan)
            self.assertEqual(audit(plan,model['svg'],model['transform'])['status'],'PASS',side)
            region=plan['overlaysFeatures']['circleRegions'][0];rows[side]=(region['sweep'],region['large'])
        self.assertNotEqual(rows['BELOW'],rows['ABOVE'])

    def test_a_flipped_arc_flag_or_sweep_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        flipped=re.sub(r'(id="overlay-circle-region-S"[^>]* d="M[^A]*A\S+ \S+ 0 )(\d) (\d)',lambda m:m.group(1)+str(1-int(m.group(2)))+' '+m.group(3),svg)
        self.assertNotEqual(flipped,svg);report=audit(plan,flipped,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_REGION_ARC_SIDE_MISMATCH:S',report['errors'])
        flipped=re.sub(r'(id="overlay-circle-region-S"[^>]* d="M[^A]*A\S+ \S+ 0 \d )(\d)',lambda m:m.group(1)+str(1-int(m.group(2))),svg)
        self.assertNotEqual(flipped,svg);self.assertIn('OVERLAY_CIRCLE_REGION_ARC_SIDE_MISMATCH:S',audit(plan,flipped,model['transform'])['errors'])

    def test_a_moved_corner_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        moved=re.sub(r'(id="overlay-circle-region-S"[^>]* d="M)([-\d.e]+)',lambda m:m.group(1)+str(float(m.group(2))+9),svg)
        report=audit(plan,moved,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_REGION_CORNER_MISMATCH:S',report['errors'])

    def test_a_wrong_region_radius_or_colour_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        wide=re.sub(r'(id="overlay-circle-region-S"[^>]* d="M[^A]*A)([-\d.e]+) ([-\d.e]+)',lambda m:m.group(1)+str(float(m.group(2))*1.1)+' '+str(float(m.group(3))*1.1),svg)
        self.assertIn('OVERLAY_CIRCLE_REGION_RADIUS_MISMATCH:S',audit(plan,wide,model['transform'])['errors'])
        recoloured=re.sub(r'(id="overlay-circle-region-S"[^>]* fill=")[^"]+',lambda m:m.group(1)+'#e4e7ec',svg)
        self.assertIn('OVERLAY_CIRCLE_REGION_FILL_MISMATCH:S',audit(plan,recoloured,model['transform'])['errors'])

    def test_a_missing_region_or_fill_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        self.assertIn('OVERLAY_CIRCLE_REGION_MISSING:S',audit(plan,re.sub(r'<path id="overlay-circle-region-S"[^>]*/>','',svg),model['transform'])['errors'])
        self.assertIn('OVERLAY_CIRCLE_FILL_MISSING:C',audit(plan,re.sub(r'<circle id="overlay-circle-C-fill"[^>]*/>','',svg),model['transform'])['errors'])

    def test_a_wrong_fill_colour_or_a_stroked_fill_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        recoloured=re.sub(r'(id="overlay-circle-C-fill"[^>]* fill=")[^"]+',lambda m:m.group(1)+'#c7ccd5',svg)
        self.assertIn('OVERLAY_CIRCLE_FILL_COLOR_MISMATCH:C',audit(plan,recoloured,model['transform'])['errors'])
        stroked=re.sub(r'(id="overlay-circle-C-fill"[^>]*?)stroke="none"',r'stroke="black"',svg);self.assertNotEqual(stroked,svg)
        self.assertNotEqual(audit(plan,stroked,model['transform'])['status'],'PASS')   # a stroked fill disc is refused (by the circle audit or by the family audit that reads every circle)

    def test_an_undeclared_fill_or_region_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        no_fill=copy.deepcopy(plan);no_fill['overlays']['circles'][0].pop('fill');no_fill['overlaysFeatures']['circles'][0].pop('fill')
        self.assertIn('OVERLAY_CIRCLE_FILL_UNDECLARED:C',audit(no_fill,svg,model['transform'])['errors'])
        no_region=copy.deepcopy(plan);no_region['overlays'].pop('circleRegions');no_region['overlaysFeatures'].pop('circleRegions')
        self.assertIn('OVERLAY_UNDECLARED:overlay-circle-region-S',audit(no_region,svg,model['transform'])['errors'])


if __name__=='__main__':unittest.main()
