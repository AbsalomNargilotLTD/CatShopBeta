const express       = require('express');
const app           = express();
const path          = require('path');
const routes        = require('./routes');
const Database      = require('./database');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');

const morgan = require('morgan')
const rfs = require('rotating-file-stream') // version 2.x


const db = new Database('challenge.db');


var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})


morgan.token('debug', function (req, res) {
    return req.headers['debug']
})

// setup the logger
app.use(morgan(':remote-addr "[:date[web]]" ":method :url" :status :res[content-length] ":user-agent" ":debug"'
    , {
    stream: accessLogStream,
    skip: function (req, res) {
        return req.originalUrl.includes("static")
    }
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.set('views', './views');
app.use('/static', express.static(path.resolve('static')));

app.use(routes(db));

app.disable('etag');

app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

(async () => {
    await db.connect();
    await db.migrate();

    app.listen(1337, '0.0.0.0', () => console.log('Listening on port 1337'));
})();
