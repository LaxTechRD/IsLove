module.exports = function(server){
	var io = require('socket.io')(server);
	const fs = require('fs');
	var users = [];
	var n_conectados = 0;
 
	io.on('connection',function(socket){

		socket.on('connectados',function(name){
			n_conectados++;
			socket.username = name;
			users.push(socket.username)
			
			io.emit('send users',{
				names: users,
				conectados: n_conectados
			})
		})

		socket.on('send message',function(txt){
			txt = "<strong>" + socket.username + "</strong>" + ": "+ txt;
			io.emit('message',txt);
		})

		socket.on('disconnect',function(){
			if (socket.username) {
				users.splice(users.indexOf(socket.username),1)
				n_conectados--
			}
			
			io.emit('send users',{
				names: users,
				conectados: n_conectados
			})

		})

	})

}
