///this makes it work when website loading and fully loaded
(function($) {
    
    var jqReady = $.Deferred();
    // Bind doc ready to my deferred object
    $(document).bind("ready", jqReady.resolve);

    // Check to see is doc is ready
    if(jqReady.state() !== 'resolved'){
        $('body').on('click', 'a', function(e) {
         body(e);
       });
    }
        
    $.when(jqReady).then(function () {
        // Code here will run when doc is ready/ state === 'resolved'
        $('body').on('click', 'a', function(e) {
         body(e);
       });
    });
    
})(jQuery);
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