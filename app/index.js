const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const dbName = process.env.DB_NAME || 'techsession';
const maxPoolSize = parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10);

const uri = process.env.DB_URI ;
//const uri = `mongodb://0.0.0.0:27017`;

let db;

async function seedDatabase() {
  const count = await db.collection('schedule').countDocuments();
  if (count === 0) {
    console.log("Adding database with data...");
    await db.collection('schedule').insertMany([
      { name: 'Tech Session A' }, { name: 'Tech Session B' }, { name: 'Tech Session C' },
	  { name: 'Tech Session D' }, { name: 'Tech Session E' }, { name: 'Tech Session F' },
	  { name: 'Tech Session G' }, { name: 'Tech Session H' }, { name: 'Tech Session I' },
	  { name: 'Tech Session J' },
    ]);
    console.log("Data inserted.");
  } else {
    console.log("Data already present.");
  }
}

MongoClient.connect(uri, {  useUnifiedTopology: true,maxPoolSize,})
  .then(async (client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    await seedDatabase();
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

app.get('/tech/session/schedule', async (req, res) => {
  try {
    const items = await db.collection('schedule').find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('healthy');
});

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
