import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.label_layout import *

def label(i,at,text='P',kind='POINT_NAME',priority=1,**more):
    return {'id':i,'kind':kind,'at':at,'text':text,'font':13.25,'priority':priority,**more}

class LayoutTests(unittest.TestCase):
    def test_cluster_name_coordinate(self):
        labels=[];obstacles=[]
        for i,p in enumerate(((160,180),(176.5,163.5),(193,147))):
            labels.extend([label('n'+str(i),p,'P'+str(i)),label('c'+str(i),p,'(3/2,3/2)','COORDINATE_LABEL',2,panelText='P'+str(i)+': (3/2,3/2)')])
            obstacles.append({'id':'p'+str(i),'kind':'point','geometry':(*p,2)})
        r=layout(labels,obstacles,Box(32,32,556,436),Box(440,32,148,436))
        self.assertEqual(r['status'],'PASS')
        for i,a in enumerate(r['labels']):
            a=Box(**a['box'])
            for b in r['labels'][i+1:]:self.assertFalse(a.overlaps(Box(**b['box']),6))
    def test_all_collision_kinds(self):
        b=Box(10,10,30,20)
        fixtures=[('label',Box(15,15,1,1)),('conditionBox',Box(15,15,1,1)),('tick',Box(15,15,1,1)),('point',(20,20,2)),('circle',(20,20,8)),('line',[(0,20),(100,20)]),('axis',[(20,0),(20,100)]),('auxiliary',[(0,20),(100,20)]),('indicator',Box(15,15,1,1)),('curve',[(0,20),(20,20),(100,20)]),('leader',[(0,20),(100,20)])]
        for kind,g in fixtures:
            with self.subTest(kind=kind):self.assertTrue(collision(b,{'kind':kind,'geometry':g}))
    def test_priority_and_determinism(self):
        labels=[label('z',(100,100),priority=4),label('a',(100,100),priority=0)]
        r=layout(labels,[],Box(32,32,556,436))
        self.assertEqual(r,layout(list(reversed(labels)),[],Box(32,32,556,436)))
        self.assertEqual(r['labels'][0]['id'],'a')
    def test_safe_area_and_fixed_font(self):
        r=layout([label('n',(32,32))],[],Box(32,32,556,436))
        self.assertEqual(r['status'],'PASS')
        self.assertEqual(r['labels'][0]['font'],13.25)
        self.assertTrue(Box(32,32,556,436).contains(Box(**r['labels'][0]['box'])))
    def test_explicit_polish(self):
        r=layout([label('n',(50,50),'LONG'*100)],[],Box(32,32,40,40))
        self.assertEqual(r['status'],'POLISH_REQUIRED')
        self.assertEqual(r['unresolved'],['n'])
    def test_optional_suppression(self):
        r=layout([label('tick',(50,50),'LONG'*100,'COORDINATE_LABEL',4,allowSuppress=True)],[],Box(32,32,40,40))
        self.assertEqual(r['suppressed'],['tick'])
    def test_rendered_dimensions_override(self):
        r=layout([label('n',(100,100))],[],Box(32,32,556,436),measurements={'n':(80,30)})
        self.assertEqual(r['labels'][0]['box']['width'],80)
        self.assertEqual(r['labels'][0]['box']['height'],30)
    def test_strict_production_layout_requires_complete_positive_browser_measurements(self):
        item=label('measured',(100,100),kind='EQUATION_LABEL')
        for measurements,code in [
            ({},'BROWSER_LABEL_MEASUREMENT_REQUIRED:measured'),
            ({'measured':(float('nan'),12)},'INVALID_BROWSER_LABEL_MEASUREMENT:measured'),
            ({'measured':(12,0)},'INVALID_BROWSER_LABEL_MEASUREMENT:measured'),
            ({'measured':(12,)},'INVALID_BROWSER_LABEL_MEASUREMENT:measured'),
        ]:
            with self.subTest(measurements=measurements):
                with self.assertRaisesRegex(ValueError,code):layout([item],[],Box(32,32,556,436),measurements=measurements,require_measurements=True)
        placed=layout([item],[],Box(32,32,556,436),measurements={'measured':(80,30)},require_measurements=True)
        self.assertEqual(placed['labels'][0]['box']['width'],80)
    def test_strict_panel_uses_measured_box_and_rejects_unmeasured_text_variant(self):
        safe=Box(0,0,120,100);panel=Box(0,0,120,100)
        same=label('panel',(60,50),'P',kind='EQUATION_LABEL',directions=(),gaps=(),panelText='P')
        placed=layout([same],[],safe,panel,measurements={'panel':(80,30)},require_measurements=True)
        self.assertEqual(placed['labels'][0]['placement'],'SIDE_PANEL')
        self.assertEqual((placed['labels'][0]['box']['width'],placed['labels'][0]['box']['height']),(80,30))
        variant=label('owner-panel',(60,50),'(1,2)',kind='COORDINATE_LABEL',target='A',directions=(),gaps=(),panelText='A: (1,2)',panelPrefix='A: ')
        owner=[{'id':'A','kind':'point','geometry':(60,50,2)}]
        with self.assertRaisesRegex(ValueError,'BROWSER_PANEL_VARIANT_MEASUREMENT_REQUIRED:owner-panel'):
            layout([variant],owner,safe,panel,measurements={'owner-panel':(40,20)},require_measurements=True)
    def test_generic_graph_annotation_keeps_strict_side_panel_behavior(self):
        annotation=label('curve-note',(60,50),'f(x)',kind='GRAPH_ANNOTATION',directions=(),gaps=(),panelText='f(x)')
        placed=layout([annotation],[],Box(0,0,120,100),Box(0,0,120,100),measurements={'curve-note':(40,16)},require_measurements=True)
        self.assertEqual(placed['status'],'PASS')
        self.assertEqual(placed['labels'][0]['placement'],'SIDE_PANEL')
    def test_strict_point_label_stays_in_exact_owners_voronoi_cell(self):
        safe=Box(-40,0,150,100)
        points=[{'id':'A','kind':'point','geometry':(20,50,2)},{'id':'B','kind':'point','geometry':(72,50,2)}]
        ambiguous=label('A-name',(20,50),'A',kind='POINT_NAME',target='A',directions=('E',),gaps=(12,))
        rejected=layout([ambiguous],points,safe,measurements={'A-name':(30,10)},require_measurements=True)
        self.assertEqual(rejected['unresolved'],['A-name'])
        self.assertEqual(rejected['suppressed'],[])
        owned=label('A-name',(20,50),'A',kind='POINT_NAME',target='A',directions=('W',),gaps=(12,))
        accepted=layout([owned],points,safe,measurements={'A-name':(30,10)},require_measurements=True)
        self.assertEqual(accepted['status'],'PASS')
        self.assertEqual(accepted['labels'][0]['placement'],'AUTO_W')
        coordinate=label('A-coordinate',(20,50),'(1,2)',kind='COORDINATE_LABEL',target='A',directions=('E',),gaps=(12,))
        rejected_coordinate=layout([coordinate],points,safe,measurements={'A-coordinate':(30,10)},require_measurements=True)
        self.assertEqual(rejected_coordinate['unresolved'],['A-coordinate'])
        coordinate_west={**coordinate,'directions':('W',)}
        accepted_coordinate=layout([coordinate_west],points,safe,measurements={'A-coordinate':(30,10)},require_measurements=True)
        self.assertEqual(accepted_coordinate['status'],'PASS')
        with self.assertRaisesRegex(ValueError,'POINT_LABEL_OWNER_MARKER_REQUIRED:A-name'):
            layout([owned],[points[1]],safe,measurements={'A-name':(30,10)},require_measurements=True)
    def test_measured_owner_label_relocation_needs_a_clear_owner_leader(self):
        points=[{'id':'A','kind':'point','geometry':(20,50,2)},{'id':'B','kind':'point','geometry':(80,50,2)}]
        blockers=[
            {'id':'center-block','kind':'rectangle','geometry':Box(-2,0,64,100)},
            {'id':'west-near-block','kind':'rectangle','geometry':Box(-25,44,5,12)},
            {'id':'northwest-block','kind':'rectangle','geometry':Box(-12,8,7,10)},
            {'id':'southwest-block','kind':'rectangle','geometry':Box(-12,82,7,10)},
        ]
        safe=Box(-100,0,200,100)
        fragment='sha256:'+'a'*64
        for kind,oid,text in [('POINT_NAME','A-name','A'),('COORDINATE_LABEL','A-coordinate','(1,2)')]:
            item=label(oid,(20,50),text,kind,target='A',directions=DIRECTIONS,gaps=(12,20,32,48),measuredFragmentSha256=fragment,measuredFragmentOwner='A',measuredFactRole='GIVEN')
            result=layout([item],points+blockers,safe,measurements={oid:(30,10)},require_measurements=True)
            # Every relocation now needs a clear owner leader: here the only corridor runs through the blockers, so it stays unresolved.
            self.assertEqual(result['status'],'POLISH_REQUIRED');self.assertEqual(result['unresolved'],[oid]);self.assertEqual(result['repairs'],[]);self.assertEqual(result['leaders'],[])
        constrained=Box(0,0,40,100)
        item=label('A-name',(20,50),'A','POINT_NAME',target='A',directions=DIRECTIONS,gaps=(12,20,32,48),measuredFragmentSha256=fragment,measuredFragmentOwner='A',measuredFactRole='GIVEN')
        rejected=layout([item],points+blockers,constrained,measurements={'A-name':(30,10)},require_measurements=True)
        self.assertEqual(rejected['unresolved'],['A-name'])
        self.assertEqual(rejected['suppressed'],[])
        self.assertEqual(rejected['repairs'],[])
    def test_near_relocated_point_label_gets_a_leader_or_moves_on(self):
        from visual_engine.svg_composer import owner_label_leader_svg
        point={'id':'A','kind':'point','geometry':(100,100,2)}
        item=lambda:label('A-coordinate',(100,100),'(1,2)','COORDINATE_LABEL',target='A',directions=('E',),gaps=(12,8,20,32))
        # Blocks gaps 12 and 8 above and below the corridor; the leader to the gap-20 box passes between them.
        corridor=[{'id':'top','kind':'rectangle','geometry':Box(104,85,8,8)},{'id':'bottom','kind':'rectangle','geometry':Box(104,107,8,8)}]
        result=layout([item()],[point]+corridor,Box(0,0,300,200),measurements={'A-coordinate':(30,10)},require_measurements=True)
        self.assertEqual(result['status'],'PASS')
        self.assertEqual(result['labels'][0]['placement'],'COORDINATE_RELOCATION_E')
        self.assertEqual(result['leaders'],[{'schemaVersion':'OWNER_LABEL_LEADER_v1','id':'A-coordinate-owner-leader','from':[100,100],'to':[120.0,100.0],'ownerLabelId':'A-coordinate','ownerId':'A'}])
        self.assertIn('data-role="leader"',owner_label_leader_svg(result['leaders'][0],result,lambda value:value))
        # A line between the point and every near box blocks each leader: no leaderless near relocation is accepted.
        wall=[{'id':'wall','kind':'line','geometry':[(110,60),(110,140)]}]
        blocked=layout([item()],[point]+wall,Box(0,0,300,200),measurements={'A-coordinate':(30,10)},require_measurements=True)
        self.assertEqual((blocked['unresolved'],blocked['leaders']),(['A-coordinate'],[]))
        # Below 20 px no leader is drawn.
        free=layout([item()],[point],Box(0,0,300,200),measurements={'A-coordinate':(30,10)},require_measurements=True)
        self.assertEqual((free['labels'][0]['placement'],free['leaders']),('AUTO_E',[]))
    def test_a_leader_may_point_away_from_a_segment_ending_at_its_point_and_share_the_point_with_another_leader(self):
        # A segment from A going east does not hide a leader going west; a leader going east along it does.
        self.assertFalse(leader_hides_along((100,100),(70,100),(100,100),(200,100)))
        self.assertTrue(leader_hides_along((100,100),(130,100),(100,100),(200,100)))
        self.assertTrue(leader_hides_along((100,100),(70,100),(0,100),(200,100)))
        point={'id':'A','kind':'point','geometry':(100,100,2)}
        east={'id':'sAB','kind':'line','geometry':[(100,100),(220,100)]}
        name=label('A-name',(100,100),'A','POINT_NAME',target='A',directions=('S',),gaps=(20,))
        coordinate=label('A-coordinate',(100,100),'(1,2)','COORDINATE_LABEL',target='A',directions=('W',),gaps=(20,))
        result=layout([name,coordinate],[point,east],Box(0,0,300,200),measurements={'A-name':(10,10),'A-coordinate':(30,10)},require_measurements=True)
        self.assertEqual(result['status'],'PASS',result['unresolved'])
        self.assertEqual(sorted(v['ownerLabelId'] for v in result['leaders']),['A-coordinate','A-name'])
    def test_point_label_slides_along_its_side_away_from_a_close_point(self):
        points=[{'id':'A','kind':'point','geometry':(100,100,2)},{'id':'B','kind':'point','geometry':(110,100,2)}]
        item=label('A-name',(100,100),'A','POINT_NAME',target='A',directions=('N',),gaps=(12,))
        result=layout([item],points,Box(0,0,300,200),measurements={'A-name':(20,10)},require_measurements=True)
        # Centered above A, the right corners are nearer B; three eighths to the west the whole box is nearer A.
        self.assertEqual(result['status'],'PASS')
        placed=result['labels'][0]
        self.assertEqual((placed['placement'],placed['box']['x'],result['leaders']),('SLIDE_N',82.5,[]))
        self.assertTrue(point_box_has_unambiguous_owner(Box(**placed['box']),points[0],points[1:]))
    def test_leader_names_the_owner_when_every_box_has_a_corner_nearer_another_point(self):
        points=[{'id':'A','kind':'point','geometry':(100,100,2)},{'id':'B','kind':'point','geometry':(109,100,2)}]
        # A wall west of A blocks the westward slides; eastward boxes are nearer B.
        wall={'id':'wall','kind':'line','geometry':[(83,0),(83,200)]}
        item=label('A-name',(100,100),'A','POINT_NAME',target='A',directions=('N',),gaps=(12,20))
        result=layout([item],points+[wall],Box(0,0,300,200),measurements={'A-name':(20,10)},require_measurements=True)
        self.assertEqual(result['status'],'PASS')
        placed=result['labels'][0]
        self.assertEqual(placed['placement'],'OWNER_LEADER_N')
        self.assertFalse(point_box_has_unambiguous_owner(Box(**placed['box']),points[0],points[1:]))
        self.assertEqual([(v['from'],v['to']) for v in result['leaders']],[([100,100],[100.0,80.0])])
        # Without room for a clear leader (B right beside its path) the label stays unresolved.
        crowded=[points[0],{'id':'B','kind':'point','geometry':(107,100,2)}]
        blocked=layout([item],crowded+[wall],Box(0,0,300,200),measurements={'A-name':(20,10)},require_measurements=True)
        self.assertEqual((blocked['unresolved'],blocked['leaders']),(['A-name'],[]))
    def test_tick_label_is_axis_normal_and_owned_by_exact_tick(self):
        tick={'id':'tick-x--2','kind':'line','role':'tick','axis':'x','value':-2,'geometry':[(34.84,156),(34.84,164)]}
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,160),(250,160)]}
        item=label('tick-x--2-label',(34.84,160),'−2','TICK_LABEL',0,tickId='tick-x--2',tickAxis='x',tickValue=-2,tickDisplayValue='−2',directions=('S','N'),gaps=(8,12),allowSuppress=False)
        result=layout([item],[tick,axis],Box(0,0,300,220),Box(180,0,100,220),measurements={item['id']:(14,12)},require_measurements=True)
        self.assertEqual(result['status'],'PASS')
        placed=result['labels'][0]
        self.assertEqual(placed['placement'],'AUTO_N')
        self.assertTrue(tick_box_respects_owner(Box(**placed['box']),item['at'],'x'))
    def test_q13_tick_callout_keeps_exact_owner_and_leader_clearance(self):
        tick={'id':'tick-x--3','kind':'line','role':'tick','axis':'x','value':-6,'geometry':[(100,156),(100,164)]}
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,160),(200,160)]}
        curve={'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(100,190),(140,220)]}
        callout={'schemaVersion':'TICK_LABEL_OWNER_LEADER_v1','tickId':'tick-x--3','axis':'x','value':-6,'sourceAt':[100,160],'offsetUser':[28,-22]}
        item=label('tick-x--3-label',(100,160),'−6','TICK_LABEL',0,tickId='tick-x--3',tickAxis='x',tickValue=-6,tickDisplayValue='−6',directions=('S','N'),gaps=(8,12),tickLabelCallout=callout)
        result=layout([item],[tick,axis,curve],Box(0,0,200,240),measurements={item['id']:(27,16)},require_measurements=True)
        self.assertEqual(result['status'],'PASS',result['unresolved'])
        self.assertEqual(result['labels'][0]['placement'],'OWNER_BOUND_TICK_LEADER')
        self.assertEqual(len(result['leaders']),1)
        leader=result['leaders'][0]
        self.assertEqual((leader['tickId'],leader['axis'],leader['value']),('tick-x--3','x',-6))
        self.assertEqual(leader['from'],[100,160])
        self.assertTrue(Box(**result['labels'][0]['box']).x<=leader['to'][0]<=Box(**result['labels'][0]['box']).right)
        self.assertAlmostEqual(leader['to'][1],Box(**result['labels'][0]['box']).bottom)
    def test_tick_label_cannot_fallback_to_panel_or_suppression(self):
        tick={'id':'tick-x--2','kind':'line','role':'tick','axis':'x','value':-2,'geometry':[(34.84,156),(34.84,164)]}
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,160),(250,160)]}
        blocks=[{'id':'all','kind':'rectangle','geometry':Box(0,0,250,220)}]
        item=label('tick-x--2-label',(34.84,160),'−2','TICK_LABEL',0,tickId='tick-x--2',tickAxis='x',tickValue=-2,tickDisplayValue='−2',directions=('S','N'),gaps=(8,12),allowSuppress=True)
        result=layout([item],[tick,axis,*blocks],Box(0,0,300,220),Box(260,0,40,220),measurements={item['id']:(14,12)},require_measurements=True)
        self.assertEqual(result['status'],'POLISH_REQUIRED')
        self.assertEqual(result['unresolved'],[item['id']])
        self.assertEqual(result['suppressed'],[])
    def test_required_tick_crossing_curve_never_passes_with_masking(self):
        tick={'id':'tick-x-1','kind':'line','role':'tick','axis':'x','value':1,'geometry':[(100,96),(100,104)]}
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,100),(200,100)]}
        curve={'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(100,40),(100,160)]}
        item=label('tick-x-1-label',(100,100),'1','TICK_LABEL',0,tickId='tick-x-1',tickAxis='x',tickValue=1,tickDisplayValue='1',directions=('S','N'),gaps=(8,12,16),allowSuppress=False)
        result=layout([item],[tick,axis,curve],Box(0,0,200,200),measurements={item['id']:(12,12)},require_measurements=True)
        self.assertEqual(result['status'],'POLISH_REQUIRED')
        self.assertEqual(result['suppressed'],[])
        self.assertEqual(result['unresolved'],[item['id']])
        self.assertFalse(any('tickLabelKnockout' in row for row in result['labels']+result['trace']))
    def test_tick_with_curve_and_point_obstacles_remains_unresolved_without_mask(self):
        tick={'id':'tick-x-1','kind':'line','role':'tick','axis':'x','value':1,'geometry':[(100,96),(100,104)]}
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,100),(200,100)]}
        curve={'id':'f-branch-0','kind':'curve','role':'curve','geometry':[(100,40),(100,160)]}
        points=[{'id':'protected-feature-north','kind':'point','geometry':(100,86,2)},
                {'id':'protected-feature-south','kind':'point','geometry':(100,118,2)}]
        item=label('tick-x-1-label',(100,100),'1','TICK_LABEL',0,tickId='tick-x-1',tickAxis='x',tickValue=1,tickDisplayValue='1',directions=('S','N'),gaps=(8,12,16),allowSuppress=True)
        result=layout([item],[tick,axis,curve,*points],Box(0,0,200,200),measurements={item['id']:(12,12)},require_measurements=True)
        self.assertEqual(result['status'],'POLISH_REQUIRED')
        self.assertEqual(result['unresolved'],[item['id']])
        self.assertEqual(result['suppressed'],[])
        self.assertEqual(result['repairs'],[])
    def test_tick_label_requires_exact_axis_and_value_binding(self):
        axis={'id':'x-axis','kind':'axis','role':'axis','axis':'x','geometry':[(0,100),(200,100)]}
        tick={'id':'tick-x-1','kind':'line','role':'tick','axis':'x','value':2,'geometry':(100,96,100,104)}
        item=label('tick-label',(100,100),'2','TICK_LABEL',0,tickId='tick-x-1',tickAxis='x',tickValue=1,tickDisplayValue='2')
        with self.assertRaisesRegex(ValueError,'TICK_LABEL_OWNER_TICK_REQUIRED'):
            layout([item],[axis,tick],Box(0,0,200,200),measurements={item['id']:(10,12)},require_measurements=True)
    def test_circle_and_segment_boundary(self):
        self.assertFalse(collision(Box(15,15,10,10),{'kind':'circle','geometry':(20,20,100)},0))
        self.assertTrue(segment_hits_box((0,0),(100,100),Box(40,40,10,10)))
    def test_line_equation_label_leader_or_unambiguous(self):
        own={'id':'L0','kind':'line','geometry':[(100,80),(100,280)]}
        near={'id':'L1','kind':'line','geometry':[(130,80),(130,280)]}
        left={'id':'L3','kind':'line','geometry':[(70,80),(70,280)]}
        far={'id':'L2','kind':'line','geometry':[(300,80),(300,280)]}
        # A box beside its own line with another line close by is ambiguous; with the other line far away it needs no leader.
        self.assertFalse(line_label_unambiguous(Box(104,150,20,10),own,[near]))
        self.assertTrue(line_label_unambiguous(Box(104,150,20,10),own,[far]))
        # Anchored at the top end with a neighbour on each side, no near box names its line: it is tied back by a visible owner leader.
        eq=label('L0-equation',(100,80),'y=-2x+1','EQUATION_LABEL',target='L0',lineOwned=True)
        r=layout([eq],[own,near,left],Box(0,0,400,400))
        self.assertEqual(r['unresolved'],[])
        self.assertTrue(r['labels'][0]['placement'].startswith('OWNER_LEADER_'))
        self.assertEqual([v['ownerId'] for v in r['leaders']],['L0'])
        # Without lineOwned the same label keeps the ordinary behavior (no leader).
        plain=layout([{**eq,'lineOwned':False}],[own,near,left],Box(0,0,400,400))
        self.assertEqual(plain['leaders'],[])

if __name__=='__main__':unittest.main()
