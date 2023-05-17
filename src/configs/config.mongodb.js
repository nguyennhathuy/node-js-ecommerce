const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
    },
    db: {
        protocol: process.env.DEV_DB_PROTOCOL,
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        dbName: process.env.DEV_DB_NAME,
    }
}

const production = {
    app: {
        port: process.env.PRO_APP_PORT || 3000,
    },
    db: {
        protocol: process.env.PRO_DB_PROTOCOL,
        username: process.env.PRO_DB_USERNAME,
        password: process.env.PRO_DB_PASSWORD,
        dbName: process.env.PRO_DB_NAME
    }
}

const config = { dev, production };
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env];