const {Todo} = require("../models/index")

async function authorization(req, res, next) {
    try {
        const { id } = req.decoded
        if(!id) {
            // res.status(401).json({msg: "Unauthorized"})
            next({name: "Unauthorized",msg: "Unauthorized"})
        } else {
            const { todoId } = req.params
            if(!todoId) {
                req.body.UserId = id
                next()
            }
            else { 
                const todo = await Todo.findByPk(todoId)
                if(!todo) {
                    next({name: "NotFound", msg: "Todo Not Found"})
                }
                else if(todo.UserId === id) {
                    next()
                } else {
                    next({name: "Unauthorized", msg: "Unauthorized"})
                }
            }
        }
    } catch (err) {
        next(err)
        // res.status(500).json(err)
    }
}

module.exports = authorization