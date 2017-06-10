module.exports.user = function(req,res,next){
	if (typeof(req.session.passport) != 'undefined') {
		next()
	} else if(typeof(req.session.passport) == 'undefined'){
		res.redirect('/')
	}
}
