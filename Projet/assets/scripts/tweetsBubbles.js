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
function createBubbleChart(g,x,source,$svg){
  var bubbleGroups = g.selectAll("g").data(source)
  var tweetG = bubbleGroups.enter().append("g")
 var id = 0;
  tweetG.append("circle")
  .attr("r", (d) => Math.sqrt(x(d.retweet_count)))
  .attr("cx",100)
  .attr("cy",100)
  .attr("style","opacity:0.1")
  tweetG.append("div")
  .attr("id",d => d.id)
  .datum(function(d){
    replaceSVG($svg, d.id, 100, 100, Math.sqrt(x(d.retweet_count)),d.sentiment);
    return d;
  })
  bubbleGroups = bubbleGroups.merge(tweetG)

   return bubbleGroups;
}
/*
function coloredTweet(sources) {
  d3.xml("assets/images/bird.svg", "image/svg+xml", function(xml) {
    var importedNode = document.importNode(xml.documentElement, true);
    svg.selectAll("g")
      .data(sources)
      .enter()
      .append("g")
      .attr("r", (d) => x(d.retweet_count))
      .each(function(d, i){
        var bird = this.appendChild(importedNode.cloneNode(true));
        d3.select(bird).select("path").attr("fill", "blue !important");
      });
});
}
*/
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
