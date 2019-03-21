
//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  //todo : on récupère le fichier csv qui contient les associa nom du media, compte_twitter du media, type de media, pays
  //on formate le fichier sources
  var tweetSources = createSources(data);
  var mediaSources = createMediaSources(tweetSources);

  //création du svg
  var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "1000px")
    //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

    //bubble chart ne signifie pas le bubble chart mais le graphique avec les tweets
  var mediaChartGroup = svg.append("g")
  var tweetsChartGroup = svg.append("g")
  tweetsChartGroup.attr("id","tweetBubbleChart")
  mediaChartGroup.attr("id","mediaBubbleChart")
  setUpMediaChart(tweetsChartGroup,mediaChartGroup,mediaSources,tweetSources)
});

function setUpMediaChart(tweetsChartGroup,mediaChartGroup,mediaSources,tweetSources){
  var bubbleSize = 100;
  var sizeBubbleScale = d3.scaleLinear().range([bubbleSize, bubbleSize]);
  var minXCoord = 500;
  var maxXCoord = 1000;
  var xBubbleScale = d3.scaleLinear().range([minXCoord, maxXCoord]);
  var initPosition = {"x":0,"y":0};
  mediaxScaleDomain(sizeBubbleScale,mediaSources);
  var bubbleGroups = createMediaBubbleChart(mediaChartGroup,mediaSources,initPosition,tweetsChartGroup,tweetSources);
  runMediaSimulation(mediaSources,bubbleGroups,sizeBubbleScale,xBubbleScale);
}
