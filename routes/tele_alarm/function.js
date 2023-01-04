const { Alarm_log } = require("../../schemas/Alarm");
const { getTime } = require("../../functions/unixTime");
const { SendMessage, CancelSchedule } = require("./tele_bot");

const CreateAlarm = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("CreateAlarm 진입");
      const { id, user_num, title, days } = body;

      let duplicationDays = await Alarm_log.find({ user_num, days });

      if (duplicationDays.length !== 0) {
        console.log("알림데이터가 중복일때~~");
        throw new Error();
      } else {
        console.log("알림데이터가 중복이 아닐떄");
        Alarm_log.insertMany({
          id,
          user_num,
          title,
          days,
          markAsRead: false,
          time_stamp: getTime(),
        });
        SendMessage(body);
        let recent_Alarm = await SelectAlarm(user_num);
        resolve(recent_Alarm);
      }
    } catch (error) {
      reject({
        message: "동일한 시간에 알람을 중복으로 등록할 수 없습니다.",
      });
    }
  });
};

const SelectAlarm = (user_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectAlarm 진입");
      let recent_Alarm = await Alarm_log.find({
        user_num,
        markAsRead: false,
      })
        .sort({ days: -1 })
        .limit(10);
      resolve(recent_Alarm);
    } catch (error) {
      reject("SelectAlarm 함수 에러", error);
    }
  });
};

const SelectAllAlarm = (user_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("SelectAllAlarm 진입");

      let recent_Alarm = await Alarm_log.find({ user_num }).sort({ days: -1 });
      resolve(recent_Alarm);
    } catch (error) {
      reject("SelectAlarm 함수 에러", error);
    }
  });
};

const UpdateAlarm = (body) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("UpdateAlarm 진입");
      const { id, user_num, title, days } = body;
      await Alarm_log.updateOne(
        {
          id,
        },
        {
          $set: {
            title,
            days,
            modify_time_stamp: getTime(),
          },
        }
      );
      let recent_Alarm = await SelectAlarm(user_num);
      resolve(recent_Alarm);
    } catch (error) {
      reject("UpdateAlarm 함수 에러", error);
    }
  });
};

const DeleteAlarm = (id, user_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("DeleteAlarm 진입");
      await Alarm_log.deleteOne({ id });
      let recent_Alarm = await SelectAlarm(user_num);
      CancelSchedule(id);
      resolve(recent_Alarm);
    } catch (error) {
      reject("DeleteAlarm 함수 에러", error);
    }
  });
};

const MarkAsReadFlag = (id, user_num) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("MarkAsReadFlag 진입");
      await Alarm_log.updateOne(
        {
          id,
        },
        {
          $set: {
            markAsRead: true,
          },
        }
      );
      let recent_Alarm = await SelectAlarm(user_num);
      CancelSchedule(id);
      resolve(recent_Alarm);
    } catch (error) {
      reject("MarkAsReadFlag 함수 에러", error);
    }
  });
};

module.exports = {
  CreateAlarm,
  SelectAlarm,
  SelectAllAlarm,
  UpdateAlarm,
  DeleteAlarm,
  MarkAsReadFlag,
};
