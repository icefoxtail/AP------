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


def graph(coefficients=('−2','2','1','1'),domain=(-5,7),viewport=(-6,8,-2,15),**kwargs):
    values=[value.replace('−','-') for value in coefficients]
    return {'family':'absolute-value','coefficients':values,'domain':list(domain),'viewport':list(viewport),'sourceDomain':{'kind':'ALL_REALS'},**kwargs}


def model_for(plan,display_scale=1):
    fitted=fit_overview(plan)['graphPlan']
    model=produce({**fitted,'displayScale':display_scale})
    result=audit(fitted,model['svg'],model['transform'])
    return fitted,model,result


class AbsoluteValueOverview(unittest.TestCase):
    def test_exact_corner_two_arms_and_profile_inventory(self):
        plan,model,result=model_for(graph(requiredPoints=[{'id':'left','x':0,'y':3},{'id':'corner','x':1,'y':1},{'id':'right','x':2,'y':3}]))
        self.assertEqual(plan['absoluteFeatures']['corner'],{'x':'1','y':'1','state':'CLOSED'})
        self.assertEqual(plan['absoluteFeatures']['leftArmSlope'],'-2')
        self.assertEqual(plan['absoluteFeatures']['rightArmSlope'],'2')
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['overview']['observedCornerMarkers'],1)
        self.assertGreaterEqual(result['overview']['arms'][0]['spanCssPx'],32)
        self.assertGreaterEqual(result['overview']['arms'][1]['spanCssPx'],32)

    def test_exact_intercepts_and_inverted_v_tail_directions(self):
        plan,model,result=model_for(graph(coefficients=('0','1','-1','2'),domain=(-6,6),viewport=(-7,7,-5,5)))
        self.assertEqual(plan['absoluteFeatures']['xIntercepts'],['-2','2'])
        self.assertEqual(plan['absoluteFeatures']['leftTailDirection'],'DOWN')
        self.assertEqual(plan['absoluteFeatures']['rightTailDirection'],'DOWN')
        self.assertEqual(result['status'],'PASS',result['errors'])

    def test_unsupported_source_grammar_fails_closed(self):
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_ABSOLUTE_VALUE_GRAMMAR'):
            fit_overview(graph(coefficients=('0','1','1')))
        with self.assertRaisesRegex(ValueError,'ABSOLUTE_VALUE_NONZERO_INNER_SLOPE_REQUIRED'):
            fit_overview(graph(coefficients=('1','0','1','0')))
        with self.assertRaisesRegex(ValueError,'ABSOLUTE_VALUE_NONZERO_OUTER_SCALE_REQUIRED'):
            fit_overview(graph(coefficients=('0','1','0','2')))
        with self.assertRaisesRegex(ValueError,'ABSOLUTE_VALUE_SOURCE_DOMAIN_REQUIRES_ALL_REALS'):
            fit_overview(graph(sourceDomain={'kind':'INTERVAL','range':['-2','2']}))

    def test_corner_inventory_marker_and_branch_mutations_fail(self):
        plan,model,result=model_for(graph())
        bad_plan=copy.deepcopy(plan);bad_plan['absoluteFeatures']['corner']['x']='2'
        observed=audit(bad_plan,model['svg'],model['transform'])
        self.assertIn('ABSOLUTE_VALUE_FEATURE_INVENTORY_MISMATCH',observed['overview']['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='absolute-corner');root.remove(marker)
        observed=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('ABSOLUTE_VALUE_CORNER_MARKER_MISSING_OR_DUPLICATED',observed['overview']['errors'])
        root=ET.fromstring(model['svg']);marker=next(node for node in root.iter() if node.get('data-role')=='absolute-corner');marker.set('cx',str(float(marker.get('cx'))+10))
        observed=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertIn('ABSOLUTE_VALUE_CORNER_MARKER_POSITION_MISMATCH',observed['overview']['errors'])
        root=ET.fromstring(model['svg']);path=next(node for node in root.iter() if node.tag.endswith('polyline') and node.get('data-role')=='curve')
        values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',path.get('points',''))]
        left_ids=[index for index in range(0,len(values),2) if (values[index]-model['transform']['originX'])/model['transform']['sx']<1]
        self.assertTrue(left_ids)
        for index in left_ids:values[index+1]=2*model['transform']['originY']-values[index+1]
        path.set('points',' '.join(f'{values[i]:.9f},{values[i+1]:.9f}' for i in range(0,len(values),2)))
        observed=audit(plan,ET.tostring(root,encoding='unicode'),model['transform'])
        self.assertTrue(observed['errors'])

    def test_one_chord_cannot_bridge_the_corner_and_clipped_arm_fails(self):
        plan,model,result=model_for(graph())
        root=ET.fromstring(model['svg']);old=next(node for node in root.iter() if node.tag.endswith('polyline') and node.get('data-role')=='curve')
        for node in list(root):
            if node.tag.endswith('polyline') and node.get('data-role')=='curve':root.remove(node)
        corner=plan['absoluteFeatures']['corner'];vx,vy=float(corner['x']),float(corner['y']);lo,hi=plan['domain'];t=model['transform']
        a=(t['originX']+lo*t['sx'],t['originY']-(-5)*t['sy']);b=(t['originX']+hi*t['sx'],t['originY']-(-5)*t['sy'])
        ET.SubElement(root,'{http://www.w3.org/2000/svg}polyline',{'id':'bridged-corner','data-role':'curve','points':f'{a[0]},{a[1]} {b[0]},{b[1]}'})
        observed=audit(plan,ET.tostring(root,encoding='unicode'),t)
        self.assertIn('DOMAIN_CROSSING',observed['errors'])
        root=ET.fromstring(model['svg']);curve=next(node for node in root.iter() if node.tag.endswith('polyline') and node.get('data-role')=='curve')
        values=[float(value) for value in re.findall(r'-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?',curve.get('points',''))]
        curve.set('points',' '.join(f'{values[i]:.9f},{values[i+1]:.9f}' for i in range(0,max(2,len(values)-20),2)))
        observed=audit(plan,ET.tostring(root,encoding='unicode'),t)
        self.assertTrue({'ABSOLUTE_VALUE_VISIBLE_ARM_COVERAGE_MISSING','VISIBLE_COVERAGE_GAP'} & set(observed['errors']))

    def test_small_profile_corner_and_arm_readability_are_unsupported(self):
        plan,model,result=model_for(graph(),.328125)
        self.assertEqual(result['overview']['status'],'UNSUPPORTED')
        self.assertTrue({'ABSOLUTE_VALUE_CORNER_MARKER_BELOW_PROFILE_FLOOR','ABSOLUTE_VALUE_LEFT_ARM_BELOW_PROFILE_FLOOR','ABSOLUTE_VALUE_RIGHT_ARM_BELOW_PROFILE_FLOOR'} <= set(result['overview']['errors']))

if __name__=='__main__':unittest.main()
