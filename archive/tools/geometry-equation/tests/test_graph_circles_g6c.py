"""G6c: a region bounded by pieces of the drawn curve and circle arcs (circleRegions[].boundary), the exact touching point of a curve and a circle
(pick TANGENT, and repeated roots among MIN_X/MAX_X), and coordinateBand.hide for a required extremum, each with the independent observer on the model SVG
including tampering."""
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


def fitted(plan):return fit_overview(copy.deepcopy(plan))['graphPlan']
def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None
def observed(plan):
    model=produce(plan);return audit(plan,model['svg'],model['transform']),model

# the circle x^2+(y-2)^2=4 touches y=x^2 at the origin and cuts it at (+-sqrt3,3); S1 is the part on the right between the parabola and the minor arc OP
PARABOLA={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],
          'requiredPoints':[{'id':'V','x':0,'y':0}],'coordinateBand':{'hide':['V']},'axisTickValues':{'x':[],'y':[]},
          'overlays':{'circles':[{'id':'C','center':['0','2'],'radiusSquared':'4'}],
                      'points':[{'id':'T','intersect':['curve','C'],'pick':'TANGENT','unnamed':True},{'id':'P','intersect':['curve','C'],'pick':'MAX_X'},{'id':'Q','intersect':['curve','C'],'pick':'MIN_X'}],
                      'circleRegions':[{'id':'S1','fill':'LIGHT','label':'S_1','boundary':[{'curve':'curve','fromX':'0','toX':'sqrt(3)'},{'arc':'C','from':'P','to':'T','sweep':'MINOR'}]},
                                       {'id':'S2','fill':'MEDIUM','boundary':[{'curve':'curve','fromX':'0','toX':'-sqrt(3)'},{'arc':'C','from':'Q','to':'T','sweep':'MINOR'}]}]}}
def variant(mutate):
    plan=copy.deepcopy(PARABOLA);mutate(plan['overlays'],plan);return plan
def region_svg(plan,ident='S1'):
    model=produce(plan);return model,model['svg']
def path_d(svg,ident='S1'):return re.search(r'<path id="overlay-circle-region-'+ident+r'"[^>]* d="([^"]+)"',svg).group(1)


class Tangent(unittest.TestCase):
    def test_the_touching_point_is_exact(self):
        points={p['id']:p for p in fitted(PARABOLA)['overlaysFeatures']['points']}
        self.assertEqual((points['T']['xExact'],points['T']['yExact']),('0','0'))
        self.assertEqual((points['P']['xExact'],points['P']['yExact']),('sqrt(3)','3'))

    def test_min_and_max_pick_the_repeated_root_too(self):
        # the circle x^2+(y-2)^2=4 has roots -sqrt3, 0 (double), sqrt3: the double root is the middle one; a circle meeting the curve only there is picked by MIN_X and MAX_X alike
        def only_touch(o,plan):
            o['circles'][0]['radiusSquared']='4';o['points']=[{'id':'T','intersect':['curve','C'],'pick':'MIN_X'}];o.pop('circleRegions')
        self.assertEqual({p['id']:p['xExact'] for p in fitted(variant(only_touch))['overlaysFeatures']['points']}['T'],'-sqrt(3)')
        def small(o,plan):
            o['circles'][0].update(center=['0','1/2'],radiusSquared='1/4');o['points']=[{'id':'T','intersect':['curve','C'],'pick':'MAX_X'}];o.pop('circleRegions')
        self.assertEqual({p['id']:p['xExact'] for p in fitted(variant(small))['overlaysFeatures']['points']}['T'],'0')

    def test_the_observer_agrees(self):
        report,_=observed(fitted(PARABOLA));self.assertEqual(report['status'],'PASS',report)

    def test_a_moved_touching_point_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        moved=re.sub(r'(<circle id="T"[^>]* cx=")([-\d.e]+)',lambda m:m.group(1)+str(float(m.group(2))+9),svg);self.assertNotEqual(moved,svg)
        report=audit(plan,moved,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_POINT_MISMATCH:T',report['errors'])

    def test_claims_fail_closed(self):
        def far(o,plan):o['circles'][0].update(center=['0','5'],radiusSquared='1')
        def crossing(o,plan):o['circles'][0].update(center=['0','3'],radiusSquared='4');o.pop('circleRegions');o['points']=[{'id':'T','intersect':['curve','C'],'pick':'TANGENT'}]
        def two(o,plan):
            o['circles'][0].update(center=['0','3'],radiusSquared='11/4')   # x^2+(x^2-3)^2-11/4 = (x^2-5/2)^2: the circle touches the parabola at x=+-sqrt(5/2)
            o.pop('circleRegions');o['points']=[{'id':'T','intersect':['curve','C'],'pick':'TANGENT'}]
        self.assertEqual(refused(variant(crossing)),'OVERLAY_CIRCLE_CURVE_TANGENT_NOT_FOUND:T')
        self.assertEqual(refused(variant(two)),'OVERLAY_CIRCLE_CURVE_TANGENT_AMBIGUOUS:T')

    def test_a_transcendental_curve_has_no_exact_tangent(self):
        log={'family':'logarithmic-affine','base':'27','coefficients':['-1','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'},'domain':[0.1,3.4],'viewport':[-0.5,3.5,-2,2],'axisTickValues':{'x':[],'y':[]},
             'overlays':{'circles':[{'id':'C','center':['5/3','0'],'radiusSquared':'17/9'}],'points':[{'id':'P','intersect':['curve','C'],'pick':'TANGENT'}]}}
        self.assertEqual(refused(log),'OVERLAY_CIRCLE_CURVE_INTERSECTION_NOT_EXACT:P')


class BoundaryRegion(unittest.TestCase):
    def test_the_model_passes_the_observer(self):
        report,model=observed(fitted(PARABOLA));self.assertEqual(report['status'],'PASS',report)
        self.assertIn('id="overlay-circle-region-S1"',model['svg']);self.assertIn('id="overlay-circle-region-S2"',model['svg'])

    def test_the_arc_is_the_minor_arc_and_a_major_arc_flips_the_flags(self):
        minor=fitted(PARABOLA)['overlaysFeatures']['circleRegions'][0]['boundary'][1]
        major=fitted(variant(lambda o,plan:o['circleRegions'][0]['boundary'][1].update(sweep='MAJOR')))['overlaysFeatures']['circleRegions'][0]['boundary'][1]
        self.assertEqual((minor['sweep'],minor['large']),('CW',False));self.assertEqual((major['sweep'],major['large']),('CCW',True))

    def test_the_curve_piece_is_sampled_on_the_curve(self):
        samples=fitted(PARABOLA)['overlaysFeatures']['circleRegions'][0]['boundary'][0]['samples']
        self.assertEqual(samples[0],[0.0,0.0]);self.assertAlmostEqual(samples[-1][0],3**.5,places=12);self.assertEqual(samples[-1][1],3.0)
        self.assertTrue(all(abs(y-x*x)<1e-9 for x,y in samples))

    def test_claims_fail_closed(self):
        def open_(o,plan):o['circleRegions'][0]['boundary'][1].update(to='Q')
        def unknown(o,plan):o['circleRegions'][0]['boundary'][0].update(curve='g')
        def off_circle(o,plan):
            o['points'].append({'id':'R','curveX':'1'});o['circleRegions'][0]['boundary'][1].update(**{'from':'R'})
        def gap(o,plan):o['circleRegions'][0]['boundary'][0].update(toX='1')
        def sweep(o,plan):o['circleRegions'][0]['boundary'][1].update(sweep='HALF')
        cases=[('OVERLAY_CIRCLE_REGION_BOUNDARY_NOT_CLOSED:S1',open_),('OVERLAY_CIRCLE_REGION_CURVE_UNKNOWN:S1',unknown),
               ('OVERLAY_CIRCLE_REGION_ENDPOINT_NOT_ON_CIRCLE:S1:R',off_circle),('OVERLAY_CIRCLE_REGION_BOUNDARY_NOT_CLOSED:S1',gap),('OVERLAY_CIRCLE_REGION_SWEEP_INVALID:S1',sweep)]
        for code,mutate in cases:
            with self.subTest(code=code):self.assertEqual(refused(variant(mutate)),code)

    def test_a_moved_corner_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        moved=re.sub(r'(id="overlay-circle-region-S1"[^>]* d="M)([-\d.e]+)',lambda m:m.group(1)+str(float(m.group(2))+9),svg)
        report=audit(plan,moved,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_REGION_CORNER_MISMATCH:S1',report['errors'])

    def test_a_curve_vertex_off_the_curve_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan);d=path_d(svg)
        numbers=list(re.finditer(r'L([-\d.e]+) ([-\d.e]+)',d))[10]
        bad=d[:numbers.start(2)]+str(float(numbers.group(2))+14)+d[numbers.end(2):]
        report=audit(plan,svg.replace(d,bad),model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('OVERLAY_CIRCLE_REGION_CURVE_MISMATCH:S1',report['errors'])

    def test_a_wrong_arc_flag_or_radius_or_colour_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        flipped=re.sub(r'(id="overlay-circle-region-S1"[^>]* d="M[^A]*A\S+ \S+ 0 )(\d) (\d)',lambda m:m.group(1)+str(1-int(m.group(2)))+' '+m.group(3),svg)
        self.assertNotEqual(flipped,svg);self.assertIn('OVERLAY_CIRCLE_REGION_ARC_SIDE_MISMATCH:S1',audit(plan,flipped,model['transform'])['errors'])
        wide=re.sub(r'(id="overlay-circle-region-S1"[^>]* d="M[^A]*A)([-\d.e]+) ([-\d.e]+)',lambda m:m.group(1)+str(float(m.group(2))*1.1)+' '+str(float(m.group(3))*1.1),svg)
        self.assertIn('OVERLAY_CIRCLE_REGION_RADIUS_MISMATCH:S1',audit(plan,wide,model['transform'])['errors'])
        recoloured=re.sub(r'(id="overlay-circle-region-S1"[^>]* fill=")[^"]+',lambda m:m.group(1)+'#c7ccd5',svg)
        self.assertIn('OVERLAY_CIRCLE_REGION_FILL_MISMATCH:S1',audit(plan,recoloured,model['transform'])['errors'])

    def test_a_missing_region_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        self.assertIn('OVERLAY_CIRCLE_REGION_MISSING:S1',audit(plan,re.sub(r'<path id="overlay-circle-region-S1"[^>]*/>','',svg),model['transform'])['errors'])

    def test_a_region_swapped_for_the_other_side_fails(self):
        # the S2 path drawn under S1's id: its corners are on the left, S1 expects the right
        plan=fitted(PARABOLA);model,svg=region_svg(plan);d1,d2=path_d(svg,'S1'),path_d(svg,'S2')
        report=audit(plan,svg.replace(d1,d2),model['transform']);self.assertEqual(report['status'],'FAIL')


class CoordinateBandHide(unittest.TestCase):
    def test_a_hidden_extremum_keeps_its_dot_and_is_still_required(self):
        # without the required extremum the framing refuses; with it listed and hidden it is accepted and its dot is observed
        self.assertTrue((refused(variant(lambda o,plan:plan.update(requiredPoints=[]))) or '').startswith('PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS'))
        plan=fitted(PARABOLA);report,model=observed(plan);self.assertEqual(report['status'],'PASS',report);self.assertIn('id="required-point-1"',model['svg'])

    def test_a_hidden_point_with_a_coordinate_text_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        shown=svg.replace('</svg>','<g id="required-point-1-coordinates"></g></svg>')
        report=audit(plan,shown,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('COORDINATE_BAND_HIDDEN_POINT_SHOWN:V',report['errors'])

    def test_a_moved_hidden_dot_fails(self):
        plan=fitted(PARABOLA);model,svg=region_svg(plan)
        moved=re.sub(r'(<circle id="required-point-1"[^>]* cx=")([-\d.e]+)',lambda m:m.group(1)+str(float(m.group(2))+9),svg);self.assertNotEqual(moved,svg)
        report=audit(plan,moved,model['transform']);self.assertEqual(report['status'],'FAIL');self.assertIn('PIECEWISE_POLY_KEY_POINT_DOT_MISSING:V',report['errors'])


if __name__=='__main__':unittest.main()
