"use strict";
function createBubbleChart(g,sources){

  svg.selectAll("circle")
  .data(sources)
  .enter()
  .append("circle")
  .attr("r", (d) => 1+d.retweet_count)
}

function coloredTweet() {
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement

  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
}
