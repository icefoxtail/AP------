"""Separate observer process: wire helpers only, no sampler/build imports."""
import json
import sys
from worker import read_request, VERSION
from graph_observer import audit

input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
try:
    if payload.get('action')=='linkedExpLogDetail':
        from linked_exp_log_detail_observer import audit_linked_exp_log_detail
        result=audit_linked_exp_log_detail(payload['plan'],payload.get('svgs'))
    else:
        result=audit(payload['graphPlan'],payload['svg'],payload['transform'],model=payload.get('action')=='modelBinding')
    status='OK'
except (ValueError,KeyError,TypeError) as error:
    result,status={'code':str(error)},'ERROR'
print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
