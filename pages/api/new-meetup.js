import { MongoClient } from "mongodb";
import { CONFIGS } from "../../appSettings";

const handler = async (request, response) => {
  if (request.method === "POST") {
    const data = request.body;

    const client = await MongoClient.connect(CONFIGS.mongoDb.connectionString);
    const db = client.db();

    const meetupsCollection = db.collection(CONFIGS.mongoDb.collectionName);

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    response.status(201).json({ message: "Meetup inserted" });
  }
};

export default handler;
