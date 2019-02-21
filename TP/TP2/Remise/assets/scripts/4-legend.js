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
    .attr("class","legend") //groupe contenant l'ensemble de la légende

  sources.forEach((el,i) => {
    let legLine = leg.append("g") // un groupe pour chaque ligne : chaque ligne contient un rect : carré de couleur et un text : nom de la rue
      .style("cursor", "pointer") //change l'aspect du curseur quand on peut cliquer sur une rue

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
    ); //quand on clique on gère l'affichage / le masquage de la rue sur le focus et le contexte et le carré devient blanc
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
  var stName = element.select("text").text();

  var display = d3.selectAll("."+stName).attr("display")
  if(display!="none"){ // si la rue était affichée
    d3.selectAll("."+stName).attr("display","none") // on la cache dans focus et dans context
    element.select("rect").style("fill","white"); // on met le carré de la légende en blanc
  } else{
    d3.selectAll("."+stName).attr("display","initial") //on réaffiche
    element.select("rect").style("fill",(d, i) => {
      if (stName === "Moyenne") return "black";
      else return color(stName); //on recolorie le carré de la bonne couleur
    });
  }

}
