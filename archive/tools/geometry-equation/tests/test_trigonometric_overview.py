import copy
import math
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit


def request(function='SIN',coefficients=('1','1','0'),phase='0',source_domain=None):
    return {'family':'trigonometric','function':function,'coefficients':list(coefficients),'phasePi':phase,
            'sourceDomain':source_domain or ({'kind':'ALL_REALS_WITH_TAN_POLES'} if function=='TAN' else {'kind':'ALL_REALS'}),
            'domain':[-4,4],'viewport':[-5,5,-5,5]}

def build(value):
    plan=fit_overview(value)['graphPlan'];model=produce(plan);observed=audit(plan,model['svg'],model['transform'])
    return plan,model,observed


class TrigonometricOverview(unittest.TestCase):
    def test_sine_one_period_binds_amplitude_phase_midline_roots_and_extrema(self):
        plan,model,observed=build(request('SIN',('2','1','0'),'1/2'))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['trigFeatures']['cycleCenterPi'],'-1/2')
        self.assertEqual(plan['trigFeatures']['periodPiMultiple'],'2')
        self.assertEqual(len(plan['trigFeatures']['phasePoints']),5)
        self.assertEqual([row['kind'] for row in plan['trigFeatures']['phasePoints']],['X_INTERCEPT','EXTREMUM','X_INTERCEPT','EXTREMUM','X_INTERCEPT'])
        self.assertEqual(observed['featureDetail']['phasePointCount'],5)
        self.assertEqual(model['sampling']['status'],'PASS')

    def test_cosine_negative_rate_uses_exact_phase_and_extrema(self):
        plan,_,observed=build(request('COS',('-1','-2','3'),'1/4'))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['trigFeatures']['function'],'COS')
        self.assertEqual(plan['trigFeatures']['cycleCenterPi'],'1/8')
        extrema=[row for row in plan['trigFeatures']['phasePoints'] if row['kind']=='EXTREMUM']
        self.assertEqual([row['extreme'] for row in extrema],['MAXIMUM','MINIMUM','MAXIMUM'])

    def test_tangent_has_one_complete_branch_between_exact_adjacent_poles(self):
        plan,_,observed=build(request('TAN',('1','1','0'),'0'))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual([row['xPiMultiple'] for row in plan['trigFeatures']['poles']],['-1/2','1/2'])
        self.assertGreater(observed['featureDetail']['boundaryApproachGapCssPx'],2)
        self.assertEqual(observed['featureDetail']['poleXs'],[-math.pi/2,math.pi/2])

    def test_rejects_restricted_domain_zero_rate_and_bad_function(self):
        with self.assertRaisesRegex(ValueError,'TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED'):
            fit_overview(request('SIN',source_domain={'kind':'CLOSED_INTERVAL','range':['-3','3']}))
        with self.assertRaisesRegex(ValueError,'TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED'):
            fit_overview(request('COS',('1','0','0')))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_TRIGONOMETRIC_FUNCTION'):
            fit_overview(request('SEC'))

    def test_observer_rejects_phase_inventory_missing_marker_and_tan_pole_crossing(self):
        plan,model,_=build(request('SIN'))
        mutated=copy.deepcopy(plan);mutated['trigFeatures']['phasePi']='1/2'
        self.assertIn('TRIG_FEATURE_INVENTORY_MISMATCH',audit(mutated,model['svg'],model['transform'])['errors'])
        tree=ET.fromstring(model['svg']);tree.remove(next(node for node in tree.iter() if node.get('id')=='trig-phase-0'))
        result=audit(plan,ET.tostring(tree,encoding='unicode'),model['transform'])
        self.assertIn('TRIG_FEATURE_MARKER_COUNT_MISMATCH',result['errors'])
        tan_plan,tan_model,_=build(request('TAN'))
        tree=ET.fromstring(tan_model['svg']);tree.remove(next(node for node in tree.iter() if node.get('data-pole-side')=='RIGHT'))
        result=audit(tan_plan,ET.tostring(tree,encoding='unicode'),tan_model['transform'])
        self.assertIn('TRIG_POLE_CUE_MISSING_OR_DUPLICATED:RIGHT',result['errors'])
        tree=ET.fromstring(tan_model['svg']);curve=next(node for node in tree.iter() if node.get('data-role')=='curve');values=[float(v) for v in curve.get('points').replace(',',' ').split()]
        right_pole=tan_model['transform']['originX']+tan_model['transform']['sx']*math.pi/2
        values[-2:]=[right_pole+1,tan_model['transform']['originY']]
        curve.set('points',' '.join(f'{values[i]},{values[i+1]}' for i in range(0,len(values),2)))
        result=audit(tan_plan,ET.tostring(tree,encoding='unicode'),tan_model['transform'])
        self.assertIn('TRIG_TAN_BRANCH_OUTSIDE_ADJACENT_POLES',result['errors'])

    def test_small_actual_size_fails_closed(self):
        plan,model,_=build(request('SIN'))
        transform=dict(model['transform']);transform['displayScale']=.05
        result=audit(plan,model['svg'],transform)
        self.assertEqual(result['status'],'UNSUPPORTED')
        self.assertTrue(any('PROFILE_FLOOR' in error for error in result['errors']))
