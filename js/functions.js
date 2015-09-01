function FindTotalEpisodes(i, input_a, callback)
  {
    if (i< input_a.length)
    {
        var anime = input_a[i][0];
        anime =encodeURIComponent(anime);
        url="http://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=~"+anime;
        query ='select anime from xml where url="'+url+'"';
        console.log(query);
            var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
        if (typeof input_a[i][5] === 'undefined')
             input_a[i][5]=0;
        if (typeof  input_a[i][5] !== "string" && (input_a[i][5] === input_a[i][1] || input_a[i][5] ===0) ) 
        {
            var found = false;
            $.getJSON(yqlAPI, function(){
                  //console.log("sucess");
              })
            .success(function(r){
              if(r.query.results !== null)
                {
                    if(typeof r.query.results.ann.anime !== 'undefined')
                   {
                     $.each(r.query.results.ann.anime.info, function()
                     { 
                           if(typeof this.type !== 'undefined')
                           {
                             if(this.type === "Number of episodes")
                               {
                                 console.log(anime);
                                 console.log(this.content);
                                 input_a[i][5]=" out of " + this.content;
                                 found =true;
                                 return;
                               }
                           }
                    });
                   }
                }
              if(!found)
                input_a[i][5]=input_a[i][5]+2;
              i++;
              FindTotalEpisodes(i,input_a, callback);
            })  
            .fail(function(r){
              console.log("fail");
            });
        }
        else if (typeof input_a[i][5] === "string")
        {
          i++;
              FindTotalEpisodes(i,input_a, callback);
        }
        else
        {
              i++;
              FindTotalEpisodes(i,input_a, callback);
        }
    }
    else
          callback(input_a);
  }

//saves the array given
function saveAnime (anime) {
  localStorage["savedAnimes"] = JSON.stringify(anime)
}
//returns the savedAnimes in an array format
function loadAnime(){
  return JSON.parse(localStorage["savedAnimes"])
}

//check if animenewsnetwork has the total eps for this anime
//argument is an array
function FindTotalEpisodesTest (input_a) {
    var deferred = $.Deferred();
      var anime = input_a[0];
        anime =encodeURIComponent(anime);
        url="http://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=~"+anime;
        query ='select anime from xml where url="'+url+'"';
        console.log(query);
            var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
        if (typeof input_a[5] === 'undefined')
             input_a[5]=0;
        if (typeof  input_a[5] !== "string" && (input_a[5] === input_a[1] || input_a[5] ===0) ) 
        {
            var found = false;
            $.getJSON(yqlAPI, function(){
                  //console.log("sucess");
              })
            .success(function(r){
              if(r.query.results !== null)
                {
                    if(typeof r.query.results.ann.anime !== 'undefined')
                   {
                     $.each(r.query.results.ann.anime.info, function()
                     { 
                           if(typeof this.type !== 'undefined')
                           {
                             if(this.type === "Number of episodes")
                               {
                                 input_a[5]=" out of " + this.content;
                                 found =true;
                               }
                           }
                    });
                   }
                }
              if(!found)
                input_a[5]=input_a[5]+2;
          deferred.resolve(input_a);
            })  
            .fail(function(r){
              console.log("fail");
            });
        }
        else // no need to update
        {
          deferred.resolve(input_a);
        } 

    return deferred.promise();
}
//creates and runs all the calls for all animes
//to search for new eps
function CallForTotalEps (episodelog, callback) {
  var promises=[];
  for (var i = 0; i < episodelog.length; i++) {
    promises.push(FindTotalEpisodes(episodelog[i]));
  };
  var anime;
  $.when.apply($, promises).then(function() {
         anime.push(arguments); // The array of resolved objects as a pseudo-array
  })
  saveAnime(anime);
  callback(anime);    
}