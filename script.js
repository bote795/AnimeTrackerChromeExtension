///this makes it work when website loading and fully loaded
(function($) {
   
    var jqReady = $.Deferred();
    // Bind doc ready to my deferred object
    $(document).bind("ready", jqReady.resolve);
    // Check to see is doc is ready
    if(jqReady.state() !== 'resolved'){
      
        $('a').on('click', function(e) {
         if (isSimpleClick(e)) {
          body(e);
        }
       });
        
    }
        
    $.when(jqReady).then(function () {
        // Code here will run when doc is ready/ state === 'resolved'
        
         $('a').on('click', function(e) {
         if (isSimpleClick(e)) {
          body(e);
        }
       });

    });
    //30min = 1800000 milliseconds
   // UpdateRequest();
   setInterval(function(){UpdateRequest();},1800000);
})(jQuery);
var isSimpleClick = function (event) {
  return (
    event.which   || // not a left click
    event.which ==3 ||
    event.metaKey ||     // "open link in new tab" (mac)
    event.ctrlKey ||     // "open link in new tab" (windows/linux)
    event.shiftKey    // "open link in new window"
  );
};
function body(e){
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
    //TODO run on specific websites only
    //ask if this is bad?for runtime
    else {
        chrome.runtime.sendMessage({method: "EpUpdate",
                                  sentUrl: e.currentTarget.href,
                                  title: $(e.currentTarget).text() },
        function (response) {
          if (response.status === 200) {
           // $(e.target).css("color", "green");
          }
        });
  }
}
function UpdateRequest(){
  chrome.runtime.sendMessage({method: "UpdateRequest"},
        function (response) {
          if (response.status === 200) {
            console.log("it worked");
           // $(e.target).css("color", "green");
          }
        });
}