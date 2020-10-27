const express = require('express');
const router = express.Router()
const Controller = require('../controllers/TodoController');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.use(authentication)

router.get("/", Controller.getTodosHandler)
router.post("/add", authorization, Controller.addTodoHandler)
router.put("/edit/:todoId", authorization, Controller.editTodoHandler)
router.delete("/delete/:todoId",authorization, Controller.deleteTodoHandler)
router.patch("/update-status/:todoId", authorization, Controller.updateStatusHandler)

module.exports = router