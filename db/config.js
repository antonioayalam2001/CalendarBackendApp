const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        })

        console.log('connection success');
    } catch (e) {
        throw new Error('Sorry database connection error')
    }
}


module.exports = {
    dbConnection
};