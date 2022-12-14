const MariaQuery = require("../../middlewares/mariaModule");

const IdCheck = (id, pw, pwCheck) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("idCheck() 진입");
      console.log("IdCheck 체크 >>", id, pw, pwCheck);

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

      let data = [id, hashpw];
      let sql = `INSERT INTO user (id, hashpw) VALUES (?,?)`;
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
