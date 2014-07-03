$(document).ready(function(){
  var urls = ["http://www.lovemyanime.net/latest-anime-episodes/", "http://www.animefreak.tv/tracker","http://www.animeseason.com/", "http://www.gogoanime.com/"];

    $("#xpath").hide().removeClass('hide');
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
        var updates = ["url","//@href", "html"];
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
                     $(".datareply").append(similarRegex(temp[0],r.query.results.a[Math.floor(cutTest)].href));

                 }
              else
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
                                       $(".datareply").append(similarRegex(temp[0],r.query.results.item[Math.floor(cutTest)].link));

                 
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
    return "error in url returned by query <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>"+
    "This means that the link recieved from website doesn't come with complete link to nwe episodes <br>";
  }
  else if(key === null)
  {
    return "error in url typed <br>"+"main url: "+url+"<br>"+"Example url: "+test_path+"<br>";
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
    return string;
  }
}
 
 function addMainUrl(url, path)
{

  var query = 'select * from html where url ="'+ url+path +'" and xpath="//@href"';

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
              $(".datareply").append("Error attempt to try better path didn't work");
              
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
                 $(".datareply").append(similarRegex(url,r.query.results.a[Math.floor(cutTest)].href));

             }
      });
} 
 
 
 