const express = require("express");
const router = express.Router();
const User = require("../model/user");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const firebase = require("firebase/app");
const fbAdmin = require("firebase-admin");

// 현재 사용자 정보 읽기
router.get("/current", async (req, res) => {
	let user = firebase.auth().currentUser;
	res.json(user);
});
//
router.get("/certify", async (req, res) => {
	// 이메일 인증
	if (req.query.mode === "verifyEmail") {
		try {
			let user = firebase.auth().currentUser;
			if (user) {
				let result = await User.updateOne({ user_id: user.email }, { $set: { certified: true } });
				if (result.ok === 1) {
					res.send("성공적으로 인증되었습니다.");
				} else {
					res.send("인증에 실패 했습니다. 관리자에게 문의해주세요");
				}
			} else {
				res.send("잘못된 접근입니다.");
			}
		} catch (err) {
			res.json(err);
		}
	}
	// 비밀번호 재설정
	if (req.query.mode === "resetPassword" && req.query.apiKey === process.env.FIREBASE_API_KEY) {
		res.render("resetPassword", { query: req.query });
	}
});
// 메일 인증(firebase 인증 로직)
router.post("/certify", async (req, res) => {
	try {
		firebase
			.auth()
			.currentUser.sendEmailVerification()
			.then(function (result) {
				res.json({ code: 1, result: result });
			})
			.catch(function (error) {
				res.json({ code: 2, message: error.message });
			});
	} catch (error) {
		res.json({ code: 0, message: error.message });
	}
});
//  아이디 찾기
router.post("/findId", async (req, res) => {
	try {
		let user = await User.findOne(
			{
				user_name: req.body.user_name,
				user_phone: req.body.user_phone,
				phone1: req.body.phone1,
				phone2: req.body.phone2,
				provider: { $exists: false }, //  sns로 가입한 경우는 제외
			},
			{ user_id: 1 }
		);
		if (user) {
			res.json({ code: 1, result: user });
		} else {
			res.json({ code: 0, message: "입력하신 내용에 맞는 결과가 없습니다." });
		}
	} catch (err) {
		res.json({ code: 0, message: err.message });
	}
});
//  비밀번호 찾기(재설정)
router.post("/resetPw", async (req, res) => {
	try {
		let findUser = await User.findOne(req.body);
		if (findUser) {
			firebase
				.auth()
				.sendPasswordResetEmail(findUser.user_id)
				.then(() => {
					res.json({
						code: 1,
						message: "퍼즐풋볼에 등록된 메일로 비밀번호 재설정 메일을 발송했습니다. ",
					});
				})
				.catch((err) => res.json({ code: err.code, message: err.message }));
		} else {
			res.json({ code: 0, message: "사용자 정보가 없습니다. 다시 확인해 주세요" });
		}
		// let referer = req.headers.referer;
		// let user_id = req.body.email;
		// let newPw = Math.random().toString(16).substr(2);
		// let result = await User.updateOne({ user_id: user_id }, { $set: { user_pw: newPw } });
		// if (result.n === 1) {
		// 	let transporter = nodemailer.createTransport({
		// 		service: "gmail",
		// 		host: "smtp.gmail.email",
		// 		port: 587,
		// 		secure: false, // true for 465, false for other ports
		// 		auth: {
		// 			user: process.env.NODEMAILFROM,
		// 			pass: process.env.NODEMAILPW,
		// 		},
		// 	});
		// 	let mailOptions = {
		// 		from: process.env.NODEMAILFROM,
		// 		to: user_id,
		// 		subject: "퍼즐풋볼 아이디 확인 메일입니다.",
		// 		text: "테스트",
		// 		html: `
		//     <div style="width: 960px;">
		//       <div
		//         style="
		//           margin: 4rem auto;
		//           width: 400px;
		//           border-radius: 30px;
		//           border: 1px solid;
		//           padding: 1.5rem 2rem;
		//           background-color: whitesmoke;
		//         "
		//       >
		//         <div style="padding-bottom: 1rem;">
		//           <b style="font-size: 30px;">PZ</b>
		//           <span style="font-size: 25px; font-weight: bold; padding-left: 5px;">SPORTS</span>
		//         </div>
		//         <div style="border: 1px solid; background: white; padding: 0.5rem 1rem;">
		//           <div style="font-size: 13px;">
		//             <p>안녕하세요 지유성님!</p>
		//             <p>회원님의 임시비밀번호는 <b>${newPw}</b> 입니다</p>
		//             <p>로그인 후 비밀번호 재설정을 권장해드리며</p>
		//             <p>아래 버튼을 클릭하여 로그인 후 재설정 부탁드립니다.</p>
		//           </div>
		//         </div>
		//         <div style="margin-top: 1.5rem;">
		//           <a
		//             href="${referer}"
		//             target="_blank"
		//             style="
		//               padding: 0.75rem 0;
		//               display: block;
		//               text-align: center;
		//               color: white;
		//               background-color: #662d91;
		//               text-decoration: none;
		//               border-radius: 5px;
		//             "
		//             >비밀번호 재설정하기</a
		//           >
		//         </div>
		//       </div>
		//     </div>`,
		// 	};
		// 	// 메일 발송
		// 	transporter.sendMail(mailOptions, function (error, info) {
		// 		if (error) {
		// 			console.log(error);
		// 			res.json({ code: 0, message: error });
		// 		} else {
		// 			console.log("Email sent: " + info.response);
		// 			res.json({ code: 1, message: `정상적으로 발송했습니다 \n ${info.response}` });
		// 		}
		// 	});
		// } else {
		// 	return res.json({ code: 0, message: "등록되지 않은 이메일(ID)입니다." });
		// }
	} catch (err) {
		res.json({ code: 0, message: err.message });
	}
});
module.exports = router;
