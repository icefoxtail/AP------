import sys,unittest
from pathlib import Path
from copy import deepcopy
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from visual_engine.semantic_model import validate

def spec():
    return {'id':'semantic','visualType':'coordinate_geometry','viewport':{'xMin':-5,'xMax':5,'yMin':-5,'yMax':5},'sourceFacts':{'point':[0,0]},'derivedFacts':{'point':[0,0]},'displayFacts':{},'objects':[
        {'id':'l','kind':'LINE','coefficients':[1,0,0]},
        {'id':'m','kind':'LINE','coefficients':[0,1,0]},
        {'id':'P','kind':'POINT','at':[0,0]},
        {'id':'hit','kind':'INTERSECTION','refs':['l','m'],'target':'P'},
        {'id':'right','kind':'PERPENDICULAR_MARK','refs':['l','m'],'at':[0,0]}]}

class SemanticTests(unittest.TestCase):
    def test_verified_relations(self):
        self.assertEqual(len(validate(spec())['relations']),2)
    def test_wrong_intersection(self):
        s=spec();s['objects'][2]['at']=[1,0]
        with self.assertRaisesRegex(ValueError,'UNVERIFIED'): validate(s)
    def test_wrong_mark(self):
        for mutation in ([1,1,0],[1,0,1]):
            s=spec();s['objects'][1]['coefficients']=mutation
            with self.assertRaises(ValueError): validate(s)
    def test_unknown_and_duplicate(self):
        for obj in ({'id':'bad','kind':'UNKNOWN'},deepcopy(spec()['objects'][0])):
            s=spec();s['objects'].append(obj)
            with self.assertRaises(ValueError): validate(s)
    def test_source_derived_parity(self):
        s=spec();s['derivedFacts']['point']=[1,0]
        with self.assertRaisesRegex(ValueError,'SOURCE_DERIVED'): validate(s)
    def test_verified_tangent(self):
        s=spec();s['objects']=[{'id':'l','kind':'LINE','coefficients':[1,0,-2]}, {'id':'c','kind':'CIRCLE','center':[0,0],'radius':2}, {'id':'t','kind':'TANGENT','refs':['l','c'],'at':[2,0]}]
        self.assertEqual(validate(s)['semanticStatus'],'PASS')
        s['objects'][-1]['at']=[2,1]
        with self.assertRaises(ValueError): validate(s)
    def test_name_coordinate_separation(self):
        s=spec();s['objects'] += [{'id':'name','kind':'POINT_NAME','target':'P','text':'P'},{'id':'coord','kind':'COORDINATE_LABEL','target':'P','exact':['0','0']}]
        self.assertEqual(validate(s)['semanticStatus'],'PASS')
        s['objects'][-1]['target']='l'
        with self.assertRaises(ValueError):validate(s)
    def test_angle_and_length(self):
        s=spec();s['objects']=[{'id':'A','kind':'POINT','at':[1,0]},{'id':'V','kind':'POINT','at':[0,0]},{'id':'B','kind':'POINT','at':[0,1]}, {'id':'a','kind':'ANGLE_MARK','refs':['A','V','B'],'value':90}, {'id':'s','kind':'SEGMENT','from':[0,0],'to':[3,4]}, {'id':'len','kind':'LENGTH_LABEL','refs':['s'],'value':5,'text':'5','at':[2,3]}]
        self.assertEqual(len(validate(s)['relations']),2)
        s['objects'][-1]['value']=6
        with self.assertRaises(ValueError):validate(s)

if __name__=='__main__':unittest.main()
