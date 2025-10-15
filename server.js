const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'shopping';
const COLLECTION = 'cart';

let dbClient;
let collection;

async function start() {
  try {
    dbClient = new MongoClient(MONGO_URL, { useUnifiedTopology: true });
    await dbClient.connect();
    const db = dbClient.db(DB_NAME);
    collection = db.collection(COLLECTION);
    console.log('Connected to MongoDB at', MONGO_URL, 'db:', DB_NAME);

    app.get('/api/cart', async (req, res) => {
      try {
        const docs = await collection.find({}).sort({ _id: 1 }).toArray();
        res.json(docs);
      } catch (e) {
        console.error('GET /api/cart error', e);
        res.status(500).json({ error: 'Failed to fetch cart' });
      }
    });

    app.post('/api/cart', async (req, res) => {
      try {
        const item = sanitizeItem(req.body);
        const result = await collection.insertOne(item);
        res.status(201).json({ insertedId: result.insertedId });
      } catch (e) {
        console.error('POST /api/cart error', e);
        res.status(500).json({ error: 'Failed to add item' });
      }
    });

    app.put('/api/cart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
        const item = sanitizeItem(req.body);
        await collection.updateOne({ _id: new ObjectId(id) }, { $set: item });
        res.json({ ok: true });
      } catch (e) {
        console.error('PUT /api/cart/:id error', e);
        res.status(500).json({ error: 'Failed to update item' });
      }
    });

    app.delete('/api/cart/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
        await collection.deleteOne({ _id: new ObjectId(id) });
        res.json({ ok: true });
      } catch (e) {
        console.error('DELETE /api/cart/:id error', e);
        res.status(500).json({ error: 'Failed to delete item' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log('Open index.html in your browser to use the frontend.');
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

function sanitizeItem(body) {
  const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
  const quantity = Number(body.quantity) || 0;
  const price = Number(body.price) || 0;
  let date = null;
  if (body.date) {
    const d = new Date(body.date);
    if (!isNaN(d.getTime())) date = d;
  }
  return { productName, quantity, price, date };
}

start().catch(err => {
  console.error(err);
});
