"use strict";
/**
 * Creer le tweet chart en fonction du media selectionné
 * @param  {[type]} g               Le groupe du chart
 * @param  {[type]} tweetColorScale L'échelle pour coloré les tweet en fonction du nombre de retweet
 * @param  {[type]} sourceBuckets   Les buckets contenant les tweets
 * @param  {[type]} initPosition    La position initiale des carrés
 * @param  {[type]} mediaName       Le nom du mdia clické
 */
function createTweetsBubbleChart(g, tweetColorScale, sourceBuckets, initPosition, mediaName){
  //Repartir de zero
  g.selectAll("g").remove()
  g.select("#titreTweetChart").remove();

  //Titre
  g.append("text")
  .attr("id", "titreTweetChart")
  .text("Sentiments des tweets du journal "+mediaName)
  .attr("x",svgBounds.width/2)
  .attr("y", tweetChartMiddle() - tweetHeight/2 - tweetLegendMargin)
  .style("font-weight", "bold")
  .attr("text-anchor", "middle");

  //Création de bucket par bucket
  var bucketIndex = 0;
  var bucketsGroup = g.append("g")
  var tweetRankDelay = -1; //indice globale de chaque tweet pour les retarde en fonction
  var inBetweenTweetDelay = 2;
  var tweetTransitionTime = 1000;
  var lowestSquareY = 0; //Pour avoir la taille total du chart

  sourceBuckets.forEach((bucket) => {
    //Creation de chaque bucket:
    var bucketG = bucketsGroup.append("g");
    var bubbleGroups = bucketG.selectAll("g").data(bucket);
    var tweetG = bubbleGroups.enter().append("g") //Un g intermediaire entr le g bucket et le rect pour la performance (par exérience)
    .on('mouseover',function(d){
      var rectSon = d3.select(this).select("rect");
      //Placer le tip en fonctions des filtres
      var translationFilter = (nbCategoriesDisplayed-previousNbCategoriesDisplayed)*interCategorySpace;
      var yCoord = +rectSon.attr("y")+translationFilter;

      d3.select(".tweetTip").select("p").html(getTweetTipText(d, localization.getFormattedNumber))
      .style("transform","translate("+rectSon.attr("x")+"px,"+yCoord+ "px)")
      d3.select(".tweetTip")
      .style("z-index","2") //Devant les rect
      .transition()
      .duration(100)
      .style("opacity","1")
    }) //affiche les infobulles quand on passe la souris sur un cercle
    .on('mouseout',d => {
      d3.select(".tweetTip")
      .transition()
      .duration(100)
      .style("opacity","0")
      .transition()
      .delay(100)
      .style("z-index","-1") //placé derrière pour ne pas obstrue l'hover
    })
    //pour chaque tweet on crée un rect
    var tweetRect = tweetG.append("rect")
    .attr("width", tweetsSquareSize)
    .attr("height", tweetsSquareSize)
    .attr("x",initPosition.x)
    .attr("y", initPosition.y)
    //Style
    .attr("fill", d =>tweetColorScale(Math.log10(d.retweet_count+1)))
    .attr("stroke", d =>tweetColorScale(Math.log10(d.retweet_count+1)))

    //Calcul de la transition
    var tweetRankx = -1;
    var tweetRanky = -1;
    var bucketSize = (svgBounds.width-2*tweetHorizontalMargin) / numberBucket;
    var lastSquareYPos = tweetChartMiddle() - tweetHeight/2; //initial y position
    tweetRect.transition()
    .duration(tweetTransitionTime)
    .delay(d => {
      tweetRankDelay++;
      return inBetweenTweetDelay*tweetRankDelay;//Les tweets apparaissent au fur et à mesure
    })
    .attr("x",function(d) {
      tweetRankx++; //Le rang en x de chaque tweet parmis le bucket
      var xCoordMod = tweetRankx % (Math.floor(bucketSize/tweetsSquareSize));
      var xCoord = tweetHorizontalMargin //La marge horizontal du graphe des tweets
                  + (bucketIndex * bucketSize) //La coordonné qui marque le début de ce bucket
                  + (xCoordMod * tweetsSquareSize); //La coordonnée dans le bucket
      return xCoord
    })
    .attr("y", function(d){
      tweetRanky++;
      if(tweetRanky % (Math.floor(bucketSize/tweetsSquareSize)) == 0 ){//Si on a rempli un ligne complete on descend d'un carré
        lastSquareYPos += tweetsSquareSize;
        lowestSquareY = Math.max(lowestSquareY,lastSquareYPos)
      }
      return lastSquareYPos;
    })
    bucketIndex++;
  })
  //Update global tweet height
  tweetHeight = lowestSquareY+tweetsSquareSize - (tweetChartMiddle()-tweetHeight/2);
  //Create axis and legend
  var axisGroup = g.append("g").classed("tweetAxis",true)
  createTweetAxis(axisGroup,tweetTransitionTime)
  var legendGroup = g.append("g").classed("chartTweetAndLgend",true);
  createTweetLegend(legendGroup);
  //Update global var
  updateSvgSize()
}
  /**
   * [getTweetTipText description]
   * @param  {[type]} d            [description]
   * @param  {[type]} formatNumber [description]
   * @return {[type]}              [description]
   */
function getTweetTipText(d, formatNumber){
  var tipText = "";
  tipText += "<div id='tweetText'>" + d.full_text + "</div><br>";
  tipText += "<span>Retweeté <strong>" + formatNumber(+d.retweet_count) + "</strong> fois</span><br>";
  tipText += "<span>Sentiment : <strong style='color:" + d3.interpolateRdYlGn((+d.sentiment/2+0.5))+"'>" + formatNumber(+d.sentiment) + "</strong></span><br>";
  return tipText;
}
/**
 * [createTweetAxis description]
 * @param  {Boolean} axisGroup           [description]
 * @param  {[type]}  tweetTransitionTime [description]
 * @return {Boolean}                     [description]
 */
function createTweetAxis(axisGroup,tweetTransitionTime){
  var topTweetY = tweetChartMiddle()-tweetHeight/2;
  for (var bucketIndex = 0; bucketIndex <= numberBucket; bucketIndex++) {
    var xBucket = tweetHorizontalMargin + bucketIndex * (svgBounds.width-2*tweetHorizontalMargin) / numberBucket;
    axisGroup.append("line")
    .attr("x1",xBucket)
    .attr("x2",xBucket)
    .attr("y1",topTweetY)
    .attr("y2",topTweetY)
    .attr("stroke", "grey")
    .attr("opacity", 0.5)
    .style("stroke-dasharray",tweetsSquareSize/2+" "+tweetsSquareSize/2) //For each square 1 dash 1 hole
    .transition()
    .duration(tweetTransitionTime)
    .delay(50*bucketIndex)
    .attr("y2",topTweetY + tweetHeight +2*tweetsSquareSize);
    axisGroup.append("text")
    .attr("text-anchor", "middle")
    .attr("x",xBucket)
    .attr("y",topTweetY-6)
    .text(localization.getFormattedNumber(bucketIndex/numberBucket*2-1))
    .attr("fill","grey")
    .style("font-size","10pt")
  }
  axisGroup.append("line")
  .attr("stroke","black")
  .style("opacity","0.5")
  .attr("x1",0)
  .attr("x2",0)
  .attr("y1",topTweetY+tweetsSquareSize)
  .attr("y2",topTweetY+tweetsSquareSize)
  .transition()
  .duration(tweetTransitionTime*2)
  .attr("x2",svgBounds.width)
}
/**
 * [updateTweetChart description]
 * @return {[type]} [description]
 */
function updateTweetChart(){
  d3.selectAll("#tweetBubbleChart g").style("cursor","default");
  d3.select("#tweetBubbleChart")
  .transition()
  .ease(d3.easeSin)
  .duration(transitionAxisDuration)
  .attr("transform", function(){
    //To use to translate bubbles and images
    var translation = (nbCategoriesDisplayed-previousNbCategoriesDisplayed)*interCategorySpace
    //transform bubble group
    return computeTranslateTransform(d3.select(this),translation);
  })
  updateSvgSize();
}
/**
 * [computeTranslateTransform description]
 * @param  {[type]} d3Node      [description]
 * @param  {[type]} translation [description]
 * @return {[type]}             [description]
 */
function computeTranslateTransform(d3Node,translation){
  var nodeTransform = d3Node.attr("transform");
  if(nodeTransform){
    var oldTranslate = nodeTransform.split(",")[1].split(")")[0];
    translation += +oldTranslate;
  }
  return "translate(0," + translation + ")";
}
/**
 * Gives the middle point of the tweet chart y wise
 * @return {number}
 */
function tweetChartMiddle(){
  return yMediasPosition + (nbCategoriesDisplayed-1)*interCategorySpace + axisMarginY + tweetVerticalMargin + tweetLegendMargin + tweetHeight/2 ;
}
