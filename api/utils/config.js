module.exports = (function () {
  process.env.NODE_ENV = "development"
  // process.env.NODE_ENV = "production"
  // process.env.NODE_ENV = "staging"

  let data = {
    JWTSecretKey: "L9T#Slsj!poqS1#o08MnbA#$iBU*VY5EUe^&xY",
    default_auth_token: "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#TherapyChatbot",
    refresh_token: "TherapyChatbotjmLVF6G9Aarypa9y5AhG3JpwQXanNRWBgaaTfU3d",
    androidAppVerision: "1.0.0",
    iosAppVerision: "1.0.0",
    therapy_logo: 'https://mina-chatbot.s3-us-west-1.amazonaws.com/logo/Mina_Chatbot_Logo.png',
    isSSL: false,

    s3: {
      bucketName: 'vdsta',
      accessKey: 'AKIAJZVJAP52JD55GZFA',
      secretKey: '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',
      uploadURL: "https://vdsta.s3.eu-west-2.amazonaws.com",
      folderName: 'logo'
    },

  }

  if (process.env.NODE_ENV === "production") {
    data.host = "localhost"
    data.port = 5050

    data.db = {
      host: "tristatepostgresql.chkbypvvasb2.us-west-1.rds.amazonaws.com",
      user: "postgres",
      password: "postgresDB2020",
      database: "therapy_db_dev"
    }

    data.email = {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }

    data.links = {
      forgot_password_admin: "localhost:5000/admin-panel/forgot-password",
      forgot_password_user: "localhost:5000/api/v1/resetPassword/"
    }

  }

  else if (process.env.NODE_ENV === "staging") {
    // data.isSSL = true
    data.host = "localhost"
    data.port = 5050

    data.db = {
      host: "tristatepostgresql.chkbypvvasb2.us-west-1.rds.amazonaws.com",
      user: "postgres",
      password: "postgresDB2020",
      database: "therapy_db_dev"
    }

    data.email = {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }

    data.links = {
      forgot_password_admin: "localhost:5000/admin-panel/forgot-password",
      forgot_password_user: "localhost:5000/api/v1/resetPassword/"
    }

  } else {
    data.isSSL = false
    // data.host = "localhost" 
    data.host = "54.219.172.96" 
    data.port = 5000

    // data.db = {
    //   host: "localhost",
    //   user: "postgres",
    //   password: "tristate123",
    //   database: "therapy_db_dev"
    // }

    data.db = {
      host: "tristatepostgresql.chkbypvvasb2.us-west-1.rds.amazonaws.com",
      user: "postgres",
      password: "postgresDB2020",
      database: "therapy_db_dev"
    }

    data.email = {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }

    // data.links = {
    //   forgot_password_admin: "localhost:3000/admin-panel/forgot-password",
    //   forgot_password_user: "localhost:5000/api/v1/resetPassword/"
    // }

    data.links = {
      forgot_password_admin: "http://54.219.172.96:5000/admin-panel/forgot-password",
      forgot_password_user: "http://54.219.172.96:5000/api/v1/resetPassword/",
      reset_password_api: "http://54.219.172.96:5000/api/v1/resetPasswordUser/"
    }

  }
  return data;
})();
