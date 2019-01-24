"use strict";

/**
 * Fichier permettant de dessiner les graphiques "focus" et "contexte".
 */


/**
 * Crée une ligne SVG en utilisant les domaines X et Y spécifiés.
 * Cette fonction est utilisée par les graphiques "focus" et "contexte".
 *
 * @param x               Le domaine X.
 * @param y               Le domaine Y.
 * @return d3.svg.line    Une ligne SVG.
 *
 * @see https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89      (voir line generator)
 */
function createLine(x, y) {
  // TODO: Retourner une ligne SVG (voir "d3.line"). Pour l'option curve, utiliser un curveBasisOpen.
  return d3.line()
      .x(function(d) {
        return x(d.date); })
      .y(function(d) {
         return y(d.count);
       })
      .curve(d3.curveBasisOpen);
}

/**
 * Crée le graphique focus.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createFocusLineChart(g, sources, line, color) {
  // TODO: Dessiner le graphique focus dans le groupe "g".
  // Pour chacun des "path" que vous allez dessiner, spécifier l'attribut suivant: .attr("clip-path", "url(#clip)").
    g.selectAll("path")
    .data(sources.map(x=>x.values))
    .enter()
    .append("path")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", (el,i) => {
      if (sources[i].name === "Moyenne") return "black";
      else return color(sources[i].name);
    })
    .attr("stroke-width", (el,i) => {
      if (sources[i].name === "Moyenne") return 2;
      else return 1;
    })
    .attr("clip-path", "url(#clip)");


}

/**
 * Crée le graphique contexte.
 *
 * @param g         Le groupe SVG dans lequel le graphique doit être dessiné.
 * @param sources   Les données à utiliser.
 * @param line      La fonction permettant de dessiner les lignes du graphique.
 * @param color     L'échelle de couleurs ayant une couleur associée à un nom de rue.
 */
function createContextLineChart(g, sources, line, color) {

  // TODO: Dessiner le graphique contexte dans le groupe "g".
  g.selectAll("path")
  .data(sources.map(x=>x.values))
  .enter()
  .append("path")
  .attr("d",line)
  .attr("fill", "none")
  .attr("stroke", (el,i) => {
    if (sources[i].name === "Moyenne") return "black";
    else return color(sources[i].name);
  })
  .attr("stroke-width", (el,i) => {
    if (sources[i].name === "Moyenne") return 2;
    else return 1;
  })
  .attr("clip-path", "url(#clip)");
}
