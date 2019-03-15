d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  var sources = createSources(data);
  var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);
  var bubbleChartGroup = svg.append("g")
  var maxBubbleSize = 40;
  var minBubbleSize = 0.01;
  var xBubbleScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);

  var source = sources["@tvanouvelles"].tweets;
  sizeScaleDomain(xBubbleScale,source);
  createBubbleChart(bubbleChartGroup,xBubbleScale,source);
/*
  var circleGroupe = svg.append("g")
  circleGroupe.append("circle")
  .attr("r",20)
  .attr("style","opacity:0.5")
  .attr("cx",100)
  .attr("cy",100)
  var img = circleGroupe
  .append("image")
  .attr("id","Bulle1")
  .attr("class","svg")
  .attr("src","assets/images/bird.svg");
  replaceSVG(img,100,100,20)
*/

  //coloredTweet(source);
});
