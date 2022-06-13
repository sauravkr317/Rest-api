require("dotenv").config();

export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    DOMAIN_URL
} = process.env;