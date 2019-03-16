"use strict";
function ticked() {
  bubbles
    .attr('cx', function (d) { return nodes[d.id].x; })
    .attr('cy', function (d) { return nodes[d.id].y; });
}
var center = {"x":0,"y":200}

//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runMediaSimulation(source,bubbleGroups,sizeBubbleScale,xBubbleScale){
  var forceStrength = 0.02;
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(d => xBubbleScale(d.mean_sentiment)))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('collide', d3.forceCollide(d => Math.sqrt(sizeBubbleScale(d.number_tweets_and_RT)) +0.5))
    .on('tick', d => ticked(d,bubbleGroups,xBubbleScale));
  simulation.nodes(source);
}


function ticked(d,bubbleGroups,x) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
/*
    bubbleGroups.select("svg")
      .attr('x', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(d.retweet_count))).x; })
      .attr('y', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(d.retweet_count))).y; });
      */
}
