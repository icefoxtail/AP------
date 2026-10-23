import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

def graph(coefficients=['-1','0','3'],domain=[-2,2],viewport=[-2,2,-2,12],**kwargs):
    return {'family':'polynomial','coefficients':coefficients,'domain':domain,'viewport':viewport,**kwargs}
class GraphOverview(unittest.TestCase):
    def test_mathematically_correct_narrow_crop_and_flattened_frame_fail_shape(self):
        for p in [graph(domain=[-.1,.1],viewport=[-2,2,-2,12]),graph(domain=[.5,2],viewport=[.5,2,-2,12]),graph(viewport=[-2,2,-1000000,1000000])]:
            o=produce(p)
            self.assertEqual(audit(p,o['svg'],o['transform'])['status'],'PASS')
            r=audit({**p,'shapeIntent':'OVERVIEW'},o['svg'],o['transform'])
            self.assertEqual(r['status'],'FAIL');self.assertTrue(any(e.startswith('OVERVIEW_') for e in r['errors']))
    def test_fit_both_openings_translations_and_coefficient_scales(self):
        # One scale on both axes: the drawn shape is the true parabola, and the plot is as high as that needs (160-640).
        for coefficients in [['-1','0','3'],['-4','6','-3'],['0','0','1/10000'],['3','-2','1'],['0','4','-1/2']]:
            p=graph(coefficients=coefficients,domain=[-.01,.01],sourceDomain={'kind':'ALL_REALS'})
            fitted=fit_overview(p)['graphPlan'];o=produce(fitted);r=audit(fitted,o['svg'],o['transform'])
            self.assertEqual(r['status'],'PASS',(coefficients,r['errors']));self.assertEqual(fitted['sourceDomain'],p['sourceDomain']);self.assertEqual(r['overview']['status'],'PASS')
            self.assertEqual(fitted['overviewPolicy'],'QUADRATIC_EQUAL_UNIT_OVERVIEW_v1');self.assertTrue(fitted['equalUnits'])
            x0,x1,y0,y1=fitted['viewport'];self.assertAlmostEqual(448/(x1-x0),fitted['plotCanvas']['height']/(y1-y0),9)
            self.assertTrue(160<=fitted['plotCanvas']['height']<=640)
        # A vertex far from the axes or a needle-steep parabola cannot be drawn readably at one scale: an honest failure.
        for coefficients in [['10000','0','1'],['-20','-60','3'],['0','0','10000']]:
            with self.assertRaisesRegex(ValueError,'EQUAL_UNIT_PARABOLA_TOO_NARROW'):fit_overview(graph(coefficients=coefficients,domain=[-.01,.01],sourceDomain={'kind':'ALL_REALS'}))
    def test_squeeze_only_after_a_failure_at_one_scale(self):
        # y=x^2+29 in a 222-high panel: at one scale the curve is 31 px wide (too narrow); y squeezed to half the x scale makes it readable.
        p=graph(coefficients=['29','0','1'],domain=[-.01,.01],sourceDomain={'kind':'ALL_REALS'},plotHeightLimit=222)
        fitted=fit_overview(p)['graphPlan'];o=produce(fitted);r=audit(fitted,o['svg'],o['transform'])
        self.assertEqual(fitted['axisRatio'],.5);self.assertEqual(r['status'],'PASS',r['errors'])
        self.assertAlmostEqual(o['transform']['sy'],.5*o['transform']['sx'],9)
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit({**fitted,'axisRatio':1},o['svg'],o['transform'])['errors'])
        self.assertIn('AXIS_RATIO_INVALID',audit({**fitted,'axisRatio':.4},o['svg'],o['transform'])['errors'])
        # A figure that fits at one scale keeps it; axisSqueeze (after a layout failure) squeezes only as far as filling the width needs.
        self.assertEqual(fit_overview(graph(sourceDomain={'kind':'ALL_REALS'}))['graphPlan']['axisRatio'],1.0)
        tall=graph(coefficients=['4','0','-1'],domain=[-1,3],sourceDomain={'kind':'INTERVAL','range':[-1,3]},requiredPoints=[],plotHeightLimit=300)
        self.assertEqual(fit_overview(tall)['graphPlan']['axisRatio'],1.0)
        squeezed=fit_overview({**tall,'axisSqueeze':True})['graphPlan'];s=produce(squeezed)
        self.assertTrue(.5<=squeezed['axisRatio']<1);self.assertEqual(audit(squeezed,s['svg'],s['transform'])['status'],'PASS')
    def test_unequal_scale_in_the_final_figure_is_caught(self):
        p=fit_overview(graph(sourceDomain={'kind':'ALL_REALS'}))['graphPlan'];o=produce(p)
        squeezed={**o['transform'],'sy':o['transform']['sy']*.5}
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(p,o['svg'],squeezed)['errors'])
        interval=fit_overview(graph(coefficients=['4','0','-1'],domain=[-1,3],sourceDomain={'kind':'INTERVAL','range':[-1,3]},requiredPoints=[]))['graphPlan'];i=produce(interval)
        self.assertEqual(audit(interval,i['svg'],i['transform'])['status'],'PASS')
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(interval,i['svg'],{**i['transform'],'sy':i['transform']['sy']*.5})['errors'])
    def test_never_expand_unreviewed_or_restricted_source_domain(self):
        with self.assertRaisesRegex(ValueError,'DRAW_INTERVAL_TOO_NARROW'):fit_overview(graph(domain=[-.1,.1]))
        with self.assertRaisesRegex(ValueError,'RESTRICTED_SOURCE_DOMAIN'):fit_overview(graph(sourceDomain={'kind':'HALF_LINE','range':[0,1]}))
        p=graph();fitted=fit_overview(p)['graphPlan'];self.assertEqual(fitted['domain'],p['domain'])
    def test_local_detail_cannot_replace_main_overview(self):
        p=graph(shapeIntent='OVERVIEW');o=produce(p)
        import xml.etree.ElementTree as ET
        root=ET.fromstring(o['svg'])
        for n in root:
            pts=n.get('points').split();n.set('points',' '.join(pts[len(pts)//2:]))
        result=audit(p,ET.tostring(root,encoding='unicode'),o['transform'])
        self.assertIn('OVERVIEW_LEFT_ARM_TOO_NARROW',result['errors'])
    def test_actual_size_too_small_cannot_pass_through_intrinsic_bounds(self):
        p=fit_overview(graph(sourceDomain={'kind':'ALL_REALS'}))['graphPlan'];o=produce(p)
        self.assertEqual(audit(p,o['svg'],o['transform'])['status'],'PASS')
        r=audit(p,o['svg'],{**o['transform'],'displayScale':.05})
        self.assertEqual(r['status'],'FAIL');self.assertIn('EQUAL_UNIT_PARABOLA_TOO_NARROW',r['errors'])
    def test_unimplemented_family_is_not_auto_qualified(self):
        with self.assertRaisesRegex(ValueError,'CUBIC_QUARTIC_REQUIRES_ALL_REALS_SOURCE_DOMAIN'):
            fit_overview(graph(coefficients=['0','0','0','1']))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_OVERVIEW_FAMILY'):
            fit_overview(graph(family='exp'))
    def test_source_required_points_survive_fitting(self):
        p=graph(coefficients=['-1','0','1'],sourceDomain={'kind':'ALL_REALS'},requiredPoints=[{'id':'P','x':2,'y':3}])
        fitted=fit_overview(p)['graphPlan'];o=produce(fitted);r=audit(fitted,o['svg'],o['transform'])
        self.assertEqual(r['status'],'PASS',r['errors'])
        cropped={**fitted,'viewport':[fitted['viewport'][0],fitted['viewport'][1],-2,2]}
        c=produce(cropped);self.assertIn('OVERVIEW_REQUIRED_FEATURE_CLIPPED:P',audit(cropped,c['svg'],c['transform'])['errors'])

class QuadraticInterval(unittest.TestCase):
    def plan(self,states=None,required=None):
        source={'kind':'INTERVAL','range':[-1,3],**({'states':states} if states else {})}
        points=[{'id':'V','x':0,'y':4},{'id':'P','x':-1,'y':3},{'id':'Q','x':3,'y':-5}] if required is None else required
        return graph(coefficients=['4','0','-1'],domain=[-2,4],viewport=[-2,4,-7,6],sourceDomain=source,requiredPoints=points)
    def test_closed_interval_draws_only_the_interval_with_filled_end_dots(self):
        fitted=fit_overview(self.plan())['graphPlan']
        self.assertEqual(fitted['domain'],[-1.0,3.0])
        self.assertEqual(fitted['intervalFeatures']['endpoints'],[{'side':'START','x':'-1','y':'3','state':'CLOSED'},{'side':'END','x':'3','y':'-5','state':'CLOSED'}])
        o=produce(fitted);r=audit(fitted,o['svg'],o['transform'])
        self.assertEqual(r['status'],'PASS',r['errors']);self.assertEqual(r['overview']['observedEndpointMarkers'],2)
    def test_open_end_is_hollow_and_cannot_carry_a_key_point(self):
        fitted=fit_overview(self.plan(states=['CLOSED','OPEN'],required=[{'id':'V','x':0,'y':4}]))['graphPlan']
        o=produce(fitted);self.assertIn('data-endpoint-state="OPEN"',o['svg'])
        self.assertEqual(audit(fitted,o['svg'],o['transform'])['status'],'PASS')
        filled=o['svg'].replace('fill="white"','fill="black"')
        self.assertIn('POLYNOMIAL_INTERVAL_END_MARKER_STATE_MISMATCH',audit(fitted,filled,o['transform'])['errors'])
        with self.assertRaisesRegex(ValueError,'REQUIRED_GRAPH_POINT_AT_OPEN_ENDPOINT:Q'):fit_overview(self.plan(states=['CLOSED','OPEN']))
    def test_curve_past_the_interval_or_a_missing_end_dot_fails(self):
        import re
        fitted=fit_overview(self.plan())['graphPlan']
        wide=produce({**fitted,'domain':[-1.3,3.0]})
        self.assertIn('POLYNOMIAL_CURVE_OUTSIDE_SOURCE_INTERVAL',audit(fitted,wide['svg'],wide['transform'])['errors'])
        o=produce(fitted);bare=re.sub(r'<circle id="interval-endpoint-start"[^>]*/>','',o['svg'])
        self.assertIn('POLYNOMIAL_INTERVAL_START_MARKER_MISSING',audit(fitted,bare,o['transform'])['errors'])

if __name__=='__main__':unittest.main()
