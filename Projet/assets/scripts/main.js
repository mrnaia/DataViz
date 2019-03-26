  //var svgBounds = svg.node().getBoundingClientRect()
  //var xMedias = d3.scaleLinear().range([svgBounds.left + mediaMargin.left, svgBounds.right - mediaMargin.right]);


//on récupère le fichier csv qui contient les tweets
d3.dsv("|","./data/FranceMedia.csv").then(function(france_data) {
  d3.dsv("|","./data/QuebecMedia.csv").then(function(quebec_data) {
    d3.dsv(",", "./data/categories.csv").then(function(mediasData) {

      var tweetSources = createSources(france_data.concat(quebec_data));
      var mediaSources = createMediaSources(tweetSources);

      var pays_population = createPays();
      var scaleBubbleSizeMediaChart =  d3.scaleLinear().range([5, 50]);
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
      //createMediaBubblesAxis(mediaChartGroup, xAxis, heightMedias, mediaChartBounds.width);
      //createMediaBubblesAxis(g, 250, 250, 500); //Changer où on stocke les valeurs
      setUpMediaChart(tweetsChartGroup,mediaBubblesGroup,mediaSources,tweetSources,pays_population,scaleBubbleSizeMediaChart, mediasData)
    });
  });
});
