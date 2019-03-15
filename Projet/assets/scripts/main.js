d3.dsv("|","./data/QuebecMedia.csv").then(function(data) {
  var sources = createSources(data);
  var svg = d3.select("body")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "1000px")
    //.attr("height", heightFocus + marginFocus.top + marginFocus.bottom);
  var bubbleChartGroup = svg.append("g")
  var maxBubbleSize = 400;
  var minBubbleSize = 10;
  var xBubbleScale = d3.scaleLinear().range([minBubbleSize, maxBubbleSize]);

  var source = sources["@tvanouvelles"].tweets;
  sizeScaleDomain(xBubbleScale,source);
  d3.select("body").on("click",function(){
    var mouseCoordinates= d3.mouse(this);
    var initPosition = {"x":mouseCoordinates[0],"y":mouseCoordinates[1]}
    launchBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition)
  })
});

function launchBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition){
    jQuery.get("assets/images/bird.svg", function(svgData) {
      var $svg = jQuery(svgData).find('svg');
      var bubbleGroups = createBubbleChart(bubbleChartGroup,xBubbleScale,source,initPosition,$svg);
      runSimulation(source,bubbleGroups,xBubbleScale);
    },'xml');
}
