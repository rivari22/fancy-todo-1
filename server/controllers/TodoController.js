const { User, Todo } = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
    
class TodoController {
    static async getTodosHandler(req, res, next) {
        try {
            const todos = await Todo.findAll({
                where: {
                    UserId: req.decoded.id
                }
            })
            res.status(200).json(todos)
        } catch (err) {
            // res.status(404).json(err)
            next(err)
        }
    }

    static async getTodosByIdHandler(req, res, next) {
        try {
            const id = req.params.todoId
            const todos = await Todo.findAll({
                where: {
                    UserId: req.decoded.id,
                    id
                }
            })
            res.status(200).json(todos)
        } catch (err) {
            next(err)
        }
    }

    static async getTodosByDateHandler(req, res, next) {
        try {
            let nextDay = req.params.date.slice(0, 8)
            let count = +req.params.date.slice(8) + 1
            nextDay += count
            nextDay = new Date(nextDay)
            const date = new Date(req.params.date)
            console.log(date)
            console.log(req.params.date.slice(0,5), "ini dr")
            const todos = await Todo.findAll({
                where: {
                    UserId: req.decoded.id,
                    start_date: {
                        [Op.between]: [date, nextDay]
                    }
                }
            })
            console.log(todos)
            res.status(200).json(todos)
        } catch (err) {
            next(err)
        }
    }

    static async addTodoHandler(req, res, next) {
        try {
            const newTodo = req.body
            newTodo.UserId = req.decoded.id
            const todo = await Todo.create(newTodo, {
                returning: true
            })
            res.status(201).json(todo)
        } catch (err) {
            next(err)
        }
    }

    static async editTodoHandler(req, res, next) {
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
            next(err)
        }
    }

    static async deleteTodoHandler(req,res) {
        try {
            const todoId = req.params.todoId
            const deleted = await Todo.destroy({where: {id:todoId}})
            res.status(200).json({msg: `Success Delete TODO with id ${todoId}`})
        } catch (err) {
            next(err)
        }
    }

    static async updateStatusHandler(req, res) {
        try {
            const todoId = req.params.todoId
            let updated = req.body.status
            if(req.body.status.toLowerCase() === "false") {
                updated = true
            } else if(req.body.status.toLowerCase() === "true") {
                updated = false
            }
            const statusUpdate = await Todo.update({
                status: updated
            }, {
                where: {
                    id: todoId
                },
                returning: true
            })
            res.status(200).json({msg : `Success update status to ${statusUpdate[1][0].status}`, data: statusUpdate[1][0]})

        } catch (err) {
            next(err)
        }
    }
}

module.exports = TodoController