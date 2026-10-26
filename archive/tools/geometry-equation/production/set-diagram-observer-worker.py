"""Separate observer process for set diagrams: wire helpers only, no producer imports."""
import json
import sys
from worker import read_request, VERSION
from set_diagram_observer import audit

input_hash,payload=read_request(sys.stdin.buffer.read(4000001))
try:
    result=audit(payload['diagram'],payload['svg'])
    status='OK'
except (ValueError,KeyError,TypeError,IndexError,ZeroDivisionError) as error:
    result,status={'code':str(error)},'ERROR'
print(json.dumps({'wireVersion':VERSION,'inputObjectSha256':input_hash,'status':status,'result':result},ensure_ascii=False,allow_nan=False))
