import { Db, MongoClient } from "mongodb";

const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  throw new Error("Missing env var: MONGODB_URL");
}

declare global {
  var __mongoClient: MongoClient | undefined;
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClient) {
    global.__mongoClient = new MongoClient(MONGODB_URL);
    global.__mongoClientPromise = global.__mongoClient.connect();
  }
  client = global.__mongoClient;
  clientPromise = global.__mongoClientPromise!;
} else {
  client = new MongoClient(MONGODB_URL);
  clientPromise = client.connect();
}

const db: Db = client.db();

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export { clientPromise, db, getDb };
