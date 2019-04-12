//legende du media chart
function legend(svg){
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

function getInterMargin(totalSize, nbElements, elementSize) {
  return (totalSize - nbElements*elementSize)/(nbElements+1);
}

function debugLegend(legendGroup, xPos, columnSizes, legendHeight) {
  //DEBUG
  legendGroup.append("rect")
  .attr("x", xPos[0])
  .attr("y", 0)
  .attr("width", columnSizes[0])
  .attr("height", legendHeight)
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 0.5);
  legendGroup.append("rect")
  .attr("x", xPos[1])
  .attr("y", 0)
  .attr("width", columnSizes[1])
  .attr("height", legendHeight)
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 0.5);
  legendGroup.append("rect")
  .attr("x", xPos[2])
  .attr("y", 0)
  .attr("width", columnSizes[2])
  .attr("height", legendHeight)
  .attr("stroke", "black")
  .style("fill", "none")
  .attr("stroke-width", 0.5);
}

//legende du tweet chart pour le sentiment
//appelee par le main
function legendTweet(svg,g){
  //variables pour le positionnement
  var heightSvg = yMediasPosition + interCategorySpace*nbCategoriesDisplayed + axisMarginY + tweetVerticalMargin;
  updateSvgSize();
  var marginWidth = 4/100*svgBounds.width;
  var width = svgBounds.width-marginWidth;
  var marginHeight = 2/100*heightSvg;
  var yMainImg = heightSvg - marginHeight - tweetLegendHeight + tweetHeight;
  var rectHeight = (tweetLegendHeight-marginHeight)/2;
  var accoladeTextHeight = (tweetLegendHeight-marginHeight)/2;
  var transform = "translate("+0+","+yMainImg+")";
  //creation du groupe
  var grp = svg.append("g").attr("id", "legendImage").attr("opacity", 0).attr("transform",transform).attr("height", tweetLegendHeight);
  //ajout des 3 textes
  for(var i=0; i<3;i++){
    var grplegende=grp.append("g"); //on cree un groupe pour chaque car contenait aussi les accolades dans la version précédente

    grplegende.append("text")
    .text(function(d){
      if(i==0){
        return "Sentiment négatif";
      }
      if(i==1){
        return "Neutre";
      }
      if(i==2){
        return "Sentiment positif";
      }
      return;
    })
    .attr("x",marginWidth/2+(i+1/2)*width/3)
    .attr("y", rectHeight+accoladeTextHeight)
    .attr("text-anchor", "middle")
  }
}

//tweet legend nombre de retweets
//appelée par createTweetsBubbleChart
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
  //rectangle legende de couleur
  g.append("rect")
        .attr("width", gradientWidth)
        .attr("height",gradientHeight)
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
  g.attr("opacity","1")
}
