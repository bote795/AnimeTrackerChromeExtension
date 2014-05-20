
var hi = "http://www.gogoanime.com/";
var query = 'select * from html where url ="'+ hi +'" and xpath="//div[@class=\'post\']//li"';
var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
var updates = [];
var gotA, gotB, gotC, gotD;

var gogoAnime1 = []; var lovemyAnime1 = []; var animeFreak1 = []; var animeSeason1 = [];
//http://notifyjs.com/
function isUp(updates)
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
             $.notify(x, "success");
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
}

function NextEp(url, title, ep)
{
    var words = [];
title = title.toLowerCase();
words =title.split(new RegExp("\\s+"));
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
    if(url.indexOf("episode") != -1)
    {
       url = url.substring(url.indexOf("episode")+ "episode".length, url.length);
      if(url.indexOf(ep+1)!= -1)
        {
          return true;
        }
        else
          return false;
    }
    else if(url.indexOf(ep+1)!= -1)
        {
          return true;
        }
    else 
      return false;
}

function getFeed()
{
  gogoAnime();
  lovemyAnime();
  animeFreak();
  animeSeason();
}
function gotFollowersOfA(data)
{
    gogoAnime1 = data;
    gotA = true;
    if (gotD && gotC && gotA && gotB) {
        Sync();
    }
}
function gogoAnime(){
  hi = "http://www.gogoanime.com/";
query = 'select * from html where url ="'+ hi +'" and xpath="//div[@class=\'post\']//li"';
yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
$.getJSON(yqlAPI, function(r){
    $.each(r.query.results.li, function(){ 
      if(typeof this.font !== 'undefined')
          {        
            if(this.font.content !== "(Raw)")
             {
                gogoAnime1.push([this.a.href,this.font.content, this.a.href]);
             }
          }
    });
   gotFollowersOfA(gogoAnime1);
});
}
function gotFollowersOfB(data)
{
    lovemyAnime1 = data;
    gotB = true;
    if (gotD && gotC && gotA && gotB) {
        Sync();
    }
}
//select * from html where url ="http://www.gogoanime.com/" and xpath='//div[@class=\'post\']//li'
//lovemyanime.net
function lovemyAnime(){
hi = "http://www.lovemyanime.net/latest-anime-episodes/";
query = 'select * from html where url ="'+ hi +'" and xpath="//div[@class=\'noraml-page_in_box_mid\']//div[@class=\'noraml-page_in_box_mid_link\']//@href"';
yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';

$.getJSON(yqlAPI, function(r){
    $.each(r.query.results.a, function(){ 
         if(typeof this.href !== 'undefined')
          {
            lovemyAnime1.push([this.href, "(Sub)", ("http://www.lovemyanime.net"+this.href)]);
          }
    });
  gotFollowersOfB(lovemyAnime1);
});
}
//select * from html where url ="http://www.lovemyanime.net/latest-anime-episodes/" and xpath='//div[@class=\'noraml-page_in_box_mid\']//div[@class=\'noraml-page_in_box_mid_link\']'
function gotFollowersOfC(data)
{
    animeFreak1 = data;
    gotD = true;
    if (gotD && gotC && gotA && gotB) {
        Sync();
    }
}
//animefreak.tv
function animeFreak(){
hi = "http://www.animefreak.tv/tracker";
query = 'select * from html where url ="'+ hi +'" and xpath="//div[@class=\'view-content\']//tbody//tr//@href"';
yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';

$.getJSON(yqlAPI, function(r){
    $.each(r.query.results.a, function(){ 
      if(typeof this.href !== 'undefined')
          {
            animeFreak1.push([this.href, "(Sub)" , ("http://www.animefreak.tv"+this.href)]);
          }
    });
   gotFollowersOfC(animeFreak1);
});
}
function gotFollowersOfD(data)
{
    animeSeason1 = data;
    gotC = true;
    if (gotD && gotC && gotA && gotB) {
        Sync();
    }
}
//animeseason
function animeSeason(){
//select * from html where url ="http://www.animeseason.com/" and xpath='//div[@id=\'frontpage_left_col\']//@href'
hi = "http://www.animeseason.com/";
query = 'select * from html where url ="'+ hi +'" and xpath="//div[@id=\'frontpage_left_col\']//@href"';
yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';

$.getJSON(yqlAPI, function(r){
  var x=0;
    $.each(r.query.results.a, function(){ 
      x++;
       if(typeof this.href !== 'undefined' && x%3 ===0)
          {
             animeSeason1.push([this.href, "(Sub)", ("http://www.animeseason.com"+this.href)]);
            x=0;
          }
    });
  gotFollowersOfD(animeSeason1);
});
}
function Sync(){
  updates.push.apply(updates, gogoAnime1);
  updates.push.apply(updates, lovemyAnime1);
  updates.push.apply(updates, animeFreak1);
  updates.push.apply(updates, animeSeason1);
  isUp(updates);
  reset();
}
function reset(){
   gotA = false;
   gotB = false;
   gotC = false;
   gotD = false;
 gogoAnime1 = []; 
 lovemyAnime1 = []; 
  animeFreak1 = []; 
  animeSeason1 = [];
}
