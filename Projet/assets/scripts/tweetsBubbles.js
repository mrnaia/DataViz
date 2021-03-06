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
function createTweetsBubbleChart(g,x,source,initPosition,$svg,tip, mediaName){
  g.selectAll("g").remove()
  g.select("#titreTweetChart").remove();
  g.append("text")
  .attr("id", "titreTweetChart")
  .text("Sentiments des tweets du journal "+mediaName)
  .attr("x",svgBounds.width/2)
  .attr("y", attractionCenterY() - tweetHeight/2 - tweetLegendMargin)
  .style("font-weight", "bold")
  .attr("text-anchor", "middle");

  var bubbleGroups = g.selectAll("g").data(source);
  var tweetG = bubbleGroups.enter().append("g")
  .on('mouseover',function(d){
    if(tweetSimuDone){
      tip.show(d);
    }
  }) //affiche les infobulles quand on passe la souris sur un cercle
  .on("mouseout", tip.hide);
  //pour chaque tweet on crée un cercle
  tweetG.append("circle")
  .attr("r", (d) => Math.sqrt(x(+d.retweet_count))) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
  .attr("cx",100)
  .attr("cy",100)
  .attr("id",d => d.id)
  .datum(function(d){
    var randomx = (Math.random()-0.5)*2*50;
    if(d.sentiment==0){
      randomx = (Math.random()-0.5)*2*250
    }
    d.x = initPosition.x+ +d.sentiment*1000 + randomx;
    d.y = initPosition.y+(Math.random()-0.5)*2 *250;
    replaceSVG($svg, d.id, 100, 100, Math.sqrt(x(+d.retweet_count)),+d.sentiment); //on le place dans le groupe correspondant à son sentiment (positif, neutre, negatif)
    return d;
  })
  bubbleGroups = bubbleGroups.merge(tweetG);
  return bubbleGroups;
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
      tip.html(function(d) {
        return getTweetTipText.call(this, d, formatNumber)
      });
      bubbleGroups.call(tip);
      runTweetSimulation(source,bubbleGroups,xBubbleScale);
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
