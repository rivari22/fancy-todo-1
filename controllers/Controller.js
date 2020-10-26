const { User, Todo } = require('../models/index');
const {checkPassword} = require('../helpers/bcrypt');
const {generateTokenJWT} = require('../helpers/jwt');

class Controller {
    
    static async registerHandler(req, res) {
        try {
            const newData = req.body
            const user = await User.create(newData)
            res.status(201).json(user)
        } catch (err) {
            if(err.name === "SequelizeValidationError") {
                res.status(500).json(err.errors)
                return
            }
            res.status(500).json(err)
        }
    }

    static async loginHandler(req, res) {
        try {
            const inputUser = req.body
            const user = await User.findOne({
                where: {
                    email: inputUser.email
                }
            })
            if(!user) {
                res.status(401).json({msg: "email or password wrong"})
            } else if (!checkPassword(inputUser.password, user.password)) {
                res.status(401).json({msg: "email or password wrong"})
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
            res.status(500).json(err)
        }
    }
}

module.exports = Controller