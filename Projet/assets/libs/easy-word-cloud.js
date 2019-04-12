var fill = d3.scaleOrdinal(d3.schemeCategory20).domain([0,19]);
fill = d3.interpolateGnBu;

window.makeWordCloud = function(data, parent_elem, svgscale, svg_class, font, rotate_word, my_colors){
  var data_max =  d3.max(data, function(d){ return d.value } );
  var sizeScale = d3.scaleLinear().domain([0, data_max]).range([0, 1])

      function draw(words) {
        parent_elem.append("svg")
            .attr("width", svgscale)
            .attr("height", svgscale)
            .attr("class", svg_class)
          .append("g")
            .attr("transform", "translate(" + svgscale / 2 + "," + svgscale / 2 + ")")
          .selectAll("text")
            .data(words)
          .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", font)
            .style("fill", function(d, i) {
              if(my_colors){
                return my_colors(+d.occ/data_max);
              }else{
                return fill(+i);
              }
            })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
      }

      if(svg_class){ d3.select("." + svg_class).remove() }
      else{ d3.select("svg").remove() }


      data = data.map(function(d) {
        return {text: d.word, size: (10 + sizeScale(d.value) * svgscale) * 0.1, occ: d.value};
      })

      var layout = d3.layout.cloud()
        .size([svgscale, svgscale])
        .words(data)
        .padding(5)
        .fontSize(function(d) { return d.size; })

      if(!rotate_word){ layout.rotate(function() { return 0;/*~~(Math.random() * 2) * 90; */}) }

      layout
        .on("end", draw)
        .start();
  }


// generate a path's arc data parameter
// http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
var arcParameter = function(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y) {
  return [rx, ',', ry, ' ',
          xAxisRotation, ' ',
          largeArcFlag, ',',
          sweepFlag, ' ',
          x, ',', y ].join('');
};

function rectBorderRadius( x, y, width, height, tr, br, bl, tl ) {
  
  if (!br) {
    var br = tr;
    var bl = tr;
    var tl = tr;
  }


  var data = [];

  // start point in top-middle of the rectangle
  data.push('M ' + (x + width / 2) + ',' + y);

  // next we go to the right
  data.push('H ' + (x + width - tr));

  if (tr > 0) {
      // now we draw the arc in the top-right corner
      data.push('A ' + arcParameter(tr, tr, 0, 0, 1, (x + width), (y + tr)));
  }

  // next we go down
  data.push('V ' + (y + height - br));

  if (br > 0) {
      // now we draw the arc in the lower-right corner
      data.push('A ' + arcParameter(br, br, 0, 0, 1, (x + width - br), (y + height)));
  }

  // now we go to the left
  data.push('H ' + (x + bl));

  if (bl > 0) {
      // now we draw the arc in the lower-left corner
      data.push('A ' + arcParameter(bl, bl, 0, 0, 1, (x + 0), (y + height - bl)));
  }

  // next we go up
  data.push('V ' + (y + tl));

  if (tl > 0) {
      // now we draw the arc in the top-left corner
      data.push('A ' + arcParameter(tl, tl, 0, 0, 1, (x + tl), (y + 0)));
  }

  // and we close the path
  data.push('Z');

  console.log(data.join(' '));
  return data.join(' ');
};
