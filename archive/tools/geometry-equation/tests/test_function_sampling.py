import sys,math,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.viewport import Viewport,for_spec
from visual_engine.function_sampling import sample

class SamplingTests(unittest.TestCase):
    def test_polynomials_and_critical_points(self):
        v=Viewport(-4,4,-20,20,equal=False)
        for expression in ('x^2','x^3-4x','x^4-5x^2+4'):
            r=sample(expression,[-4,4],v)
            self.assertEqual(r['status'],'PASS')
            self.assertGreater(r['sampleCount'],200)
            self.assertLessEqual(r['screenSpaceChordErrorPx'],.35)
            self.assertGreater(len(r['criticalX']),0)
    def test_rational_poles(self):
        v=Viewport(-2,2,-10,10,equal=False)
        for expr,pole in (('1/x',0),('1/(x-0.123)^2',.123)):
            r=sample(expr,[-2,2],v)
            self.assertGreaterEqual(r['branchCount'],2)
            self.assertFalse(any(b[0][0]<pole<b[-1][0] for b in r['branches']))
    def test_log_sqrt_domains(self):
        v=Viewport(-2,3,-5,5,equal=False)
        for expr in ('log(x)','sqrt(x)'):
            r=sample(expr,[-2,3],v)
            self.assertTrue(r['branches'])
            self.assertTrue(all(p[0]>0 for b in r['branches'] for p in b))
    def test_tan_branch_signature(self):
        v=Viewport(-4,4,-10,10,equal=False);r=sample('tan(x)',[-4,4],v)
        self.assertGreaterEqual(r['branchCount'],3)
        self.assertFalse(any(b[0][0]<math.pi/2<b[-1][0] for b in r['branches']))
    def test_exp_sin_cos_and_finite(self):
        v=Viewport(-5,5,-2,5,equal=False)
        for expr in ('exp(x)','sin(x)','cos(x)'):
            r=sample(expr,[-5,5],v)
            self.assertTrue(all(math.isfinite(z) for b in r['branches'] for p in b for z in p))
    def test_piecewise_segment_breaks(self):
        r=sample('x',[-2,2],Viewport(-2,2,-2,2),breaks=[.5])
        self.assertEqual(r['branchCount'],2)
    def test_viewport_policy(self):
        v=Viewport(-2,2,-10,10);self.assertEqual(v.sx,v.sy)
        w=Viewport(-2,2,-10,10,equal=False);self.assertNotEqual(w.sx,w.sy)
        spec={'visualType':'coordinate_geometry','viewport':{'xMin':-1,'xMax':1,'yMin':-1,'yMax':1}}
        v=for_spec(spec,[(5,3)]);self.assertTrue(v.contains((5,3)))
    def test_clipping_boundary(self):
        r=sample('x^3',[-4,4],Viewport(-4,4,-2,2,equal=False))
        self.assertTrue(all(-2<=y<=2 for b in r['branches'] for x,y in b))
        self.assertEqual(r['branches'][-1][-1][1],2)

if __name__=='__main__':unittest.main()
