const express = require("express");
const router = express.Router();
const {
  CreateAlarm,
  SelectAlarm,
  SelectAllAlarm,
  UpdateAlarm,
  DeleteAlarm,
  MarkAsReadFlag,
} = require("./function");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", {
    title: "알람 페이지입니다.",
    version: "E001000",
    date: "2022-11-15 09:30",
  });
});

router.post("/", (req, res) => {
  console.log("알람데이터 생성");
  CreateAlarm(req.body)
    .then((result) => res.json({ success: true, message: result }))
    .catch((error) => res.json({ success: false, message: error }));
});

router.get("/:user_num", (req, res) => {
  console.log("읽지않은 알람데이터 출력");
  SelectAlarm(req.params.user_num)
    .then((result) => res.json({ success: true, message: result }))
    .catch((error) => res.json({ success: false, message: error }));
});

router.get("/all/:user_num", (req, res) => {
  console.log("모든 알람데이터 출력");
  SelectAllAlarm(req.params.user_num)
    .then((result) => res.json({ success: true, message: result }))
    .catch((error) => res.json({ success: false, message: error }));
});

router.put("/", (req, res) => {
  console.log("알람데이터 수정");
  UpdateAlarm(req.body)
    .then((result) => res.json({ success: true, message: result }))
    .catch((error) => res.json({ success: false, message: error }));
});

router.delete("/", (req, res) => {
  console.log("알람데이터 삭제");
  DeleteAlarm(req.body.id, req.body.user_num)
    .then((result) => res.json({ success: true, message: result }))
    .catch((error) => res.json({ success: false, message: error }));
});

router.put("/read_flag", (req, res) => {
  console.log("읽음플래그 전환");
  MarkAsReadFlag(req.body.id, req.body.user_num)
    .then((result) => res.json({ success: true, message: result }))
    .catch((error) => res.json({ success: false, message: error }));
});

module.exports = router;
