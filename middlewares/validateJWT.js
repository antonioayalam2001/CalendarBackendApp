const JWT = require("jsonwebtoken");
const User = require("../models/User");

const validateJWT = (req, res, next) => {
    // The token must have been send as x-token in a header
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: "Token not valid"
        });
    }

    try {
        // Getting the information that we send in the payload so we can destructure:
        //  const payload = {uid, name};
        const {uid, name} = JWT.verify(token, process.env.SECRET_KEY);

        req.uid = uid;
        req.name = name;

        next();

    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: "Token not valid"
        });
    }


}


module.exports = {
    validateJWT
}