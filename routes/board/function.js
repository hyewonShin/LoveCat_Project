const MariaQuery = require("../../middlewares/mariaModule");

// 전체글 조회
const SelectAll = (page, page_size) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectAll() 진입 >>> ", page, page_size);
      let offset = (parseInt(page) - 1) * page_size;

      let sql = `SELECT * FROM board 
                  WHERE delete_flag = 0 
                ORDER BY create_date ASC 
                 limit ${offset}, ${page_size}`;

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
const SelectCategory = (category, page, page_size) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectCategory() 진입 >>> ");
      let offset = (parseInt(page) - 1) * page_size;

      let sql = `SELECT * FROM board 
                  WHERE category = ${category} 
                 AND delete_flag = 0 
                  ORDER BY create_date ASC 
                 limit ${offset}, ${page_size}`;

      let rows = await MariaQuery(sql);
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

// 게시글 조회수 카운트
const ViewCount = (board_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("ViewCount() 진입 >>> ");

      let sql = `UPDATE board SET 
                  view_cnt = view_cnt+1 
                 WHERE board_num = ${board_num}`;

      let rows = await MariaQuery(sql, data);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("ViewCount 함수 에러", error);
      reject("ViewCount() 에러");
    }
  });
};

// 게시글 작성
const InsertBoard = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("InsertBoard() 진입 >>> ", result);
      let nickname = result[0];
      const { title, content, category } = result[1];
      let data = [title, content, category, nickname];

      let sql = `INSERT INTO board
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
                  category = ?,
                  modify_date = sysdate()
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

// 비밀글 플래그
const SecretBoard = (board_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SecretBoard() 진입 >>> ");
      data = [board_num];

      let sql = `UPDATE board 
                  SET secret_flag = 1 
                 WHERE board_num = ?`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("SecretBoard 함수 에러", error);
      reject("SecretBoard() 에러");
    }
  });
};

// 공지 플래그
const NoticeBoard = (board_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("NoticeBoard() 진입 >>> ");
      data = [board_num];

      let sql = `UPDATE board 
                  SET notice_flag = 1 
                 WHERE board_num = ?`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("NoticeBoard 함수 에러", error);
      reject("NoticeBoard() 에러");
    }
  });
};

// 게시판 검색기능
const SearchBoard = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SearchBoard() 진입 >>> ", result);
      const { data } = result;
      let trimdata = data.trim();

      let sql = `SELECT * FROM board
                  WHERE
                 content LIKE '%${trimdata}%'
                  OR
                 title LIKE '%${trimdata}%'`;

      let rows = await MariaQuery(sql);
      console.log("row >>", rows);
      resolve(rows);
    } catch (error) {
      console.log("SearchBoard 함수 에러", error);
      reject("SearchBoard() 에러");
    }
  });
};

module.exports = {
  SelectAll,
  SelectCategory,
  SelectBoard,
  ViewCount,
  InsertBoard,
  UpdateBoard,
  DeleteBoard,
  SecretBoard,
  NoticeBoard,
  SearchBoard,
};
