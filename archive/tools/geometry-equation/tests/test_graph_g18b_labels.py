"""G18b-6: multi-curve label placement. The layout puts a curve's formula beside its own curve and an asymptote's value at the end of its own dashed line; the independent observer
refuses a label that stands nearer another curve or detached from its dashed line (LABEL_NEAREST_CURVE_MISMATCH, ASYMPTOTE_LABEL_DETACHED). No Chrome: the candidate centres and the
observer are checked on a small hand-made figure."""
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_observer import multi_curve_label_audit
from graph_framing import fit_overview
from visual_engine.label_layout import Box,near_box_polyline_distance,near_candidate_centers

PLAN={'family':'multi-curve','curves':[{'id':'f'},{'id':'g'}],'multiCurveFeatures':{'curves':[{'id':'f','kind':'LINE'},{'id':'g','kind':'RATIONAL'}]}}
CURVE_F='0,100 100,100 200,100 300,100'     # a flat curve at y=100
CURVE_G='0,200 100,200 200,200 300,200'     # a flat curve at y=200

def figure(label_f_y,label_g_y,asymptote_label_y=82):
    def label(ident,x,y):return f'<g id="{ident}" data-label-kind="EQUATION_LABEL" transform="translate({x} {y})"><svg width="60" height="20"></svg></g>'
    return ('<svg xmlns="http://www.w3.org/2000/svg">'
            f'<polyline id="f-f-branch-0" data-role="curve" data-branch="CURVE_f" points="{CURVE_F}"/>'
            f'<polyline id="f-g-branch-0" data-role="curve" data-branch="CURVE_g" points="{CURVE_G}"/>'
            '<line id="asymptote-f-h" data-role="asymptote" data-branch="ASYM_f_H" x1="0" y1="60" x2="300" y2="60"/>'
            f'{label("curve-f-equation",120,label_f_y)}{label("curve-g-equation",120,label_g_y)}{label("curve-f-asymptote-y",240,asymptote_label_y)}</svg>')

class Observer(unittest.TestCase):
    def test_labels_beside_their_own_curves_pass(self):
        result=multi_curve_label_audit(PLAN,figure(70,170,40),{})
        self.assertEqual(result['errors'],[])

    def test_label_by_the_other_curve_is_refused(self):
        # f's label stands right under g's curve
        result=multi_curve_label_audit(PLAN,figure(175,170),{})
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation',result['errors'])

    def test_label_far_from_its_curve_is_refused(self):
        result=multi_curve_label_audit(PLAN,figure(10,170),{})
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation',result['errors'])

    def test_asymptote_value_detached_from_its_line_is_refused(self):
        result=multi_curve_label_audit(PLAN,figure(70,170,asymptote_label_y=20),{})
        self.assertIn('ASYMPTOTE_LABEL_DETACHED:curve-f-asymptote-y',result['errors'])
        self.assertEqual(multi_curve_label_audit(PLAN,figure(70,170,asymptote_label_y=62),{})['errors'].count('ASYMPTOTE_LABEL_DETACHED:curve-f-asymptote-y'),0)

    def test_a_label_the_engine_marked_no_room_is_judged_by_ownership_and_a_wider_reach(self):
        far=figure(35,170,40)   # f's label 45 px above its curve: beyond the usual reach, still its own curve is the nearest
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation',multi_curve_label_audit(PLAN,far,{})['errors'])
        marked=far.replace('<g id="curve-f-equation" ','<g id="curve-f-equation" data-near-room="NONE" ')
        self.assertEqual(multi_curve_label_audit(PLAN,marked,{})['errors'],[])
        wrong=figure(175,170,40).replace('<g id="curve-f-equation" ','<g id="curve-f-equation" data-near-room="NONE" ')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation',multi_curve_label_audit(PLAN,wrong,{})['errors'])

    def test_mixed_vertical_and_sideways_quadratic_arcs_keep_the_existing_layout(self):
        plan={**PLAN,'multiCurveFeatures':{'curves':[{'id':'f','kind':'Y_OF_X'},{'id':'g','kind':'X_OF_Y'}]}}
        self.assertEqual(multi_curve_label_audit(plan,figure(175,170,40),{})['errors'],[])

    def test_opposite_vertical_parabola_labels_must_stay_with_their_own_curves(self):
        plan={**PLAN,'curves':[{'id':'f','label':'y=-x^2'},{'id':'f_ref','label':'y=x^2'}],
              'multiCurveFeatures':{'curves':[{'id':'f','kind':'Y_OF_X'},{'id':'f_ref','kind':'Y_OF_X'}]}}
        def parabolas(lower_label_y,upper_label_y):
            def box(ident,y):
                return f'<g id="curve-{ident}-equation" data-label-kind="EQUATION_LABEL" transform="translate(292 {y})"><svg width="60" height="20"/></g>'
            return ('<svg data-publication-profile="fragment-publication-spike-v1">'
                    '<polyline data-role="curve" data-branch="CURVE_f" points="40,200 100,120 160,100 220,120 280,200"/>'
                    '<polyline data-role="curve" data-branch="CURVE_f_ref" points="40,0 100,80 160,100 220,80 280,0"/>'
                    +box('f',lower_label_y)+box('f_ref',upper_label_y)+'</svg>')
        self.assertEqual(multi_curve_label_audit(plan,parabolas(177,3),{})['errors'],[])
        self.assertEqual(multi_curve_label_audit(plan,parabolas(3,177),{})['errors'],
                         ['LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation','LABEL_NEAREST_CURVE_MISMATCH:curve-f_ref-equation'])
        detached=parabolas(245,3).replace('<g id="curve-f-equation" ','<g id="curve-f-equation" data-near-room="NONE" ')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation',multi_curve_label_audit(plan,detached,{})['errors'])
        missing=parabolas(177,3).replace('id="curve-f-equation"','id="unbound"')
        self.assertIn('LABEL_NEAREST_CURVE_MISMATCH:curve-f-equation',multi_curve_label_audit(plan,missing,{})['errors'])

    def test_other_families_are_not_read(self):
        self.assertIsNone(multi_curve_label_audit({'family':'rational'},figure(70,170),{}))

class Candidates(unittest.TestCase):
    def test_curve_label_candidates_hug_the_own_curve_and_keep_clear_of_the_other(self):
        own=[(0.0,100.0),(150.0,100.0),(300.0,100.0)];other=[(0.0,130.0),(150.0,130.0),(300.0,130.0)]
        label={'nearCurve':{'own':[own],'others':[other],'end':False}}
        w,h=60.0,20.0
        centres=near_candidate_centers(label,w,h)
        self.assertTrue(centres)
        x,y=centres[0];box=Box(x-w/2,y-h/2,w,h)
        self.assertLess(near_box_polyline_distance(box,own),near_box_polyline_distance(box,other))
        self.assertLessEqual(near_box_polyline_distance(box,own),20.0)
        self.assertLess(y,100.0)   # the side away from the other curve first

    def test_asymptote_label_candidates_sit_at_the_end_of_the_line(self):
        own=[(0.0,60.0),(300.0,60.0)]
        label={'nearLine':{'own':own,'others':[],'end':'END'}}
        centres=near_candidate_centers(label,50.0,18.0)
        x,y=centres[0];self.assertGreater(x,250.0);self.assertLessEqual(abs(y-60.0),18.0+9.0+4.0)

class DeclaredPoints(unittest.TestCase):
    def test_a_declared_point_outside_the_viewport_widens_the_multi_curve_frame(self):
        # 25 팔마고 고1 q23 style: the window cuts the curves, the line meets them outside it
        plan={'family':'multi-curve','viewport':[-1,9,-4,2],'axisTickValues':{'x':[],'y':[]},'curves':[
            {'id':'f','kind':'LINE','coefficients':['0','1'],'domain':['0','6']},
            {'id':'g','kind':'LINE','coefficients':['2','-1'],'domain':['0','6']}],
            'overlays':{'points':[{'id':'P','x':'12','y':'12','unnamed':True}]}}
        # the declared point (12,12) lies outside the first viewport: the frame widens to hold it
        framed=fit_overview(plan)['graphPlan'];x0,x1,y0,y1=framed['viewport']
        self.assertTrue(x0<12<x1 and y0<12<y1)

if __name__=='__main__':unittest.main()
