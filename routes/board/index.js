const express = require("express");
const router = express.Router();
const {
  VerifyToken,
  GetNickName,
  CheckAdmin,
} = require("../../middlewares/auth-middlewares");
const {
  SelectAll,
  SelectCategory,
  SelectBoard,
  InsertBoard,
  UpdateBoard,
  DeleteBoard,
  ViewCount,
  SecretBoard,
  NoticeBoard,
  SearchBoard,
} = require("./function");

// 전체글 조회
router.get("/posts", async (req, res, next) => {
  console.log("전체글 조회 API 진입 >> ");

  SelectAll()
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 특정 카테고리 글 조회
router.get("/posts/:category", async (req, res, next) => {
  console.log("특정 카테고리 글 조회 API 진입 >> ");

  SelectCategory(req.params.category)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 특정 카테고리 글 상세조회
router.get("/posts/:category/:board_num", async (req, res, next) => {
  console.log("특정 카테고리 글 상세조회 API 진입 >> ");
  let category = req.params.category;
  let board_num = req.params.board_num;

  ViewCount(board_num)
    .then(() => SelectBoard(category, board_num))
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 게시글 작성
router.post("/", VerifyToken, async (req, res, next) => {
  console.log("글작성API 진입 >> ", req.body);

  GetNickName(req.headers.authorization)
    .then((result) => InsertBoard([result, req.body]))
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 게시글 수정
router.patch("/", async (req, res, next) => {
  console.log("게시글수정API 진입 >> ", req.body);

  UpdateBoard(req.body)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 게시글 삭제
router.patch("/delete", CheckAdmin, async (req, res, next) => {
  console.log("게시글삭제API 진입 >> ", req.body);

  DeleteBoard(req.body.board_num)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 비밀글 설정
router.patch("/secret", async (req, res, next) => {
  console.log("비밀글설정API 진입 >> ", req.body);

  SecretBoard(req.body.board_num)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 공지 설정
router.patch("/notice", async (req, res, next) => {
  console.log("공지설정API 진입 >> ", req.body);

  NoticeBoard(req.body.board_num)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

// 검색기능
router.get("/search/:data", async (req, res, next) => {
  console.log("검색API 진입 >> ", req.params);

  SearchBoard(req.params)
    .then((result) => {
      res.status(200).json({ success: true, list: result });
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
