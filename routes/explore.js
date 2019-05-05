var express = require('express')
var router = express.Router()

var models = require('../models')
var User = models['User']

// This route shows all users list except the current user, friends and acquaintances
router.get('/:id/explore', function(req, res){
  // FETCHING ONLY THOSE USERS WHO ARE NEITHER CURRENT USER'S FRIEND NOR ACQUAINTANCE
  var currentUserId = [req.user._id]
  User.find({_id : { $nin : [...currentUserId, ...req.user.friends, ...req.user.acquaintances] }})
  .then(function(foundUsers){
    res.render('explore/explore', {foundUsers: foundUsers})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})

// This route shows the home page of a user
router.get('/:id/explore/:user_id', function(req, res){
  // CHECK whoAmIAccordingToHim, AND ACCORDINGLY DISPLAY POSTS TO ME BY CHECKING EACH POST'S show_access


  User.findOne({_id : req.params.user_id}).populate('posts').exec()
  .then(function(foundUser){

    whoAmIAccordingToHim = ''
    User.findOne({_id : req.params.user_id})
    .then(function(exploredUser){
      // CHECKING FRIEND
      var FRIEND = -1
      var ACQUAINTANCE = -1
      var UNCONNECTED = -1

      exploredUser.friends.forEach(function(Friend){
        if(Friend._id.toString() == req.user._id.toString()){
          FRIEND = 1
          whoAmIAccordingToHim = 'friend'
        }
      })
      if(FRIEND == -1){
        exploredUser.acquaintances.forEach(function(Acquaintance){
          if(Acquaintance._id.toString() == req.user._id.toString()){
            ACQUAINTANCE = 1
            whoAmIAccordingToHim = 'acquaintance'
          }
        })
      }
      if(FRIEND == -1 && ACQUAINTANCE == -1){
        UNCONNECTED = 1
        whoAmIAccordingToHim = 'unconnected'
      }

      AllPosts = []
      foundUser.posts.forEach(function(Post){

        var index = Post.show_access.indexOf(whoAmIAccordingToHim)
        if(index != -1 ){
          AllPosts.push(Post)
        }
      })

      res.render('explore/home', {foundUser : foundUser, AllPosts : AllPosts})

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

// This route does: "SEND FRIEND REQUEST"
router.get('/:id/explore/:user_id/send-friend-request', function(req, res){
  User.findOne({_id : req.params.user_id})
  .then(function(foundUser){
    // Adding the current user in foundUser's "friend_requests" array
    foundUser.friend_requests.push(req.user)
    foundUser.save()
    // Adding foundUser in current user's "sent_friend_requests" array
    req.user.sent_friend_requests.push(foundUser)
    req.user.save()
    res.redirect('/'+req.user._id+'/explore/'+foundUser._id)
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})

// This route does: "CANCEL FRIEND REQUEST"
router.get('/:id/explore/:user_id/cancel-friend-request', function(req, res){
  // Removing the explored user from current user's "sent_friend_requests" array
  var index = -1
  req.user.sent_friend_requests.forEach(function(friendId, i){
    if(friendId.toString() == req.params.user_id.toString()){
      index = i
    }
  })

  if(index != -1){
    req.user.sent_friend_requests.splice(index, 1)
  }
  req.user.save()

  // REMOVING THE CURRENT USER FROM EXPLORED USER'S "friend_requests" ARRAY
  User.findOne({_id : req.params.user_id})
  .then(function(foundUser){
    index = -1
    foundUser.friend_requests.forEach(function(friendId, i){
      if(friendId.toString() == req.user._id.toString()){
        index = i
      }

      if(index != -1){
        foundUser.friend_requests.splice(index, 1)
      }
      foundUser.save()
    })
    res.redirect('/'+req.user._id+'/explore/'+req.params.user_id)
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

// THIS ROUTE DOES : CONFIRM FRIEND REQUEST AS A 'FRIEND'
router.get('/:id/explore/:user_id/confirm-friend-request/friend', function(req, res){
  // ADDING EXPLORED USER INTO CURRENT USER'S "friends" ARRAY and VICE-VERSA
  // REMOVING THE EXPLORED USER FROM CURRENT USER'S "friend_requests" ARRAY
  // REMOVING THE CURRENT USER FROM EXPLORED USER'S "sent_friend_requests" ARRAY

  // ADDING EXPLORED USER INTO CURRENT USER'S "friends" ARRAY and VICE-VERSA
  User.findOne({_id : req.params.user_id})
  .then(function(foundUser){
    req.user.friends.push(foundUser)
    // req.user.save()
    // because .save() can only be used once with one document. It's already used ahead.

    foundUser.friends.push(req.user)
    // foundUser.save()
    // because .save() can only be used once with one document. It's already used ahead.

    // REMOVING THE EXPLORED USER FROM CURRENT USER'S "friend_requests" ARRAY
    var index = -1
    req.user.friend_requests.forEach(function(friendId, i){
      if(friendId.toString() == req.params.user_id.toString()){
        index = i
      }
    })

    if(index != -1){
      req.user.friend_requests.splice(index, 1)
    }
    req.user.save()

    // REMOVING THE CURRENT USER FROM EXPLORED USER'S "sent_friend_requests" ARRAY
    index = -1
    foundUser.sent_friend_requests.forEach(function(friendId, i){
      if(friendId.toString() == req.user._id.toString()){
        index = i
      }
    })

    if(index != -1){
      foundUser.sent_friend_requests.splice(index, 1)
    }
    foundUser.save()

    res.send("Friend Request Confirmed")
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})




// THIS ROUTE DOES : CONFIRM FRIEND REQUEST AS AN 'ACQUAINTANCE'
router.get('/:id/explore/:user_id/confirm-friend-request/acquaintance', function(req, res){
  // ADDING EXPLORED USER INTO CURRENT USER'S "acquaintances" ARRAY
  // ADDING CURRENT USER INTO EXPLORED USER'S "friends" ARRAY
  // REMOVING THE EXPLORED USER FROM CURRENT USER'S "friend_requests" ARRAY
  // REMOVING THE CURRENT USER FROM EXPLORED USER'S "sent_friend_requests" ARRAY


  // ADDING EXPLORED USER INTO CURRENT USER'S "acquaintances" ARRAY
  User.findOne({_id : req.params.user_id})
  .then(function(foundUser){
    req.user.acquaintances.push(foundUser)
    // req.user.save()
    // because .save() can only be used once with one document. It's already used ahead.

    foundUser.friends.push(req.user)
    // foundUser.save()
    // because .save() can only be used once with one document. It's already used ahead.

    // REMOVING THE EXPLORED USER FROM CURRENT USER'S "friend_requests" ARRAY
    var index = -1
    req.user.friend_requests.forEach(function(friendId, i){
      if(friendId.toString() == req.params.user_id.toString()){
        index = i
      }
    })

    if(index != -1){
      req.user.friend_requests.splice(index, 1)
    }
    req.user.save()

    // REMOVING THE CURRENT USER FROM EXPLORED USER'S "sent_friend_requests" ARRAY
    index = -1
    foundUser.sent_friend_requests.forEach(function(friendId, i){
      if(friendId.toString() == req.user._id.toString()){
        index = i
      }
    })

    if(index != -1){
      foundUser.sent_friend_requests.splice(index, 1)
    }
    foundUser.save()

    res.send("Friend Request Confirmed")
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})




// THIS ROUTES DOES: REMOVE FRIEND
router.get('/:id/explore/:user_id/remove-friend', function(req, res){
  // REMOVING THE EXPLORED FRIEND FROM CURRENT USER'S "friends" ARRAY
  // REMOVING THE EXPLORED FRIEND FROM CURRENT USER'S "acquaintances" ARRAY
  // REMOVING CURRENT USER FROM EXPLORED USER'S "friends" ARRAY
  // REMOVING CURRENT USER FROM EXPLORED USER'S "acquaintances" ARRAY



  // REMOVING THE EXPLORED FRIEND FROM CURRENT USER'S "friends" ARRAY
  var index = -1
  req.user.friends.forEach(function(friendId, i){
    if(friendId.toString() == req.params.user_id.toString()){
      index = i
    }
  })
  if(index!=-1){
    req.user.friends.splice(index, 1)
  }
  // req.user.save()
  // because .save() can only be used once with one document. It's already used ahead.

  // REMOVING THE EXPLORED FRIEND FROM CURRENT USER'S "acquaintances" ARRAY
  index = -1
  req.user.acquaintances.forEach(function(acquaintanceId, i){
    if(acquaintanceId.toString() == req.params.user_id.toString()){
      index = i
    }
  })

  if(index!=-1){
    req.user.acquaintances.splice(index, 1)
  }
  req.user.save()



  // REMOVING CURRENT USER FROM EXPLORED USER'S "friends" ARRAY
  index = -1
  User.findOne({_id : req.params.user_id})
  .then(function(foundUser){
    foundUser.friends.forEach(function(friendId, i){
      if(friendId.toString() == req.user._id.toString()){
        index = i
      }
    })

    if(index!=-1){
      foundUser.friends.splice(index, 1)
    }
    // foundUser.save()
    // because .save() can only be used once with one document. It's already used ahead.

    // REMOVING CURRENT USER FROM EXPLORED USER'S "acquaintances" ARRAY
    index = -1
    foundUser.acquaintances.forEach(function(acquaintanceId, i){
      if(acquaintanceId.toString() == req.user._id.toString()){
        index = i
      }
    })

    if(index != -1){
      foundUser.acquaintances.splice(index, 1)
    }
    foundUser.save()

    res.send("Friend Removed")
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

module.exports = router
