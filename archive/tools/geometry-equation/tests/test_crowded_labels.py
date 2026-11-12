"""Crowded labels (CL): a point name's last-resort leader across thin strokes, and the automatic frame that reaches an overlay line.
The layout cases call label_layout.layout directly (no browser); the frame cases call graph_framing.fit_overview."""
import copy
import math
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'production'))
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from graph_framing import fit_overview
from visual_engine.label_layout import Box,layout,leader_crossed_strokes,CROSSING_LEADER_MAX_CROSSINGS

SAFE=Box(0,0,400,300)
def name(ident,at,text='G'):
    return {'id':ident+'-name','kind':'POINT_NAME','target':ident,'at':list(at),'text':text,'font':13.25,'priority':1}
def point(ident,at):return {'id':ident,'kind':'point','geometry':(at[0],at[1],3)}
def edge(ident,a,b):return {'id':ident,'kind':'line','geometry':[a,b]}
def triangle(prefix,cx,cy,half):
    a,b,c=(cx-half,cy-half*.8),(cx+half,cy-half*.8),(cx,cy+half)
    return [edge(prefix+'1',a,b),edge(prefix+'2',b,c),edge(prefix+'3',c,a)]
def ring(cx,cy,radius,count=8):
    return [point('M%d'%k,(cx+radius*math.cos(2*math.pi*k/count+.2),cy+radius*math.sin(2*math.pi*k/count+.2))) for k in range(count)]
def run(labels,obstacles,last_resort=True):return layout(labels,obstacles,SAFE,measurements={l['id']:(20,20) for l in labels},require_measurements=True,last_resort=last_resort)

class CrossingLeaderTests(unittest.TestCase):
    def test_point_in_a_small_triangle_gets_a_leader_that_crosses_one_edge(self):
        obstacles=[point('G',(200,150))]+triangle('t',200,150,22)+ring(200,150,48)   # the ring of other points makes a leaderless name beside G ambiguous
        result=run([name('G',(200,150))],obstacles)
        self.assertEqual(result['unresolved'],[])
        leader=result['leaders'][0]
        self.assertTrue(leader['crossFallback'])
        self.assertEqual(leader['from'],[200,150])
        crossed=leader_crossed_strokes(tuple(leader['from']),tuple(leader['to']),obstacles,{'G'})
        self.assertEqual(sum(crossed.values()),1)
        box=Box(**result['labels'][0]['box'])
        self.assertFalse(Box(178,130,44,44).overlaps(box,0),'the name stands outside the triangle')
        self.assertIn(result['labels'][0]['placement'],{'OWNER_LEADER_'+d for d in ('N','NE','E','SE','S','SW','W','NW')})

    def test_the_ordinary_layout_never_takes_a_crossing_leader(self):
        obstacles=[point('G',(200,150))]+triangle('t',200,150,22)+ring(200,150,48)
        result=run([name('G',(200,150))],obstacles,last_resort=False)
        self.assertEqual(result['unresolved'],['G-name'])
        self.assertEqual(result['leaders'],[])

    def test_a_segment_label_on_part_of_a_longer_segment_is_placed_only_by_the_last_resort(self):
        # the radius OM (0,0)-(60,0) lies on the diameter OA (0,0)-(120,0): beside OM the longer segment is as near as OM itself
        owner={'id':'sMO','kind':'line','geometry':[(100,150),(160,150)]}
        longer={'id':'sOA','kind':'line','geometry':[(100,150),(220,150)]}
        label={'id':'radius','kind':'EQUATION_LABEL','target':'sMO','at':[130,150],'text':'5','font':13.25,'priority':1,'lineOwned':True,'alternateAt':[],'gaps':[8,6,10,20,32,48]}
        first=run([label],[owner,longer],last_resort=False)
        again=run([label],[owner,longer],last_resort=True)
        self.assertEqual(first['unresolved'],['radius'])
        self.assertEqual(again['unresolved'],[])
        self.assertEqual(run([label],[owner],last_resort=False)['unresolved'],[],'without the longer segment the label never needed the last resort')

    def test_a_name_with_room_gets_no_crossing_leader(self):
        result=run([name('G',(200,150))],[point('G',(200,150))])
        self.assertEqual(result['unresolved'],[])
        self.assertEqual([leader for leader in result['leaders'] if leader.get('crossFallback')],[])

    def test_other_labels_keep_their_places_when_one_name_needs_the_crossing(self):
        base=triangle('t',200,150,22)+ring(200,150,48)
        obstacles=[point('G',(200,150)),point('H',(340,40))]+base
        alone=run([name('H',(340,40),'H')],[point('H',(340,40))]+base)
        both=run([name('G',(200,150)),name('H',(340,40),'H')],obstacles)
        self.assertEqual(both['unresolved'],[])
        self.assertEqual([l['box'] for l in both['labels'] if l['id']=='H-name'],[l['box'] for l in alone['labels']])

    def test_crossing_point_leader_keeps_the_tick_callout_under_a_segment(self):
        tick_id = 'tick-y--5'
        tick_label = {
            'id': tick_id+'-label', 'kind': 'TICK_LABEL', 'at': [100,160],
            'text': '−5', 'font': 13.25, 'priority': 0, 'tickId': tick_id,
            'tickAxis': 'y', 'tickValue': -5, 'tickDisplayValue': '−5',
            'directions': ('W','E'), 'gaps': (8,12), 'allowSuppress': False,
        }
        obstacles = [
            {'id': tick_id, 'kind': 'line', 'role': 'tick', 'axis': 'y',
             'value': -5, 'geometry': [(100,160),(96,160)]},
            {'id': 'y-axis', 'kind': 'axis', 'role': 'axis', 'axis': 'y',
             'geometry': [(100,0),(100,300)]},
            edge('segmentAB',(20,160),(180,160)),
            point('G',(270,150)),
            *triangle('t',270,150,22),
            *ring(270,150,48),
        ]
        labels = [tick_label, name('G',(270,150))]
        standard = run(labels,obstacles,last_resort=False)
        self.assertEqual(standard['unresolved'],['G-name'])
        tick = next(row for row in standard['labels'] if row['id']==tick_label['id'])
        self.assertEqual(tick['placement'],'OWNER_BOUND_TICK_LEADER')

        last = run(labels,obstacles)
        self.assertEqual(last['unresolved'],[])
        self.assertEqual(next(row for row in last['labels'] if row['id']==tick_label['id']),tick)
        self.assertTrue(any(leader.get('crossFallback') for leader in last['leaders']))

    def test_three_nested_triangles_are_too_many_crossings(self):
        obstacles=[point('G',(200,150))]+triangle('a',200,150,22)+triangle('b',200,150,30)+triangle('c',200,150,38)+ring(200,150,56)
        result=run([name('G',(200,150))],obstacles)
        self.assertEqual(result['unresolved'],['G-name'])
        self.assertEqual(CROSSING_LEADER_MAX_CROSSINGS,2)

    def test_a_crossing_at_a_shallow_angle_or_through_a_point_marker_is_refused(self):
        start,end=(0.0,0.0),(60.0,0.0)
        self.assertIsNone(leader_crossed_strokes(start,end,[edge('shallow',(10,-8),(50,2))],set()))     # about 14 degrees
        self.assertEqual(leader_crossed_strokes(start,end,[edge('steep',(30,-20),(30,20))],set()),{'steep':1})
        self.assertIsNone(leader_crossed_strokes(start,end,[edge('corner',(30,-20),(30,2))],set()))      # ends 2 px past the leader
    def test_own_lines_through_the_point_are_touched_at_the_start_only(self):
        start,end=(0.0,0.0),(60.0,0.0)
        self.assertEqual(leader_crossed_strokes(start,end,[edge('own',(0,0),(0,40))],{'own'}),{})
        self.assertIsNone(leader_crossed_strokes(start,end,[edge('own',(20,-20),(20,20))],{'own'}))

HYOCHEON_Q08={'family':'piecewise-polynomial','pieces':[{'coefficients':['1','-2']},{'coefficients':['3','0']},{'coefficients':['-1','2']}],
  'breakpoints':[{'x':'-1','y':'3'},{'x':'2','y':'3'}],'sourceDomain':{'kind':'ALL_REALS'},
  'requiredPoints':[{'id':'K','x':-1,'y':3},{'id':'R','x':2,'y':3}],'axisTickValues':{'x':['-2','-1','2','3'],'y':[]},'curveColor':'BLUE',
  'overlays':{'lines':[{'id':'ln','slope':'0','intercept':'5','label':'y=5','color':'WARM','labelAt':'END'}]}}
class OverlayLineFrameTests(unittest.TestCase):
    def test_the_frame_widens_once_to_reach_a_line_the_automatic_window_missed(self):
        graph=fit_overview(copy.deepcopy(HYOCHEON_Q08))['graphPlan']
        window=graph['viewport']
        self.assertLess(window[2],5);self.assertGreater(window[3],5)
        self.assertEqual(graph['overlaysFeatures']['lines'][0]['id'],'ln')
    def test_a_line_the_window_already_reaches_does_not_change_the_frame(self):
        inside=copy.deepcopy(HYOCHEON_Q08);inside['overlays']['lines'][0].update(intercept='1',label='y=1')
        plain=copy.deepcopy(inside);del plain['overlays']
        a=fit_overview(inside)['graphPlan']['viewport'];b=fit_overview(plain)['graphPlan']['viewport']
        self.assertEqual(a,b)
    def test_an_author_viewport_is_never_widened(self):
        plan=copy.deepcopy(HYOCHEON_Q08);plan['viewport']=[-3,4,-1,4];plan['domain']=[-3,4]
        with self.assertRaisesRegex(ValueError,'OVERLAY_LINE_OUTSIDE_VIEWPORT:ln'):fit_overview(plan)
    def test_a_vertical_line_outside_the_window_widens_it_too(self):
        plan=copy.deepcopy(HYOCHEON_Q08);plan['overlays']['lines']=[{'id':'vx','x':'9','label':'x=9'}]
        window=fit_overview(plan)['graphPlan']['viewport']
        self.assertGreater(window[1],9)

if __name__=='__main__':unittest.main()
