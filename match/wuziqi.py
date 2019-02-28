import json
class Wuziqi:
    def win(self):
        for i in range(self.rows):
            for j in range(self.cols):
                if self.list[i][j]!=-1 and j+4<self.cols and self.list[i][j]==self.list[i][j+1] and self.list[i][j]==self.list[i][j+2] and self.list[i][j]==self.list[i][j+3] and self.list[i][j]==self.list[i][j+4]:
                    return True
                if self.list[i][j]!=-1 and i+4<self.rows and self.list[i][j]==self.list[i+1][j] and self.list[i][j]==self.list[i+2][j] and self.list[i][j]==self.list[i+3][j] and self.list[i][j]==self.list[i+4][j]:
                    return True
                if self.list[i][j]!=-1 and i+4<self.rows and j+4<self.cols and self.list[i][j]==self.list[i+1][j+1] and self.list[i][j]==self.list[i+2][j+2] and self.list[i][j]==self.list[i+3][j+3] and self.list[i][j]==self.list[i+4][j+4]:
                    return True
                if self.list[i][j]!=-1 and i-4<self.rows and j-4<self.cols and self.list[i][j]==self.list[i-1][j-1] and self.list[i][j]==self.list[i-2][j-2] and self.list[i][j]==self.list[i-3][j-3] and self.list[i][j]==self.list[i-4][j-4]:
                    return True
        return False
    def play(self,id,message):
        #return display,self.score
        finish=False
        display={}
        try:
            mes=json.loads(message)
            row=mes["response"]["x"]
            col=mes["response"]["y"]
            display["color"]=id
            display=dict(display,**mes["response"])
        except:
            finish=True
            # display["errors"]={}
            extra={str(id):"Json parse error"}
            display["errors"]=extra
            #raise Exception("Json parse error")
            self.score[str(1-id)]=1
            display["winner"]=1-id 
            return display,self.score
        try:
            self.list[row][col]=id
            if self.win():
                finish=True
        except:
            finish=True
            extra={str(id):"INVALID MOVE"}
            display["errors"][str(id)]="INVALID MOVE"
            self.score[str(1-id)]=1
            display["winner"]=1-id 
        if finish:
            self.score[str(id)]=1
            display["winner"]=id 
        return display,self.score
    def __init__(self):
        self.score={"0":0,"1":0}
        self.rows=15
        self.cols=15
        self.list=[[-1 for j in range(self.cols)]for i in range(self.rows)]
        memory=277
        bot0=json.dumps({"x":-1,"y":-1})
        content=json.dumps({"0":json.loads(bot0)})
        display=json.dumps({})
        output={"command":"request","display":json.loads(display),"content":json.loads(content)}
        self.req={"memory":memory,"time":67,"output":output}
        