const jwt = require("jsonwebtoken");
const jwtdecode = require("jwt-decode");
const MariaQuery = require("../middlewares/mariaModule");
require("dotenv").config();

const CheckToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") return null;
  }
};

const CheckRToken = async (Rtoken) => {
  try {
    let sql = `SELECT * FROM user WHERE refresh_token = "${Rtoken}"`;
    let row = await MariaQuery(sql);
    console.log("row", row);

    if (row.length !== 0) return row;
  } catch (error) {
    if (error.name === "TokenExpiredError") return undefined;
  }
};

const CreateAccessToken = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log("CreateToken() 진입 >>", id);

    let sql = `SELECT nickname, email FROM user WHERE id = "${id}"`;
    let row = await MariaQuery(sql);
    let nickname = row[0].nickname;
    let email = row[0].email;

    const payload = {
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
    resolve({ id, token });
  });
};

const CreateRefreshToken = (nickname) => {
  return new Promise(async (resolve, reject) => {
    console.log("CreateRefreshToken() 진입 >>", nickname);

    let RefreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
      algorithm: "HS256",
      expiresIn: "14d",
      issuer: "hyewon",
    });

    let sql = `UPDATE user SET refresh_token = '${RefreshToken}' WHERE nickname = '${nickname}'`;
    await MariaQuery(sql);

    resolve(RefreshToken);
  });
};

const LoginCreateRefreshToken = (result) => {
  return new Promise(async (resolve, reject) => {
    console.log("CreateRefreshToken() 진입 >>", result);
    let id = result.id;
    let token = result.token;
    console.log("id >>  ", id);
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

const GetNickName = (header) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("CheckNickName함수 진입");
      let decode = jwtdecode(header);
      console.log("decode", decode);
      let nickname = decode.payload.nickname;
      console.log("nickname", nickname);
      resolve(nickname);
    } catch {
      return reject("CheckNickName함수 오류발생");
    }
  });
};

const VerifyToken = (req, res, next) => {
  try {
    return new Promise(async (resolve, reject) => {
      console.log("req.headers.authorization >>> ", req.headers.authorization);
      console.log("req.headers.RefreshToken >>> ", req.headers.refreshtoken);

      // 헤더에서 토큰이 아에 넘어오지 않았을 때 // ok
      // 프론트에서 401 받으면 로그인페이지로 이동하도록 하기.
      if (req.headers.authorization === undefined)
        res.json({ statuscode: 401, message: "접근 권한이 없습니다." });

      // access토큰 bearer 제거
      let token = req.headers.authorization;
      let Rtoken = req.headers.refreshtoken;
      console.log("token >>  ", token);
      let accessToken = token.replace(/\bBearer \b/g, "");

      // access토큰, refreshc토큰 검증
      const VaccessToken = CheckToken(accessToken);
      console.log("VaccessToken  >>  ", VaccessToken);

      const VrefreshToken = await CheckRToken(Rtoken);
      console.log("VrefreshToken  >>  ", VrefreshToken);

      if (VaccessToken === null) {
        console.log("VaccessToken === null");
        if (VrefreshToken === undefined) {
          console.log("case1");
          // case1: access token과 refresh token 모두가 만료된 경우
          throw Error("API 사용 권한이 없습니다.");
        } else {
          console.log("case2");
          // case2: access token은 만료됐지만, refresh token은 유효한 경우
          let id = VrefreshToken[0].id;
          console.log("id >>  ", id);

          let accessToken = await CreateAccessToken(id);
          console.log("accessToken", accessToken);
          res.send(accessToken);
        }
      } else {
        if (VrefreshToken === undefined) {
          console.log("case3"); // ok
          // case3: access token은 유효하지만, refresh token은 만료된 경우
          let nickname = VaccessToken.payload.nickname;
          console.log("nickname >>  ", nickname);
          let RefreshToken = await CreateRefreshToken(nickname);
          console.log("RefreshToken", RefreshToken);
          res.send(RefreshToken);
        } else {
          console.log("case4"); //ok
          // case4: accesss token과 refresh token 모두가 유효한 경우
          next();
        }
      }
    });
  } catch (error) {
    console.log("error>>  ", error);
    console.log("error.name >>>>  ", error.name);
    res.json({ message: "권한관련 에러" });
  }
};

module.exports = {
  VerifyToken,
  CreateAccessToken,
  CreateRefreshToken,
  LoginCreateRefreshToken,
  GetNickName,
};
