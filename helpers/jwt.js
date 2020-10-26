const jwt = require('jsonwebtoken');

function generateTokenJWT(data) {
    const token = jwt.sign(data, process.env.SECRET);
    return token
}

module.exports = { generateTokenJWT }