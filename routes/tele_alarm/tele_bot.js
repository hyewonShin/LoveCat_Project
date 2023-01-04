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
      time_stamp: getTime(),
    });
  }
});

const SendMessage = (result) => {
  return new Promise(async (resolve, reject) => {
    console.log("SendMessage함수 진입 >> ");
    console.log("result >> ", result);

    let id = result.id;
    let user_num = result.user_num;
    let recent_title = result.title;
    let days = result.days;
    console.log("result.data >>> ", id, user_num, recent_title, days);

    // chat_id 찾기
    let ChatIddata = await Alarm_log.find({ user_num });
    console.log("ChatIddata", ChatIddata);

    if (ChatIddata.length) {
      let chat_id = ChatIddata[0].chat_id;
      console.log("chat_id", chat_id);

      // 날짜 추출하여 가공
      let week = ["0", "1", "2", "3", "4", "5", "6"];
      let dayOfWeek = week[new Date(days).getDay()];
      console.log("dayOfWeek", dayOfWeek);

      let start = new Date(days);
      console.log("START", start);

      let hour = start.getHours();
      let minute = start.getMinutes();
      console.log("hour / minute >>> ", hour, minute);

      schedule.scheduleJob(id, { hour, minute, dayOfWeek }, () => {
        console.log("bot.sendMessage 알림보내기 확인");
        console.log("schedule.scheduleJob", schedule.scheduledJobs);
        bot.sendMessage(chat_id, (text = recent_title));
      });
    }
    resolve();
  });
};

const CancelSchedule = (id) => {
  return new Promise(async (resolve, reject) => {
    console.log("CancelSchedule함수 진입 >>", id);
    schedule.cancelJob(id);
    resolve();
  });
};

module.exports = { SendMessage, CancelSchedule };
