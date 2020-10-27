function errorHandler(err,req,res,next) {
    console.log(err, "ini errornya")
    let status = 500
    let message = err || "Internal server Error"
    if(err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError") {
        status = 401
        message = err.errors[0].message
    } else if(err.name === "BadRequest") {
        status = 400
        message = err.msg
    } else if (err.name === "Unauthorized") {
        status = 401
        message = err.msg
    } else if (err.name === "NotFound") {
        status = 404
        message = err.msg
    }
    res.status(status).json({message})
}

module.exports = errorHandler