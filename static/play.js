var timer = null;

function game_start(game_id){
    $.ajax({
        url : '/team_match/push_game_into_list/',
        type : "GET",
        data : {
            "game_id":game_id
        },
        dataType : 'json',
        success:function (data) {
            console.log(data);
            if(data.game_will_start){
                console.log('game will start');
                timer = window.setInterval(function () {
                    showAction(data.code);
                },1500);
            }else{
                console.log(data.mess);
            }
        },
        error:function () {
            console.log('game_start error');
        }
    })
    $.ajax({
        url:'/team_match/run_project/',
        type:'GET',
        data:{
            "id":'player1'
        },
        dataType:'json',
        success:function(){
            console.log('玩家代码执行');
        },
        error:function () {
            console.log('project_start error');
        }
    })
    $.ajax({
        url:'/team_match/run_project/',
        type:'GET',
        data:{
            "id":'player'
        },
        dataType:'json',
        success:function(){
            console.log('玩家代码执行');
        },
        error:function () {
            console.log('project_start error');
        }
    })
}
var chessboard = new Map();
var flag=1
var chatSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/match/' + "wuziqi" + '/');

// chatSocket.onopen = function() {
//         chatSocket.send(JSON.stringify({
//             'message': "start"
//         }));
//         alert("对局即将开始...");
//     };

chatSocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    obj=JSON.parse(message)
    console.log(message)
    if(obj.hasOwnProperty("winner")){
        alert("胜者为:"+players[obj["winner"]])
    }
    else{
        //切换黑白子
        flag=1-flag
        oneStep(obj["response"].x+1,obj["response"].y+1,flag,chessboard)
    }
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};

function showAction(code) {
    $.ajax({
        url : '/team_match/game_detail_to_page/',
        type : "GET",
        data : {
            "code":code
        },
        dataType : 'json',
        success:function (data) {
            console.log(data);S
            if(data.player_action){
                oneStep(data.row, data.col, data.color, chessboard);
                if(data.game_end){
                    window.clearInterval(timer);
                    chessboard.clear();
                    if(data.action_error){
                        alert("action error, "+data.color+" lose !!!");
                    }else{
                        alert(data.color+" win !!!");
                    }
                }
            }else{
                console.log('no player action');
            }
        },
        error:function () {
            console.log('show player action error');
        }
    })
}
