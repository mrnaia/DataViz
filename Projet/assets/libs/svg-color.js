/*
 * Replace all SVG images with inline SVG
 */
function replaceSVG(img, x, y, r, sentiment) {
  var $img = $("#"+img.attr("id"));
  var imgID = $img.attr('id');
  var imgClass = $img.attr('class');
  var imgURL = $img.attr('src');

  jQuery.get(imgURL, function(data) {
    // Get the SVG tag, ignore the rest
    var $svg = jQuery(data).find('svg');

    // Add replaced image's ID to the new SVG
    if(typeof imgID !== 'undefined') {
      $svg = $svg.attr('id', imgID);
    }
    // Add replaced image's classes to the new SVG
    if(typeof imgClass !== 'undefined') {
      $svg = $svg.attr('class', imgClass+' replaced-svg');
    }

    // Remove any invalid XML tags as per http://validator.w3.org
    $svg = $svg.removeAttr('xmlns:a');

    // Replace image with new SVG
    $img.replaceWith($svg);
    var birdTransform = placeBird(x,y,r)
    $svg.attr("width",birdTransform.width);
    $svg.attr("height",birdTransform.height);
    $svg.attr("x",birdTransform.x);
    $svg.attr("y",birdTransform.y);
    var style = $svg.attr("style")+" opacity:1;";
    $svg.attr("style",style)
    $svg.find("path").attr("style", "fill:"+d3.interpolateRdYlGn(sentiment/2 +0.5)+";");
  }, 'xml');
}

function placeBird(x,y,r){
  var margin = r* 0.4;
  return {"x":x-r+margin/2,"y":y-r+margin/2,"width":2*r-margin,"height":2*r-margin}
}
