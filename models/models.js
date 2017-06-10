var mongoose = require('mongoose')


var userSchema = new mongoose.Schema({
	local: { 
		user: {
			type:String,
			minlegth: [3,'El nombre de usuario es demasiado corto'],
			maxlength: [50, 'El nombre de usuario es demasiado largo'],
		},
		name: String,
		email: String,
		password: {
			type: String,
			minlegth: [8, "La contraseña es muy corta"],
			maxlength: [50, 'La contraseña es demasiado larga'],

			validate: {
				validator: function(p){
					return this.password_confirmation == p;
				},
				message: 'Las contraseñas no son iguales'
			}
		}
	},

	facebook: { 
		email: String,
		id: Number,
		token:  String,
		name: String
	}
})

userSchema.virtual('password_confirmation').get(function(){
	return this.p_c
}).set(function(password){
	this. p_c = password
})

var User = mongoose.model('User',userSchema)

module.exports = User;