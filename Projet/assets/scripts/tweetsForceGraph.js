"use strict";
function ticked() {
  bubbles
    .attr('cx', function (d) { return nodes[d.id].x; })
    .attr('cy', function (d) { return nodes[d.id].y; });
}

function seperateTweets(d){
  if(d.sentiment<-0.15){
    return -1;
  } else if(d.sentiment>0.15){
    return 1;
  } else {
    return 0;
  }
}
function attractionCenterX(d){
  return attractionPoints[seperateTweets(d)+1][0];
}

function attractionCenterY(){
  return yMediasPosition + (nbCategoriesDisplayed-1)*interCategorySpace + axisMarginY + tweetVerticalMargin + tweetLegendMargin + tweetHeight/2 ;
}

//fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
function runTweetSimulation(source,bubbleGroups,xBubbleScale){
  tweetSimuDone = false;
  var simulationTweet = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrengthTweet).x(attractionCenterX))
    .force('y', d3.forceY().strength(forceStrengthTweet).y(attractionCenterY))
    .force('collide', d3.forceCollide(d => Math.sqrt(xBubbleScale(+d.retweet_count)) + collisionTweetMargin))
    .on('tick', d => tweetTicked(d,bubbleGroups,xBubbleScale,simulationTweet.alpha()));
  simulationTweet.nodes(source);
  d3.selectAll("#tweetBubbleChart g").style("cursor","wait");
}

function updateTweetChart(){
  updateFilterCheck();

  d3.selectAll("#tweetBubbleChart g").style("cursor","default");
  d3.select("#tweetBubbleChart")
  .transition()
  .ease(d3.easeSin)
  .duration(transitionAxisDuration)
  .attr("transform", function(){
    //To use to translate bubbles and images
    var translation = +attractionCenterY() - (this.getBoundingClientRect().y +  tweetHeight/2);// + axisMarginY + tweetVerticalMargin;

    var newTranslate = translation
    var transform = d3.select(this).attr("transform");
    if(transform){
      var oldTranslate = transform.split(",")[1].split(")")[0];
      newTranslate += +oldTranslate;
    }
    var legendImageBar = d3.select("#legendImage")
    var legendImageBarTransform = legendImageBar.attr("transform");
    var translationBar = translation;
    if(legendImageBarTransform){
      var oldTranslate = legendImageBarTransform.split(",")[1].split(")")[0];
      translationBar += +oldTranslate;
    }
    legendImageBar.transition().duration(500).attr("transform", "translate(0," + translationBar + ")");
    console.log("Bubbles");
    console.log(newTranslate);
    return "translate(0," + newTranslate + ")";
  })


  //Update Image legend

  /*
  var heightSvg = yMediasPosition + interCategorySpace*nbCategoriesDisplayed + axisMarginY + tweetVerticalMargin;
  var yMainImg = attractionCenterY()+  tweetHeight/2 +  2/100*heightSvg; //heightSvg - marginHeight - tweetLegendHeight + tweetHeight;
  var translationToApply = yMainImg - legendImageBar.node().getBoundingClientRect().y;

  var transform = legendImageBar.attr("transform");
  if(transform){
    var oldTranslate = transform.split(",")[1].split(")")[0];
    translation += +oldTranslate;
  }

  //let valueTransform = yMainImg-d3.select("#legendImage").attr("transform").split(",")[1].split(")")[0];
  var transformLegend = "translate(0,"+yMainImg+")"; //yMainImg et pas valueTransform ??!!!!! Ca marche comme si translate prenait en fait la valeur finale en parametre et non de combien il doit translater...weird !!
  d3.select("#legendImage").transition().duration(500).attr("transform", transformLegend);

  */
  updateSvgSize();
}

function tweetTicked(d,bubbleGroups,x,alpha) {
  if(!tweetSimuDone && alpha<fractionToShowTip){
    tweetSimuDone = true;
    d3.selectAll("#tweetBubbleChart g").style("cursor","default");
  }
  bubbleGroups.select("circle")
    .attr('cx', function (d) { return d.x; })
    .attr('cy', function (d) { return d.y; });

  bubbleGroups.select("svg")
    .attr('x', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(+d.retweet_count))).x; })
    .attr('y', function (d) { return placeBird(d.x,d.y,Math.sqrt(x(+d.retweet_count))).y; });
}
