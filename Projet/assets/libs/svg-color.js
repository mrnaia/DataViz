/*
 * Replace all SVG images with inline SVG
 */
function replaceSVG(img, x, y, r) {
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
    var margin = r* 0.38;
    $svg.attr("width",2*r-margin);
    $svg.attr("height",2*r-margin);
    $svg.attr("x",x-r+margin/2);
    $svg.attr("y",y-r+margin/2);
    $svg.attr("opacity","0.05");
  }, 'xml');
}
