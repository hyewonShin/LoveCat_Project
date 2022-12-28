const MariaQuery = require("../../middlewares/mariaModule");

// 댓글 조회
const SelectComment = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectComment() 진입 >>> ", params);
      let board_num = params.board_num;
      let comment_num = params.comment_num;
      console.log("board_num, comment_num >>", board_num, comment_num);

      //원댓글과 자식댓글들 출력
      let sql = `SELECT * FROM comment
                  WHERE
                 board_num = ${board_num}
                 AND comment_num = ${comment_num}
                  OR board_num = ${board_num}
                 AND p_num = ${comment_num}
                 ORDER BY create_date ASC`;

      let rows = await MariaQuery(sql);
      console.log("rows", rows);
      resolve(rows);
    } catch (error) {
      console.log("SelectComment 함수 에러", error);
      reject("SelectComment() 에러");
    }
  });
};

// 댓글 작성
const InsertComment = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("InsertComment() 진입 >>> ", result);
      let nickname = result[0];
      console.log("nick > ", nickname);
      const { board_num, content, p_num, depth } = result[1];
      console.log("result[1] > ", board_num, content, p_num, depth);
      let data = [nickname, board_num, content, p_num, depth];

      let sql = `INSERT INTO comment 
                  (commenter, board_num, content, p_num, depth)
                 VALUES (?,?,?,?,?)`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("InsertComment 함수 에러", error);
      reject("InsertComment() 에러");
    }
  });
};

// 댓글 수정
const UpdateComment = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("UpdateComment() 진입 >>> ");
      const { content, comment_num } = body;

      let sql = `UPDATE comment 
                  SET
                 content = "${content}"
                  WHERE
                 comment_num = ${comment_num}`;

      await MariaQuery(sql);
      resolve();
    } catch (error) {
      console.log("UpdateComment 함수 에러", error);
      reject("UpdateComment() 에러");
    }
  });
};

// 댓글 삭제
const DeleteComment = (comment_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("DeleteBoard() 진입 >>> ");
      let sql = `DELETE FROM comment WHERE comment_num = ${comment_num}`;

      await MariaQuery(sql);
      resolve();
    } catch (error) {
      console.log("DeleteComment 함수 에러", error);
      reject("DeleteComment() 에러");
    }
  });
};

module.exports = {
  SelectComment,
  InsertComment,
  UpdateComment,
  DeleteComment,
};
