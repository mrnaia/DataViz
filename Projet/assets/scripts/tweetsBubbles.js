"use strict";
function sizeScaleDomain(x,source){
  x.domain([0,d3.max(source,(d) => d.retweet_count)])
}


/**
 * Crée les axes du graphique à bulles.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param x       La scale pour déterminer la taille des bulle en fonction du nombre de retweet
 * @param source  les donneés
 */
function createBubbleChart(g,x,source){
  g.selectAll("circle")
  .data(source)
  .enter()
  .append("circle")
  .attr("r", (d) => x(d.retweet_count))
  .attr("style","opacity:0.1")
  //https://vallandingham.me/bubble_charts_with_d3v4.html
}

function coloredTweet() {
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement

  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
}
