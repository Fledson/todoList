import { Router } from "express";
import { index, createTask, completeTask } from "./Controllers/taskController.js";

const router = Router()

router.get('/', index)
router.post('/task', createTask)
router.post('/completeTask/:id', completeTask)

export { router }