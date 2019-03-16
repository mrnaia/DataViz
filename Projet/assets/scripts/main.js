
//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  //todo : on récupère le fichier csv qui contient les associa nom du media, compte_twitter du media, type de media, pays
  //on formate le fichier sources
  var sources = createSources(data);

  //création du svg
  var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "1000px")
    //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

    //bubble chart ne signifie pas le bubble chart mais le graphique avec les tweets
  var bubbleChartGroup = svg.append("g")
  //tailles des oiseaux
  var maxBubbleSize = 400;
  var minBubbleSize = 10;
  var xBubbleScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);

  ////////////////////////////////////////////////////////
  //code de test temporaire
  //création du chart des tweets pour le media TVAnouvelles qui apparait quand on clique
  var source = sources["@tvanouvelles"].tweets;
  sizeScaleDomain(xBubbleScale,source);
  d3.select("body").on("click",function(){
    var mouseCoordinates= d3.mouse(this);
    var initPosition = {"x":mouseCoordinates[0],"y":mouseCoordinates[1]}
    launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition)
  })
});

//récupère l'image de l'oiseau puis crée le graphique
function launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition){
    jQuery.get("assets/images/bird.svg", function(svgData) {
      var $svg = jQuery(svgData).find('svg');
      var bubbleGroups = createTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition,$svg);
      runTweetSimulation(source,bubbleGroups,xBubbleScale);
    },'xml');
}
