"""Statistics-chart observer: the exact re-derivations and the tamper cases on a small hand-built dice table.
No Chrome here: composed charts are exercised by tests/stat-chart.test.mjs."""
import math
import sys
import unittest
from fractions import Fraction
from pathlib import Path

PRODUCTION=Path(__file__).resolve().parents[1]/'production'
sys.path.insert(0,str(PRODUCTION))
import stat_chart_observer as S


def dice_svg(faces=2,highlight=lambda k,r:False,pair_text=lambda k,r:'(%d,%d)'%(k,r),fill_hi='#c9c9c9'):
    size,x0,y0=40,10,10
    ns='http://www.w3.org/2000/svg'
    out=['<svg xmlns="%s" data-stat-chart="stat-chart-figure-v1" data-kind="DICE_TABLE">'%ns,
         '<rect id="corner" data-role="head" x="%d" y="%d" width="%d" height="%d"/>'%(x0,y0,size,size)]
    def label(identifier,role,owner,tex,cx,cy,extra=''):
        return '<g id="%s" data-label-role="%s" data-owner="%s" data-tex="%s" data-box="%s,%s,10,10"%s/>'%(identifier,role,owner,tex,cx-5,cy-5,extra)
    out.append(label('corner-col','var','corner','a',x0+size*.7,y0+size*.3,' data-axis="col"'))
    out.append(label('corner-row','var','corner','b',x0+size*.3,y0+size*.7,' data-axis="row"'))
    for k in range(1,faces+1):
        out.append('<rect id="head-col-%d" data-role="head" data-axis="col" data-value="%d" x="%d" y="%d" width="%d" height="%d"/>'%(k,k,x0+k*size,y0,size,size))
        out.append('<rect id="head-row-%d" data-role="head" data-axis="row" data-value="%d" x="%d" y="%d" width="%d" height="%d"/>'%(k,k,x0,y0+k*size,size,size))
        out.append(label('head-col-%d-label'%k,'head-value','head-col-%d'%k,str(k),x0+(k+.5)*size,y0+size/2))
        out.append(label('head-row-%d-label'%k,'head-value','head-row-%d'%k,str(k),x0+size/2,y0+(k+.5)*size))
    for r in range(1,faces+1):
        for k in range(1,faces+1):
            hi=highlight(k,r)
            out.append('<rect id="cell-%d-%d" data-role="cell" data-col="%d" data-row="%d" data-highlight="%d" x="%d" y="%d" width="%d" height="%d" fill="%s"/>'%(k,r,k,r,1 if hi else 0,x0+k*size,y0+r*size,size,size,fill_hi if hi else '#fff'))
            out.append(label('cell-%d-%d-label'%(k,r),'cell-value','cell-%d-%d'%(k,r),pair_text(k,r),x0+(k+.5)*size,y0+(r+.5)*size))
    out.append('</svg>')
    return ''.join(out)


class Exact(unittest.TestCase):
    def test_tex_number_reads_integers_decimals_and_stacked_fractions(self):
        self.assertEqual(S.tex_number('\\displaystyle 12'),12)
        self.assertEqual(S.tex_number('0.15'),Fraction(3,20))
        self.assertEqual(S.tex_number('\\displaystyle \\frac{6}{35}'),Fraction(6,35))
        self.assertEqual(S.tex_number('-\\frac{1}{2}'),Fraction(-1,2))
        with self.assertRaises(ValueError): S.tex_number('1/2')
        with self.assertRaises(ValueError): S.tex_number('\\frac{1}{0}')

    def test_five_numbers_follow_the_curriculum_halves(self):
        f=lambda v:{k:str(x) for k,x in S.five_numbers([Fraction(x) for x in v]).items()}
        self.assertEqual(f([2,4,5,7,8,10,12]),{'min':'2','q1':'4','median':'7','q3':'10','max':'12'})
        self.assertEqual(f([1,3,5,7,9,11]),{'min':'1','q1':'3','median':'6','q3':'9','max':'11'})
        self.assertEqual(f([10,20,30,40]),{'min':'10','q1':'15','median':'25','q3':'35','max':'40'})

    def test_frequency_derivation_and_its_refusals(self):
        chart={'kind':'HISTOGRAM','polygon':True,'boundaries':['20','25','30','35'],'series':[{'frequencies':[2,5,3],'total':10}]}
        b,width,mids,series,polygon,y_kind=S.derive_freq(chart)
        self.assertEqual((width,y_kind,polygon),(5,'FREQUENCY',True))
        self.assertEqual([x for x,_ in series[0]['vertices']],[Fraction(35,2),Fraction(45,2),Fraction(55,2),Fraction(65,2),Fraction(75,2)])
        self.assertEqual(S.derive_freq({**chart,'yKind':'RELATIVE'})[3][0]['values'],[Fraction(1,5),Fraction(1,2),Fraction(3,10)])
        for bad,code in (({**chart,'boundaries':['20','25','31','35']},'STAT_CLASS_WIDTH_UNEQUAL'),
                         ({**chart,'series':[{'frequencies':[2,5,3],'total':11}]},'STAT_FREQUENCY_TOTAL_MISMATCH'),
                         ({**chart,'series':[{'relativeFrequencies':['0.5','0.4','0.2']}]},'STAT_RELATIVE_SUM_NOT_ONE')):
            with self.assertRaises(ValueError) as context: S.derive_freq(bad)
            self.assertEqual(str(context.exception),code)

    def test_dice_predicate_grammar(self):
        p={'any':[{'expr':'b-a','in':[0]},{'expr':'b-2*a','in':[0]}]}
        self.assertEqual(sum(S._predicate(p,{'a':k,'b':r}) for k in range(1,7) for r in range(1,7)),9)
        q={'not':{'expr':'a+b','cmp':'>=','value':3}}
        self.assertEqual(sum(S._predicate(q,{'a':k,'b':r}) for k in range(1,7) for r in range(1,7)),1)
        with self.assertRaises(ValueError): S._predicate({'expr':'a+__import__','in':[1]},{'a':1,'b':1})


class DiceTamper(unittest.TestCase):
    chart={'kind':'DICE_TABLE','faces':2,'highlight':{'expr':'a+b','in':[3]}}
    hi=staticmethod(lambda k,r:k+r==3)

    def audit(self,svg,chart=None):
        return S.audit(chart or self.chart,svg)

    def test_the_faithful_table_passes(self):
        result=self.audit(dice_svg(highlight=self.hi))
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['observed']['highlighted'],2)

    def test_a_flipped_cell_a_wrong_text_and_a_wrong_predicate_are_caught(self):
        svg=dice_svg(highlight=self.hi)
        flipped=svg.replace('data-col="2" data-row="2" data-highlight="0"','data-col="2" data-row="2" data-highlight="1"')
        self.assertTrue(any(e.startswith('SC_CELL_HIGHLIGHT:2,2') for e in self.audit(flipped)['errors']))
        wrong_text=dice_svg(highlight=self.hi,pair_text=lambda k,r:'(%d,%d)'%(k,r) if (k,r)!=(1,2) else '(2,2)')
        self.assertTrue(any(e.startswith('SC_CELL_TEXT:1,2') for e in self.audit(wrong_text)['errors']))
        self.assertTrue(any(e.startswith('SC_CELL_HIGHLIGHT') for e in self.audit(svg,{**self.chart,'highlight':{'expr':'a+b','in':[2]}})['errors']))
        wrong_fill=dice_svg(highlight=self.hi,fill_hi='#fff')
        self.assertTrue(any(e.startswith('SC_CELL_HIGHLIGHT') for e in self.audit(wrong_fill)['errors']))

    def test_a_moved_cell_and_a_missing_cell_are_caught(self):
        svg=dice_svg(highlight=self.hi)
        moved=svg.replace('<rect id="cell-1-1" data-role="cell" data-col="1" data-row="1" data-highlight="0" x="50"','<rect id="cell-1-1" data-role="cell" data-col="1" data-row="1" data-highlight="0" x="57"')
        self.assertTrue(any(e.startswith('SC_CELL_GRID:1,1') for e in self.audit(moved)['errors']))
        missing=svg.replace('<rect id="cell-2-2" data-role="cell" data-col="2" data-row="2" data-highlight="0"','<rect id="cell-2-2" data-role="other" data-col="2" data-row="2" data-highlight="0"')
        self.assertIn('SC_CELL_SET',self.audit(missing)['errors'])

    def test_a_non_chart_svg_is_refused(self):
        errors=self.audit(dice_svg(highlight=self.hi).replace('data-stat-chart="stat-chart-figure-v1"','data-stat-chart="x"'))['errors']
        self.assertIn('SC_SVG_NOT_A_STAT_CHART',errors)
        with self.assertRaises(ValueError): S.audit({'kind':'PIE'},'<svg xmlns="http://www.w3.org/2000/svg"/>')


def stem_svg(rows,marks=(),brackets=(),key='0 | 1은 1점',leaf_offset=None):
    """A hand-built one-group stem-and-leaf SVG. rows: {stem: [leaf, ...]} with an int (ones digit) or a str (letter leaf); marks: [(rank, row, index, symbol_or_None, value_or_None)];
    brackets: [(from, to, row, first_index, last_index, count_text_or_None)]. Leaf j of row r sits at x=100+24j, y=100+40r; stems at x=50."""
    ns='http://www.w3.org/2000/svg'
    out=['<svg xmlns="%s" data-stat-chart="stat-chart-figure-v1" data-kind="STEM_LEAF">'%ns]
    def label(identifier,role,owner,cx,cy,attrs,w=10,h=13):
        return '<g id="%s" data-label-role="%s" data-owner="%s" %s data-box="%s,%s,%s,%s"/>'%(identifier,role,owner,attrs,cx-w/2,cy-h/2,w,h)
    out.append(label('head-stem','header','frame',50,70,'data-text="줄기"'))
    out.append(label('head-leaf','header','frame',200,70,'data-text="잎"'))
    out.append(label('key','key','frame',250,300,'data-text="%s"'%key))
    for r,(stem,leaves) in enumerate(sorted(rows.items())):
        cy=100+40*r
        out.append(label('stem-%d'%stem,'stem','frame',50,cy,'data-value="%d" data-tex="%d"'%(stem,stem)))
        for j,leaf in enumerate(leaves):
            cx=100+24*j+(leaf_offset or {}).get((r,j),0)
            attrs=('data-symbol="%s" data-tex="%s"'%(leaf,leaf)) if isinstance(leaf,str) else 'data-value="%d" data-tex="%d"'%(stem*10+leaf,leaf)
            out.append(label('leaf-g0-%d-%d'%(stem,j),'leaf','frame',cx,cy,attrs+' data-group="0" data-stem="%d" data-index="%d"'%(stem,j)))
    for rank,r,j,symbol,value in marks:
        extra=('data-symbol="%s"'%symbol) if symbol else 'data-value="%d"'%value
        out.append('<ellipse id="mark-g0-r%d" data-role="mark" data-group="0" data-rank="%d" %s cx="%s" cy="%s" rx="12" ry="13"/>'%(rank,rank,extra,100+24*j,100+40*r))
    for frm,to,r,first,last,count in brackets:
        ident='class-g0-%d-%d'%(frm,to)
        xl,xr,yb=100+24*first-10,100+24*last+10,100+40*r+17
        out.append('<polyline id="%s" data-role="class-bracket" data-group="0" data-from="%d" data-to="%d" points="%s,%s %s,%s %s,%s %s,%s"/>'%(ident,frm,to,xl,yb-5,xl,yb,xr,yb,xr,yb-5))
        if count is not None: out.append(label(ident+'-count','class-count',ident,(xl+xr)/2,yb+10,'data-tex="%s" data-group="0" data-from="%d" data-to="%d"'%(count,frm,to)))
    out.append('</svg>')
    return ''.join(out)


class StemLetterLeaves(unittest.TestCase):
    # rows: 0 | 1 3 5      1 | 2 a 7     (the letter a is the 2nd leaf of stem 1, so 2 <= a <= 7); ranks: 1 3 5 12 a 17
    chart={'kind':'STEM_LEAF','unitText':'점','values':[1,3,5,12,17,{'symbol':'a','stem':1,'order':2}],'marks':[{'rank':5}],'classGroups':[{'from':0,'to':5,'label':'2'}]}
    rows={0:[1,3,5],1:[2,'a',7]}
    good=staticmethod(lambda **kw:stem_svg({0:[1,3,5],1:[2,'a',7]},marks=[(5,1,1,'a',None)],brackets=[(0,5,0,0,1,'2')],**kw))

    def errors(self,svg,chart=None):
        return S.audit(chart or self.chart,svg)['errors']

    def test_the_plan_is_re_derived_with_the_letter_leaf_in_its_place(self):
        groups,stems=S.stem_plan(self.chart)
        self.assertEqual(stems,[0,1])
        self.assertEqual(groups[0]['rows'],{0:[1,3,5],1:[2,'a',7]})
        self.assertEqual(groups[0]['ordered'],[1,3,5,12,'a',17])
        self.assertEqual(S.audit(self.chart,self.good())['observed']['median'],['17/2'])  # the middle two leaves are 5 and 12, both whole numbers
        self.assertEqual(S.audit({**self.chart,'marks':[],'classGroups':[]},stem_svg(self.rows))['observed']['median'],['17/2'])
        self.assertEqual(S.stem_plan({'kind':'STEM_LEAF','values':[1,3,{'symbol':'a','stem':0,'order':3},7]})[0][0]['ordered'],[1,3,'a',7])

    def test_a_place_the_row_cannot_hold_and_a_repeated_letter_are_refused(self):
        letter=lambda sym,order,stem=1:{'symbol':sym,'stem':stem,'order':order}
        for values,code in (([12,17,letter('a',4)],'STAT_STEM_SYMBOL_ORDER_CONFLICT'),
                            ([12,17,letter('a',2),letter('b',2)],'STAT_STEM_SYMBOL_ORDER_CONFLICT'),
                            ([12,17,letter('a',1),letter('a',3)],'STAT_STEM_SYMBOL_DUPLICATE')):
            with self.assertRaises(ValueError) as context: S.stem_plan({'kind':'STEM_LEAF','values':values})
            self.assertEqual(str(context.exception),code)

    def test_class_counts_are_counted_here_and_an_unsettled_letter_leaf_is_refused(self):
        groups,_=S.stem_plan(self.chart)
        self.assertEqual(S.class_plan(self.chart,groups),[(0,0,5,0,[0,1],2,True)])
        for classes,code in (([{'from':0,'to':5,'label':'3'}],'STAT_STEM_CLASS_COUNT_MISMATCH'),
                             ([{'from':10,'to':15}],'STAT_STEM_CLASS_UNDETERMINED'),
                             ([{'from':0,'to':15}],'STAT_STEM_CLASS_UNSUPPORTED'),
                             ([{'from':20,'to':25}],'STAT_STEM_CLASS_EMPTY'),
                             ([{'from':0,'to':5},{'from':3,'to':8}],'STAT_STEM_CLASS_OVERLAP')):
            with self.assertRaises(ValueError) as context: S.class_plan({**self.chart,'classGroups':classes},groups)
            self.assertEqual(str(context.exception),code)
        self.assertEqual(S.class_plan({**self.chart,'classGroups':[{'from':10,'to':20}]},groups)[0][5],3)  # the whole stem row settles the letter leaf

    def test_the_faithful_figure_passes(self):
        result=S.audit(self.chart,self.good())
        self.assertEqual(result['status'],'PASS',result['errors'])
        self.assertEqual(result['observed']['classes'],[{'group':0,'from':0,'to':5,'count':2}])

    def test_a_circle_on_the_wrong_leaf_a_wrong_letter_and_a_misplaced_bracket_are_caught(self):
        on_seven=stem_svg(self.rows,marks=[(5,1,2,None,17)],brackets=[(0,5,0,0,1,'2')])
        self.assertIn('SC_MARK_NOT_ON_LEAF:5',self.errors(on_seven))
        on_two=stem_svg(self.rows,marks=[(5,1,0,'a',None)],brackets=[(0,5,0,0,1,'2')])
        self.assertIn('SC_MARK_NOT_ON_LEAF:5',self.errors(on_two))
        as_number=stem_svg(self.rows,marks=[(5,1,1,None,15)],brackets=[(0,5,0,0,1,'2')])
        self.assertIn('SC_MARK_SYMBOL:5',self.errors(as_number))
        wrong_letter=stem_svg({0:[1,3,5],1:[2,'b',7]},marks=[(5,1,1,'a',None)],brackets=[(0,5,0,0,1,'2')])
        self.assertIn('SC_LEAVES_MISMATCH:g0:1',self.errors(wrong_letter))
        wide=stem_svg(self.rows,marks=[(5,1,1,'a',None)],brackets=[(0,5,0,0,2,'2')])
        self.assertIn('SC_CLASS_COVER_MISMATCH:0-0-5',self.errors(wide))
        self.assertIn('SC_CLASS_COUNT_VALUE:0-0-5',self.errors(stem_svg(self.rows,marks=[(5,1,1,'a',None)],brackets=[(0,5,0,0,1,'3')])))
        self.assertIn('SC_CLASS_COUNT_LABEL:0-0-5',self.errors(stem_svg(self.rows,marks=[(5,1,1,'a',None)],brackets=[(0,5,0,0,1,None)])))
        self.assertIn('SC_CLASS_SET_MISMATCH',self.errors(stem_svg(self.rows,marks=[(5,1,1,'a',None)])))

    def test_a_rank_without_the_letter_leaf_counting_is_caught(self):
        # rank 4 is the whole number 12 (the letter leaf is rank 5): circling the letter leaf for rank 4 must fail
        chart={**self.chart,'marks':[{'rank':4}]}
        self.assertEqual(self.errors(stem_svg(self.rows,marks=[(4,1,0,None,12)],brackets=[(0,5,0,0,1,'2')]),chart),[])
        self.assertIn('SC_MARK_NOT_ON_LEAF:4',self.errors(stem_svg(self.rows,marks=[(4,1,1,None,12)],brackets=[(0,5,0,0,1,'2')]),chart))


class StemKeyParticle(unittest.TestCase):
    # the particle after the leaf digit follows how the digit is read: 영 일 삼 육 칠 팔 end in a final consonant (은), 이 사 오 구 do not (는)
    particle={0:'은',1:'은',2:'는',3:'은',4:'는',5:'는',6:'은',7:'은',8:'은',9:'는'}

    def test_the_key_text_takes_its_particle_from_the_reading_of_the_leaf_digit(self):
        for digit,particle in self.particle.items():
            self.assertEqual(S.leaf_particle(digit),particle)
            chart={'kind':'STEM_LEAF','unitText':'분','values':[10+digit],'key':{'stem':1,'leaf':digit}}
            good=stem_svg({1:[digit]},key='1 | %d%s %d분'%(digit,particle,10+digit))
            self.assertEqual(S.audit(chart,good)['errors'],[])
            other='는' if particle=='은' else '은'
            wrong=stem_svg({1:[digit]},key='1 | %d%s %d분'%(digit,other,10+digit))
            self.assertIn('SC_KEY_TEXT',S.audit(chart,wrong)['errors'])


class FrequencyMarks(unittest.TestCase):
    erased={'kind':'HISTOGRAM','polygon':True,'boundaries':['10','11','12','13','14','15','16','17'],'series':[{'frequencies':[1,5,8,None,None,5,2]}],'highlightClasses':[0,1,2],
            'classSums':[{'from':0,'to':2,'label':'14','unit':'명'},{'from':3,'to':4,'label':'?'}]}

    def test_hidden_classes_have_no_vertex_and_the_total_fixes_what_they_add_up_to(self):
        _,_,_,series,polygon,_=S.derive_freq(self.erased)
        self.assertEqual(series[0]['values'],[Fraction(1),Fraction(5),Fraction(8),None,None,Fraction(5),Fraction(2)])
        self.assertEqual(series[0]['vertices'][4:6],[None,None])
        self.assertIsNone(series[0]['hidden_sum'])
        self.assertEqual(S.derive_freq({**self.erased,'total':35})[3][0]['hidden_sum'],Fraction(14))
        relative=S.derive_freq({**self.erased,'series':[{'relativeFrequencies':['0.1','0.2','0.3',None,None,'0.1','0.1']}]})[3][0]
        self.assertEqual(relative['hidden_sum'],Fraction(1,5))  # relative frequencies add up to 1
        scaled=S.derive_freq({**self.erased,'yKind':'RELATIVE','total':40})[3][0]
        self.assertEqual((scaled['values'][0],scaled['hidden_sum']),(Fraction(1,40),Fraction(19,40)))

    def test_hidden_class_refusals(self):
        for chart,code in (({**self.erased,'series':[{'frequencies':[None]*7}]},'STAT_FREQUENCY_INVALID'),
                           ({**self.erased,'yKind':'RELATIVE'},'STAT_UNKNOWN_NEEDS_TOTAL'),
                           ({**self.erased,'total':20},'STAT_FREQUENCY_TOTAL_MISMATCH')):
            with self.assertRaises(ValueError) as context: S.derive_freq(chart)
            self.assertEqual(str(context.exception),code)

    def test_marks_tones_restored_hidden_values_and_sums_are_re_derived_from_the_plan(self):
        marked={'kind':'FREQUENCY_POLYGON','boundaries':['50','60','70','80','90','100'],'series':[{'name':'A반','frequencies':[3,6,7,3,1]},{'name':'B반','frequencies':[1,5,8,4,2]}],
                'highlightClasses':[3,{'class':4,'tone':2}],'highlightPoints':[{'series':1,'class':0,'showValue':True}],'classSums':[{'series':1,'from':3,'to':4,'label':'6','unit':'명'}]}
        series,polygon=S.derive_freq(marked)[3:5]
        tones,marks,restored,hide,sums=S.derive_marks(marked,series,polygon)
        self.assertEqual(tones,{3:1,4:2})
        self.assertEqual(marks,{(0,3):{'tone':1,'show':False},(1,3):{'tone':1,'show':False},(0,4):{'tone':2,'show':False},(1,4):{'tone':2,'show':False},(1,0):{'tone':1,'show':True}})
        self.assertEqual(sums,[{'series':1,'from':3,'to':4,'label':'6','unit':'명'}])
        hist={'kind':'HISTOGRAM','boundaries':['0','5','10','15','20','25'],'series':[{'frequencies':[3,6,5,14,2]}],'total':30,'showValues':True,'restoredClasses':[1,2],'hideValues':[1],
              'highlightClasses':[{'classes':[2,3,4],'tone':1}],'classSums':[{'from':2,'to':4,'label':'21.0'}]}
        series,polygon=S.derive_freq(hist)[3:5]
        tones,marks,restored,hide,sums=S.derive_marks(hist,series,polygon)
        self.assertEqual((tones,marks,restored,hide),({2:1,3:1,4:1},{},{1,2},{1}))
        for chart,code in (({**hist,'classSums':[{'from':2,'to':4,'label':'22'}]},'STAT_CLASS_SUM_LABEL_MISMATCH'),
                           ({**hist,'classSums':[{'from':2,'to':4,'label':'?'}]},'STAT_CLASS_SUM_LABEL_INVALID'),
                           ({**self.erased,'classSums':[{'from':3,'to':4,'label':'14'}]},'STAT_CLASS_SUM_UNKNOWN'),
                           ({**self.erased,'total':35,'classSums':[{'from':3,'to':3,'label':'7'}]},'STAT_CLASS_SUM_UNKNOWN'),
                           ({**self.erased,'highlightClasses':[3]},'STAT_HIGHLIGHT_UNKNOWN_CLASS')):
            series,polygon=S.derive_freq(chart)[3:5]
            with self.assertRaises(ValueError) as context: S.derive_marks(chart,series,polygon)
            self.assertEqual(str(context.exception),code)
        series,polygon=S.derive_freq({**self.erased,'total':35,'classSums':[{'from':3,'to':4,'label':'14'}]})[3:5]
        self.assertEqual(S.derive_marks({**self.erased,'total':35,'classSums':[{'from':3,'to':4,'label':'14'}]},series,polygon)[4][0]['label'],'14')

    def test_geometry_helpers_measure_the_gap_between_a_label_box_and_a_line(self):
        box=(10.0,10.0,20.0,10.0)  # x 10..30, y 10..20
        self.assertEqual(S.segment_box_distance((0,0),(40,40),box),0.0)  # the diagonal runs through the box
        self.assertAlmostEqual(S.segment_box_distance((0,25),(40,25),box),5.0)  # a level line 5 below it
        self.assertAlmostEqual(S.segment_box_distance((40,0),(40,40),box),10.0)
        self.assertAlmostEqual(S.segment_box_distance((0,0),(0,0),box),math.hypot(10,10))  # a point
        self.assertAlmostEqual(S.clearance(box,[('circle',(35.0,15.0,2.0),0.5),('segs',[((0,40),(40,40))],0.6)]),2.5)  # the dot 5 away minus its radius and stroke
        self.assertEqual(S.clearance(box,[('segs',[((0,15),(40,15))],0.6)]),-0.6)


class NormalCurvePlan(unittest.TestCase):
    """E36: what the observer derives from a normal-curve plan alone (no Chrome; composed figures are exercised by tests/stat-chart-normal.test.mjs)."""
    base={'kind':'NORMAL_CURVE','curves':[{'id':'X','mean':'50','sd':'2'}],'ticks':['47','50','52'],'zAxis':True,
          'shades':[{'from':'47','to':'50'},{'from':'50','to':'52'}],'areaLabels':[{'shade':0,'text':'0.4332'},{'shade':1,'text':'0.3413'}]}

    def refuses(self,chart,code):
        with self.assertRaises(ValueError) as context: S.normal_plan(chart)
        self.assertEqual(str(context.exception),code)

    def test_decimal_and_tex_of_a_position(self):
        for q,d,t in ((Fraction(3),'3','3'),(Fraction(3,2),'1.5','1.5'),(Fraction(1,2),'0.5','0.5'),(Fraction(-3,2),'-1.5','-1.5'),(Fraction(0),'0','0'),(Fraction(1,3),None,'\\frac{1}{3}'),(Fraction(-1,3),None,'-\\frac{1}{3}')):
            self.assertEqual(S.decimal_of(q),d)
            self.assertEqual(S.tex_num(q),t)
        self.assertEqual(S.normal_tex('m-3\u03c3'),'m-3\\sigma')
        self.assertEqual(S.normal_tex('\u03bc+\u03c3'),'\\mu +\\sigma')

    def test_window_ticks_and_areas_come_from_the_plan(self):
        plan=S.normal_plan(self.base)
        self.assertEqual((plan['lo'],plan['hi'],plan['framed']),(Fraction(42),Fraction(58),False))
        self.assertEqual([(t['u'],t['text'],t['z']) for t in plan['ticks']],[(Fraction(47),'47',Fraction(-3,2)),(Fraction(50),'50',Fraction(0)),(Fraction(52),'52',Fraction(1))])
        self.assertAlmostEqual(plan['shades'][0]['area'],0.433193,places=5)
        self.assertAlmostEqual(plan['shades'][1]['area'],0.341345,places=5)
        # a tail runs to infinity; the sum and difference of table values are read exactly
        tail=S.normal_plan({**self.base,'ticks':['50','52'],'shades':[{'from':None,'to':'52'}],'areaLabels':[{'shade':0,'text':'0.5+0.3413'}]})
        self.assertAlmostEqual(tail['shades'][0]['area'],0.841345,places=5)
        self.assertEqual(S.label_value('0.5-0.0668'),Fraction(4332,10000))

    def test_framed_curve_writes_its_own_letters(self):
        plan=S.normal_plan({'kind':'NORMAL_CURVE','curves':[{'id':'X','mean':'m','sd':'\u03c3'}],'ticks':[{'z':'-3'},{'z':'0'},{'z':'1.5'},{'z':'2','text':'k'}]})
        self.assertTrue(plan['framed'])
        self.assertEqual([t['text'] for t in plan['ticks']],['m-3\u03c3','m','m+1.5\u03c3','k'])
        mixed=S.normal_plan({'kind':'NORMAL_CURVE','curves':[{'id':'X','mean':'20','sd':'\u03c3'}],'ticks':[{'z':'-1.5','text':'k'},{'z':'0'}]})
        self.assertEqual([t['text'] for t in mixed['ticks']],['k','20'])

    def test_refusals_match_the_producers_codes(self):
        self.refuses({**self.base,'curves':[{'id':'X','mean':'50','sd':'0'}]},'STAT_NORMAL_SD_INVALID')
        self.refuses({**self.base,'ticks':['47','47']},'STAT_NORMAL_TICK_DUPLICATE')
        self.refuses({**self.base,'ticks':['70']},'STAT_NORMAL_TICK_OUT_OF_WINDOW')
        self.refuses({**self.base,'shades':[{'from':'48','to':'50'}]},'STAT_NORMAL_BOUNDARY_NOT_TICKED')
        self.refuses({**self.base,'areaLabels':[{'shade':0,'text':'0.4000'}]},'STAT_NORMAL_AREA_LABEL_MISMATCH')
        self.refuses({**self.base,'symmetry':[{'pair':['47','52']}]},'STAT_NORMAL_SYMMETRY_MISMATCH')
        self.refuses({**self.base,'areaLabels':[{'shade':0,'text':'p'},{'shade':1,'text':'p'}]},'STAT_NORMAL_AREA_SYMBOL_UNEQUAL')
        self.refuses({'kind':'NORMAL_CURVE','curves':[{'id':'X','mean':'0','sd':'1'},{'id':'Y','mean':'9','sd':'1'}],'ticks':['0']},'STAT_NORMAL_WINDOW_TOO_WIDE')
        self.refuses({**self.base,'curves':[{'id':'X','mean':'50','sd':'2'},{'id':'Y','mean':'52','sd':'2'}]},'STAT_NORMAL_Z_AXIS_AMBIGUOUS')

    def test_polygon_helpers(self):
        square=[(0.0,0.0),(10.0,0.0),(10.0,10.0),(0.0,10.0)]
        self.assertTrue(S.inside_polygon((5.0,5.0),square))
        self.assertFalse(S.inside_polygon((11.0,5.0),square))
        self.assertAlmostEqual(S.polygon_clearance((5.0,2.0),square),2.0)
        self.assertEqual(S.shoelace(square),100.0)
        self.assertTrue(S.segments_cross((0,0),(10,10),(0,10),(10,0)))
        self.assertFalse(S.segments_cross((0,0),(10,0),(10,0),(10,10)))     # touching at an end is not crossing


if __name__=='__main__':
    unittest.main()
