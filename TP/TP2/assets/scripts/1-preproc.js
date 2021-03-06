"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */


/**
 * Précise le domaine en associant un nom de rue à une couleur précise.
 *
 * @param color   Échelle de 10 couleurs.
 * @param data    Données provenant du fichier CSV.
 */
function domainColor(color, data) {
  // TODO: Définir le domaine de la variable "color" en associant un nom de rue à une couleur.
  color.domain(data.columns.slice(1));
}

/**
 * Convertit les dates se trouvant dans le fichier CSV en objet de type Date.
 *
 * @param data    Données provenant du fichier CSV.
 * @see https://www.w3schools.com/jsref/jsref_obj_date.asp
 */


function parseDate(data) {
    // TODO: Convertir les dates du fichier CSV en objet de type Date.
  var parseTime = d3.timeParse("%d/%m/%y"); //format de la date
  var columns = data.columns;
  data=data.map(el=>{
    el.Date = parseTime(el.Date);
    return el;
  }); // on remplace chaque element de data par sa version en format date
  data.columns = columns;
}

/**
 * Trie les données par nom de rue puis par date.
 *
 * @param color     Échelle de 10 couleurs (son domaine contient les noms de rues).
 * @param data      Données provenant du fichier CSV.
 *
 * @return Array    Les données triées qui seront utilisées pour générer les graphiques.
 *                  L'élément retourné doit être un tableau d'objets comptant 10 entrées, une pour chaque rue
 *                  et une pour la moyenne. L'objet retourné doit être de la forme suivante:
 *
 *                  [
 *                    {
 *                      name: string      // Le nom de la rue,
 *                      values: [         // Le tableau compte 365 entrées, pour les 365 jours de l'année.
 *                        date: Date,     // La date du jour.
 *                        count: number   // Le nombre de vélos compté ce jour là (effectuer une conversion avec parseInt)
 *                      ]
 *                    },
 *                     ...
 *                  ]
 */
function createSources(color, data) {
  // TODO: Retourner l'objet ayant le format demandé.

  var streets = data.columns.slice(1) //Recupere les noms de rues
  var dicco_street_values = []; //format {"rue":{values:[{date:Date count: number}]}}
  var nbSt = streets.length; //Le nombre de rues
  data.forEach(el=>{
    for (var i = 0; i < nbSt; i++) { //Balaye toutes les rues pour cette echantillon
      let street = streets[i];
      if(dicco_street_values[street] && dicco_street_values[street].values){ //Si le conteneur finale est initialiser
        dicco_street_values[streets[i]].values.push({"date":el.Date,"count":parseInt(el[street])}) //On ajoute a values cet échantillon
      }else{
        dicco_street_values[street] = {"values": [{"date":el.Date,"count":parseInt(el[street])}]} // on initialise l'entrée coorespondant à la rue
      }
    }
  });
  return streets.map(el => {
    let values = dicco_street_values[el].values;
    return {"name":el, values}
  })
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe X.
 *
 * @param xFocus      Échelle en X utilisée avec le graphique "focus".
 * @param xContext    Échelle en X utilisée avec le graphique "contexte".
 * @param data        Données provenant du fichier CSV.
 */
function domainX(xFocus, xContext, data) {
  // TODO: Préciser les domaines pour les variables "xFocus" et "xContext" pour l'axe X.
  let minX = d3.min(data, d => d.Date); //la plus petite date des datas
  let maxX = d3.max(data, d => d.Date); // la date la plus récente
  xFocus.domain([minX, maxX]); //input domain
  xContext.domain([minX, maxX]);
}

/**
 * Précise le domaine des échelles utilisées par les graphiques "focus" et "contexte" pour l'axe Y.
 *
 * @param yFocus      Échelle en Y utilisée avec le graphique "focus".
 * @param yContext    Échelle en Y utilisée avec le graphique "contexte".
 * @param sources     Données triées par nom de rue et par date (voir fonction "createSources").
 */
function domainY(yFocus, yContext, sources) {
  // TODO: Préciser les domaines pour les variables "yFocus" et "yContext" pour l'axe Y.
  let minY = d3.min(sources, d => d3.min(d.values, val => val.count)); //on trouve le min et le max des données selon l'attribut count, c'est-à-dire le nombre de velos passés chaque jour
  let maxY = d3.max(sources, d =>  d3.max(d.values, val => val.count));
  yFocus.domain([minY, maxY]);
  yContext.domain([minY, maxY]);
}
