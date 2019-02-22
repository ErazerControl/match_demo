# chat/consumers.py
from match.wuziqi import Wuziqi
from channels.generic.websocket import WebsocketConsumer
import json
import subprocess
import time
from demo.settings import PROGAME_URL
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print(message)
        program=message.split()
        print(program)
        game=Wuziqi()
        temp=json.dumps({"request":{"x":-1,"y":-1}})
        log=[]
        cnt=0
        finish=False
        players=2
        log.append(json.loads(temp))    
        while True:
            program_id=cnt%players
            exec="python "+PROGAME_URL+program[program_id]
            #记录bot接受的输入
            info={}
            info["requests"]=[]
            info["responses"]=[]
            for i in range(len(log)):
                if i%(players*2)==2*program_id:
                    info["requests"].append(log[i]["request"])
                if i%(players*2)==2*program_id+1:
                    info["responses"].append(log[i]["response"])
            print("打印本次传递信息")
            print(info)
            info=json.dumps(info)
            #运行bot，并输入信息
            func=subprocess.Popen(exec,stdin=subprocess.PIPE,stdout=subprocess.PIPE)
            stdout, stderr=func.communicate(bytes(info, encoding = "utf8"))
            #记录bot返回结果
            print("打印返回结果："+str(stdout, encoding = "utf-8"))
            self.send(text_data=json.dumps({
                'message': str(stdout, encoding = "utf-8")
            }))
            output=json.loads(str(stdout, encoding = "utf-8"))
            log.append(output)
            finish=game.play(program_id,stdout)
            #判断是否结束 若结束，log.append(result)
            #若未结束
            if finish:
                print("游戏结束")
                win_mes=json.dumps({"winner":program_id})
                self.send(text_data=json.dumps({
                'message': win_mes
            }))
                break
            if not finish:
                temp=json.dumps({"request":output["response"]})
                log.append(json.loads(temp)) 
            cnt+=1 
        #{"y": -2, "x": -2}
            