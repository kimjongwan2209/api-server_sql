const express = require("express");
const router = express.Router();
const comment = require("../model/comment");
const middleware = require("../middleware/user_check");
const { like_gallery } = require("../model/gallery");

//댓글 작성

router.post("/comment/:post_id", middleware, async (req, res) => {
  const { post_id } = req.params;
  const { comment_post } = req.body;
  const { user_id } = req.cookies;

  if (comment_post === "") {
    return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
  }

  //post_id가 있는지를 확인
  gallery.post_id_check(post_id).then((result) => {
    if (result.length === 0) {
      res.status(400).json({ message: "존재하지 않는 게시물입니다." });
    } else {
      comment.create(user_id, post_id, comment_post);
      return res
        .status(200)
        .json({ result: "success", message: "댓글이 작성 되었습니다." });
    }
  });
});

//댓글 조회
router.get("/comment/:comment_id", middleware, async (req, res) => {
  const { comment_id } = req.params;

  comment.findAll(comment_id).then((result) => {
    return res.status(200).json(result);
  });
});

//댓글 수정
router.put("/comment/:post_id/:comment_id", middleware, async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { comment_post } = req.body;
  const { user_id } = req.cookies;

  comment.update(user_id, post_id, comment_id, comment_post).then((result) => {
    console.log(result);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "댓글 수정이 실패하였습니다." });
    }
    return res.status(200).json({ message: "댓글 수정이 완료 되었습니다." });
  });
});

//댓글 삭제
router.delete("/comment/:post_id/:comment_id", middleware, async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { user_id } = req.cookies;

  comment.delete_comment(user_id, post_id, comment_id).then((result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "댓글 삭제가 실패하였습니다." });
    }
    return res.status(200).json({ message: "댓글 삭제가 완료 되었습니다." });
  });
});

//댓글 좋아요
router.post("/comment/like/:comment_id", middleware, async (req, res) => {
  const { comment_id } = req.params;
  const { user_id } = req.cookies;

  //comment_id를 검증
  comment.comment_id_check(comment_id).then((result) => {
    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "좋아요를 할 수 없는 댓글입니다." });
    } else {
      comment.like_count(user_id, comment_id).then((result) => {
        if (result[0]["NUM"] !== 0) {
          return res
            .status(400)
            .json({ message: "이미 좋아요를 한 댓글입니다." });
        } else {
          comment.like_comment(user_id, comment_id).then((result) => {
            return res.status(200).json({ message: "댓글 좋아요~!!" });
          });
        }
      });
    }
  });
});

//댓글 좋아요 취소
router.delete("/comments/dislike/:comment_id", middleware, async (req, res) => {
  const { comment_id } = req.params;
  const { user_id } = req.cookies;

  //좋아요 테이블에 있는지를 검증
  comment.checked_comment(user_id, comment_id).then((result) => {
    if (result[0]["NUM"] !== 0) {
      comment.cancel_like(user_id, comment_id).then((result) => {
        return res.status(200).json({ message: "좋아요를 취소 하였습니다." });
      });
    } else {
      return res.status(400).json({ message: "취소를 할 수 없는 댓글입니다." });
    }
  });
});

module.exports = router;
