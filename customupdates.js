$(document).ready(function(){
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
  "html",false, ""],
   ["http://www.crunchyroll.com/rss/anime",
  'xpath="/@href"',
  "rss",false, ""]
]);
    urls=JSON.parse(localStorage["savedUpdateAnimeList"]);
}
else
  urls=JSON.parse(localStorage["savedUpdateAnimeList"]);
    $("#xpath").hide().removeClass('hide');
    $("#custom").hide().removeClass('hide');
    $("#confirmation").hide().removeClass('hide');
    $("#readysumbit").prop({ disabled: true, checked: false });
    $("#updatelist").change(function(){
      if ( $(this ).prop( "checked" ))
      {
           var temp=$("#sortable").sortable( "toArray" );
          var newArray=[];
  for (var i = 0; i < temp.length; i++) 
  {
    newArray.push(urls[temp[i]][0],urls[temp[i]][1],urls[temp[i]][2],urls[temp[i]][3],urls[temp[i]][4]); 
  }
        alert(newArray);
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
     $("#sortable").append(create_li(index,value[0]));
  });
   $("#readysumbit").change(function(){
      if ( $(this ).prop( "checked" ))
      {
           var temp= JSON.parse($("#output").html());
        setTimeout(function(){$(this).prop('checked',false);}, 3000); 
      alert("successfully submitted : <br>"+temp);
        resetAddUpdatesUrl();
      }
    });
  $("form").submit(function (e) {
    e.preventDefault();
    var self = this;
    var formId = this.id;  // "this" is a reference to the submitted form
    if(formId == "addUpdates")
      {
        //["url","//@href", "html",false, ""]
        var updates = new Array("url","//@href", "html",false, "");
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
                updates[3]=true;
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
function resetAddUpdatesUrl()
{
    $("#xpath").hide();
    $("#custom").hide();
    $("#confirmation").hide();
    $("#addUpdates")[0].reset();
    $("#output").html("");
    $(".datareply").html("");

}
function testLink(temp)
{
  var query ="";
  var reply;
  var $target =$(".datareply");
  if(temp[2]=="html")
    query = 'select * from html where url ="'+ temp[0] +'" and xpath="'+temp[1]+'"';
  else
    query ='select link from rss where url="'+temp[0]+'"';
  console.log(query);
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
  $.getJSON(yqlAPI, function(){
      console.log("sucessesfully sent request for yqlapi 1st attempt");
  })
      .success(function(r){
         var cutTest;
              //error catching
              if(typeof r === 'undefined' ||typeof r.query === 'undefined' || typeof r.query.results === 'undefined'|| r.query.results == null)
                {
                  console.log("Error");
                  $target.html("");
                  $target.append("Error");
                  $target.addClass('alert alert-dismissable alert-danger');
                  
                }
              else if(temp[2]=="html")
                 {
                    var test = false;
                    $.each(r.query.results.a, function(){ 
                 if(typeof this.href === 'undefined')
                  {
                    $target.html("");
                    $target.append("Error");
                    test = true;
                    $target.addClass('alert alert-dismissable alert-danger');
                    return false;
                  }
                  else
                    return;
                  
                }); // close each
                    if(!test)
                    {
                      console.log("sucess");  
                    cutTest =(r.query.count/2);
                    console.log( r.query.results.a[Math.floor(cutTest)].href);
                    //display
                     $target.html("");
                     $target.append("Success <br> count:"+r.query.count+"<br>");
                     reply =similarRegex(temp[0],r.query.results.a[Math.floor(cutTest)].href);
                     $target.append(reply.message);
                     //check if url replyed by yql was good enough
                     //if false then test main url or url specificly typed by user
                      if (!reply.bool) 
                      {
                        addMainUrl(reply.url, reply.path, temp, isReady);
                      }
                      else
                        {
                          isReady({bool: false}, temp);
                          $target.addClass('alert alert-dismissable alert-success');
                        }
                        
                    }
                    
                 }
              else //rss
                {
                  var test = false;
                   $.each(r.query.results.item, function(){ 
                 if(typeof this.link === 'undefined')
                  {
                    $target.html("");
                    $target.append("Error");
                    test = true;
                     $target.addClass('alert alert-dismissable alert-danger');

                    return false;
                  }
                  else
                    return;
                }); // close each
                   if(!test)
                   {
                      console.log("sucess");
                      cutTest =(r.query.count/2);
                      console.log( r.query.results.item[Math.floor(cutTest)].link);
                      $target.html("");
                      $target.append("Success <br> count:"+r.query.count+"<br>");
                      reply=similarRegex(temp[0],r.query.results.item[Math.floor(cutTest)].link);
                      $target.append(reply.message);
                      isReady({bool: false}, temp);
                   }

                }
               
      }); // close sucess
}
//check if url replyed by yql is good enough
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
      "This means that the link recieved from website doesn't come with complete link to new episodes <br>",
       url: tempString, path: test_path};
    }
    else
      return {bool: false,message: "error in url returned by query <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>"+
      "This means that the link recieved from website doesn't come with complete link to new episodes <br>",
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
 
 function addMainUrl(url, path, temp, callback)
{
  var query;
  var sucessfulUrl;
  var $target = $(".datareply");
  if(temp[3])
  {
   query = 'select * from html where url ="'+ temp[4]+path +'" and xpath="//@href"';   
    sucessfulUrl=temp[4];
  }
  else
  {
    query = 'select * from html where url ="'+ url+path +'" and xpath="//@href"';
   sucessfulUrl=url;

  }

    console.log(query);
    var yqlAPI = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + ' &format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=?';
      $.getJSON(yqlAPI, function(){
          console.log("sucess");
      })
      .success(function(r){
         var cutTest;       
          if(typeof r === 'undefined' ||typeof r.query === 'undefined' || typeof r.query.results === 'undefined'|| r.query.results == null)
            {
              console.log("Error");
              $target.append("---------------------------------------------------------------");
              $target.append("Error attempt to try better path didn't work <br> try custom url");
              $("#custom").toggle();
              $target.addClass('alert alert-dismissable alert-danger');

              callback ({bool: false, url: ""}, temp);
            }
           else if(temp[2]=="html")
             {
                $.each(r.query.results.a, function(){ 
             if(typeof this.href === 'undefined')
              {
                $target.addClass('alert alert-dismissable alert-danger');
                callback({bool: false, url: ""}, temp);
              }
              else
                return;
            }); // close each
            $target.addClass('alert alert-dismissable alert-success');
                console.log("2nd attempt sucess should return");  
               $target.append("--------------------------------------------------------------- <br>");
               $target.append("Success 2nd attempt <br> url: "+sucessfulUrl);
               callback({bool: true, url: sucessfulUrl}, temp);
             }
      });
} 
function isReady (MainUrlTest, temp) {
    $("#confirmation").show();
    var $target = $("#readysumbit");
    if(MainUrlTest.bool)
    {
      $target.prop({ disabled: false});
      temp[3]=true;
      temp[4]=MainUrlTest.url;
      $("#output").append(JSON.stringify(temp));
    }
    else
    {
      $target.prop({ disabled: false});
      $("#output").append(JSON.stringify(temp));
        $target.prop('checked',true);
      //add 
    }
}