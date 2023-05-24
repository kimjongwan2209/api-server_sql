const express = require("express");
const userRouter = require("./user");
const galleryRouter = require("./gallery");
const commentRouter = require("./comment");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser());
router.use("/", [commentRouter]);
router.use("/", [userRouter]);
router.use("/", [galleryRouter]);

module.exports = router;
