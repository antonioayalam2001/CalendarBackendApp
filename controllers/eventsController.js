const {request, response} = require('express')
const Event = require('../models/Event');


const getAllEvents = async (req = request, res = response) => {
    const events = await Event.find().populate({path: 'user', select: ['name']});

    res.status(200).json({
        ok: true,
        events: events
    })
};
const createEvent = async (req = request, res = response) => {
    const {title, notes, start, end , privacy = 'public'} = req.body;
    // Since the user is logged and the JWT was a valid one we have access to the uid
    const {uid} = req;
    const event = await new Event({title, notes, start, end, user: uid , privacy});
    console.log(new Date(start).toString())
    try {
        const savedEvent = await event.save();
        return res.status(200).json({
            ok: true,
            msg: "Event created",
            savedEvent
        })
    } catch (e) {
        return res.status(401).json({
            ok: false,
            msg: "Failed to save the current event",

        })
    }
};


const updateEvent = async (req = request, res = response) => {
    // Getting de event id from the parameters
    // api/calendar/:id
    const {id} = req.params;
    // Getting the info from the body
    const {title, notes, start, end , privacy = 'public'} = req.body;
    // Getting the previous element
    let prevEvent = await Event.findById(id);


    if (!prevEvent) {
        return res.status(404).json({
            ok: false,
            msg: "The event could not be found"
        })
    }

    // Checking if the user is the same as the one who is trying to edit the event
    if (prevEvent.user.toString() !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: "Sorry you did not create this event"
        })
    }


    try {
        // Updating element with the new information
        const updatedEvent = await Event.findOneAndUpdate({_id: id}, {
            title,
            notes,
            start,
            end,
            privacy
        }, {returnDocument: "after"});

        res.status(200).json({
            ok: true,
            msg: "Event updated",
            prevEvent,
            updatedEvent
        })

    } catch (e) {
        return res.status(500).json({
            ok: false,
            msg: "The event could not be updated"
        })
    }

};

const deleteEvent = async (req = request, res = response) => {
    const {id} = req.params;

    const eventToDelete = await Event.findById(id);

    if (eventToDelete.user.toString() !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: "You did not create this event sorry"
        })
    }

    try {
        await Event.deleteOne({id});

        res.status(200).json({
            ok: true,
            msg: "Event deleted"
        })
    } catch (e) {
        res.status(500).json({
            ok: false,
            msg: "Please contact the administrator"
        });
    }


};

const deleteAllEvents = async (req = request, res = response) => {
    await Event.deleteMany();
    res.status(200).json({
        ok: true,
        msg: "Everything has been deleted"
    })
};


module.exports = {
    createEvent,
    deleteEvent,
    deleteAllEvents,
    getAllEvents,
    updateEvent
}