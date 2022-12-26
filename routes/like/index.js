const express = require("express");
const router = express.Router();
const {
  VerifyToken,
  GetNickName,
} = require("../../middlewares/auth-middlewares");
const { Like, SelectMyLike } = require("./function");

// 좋아요 기능
router.post("/", async (req, res, next) => {
  console.log("좋아요 API 진입 >> ", req.body);

  GetNickName(req.headers.authorization)
    .then((result) => Like([result, req.body]))
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 내가 좋아요한 게시물 조회
router.get("/", async (req, res, next) => {
  console.log("좋아요한 게시글 조회 API 진입 >>");

  GetNickName(req.headers.authorization)
    .then((result) => SelectMyLike(result))
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
