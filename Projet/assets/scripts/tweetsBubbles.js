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
  var tweetG = g.selectAll("g")
  .data(source)
  .enter()
  .append("g")
 var id = 0;
  tweetG.append("circle")
  .attr("r", (d) => x(d.retweet_count))
  .attr("cx",100)
  .attr("cy",100)
  .attr("style","opacity:0.1")
  tweetG.append("img")
  .attr("id",d => {
    id++;
    d.id = id
    return id;
  })
  .attr("class","svg")
  .attr("src","assets/images/bird.svg")
  .datum(function(d){
    replaceSVG(d3.select(this), 100, 100, x(d.retweet_count));
    return d;
  })

  tweetG.select("path")
  .attr("style",)
  .attr("style","fill:green !important;")
  /*.attr("fill", function(d, i){
    //console.log(d.sentiment);
    //console.log(d3.interpolateRdYlGn(d.sentiment*2 +1));
    return d3.interpolateRdYlGn(d.sentiment/2 +0.5);
  })*/


  //d3.interpolateRdYlGn(0.2)


  //https://vallandingham.me/bubble_charts_with_d3v4.html
  /*

  //d3.selectAll("circle")
    .append("img")
    .attr("src","assets/images/bird.svg")
    .attr("width", "100%")
    .attr("height", "100%")
    */
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
