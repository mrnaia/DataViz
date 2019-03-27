
function splitCountry(checked,mediaG, data, scaleBubbles, mediaXScale, mediasData){
  //console.log(data);
  /*mediaG.selectAll("circle")
    .transition()
    .duration(1000)
    .attr("cy", function(d){
      console.log(d);
      if(checked && mediasData[d.name].Pays == "Quebec"){
        return
      }
    });*/
    //console.log(mediasData);
    if (checked){
      dataQuebec = data.filter(function(el){
        if (el.name in mediasData){
          return mediasData[el.name].Pays == "Quebec";
        } else {
          //console.log("else");
          return;
        }});
      dataFrance = data.filter(function(el){
        if (el.name in mediasData){
          return mediasData[el.name].Pays == "France";
        } else {
          //console.log("else");
          return;
        }
      });

      nbCategoriesDisplayed *= 2;


      //TODO : only one simulation for performance
      //Au lieu de refaire des simulations : cf le force des tweets qui sont
      //attirés par différents points attracteurs. re Runner la meme simulation qui recupere
      //l etat des filtres pour determiner les points attracteurs cf
      //.force('x', d3.forceX().strength(forceStrength).x(attractionCenterX))
      //.force('y', d3.forceY().strength(forceStrength).y(attractionCenterY))

      //Avec attractionCenterX ou Y des fonctions qui prennent d en entree (chaque entree)
      // si on rajoute dans le preproc le "country" de chaque media on determine le point d'attraction (surtout en x)
      yMediasPosition = 300;
      runMediaSimulation(dataQuebec, mediaG, scaleBubbles, mediaXScale, mediasData);
      yMediasPosition = 100;
      runMediaSimulation(dataFrance, mediaG, scaleBubbles, mediaXScale, mediasData);

    } else {
      nbCategoriesDisplayed /= 2;


      runMediaSimulation(data, mediaG, scaleBubbles, mediaXScale, mediasData);
    }



  }


/*g.selectAll("circle")
  .data(data)
  .transition()
  .duration(1000)
  .attr("cx", d => x(d.lifeExpectancy))
  .attr("cy", d => y(d.income))
  .attr("r", d => r(d.population))

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

  runMediaSimulation(mediaSources, mediaBubbleGroups, scaleBubbleSizeMediaChart, mediaXScale, mediasData);
}
*/
