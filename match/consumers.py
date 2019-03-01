# chat/consumers.py
from match.wuziqi import Wuziqi
from match.snake import Snake
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
        game_name=program.pop(0)
        print(program)
        finish=0
        END_CODE=1
        ####bot运行最大时间#####
        TIMEOUT=5
        #定义有0个赢家 当赢家==玩家数为平局
        winner=0
        #program={"0":"bot1.py","1":"bot2.py"}
        logs=[]
        #####初始化游戏__五子棋###########
        if game_name=="snake":
            game=Snake()
        elif game_name=="wuziqi":
            game=Wuziqi()
        ####req为初始化游戏的信息######
        req=game.req
        self.send(text_data=json.dumps({
            'message': json.dumps(req["output"]["display"])
            }))
        players=2
        logs.append(req)
        ####info为每回合传入bot代码的信息格式为：{"requests":[],"responses":[]}###
        info={}
        scores={}
        for item in range(players):
            info[str(item)]={"requests":[],"responses":[]}
            scores[str(item)]=0
        def command(cmd, timeout,input): 
            start=time.time()
            p=subprocess.Popen(cmd,stdin=subprocess.PIPE,stdout=subprocess.PIPE)
            try:
                stdout, stderr=p.communicate(input,timeout=timeout)
            except:
                return "Timeout",timeout*100
            end=time.time()
            return stdout,int((end-start)*100)

        while True:
            rep={}
            display={}
            for item in req["output"]["content"]:
                info[item]["requests"].append(req["output"]["content"][item])
                print("打印bot的输入",end='')
                print(info[item])
                exec="python "+PROGAME_URL+program[int(item)]
                stdout,run_time=command(exec,TIMEOUT,bytes(json.dumps(info[item]), encoding = "utf8"))
                if stdout=="Timeout":
                    finish=END_CODE
                    scores[str(1-int(item))]=1
                #记录bot返回结果
                    output_="Timeout"
                    rep[item]={"memory":281,"time":run_time,"response":{}}
                    extra={item:"Timeout"}
                    if "errors" in display:
                        display["errors"]=dict(extra,**display["errors"])
                    else:
                        display["errors"]=extra
                    display["winner"]=1-int(item)
                else:
                    stdout=str(stdout, encoding = "utf-8")
                    print("打印返回结果：",end='')
                    output_=json.loads(stdout)
                    print(output_)
                    ####根据不同游戏#####放置display
                    rep[item]={"memory":281,"time":run_time,"response":output_["response"]}
                    info[item]["responses"].append(rep[item]["response"])
                    ###temp_display为展示前端的信息 scores为当前的分数###
                    temp_display,scores=game.play(int(item),stdout)
                    display=dict(display,**temp_display)
            logs.append(rep)
            print("打印返回前端的信息：",end='')
            for item in scores:
            #1表示胜利 0表示输
                if scores[item]==1:
                    finish=END_CODE
                    winner+=1
            if winner==players:
                del display["winner"]
            self.send(text_data=json.dumps({
            'message': json.dumps(display)
            }))
            print("-------------------------------------------")
          
            if finish==END_CODE:
                req={"memory":21,"time":12,"output":{"command":"finish","display":display,"content":scores}}
                logs.append(req)
                break
            ###若程序未结束，则将bots做的输出转化为下回合的输入###
            content={}
            for item in rep:
                content[str(1-int(item))]=rep[item]["response"]
            output={"command":"request","display":display,"content":content}
            req={"memory":21,"time":12,"output":output}
            logs.append(req)