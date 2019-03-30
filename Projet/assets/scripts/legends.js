
function legend(svg, svgBounds, groupeTweetChart){
  //Object.keys(countriesColors)
  //console.log(countriesColors[])
  //categoriesColors

  var circleRadius = 5;
  var interLegendYMargin = 3;
  //var borderMargin = 5/100*svgBounds.width;
  var interLegendYMargin = 5;


  var diametre_circle=10;
  var hauteur_legende_cat = 3*diametre_circle + 2*interLegendYMargin;
  var hauteur_legende_color = 2*diametre_circle + interLegendYMargin;

  var x_col2 = svgBounds.width-70;//-borderMargin;
  var x_col1 = x_col2-90;;
  var legend = svg.select('g').append("g").
  attr("class", "legend");

  legend.append("rect")
  .attr("x",x_col1-2- diametre_circle)
  .attr("y", 0)
  .attr("width", 300)
  .attr("height", hauteur_legende_cat+diametre_circle + interLegendYMargin)
  .attr("stroke", "black")
  .style("fill", "white")
  .attr("stroke-width", 0.5);

//console.log(svgBounds.right);
  var counter = 0;
  var legendColors = legend.append("g");
  Object.keys(countriesColors).forEach(function(element){

    counter+=1;
    legendColors.append("circle")
    .attr("cx",x_col1)
    .attr("cy",(diametre_circle+interLegendYMargin)*counter+(hauteur_legende_cat-hauteur_legende_color)/2)
    .attr("r",diametre_circle/2)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5)
    .style("fill", countriesColors[element]);

    legendColors.append("text")
    .attr("x", x_col1+diametre_circle)
    .attr("y", (diametre_circle+interLegendYMargin)*counter+(hauteur_legende_cat-hauteur_legende_color)/2+interLegendYMargin)
    .attr("font-size", "15px")
    .text(element);

  })
  var legendCat = legend.append("g");
  counter=0;
  Object.keys(categoriesColors).forEach(function(element){

    counter+=1;
    legendCat.append("circle")
    .attr("cx",x_col2)
    .attr("cy",(diametre_circle+interLegendYMargin)*counter)
    .attr("r",diametre_circle/2)
    .attr("stroke", categoriesColors[element])
    .attr("stroke-width",2)
    .style("fill","white");

    legendCat.append("text")
    .attr("x", x_col2 + diametre_circle)
    .attr("y", (diametre_circle+interLegendYMargin)*counter+interLegendYMargin)
    .attr("font-size", "15px")
    .text(element);

  })

  legendTweet(svg,groupeTweetChart)

}

function legendTweet(svg,g){
/*d3.interpolateRdYlGn(sentiment/2 +0.5)

  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
        <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
      </linearGradient>*/
  //var gradient = svg.append("interpolateRdYlGn").attr('id', 'gradient');
  //var legendImg  = new Image();
  //legendImg.onload()= function(){
    svg.append("svg:image")
    .attr("class", "imgLegend")
    .attr("xlink:href", "assets/images/echelleCouleurs.png")
    .attr("x",0)
    .attr("y",0)
    .attr("preserveAspectRatio", "none")
    .attr("width", svgBounds.width)
    .attr('height', 25);

  //}
  //legendImg.src = "../assets/images/echelleCouleurs.png";
  /*g.append("rect")
  .attr("width",svgBounds.width)
  .attr("height",20)
  .attr("x",0)
  .attr("y",0)
  .style("fill","url(#gradient)");*/
}
