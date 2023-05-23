const { request } = require('express');
const FollowUser = require('../model/follow')
const FollowingUser = require('../model/following')

const User = require('../model/user')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const JWT_SCERET = 'Yashisagoodboy';
let success = false;
const d = new Date();

module.exports.register = async (req, res) => {
    try {

        let Userdata = await User.findOne({ Email: req.body.Email });
        if (Userdata) {
            success = false;
            return res.status(200).json({ error: "Sorry a user with email alredy exists.", success });
        }

        Userdata = await User.findOne({ Mobile: req.body.MobileNumber });
        if (Userdata) {
            success = false;
            return res.status(200).json({ error: "Sorry a user with mobile number alredy exists.", success });
        }

        const secPass = await bcrypt.hash(req.body.Password, 10);

        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        let todayDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "codeground07@gmail.com", // generated ethereal user
                pass: "ygdduhecotknfsjo", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "codeground07@gmail.com", // sender address
            to: req.body.Email, // list of receivers
            subject: "Blog app OTP", // Subject line
            text: OTP, // plain text body
            html: `<b>Enter OTP and Welcome to our family member.</b>:-${OTP}`, // html body
        });

        let INFOMESSAGE = info.messageId;
        let NODEMAILERINFO = nodemailer.getTestMessageUrl(info);

        let StartTimmerOTP = d;
        let end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 2, d.getSeconds());
        let EndTimerOTP = end;


        Userdata = await User.create({
            surname: req.body.Surname,
            Firstname: req.body.FirstName,
            Lastname: req.body.LastName,
            Email: req.body.Email,
            Mobile: req.body.MobileNumber,
            Birthdate: req.body.Birthdate,
            Password: secPass,
            Gender: req.body.Gender,
            Followers: 0,
            BlogPost: 0,
            Following: 0,
            Date: todayDate,
            Startyear: d.getFullYear(),
            Startmonth: Number(d.getMonth() + 1),
            StartTimmerOTP: StartTimmerOTP,
            EndTimerOTP: EndTimerOTP,
            verification: false,
            otp: OTP,
            expiresOTP: false,
            passw: req.body.Password
        });

        const data = {
            user: {
                id: Userdata.id,
                surname: Userdata.surname,
                Firstname: Userdata.Firstname,
                Lastname: Userdata.Lastname,
                Birthdate: Userdata.Birthdate,
                Email: Userdata.Email,
                Mobile: Userdata.Mobile,
                Followers: Userdata.Followers,
                BlogPost: Userdata.BlogPost,
                Following: Userdata.Following,
            }
        }

        let followuser = FollowUser.create({
            userid: Userdata.id,
            Follow: []
        })

        let followinguser = FollowingUser.create({
            userid: Userdata.id,
            Following: []
        })

        success = true;
        const authToken = jwt.sign(data, JWT_SCERET);
        return res.status(200).json({ success, authToken, OTP });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.otpverification = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }
        if (Userdata.otp !== req.body.OTP) {
            return res.status(202).send({ error: "Wrong OTP", success })
        }

        if (Boolean(Userdata.expiresOTP)) {
            return res.status(202).send({ error: "OTP not valid", success })
        }

        let date_S = new Date(Userdata.StartTimmerOTP);
        let date_E = new Date(Userdata.EndTimerOTP);
        let VarifyTIME = false;
        if (date_S.getFullYear() <= d.getFullYear() && date_E.getFullYear() >= d.getFullYear()) {
            if (date_S.getMonth() <= d.getMonth() && date_E.getMonth() >= d.getMonth()) {
                if (date_S.getDate() <= d.getDate() && date_E.getDate() >= d.getDate()) {
                    if (date_S.getHours() <= d.getHours() && date_E.getHours() >= d.getHours()) {
                        if (date_S.getMinutes() <= d.getMinutes() && date_E.getMinutes() >= d.getMinutes()) {
                            VarifyTIME = true;
                        }
                    }
                }
            }
        }
        const UDATA = {
            Firstname: Userdata.Firstname,
            surname: Userdata.surname
        }
        const newUser = {
            verification: true,
            expiresOTP: true
        };
        if (VarifyTIME) {
            Userdata = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true });
            success = true;
            return res.status(200).json({ success, UDATA });
        } else {
            success = false;
            return res.status(202).json({ error: "OTP varify time out", success });
        }
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.login = async (req, res) => {

    success = false;    
    try {
        let Userdata = await User.findOne({ Email: req.body.email });
        if (!Userdata) {
            success = false;
            return res.status(404).send({ errors: "Your Account is Not Found", success })
        }

        const passeordcompare = await bcrypt.compare(req.body.password, Userdata.Password);
        if (!passeordcompare) {
            success = false;
            return res.status(400).json({ errors: "Please try to login with correct candidate.", success });
        }


        if (Boolean(Userdata.expiresOTP)) {
            const data = {
                user: {
                    id: Userdata.id,
                    Firstname: Userdata.Firstname,
                    Lastname: Userdata.Lastname,
                    email: Userdata.Email,
                    Mobile: Userdata.Mobile
                }
            }
            const UDATA = {
                Firstname: Userdata.Firstname,
                surname: Userdata.surname
            }
            success = true;
            let OTPSUCCESS = true;
            const authToken = jwt.sign(data, JWT_SCERET);
            return res.status(200).json({ success, authToken, OTPSUCCESS, UDATA });
        }
        else {
            let digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 4; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }

            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                service: "gmail",
                port: 587,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: "codeground07@gmail.com", // generated ethereal user
                    pass: "ygdduhecotknfsjo", // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: "codeground07@gmail.com", // sender address
                to: req.body.email, // list of receivers
                subject: "Blog app OTP", // Subject line
                text: OTP, // plain text body
                html: `<b>Enter OTP and Welcome to our family member.</b>:-${OTP}`, // html body
            });

            let INFOMESSAGE = info.messageId;
            let NODEMAILERINFO = nodemailer.getTestMessageUrl(info);
            let StartTimmerOTP = d;
            let end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 2, d.getSeconds());
            let EndTimerOTP = end;

            const newUser = {
                StartTimmerOTP: StartTimmerOTP,
                EndTimerOTP: EndTimerOTP,
                verification: false,
                otp: OTP,
                expiresOTP: false
            };

            Userdata = await User.findByIdAndUpdate(Userdata._id, { $set: newUser }, { new: true });

            const data = {
                user: {
                    id: Userdata.id,
                    Firstname: Userdata.Firstname,
                    Lastname: Userdata.Lastname,
                    email: Userdata.Email,
                    Mobile: Userdata.Mobile
                }
            }
            success = true;
            let OTPSUCCESS = false;
            const authToken = jwt.sign(data, JWT_SCERET);
            return res.status(200).json({ success, authToken, OTP, OTPSUCCESS });
        }
    } catch (e) {
        return res.status(200).json({ errors: e, success });
    }
}

module.exports.resendOTP = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }

        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "codeground07@gmail.com", // generated ethereal user
                pass: "ygdduhecotknfsjo", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "codeground07@gmail.com", // sender address
            to: Userdata.Email, // list of receivers
            subject: "Blog app OTP", // Subject line
            text: OTP, // plain text body
            html: `<b>Enter OTP and Welcome to our family member.</b>:-${OTP}`, // html body
        });

        let INFOMESSAGE = info.messageId;
        let NODEMAILERINFO = nodemailer.getTestMessageUrl(info);
        let StartTimmerOTP = d;
        let end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 2, d.getSeconds());
        let EndTimerOTP = end;

        const newUser = {
            StartTimmerOTP: StartTimmerOTP,
            EndTimerOTP: EndTimerOTP,
            verification: false,
            otp: OTP,
            expiresOTP: false
        };

        Userdata = await User.findByIdAndUpdate(Userdata._id, { $set: newUser }, { new: true });

        const data = {
            user: {
                id: Userdata.id,
                Firstname: Userdata.Firstname,
                Lastname: Userdata.Lastname,
                email: Userdata.Email,
                Mobile: Userdata.Mobile
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SCERET);
        return res.status(200).json({ success, authToken, OTP });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.forgot = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findOne({ Email: req.body.email });
        if (!Userdata) {
            success = false;
            return res.status(404).send({ errors: "Your Account is Not Found", success })
        }


        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "codeground07@gmail.com", // generated ethereal user
                pass: "ygdduhecotknfsjo", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "codeground07@gmail.com", // sender address
            to: req.body.email, // list of receivers
            subject: "Blog app OTP", // Subject line
            text: OTP, // plain text body
            html: `<b>Enter OTP and Welcome to our family member.</b>:-${OTP}`, // html body
        });

        let INFOMESSAGE = info.messageId;
        let NODEMAILERINFO = nodemailer.getTestMessageUrl(info);
        let StartTimmerOTP = d;
        let end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 2, d.getSeconds());
        let EndTimerOTP = end;

        const newUser = {
            StartTimmerOTP: StartTimmerOTP,
            EndTimerOTP: EndTimerOTP,
            otp: OTP,
        };

        Userdata = await User.findByIdAndUpdate(Userdata._id, { $set: newUser }, { new: true });

        const data = {
            user: {
                id: Userdata.id,
                Firstname: Userdata.Firstname,
                Lastname: Userdata.Lastname,
                email: Userdata.Email,
                Mobile: Userdata.Mobile
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SCERET);
        return res.status(200).json({ success, authToken, OTP });
    } catch (e) {
        return res.status(200).json({ errors: e, success });
    }
}

module.exports.forresendOTP = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }

        let digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "codeground07@gmail.com", // generated ethereal user
                pass: "ygdduhecotknfsjo", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: "codeground07@gmail.com", // sender address
            to: Userdata.Email, // list of receivers
            subject: "Blog app OTP", // Subject line
            text: OTP, // plain text body
            html: `<b>Enter OTP and Welcome to our family member.</b>:-${OTP}`, // html body
        });

        let INFOMESSAGE = info.messageId;
        let NODEMAILERINFO = nodemailer.getTestMessageUrl(info);
        let StartTimmerOTP = d;
        let end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 2, d.getSeconds());
        let EndTimerOTP = end;

        const newUser = {
            StartTimmerOTP: StartTimmerOTP,
            EndTimerOTP: EndTimerOTP,
            otp: OTP,
        };

        Userdata = await User.findByIdAndUpdate(Userdata._id, { $set: newUser }, { new: true });

        const data = {
            user: {
                id: Userdata.id,
                Firstname: Userdata.Firstname,
                Lastname: Userdata.Lastname,
                email: Userdata.Email,
                Mobile: Userdata.Mobile
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SCERET);
        return res.status(200).json({ success, authToken, OTP });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}


module.exports.forotpverification = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }
        if (Userdata.otp !== req.body.OTP) {
            return res.status(202).send({ error: "Wrong OTP", success })
        }


        let date_S = new Date(Userdata.StartTimmerOTP);
        let date_E = new Date(Userdata.EndTimerOTP);
        let VarifyTIME = false;
        if (date_S.getFullYear() <= d.getFullYear() && date_E.getFullYear() >= d.getFullYear()) {
            if (date_S.getMonth() <= d.getMonth() && date_E.getMonth() >= d.getMonth()) {
                if (date_S.getDate() <= d.getDate() && date_E.getDate() >= d.getDate()) {
                    if (date_S.getHours() <= d.getHours() && date_E.getHours() >= d.getHours()) {
                        if (date_S.getMinutes() <= d.getMinutes() && date_E.getMinutes() >= d.getMinutes()) {
                            VarifyTIME = true;
                        }
                    }
                }
            }
        }

        const secPass = await bcrypt.hash(req.body.pass, 10);

        const newUser = {
            Password: secPass,
            passw: req.body.pass
        };
        if (VarifyTIME) {
            Userdata = await User.findByIdAndUpdate(req.user.id, { $set: newUser }, { new: true });
            success = true;
            return res.status(200).json({ success });
        } else {
            success = false;
            return res.status(202).json({ error: "OTP varify time out", success });
        }
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

