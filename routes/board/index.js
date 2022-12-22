const express = require("express");
const router = express.Router();
const { VerifyToken } = require("../../middlewares/auth-middlewares");
const { SelectAll, SelectCategory, SelectBoard } = require("./function");

// 전체글 조회
router.get("/", async (req, res, next) => {
  SelectAll()
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 특정 카테고리 글 조회
router.get("/:category", async (req, res, next) => {
  console.log("/board/:category 진입 >> ");
  console.log("category >> ", req.params.category);
  let category = req.params.category;
  SelectCategory(category)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 특정 카테고리 글 상세조회
router.get("/:category/:board_num", async (req, res, next) => {
  console.log("/:category/:board_num 진입 >> ");
  console.log("category >> ", req.params.category);
  let category = req.params.category;
  console.log("board_num >> ", req.params.board_num);
  let board_num = req.params.board_num;
  console.log("!!board_num >> ", board_num);
  console.log("헤헿 > > ", category, ", ", board_num);

  SelectBoard(category, board_num)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
