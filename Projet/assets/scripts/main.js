//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/FranceMedia.csv").then(function(france_data) {
  d3.dsv("|","./data/QuebecMedia.csv").then(function(quebec_data) {
    d3.dsv(",", "./data/categories.csv").then(function(medias_data) {
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

      //initialisation des constantes qui dépendent de la taille de la fenêtre
      updateWindowSize(svg);
      //pour être responsive
      window.addEventListener("resize", function() { updateWindowSize(svg); });

      //nombre de buckets du tweet chart depend de la taille de la fenetre
      tweetsSquareSize = (svgBounds.width - 2*tweetHorizontalMargin) / (numberBucket * nbColumnPerBucket);
      if(tweetsSquareSize<4){
        nbColumnPerBucket = Math.floor(nbColumnPerBucket/2);
        numberBucket = Math.floor(numberBucket/2)+1;
        tweetsSquareSize = (svgBounds.width - 2*tweetHorizontalMargin) / (numberBucket * nbColumnPerBucket);
      }

      //Preprocessing
      var mediasData = formatMediasData(medias_data);
      var tweetSources = createSources(france_data.concat(quebec_data));
      var mediaSources = createMediaSources(tweetSources, mediasData);
      var mediaSplitMetadata = createMediaSplitMetadata();

      //RANGE definitions
      //Medias
      var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([mediaBubblesSize.min, mediaBubblesSize.max]); //scale pour la taille des bulles
      var xMedias = d3.scaleLinear().range([xMediasPositions.min, xMediasPositions.max]); //scale pour la position en x
      //Tweets
      //scale pour la couleur des tweets
      var tweetColorScale = d3.scaleLinear()
              .range([middleColor,redColor])
              .interpolate(d3.interpolateHcl);

      //search bar initialisation
      initSearchMediasBar(mediaSources, mediaChartGroup, tweetsChartGroup, tweetColorScale, tweetSources);

      //DOMAIN definitions
      //Medias
      domainMediaBubbleSize(scaleBubbleSizeMediaChart, medias_data, countries_population);
      domainMediaXPosition(xMedias, mediaSources);
      //Tweets
      domainTweetColorScale(tweetColorScale, tweetSources);

      // Création des axes mediaBubbles
      createMediaBubblesXAxis(mediaXAxisGroup, mediaSplitMetadata);
      createMediaBubblesYAxis(mediaYAxisGroup, xMedias);
      updateMediaBubblesAxis();
      //place filters et legendes
      var grouptweetChartLegend = tweetsChartGroup.append("g").attr("class", "chartTweetAndLgend")
      mediaChartLegend(svg); // a besoin d'etre appelé avant createMediaBubbleChart car set une valeur utilisée pour psitionner le titre du chart
      createSentimentArrow(svg, xMedias);

      //creation du media chart
      createMediaBubbleChart(mediaBubblesGroup, mediaSources, tweetsChartGroup, tweetSources, xMedias, localization.getFormattedNumber,scaleBubbleSizeMediaChart, tweetColorScale, mediasData);
      d3.select(".filtres")
      .attr("transform","translate("+svgBounds.x+","+svgBounds.y+")")
      .attr("hidden",null)

      //drawWordCloud(d3.select(".worldCloudTip"), "@BFMTV", tweetSources);
    });
  });
});
