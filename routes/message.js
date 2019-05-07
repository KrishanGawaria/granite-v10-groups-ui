var express = require('express')
var router = express.Router()

var models = require('../models')
var User = models['User']
var Group = models['Group']
var Message = models['Message']

// CREATING MESSAGE AND ADDING IT TO GROUP
router.post('/:id/my-groups/:group_id/message', function(req, res){
  // CREATE newMessage
  // ASSIGNING createdMessage AN "author"
  // ADDING createdMessage INTO GROUPS'S "messages" ARRAY

  var newMessage = {
    message : req.body['message']
  }

  Message.create(newMessage)
  .then(function(createdMessage){
    // ASSIGNING createdMessage AN "author"
    createdMessage.author = req.user
    createdMessage.save()

    // ADDING createdMessage INTO GROUPS'S "messages" ARRAY
    Group.findOne({_id : req.params.group_id})
    .then(function(foundGroup){
      foundGroup.messages.push(createdMessage)
      foundGroup.save()

      res.send(createdMessage)
    })
    .catch(function(error){
      console.log(error)
      res.send(error)
    })
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

module.exports = router
