require('dotenv').config()
const cors = require('cors')
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');


app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use("/", routes)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Running on port ${PORT}`))