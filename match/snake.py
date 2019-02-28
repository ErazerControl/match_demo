import json
class Snake:
    def win(self,finish):
        return False
    def play(self,id,message):
        display={}
        try:
            mes=json.loads(message)
            self.postions[id]["x"]+=self.directions[mes["response"]["direction"]]["x"]
            self.postions[id]["y"]+=self.directions[mes["response"]["direction"]]["y"]
            display[str(id)]=mes["response"]["direction"]
        except:
            finish=True
            # display["errors"]={}
            extra={str(id):"Json parse error"}
            display["errors"]=extra
            #raise Exception("Json parse error")
            if finish:
                self.score[str(1-id)]=1
                display["winner"]=1-id 
            return display,self.score
        try:
            if self.list[self.postions[id]["x"]][self.postions[id]["y"]]==-1:
                finish=True
            else:
                self.list[self.postions[id]["x"]][self.postions[id]["y"]]=-1
                finish=False
        except:
            finish=True
            extra={str(id):"INVALID MOVE"}
            display["errors"][str(id)]="INVALID MOVE"
            #raise Exception("INVALID MOVE")
        if finish:
            self.score[str(1-id)]=1
            display["winner"]=1-id 
        return display,self.score
    def __init__(self):
        memory=277
        self.postions=[{"x":0,"y":0},{"x":10,"y":9}]
        self.directions=[{"x":-1,"y":0},{"x":0,"y":1},{"x":1,"y":0},{"x":0,"y":-1}]
        self.score={"0":0,"1":0}
        self.height=11
        self.width=10
        initial_info={"height":self.height,"obstacle":[{"x":1,"y":5}],"width":self.width}
        self.list=[[0 for j in range(self.width)]for i in range(self.height)]
        self.list[0][4]=-1
        #bot0很关键 初始游戏信息 若贪吃蛇 {"height":15,"obstacle":[{"x":3,"y":5},{"x":13,"y":6},{"x":1,"y":4},{"x":14,"y":1},{"x":2,"y":10},{"x":11,"y":5}],"width":10,"x":1,"y":1}
        initial_info_0=dict({"x":1,"y":1},**initial_info)
        initial_info_1=dict({"x":self.height,"y":self.width},**initial_info)
        content={"0":initial_info_0,"1":initial_info_1}
        #若五子棋，刚开始没有要展示的内容则 display={}
        display=initial_info
        display["0"]={"x":1,"y":1}
        display["1"]={"x":self.height,"y":self.width}
        output=json.dumps({"command":"request","display":display,"content":content})
        self.req={"memory":memory,"time":67,"output":json.loads(output)}