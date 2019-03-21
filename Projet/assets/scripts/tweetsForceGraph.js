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
var attractionPoints = [[400,700],[800,700],[1200,700]] //The coordinates of the points of attraction
function attractionCenterX(d){
  return attractionPoints[seperateTweets(d)+1][0]
}

function attractionCenterY(d){
  return attractionPoints[seperateTweets(d)+1][1]
}

//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runTweetSimulation(source,bubbleGroups,xBubbleScale){
  var forceStrength = 0.03;
  var simulation = d3.forceSimulation()
    .velocityDecay(0.3)
    .force('x', d3.forceX().strength(forceStrength).x(attractionCenterX))
    .force('y', d3.forceY().strength(forceStrength).y(attractionCenterY))
    .force('collide', d3.forceCollide(d => Math.sqrt(xBubbleScale(d.retweet_count)) +0.5))
    .on('tick', d => tweetTicked(d,bubbleGroups,xBubbleScale));
  simulation.nodes(source);
}


function tweetTicked(d,bubbleGroups,x) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });

    bubbleGroups.select("svg")
      .attr('x', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(d.retweet_count))).x; })
      .attr('y', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(d.retweet_count))).y; });
}
