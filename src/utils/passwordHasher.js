const bcrypt = require('bcryptjs');

async function generateHashedPassword(password) {

    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);

}

async function comparePassword(userPassword, hashedPassword) {

    return await bcrypt.compare(userPassword, hashedPassword);
}

module.exports = {
    generateHashedPassword, comparePassword
}