const express = require("express");
const router = express.Router();
const { VerifyToken } = require("../../middlewares/auth-middlewares");
const { Like } = require("./function");

// 좋아요 기능
router.post("/", async (req, res, next) => {
  console.log("좋아요 API 진입 >> ", req.body);

  Like(req.body)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
