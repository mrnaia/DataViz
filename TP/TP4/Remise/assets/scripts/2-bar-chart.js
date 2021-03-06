"use strict";

/**
 * Fichier permettant de dessiner le graphique à bandes.
 */


/**
 * Crée les axes du graphique à bandes.
 *
 * @param g       Le groupe SVG dans lequel le graphique à bandes doit être dessiné.
 * @param xAxis   L'axe X.
 * @param yAxis   L'axe Y.
 * @param height  La hauteur du graphique.
 */
function createAxes(g, xAxis, yAxis, height) {
  // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.

  // Axe horizontal
  g.append("g") //axe
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //Put the axis at the right place
    .call(xAxis);
  g.selectAll(".tick > text") //nom des catégories
    .attr("x", 10)
    .attr("y", 20)
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start")

  // Axe vertical
  g.append("g") //axe
    .attr("class", "y axis")
    .call(yAxis);
  g.append("text") //nom de l'axe
    .attr("x", -25)
    .attr("y", -10)
    .style("text-anchor", "start")
    .style("font-size", "8pt")
    .text("Nombre de trajets")
}

/**
 * Crée le graphique à bandes.
 *
 * @param g             Le groupe SVG dans lequel le graphique à bandes doit être dessiné.
 * @param currentData   Les données à utiliser.
 * @param x             L'échelle pour l'axe X.
 * @param y             L'échelle pour l'axe Y.
 * @param color         L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param tip           L'infobulle à afficher lorsqu'une barre est survolée.
 * @param height        La hauteur du graphique.
 */
function createBarChart(g, currentData, x, y, color, tip, height) {
  // TODO: Dessiner les cercles à bandes en utilisant les échelles spécifiées.
  //       Assurez-vous d'afficher l'infobulle spécifiée lorsqu'une barre est survolée.

    var width = 84;
    g.selectAll("rect")
      .data(currentData.destinations)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name) + 44 - width/2)
      .attr("y", d => y(d.count))
      .attr("height",d => height - y(d.count))
      .attr("width", width)
      .attr("fill", d => color(d.name))
      .on('mouseover', tip.show) //affiche les infobulles quand on passe la souris sur un cercle
      .on("mouseout", tip.hide);
}

/**
 * Réalise une transition entre les données actuellement utilisées et les nouvelles qui doivent être utilisées.
 *
 * @param g         Le groupe SVG dans lequel le graphique à bandes est dessiné.
 * @param newData   Les nouvelles données à utiliser.
 * @param y         L'échelle pour l'axe Y.
 * @param yAxis     L'axe Y.
 * @param height    La hauteur du graphique.
 */
function transition(g, newData, y, yAxis, height) {
  /* TODO:
   - Réaliser une transition pour mettre à jour l'axe des Y et la hauteur des barres à partir des nouvelles données.
   - La transition doit se faire en 1 seconde.
  */

  domainY(y, newData); //mise à jour du domaine

  //mise à jour de l'axe
  g.select("g.y.axis")
    .transition()
    .duration(1000) //1 seconde
    .call(yAxis);

  //mise à jour des barres
  g.selectAll("rect")
    .data(newData.destinations)
    .transition()
    .duration(1000) // 1 seconde
    .attr("y", d => y(d.count)) //le y correspond au coin en haut à gauche de la barre
    .attr("height", d => height - y(d.count));  
}

/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées à la barre survolée par la souris.
 * @param currentData     Les données qui sont actuellement utilisées.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d, currentData, formatPercent) {
  // TODO: Retourner le texte à afficher dans l'infobulle selon le format demandé.
  //       Assurez-vous d'utiliser la fonction "formatPercent" pour formater le pourcentage correctement.
  var total = d3.sum(currentData.destinations, d => d.count);
  return d.count + " (" + formatPercent(d.count/total) + ")";
}
