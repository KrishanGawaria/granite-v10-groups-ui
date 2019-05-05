var express = require('express')
var router = express.Router()

var models = require('../models')
var User = models['User']


// DISPLAY 'my-interests' PAGE
router.get('/:id/my-interests', function(req, res){

  User.findOne({_id : req.user._id}).populate({path:'my_interests',populate:{path:'buying_from'}}).exec()
  .then(function(foundUser){
    res.render('interest/my_interests', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})


// DISPLAY 'others-interests' PAGE
router.get('/:id/others-interests', function(req, res){

  User.findOne({_id : req.user._id}).populate({path:'others_interests',populate:{path:'author'}}).exec()
  .then(function(foundUser){
    res.render('interest/others_interests', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

module.exports = router
