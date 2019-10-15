import { getDb } from '../util/db';
export class User {
  constructor(public username: string, public password: string) {}
  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static fetch() {
    const db = getDb();
    return db.collection('users');
  }
  static resetPassword(username, newPassword) {
    const db = getDb();
    return db
      .collection('users')
      .updateOne({ username }, { $set: { password: newPassword } });
  }
}
