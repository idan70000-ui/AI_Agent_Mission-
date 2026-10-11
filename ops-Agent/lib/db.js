import { MongoClient } from 'mongodb';

let mongoClient = null;

export async function saveInvestigation(investigationData) {
  const uri = process.env.MONGO_URI;
  if (!uri) return;

  try {
    if (!mongoClient) mongoClient = new MongoClient(uri);
    await mongoClient.connect();

    const collection = mongoClient.db('agent-inv').collection('investigations');
    await collection.insertOne({
      ...investigationData,
      createdAt: new Date(),
    });
  } catch (err) {
    console.warn('MongoDB save failed (non-critical):', err.message);
  }
}
