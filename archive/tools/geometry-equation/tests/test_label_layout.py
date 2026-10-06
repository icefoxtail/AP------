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
    def test_measured_owner_label_uses_bounded_extended_relocation_without_suppression(self):
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
            self.assertEqual(result['status'],'PASS')
            self.assertEqual(result['unresolved'],[])
            self.assertEqual(result['suppressed'],[])
            self.assertEqual(len(result['repairs']),1)
            repair=result['repairs'][0]
            self.assertEqual(repair['failureClass'],'OWNER_LABEL_NO_DEFAULT_CANDIDATE')
            self.assertEqual((repair['labelKind'],repair['ownerId'],repair['factRole']),(kind,'A','GIVEN'))
            self.assertEqual(repair['measuredFragmentSha256'],fragment)
            self.assertEqual(repair['selected']['direction'],'W')
            self.assertEqual(repair['selected']['gap'],64)
            placed=next(value for value in result['labels'] if value['id']==oid)
            box=Box(**placed['box'])
            self.assertTrue(point_box_has_unambiguous_owner(box,points[0],points[1:]))
        constrained=Box(0,0,40,100)
        item=label('A-name',(20,50),'A','POINT_NAME',target='A',directions=DIRECTIONS,gaps=(12,20,32,48),measuredFragmentSha256=fragment,measuredFragmentOwner='A',measuredFactRole='GIVEN')
        rejected=layout([item],points+blockers,constrained,measurements={'A-name':(30,10)},require_measurements=True)
        self.assertEqual(rejected['unresolved'],['A-name'])
        self.assertEqual(rejected['suppressed'],[])
        self.assertEqual(rejected['repairs'],[])
    def test_circle_and_segment_boundary(self):
        self.assertFalse(collision(Box(15,15,10,10),{'kind':'circle','geometry':(20,20,100)},0))
        self.assertTrue(segment_hits_box((0,0),(100,100),Box(40,40,10,10)))

if __name__=='__main__':unittest.main()
