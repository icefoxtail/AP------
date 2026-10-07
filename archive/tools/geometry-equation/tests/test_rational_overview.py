import copy
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit

def graph(numerator=('1','1'),denominator=('-1','1'),**kwargs):
    return {'family':'rational','numerator':list(numerator),'denominator':list(denominator),'domain':[-4,4],'viewport':[-4,4,-4,4],'sourceDomain':{'kind':'ALL_REALS'},**kwargs}

def framed_model(plan):
    fitted=fit_overview(plan)['graphPlan']
    return fitted,produce(fitted)

def model_points(model,path):
    values=[float(value) for value in __import__('re').findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',path.get('points',''))]
    t=model['transform']
    return [((values[i]-t['originX'])/t['sx'],(t['originY']-values[i+1])/t['sy']) for i in range(0,len(values),2)]

def screen_point(model,point):
    t=model['transform'];return (t['originX']+point[0]*t['sx'],t['originY']-point[1]*t['sy'])

class RationalOverview(unittest.TestCase):
    def test_exact_linear_over_linear_pole_and_horizontal_asymptote(self):
        plan,model=framed_model(graph())
        features=plan['rationalFeatures']
        self.assertEqual(features['singularity'],{'kind':'VERTICAL_POLE','x':'1'})
        self.assertEqual(features['horizontalAsymptoteY'],'1')
        self.assertEqual(features['xIntercept'],'-1')
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overview']['branchSideCounts'][0]>0,True)
        self.assertEqual(result['overview']['branchSideCounts'][1]>0,True)

    def test_exact_cancellation_is_a_marked_open_hole_not_a_pole(self):
        plan,model=framed_model(graph(numerator=('-1','1')))
        features=plan['rationalFeatures']
        self.assertEqual(features['singularity'],{'kind':'REMOVABLE_HOLE','x':'1','y':'1'})
        self.assertIsNone(features['xIntercept'])
        result=audit(plan,model['svg'],model['transform'])
        self.assertEqual(result['status'],'PASS',result['errors'])
        root=ET.fromstring(model['svg'])
        marker=next(node for node in root.iter() if node.get('data-role')=='hole')
        self.assertEqual(marker.get('fill'),'white')
        self.assertEqual(float(marker.get('r')),plan['rationalFeaturePolicy']['holeMarkerRadiusIntrinsicPx'])
        small=audit(plan,model['svg'],{**model['transform'],'displayScale':.453125})
        self.assertEqual(small['status'],'UNSUPPORTED')
        self.assertIn('RATIONAL_HOLE_MARKER_BELOW_DISPLAY_RESOLUTION',small['errors'])

    def test_restricted_domains_and_non_linear_or_multiple_root_grammar_fail_closed(self):
        with self.assertRaisesRegex(ValueError,'RATIONAL_SOURCE_DOMAIN_REQUIRES_ALL_REALS'):
            fit_overview(graph(sourceDomain={'kind':'INTERVAL','range':[-2,2]}))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_RATIONAL_NUMERATOR_GRAMMAR'):
            fit_overview(graph(numerator=('1','0','1')))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_RATIONAL_DENOMINATOR_GRAMMAR'):
            fit_overview(graph(denominator=('1','0','1')))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_RATIONAL_DENOMINATOR_DEGREE'):
            fit_overview(graph(denominator=('1','0')))

    def test_pole_and_root_feature_below_css_resolution_is_unsupported(self):
        plan,model=framed_model(graph(numerator=('-1000001/1000000','1')))
        result=audit(plan,model['svg'],{**model['transform'],'displayScale':.328125})
        self.assertEqual(result['overview']['status'],'UNSUPPORTED')
        self.assertIn('RATIONAL_ROOT_FEATURE_BELOW_DISPLAY_RESOLUTION',result['overview']['errors'])

    def test_missing_or_moved_asymptote_and_hole_cues_fail(self):
        plan,model=framed_model(graph())
        root=ET.fromstring(model['svg'])
        vertical=next(node for node in root.iter() if node.get('id')=='rational-asymptote-vertical')
        root.remove(vertical)
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_VERTICAL_ASYMPTOTE_MISSING_OR_WRONG',result['overview']['errors'])
        root=ET.fromstring(model['svg'])
        horizontal=next(node for node in root.iter() if node.get('id')=='rational-asymptote-horizontal')
        horizontal.set('y1',str(float(horizontal.get('y1'))+8));horizontal.set('y2',str(float(horizontal.get('y2'))+8))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_ASYMPTOTE_GEOMETRY_MISMATCH',result['overview']['errors'])
        hole_plan,hole_model=framed_model(graph(numerator=('-1','1')))
        root=ET.fromstring(hole_model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='hole');root.remove(marker)
        result=audit(hole_plan,ET.tostring(root,encoding='unicode'),hole_model['transform'])
        self.assertIn('REMOVABLE_HOLE_MARKER_MISSING_OR_WRONG',result['overview']['errors'])
        root=ET.fromstring(hole_model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='hole');marker.set('stroke','none')
        result=audit(hole_plan,ET.tostring(root,encoding='unicode'),hole_model['transform'])
        self.assertIn('RATIONAL_HOLE_MARKER_OUTLINE_INVALID',result['overview']['errors'])

    def test_crossing_pole_and_wrong_branch_are_rejected(self):
        plan,model=framed_model(graph());pole=1.0
        root=ET.fromstring(model['svg'])
        for node in list(root):
            if node.tag.endswith('polyline') and node.get('data-role')=='curve':root.remove(node)
        left_x,right_x=.8,1.2
        y=lambda value:(value+1)/(value-1)
        a,b=screen_point(model,(left_x,y(left_x))),screen_point(model,(right_x,y(right_x)))
        ET.SubElement(root,'{http://www.w3.org/2000/svg}polyline',{'id':'crossing-curve','data-role':'curve','points':f'{a[0]},{a[1]} {b[0]},{b[1]}'})
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('DOMAIN_CROSSING',result['errors'])
        root=ET.fromstring(model['svg']);right=next(node for node in root.iter() if node.tag.endswith('polyline') and node.get('data-role')=='curve' and max(p[0] for p in model_points(model,node))>pole)
        points=model_points(model,right);wrong=[screen_point(model,(x,2-float(yv))) for x,yv in points]
        right.set('points',' '.join(f'{x:.9f},{y:.9f}' for x,y in wrong))
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('RATIONAL_RIGHT_POLE_BRANCH_WRONG_SIDE',result['overview']['errors'])

    def test_clipped_branch_cannot_pass_interval_coverage(self):
        plan,model=framed_model(graph());root=ET.fromstring(model['svg'])
        right=next(node for node in root.iter() if node.tag.endswith('polyline') and node.get('data-role')=='curve' and min(p[0] for p in model_points(model,node))>1)
        root.remove(right)
        result=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertTrue({'VISIBLE_COVERAGE_GAP','RATIONAL_BRANCH_SIDE_MISSING'} & set(result['errors']))

if __name__=='__main__':unittest.main()
