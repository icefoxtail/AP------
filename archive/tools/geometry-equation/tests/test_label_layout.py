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
    def test_circle_and_segment_boundary(self):
        self.assertFalse(collision(Box(15,15,10,10),{'kind':'circle','geometry':(20,20,100)},0))
        self.assertTrue(segment_hits_box((0,0),(100,100),Box(40,40,10,10)))

if __name__=='__main__':unittest.main()
