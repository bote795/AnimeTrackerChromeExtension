var Manager = function() {
	//key for storing tasks
    this.key = "key";
 };       
    Manager.prototype.load = function(){
        if (localStorage[this.key] == undefined) 
        {
            localStorage[this.key]= JSON.stringify([]);
        };
    	return JSON.parse(localStorage[this.key]);
    };
    Manager.prototype.save = function(Array){
			localStorage[this.key]=JSON.stringify(Array);
			this.sync(Array);
    };
    Manager.prototype.sync = function (array) {
        var save={};
        save[this.key]=array;
		chrome.storage.sync.set(save, function() {
			if (chrome.runtime.error) {
				console.log("Runtime error.");
			}
		});
    }

var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};