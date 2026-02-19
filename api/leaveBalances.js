import clientPromise from './mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('leaveBalances');

  if (req.method === 'PUT') {
    // Update or set leave balance for a user
    const { userId, balance } = req.body;
    await collection.updateOne(
      { userId },
      { $set: { ...balance, userId } },
      { upsert: true }
    );
    res.status(200).json({ message: 'Leave balance updated' });
  } else if (req.method === 'GET') {
    // Get all leave balances
    const balances = await collection.find({}).toArray();
    res.status(200).json(balances);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
