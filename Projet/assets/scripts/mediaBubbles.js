"use strict";
/**
 * Créer le media chart
 * @param  {d3 selection} g                   Le groupe du media chart
 * @param  {Array} mediaSources               La source contenant toutes les informations sur les medias
 * @param  {d3 selection} tweetsG             Le groupe qui contiendra le tweetchart
 * @param  {Object} tweetSources              La source pour les tweets
 * @param  {d3 scale} mediaXScale               L'échelle pour placer les medias en x
 * @param  {function} formatNumber              la fonction de formatage des nombres
 * @param  {d3 scale} scaleBubbleSizeMediaChart L'échelle de taille des bulles des medias
 * @param  {d3 scale} tweetColorScale           L'échelle de couleur des tweet
 * @param  {Object} mediasData                Les données sur les medias
 */
function createMediaBubbleChart(g,mediaSources, tweetsG, tweetSources, mediaXScale, formatNumber, scaleBubbleSizeMediaChart, tweetColorScale, mediasData){
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
    let initPosition = {"x": d3.select(this).attr("cx") - tweetsSquareSize/2,
                        "y": d3.select(this).attr("cy") - tweetsSquareSize/2};
    tweetsG.attr("transform",""); //reset translation of tweet group
    d3.select(".annotations")
    .transition()
    .duration(500)
    .attr("opacity","0")

    if(d3.select("#media"+d.name.substring(1)).classed("selectedMedia")){
      //On a clické sur le même media qu'avant, on enlève tout du tweet chart
      tweetsG.selectAll("g").remove();
      tweetsG.select("#titreTweetChart").remove();

      d3.select("#media"+d.name.substring(1)).classed("selectedMedia", false);
      mediaG.selectAll("circle").classed("notSelectedMedia", false); //Aucun cercle n'est selectionne donc aucun ne l'est pas pour reset la vu

      tweetChartActive = false;
      updateSvgSize();
    } else {
      selectNewMedia(d.name, d.fullName, mediaG, tweetsG, tweetColorScale, tweetSources);
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
/**
 * Lance le tweet chart lorsqu'un nouveau média est sélectionné
 * @param  {string} mediaName       Le nom du media sélectionné
 * @param  {string} mediaFullName   Le nom complet du media
 * @param  {d3 selection} mediaG          Le groupe du media chart
 * @param  {d3 selection} tweetsG         Le groupe du tweet chart
 * @param  {d3 scale} tweetColorScale L'échelle de couleur du tweet chart
 * @param  {Object} tweetSources    L'ensemble des tweets en {media:{buckets:[[...],[...]],...}}
 */
function selectNewMedia(mediaName, mediaFullName, mediaG, tweetsG, tweetColorScale, tweetSources) {
  let idCircle = "#media"+mediaName.substring(1);
  //Changer style
  mediaG.selectAll("circle").classed("selectedMedia", false);
  mediaG.selectAll("circle").classed("notSelectedMedia", true);
  d3.select(idCircle).classed("selectedMedia", true);
  d3.select(idCircle).classed("notSelectedMedia", false);
  d3.selectAll("#mediaBubbles circle").classed("notHoveredMedia",true);

  //La position intiale d'u départ des tweets
  let initPosition = {"x": d3.select(idCircle).attr("cx") - tweetsSquareSize/2,
                      "y": d3.select(idCircle).attr("cy") - tweetsSquareSize/2};

  createTweetsBubbleChart(tweetsG, tweetColorScale, tweetSources[mediaName].buckets, initPosition, mediaFullName, mediaName);

  scrollToTweet();

  tweetChartActive = true;
  updateSvgSize();
}

/**
 * Verifie quel filtre vient d'etre coché/décoché et met a jour les valeurs assoicées
 */
function updateFilterCheck() {
  countryChecked = d3.select("#filterCountry").property("checked");
  categoryChecked = d3.select("#filterCategory").property("checked");
  updateNbCategoriesDisplayed();
}

/**
 * Donne l'html du type associé à un média
 * @param  {data} d            Un média
 * @param  {function} formatNumber La fonction de formatage des médias
 * @return {string}              Le tip en html
 */
function getMediaTipText(d, formatNumber){
  var tipText = "";
  tipText += "<span><strong>" + d.fullName + "</strong> - <em>"+ d.name + "</em></span><br>";
  tipText += "<span>Sentiment moyen : <strong style='color:" + d3.interpolateRdYlGn((d.mean_sentiment+0.5))+"'>" + formatNumber(d.mean_sentiment) + "</strong></span><br>";
  tipText += "<span>Nombre de tweets et retweets : <strong>" + formatNumber(d.number_tweets_and_RT) + "</strong></span>";
  return tipText;
}
/**
 * scroll automatiquement quand on clique pour afficher les tweets
 */
function scrollToTweet(){
  d3.select("body").style("cursor","progress");
  var bodyRect = document.body.getBoundingClientRect();
  var svgRect = d3.select("svg").node().getBoundingClientRect();
  var timer = setTimeout(function(){
    d3.select("body").style("cursor","default");
    window.scrollTo(0,svgRect.top - bodyRect.top + tweetChartMiddle() - tweetHeight/2 - tweetLegendMargin - tweetVerticalMargin);
  },500);
}
/**
 * Créer l'annotation qui incite à cliquer pour voir les tweets
 * @param  {d3 selection} g Le groupe qui contiendra les annotation
 */
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
/**
 * Crée les axes horizontaux du graphique à bulles des médias.
 *
 * @param g       Le groupe SVG dans lequel l'axe doit être dessiné.
 * @param xAxisMetadata Les 6 combinaisons pays,categorie
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
 * Affiche les pointillés qui délimite l'échelle en x
 * @param  {d3 selection}  g       Le groupe qui va les contenir
 * @param  {d3 scale}  xMedias     L'échelle en x du media chart
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
/**
 * Appelle les autres sous-fonctions de mise a jour
 */
function updateMediaBubblesAxis() {
  updateMediaBubblesXAxis();
  updateMediaBubblesYAxis();
  updateSvgSize();
}
