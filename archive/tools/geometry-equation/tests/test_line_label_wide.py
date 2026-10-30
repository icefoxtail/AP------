"""E31 (1): the wide search of a line-owned label, leaders that start beside a parallel neighbour, and the tick-first retry."""
import math,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.label_layout import *

def label(i,at,text='P',kind='POINT_NAME',priority=1,**more):
    return {'id':i,'kind':kind,'at':at,'text':text,'font':13.25,'priority':priority,**more}

def line(i,a,b):return {'id':i,'kind':'line','geometry':[a,b]}

class WideLineSearchTests(unittest.TestCase):
    def equation(self,owner,at,alternates=()):
        return label(owner['id']+'-equation',at,'-10x+4y+3=0','EQUATION_LABEL',1,target=owner['id'],lineOwned=True,alternateAt=[list(a) for a in alternates],gaps=[8,6,10,20,32,48])

    def test_a_parallel_neighbour_three_px_away_still_lets_a_leader_leave_on_the_far_side(self):
        # Two lines 3 px apart: no box beside either is unambiguous, and a leader starting on the right-hand line used to stand within 6 px of the left-hand one.
        left=line('L1',(100,300),(160,60));right=line('L2',(103,300),(163,60))
        item=self.equation(right,(163,60))
        result=layout([item],[left,right],Box(12,12,396,576),measurements={item['id']:(190,21)},require_measurements=False)
        self.assertEqual(result['unresolved'],[],result)
        placed=result['labels'][0];leader=result['leaders'][0]
        self.assertTrue(placed['placement'].startswith('OWNER_LEADER_'),placed['placement'])
        self.assertEqual(leader['ownerId'],'L2')
        start=leader['from']
        # it starts ON its own line and keeps moving away from the neighbour (never nearer to it than where it starts)
        self.assertLess(point_segment_distance(start,(103,300),(163,60)),1e-6)
        first=point_segment_distance(start,(100,300),(160,60))
        self.assertGreaterEqual(first,LEADER_NEAR_START_MIN_PX)
        self.assertGreaterEqual(point_segment_distance(tuple(leader['to']),(100,300),(160,60)),first-1e-6)
        self.assertFalse(collision(Box(**placed['box']),left,0))

    def test_a_leader_never_starts_closer_than_the_minimum_to_a_neighbour(self):
        left=line('L1',(100,300),(160,60));right=line('L2',(100.5,300),(160.5,60))
        item=self.equation(right,(160.5,60))
        result=layout([item],[left,right],Box(12,12,396,576),measurements={item['id']:(190,21)})
        self.assertEqual(result['unresolved'],[item['id']])

    def test_a_label_that_fits_with_the_ordinary_anchors_is_placed_exactly_as_before(self):
        own=line('L0',(100,80),(100,280));far=line('L2',(300,80),(300,280))
        item=self.equation(own,(100,180))
        before=layout([item],[own,far],Box(0,0,400,400),measurements={item['id']:(60,12)})
        self.assertEqual(before['unresolved'],[])
        self.assertTrue(before['labels'][0]['placement'].startswith(('AUTO_','COORDINATE_RELOCATION_')),before['labels'][0]['placement'])
        self.assertEqual(before['leaders'],[])

    def test_anchors_are_sampled_over_the_whole_drawn_line_when_the_author_anchors_have_no_room(self):
        # Both ends of the line are walled in (a neighbour on each side, a ceiling / floor across the end) but its middle has a free side.
        own=line('L0',(200,40),(200,360))
        walls=[line('NL',(170,40),(170,110)),line('NR',(230,40),(230,110)),line('SL',(170,290),(170,360)),line('SR',(230,290),(230,360)),
               line('CEIL',(150,30),(250,30)),line('FLOOR',(150,370),(250,370))]
        item=self.equation(own,(200,40),alternates=[(200,60),(200,80)])
        result=layout([item],[own,*walls],Box(0,0,400,400),measurements={item['id']:(60,14)})
        self.assertEqual(result['unresolved'],[])
        placed=result['labels'][0];box=Box(**placed['box'])
        self.assertTrue(110<=placed['at'][1]<=290,placed['at'])          # the anchor moved to the open middle of the line
        self.assertTrue(110<=box.y+box.height/2<=290)

    def test_a_base_curve_drawn_over_the_owner_line_does_not_block_its_leader(self):
        # A graph's base curve that is the same straight line as an overlay line (a piece drawn under it) is that line, not a competitor.
        own=line('L0',(200,40),(200,360));base={'id':'f','kind':'curve','geometry':[(200,40),(200,200),(200,360)]}
        near=[line('NL',(197,40),(197,360))]                          # a neighbour 3 px away: only a leader on the far side names the line
        item={**self.equation(own,(200,200)),'collinearOwners':True}        # what the graph overlay's line labels carry
        result=layout([item],[own,base,*near],Box(0,0,400,400),measurements={item['id']:(40,14)})
        self.assertEqual(result['unresolved'],[],result)
        self.assertEqual([leader['ownerId'] for leader in result['leaders']],['L0'])

    def test_the_band_of_a_stated_place_keeps_the_wide_search_in_that_part_of_the_line(self):
        own=line('L0',(200,360),(200,40))      # drawn from the bottom up: wideLeftFirst counts from the lower end of a vertical line
        walls=[line('NL',(170,40),(170,360)),line('NR',(230,40),(230,360))]
        item={**self.equation(own,(200,330)),'wideRange':[0.0,0.35],'wideLeftFirst':True}
        result=layout([item],[own,*walls],Box(0,0,400,400),measurements={item['id']:(40,14)})
        self.assertEqual(result['unresolved'],[],result)
        anchor=result['labels'][0]['at']
        self.assertTrue(360-0.35*320-1e-6<=anchor[1]<=360,anchor)       # in the lowest 35 % of the line
        top={**item,'wideRange':[0.65,1.0],'at':(200,60)}
        anchor=layout([top],[own,*walls],Box(0,0,400,400),measurements={top['id']:(40,14)})['labels'][0]['at']
        self.assertLessEqual(anchor[1],40+0.35*320+1e-6)

class NarrowRegionLengthLabelTests(unittest.TestCase):
    """E31 (3): the symbolic length of a side of a narrow triangle (6/a) has no room inside the triangle, and a box beside the side would stand nearer the other side
    than the margin allows: it goes outside on a leader that starts on its own side."""
    def fixtures(self):
        right=line('sR',(160,300),(135,60))                                     # the labelled side
        others=[line('sL',(100,300),(135,60)),line('sBase',(100,300),(160,300))]   # the narrow triangle: 60 px wide at the base, a point at the top
        item=label('tR',(147.5,180),'6/a','EQUATION_LABEL',1,target='sR',lineOwned=True,alternateAt=[[142,225],[153,255]],gaps=[8,6,10,20,32,48])
        return item,[right,*others]
    def test_a_label_too_big_for_the_triangle_stands_outside_it(self):
        item,obstacles=self.fixtures()
        result=layout([item],obstacles,Box(0,0,400,400),measurements={item['id']:(40,44)})
        self.assertEqual(result['unresolved'],[],result)
        box=Box(**result['labels'][0]['box'])
        side_x=lambda y:160-(300-y)*25/240                                      # the labelled side at height y
        self.assertGreaterEqual(box.x,min(side_x(box.y),side_x(box.bottom))-1e-6)

class TickFirstRetryTests(unittest.TestCase):
    def fixtures(self):
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(20,160),(300,160)]}
        tick={'id':'tick-x-3','kind':'line','role':'tick','axis':'x','value':3,'geometry':[(116,160),(116,164)]}
        roof=line('roof',(60,150),(200,150))                       # nothing fits above the axis here
        origin={'id':'O','kind':'point','geometry':(100,160,3)}
        name=label('O-name',(100,160),'O','POINT_NAME',0,directions=('S','SW','W'),gaps=(8,12))      # takes the place under the origin first (priority 0, id before tick-)
        item=label('tick-x-3-label',(116,160),'3','TICK_LABEL',0,tickId='tick-x-3',tickAxis='x',tickValue=3,tickDisplayValue='3',directions=('S','N'),gaps=(8,12,16),allowSuppress=False)
        return item,name,[axis,tick,roof,origin]
    def test_the_tick_number_goes_first_and_the_point_name_moves_aside(self):
        item,name,obstacles=self.fixtures()
        result=layout([name,item],obstacles,Box(0,0,320,220),measurements={item['id']:(14,12),name['id']:(18,16)})
        self.assertEqual(result['unresolved'],[],result)
        placed={row['id']:Box(**row['box']) for row in result['labels']}
        self.assertTrue(tick_box_respects_owner(placed[item['id']],item['at'],'x'))
        self.assertFalse(placed[item['id']].overlaps(placed[name['id']],0))

    def test_a_layout_that_resolved_in_the_first_pass_is_not_reordered(self):
        item,name,obstacles=self.fixtures()
        obstacles=[o for o in obstacles if o['id']!='roof']
        first=layout([name,item],obstacles,Box(0,0,320,220),measurements={item['id']:(14,12),name['id']:(18,16)})
        self.assertEqual(first['unresolved'],[])
        self.assertEqual(first['labels'][0]['id'],'O-name')

if __name__=='__main__':unittest.main()
