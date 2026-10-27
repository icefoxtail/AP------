import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
from graph_framing import fit_overview
from graph_spike import produce
from graph_observer import audit,polynomial,polynomial_feature_inventory,resolve

def plan(coefficients,domain=None,viewport=None,source_domain=None):
    return {
        'family':'polynomial','coefficients':coefficients,
        'domain':domain or [-2,2],'viewport':viewport or [-2,2,-2,2],
        **({'sourceDomain':source_domain} if source_domain is not None else {})
    }

def framed(coefficients,**kwargs):
    return fit_overview(plan(coefficients,source_domain={'kind':'ALL_REALS'},**kwargs))['graphPlan']

def scale_transform(transform,display_scale):
    return {key:value for key,value in transform.items() if key!='aspectPolicy'}|{'displayScale':display_scale}

class CubicQuarticOverview(unittest.TestCase):
    def test_quartic_reserves_tail_room_past_the_outer_root(self):
        graph=framed(['0','-1','0','0','1'])
        roots=[row['x'] for row in graph['overviewFeatures'] if row.get('kind')=='POLYNOMIAL_FEATURE' and 'ROOT' in row.get('roles',[])]
        self.assertEqual(roots,[0.0,1.0])
        self.assertLess(graph['domain'][0],-1.0)
        self.assertGreaterEqual(graph['domain'][1],1.4)
        self.assertGreater(graph['domain'][1],max(roots))

    def test_exact_cubic_and_quartic_feature_inventory_and_tail_directions(self):
        cases=[
            (['0','-3','0','1'],3,3,{'left':'DOWN','right':'UP'}),
            (['4','0','-5','0','1'],4,4,{'left':'UP','right':'UP'}),
        ]
        for coefficients,degree,root_count,tail_directions in cases:
            with self.subTest(coefficients=coefficients):
                graph=framed(coefficients)
                self.assertEqual(graph['overviewPolicy'],'POLYNOMIAL_CUBIC_QUARTIC_OVERVIEW_v1')
                self.assertEqual(graph['overviewFeaturePolicy']['minimumDistinctFeatureSeparationCssPx'],1)
                self.assertEqual(graph['sourceDomain'],{'kind':'ALL_REALS'})
                tails={row['side']:row for row in graph['overviewFeatures'] if row['kind']=='TAIL_DIRECTION'}
                self.assertEqual({side.lower():row['direction'] for side,row in tails.items()},tail_directions)
                model=produce(graph)
                result=audit(graph,model['svg'],scale_transform(model['transform'],1.0))
                self.assertEqual(result['status'],'PASS',result['errors'])
                self.assertEqual(result['overview']['degree'],degree)
                self.assertEqual(len(result['topology']['roots']),root_count)
                self.assertEqual(len([row for row in result['overview']['features'] if 'STATIONARY_EXTREMUM' in row['roles']]),2 if degree==3 else 3)
                self.assertEqual(len([row for row in result['overview']['features'] if 'INFLECTION' in row['roles']]),1 if degree==3 else 2)
                self.assertEqual(result['overview']['endDirections'],tail_directions)

    def test_asymmetric_cubic_window_extends_only_the_short_arm(self):
        # (x+2)(x-2)(x-3): the right outer arm sits only 0.6 units past its last stationary point, so the
        # symmetric default window fails the 18% arm-travel audit. The framing extends that side (and only
        # that side) until the audit passes; the audit itself is unchanged.
        graph=framed(['12','-4','-3','1'])
        self.assertGreater(graph['domain'][1],3.6)
        self.assertAlmostEqual(graph['domain'][0],-3.6,places=9)
        model=produce(graph)
        result=audit(graph,model['svg'],scale_transform(model['transform'],1.0))
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(len(result['topology']['roots']),3)

    def test_stationary_inflection_and_inflection_are_one_feature_record(self):
        source=polynomial(['0','0','0','1'],4)
        zero_rows=[row for row in polynomial_feature_inventory(source,-1,1) if row.get('kind')=='POLYNOMIAL_FEATURE' and abs(row['x'])<1e-10]
        self.assertEqual(len(zero_rows),1)
        self.assertEqual(zero_rows[0]['roles'],['ROOT','STATIONARY_INFLECTION','INFLECTION'])
        self.assertEqual(zero_rows[0]['multiplicity'],{'root':3,'derivative':2,'secondDerivative':1})

    def test_repeated_roots_keep_their_exact_multiplicity_and_roles(self):
        cases=[
            (['2','-3','0','1'],[(0.0,-2.0,1),(0.0,1.0,2)]),
            (['-1/4','-3/4','0','1'],[(0.0,-0.5,2),(0.0,1.0,1)]),
            (['0','0','0','1'],[(0.0,0.0,3)]),
        ]
        for coefficients,expected in cases:
            with self.subTest(coefficients=coefficients):
                graph=framed(coefficients)
                self.assertEqual(graph['overviewFeaturePolicy']['repeatedSourceRootPolicy'],'EXACT_MULTIPLICITY')
                self.assertEqual(graph['overviewFeaturePolicy']['tangencyPolicy'],'TOUCHES_AXIS_EVEN_CROSSES_ODD')
                roots=[(row['y'],row['x'],row['multiplicity']['root']) for row in graph['overviewFeatures'] if row.get('kind')=='POLYNOMIAL_FEATURE' and 'ROOT' in row['roles']]
                self.assertEqual(roots,expected)
                model=produce(graph)
                result=audit(graph,model['svg'],scale_transform(model['transform'],1.0))
                self.assertEqual(result['status'],'PASS',result['errors'])
                self.assertEqual([(row['multiplicity']) for row in result['overview']['rootMultiplicities']],[row[2] for row in expected])
        triple=[row for row in framed(['0','0','0','1'])['overviewFeatures'] if row.get('kind')=='POLYNOMIAL_FEATURE']
        self.assertEqual(triple[0]['roles'],['ROOT','STATIONARY_INFLECTION','INFLECTION'])
        self.assertEqual(triple[0]['multiplicity'],{'root':3,'derivative':2,'secondDerivative':1})

    def test_irrational_repeated_roots_are_drawn_at_their_exact_touch_points(self):
        graph=framed(['4','0','-4','0','1']) # (x^2-2)^2
        roots=[row for row in graph['overviewFeatures'] if row.get('kind')=='POLYNOMIAL_FEATURE' and 'ROOT' in row['roles']]
        self.assertEqual([row['multiplicity']['root'] for row in roots],[2,2])
        self.assertAlmostEqual(roots[0]['x'],-2**.5,places=9)
        self.assertAlmostEqual(roots[1]['x'],2**.5,places=9)
        for row in roots:self.assertLess(abs(row['y']),1e-8)
        model=produce(graph)
        self.assertEqual(audit(graph,model['svg'],scale_transform(model['transform'],1.0))['status'],'PASS')
        # The final composed figure is audited at the 610x420 overview canvas (plot 406x356), the same plot the model now uses.
        v=graph['viewport'];sx=406/(v[1]-v[0]);sy=356/(v[3]-v[2])
        transform={'originX':32+(0-v[0])*sx,'originY':32+(v[3]-0)*sy,'sx':sx,'sy':sy,'displayScale':1.0}
        self.assertEqual(audit(graph,model['svg'],transform)['status'],'PASS')

    def test_tangent_root_crossing_in_the_final_polyline_fails(self):
        graph=framed(['2','-3','0','1']);model=produce(graph);transform=scale_transform(model['transform'],1.0)
        root=ET.fromstring(model['svg']);curve=next(node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve')
        pairs=[tuple(float(v) for v in point.split(',')) for point in curve.get('points','').split()]
        root_screen_x=transform['originX']+1.0*transform['sx']
        tampered=[(x,y+8.0 if root_screen_x<x<=root_screen_x+30 else y) for x,y in pairs]
        curve.set('points',' '.join(f'{x:.12g},{y:.12g}' for x,y in tampered))
        result=audit(graph,ET.tostring(root,encoding='unicode'),transform)
        self.assertIn('OVERVIEW_EVEN_ROOT_CROSSES_AXIS',result['errors'])

    def test_triple_root_must_cross_with_a_flat_band(self):
        graph=framed(['0','0','0','1']);model=produce(graph);transform=scale_transform(model['transform'],1.0)
        root=ET.fromstring(model['svg']);curve=next(node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve')
        pairs=[tuple(float(v) for v in point.split(',')) for point in curve.get('points','').split()]
        root_screen_x=transform['originX']
        tampered=[(x,transform['originY']-(x-root_screen_x) if abs(x-root_screen_x)<=60 else y) for x,y in pairs]
        curve.set('points',' '.join(f'{x:.12g},{y:.12g}' for x,y in tampered))
        result=audit(graph,ET.tostring(root,encoding='unicode'),transform)
        self.assertIn('OVERVIEW_ODD_ROOT_NOT_FLAT',result['errors'])

    def test_declared_repeated_root_multiplicity_and_tangency_policy_are_bound(self):
        graph=framed(['2','-3','0','1']);model=produce(graph);transform=scale_transform(model['transform'],1.0)
        features=[{**row,'multiplicity':{**row['multiplicity'],'root':1}} if row.get('id')=='feature-4' else row for row in graph['overviewFeatures']]
        self.assertIn('OVERVIEW_FEATURE_INVENTORY_MISMATCH',audit({**graph,'overviewFeatures':features},model['svg'],transform)['errors'])
        policy={**graph['overviewFeaturePolicy'],'tangencyPolicy':'UNSUPPORTED'}
        self.assertIn('OVERVIEW_FEATURE_POLICY_BINDING_MISMATCH',audit({**graph,'overviewFeaturePolicy':policy},model['svg'],transform)['errors'])

    def test_repeated_roots_and_restricted_domains_fail_closed(self):
        with self.assertRaisesRegex(ValueError,'CUBIC_QUARTIC_REQUIRES_ALL_REALS_SOURCE_DOMAIN'):
            fit_overview(plan(['0','-3','0','1'],source_domain={'kind':'INTERVAL','range':['-2','2']}))
        with self.assertRaisesRegex(ValueError,'CUBIC_QUARTIC_REQUIRES_ALL_REALS_SOURCE_DOMAIN'):
            fit_overview(plan(['0','-3','0','1']))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_CUBIC_QUARTIC_DEGREE'):
            from fractions import Fraction
            from graph_framing import _fit_cubic_quartic
            _fit_cubic_quartic({'sourceDomain':{'kind':'ALL_REALS'},'domain':[-2,2],'viewport':[-2,2,-2,2]},[Fraction(1),Fraction(0),Fraction(0),Fraction(0),Fraction(0),Fraction(1)])

    def test_clustered_roots_are_unsupported_at_actual_display_scale(self):
        graph=framed(['0','1/100000000','-100000001/100000000','1'])
        model=produce(graph)
        result=audit(graph,model['svg'],scale_transform(model['transform'],1.0))
        self.assertEqual(result['status'],'UNSUPPORTED')
        self.assertTrue(any('ROOT_FEATURE_BELOW_DISPLAY_RESOLUTION' in error for error in result['errors']),result['errors'])

    def test_wrong_chord_and_missing_feature_inventory_fail(self):
        graph=framed(['0','-3','0','1'])
        model=produce(graph);transform=scale_transform(model['transform'],1.0)
        lo,hi=graph['domain'];evaluate=lambda value:value**3-3*value
        points=[(transform['originX']+value*transform['sx'],transform['originY']-evaluate(value)*transform['sy']) for value in (lo,hi)]
        svg='<svg xmlns="http://www.w3.org/2000/svg"><polyline data-role="curve" points="'+ ' '.join(f'{px},{py}' for px,py in points)+'"/></svg>'
        chord=audit(graph,svg,transform)
        self.assertIn('CURVE_INTERIOR_BOUND_FAIL',chord['errors'])
        self.assertTrue(any(error.startswith('OVERVIEW_FEATURE_NOT_OBSERVED:') for error in chord['errors']))
        tampered={**graph,'overviewFeatures':[row for row in graph['overviewFeatures'] if row.get('id')!='feature-1']}
        self.assertIn('OVERVIEW_FEATURE_INVENTORY_MISMATCH',audit(tampered,model['svg'],transform)['errors'])

    def test_final_polyline_must_reach_both_viewport_edges_in_derived_directions(self):
        graph=framed(['0','-3','0','1']);model=produce(graph)
        root=ET.fromstring(model['svg']);curve=next(node for node in root.iter() if node.tag.split('}')[-1]=='polyline' and node.get('data-role')=='curve')
        values=curve.get('points').split();curve.set('points',' '.join(values[len(values)//5:]))
        result=audit(graph,ET.tostring(root,encoding='unicode'),scale_transform(model['transform'],1.0))
        self.assertIn('OVERVIEW_LEFT_END_EXIT_MISSING',result['errors'])

    def test_viewport_out_and_back_cannot_skip_reentered_visible_intervals(self):
        graph=framed(['4','0','-5','0','1'])
        graph={**graph,'viewport':[graph['viewport'][0],graph['viewport'][1],-.1,.5]}
        intervals=resolve(graph)[-1]['visibleIntervals']
        self.assertGreaterEqual(len(intervals),4)
        transform=scale_transform(produce(graph)['transform'],1.0)
        source=polynomial(graph['coefficients'],4)
        root=ET.Element('svg',{'xmlns':'http://www.w3.org/2000/svg'})
        for branch_index,(left,right) in enumerate((intervals[0],intervals[-1])):
            points=[]
            for step in range(17):
                model_x=left+(right-left)*step/16
                model_y=float(source.eval(str(model_x)))
                screen_x=transform['originX']+model_x*transform['sx']
                screen_y=transform['originY']-model_y*transform['sy']
                points.append(f'{screen_x:.12g},{screen_y:.12g}')
            ET.SubElement(root,'polyline',{'id':f'branch-{branch_index}','data-role':'curve','points':' '.join(points),'fill':'none','stroke':'black'})
        result=audit(graph,ET.tostring(root,encoding='unicode'),transform)
        self.assertIn('VISIBLE_COVERAGE_GAP',result['errors'])

    def test_feature_separation_is_rechecked_after_profile_scaling(self):
        graph=framed(['1','0','-1','0','1']);model=produce(graph)
        zoomed=audit(graph,model['svg'],scale_transform(model['transform'],.001))
        self.assertEqual(zoomed['status'],'UNSUPPORTED')
        self.assertIn('OVERVIEW_FEATURES_BELOW_DISPLAY_RESOLUTION',zoomed['errors'])

    def test_non_cubic_quartic_and_non_polynomial_families_are_not_routed_into_policy(self):
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_OVERVIEW_DEGREE'):
            fit_overview(plan(['0','1'],source_domain={'kind':'ALL_REALS'}))
        with self.assertRaisesRegex(ValueError,'UNSUPPORTED_OVERVIEW_FAMILY'):
            fit_overview({'family':'exponential','coefficients':['1','0','0','1'],'domain':[-1,1],'viewport':[-1,1,-1,1]})
        with self.assertRaisesRegex(ValueError,'INVALID_FRAMING_COEFFICIENTS'):
            fit_overview(plan(['1/0','0','0','1'],source_domain={'kind':'ALL_REALS'}))

if __name__=='__main__':unittest.main()
