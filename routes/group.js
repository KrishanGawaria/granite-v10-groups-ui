var express = require('express')
var router = express.Router()

var models = require('../models')
var User = models["User"]
var Group = models["Group"]

// Lists all Groups of Current User
router.get('/:id/my-groups', function(req, res){
  User.findOne({_id : req.params.id}).populate('groups').exec()
  .then(function(foundUser){
    res.render('group/groups', {foundUser:foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})



// Logic to create new group
router.post('/:id/my-groups', function(req, res){
  // CREATING A NEW GROUP
  // ADDING THE CREATED GROUP INTO CURRENT USER'S "groups" array
  // ADDING THE CURRENT USER INTO CREATED GROUP'S "members" ARRAY

  var newGroup = {
    name : req.body['name']
  }
  // CREATING A NEW GROUP
  Group.create(newGroup)
  .then(function(createdGroup){
    // ADDING THE CREATED GROUP INTO CURRENT USER'S "groups" array
    req.user.groups.push(createdGroup)
    req.user.save()

    // ADDING THE CURRENT USER INTO CREATED GROUP'S "members" ARRAY
    createdGroup.members.push(req.user)
    createdGroup.save()

    res.send('Group Created')
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})

// Logic to Delete existing group
router.get('/:id/my-groups/:group_id/delete', function(req, res){
  // DELETING THE GROUP FROM "groups" ARRAY OF ALL MEMBERS OF GROUP
  // DELETING THE GROUP


  // DELETING THE GROUP FROM "groups" ARRAY OF ALL MEMBERS OF GROUP
  Group.findOne({_id : req.params.group_id}).populate('members').exec()
  .then(function(foundGroup){
    foundGroup.members.forEach(function(Member){

      var index = -1
      Member.groups.forEach(function(groupId, i){
        if(groupId.toString() == foundGroup._id.toString){
          index = i
        }
      })

      if(index != -1){
        Member.groups.splice(index, 1)
      }
      Member.save()

    })

    // DELETING THE GROUP
    Group.remove({_id : req.params.group_id})


    res.send("Group Deleted")
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})


// THIS ROUTE SHOWS THE HOME PAGE OF GROUP
router.get('/:id/my-groups/:group_id', function(req, res){
  Group.findOne({_id : req.params.group_id}).populate({path:'posts', populate:{'path':'author', author:'User'}}).populate('members').exec()
  .then(function(foundGroup){
    res.render('group/home', {foundGroup : foundGroup})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})

// THIS ROUTE SHOWS THE MESSAGES OF GROUP
router.get('/:id/my-groups/:group_id/messages', function(req, res){
  Group.findOne({_id : req.params.group_id}).populate('members').populate({path:'messages', populate : {path: 'author', model : 'User'}}).exec()
  .then(function(foundGroup){
    res.render('group/messages', {foundGroup : foundGroup})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})

// THIS ROUTE DISPLAYS MEMBERS OF THE GROUP
router.get('/:id/my-groups/:group_id/members', function(req, res){
  Group.findOne({_id : req.params.group_id}).populate('members').exec()
  .then(function(foundGroup){
    res.render('group/members', {foundGroup : foundGroup})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})

// THIS ROUTE DISPLAYS THE 'ADD/REMOVE MEMBERS' PAGE
router.get('/:id/my-groups/:group_id/add-remove-members', function(req, res){
  // POPULATING "members" OF GROUP
  Group.findOne({_id : req.params.group_id}).populate('members').exec()
  .then(function(foundGroup){
    // POPULATING "friends" OF USER
    User.findOne({_id : req.user._id}).populate('friends').exec()
    .then(function(foundUser){
        res.render('group/add_remove_members', {foundGroup : foundGroup, foundUser : foundUser})
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


// Logic to add member into the group
router.get('/:id/my-groups/:group_id/add-member/:member_id', function(req, res){
  // ADDING THE USER INTO THE GROUP'S "members" ARRAY
  // ADDING THE GROUP INTO THE USER'S "groups" ARRAY
    Group.findOne({_id : req.params.group_id})
    .then(function(foundGroup){
      User.findOne({_id : req.params.member_id})
      .then(function(foundUser){
        // ADDING THE USER INTO THE GROUP'S "members" ARRAY
        foundGroup.members.push(foundUser)
        foundGroup.save()

        // ADDING THE GROUP INTO THE USER'S "groups" ARRAY
        foundUser.groups.push(foundGroup)
        foundUser.save()

        res.send("Member Added to the Group")
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

// Logic to remove member from the group
router.get('/:id/my-groups/:group_id/remove-member/:member_id', function(req, res){
  // REMOVING THE USER FROM THE GROUP'S "members" ARRAY
  // REMOVING THE GROUP FROM THE USER'S "groups" ARRAY

    Group.findOne({_id : req.params.group_id})
    .then(function(foundGroup){
      User.findOne({_id : req.params.member_id})
      .then(function(foundUser){
        // REMOVING THE USER FROM THE GROUP'S "members" ARRAY
        var index = -1
        foundGroup.members.forEach(function(memberId, i){
          if(memberId.toString() == req.params.member_id.toString()){
            index = i
          }
        })

        if(index != -1){
          foundGroup.members.splice(index, 1)
        }
        foundGroup.save()

        // REMOVING THE GROUP FROM THE USER'S "groups" ARRAY
        index = -1
        req.user.groups.forEach(function(groupId, i){
          if(groupId.toString() == req.params.group_id.toString()){
            index = i
          }
        })

        if(index != -1){
          foundUser.groups.splice(index, 1)
        }
        foundUser.save()

        res.send("Member Removed from the Group")
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
