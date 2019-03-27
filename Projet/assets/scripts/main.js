//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/FranceMedia.csv").then(function(france_data) {
  d3.dsv("|","./data/QuebecMedia.csv").then(function(quebec_data) {
    d3.dsv(",", "./data/categories.csv").then(function(mediasData) {

      //Preprocessing
      var tweetSources = createSources(france_data.concat(quebec_data));
      var mediaSources = createMediaSources(tweetSources);

      //Range definitions
      var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([mediaBubblesSize.min, mediaBubblesSize.max]);
      var xMedias = d3.scaleLinear().range([xMediasPositions.min, xMediasPositions.max]);

      domainBubbleSize(scaleBubbleSizeMediaChart, mediasData, countries_population);
      var mediasData = formatMediasData(mediasData);

      // CREATION des visualisations

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
      var mediaAxisGroup = mediaChartGroup.append("g")
        .attr("id", "mediaAxis")
      var mediaBubblesGroup = mediaChartGroup.append("g")
        .attr("id", "mediaBubbles")

      // Echelles
      var mediaChartBounds = mediaChartGroup.node().getBoundingClientRect()

      mediaxScaleDomain(xMedias, mediaSources);


      // Création du mediaBubbles
      createMediaBubblesXAxis(mediaAxisGroup, yMediasPosition, xMediasPositions.min - axisMargin, xMediasPositions.max + axisMargin);

      setUpMediaChart(tweetsChartGroup,mediaBubblesGroup,mediaSources,tweetSources,countries_population,scaleBubbleSizeMediaChart, mediasData, xMedias)
    });
  });
});
