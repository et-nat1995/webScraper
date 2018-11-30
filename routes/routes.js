var mongoose = require("mongoose");
var MONGO_DB = process.env.MONGODB_URI || "mongodb://localhost/webScraperHomework";
var axios = require("axios");
var cheerio = require("cheerio");
mongoose.connect(MONGO_DB, { useNewUrlParser: true });
// Require all models
var db = require("../models");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.ign.com/articles?tags=news").then(function (response) {

            // Load the HTML into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);

            $("div.listElmnt-blogItem").each(function (i, element) {

                var title = $(element).children().text();
                var link = $(element).find("a").attr("href");

                if (title && link) {
                    db.Article.create({
                        title: title,
                        link: link
                    })
                }
            });
        });
    });

    app.get("/", function (req, res) {
        db.Article.find({ saved: false }).then(function (dbArt) {
            res.render("index", { dbArt });
        }).catch(function (err) {
            res.json(err);
        });
    });

    app.get("/articles?", function (req, res) {
        // TODO: Finish the route so it grabs all of the articles

        if (req.query.isSaved === "true") {
            db.Article.find({ saved: true }).then(function (dbArt) {
                res.render("saved", { dbArt });
            }).catch(function (err) {
                res.json(err);
            });
        }
    });

    app.get("/articles/:id", function (req, res) {
        var id = req.params.id;
        db.Article.findById(id)
            .populate("note")
            .then(function (dbArticle) {

                console.log(dbArticle);
                res.json(dbArticle);

            }).catch(function (err) {

                res.render("index", err);

            });
    });

    app.post("/articles/:id", function (req, res) {
        var id = req.params.id;
        db.Note.create(req.body).then(function (dbNOte) {
            return db.Article.findByIdAndUpdate(id, { note: dbNOte._id }, { new: true })
                .then(function (dbArticle) {

                    res.json(dbArticle);

                }).catch(function (err) {

                    res.render("index", err);

                });
        });
    });

    app.post("/save/:id", function (req, res) {
        var id = req.params.id;
        db.Article.findByIdAndUpdate(id, { saved: true })
            .then(function (dbArt) {
                console.log("Data Updated");
                res.json(dbArt);
            })
            .catch(function (err) {
                console.log(err);
            });
    });

    app.post("/note/:id", function (req, res) {
        var id = req.params.id;
        db.Note.create(req.body).then(function (dbNOte) {
            return db.Article.findByIdAndUpdate(id, { note: dbNOte._id }, { new: true })
                .then(function (dbArticle) {

                    res.json(dbArticle);

                }).catch(function (err) {

                    res.json(err);

                });
        });
    });

    app.delete("/delete/:id", function (req, res) {
        var id = req.params.id;

        db.Article.findByIdAndRemove(id).then(function (dbArticle) {
            console.log(dbArticle);
        }).catch(function (err) {
            res.json(err);
        })
    })


}