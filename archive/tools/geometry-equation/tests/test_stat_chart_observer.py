"""Statistics-chart observer: the exact re-derivations and the tamper cases on a small hand-built dice table.
No Chrome here: composed charts are exercised by tests/stat-chart.test.mjs."""
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


if __name__=='__main__':
    unittest.main()
