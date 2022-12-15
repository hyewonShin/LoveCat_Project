const jwt = require("jsonwebtoken");
const jwtdecode = require("jwt-decode");
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
        issuer: "hyewon",
      }
    );
    // RefreshToken 발급
    let RefreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "14d",
      issuer: "hyewon",
    });

    let sql1 = `UPDATE user SET refresh_token = '${RefreshToken}' WHERE id = '${id}'`;
    await MariaQuery(sql1);

    resolve({ token, RefreshToken });
  });
};

const RemoveBearer = (token) => {
  if (token === undefined) return reject("토큰이 존재하지 않습니다.");
  if (token.includes("Bearer ", 0)) {
    let afterToken = token.replace(/\bBearer \b/g, "");
    return afterToken;
  } else return token;
};

const VerifyToken = async (req, res, next) => {
  // 인증 완료
  try {
    console.log("req.headers.authorization >>", req.headers.authorization);
    const token = RemoveBearer(req.headers.authorization);
    console.log(token);
    req.decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("req.decoded >", req.decoded);

    return next();
  } catch (error) {
    console.log("error > ", error);
    // 인증 실패
    if (error.name === "TokenExpireError") {
      return res.status(419).json({
        code: 419,
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(401).json({
      code: 401,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

module.exports = {
  CreateToken,
  VerifyToken,
};
