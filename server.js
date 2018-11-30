var express = require("express");
var logger = require("morgan");
var exphbs = require("express-handlebars");

const path = require("path");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var PORT = 3000;

// Initialize Express
var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use("/static", express.static(path.join(__dirname, "./public")));

require("./routes/routes")(app);

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});