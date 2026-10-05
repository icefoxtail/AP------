import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_observer import audit,resolve
from graph_spike import produce

def plan(family='polynomial',**kwargs):
    return {'family':family,'coefficients':['0','0','1'],'domain':[-2,2],'viewport':[-2,2,-1,5],**kwargs}

class GraphSpike(unittest.TestCase):
    def test_polynomial_and_rational_and_sqrt(self):
        cases=[plan(),plan('rational',numerator=['1'],denominator=['0','1'],viewport=[-2,2,-4,4]),plan('sqrt-affine',radicand=['0','1'],domain=[0,4],viewport=[0,4,-1,3])]
        for p in cases:
            output=produce(p);result=audit(p,output['svg'],output['transform'])
            self.assertEqual(result['status'],'PASS',result['errors'])
    def test_exact_vertices_but_wrong_segment_interior(self):
        p=plan();out=produce(p);m=out['transform']
        pts=[(m['originX']+t*m['sx'],m['originY']-t*t*m['sy']) for t in [-2,0,2]]
        svg='<svg><polyline data-role="curve" points="'+' '.join(f'{a},{b}' for a,b in pts)+'"/></svg>'
        result=audit(p,svg,m);self.assertIn('CURVE_INTERIOR_BOUND_FAIL',result['errors'])
        self.assertTrue(all(r['vertexErrorPx']<1e-8 for r in result['segments']))
    def test_repeated_and_clustered_roots(self):
        p=plan(coefficients=['1','-2','1']);self.assertEqual(resolve(p)[-1]['roots'],[(1.,2)])
        p=plan(coefficients=['1000001/1000000','-2000001/1000000','1'])
        roots=resolve(p)[-1]['roots'];self.assertEqual(len(roots),2);self.assertLess(roots[1][0]-roots[0][0],.000002)
    def test_hole_and_pole_preserve_source_domain(self):
        p=plan('rational',numerator=['-1','1'],denominator=['-1','1']);o=produce(p);r=audit(p,o['svg'],o['transform'])
        self.assertEqual(r['topology']['holes'],[1]);self.assertIn('REMOVABLE_HOLE_MARKER_MISSING',r['errors'])
        p=plan('rational',numerator=['1'],denominator=['0','0','1']);self.assertEqual(resolve(p)[-1]['poles'],[0])
    def test_sqrt_missing_endpoint_and_visible_reentry(self):
        p=plan('sqrt-affine',radicand=['0','1'],domain=[0,4],viewport=[0,4,-1,3]);o=produce(p)
        import xml.etree.ElementTree as ET
        root=ET.fromstring(o['svg']);curve=list(root)[0];points=curve.get('points').split();curve.set('points',' '.join(points[len(points)//3:]))
        self.assertIn('VISIBLE_COVERAGE_GAP',audit(p,ET.tostring(root,encoding='unicode'),o['transform'])['errors'])
        p=plan(coefficients=['4','0','-5','0','1'],domain=[-3,3],viewport=[-3,3,-.5,.5]);o=produce(p)
        r=audit(p,o['svg'],o['transform']);self.assertEqual(r['status'],'PASS',r['errors']);self.assertGreater(len(r['topology']['visibleIntervals']),2)
    def test_clipped_endpoint_tolerates_bounded_chord_intersection(self):
        p=plan(viewport=[-2,2,-.5,1.3]);o=produce(p);r=audit(p,o['svg'],o['transform'])
        self.assertEqual(r['status'],'PASS',r['errors'])
    def test_unsupported_families(self):
        for family in ['trig','log','exp','piecewise']:
            self.assertEqual(audit(plan(family),'<svg/>',{'sx':1})['status'],'UNSUPPORTED')

if __name__=='__main__':unittest.main()
