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
    therapy_logo: 'logo_path',
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
    data.host = "app.vdsta.com"
    data.port = 5050
    data.adminPanelLink = 'http://3.8.221.31/vdsta_app/admin-panel/'

    data.db = {
      host: "vdstadb.ctpaahkf9zho.eu-west-2.rds.amazonaws.com",
      user: "vdsta_adminuser",
      password: "remotestar123",
      database: "vdsta_db"
    }

    data.email = {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }

    data.links = {
      forgot_password_admin: "localhost:3000/admin-panel/forgot-password",
      forgot_password_user: "localhost:3000/admin-panel/forgot-password"
    }

  }

  else if (process.env.NODE_ENV === "staging") {
    // data.isSSL = true
    // data.host = "app.vdsta.com" 
    data.host = "localhost"
    // data.port = 8443
    data.port = 5050
    data.adminPanelLink = 'http://3.8.221.31/staging/admin-panel/'

    data.db = {
      host: "vdstadb.ctpaahkf9zho.eu-west-2.rds.amazonaws.com",
      user: "vdsta_adminuser",
      password: "remotestar123",
      database: "vdsta_db_staging"
    }

    data.stripe = {
      secret_key: "sk_test_51H9njwLbfMCQUgd30242WIwVIphiGlIXLr0OHOaI10kjpOqtsRcz8DWapneE5dljKWorXoPMc0lxRKw6KP2oPaD900YL33n1pQ",
      publishable_key: "pk_test_51H9njwLbfMCQUgd34yZV6p0InFkChVnNZDpn1D8A7GrLhFqW6NTiNuPXyYuAgYjS5XRS0WFzzYciSahnXEroOZml00QyUYDaLy"
    }

    data.email = {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }

    data.links = {
      forgot_password_admin: "localhost:3000/admin-panel/forgot-password",
      forgot_password_user: "localhost:3000/admin-panel/forgot-password"
    }

  } else {
    data.isSSL = false
    data.host = "localhost" 
    // data.host = "app.vdsta.com"
    data.port = 5000
    // data.port = 2096
    // data.adminPanelLink = 'http://3.8.221.31/vdsta_app/admin-panel/'
    data.adminPanelLink = 'http://3.8.221.31/vdsta_app/admin-panel/'

    data.db = {
      host: "localhost",
      user: "postgres",
      password: "tristate123",
      database: "therapy_db_dev"
    }

    data.email = {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }

    data.links = {
      forgot_password_admin: "localhost:3000/admin-panel/forgot-password",
      forgot_password_user: "localhost:3000/admin-panel/forgot-password"
    }

  }
  return data;
})();
