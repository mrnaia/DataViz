d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  var sources = createSources(data);
  var svg = d3.select("body")
    .append("svg")
    //.attr("width", widthFocus + marginFocus.left + marginFocus.right)
    //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);
  var bubbleChartGroup = svg.append("g")
  createBubbleChart(bubbleChartGroup,sources["@tvanouvelles"])


  coloredTweet(); //Test

});
