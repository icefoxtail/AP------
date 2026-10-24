"""Separate observer process for number-line panels: wire helpers only, no producer imports."""
import json
import sys
from worker import read_request, VERSION
from number_line_observer import audit

input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
try:
    result=audit(payload['numberLine'],payload['svg'],payload.get('pointNames'))
    status='OK'
except (ValueError,KeyError,TypeError) as error:
    result,status={'code':str(error)},'ERROR'
print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
