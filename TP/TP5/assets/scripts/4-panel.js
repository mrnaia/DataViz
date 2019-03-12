"use strict";

/**
 * Fichier permettant de gérer l'affichage du panneau d'informations pour une circonscription.
 */


/**
 * Met à jour les domaines X et Y utilisés par le diagramme à bandes horizontales lorsque les données sont modifiées.
 *
 * @param districtSource    Les données associées à une circonscription.
 * @param x                 L'échelle X.
 * @param y                 L'échelle Y.
 */
function updateDomains(districtSource, x, y) {
  /* TODO: Mettre à jour les domaines selon les spécifications suivantes:
       - Le domaine X varie entre le minimum et le maximum de votes obtenus pour les candidats de la circonscription;
       - Le domaine Y correspond au nom des partis politiques associés aux candidats qui se sont présentés. Assurez-vous
         que les partis sont triés en ordre décroissant de votes obtenus (le parti du candidat gagnant doit se retrouver
         en premier).
   */
  var results = districtSource.results;
  x.domain([d3.min(results,el => el.votes),d3.max(results,el => el.votes)]);
  y.domain(results.map(el => el.party));
}

/**
 * Met à jour les informations textuelles se trouvant dans le panneau à partir des nouvelles données fournies.
 *
 * @param panel             L'élément D3 correspondant au panneau.
 * @param districtSource    Les données associées à une circonscription.
 * @param formatNumber      Fonction permettant de formater correctement des nombres.
 */
function updatePanelInfo(panel, districtSource, formatNumber) {
  /* TODO: Mettre à jour les informations textuelles suivantes:
       - Le nom de la circonscription ainsi que le numéro;
       - La nom du candidat gagnant ainsi que son parti;
       - Le nombre total de votes pour tous les candidats (utilisez la fonction "formatNumber" pour formater le nombre).
   */
  panel.select("#district-name")
    .text(districtSource.name + "["+ districtSource.id +"]");
  panel.select("#elected-candidate")
    .text(districtSource.results[0].candidate);
  panel.select("#votes-count")
    .text(formatNumber(districtSource.results[0].votes) + " votes")
}

/**
 * Met à jour le diagramme à bandes horizontales à partir des nouvelles données de la circonscription sélectionnée.
 *
 * @param gBars             Le groupe dans lequel les barres du graphique doivent être créées.
 * @param gAxis             Le groupe dans lequel l'axe des Y du graphique doit être créé.
 * @param districtSource    Les données associées à une circonscription.
 * @param x                 L'échelle X.
 * @param y                 L'échelle Y.
 * @param yAxis             L'axe des Y.
 * @param color             L'échelle de couleurs qui est associée à chacun des partis politiques.
 * @param parties           Les informations à utiliser sur les différents partis.
 *
 * @see https://bl.ocks.org/hrecht/f84012ee860cb4da66331f18d588eee3
 */
function updatePanelBarChart(gBars, gAxis, districtSource, x, y, yAxis, color, parties) {
  /* TODO: Créer ou mettre à jour le graphique selon les spécifications suivantes:
       - Le nombre de votes des candidats doit être affiché en ordre décroissant;
       - Le pourcentage obtenu par chacun des candidats doit être affiché à droite de le barre;
       - La couleur de la barre doit correspondre à la couleur du parti du candidat. Si le parti du candidat n'est pas
         dans le domaine de l'échelle de couleurs, la barre doit être coloriée en gris;
       - Le nom des partis doit être affiché sous la forme abrégée. Il est possible d'obtenir la forme abrégée d'un parti
         via la liste "parties" passée en paramètre. Il est à noter que si le parti ne se trouve pas dans la liste "parties",
         vous devez indiquer "Autre" comme forme abrégée.
   */

  //Vertical axis
  yAxis.tickFormat(function(d){
    var party = parties.filter(elt => elt.name == d);
    if (party.length == 0) return "Autre";
    else return party[0].abbreviation;
  });
  gAxis.attr("class", "y axis")
    .call(yAxis);

  //Rectangles
  gBars.selectAll("rect").remove(); //Remove previous ones
  //Update with new data
  var rect = gBars.selectAll("rect")
    .data(districtSource.results);
  var rectEnter = rect.enter().append("rect");
  rect = rectEnter.merge(rect)
  //Define attributes
    .attr("x", 0)
    .attr("y", d => y(d.party))
    .attr("height", d => {
      var yRange = y.range()
      return (yRange[1] - yRange[0]) / (districtSource.results.length + 1);
    })
    .attr("width", d => x(d.votes))
    .style("fill", d => {
      if (color.domain().includes(d.party)) return color(d.party);
      else return "grey";
    });
  rect.exit().remove();

  //Text percentages
  gBars.selectAll("text").remove(); //Remove previous ones
  //Update with new data
  var text = gBars.selectAll("text")
    .data(districtSource.results)
  var textEnter = text.enter().append("text");
  text = textEnter.merge(text)
    //Define attributes
    //y position of the label is halfway down the bar
    .attr("y", function (d) {
      var yRange = y.range()
      return y(d.party) + (yRange[1] - yRange[0]) / (districtSource.results.length + 1) /2 + 3;
    })
    //x position is 3 pixels to the right of the bar
    .attr("x", d => x(d.votes) + 3)
    .text(d => d.percent);
  text.exit().remove();
}

/**
 * Réinitialise l'affichage de la carte lorsque la panneau d'informations est fermé.
 *
 * @param g     Le groupe dans lequel les tracés des circonscriptions ont été créés.
 */
function reset(g) {
  // Réinitialiser l'affichage de la carte en retirant la classe "selected" de tous les éléments.
  g.selectAll(".selected").classed("selected", false);
}
