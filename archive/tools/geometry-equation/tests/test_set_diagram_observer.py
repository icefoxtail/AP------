"""Set-diagram observer: the exact region truth and the tamper cases on hand-built SVGs.
No Chrome here: composed diagrams are exercised by tests/set-diagram.test.mjs."""
import sys
import unittest
from pathlib import Path

PRODUCTION=Path(__file__).resolve().parents[1]/'production'
sys.path.insert(0,str(PRODUCTION))
import set_diagram_observer as S

NS='http://www.w3.org/2000/svg'


def label(identifier,role,box,text,extra='',math=False):
    x,y,w,h=box
    attr='data-tex' if math else 'data-text'
    return '<g id="%s" data-label-role="%s" %s="%s" data-box="%s,%s,%s,%s"%s/>'%(identifier,role,attr,text,x,y,w,h,extra)


def venn_svg(shade_full=True,elements=((125,120,'9'),(165,170,'9')),label_a=(60,60),label_b=(262,60)):
    """A two-circle Venn (A at (120,170), B at (210,170), r=70) in a 330x240 universal rectangle."""
    out=['<svg xmlns="%s" data-set-diagram="set-diagram-figure-v1" data-kind="VENN">'%NS]
    out.append('<rect id="universal" data-role="universal" x="30" y="40" width="330" height="240" fill="none"/>')
    out.append('<ellipse id="set-A" data-role="set" data-set="A" cx="120" cy="170" rx="70" ry="70" fill="none"/>')
    out.append('<ellipse id="set-B" data-role="set" data-set="B" cx="210" cy="170" rx="70" ry="70" fill="none"/>')
    if shade_full:
        out.append('<path id="shade-0" data-role="shade" data-cell="U" fill="#cfcfcf" d="M 31 41 L 358 41 L 358 278 L 31 278 Z"/>')
    out.append(label('universal-name','universal-name',(42,52,12,14),'U'))
    out.append(label('set-name-A','set-name',label_a+(16,18),'A',' data-set="A"'))
    out.append(label('set-name-B','set-name',label_b+(16,18),'B',' data-set="B"'))
    for index,(cx,cy,text) in enumerate(elements):
        out.append(label('element-%d'%index,'element',(cx-8,cy-10,16,20),text,' data-element="%d"'%index))
    out.append('</svg>')
    return ''.join(out)


VENN_PLAN={'kind':'VENN','sets':[{'id':'A'},{'id':'B'}],
           'elements':[{'text':'9','in':['A']},{'text':'9','in':['A','B']}],'shade':'U'}


def mapping_svg(end_y=150,extra_arrow=False):
    out=['<svg xmlns="%s" data-set-diagram="set-diagram-figure-v1" data-kind="MAPPING">'%NS]
    out.append('<ellipse id="oval-X" data-role="oval" data-column="0" cx="120" cy="120" rx="60" ry="80" fill="#fff"/>')
    out.append('<ellipse id="oval-Y" data-role="oval" data-column="1" cx="340" cy="120" rx="60" ry="80" fill="#fff"/>')
    out.append(label('column-name-X','column-name',(112,24,16,18),'X',' data-column="0"'))
    out.append(label('column-name-Y','column-name',(332,24,16,18),'Y',' data-column="1"'))
    out.append(label('element-0-0','element',(110,62,20,16),'1',' data-column="0" data-element="0"'))
    out.append(label('element-0-1','element',(110,142,20,16),'2',' data-column="0" data-element="1"'))
    out.append(label('element-1-0','element',(330,62,20,16),'a',' data-column="1" data-element="0"'))
    out.append(label('element-1-1','element',(330,142,20,16),'b',' data-column="1" data-element="1"'))
    out.append('<polyline id="arrow-0" data-role="arrow" data-arrow="0" data-from-column="0" data-from-element="0" data-to-column="1" data-to-element="1" '
               'points="134,70 146,70 314,%d 326,%d" stroke="#111" stroke-width="1.4" fill="none"/>'%(end_y,end_y))
    out.append('<polygon id="arrow-head-0" data-role="arrow-head" data-arrow="0" points="326,%d 317,%d 317,%d" fill="#111"/>'%(end_y,end_y-3.6,end_y+3.6))
    if extra_arrow:
        out.append('<polyline id="arrow-1" data-role="arrow" data-arrow="1" data-from-column="0" data-from-element="1" data-to-column="1" data-to-element="0" '
                   'points="134,150 146,150 314,70 326,70" stroke="#111" stroke-width="1.4" fill="none"/>')
        out.append('<polygon id="arrow-head-1" data-role="arrow-head" data-arrow="1" points="326,70 317,66.4 317,73.6" fill="#111"/>')
    out.append('</svg>')
    return ''.join(out)


MAPPING_PLAN={'kind':'MAPPING','columns':[{'id':'X','elements':['1','2']},{'id':'Y','elements':['a','b']}],
              'arrows':[{'from':{'column':0,'element':0},'to':{'column':1,'element':1}}]}


class Exact(unittest.TestCase):
    def test_set_expression_truth_table(self):
        fn=S.parse_expression('(A∩B)∪(A∪B)ᶜ',['A','B'])
        truth=[(mask,bool(fn(mask))) for mask in range(4)]
        self.assertEqual(truth,[(0,True),(1,False),(2,False),(3,True)])
        self.assertFalse(S.parse_expression('A-B',['A','B'])(2))
        self.assertTrue(S.parse_expression('A-B',['A','B'])(1))
        self.assertTrue(S.parse_expression('(A∪B)^c',['A','B'])(0))
        self.assertTrue(S.parse_expression('A∩B∩C',['A','B','C'])(7))
        for bad in ('A∪','()','A∩D','A^c^','1+2'):
            with self.assertRaises(ValueError): S.parse_expression(bad,['A','B'])

    def test_box_membership_and_oval_relation(self):
        a={'cx':120,'cy':170,'rx':70,'ry':70,'id':'A'}
        b={'cx':210,'cy':170,'rx':70,'ry':70,'id':'B'}
        doc=S.Doc(venn_svg(),'VENN')
        self.assertEqual(S.box_membership((157,160,16,20),[a,b],doc,'X'),3)   # the lens
        self.assertEqual(S.box_membership((117,110,16,20),[a,b],doc,'X'),1)   # A only
        self.assertEqual(S.box_membership((40,50,16,20),[a,b],doc,'X'),0)     # outside
        self.assertEqual(S.box_relation((-10,-10,16,20),a)[0],'OUTSIDE')
        self.assertEqual(S.box_relation((44,160,20,20),a)[0],'CROSSES')

    def test_shade_path_parsing_accepts_only_the_documented_subset(self):
        class _P:
            def get(self,name): return {'d':'M 1 2 L 3 4 L 5 6 Z'}.get(name)
        path=_P()
        self.assertEqual(S.parse_shade_path(path),[[(1,2),(3,4),(5,6)]])
        for bad in ('M 1 2 C 3 4 5 6 7 8 Z','M 1 2 L 3 Q 4 5 Z','L 1 2'):
            class _Q:
                def __init__(self,data): self.data=data
                def get(self,name): return self.data if name=='d' else None
            broken=_Q(bad)
            with self.assertRaises(ValueError): S.parse_shade_path(broken)

    def test_inside_contours_is_even_odd_with_a_hole(self):
        outer=[(0,0),(10,0),(10,10),(0,10)]
        inner=[(3,3),(7,3),(7,7),(3,7)]
        self.assertTrue(S.inside_contours(1,1,[outer]))
        self.assertFalse(S.inside_contours(5,5,[outer,inner]))
        self.assertTrue(S.inside_contours(5,5,[outer]))


class VennTamper(unittest.TestCase):
    def audit(self,svg,plan=None):
        return S.audit(plan or VENN_PLAN,svg)

    def test_a_faithful_figure_passes(self):
        result=self.audit(venn_svg())
        self.assertEqual(result['status'],'PASS',result['errors'])

    def test_a_wrong_region_shaded_and_a_missing_shade_are_caught(self):
        result=self.audit(venn_svg(),{**VENN_PLAN,'shade':'A'})
        self.assertEqual(result['status'],'FAIL')
        self.assertTrue(any(e.startswith('SD_SHADE_MISMATCH') for e in result['errors']))
        missing=self.audit(venn_svg(shade_full=False))
        self.assertIn('SD_SHADE_MISSING',missing['errors'])

    def test_an_element_in_the_wrong_region_is_caught(self):
        # the A-only element (index 0) is drawn inside the B-only part
        svg=venn_svg(elements=((205,120,'9'),(165,170,'9')))
        errors=self.audit(svg)['errors']
        self.assertIn('SD_ELEMENT_REGION:0',errors)

    def test_an_element_outside_the_universal_or_a_crossing_box_is_caught(self):
        svg=venn_svg(elements=((125,120,'9'),(200,300,'9')))
        self.assertIn('SD_ELEMENT_OUTSIDE_UNIVERSAL:1',self.audit(svg)['errors'])
        crossing=venn_svg(elements=((52,170,'9'),(165,170,'9')))
        self.assertIn('SD_ELEMENT_REGION:0',self.audit(crossing)['errors'])

    def test_labels_and_set_names_are_checked(self):
        svg=venn_svg(label_a=(110,160))
        errors=self.audit(svg)['errors']
        self.assertIn('SD_SET_LABEL_INSIDE_SET:A',errors)
        wrong=venn_svg().replace('data-set="B"','data-set="C"')
        self.assertIn('SD_SET_ELLIPSE_SET',self.audit(wrong)['errors'])
        swapped=venn_svg().replace('data-text="A" data-box','data-text="Z" data-box')
        self.assertIn('SD_SET_LABEL_TEXT:A',self.audit(swapped)['errors'])


class MappingTamper(unittest.TestCase):
    def audit(self,svg,plan=None):
        return S.audit(plan or MAPPING_PLAN,svg)

    def test_a_faithful_mapping_passes(self):
        result=self.audit(mapping_svg())
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['observed']['arrows'],1)

    def test_an_arrow_to_the_wrong_element_is_caught(self):
        result=self.audit(mapping_svg(end_y=70))
        self.assertEqual(result['status'],'FAIL')
        self.assertIn('SD_ARROW_END:0',result['errors'])

    def test_an_undeclared_arrow_and_a_missing_arrow_head_are_caught(self):
        result=self.audit(mapping_svg(extra_arrow=True))
        self.assertIn('SD_ARROW_SET',result['errors'])
        missing=self.audit(mapping_svg().replace('<polygon id="arrow-head-0" data-role="arrow-head" data-arrow="0"','<polygon id="arrow-head-0" data-role="head" data-arrow="0"'))
        self.assertIn('SD_ARROW_HEAD:0',missing['errors'])

    def test_an_element_outside_its_oval_and_a_wrong_column_name_are_caught(self):
        svg=mapping_svg().replace('data-box="110,142,20,16"','data-box="110,15,20,16"')
        self.assertIn('SD_ELEMENT_NOT_IN_OVAL:0:1',self.audit(svg)['errors'])
        wrong=mapping_svg().replace('data-text="Y" data-box','data-text="Z" data-box')
        self.assertIn('SD_COLUMN_NAME_TEXT:1',self.audit(wrong)['errors'])


if __name__=='__main__':
    unittest.main()
