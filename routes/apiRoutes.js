const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

module.exports = function(app) {
  app.get("/", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        // res.json(dbArticle);
        res.render("index");
      })
      .catch(function(err) {
        res, json(err);
      });  
  });
  app.get("/scrape", function(req, res) {
    axios.get("https://www.npr.org/").then(function(resp) {
      let $ = cheerio.load(resp.data);
      // looks for these tags
      $("h3").each(function(i, eolement) {
        let result = {};
        // gets the text and the link we are looking for
        result.title = $(this).text();
        result.link = $(this)
          .parent("a")
          .attr("href");
        // create a new object in our database for each article
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      // let usr know the scrape is finished
      res.send("Scrape Complete");
    });
  });
  
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  // Route for posting a note to a specific Article using the article id
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res, json(err);
      });
  });
};