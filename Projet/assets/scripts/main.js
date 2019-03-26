/*
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
  d3.dsv(";", "./data/categories.csv").then(function(mediasData){
    var tweetSources = createSources(data);
    var mediaSources = createMediaSources(tweetSources);

    var pays_population = createPays();
    var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([20, 100]);
    scaleBubbleSize(scaleBubbleSizeMediaChart, mediasData, pays_population);
    var mediasData = formatMediasData(mediasData);


    var heightMedias = 1000;

    //création du svg
    var svg = d3.select("body")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "1000px")
      //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);

    var mediaChartGroup = svg.append("g")
    var tweetsChartGroup = svg.append("g")
    var mediaBubblesGroup = mediaChartGroup.append("g");

    tweetsChartGroup.attr("id","tweetBubbleChart")
    mediaChartGroup
      .attr("id","mediaBubbleChart")
      .attr("height", heightMedias + "px")

    // Echelles
    var mediaChartBounds = mediaChartGroup.node().getBoundingClientRect()
    var xMedias = d3.scaleLinear().range([500, 1000]);
    mediaxScaleDomain(xMedias, mediaSources);
    var xAxis = d3.axisBottom(xMedias);
    xAxis.tickSize(5);
    xAxis.tickValues([xMedias.domain()[0], 0, xMedias.domain()[1]]);
    xAxis.tickFormat(d => {
      if (-0.01 < d && d < 0.01) return "0";
      else return localization.getFormattedNumber(d);
    })
    // Création du mediaBubbles
    createMediaBubblesAxis(mediaChartGroup, xAxis, heightMedias, mediaChartBounds.width);


    setUpMediaChart(tweetsChartGroup,mediaBubblesGroup,mediaSources,tweetSources,pays_population,scaleBubbleSizeMediaChart, mediasData)
  });
});

function setUpMediaChart(tweetsChartGroup,mediaChartGroup,mediaSources,tweetSources, pays_population,scaleBubbleSizeMediaChart, mediasData){
  var minXCoord = 500;
  var maxXCoord = 1000;
  var xBubbleScale = d3.scaleLinear().range([minXCoord, maxXCoord]);
  var initPosition = {"x":500,"y":250};
  mediaxScaleDomain(xBubbleScale,mediaSources);
  var mediaTip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('width',100)
    .offset([-10, 0]);

  var bubbleGroups = createMediaBubbleChart(mediaChartGroup,mediaSources,initPosition,tweetsChartGroup,tweetSources,mediaTip,localization.getFormattedNumber,pays_population,scaleBubbleSizeMediaChart, mediasData);

  mediaTip.html(function(d) {
    return getMediaTipText.call(this, d,localization.getFormattedNumber)
  });
  bubbleGroups.call(mediaTip);

  runMediaSimulation(mediaSources,bubbleGroups,scaleBubbleSizeMediaChart,xBubbleScale, mediasData, pays_population);
}
