//Routes from users /auth
//host + /api/auth

const {Router} = require("express");
const {login, registerUser, renewToken} = require("../controllers/index");
const {check} = require("express-validator");
const {validateField} = require("../middlewares/validateFields");
const {deleteAllDataBase} = require("../controllers/authController");
const {validateJWT} = require("../middlewares/validateJWT");
const router = Router();


// Renewing user
router.get('/renew', validateJWT, renewToken);


// Login to the application
router.post('/', [
        check('email', 'You must provide a valid email').isEmail(),
        check('password', 'You must provide a valid password').notEmpty(),
        validateField
    ],
    login);

//Creating new user
router.post('/register', [
    check('name', 'Name must be provided').notEmpty(),
    check('email', 'You must provide a valid email').isEmail().notEmpty(),
    check('password', 'You must provide a valid password').notEmpty().isLength({min: 5, max: 14}),
    validateField
], registerUser);

router.get('/deleteAll', deleteAllDataBase);

module.exports = router