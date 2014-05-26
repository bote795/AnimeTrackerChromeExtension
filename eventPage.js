if ( !localStorage["savedAnimes"] ) {
  localStorage["savedAnimes"] = JSON.stringify([]);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method === "sendURL") {
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      // filtiring string so it will just be title of anime
      var temp= request.title;
      temp =temp.toLowerCase();
      var temp2 = request.title;
      var badPams = [" - episode"," episode", "episode"];
      for (var i = 0; i < badPams.length; i++) {
        if(temp.indexOf(badPams[i])!= -1)
        {
          temp2 = request.title.substring(0,temp.indexOf(badPams[i]));
          break;
        }
      }
      //checks for duplicate if so dont insert
      var duplicate = false;
      var titleColumn =0;
     for (var i = 0; i < arrayOfUrls.length; i++) {
       if(arrayOfUrls[i][titleColumn] == temp2)
       {
          duplicate = true;
          break;
       }
     }
     //duplication check finished
      if(!duplicate)
        arrayOfUrls.unshift([temp2, 0]);
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      sendResponse({status: 200});
      //TODO clear out elements inside the boxes
    }
    else if (request.method === "EpUpdate") { //start of updating Episode
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      var temp= request.sentUrl;
      temp =temp.toLowerCase();
      var episodeColumn = 1;
      
      for (var i = 0; i < arrayOfUrls.length; i++) 
      {
        var title =arrayOfUrls[i][0];
        if(NextEp(temp,title,arrayOfUrls[i][episodeColumn]))
        {
          arrayOfUrls[i][episodeColumn]++;
          arrayOfUrls[i][2]=0;
          arrayOfUrls[i][3]="url";
          break;
        }
      }
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      sendResponse({status: 200});

    } // close if
    else if(request.method === "UpdateRequest"){ //start of update request
      getFeed();
      sendResponse({status: 200});

    }//close updateRequest
    else;
  })

function NextEp(url, title, ep)
{
    var words = [];
    if(typeof ep !== "number")
    {
      ep = parseInt(ep);
    }
title = title.toLowerCase();
words =title.split(new RegExp("\\s+"));
//finds a part of name and creates a substring from where that part of the url starts and the remainder of url
  for (var i = 0; i < words.length; i++) 
  {
    
    if(url.indexOf(words[i])!= -1)
    {
      url = url.substring(url.indexOf(words[i])+words[i].length, url.length);
    }
    else
       return false;
  }
//looks for episode then episode # by creating substrings
//if episode isn't found then it just looks for episode number to account for websites that don't write in episode
    if(url.indexOf("episode") != -1)
    {
       url = url.substring(url.indexOf("episode")+ "episode".length, url.length);
      if(url.indexOf(ep+1)!= -1)
        {
          return true;
        }
    }
    else if(url.indexOf(ep+1)!= -1)
        {
          return true;
        }
    else 
      return false;
}
/*
var hi = "http://www.gogoanime.com/";
var query = 'select * from html where url ="'+ hi +'" and xpath=\'//a\'';

var yqlAPI = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';

$.getJSON(yqlAPI, function(r){
    console.log('links:');
    $.each(r.query.results.a, function(){ 
        console.log('----------');
        console.log(this.href);
    });
});
*/