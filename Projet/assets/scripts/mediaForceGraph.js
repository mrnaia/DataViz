"use strict";
/**
 * Calcule la position selon l'origine et la catégorie associée à l'élément et le nombre de filtres utilisés actuellement
 * @param  {string} country  Le pays associé à cette bulle
 * @param  {string} category La catégorie (televisuelle ...) associée à cette bulle
 * @return {number}          Le point attracteur en y
 */
function getMediaYPosition(country, category) {
  var locationIndex = 0;
  if(country == "Quebec" && countryChecked){
    locationIndex++;
  }
  if(categoryChecked){
    var categories = Object.keys(categoriesColors);
    if (countryChecked) {
      locationIndex = 3*locationIndex + categories.indexOf(category);
    } else {
      locationIndex += categories.indexOf(category);
    }
  }
  return yMediasPosition + locationIndex * interCategorySpace;
}

//
/**
 * fonction qui maintient les cercles de chaque tweet d'un même groupe ensemble
 * @param  {array}  source          La liste des médias.
 * @param  {d3 selection} bubbleGroups    Le groupe des bulles des médias
 * @param  {d3 scale} sizeBubbleScale L'echelle qui dicte la taille des médias en fonction de leur popularité
 * @param  {d3 scale} xBubbleScale    L'échelle qui place les médias selon leur sentiment moyen
 * @param  {array} mediasData      Les meta données sur les médias
 */
function runMediaSimulation(source,bubbleGroups,sizeBubbleScale, xBubbleScale, mediasData){
  var forceStrength = 0.05;
  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(d => xBubbleScale(d.mean_sentiment)))
    .force('y', d3.forceY().strength(forceStrength).y(d => getMediaYPosition(d.Pays, d.Categorie) ))
    .force('collide', d3.forceCollide(function(d){
      if(d.name in mediasData){
        return sizeBubbleScale(mediasData[d.name].Followers/countries_population[mediasData[d.name].Pays]) + 2;
      }
      else{
        return 10+0.5;
      }

    }))
    .on('tick', d => mediaTicked(d,bubbleGroups));
  simulation.nodes(source);

  //Rerun simulation to filter
  d3.select("#filterCountry").on("click", () => filterMediaBubbles(simulation, forceStrength));
  d3.select("#filterCategory").on("click", () => filterMediaBubbles(simulation, forceStrength));
}

/**
 * Met à jour la position du cercle représentant le média en fonction de la simulation
 * @param  {Object} d            La donnée qui stocke la valeur de la simulation
 * @param  {d3 selection} bubbleGroups Le groupe des bulles des médias
 */
function mediaTicked(d,bubbleGroups) {
    bubbleGroups.select("circle")
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
}

/**
 * Lorsqu'un filtres est appliqué, relance la simulation
 * @param  {d3 simulation} simulation    La force simulation
 * @param  {number} forceStrength La puissance de la force d'attraction
 */
function filterMediaBubbles(simulation, forceStrength){
  updateFilterCheck();
  //Changed attraction center
  simulation.force('y', d3.forceY().strength(forceStrength*3).y((d => getMediaYPosition(d.Pays, d.Categorie))))
  .velocityDecay(0.4)
  .restart()
  .alpha(1);

  updateMediaBubblesAxis();

  if(tweetChartActive){
    updateTweetChart();
  }
}
