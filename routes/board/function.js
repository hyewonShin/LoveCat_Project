const MariaQuery = require("../../middlewares/mariaModule");

const SelectAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectAll() 진입 >>> ");
      let sql = `select * from board`;
      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectAll 함수 에러", error);
      reject("SelectAll() 에러");
    }
  });
};

const SelectCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectCategory() 진입 >>> ");
      console.log("category >>> ", category);
      let sql = `select * from board where category_num = "${category}"`;
      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectCategory 함수 에러", error);
      reject("SelectCategory() 에러");
    }
  });
};

const SelectBoard = (category, board_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectBoard() 진입 >>> ");
      console.log("category >>> ", category);
      console.log("board_num >>> ", board_num);
      let sql = `select * from board where category_num = "${category}" and board_num = ${board_num}`;
      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectBoard 함수 에러", error);
      reject("SelectBoard() 에러");
    }
  });
};

module.exports = {
  SelectAll,
  SelectBoard,
  SelectCategory,
};
