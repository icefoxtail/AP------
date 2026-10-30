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


# ---- angle callout: the fan of rays B->C, B->P, B->Q, B->A of the main figure drawn again to its right, every ray as long as the radius, nothing turned
import math   # noqa: E402
FAN_MAIN={'B':(0.0,0.0),'C':(12.0,0.0),'P':(10.0,5.0),'Q':(8.0,8.0),'A':(6.0,18.0)}
FAN_RAYS=['C','P','Q','A']
RADIUS=10.0
def fan_copy(gap=4.0):
    """The copies: the fan's offsets from its vertex (radius times each ray's unit vector), the box standing `gap` right of the main figure's box, centred on it."""
    offsets={'B':(0.0,0.0),**{r:(RADIUS*FAN_MAIN[r][0]/math.hypot(*FAN_MAIN[r]),RADIUS*FAN_MAIN[r][1]/math.hypot(*FAN_MAIN[r])) for r in FAN_RAYS}}
    xs=[o[0] for o in offsets.values()];ys=[o[1] for o in offsets.values()]
    box_x=max(p[0] for p in FAN_MAIN.values())+gap;centre_y=(min(p[1] for p in FAN_MAIN.values())+max(p[1] for p in FAN_MAIN.values()))/2
    shift=(box_x-min(xs),centre_y-(min(ys)+max(ys))/2)
    return {k:(v[0]+shift[0],v[1]+shift[1]) for k,v in offsets.items()}
FAN_COPY=fan_copy()
FAN_POINTS={**FAN_MAIN,**{'k2__'+k:v for k,v in FAN_COPY.items()}}
FAN_SEGMENTS=[{'id':'s'+r,'refs':['B',r]} for r in FAN_RAYS]
def degrees(a,v,c):
    u=(a[0]-v[0],a[1]-v[1]);w=(c[0]-v[0],c[1]-v[1]);return math.degrees(math.acos((u[0]*w[0]+u[1]*w[1])/(math.hypot(*u)*math.hypot(*w))))
ANGLE_ROWS=[('a1','C','P'),('a2','P','Q'),('a3','C','Q')]
def fan_objects(guide=False):
    out=[{'id':'s'+r,'kind':'SEGMENT','from':list(FAN_MAIN['B']),'to':list(FAN_MAIN[r])} for r in FAN_RAYS]
    out+=[{'id':'k2__r%d'%(i+1),'kind':'SEGMENT','from':list(FAN_COPY['B']),'to':list(FAN_COPY[r])} for i,r in enumerate(FAN_RAYS)]
    for aid,x,y in ANGLE_ROWS:
        whole=aid=='a3'      # the whole angle encloses the other two: its arc stands outside theirs and its label on a leader
        out.append({'id':'k2__'+aid,'kind':'ANGLE_MARK','refs':['k2__'+x,'k2__B','k2__'+y],'value':degrees(FAN_COPY[x],FAN_COPY['B'],FAN_COPY[y]),'arcs':1,'style':'ARC' if whole else 'SECTOR',**({} if aid=='a2' else {'labelText':aid[-1],'labelKind':'MATH'}),      # the narrow middle angle is only marked, not valued (the one the question asks for)
                    **({'ring':2,'over':['k2__a1','k2__a2'],'labelPlacement':'LEADER'} if whole else {})})
    if guide:out.append({'id':'k2__g1','kind':'SEGMENT','from':list(FAN_MAIN['B']),'to':list(FAN_COPY['B']),'guide':True})
    return out
def fan_spec(guide=False):
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':-3.0,'xMax':32.0,'yMin':-3.0,'yMax':21.0,'width':720,'height':520,'panel':0},'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':k.split('__')[-1]} for k,v in FAN_POINTS.items()]+fan_objects(guide)}
def fan_marks(link='NONE',radius=RADIUS,at='RIGHT'):
    rows=[{'id':aid,'refs':[x,'B',y],'value':round(degrees(FAN_MAIN[x],FAN_MAIN['B'],FAN_MAIN[y]),6),**({'noLabel':True} if aid=='a2' else {'label':aid[-1],'labelKind':'MATH'}),**({'over':['a1','a2']} if aid=='a3' else {})} for aid,x,y in ANGLE_ROWS]
    return {'callouts':[{'id':'k2','kind':'ANGLE','vertex':'B','rays':list(FAN_RAYS),'at':at,'radius':radius,'link':link,'angles':rows}]}
FAN_LABELS={**{'k2__'+aid+'-label':(aid[-1],'') for aid,_,_ in ANGLE_ROWS if aid!='a2'},**{k+'-name':(k,'') for k in FAN_MAIN},**{'k2__'+k+'-name':(k,'') for k in FAN_COPY}}

class FanFixture(Fixture):
    def __init__(self,guide=False):
        self.points=FAN_POINTS;self.labels=FAN_LABELS;self.result=build(fan_spec(guide));self.transform=self.result['witness']['coordinateModel'];self.layout=self.result['witness']['layout']
        self.boxes={row['id']:row['box'] for row in self.layout['labels']}
        svg=self.result['svg']
        for label_id in FAN_LABELS:svg=re.sub(r'<text\s[^>]*id="'+re.escape(label_id)+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        self.base_svg=svg
    def audit(self,svg=None,marks=None,segments=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in FAN_MAIN.items()},'marks':marks if marks is not None else fan_marks(),
                               'segments':segments if segments is not None else FAN_SEGMENTS,'transform':self.transform})

class AngleCalloutTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fan=FanFixture();cls.guided=FanFixture(guide=True)
    def test_the_fan_passes_and_its_angles_are_checked_as_ordinary_marks(self):
        self.assertEqual(self.fan.layout['unresolved'],[])
        report=self.fan.audit();self.assertEqual(report['errors'],[],report['errors'])
        self.assertTrue({'k2__a1','k2__a2','k2__a3'}<={row['id'] for row in report['observations'] if row.get('type')=='ANGLE'})
        for row in report['observations']:
            if row.get('type')=='ANGLE' and row['id']=='k2__a2':self.assertAlmostEqual(row['drawnDegrees'],degrees(FAN_MAIN['P'],FAN_MAIN['B'],FAN_MAIN['Q']),places=4)     # the original's angle, whatever the lengths
    def test_a_vertex_guide_line_is_checked(self):
        report=self.guided.audit(svg=self.guided.svg(),marks=fan_marks(link='VERTEX'));self.assertEqual(report['errors'],[],report['errors'])
        self.assertIn('CALLOUT_GUIDE_UNDECLARED',self.guided.codes(marks=fan_marks(link='NONE')))
        self.assertIn('CALLOUT_GUIDE_MISSING',self.fan.codes(marks=fan_marks(link='VERTEX')))
        self.assertIn('CALLOUT_LINK_INVALID',self.fan.codes(marks=fan_marks(link='ENDS')))
    def test_the_radius_and_side_are_held_to_the_drawing(self):
        self.assertIn('CALLOUT_RADIUS_MISMATCH',self.fan.codes(marks=fan_marks(radius=8.0)))
        self.assertIn('CALLOUT_SIDE_MISMATCH',self.fan.codes(marks=fan_marks(at='BELOW')))
    def test_a_ray_turned_or_shortened_is_reported(self):
        svg=self.fan.svg();node=re.search(r'<circle\s[^>]*id="k2__Q"[^>]*/>',svg).group(0)
        longer=svg.replace(node,re.sub(r'(\scx=")[^"]*(")',lambda m:m.group(1)+str(float(attribute(node,'cx'))+30.0)+m.group(2),node,count=1),1)
        codes=self.fan.codes(svg=longer);self.assertTrue('CALLOUT_ANGLE_MISMATCH' in codes or 'CALLOUT_RAY_LENGTH_MISMATCH' in codes,codes)
        self.assertIn('CALLOUT_RAY_LENGTH_MISMATCH',codes)
    def test_a_ray_that_is_not_in_the_fan_is_refused(self):
        marks=fan_marks();marks['callouts'][0]['angles'][0]['refs']=['C','Q','P']
        self.assertIn('CALLOUT_ANGLE_REFS_INVALID',self.fan.codes(marks=marks))
    def test_the_name_of_a_ray_end_is_the_main_points(self):
        svg=self.fan.svg();node=re.search(r'<g id="k2__A-name"[^>]*>.*?</g>',svg,flags=re.S).group(0)
        self.assertIn('CALLOUT_NAME_MISMATCH',self.fan.codes(svg=svg.replace(node,node.replace('data-c="41"','data-c="42"'))))

if __name__=='__main__':
    unittest.main()
