const { User, Todo } = require('../models/index');

class TodoController {
    static async getTodosHandler(req, res) {
        try {
            const todos = await Todo.findAll({
                where: {
                    UserId: 1 // from JWT Token **
                }
            })
            res.status(200).json(todos)
        } catch (err) {
            res.status(404).json(err)
        }
    }

    static async addTodoHandler(req, res) {
        try {
            const newTodo = req.body
            const todo = await Todo.create(newTodo, {
                returning: true
            })
            res.status(201).json(todo)
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async editTodoHandler(req, res) {
        try {
            const todoId = req.params.todoId
            const editedData = req.body
            console.log(editedData)
            const todo = await Todo.update(editedData, {
                where: {
                    id: todoId
                },
                returning: true
            })
            res.status(200).json(todo[1][0])
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async deleteTodoHandler(req,res) {
        try {
            const todoId = req.params.todoId
            const deleted = await Todo.destroy({where: {id:todoId}})
            if(!deleted) {
                res.status(404).json({msg: "Cannot delete. Todo ID Not Found"})
                return
            }
            res.status(200).json({msg: `Success Delete TODO with id ${todoId}`})
        } catch (err) {
            res.status(500).json(err)
        }
    }

    static async updateStatusHandler(req, res) {
        try {
            const todoId = req.params.todoId
            let updated = false
            console.log(req.body.status)
            if(req.body.status.toLowerCase() === "true") {
                updated = true
            }
            // console.log(updated)
            const statusUpdate = await Todo.update({
                status: updated
            }, {
                where: {
                    id: todoId
                },
                returning: true
            })
            res.status(200).json({msg : `Success update status to ${statusUpdate[1][0].status}`})

        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = TodoController