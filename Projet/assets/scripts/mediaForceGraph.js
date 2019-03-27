"use strict";
function ticked() {
  bubbles
    .attr('cx', function (d) { return nodes[d.id].x; })
    .attr('cy', function (d) { return nodes[d.id].y; });
}

function attractionCenterYMedia(d){
  var countryChecked = d3.select("#filterCountry").property("checked");
  var categoryChecked = d3.select("#filterCategory").property("checked");
  var locationIndex = 0
  if(d.Pays == "Quebec" && countryChecked){
    locationIndex++;
  }
  if(categoryChecked){
    var categories = Object.keys(categoriesColors);
    if(countryChecked){
      locationIndex = 3*locationIndex + categories.indexOf(d.Categorie);
    } else {
      locationIndex+= categories.indexOf(d.Categorie);
    }
  }
  return yMediasPosition + locationIndex * interCategorySpace
}


//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runMediaSimulation(source,bubbleGroups,sizeBubbleScale, xBubbleScale, mediasData){
  var forceStrength = 0.05;
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(d => xBubbleScale(d.mean_sentiment)))
    .force('y', d3.forceY().strength(forceStrength).y(attractionCenterYMedia))
    .force('collide', d3.forceCollide(function(d){
      if(d.name in mediasData){
        return sizeBubbleScale(mediasData[d.name].Followers/countries_population[mediasData[d.name].Pays]) + 2;
      }
      else{
        return 10+0.5;
      }

    }))
    .on('tick', d => mediaTicked(d,bubbleGroups,xBubbleScale));
  simulation.nodes(source);

  //Rerun simulation to filter
  d3.select("#filterCountry").on("click", () => filterMediaBubbles(simulation,forceStrength));
  d3.select("#filterCategory").on("click", () => filterMediaBubbles(simulation, forceStrength));
}


function mediaTicked(d,bubbleGroups,x) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
}

function filterMediaBubbles(simulation, forceStrength){
  var countryChecked = d3.select("#filterCountry").property("checked");
  var categoryChecked = d3.select("#filterCategory").property("checked");
  if(countryChecked && categoryChecked) {
    nbCategoriesDisplayed = 6;
  } else if(countryChecked){
    nbCategoriesDisplayed = 2;
  } else if(categoryChecked){
    nbCategoriesDisplayed = 3;
  } else{
    nbCategoriesDisplayed = 1;
  }
  //Changed attraction center
  simulation.force('y', d3.forceY().strength(forceStrength).y(attractionCenterYMedia))
  simulation.restart();
  simulation.alpha(1);
  updateMediaBubblesYAxis(d3.select("#mediaXAxis"));
  updateMediaBubblesXAxis(d3.select("#mediaYAxis"));
}
