Packages Installed:
1. express
2. ejs
3. mongoose
4. passport
5. passport-local
6. passport-local-mongoose
7. express-session
8. body-parser


v1:
* In models directory, created index.js, member.js, post.js, comment.js

v2:
* In routes directory, index.js created
* passport packages installed and used.
* login and register get and post routes created in routes/index.js
* views/login.ejs and views/register.ejs created
* helper_functions/index.js -> isLoggedIn() created
* In index.js, body-parser installed and used.
* In index.js, locals: app.use(function(req, res, next))... created

v3:
* Member replaced with User everywhere
* In routes/post.js, route of 'creating post' is created that creates the
  post, assigns author to it, and assign that post to the Current User's post array.
* In routes/user.js, route of 'home page' is created.
* In views/user, home.ejs is created.
* In index.js:
    # Set locals:
      // Setting locals : This section has to be after setting passport authentication.
      app.use(function(req, res, next){
        res.locals.currentUser = req.user,
        next()
      })
    # Included userRouter, postRouter

v4:
* In models:
    # In user.js, "sent_friend_requests" added.
    # group.js added.
    # message.js added.
* In routes:
    # explore.js added:
        # following routes are added:
            # /:id/explore : This route shows all users list except the current user
            # /:id/explore/:user_id : This route shows the home page of a user
            # /:id/explore/:user_id/send-friend-request : This route does: "SEND FRIEND REQUEST"
            # /:id/explore/:user_id/cancel-friend-request : This route does: "CANCEL FRIEND REQUEST"
            # /:id/explore/:user_id/confirm-friend-request : THIS ROUTE DOES : CONFIRM FRIEND REQUEST
            # /:id/explore/:user_id/remove-friend : THIS ROUTES DOES: REMOVE FRIEND
* In views:
    # "explore.ejs" added
    # "home.ejs" added


v5:
* Learning :
  1. Populating Nesting Array: (Used in routes/group.js -> // THIS ROUTE SHOWS THE HOME PAGE OF GROUP)
    Group.findOne({_id : req.params.group_id}).populate('members').populate({path:'messages', populate : {path: 'author', model : 'User'}}).exec()
    // The above statement populates 'members' inside 'Group', populates 'messages' inside 'Group' and populate 'author' inside 'Message'
    // source link: https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose

  2. Fetching the result from mongoose except multiple specified conditions:
    db.inventory.find( { qty: { $nin: [ 5, 15 ] } } )

  3.  Fetching the result from mongoose except single specified condition:
    db.inventory.find( { qty: { $ne: 20 } } )

  4.  SORTING THE POSTS OF FRIENDS ACCORDING TO THE time IN DESCENDING ORDER
    allPosts.sort(function(a,b){
      var dateA = new Date(a.time)
      var dateB = new Date(b.time)
      return dateB - dateA;
    })


* In models:
    # In group.js, owner added
    # In post.js, time added
    # In user.js, groups added

* In routes:
    # comment.js created:
        # /:id/post/:post_id/comment : LOGIC TO DISPLAY COMMENTS OF A POST
        # /:id/post/:post_id/comment : LOGIC TO CREATE A NEW COMMENT

    # group.js created:
        # /:id/my-groups : Lists all Groups of Current User
        # /:id/my-groups : Logic to create new group
        # /:id/my-groups/:group_id/delete : Logic to Delete existing group
        # /:id/my-groups/:group_id : THIS ROUTE SHOWS THE HOME PAGE OF GROUP
        # /:id/my-groups/:group_id/members : THIS ROUTE DISPLAYS MEMBERS OF THE GROUP
        # /:id/my-groups/:group_id/add-remove-members : THIS ROUTE DISPLAYS THE 'ADD/REMOVE MEMBERS' PAGE
        # /:id/my-groups/:group_id/add-member/:member_id : Logic to add member into the group
        # /:id/my-groups/:group_id/remove-member/:member_id : Logic to remove member from the group

    # In user.js:
        # In  /:id/home : DISPLAY USER'S HOME PAGE
            # FINDING THE CURRENT USER WITH POPULATED friends -> posts -> author
            # SORTING THE POSTS OF FRIENDS ACCORDING TO THE "time" IN DESCENDING ORDER

* In views:
    # comment directory created and comments.ejs added in it:
        #  DISPLAYING COMMENTS OF THE POST

    # group directory created:
        # groups.ejs created:
            # FORM TO CREATE NEW GROUP
            # DISPLAY CURRENT USER'S GROUPS

        # home.ejs created:
            # FORM TO CREATE NEW MESSAGE
            # DISPLAY MESSAGES

        # members.ejs created:
            # DISPLAY MEMBERS OF GROUP

        # add_remove_members.ejs created:
            # DISPLAYING ALREADY ADDED MEMBERS OF GROUPS (WITH REMOVE BUTTON) EXCEPT THE CURRENT USER HIMSELF
            # DISPLAYING FRIENDS OF CURRENT USER WHO ARE NOT MEMBERS OF GROUP (WITH ADD BUTTON)



v10:

* Learning
    1. To iterate through an Object in Javascript: Object.entries(<obj>)
          e.g.
            var obj = {a : 1, b : 2}
            var result = Object.entries(obj)

            value of result is:
              [["a", 1], ["b", 2]]

* In models:
    * In comment.js:
        # added replies that stores Messages
        # added private_tag that is boolean

    * In group.js:
        # added posts

    * Added performa.js but not used yet

    * In post.js:
        # added quantity
        # added show_access ['friends', 'acquaintance', 'unconnected']
        # added buying_from
        # added price
        # added children_posts
        # added parent_post
        # added images
        # added type_of_post ('inventory' / 'casual')

    * In user.js:
        # added inventories
        # added shared_inventories
        # added acquaintances
        # added blocked_by_me
        # added blocked_by_others
        # added my_interests
        # added others_interests
        # shared_inventories_by_me


* In routes:
    * added block.js:
        # Logic to block an item: /:id/post/:post_id/block
        # LOGIC TO APPROVE THE BLOCK REQUEST : /:id/post/:post_id/approve
        # DISPLAY blocked_by_me PAGE : block/blocked_by_me
        # DISPLAY blocked_by_others PAGE : block/blocked_by_others

    * In comment.js:
        # modified : LOGIC TO CREATE A NEW COMMENT
            # added logic to add private_tag

    * In explore.js:
        # modified: This route shows all users list except the current user, friends and acquaintances:
                    /:id/explore
        # modified: This route shows the home page of a user
                    /:id/explore/:user_id
        # added: THIS ROUTE DOES : CONFIRM FRIEND REQUEST AS AN 'FRIEND'
                    /:id/explore/:user_id/confirm-friend-request/friend
        # added: THIS ROUTE DOES : CONFIRM FRIEND REQUEST AS AN 'ACQUAINTANCE'
                    /:id/explore/:user_id/confirm-friend-request/acquaintance
        # modified: // THIS ROUTES DOES: REMOVE FRIEND
                    /:id/explore/:user_id/remove-friend

    * In group.js:
        # added: // THIS ROUTE SHOWS THE MESSAGES OF GROUP
                    /:id/my-groups/:group_id/messages

    * added interest.js:
        # // DISPLAY 'my-interests' PAGE
        # // DISPLAY 'others-interests' PAGE
