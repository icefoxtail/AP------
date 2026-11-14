import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.label_layout import *

def label(i,at,text,kind,priority,**more):
    return {'id':i,'kind':kind,'at':at,'text':text,'font':13.25,'priority':priority,**more}

class TickGapByInkTests(unittest.TestCase):
    """The rendered-layout verifier measures a tick label's gap to its axis on the glyph ink, not on the typesetter box. At font 20 a one-digit label's box (10 wide)
    is wider than its ink (6.88 wide, 1.66 in from the left), so a box edge 16 from the axis is 17.46 from it at ink and the verifier refuses it. The placer must judge
    the same rectangle: no position the verifier would refuse is accepted, and the tick falls back to its leader instead."""
    W,H=10.0,13.32
    INK=[1.66,0.0,6.88,13.32]                      # observedBBox of the font-20 fragment of "1" (x,y,width,height inside the box)
    def fixtures(self,fallback=False):
        tick={'id':'model-y-unit','kind':'line','role':'tick','axis':'y','value':1,'geometry':[(100,100),(96,100)]}
        axis={'id':'y-axis','kind':'axis','role':'axis','axis':'y','geometry':[(100,0),(100,200)]}
        east={'id':'east-block','kind':'label','geometry':Box(110,0,150,200)}      # nothing fits east of the tick
        west={'id':'west-block','kind':'label','geometry':Box(91,108,3,3)}      # every box is padded by 6: blocks the boxes at gap 8 ([82,92]) and 12 ([78,88]); gap 16 ([74,84]) stays clear
        item=label('tick-y-1-label',(100,100),'1','TICK_LABEL',0,tickId='model-y-unit',tickAxis='y',tickValue=1,tickDisplayValue='1',directions=('W','E'),gaps=(8,12,16),allowSuppress=False,**({'tickCalloutFallback':True} if fallback else {}))
        return item,[tick,axis,east,west]
    def run_layout(self,item,obstacles):
        return layout([item],obstacles,Box(0,0,300,220),measurements={item['id']:(self.W,self.H)},require_measurements=True)
    def test_box_rule_alone_accepts_gap_16_but_ink_rule_refuses_it(self):
        item,obstacles=self.fixtures()
        box_only=self.run_layout(item,obstacles)                                   # no ink report: the box rule, as before
        self.assertEqual(box_only['unresolved'],[],box_only)
        placed=Box(**box_only['labels'][0]['box'])
        self.assertAlmostEqual(item['at'][0]-placed.right,16.0)                      # box edge exactly 16 from the axis
        self.assertTrue(tick_box_respects_owner(placed,item['at'],'y'))
        self.assertFalse(tick_box_respects_owner(placed,item['at'],'y',self.INK))    # ink edge is 17.46 away: the verifier refuses it
        ink=tick_ink_box(placed,self.INK)
        self.assertAlmostEqual(item['at'][0]-ink.right,17.46,places=2)
        with_ink=self.run_layout({**item,'tickInk':self.INK},obstacles)
        self.assertEqual(with_ink['unresolved'],[],with_ink)                         # no gap fits at ink: not placed at gap 16 beside the axis; the number is never dropped (2026-11-11), it stands on its tick leader
        self.assertEqual(with_ink['labels'][0]['placement'],'OWNER_BOUND_TICK_LEADER')
    def test_ink_gap_fallback_is_the_tick_leader(self):
        item,obstacles=self.fixtures(fallback=True)
        result=self.run_layout({**item,'tickInk':self.INK},obstacles)
        self.assertEqual(result['unresolved'],[],result)
        placed=result['labels'][0]
        self.assertEqual(placed['placement'],'OWNER_BOUND_TICK_LEADER')
        self.assertEqual(len(result['leaders']),1)
    def test_a_position_that_fits_at_ink_is_placed_as_before(self):
        item,obstacles=self.fixtures()
        obstacles=[o for o in obstacles if o['id']!='west-block']
        plain=self.run_layout(item,obstacles);inked=self.run_layout({**item,'tickInk':self.INK},obstacles)
        self.assertEqual([(v['box'],v['placement']) for v in plain['labels']],[(v['box'],v['placement']) for v in inked['labels']])
        self.assertEqual(plain['labels'][0]['placement'],'AUTO_W')
        self.assertTrue(tick_box_respects_owner(Box(**inked['labels'][0]['box']),item['at'],'y',self.INK))
    def test_problem_tick_tries_farther_on_its_preferred_side_first(self):
        item,obstacles=self.fixtures()
        obstacles=[o for o in obstacles if o['id'] not in ('east-block','west-block')]
        obstacles.append({'id':'near-tick','kind':'label','geometry':Box(95,108,1,2)})
        item={**item,'preferred':'W','tickInk':self.INK}
        default=self.run_layout(item,obstacles)
        preferred=self.run_layout({**item,'preferTickSide':True},obstacles)
        self.assertEqual(default['labels'][0]['placement'],'COORDINATE_RELOCATION_E')
        self.assertEqual(preferred['labels'][0]['placement'],'AUTO_W')
        self.assertTrue(tick_box_respects_owner(Box(**preferred['labels'][0]['box']),item['at'],'y',self.INK))

    def test_problem_tick_can_change_side_when_preferred_side_is_blocked(self):
        item,obstacles=self.fixtures()
        obstacles=[o for o in obstacles if o['id'] not in ('east-block','west-block')]
        obstacles.append({'id':'west-block','kind':'label','geometry':Box(45,0,49,200)})
        result=self.run_layout({**item,'preferred':'W','preferTickSide':True,'tickInk':self.INK},obstacles)
        self.assertEqual(result['labels'][0]['placement'],'COORDINATE_RELOCATION_E')

    def test_x_axis_gap_uses_the_vertical_ink_too(self):
        box=Box(95,116,10,13.32)                                                   # box top 16 below the axis y=100
        self.assertTrue(tick_box_respects_owner(box,(100,100),'x'))
        self.assertTrue(tick_box_respects_owner(box,(100,100),'x',[0,0,10,13.32]))   # ink fills the box: same verdict
        self.assertFalse(tick_box_respects_owner(box,(100,100),'x',[0,1.5,10,10]))   # ink starts 1.5 lower: 17.5 away

if __name__=='__main__':unittest.main()
