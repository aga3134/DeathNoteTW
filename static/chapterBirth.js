
var g_ChapterBirth = function(){
  var loadGraph = function(){
  	g_MapTW.drawMapTW("#mapGraph",2009);
  	/*$.get("/populationByAge?county=總計", function(data){
  		console.log(data);
  	});*/
  }

  return {
    loadGraph: loadGraph
  }
}();