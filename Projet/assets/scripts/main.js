//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/FranceMedia.csv").then(function(france_data) {
  d3.dsv("|","./data/QuebecMedia.csv").then(function(quebec_data) {
    d3.dsv(",", "./data/categories.csv").then(function(mediasData) {

      //PREPROCESSING
      var tweetSources = createSources(france_data.concat(quebec_data));
      var mediaSources = createMediaSources(tweetSources);

      //RANGE definitions
      //Medias
      var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([mediaBubblesSize.min, mediaBubblesSize.max]);
      var xMedias = d3.scaleLinear().range([xMediasPositions.min, xMediasPositions.max]);
      //Tweets
      var scaleBubbleSizeTweetChart =  d3.scaleLinear().range([tweetBubblesSize.min, tweetBubblesSize.max]);

      //DOMAIN definitions
      //Medias
      domainMediaBubbleSize(scaleBubbleSizeMediaChart, mediasData, countries_population);
      domainMediaXPosition(xMedias, mediaSources);
      //Tweets
      domainTweetBubbleSize(scaleBubbleSizeTweetChart, tweetSources);

      //FORMAT
      var mediasData = formatMediasData(mediasData);

      // CREATION VIZ

      // création du svg
      var svg = d3.select("body")
        .append("svg")
        .attr("width", svgSetup.width)
        .attr("height", svgSetup.height)

      // création des 2 groupes des 2 viz
      var mediaChartGroup = svg.append("g")
        .attr("id", "mediaBubbleChart")
      var tweetsChartGroup = svg.append("g")
        .attr("id", "tweetBubbleChart")

      // ajout d'un groupe pour les bulles des médias et pour les axes horizontaux
      var mediaXAxisGroup = mediaChartGroup.append("g")
        .attr("id", "mediaXAxis")
      var mediaYAxisGroup = mediaChartGroup.append("g")
        .attr("id", "mediaYAxis")
      var mediaBubblesGroup = mediaChartGroup.append("g")
        .attr("id", "mediaBubbles")

      //var mediaChartBounds = mediaChartGroup.node().getBoundingClientRect() //To compute the new bounds after CSS applied

      // Création du mediaBubbles
      createMediaBubblesXAxis(mediaXAxisGroup);
      createMediaBubblesYAxis(mediaYAxisGroup, xMedias);
      createMediaBubbleChart(mediaBubblesGroup, mediaSources, tweetsChartGroup, tweetSources, xMedias, localization.getFormattedNumber,scaleBubbleSizeMediaChart, scaleBubbleSizeTweetChart, mediasData);

    });
  });
});
