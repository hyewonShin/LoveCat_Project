const express = require("express");
const router = express.Router();
const { IdCheck, SignUp, SignIn } = require("./function");
const { CreateToken } = require("../../middlewares/auth-middlewares");
const { PasswordHashing, CheckingPassword } = require("../../functions/bcrypt");
const { validator } = require("../../middlewares/validation");

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

//회원가입 중복검사
router.post("/idCheck", async (req, res, next) => {
  console.log("/idCheck 진입 >> ");

  const { id, pw, pwCheck } = req.body;
  console.log("라우터 체크 >>", id, pw, pwCheck);
  IdCheck(id, pw, pwCheck)
    .then((result) => {
      if (result.success == false) {
        res.json({ success: false, message: result.message });
      } else {
        res.json({ success: true });
      }
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

//회원가입
router.post("/register", function (req, res, next) {
  console.log("/register 진입 >> ");
  const { id, pw } = req.body;
  PasswordHashing(pw)
    .then((hashpw) => SignUp({ id, hashpw }))
    .then((result) => res.json({ success: true, list: result }))
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

//로그인
router.post("/login", function (req, res, next) {
  console.log("/login 진입 >>");
  const { id, pw } = req.body;
  SignIn(id, pw)
    .then((result) => {
      if (result.success === false) {
        res.json({ success: false, message: result.message });
      } else {
        CheckingPassword(result.list).then((result) => {
          if (result.success === false) {
            res.json({ success: false, message: result.message });
          } else {
            CreateToken(id).then((token) => {
              res.send({ token });
            });
          }
        });
      }
    })
    .catch((error) =>
      res.status(error).json({ success: false, message: error })
    );
});

module.exports = router;
