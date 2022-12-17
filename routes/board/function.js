const MariaQuery = require("../../middlewares/mariaModule");

const SelectUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectUser() 진입 >>> ");
      let sql = `select u_number from user where id = "qwer"`;
      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectUser 함수 에러", error);
      reject("SelectUser() 에러");
    }
  });
};

module.exports = {
  SelectUser,
};
