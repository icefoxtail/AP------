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
        for coefficients in [['-1','0','3'],['-4','6','-3'],['10000','0','1'],['-20','-60','3'],['0','0','1/10000'],['0','0','10000']]:
            p=graph(coefficients=coefficients,domain=[-.01,.01],sourceDomain={'kind':'ALL_REALS'})
            fitted=fit_overview(p)['graphPlan'];o=produce(fitted);r=audit(fitted,o['svg'],o['transform'])
            self.assertEqual(r['status'],'PASS',(coefficients,r['errors']));self.assertEqual(fitted['sourceDomain'],p['sourceDomain']);self.assertEqual(r['overview']['status'],'PASS')
    def test_never_expand_unreviewed_or_restricted_source_domain(self):
        with self.assertRaisesRegex(ValueError,'DRAW_INTERVAL_TOO_NARROW'):fit_overview(graph(domain=[-.1,.1]))
        with self.assertRaisesRegex(ValueError,'RESTRICTED_SOURCE_DOMAIN'):fit_overview(graph(sourceDomain={'kind':'INTERVAL','range':[0,1]}))
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
        r=audit(p,o['svg'],{**o['transform'],'displayScale':.1})
        self.assertEqual(r['status'],'FAIL');self.assertIn('OVERVIEW_LEFT_ARM_TOO_SHORT',r['errors'])
    def test_unimplemented_family_is_not_auto_qualified(self):
        for p in [graph(coefficients=['0','0','0','1']),graph(family='exp')]:
            with self.assertRaisesRegex(ValueError,'UNSUPPORTED_OVERVIEW'):fit_overview(p)
    def test_source_required_points_survive_fitting(self):
        p=graph(coefficients=['-1','0','1'],sourceDomain={'kind':'ALL_REALS'},requiredPoints=[{'id':'P','x':2,'y':3}])
        fitted=fit_overview(p)['graphPlan'];o=produce(fitted);r=audit(fitted,o['svg'],o['transform'])
        self.assertEqual(r['status'],'PASS',r['errors'])
        cropped={**fitted,'viewport':[fitted['viewport'][0],fitted['viewport'][1],-2,2]}
        c=produce(cropped);self.assertIn('OVERVIEW_REQUIRED_FEATURE_CLIPPED:P',audit(cropped,c['svg'],c['transform'])['errors'])

if __name__=='__main__':unittest.main()
