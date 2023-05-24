const express = require("express");
const router = express.Router();
const gallery = require("../model/gallery");
const middleware = require("../middleware/user_check");

//게시물 작성
router.post("/post/", middleware, async (req, res) => {
  const { gallery_post } = req.body;
  const { user_id } = req.cookies;

  try {
    await gallery.create(user_id, gallery_post);

    return res.status(200).json({
      message: "게시글을 생성하였습니다.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "게시물 등록이 실패하였습니다.",
    });
  }
});

//게시물 전체조회
router.get("/post", async (req, res) => {
  gallery.findAll().then((result) => {
    if (result.length !== 0) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "게시글을 불러오지 못했습니다." });
    }
  });
});

//게시물 단건조회
router.get("/post/:post_id", async (req, res) => {
  const { post_id } = req.params;

  gallery.findOne(post_id).then((result) => {
    console.log(result);
    if (result.length === 0) {
      return res.status(200).json({ message: "게시글이 없습니다." });
    }
    return res.status(200).json({ result });
  });
});

//게시물 수정
router.put("/post/:post_id", middleware, async (req, res) => {
  const { post_id } = req.params;
  const { gallery_post } = req.body;
  const { user_id } = req.cookies;

  gallery.update(user_id, post_id, gallery_post).then((result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "게시글 수정이 실패하였습니다." });
    }
    return res.status(200).json({ message: "게시글 수정이 완료 되었습니다." });
  });
});

//게시물 삭제
router.delete("/post/:post_id", middleware, async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.cookies;

  gallery.delete_gallery(user_id, post_id).then((result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "게시글 삭제에 실패하였습니다." });
    }
    return res.status(200).json({ message: "게시글 삭제가 완료 되었습니다." });
  });
});

//게시글 좋아요
router.post("/post/like/:post_id", middleware, async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.cookies;

  //post_id를 검증
  gallery.post_id_check(post_id).then((result) => {
    if (result.length === 0) {
      return res.status(400).json({ message: "게시물이 존재하지 않습니다." });
    } else {
      gallery.like_count(user_id, post_id).then((result) => {
        if (result[0]["NUM"] !== 0) {
          return res
            .status(400)
            .json({ message: "이미 좋아요를 한 게시물 입니다." });
        } else {
          gallery.like_gallery(user_id, post_id).then((result) => {
            return res.status(200).json({ message: "게시글 좋아요~!!" });
          });
        }
      });
    }
  });
});

//게시글 좋아요 취소
router.delete("/post/like/:post_id", middleware, async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.cookies;

  gallery.checked_post(user_id, post_id).then((result) => {
    if (result[0]["NUM"] !== 0) {
      gallery.cancel_like(user_id, post_id).then((result) => {
        return res.status(200).json({ message: "좋아요가 취소 되었습니다." });
      });
    } else {
      return res
        .status(400)
        .json({ message: "취소를 할 수 없는 게시물입니다." });
    }
  });
});

module.exports = router;
