import json
import sys
import time
time.sleep(1)
full_input=json.loads(input())
rep=full_input["responses"]
req=full_input["requests"]
a=req[0]
#print(req)
print(json.dumps({"response":{"direction":1}}))