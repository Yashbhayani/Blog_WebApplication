const express = require('express');
const { personaluser, userfollow, userunfollow, getfollowers, getfollowing, getsearch } = require('../controller/userpercontroller.js');
const fetchUser = require('../midlewere/fetchuser');
const router = express.Router();

router.get("/personaluser", fetchUser, personaluser);
router.patch("/followuser/:id", fetchUser, userfollow);
router.patch("/unfollowuser/:id", fetchUser, userunfollow);
router.get("/getfollowers/:id", fetchUser, getfollowers);
router.get("/getfollowing/:id", fetchUser, getfollowing);
router.get("/getsearch/:id", fetchUser, getsearch);






module.exports = router;