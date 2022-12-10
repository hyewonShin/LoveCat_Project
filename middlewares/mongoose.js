const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  function connect() {
    mongoose.set("strictQuery", true).connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
      },
      (error) => {
        if (error) {
          console.log("mongoDB connection Error!", error);
        } else {
          console.log("mongodb connection success!");
        }
      }
    );
  }
  connect();
};
