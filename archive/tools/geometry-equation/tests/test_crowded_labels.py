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
from visual_engine.label_layout import Box,layout,leader_crossed_strokes,crossing_leader_placement,segment_hits_box,CROSSING_LEADER_MAX_CROSSINGS

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


def arc_points(v,radius,start,delta,steps=24):
    return [[v[0]+radius*math.cos(start+delta*i/steps),v[1]+radius*math.sin(start+delta*i/steps)] for i in range(steps+1)]

class LastResortCrossingTests(unittest.TestCase):
    """(FC) The last resort of an angle label, a coordinate label on a curve, and the tick callout leader of a point on a curve."""

    def angle_cell(self):
        # triangle ABC (apex side BC on top) with O inside; the angle BOC is split by OE (E on BC), so every place outside the angle is beyond a stroke
        v=(210.0,130.0);b=(190.0,70.0);c=(230.0,70.0);e=(210.0,70.0);a=(210.0,280.0)
        start=math.atan2(b[1]-v[1],b[0]-v[0]);delta=math.atan2(c[1]-v[1],c[0]-v[0])-start
        arc=arc_points(v,20.0,start,delta)
        obstacles=[edge('AB',a,b),edge('AC',a,c),edge('BC',b,c),edge('OB',v,b),edge('OC',v,c),edge('OE',v,e),{'id':'arc1','kind':'curve','geometry':arc},point('O',v)]
        mid=start+delta/2
        item={'id':'a1-label','kind':'EQUATION_LABEL','target':'a1','at':[v[0]+24*math.cos(mid),v[1]+24*math.sin(mid)],'text':'BOC=2A','font':13.25,'priority':0,
            'wedgeSearch':{'vertex':list(v),'bisector':mid,'start':start,'delta':delta,'rMin':24,'rMax':44,'rFar':60,'arcRadius':20.0},'gaps':(24,32,48,64),'leaderOwned':['arc1']}
        return item,obstacles

    def test_an_angle_label_shut_in_by_its_figure_takes_a_leader_that_crosses_one_stroke_only_in_the_last_resort(self):
        item,obstacles=self.angle_cell()
        first=layout([item],obstacles,SAFE,measurements={'a1-label':(60,18)},require_measurements=True,last_resort=False)
        self.assertEqual(first['unresolved'],['a1-label'],'the ordinary layout never takes a crossing leader')
        again=layout([item],obstacles,SAFE,measurements={'a1-label':(60,18)},require_measurements=True,last_resort=True)
        self.assertEqual(again['unresolved'],[])
        leader=[row for row in again['leaders'] if row['ownerLabelId']=='a1-label'][0]
        self.assertTrue(leader['crossFallback'])
        start=tuple(leader['from']);self.assertAlmostEqual(math.dist(start,(210,130)),20.0,places=3,msg='the leader starts on the angle\'s own arc')
        crossed=leader_crossed_strokes(start,tuple(leader['to']),obstacles,{'arc1','OB','OC'})
        self.assertTrue(crossed and sum(crossed.values())<=CROSSING_LEADER_MAX_CROSSINGS)
        self.assertNotIn('OB',crossed);self.assertNotIn('OC',crossed)   # the angle's own rays are never crossed

    def test_an_angle_label_with_room_gets_no_crossing_leader_in_the_last_resort(self):
        item,obstacles=self.angle_cell()
        obstacles=[o for o in obstacles if o['id'] in {'OB','OC','arc1','O'}]   # an open angle: its label has room outside the figure's strokes
        result=layout([item],obstacles,SAFE,measurements={'a1-label':(60,18)},require_measurements=True,last_resort=True)
        self.assertEqual(result['unresolved'],[])
        self.assertEqual([row for row in result['leaders'] if row.get('crossFallback')],[])

    def test_a_dot_on_a_sampled_curve_is_the_curves_own_ground_for_a_crossing_leader(self):
        # the dot lies 0.002 px off the sampled polyline (curve samples never hit an exact value): the curve through it is not a stroke the leader crosses
        at=(200.0,150.0)
        curve={'id':'f-piece-1-branch-0','kind':'curve','geometry':[(100.0,150.002),(200.0,150.002),(300.0,150.002)]}
        wall=[edge('w%d'%k,(200+dx,60),(200+dx,240)) for k,dx in enumerate((-60,60))]
        label={'id':'P-coordinates','kind':'COORDINATE_LABEL','target':'P','at':list(at),'text':'(3/2,-27/4)','font':12.0,'priority':0,'exact':['3/2','-27/4']}
        obstacles=[point('P',at),curve]+wall
        found=crossing_leader_placement(at,40,20,obstacles,lambda box,owner_check=True:box.x>=0 and box.y>=0 and box.right<=400 and box.bottom<=300 and not any(segment_hits_box(*o['geometry'][:2],box) for o in obstacles if o['kind']=='line' and o['id'].startswith('w')),{'P'})
        self.assertIsNotNone(found,'the curve through the dot is its own ground, the wall beyond is the one stroke crossed')
        self.assertEqual(found[2],1)

    def test_a_tick_number_on_a_point_where_a_trig_curve_crosses_the_axis_takes_a_callout_leader(self):
        tick={'id':'tick-x-3','kind':'line','role':'tick','axis':'x','value':3,'geometry':[(100,156),(100,164)]}
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,160),(200,160)]}
        curve={'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(70,190),(100,160),(130,130)]}   # rising through the tick: below left and above right
        item={'id':'tick-x-3-label','kind':'TICK_LABEL','at':[100,160],'text':'π','font':11.5,'priority':0,'tickId':'tick-x-3','tickAxis':'x','tickValue':3.0,'tickDisplayValue':'π','directions':('S','N'),'gaps':(8,12)}
        dot={'id':'trig-key--1','kind':'circle','geometry':(100,160,3.2)}   # the key dot on the tick: the curve runs through it
        result=layout([item],[tick,axis,curve,dot],Box(0,0,200,240),measurements={item['id']:(20,16)},require_measurements=True)
        self.assertEqual(result['unresolved'],[])
        self.assertEqual(result['labels'][0]['placement'],'OWNER_BOUND_TICK_LEADER')
        bare=layout([item],[tick,axis,curve],Box(0,0,200,240),measurements={item['id']:(20,16)},require_measurements=True)
        # (PN6, 2026-11-24) a curve that crosses the axis at the tick is the tick's ground with or without a dot: the leader leaves it at its start (verify-rendered-layout.mjs ownerLeaderClearance
        # already allows exactly this). The old rule refused it and dropped the tick number of a root or of a constant function's value (y=1 on y=(x-1)/(x-1)).
        self.assertEqual(bare['unresolved'],[])
        self.assertEqual(bare['labels'][0]['placement'],'OWNER_BOUND_TICK_LEADER')

class AxisValueLabelTests(unittest.TestCase):
    """(AXV) A label that names a value on an axis (an interval end -4π/3 or 9π on x, an intercept on y) reads as that axis's tick of its own value, or it is refused.
    One rule for both axes and every graph kind (axisValue + axisAnchor on the label); the ordinary place is kept when it already reads as the tick."""
    XAXIS={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,160),(300,160)]}
    YAXIS={'id':'y-axis','kind':'axis','role':'axis','axis':'y','geometry':[(100,0),(100,240)]}
    def xlabel(self,at=(100.0,160.0)):
        return {'id':'interval-end-label','kind':'GRAPH_ANNOTATION','at':list(at),'text':'9π','font':13,'priority':0,'gaps':(12,20,32,48),'axisValue':'x','axisAnchor':[100.0,160.0]}
    def ylabel(self,at=(100.0,160.0)):
        return {'id':'intercept-label','kind':'GRAPH_ANNOTATION','at':list(at),'text':'3','font':13,'priority':0,'gaps':(12,20,32,48),'axisValue':'y','axisAnchor':[100.0,160.0]}
    def unbound(self,item):return {k:v for k,v in item.items() if k not in {'axisValue','axisAnchor'}}
    def run_label(self,item,obstacles,axes=None):
        return layout([item],(axes or [self.XAXIS])+obstacles,Box(0,0,300,240),measurements={item['id']:(22,16)},require_measurements=True)
    def test_a_label_whose_ordinary_place_already_reads_as_its_tick_keeps_that_place_exactly(self):
        item=self.xlabel()
        kept=self.run_label(item,[]);before=self.run_label(self.unbound(item),[])
        self.assertEqual(kept['unresolved'],[])
        self.assertEqual(kept['labels'][0]['box'],before['labels'][0]['box'],'no axis binding changes a place that was already right')
        self.assertEqual(kept['labels'][0]['placement'],before['labels'][0]['placement'])
    def test_a_label_the_ordinary_attempt_left_far_from_its_axis_is_put_beside_its_own_x(self):
        item=self.xlabel(at=(100.0,216.0))   # the anchor 56 px below the axis (7% of a tall viewport and more): the ordinary gaps leave the box 28 px from the axis
        far=Box(**self.run_label(self.unbound(item),[])['labels'][0]['box'])
        self.assertGreater(min(abs(far.y-160),abs(160-far.bottom)),16.0,'the ordinary place leaves the box far below its axis: it floats like a y value (this is how -pi and 9pi were detached)')
        result=self.run_label(item,[])
        self.assertEqual(result['unresolved'],[])
        box=Box(**result['labels'][0]['box'])
        self.assertLessEqual(abs(box.x+box.width/2-100.0),4.0)
        self.assertTrue(-.01<=box.y-160<=16.0 or -.01<=160-box.bottom<=16.0,'one text line from the axis')
        self.assertEqual(result['leaders'],[])
    def test_a_curve_under_the_label_sends_it_to_the_other_side_of_the_axis_within_one_line(self):
        curve={'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(60,200),(100,176),(140,200)]}
        result=self.run_label(self.xlabel(at=(100.0,181.0)),[curve])
        self.assertEqual(result['unresolved'],[])
        box=Box(**result['labels'][0]['box'])
        self.assertTrue(-.01<=160-box.bottom<=16.0)
    def test_when_both_sides_of_its_own_x_are_shut_the_label_is_refused_not_taken_far_away(self):
        below={'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(60,176),(100,176),(140,176)]}
        above={'id':'g-branch-0','kind':'curve','role':'curve','geometry':[(60,144),(100,144),(140,144)]}
        item=self.xlabel(at=(100.0,181.0))
        result=self.run_label(item,[below,above])
        self.assertEqual(result['unresolved'],[item['id']],'no place that reads as its own tick: refused, never another line label or a y value place')
        self.assertEqual((result['labels'],result['leaders']),([],[]))
        free=self.run_label(self.unbound(item),[below,above])
        self.assertEqual(free['unresolved'],[],'without the binding it would have been kept somewhere far, which is the defect')
    def test_the_y_axis_is_the_same_rule_on_its_own_side(self):
        item=self.ylabel(at=(70.0,160.0))   # 30 px left of the y axis: the ordinary place
        result=self.run_label(item,[],[self.YAXIS])
        self.assertEqual(result['unresolved'],[])
        box=Box(**result['labels'][0]['box'])
        self.assertLessEqual(abs(box.y+box.height/2-160.0),4.0)
        self.assertTrue(-.01<=100-box.right<=16.0 or -.01<=box.x-100<=16.0)
        shut=[{'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(84,100),(84,220)]},{'id':'g-branch-0','kind':'curve','role':'curve','geometry':[(116,100),(116,220)]}]
        self.assertEqual(self.run_label(item,shut,[self.YAXIS])['unresolved'],[item['id']])
    def test_another_graph_kind_through_the_whole_engine_follows_the_same_rule(self):
        # a cubic (not a trig or piecewise graph): an x value and a y value named far from their axes are brought beside their own ticks, bound in the final SVG
        sys.path.insert(0,str(Path(__file__).resolve().parent))
        from test_engine import spec
        from visual_engine.engine import build
        import xml.etree.ElementTree as ET
        s=spec();s['id']='axv-cubic';s['visualType']='function_graph';s['viewport']={'xMin':-2,'xMax':2,'yMin':-2,'yMax':2}
        s['objects']=[{'id':'g','kind':'FUNCTION_GRAPH','expression':'x^3','domain':[-2,2]},
            {'id':'x-end','kind':'GRAPH_ANNOTATION','text':'1.5','at':[1.5,-1.4],'math':True,'axisValue':'x','axisAt':[1.5,0],'priority':0},
            {'id':'y-end','kind':'GRAPH_ANNOTATION','text':'1.2','at':[-1.4,1.2],'math':True,'axisValue':'y','axisAt':[0,1.2],'priority':0}]
        result=build(s);self.assertEqual(result['witness']['layout']['unresolved'],[])
        boxes={row['id']:row['box'] for row in result['witness']['layout']['labels']}
        nodes={row.get('id'):row for row in ET.fromstring(result['svg']).iter() if row.get('id') in {'x-end','y-end'}}
        self.assertEqual({k:v.get('data-axis-value') for k,v in nodes.items()},{'x-end':'x','y-end':'y'})
        x,y=boxes['x-end'],boxes['y-end']
        ax_y=float(nodes['x-end'].get('data-axis-source-y'));ax_x=float(nodes['y-end'].get('data-axis-source-x'))
        self.assertTrue(-.01<=x['y']-ax_y<=16.0 or -.01<=ax_y-(x['y']+x['height'])<=16.0)
        self.assertTrue(-.01<=y['x']-ax_x<=16.0 or -.01<=ax_x-(y['x']+y['width'])<=16.0)
        marks={row.get('id'):row for row in ET.fromstring(result['svg']).iter() if row.get('data-role')=='axis-value-mark'}
        self.assertEqual(set(marks),{'x-end-axis-mark','y-end-axis-mark'},'a label put on its axis gets a short mark at its value, so the number has a position to point at')
