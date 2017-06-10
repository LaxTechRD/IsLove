const facebookStragety = require('passport-facebook').Strategy,
      localStragety    = require('passport-local').Strategy;

module.exports = function(passport,User){ 
   
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });

    passport.use(new localStragety({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req,username,password,cb){
        User.findOne({'local.user': username, 'local.password': password},function(err,user){
            if(err) {
                return cb(err)
                  console.log(err)
            }
            if(!user) {
                return cb(null,false,req.flash('notfound','Tu password o email estan incorrectos'))
            }

            return cb(null,user)
        })
    }
    ))


    passport.use(new facebookStragety({
        clientID: '1306454619410648' ,
        clientSecret: '5af7931cb3109c84dc030addc8f7c5a8' ,
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ['id', 'email', 'gender', 'name', 'verified']
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOne({'facebook.id': profile.id},function(err,user){
        	if (err) {
        		return cb(err)
        	}
        	if(user){
        		return cb(null,user)
        	}
        	else{
        		var newuser = new User({
        								'facebook.id': profile.id, 
        								'facebook.name': profile.name.givenName + ' ' + profile.name.familyName,
                                        'facebook.token': accessToken,
        								'facebook.email': profile._json.email
        							   })
        		newuser.save(function(err){
        			if(err){
        				throw err
        			}
        			return cb(null,newuser)
        		})
        	}
        })
      }
    ));

}