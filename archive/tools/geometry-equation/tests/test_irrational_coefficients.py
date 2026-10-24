"""piecewise-polynomial-spike-v1 with irrational coefficients p+q*sqrt(r): exact framing, the model and the independent observer."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview,pp_surd,pp_surd_text,pp_surd_split
from graph_spike import produce
from graph_observer import audit

# 26 Maesan H1 mid q11: y=x^2+kx+5 touches y=-3x+2 for k=-3+2*sqrt(3); the contact point T=(-sqrt(3),2+3*sqrt(3)).
TANGENT={'family':'piecewise-polynomial','pieces':[{'coefficients':['5','-3+2*sqrt(3)','1']}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceLines':[{'id':'l','slope':'-3','intercept':'2','intersectionX':['-sqrt(3)']}],
     'requiredPoints':[{'id':'V','x':'3/2-sqrt(3)','y':'-1/4+3*sqrt(3)'},{'id':'T','x':'-sqrt(3)','y':'2+3*sqrt(3)'}],'axisTickValues':{'x':[],'y':[]}}
# 23 Maesan H1 mid q11: y=x^2-2(m-1)x for m=3-sqrt(7) touches the horizontal line y=-4m+1 at its vertex.
HORIZONTAL={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','-4+2*sqrt(7)','1']}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceLines':[{'id':'l','y':'-11+4*sqrt(7)','intersectionX':['2-sqrt(7)']}],
     'requiredPoints':[{'id':'V','x':'2-sqrt(7)','y':'-11+4*sqrt(7)'},{'id':'O','x':0,'y':0},{'id':'B','x':'4-2*sqrt(7)','y':0}],'axisTickValues':{'x':[],'y':[]}}
# 24 Maesan H1 mid q23: the line of slope 6-2*sqrt(7) touches the right piece; its other crossing is a nested radical.
BOUNDARY={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','4','2']},{'coefficients':['0','-2','-1']}],'breakpoints':[{'x':'-2','y':'0'}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceLines':[{'id':'l','slope':'6-2*sqrt(7)','intercept':'23-8*sqrt(7)','intersectionX':['(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2','-4+sqrt(7)']}],
     'requiredPoints':[{'id':'A','x':-2,'y':0},{'id':'T','x':'-4+sqrt(7)','y':'-15+6*sqrt(7)'},{'id':'V','x':-1,'y':1}],'axisTickValues':{'x':[],'y':[]}}
# 24 Hyocheon H1 mid q22: f=-x^2+2ax+2a on [0,2] for a=2-sqrt(2); maximum at the vertex, minimum at x=2.
INTERVAL={'family':'piecewise-polynomial','pieces':[{'coefficients':['4-2*sqrt(2)','4-2*sqrt(2)','-1']}],'sourceDomain':{'kind':'INTERVAL','range':[0,2]},
     'referenceLines':[{'id':'M','y':'10-6*sqrt(2)','intersectionX':['2-sqrt(2)']},{'id':'m','y':'8-6*sqrt(2)','intersectionX':['2']}],
     'requiredPoints':[{'id':'V','x':'2-sqrt(2)','y':'10-6*sqrt(2)'}],'axisTickValues':{'x':[],'y':[]}}
# 25 Maesan H1 mid q18: rational parabola, irrational crossings with y=4x.
CROSSING={'family':'piecewise-polynomial','pieces':[{'coefficients':['12','0','-2']}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceLines':[{'id':'l','slope':'4','intercept':'0','intersectionX':['-1-sqrt(7)','-1+sqrt(7)']}],
     'requiredPoints':[{'id':'V','x':0,'y':12},{'id':'A','x':'-1+sqrt(7)','y':'-4+4*sqrt(7)'},{'id':'B','x':'-1-sqrt(7)','y':'-4-4*sqrt(7)'}],'axisTickValues':{'x':[],'y':[]}}
PLANS=(TANGENT,HORIZONTAL,BOUNDARY,INTERVAL,CROSSING)

def refused(plan):
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None

class ExactNumbers(unittest.TestCase):
    def test_canonical_text_and_form(self):
        self.assertEqual(pp_surd_text(pp_surd('-3 + 2*sqrt(3)','X')),'-3+2*sqrt(3)')
        self.assertEqual(pp_surd_text(pp_surd('sqrt(12)','X')),'2*sqrt(3)')
        self.assertEqual(pp_surd_text(pp_surd('(1+sqrt(2))/2','X')),'1/2+sqrt(2)/2')
        self.assertEqual(pp_surd_text(pp_surd('1/(1+sqrt(2))','X')),'-1+sqrt(2)')
        self.assertEqual(pp_surd_text(pp_surd('-sqrt(5)','X')),'-sqrt(5)')
        self.assertEqual(pp_surd_text(pp_surd('4','X')),'4')
        self.assertEqual(pp_surd_split(pp_surd('3-2*sqrt(3)','X'),'X')[:2],(3,-2))
        # A rational written as a surd collapses to a rational.
        self.assertEqual(pp_surd_text(pp_surd('sqrt(4)+sqrt(9)','X')),'5')
    def test_forms_that_are_not_p_plus_q_sqrt_r(self):
        for text in ('sqrt(2)+sqrt(3)','sqrt(sqrt(2))','sqrt(2+sqrt(3))'):
            with self.subTest(text=text):
                with self.assertRaises(ValueError) as caught:pp_surd(text,'X')
                self.assertTrue(str(caught.exception).startswith('PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED'),str(caught.exception))

class Framing(unittest.TestCase):
    def test_every_plan_frames_with_exact_inventory(self):
        for plan in PLANS:fit_overview(plan)
        g=fit_overview(TANGENT)['graphPlan'];f=g['piecewisePolynomialFeatures']
        self.assertEqual(f['pieces'][0]['coefficients'],['5','-3+2*sqrt(3)','1'])
        self.assertEqual(f['extrema'],[{'x':'3/2-sqrt(3)','y':'-1/4+3*sqrt(3)','kind':'MIN'}])
        row=f['intersections'][0]
        self.assertEqual(row['slope'],'-3');self.assertEqual(row['points'][0]['keyPoint'],'T')
        self.assertAlmostEqual(row['points'][0]['xValue'],-3**.5,places=12)
        # The exact strings of requiredPoints become exactCoordinates; the plan keeps floats.
        self.assertEqual(g['exactCoordinates'],{'V':['3/2-sqrt(3)','-1/4+3*sqrt(3)'],'T':['-sqrt(3)','2+3*sqrt(3)']})
        self.assertTrue(all(isinstance(point['x'],float) for point in g['requiredPoints']))
    def test_irrational_horizontal_line_and_nested_crossing(self):
        g=fit_overview(HORIZONTAL)['graphPlan'];self.assertEqual(g['piecewisePolynomialFeatures']['intersections'][0]['y'],'-11+4*sqrt(7)')
        g=fit_overview(BOUNDARY)['graphPlan'];row=g['piecewisePolynomialFeatures']['intersections'][0]
        self.assertEqual(row['slope'],'6-2*sqrt(7)');self.assertEqual(row['intercept'],'23-8*sqrt(7)')
        self.assertEqual([p.get('keyPoint') for p in row['points']],[None,'T'])
    def test_interval_end_value_is_a_surd(self):
        g=fit_overview(INTERVAL)['graphPlan'];ends=g['intervalFeatures']['endpoints']
        self.assertEqual([(e['x'],e['y']) for e in ends],[('0','4-2*sqrt(2)'),('2','8-6*sqrt(2)')])
        self.assertEqual([p['xValue'] for p in g['piecewisePolynomialFeatures']['intersections'][1]['points']],[2.0])
    def test_claims_fail_closed(self):
        cases=[]
        p=copy.deepcopy(TANGENT);p['referenceLines'][0]['intersectionX']=['sqrt(3)'];cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:l'))
        p=copy.deepcopy(TANGENT);p['referenceLines'][0]['intercept']='3';cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:l:engine finds 2'))
        p=copy.deepcopy(TANGENT);p['pieces'][0]['coefficients'][1]='-3+2*sqrt(2)';cases.append((p,'PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:V'))
        p=copy.deepcopy(TANGENT);p['requiredPoints'][1]['y']='3+3*sqrt(3)';cases.append((p,'PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:T'))
        p=copy.deepcopy(TANGENT);p['pieces'][0]['coefficients'][1]='sqrt(2)+sqrt(3)';cases.append((p,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED'))
        p=copy.deepcopy(TANGENT);p['pieces'][0]['coefficients'][1]='sqrt(sqrt(3))';cases.append((p,'PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED'))
        p=copy.deepcopy(TANGENT);p['pieces'][0]['coefficients'][1]='x+1';cases.append((p,'PIECEWISE_POLY_COEFFICIENT_INVALID'))
        p=copy.deepcopy(TANGENT);p['pieces'][0]['coefficients'][1]='1.5';cases.append((p,'PIECEWISE_POLY_COEFFICIENT_INVALID'))
        # Two radicals in different fields (sqrt(3) in the parabola, sqrt(2) in the line) are one field too many.
        p=copy.deepcopy(TANGENT);p['referenceLines'][0]['intercept']='2+sqrt(2)';cases.append((p,'PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:2,3'))
        p=copy.deepcopy(TANGENT);p['referenceLines'][0]['slope']='-3+sqrt(2)';cases.append((p,'PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED:2,3'))
        p=copy.deepcopy(TANGENT);p['referenceLines'][0]['slope']='sqrt(3)-sqrt(3)';cases.append((p,'PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO'))
        p=copy.deepcopy(TANGENT);p['formula']='x^2+5';cases.append((p,'PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED'))
        p=copy.deepcopy(TANGENT);p['requiredPoints'][0]['x']='3/2-sqrt(3)+sqrt(2)';cases.append((p,'PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:V'))
        for plan,code in cases:
            with self.subTest(code=code):
                self.assertTrue((refused(plan) or '').startswith(code),refused(plan))
    def test_a_surd_vertex_that_is_not_marked_is_refused(self):
        p=copy.deepcopy(TANGENT);del p['requiredPoints'][0]
        self.assertTrue((refused(p) or '').startswith('PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS'),refused(p))
    def test_plain_float_key_points_still_work(self):
        # An author who gives the vertex as a 16-digit float instead of an exact string is accepted (1e-8) and the merged marks do not clash.
        p=copy.deepcopy(TANGENT);p['requiredPoints'][0]={'id':'V','x':-0.2320508075688772,'y':4.946152422706632}
        fit_overview(p)

class Observer(unittest.TestCase):
    def framed(self,plan):
        g=fit_overview(plan)['graphPlan'];out=produce(g);return g,out
    def test_the_observer_passes_every_plan(self):
        for plan in PLANS:
            g,out=self.framed(plan);result=audit(g,out['svg'],out['transform'])
            self.assertEqual(result['status'],'PASS',result['errors'])
    def test_the_observer_recomputes_from_the_exact_inputs(self):
        g,out=self.framed(BOUNDARY);t=out['transform']
        result=audit(g,out['svg'],t)
        self.assertEqual(result['intersections'][0]['keyPoints'],[None,'T'])
        self.assertAlmostEqual(result['intersections'][0]['x'][1],-4+7**.5,places=12)
        # A changed slope, a wrong claimed crossing, a changed coefficient and a changed frozen inventory are each found.
        bad=copy.deepcopy(g);bad['referenceLines'][0]['slope']='6-2*sqrt(6)'
        self.assertIn('PIECEWISE_POLY_INTERSECTION_CLAIM_MISMATCH:l',audit(bad,out['svg'],t)['errors'])
        bad=copy.deepcopy(g);bad['referenceLines'][0]['intersectionX'][0]='-4+sqrt(7)/2'
        self.assertIn('PIECEWISE_POLY_INTERSECTION_CLAIM_MISMATCH:l',audit(bad,out['svg'],t)['errors'])
        bad=copy.deepcopy(g);bad['pieces'][1]['coefficients'][1]='-2+sqrt(7)'
        self.assertNotEqual(audit(bad,out['svg'],t)['status'],'PASS')
        bad=copy.deepcopy(g);bad['piecewisePolynomialFeatures']['extrema'][0]['x']='-1+sqrt(7)'
        self.assertIn('PIECEWISE_POLY_EXTREMUM_INVENTORY_MISMATCH',audit(bad,out['svg'],t)['errors'])
        bad=copy.deepcopy(g);bad['piecewisePolynomialFeatures']['intersections'][0]['intercept']='1'
        self.assertIn('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:l',audit(bad,out['svg'],t)['errors'])
        # The same value written another way is the same number (the frozen inventory is compared as numbers).
        same=copy.deepcopy(g);same['piecewisePolynomialFeatures']['intersections'][0]['slope']='-2*sqrt(7)+6'
        self.assertEqual(audit(same,out['svg'],t)['status'],'PASS')
    def test_the_observer_reads_the_drawing(self):
        g,out=self.framed(TANGENT);t=out['transform']
        tilted=re.sub(r'(<line id="line-l"[^>]* y2=")([-0-9.e]+)',lambda m:m[1]+str(float(m[2])+25),out['svg'])
        self.assertIn('PIECEWISE_POLY_REFERENCE_LINE_POSITION_MISMATCH:l',audit(g,tilted,t)['errors'])
        moved=re.sub(r'(id="required-point-2" data-role="point" cx=")([-0-9.e]+)',lambda m:m[1]+str(float(m[2])+6),out['svg'])
        self.assertIn('PIECEWISE_POLY_KEY_POINT_DOT_MISSING:T',audit(g,moved,t)['errors'])
        h,hout=self.framed(CROSSING)
        moved=re.sub(r'(id="intersection-l-1" data-role="point" cx=")([-0-9.e]+)',lambda m:m[1]+str(float(m[2])+0),hout['svg'])
        self.assertEqual(audit(h,moved,hout['transform'])['status'],'PASS')
    def test_a_tangent_vertex_is_drawn_once(self):
        # The horizontal line touches at the vertex: the crossing is the key point V, no extra dot, and no repeated sample at x(V).
        g,out=self.framed(HORIZONTAL)
        self.assertEqual([k for k in re.findall(r'id="(intersection-[^"]*)"',out['svg'])],[])
        points=[tuple(map(float,p.split(','))) for p in re.search(r'<polyline[^>]*points="([^"]*)"',out['svg']).group(1).split(' ')]
        self.assertTrue(all(b[0]>a[0] for a,b in zip(points,points[1:])))

if __name__=='__main__':unittest.main()
