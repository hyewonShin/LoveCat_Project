const MariaQuery = require("../../middlewares/mariaModule");

// 신고기능
const BlackList = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("BlackList() 진입 >>> ", result);
      let nickname = result[0];
      const { board_num } = result[1];

      let sql = `SELECT * FROM blacklist WHERE reporter = "${nickname}" AND board_num = ${board_num}`;
      let row = await MariaQuery(sql);

      if (row.length === 0) {
        let data = [nickname, board_num];
        let sql = `INSERT INTO blacklist  
                    (reporter, board_num)
                   VALUES 
                    (?,?)`;

        await MariaQuery(sql, data);
        resolve({ success: true, message: "신고 완료되었습니다." });
      }
      resolve({
        success: false,
        message: "해당 회원에게 이미 신고된 게시물입니다.",
      });
    } catch (error) {
      console.log("BlackList 함수 에러", error);
      reject("BlackList() 에러");
    }
  });
};

// 블랙리스트 조회
const SelectBlackList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectBlackList() 진입 >>> ");

      let sql = `SELECT * FROM blacklist`;

      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectAll 함수 에러", error);
      reject("SelectAll() 에러");
    }
  });
};

module.exports = {
  BlackList,
  SelectBlackList,
};
