"use strict";

function mediaSizeScaleDomain(x,source){
  // TODO: Change size in respect with popularity
  x.domain([d3.min(source,(d) => +d.number_tweets_and_RT),d3.max(source,(d) => +d.number_tweets_and_RT)]);
}

function domainMediaXPosition(x,source){
  x.domain([d3.min(source,(d) => +d.mean_sentiment),d3.max(source,(d) => +d.mean_sentiment)]);
}
/**
 * Crée les axes horizontaux du graphique à bulles des médias.
 *
 * @param g       Le groupe SVG dans lequel l'axe doit être dessiné.
 * @param y   La position en Y de l'axe à afficher.
 * @param x1   L'abscisse gauche du début de l'axe.
 * @param x2  L'abscisse droit de la fin de l'axe.
 */
function createMediaBubblesXAxis(g, xAxisMetadata) {
  // Dessiner l'axe des abscisses du graphique.
  var xAxisLine = g.selectAll("line")
    .data(xAxisMetadata)
    .enter()
    .append("line")

  xAxisLine.attr("x1", xMediasPositions.min - axisMarginX)
    .attr("x2", xMediasPositions.max + axisMarginX)
    .attr("y1", d => getMediaYPosition(d.country, d.category))
    .attr("y2", d => getMediaYPosition(d.country, d.category))
    .attr("stroke", "grey")
    //.attr("stroke-width", "1px")
    .attr("opacity", 0.5)
}

function createMediaBubblesYAxis(g, xMedias) {
  // Dessiner les axes verticaux du graphique.
  var verticalAxisBoundValues = {min: xMedias.invert(xMediasPositions.min - axisMarginX), max: xMedias.invert(xMediasPositions.max + axisMarginX)};

  for (let i=-10 ; i<=10 ; i++) {
    let sentimentValue = i/10;
    if (verticalAxisBoundValues.min < sentimentValue && sentimentValue < verticalAxisBoundValues.max) {
      let xVal = xMedias(sentimentValue);
      //Draw vertical line
      var verticalLine = g.append("line")
        .attr("x1", xVal)
        .attr("x2", xVal)
        .attr("y1", yMediasPosition - axisMarginY)
        .attr("y2", yMediasPosition + axisMarginY + interCategorySpace*(nbCategoriesDisplayed-1) )
        .attr("stroke", "grey")
        .attr("opacity", 0.5)
        .style("stroke-dasharray", "3 3");
      //Add text label
      var sentimentLabel = g.append("text")
        .text(sentimentValue)
        .attr("text-anchor", "middle")
        .attr("x", xVal)
        .attr("y", yMediasPosition - axisMarginY - 5)
        .attr("fill", "grey")
      if (i == 0) {
        verticalLine.attr("opacity", 1)
          .style("stroke-dasharray", "4 4");
        sentimentLabel.attr("font-weight", "bold");
      }
    }
  }
}

function updateMediaBubblesXAxis() {
  var g = d3.select("#mediaXAxis");
  var lines = g.selectAll("line")
    .transition()
    .duration(transitionAxisDuration)
    .attr("y1", d => getMediaYPosition(d.country, d.category))
    .attr("y2", d => getMediaYPosition(d.country, d.category))
  //France doesn't move
}

function updateMediaBubblesYAxis() {
  var g = d3.select("#mediaYAxis");
  g.selectAll("line")
    .transition()
    .duration(transitionAxisDuration)
    .attr("y2", yMediasPosition + axisMarginY + interCategorySpace*(nbCategoriesDisplayed-1))
}

function updateMediaBubblesAxis() {
  if (countryChecked && categoryChecked) {
    nbCategoriesDisplayed = 6;
  } else if (countryChecked) {
    nbCategoriesDisplayed = 2;
  } else if (categoryChecked) {
    nbCategoriesDisplayed = 3;
  } else {
    nbCategoriesDisplayed = 1;
  }
  updateMediaBubblesXAxis();
  updateMediaBubblesYAxis();
}

/**
 * Crée le graphique à bulles avec tous les médias
 *
 * @param g       Le groupe dans lequel le graphique à bulles doit être dessiné.
 * @param mediaSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié + un id)
 * @param initPosition
 * @param tweetsGg       Le groupe dans lequel le graphique à bulles des tweets doit être dessiné.
 * @param tweetSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié)
 */
function createMediaBubbleChart(g,mediaSources, tweetsG, tweetSources, mediaXScale,formatNumber,scaleBubbleSizeMediaChart, scaleBubbleSizeTweetChart, mediasData){
  var mediaTip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('width', 100)
    .offset([-10, 0])
    .html(d => getMediaTipText.call(this, d, localization.getFormattedNumber));

  var mediaBubbleGroups = g.selectAll("g").data(mediaSources);
  var countryColor = colorCountry();
  var borderColor = colorCategory();
  //console.log("createMediaBubbleChart");
  //console.log(mediaBubbleGroups);
  var mediaG = mediaBubbleGroups.enter().append("g"); //mediaG is the group over each media circle
  //pour chaque media on crée un cercle
  mediaG.append("circle")
    .attr("r",function(d){
      if(d.name in mediasData){
        return scaleBubbleSizeMediaChart(+mediasData[d.name].Followers/+countries_population[d.Pays]);
      }
      else{
        console.log("pas d'infos");
        return 10;
      }
    })
  //.attr("r", (d) => 10)//Math.sqrt(x(d.retweet_count))) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
  .attr("style","opacity:1")
  .attr("fill",function(d){
    if([d.name] in mediasData){
      return countryColor(d.Pays);//d3.interpolateRdYlGn(d.mean_sentiment/2 +0.5))
    }
  })
  .attr("stroke", function(d){
    if([d.name] in mediasData){
      return borderColor(d.Categorie);
    }
  })
  .attr("stroke-width", 3)
  .datum(function(d){
    d.x = initPosition.x+Math.random()*5;
    d.y = initPosition.y+Math.random()*5;
    return d;
  })
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .on("click", function(d){
    var mouseCoordinates= d3.mouse(this);
    let initPosition = {"x":mouseCoordinates[0], "y":mouseCoordinates[1]}
    launchTweetsBubbleChart(tweetsG,scaleBubbleSizeTweetChart,tweetSources[d.name].tweets,initPosition,formatNumber)
    //setUpTweetChart(tweetsG,tweetSources[d.name].tweets,initPosition,formatNumber)
  })
  .on('mouseover', mediaTip.show)
  .on('mouseout', mediaTip.hide);

  mediaBubbleGroups = mediaBubbleGroups.merge(mediaG);

  mediaBubbleGroups.call(mediaTip);

  /*
  var checkPays = d3.select("#filterCountry");
  checkPays.on("click", function(d){
    //console.log(this.checked);
    splitCountry(this.checked, mediaBubbleGroups, mediaSources, scaleBubbleSizeMediaChart, mediaXScale, mediasData);
  });
  */
  runMediaSimulation(mediaSources, mediaBubbleGroups, scaleBubbleSizeMediaChart, mediaXScale, mediasData);
}

function updateFilterCheck() {
  countryChecked = d3.select("#filterCountry").property("checked");
  categoryChecked = d3.select("#filterCategory").property("checked");
}

function getMediaTipText(d, formatNumber){
  var tipText = "";
  tipText += "[Insert real media name]<br>"
  tipText += "<span><strong>" + d.name + "</strong></span><br>";
  tipText += "<span>Sentiment moyen: <strong>" + formatNumber(d.mean_sentiment) + "</strong></span><br>";
  tipText += "<span>Nombre de tweet et retweet moyen: <strong>" + formatNumber(d.number_tweets_and_RT) + "</strong></span>";
  return tipText;

}
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
