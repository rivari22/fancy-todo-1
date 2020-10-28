const { User, Todo } = require('../models/index');
const {checkPassword} = require('../helpers/bcrypt');
const {generateTokenJWT} = require('../helpers/jwt');

class Controller {
    
    static async registerHandler(req, res, next) {
        try {
            const newData = req.body
            const user = await User.create(newData)
            res.status(201).json(user)
        } catch (err) {
            next(err)
        }
    }

    static async loginHandler(req, res, next) {
        try {
            const inputUser = req.body
            const user = await User.findOne({
                where: {
                    email: inputUser.email
                }
            })
            if(!user) {
                next({name: "Unauthorized", msg: "email or password wrong"})
            } else if (!checkPassword(inputUser.password, user.password)) {
                next({name: "Unauthorized", msg: "email or password wrong"})
            } else { 
                const accessToken = generateTokenJWT({
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                })
                res.status(200).json(accessToken)
            }
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller