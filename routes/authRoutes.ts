import express from 'express';
const router = express.Router();
import { getUpdateTasks, getToDo, postSaveTask } from '../controllers';
router.get('/updateTasks', getUpdateTasks);
router.get('/todo', getToDo);
router.post('/saveTask', postSaveTask);
export { router };
