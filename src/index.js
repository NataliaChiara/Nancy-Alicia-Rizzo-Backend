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
  limit: '5mb'
}));

app.get("/", async (req, res)=>{
  const connection = await database.getConnection()
  const products = await connection.query(`
    SELECT * from products
  `)
  res.json({products})
})

app.post("/products", async (req, res) => {
  const { name, slug, price, description, sectionSlug, image } = req.body;

  if (!name || !slug || !price || !description || !sectionSlug || !image) {
    return res.status(400).json({ error: "Todos los campos son necesarios" });
  }

  try {
    const connection = await database.getConnection();
    const result = await connection.query(`
      INSERT INTO products (name, slug, price, description, sectionSlug, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, slug, price, description, sectionSlug, image]);

    res.status(201).json({ message: "Producto agregado con éxito", productId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

app.delete("/products/:slug", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "El slug es necesario" });
  }

  try {
    const connection = await database.getConnection();
    const result = await connection.query(
      `DELETE FROM products WHERE slug = ?`,
      [slug]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Producto eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});