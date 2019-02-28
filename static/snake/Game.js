// 这个棋盘是有宽度和高度的，所以我们规定一下，X，Y长度都是30
var X_LEN = 30;
var Y_LEN = 30;
// 格子宽度
var SQUARE_WIDTH = 50;
// 棋盘位置
var BASE_X = 100;
var BASE_Y = 10;
// 蛇的速度，500ms移动一下,移动一个格子
var SPEED = 500;
var FOOD_X=0;
var FOOD_Y=0;
var BOT0_X=0;
var BOT0_Y=0;
var BOT1_X=0;
var BOT1_Y=0;
var WINNER=0;
var directions=["UP","RIGHT","DOWN","LEFT"]
// 最基本的对象，就是方格
// square方格的意思
function Square (x1, y1) {
    this.x = x1;
    this.y = y1;
    this.view = null; 
    this.width = SQUARE_WIDTH;//宽度我们刚才定义过了
    this.height = SQUARE_WIDTH;//高度也定义好了
}
// 然后这个方格是有一个接口的，是可以触及的对吧，
Square.prototype.touch = function () {}
// 通过继承方法来继承
var Floor = JsUtil.extends(Square);
// 障碍物也继承Square
var Stone = JsUtil.extends(Square);
// 墙也继承，墙是继承障碍物
var Wall = JsUtil.extends(Stone);
// 蛇身体也继承Square
var SnackBody = JsUtil.extends(Square);
// 蛇头也继承
var SnackHead = JsUtil.extends(Square);
// 我们需要三个对象，一个是蛇，一个是棋盘，整个这个游戏也是一个对象
var Snack = JsUtil.single();
var Snack1= JsUtil.single();
var Game = JsUtil.single();
var Food = JsUtil.single();
prog1="snake1.py"
prog2="snake2.py"
var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/match/' + "wuziqi" + '/');

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};
var game = new Game()
chatSocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    obj=JSON.parse(message)
    console.log(message)
    if(obj.hasOwnProperty("winner")){
        WINNER=obj["winner"]
    }
    if(obj.hasOwnProperty("obstacle")){
        FOOD_Y=obj["obstacle"][0]["x"]
        FOOD_X=obj["obstacle"][0]["y"]
        X_LEN=obj["height"]+2
        Y_LEN=obj["width"]+2
        BOT0_X=obj["0"]["x"]
        BOT0_Y=obj["0"]["y"]
        BOT1_X=obj["1"]["x"]
        BOT1_Y=obj["1"]["y"]
        game.init();
    }
    else{
    game.snack.direction=DirectionEnum[directions[obj["0"]]]
    game.snack.move(game)
    game.snack1.direction=DirectionEnum[directions[obj["1"]]]
    game.snack1.move(game)
    } 
    

};
// 我们触及之后会有什么事情发生？触及地板会移动，触及食物会吃东西，触及障碍物就会挂掉，
// 触及方法的枚举
var TouchEventEnum = {Move : "Move", EAT : "Eat", DEAD : "Dead"}

// 初始化游戏，
var game = new Game();
// 分数
game.score = 0;
// 计时器
game.timer = null;
// 有一个ground地板，也是空
game.ground = null;
// 有一个蛇，也是空
game.snack = null;
game.snack1=null;
game.food = null
// 游戏进行初始化
game.init = function () {
    
    //初始化广场
    var gameGround = new Ground();
    // 然后初始化一下
    gameGround.init();
    this.ground = gameGround;
    //初始化蛇
    var gameSnack = new Snack();
    var gameSnack1=new Snack1();
    gameSnack.init(gameGround,BOT0_X,BOT0_Y);
    gameSnack1.init(gameGround,BOT1_X,BOT1_Y);
    this.snack = gameSnack;
    this.snack1=gameSnack1;
	//初始化蛇 
    var food = new Food();
    food.init(gameGround, this);

}
// 结束功能 game.over
game.over = function () {
    setTimeout("alert('胜者为:' + WINNER)",1000);
    //clearInterval(game.timer);
}

// 初始化广场
// var ground = new Ground();
function Ground(){
    // 表格是一个二维方程组，new一个数组
    this.squareTable = new Array(Y_LEN);
    // 宽度
    this.xLen = X_LEN;
    // 高度
    this.yLen = Y_LEN;
    //起点是XY的坐标
    this.basePointX = BASE_X;
    this.basePointY = BASE_Y;
    // 广场的视图，
    this.view = null;
    // 初始化
}
Ground.prototype.init=function(){
 //初始化广场
    // 这一段其实就是动态的去创建这个表格，先创建一个div标签
    var viewGround = document.createElement("div");
    // 相对定位
    viewGround.style.position = "relative";
    // 一共有多少块，然后乘每块的高度或者宽度
    viewGround.style.width = this.xLen * SQUARE_WIDTH + "px";
    viewGround.style.height = this.yLen * SQUARE_WIDTH + "px";
    viewGround.style.display = "inline-block";
    // 这是设置初始化坐标
    viewGround.style.left = this.basePointX + "px";
    viewGround.style.top = this.basePointY + "px";
    // 设置个背景色
    viewGround.style.background = "green";
    // 要记得初始化一下蛇的方法
    document.body.appendChild(viewGround);
    
    // 初始化围墙，和地板
    for (var i = 0 ; i < this.yLen ; i ++ ){
        for (var j = 0 ; j < this.xLen ; j ++) {
            var square;
            if (i == 0 || j == 0 || i == this.yLen - 1 || j == this.xLen - 1){
                // 为什么倒着传？横坐标是内层，纵坐标是外层
                square = SquareFactory.create("Wall", j, i);
            } else {
                square = SquareFactory.create("Floor", j, i);
            }
            // 当j为0的时候，再造一个数组
            if (j == 0){
                this.squareTable[i] = new Array(this.X_LEN);
            }
            // 然后把这些东西添加到这个squareTable中
            this.squareTable[i][j] = square;
            viewGround.appendChild(square.view);
        }
    }
    
    this.view = viewGround;
}
Ground.prototype.remove=function (x, y) {
    // 界面上删除
    this.view.removeChild(this.squareTable[y][x].view);
    // 数据上删除
    this.squareTable[y][x] = null;
}
Ground.prototype.append=function (x, y, square) {
    // 数据上添加
    this.squareTable[y][x] = square;
    // 界面上添加
    this.view.appendChild(this.squareTable[y][x].view);
}

// 网格工厂
function SquareFactory () {}

SquareFactory.create = function (type, x, y) {
    // 判断方法
    if (typeof SquareFactory[type] !== "function"){
        throw "Error";
    }
    
    var result = SquareFactory[type](x, y);
    return result;
}
// 地板
SquareFactory.Floor = function (x1, y1) {
    var floor = new Floor();
    // 初始化一下小方块，有地板，x值，y值，颜色为黄色，然后有一个触碰事件
    this.commonInit(floor, x1, y1, "orange", TouchEventEnum.Move);
    return floor;
}
// 初始小方格
SquareFactory.commonInit = function (obj, x1, y1, color, touchEvent){
    obj.x = x1;
    obj.y = y1;
    obj.view = document.createElement("div");
    obj.view.style.position = "absolute";
    obj.view.style.display = "inline-block";
    obj.view.style.width = SQUARE_WIDTH + "px";
    obj.view.style.height = SQUARE_WIDTH + "px";
    obj.view.style.background = color;
    obj.view.style.left = obj.x * SQUARE_WIDTH + "px";
    obj.view.style.top = obj.y * SQUARE_WIDTH + "px";
    obj.touch = function () {
        return touchEvent;
    }
}
// food 
SquareFactory.Food = function (x1, y1) {
    var food = new Food();
    this.commonInit(food, x1, y1, "green", TouchEventEnum.EAT);
    return food;
}
// 石头
SquareFactory.Stone = function (x1, y1) {
    var stone = new Stone();
    this.commonInit(stone, x1, y1, "gray", TouchEventEnum.DEAD);
    return stone;
}
// 墙黑色
SquareFactory.Wall = function (x1, y1) {
    var wall = new Wall();
    this.commonInit(wall, x1, y1, "black", TouchEventEnum.DEAD);
    return wall;
}
// 蛇头
SquareFactory.SnackHead = function (x1, y1) {
    var snackHead = new SnackHead();
    this.commonInit(snackHead, x1, y1, "red", TouchEventEnum.DEAD);
    return snackHead;
}
// 蛇身子
SquareFactory.SnackBody = function (x1, y1) {
    var snackBody = new SnackBody();
    this.commonInit(snackBody, x1, y1, "blue", TouchEventEnum.DEAD);
    return snackBody;
}


// 造蛇 
var snack = new Snack();
var snack1= new Snack1();
snack.head = null;
snack.tail = null;
// 然后还有蛇行走的方向
snack.direction = 0;
// 方向枚举
snack1.head = null;
snack1.tail = null;
// 然后还有蛇行走的方向
snack1.direction = 0;
// 方向枚举
var DirectionEnum = {
    UP : {x : 0, y : -1},
    DOWN : {x : 0, y : 1},
    LEFT : {x : -1, y : 0},
    RIGHT : {x : 1, y : 0}
}


// 初始化
snack.init = function (gameGround,x,y) {
    // 先创建一个头，在3，1的位置，两个身子
    var tempHead = SquareFactory.create("SnackHead", x, y);
    remove=gameGround.remove(x,y)
    gameGround.append(x, y, tempHead);
    this.head = tempHead;
    this.tail = tempHead;
    // 再指明一个方向，初始化over
    this.direction = DirectionEnum.DOWN;
}


// 蛇move
snack.move = function (game) {
    
    var square = game.ground.squareTable[this.head.y + this.direction.y][this.head.x + this.direction.x];
    // 蛇需要有个策略方法
    if (typeof this.strategy[square.touch()] === "function") {
        this.strategy[square.touch()](game, this, square, false);
    }
}
// 蛇策略
snack.strategy = {
    Move : function (game, snack, square, fromEat) {
        // 头变身子
        var tempHead=snack.head
        var newHead = SquareFactory.create("SnackHead", square.x, square.y);
        game.ground.remove(square.x, square.y);
        game.ground.append(square.x, square.y, newHead);
        snack.head = newHead;
        snack.head.last = null;
        // 删除尾巴
        if (!fromEat) {
            var floor = SquareFactory.create("Floor", tempHead.x, tempHead.y);
            game.ground.remove(floor.x, floor.y);
            game.ground.append(floor.x, floor.y, floor);
        }
    },
    Eat : function (game, snack, square) {
        game.score ++;
        this.Move(game, snack, square, true);
        food.init(game.ground, game);
    },
    Dead : function (game) {
        game.over();
    }
}
// 初始化
snack1.init = function (gameGround,x,y) {
    // 先创建一个头，在3，1的位置，两个身子
    var tempHead = SquareFactory.create("SnackBody", x, y);
    gameGround.remove(x, y);
    gameGround.append(x, y, tempHead);
    this.head = tempHead;
    this.tail = tempHead;
    // 再指明一个方向，初始化over
    this.direction = DirectionEnum.DOWN;
}


// 蛇move
snack1.move = function (game) {
    
    var square = game.ground.squareTable[this.head.y + this.direction.y][this.head.x + this.direction.x];
    // 蛇需要有个策略方法
    if (typeof this.strategy[square.touch()] === "function") {
        this.strategy[square.touch()](game, this, square, false);
    }
}
// 蛇策略
snack1.strategy = {
    Move : function (game, snack, square, fromEat) {
        // 头变身子
        var tempHead=snack.head
        var newHead = SquareFactory.create("SnackBody", square.x, square.y);
        game.ground.remove(square.x, square.y);
        game.ground.append(square.x, square.y, newHead);
        snack.head = newHead;
        snack.head.last = null;
        // 删除尾巴
        if (!fromEat) {
            var floor = SquareFactory.create("Floor", tempHead.x, tempHead.y);
            game.ground.remove(floor.x, floor.y);
            game.ground.append(floor.x, floor.y, floor);
        }
    },
    Eat : function (game, snack, square) {
        game.score ++;
        this.Move(game, snack, square, true);
        food.init(game.ground, game);
    },
    Dead : function (game) {
        game.over();
    }
}
var stone=new Stone()
stone.init=function (gameGround, game,x,y){
    // var me = this, //保证this指向food实例
    stone = SquareFactory.create("Stone", x, y);
    gameGround.remove(x, y);
    gameGround.append(x, y, stone);
}
// 食物初始化
var food = new Food()
food.init = function (gameGround, game){
    var me = this, //保证this指向food实例
        positionObj = me.setPosition(me.getPosition(), game),
        food = SquareFactory.create("Stone", positionObj.x, positionObj.y);
    gameGround.remove(positionObj.x, positionObj.y);
    gameGround.append(positionObj.x, positionObj.y, food);
}

// 食物坐标
food.setPosition = function (positionObj, game) {
    var obj = positionObj;
    obj = this.getPosition();
    return obj;
}

// 随机生成坐标
food.getPosition = function () {
    return {
        x: FOOD_X,
        y: FOOD_Y
    };
}