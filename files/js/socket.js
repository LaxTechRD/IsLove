
$(function(){
	var socket = io()
	
	var nombre_usuario = document.getElementById('user').innerHTML || 'Anonymous';

	$('.form').submit(function(){
		socket.emit('send message',$('#message').val())
		$('#message').val('')
		return false;
	})

	socket.emit('connectados',nombre_usuario)

	socket.on('send users',function (conect) {
		$('#conectados').text(' ')
		for (var i = conect.names.length - 1; i >= 0; i--) {
			$('#conectados').append('<li>'+conect.names[i]+'</li>')
		}
		$('.numero').text('('+conect.conectados+')')
	})

	socket.on('message',function(txt){
		$('.msg').append('<li class="messages">'+txt+'</li>')
	})

})