const { request } = require('express');
const User = require('../model/user');
const BlogPost = require('../model/blogspost');
const FollowUser = require('../model/follow')
const FollowingUser = require('../model/following');


let success = false;

module.exports.personaluser = async (req, res) => {
    success = false;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }
        let Blog = await BlogPost.find({ userid: req.user.id });

        success = true;
        return res.status(200).json({ success, Userdata, Blog });
    } catch (e) {
        return res.status(200).json({ error: e, success });
    }
}

module.exports.userfollow = async (req, res) => {
    let followuser;
    let followinguser;
    try {
        let Userdata = await User.findById({ _id: req.user.id });
        if (!Userdata) {
            return res.status(404).send({ error: "Your Account is Not Found", success })
        }

        let New_Userdata = await User.findById({ _id: req.params.id });
        if (!New_Userdata) {
            return res.status(404).send({ error: "User Account is Not Found", success })
        }

        //--------------------------Follow--------------------------------------       
        let follow = await FollowUser.findOne({ userid: New_Userdata._id });
        if (!follow) {
            followuser = newFollow();
            success = true;
        } else {
            let Data = follow.Follow;

            let userinfo = {
                U_id: Userdata._id,
                Firstname: Userdata.Firstname,
                surname: Userdata.surname
            }
            Data.push(userinfo);
            followuser = await FollowUser.findByIdAndUpdate(
                follow._id,
                { $set: { Follow: Data } },
                { new: true }
            );
            success = true;
        }

        function newFollow() {
            let Data = new Array();

            let userinfo = {
                U_id: Userdata._id,
                Firstname: Userdata.Firstname,
                surname: Userdata.surname
            }
            Data.push(userinfo);

            let followuserio = FollowUser.create({
                userid: New_Userdata._id,
                Follow: Data
            });

            return followuserio;
        }


        let following = await FollowingUser.findOne({ userid: Userdata._id });
        if (!following) {
            followinguser = newFollowing();
            success = true;
        } else {
            let Data = following.Following;

            let userinfo = {
                U_id: New_Userdata._id,
                Firstname: New_Userdata.Firstname,
                surname: New_Userdata.surname
            }
            Data.push(userinfo);
            followinguser = await FollowingUser.findByIdAndUpdate(
                following._id,
                { $set: { Following: Data } },
                { new: true }
            );
            success = true;
        }

        function newFollowing() {
            let Data = new Array();

            let userinfo = {
                U_id: New_Userdata._id,
                Firstname: New_Userdata.Firstname,
                surname: New_Userdata.surname
            }
            Data.push(userinfo);

            let followuserio = FollowingUser.create({
                userid: Userdata._id,
                Following: Data
            });

            return followuserio;
        }

        let user = await User.findByIdAndUpdate(Userdata._id, { Following: Userdata.Following + 1 }, { new: true });
        let resuser = await User.findByIdAndUpdate(New_Userdata._id, { Followers: New_Userdata.Followers + 1 }, { new: true });

        res.json({ followuser, success, followinguser });

    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.userunfollow = async (req, res) => {
    try {

        let U1 = await User.findById({ _id: req.params.id })
        let U2 = await User.findById({ _id: req.body.userid })


        let follow = await FollowUser.findOne({ userid: req.params.id })
        let following = await FollowingUser.findOne({ userid: req.body.userid })

        let unfollow = await FollowUser.updateOne(
            { _id: follow._id },
            {
                $pull: {
                    Follow: { U_id: U2._id }
                }
            }
        )

        let unfollowing = await FollowingUser.updateOne(
            { _id: following._id },
            {
                $pull: {
                    Following: { U_id: U1._id }
                }
            }
        )
        let user = await User.findByIdAndUpdate(U2._id, { Following: U2.Following - 1 }, { new: true });
        let resuser = await User.findByIdAndUpdate(U1._id, { Followers: U1.Followers - 1 }, { new: true });
        success = true;
        res.json({ unfollow, success, unfollowing });

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.getfollowers = async (req, res) => {
    try {
        let follow = await FollowUser.findOne({ userid: req.params.id });
        let user = await User.findById({ _id: req.user.id })
        let ff = await FollowUser.aggregate([
            {
                $match: {
                    userid: user._id
                }
            },
            {
                $lookup: {
                    from: "followings",
                    pipeline: [
                        {
                            $match: {
                                userid: user._id
                            }
                        }
                    ],
                    as: "followings"
                }
            },
            {
                $unwind: "$followings"
            }

        ])

        res.json({ follow, ff, user });

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.getfollowing = async (req, res) => {
    try {
        let following = await FollowingUser.findOne({ userid: req.params.id });
        let user = await User.findById({ _id: req.user.id })
        let ff = await FollowingUser.aggregate([
            {
                $match: {
                    userid: user._id
                }
            },
            {
                $lookup: {
                    from: "follows",
                    pipeline: [
                        {
                            $match: {
                                userid: user._id
                            }
                        }
                    ],
                    as: "follows"
                }
            },
            {
                $unwind: "$follows"
            }

        ])


        let m = await FollowingUser.aggregate([
            {
                "$unwind": "$Following"
            },
            {
                "$group": {
                    "_id": "$Following",
                }
            },
            {
                "$match": {}
            },
            {
                "$group": {
                    "_id": "$_id._id",
                    "SubjectName": {
                        "$addToSet": "$_id.Name"
                    }
                }
            }
        ])
        res.json({ following, user, ff });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

module.exports.getsearch = async (req, res) => {
    try {
        //Blog
        let v = req.params.id.split(" ");

        var kl = new RegExp('^' + req.params.id, 'i');
        let Blog_Title = await BlogPost.find({ Blog_Title: { $regex: kl } })
        let Blogdata = Blog_Title


        //Has
        let value = req.params.id.split("");
        const Hasval = [];
        var kl1 = new RegExp(value[0].toUpperCase());
        let Hastag = await BlogPost.find({ Blog_Title: { $regex: kl1 } })
        if (Hastag.length >= 0) {
            for (let i = 0; i < Hastag.length; i++) {
                has = Hastag[i].Hastag
                for (let j = 0; j < has.length; j++) {
                    Hasval.push(has[j])
                }
            }
        }
        Hasval.sort();



        //User
        value = req.params.id.split(" ");
        var us1 = new RegExp('^' + value[0], 'i');
        var us2 = new RegExp('^' + value[1], 'i');
        let Userd = await User.find({
            $or: [
                {
                    Firstname: { $regex: us1 }
                }, {
                    surname: { $regex: us2 }
                },
                {
                    Firstname: { $regex: us2 }
                }, {
                    surname: { $regex: us1 }
                }
            ]
        })
        let Userdata = Userd

        success = true

        res.json({ Blogdata, Hasval, success, Userdata });


    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}
