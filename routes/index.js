var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Hello World! ( •̀ ω •́ )✧",
    contents: "혜원이의 개인프로젝트입니다.",
  });
});

const MariaQuery = require("../middlewares/mariaModule");
//mysql 테스트
router.get("/a", async (req, res) => {
  console.log("test");
  let sql = "select * from user";
  let row = await MariaQuery(sql);
  console.log(row);
});

module.exports = router;
