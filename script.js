$(document).ready(function() {
  
  $('body').on('click', 'a', function(e) {
    if (e.shiftKey) {
      e.preventDefault();
      chrome.runtime.sendMessage({method: "sendURL",
                                  sentUrl: e.currentTarget.href,
                                  title: $(e.currentTarget).text() }, 
        function (response) {
          if (response.status === 200) {
            $(e.target).css("color", "green");
          }
        });
    }
    else if (e.ctrlKey) {

        chrome.runtime.sendMessage({method: "EpUpdate",
                                  sentUrl: e.currentTarget.href,
                                  title: $(e.currentTarget).text() },
        function (response) {
          if (response.status === 200) {
            $(e.target).css("color", "green");
          }
        });
  }
  else;
  });
});