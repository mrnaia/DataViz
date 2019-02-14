"use strict";

/**
 * Fichier permettant de dessiner le diagramme à cordes.
 */


/**
 * Crée les groupes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param arc             Fonction permettant de dessiner les arcs.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://bl.ocks.org/mbostock/4062006
 */
function createGroups(g, data, layout, arc, color, total, formatPercent) {
  /* TODO :
     - Créer les groupes du diagramme qui sont associés aux stations de BIXI fournies.
     - Utiliser un "textPath" pour que les nom de stations suivent la forme des groupes.
     - Tronquer les noms des stations de BIXI qui sont trop longs (Pontiac et Métro Mont-Royal).
     - Afficher un élément "title" lorsqu'un groupe est survolé par la souris.
  */
  var group = g.selectAll("g")
    .data(layout.groups)
    .enter()
    .append("g")
    .attr("class","group")

  group.append("path")
    .attr("fill", d => {
      return color(data[d.index].name)
    })
    .attr("d",arc)
    .property("id",d => data[d.index].name);

  group.append("text")
    .style("font-size","9pt")
    .attr("dy", 17)
    .attr("dx", 10)
    .append("textPath")
    .attr("xlink:href",d => "#"+data[d.index].name)
    .text(d => {
      let text = data[d.index].name;
      if(text === "Métro Mont-Royal (Rivard/Mont-Royal)"){
        text = "Métro Mont-Royal"
      }
      if(text === "Pontiac / Gilford"){
        text = "Pontiac"
      }
      return text
    })
  group.append("title")
    .text(d => data[d.index].name + ": " + formatPercent(d.value/total) + " des départs")
}

/**
 * Crée les cordes du diagramme à cordes.
 *
 * @param g               Le groupe SVG dans lequel le diagramme à cordes doit être dessiné.
 * @param data            Les données provenant du fichier JSON.
 * @param layout          La disposition utilisée par le diagramme à cordes.
 * @param path            Fonction permettant de dessiner les cordes.
 * @param color           L'échelle de couleurs qui est associée à chacun des noms des stations de BIXI.
 * @param total           Le nombre total de trajets réalisés pour le mois d'août 2015.
 * @param formatPercent   Fonction permettant de formater correctement un pourcentage.
 *
 * @see https://beta.observablehq.com/@mbostock/d3-chord-dependency-diagram
 */
function createChords(g, data, layout, path, color, total, formatPercent) {
  /* TODO:
     - Créer les cordes du diagramme avec une opacité de 80%.
     - Afficher un élément "title" lorsqu'une corde est survolée par la souris.
  */
  //console.log(layout);
  g.append("g")

    .selectAll("path")
    .data(layout)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "chord")
    .attr("fill", function(d){
      //console.log(data[d.source.index].destinations[d.target.index]);
      let nbDeparts_source_vers_target =data[d.source.index].destinations[d.target.index].count;
      let nbDeparts_target_vers_src =data[d.target.index].destinations[d.source.index].count ;
      if(nbDeparts_source_vers_target>=nbDeparts_target_vers_src){
        return color(data[d.source.index].name);
      }
      else{
        return color(data[d.target.index].name);
      }
    })
    //revoir couleur, title
}

/**
 * Initialise la logique qui doit être réalisée lorsqu'un groupe du diagramme est survolé par la souris.
 *
 * @param g     Le groupe SVG dans lequel le diagramme à cordes est dessiné.
 */
function initializeGroupsHovered(g) {
  /* TODO:
     - Lorsqu'un groupe est survolé par la souris, afficher les cordes entrant et sortant de ce groupe avec une
       opacité de 80%. Toutes les autres cordes doivent être affichées avec une opacité de 10%.
     - Rétablir l'affichage du diagramme par défaut lorsque la souris sort du cercle du diagramme.
  */

}
