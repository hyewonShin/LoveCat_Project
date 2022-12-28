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

module.exports = {
  SelectComment,
};
