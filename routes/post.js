var express = require('express')
var router = express.Router()

var multer = require("multer")
var path = require("path")
var fs = require("fs")

var models = require("../models")
var User = models["User"]
var Post = models["Post"]
var Group = models["Group"]

var FILES = []
var MIME_TYPES = []

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: function (req, file, callback) {

    FILES.push(file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    callback(null, file.fieldname+"-"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
    storage : storage ,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }

}).array('userPhoto',20);

function checkFileType(file, cb){
    var filetypes= /jpeg|JPEG|jpg|JPG|png|PNG|gif|GIF/;
    var extname= filetypes.test(path.extname(file.originalname));
    var mimetype= filetypes.test(file.mimetype);

    // console.log("Mime Type: "+file.mimetype.toString())
    MIME_TYPES.push(file.mimetype.toString())

    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb("Error: Images Only")
    }
}





// DISPLY 'WHOM TO SHOW THE POST' PAGE
router.get('/:id/post/new', function(req, res){
  User.findOne({_id : req.user._id}).populate('groups')
  .then(function(foundUser){
    res.render('post/create.ejs', {foundUser : foundUser})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})


// Display MY POSTS PAGE
router.get('/:id/post', function(req, res){



  User.findOne({_id : req.user._id}).populate('posts').exec()
  .then(function(foundUser){
    res.render("post/post", {AllPosts : foundUser.posts})
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })

})


// LOGIC TO CREATE POST
router.post('/:id/post', function(req, res){

  FILES = []
  MIME_TYPES = []
  upload(req,res,function(err) {
    // console.log(req.body);
    //console.log(req.files);
    if(err) {
      console.log(err)
      return res.end("Error uploading file.");
    }
    // console.log(FILES)
    // console.log(MIME_TYPES)
    // res.end("File is uploaded");

    var newPost = {
      post : req.body["post"],
      quantity : Number(req.body["quantity"]),
      price : Number(req.body['price']),
      type_of_post : 'casual',
      images : []
    }

    FILES.forEach(function(FILE_NAME, i){
      var image = {}
      image["data"] = fs.readFileSync(__dirname.replace('\\routes', '')+"\\public\\uploads\\"+FILE_NAME)
      image["contentType"] = MIME_TYPES[i]
      image["base64"] = new Buffer(image["data"], 'binary').toString('base64')
      newPost["images"].push(image)
    })


    // CREATING POST
    Post.create(newPost)
    .then(function(createdPost){

      // // ASSIGNING BASE64
      // var base64data = new Buffer(createdPost.image.data, 'binary').toString('base64')
      // createdPost.image["base64"] = base64data

      // PUSHING createdPost INTO CURRENT USER'S posts ARRAY
      req.user.posts.push(createdPost)
      req.user.save()

      // ASSIGNING POST'S AUTHOR
      createdPost.author = req.user

      // ASSIGNING show_access TO POST

      Object.entries(req.body).forEach(function(array){

        var friend = -1
        var acquaintance = -1
        var unconnected = -1

        if(array[0] == 'friend'){
          friend = 1
        } else if(array[0] == 'acquaintance'){
          acquaintance = 1
        } else if(array[0] == 'unconnected'){
          unconnected = 1
        }

        // PUSHING THE POST TO SPECIFIED GROUPS
        var category = array[0].split("-")[0]  // Friend/Group
        if(category == 'Group'){
          var id = array[0].split("-")[1]
          Group.findOne({_id : id})
          .then(function(foundGroup){
            foundGroup.posts.push(createdPost)
            foundGroup.save()
          })
          .catch(function(error){
            console.log(error)
            res.send(error)
          })
        }


        if(friend == 1){
          createdPost.show_access.push('friend')
        }
        if(acquaintance == 1){
          createdPost.show_access.push('acquaintance')
        }
        if(unconnected == 1){
          createdPost.show_access.push('unconnected')
        }



      })

      createdPost.save()

      // PUSHING THE POST TO SELECTED GROUP'S posts ARRAY


      res.send('Posted Successfully')
    })
    .catch(function(error){
      console.log(error)
      res.send('Error creating post')
    })

  });
})



// DISPLAY AN IMAGE ON CLICK
router.get('/:id/post/:post_id/image/:index', function(req, res){
  Post.findOne({_id : req.params.post_id})
  .then(function(foundPost){

    res.contentType(foundPost.images[Number(req.params.index)]["contentType"])
    res.send(foundPost.images[Number(req.params.index)]["data"]['buffer'])
  })
  .catch(function(error){
    console.log(error)
    res.send(error)
  })
})




// DISPLAY SHARE POST PAGE
router.get('/:id/post/:post_id/share', function(req, res){

  // POPULATING FRIENDS AND GROUPS OF CURRENT USER
  User.findOne({_id : req.user._id}).populate('friends').populate('groups').exec()
  .then(function(foundUser){
    // FINDING THE INVENTORY TO SHARE
    Post.findOne({_id : req.params.post_id})
    .then(function(foundPost){
      res.render('post/share', {foundUser: foundUser, foundPost: foundPost})
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




// LOGIC TO SHARE POST
router.post('/:id/post/:post_id/share', function(req, res){

  Post.findOne({_id : req.params.post_id})
  .then(function(foundPost){

    // req.body will be in format:
    // {"Friend-5c90c2db3c463e7e7075953c" : "rishabh", "Group-5c90c2db3c463e7e7075953c" : "our-group" }

    //Object.entries iterates through an Javascript Object
    Object.entries(req.body).forEach(function(array){
      // array will be in format : [ 'Friend-5c90c2db3c463e7e7075953c', 'rishabh' ]
      // or  [ 'Group-5c90c2db3c463e7e7075953c', 'our-group' ]

      var category = array[0].split("-")[0]  // Friend/Group
      var id = array[0].split("-")[1]

      if(category == "Friend"){
        User.findOne({_id : id})
        .then(function(foundFriend){
          foundFriend.shared_inventories.push(foundPost)
          foundFriend.save()
        })
        .catch(function(error){
          console.log(error)
          res.send(error)
        })
      } else{
          Group.findOne({_id : id})
          .then(function(foundGroup){
            foundGroup.posts.push(foundPost)
            foundGroup.save()
          })
          .catch(function(error){
            console.log(error)
            res.send(error)
          })
        }
      })

      res.send("Inventory Successfully Shared")

    })
    .catch(function(error){
      console.log(error)
      res.send(error)
    })

})





module.exports = router
