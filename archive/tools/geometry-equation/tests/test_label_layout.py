import math,sys,unittest
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
    def test_narrow_wedge_label_moves_farther_inside_instead_of_a_leader_hidden_by_the_rays(self):
        v=(300,300);bis=math.radians(9.5);end=math.radians(19)
        at=[v[0]+32*math.cos(bis),v[1]+32*math.sin(bis)]
        item=label('a-label',at,'19',kind='EQUATION_LABEL',priority=0,
            wedgeSearch={'vertex':list(v),'bisector':bis,'start':0.0,'delta':end,'rMin':32,'rMax':72,'rFar':200,'arcRadius':26},
            gaps=(24,32,48,64),leaderOwned=['arc1'])
        obstacles=[{'id':'ray1','kind':'line','geometry':[list(v),[700,300]]},
            {'id':'ray2','kind':'line','geometry':[list(v),[v[0]+400*math.cos(end),v[1]+400*math.sin(end)]]},
            {'id':'arc1','kind':'curve','geometry':[[v[0]+26*math.cos(bis),v[1]+26*math.sin(bis)]]}]
        r=layout([item],obstacles,Box(0,0,720,600),measurements={'a-label':(40,20)})
        self.assertEqual(r['status'],'PASS',r)
        # Inside the angle without a leader (main's wedge limit may already call this ANGLE_WEDGE_INSIDE).
        self.assertIn(r['labels'][0]['placement'],('ANGLE_WEDGE_INSIDE','ANGLE_WEDGE_INSIDE_FAR'))
        self.assertFalse([l for l in r.get('leaders',[]) if l.get('ownerLabelId')=='a-label' or l.get('labelId')=='a-label'])
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
    def test_point_name_at_a_stroke_hub_goes_into_a_free_sector(self):
        # The centre of a circle drawn with eight radii has no free cardinal direction: the name moves into a sector between two rays.
        point={'id':'O','kind':'point','geometry':(100,100,2)}
        rays=[]
        for k,(dx,dy) in enumerate(((1,0),(1,1),(0,1),(-1,1),(-1,0),(-1,-1),(0,-1),(1,-1))):
            length=math.hypot(dx,dy)
            rays.append({'id':'r%d'%k,'kind':'line','geometry':[(100,100),(100+60*dx/length,100+60*dy/length)]})
        item=label('O-name',(100,100),'O','POINT_NAME',target='O')
        result=layout([item],[point]+rays,Box(0,0,300,200),measurements={'O-name':(15,14)},require_measurements=True)
        self.assertEqual(result['status'],'PASS',result['unresolved'])
        placed=result['labels'][0];box=Box(**placed['box'])
        self.assertEqual(placed['placement'],'POINT_NAME_RING')
        self.assertEqual(result['leaders'],[])
        self.assertFalse(any(collision(box,ray) for ray in rays))
        self.assertLess(math.hypot(box.x+box.width/2-100,box.y+box.height/2-100),70)

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

class AngleLabelOutsideTests(unittest.TestCase):
    """E12: an angle label that finds no room inside its angle goes outside it on a leader that starts ON its own arc and never crosses a line."""
    V=(300.0,300.0)
    def narrow_item(self,delta_deg=20.0,**extra):
        v=self.V;start=-math.radians(90+delta_deg/2);delta=math.radians(delta_deg)   # a wedge opening upward (screen y runs down)
        bis=start+delta/2;arc=28.0
        at=[v[0]+arc*math.cos(bis),v[1]+arc*math.sin(bis)]
        ws={'vertex':list(v),'bisector':bis,'start':start,'delta':delta,'rMin':arc+4,'rMax':arc+44,'rFar':250,'arcRadius':arc,**extra}
        item=label('a-label',at,'20',kind='EQUATION_LABEL',priority=0,target='a',wedgeSearch=ws,gaps=(24,32,48,64),leaderOwned=['arc1'])
        rays=[{'id':'ray1','kind':'line','geometry':[list(v),[v[0]+300*math.cos(start),v[1]+300*math.sin(start)]]},
              {'id':'ray2','kind':'line','geometry':[list(v),[v[0]+300*math.cos(start+delta),v[1]+300*math.sin(start+delta)]]}]
        arc1={'id':'arc1','kind':'curve','geometry':[[v[0]+arc*math.cos(start+delta*i/16),v[1]+arc*math.sin(start+delta*i/16)] for i in range(17)]}
        return item,rays,arc1,start,delta,arc
    def splitter(self):
        return {'id':'split','kind':'line','geometry':[list(self.V),[self.V[0],self.V[1]-300]]}   # a dashed line splitting the wedge along its bisector
    def test_a_crowded_narrow_angle_takes_a_leader_from_the_end_of_its_arc(self):
        item,rays,arc1,start,delta,arc=self.narrow_item()
        r=layout([item],[*rays,arc1,self.splitter()],Box(0,0,720,600),measurements={'a-label':(40,20)})
        self.assertEqual(r['unresolved'],[],r)
        placed=r['labels'][0];self.assertTrue(placed['placement'].startswith('OWNER_LEADER_'),placed['placement'])
        leader=r['leaders'][0];self.assertEqual(leader['ownerLabelId'],'a-label')
        a=leader['from'];self.assertAlmostEqual(math.dist(a,self.V),arc,places=6)             # on the arc's radius ...
        theta=math.atan2(a[1]-self.V[1],a[0]-self.V[0])
        self.assertTrue(min(abs((theta-start+math.pi)%(2*math.pi)-math.pi),abs((theta-start-delta+math.pi)%(2*math.pi)-math.pi))<1e-6)   # ... at an end of the arc
    def test_the_leader_never_crosses_a_drawn_line(self):
        item,rays,arc1,*_=self.narrow_item()
        obstacles=[*rays,arc1,self.splitter()];r=layout([item],obstacles,Box(0,0,720,600),measurements={'a-label':(40,20)})
        a,b=r['leaders'][0]['from'],r['leaders'][0]['to']
        for o in obstacles:
            if o['id']=='arc1':continue
            for c,d in zip(o['geometry'],o['geometry'][1:]):
                u=(b[0]-a[0],b[1]-a[1]);w=(d[0]-c[0],d[1]-c[1]);det=u[0]*w[1]-u[1]*w[0]
                if abs(det)<1e-9:continue
                t=((c[0]-a[0])*w[1]-(c[1]-a[1])*w[0])/det;s=((c[0]-a[0])*u[1]-(c[1]-a[1])*u[0])/det
                self.assertFalse(1e-6<t<1-1e-6 and 1e-6<s<1-1e-6,(o['id'],t,s))
    def test_a_label_never_stands_inside_another_angles_sector(self):
        item,rays,arc1,start,delta,arc=self.narrow_item(delta_deg=60.0)
        wide=[list(self.V),start-math.radians(30),delta+math.radians(60),70.0]   # a wider angle at the same vertex whose sector reaches 70 px
        item['wedgeSearch']['others']=[wide]
        r=layout([item],[*rays,arc1],Box(0,0,720,600),measurements={'a-label':(40,20)})
        self.assertEqual(r['unresolved'],[])
        box=Box(**r['labels'][0]['box']);self.assertFalse(box_in_other_sectors(box,[wide]))
    def test_a_far_label_takes_a_leader_when_the_engine_asks_for_one(self):
        # a 20 degree wedge needs the label far inside it (the existing behaviour); with farDistance the label is tied to the arc instead
        item,rays,arc1,*_=self.narrow_item()
        far=layout([item],[*rays,arc1],Box(0,0,720,600),measurements={'a-label':(40,20)})
        self.assertIn(far['labels'][0]['placement'],('ANGLE_WEDGE_INSIDE','ANGLE_WEDGE_INSIDE_FAR'))
        self.assertGreater(box_point_distance(Box(**far['labels'][0]['box']),self.V),90)
        item2,*_=self.narrow_item(farDistance=90.0)
        near=layout([item2],[*rays,arc1],Box(0,0,720,600),measurements={'a-label':(40,20)})
        self.assertTrue(near['labels'][0]['placement'].startswith('OWNER_LEADER_'),near['labels'][0]['placement'])
        self.assertLessEqual(box_point_distance(Box(**near['labels'][0]['box']),self.V),90)
    def test_the_far_label_is_kept_as_the_last_resort(self):
        item,rays,arc1,*_=self.narrow_item(farDistance=90.0)
        # a wall of lines around the vertex leaves no leader anywhere: the far label is still placed inside the angle (the observer reports ANGLE_LABEL_TOO_FAR)
        wall=[{'id':'wall%d'%k,'kind':'line','geometry':[[self.V[0]-400,self.V[1]-y],[self.V[0]+400,self.V[1]-y]]} for k,y in enumerate((60,75,90,105,120))]
        r=layout([item],[*rays,arc1,*wall],Box(0,0,720,600),measurements={'a-label':(40,20)})
        self.assertIn(r['status'],('PASS','POLISH_REQUIRED'))
    def test_nested_angles_are_retried_narrowest_first_only_when_the_first_pass_fails(self):
        v=self.V;arc=28.0
        def wedge(i,start_deg,delta_deg,ring):
            start=math.radians(start_deg);delta=math.radians(delta_deg);bis=start+delta/2;radius=arc+9*ring
            ws={'vertex':list(v),'bisector':bis,'start':start,'delta':delta,'rMin':radius+4,'rMax':radius+44,'rFar':160,'arcRadius':radius,'others':[]}
            return label(i+'-label',[v[0]+radius*math.cos(bis),v[1]+radius*math.sin(bis)],'80',kind='EQUATION_LABEL',priority=0,target=i,wedgeSearch=ws,gaps=(24,32,48,64),leaderOwned=[i+'-arc'])
        inner=wedge('b',-90.0,80.0,0);outer=wedge('a',-90.0,140.0,1)
        sectors={'a':[list(v),outer['wedgeSearch']['start'],outer['wedgeSearch']['delta'],outer['wedgeSearch']['arcRadius']],'b':[list(v),inner['wedgeSearch']['start'],inner['wedgeSearch']['delta'],inner['wedgeSearch']['arcRadius']]}
        outer['wedgeSearch']['others']=[sectors['b']];inner['wedgeSearch']['others']=[sectors['a']]
        order=sorted([outer,inner],key=angle_labels_first_order)
        self.assertEqual([x['id'] for x in order],['b-label','a-label'])   # narrow first
        r=layout([outer,inner],[],Box(0,0,720,600),measurements={'a-label':(40,20),'b-label':(40,20)})
        self.assertEqual(r['unresolved'],[])
        for row in r['labels']:
            other='a' if row['id']=='b-label' else 'b'
            self.assertFalse(box_in_other_sectors(Box(**row['box']),[sectors[other]]),row['id'])


class TickLabelSlideTests(unittest.TestCase):
    """E20: two tick labels meeting near the origin (x=-1 and y=1) may leave one of them no clean centred box on its axis-normal sides: it then slides
    along its axis by at most the owner-alignment tolerance and still names its own tick. A label that fits centred is placed exactly as before."""
    def fixtures(self,blocker=True):
        tick={'id':'model-y-unit','kind':'line','role':'tick','axis':'y','value':1,'geometry':[(100,100),(96,100)]}
        axis={'id':'y-axis','kind':'axis','role':'axis','axis':'y','geometry':[(100,0),(100,200)]}
        wall={'id':'wall','kind':'line','geometry':[(110,0),(110,200)]}                      # nothing fits east of the tick
        other={'id':'tick-x--1-label','kind':'label','geometry':Box(70,109,30,10)}              # the neighbouring tick label, just below the west boxes
        item=label('tick-y-1-label',(100,100),'1','TICK_LABEL',0,tickId='model-y-unit',tickAxis='y',tickValue=1,tickDisplayValue='1',directions=('W','E'),gaps=(8,12,16),allowSuppress=False)
        return item,[tick,axis,wall,*([other] if blocker else [])]
    def test_a_blocked_centred_label_slides_along_its_axis(self):
        item,obstacles=self.fixtures()
        result=layout([item],obstacles,Box(0,0,300,220),measurements={item['id']:(14,12)},require_measurements=True)
        self.assertEqual(result['unresolved'],[],result)
        placed=result['labels'][0];box=Box(**placed['box'])
        self.assertTrue(placed['placement'].startswith('TICK_SLIDE_'),placed['placement'])
        self.assertTrue(tick_box_respects_owner(box,item['at'],'y'))
        self.assertLessEqual(abs(box.y+box.height/2-100),TICK_LABEL_ALIGNMENT_TOLERANCE)
        self.assertGreater(abs(box.y+box.height/2-100),0)
        self.assertFalse(any(collision(box,o) for o in obstacles))
    def test_a_label_that_fits_centred_is_placed_as_before(self):
        item,obstacles=self.fixtures(blocker=False)
        placed=layout([item],obstacles,Box(0,0,300,220),measurements={item['id']:(14,12)},require_measurements=True)['labels'][0]
        self.assertEqual(placed['placement'],'AUTO_W')
        self.assertAlmostEqual(placed['box']['y']+placed['box']['height']/2,100)
    def test_a_slide_never_leaves_the_owner_alignment(self):
        item,obstacles=self.fixtures()
        obstacles[-1]['geometry']=Box(70,100,30,40)                                        # a tall neighbour: no slide within the tolerance clears it
        result=layout([item],obstacles,Box(0,0,300,220),measurements={item['id']:(14,12)},require_measurements=True)
        self.assertEqual(result['unresolved'],['tick-y-1-label'])


if __name__=='__main__':unittest.main()
