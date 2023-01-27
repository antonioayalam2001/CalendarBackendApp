const {Router} = require('express');
const {validateJWT} = require("../middlewares/validateJWT");
const {getAllEvents, createEvent, updateEvent, deleteEvent} = require("../controllers");
const {check} = require("express-validator");
const {validateField} = require("../middlewares/validateFields");
const {isDate} = require("../helpers/isDate");
const {deleteAllEvents} = require("../controllers/eventsController");

const router = Router();
// Events route : /api/calendar
// All of them must been validated to the JWT validator

router.use(validateJWT);

router.get('/', getAllEvents);
router.post('/',
    [
        check('title', 'You must provide a valid name for the event').isLength({min: 4}).notEmpty(),
        check('notes', 'You must provide a valid note for the event').isLength({min: 1}).notEmpty(),
        check('start', 'You must provide a valid start date').custom(isDate).notEmpty(),
        check('end', 'You must provide a valid end date').custom(isDate).notEmpty(),
        validateField
    ], createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);
router.get('/deleteAll', deleteAllEvents);



module.exports = router;