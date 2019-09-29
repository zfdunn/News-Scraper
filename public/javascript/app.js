$.getJSON("/articles", function(data){
    for (i = 0; i < data.length; i++){
        $("#articles").append(
            "<p data-id='" +
            data[i]._id +
            "'>" + 
            data[i].title +
            "<br />" +
            data[i].link + 
            "</p>"
        );
    }
});
//====================================
// click handler for making note populate upon click
$(document).on("click", "p", function(){
    $("#notes").empty();
//====================================
// get the id from the tag
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data){
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>SaveNote</button>");
//======================================
// if (there is already a note)
        if (data.note){
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});