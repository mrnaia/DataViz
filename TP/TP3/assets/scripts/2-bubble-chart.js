"use strict";

/**
 * Fichier permettant de dessiner le graphique à bulles.
 */


/**
 * Crée les axes du graphique à bulles.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param xAxis   L'axe X.
 * @param yAxis   L'axe Y.
 * @param height  La hauteur du graphique.
 * @param width   La largeur du graphique.
 */
function createAxes(g, xAxis, yAxis, height, width) {
  // Dessiner les axes X et Y du graphique.

  // Axe horizontal
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g.append("text")
    .attr("x", width)
    .attr("y", height-10)
    .style("text-anchor", "end")
    .text("Espérance de vie (années)")

  // Axe vertical
  g.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  g.append("text")
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text(" Revenu (USD)")
}

/**
 * Crée le graphique à bulles.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bulles doit être dessiné.
 * @param data    Les données à utiliser.
 * @param x       L'échelle pour l'axe X.
 * @param y       L'échelle pour l'axe Y.
 * @param r       L'échelle pour le rayon des cercles.
 * @param color   L'échelle pour la couleur des cercles.
 * @param tip     L'infobulle à afficher lorsqu'un cercle est survolé.
 */
function createBubbleChart(g, data, x, y, r, color, tip) {
  // TODO: Dessiner les cercles du graphique en utilisant les échelles spécifiées.
  //       Assurez-vous d'afficher l'infobulle spécifiée lorsqu'un cercle est survolé.

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.lifeExpectancy))
    .attr("cy", d => y(d.income))
    .attr("fill", d => color(d.zone))
    .attr("r", d => r(d.population))
    .on('mouseover', tip.show)
    .on("mouseout", tip.hide)
    .attr("id", d => d.name);

}
