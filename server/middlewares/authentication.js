const { verifyTokenJWT } = require('../helpers/jwt');
const { User, Todo } = require('../models/index');

async function authentication(req, res, next) {
    const { token } = req.headers
    try {
        if(!token) {
            next({name: "Unauthorized", msg: "Unauthorized"})
        }else{
            const decoded = verifyTokenJWT(token)
            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            })
            if(!user) {
                next(req.errors = {name: "NotFound", msg: "Id Not Found"})
            } else {
                req.decoded = decoded
                next()
            }
        }
    } catch (err) {
        next(err)
    }

}

module.exports = authentication