/*
(function () {
  "use strict";
  console.log("test")

  // Configuration
  var nbHabitants = {"Québec": 8000000, "France": 66000000}; //TODO à compléter/changer

  var heightMedias = "1000px";
  var heightTweets = "1000px";

  var mediaMargin = {
    top: 0,
    right: 50,
    bottom: 0,
    left: 50
  }

  // Création des éléments

  var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", heightMedias)

  var files = { //TODO à compléter/changer
    QCMedias: "./data/QuebecMedia.csv",
    FRMedias: "./data/FranceMedia.csv",
    metadataMedias: "./data/metadataMedias.csv"
  }

  // Échelles

  var svgBounds = svg.node().getBoundingClientRect()
  var xMedias = d3.scaleLinear().range([svgBounds.left + mediaMargin.left, svgBounds.right - mediaMargin.right]);
  var rMedias = d3.scaleLinear().range([5, 20]);

  var xAxis = d3.axisBottom(x);

  // Chargement des données
  // Prétraitement des données



  // Création du mediaBubbles
  createMediaBubblesAxis(svg, xAxis, heightMedias, svgBounds.width - mediaMargin.left - mediaMargin.right);
  //createMediaBubbles()


})
*/






//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  d3.dsv(";", "./data/media_pays_followers.csv").then(function(mediasData){
    var tweetSources = createSources(data);
    var mediaSources = createMediaSources(tweetSources);

    var pays_population = createPays();
    var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([100, 500]);
    scaleBubbleSize(scaleBubbleSizeMediaChart, mediasData, pays_population);
    var mediasData = formatMediasData(mediasData);

    //création du svg
    var svg = d3.select("body")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "1000px")
      //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

    // Echelles
    var svgBounds = svg.node().getBoundingClientRect()
    var xMedias = d3.scaleLinear().range([svgBounds.left, svgBounds.right]);

    var xAxis = d3.axisBottom(xMedias);

    // Création du mediaBubbles
    createMediaBubblesAxis(svg, xAxis, heightMedias, svgBounds.width);

    //bubble chart ne signifie pas le bubble chart mais le graphique avec les tweets
    var mediaChartGroup = svg.append("g")
    var tweetsChartGroup = svg.append("g")
    tweetsChartGroup.attr("id","tweetBubbleChart")
    mediaChartGroup.attr("id","mediaBubbleChart")
    setUpMediaChart(tweetsChartGroup,mediaChartGroup,mediaSources,tweetSources)
  });
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
