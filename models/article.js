const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        validate: { 
            validator: function(v){
                return v.length >1;
            },
            message: "You must put words in your note."
        }
    },
    link: {
        type: String, 
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;