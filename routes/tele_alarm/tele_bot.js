const { Alarm_log, UserInfo_log } = require("../../schemas/Alarm");
const MariaQuery = require("../../middlewares/mariaModule");
const { getTime } = require("../../functions/unixTime");
require("dotenv").config();

// npm 모듈 호출
const TelegramBot = require("node-telegram-bot-api");
const schedule = require("node-schedule");
const { reject, conformsTo } = require("lodash");
const token = process.env.TELE_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// 텔레그램으로부터 '/hello 이름' 메세지 받아서 매칭
bot.onText(/\/hello (.+)/, async (msg, req) => {
  console.log("텔레에서 메세지 받음");
  console.log("msg", msg, "text", msg.text);

  let chat_id = msg.chat.id;
  console.log("chat_id", chat_id);

  let text = msg.text;
  let nickname = text.replace("/hello ", "").trim();
  console.log("nickname", nickname);

  let sql = `SELECT user_num FROM user WHERE nickname = "${nickname}"`;
  console.log("sql >>", sql);
  let row = await MariaQuery(sql);
  console.log("row", row.length);

  if (row.length === 1) {
    user_num = row[0].user_num;
    console.log("user_num", user_num);

    UserInfo_log.insertMany({
      chat_id,
      user_num,
      timestamps: getTime(),
    });
  }
});
