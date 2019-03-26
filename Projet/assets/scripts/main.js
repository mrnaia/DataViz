//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/FranceMedia.csv").then(function(france_data) {
  d3.dsv("|","./data/QuebecMedia.csv").then(function(quebec_data) {
    d3.dsv(",", "./data/categories.csv").then(function(mediasData) {

      var tweetSources = createSources(france_data.concat(quebec_data));
      var mediaSources = createMediaSources(tweetSources);

      // SETUP values
      var svgSetup = {height: "1000", width: "100%"};

      // Media bubble chart

      var pays_population = {France: 67190000, Quebec: 8390000};

      var mediaBubblesSize = {min: 5, max: 50};
      var xMediasPositions = {min: 500, max: 1000};
      var axisMargin = 50;

      var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([mediaBubblesSize.min, mediaBubblesSize.max]);
      var xMedias = d3.scaleLinear().range([xMediasPositions.min, xMediasPositions.max]);

      scaleBubbleSize(scaleBubbleSizeMediaChart, mediasData, pays_population);
      var mediasData = formatMediasData(mediasData);

      // Tweets bubble chart



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
      var mediaBubblesGroup = mediaChartGroup.append("g")
        //.attr("id", "mediaBubbles")
        .attr("height", "1000px");
      var mediaAxisGroup = mediaChartGroup.append("g")
        //.attr("id", "mediaAxis")

      // Echelles
      var mediaChartBounds = mediaChartGroup.node().getBoundingClientRect()

      mediaxScaleDomain(xMedias, mediaSources);


      // Création du mediaBubbles
      //createMediaBubblesAxis(mediaChartGroup, xAxis, heightMedias, mediaChartBounds.width);
      createMediaBubblesAxis(mediaChartGroup, 250, xMediasPositions.min - axisMargin, xMediasPositions.max + axisMargin);

      setUpMediaChart(tweetsChartGroup,mediaBubblesGroup,mediaSources,tweetSources,pays_population,scaleBubbleSizeMediaChart, mediasData)
    });
  });
});
