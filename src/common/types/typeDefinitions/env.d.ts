namespace NodeJS {
  interface ProcessEnv {
    //Application
    PORT: number;
    //Database
    DATABASE_PORT: number;
    DATABASE_NAME: string;
    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    // JWT
    JWT_SECRET: string;
    JWT_EXPIRATIO: string;
    //secrets
    COOKIE_SECRET: string;
    OTP_TOKEN_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    EMAIL_TOKEN_SECRET: string;
    PHONE_TOKEN_SECRET: string;
    //kavenegar
    SEND_SMS_URL: string;
    //google
    GOOGLE_CLIENT_ID: string;
    GOOGLE_SECRET_ID: string;
    //#S3Liara
    S3_ACCESS_KEY: string;
    S3_SECRET_KEY: string;
    S3_BUCKET_NAME: string;
    S3_ENDPOINT_NAME: string;
    //Secret
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    OTP_TOKEN_SECRET: string;
  }
}
