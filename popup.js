
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
      var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1], arrayOfUrls[i][2], arrayOfUrls[i][3], arrayOfUrls[i][4] ,arrayOfUrls[i][5]);
      
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
      getFeed(function(eplog){
        redraw();

        FindTotalEpisodes(0,eplog,function(data)
        {
          console.log("finish checking for TotalEps");
          spinner.stop();
          localStorage["savedAnimes"] = JSON.stringify(data);
          redraw();
        });
      });
      clearTimeout(myVar); 
       
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
          temp.push("home");
          arrayOfUrls.unshift(temp);
          localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
          redraw();
          $('form')[0].reset()
        }
        if(! $("#mutliple").is(":checked"))
          $('#collapseOne').collapse('hide');
  }
  else if (formId == "addFav") 
  {
   if(Boolean(self.inputfav.value))
   {
        var fav = JSON.parse(localStorage["fav"]);
        fav.push(self.inputfav.value)
        localStorage["fav"]= JSON.stringify(fav);
   }
  }
});
$('body').on('submit','form[id=homelink]',function(e) {
  e.preventDefault();
   var self = this;
    //console.log(self.animeHome.value + ":" +self.animeHome.id)
    if(Boolean(self.animeHome.value))
   {
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      arrayOfUrls[self.animeHome.id][4]=self.animeHome.value;
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      redraw();
   }
   else
   {
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      arrayOfUrls[self.animeHome.id][4]="home";
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      redraw();
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
    else if($(e.currentTarget).text() == "Link")
    {
        $('[data-toggle="popover"]').popover({
            html: 'true'});      
    }
    
  });           
});
function tableRow(i, title, ep, newep, url, homeurl,totalEps)
{
  var popoverstring = 
              '<form id=\"homelink\" class=\"form-horizontal\">'+
                  '<fieldset>' +
                    '<div class=\"form-group\">'+
                      '<div class=\"col-lg-3\">'+
                        '<input type=\"text\" class=\"form-control\" id='+i+' name=\"animeHome\" placeholder=\"Enter animes home url\">'+
                        '<button type=\"submit\" class=\"btn btn-primary\" >Submit</button>'+
                      '</div>'+
                    '</div>'+
                 ' </fieldset><!--end fieldset -->'+
              '</form>';
  var string= "";
    string = "<tr id="+ i +">"+
     "<td>" + (i+1) +". ";
     if(homeurl !== "home")
      {
         string +="<a href='"+ homeurl +"' target='_newtab'>"+title+"</a>";
      }
      else
        string +=title;
      string+= "</td>"+
     "<td>"+
      "<div class='btn-toolbar'>"+
        "<div class='btn-group'>"+
          "<button type='button' class='btn btn-default' id="+ i +">-</button>"+
          "<button type='button' class='btn btn-default disabled' id="+ i +">";
          var text="-1";
          if (typeof  totalEps === "string")
              text=totalEps.substring(8,totalEps.length)
          if(ep == 0)
            string+= "New";
          else if(ep == parseInt(text))
            string+= "done";
          else
            string+=ep;
          if (typeof  totalEps === "string" && ep != parseInt(text)) 
          {

            string += totalEps;
          }
          string +="</button>"+
          "<button type='button' class='btn btn-default' id="+ i +">+</button>"+
          "<button type='button' id="+i+" class='btn btn-default' data-container='body' data-toggle='popover' data-content='"+ popoverstring+"'  data-original-title='' title='' data-placement='left' >Link</button>"+
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
      var string = tableRow(i,arrayOfUrls[i][0], arrayOfUrls[i][1], arrayOfUrls[i][2], arrayOfUrls[i][3],arrayOfUrls[i][4],arrayOfUrls[i][5] );
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
    