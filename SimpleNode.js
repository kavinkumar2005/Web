const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = "mongodb://localhost:27017"; 
const dbName = "shopping";          
let db, collection;

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    collection = db.collection("products");
  })
  .catch(err => console.error("MongoDB connection failed:", err));

app.post("/addProduct", async (req, res) => {
  try {
    const data = req.body; 
    const result = await collection.insertOne(data);
    res.json({ message: "Product added successfully", id: result.insertedId });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Failed to insert product" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const items = await collection.find({}).toArray();
    res.json(items);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
