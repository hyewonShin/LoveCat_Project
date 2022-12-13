const jwt = require("jsonwebtoken");
const MariaQuery = require("../middlewares/mariaModule");
require("dotenv").config();

const CreateToken = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log("CreateToken() 진입 >>");
    let sql = `select nickname, email from user where id = "${id}"`;
    let row = await MariaQuery(sql);
    let nickname = row[0].nickname;
    let email = row[0].email;

    const payload = {
      id,
      nickname,
      email,
    };
    console.log("process.env.JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET);
    jwt.sign(
      {
        payload,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "10h",
        issuer: "토큰 발급자",
      },
      (err, token) => {
        if (err) {
          reject({ status: 400, message: "토큰 발급 실패 서버 오류" });
        } else {
          console.log(`access token 발급 완료 ${token}`);
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  CreateToken,
};
