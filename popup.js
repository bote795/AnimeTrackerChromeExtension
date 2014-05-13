
$(document).ready( function() {
  //TODO 
  //use an autocompletefeature to complete anime name
  //allow user to add anime ep they are in by editing the number
  var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
  var $target = $('.container .table > tbody');

  //adds in the rows for each anime
  //TODO 
  //Add a numbering system to see how many current animes are you watching
  //Add a sorting my first letter system
  if (arrayOfUrls.length > 0) {
    arrayOfUrls.sort();
    localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
    for (var i = 0; i < arrayOfUrls.length; i++) {
      var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1] );
      $target.append(string);
    }
  }
  //add anime form
  $( "form" ).submit(function( event ) {
  var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
  event.preventDefault();
  var fieldNumber = 2,
   str = $( "form" ).serializeArray(),
    temp = [];
    jQuery.each( str, function( i, field ) {
     if(field.value ===null || field.value ==='undefined' || field.value.length == 0)
      {
        return;
      }
          temp.push(field.value);
    });
    //checks for duplicate if so dont insert
      if(!duplicate(temp[0]))
      {
        arrayOfUrls.unshift(temp);
        localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
        redraw();
        $('form')[0].reset()
      }
      if(! $("#mutliple").is(":checked"))
        $('#collapseOne').collapse('hide');

});
  //takes care of buttons for each row(anime)
  $('body').on('click','.container .table .btn-toolbar .btn-group button',function(e) {
    e.preventDefault();
    //TODO make counter clickable and you can change by a huge range
     if($(e.currentTarget).text() == "-")
     {
      var id = parseInt(e.currentTarget.id);
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      var counter =$('.container .table .btn-toolbar .btn-group .btn').filter(".disabled").filter("#"+id);
      counter.html(--arrayOfUrls[id][1])
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
     }
     else if($(e.currentTarget).text() == "+")
     {
        var id = parseInt(e.currentTarget.id);
        var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
        var counter =$('.container .table .btn-toolbar .btn-group .btn').filter(".disabled").filter("#"+id);
         counter.html(++arrayOfUrls[id][1])
        localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
     }
     else if($(e.currentTarget).text() == "X")
     {
        var id = parseInt(e.currentTarget.id);
        var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
        arrayOfUrls.splice(id, 1);
        localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
        $('tr#' + id).remove();
     }
    else;
    
  });
});
function tableRow(i, title, ep)
{
  return "<tr id="+ i +">"+
   "<td>" + (i+1) +". "+ title + "</td>"+
   "<td>"+
    "<div class='btn-toolbar'>"+
      "<div class='btn-group'>"+
        "<button type='button' class='btn btn-default' id="+ i +">-</button>"+
        "<button type='button' class='btn btn-default disabled' id="+ i +">"+ ep +"</button>"+
        "<button type='button' class='btn btn-default' id="+ i +">+</button>"+
        "<button type='button' class='btn btn-default' id="+ i +">X</button>"+
      "</div>"+
    "</div>"+
    "</td>"+
"</tr>";
}
 function duplicate(item)
 {
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      var titleColumn =0;
     for (var i = 0; i < arrayOfUrls.length; i++) {
       if(arrayOfUrls[i][titleColumn] == item)
       {
         return true;
       }
     }
     return false;
 }
function redraw()
{
   var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
   var $target = $("table:first > tbody");
   $target.empty();
   for (var i = 0; i < arrayOfUrls.length; i++) 
   {
      var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1] );
      $target.append(string);
   }
}
