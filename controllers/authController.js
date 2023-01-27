const {request, response} = require("express");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {JSONWebTokenGenerator} = require("../helpers/JWT");

const registerUser = async (req = request, res = response) => {
    const {name, email, password} = req.body;
    const userData = {
        name,
        email,
    };

    const user = await User.findOne({email: email});

    if (!user) {
        // Generando el numero de saltos
        // Entre mas vueltas haya del salt mas seguro
        // Entre mayor sea el numero mas procesos ocupa
        const salt = bcrypt.genSaltSync(10);

        // Encriptando la contraseña del usuario
        userData.password = bcrypt.hashSync(password.toString(), salt);

        const user = await new User(userData)
        try {
            await user.save();

            // Generate JWT
            const token = await JSONWebTokenGenerator(user._id, user.name);

            console.log(token);

            return res.status(201).json({
                ok: true,
                msg: 'Success Registration',
                uid: user.id,
                name: user.name,
                token
            })
        } catch (e) {
            return res.status(400).json({
                ok: false,
                msg: 'Failed Registration',
            })
        }
    }

    return res.status(400).json({
        ok: true,
        msg: `User already exists with the email ${email}`,
        uid: user.id,
        name: user.name
    })

};

const renewToken = async (req = request, res = response) => {

    const {uid, name} = req;

    const renewedToken = await JSONWebTokenGenerator(uid, name);

    return res.status(200).json({
        ok: true,
        msg: 'renewed',
        renewedToken
    })
};

const login = async (req = request, res = response) => {
    const {email, password} = req.body;

    const user = await User.findOne({email: email});
    if (!user) {
        return res.status(400).json({
            ok: false,
            msg: `User could not be fount with the provided information `,
        })
    }

    if (bcrypt.compareSync(password, user.password)) {

        // Generating token
        const token = await JSONWebTokenGenerator(user._id, user.name);

        return res.status(202).json({
            ok: true,
            msg: `Login success`,
            token,
        })
    }

    return res.status(401).json({
        ok: false,
        msg: 'Password or email incorrect',
    })
};

const deleteAllDataBase = async (req, res) => {
    await User.remove();
    return res.status(200).json({
        ok: true,
        msg: 'Database deleted'
    })
}


module.exports = {
    deleteAllDataBase,
    login,
    registerUser,
    renewToken
}