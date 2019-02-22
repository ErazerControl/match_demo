import json
class Wuziqi:

    def win(self):
        print(list)
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
        mes=json.loads(message)
        row=mes["response"]["x"]
        col=mes["response"]["y"]
        self.list[row][col]=id
        return self.win()
    def __init__(self):
        self.rows=15
        self.cols=15
        self.list=[[-1 for j in range(self.cols)]for i in range(self.rows)]