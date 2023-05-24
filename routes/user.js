const express = require("express");
const router = express.Router();
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware/user_check");

//회원가입 api

router.post("/user", async (req, res) => {
  const { user_id, name, telephone, password, address } = req.body;

  //아이디, 패스워드 제한요건

  const create_user_id = /^[a-zA-z0-9]{3,12}$/;

  if (!create_user_id.test(user_id)) {
    return res
      .status(412)
      .json({ errorMessage: "아이디 형식이 일치하지 않습니다." });
  }
  if (password.length < 4) {
    return res
      .status(412)
      .json({ errorMessage: "비밀번호 형식이 올바르지 않습니다." });
  }

  if (password.includes(user_id)) {
    return res
      .status(412)
      .json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." });
  }

  try {
    await user.make_id(user_id, name, telephone, password, address);
    return res.status(200).json({ success: "회원가입이 완료 되었습니다." });
  } catch (error) {
    return res.status(400).json({
      message: "에러 발생.",
    });
  }
});

//로그인 api

let tokenObject = {};

router.post("/confirm_id/", async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const accessToken = jwt.sign({ user_id: user.user_id }, "secret", {
      expiresIn: "1200s",
    });
    const refreshToken = jwt.sign({}, "secret", {
      expiresIn: "3d",
    });
    user.login(user_id, password).then((result) => {
      if (result.length == 0) {
        return res.status(400).json({ message: "로그인에 실패하였습니다." });
      }
      user.refreshGet(user_id).then((result) => {
        if (!result[0]) {
          user.token(user_id, refreshToken).then((result) => {
            return res.status(200).json({ message: "토큰발급완료" });
          });
        } else if (result[0]["refresh_token"]) {
          user.updateToken(user_id, refreshToken).then((result) => {
            return res.status(200).json({ message: "로그인 되었습니다." });
          });
        }
      });
      // 토큰 생성, 쿠키에 기록
      tokenObject[refreshToken] = user_id;
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
      res.cookie("user_id", user_id);
    });
  } catch (err) {
    res.status(400).send({ message: err + " : login failed" });
  }
});

module.exports = router;
