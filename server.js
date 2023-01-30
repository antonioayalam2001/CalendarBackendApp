const express = require("express");
const cors = require("cors");
const {dbConnection} = require("./db/config");
require('dotenv').config();

class Server {
    constructor() {
        //Crear servidor
        this.app = express();
        this.PORT = process.env.PORT;
        this.paths = {
            authPath: '/api/auth',
            calendarPath: '/api/calendar',
            anyOtherRoute : '*'
        }
        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    async dbConnection() {
        await dbConnection();
    }

    middlewares() {
        // Configurating CORS
        this.app.use(cors());
        // Allowing to receive information as JSON
        this.app.use(express.json());
        // Public Directory
        this.app.use(express.static('public'));
    }

    // routes
    routes() {
        this.app.use(this.paths.authPath, require('./routes/authRoutes'));
        this.app.use(this.paths.calendarPath, require('./routes/calendarEvents'));
        this.app.get(this.paths.anyOtherRoute, (req, res) => { 
            res.sendFile(__dirname + "/public/index.html");
        })
    }


    start() {
        this.app.listen(this.PORT, () => {
            console.log('Server running');
        });
    }
}

module.exports = Server;