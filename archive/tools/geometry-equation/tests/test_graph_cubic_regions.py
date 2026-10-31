"""Cubic and quartic pieces / reference curves in the piecewise-polynomial graph family (G5): exact roots by factoring over the rationals,
local extrema of higher degree, regions between a cubic and the x-axis, a line or a quadratic, and the independent observer.
No Chrome here (model-stage SVG, like test_graph_regions.py)."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
sys.path.insert(0,str(Path(__file__).resolve().parent))
from graph_framing import fit_overview,pp_poly_roots,piecewise_polynomial_extrema
from graph_spike import produce
from graph_observer import audit
from test_graph_regions import refused,model_audit,redraw,region_path
import sympy as S

CUBIC_AXIS={'family':'piecewise-polynomial','pieces':[{'coefficients':['-2','-3','0','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},
    'requiredPoints':[{'id':'A','x':-1,'y':0},{'id':'M','x':1,'y':-4},{'id':'B','x':2,'y':0}],'axisTickValues':{'x':[],'y':[]},
    'regions':[{'id':'S1','upper':'axis','lower':'f','from':'-1','to':'2','label':'S_1'}]}
CUBIC_LINE={'family':'piecewise-polynomial','pieces':[{'coefficients':['1','0','0','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},'formula':'x^3+1',
    'functionName':'f','referenceLines':[{'id':'g','slope':'3','intercept':'-1','intersectionX':['-2','1']}],'requiredPoints':[],
    'axisTickValues':{'x':[],'y':[]},'regions':[{'id':'S','upper':'f','lower':'g','from':'-2','to':'1','label':'S'}]}
CUBIC_QUAD={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','3','0','-1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},
    'referenceCurves':[{'id':'g','name':'g','coefficients':['-3','-2','-1'],'intersectionX':['-1','3']}],
    'requiredPoints':[{'id':'T','x':-1,'y':-2},{'id':'M','x':1,'y':2}],'axisTickValues':{'x':[],'y':[]},
    'regions':[{'id':'S','upper':'f','lower':'g','from':'-1','to':'3','label':'S'}]}
QUARTIC={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','-2','0','1']}],'breakpoints':[],'sourceDomain':{'kind':'ALL_REALS'},
    'requiredPoints':[{'id':'O','x':0,'y':0},{'id':'P','x':-1,'y':-1},{'id':'Q','x':1,'y':-1}],'axisTickValues':{'x':[],'y':[]},
    'regions':[{'id':'S1','upper':'axis','lower':'f','from':'-sqrt(2)','to':'0'},{'id':'S2','upper':'axis','lower':'f','from':'0','to':'sqrt(2)','fill':'MEDIUM'}]}

class Roots(unittest.TestCase):
    def test_cubic_and_quartic_roots_are_exact(self):
        self.assertEqual([str(v) for v in pp_poly_roots([S.Integer(-2),S.Integer(-3),S.Integer(0),S.Integer(1)])],['-1','2'])
        roots=pp_poly_roots([S.Integer(0),S.Integer(0),S.Integer(-2),S.Integer(0),S.Integer(1)])
        self.assertEqual([str(v) for v in roots],['-sqrt(2)','0','sqrt(2)'])
        self.assertIsNone(pp_poly_roots([S.Integer(0)]*5))
    def test_irreducible_cubic_has_no_closed_form(self):
        with self.assertRaises(ValueError) as caught:pp_poly_roots([S.Integer(-2),S.Integer(0),S.Integer(0),S.Integer(1)])
        self.assertEqual(str(caught.exception),'PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM')
    def test_extrema_of_higher_degree(self):
        rows=piecewise_polynomial_extrema([[S.Integer(-2),S.Integer(-3),S.Integer(0),S.Integer(1)]],[(None,None)])
        self.assertEqual([(str(x),str(y),kind) for x,y,kind in rows],[('-1','0','MAX'),('1','-4','MIN')])
        # x^3+1 has a stationary inflection at 0, not an extremum; x^4 has a minimum at 0.
        self.assertEqual(piecewise_polynomial_extrema([[S.Integer(1),S.Integer(0),S.Integer(0),S.Integer(1)]],[(None,None)]),[])
        rows=piecewise_polynomial_extrema([[S.Integer(0)]*4+[S.Integer(1)]],[(None,None)])
        self.assertEqual([(str(x),kind) for x,_,kind in rows],[('0','MIN')])


class Framing(unittest.TestCase):
    def test_cubic_regions_are_frozen_with_their_exact_rows(self):
        row=fit_overview(CUBIC_AXIS)['graphPlan']['piecewisePolynomialFeatures']['regions'][0]
        self.assertEqual(row['upperRows'][0]['coefficients'],['0','0','0'])
        self.assertEqual(row['lowerRows'][0]['coefficients'],['-2','-3','0','1'])
    def test_legacy_quadratic_rows_keep_three_coefficients(self):
        row=fit_overview({**CUBIC_QUAD,'pieces':[{'coefficients':['0','0','1']}],'referenceCurves':[{'id':'g','coefficients':['2','0','-1'],'intersectionX':['-1','1']}],
            'requiredPoints':[{'id':'A','x':0,'y':0},{'id':'B','x':0,'y':2}],'regions':[{'id':'S','upper':'g','lower':'f','from':'-1','to':'1'}]})['graphPlan']['piecewisePolynomialFeatures']['regions'][0]
        self.assertEqual(row['upperRows'][0]['coefficients'],['2','0','-1'])
    def test_refusals(self):
        def plan(base,**change):
            p=copy.deepcopy(base);p.update(change);return p
        wrong_claim=copy.deepcopy(CUBIC_LINE);wrong_claim['referenceLines'][0]['intersectionX']=['-2']
        self.assertTrue((refused(wrong_claim) or '').startswith('PIECEWISE_POLY_INTERSECTION_MISMATCH:g'))
        no_extremum=plan(CUBIC_AXIS,requiredPoints=[{'id':'A','x':-1,'y':0},{'id':'B','x':2,'y':0}])
        self.assertTrue((refused(no_extremum) or '').startswith('PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS'),refused(no_extremum))
        crossing=plan(CUBIC_AXIS,regions=[{'id':'S1','upper':'axis','lower':'f','from':'-2','to':'2'}])
        self.assertTrue((refused(crossing) or '').startswith('GRAPH_REGION_BOUNDARIES_CROSS:S1'),refused(crossing))
        irrational=plan(CUBIC_AXIS,pieces=[{'coefficients':['-2','-3','0','sqrt(2)']}])
        self.assertTrue((refused(irrational) or '').startswith('PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED'),refused(irrational))
        too_long=plan(CUBIC_AXIS,pieces=[{'coefficients':['0','0','0','0','0','1']}])
        self.assertTrue((refused(too_long) or '').startswith('PIECEWISE_POLY_PIECE_INVALID'),refused(too_long))
        no_form=plan(CUBIC_AXIS,pieces=[{'coefficients':['-2','0','0','1']}],requiredPoints=[],regions=[{'id':'S1','upper':'axis','lower':'f','from':'0','to':'1'}])
        self.assertTrue((refused(no_form) or '').startswith('PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM'),refused(no_form))
        self.assertTrue((refused({'family':'polynomial','regions':[]}) or '').startswith('GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL'))


class ModelStage(unittest.TestCase):
    def test_cubic_regions_pass_the_independent_observer(self):
        for name,plan in (('axis',CUBIC_AXIS),('line',CUBIC_LINE),('quadratic',CUBIC_QUAD),('quartic',QUARTIC)):
            with self.subTest(name=name):
                graph_plan,out,result=model_audit(plan)
                self.assertEqual(result['status'],'PASS',result['errors'])
                self.assertEqual([row['id'] for row in result['regions']],[row['id'] for row in plan['regions']])
    def test_a_cubic_reference_piece_passes_with_a_cubic_function(self):
        plan=copy.deepcopy(CUBIC_QUAD);plan['pieces']=[{'coefficients':['0','-3','0','1']}]
        plan['referenceCurves']=[{'id':'g','pieces':[{'coefficients':['0','3','0','-1']}],'intersectionX':['-sqrt(3)','0','sqrt(3)']}]
        plan['requiredPoints']=[{'id':'A','x':-1,'y':2},{'id':'B','x':1,'y':-2},{'id':'C','x':1,'y':2},{'id':'D','x':-1,'y':-2}]
        plan['regions']=[]
        graph_plan,out,result=model_audit(plan)
        self.assertEqual(result['status'],'PASS',result['errors'])
    def test_tamper_moved_cubic_boundary_fails(self):
        for plan in (CUBIC_AXIS,CUBIC_LINE,CUBIC_QUAD):
            with self.subTest(plan=plan['regions'][0]['id']+plan['pieces'][0]['coefficients'][0]):
                graph_plan,out,result=model_audit(plan)
                self.assertEqual(result['status'],'PASS',result['errors'])
                rid='region-'+plan['regions'][0]['id']
                moved=redraw(out['svg'],rid,lambda d:re.sub(r'L([-\d.]+),([-\d.]+)',lambda m:'L%s,%s'%(float(m.group(1)),float(m.group(2))-3),d))
                self.assertIn('GRAPH_REGION_BOUNDARY_MISMATCH:'+plan['regions'][0]['id'],audit(graph_plan,moved,out['transform'])['errors'])
    def test_tamper_cubic_curve_polyline_fails(self):
        graph_plan,out,result=model_audit(CUBIC_AXIS)
        svg=out['svg'];tag=re.search(r'<polyline id="curve-piece-1"[^>]*/>',svg).group(0)
        pts=re.search(r'points="([^"]*)"',tag).group(1).split(' ')
        x,y=pts[len(pts)//2].split(',');pts[len(pts)//2]=x+','+str(float(y)+8)
        bad=svg.replace(tag,tag.replace(re.search(r'points="[^"]*"',tag).group(0),'points="'+' '.join(pts)+'"'))
        self.assertNotEqual(audit(graph_plan,bad,out['transform'])['status'],'PASS')
    def test_region_region_sides_follow_the_quartic_split(self):
        graph_plan,out,result=model_audit(QUARTIC)
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(len(re.findall(r'id="region-S[12]"',out['svg'])),2)


if __name__=='__main__':unittest.main()
