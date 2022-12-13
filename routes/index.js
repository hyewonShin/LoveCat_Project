var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Hello World! ( •̀ ω •́ )✧",
    contents: "혜원이의 개인프로젝트입니다.",
  });
});

module.exports = router;
