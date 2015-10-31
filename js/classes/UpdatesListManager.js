var UpdatesListManager =  function () {
    this.key = "savedUpdateAnimeList";
}
inheritsFrom(UpdatesListManager, Manager);

UpdatesListManager.prototype.default = function() {
	var default_values =  [
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
  "html",false, ""]
];
    this.save(default_values);
};

var UpdatesListManager = new UpdatesListManager(); 