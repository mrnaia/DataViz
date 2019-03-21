"use strict";

function sizeScaleDomain(x,source){
  x.domain([d3.min(source,(d) => d.retweet_count),d3.max(source,(d) => d.retweet_count)]);
}


/**
 * Crée le graphique à bulle avec tous les tweet d'un média
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param x       La scale pour déterminer la taille des bulles en fonction du nombre de retweets
 * @param source  les donneés : les tweets associiés à un média (issus du fichier csv non modifié + un id)
 * @param initPosition
 * @param svg
 */
function createTweetsBubbleChart(g,x,source,initPosition,$svg,tip){
  g.selectAll("g").remove()
  var bubbleGroups = g.selectAll("g").data(source);
  var tweetG = bubbleGroups.enter().append("g")
  .on('mouseover', tip.show) //affiche les infobulles quand on passe la souris sur un cercle
  .on("mouseout", tip.hide);
  //pour chaque tweet on crée un cercle
  tweetG.append("circle")
  .attr("r", (d) => Math.sqrt(x(d.retweet_count))) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
  .attr("cx",100)
  .attr("cy",100)
  .attr("style","opacity:0.1")
  .attr("id",d => d.id)
  .datum(function(d){
    d.x = initPosition.x+Math.random()*5;
    d.y = initPosition.y+Math.random()*5;
    replaceSVG($svg, d.id, 100, 100, Math.sqrt(x(d.retweet_count)),d.sentiment); //on le place dans le groupe correspondant à son sentiment (positif, neutre, negatif)
    return d;
  })
  bubbleGroups = bubbleGroups.merge(tweetG);
  return bubbleGroups;
}

function  getTipText(d){
  return d.full_text;
}

function setUpTweetChart(bubbleChartGroup,tweets,clickPosition){
  //tailles des oiseaux tweets
  var maxBubbleSize = 500;
  var minBubbleSize = 50;
  var xBubbleScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);

  ////////////////////////////////////////////////////////
  //création du chart des tweets pour le media clické qui apparait quand on clique
  sizeScaleDomain(xBubbleScale,tweets);
  launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,tweets,clickPosition)
}



//récupère l'image de l'oiseau puis crée le graphique
function launchTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition){
    jQuery.get("assets/images/bird.svg", function(svgData) {
      var $svg = jQuery(svgData).find('svg');
      var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr('width',100)
        .offset([-10, 0]);
      var bubbleGroups = createTweetsBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition,$svg,tip);

      tip.html(function(d) {
        return getTipText.call(this, d)
      });
      bubbleGroups.call(tip);
      runTweetSimulation(source,bubbleGroups,xBubbleScale);
    },'xml');
}
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
