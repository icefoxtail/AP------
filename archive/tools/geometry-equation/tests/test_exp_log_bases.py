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


def exp_request(**kwargs):
    request={'family':'exponential-affine','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],'viewport':[-3,3,-2,12]}
    request.update(kwargs)
    return request


def log_request(**kwargs):
    request={'family':'logarithmic-affine','coefficients':['2','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'},'domain':[.1,4],'viewport':[-1,5,-5,5]}
    request.update(kwargs)
    return request


def pair_request(curves=None,**kwargs):
    request={'family':'exp-log-pair','curves':curves or [
        {'id':'f','family':'logarithmic-affine','base':'3','coefficients':['2','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'}},
        {'id':'g','family':'exponential-affine','base':'sqrt(3)','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'}}],'identityLine':True}
    request.update(kwargs)
    return request


def build(request):
    plan=fit_overview(request)['graphPlan'];model=produce(plan);observed=audit(plan,model['svg'],model['transform'])
    return plan,model,observed


class ExpLogBaseOverview(unittest.TestCase):
    def test_exponential_base_shift_reference_and_asymptote(self):
        plan,model,observed=build(exp_request(base='2',shiftX='1',coefficients=['1','1','3']))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['exponentialFeatures']['referencePoint'],{'x':'1','y':'4'})
        self.assertEqual(plan['exponentialFeatures']['horizontalAsymptote'],{'y':'3','side':'LEFT','approachedFrom':'ABOVE'})
        self.assertEqual(plan['exponentialFeatures']['monotonicity'],'INCREASING')
        self.assertEqual(plan['exponentialFeatures']['base'],'2')

    def test_exponential_fraction_and_radical_bases_flip_growth_side(self):
        plan,model,observed=build(exp_request(base='1/2'))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['exponentialFeatures']['monotonicity'],'DECREASING')
        self.assertEqual(plan['exponentialFeatures']['growthSide'],'LEFT')
        self.assertEqual(plan['exponentialFeatures']['horizontalAsymptote']['side'],'RIGHT')
        radical,_,radical_audit=build(exp_request(base='sqrt(3)'))
        self.assertEqual(radical_audit['status'],'PASS',radical_audit['errors'])
        self.assertEqual(radical['exponentialFeatures']['baseKind'],'RADICAL')

    def test_logarithm_base_boundary_reference_and_direction(self):
        plan,model,observed=build(log_request(base='3',coefficients=['2','1','0','0']))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertEqual(plan['logarithmicFeatures']['naturalDomainBoundaryX'],'0')
        self.assertEqual(plan['logarithmicFeatures']['referencePoint'],{'x':'1','y':'0','argument':'1'})
        self.assertEqual(plan['logarithmicFeatures']['monotonicity'],'INCREASING')
        reverse,_,reverse_audit=build(log_request(base='1/2'))
        self.assertEqual(reverse_audit['status'],'PASS',reverse_audit['errors'])
        self.assertEqual(reverse['logarithmicFeatures']['monotonicity'],'DECREASING')

    def test_rejects_symbolic_out_of_range_and_nested_bases(self):
        for base in ['a','0','1','-2','2.5','sqrt(2+sqrt(3))','sqrt(4)','sqrt(8)']:
            with self.assertRaises(ValueError):
                fit_overview(exp_request(base=base))
        with self.assertRaisesRegex(ValueError,'EXPONENTIAL_BASE_GRAMMAR_REQUIRED'):
            fit_overview(exp_request(base='a'))
        for base in ['0','1','-2']:
            with self.assertRaisesRegex(ValueError,'EXPONENTIAL_BASE_OUT_OF_RANGE'):
                fit_overview(exp_request(base=base))
        with self.assertRaisesRegex(ValueError,'EXPONENTIAL_BASE_RADICAL_NOT_SQUARE_FREE'):
            fit_overview(exp_request(base='sqrt(4)'))
        with self.assertRaisesRegex(ValueError,'LOGARITHMIC_BASE_GRAMMAR_REQUIRED'):
            fit_overview(log_request(base='log2'))

    def test_observer_rejects_curve_asymptote_marker_and_feature_mutations(self):
        plan,model,_=build(exp_request(base='2',shiftX='1',coefficients=['1','1','3']))
        root=ET.fromstring(model['svg'])
        curve=next(node for node in root.iter() if node.get('data-role')=='curve')
        values=[float(value) for value in curve.get('points').replace(',',' ').split()];values[1]+=3
        curve.set('points',' '.join(f'{values[i]},{values[i+1]}' for i in range(0,len(values),2)))
        wrong_curve=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('EXPONENTIAL_WRONG_CURVE',wrong_curve['errors'])
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('data-role')=='exponential-asymptote');line.set('y1',str(float(line.get('y1'))-9));line.set('y2',str(float(line.get('y2'))-9))
        self.assertIn('GRAPH_HORIZONTAL_ASYMPTOTE_POSITION_MISMATCH',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='exponential-reference');marker.set('cx',str(float(marker.get('cx'))+8))
        self.assertIn('GRAPH_REFERENCE_MARKER_POSITION_MISMATCH',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        tampered=copy.deepcopy(plan);tampered['exponentialFeatures']['monotonicity']='DECREASING'
        self.assertIn('EXPONENTIAL_FEATURE_INVENTORY_MISMATCH',audit(tampered,model['svg'],model['transform'])['errors'])

    def test_observer_rejects_log_boundary_curve_and_feature_mutations(self):
        plan,model,_=build(log_request(base='3'))
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('data-role')=='logarithmic-domain-boundary');line.set('x1',str(float(line.get('x1'))+9));line.set('x2',str(float(line.get('x2'))+9))
        self.assertIn('GRAPH_VERTICAL_DOMAIN_CUE_POSITION_MISMATCH',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        root=ET.fromstring(model['svg']);curve=next(node for node in root.iter() if node.get('data-role')=='curve')
        values=[float(value) for value in curve.get('points').replace(',',' ').split()];values[1]+=2
        curve.set('points',' '.join(f'{values[i]},{values[i+1]}' for i in range(0,len(values),2)))
        self.assertIn('LOGARITHMIC_WRONG_CURVE',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        tampered=copy.deepcopy(plan);tampered['logarithmicFeatures']['referencePoint']['y']='1'
        self.assertIn('LOGARITHMIC_FEATURE_INVENTORY_MISMATCH',audit(tampered,model['svg'],model['transform'])['errors'])


class ExpLogPairOverview(unittest.TestCase):
    def test_inverse_pair_with_identity_line_passes(self):
        plan,model,observed=build(pair_request())
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        self.assertTrue(plan['expLogPairFeatures']['identityLine'])
        self.assertEqual([row['id'] for row in plan['expLogPairFeatures']['curves']],['f','g'])
        self.assertEqual(plan['expLogPairFeatures']['curves'][0]['base'],'3')
        self.assertEqual(plan['expLogPairFeatures']['curves'][1]['base'],'sqrt(3)')
        self.assertTrue(any(node.get('id')=='identity-line' for node in ET.fromstring(model['svg']).iter()))

    def test_pair_observer_rejects_curve_identity_line_asymptote_marker_and_feature_mutations(self):
        plan,model,_=build(pair_request())
        root=ET.fromstring(model['svg']);curve=next(node for node in root.iter() if node.get('data-role')=='curve' and node.get('data-branch')=='REF_g')
        values=[float(value) for value in curve.get('points').replace(',',' ').split()];values[1]-=2
        curve.set('points',' '.join(f'{values[i]},{values[i+1]}' for i in range(0,len(values),2)))
        self.assertIn('EXP_LOG_PAIR_WRONG_CURVE:g',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('id')=='identity-line');line.set('y1',str(float(line.get('y1'))+6))
        self.assertIn('EXP_LOG_PAIR_IDENTITY_LINE_POSITION_MISMATCH',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        root=ET.fromstring(model['svg']);line=next(node for node in root.iter() if node.get('id')=='asymptote-g');line.set('y1',str(float(line.get('y1'))-5));line.set('y2',str(float(line.get('y2'))-5))
        self.assertTrue(any('HORIZONTAL_ASYMPTOTE' in code for code in audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors']))
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('id')=='reference-f');marker.set('cy',str(float(marker.get('cy'))+7))
        self.assertTrue(any('REFERENCE_MARKER_POSITION_MISMATCH' in code for code in audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors']))
        tampered=copy.deepcopy(plan);tampered['expLogPairFeatures']['curves'][0]['monotonicity']='DECREASING'
        self.assertIn('EXP_LOG_PAIR_FEATURE_INVENTORY_MISMATCH:f',audit(tampered,model['svg'],model['transform'])['errors'])

    def test_pair_refuses_bad_shapes_and_unshared_windows(self):
        with self.assertRaisesRegex(ValueError,'EXP_LOG_PAIR_PLAN_INVALID'):
            fit_overview(pair_request(curves=[{'id':'f','family':'logarithmic-affine','base':'3','coefficients':['2','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'}}]))
        with self.assertRaisesRegex(ValueError,'EXP_LOG_PAIR_PLAN_INVALID'):
            fit_overview(pair_request(curves=[
                {'id':'f','family':'logarithmic-affine','coefficients':['2','1','0','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'}},
                {'id':'g','family':'exponential-affine','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'}}],identityLine='yes'))
        # A log whose boundary is far to the right of the exponential's display window has no common window.
        with self.assertRaisesRegex(ValueError,'EXP_LOG_PAIR_NO_SHARED_WINDOW'):
            fit_overview(pair_request(curves=[
                {'id':'f','family':'logarithmic-affine','base':'3','coefficients':['2','1','-80','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'}},
                {'id':'g','family':'exponential-affine','base':'2','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'}}]))

    def test_pair_normalizes_natural_base_and_shift(self):
        plan,model,observed=build(pair_request(curves=[
            {'id':'f','family':'logarithmic-affine','coefficients':['1','1','-1','0'],'sourceDomain':{'kind':'NATURAL_LOG_AFFINE'}},
            {'id':'g','family':'exponential-affine','base':'2','shiftX':'-1','coefficients':['1','1','0'],'sourceDomain':{'kind':'ALL_REALS'}}],identityLine=False))
        self.assertEqual(observed['status'],'PASS',observed['errors'])
        rows=plan['expLogPairFeatures']['curves']
        self.assertEqual(rows[0]['base'],'e')
        self.assertEqual(rows[0]['referencePoint'],{'x':'2','y':'0','argument':'1'})
        self.assertEqual(rows[1]['referencePoint'],{'x':'-1','y':'1'})
        self.assertFalse(any(node.get('id')=='identity-line' for node in ET.fromstring(model['svg']).iter()))


if __name__=='__main__':unittest.main()
