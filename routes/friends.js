const {  addFriend, acceptrejectFriendRequest, getFriends } = require("../controllers/friends")
const { protectplayer, protectsuperadmin } = require("../middleware/middleware")

const router = require("express").Router()

router
// #region PLAYER
 .get("/getfriends", protectplayer, getFriends)
 .post("/addfriend", protectplayer, addFriend)
 .post("/acceptrejectfriendrequest", protectplayer, acceptrejectFriendRequest)
// #endregion

// #region SUPERADMIN
.get("/getplayerfriendssuperadmin", protectsuperadmin, getFriends)

// #endregion



module.exports = router;