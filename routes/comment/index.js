const express = require("express");
const router = express.Router();
const {
  VerifyToken,
  GetNickName,
  CheckAdmin,
} = require("../../middlewares/auth-middlewares");

const {
  SelectComment,
  InsertComment,
  UpdateComment,
  DeleteComment,
} = require("./function");

// 댓글 조회
router.get("/:board_num/:comment_num", async (req, res, next) => {
  console.log("댓글조회API 진입 >> ");

  SelectComment(req.params)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 댓글 작성
router.post("/", async (req, res, next) => {
  console.log("댓글작성API 진입 >> ", req.body);

  GetNickName(req.headers.authorization)
    .then((result) => InsertComment([result, req.body]))
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 댓글 수정
router.patch("/", async (req, res, next) => {
  console.log("댓글수정API 진입 >> ", req.body);

  UpdateComment(req.body)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 댓글 삭제
router.delete("/", async (req, res, next) => {
  console.log("댓글삭제API 진입 >> ", req.body);

  DeleteComment(req.body.comment_num)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
