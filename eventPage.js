if ( !localStorage["savedUrls"] ) {
  localStorage["savedUrls"] = JSON.stringify([]);
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert (request.method);
    if (request.method === "sendURL") {
      var arrayOfUrls = JSON.parse(localStorage["savedUrls"]);
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
      //need to fix space issue
        alert (temp2);
      arrayOfUrls.unshift([request.sentUrl, temp2, 0]);
      localStorage["savedUrls"] = JSON.stringify(arrayOfUrls);
      sendResponse({status: 200});
    }
    else if (request.method === "EpUpdate") { //start of updating Episode
      var arrayOfUrls = JSON.parse(localStorage["savedUrls"]);
      var temp= request.sentUrl;
      temp =temp.toLowerCase();
      
      for (var i = 0; i < arrayOfUrls.length; i++) 
      {
        var titleWithHyph =arrayOfUrls[i][1];
          titleWithHyph = titleWithHyph.toLowerCase();
         titleWithHyph = titleWithHyph.replace(/\ /g, '-');

        if(temp.indexOf(titleWithHyph+"-episode-"+(arrayOfUrls[i][2]+1))!=-1)
        {
          arrayOfUrls[i][2]++;
        }
      }
      localStorage["savedUrls"] = JSON.stringify(arrayOfUrls);
      sendResponse({status: 200});

    } // close if
    else;
  });
