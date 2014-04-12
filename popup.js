
$(document).ready( function() {
  //TODO allow user to add anime by typing name
  //use an autocompletefeature to complete anime name
  //allow user to add anime ep they are in by editing the number
  var arrayOfUrls = JSON.parse(localStorage["savedAnimes"]);
  var $target = $('.links ol');

  for (var i = 0; i < arrayOfUrls.length; i++) {
    var string = '<li id='+ i +'>' + arrayOfUrls[i][0] + 
                      '</a> EP: '+ arrayOfUrls[i][1]+'<button id='+ i +'>X</button></li>'
    $target.append(string);
  }
  
  $('button').on('click', function(e) {
    e.preventDefault();
    var id = parseInt(e.currentTarget.id);
    arrayOfUrls.splice(id, 1);
    localStorage["savedAnimes"] = JSON.stringify(arrayOfUrls);
    $('li#' + id).remove();
  });
});


