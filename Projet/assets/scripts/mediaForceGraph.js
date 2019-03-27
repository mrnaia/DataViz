"use strict";
function ticked() {
  bubbles
    .attr('cx', function (d) { return nodes[d.id].x; })
    .attr('cy', function (d) { return nodes[d.id].y; });
}

function attractionCenterYMedia(d){
  var countryChecked = d3.select("#filterCountry").property("checked");
  var categoryChecked = d3.select("#filterCategory").property("checked");
  if(!countryChecked || d.Pays == "France"){
    return yMediasPosition
  }
  if(d.Pays == "Quebec" && countryChecked){
    return yMediasPosition + interCategorySpace;
  }
  return yMediasPosition
}


//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runMediaSimulation(source,bubbleGroups,sizeBubbleScale, xBubbleScale, mediasData){
  var forceStrength = 0.035;
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

  var checkPays = d3.select("#filterCountry");
  checkPays.on("click", function(d){
    //console.log(this.checked);

    if(d3.select("#filterCountry").property("checked")) {
      nbCategoriesDisplayed *= 2;
    } else{
      nbCategoriesDisplayed /= 2;
    }
    simulation.force('y', d3.forceY().strength(forceStrength).y(attractionCenterYMedia))
    simulation.restart();
    simulation.alpha(1);
    updateMediaBubblesYAxis(d3.select("#mediaXAxis"));
    updateMediaBubblesXAxis(d3.select("#mediaYAxis"));
    //splitCountry(this.checked, mediaBubbleGroups, mediaSources, scaleBubbleSizeMediaChart, mediaXScale, mediasData);
  });
}


function mediaTicked(d,bubbleGroups,x) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
/*
    bubbleGroups.select("svg")
      .attr('x', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(d.retweet_count))).x; })
      .attr('y', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(d.retweet_count))).y; });
      */
}
