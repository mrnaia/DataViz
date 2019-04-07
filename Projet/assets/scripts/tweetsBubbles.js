"use strict";
/**
 * Crée le graphique à bulle avec tous les tweet d'un média
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param x       La scale pour déterminer la taille des bulles en fonction du nombre de retweets
 * @param source  les donneés : les tweets associiés à un média (issus du fichier csv non modifié + un id)
 * @param initPosition
 * @param svg
 */
function createTweetsBubbleChart(g, x, sourceBuckets, initPosition, mediaName){
  g.selectAll("g").remove()
  g.select("#titreTweetChart").remove();

  var legendGroup = g.append("g").classed("chartTweetAndLgend",true)
  createTweetLegend(legendGroup);
  var colorRedMiddle = d3.scaleLinear()
          .domain([0, Math.log10(39000)])
          .range([middleColor,redColor])
          .interpolate(d3.interpolateHcl);

  g.append("text")
  .attr("id", "titreTweetChart")
  .text("Sentiments des tweets du journal "+mediaName)
  .attr("x",svgBounds.width/2)
  .attr("y", attractionCenterY() - tweetHeight/2 - tweetLegendMargin)
  .style("font-weight", "bold")
  .attr("text-anchor", "middle");
  var bucketIndex = 0;
  var bucketsGroup = g.append("g")
  var tweetRankDelay = -1;
  var inBetweenTweetDelay = 2;
  var tweetTransitionTime = 1000;
  var lowestSquareY = 0;
  sourceBuckets.forEach((bucket) => {
    var bucketG = bucketsGroup.append("g");
    var bubbleGroups = bucketG.selectAll("g").data(bucket);
    var tweetG = bubbleGroups.enter().append("g")
    .on('mouseover',function(d){
      var rectSon = d3.select(this).select("rect");
      var translationFilter = (nbCategoriesDisplayed-previousNbCategoriesDisplayed)*interCategorySpace;
      var yCoord = +rectSon.attr("y")+translationFilter;
      d3.select(".tweetTip").select("p").html(getTweetTipText(d, localization.getFormattedNumber))
      .style("transform","translate("+rectSon.attr("x")+"px,"+yCoord+ "px)")
      d3.select(".tweetTip")
      .style("z-index","2")
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
      .style("z-index","-1")
    })
    //pour chaque tweet on crée un rect
    var tweetRect = tweetG.append("rect")
    .attr("width", tweetsSquareSize) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
    .attr("height", tweetsSquareSize) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
    .attr("x",initPosition.x)
    .attr("y", initPosition.y)
    .attr("fill", d =>colorRedMiddle(Math.log10(d.retweet_count+1)))
    .attr("stroke", d =>colorRedMiddle(Math.log10(d.retweet_count+1)))
    var tweetRankx = -1;
    var tweetRanky = -1;
    var bucketSize = (svgBounds.width-2*tweetHorizontalMargin) / numberBucket;
    var lastSquareYPos = attractionCenterY() - tweetHeight/2; //initial y position
    tweetRect.transition()
    .duration(tweetTransitionTime)
    .delay(d => {
      tweetRankDelay++
      return inBetweenTweetDelay*tweetRankDelay;
    })
    .attr("x",function(d) {
      tweetRankx++;
      var xCoordMod = tweetRankx % (Math.floor(bucketSize/tweetsSquareSize));
      var xCoord = tweetHorizontalMargin + bucketIndex * bucketSize + xCoordMod*tweetsSquareSize;
      return xCoord
    })
    .attr("y", function(d){
      tweetRanky++;
      if(tweetRanky % (Math.floor(bucketSize/tweetsSquareSize)) == 0 ){
        lastSquareYPos += tweetsSquareSize;
        lowestSquareY = Math.max(lowestSquareY,lastSquareYPos)
      }
      return lastSquareYPos;
    })
    bucketIndex++;
  })
  var axisGroup = g.append("g").classed("tweetAxis",true)
  //// DEBUG:
  /*
  axisGroup.append("line")
  .attr("stroke","black")
  .style("opacity","0.5")
  .attr("x1",0)
  .attr("x2",svgBounds.width)
  .attr("y1",lowestSquareY+tweetsSquareSize)
  .attr("y2",lowestSquareY+tweetsSquareSize)
  */
  tweetHeight = lowestSquareY+tweetsSquareSize - (attractionCenterY()-tweetHeight/2);
  createTweetAxis(axisGroup,tweetTransitionTime)
  updateSvgSize()
  updateTweetLegends();
  return bucketsGroup;
}
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
function getTweetTipText(d, formatNumber){
  var tipText = "";
  tipText += "<span>Text: <strong>" + d.full_text + "</strong></span><br>";
  tipText += "<span>Nombre de retweets: <strong>" + formatNumber(+d.retweet_count) + "</strong></span><br>";
  tipText += "<span>Sentiment: <strong style='color:"+d3.interpolateRdYlGn((+d.sentiment/2+0.5))+"'>" + formatNumber(+d.sentiment) + "</strong></span><br>";
  return tipText;
}

function createTweetAxis(axisGroup,tweetTransitionTime){
  var topTweetY = attractionCenterY()-tweetHeight/2;
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

function updateTweetLegends(){
  var heightSvg = yMediasPosition + interCategorySpace*nbCategoriesDisplayed + axisMarginY + tweetVerticalMargin;
  var marginHeight = 2/100*heightSvg;
  //var yMainImg = heightSvg - marginHeight - tweetLegendHeight + tweetHeight;
  var yMainImg = yMediasPosition + (nbCategoriesDisplayed-1)*interCategorySpace + axisMarginY + tweetVerticalMargin + tweetLegendMargin + tweetHeight/2 + tweetHeight/2 + tweetLegendMargin;
  //let valueTransform = yMainImg-d3.select("#legendImage").attr("transform").split(",")[1].split(")")[0];
  var transformLegend = "translate(0,"+yMainImg+")";
  d3.select("#legendImage").attr("transform", transformLegend);
  d3.select("#legendImage").transition().duration(500).attr("opacity",1);
}
