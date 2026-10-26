"""General trigonometric parameters: a rate or phase carrying pi, a plain x interval, tan branches, exact key points and pi ticks.
The observer is run on the produced curve SVG and, for ticks, on the composed engine SVG."""
import copy
import math
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from fractions import Fraction
from pathlib import Path

GEOMETRY=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(GEOMETRY))
sys.path.insert(0,str(GEOMETRY/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit
from visual_engine.engine import build


def interval(function='SIN',coefficients=('1','0'),rate_pi=None,phase_pi='0',phase=None,rng=('-2','2'),states=('CLOSED','CLOSED'),lines=None,key=False,axis_ticks=None,axis_tick_pi=None):
    plan={'family':'trigonometric','function':function,'coefficients':list(coefficients),'sourceDomain':{'kind':'INTERVAL','range':list(rng),'states':list(states)},
          'domain':[float(Fraction(rng[0])),float(Fraction(rng[1]))],'viewport':[-10,10,-10,10],'referenceLines':lines or []}
    if rate_pi is not None:plan['ratePi']=rate_pi
    if phase is not None:plan['phase']=phase
    else:plan['phasePi']=phase_pi
    if key:plan['keyPoints']=True
    if axis_ticks is not None:plan['axisTickValues']={'x':list(axis_ticks),'y':[]}
    else:plan['axisTickValues']={'x':[],'y':[]}
    if axis_tick_pi is not None:plan['axisTickPi']=axis_tick_pi
    return plan


def interval_pi(function='SIN',coefficients=('1','1','0'),phase_pi='0',rng=('-2','2'),states=('OPEN','OPEN'),lines=None,key=False,axis_ticks=None,axis_tick_pi=None,phase=None):
    plan={'family':'trigonometric','function':function,'coefficients':list(coefficients),'phasePi':phase_pi,'sourceDomain':{'kind':'INTERVAL_PI','rangePi':list(rng),'states':list(states)},
          'domain':[-7,7],'viewport':[-7,7,-2,2],'referenceLines':lines or [],'axisTickValues':{'x':list(axis_ticks or []),'y':[]}}
    if phase is not None:plan.pop('phasePi',None);plan['phase']=phase
    if key:plan['keyPoints']=True
    if axis_tick_pi is not None:plan['axisTickPi']=axis_tick_pi
    return plan


def period(function='SIN',coefficients=('1','0'),rate_pi='1/6',phase_pi='0'):
    return {'family':'trigonometric','function':function,'coefficients':list(coefficients),'ratePi':rate_pi,'phasePi':phase_pi,
            'sourceDomain':{'kind':'ALL_REALS' if function in {'SIN','COS'} else 'ALL_REALS_WITH_TAN_POLES'},'domain':[-6,6],'viewport':[-7,7,-4,4],'axisTickValues':{'x':[],'y':[]}}


def build_figure(value):
    plan=fit_overview(value)['graphPlan'];model=produce(plan);return plan,model,audit(plan,model['svg'],model['transform'])


def refused(value):
    try:fit_overview(value)
    except ValueError as error:return str(error)
    return None


class TrigonometricGeneral(unittest.TestCase):
    def test_pi_rate_sine_on_a_plain_month_interval_has_exact_crossings_and_key_points(self):
        plan,_,observed=build_figure(interval('SIN',('24/5','5'),rate_pi='1/6',rng=('0','12'),lines=[{'id':'k','y':'37/5','intersectionCount':2}],key=True))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        rows=plan['trigIntervalFeatures']
        self.assertEqual(rows['period'],'12')
        self.assertEqual(rows['axisUnit'],'ONE')
        xs=[round(point['x'],9) for point in rows['lines'][0]['intersections']]
        self.assertEqual(xs,[1.0,5.0])
        self.assertEqual([(row['x'],row['kind']) for row in rows['keyPoints']],[('3','MAXIMUM'),('6','MIDLINE_CROSSING'),('9','MINIMUM')])
        self.assertAlmostEqual(plan['domain'][1],12.0,places=12)

    def test_a_slanted_reference_line_is_counted_on_the_plain_interval(self):
        _,_,observed=build_figure(interval('SIN',('2','0'),rate_pi='1',rng=('-2','2'),lines=[{'id':'t','slope':'1/10','intercept':'0','intersectionCount':3}],axis_ticks=['-1','1']))
        self.assertEqual(observed['status'],'PASS',observed['errors'])

    def test_cosine_with_a_pi_rate_and_open_ends(self):
        plan,_,observed=build_figure(interval('COS',('1','0'),rate_pi='1/2',rng=('-2','2'),states=('OPEN','OPEN'),lines=[{'id':'k','y':'1/2','intersectionCount':2}],key=True))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['trigIntervalFeatures']['period'],'4')
        self.assertEqual([row['kind'] for row in plan['trigIntervalFeatures']['keyPoints']],['X_INTERCEPT','MAXIMUM','X_INTERCEPT'])

    def test_tangent_over_several_branches_has_a_dashed_pole_at_every_asymptote(self):
        plan,model,observed=build_figure(interval('TAN',('2','1'),rate_pi='1/4',rng=('0','7'),states=('OPEN','OPEN')))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual([row['x'] for row in plan['trigIntervalFeatures']['poles']],['2','6'])
        for pole in plan['trigIntervalFeatures']['poles']:
            self.assertIn('id="trig-'+pole['id']+'"',model['svg'])

    def test_one_period_with_a_pi_rate_has_an_exact_period_and_phase_points(self):
        plan,_,observed=build_figure(period('SIN',('1','0'),'1/6','0'))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['trigFeatures']['period'],'12')
        self.assertEqual(plan['overviewPolicy'],'TRIGONOMETRIC_PERIODIC_OVERVIEW_v2')
        self.assertEqual(len(plan['trigFeatures']['phasePoints']),5)

    def test_one_period_tangent_with_a_pi_rate_keeps_one_branch_between_dashed_poles(self):
        plan,model,observed=build_figure(period('TAN',('1','0'),'1/4','0'))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['trigFeatures']['period'],'4')
        self.assertEqual([row['x'] for row in plan['trigFeatures']['poles']],['-2','2'])

    def test_pi_unit_ticks_are_labelled_as_multiples_of_pi_on_the_composed_svg(self):
        plan=fit_overview(interval_pi(axis_ticks=['-1/2','1/2'],axis_tick_pi=True))['graphPlan']
        model=produce(plan);value=plan['viewport']
        rows=[(-math.pi/2,'−π/2','-1/2'),(math.pi/2,'π/2','1/2')]
        spec={'id':'trig','title':'sin x','visualType':'function_graph','viewport':{'xMin':value[0],'xMax':value[1],'yMin':value[2],'yMax':value[3]},'sourceFacts':{},'derivedFacts':{},
              'displayFacts':{'axisTickValues':{'x':[row[0] for row in rows],'y':[]},'tickPiLabels':[{'value':str(row[0]),'text':row[1],'multiple':row[2]} for row in rows],
                              'intervalFeatures':plan['intervalFeatures'],'intervalFeaturePolicy':plan['intervalFeaturePolicy'],'trigIntervalFeatures':plan['trigIntervalFeatures'],'trigIntervalPolicy':plan['trigIntervalPolicy']},
              'objects':[{'id':'f','kind':'FUNCTION_GRAPH','expression':'(1)*sin((1)*x+(0)*pi)+(0)','domain':plan['domain'],'criticalX':[]}]}
        composed=build(spec);self.assertEqual(composed['witness']['layout'].get('unresolved'),[])
        transform={key:value for key,value in composed['witness']['coordinateModel'].items() if key!='aspectPolicy'};transform['displayScale']=1
        observed=audit(plan,composed['svg'],transform)
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(sorted(re.findall(r'data-tick-pi-value="([^"]*)"',composed['svg'])),['-1/2','1/2'])
        tampered=composed['svg'].replace('data-tick-display-value="π/2"','data-tick-display-value="π/3"').replace('>π/2<','>π/3<')
        self.assertIn('TRIG_PI_TICK_LABEL_TEXT_MISMATCH:1/2',audit(plan,tampered,transform)['errors'])
        moved=composed['svg'].replace('data-tick-source-x="','data-tick-source-x="7',1)
        self.assertEqual(audit(plan,moved,transform)['status'],'FAIL')

    def test_wrong_grammar_and_units_are_refused_with_codes(self):
        self.assertEqual(refused(interval('SIN',('1','1','0'),rate_pi=None)),'TRIG_INTERVAL_REQUIRES_RATE_PI')
        bad=interval_pi();bad['ratePi']='1/2';bad['coefficients']=['1','0']
        self.assertEqual(refused(bad),'TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL')
        bad=interval('SIN',('1','0'),rate_pi='1/2',phase='1/3',key=True,rng=('-1','1'))
        self.assertEqual(refused(bad),'TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE')
        bad=interval('TAN',('1','0'),rate_pi='1/2',lines=[{'id':'k','y':'0','intersectionCount':1}])
        self.assertEqual(refused(bad),'TRIG_TAN_REFERENCE_LINES_UNSUPPORTED')
        bad=interval('SIN',('1','0'),rate_pi='1',lines=[{'id':'k','y':'1/2','intersectionCount':9}])
        self.assertEqual(refused(bad),'TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:engine finds 4 intersection(s)')
        bad=interval('TAN',('1','0'),rate_pi='1/2',rng=('0','1'))
        self.assertEqual(refused(bad),'TRIG_TAN_POLE_AT_INTERVAL_END')
        bad=interval('SIN',('1','0'),rate_pi='1/2',rng=('0','50'))
        self.assertEqual(refused(bad),'TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')
        bad=interval('SIN',('1','0'),rate_pi='1',axis_ticks=['1/2'],axis_tick_pi=True)
        self.assertEqual(refused(bad),'TRIG_TICK_PI_REQUIRES_PI_AXIS')
        bad=interval_pi(axis_ticks=['1/2'],axis_tick_pi=True);bad['sourceDomain']['rangePi']=['0','30']
        self.assertEqual(refused(bad),'TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED')

    def test_the_observer_rejects_a_tampered_plan_or_picture(self):
        plan,model,_=build_figure(interval('SIN',('24/5','5'),rate_pi='1/6',rng=('0','12'),lines=[{'id':'k','y':'37/5','intersectionCount':2}],key=True))
        bad=copy.deepcopy(plan);bad['trigIntervalFeatures']['keyPoints'][0]['x']='4'
        self.assertEqual(audit(bad,model['svg'],model['transform'])['status'],'FAIL')
        bad=copy.deepcopy(plan);bad['referenceLines'][0]['intersectionCount']=3
        self.assertIn('TRIG_LINE_INTERSECTION_COUNT_MISMATCH:k:observer finds 2 intersection(s)',audit(bad,model['svg'],model['transform'])['errors'])
        bad=copy.deepcopy(plan);bad['ratePi']='1/5'
        self.assertEqual(audit(bad,model['svg'],model['transform'])['status'],'FAIL')
        svg=re.sub(r'(id="trig-key-3"[^>]*cx=")([-0-9.]+)','\\g<1>999',model['svg'],count=1)
        self.assertIn('TRIG_KEY_POINT_MISMATCH:key-3',audit(plan,svg,model['transform'])['errors'])

    def test_the_observer_rejects_a_tan_pole_that_is_not_the_asymptote(self):
        plan,model,_=build_figure(interval('TAN',('2','1'),rate_pi='1/4',rng=('0','7'),states=('OPEN','OPEN')))
        svg=re.sub(r'(id="trig-pole-2"[^>]*x1=")([-0-9.]+)','\\g<1>999',model['svg'],count=1)
        self.assertEqual(audit(plan,svg,model['transform'])['status'],'FAIL')


if __name__=='__main__':unittest.main()
