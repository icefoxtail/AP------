"""A point's coordinate / value label must read as that point's: never across another line from its point, never nearer another point than its own, and a leader (not a far
free box) once it stands farther than NEAR_RELOCATION_LEADER_MIN_GAP from the point. A label with no free place is left unresolved (so the coordinate-placement ladder can move it
to the band) instead of stopping the build with a worker error."""
import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.label_layout import *

SAFE=Box(12,12,560,400)
W,H=60.0,16.0

def coordinate_label(i,target,at):
    return {'id':i,'kind':'COORDINATE_LABEL','target':target,'at':at,'text':'(1, 2)','font':13.25,'priority':0}

def point(i,at):return {'id':i,'kind':'point','role':'point','geometry':(at[0],at[1],3.5)}

def run(labels,obstacles):
    measurements={label['id']:(W,H) for label in labels}
    return layout(labels,obstacles,SAFE,None,measurements,require_measurements=True)

class CoordinateLabelOwner(unittest.TestCase):
    def test_label_is_not_put_across_a_line_from_its_point(self):
        # a horizontal line 5 px above the point: the box above it would read as beyond the line
        line={'id':'l','kind':'line','role':'line','geometry':[(0,195),(560,195)]}
        label={**coordinate_label('A-coordinates','A',(200,200)),'directions':('N',),'gaps':(12,)}   # the only side asked for is the one beyond the line
        r=run([label],[point('A',(200,200)),line])
        for row in r['labels']:
            box=Box(**row['box'])
            self.assertGreater(box.y+box.height/2,195,'beyond the line from its own point')

    def test_label_nearer_another_point_is_not_accepted(self):
        # B stands 20 px right of A: the box right of A would be nearer B than A
        r=run([coordinate_label('A-coordinates','A',(200,200))],[point('A',(200,200)),point('B',(222,200))])
        self.assertEqual(r['status'],'PASS')
        box=Box(**r['labels'][0]['box'])
        own=box_point_distance(box,(200,200));other=box_point_distance(box,(222,200))
        self.assertLessEqual(own,other)

    def test_no_free_place_is_unresolved_not_an_error(self):
        # the point sits in a pen of four lines too small for the box, with a panel variant of its text that was never measured
        pen=[{'id':'pen%d'%k,'kind':'line','role':'line','geometry':g} for k,g in enumerate([[(185,185),(215,185)],[(185,215),(215,215)],[(185,185),(185,215)],[(215,185),(215,215)]])]
        label={**coordinate_label('A-coordinates','A',(200,200)),'panelText':'A: (1, 2)'}
        r=run([label],[point('A',(200,200)),*pen])
        self.assertIn(r['status'],('PASS','POLISH_REQUIRED'))

    def test_points_crowded_on_a_curve_each_label_belongs_to_its_own_point(self):
        # five points 18 px apart along a curve: every label is tied to its own point by a leader or stands nearer it than any other point, and none stands across the curve's line
        xs=[120+18*k for k in range(5)]
        points=[point('P%d'%k,(x,200-0.35*(x-120))) for k,x in enumerate(xs)]
        curve={'id':'curve','kind':'curve','role':'curve','geometry':[(100,207),(300,137)]}
        labels=[coordinate_label('P%d-coordinates'%k,'P%d'%k,tuple(points[k]['geometry'][:2])) for k in range(5)]
        r=run(labels,[*points,curve])
        self.assertEqual(r['unresolved'],[])
        led={row['ownerLabelId']:row for row in r['leaders']}
        for row in r['labels']:
            k=int(row['id'][1]);box=Box(**row['box']);own=points[k]['geometry'][:2]
            if row['id'] in led:
                self.assertEqual(led[row['id']]['from'],list(own))                                       # the leader starts on its own point
                continue
            d_own=box_point_distance(box,tuple(own))
            self.assertLessEqual(d_own,NEAR_RELOCATION_LEADER_MIN_GAP+1e-6,row['id'])                   # leaderless: close to its own point
            for j,other in enumerate(points):
                if j!=k:self.assertLess(d_own,box_point_distance(box,tuple(other['geometry'][:2])),(row['id'],'nearer another point'))

if __name__=='__main__':unittest.main()
