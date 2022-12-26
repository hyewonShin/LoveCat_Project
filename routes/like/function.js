const MariaQuery = require("../../middlewares/mariaModule");

// 좋아요 총합
const Like = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("LikeSum() 진입 >>> ", result);
      let nickname = result[0];
      const { board_num } = result[1];

      let sql = `SELECT * FROM like_user 
                  WHERE nickname = "${nickname}"
                 AND board_num = ${board_num}`;
      let row = await MariaQuery(sql);

      if (row.length === 0) {
        console.log("처음으로 좋아요 했을 때 +1");
        let sql = `UPDATE board SET
                    like_sum = like_sum+1
                   WHERE board_num = ${board_num}`;
        await MariaQuery(sql);
        InsertLikeUser({ nickname, board_num });
        resolve();
      } else {
        console.log("이미 좋아요 했을 때 -1");
        let sql = `UPDATE board SET
                    like_sum = like_sum-1
                   WHERE board_num = ${board_num}`;
        await MariaQuery(sql);
        DeleteLikeUser({ nickname, board_num });
        resolve();
      }
    } catch (error) {
      console.log("LikeSum 함수 에러", error);
      reject("LikeSum() 에러");
    }
  });
};

// 좋아요한 회원과 해당 게시글 매칭 삭제
const DeleteLikeUser = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("DeleteLikeUser() 진입 >>> ");
      let nickname = result.nickname;
      let board_num = result.board_num;
      let data = [nickname, board_num];

      let sql = `DELETE FROM like_user 
                  WHERE nickname = ? 
                 AND board_num = ?`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("DeleteLikeUser 함수 에러", error);
      reject("DeleteLikeUser() 에러");
    }
  });
};

// 좋아요한 회원과 해당 게시글 매칭
const InsertLikeUser = (result) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("LikeUser() 진입 >>> ");
      let nickname = result.nickname;
      let board_num = result.board_num;
      let data = [nickname, board_num];

      let sql = `INSERT INTO like_user 
                  (nickname, board_num)
                 VALUES 
                  (?, ?)`;

      await MariaQuery(sql, data);
      resolve();
    } catch (error) {
      console.log("LikeUser 함수 에러", error);
      reject("LikeUser() 에러");
    }
  });
};

// 내가 좋아요한 게시글 조회
const SelectMyLike = (nickname) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectMyLike() 진입 >>>");
      let sql = `SELECT * FROM like_user WHERE nickname = "${nickname}"`;

      let rows = await MariaQuery(sql);
      resolve(rows);
    } catch (error) {
      console.log("SelectMyLike 함수 에러", error);
      reject("SelectMyLike() 에러");
    }
  });
};

module.exports = {
  Like,
  SelectMyLike,
};
