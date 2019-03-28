
function legend(svg, svgBounds){
  //Object.keys(countriesColors)
  //console.log(countriesColors[])
  //categoriesColors
  var border_margin = 5/100*svgBounds.width;
  var diametre_circle=20;
  var intervalle = 5;

  var hauteur_legende_cat = 3*diametre_circle + 2*intervalle;
  var hauteur_legende_color = 2*diametre_circle + intervalle;


  var x_col2 = svgBounds.width-70;//-border_margin;
  var x_col1 = x_col2-90;;
  var legend = svg.select('g').append("g").
  attr("class", "legend");

  legend.append("rect")
  .attr("x",x_col1-2- diametre_circle)
  .attr("y", 0)
  .attr("width", 300)
  .attr("height", hauteur_legende_cat+diametre_circle + intervalle)
  .attr("stroke", "black")
  .style("fill", "white")
  .attr("stroke-width", 0.5);

console.log(svgBounds.right);
  var counter = 0;
  var legendColors = legend.append("g");
  Object.keys(countriesColors).forEach(function(element){

    counter+=1;
    legendColors.append("circle")
    .attr("cx",x_col1)
    .attr("cy",(diametre_circle+intervalle)*counter+(hauteur_legende_cat-hauteur_legende_color)/2)
    .attr("r",diametre_circle/2)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .style("fill", countriesColors[element]);

    legendColors.append("text")
    .attr("x", x_col1+diametre_circle)
    .attr("y", (diametre_circle+intervalle)*counter+(hauteur_legende_cat-hauteur_legende_color)/2+intervalle)
    .attr("font-size", "15px")
    .text(element);

  })
  var legendCat = legend.append("g");
  counter=0;
  Object.keys(categoriesColors).forEach(function(element){

    counter+=1;
    legendCat.append("circle")
    .attr("cx",x_col2)
    .attr("cy",(diametre_circle+intervalle)*counter)
    .attr("r",diametre_circle/2)
    .attr("stroke", categoriesColors[element])
    .attr("stroke-width",2)
    .style("fill","white");

    legendCat.append("text")
    .attr("x", x_col2 + diametre_circle)
    .attr("y", (diametre_circle+intervalle)*counter+intervalle)
    .attr("font-size", "15px")
    .text(element);

  })

}
