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
}
