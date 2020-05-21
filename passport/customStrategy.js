const customStrategy = require("passport-custom").Strategy;
const Manager = require("../model/manager");

module.exports = passport => {
  passport.use("manager", function(req, done) {
    Manager.findOne(
      {
        manager_id: req.body.manager_id,
        manager_pw: req.body.manager_pw
      },
      function(err, manager) {
        done(err, manager);
      }
    );
  });
};
