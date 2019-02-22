import json
import sys
import time
full_input=json.loads(input())
rep=full_input["responses"]
req=full_input["requests"]
a=req[-1]
#print(req)
time.sleep(1)
if(a["x"]==-1 and a["y"]==-1):
    print(json.dumps({"response":{"x":3,"y":4}}))
else:
    print(json.dumps({"response":{"x":a["x"]-1,"y":a["y"]}}))