"use strict";
function ticked() {
  bubbles
    .attr('cx', function (d) { return nodes[d.id].x; })
    .attr('cy', function (d) { return nodes[d.id].y; });
}

function getMediaYPosition(country, category) {
  var locationIndex = 0;
  if(country == "Quebec" && countryChecked){
    locationIndex++;
  }
  if(categoryChecked){
    var categories = Object.keys(categoriesColors);
    if (countryChecked) {
      locationIndex = 3*locationIndex + categories.indexOf(category);
    } else {
      locationIndex += categories.indexOf(category);
    }
  }
  return yMediasPosition + locationIndex * interCategorySpace;
}

//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runMediaSimulation(source,bubbleGroups,sizeBubbleScale, xBubbleScale, mediasData){
  var forceStrength = 0.05;
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(d => xBubbleScale(d.mean_sentiment)))
    .force('y', d3.forceY().strength(forceStrength).y(d => getMediaYPosition(d.Pays, d.Categorie) ))
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
  d3.select("#filterCountry").on("click", () => filterMediaBubbles(simulation, forceStrength));
  d3.select("#filterCategory").on("click", () => filterMediaBubbles(simulation, forceStrength));
}


function mediaTicked(d,bubbleGroups,x) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
}

function filterMediaBubbles(simulation, forceStrength){
  updateFilterCheck();
  //Changed attraction center
  simulation.force('y', d3.forceY().strength(forceStrength).y((d => getMediaYPosition(d.Pays, d.Categorie))))
  simulation.restart();
  simulation.alpha(1);

  updateMediaBubblesAxis();

  if(tweetChartActive){
    updateTweetChart();
  }
}
