var Manager = function() {
	//key for storing tasks
    this.key = "key";
 };       
    Manager.prototype.load = function(){
        if (localStorage[this.key] == undefined) //if we dont have data in localStorage
        {
            this.syncGet([]);
        }
        else
        {
            //if we have data in localStorage
            this.syncGet(localStorage[this.key]);
            
        }
    	return JSON.parse(localStorage[this.key]);
    };
    Manager.prototype.save = function(Array){
			localStorage[this.key]=JSON.stringify(Array);
			this.syncSave(Array);
    };
    Manager.prototype.syncSave = function (array) {
        var save={};
        save[this.key]=array;
		chrome.storage.sync.set(save, function() {
			if (chrome.runtime.error) {
				console.log("Runtime error.");
			}
		});
    }
    Manager.prototype.syncGet = function (array) {
        var tempThis=this;
        chrome.storage.sync.get(this.key, function(obj) {
            if (!chrome.runtime.error && obj[tempThis.key] != undefined) {
                    localStorage[tempThis.key]=JSON.stringify(obj[tempThis.key]);
                }
            else //key doesn't exist 
                tempThis.save(array); 
        });
    }
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};