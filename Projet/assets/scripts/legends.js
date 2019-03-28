
function legend(svg){
  //Object.keys(countriesColors)
  //console.log(countriesColors[])
  //categoriesColors
  var legend = svg.select('g').append("g")
  var counter = 0;
  var legendColors = legend.append("g");
  Object.keys(countriesColors).forEach(function(element){

    counter+=1;
    legendColors.append("circle")
    .attr("cx",10)
    .attr("cy",25*counter+12.5)
    .attr("r",10)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .style("fill", countriesColors[element]);

    legendColors.append("text")
    .attr("x", 25)
    .attr("y", 25*counter+12.5+5)
    .attr("font-size", "15px")
    .text(element);

  })
  var legendCat = legend.append("g");
  counter=0;
  Object.keys(categoriesColors).forEach(function(element){

    counter+=1;
    legendCat.append("circle")
    .attr("cx",120)
    .attr("cy",25*counter)
    .attr("r",10)
    .attr("stroke", categoriesColors[element])
    .attr("stroke-width",2)
    .style("fill","white");

    legendCat.append("text")
    .attr("x", 135)
    .attr("y", 25*counter+5)
    .attr("font-size", "15px")
    .text(element);

  })

}
