"""Reading adjacency: two labels standing side by side on one text line (less than READING_ADJACENT_PX between their boxes) read as one expression - the axis name x beside the
label y=3 reads as y=3x. Such a pair counts as a collision for every pair of labels, not only for overlapping boxes."""
import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.label_layout import *

SAFE=Box(32,32,556,436)

def text_label(i,at,text,**more):
    return {'id':i,'kind':'POINT_NAME','at':at,'text':text,'font':13.25,'priority':1,**more}

class ReadingAdjacency(unittest.TestCase):
    def test_pair_test(self):
        a=Box(100,100,40,18)
        self.assertTrue(reads_as_one(Box(146,100,10,18),a))              # 6 px apart on one line
        self.assertFalse(reads_as_one(Box(160,100,10,18),a))             # 20 px apart
        self.assertFalse(reads_as_one(Box(146,130,10,18),a))             # a line below
        self.assertTrue(reads_as_one(Box(146,106,10,18),a))              # the lines overlap by most of their height

    def test_axis_name_does_not_join_the_neighbouring_label(self):
        # the label y=3 stands at the end of its line; the axis name x would first fit 8 px to its right on the same line
        wide=text_label('y3',(300,200),'y = 3',directions=('E',),gaps=(8,),priority=0)
        axis_name=text_label('x-name',(300,200),'x',directions=('E','S'),gaps=(8,30),priority=1)
        # both belong to the same anchor: without the reading rule x lands to the right of y=3 with a 6..8 px gap
        r=layout([wide,axis_name],[],SAFE)
        self.assertEqual(r['status'],'PASS')
        boxes={row['id']:Box(**row['box']) for row in r['labels']}
        self.assertFalse(reads_as_one(boxes['x-name'],boxes['y3']),(boxes['x-name'],boxes['y3']))

if __name__=='__main__':unittest.main()
