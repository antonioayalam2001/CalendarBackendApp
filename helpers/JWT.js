const JWT = require('jsonwebtoken');
const User = require('../models/User');

const JSONWebTokenGenerator = (uid = '', name = "") => {

    return new Promise((resolve, reject) => {

        // Creating the payload that the token will contain
        const payload = {uid, name};

        //     Generating the JWT
        JWT.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) reject('token could not be generated');
            resolve(token);
        });

    })

};

const validateJWT = async (token = "") => {
    if (token.length < 10) {
        return null;
    }
    // Getting the information that we send in the payload so we can destructure:
    //  const payload = {uid, name};
    const {uid} = JWT.verify(token, process.env.SECRET_KEY);

    try {

        const user = await User.findById({uid});

        if (user) return user

        return null;

    } catch (e) {
        console.log("Something wrong has happened");
        return null;
    }

}


module.exports = {
    JSONWebTokenGenerator
};