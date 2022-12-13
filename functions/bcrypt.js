const bcrypt = require("bcrypt");
const salt_rounds = 10;

const PasswordHashing = (pw) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pw, salt_rounds, (error, hashpw) => {
      if (error) {
        console.log("해싱 실패");
        return reject();
      } else {
        resolve(hashpw);
      }
    });
  });
};

const CheckingPassword = (result) => {
  return new Promise((resolve, reject) => {
    let pw = result[0];
    let hashpw = result[1];
    bcrypt.compare(pw, hashpw, (err, check) => {
      if (check) {
        console.log("비밀번호 비교 완료");
        resolve({ success: true });
      } else {
        resolve({ success: false, message: "정보가 일치하지 않습니다." });
      }
    });
  });
};

module.exports = { PasswordHashing, CheckingPassword };
