import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('users');

  if (req.method === 'GET') {
    // Get all users
    const users = await collection.find({}).toArray();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    // Create user
    const user = req.body;
    const result = await collection.insertOne(user);
    res.status(201).json(result.ops[0]);
  } else if (req.method === 'PUT') {
    // Update user (admin can update manager name, etc.)
    const { _id, ...update } = req.body;
    await collection.updateOne({ _id: new ObjectId(_id) }, { $set: update });
    res.status(200).json({ message: 'User updated' });
  } else if (req.method === 'DELETE') {
    // Delete user
    const { _id } = req.body;
    await collection.deleteOne({ _id: new ObjectId(_id) });
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
