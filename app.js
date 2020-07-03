const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
const passportConfig = require("./passport");
require("dotenv").config();

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const matchRouter = require("./routes/match");
const usersRouter = require("./routes/users");
const clubRouter = require("./routes/clubs");
const adminRouter = require("./routes/admin");
const adminMatchRouter = require("./routes/admin_match");
const adminGroundRouter = require("./routes/admin_ground");
const adminClubRouter = require("./routes/admin_club");
const adminManagerRouter = require("./routes/admin_manager");
const adminConfigRouter = require("./routes/admin_config");
const adminFaqRouter = require("./routes/admin_faq");
const adminCouponRouter = require("./routes/admin_coupon");
const adminLeagueRouter = require("./routes/admin_league");
const managerRouter = require("./routes/manager");
const queryRouter = require("./routes/query");
const mailRouter = require("./routes/mail");
const middle = require("./routes/middle");

const app = express();

passportConfig(passport);

const connect = require("./model");
connect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(logger('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());
app.use(
	"/public_js",
	express.static(path.join(__dirname, "public/javascripts"), {
		maxAge: "",
	})
);
app.use(
	"/public_css",
	express.static(path.join(__dirname, "public/stylesheets"), {
		maxAge: "",
	})
);
app.use("/images", express.static(path.join(__dirname, "public/images"), { maxAge: "30d" }));
app.use("/assets", express.static(path.join(__dirname, "public/assets"), { maxAge: "30d" }));
app.use("/nm", express.static(path.join(__dirname, "node_modules"), { maxAge: "30d" }));
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false, httpOnly: true },
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/match", matchRouter);
app.use("/users", usersRouter);
app.use("/clubs", clubRouter);
app.use("/admin", adminRouter);
app.use("/admin/match", middle.isAdmin, adminMatchRouter);
app.use("/admin/ground", middle.isAdmin, adminGroundRouter);
app.use("/admin/club", middle.isAdmin, adminClubRouter);
app.use("/admin/manager", middle.isAdmin, adminManagerRouter);
app.use("/admin/config", middle.isAdmin, adminConfigRouter);
app.use("/admin/faq", middle.isAdmin, adminFaqRouter);
app.use("/admin/coupon", middle.isAdmin, adminCouponRouter);
app.use("/admin/league", middle.isAdmin, adminLeagueRouter);
app.use("/manager", managerRouter);
app.use("/mail", mailRouter);
app.use("/query", queryRouter);

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

module.exports = app;
