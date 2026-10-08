"""Typed subprocess boundary. Node alone canonicalizes objects; bind raw blob bytes."""
import hashlib
import json
import math
import sys
from pathlib import Path

VERSION = 'APMATH_VISUAL_WIRE_v1'

def reject_constant(value):
    raise ValueError('NON_JSON_NUMBER')

def validate_json(value, depth=0):
    if depth > 64:
        raise ValueError('WIRE_DEPTH_LIMIT')
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if not math.isfinite(value) or abs(value) > 9007199254740991:
            raise ValueError('NON_CANONICAL_NUMBER')
    elif isinstance(value, list):
        for child in value: validate_json(child, depth+1)
    elif isinstance(value, dict):
        for child in value.values(): validate_json(child, depth+1)

def read_request(raw):
    request = json.loads(raw, parse_constant=reject_constant)
    if request.get('wireVersion') != VERSION or not isinstance(request.get('canonicalBlob'), str):
        raise ValueError('WIRE_VERSION_INVALID')
    blob = request['canonicalBlob'].encode('utf-8')
    if 'sha256:' + hashlib.sha256(blob).hexdigest() != request.get('objectSha256'):
        raise ValueError('WIRE_BLOB_HASH_MISMATCH')
    payload = json.loads(blob, parse_constant=reject_constant)
    validate_json(payload)
    return request['objectSha256'], payload

def main():
    input_hash, payload = read_request(sys.stdin.buffer.read(4000001))
    status = 'OK'
    try:
        action = payload.get('action')
        if action == 'echo': result = payload['value']
        elif action == 'construction':
            from construction import execute
            result = execute(payload['graph'])
        elif action == 'graph':
            from graph_spike import produce
            result = produce(payload['graphPlan'])
        elif action == 'frame_graph':
            from graph_framing import fit_overview
            result = fit_overview(payload['graphPlan'])
        elif action == 'build':
            sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
            from visual_engine.engine import build
            result = build(payload['spec'],payload.get('measurements'),payload.get('fragments'),strict_measured_fragments=True)
        elif action == 'prepare':
            sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
            from visual_engine.engine import prepare
            prepared,labels,obstacles,vp,semantic,sampling=prepare(payload['spec'])
            result={'prepared':prepared,'labels':labels,'coordinateModel':vp.model()}
        else:
            status, result = 'UNSUPPORTED', {'code':'UNSUPPORTED_WORKER_ACTION'}
    except (ValueError, KeyError, TypeError) as error:
        status, result = 'ERROR', {'code':str(error)}
    print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))

if __name__ == '__main__': main()
