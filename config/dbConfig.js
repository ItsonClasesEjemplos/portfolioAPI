require('dotenv').config()

module.exports ={
    db:{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME
    },
    atlas:{
        url: process.env.DB_URL
    }
}

