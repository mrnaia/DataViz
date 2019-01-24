"use strict";

/**
 * Fichier permettant de générer la légende et de gérer les interactions de celle-ci.
 */


/**
 * Crée une légende à partir de la source.
 *
 * @param svg       L'élément SVG à utiliser pour créer la légende.
 * @param sources   Données triées par nom de rue et par date.
 * @param color     Échelle de 10 couleurs.
 */
function legend(svg, sources, color) {
  // TODO: Créer la légende accompagnant le graphique.

  var legGapToYAxis = 10;
  var legGapToTop = 20;
  var legLineVertGap = 25;

  var leg = svg.select('g')
    .append("g")
    .attr("class","legend")

  sources.forEach((el,i) => {
    let legLine = leg.append("g")
      //.attr("class", "legLine")

    legLine.append('rect')
      .attr("x", legGapToYAxis)
      .attr("y", i*legLineVertGap + legGapToTop)
      .attr("width", 10)
      .attr("height", 10)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .style("fill", (d, i) => {
        if (el.name === "Moyenne") return "black";
        else return color(el.name);
      });

    legLine.append('text')
      .attr("x", legGapToYAxis + 20)
      .attr("y", i*legLineVertGap + legGapToTop + 10)
      .attr("font-size", "15px")
      .text((d,i) => {
        return el.name;
      });

      legLine.on("click", function(){
        return displayLine(d3.select(this), color)}
      );
  })


}

/**
 * Permet d'afficher ou non la ligne correspondant au carré qui a été cliqué.
 *
 * En cliquant sur un carré, on fait disparaitre/réapparaitre la ligne correspondant et l'intérieur du carré
 * devient blanc/redevient de la couleur d'origine.
 *
 * @param element   Le carré qui a été cliqué.
 * @param color     Échelle de 10 couleurs.
 */
function displayLine(element, color) {
  // TODO: Compléter le code pour faire afficher ou disparaître une ligne en fonction de l'élément cliqué.
  console.log(element.select("text").text());
}
