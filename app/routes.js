module.exports = function(app,passport,User){ 

	//Rutas de la pagina
	app.get('/',function(req,res){
		if(typeof(req.session.passport) == 'undefined'){
			
			res.render('index.html',{msg: req.flash('notfound')})
		}
		else{

			res.redirect('/app/chat')
		}
	})


	app.get('/signup',function(req,res){
		if(typeof(req.session.passport) == 'undefined'){
			res.render('register.html',{
				msg: req.flash('email'), 
				err: req.flash('errModels')
			})
			
		}
		else{
			res.redirect('/app/chat')
		}
	})

	app.get('/verificar/',function(req,res){
		var name  = req.query.name,
			email = req.query.email;
		User.findOne({'local.user': name},function(err,user){
			if(err) return err
			if (user) {
				res.send("<p style='color:red;''>"+
					"Este nombre de usuario ha sido tomado"+
					"</p>")
			} else{
				res.send("<p style='color:blue;'>"+
					"Este nombre de usuario esta disponible"+
					"</p>")
			}
		})
	})

	app.get('/auth/facebook',
	  passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { 
	  	failureRedirect: '/'}),
	  
	  function(req, res) {
	    // Successful authentication, redirect chat.
	    res.redirect('/app/chat');
	  });


	app.post('/login', passport.authenticate('local', { failureRedirect: '/' ,failureFlash: true}),
	  function(req, res) {
	    res.redirect('/app/chat');
	});

	app.post('/signup',function(req,res){
		let user_name  = req.body.user_name,
			email      = req.body.email,
			password   = req.body.password,
			confirm_p  = req.body.confirm_password;

			User.findOne({'local.user': user_name},function(err,user){
				if(err)
					return err
				if(user){ 
					req.flash('email', 'Este nombre de usuario ha sido tomado')
					res.redirect('/signup') 
				}else{
					var user = new User({
						'local.user': user_name,
						'local.email': email,
						'local.password': password,
						password_confirmation: confirm_p
					})

					user.save(function(err){
						if(err){
							req.flash('errModels',err.toString())
							console.log(err)
							res.redirect('/signup')
						}else{
							res.redirect('/')
						}
					})
				}
			})
	})

	app.get('/app/chat',function(req,res){
		User.findById(req.session.passport.user,function(err,user){
			if (err) {return err}
			if (user) {
				res.render('chatting.html',{user: user.facebook.name || user.local.user})
			}
			if (!user) {
				res.send('No se encontró :/')
			}
		})
			
	})

}