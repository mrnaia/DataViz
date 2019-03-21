
//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  d3.dsv(";", "./data/media_pays_followers.csv").then(function(mediasData){


    //todo : on récupère le fichier csv qui contient les associa nom du media, compte_twitter du media, type de media, pays
    //on formate le fichier sources
    var sources = createSources(data);
    var pays_population = createPays();
    var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([100, 500]);
    scaleBubbleSize(scaleBubbleSizeMediaChart, mediasData, pays_population);

    var mediasData = formatMediasData(mediasData);
    //console.log(mediasData);
      //création du svg
    var svg = d3.select("body")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "1000px")
    //console.log(svg.node().getBoundingClientRect());
      //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

      //bubble chart ne signifie pas le bubble chart mais le graphique avec les tweets
    var bubbleChartGroup = svg.append("g")
    //testTweetChart(bubbleChartGroup,sources,"@tvanouvelles")
    testMediaChart(bubbleChartGroup,sources);
  });
});

function testMediaChart(bubbleChartGroup,sources){
  var bubbleSize = 100;
  var sizeBubbleScale = d3.scaleLinear().range([bubbleSize, bubbleSize]);
  var minXCoord = 500;
  var maxXCoord = 1000;
  var xBubbleScale = d3.scaleLinear().range([minXCoord, maxXCoord]);
  var mediaSources = createMediaSources(sources);
  d3.select("body").on("click",function(){
    var mouseCoordinates= d3.mouse(this);
    var initPosition = {"x":mouseCoordinates[0],"y":mouseCoordinates[1]}
    launchMediaBubbleChart(bubbleChartGroup,xBubbleScale,sizeBubbleScale,mediaSources,initPosition)
  })
}

//récupère l'image de l'oiseau puis crée le graphique
function launchMediaBubbleChart(bubbleChartGroup,xBubbleScale,sizeBubbleScale,source,initPosition){
  mediaxScaleDomain(sizeBubbleScale,source);
  var bubbleGroups = createMediaBubbleChart(bubbleChartGroup,source,initPosition);
  runMediaSimulation(source,bubbleGroups,sizeBubbleScale,xBubbleScale);
}


function testTweetChart(bubbleChartGroup,sources,searchTerm){
  //tailles des oiseaux tweets
  var maxBubbleSize = 500;
  var minBubbleSize = 50;
  var xBubbleScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);

  ////////////////////////////////////////////////////////
  //code de test temporaire
  //création du chart des tweets pour le media TVAnouvelles qui apparait quand on clique
  var source = sources[searchTerm].tweets;
  sizeScaleDomain(xBubbleScale,source);



  d3.select("body").on("click",function(){
    var mouseCoordinates= d3.mouse(this);
    var initPosition = {"x":mouseCoordinates[0],"y":mouseCoordinates[1]}
    launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition)
  })
}



//récupère l'image de l'oiseau puis crée le graphique
function launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition){
    jQuery.get("assets/images/bird.svg", function(svgData) {
      var $svg = jQuery(svgData).find('svg');
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('width',100)
        .offset([-10, 0]);
      var bubbleGroups = createTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition,$svg,tip);

      tip.html(function(d) {
        return getTipText.call(this, d)
      });
      bubbleGroups.call(tip);
      runTweetSimulation(source,bubbleGroups,xBubbleScale);
    },'xml');
}
