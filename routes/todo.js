const express = require('express');
const router = express.Router()
const Controller = require('../controllers/TodoController');

router.get("/:id", Controller.getTodosHandler)
router.post("/:id/add-todo", Controller.addTodoHandler)
router.put("/:id/edit-todo/:todoId", Controller.editTodoHandler)
router.delete("/:id/delete-todo/:todoId", Controller.deleteTodoHandler)
router.patch("/:id/update-status/:todoId", Controller.updateStatusHandler)

module.exports = router