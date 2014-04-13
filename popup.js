
$(document).ready( function() {
  //TODO allow user to add anime by typing name
  //use an autocompletefeature to complete anime name
  //allow user to add anime ep they are in by editing the number
  var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
  var $target = $('.container .table > tbody');

  for (var i = 0; i < arrayOfUrls.length; i++) {
    var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1] );
    $target.append(string);
  }
  
  $('.container .table .btn-toolbar .btn-group button').on('click', function(e) {
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
   "<td>" + title + "</td>"+
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


