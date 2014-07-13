var urls;
if (!localStorage["savedUpdateAnimeList"]) 
{
  localStorage["savedUpdateAnimeList"]= JSON.stringify(
  [
  ["http://www.lovemyanime.net/latest-anime-episodes/",
  'xpath="//div[@class=\'noraml-page_in_box_mid\']//div[@class=\'noraml-page_in_box_mid_link\']//@href"',
   "html",true, "http://www.lovemyanime.net"],
  ["http://www.animefreak.tv/tracker",
  'xpath="//div[@class=\'view-content\']//tbody//tr//@href"',
   "html",true, "http://www.animefreak.tv"],
  ["http://www.animeseason.com/",
  'xpath="//div[@id=\'frontpage_left_col\']//@href"',
  "html",true, "http://www.animeseason.com"],
  ["http://www.gogoanime.com/",
  'xpath="//div[@class=\'post\']//li"',
  "html",false, ""]
]);
    urls=JSON.parse(localStorage["savedUpdateAnimeList"]);
}
else
  urls=JSON.parse(localStorage["savedUpdateAnimeList"]);
var updates= [];    
var i=0;
function getFeed()
{
  if (i < urls.length) 
  {
      var query;
      if (urls[i][2] == "html") 
          query = 'select * from html where url ="'+ urls[i][0] +'" and '+urls[i][1];
      else
          query ='select link from rss where url="'+urls[i][0]+'"';
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
  $.getJSON(yqlAPI, function(){
      console.log("sucess");
  })
    .success(function(r){
         if (urls[i][0] == "http://www.gogoanime.com/") 
              {
                 $.each(r.query.results.li, function(){ 
                      if(typeof this.font !== 'undefined')
                          {        
                            if(this.font.content !== "(Raw)")
                             {
                                updates.push([this.a.href,this.font.content, this.a.href]);
                             }
                          }
                    }); // close each
              }
              else
              {
                if (urls[i][2] == "html") 
                {
                  $.each(r.query.results.a, function(){ 
                   if(typeof this.href !== 'undefined')
                    {
                      if (urls[i][3]) 
                        {
                           updates.push([this.href, "(Sub)", (urls[i][4]+this.href)]);
                        }
                        else
                        {
                          updates.push([this.href, "(Sub)", this.href]);
                        }
                       
                    }
                  }); // close each

                }
                else
                {
                  $.each(r.query.results.item, function(){ 
                    if(typeof this.link !== 'undefined')
                    {
                      updates.push([this.link, "(Sub)", (urls[i][4]+this.link)]);
                    }
                  }); // close each
                }              
            } // close else
        i++;
         getFeed();
      }); // close sucess
  }
    else 
    isUp();
 
}

function isUp()
{
  var eplog = JSON.parse(localStorage["savedAnimes"]);
  //switch for loops for implementation  
 for(var e = 0; e< eplog.length; e++)
  {
      for(var i = 0; i< updates.length; i++)
      {
        if(eplog[e][2]!==1 && NextEp(updates[i][0],eplog[e][0],eplog[e][1]))
           {
             var temp="New Episode is up for ";
             var x ="";
             eplog[e][2]=1;
             eplog[e][3]=updates[i][2];
             x=x.concat(temp,eplog[e][0]);             
               var opt = {
                type: "basic",
                title: "New Episode",
                message: x,
                 iconUrl: "icon.png"
              }
              chrome.notifications.create( JSON.stringify({id: e ,url: updates[i][2] }), opt, function() {
                  console.log("Succesfully created " + e + " notification");
              });
              chrome.notifications.onClicked.addListener(notificationClicked);
              break;
           }
           else if(typeof NextEp(updates[i][0],eplog[e][0],eplog[e][1]) === 'undefined')
          {        
                console.log("NextEp: undefined returned")    
                console.log(updates[i][0] +" : "+ eplog[e][0]+" : "+eplog[e][1] )
          
          }
      }
  }
  localStorage["savedAnimes"] = JSON.stringify(eplog);
  reset();
}
function notificationClicked(ID) {
  var x = JSON.parse(ID);
  console.log("clicked:"+parseInt(x.id));
  window.open(x.url);
  chrome.runtime.sendMessage({method: "EpUpdate",
                                  sentUrl: x.url,
                                  title: "x" },
        function (response) {
          if (response.status === 200) {
           // $(e.target).css("color", "green");
          }
        });
}

function NextEp(url, title, ep)
{
    var words = [];
    title = title.toLowerCase();
    words =title.split(new RegExp("\\s+"));
    var numberPattern = /\d+/g;
    if(typeof ep !== "number")
    {
      ep = parseInt(ep);
    }
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
    var numbers =url.match( numberPattern );
    if (numbers != null)
      if(url.indexOf("episode") != -1)
      {
         url = url.substring(url.indexOf("episode")+ "episode".length, url.length);
         //write a test coondition to see if this contains anything before testing it
         //parseInt(url.match( numberPattern )[0])

        if((ep+1) == parseInt(url.match( numberPattern )[0]))
          {
            return true;
          }
          else
            return false;
      }
      else if((ep+1) == parseInt(url.match( numberPattern )[0]))
          {
            return true;
          }
      else 
        return false;
    else
      return false;
}
function reset()
{
  i=0;
  updates= [];
}