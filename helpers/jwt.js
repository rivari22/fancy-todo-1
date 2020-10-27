const jwt = require('jsonwebtoken');

function generateTokenJWT(data) {
    const token = jwt.sign(data, process.env.SECRET);
    return token
}

function verifyTokenJWT(token) {
    const tokenVerif = jwt.verify(token, process.env.SECRET);
    return tokenVerif
}

module.exports = { generateTokenJWT, verifyTokenJWT }