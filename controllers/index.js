const authController = require("./authController");
const eventsController = require('./eventsController');

module.exports = {
    ...authController,
    ...eventsController
}
