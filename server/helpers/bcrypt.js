const bcrypt = require('bcrypt');
 
function hashPassword(pw) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pw, salt);

    return hash
}

function checkPassword(inputPw, pwFromDB){
    return bcrypt.compareSync(inputPw, pwFromDB);
}

module.exports = { hashPassword, checkPassword}