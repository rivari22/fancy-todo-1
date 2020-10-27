const { verifyTokenJWT } = require('../helpers/jwt');
const { User, Todo } = require('../models/index');

async function authentication(req, res, next) {
    const { token } = req.headers
    try {
        if(!token) {
            res.status(401).json({msg: "Unauthorized"})
        }else{
            const decoded = verifyTokenJWT(token)
            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            })
            
            if(!user) {
                res.status(404).json({msg: "Id Not Found"})
            } else {
                req.access_token = decoded
                next()
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }

}

module.exports = authentication