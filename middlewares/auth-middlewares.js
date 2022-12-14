const jwt = require("jsonwebtoken");
const MariaQuery = require("../middlewares/mariaModule");
require("dotenv").config();

const CreateToken = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log("CreateToken() 진입 >>");
    let sql = `SELECT nickname, email FROM user WHERE id = "${id}"`;
    let row = await MariaQuery(sql);
    let nickname = row[0].nickname;
    let email = row[0].email;

    // AccessToken 발급
    const payload = {
      id,
      nickname,
      email,
    };
    let token = jwt.sign(
      {
        payload,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "3h",
        issuer: "토큰 발급자",
      }
    );
    // RefreshToken 발급
    let Refreshtoken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "36h",
      issuer: "토큰 발급자",
    });
    resolve({ token, Refreshtoken });
  });
};

module.exports = {
  CreateToken,
};
