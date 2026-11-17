"""labelHints: the author's one line fine tuning of single labels (prefer / nudge / leader), the same shape for every label kind. apply_label_hints checks the ids and values
and writes them into the labels; the layout then keeps every overlap and distance check for the place a label ends in."""
import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.label_layout import *

def point_label(i,at,text='P'):
    return {'id':i,'kind':'POINT_NAME','at':at,'text':text,'font':13.25,'priority':1}

SAFE=Box(32,32,556,436)

class LabelHints(unittest.TestCase):
    def laid_out(self,hints=None,extra=()):
        labels=[point_label('A',(200,200)),*extra]
        if hints is not None:apply_label_hints(labels,hints)
        r=layout(labels,[{'id':'a','kind':'point','geometry':(200,200,2)}],SAFE)
        self.assertEqual(r['status'],'PASS')
        return {row['id']:Box(**row['box']) for row in r['labels']},r

    def test_prefer_moves_the_first_side(self):
        default,_=self.laid_out()
        below,_=self.laid_out({'A':{'prefer':'below'}})
        self.assertLess(default['A'].y+default['A'].height,201)                # the default side is above the point
        self.assertGreater(below['A'].y,199)                                   # the hint put it below
        left,_=self.laid_out({'A':{'prefer':'left'}})
        self.assertLess(left['A'].x+left['A'].width,200)

    def test_nudge_moves_a_free_box_and_a_blocked_nudge_is_refused(self):
        default,_=self.laid_out()
        moved,r=self.laid_out({'A':{'nudge':[0,-10]}})
        self.assertAlmostEqual(moved['A'].y,default['A'].y-10)
        self.assertTrue(any(row.get('fallback')=='HINT_NUDGE_APPLIED' for row in r['trace']))
        # another label sits right where the nudged box would land: the box stays at its own place
        blocker=point_label('B',(200,170),'Q')
        base,_=self.laid_out(extra=[blocker])
        labels=[point_label('A',(200,200)),blocker];apply_label_hints(labels,{'A':{'nudge':[0,-28]}})
        r=layout(labels,[{'id':'a','kind':'point','geometry':(200,200,2)},{'id':'b','kind':'point','geometry':(200,170,2)}],SAFE)
        boxes={row['id']:Box(**row['box']) for row in r['labels']}
        self.assertFalse(boxes['A'].overlaps(boxes['B'],0))

    def test_bad_hints_are_refused_with_the_label_id(self):
        cases=[({'Z':{'prefer':'above'}},'LABEL_HINT_UNKNOWN_LABEL:Z'),({'A':{'prefer':'sideways'}},'LABEL_HINT_PREFER_INVALID:A'),
               ({'A':{'nudge':[1]}},'LABEL_HINT_NUDGE_INVALID:A'),({'A':{'nudge':[0,999]}},'LABEL_HINT_NUDGE_INVALID:A'),
               ({'A':{}},'LABEL_HINT_FIELD_INVALID:A'),({'A':{'color':'red'}},'LABEL_HINT_FIELD_INVALID:A'),({'A':{'leader':False}},'LABEL_HINT_LEADER_INVALID:A'),([],'LABEL_HINTS_INVALID')]
        for hints,code in cases:
            with self.subTest(code=code):
                with self.assertRaises(ValueError) as error:apply_label_hints([point_label('A',(200,200))],hints)
                self.assertEqual(str(error.exception),code)

    def test_leader_hint_puts_a_region_label_on_its_leader(self):
        label={'id':'R-label','kind':'EQUATION_LABEL','at':[100,100],'text':'S','font':13.25,'priority':2,'candidateCenters':[[100,100]],
               'regionLeader':{'anchors':[],'gaps':[20],'polygons':[],'near':None,'only':False}}
        apply_label_hints([label],{'R-label':{'leader':True}})
        self.assertTrue(label['regionLeader']['only'])
        self.assertEqual(label['candidateCenters'],[])

if __name__=='__main__':unittest.main()
