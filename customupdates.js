$(document).ready(function(){
  var urls = ["http://www.lovemyanime.net/latest-anime-episodes/", "http://www.animefreak.tv/tracker","http://www.animeseason.com/", "http://www.gogoanime.com/"];

    $("#xpath").hide().removeClass('hide');
    $("#updatelist").change(function(){
      if ( $(this ).prop( "checked" ))
      {
          alert($("#sortable").sortable( "toArray" ));
          $('#updatelist').prop('checked',false);
      }
    });
    $("#xpath_bool").change(function(){
        $("#xpath").toggle();
    });
  $("#sortable").sortable();
  $("#sortable").disableSelection();  
  $("#sortable").append(create_li(8,"item 8"));
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
                    $(".datareply").html("");
                   $(".datareply").append("Success");

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
                    $(".datareply").html("");
                   $(".datareply").append("Success");
                 
                }
               
      }); // close sucess
}