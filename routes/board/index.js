const express = require("express");
const router = express.Router();
const { VerifyToken } = require("../../middlewares/auth-middlewares");
const { SelectUser } = require("./function");

// 토큰만료/재생성 테스트
router.get("/select", VerifyToken, async (req, res, next) => {
  console.log("/select 진입 >> ");
  SelectUser()
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
