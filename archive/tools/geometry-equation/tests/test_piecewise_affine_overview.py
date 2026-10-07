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


def request(owner='RIGHT',left=('1','1'),right=('1','-1'),source=('-4','4'),domain=(-4.0,4.0),break_x='0'):
    return {'family':'piecewise-affine','sourceDomain':{'kind':'CLOSED_INTERVAL','range':list(source)},'domain':list(domain),'viewport':[-5,5,-5,5],
            'piecewise':{'breakX':break_x,'owner':owner,'left':list(left),'right':list(right)}}


def build(plan):
    framed=fit_overview(plan)['graphPlan']
    model=produce(framed)
    observed=audit(framed,model['svg'],model['transform'])
    return framed,model,observed


class PiecewiseAffineOverview(unittest.TestCase):
  def test_jump_piecewise_graph_binds_interval_owner_and_open_closed_limits(self):
    plan,model,observed=build(request(owner='RIGHT'))
    self.assertEqual(observed['status'],'PASS',observed['errors'])
    self.assertEqual(plan['domain'],[-4.0,4.0])
    self.assertEqual(plan['piecewiseFeatures']['breakpoint'],{'x':'0','owner':'RIGHT','leftLimitY':'1','rightLimitY':'-1','valueY':'-1','continuity':'JUMP'})
    markers={marker['id']:(marker['state'],marker['owner'],marker['point']) for marker in observed['markers']}
    self.assertEqual(markers['piecewise-source-start'][:2],('CLOSED','LEFT'));self.assertAlmostEqual(markers['piecewise-source-start'][2][0],-4.0,places=7);self.assertAlmostEqual(markers['piecewise-source-start'][2][1],-3.0,places=7)
    self.assertEqual(markers['piecewise-source-end'][:2],('CLOSED','RIGHT'));self.assertAlmostEqual(markers['piecewise-source-end'][2][0],4.0,places=7);self.assertAlmostEqual(markers['piecewise-source-end'][2][1],3.0,places=7)
    self.assertEqual(markers['piecewise-breakpoint-owner-closed'][:2],('CLOSED','RIGHT'));self.assertAlmostEqual(markers['piecewise-breakpoint-owner-closed'][2][1],-1.0,places=7)
    self.assertEqual(markers['piecewise-breakpoint-limit-open'][:2],('OPEN','LEFT'));self.assertAlmostEqual(markers['piecewise-breakpoint-limit-open'][2][1],1.0,places=7)
    self.assertEqual(len([node for node in ET.fromstring(model['svg']) if node.tag.endswith('polyline')]),2)


  def test_left_owner_and_continuous_join_have_exact_marker_semantics(self):
    _,_,left_owned=build(request(owner='LEFT'))
    self.assertEqual(left_owned['status'],'PASS',left_owned['errors'])
    left_markers={marker['id']:(marker['state'],marker['owner'],marker['point']) for marker in left_owned['markers']}
    self.assertEqual(left_markers['piecewise-breakpoint-owner-closed'][:2],('CLOSED','LEFT'));self.assertAlmostEqual(left_markers['piecewise-breakpoint-owner-closed'][2][1],1.0,places=7)
    self.assertEqual(left_markers['piecewise-breakpoint-limit-open'][:2],('OPEN','RIGHT'));self.assertAlmostEqual(left_markers['piecewise-breakpoint-limit-open'][2][1],-1.0,places=7)
    continuous_plan=request(owner='RIGHT',left=('-1','0'),right=('1','0'))
    plan,model,continuous=build(continuous_plan)
    self.assertEqual(continuous['status'],'PASS',continuous['errors'])
    self.assertEqual(plan['piecewiseFeatures']['breakpoint']['continuity'],'CONTINUOUS')
    break_markers=[marker for marker in continuous['markers'] if marker['kind']=='piecewise-breakpoint']
    self.assertEqual(len(break_markers),1)
    self.assertEqual((break_markers[0]['state'],break_markers[0]['owner']),('CLOSED','RIGHT'))
    self.assertTrue(all(marker['state']!='OPEN' for marker in continuous['markers']))


  def test_rejects_source_domain_expansion_open_interval_and_noninterior_break(self):
    with self.assertRaisesRegex(ValueError,'PIECEWISE_DRAW_DOMAIN_MUST_EQUAL_SOURCE_INTERVAL'):fit_overview(request(domain=(-4.1,4.0)))
    opened=request();opened['sourceDomain']={'kind':'OPEN_INTERVAL','range':['-4','4']}
    with self.assertRaisesRegex(ValueError,'PIECEWISE_SOURCE_DOMAIN_REQUIRES_CLOSED_INTERVAL'):fit_overview(opened)
    endpoint_break=request(break_x='4')
    with self.assertRaisesRegex(ValueError,'PIECEWISE_BREAKPOINT_OUTSIDE_SOURCE_INTERIOR'):fit_overview(endpoint_break)
    overlap=request();overlap['piecewise']['third']=['0','0']
    with self.assertRaisesRegex(ValueError,'INVALID_PIECEWISE_GRAMMAR'):fit_overview(overlap)


  def test_observer_rejects_owner_mutation_wrong_branch_and_cross_break_chord(self):
    plan,model,_=build(request(owner='RIGHT'))
    tree=ET.fromstring(model['svg'])
    closed=next(node for node in tree.iter() if node.get('id')=='piecewise-breakpoint-owner-closed')
    closed.set('data-owner','LEFT')
    mutated=ET.tostring(tree,encoding='unicode')
    result=audit(plan,mutated,model['transform'])
    self.assertEqual(result['status'],'FAIL');self.assertIn('PIECEWISE_MARKER_OWNERSHIP_MISMATCH',result['errors'])

    tree=ET.fromstring(model['svg'])
    left=next(node for node in tree.iter() if node.get('data-branch')=='LEFT')
    values=[float(value) for value in left.get('points').replace(',', ' ').split()]
    values[-1]+=1
    left.set('points',' '.join(f'{values[index]},{values[index+1]}' for index in range(0,len(values),2)))
    wrong_branch=audit(plan,ET.tostring(tree,encoding='unicode'),model['transform'])
    self.assertEqual(wrong_branch['status'],'FAIL');self.assertTrue(any(code.startswith('PIECEWISE_WRONG_BRANCH_EQUATION') for code in wrong_branch['errors']))

    tree=ET.fromstring(model['svg'])
    left=next(node for node in tree.iter() if node.get('data-branch')=='LEFT')
    values=[float(value) for value in left.get('points').replace(',', ' ').split()]
    endpoint=model['transform']['originX']+model['transform']['sx']*1
    y=model['transform']['originY']-model['transform']['sy']*2
    values[-2:]=[endpoint,y]
    left.set('points',' '.join(f'{values[index]},{values[index+1]}' for index in range(0,len(values),2)))
    crossing=audit(plan,ET.tostring(tree,encoding='unicode'),model['transform'])
    self.assertEqual(crossing['status'],'FAIL');self.assertIn('PIECEWISE_CROSS_BREAK_CHORD:LEFT',crossing['errors'])


  def test_observer_rejects_tampered_frozen_inventory(self):
    plan,model,_=build(request())
    tampered=copy.deepcopy(plan);tampered['piecewiseFeatures']['breakpoint']['owner']='LEFT'
    result=audit(tampered,model['svg'],model['transform'])
    self.assertEqual(result['status'],'FAIL');self.assertIn('PIECEWISE_FEATURE_INVENTORY_MISMATCH',result['errors'])
