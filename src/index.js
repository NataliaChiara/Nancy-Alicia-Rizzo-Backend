const express = require("express");
const morgan = require("morgan");
const database = require("./database")
const cors = require("cors")

// config inicial
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Escuchando el puerto " + app.get("port"));

// middlewares
app.use(cors({
  origin: ["http://127.0.0.1:5500"]
}))
app.use(morgan("dev"));

// rutas
app.get("/", async (req, res)=>{
  const connection = await database.getConnection()
  const psicologo = await connection.query(`
    SELECT * from psicologo
  `)
  const servicios = await connection.query(`
    SELECT * from servicios
  `)
  const terapias = await connection.query(`
    SELECT * from terapias
  `)
  const testimonios = await connection.query(`
    SELECT * from testimonios
  `)
  res.json({psicologo:psicologo[0],servicios:servicios,terapias:terapias,testimonios:testimonios})
})