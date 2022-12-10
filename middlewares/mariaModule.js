const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.MariaDB_HOST,
  port: process.env.MariaDB_PORT,
  user: process.env.MariaDB_USER,
  password: process.env.MariaDB_PASS,
  database: process.env.MariaDB_DATABASE,
  dateStrings: "date",
  multipleStatements: true,
  connectionLimit: 100,
});

const MariaQuery = (sql, insert_data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await pool.getConnection((error, connection) => {
        connection.query(sql, insert_data, (error, rows) => {
          if (error) {
            console.log(`MariaQuery SQL Error`);
            console.log(`message: ${error.message}`);
            console.log(`sql: ${error.sql}`);
            console.log(`code: ${error.code}`);
            reject(error);
          } else {
            console.log("mysql연결확인!");
            resolve(rows);
          }
        });
        connection.release(); // Connection Pool 반환
      });
    } catch (error) {
      console.log(`MariaQuery Error >> ${error}`);
      reject(error);
    }
  });
};

module.exports = MariaQuery;
