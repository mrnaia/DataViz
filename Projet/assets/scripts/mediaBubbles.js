"use strict";

function mediaSizeScaleDomain(x,source){
  // TODO: Change size in respect with popularity
  x.domain([d3.min(source,(d) => +d.number_tweets_and_RT),d3.max(source,(d) => +d.number_tweets_and_RT)]);
}

function mediaxScaleDomain(x,source){
  x.domain([d3.min(source,(d) => +d.mean_sentiment),d3.max(source,(d) => +d.mean_sentiment)]);
}
/**
 * Crée les axes horizontaux du graphique à bulles des médias.
 *
 * @param g       Le groupe SVG dans lequel l'axe doit être dessiné.
 * @param y   La position en Y de l'axe à afficher.
 * @param x1   L'abscisse gauche du début de l'axe.
 * @param x2  L'abscisse droit de la fin de l'axe.
 */
function createMediaBubblesXAxis(g, y, x1, x2) {
  // Dessiner l'axe des abscisses du graphique.
  for (let i=0; i<6; i++){
    g.append("line")
    .attr("x1", x1)
    .attr("x2", x2)
    .attr("y1", y)
    .attr("y2", y)
    .attr("stroke", "grey")
    //.attr("stroke-width", "1px")
    .attr("opacity", 0.5)
  }
}

/**
 * Crée le graphique à bulles avec tous les médias
 *
 * @param g       Le groupe dans lequel le graphique à bulles doit être dessiné.
 * @param mediaSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié + un id)
 * @param initPosition
 * @param tweetsGg       Le groupe dans lequel le graphique à bulles des tweets doit être dessiné.
 * @param tweetSources  les donneés : les tweets associiés à un média (issus du fichier csv non modifié)
 */
function createMediaBubbleChart(g,mediaSources,initPosition, tweetsG, tweetSources, mediaXScale,formatNumber,scaleBubbleSizeMediaChart, scaleBubbleSizeTweetChart, mediasData){
  var mediaTip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('width', 100)
    .offset([-10, 0])
    .html(d => getMediaTipText.call(this, d, localization.getFormattedNumber));

  var mediaBubbleGroups = g.selectAll("g").data(mediaSources);
  var countryColor = colorCountry();
  var borderColor = colorCategory();
  //console.log("createMediaBubbleChart");
  //console.log(mediaBubbleGroups);
  var mediaG = mediaBubbleGroups.enter().append("g");
  //pour chaque media on crée un cercle
  mediaG.append("circle")
    .attr("r",function(d){
      if(d.name in mediasData){
          return scaleBubbleSizeMediaChart(mediasData[d.name].Followers/countries_population[mediasData[d.name].Pays]);
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
      return countryColor(mediasData[d.name].Pays);//d3.interpolateRdYlGn(d.mean_sentiment/2 +0.5))
    }
  })
  .attr("stroke", function(d){
    if([d.name] in mediasData){
      return borderColor(mediasData[d.name].Categorie);
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
    launchTweetsBubbleChart(tweetsG,scaleBubbleSizeTweetChart,tweetSources[d.name].tweets,initPosition,formatNumber)
    //setUpTweetChart(tweetsG,tweetSources[d.name].tweets,initPosition,formatNumber)
  })
  .on('mouseover', mediaTip.show) //affiche les infobulles quand on passe la souris sur un cercle
  .on("mouseout", mediaTip.hide);

  mediaBubbleGroups = mediaBubbleGroups.merge(mediaG);

  mediaBubbleGroups.call(mediaTip);
  var checkPays = d3.select("#filterCountry");
  checkPays.on("click", function(d){
    //console.log(this.checked);
    splitCountry(this.checked, mediaBubbleGroups, mediaSources, scaleBubbleSizeMediaChart, mediaXScale, mediasData);
  });

  runMediaSimulation(mediaSources, mediaBubbleGroups, scaleBubbleSizeMediaChart, mediaXScale, mediasData, center);
}
function getMediaTipText(d, formatNumber){
  var tipText = "";
  tipText += "<span><strong>" + d.name + "</strong></span><br>";
  tipText += "<span>Sentiment moyen: <strong>" + formatNumber(d.mean_sentiment) + "</strong></span><br>";
  tipText += "<span>Nombre de tweet et retweet moyen: <strong>" + formatNumber(d.number_tweets_and_RT) + "</strong></span>";
  return tipText;

}
  // https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
  // https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-fill-color
