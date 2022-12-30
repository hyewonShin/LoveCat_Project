const express = require("express");
const router = express.Router();
const { upload } = require("../../middlewares/multer");
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
router.post("/", VerifyToken, upload.single("img"), async (req, res, next) => {
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

// 이미지 업로드
router.post("/image", upload.single("img"), async (req, res, next) => {
  console.log("이미지업로드 API 진입 >> ");

  const {
    fieldname,
    originalname,
    encoding,
    mimetype,
    destination,
    filename,
    path,
    size,
  } = req.file;

  console.log("폼에 정의된 필드명 : ", fieldname);
  console.log("사용자가 업로드한 파일 명 : ", originalname);
  console.log("파일의 엔코딩 타입 : ", encoding);
  console.log("파일의 Mime 타입 : ", mimetype);
  console.log("파일이 저장된 폴더 : ", destination);
  console.log("destinatin에 저장된 파일 명 : ", filename);
  console.log("업로드된 파일의 전체 경로 ", path);
  console.log("파일의 바이트(byte 사이즈)", size);

  res.json({ ok: true, data: "Single Upload Ok" });
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
