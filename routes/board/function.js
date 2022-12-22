const MariaQuery = require("../../middlewares/mariaModule");

// 전체글 조회
const SelectAll = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectAll() 진입 >>> ");

      let sql = `SELECT * FROM board 
                  WHERE delete_flag = 0`;

      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectAll 함수 에러", error);
      reject("SelectAll() 에러");
    }
  });
};

// 특정 카테고리 글 조회
const SelectCategory = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectCategory() 진입 >>> ");
      let data = [category];

      let sql = `SELECT * FROM board 
                  WHERE category = ? 
                 AND delete_flag = 0`;

      let rows = await MariaQuery(sql, data);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectCategory 함수 에러", error);
      reject("SelectCategory() 에러");
    }
  });
};

// 특정 카테고리 글 상세조회
const SelectBoard = (category, board_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectBoard() 진입 >>> ");
      let data = [category, board_num];

      let sql = `SELECT * FROM board 
                  WHERE category = ? 
                 AND board_num = ? 
                 AND delete_flag = 0`;

      let rows = await MariaQuery(sql, data);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectBoard 함수 에러", error);
      reject("SelectBoard() 에러");
    }
  });
};

// 게시글 작성
const InsertBoard = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("InsertBoard() 진입 >>> ", body);
      const { title, content, category, writer } = body;
      let data = [title, content, category, writer];

      let sql = `INSET INTO board 
                  (title, content, category, writer) 
                 VALUES (?,?,?,?)`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("InsertBoard 함수 에러", error);
      reject("InsertBoard() 에러");
    }
  });
};

// 게시글 수정
const UpdateBoard = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("UpdateBoard() 진입 >>> ");
      const { title, content, category, board_num } = body;
      let data = [title, content, category, board_num];

      let sql = `UPDATE board 
                  SET title = ?, 
                  content = ?, 
                  category = ? 
                 WHERE board_num = ?`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("SelectBoard 함수 에러", error);
      reject("SelectBoard() 에러");
    }
  });
};

// 게시글 삭제
const DeleteBoard = (board_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("DeleteBoard() 진입 >>> ");
      data = [board_num];

      let sql = `UPDATE board 
                  SET delete_flag = 1 
                 WHERE board_num = ?`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("DeleteBoard 함수 에러", error);
      reject("DeleteBoard() 에러");
    }
  });
};

module.exports = {
  SelectAll,
  SelectCategory,
  SelectBoard,
  InsertBoard,
  UpdateBoard,
  DeleteBoard,
};
