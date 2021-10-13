const ID = process.env.DB_ID || "db";

const MONGO_URL = process.env.DB_URL || "mongodb://172.17.0.1:27017/";

const mongoose = [
    {
        id: ID,
        url: MONGO_URL+ID
    }
]

export default mongoose;