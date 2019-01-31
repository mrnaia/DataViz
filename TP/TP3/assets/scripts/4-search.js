"use strict";

/**
 * Fichier permettant de gérer l'affichage d'un résultat de recherche.
 */


/**
 * Permet de mettre en évidence le pays qui a été sélectionné via la barre de recherche.
 *
 * @param countrySelected     Le nom du pays qui a été sélectionné.
 * @param g                   Le groupe SVG dans lequel le graphique à bulles est dessiné.
 */
function search(countrySelected, g) {
  /* TODO:
       - Mettre en évidence le pays sélectionné en coloriant le cercle en noir et en appliquant une opacité de 100%.
       - Appliquez une opacité de 15% aux cercles associés aux autres pays.
   */
  g.selectAll("circle") //Tout d'abord cacher tous les cercles
    .attr('class','hide')

  g.select("#"+countrySelected) //Montrer celui qui correspond à la recherche
    .attr('class','selected')

}

/**
 * Permet de réinitialiser l'affichage à celle par défaut.
 *
 * @param g   Le groupe SVG dans lequel le graphique à bulles est dessiné.
 */
function reset(g) {
  // TODO: Réinitialiser l'affichage du nuage de points à celle par défaut.
  g.selectAll("circle") //Enlever toutes les classes pour ravoir le style initiale
  .attr('class','')

}
