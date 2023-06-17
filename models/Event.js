const { Schema, model } = require('mongoose');

const eventSchema = Schema({
    title: {
        type: String,
        required: [true, "Title must be provided"]
    },
    notes: {
        type: String,
        required: [true, "Note can not be empty "],
    },
    start: {
        type: Date,
        required: [true, "Date must be provided"]
    },
    end: {
        type: Date,
        required: [true, "Date must be provided"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    privacy: {
        type: String,
        default: 'public'
    }
});


eventSchema.methods.toJSON = function () {
    const { __v, _id, ...user } = this.toObject();
    user.id = _id;
    return user;
}

module.exports = model('Event', eventSchema);

