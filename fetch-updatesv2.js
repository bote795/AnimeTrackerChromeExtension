var urls = ["http://www.gogoanime.com/","http://www.lovemyanime.net/latest-anime-episodes/", "http://www.animefreak.tv/tracker","http://www.animeseason.com/"];
var xpaths = ['xpath="//div[@class=\'post\']//li"',
			  'xpath="//div[@class=\'noraml-page_in_box_mid\']//div[@class=\'noraml-page_in_box_mid_link\']//@href"',
			  'xpath="//div[@class=\'view-content\']//tbody//tr//@href"'
			  ,'xpath="//div[@id=\'frontpage_left_col\']//@href"'];
    $.when
      ( 

      ).done
      ( function()
        {
         //finish geting info
        }
      );


   function function_name (argument) {
   for (var i = urls.length - 1; i >= 0; i--) 
   {
   	urls[i]
   	query = 'select * from html where url ="'+ urls[i] +'" and '+xpaths[i];
   	var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
   		$.getJSON(yqlAPI, function(r){
		    $.each(r.query.results.a, function(){ 
		         if(typeof this.href !== 'undefined')
		          {
		            lovemyAnime1.push([this.href, "(Sub)", ("http://www.lovemyanime.net"+this.href)]);
		          }
		   	 });
		}); //close json
   }
   
   }

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