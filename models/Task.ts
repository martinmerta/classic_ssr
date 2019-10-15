import { getDb } from '../util/db';
export class Task {
  static saveTask(username: string, task: string[]) {
    const db = getDb();
    db.collection('users').updateOne({ username }, { $set: { tasks: task } });
  }
  static getTasks(username) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ username })
      .then(user => {
        return user.tasks;
      });
  }
  static deleteTask(username: string, index: number) {
    return this.getTasks(username)
      .then(tasks => {
        tasks.splice(index, 1);
        return tasks;
      })
      .then(updatedTasks => {
        return this.saveTask(username, updatedTasks);
      });
  }
}
