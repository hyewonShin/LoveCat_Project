const MariaQuery = require("../../middlewares/mariaModule");

const IdCheck = (id, pw, pwCheck) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("IdCheck() 진입 >>", id, pw, pwCheck);

      if (pw !== pwCheck) {
        resolve({
          success: false,
          message: "비밀번호가 일치하지 않습니다.",
        });
      } else {
        let sql = `SELECT * FROM user WHERE id = "${id}"`;
        let existUsers = await MariaQuery(sql);

        if (existUsers.length < 1) {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "이미 등록된 아이디입니다." });
        }
      }
    } catch (error) {
      console.log("IdCheck 함수 에러", error);
      reject("IdCheck() 에러");
    }
  });
};

const SignUp = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SignUp() 진입");
      let id = result.id;
      let hashpw = result.hashpw;
      let nickname = result.nickname;
      let email = result.email;
      let phone = result.phone;

      let data = [id, hashpw, nickname, email, phone];
      let sql = `INSERT INTO user (id, hashpw, nickname, email, phone, grade) VALUES (?,?,?,?,?,0)`;
      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("SignUp 함수 에러", error);
      reject("SignUp() 에러");
    }
  });
};

const SignIn = (id, pw) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SignIn() 진입");
      // accessToken, RefreshToken 검증
      // accessToken 유효, RefreshToken 유효 => 로그인유지
      // accessToken 만료, RefreshToken 유효 => Refresh 검증 후, accessToken 재발급
      // accessToken 유효, RefreshToken 만료 => access 검증 후, RefreshToken 재발급
      // accessToken 만료, RefreshToken 만료 => 재로그인
      // 로그아웃 시 => 두개 토큰 모두 만료시킴.

      let sql = `SELECT id, hashpw FROM user WHERE id = "${id}"`;
      let row = await MariaQuery(sql);

      if (row.length) {
        let hashpw = row[0].hashpw;
        resolve({ success: true, list: [pw, hashpw] });
      } else {
        resolve({ success: false, message: "존재하지 않는 아이디입니다." });
      }
    } catch (error) {
      console.log("SignIn 함수 에러", error);
      reject("SignIn() 에러");
    }
  });
};

module.exports = {
  IdCheck,
  SignUp,
  SignIn,
};
