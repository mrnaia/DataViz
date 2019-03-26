"use strict";

function mediaSizeScaleDomain(x,source){
  // TODO: Change size in respect with popularity
  x.domain([d3.min(source,(d) => d.number_tweets_and_RT),d3.max(source,(d) => d.number_tweets_and_RT)]);
}

function mediaxScaleDomain(x,source){
  x.domain([d3.min(source,(d) => d.mean_sentiment),d3.max(source,(d) => d.mean_sentiment)]);
}


function setUpMediaChart(tweetsChartGroup,mediaChartGroup,mediaSources,tweetSources, pays_population,scaleBubbleSizeMediaChart, mediasData){

  //Set up
  var yCoord = 250;
  var minXCoord = 500;
  var maxXCoord = 1000;

  var xBubbleScale = d3.scaleLinear().range([minXCoord, maxXCoord]);

  var initPosition = {"x":(minXCoord+maxXCoord)/2, "y":yCoord};

  mediaxScaleDomain(xBubbleScale, mediaSources);

  var mediaTip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('width', 100)
    .offset([-10, 0]);

  //Creation
  var bubbleGroups = createMediaBubbleChart(mediaChartGroup,mediaSources,initPosition,tweetsChartGroup,tweetSources,mediaTip,localization.getFormattedNumber,pays_population,scaleBubbleSizeMediaChart, mediasData);

  mediaTip.html(function(d) {
    return getMediaTipText.call(this, d,localization.getFormattedNumber)
  });
  bubbleGroups.call(mediaTip);

  runMediaSimulation(mediaSources, bubbleGroups, scaleBubbleSizeMediaChart,xBubbleScale, mediasData, pays_population);
}


/**
 * Crée les axes du graphique à bulles des médias.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param xAxis   L'axe X.
 * @param yAxis   L'axe Y.
 * @param height  La hauteur du graphique.
 * @param width   La largeur du graphique.
 */
function createMediaBubblesAxis(g, y, x1, x2) {
  // Dessiner l'axe des abscisses du graphique.
  /*
  // Axe horizontal
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 0 + "," + height/4 + ")")
    .call(xAxis); //axe
  g.append("text")
    .attr("x", 1000)
    .attr("y", height/4 - 2)
    .style("text-anchor", "end")
    .text("Positivité des tweets") //nom de l'axe

  console.log("test axe")
  */
  g.append(line)
    .attr("x1", x1)
    .attr("x2", x2)
    .attr("y1", y)
    .attr("y2", y)
    .attr("stroke", "black")
    .attr("stroke-width", 10)
  console.log("test")


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
function createMediaBubbleChart(g,mediaSources,initPosition,tweetsG,tweetSources, tip,formatNumber,pays_population,scaleBubbleSizeMediaChart, mediasData){
  console.log(mediasData);
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
          return scaleBubbleSizeMediaChart(mediasData[d.name].Followers/pays_population[mediasData[d.name].Pays]);
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
    setUpTweetChart(tweetsG,tweetSources[d.name].tweets,initPosition,formatNumber)
  })
  .on('mouseover', tip.show) //affiche les infobulles quand on passe la souris sur un cercle
  .on("mouseout", tip.hide);

  return mediaBubbleGroups.merge(mediaG);

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
