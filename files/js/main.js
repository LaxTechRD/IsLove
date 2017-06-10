'use strict'

function verficar_user() {
	var username = document.getElementById('username').value,
		email	 = document.getElementById('email').value;

	if (username.length != 0 || email.length != 0){  
		var xhr = new XMLHttpRequest(),
			div = document.getElementById('msg_user');

		xhr.onreadystatechange = function(){
			if (this.readyState==4) 
				if (this.status==200) {
					div.innerHTML = this.responseText;
				}	
		}
		xhr.open('get','/verificar/?name='+username+'&email='+email);
		xhr.send(null);
	}

}

setInterval(function(){
	var alerta = document.getElementById('alerta');
	alerta.style.display = 'node'
},5000)