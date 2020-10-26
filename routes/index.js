const express = require('express');
const router = express.Router()
const todoRoutes = require('./todo');
const Controller = require('../controllers/Controller');

router.post("/register", Controller.registerHandler)
router.post("/login", Controller.loginHandler)

router.use("/todo", todoRoutes)
module.exports = router