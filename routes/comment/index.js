const express = require("express");
const router = express.Router();
const {
  VerifyToken,
  GetNickName,
} = require("../../middlewares/auth-middlewares");

router.get("/", async (req, res, next) => {
  console.log("comment 라우터 진입");
});

module.exports = router;
