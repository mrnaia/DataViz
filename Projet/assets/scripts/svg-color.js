/*
 * Replace all SVG images with inline SVG
 */
function replaceSVG($svg,imgID, x, y, r,sentiment) {
  var $circle = $("#"+imgID);
  var $imgGroup = $circle.parent("g");

  $imgGroup.append($svg.clone())
  $localSvg = $imgGroup.find("svg")

  $localSvg.attr('id', imgID);
  var birdTransform = placeBird(x,y,r)
  $localSvg.attr("width",birdTransform.width);
  $localSvg.attr("height",birdTransform.height);
  $localSvg.attr("x",birdTransform.x);
  $localSvg.attr("y",birdTransform.y);
  var style = $localSvg.attr("style");
  $localSvg.attr("style",style)
  $localSvg.find("path").attr("style", "fill:"+d3.interpolateRdYlGn(sentiment/2 +0.5)+";");
  $imgGroup.remove("div")
}

function placeBird(x,y,r){
  var margin = r* 0.4;
  return {"x":x-r+margin/2,"y":y-r+margin/2,"width":2*r-margin,"height":2*r-margin}
}
