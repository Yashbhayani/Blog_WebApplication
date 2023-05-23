const express = require('express');
const { 
        addBlogs,
        getBlogs,
        getallBlogs,
        getallhasBlogs,
        likeblogs,
        commentblogs,
        commentblogsdelete,
        otheruserinfo,
        deleteblog,
        editblog,
        userverify,
        updateblogfirstimag,
        updateblogsecondimag,
        updateblognoimag
    } = require('../controller/blogscontrollers.js');
const fetchUser = require('../midlewere/fetchuser');
const router = express.Router();
var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `upload/`);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.get("/getallblog", getallBlogs);
router.post("/addblog", fetchUser, upload.array("image", 2), addBlogs);
router.get("/getblog/:id", fetchUser, getBlogs);
router.get("/getallhasBlogs/:id", fetchUser, getallhasBlogs);
router.patch("/:id/like", fetchUser, likeblogs);
router.patch("/comment", fetchUser, commentblogs);
router.patch("/:id/commentdelete", fetchUser, commentblogsdelete);
router.get("/otheruserinfo/:id", fetchUser, otheruserinfo);
router.delete("/deleteblog/:id", fetchUser, deleteblog);
router.get("/userverify/:userid/:blogid", fetchUser, userverify)
router.put("/updateblog/:id", fetchUser, upload.array("image", 2), editblog)
router.put("/updateblogfirstimag/:id", fetchUser, upload.array("image", 1), updateblogfirstimag)
router.put("/updateblogsecondimag/:id", fetchUser, upload.array("image", 1), updateblogsecondimag)
router.put("/updateblognoimag/:id", fetchUser, updateblognoimag)


module.exports = router;