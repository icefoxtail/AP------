import copy
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit


def exp_request(coefficients=('1','1','0'),source_domain=None):
    return {'family':'exponential-affine','coefficients':list(coefficients),'sourceDomain':source_domain or {'kind':'ALL_REALS'},'domain':[-2,2],'viewport':[-3,3,-2,12]}

def log_request(coefficients=('1','1','0','0'),source_domain=None,axis_tick_values=None):
    return {'family':'logarithmic-affine','coefficients':list(coefficients),'sourceDomain':source_domain or {'kind':'NATURAL_LOG_AFFINE'},'domain':[.1,4],'viewport':[-1,5,-5,5],**({'axisTickValues':axis_tick_values} if axis_tick_values is not None else {})}

def build(request):
    plan=fit_overview(request)['graphPlan'];model=produce(plan);observed=audit(plan,model['svg'],model['transform'])
    return plan,model,observed


class ExponentialLogarithmicOverview(unittest.TestCase):
    def test_exponential_reference_asymptote_and_monotonicity_are_recomputed(self):
        plan,model,observed=build(exp_request())
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['exponentialFeatures']['referencePoint'],{'x':'0','y':'1'})
        self.assertEqual(plan['exponentialFeatures']['horizontalAsymptote'],{'y':'0','side':'LEFT','approachedFrom':'ABOVE'})
        self.assertEqual(observed['monotonicity'],'INCREASING')
        self.assertEqual(observed['curvePoints'],model['sampling']['sampleCount'])
        reverse,_,reverse_audit=build(exp_request(coefficients=('-2','-1','3')))
        self.assertEqual(reverse_audit['status'],'PASS',reverse_audit['errors'])
        self.assertEqual(reverse['exponentialFeatures']['monotonicity'],'INCREASING')
        self.assertEqual(reverse['exponentialFeatures']['horizontalAsymptote']['side'],'RIGHT')
        self.assertEqual(reverse['exponentialFeatures']['horizontalAsymptote']['approachedFrom'],'BELOW')

    def test_logarithm_natural_boundary_reference_and_both_boundary_sides(self):
        ticks={'x':['1','2','3','4'],'y':['-2','-1','1']}
        plan,model,observed=build(log_request(axis_tick_values=ticks))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['logarithmicFeatures']['naturalDomainBoundaryX'],'0')
        self.assertEqual(plan['logarithmicFeatures']['referencePoint'],{'x':'1','y':'0','argument':'1'})
        self.assertEqual(plan['axisTickValues'],ticks)
        self.assertGreater(plan['viewport'][0],-.6)
        self.assertLess(plan['viewport'][0],-.4)
        self.assertEqual(plan['domain'][0],.125)
        self.assertEqual(observed['monotonicity'],'INCREASING')
        self.assertGreater(observed['boundaryApproachGapCssPx'],2)
        reverse,_,reverse_audit=build(log_request(coefficients=('-1','-1','0','2')))
        self.assertEqual(reverse_audit['status'],'PASS',reverse_audit['errors'])
        self.assertEqual(reverse['logarithmicFeatures']['boundarySide'],'LEFT')
        self.assertEqual(reverse['logarithmicFeatures']['boundaryLimitDirection'],'UP')
        self.assertEqual(reverse['logarithmicFeatures']['monotonicity'],'INCREASING')

    def test_rejects_wrong_source_domain_zero_scale_rate_and_wrong_log_side(self):
        with self.assertRaisesRegex(ValueError,'EXPONENTIAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS'):
            fit_overview(exp_request(source_domain={'kind':'CLOSED_INTERVAL','range':['-2','2']}))
        with self.assertRaisesRegex(ValueError,'EXPONENTIAL_NONZERO_SCALE_AND_RATE_REQUIRED'):
            fit_overview(exp_request(coefficients=('1','0','0')))
        with self.assertRaisesRegex(ValueError,'LOGARITHMIC_SOURCE_DOMAIN_REQUIRES_NATURAL_AFFINE'):
            fit_overview(log_request(source_domain={'kind':'ALL_REALS'}))
        with self.assertRaisesRegex(ValueError,'LOGARITHMIC_NONZERO_SCALE_AND_RATE_REQUIRED'):
            fit_overview(log_request(coefficients=('1','0','0','0')))
        plan,model,_=build(log_request())
        tampered=copy.deepcopy(plan);tampered['domain']=[-1.0,4.0]
        result=audit(tampered,model['svg'],model['transform'])
        self.assertNotEqual(result['status'],'PASS')
        self.assertTrue(any('DOMAIN' in code for code in result['errors']))

    def test_observer_rejects_curve_asymptote_marker_and_feature_mutations(self):
        plan,model,_=build(exp_request())
        root=ET.fromstring(model['svg'])
        line=next(node for node in root.iter() if node.get('data-role')=='exponential-asymptote')
        line.set('y1',str(float(line.get('y1'))-8));line.set('y2',str(float(line.get('y2'))-8))
        wrong_asymptote=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('GRAPH_HORIZONTAL_ASYMPTOTE_POSITION_MISMATCH',wrong_asymptote['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='exponential-reference');marker.set('cx',str(float(marker.get('cx'))+10))
        wrong_marker=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('GRAPH_REFERENCE_MARKER_POSITION_MISMATCH',wrong_marker['errors'])
        tampered=copy.deepcopy(plan);tampered['exponentialFeatures']['monotonicity']='DECREASING'
        self.assertIn('EXPONENTIAL_FEATURE_INVENTORY_MISMATCH',audit(tampered,model['svg'],model['transform'])['errors'])

        log_plan,log_model,_=build(log_request())
        root=ET.fromstring(log_model['svg']);line=next(node for node in root.iter() if node.get('data-role')=='logarithmic-domain-boundary');line.set('x1',str(float(line.get('x1'))+8));line.set('x2',str(float(line.get('x2'))+8))
        wrong_boundary=audit(log_plan,ET.tostring(root,encoding='unicode'),log_model['transform'])
        self.assertIn('GRAPH_VERTICAL_DOMAIN_CUE_POSITION_MISMATCH',wrong_boundary['errors'])
        root=ET.fromstring(log_model['svg']);curve=next(node for node in root.iter() if node.get('data-role')=='curve');points=[float(v) for v in curve.get('points').replace(',',' ').split()];points[1]+=1
        curve.set('points',' '.join(f'{points[i]},{points[i+1]}' for i in range(0,len(points),2)))
        wrong_curve=audit(log_plan,ET.tostring(root,encoding='unicode'),log_model['transform'])
        self.assertIn('LOGARITHMIC_WRONG_CURVE',wrong_curve['errors'])

    def test_actual_profile_can_fail_closed_for_subresolution_markers(self):
        plan,model,_=build(exp_request())
        transform=dict(model['transform']);transform['displayScale']=.05
        result=audit(plan,model['svg'],transform)
        self.assertEqual(result['status'],'UNSUPPORTED')
        self.assertTrue(any('PROFILE_FLOOR' in code for code in result['errors']))
