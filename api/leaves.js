import clientPromise from './mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('leaves');

  if (req.method === 'GET') {
    const leaves = await collection.find({}).toArray();
    res.status(200).json(leaves);
  } else if (req.method === 'POST') {
    const leave = req.body;
    const result = await collection.insertOne(leave);
    res.status(201).json(result.ops[0]);
  } else if (req.method === 'PUT') {
    const { _id, ...update } = req.body;
    await collection.updateOne({ _id }, { $set: update });
    res.status(200).json({ message: 'Leave updated' });
  } else if (req.method === 'DELETE') {
    const { _id } = req.body;
    await collection.deleteOne({ _id });
    res.status(200).json({ message: 'Leave deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
