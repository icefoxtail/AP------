"""plan-lint 가 쓰는 파이썬 호스트: 엔진의 검증 함수(graph_framing.fit_overview 등)를 한 번만 불러 두고 줄 단위 JSON 요청을 계속 받는다.
엔진 파일은 고치지 않고 불러 쓰기만 한다. 요청마다 python 을 새로 띄우면 1.3초가 걸리지만 이 호스트는 요청당 수십 ms 다.

사용: python -X utf8 plan-lint-host.py <엔진 production 폴더>   (PYTHONPATH 에 .tmp/apmath-visual-engine/dependencies/python 이 있어야 한다)
요청(한 줄 JSON): {"id":1,"action":"frame_graph|graph|prepare|construction|ellipse", ...worker.py 와 같은 본문}
응답(한 줄 JSON): {"id":1,"status":"OK|ERROR|CRASH","result":...}   ERROR = 엔진이 코드로 거절(worker.py 와 같은 규칙), CRASH = 예기치 못한 예외
엔진 worker.py 의 같은 action 분기를 그대로 옮긴 것이다(production/worker.py main).
"""
import json
import sys
from pathlib import Path

PRODUCTION = Path(sys.argv[1]).resolve()
sys.path.insert(0, str(PRODUCTION))
sys.path.insert(0, str(PRODUCTION.parents[0]))  # visual_engine 이 있는 geometry-equation 폴더 (worker.py 의 parents[1] 과 같다)


def run(payload):
    action = payload.get('action')
    if action == 'echo':
        return payload['value']
    if action == 'construction':
        from construction import execute
        return execute(payload['graph'])
    if action == 'graph':
        from graph_spike import produce
        return produce(payload['graphPlan'])
    if action == 'frame_graph':
        from graph_framing import fit_overview
        return fit_overview(payload['graphPlan'])
    if action == 'ellipse':
        from ellipse_figure import produce
        return produce(payload['ellipsePlan'])
    if action == 'modelBinding':
        # production/graph-observer-worker.py: 독립 관찰자가 모델의 곡선을 plan 과 대조한다(render 의 MODEL_PLAN_MISMATCH 단계, Chrome 불필요)
        from graph_observer import audit
        return audit(payload['graphPlan'], payload['svg'], payload['transform'], model=True)
    if action == 'prepare':
        from visual_engine.engine import prepare
        prepared, labels, obstacles, vp, semantic, sampling = prepare(payload['spec'])
        return {'prepared': prepared, 'labels': labels, 'coordinateModel': vp.model()}
    raise KeyError('UNSUPPORTED_WORKER_ACTION')


def main():
    out = sys.stdout
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        req = json.loads(line)
        rid = req.get('id')
        try:
            result = run(req)
            resp = {'id': rid, 'status': 'OK', 'result': result}
        except (ValueError, KeyError, TypeError) as error:
            result = {'code': str(error)}
            hint_data = getattr(error, 'hint_data', None)
            if hint_data is not None:
                result['hintData'] = hint_data
            resp = {'id': rid, 'status': 'ERROR', 'result': result}
        except BaseException as error:  # noqa: BLE001  예기치 못한 예외도 호스트는 살아 있어야 한다
            resp = {'id': rid, 'status': 'CRASH', 'result': {'code': type(error).__name__ + ':' + str(error)[:300]}}
        out.write('@@LINT@@' + json.dumps(resp, ensure_ascii=True, allow_nan=False, default=str) + '\n')
        out.flush()


if __name__ == '__main__':
    main()
