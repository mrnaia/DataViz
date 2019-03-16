
"use strict";

function sizeScaleDomain(x,source){
  x.domain([0,d3.max(source,(d) => d.retweet_count)]);
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
function createTweetsBubbleChart(g,x,source,initPosition,$svg){
  var bubbleGroups = g.selectAll("g").data(source);
  var tweetG = bubbleGroups.enter().append("g");
  var id = 0;
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
