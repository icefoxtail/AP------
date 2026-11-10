"""Refusals that carry repair data (roadmap 1-1): str(error) is the unchanged code, error.hint_data holds the engine's own exact values,
and worker.py sends them beside the code as result.hintData (render-plan.mjs strips them into result.fix and keeps them out of detail)."""
import copy
import json
import subprocess
import sys
import unittest
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parents[0]/'production'))
sys.path.insert(0,str(HERE))
from graph_framing import fit_overview,HintedValueError
from test_piecewise_polynomial import Q22,TWO_PIECEWISE
from test_piecewise_discontinuous import EXTREMA,JUMP

def refusal(plan):
    try:fit_overview(plan)
    except ValueError as error:return error
    return None

class HintData(unittest.TestCase):
    def test_missing_key_points_are_listed_with_their_exact_values(self):
        # Q22 without B: B is the in-piece vertex (1/2, 25/4); the code text is what it always was
        plan=copy.deepcopy(Q22);plan['requiredPoints']=[p for p in plan['requiredPoints'] if p['id']!='B'];plan.pop('exactCoordinates')
        error=refusal(plan)
        self.assertIsInstance(error,HintedValueError)
        self.assertEqual(str(error),'PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:1/2')
        self.assertEqual(error.hint_data,{'kind':'ADD_REQUIRED_POINTS','points':[{'x':'1/2','y':'25/4'}]})
        # a corner and a vertex both missing: all of them come at once
        plan=copy.deepcopy(Q22);plan['requiredPoints']=[plan['requiredPoints'][0]];plan.pop('exactCoordinates')
        error=refusal(plan)
        self.assertEqual(str(error),'PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:2')
        self.assertEqual(error.hint_data['points'],[{'x':'2','y':'4'},{'x':'1/2','y':'25/4'}])

    def test_adding_the_listed_points_gets_past_the_refusal(self):
        plan=copy.deepcopy(Q22);plan['requiredPoints']=[plan['requiredPoints'][0]];plan.pop('exactCoordinates')
        error=refusal(plan)
        plan['requiredPoints']+=[{'id':'PQ'[i],'x':p['x'],'y':p['y']} for i,p in enumerate(error.hint_data['points'])]
        self.assertIsNone(refusal(plan),refusal(plan))

    def test_reference_curve_corner(self):
        plan=copy.deepcopy(TWO_PIECEWISE);plan['requiredPoints']=[p for p in plan['requiredPoints'] if p['id']!='C']
        error=refusal(plan)
        self.assertEqual(str(error),'PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS:g:-1')
        self.assertEqual(error.hint_data['kind'],'ADD_REQUIRED_POINTS')
        self.assertTrue(error.hint_data['points'])
        for point in error.hint_data['points']:self.assertEqual(sorted(point),['x','y'])

    def test_discontinuous_extremum_and_window(self):
        plan=copy.deepcopy(EXTREMA);plan['requiredPoints']=[]
        error=refusal(plan)
        self.assertEqual(str(error),'PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS:-1')
        self.assertEqual(error.hint_data,{'kind':'ADD_REQUIRED_POINTS','points':[{'x':'-1','y':'-2'}]})
        plan=copy.deepcopy(JUMP);plan['xWindow']=[0.5,0.75]
        error=refusal(plan)
        self.assertEqual(str(error),'PIECEWISE_DISCONTINUOUS_X_WINDOW_TOO_SMALL')
        self.assertEqual(error.hint_data['kind'],'X_WINDOW_TOO_SMALL')
        self.assertEqual(error.hint_data['window'],[0.5,0.75])
        self.assertLessEqual(error.hint_data['keyMin'],0.0);self.assertGreaterEqual(error.hint_data['keyMax'],1.0)

    def test_worker_sends_hint_data_beside_the_code_only_for_hinted_refusals(self):
        wire=HERE.parents[0]/'production'/'worker.py'
        def ask(graph_plan):
            sys.path.insert(0,str(HERE.parents[0]/'production'))
            import hashlib
            blob=json.dumps({'action':'frame_graph','graphPlan':graph_plan},sort_keys=True,separators=(',',':'),ensure_ascii=False)
            request={'wireVersion':'APMATH_VISUAL_WIRE_v1','objectSha256':'sha256:'+hashlib.sha256(blob.encode('utf-8')).hexdigest(),'canonicalBlob':blob}
            done=subprocess.run([sys.executable,'-X','utf8',str(wire)],input=json.dumps(request).encode('utf-8'),capture_output=True,timeout=120)
            self.assertEqual(done.returncode,0,done.stderr)
            return json.loads(done.stdout.decode('utf-8'))
        plan=copy.deepcopy(Q22);plan['requiredPoints']=[plan['requiredPoints'][0]];plan.pop('exactCoordinates')
        hinted=ask(plan)
        self.assertEqual(hinted['status'],'ERROR')
        self.assertEqual(sorted(hinted['result']),['code','hintData'])
        self.assertEqual(hinted['result']['code'],'PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS:2')
        plain=copy.deepcopy(Q22);plain['lines']=[]
        refused=ask(plain)
        self.assertEqual(refused['result'],{'code':'PIECEWISE_POLY_FIELD_UNKNOWN:lines'})

if __name__=='__main__':unittest.main()
