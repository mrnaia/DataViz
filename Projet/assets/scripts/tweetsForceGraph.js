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
function attractionCenterX(d){
  return attractionPoints[seperateTweets(d)+1][0]
}

function attractionCenterY(d){
  updateFilterCheck();
  
  if(categoryChecked && countryChecked){
    return yMediasPosition + 6* interCategorySpace;
  }
  else if (!categoryChecked && !countryChecked){
    return yMediasPosition + interCategorySpace;
  }
  else if(categoryChecked){
    return yMediasPosition + 3* interCategorySpace;
  }
  else{
    return yMediasPosition + 2* interCategorySpace;
  }
  return attractionPoints[seperateTweets(d)+1][1]
}

//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runTweetSimulation(source,bubbleGroups,xBubbleScale){

  simulationTweet = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrengthTweet).x(attractionCenterX))
    .force('y', d3.forceY().strength(forceStrengthTweet).y(attractionCenterY))
    .force('collide', d3.forceCollide(d => Math.sqrt(xBubbleScale(+d.retweet_count)) + collisionTweetMargin))
    .on('tick', d => tweetTicked(d,bubbleGroups,xBubbleScale));
  simulationTweet.nodes(source);


}
function updateTweetChart(){
  updateFilterCheck();
  //Changed attraction center
  simulationTweet.force('y', d3.forceY().strength(forceStrengthTweet).y(attractionCenterY))
  simulationTweet.restart();
  simulationTweet.alpha(1);



}

function tweetTicked(d,bubbleGroups,x) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });

    bubbleGroups.select("svg")
      .attr('x', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(+d.retweet_count))).x; })
      .attr('y', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(+d.retweet_count))).y; });
}
