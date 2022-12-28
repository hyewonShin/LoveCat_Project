const express = require("express");
const router = express.Router();
const {
  VerifyToken,
  GetNickName,
  CheckAdmin,
} = require("../../middlewares/auth-middlewares");

const { SelectComment } = require("./function");

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

module.exports = router;
