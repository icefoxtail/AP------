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
    def test_display_window_does_not_turn_the_crop_into_a_source_interval(self):
        raw={'family':'trigonometric','function':'COS','coefficients':['-2','2','1'],'phasePi':'0',
             'sourceDomain':{'kind':'ALL_REALS'},'displayWindowPi':['-1/4','19/12'],'axisTickPi':True,
             'axisTickValues':{'x':['1/2','1','3/2'],'y':['-1','3']},
             'displayGuides':{'x':['1/2','1','3/2'],'y':['-1','3']},'showOriginLabel':True}
        framed=fit_overview(raw)
        self.assertTrue(framed['sourceDomainPreserved'])
        plan=framed['graphPlan']
        self.assertEqual(plan['sourceDomain'],{'kind':'ALL_REALS'})
        self.assertEqual(plan['domain'],[-math.pi/4,19/12*math.pi])
        self.assertNotIn('intervalFeatures',plan)
        model=produce(plan)
        observed=audit(plan,model['svg'],model['transform'],model=True)
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        xml=model['svg'].replace('</svg>','<circle data-role="interval-endpoint"/></svg>')
        self.assertIn('TRIG_DISPLAY_EXTRA_MARKUP',audit(plan,xml,model['transform'],model=True)['errors'])
        changed={**plan,'domain':[-math.pi/2,plan['domain'][1]]}
        self.assertIn('TRIG_DISPLAY_WINDOW_MISMATCH',audit(changed,model['svg'],model['transform'],model=True)['errors'])
        for changes,code in [
            ({'sourceDomain':{'kind':'INTERVAL_PI','rangePi':['-1/4','19/12']}},'TRIG_DISPLAY_WINDOW_REQUIRES_ALL_REAL_SINE_COSINE'),
            ({'axisTickPiStep':'1/2'},'TRIG_DISPLAY_WINDOW_FIELD_UNSUPPORTED'),
            ({'axisTickValues':{'x':['1/2','1','2'],'y':[]}},'TRIG_PI_TICK_OUTSIDE_VIEW'),
            ({'displayGuides':{'x':['1/2'],'y':['2']}},'TRIG_DISPLAY_GUIDE_NOT_AT_EXTREMUM'),
        ]:
            with self.assertRaisesRegex(ValueError,code):fit_overview({**raw,**changes})

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

    def test_open_tan_poles_render_two_separate_branches_without_endpoint_dots(self):
        plan,model,observed=build_figure({
            **interval_pi('TAN',('3','1','0'),phase_pi='-1/2',rng=('0','2')),
            'displaySize':'full',
        })
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        poles=plan['trigIntervalFeatures']['poles']
        self.assertEqual([(row['x'],row.get('boundary')) for row in poles],[('0','START'),('1',None),('2','END')])
        self.assertEqual(plan['intervalFeatures']['endpoints'],[])
        self.assertEqual(model['sampling']['domainCuts'],[0,math.pi,2*math.pi])
        self.assertEqual(model['sampling']['branchCount'],2)
        for (left,right),branch in zip(((0,math.pi),(math.pi,2*math.pi)),model['sampling']['branches']):
            self.assertTrue(left<branch[0][0]<branch[-1][0]<right)
            self.assertAlmostEqual(branch[0][1],plan['viewport'][2])
            self.assertAlmostEqual(branch[-1][1],plan['viewport'][3])
        svg=model['svg'];transform=model['transform']
        self.assertNotIn('data-role="interval-endpoint"',svg)
        self.assertIn('TRIG_TAN_BOUNDARY_MARKER_PRESENT:start',audit(
            plan,svg.replace('</svg>','<circle id="interval-endpoint-start" cx="0" cy="0" fill="#fff"/></svg>'),transform)['errors'])
        missing_pole=svg.replace('id="trig-pole-3"','id="missing-pole"')
        self.assertIn('TRIG_POLE_CUE_INVENTORY_MISMATCH',audit(plan,missing_pole,transform)['errors'])
        shortened=re.sub(r'(id="curve-0"[^>]*points=")(?:[^ ]+ ){20}',r'\g<1>',svg,count=1)
        self.assertIn('TRIG_TAN_BOUNDARY_APPROACH_FAIL:start',audit(plan,shortened,transform)['errors'])
        bridged=re.sub(r'" fill="none" stroke="black"/><polyline id="curve-1" data-role="curve" points="',' ',svg,count=1)
        self.assertIn('TRIG_TAN_BRANCH_COVERAGE_FAIL',audit(plan,bridged,transform)['errors'])
        closed=copy.deepcopy(plan);closed['sourceDomain']['states'][1]='CLOSED'
        self.assertIn('TRIG_TAN_POLE_AT_INTERVAL_END',audit(closed,svg,transform)['errors'])

    def test_a_finite_tan_endpoint_keeps_its_marker_beside_an_open_pole(self):
        plan,model,observed=build_figure({
            **interval('TAN',('2','1'),rate_pi='1/2',rng=('0','3'),states=('CLOSED','OPEN')),
            'displaySize':'full',
        })
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual([(row['x'],row.get('boundary')) for row in plan['trigIntervalFeatures']['poles']],[('1',None),('3','END')])
        self.assertEqual([row['side'] for row in plan['intervalFeatures']['endpoints']],['START'])
        self.assertIn('id="interval-endpoint-start"',model['svg'])
        self.assertNotIn('id="interval-endpoint-end"',model['svg'])

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
