const express = require("express");
const router = express.Router();
const {
  VerifyToken,
  GetNickName,
} = require("../../middlewares/auth-middlewares");
const { BlackList, SelectBlackList } = require("./function");

// 신고기능
router.post("/", async (req, res, next) => {
  console.log("신고기능 API 진입 >> ", req.body);

  GetNickName(req.headers.authorization)
    .then((result) => BlackList([result, req.body]))
    .then((result) =>
      res.json({ success: result.success, message: result.message })
    )
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 신고된 게시물 조회
router.get("/", async (req, res, next) => {
  console.log("블랙리스트 조회 API 진입 >> ", req.body);

  SelectBlackList()
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
