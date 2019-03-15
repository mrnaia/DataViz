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
var attractionPoints = [[-10,0],[0,0],[10,0]] //The coordinates of the points of attraction
function attractionCenterX(d){
  return attractionPoints[seperateTweets(d)+1][0]
}

function attractionCenterY(d){
  return attractionPoints[seperateTweets(d)+1][1]
}

function runSimulation(source,bubbleGroups){
  var initPostion = {"x":0,"y":0};
  var forceStrength = 0.03;
  var nodes = createNodes(source,initPostion);
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(attractionCenterX))
    .force('y', d3.forceY().strength(forceStrength).y(attractionCenterY))
    .force('charge', d3.forceManyBody().strength(charge))

    .on('tick', d => ticked(d,bubbleGroups));
  console.log("Simulation");
  simulation.stop();
  simulation.nodes(source);

}

function charge(d) {
  return -Math.pow(x(d.retweet_count), 2.0) * forceStrength;
}
function ticked(d,bubbleGroups) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
}

function createNodes(source,initPostion){
  console.log("CREATE NODES");
  var nodes = new Array(source.length)
  nodes.fill({"x":initPostion.x,"y":initPostion.y})
  return nodes
}
