// 몽고디비 연결
const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      },
      error => {
        if (error) console.log("몽고디비 연결 에러", error);
        else console.log("몽고디비 연결 성공");
      }
    );
  };
  connect();
  mongoose.connection.on("error", error => {
    console.error("몽고디비 연결에러", error);
  });
  mongoose.connection.on("disconnected", () => {
    console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도 합니다.");
    connect();
  });
};
