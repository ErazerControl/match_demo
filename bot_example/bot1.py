import json
import sys
import time
time.sleep(2)
full_input=json.loads(input())
rep=full_input["responses"]
req=full_input["requests"]
a=req[-1]
#print(req)
if(a["x"]==-1 and a["y"]==-1):
    print(json.dumps({"response":{"x":5,"y":2}}))
else:
    print(json.dumps({"response":{"x":a["x"]+1,"y":a["y"]+1}}))