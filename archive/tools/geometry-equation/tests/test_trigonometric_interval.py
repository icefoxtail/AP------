import copy
import math
import sys
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit


def request(lines,function='SIN',coefficients=('1','1','0'),phase='0',rng=('0','6'),states=('OPEN','OPEN')):
    return {'family':'trigonometric','function':function,'coefficients':list(coefficients),'phasePi':phase,
            'sourceDomain':{'kind':'INTERVAL_PI','rangePi':list(rng),'states':list(states)},'domain':[0,19],'viewport':[-1,20,-2,2],
            'referenceLines':lines,'axisTickValues':{'x':[],'y':[]}}

def build(value):
    plan=fit_overview(value)['graphPlan'];model=produce(plan);return plan,model,audit(plan,model['svg'],model['transform'])

def refused(value):
    try:fit_overview(value)
    except ValueError as error:return str(error)
    return None


class TrigonometricInterval(unittest.TestCase):
    def test_sine_six_pi_horizontal_line_has_six_crossings_found_by_both_sides(self):
        plan,_,observed=build(request([{'id':'k','y':'1/2','intersectionCount':6}]))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        xs=[point['x'] for point in plan['trigIntervalFeatures']['lines'][0]['intersections']]
        self.assertEqual(len(xs),6)
        for got,want in zip(xs,[math.pi/6,5*math.pi/6,13*math.pi/6,17*math.pi/6,25*math.pi/6,29*math.pi/6]):self.assertAlmostEqual(got,want,places=9)
        self.assertEqual(observed['lines'][0]['crossings'],6)
        self.assertEqual(plan['domain'],[0.0,6*math.pi])

    def test_touching_lines_count_once_and_an_empty_line_is_allowed(self):
        for y,count in (('1',3),('-1',3),('0',5),('5',0)):
            _,_,observed=build(request([{'id':'k','y':y,'intersectionCount':count}]))
            self.assertEqual(observed['status'],'PASS',(y,observed['errors']))

    def test_cosine_with_phase_and_a_slanted_line(self):
        _,_,observed=build(request([{'id':'k','y':'1/2','intersectionCount':4}],'COS',('2','1/2','1'),'1/3',('-1','7')))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        _,_,observed=build(request([{'id':'k','slope':'1/10','intercept':'0','intersectionCount':3}]))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(observed['lines'][0]['kind'],'SLANTED')

    def test_a_closed_end_is_a_filled_marker_and_an_open_end_a_hollow_one(self):
        plan,model,_=build(request([{'id':'k','y':'1/2','intersectionCount':6}]))
        self.assertIn('data-state="OPEN"',model['svg']);self.assertIn('fill="#fff"',model['svg'])
        plan,model,observed=build(request([{'id':'k','y':'1/2','intersectionCount':6}],states=('CLOSED','CLOSED')))
        self.assertEqual(observed['status'],'PASS',observed['errors']);self.assertNotIn('data-state="OPEN"',model['svg'])

    def test_wrong_claims_and_bad_shapes_are_refused_with_codes(self):
        self.assertEqual(refused(request([{'id':'k','y':'1/2','intersectionCount':5}])),'TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:engine finds 6 intersection(s)')
        self.assertEqual(refused(request([{'id':'k','y':'0','intersectionCount':7}],states=('CLOSED','CLOSED'))),'TRIG_LINE_THROUGH_INTERVAL_END:k')
        self.assertEqual(refused(request([],rng=('0','30'))),'TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
        self.assertEqual(refused(request([{'id':'k','slope':'0','intercept':'1','intersectionCount':0}])),'TRIG_LINE_SLOPE_ZERO:k')
        self.assertEqual(refused(request([{'id':'k','y':'1/2','slope':'1','intersectionCount':6}])),'TRIG_LINE_FORM_INVALID:k')
        self.assertEqual(refused(request([{'id':'k','y':'0.5','intersectionCount':6}])),'TRIG_LINE_COEFFICIENT_INVALID:k')
        tan=request([{'id':'k','y':'1/2','intersectionCount':0}],'TAN');self.assertEqual(refused(tan),'TRIG_TAN_REFERENCE_LINES_UNSUPPORTED')
        one=request([{'id':'k','y':'1/2','intersectionCount':6}]);one['sourceDomain']={'kind':'ALL_REALS'}
        self.assertEqual(refused(one),'TRIG_REFERENCE_LINES_REQUIRE_INTERVAL_PI')

    def test_the_observer_rejects_a_tampered_plan_or_picture(self):
        plan,model,_=build(request([{'id':'k','y':'1/2','intersectionCount':6}]))
        bad=copy.deepcopy(plan);bad['referenceLines'][0]['intersectionCount']=5
        self.assertIn('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:observer finds 6 intersection(s)',audit(bad,model['svg'],model['transform'])['errors'])
        bad=copy.deepcopy(plan);bad['trigIntervalFeatures']['lines'][0]['intersections'][0]['x']+=.5
        self.assertIn('TRIG_LINE_INTERSECTION_INVENTORY_MISMATCH:k',audit(bad,model['svg'],model['transform'])['errors'])
        svg=model['svg'].replace('id="intersection-k-3"','id="intersection-k-x"',1)
        self.assertEqual(audit(plan,svg,model['transform'])['status'],'FAIL')
        bad=copy.deepcopy(plan);bad['coefficients']=['2','1','0']
        self.assertEqual(audit(bad,model['svg'],model['transform'])['status'],'FAIL')


if __name__=='__main__':unittest.main()
