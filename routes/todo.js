const express = require('express');
const router = express.Router()
const Controller = require('../controllers/TodoController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.use(authentication)

router.get("/", Controller.getTodosHandler)
router.post("/", Controller.addTodoHandler)
router.put("/:todoId", authorization, Controller.editTodoHandler)
router.delete("/:todoId",authorization, Controller.deleteTodoHandler)
router.patch("/:todoId", authorization, Controller.updateStatusHandler)

module.exports = router