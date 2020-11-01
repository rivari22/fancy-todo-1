const { User, Todo } = require('../models/index');
const {checkPassword} = require('../helpers/bcrypt');
const {generateTokenJWT} = require('../helpers/jwt');
const {OAuth2Client} = require('google-auth-library');

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
                res.status(200).json({accessToken, id: user.id, name: `${user.first_name} ${user.last_name}`})
            }
        } catch (err) {
            next(err)
        }
    }

    static async googleLoginHandler(req, res, next){
        try {
            const token = req.body.access_token_google
            console.log(token)
            // console.log(token, "ni token di controller google")
            const client = new OAuth2Client(process.env.CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
            // {where:{email: payload.email}}
            const user = await User.findOrCreate({
                where:{
                    email: payload.email
                },
                defaults: {
                    email: payload.email,
                    password: "randomdulu"
                }
            })
            console.log(user, "ini dr controller")
            const accessToken = generateTokenJWT({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            })
            res.status(200).json(accessToken)
            // if(!user) {
            //     const creteUser = await User.create({
            //         email: payload.email,
            //         password: "randomdulu"
            //     })
            //     res.status(200).json(accessToken)

            // } else {
            // }
              
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller