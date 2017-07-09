var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
var Webtask = require("webtask-tools");

app.use(require('./middleware').connectDisconnect);

// parse application/json
app.use(bodyParser.json());
app.use(cors());
require("./routes/bar")(app);

module.exports = Webtask.fromExpress(app).auth0({
    exclude: [
        '/',
        '/bars'
    ],
    loginError: function (error, ctx, req, res, baseUrl) {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
            statusCode: 401,
            message: "You must be logged in to access this resource."
        }));
    }
});
