let config = {}
console.log('Environment:::', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
    config = {
        API_BASE_URL: 'http://localhost:5000/api/v1/admin/',
        image_url:'https://home.wagedev.com:8443',
        LANGUAGE: 'EN',
        web_url:'https://wageapp.io/',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        DEFAULT_AUTH_TOKEN: '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#TherapyChatbot'
    };
}
else if (process.env.NODE_ENV === 'sandbox') {
    config = {
        API_BASE_URL: 'http://localhost:5000/api/v1/admin/',
        image_url:'https://home.wagedev.com:8443',
        LANGUAGE: 'EN',
        web_url:'https://wageapp.io/',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        DEFAULT_AUTH_TOKEN: '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#TherapyChatbot'
    };
}
else {
    config = {
        // API_BASE_URL: 'http://localhost:5000/api/v1/admin/',
        API_BASE_URL: 'http://54.219.172.96:5000/api/v1/admin/',
        image_url:'https://home.wagedev.com:8443',
        LANGUAGE: 'EN',
        web_url:'https://wageapp.io/',
        EMAIL_REGEX: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        DEFAULT_AUTH_TOKEN: '@#Slsjpoq$S1o08#MnbAiB%UVUV&Y*5EU@exS1o!08L9TSlsjpo#TherapyChatbot'
    };
}

export default config;