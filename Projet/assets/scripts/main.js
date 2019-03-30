//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/FranceMedia.csv").then(function(france_data) {
  d3.dsv("|","./data/QuebecMedia.csv").then(function(quebec_data) {
    d3.dsv(",", "./data/categories.csv").then(function(medias_data) {

      //Preprocessing
      var mediasData = formatMediasData(medias_data);
      //console.log(mediasData);
      var tweetSources = createSources(france_data.concat(quebec_data));
      var mediaSources = createMediaSources(tweetSources, mediasData);
      var mediaSplitMetadata = createMediaSplitMetadata();

      //Init filter checkbox values
      updateFilterCheck();

      // CREATION VIZ

      // création du svg
      var svg = d3.select("#sentimentViz")
        .append("svg")
        .attr("width", svgSetup.width)
        .attr("height", svgSetup.height)
        .attr("id","mediaSVG")

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

      updateWindowSize(svg);
      window.addEventListener("resize", function() { updateWindowSize(svg); });

      //ajout d'un titre


      //RANGE definitions
      //Medias
      var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([mediaBubblesSize.min, mediaBubblesSize.max]);
      var xMedias = d3.scaleLinear().range([xMediasPositions.min, xMediasPositions.max]);
      //Tweets
      var scaleBubbleSizeTweetChart =  d3.scaleLinear().range([tweetBubblesSize.min, tweetBubblesSize.max]);

      //DOMAIN definitions
      //Medias
      domainMediaBubbleSize(scaleBubbleSizeMediaChart, medias_data, countries_population);
      domainMediaXPosition(xMedias, mediaSources);
      //Tweets
      domainTweetBubbleSize(scaleBubbleSizeTweetChart, tweetSources);



      // Création du mediaBubbles
      createMediaBubblesXAxis(mediaXAxisGroup, mediaSplitMetadata);
      createMediaBubblesYAxis(mediaYAxisGroup, xMedias);
      updateMediaBubblesAxis();
      createMediaBubbleChart(mediaBubblesGroup, mediaSources, tweetsChartGroup, tweetSources, xMedias, localization.getFormattedNumber,scaleBubbleSizeMediaChart, scaleBubbleSizeTweetChart, mediasData);
      var grouptweetChartLegend = svg.append("g").attr("class", "chartTweetAndLgend")
      legend(svg, svgBounds, grouptweetChartLegend);
    });
  });
});
