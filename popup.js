
$(document).ready( function() {
  //TODO 
  //use an autocompletefeature to complete anime name
  var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
  var $target = $('#DefaultTable > tbody');
  var $NewTableTarget = $("#NewTable > tbody");
  if (arrayOfUrls.length > 0) {
    //adds spinner
     var spintarget = document.getElementById('foo');
     var spinner = new Spinner().spin(spintarget);
     var NewEp = false; 
     //adds in the rows for each anime
    arrayOfUrls.sort();
    localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
    for (var i = 0; i < arrayOfUrls.length; i++) {
      var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1], arrayOfUrls[i][2], arrayOfUrls[i][3]);
      
      if( arrayOfUrls[i][2] && arrayOfUrls[i][3] !== "url")
      {
        document.getElementById("Title").innerHTML="<h4>New Episode is available!<h4>";
        document.getElementById("CurrentTable").innerHTML="<h4>Current Anime!<h4>";

        if(!NewEp)
        {
          NewEp = true;
          document.getElementById("NewTable").style.display="table";
        }
        $NewTableTarget.append(string);
      }
      else
        $target.append(string);
    }
    //check for new eps
    
      var myVar = setTimeout(
    function()
    {
      getFeed(); 
      clearTimeout(myVar); 
      spinner.stop(); 
      redraw();
    },3000)
    
   
  }

    //add anime form
  $( "form" ).submit(function( event ) {
     var self = this;
    var formId = this.id;
  if(formId=="addAnime")
  {
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
        var EliminateWhiteSpace = field.value;
        EliminateWhiteSpace = EliminateWhiteSpace.trim();
            temp.push(EliminateWhiteSpace);
      });
      //checks for duplicate if so dont insert
        if(!duplicate(temp[0]))
        {
          temp.push(0);
          temp.push("url");
          arrayOfUrls.unshift(temp);
          localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
          redraw();
          $('form')[0].reset()
        }
        if(! $("#mutliple").is(":checked"))
          $('#collapseOne').collapse('hide');
  }
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
      arrayOfUrls[id][2]=0;
      arrayOfUrls[id][3]="url";
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      redraw();
     }
     else if($(e.currentTarget).text() == "+")
     {
        var id = parseInt(e.currentTarget.id);
        var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
        var counter =$('.container .table .btn-toolbar .btn-group .btn').filter(".disabled").filter("#"+id);
         counter.html(++arrayOfUrls[id][1])
        arrayOfUrls[id][2]=0;
        arrayOfUrls[id][3]="url";
        localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
        redraw();
     }
     else if($(e.currentTarget).text() == "X")
     {
        var id = parseInt(e.currentTarget.id);
        var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
        arrayOfUrls.splice(id, 1);
        localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
        $('tr#' + id).remove();
        redraw();
     }
    else;
    
  });
});
function tableRow(i, title, ep, newep, url)
{
var string= "";
  string = "<tr id="+ i +">"+
   "<td>" + (i+1) +". "+ title + "</td>"+
   "<td>"+
    "<div class='btn-toolbar'>"+
      "<div class='btn-group'>"+
        "<button type='button' class='btn btn-default' id="+ i +">-</button>"+
        "<button type='button' class='btn btn-default disabled' id="+ i +">"+ ep +"</button>"+
        "<button type='button' class='btn btn-default' id="+ i +">+</button>"+
        "<button type='button' class='btn btn-default' id="+ i +">X</button>"+
      "</div>";
  if(newep && url !== "url")
    {
       string +="<a href='"+ url +"' target='_newtab'><span class='badge'>New</span></a>";
    }
  string +="</div>"+
    "</td>"+
"</tr>";
  return string;
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
   var $target = $('#DefaultTable > tbody');
   var $NewTableTarget = $("#NewTable > tbody");
   $NewTableTarget.empty();
   $target.empty();
        var NewEp = false; 

   for (var i = 0; i < arrayOfUrls.length; i++) 
   {
      var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1], arrayOfUrls[i][2], arrayOfUrls[i][3]);
      if( arrayOfUrls[i][2] && arrayOfUrls[i][3] !== "url")
      {
        document.getElementById("Title").innerHTML="<h4>New Episode is available!<h4>";
        document.getElementById("CurrentTable").innerHTML="<h4>Current Anime!<h4>";

        if(!NewEp)
        {
           NewEp = true;
           document.getElementById("NewTable").style.display="table";
        }
        $NewTableTarget.append(string);
      }
      else
      $target.append(string);
   }
}
