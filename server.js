const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = process.env.PORT || 8080;
const app = express();
//====================================
// middleware & json parson
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
// handlebars
app.engine("handlebars",
    exphbs({ 
        defaultLayout: "main"
        }));
app.set("view engine", "handlebars");
// ===================================
// db setup
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NewsScraper";
mongoose.connect(MONGODB_URI);
//====================================
// set routes
app.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle){
        res.render("index", {
            msg: "Welcome!",
            articles: dbArticle
        });
    }).catch(function(err){
        res, json(err);
    });
});
app.get("/", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.render("index", {
            msg: "Welcome!",
            articles: dbArticle
        }).catch(function(err){
            res, json(err);
        });
    });
app.get("/scrape", function(req, res) {
    axios.get("https://www.npr.org/")
    .then(function(resp){
        let $ = cheerio.load(resp.data);
        $("h3").each(function(i, element){
            let result = {};
            result.title = $(this).text();
            result.link = $(this)
            .parent("a")
            .attri("href");
            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });
        res.send("Scrape Completed. Please select back button, to return to Home page");
    });
app.get("/articles/:id", function(req, res){
        db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle) 
                res.json(dbArticle);
            })
        .catch(function(err) {
            res.json(err);
        });   
    });
//=============================================
// route for posting a note
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate(
            { _id: req.params.id },
            { note: dbNote._id },
            { new: true }
        );
    }).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res, json(err);
    });
});

//====================================
// server start
app.listen(PORT, function(){
    console.log("App running on port " + PORT + "!"); 
    });
});
});