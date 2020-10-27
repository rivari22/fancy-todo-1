const {Todo} = require("../models/index")

async function authorization(req, res, next) {
    try {
        const { id } = req.access_token
        if(!id) {
            res.status(401).json({msg: "Unauthorized"})
        } else {
            const { todoId } = req.params
            if(!todoId) {
                req.body.UserId = id
                next()
            }
            else { 
                const todo = await Todo.findByPk(todoId)
                if(!todo) {
                    res.status(404).json({msg: "Id Not Found"})
                    return
                }
                if(todo.UserId === id) {
                    next()
                } else {
                    res.status(404).json({msg: "Not Found"})
                }
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

module.exports = authorization