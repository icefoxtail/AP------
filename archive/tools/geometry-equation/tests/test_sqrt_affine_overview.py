import copy
import math
import re
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit


def graph(radicand=('-200','2'),source_domain=None,domain=(100,120),viewport=(0,130,-1,10),**kwargs):
    return {'family':'sqrt-affine','radicand':list(radicand),'sourceDomain':source_domain or {'kind':'NATURAL_SQRT_AFFINE'},'domain':list(domain),'viewport':list(viewport),**kwargs}


def fitted_model(plan):
    fitted=fit_overview(plan)['graphPlan']
    return fitted,produce(fitted)


def curve_node(svg):
    root=ET.fromstring(svg)
    return root,next(node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve')


class SqrtAffineOverview(unittest.TestCase):
    def test_positive_boundary_is_framed_near_root_with_closed_endpoint_and_readable_tail(self):
        plan,model=fitted_model(graph())
        self.assertEqual(plan['domain'][0],100.0)
        self.assertEqual(plan['sqrtFeatures']['radicandBoundaryX'],'100')
        self.assertLess(plan['viewport'][0],100)
        self.assertGreater(plan['viewport'][0],90)
        self.assertGreater(plan['viewport'][0],0)  # do not zoom out to show the y-axis
        self.assertGreater(plan['viewport'][1]-100,20)
        self.assertEqual(plan['sqrtFeaturePolicy']['minimumEndpointToTailSpanCssPx'],48)
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertGreaterEqual(result['overview']['endpointToTailSpanCss'],48)
        self.assertEqual(result['overview']['observedEndpointMarkers'],1)

    def test_exact_closed_source_interval_preserves_fractional_endpoint_without_expansion(self):
        source={'kind':'CLOSED_INTERVAL','range':['1','10/3']}
        plan,model=fitted_model(graph(radicand=('-2','6'),source_domain=source,domain=(1.0,10/3),viewport=(-2,5,-1,8)))
        self.assertEqual(plan['domain'],[1.0,10/3])
        self.assertEqual([point['x'] for point in plan['sqrtFeatures']['sourceEndpoints']],['1','10/3'])
        self.assertEqual([point['source'] for point in plan['sqrtFeatures']['sourceEndpoints']],['SOURCE_INTERVAL_START','SOURCE_INTERVAL_END'])
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overview']['observedEndpointMarkers'],2)

    def test_source_grammar_domain_and_expansion_fail_closed(self):
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_SQRT_AFFINE_GRAMMAR'):
            fit_overview(graph(radicand=('-1','2','3')))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_SQRT_AFFINE_SLOPE'):
            fit_overview(graph(radicand=('1','-2')))
        with self.assertRaisesRegex(ValueError,'SQRT_SOURCE_DOMAIN_UNSUPPORTED'):
            fit_overview(graph(source_domain={'kind':'OPEN_INTERVAL','range':['100','120']}))
        with self.assertRaisesRegex(ValueError,'SQRT_SOURCE_INTERVAL_BELOW_NATURAL_BOUNDARY'):
            fit_overview(graph(radicand=('-200','2'),source_domain={'kind':'CLOSED_INTERVAL','range':['99','120']},domain=(99,120)))
        with self.assertRaisesRegex(ValueError,'SQRT_DRAW_INTERVAL_MUST_PRESERVE_SOURCE_INTERVAL'):
            fit_overview(graph(radicand=('-2','6'),source_domain={'kind':'CLOSED_INTERVAL','range':['1','10/3']},domain=(1.1,10/3)))

    def test_missing_moved_or_open_endpoint_marker_fails(self):
        plan,model=fitted_model(graph())
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='domain-endpoint');root.remove(marker)
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('SQRT_ENDPOINT_MARKER_COUNT_MISMATCH',result['overview']['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='domain-endpoint');marker.set('cx',str(float(marker.get('cx'))+20))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('SQRT_ENDPOINT_MARKER_POSITION_MISMATCH',result['overview']['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='domain-endpoint');marker.set('fill','white')
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('SQRT_ENDPOINT_MARKER_MUST_BE_CLOSED_AND_OUTLINED',result['overview']['errors'])

    def test_pre_root_wrong_curve_and_clipped_tail_fail(self):
        plan,model=fitted_model(graph())
        root,node=curve_node(model['svg']);values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('points',''))]
        values[0]-=2;node.set('points',' '.join(f'{values[i]:.9f},{values[i+1]:.9f}' for i in range(0,len(values),2)))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertTrue({'SQRT_CURVE_BEFORE_SOURCE_DOMAIN','NONREAL_CURVE','SQRT_SOURCE_START_ENDPOINT_NOT_OBSERVED'} & set(result['errors']))
        root,node=curve_node(model['svg']);values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('points',''))]
        node.set('points',' '.join(f'{values[i]:.9f},{values[i+1]:.9f}' for i in range(0,len(values)-12,2)))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertTrue({'SQRT_SOURCE_END_ENDPOINT_NOT_OBSERVED','VISIBLE_COVERAGE_GAP','SQRT_RIGHT_TAIL_NOT_INCREASING'} & set(result['errors']))
        root,node=curve_node(model['svg']);values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',node.get('points',''))]
        values=[(value if index%2==0 else 2*model['transform']['originY']-value) for index,value in enumerate(values)]
        node.set('points',' '.join(f'{values[i]:.9f},{values[i+1]:.9f}' for i in range(0,len(values),2)))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertTrue(result['errors'])

    def test_actual_css_profile_span_and_marker_floors_are_fail_closed(self):
        plan,model=fitted_model(graph())
        result=audit(plan,model['svg'],{**model['transform'],'displayScale':0.1})
        self.assertEqual(result['overview']['status'],'UNSUPPORTED')
        self.assertIn('SQRT_ENDPOINT_TO_TAIL_SPAN_BELOW_PROFILE_FLOOR',result['overview']['errors'])
        self.assertIn('SQRT_ENDPOINT_MARKER_BELOW_DISPLAY_RESOLUTION',result['overview']['errors'])

if __name__=='__main__':unittest.main()
