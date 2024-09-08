const mySql = require("promise-mysql")
const dotenv = require("dotenv")
dotenv.config()

const connection = mySql.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
})

const getConnection = async () => await connection

module.exports = {
  getConnection
}