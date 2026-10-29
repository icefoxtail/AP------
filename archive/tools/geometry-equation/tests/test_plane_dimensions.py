"""Dimension lines (E7): the engine's bar / arrow / brace primitives, their length labels placed on the outer side, and the independent observer with tamper cases.
No Chrome here: the label boxes come from the build's own layout and are written into the SVG as typeset-looking label groups by hand
(the real MathJax fragments are exercised by tests/plane-dimensions.test.mjs)."""
import importlib.util
import json
import math
import re
import sys
import unittest
from pathlib import Path

GEOMETRY=Path(__file__).resolve().parents[1]
PRODUCTION=GEOMETRY/'production'
sys.path.insert(0,str(GEOMETRY))
sys.path.insert(0,str(PRODUCTION))
from visual_engine.engine import build,dimension_frame,brace_points

def observer_module():
    spec=importlib.util.spec_from_file_location('plane_marks_observer',PRODUCTION/'plane-marks-observer-worker.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);return module
OBSERVER=observer_module()

def spec_of(points,objects,width=720,height=320):
    xs=[p[0] for p in points.values()];ys=[p[1] for p in points.values()]
    return {'id':'plane','visualType':'line_circle_geometry','viewport':{'xMin':min(xs)-6,'xMax':max(xs)+6,'yMin':min(ys)-30,'yMax':max(ys)+30,'width':width,'height':height,'panel':0},
            'axes':False,'title':'t','sourceFacts':{},'derivedFacts':{},'displayFacts':{},
            'objects':[{'id':k,'kind':'POINT','at':list(v),'name':k} for k,v in points.items()]+objects}
def seg(identifier,points,a,b):return {'id':identifier,'kind':'SEGMENT','from':list(points[a]),'to':list(points[b])}
def dim(identifier,a,b,side,**extra):return {'id':identifier,'kind':'DIMENSION_LINE','refs':[a,b],'side':side,'labelText':extra.pop('labelText','12'),'unit':extra.pop('unit','cm'),**extra}

LINE={'A':(0.0,0.0),'M':(18.0,0.0),'B':(36.0,0.0),'N':(48.0,0.0),'C':(60.0,0.0)}
LINE_SEGMENTS=[{'id':'sAB','refs':['A','B']},{'id':'sBC','refs':['B','C']}]
def line_objects():
    return [seg('sAB',LINE,'A','B'),seg('sBC',LINE,'B','C'),
            dim('d1','A','M','ABOVE',labelText='18'),dim('d2','B','C','BELOW',labelText='24'),dim('d3','A','C','BELOW',style='ARROW',offset=2,labelText='60'),
            dim('d4','M','N','ABOVE',style='BRACE',labelText='30')]
def line_marks():
    return {'dimensions':[{'id':'d1','from':'A','to':'M','side':'ABOVE','label':'18','unit':'cm'},{'id':'d2','from':'B','to':'C','side':'BELOW','label':'24','unit':'cm'},
                          {'id':'d3','from':'A','to':'C','side':'BELOW','style':'ARROW','offset':2,'label':'60','unit':'cm'},
                          {'id':'d4','from':'M','to':'N','side':'ABOVE','style':'BRACE','label':'30','unit':'cm'}]}

def label_group(label_id,box,value='12',unit='cm'):
    """A label group at the layout's box, in the shape the observer reads (position from the transform, size from the inner svg, glyph codes, TeX)."""
    glyphs=''.join('<path data-c="'+format(ord(ch),'X')+'" d="M0 0 L5 0"/>' for ch in value+unit)
    return ('<g id="'+label_id+'" data-owner="x" data-fragment-sha="sha256:'+'0'*64+'" data-tex="'+value+r'\mathrm{'+unit+'}'+'" transform="translate(%.6f %.6f)">'%(box['x'],box['y'])+
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.3f" height="%.3f" viewBox="0 0 %.3f %.3f">%s</svg></g>'%(box['width'],box['height'],box['width'],box['height'],glyphs))

class Fixture:
    """A built figure with its label boxes written into the svg as label groups, ready for the observer."""
    def __init__(self,points,objects,labels):
        self.points=points;self.result=build(spec_of(points,objects));self.transform=self.result['witness']['coordinateModel']
        self.layout=self.result['witness']['layout'];self.boxes={row['id']:row['box'] for row in self.layout['labels']}
        svg=self.result['svg']
        for label_id,(value,unit) in labels.items():
            svg=re.sub(r'<text\s[^>]*id="'+re.escape(label_id)+r'"[^>]*>.*?</text>','',svg,flags=re.S)
        self.base_svg=svg;self.labels=labels
    def svg(self,moved=None):
        """The svg with the label groups appended; `moved` maps a label id to a replacement box."""
        groups=''.join(label_group(label_id,(moved or {}).get(label_id,self.boxes[label_id]),value,unit) for label_id,(value,unit) in self.labels.items())
        return self.base_svg.replace('</svg>',groups+'</svg>')
    def audit(self,svg=None,marks=None,segments=None,points=None):
        return OBSERVER.audit({'svg':svg or self.svg(),'points':{k:list(v) for k,v in (points or self.points).items()},'marks':marks if marks is not None else line_marks(),
                               'segments':segments if segments is not None else LINE_SEGMENTS,'transform':self.transform})
    def codes(self,**kw):return [error.split(':')[0] for error in self.audit(**kw)['errors']]

def tag(svg,identifier):
    return re.search(r'<(?:line|polyline|polygon)\s(?:[^>]*\s)?id="'+re.escape(identifier)+r'"[^>]*/>',svg).group(0)
def attribute(node,name):return re.search(r'\s'+name+r'="([^"]*)"',node).group(1)
def points_of(node):return [tuple(map(float,pair.split(','))) for pair in attribute(node,'points').split()]
def replace_attribute(svg,identifier,name,value):
    node=tag(svg,identifier);return svg.replace(node,re.sub(r'(\s'+name+r'=")[^"]*(")',lambda m:m.group(1)+value+m.group(2),node,count=1),1)

class EngineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture=Fixture(LINE,line_objects(),{'d1-label':('18','cm'),'d2-label':('24','cm'),'d3-label':('60','cm'),'d4-label':('30','cm')})
    def test_every_label_is_placed_on_the_outer_side(self):
        layout=self.fixture.layout;self.assertEqual(layout['unresolved'],[])
        placed={row['id']:row for row in layout['labels']}
        for label_id in ('d1-label','d2-label','d3-label','d4-label'):self.assertEqual(placed[label_id]['placement'],'DIMENSION_OUTSIDE',label_id)
    def test_a_bar_is_an_offset_line_with_two_extension_lines_and_two_ticks(self):
        svg=self.fixture.result['svg'];m=self.fixture.transform
        a=(m['originX']+0*m['sx'],m['originY']);c=(m['originX']+60*m['sx'],m['originY'])
        line=tag(svg,'d2-line');x1,y1,x2,y2=[float(attribute(line,k)) for k in ('x1','y1','x2','y2')]
        b=(m['originX']+36*m['sx'],m['originY'])
        self.assertAlmostEqual(x1,b[0],places=6);self.assertAlmostEqual(x2,c[0],places=6)
        self.assertAlmostEqual(y1,b[1]+24,places=6);self.assertAlmostEqual(y2,b[1]+24,places=6)     # BELOW: 24 px under the points (screen y grows downward)
        ext=tag(svg,'d2-ext-from');self.assertAlmostEqual(float(attribute(ext,'y1')),b[1]+4,places=6);self.assertAlmostEqual(float(attribute(ext,'y2')),b[1]+24-4.5,places=6)
        tick=tag(svg,'d2-tick-to');self.assertAlmostEqual(float(attribute(tick,'y1')),b[1]+24-4.5,places=6);self.assertAlmostEqual(float(attribute(tick,'y2')),b[1]+24+4.5,places=6)
        self.assertEqual(attribute(line,'data-mark'),'dimension');self.assertEqual(attribute(line,'data-mark-id'),'d2');self.assertEqual(attribute(line,'data-mark-part'),'line')
        del a
    def test_a_further_offset_stands_one_step_further_out(self):
        svg=self.fixture.result['svg'];m=self.fixture.transform
        line=tag(svg,'d3-line');self.assertAlmostEqual(float(attribute(line,'y1')),m['originY']+24+44,places=6)
    def test_arrow_heads_have_their_tips_at_the_ends_of_the_line(self):
        svg=self.fixture.result['svg'];m=self.fixture.transform
        head=points_of(tag(svg,'d3-arrow-from'));tip=head[0];self.assertAlmostEqual(tip[0],m['originX'],places=6);self.assertAlmostEqual(tip[1],m['originY']+68,places=6)
        self.assertAlmostEqual(head[1][0],tip[0]+10,places=6);self.assertAlmostEqual(abs(head[1][1]-head[2][1]),7.2,places=6)
        tail=points_of(tag(svg,'d3-arrow-to'))[0];self.assertAlmostEqual(tail[0],m['originX']+60*m['sx'],places=6)
    def test_a_brace_has_its_ends_near_the_points_and_its_tip_outward(self):
        svg=self.fixture.result['svg'];m=self.fixture.transform
        points=points_of(tag(svg,'d4-brace'));base=m['originY']
        self.assertAlmostEqual(points[0][0],m['originX']+18*m['sx'],places=6);self.assertAlmostEqual(points[-1][0],m['originX']+48*m['sx'],places=6)
        self.assertAlmostEqual(points[0][1],base-12,places=6);self.assertAlmostEqual(points[-1][1],base-12,places=6)                 # ABOVE: screen y decreases outward
        tip=min(points,key=lambda p:p[1]);self.assertAlmostEqual(tip[1],base-24,places=6);self.assertAlmostEqual(tip[0],m['originX']+33*m['sx'],places=6)
        self.assertEqual(len(points),len(brace_points(30*m['sx'],12.0,24.0)))
    def test_the_normal_follows_the_named_screen_side_on_a_slanted_segment(self):
        p=(0.0,100.0);q=(100.0,0.0)                                   # goes up to the right on the screen
        for side,expected in (('ABOVE',(-1,-1)),('BELOW',(1,1)),('LEFT',(-1,-1)),('RIGHT',(1,1))):
            length,d,n,dist=dimension_frame(p,q,side,1,'x')
            self.assertAlmostEqual(n[0]*math.sqrt(2),expected[0],places=9,msg=side);self.assertAlmostEqual(n[1]*math.sqrt(2),expected[1],places=9,msg=side)
            self.assertAlmostEqual(dist,24.0);self.assertAlmostEqual(length,math.hypot(100,100))
        self.assertEqual(dimension_frame(p,q,'BELOW',3,'x')[3],24+2*44)
    def test_no_dimension_means_the_old_figure(self):
        before=build(spec_of(LINE,[seg('sAB',LINE,'A','B')]))['svg']
        self.assertNotIn('dimension',before)

class RefusalTests(unittest.TestCase):
    def error(self,objects,points=LINE):
        with self.assertRaises(ValueError) as caught:build(spec_of(points,objects))
        return str(caught.exception)
    def test_a_side_the_segment_does_not_face_is_ambiguous(self):
        points={'A':(0.0,0.0),'B':(0.0,30.0)}                       # vertical: ABOVE and BELOW have no perpendicular that points that way
        self.assertEqual(self.error([dim('d','A','B','ABOVE')],points),'DIMENSION_SIDE_AMBIGUOUS:d')
        build(spec_of(points,[dim('d','A','B','LEFT')]));build(spec_of(points,[dim('d','A','B','RIGHT')]))
    def test_a_short_dimension_is_refused(self):
        points={'A':(0.0,0.0),'B':(2.0,0.0),'C':(60.0,0.0)}
        self.assertEqual(self.error([dim('d','A','B','ABOVE')],points),'DIMENSION_TOO_SHORT:d')
        self.assertEqual(self.error([dim('d','A','B','ABOVE',style='BRACE')],points),'DIMENSION_TOO_SHORT:d')
    def test_field_checks(self):
        for extra,code in (({'side':'NORTH'},'DIMENSION_SIDE_INVALID:d'),({'style':'CURLY'},'DIMENSION_STYLE_INVALID:d'),({'offset':0},'DIMENSION_OFFSET_INVALID:d'),
                           ({'offset':4},'DIMENSION_OFFSET_INVALID:d'),({'offset':True},'DIMENSION_OFFSET_INVALID:d'),({'labelText':''},'DIMENSION_LABEL_REQUIRED:d')):
            row=dim('d','A','M','ABOVE');row.update(extra)
            self.assertEqual(self.error([row]),code,extra)
        self.assertEqual(self.error([{**dim('d','A','A','ABOVE')}]),'DIMENSION_POINT_REFS_REQUIRED:d')
        self.assertEqual(self.error([{**dim('d','A','sAB','ABOVE')},seg('sAB',LINE,'A','B')]),'DIMENSION_POINT_REFS_REQUIRED:d')
        with self.assertRaises(ValueError):build(spec_of(LINE,[{**dim('d','A','M','ABOVE'),'unit':'km'}]))
        self.assertEqual(self.error([{k:v for k,v in dim('d','A','M','ABOVE',labelKind='DEGREE').items() if k!='unit'}]),'MARK_LABEL_KIND_INVALID:d')
        self.assertEqual(self.error([{**dim('d','A','M','ABOVE'),'labelKind':'TEXT'}]),'MARK_UNIT_REQUIRES_MATH_LABEL:d')

class ObserverTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture=Fixture(LINE,line_objects(),{'d1-label':('18','cm'),'d2-label':('24','cm'),'d3-label':('60','cm'),'d4-label':('30','cm')})
    def test_the_genuine_figure_passes(self):
        report=self.fixture.audit();self.assertEqual(report['errors'],[]);self.assertEqual(report['status'],'PASS')
        rows={row['id']:row for row in report['observations'] if row['type']=='DIMENSION'}
        self.assertEqual({k:v['style'] for k,v in rows.items()},{'d1':'BAR','d2':'BAR','d3':'ARROW','d4':'BRACE'})
        self.assertEqual({k:v['offset'] for k,v in rows.items()},{'d1':1,'d2':1,'d3':2,'d4':1})
    def mutate(self,identifier,name,value):
        return replace_attribute(self.fixture.svg(),identifier,name,value)
    def test_tamper_a_dimension_line_moved_closer_or_farther(self):
        node=tag(self.fixture.svg(),'d2-line');y=float(attribute(node,'y1'))
        moved=self.fixture.svg().replace(node,re.sub(r'(\sy2=")[^"]*(")',lambda m:m.group(1)+str(y+3)+m.group(2),re.sub(r'(\sy1=")[^"]*(")',lambda m:m.group(1)+str(y+3)+m.group(2),node)),1)
        self.assertIn('DIMENSION_OFFSET_MISMATCH',self.fixture.codes(svg=moved))
    def test_tamper_a_dimension_line_on_the_wrong_side(self):
        marks=json.loads(json.dumps(line_marks()));marks['dimensions'][1]['side']='ABOVE'
        self.assertIn('DIMENSION_SIDE_MISMATCH',self.fixture.codes(marks=marks))
    def test_tamper_the_end_of_the_line_leaves_its_point(self):
        node=tag(self.fixture.svg(),'d2-line');x=float(attribute(node,'x2'))
        moved=self.fixture.svg().replace(node,re.sub(r'(\sx2=")[^"]*(")',lambda m:m.group(1)+str(x-5)+m.group(2),node),1)
        self.assertIn('DIMENSION_END_MISMATCH',self.fixture.codes(svg=moved))
    def test_tamper_a_dimension_between_other_points(self):
        marks=json.loads(json.dumps(line_marks()));marks['dimensions'][1]['from']='N'
        self.assertTrue({'DIMENSION_END_MISMATCH','DIMENSION_EXTENSION_MISMATCH'}&set(self.fixture.codes(marks=marks)))
    def test_tamper_an_extension_line_that_starts_on_the_point_or_runs_short(self):
        self.assertIn('DIMENSION_EXTENSION_MISMATCH',self.fixture.codes(svg=self.mutate('d2-ext-from','y1',attribute(tag(self.fixture.svg(),'d2-ext-from'),'y2'))))
        node=tag(self.fixture.svg(),'d2-ext-to');y=float(attribute(node,'y2'))
        self.assertIn('DIMENSION_EXTENSION_MISMATCH',self.fixture.codes(svg=self.mutate('d2-ext-to','y2',str(y-6))))
    def test_tamper_a_missing_or_extra_part(self):
        svg=self.fixture.svg();node=tag(svg,'d2-tick-from')
        self.assertIn('DIMENSION_PART_MISSING',self.fixture.codes(svg=svg.replace(node,'')))
        extra=svg.replace(node,node+node.replace('d2-tick-from','d2-spare').replace('data-mark-part="tick-from"','data-mark-part="spare"'))
        self.assertIn('DIMENSION_PART_UNEXPECTED',self.fixture.codes(svg=extra))
    def test_tamper_a_tick_of_the_wrong_length(self):
        node=tag(self.fixture.svg(),'d2-tick-from');y=float(attribute(node,'y1'))
        self.assertIn('DIMENSION_TICK_MISMATCH',self.fixture.codes(svg=self.mutate('d2-tick-from','y1',str(y-3))))
    def test_tamper_an_arrow_head_off_its_end_or_pointing_inward(self):
        node=tag(self.fixture.svg(),'d3-arrow-from');points=points_of(node)
        shifted=self.fixture.svg().replace(node,node.replace(attribute(node,'points'),' '.join('%.9f,%.9f'%(x+4,y) for x,y in points)),1)
        self.assertIn('DIMENSION_ARROW_MISMATCH',self.fixture.codes(svg=shifted))
        tip,left,right=points;turned=[tip,(2*tip[0]-left[0],left[1]),(2*tip[0]-right[0],right[1])]
        inward=self.fixture.svg().replace(node,node.replace(attribute(node,'points'),' '.join('%.9f,%.9f'%q for q in turned)),1)
        self.assertIn('DIMENSION_ARROW_MISMATCH',self.fixture.codes(svg=inward))
    def test_tamper_a_brace_whose_tip_moved_or_that_is_flattened(self):
        node=tag(self.fixture.svg(),'d4-brace');points=points_of(node)
        top=min(range(len(points)),key=lambda i:points[i][1]);moved=list(points);moved[top]=(points[top][0],points[top][1]+4)
        svg=self.fixture.svg().replace(node,node.replace(attribute(node,'points'),' '.join('%.9f,%.9f'%q for q in moved)),1)
        self.assertIn('DIMENSION_BRACE_MISMATCH',self.fixture.codes(svg=svg))
        flat=[(x,points[0][1]) for x,_y in points]
        svg=self.fixture.svg().replace(node,node.replace(attribute(node,'points'),' '.join('%.9f,%.9f'%q for q in flat)),1)
        self.assertIn('DIMENSION_BRACE_MISMATCH',self.fixture.codes(svg=svg))
    def test_tamper_a_declared_length_that_is_not_the_distance(self):
        marks=json.loads(json.dumps(line_marks()));marks['dimensions'][1]['value']=25
        self.assertTrue([e for e in self.fixture.audit(marks=marks)['errors'] if e.startswith('DIMENSION_FACT_MISMATCH:d2')])
        marks['dimensions'][1]['value']=24;self.assertEqual(self.fixture.audit(marks=marks)['errors'],[])
    def test_tamper_an_undeclared_dimension(self):
        marks=json.loads(json.dumps(line_marks()));marks['dimensions']=marks['dimensions'][:3]
        self.assertTrue([e for e in self.fixture.audit(marks=marks)['errors'] if e.startswith('UNDECLARED_MARK:dimension:d4')])
    def box_of(self,label_id):return dict(self.fixture.boxes[label_id])
    def test_tamper_a_label_on_the_wrong_side_of_its_line(self):
        box=self.box_of('d2-label');box['y']-=2*(box['y']-self.fixture.transform['originY'])+box['height']          # mirrored above the segment
        errors=self.fixture.codes(svg=self.fixture.svg({'d2-label':box}))
        self.assertIn('DIMENSION_LABEL_NOT_OUTSIDE',errors)
    def test_tamper_a_label_far_beyond_its_line(self):
        box=self.box_of('d2-label');box['y']+=40
        self.assertIn('DIMENSION_LABEL_TOO_FAR',self.fixture.codes(svg=self.fixture.svg({'d2-label':box})))
    def test_tamper_a_label_slid_away_from_the_middle(self):
        box=self.box_of('d2-label');box['x']+=0.45*24*self.fixture.transform['sx']
        self.assertIn('DIMENSION_LABEL_OFF_CENTER',self.fixture.codes(svg=self.fixture.svg({'d2-label':box})))
    def test_tamper_a_label_on_the_line(self):
        box=self.box_of('d2-label');box['y']=self.fixture.transform['originY']+24-box['height']/2
        errors=self.fixture.codes(svg=self.fixture.svg({'d2-label':box}))
        self.assertIn('MARK_LABEL_OVERLAPS',errors)
    def test_tamper_a_label_that_belongs_to_the_other_dimension(self):
        # d1 (above AM) and d4 (above MN): d1's label moved over to the middle of d4's brace is nearer d4
        box=self.box_of('d1-label');other=self.box_of('d4-label');box['x']=other['x'];box['y']=other['y']
        errors=self.fixture.codes(svg=self.fixture.svg({'d1-label':box}))
        self.assertTrue({'DIMENSION_LABEL_AMBIGUOUS_OWNER','MARK_LABEL_OVERLAPS_LABEL','DIMENSION_LABEL_OFF_CENTER'}&set(errors),errors)
    def test_a_stack_of_two_levels_keeps_each_label_nearest_its_own_line(self):
        fixture=Fixture(LINE,[seg('sAB',LINE,'A','B'),seg('sBC',LINE,'B','C'),dim('d2','B','C','BELOW',labelText='24'),dim('d3','A','C','BELOW',offset=2,labelText='60')],{'d2-label':('24','cm'),'d3-label':('60','cm')})
        self.assertEqual(fixture.layout['unresolved'],[])
        marks={'dimensions':[line_marks()['dimensions'][1],{**line_marks()['dimensions'][2],'style':'BAR'}]}
        self.assertEqual(fixture.audit(marks=marks)['errors'],[])
    def test_a_dimension_line_never_crosses_a_drawn_stroke(self):
        # a vertical figure segment standing across the BELOW dimension of BC
        points={**LINE,'P':(42.0,-6.0),'Q':(42.0,-30.0)}
        objects=[seg('sBC',LINE,'B','C'),seg('sPQ',points,'P','Q'),dim('d2','B','C','BELOW',labelText='24')]
        fixture=Fixture(points,objects,{'d2-label':('24','cm')})
        marks={'dimensions':[line_marks()['dimensions'][1]]}
        errors=fixture.audit(marks=marks,segments=[{'id':'sBC','refs':['B','C']},{'id':'sPQ','refs':['P','Q']}],points=points)['errors']
        self.assertTrue([e for e in errors if e.startswith('DIMENSION_CROSSES_STROKE:d2:sPQ')],errors)
    def test_a_unit_written_in_the_label_is_the_unit(self):
        self.assertEqual(OBSERVER.dimension_label_parts({'label':r'24\,cm'}),('24','cm'))
        self.assertEqual(OBSERVER.dimension_label_parts({'label':r'x\,m','unit':'m'}),('x','m'))
        self.assertEqual(OBSERVER.dimension_label_parts({'label':r'24\,cm','unit':'m'}),(r'24\,cm','m'))
        self.assertEqual(OBSERVER.dimension_label_parts({'label':'24','unit':'cm'}),('24','cm'))
        self.assertEqual(OBSERVER.dimension_label_parts({'label':'24'}),('24',None))

if __name__=='__main__':unittest.main()
