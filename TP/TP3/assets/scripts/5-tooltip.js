"use strict";

/**
 * Fichier permettant de définir le texte à afficher dans l'infobulle.
 */


/**
 * Obtient le texte associé à l'infobulle.
 *
 * @param d               Les données associées au cercle survolé par la souris.
 * @param formatNumber    Fonction permettant de formater correctement des nombres.
 * @return {string}       Le texte à afficher dans l'infobulle.
 */
function getToolTipText(d, formatNumber) {
  // TODO: Retourner le texte à afficher dans l'infobulle selon le format demandé.
  //       Assurez-vous d'utiliser la fonction "formatNumber" pour formater les nombres correctement.
  var tipText = "";
  tipText += "Pays: <strong>" + d.name + "</strong><br>";
  tipText += "Espérance de vie: <strong>" + formatNumber(d.lifeExpectancy) + "</strong><br>";
  tipText += "Revenu: <strong>" + formatNumber(d.income) + "</strong> USD<br>";
  tipText += "Population: <strong>" + formatNumber(d.population) + "</strong> habitants<br>";
  tipText += "Zone du monde: <strong>" + formatNumber(d.zone) + "</strong>";
  console.log(tipText)
  return tipText;
}
