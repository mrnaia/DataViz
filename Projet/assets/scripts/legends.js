/**
 * Créer la légende du media chart
 * @param  {d3 selection} svg Le svg global
 */
function mediaChartLegend(svg){
  //parametres pour la position
  const legendHeight = topMediaMarginY-50;
  const horizontalLegendMargin = 5;

  const columnSizes = [120, 89, 85]; //in px
  const nbColumns = columnSizes.length;

  const circleDiameter = 10;
  const diameters = [circleDiameter+5, circleDiameter, circleDiameter-5];

  const legendFontSize = 13;

  columnSizes.reverse();
  var xPos = [svgBounds.width - columnSizes[0]]; //xPos is inverted, legend completion direction <--
  for (let i = 1 ; i < nbColumns ; i++){
    xPos.push(xPos[i-1] - columnSizes[i]);
  }
  //creation du groupe
  var legendGroup = svg.append("g")
    .attr("class", "legend");

  //Type of media
  var legendMediaType = legendGroup.append("g");
  var categories = Object.keys(categoriesColors);
  var nbCategories = categories.length;
  var categoriesYMargin = getInterMargin(legendHeight, nbCategories, circleDiameter);

  //DEBUG
  //debugLegend(legendGroup, xPos, columnSizes, legendHeight);

  //pour chaque categorie, on crée un cercle et un texte
  var counter = 0;
  categories.forEach(function(category){
    counter++;
    legendMediaType.append("circle")
      .attr("cx", xPos[0] + circleDiameter/2)
      .attr("cy", counter*categoriesYMargin + (counter-1)*circleDiameter + circleDiameter/2)
      .attr("r", circleDiameter/2)
      .attr("stroke", categoriesColors[category])
      .attr("stroke-width", 3)
      .style("fill","white");

    legendMediaType.append("text")
    .attr("x", xPos[0] + circleDiameter + horizontalLegendMargin)
    .attr("y", counter*categoriesYMargin + (counter-1)*circleDiameter + circleDiameter)
    .attr("font-size", legendFontSize+"px")
    .text(categoriesNames[category]);
  })

  //Type of media
  var legendCountry = legendGroup.append("g");
  var countries = Object.keys(countriesColors);
  var nbCountries = countries.length;
  var countriesYMargin = getInterMargin(legendHeight, nbCountries, circleDiameter);

  counter = 0;
  countries.forEach(function(country){
    counter++;
    legendCountry.append("circle")
      .attr("cx", xPos[1] + circleDiameter/2)
      .attr("cy", counter*countriesYMargin + (counter-1)*circleDiameter + circleDiameter/2)
      .attr("r", circleDiameter/2)
      .attr("stroke", "grey")
      .attr("stroke-width", 1)
      .style("fill", countriesColors[country]);

    legendCountry.append("text")
    .attr("x", xPos[1] + circleDiameter + horizontalLegendMargin)
    .attr("y", counter*countriesYMargin + (counter-1)*circleDiameter + circleDiameter)
    .attr("font-size", legendFontSize+"px")
    .text(categoriesNames[country]);
  })

  //Size of bubbles signification
  var legendBubbleSize = legendGroup.append("g");
  var bubbleSizeYMargin = (legendHeight - 15 - diameters[2])/3;
  var newYPos = bubbleSizeYMargin*2 + 15 + diameters[2]/2;
  legendBubbleSize.append("text")
    .attr("text-anchor", "middle")
    .attr("x", xPos[2] + columnSizes[2]/2)
    .attr("y", bubbleSizeYMargin)
    .attr("font-size", legendFontSize+"px")
    .text("Popularité")
  legendBubbleSize.append("text")
    .attr("text-anchor", "middle")
    .attr("x", xPos[2] + columnSizes[2]/2)
    .attr("y", bubbleSizeYMargin + 15)
    .attr("font-size", legendFontSize+"px")
    .text("Twitter")
  diameters.forEach(d => {
    legendBubbleSize.append("circle")
      .attr("cx", xPos[2] + columnSizes[2]/2)
      .attr("cy", newYPos)
      .attr("r", d)
      .attr("fill", "#f8f8f8")
      .attr("stroke", "grey")
    newYPos += circleDiameter/2;
  })
}
/**
 * Calcul la marge vertical entre des elements
 * @param  {number} totalSize   La taille total du conteneur
 * @param  {number} nbElements  Le nombre d'éléments dans le conteneur
 * @param  {number} elementSize La taille de chaque éléments
 * @return {number}             La marge à mettre en chaque éléments de façon à bien les répartir
 */
function getInterMargin(totalSize, nbElements, elementSize) {
  return (totalSize - nbElements*elementSize)/(nbElements+1);
}
/**
 * Appelée par createTweetsBubbleChart, crée la légende des tweets
 * @param  {d3 selection} g Le groupe qui contiendra la légende
 */
function createTweetLegend(g){
  //linear gradient pour la legende des couleurs
  var linearGradient = g.append("defs")
              .append("linearGradient")
              .attr("id", "linear-gradient");
  linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", middleColor);
  linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", redColor);
  //variables de positionnement
  var gradientHeight = 10;
  var gradientWidth = svgBounds.width * 0.10;
  var leftMargin = 3;
  var yGradient = yMediasPosition + (nbCategoriesDisplayed-1)*interCategorySpace + axisMarginY + tweetVerticalMargin;

  gradientWidth = gradientWidth<140 ? 140 : gradientWidth;

  //rectangle legende de couleur
  g.append("rect")
    .attr("width", gradientWidth)
    .attr("height", gradientHeight)
    .style("fill", "url(#linear-gradient)")
    .attr("x",svgBounds.width - gradientWidth - leftMargin)
    .attr("y", yGradient)
  //textes
  g.append("text")
    .text("0")
    .attr("x",svgBounds.width - gradientWidth - leftMargin)
    .attr("y", yGradient + gradientHeight*3)
    .attr("text-anchor", "middle");

  g.append("text")
    .text("Nombre de retweets")
    .attr("x",svgBounds.width - leftMargin)
    .attr("y", yGradient - gradientHeight)
    .attr("text-anchor", "end");

  g.append("text")
    .text("+")
    .attr("x",svgBounds.width - leftMargin)
    .attr("y", yGradient + gradientHeight*3)
    .attr("text-anchor", "middle");

  //Texte du bas
  g.append("text")
    .text("Sentiment négatif")
    .attr("y",yGradient + tweetHeight + tweetLegendMargin*2)
    .attr("x",tweetHorizontalMargin)
    .attr("text-anchor", "begin");

  g.append("text")
    .text("Sentiment neutre")
    .attr("y",yGradient + tweetHeight + tweetLegendMargin*2)
    .attr("x",svgBounds.width/2)
    .attr("text-anchor", "middle");

  g.append("text")
    .text("Sentiment positif")
    .attr("y",yGradient + tweetHeight + tweetLegendMargin*2)
    .attr("x",svgBounds.width - tweetHorizontalMargin)
    .attr("text-anchor", "end");

  g.attr("opacity","1")

  //Add the word cloud

  //Button
  gradientWidth = gradientWidth<150 ? 150 : gradientWidth;
  var buttonWCGroup = g.append("g").classed("wordCloudButtonG", "true")
  buttonWCGroup.append("path")
    .attr("d", rectBorderRadius(3, yGradient, gradientWidth, 30, 15))
    .classed("wordCloudButton", "true")
  buttonWCGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("x", gradientWidth/2)
    .attr("y", yGradient + 20)
    .attr("fill", "white")
    .text("Voir le wordcloud")
}
