const jwt = require('jsonwebtoken');
const AuthToken  = require('../models/authToken');

const generateAuthTokens =  async function (id){
    const authToken = jwt.sign({_id: id.tostring()},'secret')
    return newToken = await AuthToken.create({
        id,
        authToken
    });

}
module.exports = generateAuthTokens