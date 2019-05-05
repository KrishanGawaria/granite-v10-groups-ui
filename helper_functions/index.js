function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

var helper_functions = {
  isLoggedIn : isLoggedIn
}

module.exports = helper_functions
