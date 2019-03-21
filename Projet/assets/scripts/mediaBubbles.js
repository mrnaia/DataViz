"use strict";

function mediaSizeScaleDomain(x,source){
  // TODO: Change size in respect with popularity
  x.domain([d3.min(source,(d) => d.number_tweets_and_RT),d3.max(source,(d) => d.number_tweets_and_RT)]);
}

function mediaxScaleDomain(x,source){
  x.domain([d3.min(source,(d) => d.mean_sentiment),d3.max(source,(d) => d.mean_sentiment)]);
}

/**
 * Crée le graphique à bulle avec tous les médias
 *
 * @param g       Le groupe dans lequel le graphique à bulles doit être dessiné.
 * @param mediaSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié + un id)
 * @param initPosition
 * @param tweetsGg       Le groupe dans lequel le graphique à bulles des tweets doit être dessiné.
 * @param tweetSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié)
 */
function createMediaBubbleChart(g,mediaSources,initPosition,tweetsG,tweetSources, pays_population,scaleBubbleSizeMediaChart, mediasData){
  //console.log(mediaSources);
  var mediaBubbleGroups = g.selectAll("g").data(mediaSources);
  var countrycolorscale = colorCountryScale();
  var contourcolor = colorCategory();
  //console.log("createMediaBubbleChart");
  //console.log(mediaBubbleGroups);
  var mediaG = mediaBubbleGroups.enter().append("g");
  //pour chaque media on crée un cercle
  mediaG.append("circle")
  .attr("r",function(d){
    if(d.name in mediasData){
        return mediasData[d.name].Followers/pays_population[mediasData[d.name].Pays]*1000;
    }
    else{
      //console.log("pas d'infos");
      return 10;
    }
  })
  //.attr("r", (d) => 10)//Math.sqrt(x(d.retweet_count))) //dont le rayon dépend du nombre de retweets --> Y a pas des modifs à faire sur source avant pour avoir un seul exemplaire de chaque tweet et le bon nombre de retweets ou c'est fait sur python avant ?
  .attr("style","opacity:1")
  .attr("fill",function(d){
    if([d.name] in mediasData){
      return countrycolorscale(mediasData[d.name].Pays);//d3.interpolateRdYlGn(d.mean_sentiment/2 +0.5))
    }
  })
  .attr("stroke", function(d){
    if([d.name] in mediasData){
      return contourcolor(mediasData[d.name].Categorie);
    }
  })
  .attr("stroke-width", 3)
  .datum(function(d){
    d.x = initPosition.x+Math.random()*5;
    d.y = initPosition.y+Math.random()*5;
    return d;
  })
  .attr("cy",d => d.x)
  .attr("cx",d => d.y)
  .on("click",function(d){
    var mouseCoordinates= d3.mouse(this);
    var initPosition = {"x":mouseCoordinates[0],"y":mouseCoordinates[1]}
    setUpTweetChart(tweetsG,tweetSources[d.name].tweets,initPosition)
  });

  return mediaBubbleGroups.merge(mediaG);

}
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
