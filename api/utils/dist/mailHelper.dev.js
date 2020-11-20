"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nodemailer = require('nodemailer');

var config = require('./config');

var fs = require('fs');

var transporter = nodemailer.createTransport({
  service: config.email.service,
  auth: {
    user: config.email.sender_mail,
    pass: config.email.sender_password
  }
});

var Mailer =
/*#__PURE__*/
function () {
  function Mailer() {
    _classCallCheck(this, Mailer);
  }

  _createClass(Mailer, [{
    key: "sendActivateCategoryMail",
    value: function sendActivateCategoryMail(user, category) {
      return regeneratorRuntime.async(function sendActivateCategoryMail$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(fs.readFile(__dirname + '/templates/activate_category_mail.html', 'utf8', function (err, file) {
                if (err) {
                  console.log('\nERROR -> read activate_category_mail.html file !\n', err);
                  throw err;
                } else {
                  var subject = "VdSta",
                      message;
                  message = file;
                  message = message.replace("@@IMAGE_LOGO@@", config.vdsta_logo);
                  message = message.replace("@@USER_NAME@@", user.name);
                  message = message.replace("@@LINK@@", "http://3.8.221.31/staging/website/");
                  var mailOptions = {
                    from: config.email.sender_mail,
                    to: user.email,
                    subject: subject,
                    html: message
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                      throw error;
                    } else {
                      console.log('Email sent: ' + JSON.stringify(info));
                    }
                  });
                }
              }));

            case 3:
              _context.next = 8;
              break;

            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 5]]);
    }
  }, {
    key: "sendEmailVerificationMail",
    value: function sendEmailVerificationMail(user, token) {
      return regeneratorRuntime.async(function sendEmailVerificationMail$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              // console.log(`http://localhost:3000/steps?auth_token=${token.auth_token}&refreshken=${token.refresh_token}`)
              console.log("http://3.8.221.31/staging/website/steps?auth_token=".concat(token.auth_token, "&refreshken=").concat(token.refresh_token));
              _context2.next = 4;
              return regeneratorRuntime.awrap(fs.readFile(__dirname + '/templates/verification_mail.html', 'utf8', function (err, file) {
                if (err) {
                  console.log('\nERROR -> read verification_mail.html file !\n', err);
                  throw err;
                } else {
                  var subject = "VdSta",
                      message;
                  message = file;
                  message = message.replace("@@IMAGE_LOGO@@", config.vdsta_logo); // message = message.replace("@@LINK@@", `http://localhost:3000/steps?auth_token=${token.auth_token}&refreshken=${token.refresh_token}`);

                  message = message.replace("@@LINK@@", "http://3.8.221.31/staging/website/steps?auth_token=".concat(token.auth_token, "&refreshken=").concat(token.refresh_token)); // message = message.replace("@@USER_NAME@@", user.name);

                  var mailOptions = {
                    from: config.email.sender_mail,
                    to: user.email,
                    subject: subject,
                    html: message
                  };
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                      throw error;
                    } else {
                      console.log('Email sent: ' + JSON.stringify(info));
                    }
                  });
                }
              }));

            case 4:
              _context2.next = 9;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 6]]);
    }
  }]);

  return Mailer;
}();

module.exports = new Mailer();