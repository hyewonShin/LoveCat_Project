const mongoose = require("mongoose");
const { Schema } = mongoose;

const Alarm = new Schema(
  {
    id: {
      type: String,
    },
    user_num: {
      type: String,
    },
    nickname: {
      type: String,
    },
    chat_id: {
      type: String,
    },
    title: {
      type: String,
    },
    days: {
      type: String,
    },
    markAsRead: {
      type: String,
    },
    time_stamp: {
      type: String,
    },
  },
  {
    versionKey: false,
    _id: true,
    timestamps: true,
  }
);

const UserInfo = new Schema(
  {
    user_num: {
      type: String,
    },
    nickname: {
      type: String,
    },
    chat_id: {
      type: String,
    },
    time_stamp: {
      type: String,
    },
  },
  {
    versionKey: false,
    _id: true,
    timestamps: true,
  }
);

const Alarm_log = mongoose.model("Alarm", Alarm, "Alarm_log");
const UserInfo_log = mongoose.model("UserInfo", UserInfo, "UserInfo_log");

module.exports = { Alarm_log, UserInfo_log };
