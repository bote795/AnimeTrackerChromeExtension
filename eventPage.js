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
       }
     }
     //duplication check finished
      if(!duplicate)
        arrayOfUrls.unshift([temp2, 0]);
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      sendResponse({status: 200});
    }
    else if (request.method === "EpUpdate") { //start of updating Episode
      var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
      var temp= request.sentUrl;
      temp =temp.toLowerCase();
      var episodeColumn = 1;
      for (var i = 0; i < arrayOfUrls.length; i++) 
      {
        var titleWithHyph =arrayOfUrls[i][0];
        titleWithHyph = titleWithHyph.toLowerCase();
        titleWithHyph = titleWithHyph.replace(/\ /g, '-');

        if(temp.indexOf(titleWithHyph+"-episode-"+(arrayOfUrls[i][episodeColumn]+1))!=-1)
        {
          arrayOfUrls[i][episodeColumn]++;
        }
      }
      localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
      sendResponse({status: 200});

    } // close if
    else;
  });
