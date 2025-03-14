const {  addFriend, acceptrejectFriendRequest, getFriends, getFriendRequests, playerlist } = require("../controllers/friends")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()

router
// #region PLAYER
.get("/getfriends", protectplayer, getFriends)
.get("/getfriendrequests", protectplayer, getFriendRequests)
.post("/addfriend", protectplayer, addFriend)
.post("/acceptrejectfriendrequest", protectplayer, acceptrejectFriendRequest)
.get("/playerlist", protectplayer, playerlist)
// #endregion

// #region SUPERADMIN
.get("/getplayerfriendssuperadmin", protectsuperadmin, getFriends)

// #endregion



module.exports = router;