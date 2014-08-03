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

//keep track of ten urls in a history
//if match matches one of the fav links
//add to a query of temp_fav lists
//after greater than 1 then 
//text for similar text if higher than 90
//check if theres a match if so add to list
function autoAnimeAdd()
{
  var fav_history = JSON.parse(localStorage["fav_history"]);
  console.log(fav_history);
  for (var i = fav_history.length - 1; i >= 0; i--) {
      console.log("x"+fav_history);
    for (var j = i - 1; j >= 0; j--) {
        console.log("i :"+ i +"  j: "+j);

        if(similar_text(fav_history[i], fav_history[j], true) > 90)
      {
        console.log("greater than 90% "+similar_text(fav_history[i], fav_history[j], true));
        console.log("first link: " +fav_history[i] + " \n second link: "+ fav_history[j] + "\n");
        var nameOfAnime =filter(fav_history[i]);
        if (nameOfAnime) 
        {
          var numberPattern = /\d+/g;
          var episode_number;
          if (fav_history[i].match( numberPattern ) > fav_history[j].match( numberPattern ))
          {
            episode_number=fav_history[i].match( numberPattern )[0];
          }
          else
          {
            episode_number=fav_history[j].match( numberPattern )[0];
          }
          nameOfAnime=  nameOfAnime.replace(/[^a-z0-9\s]/gi, ' ');
          console.log(nameOfAnime + " :"+episode_number);
          fav_history.splice(i, 1);
          fav_history.splice(j, 1);
          console.log(fav_history);
          var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
          console.log(nameOfAnime);
          arrayOfUrls.push([String(nameOfAnime), episode_number, 0, "url", "home"]);
          console.log(nameOfAnime + " "+ JSON.stringify(episode_number)  + " : 0"  + " : url , home");
          localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
          localStorage["fav_history"] = JSON.stringify(fav_history);
        }
      }
    }
  }

}
//checks the Fav array for the links and removes it from the string passsed
//or if its not found return false
function containsFav (url) 
{
  var fav = JSON.parse(localStorage["fav"]);
  var fav_history = JSON.parse(localStorage["fav_history"]);
  var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
  var titleColumn =0;
  for (var i = fav.length - 1; i >= 0; i--) 
  {
     if(url.indexOf(fav[i]) != -1 && $.inArray( url, fav_history ) == -1)
     {
        url = url.substring(url.indexOf(fav[i])+fav[i].length, url.length);
        url = filter(url);
        url = url.replace(/[^a-z0-9\s]/gi, ' ');
         for (var j = 0; i < arrayOfUrls.length; j++) {
           if(arrayOfUrls[j][titleColumn] == url)
           {
             return false;
           }
         }
        return true;
     }
  }
  return false;
}
//filter off  fav link
function RemoveFavLink (url) {
  var fav = JSON.parse(localStorage["fav"]);
  for (var i = fav.length - 1; i >= 0; i--) {
         if(url.indexOf(fav[i]) != -1)
         {
             url = url.substring(url.indexOf(fav[i])+fav[i].length, url.length);
             return url;
         }
       }
       return false;
}
//removing episode or first number
function filter (url) {
  //is a match and then take the fav link part of it
  //remove everthing after episode or first number and one character before
   var numberPattern = /\d+/g;
   var numbers =url.match( numberPattern );
  if (numbers != null)
    if(url.indexOf("episode") != -1)
    {
       url = url.substring(0,url.indexOf("episode")-1);
       url = RemoveFavLink(url);
       if (url) 
        return url;
       else
        return false;
    }
    else
    {
       url = url.substring(0, url.indexOf(numbers)-1);
        url = RemoveFavLink(url);
         if (url) 
          return url;
         else
          return false;
    }
  else 
    return false;
}
function similar_text(first, second, percent) {
  //  discuss at: http://phpjs.org/functions/similar_text/
  // original by: Rafał Kukawski (http://blog.kukawski.pl)
  // bugfixed by: Chris McMacken
  // bugfixed by: Jarkko Rantavuori original by findings in stackoverflow (http://stackoverflow.com/questions/14136349/how-does-similar-text-work)
  // improved by: Markus Padourek (taken from http://www.kevinhq.com/2012/06/php-similartext-function-in-javascript_16.html)
  //   example 1: similar_text('Hello World!', 'Hello phpjs!');
  //   returns 1: 7
  //   example 2: similar_text('Hello World!', null);
  //   returns 2: 0

  if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
    return 0;
  }

  first += '';
  second += '';

  var pos1 = 0,
    pos2 = 0,
    max = 0,
    firstLength = first.length,
    secondLength = second.length,
    p, q, l, sum;

  max = 0;

  for (p = 0; p < firstLength; p++) {
    for (q = 0; q < secondLength; q++) {
      for (l = 0;
        (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++)
      ;
      if (l > max) {
        max = l;
        pos1 = p;
        pos2 = q;
      }
    }
  }

  sum = max;

  if (sum) {
    if (pos1 && pos2) {
      sum += this.similar_text(first.substr(0, pos1), second.substr(0, pos2));
    }

    if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
      sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max,
        secondLength - pos2 - max));
    }
  }

  if (!percent) {
    return sum;
  } else {
    return (sum * 200) / (firstLength + secondLength);
  }
}