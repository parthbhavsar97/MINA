"use strict";

module.exports = function () {
  // process.env.NODE_ENV = "local"
  // process.env.NODE_ENV = "production"
  // process.env.NODE_ENV = "staging"
  var data = {
    JWTSecretKey: "L9T#Slsj!poqS1#o08MnbA#$iBU*VY5EUe^&xY",
    default_auth_token: "@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#VDSTA",
    refresh_token: "VDSTAjmLVF6G9Aarypa9y5AhG3JpwQXanNRWBgaaTfU3d",
    host: "localhost",
    // port: 5050,
    androidAppVerision: "1.0.0",
    iosAppVerision: "1.0.0",
    awsAccesskey: "AKIAJZVJAP52JD55GZFA",
    awsSecretkey: "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",
    s3bucketName: "vdsta",
    s3uploadURL: "https://vdsta.s3.eu-west-2.amazonaws.com",
    paginationCount: 5,
    vdsta_logo: 'https://vdsta.s3.eu-west-2.amazonaws.com/logo/Logo.png',
    notificaionCount: 10,
    timeRegex: /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/,
    dateRegex: /^(19|20|21|22)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/,
    adminPanelLink: 'some_dummy_admin_panel_link',
    isSSL: false,
    //LOCAL 
    // s3: {
    //   bucketName: 'vdsta',
    //   accessKey: 'AKIAJZVJAP52JD55GZFA',
    //   secretKey: 'WRS/65Ln5n67TotYZUdiuqSyBLEQC4N+ywK4XcWo',
    //   uploadURL: "https://vdsta.s3.eu-west-2.amazonaws.com",
    //   folderName: 'local'
    // },
    //Live 
    s3: {
      bucketName: 'vdsta',
      accessKey: 'AKIAJZVJAP52JD55GZFA',
      secretKey: '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',
      uploadURL: "https://vdsta.s3.eu-west-2.amazonaws.com",
      folderName: 'logo'
    },
    // Local
    // frameIO: {
    //   client_id: `3240202f-8521-444c-aa07-880f595ba52d`,
    //   client_secret: `KnyVTL-daNK7`,
    //   access_token: `fio-u-OTvtepGocATJu11wAjybJRw7GR8r4W4HQGCdv7GY85wiC0i5Blp5bKLpGUj2lM_y`,
    //   account_id: '4c3f27cd-20d8-4ed2-8a5e-9120525798c4'
    // },
    // Live
    frameIO: {
      client_id: "3240202f-8521-444c-aa07-880f595ba52d",
      client_secret: "KnyVTL-daNK7",
      access_token: "fio-u-TkzVdqWRZhQ-h5bjyPqXTCSQB989caro5UgcDAKgsGqp4ly3NJkX7mav6xDS5MMp",
      account_id: 'b87a823a-3549-407e-a5c8-a59e2882132e'
    },
    email: {
      sender_mail: 'tristate.mteam@gmail.com',
      sender_password: 'Tristate@1234',
      service: 'Gmail'
    }
  };

  if (process.env.NODE_ENV === "production") {
    data.db = {
      host: "vdstadb.ctpaahkf9zho.eu-west-2.rds.amazonaws.com",
      user: "vdsta_adminuser",
      password: "remotestar123",
      database: "vdsta_db"
    };
    data.port = 5050;
  } else if (process.env.NODE_ENV === "staging") {
    data.db = {
      host: "vdstadb.ctpaahkf9zho.eu-west-2.rds.amazonaws.com",
      user: "vdsta_adminuser",
      password: "remotestar123",
      database: "vdsta_db_staging"
    };
    data.port = 8443;
  } else {
    data.db = {
      host: "localhost",
      user: "postgres",
      password: "tristate123",
      database: "vdsta_db"
    };
    data.port = 5050; // data.frameIO = {
    //   client_id: `3240202f-8521-444c-aa07-880f595ba52d`,
    //   client_secret: `KnyVTL-daNK7`,
    //   access_token: `fio-u-OTvtepGocATJu11wAjybJRw7GR8r4W4HQGCdv7GY85wiC0i5Blp5bKLpGUj2lM_y`,
    //   account_id: '4c3f27cd-20d8-4ed2-8a5e-9120525798c4'
    // }
  }

  return data;
}();