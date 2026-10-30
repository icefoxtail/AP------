"""Segment callouts (E37): a path of the main figure drawn again beside it (planeMarks.callouts kind SEGMENT). The engine draws the copies, their pieces, the light dotted guide
lines and the marks as ordinary objects; the independent observer reads the copies back from the final SVG against the main figure's own points, then checks the marks on them.
No Chrome here: the label boxes come from the build's own layout and are written into the SVG as typeset-looking label groups by hand (tests/plane-callout.test.mjs exercises the
real MathJax fragments, the real specFor and the whole pipeline)."""
import re
import sys
import unittest
from pathlib import Path

HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE))
from test_plane_dimensions import Fixture,OBSERVER,spec_of,seg,dim,tag,attribute,replace_attribute   # noqa: E402
from visual_engine.engine import build   # noqa: E402
from visual_engine.semantic_model import validate   # noqa: E402

# the main figure: a triangle ABC whose base A-M-B is the path pulled out (scale 2, horizontal, to the right of the figure)
MAIN={'A':(0.0,0.0),'M':(4.0,0.0),'B':(10.0,0.0),'C':(4.0,6.0)}
SCALE=2.0
COPY={'A':(14.0,2.0),'M':(14.0+4.0*SCALE,2.0),'B':(14.0+10.0*SCALE,2.0)}
POINTS={**MAIN,**{'k1__'+k:v for k,v in COPY.items()}}
SEGMENTS=[{'id':'sAB','refs':['A','B']},{'id':'sBC','refs':['B','C']},{'id':'sCA','refs':['C','A']}]
def objects_of(guides=False,dim_value=True):
    out=[seg('sAB',MAIN,'A','B'),seg('sBC',MAIN,'B','C'),seg('sCA',MAIN,'C','A'),
         {'id':'k1__s1','kind':'SEGMENT','from':list(COPY['A']),'to':list(COPY['M'])},{'id':'k1__s2','kind':'SEGMENT','from':list(COPY['M']),'to':list(COPY['B'])},
         dim('k1__d1','k1__A','k1__M','BELOW',labelText='4',offset=1,autoOffset=True,style='ARROW'),dim('k1__d2','k1__M','k1__B','BELOW',labelText='6',offset=1,autoOffset=True,style='ARROW'),
         dim('k1__d3','k1__A','k1__B','BELOW',labelText='10',offset=2,autoOffset=True,style='ARROW')]
    if guides:out+=[{'id':'k1__g1','kind':'SEGMENT','from':list(MAIN['A']),'to':list(COPY['A']),'guide':True},{'id':'k1__g2','kind':'SEGMENT','from':list(MAIN['B']),'to':list(COPY['B']),'guide':True}]
    return out
def marks_of(link='NONE',scale=SCALE,at='RIGHT',value=4):
    row={'id':'k1','kind':'SEGMENT','path':['A','M','B'],'at':at,'scale':scale,'link':link,
         'dimensions':[{'id':'d1','from':'A','to':'M','side':'BELOW','label':'4','unit':'cm','style':'ARROW','offset':'AUTO','value':value},
                       {'id':'d2','from':'M','to':'B','side':'BELOW','label':'6','unit':'cm','style':'ARROW','offset':'AUTO'},
                       {'id':'d3','from':'A','to':'B','side':'BELOW','label':'10','unit':'cm','style':'ARROW','offset':'AUTO'}]}
    return {'callouts':[row]}
NAME_LABELS={id_+'-name':(name,'') for id_,name in [(k,k) for k in MAIN]+[('k1__'+k,k) for k in COPY]}
LABELS={'k1__d1-label':('4','cm'),'k1__d2-label':('6','cm'),'k1__d3-label':('10','cm'),**NAME_LABELS}

def figure_spec(guides=False):
    """The spec of the main figure and its callout: a tight frame (about 17 px per unit) so the dimension lines are long enough, the copies named like their points."""
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-3.0,'xMax':38.0,'yMin':-4.0,'yMax':8.0,'width':720,'height':380,'panel':0},'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':k.split('__')[-1]} for k,v in POINTS.items()]+objects_of(guides=guides)}

class CalloutFixture(Fixture):
    """The built callout figure with its label boxes as label groups. Point names are drawn by the engine as text; here they stand as glyph groups too (same codes for a copy and its point)."""
    def __init__(self,guides=False):
        spec=figure_spec(guides)
        self.points=POINTS;self.labels=LABELS;self.result=build(spec);self.transform=self.result['witness']['coordinateModel'];self.layout=self.result['witness']['layout']
        self.boxes={row['id']:row['box'] for row in self.layout['labels']}
        svg=self.result['svg']
        for label_id in LABELS:svg=re.sub(r'<text\s[^>]*id="'+re.escape(label_id)+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        self.base_svg=svg
    def audit(self,svg=None,marks=None,segments=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in MAIN.items()},'marks':marks if marks is not None else marks_of(),
                               'segments':segments if segments is not None else SEGMENTS,'transform':self.transform})

class EngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.plain=CalloutFixture();cls.guided=CalloutFixture(guides=True)
    def test_every_label_finds_room_and_the_observer_passes(self):
        self.assertEqual(self.plain.layout['unresolved'],[])
        report=self.plain.audit();self.assertEqual(report['errors'],[],report['errors'])
        kinds=[row for row in report['observations'] if row.get('type')=='CALLOUT'];self.assertEqual(len(kinds),1);self.assertAlmostEqual(kinds[0]['scale'],SCALE,places=6)
    def test_the_copies_dimensions_are_checked_as_ordinary_marks(self):
        report=self.plain.audit();ids={row['id'] for row in report['observations'] if row.get('type')=='DIMENSION'}
        self.assertTrue({'k1__d1','k1__d2','k1__d3'}<=ids,ids)
    def test_a_guide_line_is_light_grey_and_dotted(self):
        node=tag(self.guided.result['svg'],'k1__g1')
        self.assertEqual(attribute(node,'stroke'),'#8a8a8a');self.assertEqual(attribute(node,'stroke-dasharray'),'2 4');self.assertEqual(attribute(node,'data-role'),'guide')
        report=self.guided.audit(svg=self.guided.svg(),marks=marks_of(link='ENDS'));self.assertEqual(report['errors'],[],report['errors'])
    def test_guide_lines_must_be_declared_and_present(self):
        self.assertIn('CALLOUT_GUIDE_UNDECLARED',self.guided.codes(marks=marks_of(link='NONE')))
        self.assertIn('CALLOUT_GUIDE_MISSING',self.plain.codes(marks=marks_of(link='ENDS')))
    def test_the_copy_is_checked_against_the_main_path(self):
        svg=self.plain.svg()
        # one copy moved along the line: the pieces no longer keep the main path's ratio
        node=re.search(r'<circle\s[^>]*id="k1__M"[^>]*/>',svg).group(0)
        shifted=svg.replace(node,re.sub(r'(\scx=")[^"]*(")',lambda m:m.group(1)+str(float(attribute(node,'cx'))+9.0)+m.group(2),node,count=1),1)
        self.assertIn('CALLOUT_RATIO_MISMATCH',self.plain.codes(svg=shifted))
    def test_the_declared_scale_and_side_are_held_to_the_drawing(self):
        self.assertIn('CALLOUT_SCALE_MISMATCH',self.plain.codes(marks=marks_of(scale=1.5)))
        self.assertIn('CALLOUT_SIDE_MISMATCH',self.plain.codes(marks=marks_of(at='LEFT')))
        self.assertIn('CALLOUT_SIDE_MISMATCH',self.plain.codes(marks=marks_of(at='BELOW')))
    def test_a_declared_dimension_value_is_the_length_on_the_main_figure(self):
        self.assertEqual(self.plain.audit(marks=marks_of(value=4))['errors'],[])
        self.assertIn('CALLOUT_DIMENSION_FACT_MISMATCH',self.plain.codes(marks=marks_of(value=8)))      # 8 would be the length ON the copy: the value is the main figure's
    def test_a_copy_must_carry_its_points_name(self):
        svg=self.plain.svg()
        node=re.search(r'<g id="k1__M-name"[^>]*>.*?</g>',svg,flags=re.S).group(0)
        wrong=svg.replace(node,node.replace('data-c="4D"','data-c="4E"'))
        self.assertIn('CALLOUT_NAME_MISMATCH',self.plain.codes(svg=wrong))
    def test_a_missing_copy_or_piece_is_reported(self):
        svg=self.plain.svg();node=re.search(r'<circle\s[^>]*id="k1__B"[^>]*/>',svg).group(0)
        self.assertIn('CALLOUT_POINT_MISSING',self.plain.codes(svg=svg.replace(node,'')))
        piece=tag(svg,'k1__s2');self.assertIn('CALLOUT_SEGMENT_MISSING',self.plain.codes(svg=svg.replace(piece,'')))
    def test_a_dimension_of_a_point_outside_the_path_is_refused(self):
        row=marks_of()['callouts'][0];row['dimensions'][0]['to']='C'
        self.assertIn('CALLOUT_TARGET_UNKNOWN',self.plain.codes(marks={'callouts':[row]}))

class SemanticTests(unittest.TestCase):
    def test_a_guide_is_a_plain_segment_only(self):
        spec=figure_spec(True);validate(spec)
        for extra in ({'dash':True},{'arrow':'END'},{'emphasis':'BOLD'}):
            bad={**spec,'objects':[{**o,**extra} if o['id']=='k1__g1' else o for o in spec['objects']]}
            with self.assertRaises(ValueError) as caught:validate(bad)
            self.assertTrue(str(caught.exception).startswith('INVALID_SEGMENT_GUIDE') or str(caught.exception).startswith('INVALID_SEGMENT_EMPHASIS'),str(caught.exception))
        point={**spec_of(POINTS,[])['objects'][0],'guide':True}
        with self.assertRaises(ValueError):validate({**spec_of(POINTS,[]),'objects':[point]})


if __name__=='__main__':
    unittest.main()
