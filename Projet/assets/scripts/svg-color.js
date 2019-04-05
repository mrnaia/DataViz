/*
 * Replace all SVG images with inline SVG
 */
function replaceSVG($svg,imgID, x, y, nbRetweet) {
  var colorRedMiddle = d3.scaleLinear()
          .domain([1, 500])
          .range([middleColor,redColor])
          .interpolate(d3.interpolateHcl);

  var colorMiddleGreen = d3.scaleLinear()
          .domain([0, 1])
          .range([middleColor, greenColor])
          .interpolate(d3.interpolateHcl);

  var $rect = $("#"+imgID);
  var $imgGroup = $rect.parent("g");
  /*
  $imgGroup.append($svg.clone())
  $localSvg = $imgGroup.find("svg")

  $localSvg.attr('id', imgID);
  var birdTransform = placeBird(x,y)
  $localSvg.attr("width",birdTransform.width);
  $localSvg.attr("height",birdTransform.height);
  $localSvg.attr("x",birdTransform.x);
  $localSvg.attr("y",birdTransform.y);
  var style = $localSvg.attr("style");
  $localSvg.attr("style",style)
  $localSvg.find("path").attr("style", "fill:"+colorRedMiddle(nbRetweet)+";");*/
  $imgGroup.find("rect").attr("style", "fill:"+colorRedMiddle(nbRetweet)+";");
  $imgGroup.find("rect").attr("stroke",colorRedMiddle(nbRetweet));
  $imgGroup.remove("div")
}

function placeBird(x,y){
  var margin = tweetsSquareSize* 0.4;
  return {"x":x-tweetsSquareSize+margin/2,"y":y-tweetsSquareSize+margin/2,"width":2*tweetsSquareSize-margin,"height":2*tweetsSquareSize-margin}
}
