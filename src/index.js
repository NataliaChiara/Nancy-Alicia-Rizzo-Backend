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
  origin: ["http://localhost:3000"]
}))
app.use(morgan("dev"));
app.use(express.json({
  limit: '10mb' // Aumentamos el límite para manejar imágenes en base64
}));

// rutas
app.get("/", async (req, res)=>{
  const connection = await database.getConnection()
  const products = await connection.query(`
    SELECT * from products
  `)
  res.json({products})
})