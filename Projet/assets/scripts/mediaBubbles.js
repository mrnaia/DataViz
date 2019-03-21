"use strict";

function mediaSizeScaleDomain(x,source){
  // TODO: Change size in respect with popularity
  x.domain([d3.min(source,(d) => d.number_tweets_and_RT),d3.max(source,(d) => d.number_tweets_and_RT)]);
}

function mediaxScaleDomain(x,source){
  x.domain([d3.min(source,(d) => d.mean_sentiment),d3.max(source,(d) => d.mean_sentiment)]);
}


/**
 * Crée les axes du graphique à bulles des médias.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param xAxis   L'axe X.
 * @param yAxis   L'axe Y.
 * @param height  La hauteur du graphique.
 * @param width   La largeur du graphique.
 */
function createMediaBubblesAxis(g, xAxis, height, width) {
  // Dessiner l'axe des abscisses du graphique.
  // Axe horizontal
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(xAxis); //axe
    /*
  g.append("text")
    .attr("x", width)
    .attr("y", height/2-10)
    .style("text-anchor", "end")
    .text("Positivité des tweets") //nom de l'axe
    */
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
function createMediaBubbleChart(g,source,initPosition){
  var bubbleGroups = g.selectAll("g").data(source);
  var mediaG = bubbleGroups.enter().append("g");
  var id = 0;
  //pour chaque tweet on crée un cercle
  mediaG.append("circle")
  .attr("r", (d) => 10)//Math.sqrt(x(d.retweet_count))) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
  .attr("cx",100)
  .attr("cy",100)
  .attr("style","opacity:1")
  .attr("fill",d => d3.interpolateRdYlGn(d.mean_sentiment/2 +0.5))
  .datum(function(d){
    d.x = initPosition.x+Math.random()*5;
    d.y = initPosition.y+Math.random()*5;
    return d;
  })
  bubbleGroups = bubbleGroups.merge(mediaG);
  return bubbleGroups;
}
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
