import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('outlets');

  if (req.method === 'GET') {
    const outlets = await collection.find({}).toArray();
    res.status(200).json(outlets);
  } else if (req.method === 'POST') {
    const outlet = req.body;
    const result = await collection.insertOne(outlet);
    res.status(201).json(result.ops[0]);
  } else if (req.method === 'PUT') {
    // Update outlet (admin can update outlet name, etc.)
    const { _id, ...update } = req.body;
    await collection.updateOne({ _id: new ObjectId(_id) }, { $set: update });
    res.status(200).json({ message: 'Outlet updated' });
  } else if (req.method === 'DELETE') {
    // Delete outlet
    const { _id } = req.body;
    await collection.deleteOne({ _id: new ObjectId(_id) });
    res.status(200).json({ message: 'Outlet deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
