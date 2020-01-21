const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Ho.IT.soft@gmail.com", // gmail 계정 아이디를 입력
    pass: "alsdud1218!" // gmail 계정의 비밀번호를 입력
  }
});

let mailOptions = {
  from: "Ho.IT.soft@gmail.com", // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
  to: "manttang94@naver.com", // 수신 메일 주소
  subject: "사랑해", // 제목
  text: "테스트로 보내는 메일" // 내용
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
