"""G18a-3: graphPlan.hideLabels and graphPlan.formulaTex of a single rational or square-root curve. Framing validates both (the formula in the author's form must be the plan's
function), the independent observer repeats that check with its own reader and, in the final SVG, finds a hidden text that is still drawn. No Chrome here: the label groups of a
final figure are stood in for by small <g id=... data-label-kind=...> elements."""
import copy
import sys
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'production'))
sys.path.insert(0,str(ROOT))
from graph_framing import fit_overview,tex_formula_ascii
from graph_spike import produce
from graph_observer import audit

# 24 효천고 2학기 기말 고1 q1 style: y=-8/(x-1)-4=(-4x-4)/(x-1); the asymptote values are the answer, so their texts are hidden
RATIONAL={'family':'rational','numerator':['-4','-4'],'denominator':['-1','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-5,7],'viewport':[-5,7,-12,6],'axisTickValues':{'x':[],'y':[]}}
# y=2*sqrt(x+1)-1
SQRT={'family':'sqrt-affine','radicand':['1','1'],'amplitude':'2','offset':'-1','sourceDomain':{'kind':'NATURAL_SQRT_AFFINE'},'domain':[-1,8],'viewport':[-2,9,-3,8],'axisTickValues':{'x':[],'y':[]},'domainRangeLabels':True}

def refused(plan):
    try:fit_overview(copy.deepcopy(plan))
    except ValueError as error:return str(error)
    return None

def with_fields(base,**fields):
    plan=copy.deepcopy(base);plan.update(fields);return plan

def with_labels(svg,*ids):
    root=ET.fromstring(svg)
    for ident in ids:ET.SubElement(root,'{http://www.w3.org/2000/svg}g',{'id':ident,'data-label-kind':'MATH'})
    return ET.tostring(root,encoding='unicode')

class Framing(unittest.TestCase):
    def test_tex_is_written_as_the_ascii_formula(self):
        self.assertEqual(tex_formula_ascii('-\\frac{8}{x-1}-4'),'-8/(x-1)-4')
        self.assertEqual(tex_formula_ascii('y=\\frac{-4x-4}{x-1}'),'(-4x-4)/(x-1)')
        self.assertEqual(tex_formula_ascii('2\\sqrt{x+1}-1'),'2sqrt(x+1)-1')

    def test_the_author_form_is_kept_on_the_fitted_plan(self):
        plan=fit_overview(with_fields(RATIONAL,formulaTex='-\\frac{8}{x-1}-4',hideLabels=['asymptotes']))['graphPlan']
        self.assertEqual((plan['formulaAscii'],plan['hideLabels']),('-8/(x-1)-4',['asymptotes']))
        plan=fit_overview(with_fields(SQRT,formulaTex='2\\sqrt{x+1}-1',hideLabels=['start']))['graphPlan']
        self.assertEqual((plan['formulaAscii'],plan['hideLabels']),('2sqrt(x+1)-1',['start']))

    def test_a_plan_without_the_new_fields_is_untouched(self):
        for base in (RATIONAL,SQRT):
            plan=fit_overview(copy.deepcopy(base))['graphPlan']
            self.assertNotIn('hideLabels',plan);self.assertNotIn('formulaAscii',plan)

    def test_refusals(self):
        self.assertEqual(refused(with_fields(RATIONAL,formulaTex='-\\frac{8}{x-1}-3')),'FORMULA_TEX_NOT_THE_FUNCTION')
        self.assertEqual(refused(with_fields(SQRT,formulaTex='2\\sqrt{x+1}-2')),'FORMULA_TEX_NOT_THE_FUNCTION')
        self.assertEqual(refused(with_fields(RATIONAL,formulaTex='\\int x')),'FORMULA_TEX_INVALID')
        self.assertEqual(refused(with_fields(RATIONAL,hideLabels=['start'])),'HIDE_LABELS_INVALID')
        self.assertEqual(refused(with_fields(SQRT,hideLabels=['asymptotes'])),'HIDE_LABELS_INVALID')
        self.assertEqual(refused(with_fields(RATIONAL,hideLabels=['formula','formula'])),'HIDE_LABELS_INVALID')
        self.assertEqual(refused(with_fields(RATIONAL,hideLabels=[])),'HIDE_LABELS_INVALID')
        self.assertEqual(refused(with_fields(RATIONAL,hideLabels=['formula'],formulaTex='-\\frac{8}{x-1}-4')),'HIDE_LABELS_INVALID')
        # hiding the asymptote texts and asking for a place for them contradict each other
        self.assertEqual(refused(with_fields(RATIONAL,hideLabels=['asymptotes'],asymptoteLabelAt='END')),'HIDE_LABELS_INVALID')
        # inverse proportion has its own formula label
        self.assertEqual(refused({'family':'rational','numerator':['6','0'],'denominator':['0','1'],'sourceDomain':{'kind':'ALL_REALS'},'domain':[-5,5],'viewport':[-5,5,-5,5],'hideLabels':['formula']}),'HIDE_LABELS_UNSUPPORTED_FOR_INVERSE_PROPORTION')

class Observer(unittest.TestCase):
    def check(self,base,**fields):
        plan=fit_overview(with_fields(base,**fields))['graphPlan'];model=produce(plan)
        return plan,model

    def test_the_model_figures_pass(self):
        for base,fields in ((RATIONAL,{'formulaTex':'-\\frac{8}{x-1}-4','hideLabels':['asymptotes']}),(SQRT,{'formulaTex':'2\\sqrt{x+1}-1','hideLabels':['start']})):
            plan,model=self.check(base,**fields);result=audit(plan,model['svg'],model['transform']);self.assertEqual((result['status'],result['errors']),('PASS',[]),result)

    def test_a_formula_that_is_another_function_is_found(self):
        plan,model=self.check(RATIONAL,formulaTex='-\\frac{8}{x-1}-4')
        # the framed formulaAscii is tampered after framing: the observer reads formulaTex itself
        tampered=copy.deepcopy(plan);tampered['formulaAscii']='-8/(x-1)-3'
        self.assertIn('FORMULA_TEX_ASCII_MISMATCH',audit(tampered,model['svg'],model['transform'])['errors'])
        wrong=copy.deepcopy(plan);wrong['formulaTex']='-\\frac{8}{x-1}-3';wrong['formulaAscii']='-8/(x-1)-3'
        self.assertIn('FORMULA_TEX_NOT_THE_FUNCTION',audit(wrong,model['svg'],model['transform'])['errors'])

    def test_a_hidden_text_that_is_drawn_and_a_shown_formula_that_is_missing_are_found(self):
        plan,model=self.check(RATIONAL,hideLabels=['asymptotes'])
        shown=with_labels(model['svg'],'formula','horizontal-asymptote-label')
        self.assertIn('HIDDEN_LABEL_SHOWN:asymptotes',audit(plan,shown,model['transform'])['errors'])
        self.assertEqual(audit(plan,with_labels(model['svg'],'formula'),model['transform'])['status'],'PASS')
        self.assertIn('FORMULA_LABEL_MISSING',audit(plan,with_labels(model['svg'],'vertical-asymptote-label'),model['transform'])['errors'])
        plan,model=self.check(SQRT,hideLabels=['formula','start'])
        self.assertIn('HIDDEN_LABEL_SHOWN:formula',audit(plan,with_labels(model['svg'],'formula'),model['transform'])['errors'])
        self.assertIn('HIDDEN_LABEL_SHOWN:start',audit(plan,with_labels(model['svg'],'sqrt-domain-label'),model['transform'])['errors'])

if __name__=='__main__':
    unittest.main()
