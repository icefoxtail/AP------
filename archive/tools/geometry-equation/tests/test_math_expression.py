import json,sys,unittest,xml.etree.ElementTree as ET
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.math_expression import parse,serialize,evaluate,exact_coordinate,Expr

class MathTests(unittest.TestCase):
    def test_gold_regression(self):
        expected={ '(x+1)^2+(y-3)^2=2^2':'(x+1)^{2}+(y-3)^{2}=2^{2}', 'x^2-3x+4':'x^{2}-3x+4', '3(x-1)^2-3':'3(x-1)^{2}-3', 'x^3-4x':'x^{3}-4x', 'sqrt(5)':r'\sqrt{5}', '1/2':r'{\displaystyle\frac{1}{2}}', '-3/2':r'-{\displaystyle\frac{3}{2}}', "f'(x)":r'f^{\prime}(x)', 'x<=2':r'x\le 2'}
        for source,tex in expected.items():
            with self.subTest(source=source):
                self.assertEqual(serialize(parse(source)),tex)
                self.assertNotIn('\\\\',serialize(parse(source)))
    def test_exponent_display_scope(self):
        markup=serialize(parse('x^2-3x+4'),'svg')
        root=ET.fromstring('<text>'+markup+'</text>')
        sup=root.find("tspan[@baseline-shift='super']")
        self.assertEqual(''.join(sup.itertext()),'2')
        self.assertIn('−3',sup.tail)
    def test_precedence(self):
        for source,value in (('-x^2',-9),('2^3^2',512),('3(x-1)^2-3',9),('x^3-4x',15)):
            self.assertEqual(evaluate(parse(source),{'x':3}),value)
    def test_coordinate_tuple_and_subscript(self):
        self.assertEqual(evaluate(parse('(1/2,-3/2)')),(0.5,-1.5))
        self.assertEqual(serialize(parse('x_1')), 'x_{1}')
    def test_functions(self):
        for source in ('sin(0)','cos(0)','tan(0)','log(1)','exp(0)','abs(-2)','sqrt(5)'):
            self.assertIsNotNone(evaluate(parse(source)))
    def test_coordinate_accuracy(self):
        self.assertEqual(exact_coordinate('2/4',.5),'1/2')
        self.assertEqual(exact_coordinate('-3/2',-1.5),'−3/2')
        self.assertEqual(exact_coordinate('sqrt(2)',2**.5),'√(2)')
        for source,value in (('0.6667',2/3),('1/2',1/3),('x',1)):
            with self.assertRaises(ValueError):exact_coordinate(source,value)
    def test_decimal_source_exception(self):
        self.assertEqual(exact_coordinate('0.5',.5,True),'1/2')
    def test_unsafe_rejection(self):
        for source in (r'x\\frac{1}{2}','x.__class__','__import__(x)','[x]','sin(1,2)','x;3','(x+1','x^',"'x"):
            with self.subTest(source=source),self.assertRaises(ValueError):parse(source)
    def test_limits(self):
        for source in ('('*40+'x'+')'*40,'x+'*300+'x'):
            with self.assertRaises(ValueError):parse(source)
    def test_textbook_notation(self):
        cases={'-3/2':(r'-{\displaystyle\frac{3}{2}}','−3/2'),'-3/2*x':(r'-{\displaystyle\frac{3}{2}}x','−3/2·x'),'3*x':('3x','3x'),'-2*x':('-2x','−2x'),'2*sqrt(5)':(r'2\sqrt{5}','2√(5)'),'2*3':(r'2\cdot 3','2·3'),
               '(1/2)*sqrt(34)':(r'{\displaystyle\frac{\sqrt{34}}{2}}','√(34)/2'),'(-1/2)*sqrt(34)':(r'-{\displaystyle\frac{\sqrt{34}}{2}}','−√(34)/2'),
               '(-5/2)*sqrt(3)':(r'-{\displaystyle\frac{5\sqrt{3}}{2}}','(−5√(3))/2'),'(8/5)*sqrt(10)':(r'{\displaystyle\frac{8\sqrt{10}}{5}}','(8√(10))/5')}
        for source,(tex,plain) in cases.items():
            with self.subTest(source=source):
                self.assertEqual(serialize(parse(source),'tex'),tex);self.assertEqual(serialize(parse(source),'plain'),plain)
    def test_degree_notation(self):
        self.assertEqual(serialize(parse('15°')),r'15^{\circ}')
        self.assertEqual(serialize(parse('15°'),'plain'),'15°')
        self.assertEqual(serialize(parse('15°'),'svg'),'15°')
        self.assertEqual(serialize(parse('-15°'),'plain'),'−15°')
        self.assertEqual(serialize(parse('2x+15°'),'plain'),'2x+15°')
        self.assertEqual(''.join(ET.fromstring('<text>'+serialize(parse('15°'),'svg')+'</text>').itertext()),'15°')
    def test_relation(self):
        self.assertTrue(evaluate(parse('x<=2'),{'x':1}))
        self.assertFalse(evaluate(parse('x=2'),{'x':1}))

class VectorNameTests(unittest.TestCase):
    """(G3) vec(a) / vec(AB) are the only way a label names a vector; every other expression reads and writes exactly as before."""
    def test_tex(self):
        for source,tex in {'vec(a)':r'\vec{a}','vec(AB)':r'\overrightarrow{AB}','vec(a)+vec(b)':r'\vec{a}+\vec{b}','2vec(a)-vec(b)':r'2\vec{a}-\vec{b}',
                           '(-3vec(a)+vec(b))/4':r'{\displaystyle\frac{-3\vec{a}+\vec{b}}{4}}','vec(AB)+vec(AF)':r'\overrightarrow{AB}+\overrightarrow{AF}','-vec(a)':r'-\vec{a}'}.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source)),tex)
    def test_plain_and_svg_text_carry_the_arrow(self):
        self.assertEqual(serialize(parse('vec(a)+vec(b)'),'plain'),'a\u20d7+b\u20d7')
        self.assertEqual(''.join(ET.fromstring('<text>'+serialize(parse('2vec(a)-vec(AB)'),'svg')+'</text>').itertext()),'2a\u20d7−AB\u20d7')
    def test_bad_names_are_refused(self):
        for source in ('vec()','vec(ab)','vec(vec(a))','vec(1)','vec(A)','vec(AAB)','vec(a','vec(a,b)'):
            with self.subTest(source=source),self.assertRaises(ValueError) as caught:parse(source)
            self.assertEqual(str(caught.exception),'VECTOR_LABEL_INVALID')
    def test_a_backslash_is_still_refused(self):
        with self.assertRaises(ValueError):parse(r'\vec{a}')
    def test_other_expressions_are_unchanged(self):
        for source,tex in {'v':'v','vec':'vec','x+1':'x+1','2v':'2v','vector':'vector'}.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source)),tex)

    def test_a_bracketed_exponent_is_a_superscript(self):
        # The brackets of a power that is not a bare number are not drawn; a bracketed bare number keeps them (x^(2) has always been drawn that way).
        expected={'2^(x)':'2^{x}','2^(x+1)':'2^{x+1}','e^(-x)':'e^{-x}','2^(2(x+1))':'2^{2(x+1)}','x^(2)':'x^{(2)}','x^(-1)':'x^{(-1)}','(x+1)^(2)':'(x+1)^{(2)}'}
        for source,tex in expected.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source)),tex)
    def test_a_factor_before_a_power_needs_a_product_sign(self):
        # 3 and 2^(x+1) side by side lex as the number 32; with an explicit * the dot is drawn.
        self.assertEqual(serialize(parse('y=3*2^(x+1)-2')),r'y=3\cdot 2^{x+1}-2')
        self.assertEqual(serialize(parse('y=32^(x+1)-2')),'y=32^{x+1}-2')
        self.assertEqual(serialize(parse('y=3*e^(x)')),'y=3e^{x}')

class LabelNotationTests(unittest.TestCase):
    """(EXT-20261122) Units after a sum, the degree sign, and the label vocabulary of a plane figure. What a figure got right keeps its exact glyphs."""
    def modes(self,tree):return [serialize(tree,mode) for mode in ('tex','plain','svg')]
    def quantity(self,text,unit):return Expr('quantity',unit,(parse(text),))
    def degree(self,text):return Expr('degree','',(parse(text),))
    def refused(self,tree,mode='tex'):
        with self.assertRaises(ValueError) as caught:serialize(tree,mode)
        return str(caught.exception)

    def test_labels_the_figure_was_right_about_are_unchanged(self):
        # Recorded from the engine before this change: the 11 published degree labels whose x is an angle (2x+15°, x+20°, 2x-70°, a+b°, 180-x°, ...), the bracketed forms,
        # and every unit label that is not a sum (3cm, x cm, 2x m, (x+2)cm, 4pi cm, sqrt(3) cm). Not one of them may print differently.
        golden=json.loads((Path(__file__).resolve().parent/'math_expression_golden_base.json').read_text(encoding='utf8'))
        self.assertGreaterEqual(len(golden),30)
        for key,expected in golden.items():
            with self.subTest(label=key):
                if key.startswith('U|'):_,text,unit=key.split('|');tree=self.quantity(text,unit)
                else:tree=self.degree(key)
                self.assertEqual(self.modes(tree),expected)

    def test_a_unit_after_a_sum_or_difference_belongs_to_the_whole_sum(self):
        cases=[('4+x','cm',r'(4+x)\,\mathrm{cm}','(4+x) cm'),('12-t','cm',r'(12-t)\,\mathrm{cm}','(12−t) cm'),('x+3','m',r'(x+3)\,\mathrm{m}','(x+3) m'),('20+2x','m',r'(20+2x)\,\mathrm{m}','(20+2x) m')]
        for text,unit,tex,plain in cases:
            with self.subTest(text=text):
                tree=self.quantity(text,unit)
                self.assertEqual(serialize(tree,'tex'),tex);self.assertEqual(serialize(tree,'plain'),plain)
                self.assertEqual(''.join(ET.fromstring('<text>'+serialize(tree,'svg')+'</text>').itertext()),plain)
        self.assertEqual(serialize(Expr('unit','cm',(parse('4+x'),)),'tex'),r'(4+x)\,\mathrm{cm}')
    def test_numbers_joined_only_by_a_space_are_refused_not_guessed(self):
        # "x=-1 0 1" is a list of values and "3 2^x" a product: nothing tells them apart, so neither a dot nor a run-together number is drawn
        for source in ('2 3','2 3 4','x=-1 0 1','y=2 (x=-1 0 1)','y=3 2^(x)','-2 3','x+2 3','2^3 4','1/2 3'):
            with self.subTest(source=source),self.assertRaises(ValueError) as caught:parse(source)
            self.assertEqual(str(caught.exception),'NUMBER_JUXTAPOSITION_UNCLEAR')
        # written as a product (*) or as a list (commas), or with a letter / bracket between, they read as written
        self.assertEqual(serialize(parse('y=3*2^(x)'),'tex'),r'y=3\cdot 2^{x}')
        self.assertEqual(serialize(parse('x=(-1,0,1)'),'plain'),'x=(−1,0,1)')
        for source in ('A5','S1','r2','3x','2(x+1)','3e^(x)','2sqrt(3)','(2)3','x 2','2x 3','32','3.5'):
            with self.subTest(source=source):
                self.assertNotIn('cdot',serialize(parse(source),'tex'))
    def test_a_label_naming_an_angle_without_a_value_is_not_a_degree_value(self):
        for text in ('∠B','△ABC','∠ABC'):
            with self.subTest(text=text):self.assertEqual(self.refused(self.degree(text)),'DEGREE_LABEL_NEEDS_VALUE')
        self.assertEqual(serialize(self.degree('∠B=4x'),'plain'),'∠B=4x°')
        self.assertEqual(serialize(parse('∠B=40°'),'plain'),'∠B=40°')
    def test_the_unit_of_an_equation_label_follows_its_right_side(self):
        # the engine wraps only the right side of "x=4+y" in the quantity (tree: x = quantity(4+y))
        tree=Expr('binary','=',(parse('x'),self.quantity('4+y','cm')))
        self.assertEqual(serialize(tree,'tex'),r'x=(4+y)\,\mathrm{cm}')
        self.assertEqual(serialize(tree,'plain'),'x=(4+y) cm')
    def test_a_unit_given_beside_a_sum_brackets_it_even_when_a_variable_is_spelled_like_the_unit(self):
        for text,unit,plain in (('s+1','s','(s+1) s'),('m+1','m','(m+1) m'),('x+m','m','(x+m) m'),('1+g','g','(1+g) g')):
            with self.subTest(text=text,unit=unit):self.assertEqual(serialize(self.quantity(text,unit),'plain'),plain)
        self.assertEqual(serialize(self.quantity('s','s'),'plain'),'s s')   # a lone variable is not a sum
    def test_only_a_sum_is_bracketed(self):
        for text in ('3','x','2x','x/2','3*sqrt(3)','4*pi','(x+2)'):
            with self.subTest(text=text):self.assertEqual(serialize(self.quantity(text,'cm'),'plain').count('('),text.count('('))

    def test_a_degree_label_keeps_the_sign_it_is_written_with(self):
        # x+20 with the degree label kind is x+20° (right when x is an angle, x=30° style); the plan's own bracket is drawn as written.
        self.assertEqual(serialize(self.degree('x+20'),'plain'),'x+20°')
        self.assertEqual(serialize(self.degree('(x+20)'),'plain'),'(x+20)°')
        self.assertEqual(serialize(self.degree('(x+20)'),'tex'),r'(x+20)^{\circ}')
    def test_the_degree_sign_is_not_written_twice(self):
        for text,plain in (('50°','50°'),('x=40°','x=40°'),('x+20°','x+20°'),('(x+20°)','(x+20°)'),('-30°','−30°')):
            with self.subTest(text=text):
                self.assertEqual(serialize(self.degree(text),'plain'),plain)
                self.assertNotIn(r'^{\circ}^{\circ}',serialize(self.degree(text),'tex'))
        self.assertEqual(serialize(self.degree('50°'),'tex'),r'50^{\circ}')
        self.assertEqual(serialize(self.degree('50'),'tex'),r'50^{\circ}')

    def test_a_degree_sign_on_a_radian_value_is_refused(self):
        for text in ('pi/3°','4pi°','pi°','(pi/3)°','2pi/3°','π/4°','x=pi/6°'):
            for mode in ('tex','plain','svg'):
                with self.subTest(text=text,mode=mode):self.assertEqual(self.refused(parse(text),mode),'DEGREE_OF_RADIAN_VALUE')
        for text in ('pi/3','4pi','pi'):      # the degree label kind puts the sign on whatever it is given
            with self.subTest(label_kind_degree=text):self.assertEqual(self.refused(self.degree(text)),'DEGREE_OF_RADIAN_VALUE')
        self.assertEqual(serialize(parse('pi/3'),'plain'),'π/3')
    def test_legitimate_degrees_and_pi_are_accepted(self):
        for text in ('x°','θ°','2A°','x/2°','60°=pi/3','2*pi*r*(60°/360°)','180°/pi','30°','sin(30°)=1/2'):
            with self.subTest(text=text):self.assertIsInstance(serialize(parse(text),'tex'),str)
        self.assertEqual(serialize(self.degree('theta'),'plain'),'theta°')
        self.assertEqual(serialize(self.degree('θ'),'tex'),r'\theta^{\circ}')

    def test_relation_sign_and_ratio_vocabulary(self):
        cases={'x≈0.84':(r'x\approx 0.84','x≈0.84'),'x≤3':(r'x\le 3','x≤3'),'x≥3':(r'x\ge 3','x≥3'),'x≠3':(r'x\ne 3','x≠3'),'x±2':(r'x\pm 2','x±2'),'±3':(r'\pm 3','±3'),
               'AB∥CD':(r'AB\parallel CD','AB∥CD'),'AB⊥CD':(r'AB\perp CD','AB⊥CD'),'△ABC≡△DEF':(r'\triangle ABC\equiv \triangle DEF','△ABC≡△DEF'),'△ABC∽△DEF':(r'\triangle ABC\sim \triangle DEF','△ABC∽△DEF'),
               '△ABC≅△DEF':(r'\triangle ABC\cong \triangle DEF','△ABC≅△DEF'),'∠A=∠B':(r'\angle A=\angle B','∠A=∠B'),'□ABCD':(r'\square ABCD','□ABCD'),'AD:DB=3:2':('AD:DB=3:2','AD:DB=3:2'),
               '2×3':(r'2\times 3','2×3'),'6÷3':(r'6\div 3','6÷3'),'30%':(r'30\%','30%'),'x²':('x^{2}','x^(2)'),'m³':('m^{3}','m^(3)'),'3·4':(r'3\cdot 4','3·4')}
        for source,(tex,plain) in cases.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source),'tex'),tex);self.assertEqual(serialize(parse(source),'plain'),plain)
        self.assertEqual(evaluate(parse('6÷3×2')),4);self.assertEqual(evaluate(parse('2×3')),6);self.assertTrue(evaluate(parse('x≤3'),{'x':2}))
    def test_a_whole_number_coefficient_is_not_bracketed(self):
        # y=(6)x-1 from a bracketed integer slope reads y=6x-1; a negative one loses its brackets where a sign may lead; fractions, decimals and sums keep theirs.
        cases={'y=(6)x-1':'y=6x-1','y=(-6)x-1':'y=-6x-1','y=(2)x+3':'y=2x+3','y=(-2)x':'y=-2x','(6)x':'6x','(-6)x':'-6x','(6)*x':'6x','(-6)*x':'-6x','y=(1)x':'y=x','y=(-1)x':'y=-x',
               'y=(6)x^2+(3)x':'y=6x^{2}+3x','(2)sqrt(3)':r'2\sqrt{3}','y=2(6)x':'y=2(6)x'}
        for source,tex in cases.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source),'tex'),tex)
        for source in ('y=(1/2)x','y=(-1/2)x','y=(0.5)x','y=(x+1)x','y=(2+x)*x','a-(-2)x','a+(-2)x','a*(-2)x','-(−2)x','(6)(x+1)','x^(2)','(6)2','y=(6)'):
            with self.subTest(kept=source):
                before=serialize(parse(source),'plain')
                self.assertIn('(',before)
        self.assertEqual(serialize(parse('a-(-2)x'),'plain'),'a−(−2)x')
        self.assertEqual(serialize(parse('(1/2)x'),'tex'),r'({\displaystyle\frac{1}{2}})x')   # a fraction keeps the notation it always had
        self.assertEqual(evaluate(parse('(6)x-1'),{'x':2}),11)   # the written label changes, not the value
    def test_a_coefficient_of_one_is_left_out_not_written_as_1x(self):
        # a textbook writes -x^2 and x+3, never -1x^2 or 1x+3
        cases={'y=(-1)*x^2':'y=-x^{2}','y=(1)*x+3':'y=x+3','y=(-1)x':'y=-x','y=(-1)*x^(2)+2*x+3':'y=-x^{(2)}+2x+3','y=1*x':'y=x','y=-1*x':'y=-x','1*x':'x','a-(1)*x':'a-x',
               'x=(-1,(1)*x)':'x=(-1,x)','y=(1)*x^2':'y=x^{2}'}
        for source,tex in cases.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source),'tex'),tex)
        # a number that merely starts with 1, a 1 beside a unit or a name, an exponent and a sum of brackets are not coefficients
        for source in ('1cm','1 m','1a','10x','-11x','x^(1)','(1)+(2)','(1)(x)','2(1)x','3*1*x','a+(-1)*x'):
            with self.subTest(kept=source):
                before=serialize(parse(source),'plain')
                self.assertEqual(before.count('1'),source.count('1'))   # no 1 was dropped
        # a coefficient other than 1 is never dropped
        for source,tex in {'y=(2)*x':'y=2x','y=(-2)*x':'y=-2x','y=(12)*x':'y=12x','y=(-11)*x':'y=-11x'}.items():
            with self.subTest(source=source):self.assertEqual(serialize(parse(source),'tex'),tex)
    def test_a_one_before_a_unit_word_is_a_length_and_stays(self):
        # (1)cm and 1*cm are one centimetre: dropping the 1 would leave a figure with no length. m, s, g, h, L double as variables, so the 1 stays there too (1m is the safe side).
        for source in ('(1)cm','1*cm','(1)*cm','(1)mm','1*km','(1)kg','(1)g','(1)mL','(1)L','(1)m','1*s','(1)min','1*cm^2'):
            with self.subTest(source=source):
                for mode in ('tex','plain'):self.assertIn('1',serialize(parse(source),mode))
        self.assertEqual(serialize(parse('y=1*m'),'plain'),'y=1m')
        for source,tex in {'(1)x':'x','(1)*c':'c','(1)*cx':'cx','(1)*mx':'mx','1*sin(x)':r'\sin(x)'}.items():   # a name that only starts like a unit is a variable
            with self.subTest(source=source):self.assertEqual(serialize(parse(source),'tex'),tex)
    def test_a_label_is_never_half_unbracketed(self):
        # y=(3)+(2)x+(-1)x^2 keeps every bracket (taking them off the coefficients only would leave (3) and (-1) beside 2x); the plain forms lose all of them
        for source in ('y=(3)+(2)*x+(-1)*x^2','y=(0)*x+(0)','y=(6)x+(3)','y=(2)x+(-3)'):
            with self.subTest(source=source):
                kept=serialize(parse(source),'tex')
                import re;self.assertEqual(re.findall(r'\(-?\d+\)',kept.replace('−','-')),re.findall(r'\(-?\d+\)',source))
        for source,plain in (('y=(6)x+3','y=6x+3'),('y=(2)x+(3)x'.replace('(3)x','3x'),'y=2x+3x'),('y=(-2)x+3','y=−2x+3')):
            with self.subTest(source=source):self.assertEqual(serialize(parse(source),'plain'),plain)
    def test_ratio_binds_tighter_than_the_equals_sign_and_looser_than_a_sum(self):
        self.assertEqual(serialize(parse('a:b=2:3'),'tex'),'a:b=2:3')
        self.assertEqual((parse('1+2:3').value,parse('1+2:3').args[0].value),(':','+'))
    def test_a_bracket_after_a_difference_is_kept(self):
        self.assertEqual(serialize(parse('a-(b±c)'),'tex'),r'a-(b\pm c)')
        self.assertEqual(serialize(parse('a÷(b÷c)'),'tex'),r'a\div (b\div c)')

    def test_a_korean_word_is_read_but_cannot_be_typeset_as_math(self):
        self.assertEqual(serialize(parse('공통'),'plain'),'공통')
        self.assertEqual(self.refused(parse('공통')),'KOREAN_WORD_NEEDS_TEXT_LABEL:공통')
        self.assertTrue(self.refused(parse('OM=공통')).startswith('KOREAN_WORD_NEEDS_TEXT_LABEL'))

    def test_unit_vocabulary(self):
        cases={('3','km'):(r'3\mathrm{km}','3km'),('3','g'):(r'3\mathrm{g}','3g'),('3','mL'):(r'3\mathrm{mL}','3mL'),('x','L'):(r'x\,\mathrm{L}','x L'),('5','s'):(r'5\mathrm{s}','5s'),
               ('60','km/h'):(r'60\mathrm{km/h}','60km/h'),('3','m/s'):(r'3\mathrm{m/s}','3m/s'),('6','cm^2'):(r'6\mathrm{cm}^{2}','6cm²'),('x','m^3'):(r'x\,\mathrm{m}^{3}','x m³')}
        for (text,unit),(tex,plain) in cases.items():
            with self.subTest(unit=unit,text=text):
                self.assertEqual(serialize(self.quantity(text,unit),'tex'),tex);self.assertEqual(serialize(self.quantity(text,unit),'plain'),plain)
        self.assertIn('baseline-shift="super"',serialize(self.quantity('6','cm^2'),'svg'))
        for unit,code in (('초','KOREAN_UNIT_NEEDS_TEXT_LABEL'),('시간','KOREAN_UNIT_NEEDS_TEXT_LABEL'),('c m','INVALID_UNIT_NOTATION'),('cm^4','INVALID_UNIT_NOTATION'),('','INVALID_UNIT_NOTATION')):
            with self.subTest(unit=unit):self.assertEqual(self.refused(self.quantity('3',unit)),code)

    def test_unknown_characters_are_still_refused(self):
        for source in ('x@2','x$2','x;2','x~2','x#','x&y','x|y','x?','x{2}','x[1]','x\\2','x"y"'):
            with self.subTest(source=source),self.assertRaises(ValueError):parse(source)
        for source in ('∠','△','□','∠3','△(A)','∠sin'):
            with self.subTest(source=source),self.assertRaises(ValueError):parse(source)

if __name__=='__main__':unittest.main()
