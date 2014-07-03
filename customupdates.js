$(document).ready(function(){
  var urls = ["http://www.lovemyanime.net/latest-anime-episodes/", "http://www.animefreak.tv/tracker","http://www.animeseason.com/", "http://www.gogoanime.com/"];
  var xpaths = ['xpath="//div[@class=\'noraml-page_in_box_mid\']//div[@class=\'noraml-page_in_box_mid_link\']//@href"',
          'xpath="//div[@class=\'view-content\']//tbody//tr//@href"'
          ,'xpath="//div[@id=\'frontpage_left_col\']//@href"','xpath="//div[@class=\'post\']//li"'];
  var realUrls = ["http://www.lovemyanime.net", "http://www.animefreak.tv", "http://www.animeseason.com", "http://www.gogoanime.com/"];
var urls =[
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
];
    $("#xpath").hide().removeClass('hide');
    $("#custom").hide().removeClass('hide');
    $("#confirmation").hide().removeClass('hide');
    $("#updatelist").change(function(){
      if ( $(this ).prop( "checked" ))
      {
           var temp=$("#sortable").sortable( "toArray" );
        setTimeout(function(){$('#updatelist').prop('checked',false);}, 3000); 
      alert("successfully submitted");
      }
    });
    $("#xpath_bool").change(function(){
        $("#xpath").toggle();
    });
  $("#sortable").sortable();
  $("#sortable").disableSelection();
  $.each( urls, function( index, value ){
     $("#sortable").append(create_li(index,value));
  });
 
  $("form").submit(function (e) {
    e.preventDefault();
    var self = this;
    var formId = this.id;  // "this" is a reference to the submitted form
    if(formId == "addUpdates")
      {
        //["url","//@href", "html",false, ""]
        var updates = ["url","//@href", "html",false, ""];
        if(Boolean(self.inputurl.value))
          {
            updates[0]=self.inputurl.value;
            if(self.xpath_bool.checked === true )
              {
                  if(Boolean(self.inputxpath.value))
                  {
                    updates[1]=self.inputxpath.value;
                  }
              }
            if(self.linktype.checked === true)
              {
                updates[2]="rss";
              }
              if(Boolean(self.urlcustom.value))
              {
                updates[4]=self.urlcustom.value;
              }
          }
        alert(updates);
        testLink(updates);
      }
});
});//ready
function create_li(id, data)
{
  return "<li id='" + id + 
    "' class='ui-state-default list-group-item'><span class='ui-icon ui-icon-arrowthick-2-n-s'></span> " +
   data +
  "</li>";
}
function testLink(temp)
{
  var query ="";
  var reply;
  if(temp[2]=="html")
    query = 'select * from html where url ="'+ temp[0] +'" and xpath="'+temp[1]+'"';
  else
    query ='select link from rss where url="'+temp[0]+'"';
  console.log(query);
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
  $.getJSON(yqlAPI, function(){
      console.log("sucess");
  })
      .success(function(r){
         var cutTest;
          console.log(r);
              //error catching
              if(typeof r === 'undefined' ||typeof r.query === 'undefined' || typeof r.query.results === 'undefined'|| r.query.results == null)
                {
                  console.log("Error");
                  $(".datareply").html("");
                  $(".datareply").append("Error");
                  
                }
               else if(temp[2]=="html")
                 {
                    $.each(r.query.results.a, function(){ 
                 if(typeof this.href !== 'undefined')
                  {
                    return false;
                  }
                }); // close each
                    console.log("sucess");  
                    cutTest =(r.query.count/2);
                   console.log( r.query.results.a[Math.floor(cutTest)].href);
                    $(".datareply").html("");
                   $(".datareply").append("Success <br> count:"+r.query.count+"<br>");
                   reply =similarRegex(temp[0],r.query.results.a[Math.floor(cutTest)].href);
                     $(".datareply").append(reply.message);
                      if (!reply.bool) 
                      {
                        addMainUrl(reply.url, reply.path, temp);
                        $("#confirmation").show();
                      }
                 }
              else //rss
                {
                   $.each(r.query.results.item, function(){ 
                 if(typeof this.link !== 'undefined')
                  {
                    return false;
                  }
                }); // close each
                    console.log("sucess");
                    cutTest =(r.query.count/2);
                  console.log( r.query.results.item[Math.floor(cutTest)].link);
                    $(".datareply").html("");
                  $(".datareply").append("Success <br> count:"+r.query.count+"<br>");
                  reply=similarRegex(temp[0],r.query.results.item[Math.floor(cutTest)].link);
                  $(".datareply").append(reply.message);
                }
               
      }); // close sucess
}
function similarRegex (url, test_path) {
  var myregexp = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
  var key = myregexp.exec(url);
  console.log(key);
  console.log(test_path);
  var mymatch = myregexp.exec(test_path);
  console.log(mymatch);
  var string="";
  if (mymatch === null) {
    var print=true;
    var tempString="";
    for (var x = 1; x < 4; x++) {
        if(typeof key[x] === 'undefined')
        {
          print =false;
        }
        else if (x == 3) 
        {
          tempString+=("."+key[x]);
        }
        else
          tempString+=key[x];
    }
    if (print) 
    {
      //{bool:  , message: , url: string, path: string}
      return {bool: false,message: "error in url returned by query <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>"+
      "This means that the link recieved from website doesn't come with complete link to nwe episodes <br>",
       url: tempString, path: test_path};
    }
    else
      return {bool: false,message: "error in url returned by query <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>"+
      "This means that the link recieved from website doesn't come with complete link to nwe episodes <br>",
      url: "", path: test_path};
  }
  else if(key === null)
  {
    return {bool: false,message:  "error in url typed <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>",
    url: "", path: ""};
  }
  else
  {
     string="test_path size:"+mymatch.length+" <br> url:"+ key.length+"<br>"+
     "main url: "+url+"<br>"+"Example url: "+test_path+"<br>";
    var counter=0;
    for (var i = 1; i < key.length; i++) 
    {
      if(typeof key[i] === 'undefined' || typeof mymatch[i]=== 'undefined')
        ;
      else if(key[i] ==mymatch[i])
        counter++;
    }
    string+= "Percentage of url being recieved from website : " + (counter/(key.length-2)) * 100+" %";
    //return string;
     return {bool: true,message: string,
    url: "", path: ""};
  }
}
 
 function addMainUrl(url, path, temp)
{
  var query;
  if(temp[4] != "" )
  {
   query = 'select * from html where url ="'+ temp[4]+path +'" and xpath="//@href"';   
  }
  else
   query = 'select * from html where url ="'+ url+path +'" and xpath="//@href"';

    console.log(query);
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
      $.getJSON(yqlAPI, function(){
          console.log("sucess");
      })
      .success(function(r){
         var cutTest;
          console.log(r);
       
          if(typeof r === 'undefined' ||typeof r.query === 'undefined' || typeof r.query.results === 'undefined'|| r.query.results == null)
            {
              console.log("Error");
              $(".datareply").html("");
              $(".datareply").append("Error attempt to try better path didn't work <br> try custom url");
              $("#custom").toggle();
              return false;
            }
           else if(temp[2]=="html")
             {
                $.each(r.query.results.a, function(){ 
             if(typeof this.href !== 'undefined')
              {
                return false;
              }
            }); // close each
                console.log("sucess");  
               $(".datareply").append("Success 2nd attempt <br>");
               return true;
             }
      });
} 

