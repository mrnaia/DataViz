"use strict";
//Fonctions relatives au media chart (celui du haut)

//domaine pour la scale en x
function domainMediaXPosition(x,source){
  var maxAbsSentiment = d3.max(source, d => Math.abs(+d.mean_sentiment));
  x.domain([-maxAbsSentiment, maxAbsSentiment]);
}

//fleches pour la legende de l'axe x
function createSentimentArrow(g, xMedias) {
  var longueurArrow = 40;
  var axisTitle = g.append("text")
    .text("sentiment")
    .attr("text-anchor", "middle")
    .attr("x", xMedias(0))
    .attr("y", yMediasPosition - axisMarginY - 27)
    .attr("fill", "grey")
    .attr("font-size", "0.8em")
  var legendAxis = g.append("g");
  g.append("svg:defs").append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "grey");

  legendAxis.append("line")
    .attr("class", "legend_arrow")
    .attr("x1", xMedias(0)-30)
    .attr("y1",yMediasPosition - axisMarginY - 30)
    .attr("x2", xMedias(0)-30-longueurArrow)
    .attr("y2", yMediasPosition - axisMarginY - 30)
    .attr("stroke-width", 1)
    .attr("stroke", "grey")
    .attr("marker-end", "url(#triangle)");
    legendAxis.append("text")
    .text("-")
    .attr("text-anchor", "middle")
    .attr("x", xMedias(0)-30-longueurArrow/2)
    .attr("y", yMediasPosition - axisMarginY - 30)
    .attr("fill", "grey")

  legendAxis.append("line")
    .attr("class", "legend_arrow")
    .attr("x1", xMedias(0)+30)
    .attr("y1", yMediasPosition - axisMarginY - 30)
    .attr("x2", xMedias(0)+30+longueurArrow)
    .attr("y2", yMediasPosition - axisMarginY - 30)
    .attr("stroke-width", 1)
    .attr("stroke", "grey")
    .attr("marker-end", "url(#triangle)");
  legendAxis.append("text")
    .text("+")
    .attr("text-anchor", "middle")
    .attr("x", xMedias(0)+30+longueurArrow/2)
    .attr("y", yMediasPosition - axisMarginY - 30)
    .attr("fill", "grey")
}

/**
 * Crée les axes horizontaux du graphique à bulles des médias.
 *
 * @param g       Le groupe SVG dans lequel l'axe doit être dessiné.
 * @param xAxisMetadata
 */
function createMediaBubblesXAxis(g, xAxisMetadata) {
  // Dessiner l'axe des abscisses du graphique.
  //creer le groupe
  var xAxisLine = g.selectAll("g")
    .data(xAxisMetadata)
    .enter()
    .append("g");
  //create line
  xAxisLine.append("line")
    .attr("x1", xMediasPositions.min - axisMarginX)
    .attr("x2", xMediasPositions.max + axisMarginX)
    .attr("y1", d => getMediaYPosition(d.country, d.category))
    .attr("y2", d => getMediaYPosition(d.country, d.category))
    .attr("stroke", "grey")
    .attr("opacity", 0.5);
    //texte legende country
    xAxisLine.append("text")
    .text(d => categoriesNames[d.country])
    .attr("text-anchor", "middle")
    .attr("x", 40)
    .attr("fill", "black")
    .attr("class", "textCountry")
    .attr("opacity",0)
    .attr("font-size", "13px")
    //texte legende categorie
    xAxisLine.append("text")
    .text(d => categoriesNames[d.category])
    .attr("text-anchor", "middle")
    .attr("x", 40)
    .attr("fill", "black")
    .attr("class", "textCategory")
    .attr("opacity", 0)
    .attr("font-size", "13px")

}

/**
* Cette fonction crée les pointillés verticaux qui indiquent la valeur en x tout au long de la viz
*/
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
      var sentimentLabelUp = g.append("text")
        .text(sentimentValue)
        .attr("text-anchor", "middle")
        .attr("x", xVal)
        .attr("y", yMediasPosition - axisMarginY - 5)
        .attr("fill", "grey")

      // Add invisible labels at bottom
      var sentimentLabelBottom = g.append("text")
        .text(sentimentValue)
        .attr("text-anchor", "middle")
        .attr("x", xVal)
        .attr("y", yMediasPosition + interCategorySpace*(nbCategoriesDisplayed-1) + axisMarginY + 17)
        .attr("fill", "grey")
        .classed("bottomLabel", true);

      //Change zero style
      if (i == 0) {
        verticalLine.attr("opacity", 1)
          .style("stroke-dasharray", "4 4");
        sentimentLabelUp.attr("font-weight", "bold");
        sentimentLabelBottom.attr("font-weight", "bold");
      }

    }
  }
}

/**
* Met à jour la position des différents axes x et legendes quand on utilise les filtres
*/
function updateMediaBubblesXAxis() {
  var g = d3.select("#mediaXAxis");
  //on recupere toutes les lignes crees precedemment en faisant attention a exclure les lignes qui servent a la legende
  //on transitionne jusqu'à la nouvelle position de chaque axe (selon l'origine/le type qui lui est associé et le nombre de filtres activés)
  var lines = g.selectAll("line").filter(function() {
      return !this.classList.contains('legend_arrow')
    })
    .transition()
    .ease(d3.easeCubic)
    .duration(transitionAxisDuration)
    .attr("y1", d => getMediaYPosition(d.country, d.category))
    .attr("y2", d => getMediaYPosition(d.country, d.category));
  //on transitionne aussi sur la position des textes de legendes (categorie/origine)
  var textsCategory = g.selectAll("text.textCategory")
      .transition()
      .duration(transitionAxisDuration)
      .attr("y", d => getMediaYPosition(d.country, d.category)+15)
      .attr("opacity", d=> categoryChecked?1:0);
  var textsCountry = g.selectAll("text.textCountry")
      .transition()
      .duration(transitionAxisDuration)
      .attr("y", d => getMediaYPosition(d.country, d.category)-5)
      .attr("opacity", d=> countryChecked?1:0);

}

/**
* Met à jour la longueur des traits pointilles qui aident à voir la valeur en x meme quand on scrolle pour s'adapter au nombre de filtres activés
*/
function updateMediaBubblesYAxis() {
  var g = d3.select("#mediaYAxis");

  g.selectAll("line").filter(function() {
      return !this.classList.contains('legend_arrow')
    })
    .transition()
    .duration(transitionAxisDuration)
    .attr("y2", yMediasPosition + axisMarginY + interCategorySpace*(nbCategoriesDisplayed-1));

  g.selectAll("text.bottomLabel")
    .transition()
    .duration(transitionAxisDuration)
    .attr("opacity", d => +(nbCategoriesDisplayed>1))
    .attr("y", yMediasPosition + interCategorySpace*(nbCategoriesDisplayed-1) + axisMarginY + 17)
}

/**
* Met a jour la taille du svg en fonction des filtres utilisés
*/
function updateSvgSize(){
  var svg = d3.select("#mediaSVG")
  var height = yMediasPosition + interCategorySpace*(nbCategoriesDisplayed-1) + axisMarginY + tweetVerticalMargin;
  if(tweetChartActive){
    height += tweetHeight + tweetVerticalMargin + tweetLegendMargin*2;
  }
  svgBounds.height = height;
  svg.transition()
    .duration(transitionAxisDuration)
    .attr("height", height);

}

/**
* Regarde quels sont les filtres activés/désactivés
* Met a jour le nombre de lignes affichées pour la representation du media chart
* Aide au positionnement de tout le reste
*/
function updateNbCategoriesDisplayed() {
  previousNbCategoriesDisplayed = nbCategoriesDisplayed;
  if (countryChecked && categoryChecked) {
    nbCategoriesDisplayed = 6;
  } else if (countryChecked) {
    nbCategoriesDisplayed = 2;
  } else if (categoryChecked) {
    nbCategoriesDisplayed = 3;
  } else {
    nbCategoriesDisplayed = 1;
  }
}

//appelle les autres sous-fonctions de mise a jour
function updateMediaBubblesAxis() {
  updateMediaBubblesXAxis();
  updateMediaBubblesYAxis();
  updateSvgSize();
}

/**
 * Crée le graphique à bulles avec tous les médias
 *
 * @param g       Le groupe dans lequel le graphique à bulles doit être dessiné.
 * @param mediaSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié + un id)
 * @param tweetsG       Le groupe dans lequel le graphique à bulles des tweets doit être dessiné.
 * @param tweetSourcesles donneés : les tweets associés à un média (issus du fichier csv non modifié)
 * @param mediaXScale
 * @param formatNumber
 * @param scaleBubbleSizeMediaChart
 * @param tweetColorScale
 * @âram mediasData
 */
function createMediaBubbleChart(g,mediaSources, tweetsG, tweetSources, mediaXScale,formatNumber,scaleBubbleSizeMediaChart, tweetColorScale, mediasData){
  var mediaTip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('width', 100)
    .offset([-10, 0])
    .html(d => getMediaTipText.call(this, d, localization.getFormattedNumber));

  var mediaBubbleGroups = g.selectAll("g").data(mediaSources);
  var countryColor = colorCountry();
  var borderColor = colorCategory();

  var mediaG = mediaBubbleGroups.enter().append("g"); //mediaG is the group over each media circle
  //pour chaque media on crée un cercle
  mediaG.append("circle")
    .attr("id", d=>"media"+d.name.substring(1))
    .attr("r",function(d){
      if(d.name in mediasData){
        return scaleBubbleSizeMediaChart(+mediasData[d.name].Followers/+countries_population[d.Pays]);
      }
      else{
        console.log("pas d'infos");
        return 10;
      }
    })
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
    d.x = initPosition.x+ +d.mean_sentiment*5000 + (Math.random()-0.5)*2*5;
    d.y = initPosition.y+(Math.random()-0.5)*2*10;
    return d;
  })
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .on("click", function(d){
    updateFilterCheck();
    var mouseCoordinates= d3.mouse(this);
    let initPosition = {"x":mouseCoordinates[0], "y":mouseCoordinates[1]}
    initPosition = {"x":d3.select(this).attr("cx"),"y":d3.select(this).attr("cy")}
    tweetsG.attr("transform",""); //reset translation of tweet group
    d3.select(".annotations")
    .transition()
    .duration(500)
    .attr("opacity","0")


    if(d3.select("#media"+d.name.substring(1)).classed("selectedMedia")){
      d3.select("#media"+d.name.substring(1)).classed("selectedMedia", false);
      tweetsG.selectAll("g").remove();
      d3.select(".chartTweetAndLgend").transition().duration(250)
      .attr("opacity","0")
      mediaG.selectAll("circle").classed("notSelectedMedia", false);
      tweetChartActive = false;
      updateSvgSize();
      d3.select("#legendImage").attr("opacity",0);
      tweetsG.select("#titreTweetChart").remove();
    }
    else{

      //Change style
      mediaG.selectAll("circle").classed("selectedMedia", false);
      mediaG.selectAll("circle").classed("notSelectedMedia", true);
      d3.select("#media"+d.name.substring(1)).classed("selectedMedia", true);
      d3.select("#media"+d.name.substring(1)).classed("notSelectedMedia", false);
      d3.selectAll("#mediaBubbles circle").classed("notHoveredMedia",true);
      d3.select(".chartTweetAndLgend").transition().duration(500)
      .attr("opacity","1")
      d3.select("body").style("cursor","progress");

      createTweetsBubbleChart(tweetsG,tweetColorScale,tweetSources[d.name].buckets,initPosition, d.fullName)

      scrollToTweet();

      tweetChartActive = true;
      updateMediaBubblesAxis();


    }
  })
  .on('mouseover', function(d){
    d3.selectAll("#mediaBubbles circle").classed("notHoveredMedia",true);
    d3.select(this).classed("notSelectedMedia",false);
    d3.select(this).classed("notHoveredMedia",false);
    mediaTip.show(d);
  })
  .on('mouseout', function(d){
    d3.selectAll("#mediaBubbles circle").classed("notHoveredMedia",false);
    if(tweetsG.selectAll("g")._groups[0].length > 1){ //1 for legend at the begining
      d3.select(this).classed("notSelectedMedia",true);
    };
    mediaTip.hide(d);
  })

  mediaBubbleGroups = mediaBubbleGroups.merge(mediaG);

  mediaBubbleGroups.call(mediaTip);

  runMediaSimulation(mediaSources, mediaBubbleGroups, scaleBubbleSizeMediaChart, mediaXScale, mediasData);
  createAnnotations(g);
}

//Verifie quel filtre vient d'etre coché/décoché et met a jour les valeurs assoicées
function updateFilterCheck() {
  countryChecked = d3.select("#filterCountry").property("checked");
  categoryChecked = d3.select("#filterCategory").property("checked");
  updateNbCategoriesDisplayed();
}

//tips
function getMediaTipText(d, formatNumber){
  var tipText = "";
  tipText += "<span><strong>"+ d.fullName +"</strong> - <em>"+ d.name + "</em></span><br>";
  tipText += "<span>Sentiment moyen: <strong style='color:"+d3.interpolateRdYlGn((d.mean_sentiment+0.5))+"'>" + formatNumber(d.mean_sentiment) + "</strong></span><br>";
  tipText += "<span>Nombre de tweet et retweet moyen: <strong>" + formatNumber(d.number_tweets_and_RT) + "</strong></span>";
  return tipText;

}

//scroll automatiquement quand on clique pour afficher les tweets
function scrollToTweet(){
  d3.select("body").style("cursor","progress");
  var bodyRect = document.body.getBoundingClientRect();
  var svgRect = d3.select("svg").node().getBoundingClientRect();
  var timer = setTimeout(function(){
    d3.select("body").style("cursor","default");
    window.scrollTo(0,svgRect.top - bodyRect.top + attractionCenterY() - tweetHeight/2 - tweetLegendMargin - tweetVerticalMargin);
  },500);
}

//annotation qui indique de cliquer pour afficher les tweets
function createAnnotations(g){
  var annotationGroup = g.append("g").classed("annotations",true)
  d3.xml("https://gadiben.github.io/DatavizAlter/assets/images/arrow.svg").then(data => {
    $(".annotations").append(data.documentElement)
    var annotationx = svgBounds.width/3 +10;
    var annotationy = topMediaMarginY+30;
    annotationGroup.select("svg")
    .attr('width', 50)
    .attr('height', 50)
    .attr("x",annotationx)
    .attr("y",annotationy)
    annotationGroup.append("text")
    .attr("x",annotationx)
    .attr("y",annotationy)
    .attr("text-anchor", "middle")
    .attr('width', 100)
    .text("Cliquer pour voir les tweets")

  })
}
