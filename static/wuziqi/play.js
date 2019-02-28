var timer = null;


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
    oneStep(obj["x"]+1,obj["y"]+1,obj["color"],chessboard)
    if(obj.hasOwnProperty("winner")){
        setTimeout("alert('胜者为:'+players[obj['winner']])",1000)
    }
};

chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};