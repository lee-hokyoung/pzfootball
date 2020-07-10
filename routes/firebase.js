const express = require("express");
const router = express.Router();
const firebase = require("firebase/app");
const User = require("../model/user");

// firebase 핸들러
router.get("/", async (req, res) => {
	var mode = req.query.mode;
	var auth = firebase.auth();
	var actionCode = req.query.oobCode;
	switch (mode) {
		case "resetPassword":
			auth
				.checkActionCode(actionCode)
				.then(() => res.render("resetPassword", { query: req.query }))
				.catch(() =>
					res.send(
						`<script>alert('유효기간이 만료된 페이지 입니다.'); location.href = '/';</script>`
					)
				);
			break;
		case "recoverEmail":
			res.render("recoverEmail");
			break;
		case "verifyEmail":
			auth
				.checkActionCode(actionCode)
				.then((chk) => {
					console.log("chk : ", chk);
					auth
						.verifyPasswordResetCode(actionCode)
						.then((user_id) => {
							console.log("user id : ", user_id);
							User.updateOne({ user_id: user_id }, { $set: { certified: true } }).then(
								(certify) => {
									if (certify.ok === 1) {
										res.send("인증완료");
									} else {
										res.send("인증실패");
									}
								}
							);
						})
						.catch(() => {
							res.send(
								`<script>alert('유효기간이 만료된 페이지 입니다.'); location.href = '/';</script>`
							);
						});
				})
				.catch(() => {
					res.send(
						`<script>alert('유효기간이 만료된 페이지 입니다.'); location.href = '/';</script>`
					);
				});
			break;
		default:
			res.send("잘못된 접근입니다.");
			break;
	}
});
router.post("/", async (req, res) => {
	var mode = req.query.mode;
	var auth = firebase.auth();
	var actionCode = req.body.oobCode;
	var continueUrl = req.body.continueUrl;
	var user_pw = req.body.user_pw;

	switch (mode) {
		case "resetPassword":
			try {
				// oobCode를 통해 firebase에 등록된 email 정보를 가져온다.
				let user_id = await auth.verifyPasswordResetCode(actionCode);
				// firebase 의 비밀번호를 변경한다
				auth.confirmPasswordReset(actionCode, user_pw).then(async () => {
					// 기존 DB에 새로운 비밀번호를 변경해준다.
					let resetPW = await User.updateOne({ user_id: user_id }, { $set: { user_pw: user_pw } });
					res.json({ code: 1, result: resetPW });
				});
			} catch (error) {
				res.json(error);
			}
			break;
		case "recoverEmail":
			handleRecoverEmail(auth, actionCode, lang);
			break;
		case "verifyEmail":
			handleVerifyEmail(auth, actionCode, continueUrl, lang);
			break;
		default:
			res.json({ code: 0, message: "잘못된 접근입니다." });
			break;
	}
});
module.exports = router;
