"""piecewise-polynomial-spike-v1: exact framing claims (fail closed), the model and the independent observer."""
import copy
import re
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

# Reference: k=|x^2+x-6|+2x as three pieces, the line y=5 and its four surd crossings (20 Suncheon 1mid H1 q22).
Q22={'family':'piecewise-polynomial','pieces':[{'coefficients':['-6','3','1']},{'coefficients':['6','1','-1']},{'coefficients':['-6','3','1']}],
     'breakpoints':[{'x':'-3','y':'-6'},{'x':'2','y':'4'}],'sourceDomain':{'kind':'ALL_REALS'},'formula':'abs(x^2+x-6)+2x',
     'referenceLines':[{'id':'k','y':'5','intersectionX':['(-3-sqrt(53))/2','(1-sqrt(5))/2','(1+sqrt(5))/2','(-3+sqrt(53))/2']}],
     'requiredPoints':[{'id':'A','x':-3,'y':-6},{'id':'B','x':0.5,'y':6.25},{'id':'C','x':2,'y':4}],'exactCoordinates':{'B':['1/2','25/4']},'axisTickValues':{'x':[],'y':[]}}
# |x^2-4x| with y=4 (touching the top of the middle arch: three crossings) and y=2 (four crossings).
ABS_QUAD={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','-4','1']},{'coefficients':['0','4','-1']},{'coefficients':['0','-4','1']}],
     'breakpoints':[{'x':'0','y':'0'},{'x':'4','y':'0'}],'sourceDomain':{'kind':'ALL_REALS'},'formula':'abs(x^2-4x)',
     'referenceLines':[{'id':'a','y':'4','intersectionX':['2-2*sqrt(2)','2','2+2*sqrt(2)']},{'id':'b','y':'2','intersectionX':['2-sqrt(6)','2-sqrt(2)','2+sqrt(2)','2+sqrt(6)']}],
     'requiredPoints':[{'id':'O','x':0,'y':0},{'id':'M','x':2,'y':4},{'id':'P','x':4,'y':0}],'axisTickValues':{'x':[],'y':[]}}
# Given by pieces only, on an interval: x^2 on [-2,1], -x+2 on [1,3) and the line y=1/2 with labelled crossings (no formula, no header).
INTERVAL={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']},{'coefficients':['2','-1']}],'breakpoints':[{'x':'1','y':'1'}],
     'sourceDomain':{'kind':'INTERVAL','range':['-2','3'],'states':['CLOSED','OPEN']},
     'referenceLines':[{'id':'h','y':'1/2','intersectionX':['-sqrt(2)/2','sqrt(2)/2','3/2']},{'id':'m','y':'-1/2','intersectionX':['5/2'],'labelIntersections':True}],
     'requiredPoints':[{'id':'O','x':0,'y':0},{'id':'C','x':1,'y':1}],'axisTickValues':{'x':[],'y':[]}}

# Slanted line: h(x)=f/g/f with f=-(x+1)^2, g=x^2-5 (26 Hyocheon q26) and y=-5/2*x-6, which meets the curve at the corner (-2,-1) and at x=-1/2, 5/2.
SLANT={'family':'piecewise-polynomial','pieces':[{'coefficients':['-1','-2','-1']},{'coefficients':['-5','0','1']},{'coefficients':['-1','-2','-1']}],
     'breakpoints':[{'x':'-2','y':'-1'},{'x':'1','y':'-4'}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceLines':[{'id':'m','slope':'-5/2','intercept':'-6','intersectionX':['-2','-1/2','5/2']}],
     'requiredPoints':[{'id':'A','x':-2,'y':-1},{'id':'B','x':1,'y':-4},{'id':'C','x':0,'y':-5},{'id':'D','x':-0.5,'y':-4.75},{'id':'E','x':2.5,'y':-12.25}],
     'exactCoordinates':{'D':['-1/2','-19/4'],'E':['5/2','-49/4']},'axisTickValues':{'x':[],'y':[]}}
# x^2-2|x|+1 with y=x+7/8: four surd crossings (25 Maesan H1 final q15).
WSHAPE={'family':'piecewise-polynomial','pieces':[{'coefficients':['1','2','1']},{'coefficients':['1','-2','1']}],'breakpoints':[{'x':'0','y':'1'}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceLines':[{'id':'k','slope':'1','intercept':'7/8','intersectionX':['(-1-sqrt(2)/2)/2','(-1+sqrt(2)/2)/2','(3-sqrt(34)/2)/2','(3+sqrt(34)/2)/2']}],
     'requiredPoints':[{'id':'A','x':0,'y':1},{'id':'B','x':-1,'y':0},{'id':'C','x':1,'y':0}],'axisTickValues':{'x':[],'y':[]}}

def refused(plan):
    try:fit_overview(plan)
    except ValueError as error:return str(error)
    return None

class Framing(unittest.TestCase):
    def test_reference_case_inventory(self):
        g=fit_overview(Q22)['graphPlan'];f=g['piecewisePolynomialFeatures']
        self.assertEqual(f['corners'],[{'x':'-3','y':'-6'},{'x':'2','y':'4'}])
        self.assertEqual(f['extrema'],[{'x':'1/2','y':'25/4','kind':'MAX'}])
        self.assertEqual([round(p['xValue'],9) for p in f['intersections'][0]['points']],[-5.140054945,-0.618033989,1.618033989,2.140054945])
        self.assertEqual([p['drawInterval'][1] for p in f['pieces']][:2],[-3.0,2.0])
        self.assertTrue(g['equalUnits']);self.assertEqual(g['axisRatio'],1.0);self.assertEqual(g['plotCanvas']['width'],448)
        # The outer arms run past the outermost crossings.
        self.assertLess(g['domain'][0],-5.15);self.assertGreater(g['domain'][1],2.15)
    def test_claims_fail_closed(self):
        cases=[]
        p=copy.deepcopy(Q22);p['referenceLines'][0]['intersectionX']=p['referenceLines'][0]['intersectionX'][:3];cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:k'))
        p=copy.deepcopy(Q22);p['referenceLines'][0]['intersectionX'][0]='(-3-sqrt(52))/2';cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:k'))
        p=copy.deepcopy(Q22);p['breakpoints'][1]['y']='5';cases.append((p,'PIECEWISE_POLY_BREAKPOINT_VALUE_MISMATCH:2'))
        p=copy.deepcopy(Q22);p['pieces'][2]['coefficients']=['-5','3','1'];cases.append((p,'PIECEWISE_POLY_DISCONTINUOUS:2'))
        p=copy.deepcopy(Q22);p['requiredPoints']=p['requiredPoints'][:2];cases.append((p,'PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:2'))
        p=copy.deepcopy(Q22);del p['requiredPoints'][1];del p['exactCoordinates'];cases.append((p,'PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:1/2'))
        p=copy.deepcopy(Q22);p['formula']='abs(x^2+x-6)+3x';cases.append((p,'PIECEWISE_POLY_FORMULA_MISMATCH'))
        p=copy.deepcopy(Q22);p['lines']=[];cases.append((p,'PIECEWISE_POLY_FIELD_UNKNOWN:lines'))
        p=copy.deepcopy(Q22);p['pieces'][0]['coefficients']=['0','0','0','1'];cases.append((p,'PIECEWISE_POLY_PIECE_INVALID'))
        p=copy.deepcopy(Q22);p['requiredPoints'][1]['y']=6.3;cases.append((p,'PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE:B'))
        # y=-1 meets -x+2 only at the open end x=3, which is not on the graph.
        p=copy.deepcopy(INTERVAL);p['referenceLines'][0]['y']='-1';p['referenceLines'][0]['intersectionX']=['3'];cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:h:engine finds 0'))
        for plan,code in cases:
            with self.subTest(code=code):
                self.assertTrue((refused(plan) or '').startswith(code),refused(plan))
    def test_touching_line_counts_once_and_interval_open_end(self):
        f=fit_overview(ABS_QUAD)['graphPlan']['piecewisePolynomialFeatures']
        self.assertEqual([len(row['points']) for row in f['intersections']],[3,4])
        g=fit_overview(INTERVAL)['graphPlan']
        self.assertEqual(g['domain'],[-2.0,3.0])
        self.assertEqual(g['intervalFeatures']['endpoints'][1],{'side':'END','x':'3','y':'-1','state':'OPEN'})
        self.assertEqual(g['piecewisePolynomialFeatures']['extrema'],[{'x':'0','y':'0','kind':'MIN'}])

class SlantedLine(unittest.TestCase):
    def test_inventory_has_exact_heights_and_key_point(self):
        g=fit_overview(SLANT)['graphPlan'];row=g['piecewisePolynomialFeatures']['intersections'][0]
        self.assertEqual((row['lineId'],row['slope'],row['intercept']),('m','-5/2','-6'));self.assertNotIn('y',row)
        self.assertEqual([round(p['xValue'],9) for p in row['points']],[-2.0,-0.5,2.5])
        self.assertEqual([round(p['yValue'],9) for p in row['points']],[-1.0,-4.75,-12.25])
        self.assertEqual([p.get('keyPoint') for p in row['points']],['A','D','E'])
    def test_surd_crossings_and_a_wrong_claim(self):
        row=fit_overview(WSHAPE)['graphPlan']['piecewisePolynomialFeatures']['intersections'][0]
        self.assertEqual(len(row['points']),4)
        self.assertEqual([round(p['xValue'],9) for p in row['points']],[-0.853553391,-0.146446609,0.042262026,2.957737974])
        # A slanted line that touches nothing: the claim "no crossing" differs from the engine's count.
        w=copy.deepcopy(WSHAPE);w['referenceLines'][0]['intersectionX']=w['referenceLines'][0]['intersectionX'][:3]
        self.assertTrue((refused(w) or '').startswith('PIECEWISE_POLY_INTERSECTION_MISMATCH:k:engine finds 4'))
    def test_claims_fail_closed(self):
        cases=[]
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['intersectionX']=['-2','5/2'];cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:m:engine finds 3'))
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['slope']='-2';cases.append((p,'PIECEWISE_POLY_INTERSECTION_MISMATCH:m'))
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['slope']='0';cases.append((p,'PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO'))
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['slope']='x+1';cases.append((p,'PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID'))
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['intercept']='-1.5';cases.append((p,'PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID'))
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['labelIntersections']=True;cases.append((p,'PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED'))
        p=copy.deepcopy(SLANT);p['referenceLines'][0]['y']='3';cases.append((p,'PIECEWISE_POLY_REFERENCE_LINE_INVALID'))
        p=copy.deepcopy(SLANT);del p['referenceLines'][0]['intercept'];cases.append((p,'PIECEWISE_POLY_REFERENCE_LINE_INVALID'))
        # y=-x+2 is the whole right piece of INTERVAL.
        p=copy.deepcopy(INTERVAL);p['referenceLines']=[{'id':'w','slope':'-1','intercept':'2','intersectionX':[]}];cases.append((p,'PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE'))
        for plan,code in cases:
            with self.subTest(code=code):
                self.assertTrue((refused(plan) or '').startswith(code),refused(plan))

class Observer(unittest.TestCase):
    def framed(self,plan):
        g=fit_overview(plan)['graphPlan'];out=produce(g);return g,out
    def test_model_passes_for_three_items(self):
        for plan in (Q22,ABS_QUAD,INTERVAL):
            g,out=self.framed(plan);result=audit(g,out['svg'],out['transform'])
            self.assertEqual(result['status'],'PASS',result['errors'])
    def test_slanted_model_passes_and_observer_recomputes_it(self):
        for plan in (SLANT,WSHAPE):
            g,out=self.framed(plan);result=audit(g,out['svg'],out['transform'])
            self.assertEqual(result['status'],'PASS',result['errors'])
        g,out=self.framed(SLANT);result=audit(g,out['svg'],out['transform'])
        self.assertEqual(result['intersections'],[{'lineId':'m','slope':-2.5,'intercept':-6.0,'x':[-2.0,-0.5,2.5],'keyPoints':['A','D','E']}])
        # The observer takes the line and the claimed crossings from the plan again: a changed slope is found without trusting the frozen inventory.
        bad=copy.deepcopy(g);bad['referenceLines'][0]['slope']='-2'
        self.assertIn('PIECEWISE_POLY_INTERSECTION_CLAIM_MISMATCH:m',audit(bad,out['svg'],out['transform'])['errors'])
        bad=copy.deepcopy(g);bad['piecewisePolynomialFeatures']['intersections'][0]['points'][1]['yValue']=-4.0
        self.assertIn('PIECEWISE_POLY_INTERSECTION_INVENTORY_MISMATCH:m',audit(bad,out['svg'],out['transform'])['errors'])
        bad=copy.deepcopy(g);bad['referenceLines'][0]['slope']='0'
        self.assertEqual(audit(bad,out['svg'],out['transform'])['status'],'UNSUPPORTED')
    def test_slanted_line_drawing_is_read_back(self):
        g,out=self.framed(SLANT);t=out['transform']
        # The drawn line is tilted at one end: it no longer lies on y=-5/2x-6.
        tilted=re.sub(r'(<line id="line-m"[^>]* y2=")([-0-9.e]+)',lambda m:m[1]+str(float(m[2])+25),out['svg'])
        self.assertIn('PIECEWISE_POLY_REFERENCE_LINE_POSITION_MISMATCH:m',audit(g,tilted,t)['errors'])
        gone=re.sub(r'<line id="line-m"[^>]*/>','',out['svg'])
        self.assertIn('PIECEWISE_POLY_REFERENCE_LINE_MISSING:m',audit(g,gone,t)['errors'])
        # Every crossing of SLANT is a marked key point (no separate dot); WSHAPE has four plain crossing dots.
        w,wout=self.framed(WSHAPE)
        moved=re.sub(r'(id="intersection-k-3" data-role="point" cx=")([-0-9.e]+)',lambda m:m[1]+str(float(m[2])-6),wout['svg'])
        self.assertIn('PIECEWISE_POLY_INTERSECTION_DOT_MISSING:k-3',audit(w,moved,wout['transform'])['errors'])
    def test_observer_recomputes_independently(self):
        g,out=self.framed(Q22)
        bad=copy.deepcopy(g);bad['referenceLines'][0]['intersectionX'][1]='(1-sqrt(6))/2'
        self.assertIn('PIECEWISE_POLY_INTERSECTION_CLAIM_MISMATCH:k',audit(bad,out['svg'],out['transform'])['errors'])
        bad=copy.deepcopy(g);bad['piecewisePolynomialFeatures']['extrema']=[]
        self.assertIn('PIECEWISE_POLY_EXTREMUM_INVENTORY_MISMATCH',audit(bad,out['svg'],out['transform'])['errors'])
        bad=copy.deepcopy(g);bad['formula']='abs(x^2+x-6)+2'
        self.assertIn('PIECEWISE_POLY_FORMULA_MISMATCH',audit(bad,out['svg'],out['transform'])['errors'])
    def test_observer_reads_the_drawing(self):
        g,out=self.framed(Q22);t=out['transform']
        moved=re.sub(r'(id="intersection-k-2" data-role="point" cx=")([-0-9.e]+)',lambda m:m[1]+str(float(m[2])+2),out['svg'])
        self.assertIn('PIECEWISE_POLY_INTERSECTION_DOT_MISSING:k-2',audit(g,moved,t)['errors'])
        dropped=re.sub(r'<polyline id="curve-piece-3"[^>]*/>','',out['svg'])
        self.assertIn('PIECEWISE_POLY_PIECE_PRIMITIVE_INVENTORY_MISMATCH',audit(g,dropped,t)['errors'])
        swapped=out['svg'].replace('data-branch="PIECE_2"','data-branch="TMP"').replace('data-branch="PIECE_3"','data-branch="PIECE_2"').replace('data-branch="TMP"','data-branch="PIECE_3"')
        self.assertTrue(any(e.startswith('PIECEWISE_POLY_PIECE_COVERAGE_FAIL') for e in audit(g,swapped,t)['errors']))
        squeezed={**t,'sy':t['sy']*.9}
        self.assertIn('EQUAL_UNIT_SCALE_MISMATCH',audit(g,out['svg'],squeezed)['errors'])

# Two piecewise functions in one figure (26 Geumdang H1 mid c q17 at a=2): f is -x^2 then x^2-x, g is 2x+2, 0, 2x-2.
TWO_PIECEWISE={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','-1']},{'coefficients':['0','-1','1']}],'breakpoints':[{'x':'0','y':'0'}],
     'sourceDomain':{'kind':'ALL_REALS'},'functionName':'f',
     'referenceCurves':[{'id':'g','name':'g','pieces':[{'coefficients':['2','2']},{'coefficients':['0']},{'coefficients':['-2','2']}],
       'breakpoints':[{'x':'-1','y':'0'},{'x':'1','y':'0'}],'intersectionX':['0','1','2']}],
     'requiredPoints':[{'id':'A','x':0,'y':0},{'id':'B','x':0.5,'y':-0.25},{'id':'C','x':-1,'y':0},{'id':'D','x':1,'y':0}],
     'exactCoordinates':{'B':['1/2','-1/4']},'axisTickValues':{'x':[2],'y':[2]}}
# g exists only on [2,3]: the algebraic crossings x=0,1 of x^2=x are outside its domain and are not intersections.
OUTSIDE_DOMAIN={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceCurves':[{'id':'g','name':'g','pieces':[{'coefficients':['0','1']}],'sourceDomain':{'kind':'INTERVAL','range':[2,3],'states':['CLOSED','CLOSED']},'intersectionX':[]}],
     'requiredPoints':[{'id':'V','x':0,'y':0}],'axisTickValues':{'x':[],'y':[]}}
OPEN_END={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']}],'sourceDomain':{'kind':'ALL_REALS'},
     'referenceCurves':[{'id':'g','name':'g','pieces':[{'coefficients':['1']}],'sourceDomain':{'kind':'INTERVAL','range':[1,2],'states':['OPEN','CLOSED']},'intersectionX':[]}],
     'requiredPoints':[{'id':'V','x':0,'y':0}],'axisTickValues':{'x':[],'y':[]}}
FOUR_PIECES={'family':'piecewise-polynomial','pieces':[{'coefficients':['0','0','1']},{'coefficients':['1']},{'coefficients':['1']},{'coefficients':['0','0','1']}],
     'breakpoints':[{'x':'-1','y':'1'},{'x':'0','y':'1'},{'x':'1','y':'1'}],'sourceDomain':{'kind':'ALL_REALS'},
     'requiredPoints':[{'id':'A','x':-1,'y':1},{'id':'B','x':0,'y':1},{'id':'C','x':1,'y':1}],'axisTickValues':{'x':[],'y':[]}}

class TwoPiecewise(unittest.TestCase):
    def test_two_piecewise_inventory_and_model(self):
        g=fit_overview(TWO_PIECEWISE)['graphPlan'];f=g['piecewisePolynomialFeatures']
        self.assertEqual([point['x'] for point in f['curveIntersections'][0]['points']],['0','1','2'])
        self.assertEqual([point.get('keyPoint') for point in f['curveIntersections'][0]['points']],['A','D',None])
        self.assertEqual(f['referenceCurves'][0]['pieces'][0]['interval'],[None,'-1'])
        out=produce(g);result=audit(g,out['svg'],out['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
    def test_four_pieces_are_supported(self):
        g=fit_overview(FOUR_PIECES)['graphPlan'];self.assertEqual(len(g['piecewisePolynomialFeatures']['pieces']),4)
        out=produce(g);self.assertEqual(audit(g,out['svg'],out['transform'])['status'],'PASS')
    def test_no_fake_intersections_outside_a_piece_domain(self):
        g=fit_overview(OUTSIDE_DOMAIN)['graphPlan'];self.assertEqual(g['piecewisePolynomialFeatures']['curveIntersections'][0]['points'],[])
        out=produce(g);self.assertEqual(audit(g,out['svg'],out['transform'])['status'],'PASS')
        bad=copy.deepcopy(OUTSIDE_DOMAIN);bad['referenceCurves'][0]['intersectionX']=['0','1']
        self.assertTrue((refused(bad) or '').startswith('PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds 0'))
        o=fit_overview(OPEN_END)['graphPlan'];self.assertEqual(o['piecewisePolynomialFeatures']['curveIntersections'][0]['points'],[])
        bad=copy.deepcopy(OPEN_END);bad['referenceCurves'][0]['intersectionX']=['1']
        self.assertTrue((refused(bad) or '').startswith('PIECEWISE_POLY_INTERSECTION_MISMATCH:g:engine finds 0'))
    def test_reference_claims_fail_closed(self):
        cases=[]
        p=copy.deepcopy(TWO_PIECEWISE);p['requiredPoints']=[point for point in p['requiredPoints'] if point['id']!='C'];cases.append((p,'PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS:g:-1'))
        p=copy.deepcopy(TWO_PIECEWISE);p['referenceCurves'][0]['breakpoints'][0]['y']='1';cases.append((p,'PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_VALUE_MISMATCH:g:-1'))
        p=copy.deepcopy(TWO_PIECEWISE);p['referenceCurves'][0]['pieces'][1]['coefficients']=['1'];p['referenceCurves'][0]['breakpoints'][0]['y']='1';cases.append((p,'PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS:g:-1'))
        p=copy.deepcopy(TWO_PIECEWISE);p['referenceCurves'][0]['pieces'].extend([{'coefficients':['0']},{'coefficients':['0']}]);p['referenceCurves'][0]['breakpoints'].extend([{'x':'2','y':'2'},{'x':'3','y':'0'}]);cases.append((p,'PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID:g'))
        p=copy.deepcopy(TWO_PIECEWISE);p['referenceCurves'][0]['formula']='x^2';cases.append((p,'PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH:g'))
        for plan,code in cases:
            with self.subTest(code=code):self.assertTrue((refused(plan) or '').startswith(code),refused(plan))
    def test_observer_reads_reference_domains(self):
        g,out=self._model(OPEN_END)
        result=audit(g,out['svg'],out['transform']);self.assertEqual(result['status'],'PASS',result['errors'])
        stretched=copy.deepcopy(g);stretched['piecewisePolynomialFeatures']['referenceCurves'][0]['pieces'][0]['drawInterval']=[0.5,3.5]
        out2=produce(stretched)
        self.assertTrue(any(error.startswith(('PIECEWISE_POLY_REFERENCE_PIECE_CROSSES_ITS_INTERVAL','PIECEWISE_POLY_REFERENCE_CURVE_COVERAGE_FAIL')) for error in audit(stretched,out2['svg'],out2['transform'])['errors']))
        dropped=re.sub(r'<circle id="ref-endpoint-g-start"[^>]*/>','',out['svg'])
        self.assertIn('PIECEWISE_POLY_REFERENCE_ENDPOINT_MARKER_MISMATCH:g-start',audit(g,dropped,out['transform'])['errors'])
    @staticmethod
    def _model(plan):
        g=fit_overview(plan)['graphPlan'];return g,produce(g)

if __name__=='__main__':unittest.main()
