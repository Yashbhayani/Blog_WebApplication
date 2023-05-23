const express = require('express');
const { register, otpverification, login, resendOTP, forgot, forotpverification, forresendOTP } = require('../controller/usercontroller.js');
const fetchUser = require('../midlewere/fetchuser');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgot);
router.post("/otpverification", fetchUser, otpverification);
router.get("/resendotp", fetchUser, resendOTP);
router.post("/forotpverification", fetchUser, forotpverification);
router.get("/forresendOTP", fetchUser, forresendOTP);

module.exports = router;