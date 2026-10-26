import copy
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit


def graph(radicand,source_domain=None,domain=(-2,2),viewport=(-3,3,-1,6),**kwargs):
    return {'family':'sqrt-affine','radicand':list(radicand),'sourceDomain':source_domain or {'kind':'NATURAL_SQRT_AFFINE'},'domain':list(domain),'viewport':list(viewport),**kwargs}


def fitted_model(plan):
    fitted=fit_overview(plan)['graphPlan']
    return fitted,produce(fitted)


def curve_node(svg):
    root=ET.fromstring(svg)
    return root,next(node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve')


def point_values(node):
    return [float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('points',''))]


class SqrtAffineGeneralOverview(unittest.TestCase):
    def test_left_opening_natural_domain_ends_at_the_starting_point(self):
        plan,model=fitted_model(graph(('4','-2'),domain=(-2,2),viewport=(-3,3,-1,6)))
        self.assertEqual(plan['overviewPolicy'],'SQRT_AFFINE_GENERAL_OVERVIEW_v1')
        self.assertEqual(plan['sqrtFeatures']['branchDirection'],'LEFT')
        self.assertEqual(plan['sqrtFeatures']['tailDirection'],'UP')
        self.assertEqual(plan['sqrtFeatures']['endpoint'],{'x':'2','y':'0'})
        self.assertEqual(plan['domain'][1],2.0)
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overview']['observedEndpointMarkers'],1)

    def test_reflected_shifted_right_branch_moves_the_endpoint_to_q(self):
        plan,model=fitted_model(graph(('-4','2'),amplitude='1',sign=-1,offset='3',domain=(2,10),viewport=(0,12,0,5)))
        self.assertEqual(plan['sqrtFeatures']['branchDirection'],'RIGHT')
        self.assertEqual(plan['sqrtFeatures']['tailDirection'],'DOWN')
        self.assertEqual(plan['sqrtFeatures']['rangeDirection'],'BELOW')
        self.assertEqual(plan['sqrtFeatures']['endpoint'],{'x':'2','y':'3'})
        self.assertEqual(plan['sqrtFeatures']['sourceEndpoints'][0]['y'],3.0)
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])

    def test_scaled_left_branch_and_key_point_with_exact_coordinates(self):
        plan,model=fitted_model(graph(('1','-1'),amplitude='2',offset='3',domain=(-4,1),viewport=(-5,2,2,9),requiredPoints=[{'id':'A','x':-3,'y':7}]))
        self.assertEqual(plan['sqrtFeatures']['endpoint'],{'x':'1','y':'3'})
        self.assertEqual(plan['sqrtFeatures']['rangeDirection'],'ABOVE')
        self.assertEqual([point['id'] for point in plan['requiredPoints']],['A'])
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overview']['branchDirection'],'LEFT')

    def test_closed_interval_keeps_both_closed_endpoints_and_their_values(self):
        plan,model=fitted_model(graph(('-1','1'),amplitude='2',offset='3',source_domain={'kind':'CLOSED_INTERVAL','range':['1','5']},domain=(1,5),viewport=(0,6,2,8),requiredPoints=[{'id':'A','x':5,'y':7}]))
        self.assertEqual(plan['sqrtFeaturePolicy']['sourceDomainMode'],'CLOSED_INTERVAL')
        self.assertEqual([endpoint['x'] for endpoint in plan['sqrtFeatures']['sourceEndpoints']],['1','5'])
        self.assertEqual([endpoint['y'] for endpoint in plan['sqrtFeatures']['sourceEndpoints']],[3.0,7.0])
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overview']['observedEndpointMarkers'],2)

    def test_fractional_amplitude_and_offset_are_exact(self):
        plan,model=fitted_model(graph(('-2','4'),amplitude='1/2',offset='-3/2',domain=(1/2,4),viewport=(-1,5,-3,2),requiredPoints=[{'id':'P','x':3/2,'y':-1/2}]))
        self.assertEqual(plan['sqrtFeatures']['endpoint'],{'x':'1/2','y':'-3/2'})
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])

    def test_irrational_boundary_is_represented_exactly(self):
        plan,model=fitted_model(graph(('-2*sqrt(3)','2'),domain=(-1,2),viewport=(-2,3,-1,4)))
        self.assertEqual(plan['sqrtFeatures']['endpoint'],{'x':'sqrt(3)','y':'0'})
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])

    def test_source_grammar_and_domain_errors_fail_closed(self):
        with self.assertRaisesRegex(ValueError,'SQRT_AMPLITUDE_MUST_BE_POSITIVE'):
            fit_overview(graph(('-4','2'),amplitude='0'))
        with self.assertRaisesRegex(ValueError,'INVALID_SQRT_SIGN'):
            fit_overview(graph(('-4','2'),sign=2))
        with self.assertRaisesRegex(ValueError,'REQUIRED_SQRT_POINT_NOT_ON_CURVE'):
            fit_overview(graph(('-4','2'),domain=(2,10),requiredPoints=[{'id':'A','x':5,'y':99}]))
        with self.assertRaisesRegex(ValueError,'SQRT_SOURCE_INTERVAL_BEYOND_NATURAL_BOUNDARY'):
            fit_overview(graph(('4','-2'),source_domain={'kind':'CLOSED_INTERVAL','range':['1','5']},domain=(1,5)))
        with self.assertRaisesRegex(ValueError,'SQRT_AFFINE_IRRATIONAL_FORM_UNSUPPORTED'):
            fit_overview(graph(('sqrt(2+sqrt(3))','1')))

    def test_tampered_endpoint_marker_fails(self):
        plan,model=fitted_model(graph(('-4','2'),amplitude='1',sign=-1,offset='3',domain=(2,10),viewport=(0,12,0,5)))
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='domain-endpoint');root.remove(marker)
        self.assertIn('SQRT_ENDPOINT_MARKER_COUNT_MISMATCH',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='domain-endpoint');marker.set('cx',str(float(marker.get('cx'))+20))
        self.assertIn('SQRT_ENDPOINT_MARKER_POSITION_MISMATCH',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='domain-endpoint');marker.set('fill','white')
        self.assertIn('SQRT_ENDPOINT_MARKER_MUST_BE_CLOSED_AND_OUTLINED',audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])['errors'])

    def test_tampered_curve_and_feature_inventory_fail(self):
        plan,model=fitted_model(graph(('-4','2'),amplitude='1',sign=-1,offset='3',domain=(2,10),viewport=(0,12,0,5)))
        root,node=curve_node(model['svg']);values=point_values(node)
        values=[(value if index%2==0 else 2*6.0-value) for index,value in enumerate(values)]
        node.set('points',' '.join(f'{values[i]:.9f},{values[i+1]:.9f}' for i in range(0,len(values),2)))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertTrue({'SQRT_RANGE_SIDE_MISMATCH','SQRT_ONE_SIDED_TREND_NOT_INCREASING','SQRT_SOURCE_START_ENDPOINT_NOT_OBSERVED'} & set(result['errors']))
        tampered=copy.deepcopy(plan);tampered['sqrtFeatures']['endpoint']['y']='9'
        result=audit(tampered,model['svg'],model['transform'])
        self.assertIn('SQRT_GENERAL_ENDPOINT_INVENTORY_MISMATCH',result['errors'])

    def test_display_resolution_and_span_floors_are_fail_closed(self):
        plan,model=fitted_model(graph(('-4','2'),amplitude='1',sign=-1,offset='3',domain=(2,10),viewport=(0,12,0,5)))
        result=audit(plan,model['svg'],{**model['transform'],'displayScale':0.1})
        self.assertEqual(result['overview']['status'],'UNSUPPORTED')
        self.assertIn('SQRT_ENDPOINT_TO_TAIL_SPAN_BELOW_PROFILE_FLOOR',result['overview']['errors'])


if __name__=='__main__':unittest.main()
