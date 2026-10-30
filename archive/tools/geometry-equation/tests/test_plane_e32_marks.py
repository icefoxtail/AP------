"""Small plane-mark additions of E32: equal-length groups drawn with circles (markStyle CIRCLE) so more than three groups fit, and closed path total-length labels. The engine's
primitives and the independent observer with tamper cases. No Chrome here (the label groups are written by hand as in test_plane_dimensions.py)."""
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_dimensions import OBSERVER,build,spec_of,tag,attribute   # noqa: E402
from visual_engine.semantic_model import validate   # noqa: E402

PARALLELOGRAM={'A':(0.0,0.0),'B':(30.0,0.0),'C':(40.0,20.0),'D':(10.0,20.0)}
SIDES=[('sAB','A','B'),('sBC','B','C'),('sCD','C','D'),('sDA','D','A')]
SEGMENTS=[{'id':i,'refs':[a,b]} for i,a,b in SIDES]
def seg(identifier,a,b):return {'id':identifier,'kind':'SEGMENT','from':list(PARALLELOGRAM[a]),'to':list(PARALLELOGRAM[b])}
def objects_of(circle_count=1):
    return [seg(*row) for row in SIDES]+[{'id':'e1','kind':'EQUAL_MARK','refs':['sAB','sCD'],'count':1},
                                       {'id':'e2','kind':'EQUAL_MARK','refs':['sBC','sDA'],'count':circle_count,'markStyle':'CIRCLE'}]
def marks_of(circle_count=1):
    return {'equalLengths':[{'id':'e1','count':1,'segments':['sAB','sCD']},{'id':'e2','count':circle_count,'markStyle':'CIRCLE','segments':['sBC','sDA']}]}

class CircleStyleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result=build(spec_of(PARALLELOGRAM,objects_of(2),width=720,height=520));cls.svg=cls.result['svg'];cls.transform=cls.result['witness']['coordinateModel']
    def audit(self,svg=None,marks=None):
        return OBSERVER.audit({'svg':svg or self.svg,'points':{k:list(v) for k,v in PARALLELOGRAM.items()},'marks':marks if marks is not None else marks_of(2),'segments':SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [e.split(':')[0] for e in self.audit(**kw)['errors']]
    def circles(self,segment):
        return [m.group(0) for m in re.finditer(r'<circle\s[^>]*data-mark="equal"[^>]*data-mark-segment="'+segment+r'"[^>]*/>',self.svg)]
    def test_the_group_is_drawn_with_circles_nine_pixels_apart_on_each_of_its_segments(self):
        for segment in ('sBC','sDA'):
            found=self.circles(segment);self.assertEqual(len(found),2,segment)
            xs=[(float(attribute(c,'cx')),float(attribute(c,'cy'))) for c in found]
            self.assertAlmostEqual(((xs[0][0]-xs[1][0])**2+(xs[0][1]-xs[1][1])**2)**0.5,9.0,places=6)
            self.assertAlmostEqual(float(attribute(found[0],'r')),3.6,places=6);self.assertEqual(attribute(found[0],'fill'),'none')
        self.assertEqual(len(self.circles('sAB')),0,'the tick group keeps its ticks')
    def test_observer_accepts_the_genuine_figure(self):
        report=self.audit();self.assertEqual(report['errors'],[],report['errors'])
    def test_tamper_circle_replaced_by_a_tick_resized_or_moved_off_its_segment(self):
        circle=self.circles('sBC')[0]
        tick='<line id="x" data-role="indicator" data-mark="equal" data-mark-id="e2" data-mark-segment="sBC" data-mark-index="1" x1="0" y1="0" x2="5" y2="5" stroke="#111"/>'
        self.assertIn('EQUAL_MARK_STYLE_MISMATCH',self.codes(svg=self.svg.replace(circle,tick)))
        self.assertIn('EQUAL_MARK_TICK_SIZE',self.codes(svg=self.svg.replace(circle,re.sub(r'\sr="[^"]*"',' r="5"',circle,count=1))))
        self.assertIn('EQUAL_MARK_NOT_ON_SEGMENT',self.codes(svg=self.svg.replace(circle,re.sub(r'\scx="([^"]*)"',lambda m:' cx="%.3f"'%(float(m.group(1))+6),circle,count=1))))
    def test_circles_drawn_where_ticks_are_declared_are_refused(self):
        self.assertIn('EQUAL_MARK_STYLE_MISMATCH',self.codes(marks={'equalLengths':[{'id':'e1','count':1,'segments':['sAB','sCD']},{'id':'e2','count':2,'segments':['sBC','sDA']}]}))
    def test_semantic_checks(self):
        validate(spec_of(PARALLELOGRAM,objects_of(1)))
        bad=objects_of(1);bad[-1]['count']=3
        with self.assertRaises(ValueError):validate(spec_of(PARALLELOGRAM,bad))
        bad=objects_of(1);bad[-1]['markStyle']='SQUARE'
        with self.assertRaises(ValueError):validate(spec_of(PARALLELOGRAM,bad))

def text_group(label_id,box,text,stroke_em=None,font=24.0):
    """A plain-text label group at the layout's box, the way the typesetter leaves it (outline path, data-text, data-font-px), with or without the weight stroke."""
    stroke=' stroke="#111" stroke-width="%.4f" stroke-linejoin="round"'%(font*stroke_em) if stroke_em else ''
    return ('<g id="'+label_id+'" data-owner="x" data-fragment-sha="sha256:'+'0'*64+'" data-text="'+text+'" data-font-px="%.1f" transform="translate(%.6f %.6f)">'%(font,box['x'],box['y'])+
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.3f" height="%.3f" viewBox="0 0 %.3f %.3f"><path d="M0 0 L5 0" fill="#111"%s/></svg></g>'%(box['width'],box['height'],box['width'],box['height'],stroke))

class TextWeightTests(unittest.TestCase):
    """labelWeight MATH on plain-text labels (E32): the expression label and the dimension label of a segment; the observer reads the stroke back."""
    LINE={'A':(0.0,0.0),'B':(40.0,0.0)}
    @classmethod
    def setUpClass(cls):
        objects=[{'id':'sAB','kind':'SEGMENT','from':[0.0,0.0],'to':[40.0,0.0]},
                 {'id':'t1','kind':'EQUATION_LABEL','target':'sAB','text':'높이','at':[20.0,0.0],'lineOwned':True,'alternateAt':[[12.0,0.0],[28.0,0.0]],'gaps':[8,6,10,20,32,48],'priority':1,'labelKind':'TEXT','labelWeight':'MATH'},
                 {'id':'d1','kind':'DIMENSION_LINE','refs':['A','B'],'side':'BELOW','labelText':'전체','labelKind':'TEXT','labelWeight':'MATH'}]
        cls.result=build(spec_of(cls.LINE,objects,width=720,height=360),measurements={'t1':[50.0,24.0],'d1-label':[50.0,24.0]})
        cls.transform=cls.result['witness']['coordinateModel'];cls.boxes={row['id']:row['box'] for row in cls.result['witness']['layout']['labels']}
        svg=cls.result['svg']
        for label_id in ('t1','d1-label'):svg=re.sub(r'<text\s[^>]*id="'+label_id+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        cls.base=svg
    def svg(self,weight=0.06,second_weight=0.06):
        return self.base.replace('</svg>',text_group('t1',self.boxes['t1'],'높이',weight)+text_group('d1-label',self.boxes['d1-label'],'전체',second_weight)+'</svg>')
    def marks(self,weight='MATH'):
        extra={'labelWeight':weight} if weight else {}
        return {'expressionLabels':[{'id':'t1','ownerSegment':'sAB','text':'높이','labelKind':'TEXT',**extra}],'dimensions':[{'id':'d1','from':'A','to':'B','side':'BELOW','label':'전체','labelKind':'TEXT',**extra}]}
    def codes(self,svg,marks):
        return [e.split(':')[0] for e in OBSERVER.audit({'svg':svg,'points':{k:list(v) for k,v in self.LINE.items()},'marks':marks,'segments':[{'id':'sAB','refs':['A','B']}],'transform':self.transform})['errors']]
    def test_engine_marks_the_labels_for_the_weighted_typesetter(self):
        for row in self.result['witness']['layout']['labels']:
            if row['id'] in ('t1','d1-label'):self.assertEqual(row.get('weight'),'MATH',row['id'])
    def test_observer_accepts_the_declared_weight(self):
        self.assertEqual(self.codes(self.svg(),self.marks()),[])
    def test_observer_refuses_a_missing_or_undeclared_stroke(self):
        self.assertIn('LABEL_WEIGHT_MISMATCH',self.codes(self.svg(weight=None),self.marks()))
        self.assertIn('LABEL_WEIGHT_MISMATCH',self.codes(self.svg(second_weight=0.03),self.marks()))
        self.assertIn('LABEL_WEIGHT_UNDECLARED',self.codes(self.svg(),self.marks(weight=None)))
    def test_a_plan_without_the_field_keeps_the_thin_face(self):
        self.assertEqual(self.codes(self.svg(weight=None,second_weight=None),self.marks(weight=None)),[])
    def test_weight_needs_a_plain_text_label(self):
        bad=[{'id':'t1','kind':'EQUATION_LABEL','target':'sAB','text':'12','at':[20.0,0.0],'lineOwned':True,'alternateAt':[],'gaps':[8],'priority':1,'labelWeight':'MATH'}]
        with self.assertRaises(ValueError):validate(spec_of(self.LINE,[{'id':'sAB','kind':'SEGMENT','from':[0.0,0.0],'to':[40.0,0.0]},*bad]))

class ClosedPathLabelTests(unittest.TestCase):
    """pathLabels[].closed (E32): one label for a whole perimeter, the last point joining back to the first; the label stands outside the figure on a leader that never enters it."""
    LABEL='둘레 100cm'
    @classmethod
    def setUpClass(cls):
        objects=[seg(*row) for row in SIDES]+[cls.path_object()]
        cls.result=build(spec_of(PARALLELOGRAM,objects,width=720,height=520));cls.transform=cls.result['witness']['coordinateModel'];cls.layout=cls.result['witness']['layout']
        cls.box={row['id']:row['box'] for row in cls.layout['labels']}['per-label']
        cls.base=re.sub(r'<text\s[^>]*id="per-label"[^>]*>.*?</text>','',cls.result['svg'],flags=re.S)
    @staticmethod
    def path_object(**extra):return {'id':'per','kind':'PATH_LABEL','refs':['A','B','C','D'],'segments':['sAB','sBC','sCD','sDA'],'closed':True,'labelText':ClosedPathLabelTests.LABEL,'labelKind':'TEXT',**extra}
    @staticmethod
    def marks(**extra):return {'pathLabels':[{'id':'per','points':['A','B','C','D'],'closed':True,'label':ClosedPathLabelTests.LABEL,'labelKind':'TEXT',**extra}]}
    def screen(self,p):
        m=self.transform;return (m['originX']+p[0]*m['sx'],m['originY']-p[1]*m['sy'])
    def svg(self,box=None,leader=None):
        svg=self.base
        if leader is not None:svg=re.sub(r'<line\s[^>]*data-role="leader"[^>]*data-owner-label="per-label"[^>]*/>',leader,svg)
        return svg.replace('</svg>',text_group('per-label',box or self.box,self.LABEL)+'</svg>')
    def audit(self,svg=None,marks=None,segments=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in PARALLELOGRAM.items()},'marks':marks or self.marks(),'segments':segments or SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [e.split(':')[0] for e in self.audit(**kw)['errors']]
    def leader(self):return re.search(r'<line\s[^>]*data-role="leader"[^>]*data-owner-label="per-label"[^>]*/>',self.base).group(0)
    def polygon(self):return [self.screen(PARALLELOGRAM[k]) for k in 'ABCD']
    def test_the_label_stands_outside_the_figure_on_a_leader_that_starts_on_it(self):
        self.assertEqual(self.layout['unresolved'],[])
        leader=next(item for item in self.layout['leaders'] if item['ownerLabelId']=='per-label');poly=self.polygon()
        self.assertLess(min(OBSERVER.point_segment_distance(leader['from'],a,b) for a,b in zip(poly,poly[1:]+poly[:1])),1e-6)
        from visual_engine.label_layout import Box,box_outside_regions,leader_avoids_regions
        box=Box(self.box['x'],self.box['y'],self.box['width'],self.box['height'])
        self.assertTrue(box_outside_regions(box,[[poly]]));self.assertTrue(leader_avoids_regions(tuple(leader['from']),tuple(leader['to']),[[poly]]))
    def test_the_genuine_label_passes_and_the_total_includes_the_closing_side(self):
        report=self.audit();self.assertEqual(report['errors'],[],report['errors'])
        row=next(item for item in report['observations'] if item['type']=='PATH_LABEL')
        self.assertEqual(row['segments'],['sAB','sBC','sCD','sDA']);self.assertTrue(row['closed'])
        import math
        self.assertAlmostEqual(row['lengthModel'],30.0+math.dist((30,0),(40,20))+30.0+math.dist((10,20),(0,0)),places=9)
    def test_a_declared_value_is_the_whole_perimeter(self):
        import math
        total=60.0+2*math.dist((30,0),(40,20))
        self.assertEqual(self.audit(marks=self.marks(value=total))['errors'],[])
        self.assertTrue([e for e in self.audit(marks=self.marks(value=total-math.dist((10,20),(0,0))))['errors'] if e.startswith('PATH_LABEL_FACT_MISMATCH:per')])
    def test_tamper_a_label_inside_the_figure_or_a_leader_that_enters_it(self):
        poly=self.polygon();cx=sum(p[0] for p in poly)/4;cy=sum(p[1] for p in poly)/4
        inside={**self.box,'x':cx-self.box['width']/2,'y':cy-self.box['height']/2}
        self.assertIn('PATH_LABEL_NOT_OUTSIDE',self.codes(svg=self.svg(box=inside)))
        leader=self.leader();start=(float(re.search(r'\sx1="([^"]*)"',leader).group(1)),float(re.search(r'\sy1="([^"]*)"',leader).group(1)))
        entering=leader
        for name,value in (('x2',cx),('y2',cy)):entering=re.sub(r'(\s'+name+'=")[^"]*(")',lambda mm,v=value:mm.group(1)+str(v)+mm.group(2),entering,count=1)
        self.assertIn('PATH_LABEL_LEADER_ENTERS',self.codes(svg=self.svg(leader=entering)))
    def test_tamper_the_closing_side_is_not_drawn(self):
        errors=self.audit(segments=[row for row in SEGMENTS if row['id']!='sDA'])['errors']
        self.assertTrue([e for e in errors if e.startswith('PATH_LABEL_SEGMENT_NOT_DRAWN:per:D-A')],errors)
    def test_without_closed_the_path_is_open(self):
        marks={'pathLabels':[{'id':'per','points':['A','B','C','D'],'label':self.LABEL,'labelKind':'TEXT'}]}
        report=self.audit(marks=marks);row=next(item for item in report['observations'] if item['type']=='PATH_LABEL')
        self.assertNotIn('closed',row);self.assertEqual(row['segments'],['sAB','sBC','sCD'])
    def test_refusals(self):
        def error(**extra):
            objects=[seg(*row) for row in SIDES]+[self.path_object(**extra)]
            with self.assertRaises(ValueError) as caught:build(spec_of(PARALLELOGRAM,objects))
            return str(caught.exception)
        self.assertEqual(error(closed=False),'PATH_LABEL_CLOSED_INVALID:per')
        self.assertEqual(error(segments=['sAB','sBC','sCD']),'PATH_LABEL_SEGMENT_NOT_DRAWN:per')
        self.assertEqual(error(segments=['sAB','sBC','sCD','sBC']),'PATH_LABEL_SEGMENT_NOT_DRAWN:per:D-A')
        self.assertEqual(error(refs=['A','B']),'PATH_LABEL_POINTS_INVALID:per')

if __name__=='__main__':unittest.main()
