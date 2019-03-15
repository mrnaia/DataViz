"use strict";
function ticked() {
  bubbles
    .attr('cx', function (d) { return nodes[d.id].x; })
    .attr('cy', function (d) { return nodes[d.id].y; });
}

function seperateTweets(d){
  if(d.sentiment<-0.2){
    return -1;
  } else if(d.sentiment>0.2){
    return 1;
  } else {
    return 0;
  }
}
var attractionPoints = [[50,100],[200,100],[350,100]] //The coordinates of the points of attraction
function attractionCenterX(d){
  return attractionPoints[seperateTweets(d)+1][0]
}

function attractionCenterY(d){
  return attractionPoints[seperateTweets(d)+1][1]
}

function runSimulation(source,bubbleGroups){
  var forceStrength = 0.03;
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(attractionCenterX))
    .force('y', d3.forceY().strength(forceStrength).y(attractionCenterY))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', d => ticked(d,bubbleGroups));
  simulation.nodes(source);
}

function charge(d) {
  return -Math.pow(x(d.retweet_count), 10.0) * forceStrength;
}
function ticked(d,bubbleGroups) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
}
