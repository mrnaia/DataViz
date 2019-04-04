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
function createTweetsBubbleChart(g, x, sourceBuckets, initPosition,$svg, tip, mediaName){
  g.selectAll("g").remove()
  g.select("#titreTweetChart").remove();
  g.append("text")
  .attr("id", "titreTweetChart")
  .text("Sentiments des tweets du journal "+mediaName)
  .attr("x",svgBounds.width/2)
  .attr("y", attractionCenterY() - tweetHeight/2 - tweetLegendMargin)
  .style("font-weight", "bold")
  .attr("text-anchor", "middle");
  tip.html(function(d) {
    return getTweetTipText.call(this, d, formatNumber)
  });
  var bucketIndex = 0;
  var bucketsGroup = g.append("g")

  sourceBuckets.forEach((bucket) => {
    var bucketG = bucketsGroup.append("g");
    var bubbleGroups = bucketG.selectAll("g").data(bucket);
    var tweetG = bubbleGroups.enter().append("g")
    .on('mouseover',function(d){
      if(tweetSimuDone){
        tip.show(d);
      }
    }) //affiche les infobulles quand on passe la souris sur un cercle
    .on("mouseout", tip.hide);
    //pour chaque tweet on crée un rect
    var tweetTransitionTime = 4000;
    var tweetRect = tweetG.append("rect")
    .attr("width", tweetsSquareSize) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
    .attr("height", tweetsSquareSize) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
    .attr("x",initPosition.x)
    .attr("y", initPosition.y)
    .attr("id",d => d.id)
    .datum(function(d){
      replaceSVG($svg, d.id, initPosition.x, initPosition.y, d.retweet_count); //on le place dans le groupe correspondant à son sentiment (positif, neutre, negatif)
      return d;
    })
    tweetRect.transition()
    .duration(tweetTransitionTime)
    .attr("x",function(d) {
      d3.select(d3.select(this).node().parentNode).select("svg")
      .transition()
      .duration(tweetTransitionTime)
      .attr("x",bucketIndex/numberBucket * svgBounds.width)
      return bucketIndex/numberBucket * svgBounds.width
    })
    .attr("y", function(d){
      d3.select(d3.select(this).node().parentNode).select("svg")
      .transition()
      .duration(tweetTransitionTime)
      .attr("y",svgBounds.height/2 + +d.retweet_count)
      return svgBounds.height/2 + +d.retweet_count
    })


    bubbleGroups = bubbleGroups.merge(tweetG);
    bucketIndex++;
  })
  bucketsGroup.call(tip);
  return bucketsGroup;
}
//récupère l'image de l'oiseau puis crée le graphique
function launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition,formatNumber, mediaName){
    tweetChartActive = true;
    jQuery.get("assets/images/bird.svg", function(svgData) {
      var $svg = jQuery(svgData).find('svg');
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('width',100)
        .offset([-10, 0]);
      var bubbleGroups = createTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition,$svg,tip, mediaName);

      //runTweetSimulation(source,bubbleGroups,xBubbleScale);
    },'xml');
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
