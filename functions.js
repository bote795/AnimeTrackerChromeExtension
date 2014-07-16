function FindTotalEpisodes(i, input_a, callback)
  {
    if (i< input_a.length)
    {
         var anime = input_a[i][0];
        anime =encodeURIComponent(anime);
        url="http://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=~"+anime;
        query ='select anime from xml where url="'+url+'"';
            var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
        if (typeof input_a[i][5] === 'undefined')
             input_a[i][5]=0;
        if (typeof  input_a[i][5] !== String && (input_a[i][5] === input_a[i][1] || input_a[i][5] ===0) ) 
        {
            $.getJSON(yqlAPI, function(){
                  //console.log("sucess");
              })
            .success(function(r){
              var found = false;
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
                                 input_a[i][5]="out of " + this.content;
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
    }
    else
          callback(input_a);
  }