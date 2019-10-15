import mongodb, { Db } from 'mongodb';
const MClient = mongodb.MongoClient;
let _db: Db;
export const mongoClient = (callback: Function) => {
  MClient.connect(
    'mongodb+srv://martin123:forester@firstproject-fqsbx.mongodb.net/todo',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
    .then((client: mongodb.MongoClient) => {
      _db = client.db();
      callback();
    })
    .catch(err => console.log(err));
};
export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};
