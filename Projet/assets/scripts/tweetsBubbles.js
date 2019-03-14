"use strict";
function createBubbleChart(g,sources){

  svg.selectAll("circle")
  .data(sources)
  .enter()
  .append("circle")
  .attr("r", (d) => 1+d.retweet_count)
}
