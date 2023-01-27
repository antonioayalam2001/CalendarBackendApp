const {Schema, model} = require('mongoose');

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "A name must be provided"]
    },
    email: {
        type: String,
        required: [true, "An email must be provided"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "A password must be provided"]
    }
});


userSchema.methods.toJSON = function () {
    const {__v, _id,...user} = this.toObject();
    user.id = _id;
    return user;
}

module.exports = model('User',userSchema);

