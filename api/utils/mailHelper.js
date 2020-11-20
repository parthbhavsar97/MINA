const nodemailer = require('nodemailer');
const config = require('./config')
const fs = require('fs');

var transporter = nodemailer.createTransport({
  service: config.email.service,
  // host: 'mail.vdsta.com',
  // port: 587,
  secure: true,
  // requireTLS: true,
  // secureConnection: false,
  // tls: { ciphers: 'SSLv3' },
  // tls: { rejectUnauthorized: false },
  // debug: true,
  auth: {
    user: config.email.sender_mail,
    pass: config.email.sender_password
  }
})

class Mailer {

  async convertToStandardName(name) {  // This function will convert the name like: parth -> Parth
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  async sendEmailVerificationMail(user, token) {
    try {

      await fs.readFile(__dirname + '/templates/verification_mail.html', 'utf8', async function (err, file) {
        if (err) {
          console.log('\nERROR -> read verification_mail.html file !\n', err);
          throw err
        } else {
          let subject = `VdSta - verify your email`,
            message
          message = file;
          message = message.replace("@@IMAGE_LOGO@@", config.vdsta_logo);
          message = message.replace('@@USER_FIRSTNAME@@', `${user.name.charAt(0).toUpperCase() + user.name.slice(1)}`);
          message = message.replace("@@LINK2@@", `https://app.vdsta.com/steps?auth_token=${token.auth_token}&refreshken=${token.refresh_token}`);
          let mailOptions = {
            from: config.email.sender_mail,
            to: user.email,
            subject: subject,
            html: message
          };
          transporter.sendMail(mailOptions, function (error, info) {
            console.log("IN THE TRANSPORTER")
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + JSON.stringify(info));
            }
          });
        }
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async forgotPasswordAdmin(admin, token) {
    try {
      await fs.readFile(__dirname + '/templates/forgotPasswordAdmin.html', 'utf8', function (err, file) {
        if (err) {
          console.log('\nERROR -> read forgotPasswordAdmin.html file !\n', err);
          throw err
        } else {
          let subject = `MINA Chatbot - Reset Password`,
            message
          message = file;
          message = message.replace("@@IMAGE_LOGO@@", config.therapy_logo);
          message = message.replace("@@USER_NAME@@", 'Admin');
          message = message.replace("@@LINK@@", config.links.forgot_password_admin + `?auth_token=${token.auth_token}`);
          let mailOptions = {
            from: config.email.sender_mail,
            to: admin.email,
            subject: subject,
            html: message
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              throw error
            } else {
              console.log('Email sent: ' + JSON.stringify(info));
            }
          });
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async forgotPasswordUser(user, token) {
    try {
      await fs.readFile(__dirname + '/templates/forgotPasswordUser.html', 'utf8', function (err, file) {
        if (err) {
          console.log('\nERROR -> read forgotPasswordUser.html file !\n', err);
          throw err
        } else {
          let subject = `MINA Chatbot - Reset Password`,
            message
          message = file;
          message = message.replace("@@IMAGE_LOGO@@", config.therapy_logo);
          message = message.replace("@@USER_NAME@@", 'customer');
          message = message.replace("@@LINK@@", config.links.forgot_password_user + `${token.auth_token}`);
          let mailOptions = {
            from: config.email.sender_mail,
            to: user.email,
            subject: subject,
            html: message
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
              throw error
            } else {
              console.log('Email sent: ' + JSON.stringify(info));
            }
          });
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

}


module.exports = new Mailer()

