var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
require("dotenv").config();

var indexRouter = require("./routes/index");
var UserRouter = require("./routes/user/index");
var BoarderRouter = require("./routes/board/index");
var LikeRouter = require("./routes/like/index");
var BlackListRouter = require("./routes/blacklist/index");
var CommentRouter = require("./routes/comment/index");
var TeleAlarmRouter = require("./routes/tele_alarm/index");

var app = express();
const cors = require("cors");
// const { default: helmet } = require("helmet");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors({ exposedHeaders: ["Authorization"] }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(
//   helmet({
//     hsts: false,
//   })
// );

app.use("/", indexRouter);
app.use("/user", UserRouter);
app.use("/board", BoarderRouter);
app.use("/like", LikeRouter);
app.use("/blacklist", BlackListRouter);
app.use("/comment", CommentRouter);
app.use("/tele_alarm", TeleAlarmRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const MongoCon = require("./middlewares/mongoose");
MongoCon();

module.exports = app;
