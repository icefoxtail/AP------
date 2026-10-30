"""Free text labels (E30): the comma-list math grammar, the semantic fields, and the engine's placement of a centred / side-anchored label.
No Chrome here (label sizes come from the build's own approximate sizes); the real typeset figure and the observer are exercised by tests/plane-text-labels.test.mjs."""
import math
import sys
import unittest
from pathlib import Path

GEOMETRY=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(GEOMETRY))
from visual_engine.engine import build,prepare,FREE_LABEL_RINGS,FREE_LABEL_GAPS
from visual_engine.math_expression import parse,parse_list,serialize
from visual_engine.semantic_model import validate

def spec_of(objects,width=480,height=360):
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-10,'xMax':10,'yMin':-7.5,'yMax':7.5,'width':width,'height':height,'panel':0},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},'objects':objects}
def label(identifier,text,at,**extra):return {'id':identifier,'kind':'EQUATION_LABEL','target':identifier,'text':text,'at':list(at),'freeLabel':True,'priority':1,**extra}
def screen(spec,point):return tuple(prepare(spec)[3].screen(point))
def pixels(spec):return prepare(spec)[3].sx      # px per model unit
def placed(spec):
    layout=build(spec)['witness']['layout'];return layout,{row['id']:row for row in layout['labels']}
def centre(row):return (row['box']['x']+row['box']['width']/2,row['box']['y']+row['box']['height']/2)

class ListGrammarTests(unittest.TestCase):
    def test_a_comma_list_at_the_top_level_is_a_list_of_its_parts(self):
        tree=parse_list('a>0, b<0')
        self.assertEqual(tree.kind,'list');self.assertEqual(len(tree.args),2)
        self.assertEqual(serialize(tree,'plain'),'a>0, b<0');self.assertEqual(serialize(tree,'tex'),'a>0,\\;b<0')
    def test_a_comma_inside_brackets_is_not_a_list(self):
        tree=parse_list('P(a,b)');self.assertNotEqual(tree.kind,'list');self.assertEqual(serialize(tree,'plain'),'P(a,b)')
        self.assertEqual(serialize(parse_list('(-1,0)'),'plain'),'(−1,0)')
    def test_one_expression_parses_as_before_and_the_plain_parser_still_refuses_a_list(self):
        self.assertEqual(serialize(parse_list('x<=3'),'tex'),serialize(parse('x<=3'),'tex'))
        with self.assertRaises(ValueError) as caught:parse('a>0, b<0')
        self.assertEqual(str(caught.exception),'UNRESOLVED_EXPRESSION')
        with self.assertRaises(ValueError):parse_list('a>0, ')

class SemanticTests(unittest.TestCase):
    def test_free_label_fields_are_checked(self):
        validate(spec_of([label('t','x',(0,0),anchor='CENTER')]))
        for bad,code in ((label('t','x',(0,0),freeLabel=False),'INVALID_FREE_LABEL'),(label('t','x',(0,0),anchor='UP'),'INVALID_FREE_LABEL_ANCHOR'),
                         ({'id':'t','kind':'EQUATION_LABEL','text':'x','at':[0,0],'anchor':'E'},'INVALID_FREE_LABEL_ANCHOR'),
                         ({'id':'p','kind':'POINT','at':[0,0],'name':None,'freeLabel':True},'INVALID_FREE_LABEL')):
            with self.assertRaises(ValueError,msg=code) as caught:validate(spec_of([bad]))
            self.assertEqual(str(caught.exception),code)

class PlacementTests(unittest.TestCase):
    def test_a_centred_label_stands_on_its_place(self):
        spec=spec_of([label('t','제1사분면',(3,2),anchor='CENTER',labelKind='TEXT')]);layout,rows=placed(spec)
        self.assertEqual(layout['unresolved'],[])
        self.assertAlmostEqual(math.dist(centre(rows['t']),screen(spec,(3,2))),0.0,places=6)
    def test_a_blocked_centre_slides_to_the_nearest_free_spot_within_the_ring(self):
        wall={'id':'w','kind':'SEGMENT','from':[3,-4],'to':[3,4]}      # a drawn segment straight through the label's place
        spec=spec_of([wall,label('t','x',(3,2),anchor='CENTER')]);layout,rows=placed(spec)
        self.assertEqual(layout['unresolved'],[])
        moved=math.dist(centre(rows['t']),screen(spec,(3,2)))
        self.assertGreater(moved,0.0);self.assertLessEqual(moved,max(FREE_LABEL_RINGS)+1e-6)
        x=screen(spec,(3,0))[0];box=rows['t']['box'];self.assertTrue(box['x']+box['width']<x or box['x']>x,'the box clears the segment')
    def test_a_label_that_finds_no_room_within_its_ring_is_unresolved_not_moved_away(self):
        walls=[{'id':'w'+str(k),'kind':'SEGMENT','from':[-9,y],'to':[9,y]} for k,y in enumerate((-1,0,1,2,3,4,5))]
        spec=spec_of(walls+[label('t','xxxxxxxxxxxxxxxxxxxx',(0,2.5),anchor='CENTER')]);layout,_rows=placed(spec)
        self.assertEqual(layout['unresolved'],['t'])
    def test_a_side_anchor_keeps_to_its_side(self):
        for anchor,dx,dy in (('E',1,0),('W',-1,0),('N',0,-1),('S',0,1),('NE',1,-1),('SW',-1,1)):
            spec=spec_of([{'id':'P','kind':'POINT','at':[0,0],'name':None},label('t','P(a,b)',(0,0),anchor=anchor)]);layout,rows=placed(spec)
            self.assertEqual(layout['unresolved'],[],anchor)
            box=rows['t']['box'];ax,ay=screen(spec,(0,0));cx,cy=centre(rows['t'])
            if dx>0:self.assertGreaterEqual(box['x'],ax-1e-6,anchor)
            if dx<0:self.assertLessEqual(box['x']+box['width'],ax+1e-6,anchor)
            if dy>0:self.assertGreaterEqual(box['y'],ay-1e-6,anchor)
            if dy<0:self.assertLessEqual(box['y']+box['height'],ay+1e-6,anchor)
            if dx==0:self.assertAlmostEqual(cx,ax,places=6)
            if dy==0:self.assertAlmostEqual(cy,ay,places=6)
            self.assertLessEqual(min(math.hypot(max(box['x']-ax,0,ax-box['x']-box['width']),max(box['y']-ay,0,ay-box['y']-box['height'])),99),max(FREE_LABEL_GAPS)+1e-6,anchor)
    def test_a_named_side_with_no_room_is_unresolved_not_swapped_for_another_side(self):
        spec=spec_of([{'id':'P','kind':'POINT','at':[0,0],'name':None},label('t','P(a,b)',(0,0),anchor='E')])
        wall_x=24.0/pixels(spec)       # a wall 24 px east of the point: the E side has no room for a 52 px label, the W side does
        spec['objects']=[{'id':'w','kind':'SEGMENT','from':[wall_x,-6],'to':[wall_x,6]}]+spec['objects'];layout,_rows=placed(spec)
        self.assertEqual(layout['unresolved'],['t'])
    def test_without_an_anchor_a_label_beside_a_point_takes_the_first_free_side(self):
        spec=spec_of([{'id':'P','kind':'POINT','at':[0,0],'name':None},label('t','P(a,b)',(0,0))]);layout,rows=placed(spec)
        self.assertEqual(layout['unresolved'],[]);self.assertTrue(rows['t']['placement'].startswith(('AUTO_','COORDINATE_RELOCATION_')))
    def test_a_free_label_never_moves_to_the_side_panel(self):
        spec=spec_of([label('t','x',(0,0),anchor='CENTER')]);spec['viewport']['panel']=120
        crowd=[{'id':'w'+str(k),'kind':'SEGMENT','from':[-9,y],'to':[9,y]} for k,y in enumerate((-1,-0.5,0,0.5,1))]
        spec['objects']=crowd+spec['objects'];layout,_rows=placed(spec)
        self.assertNotIn('SIDE_PANEL',[row['placement'] for row in layout['labels']])

if __name__=='__main__':unittest.main()
