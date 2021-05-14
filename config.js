const MONGO_URI = process.env.NODE_ENV === "test" ? process.env.TEST_DB : process.env.DB;


module.exports = { MONGO_URI };