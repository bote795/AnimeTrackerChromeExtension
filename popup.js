$(document).ready( function() {
  var arrayOfUrls = JSON.parse(localStorage["savedUrls"]);
  var $target = $('.links ol');

  for (var i = 0; i < arrayOfUrls.length; i++) {
    var string = '<li id='+ i +'><a href=' + arrayOfUrls[i][0] + '>' + arrayOfUrls[i][1] + 
                      '</a> EP: '+ arrayOfUrls[i][2]+'<button id='+ i +'>X</button></li>'
    $target.append(string);
  }
  
  $('button').on('click', function(e) {
    e.preventDefault();
    var id = parseInt(e.currentTarget.id);
    arrayOfUrls.splice(id, 1);
    localStorage["savedUrls"] = JSON.stringify(arrayOfUrls);
    $('li#' + id).remove();
  });
});


