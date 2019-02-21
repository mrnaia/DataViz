"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */


/**
 * Précise le domaine et la plage de couleurs pour l'échelle qui est utilisées pour distinguer les partis politiques.
 *
 * @param color     Échelle de couleurs.
 * @param parties   Les informations à utiliser sur les différents partis.
 */
function colorScale(color, parties) {
  // TODO: Préciser le domaine de l'échelle en y associant chacun des partis politique de la liste spécifiée en paramètre.
  //       De plus, préciser la gamme de couleurs en spécifiant les couleurs utilisées par chacun des partis.
  color.domain(parties.map(d=>d.name));
  color.range(parties.map(d=>d.color));
}

/**
 * Convertit chacun des nombres provenant du fichier CSV en type "number".
 *
 * @param data      Données provenant du fichier CSV.
 */
function convertNumbers(data) {
  // TODO: Convertir les propriétés "id" et "votes" en type "number" pour chacun des éléments de la liste.
  data.forEach(el => {
    el.id = parseInt(el.id);
    el.number = parseInt(el.number);
    el.votes = parseInt(el.votes);
  });
}

/**
 * Réorganise les données afin de combiner les résultats pour une même circonsription.
 *
 * @param data      Données provenant du fichier CSV.
 * @return {Array}  Les données réorganisées qui seront utilisées. L'élément retourné doit être un tableau d'objets
 *                  comptant 338 entrées, c'est-à-dire, une entrée par circonscription. Chacune des entrées devra
 *                  présenter les résultats pour chacun des candidats triés en ordre décroissant (du candidat ayant
 *                  obtenu le plus de votes à celui en ayant reçu le moins). L'objet retourné doit avoir la forme suivante:
 *
 *                  [
 *                    {
 *                      id: number              // Le numéro de la circonscription
 *                      name: string,           // Le nom de la circonscription
 *                      results: [              // Le tableau contenant les résultats pour les candidats s'étant présentés.
 *                                              // *** Ce tableau doit être trié en ordre décroissant de votes. ***
 *                        {
 *                          candidate: string,  // Le nom du candidat
 *                          votes: number,      // Le nombre de votes obtenus pour le candidat
 *                          percent: string,    // Le pourcentage des votes obtenus par le candidat
 *                          party: string       // Le parti politique du candidat
 *                        },
 *                        ...
 *                      ]
 *                    },
 *                    ...
 *                  ]
 */
function createSources(data) {
  // TODO: Retourner l'objet ayant le format demandé. Assurez-vous de trier le tableau "results" pour chacune des entrées
  //       en ordre décroissant de votes (le candidat gagnant doit être le premier élément du tableau).
  //console.log(data);
  data.sort(function(d1,d2){
    return d3.ascending(d1.id, d2.id);
  });//pour etre sur que tous ceux avec le meme id de circonscription soient à la suite
  var array_out=[]; //tableau à retourner
  var index=0; // index actuel du tableau
  var previous_id = data[0].id; //id du premier element de data
  array_out.push({"id" : previous_id, "name":data[0].name, "results" :[]}); //on initialise la premiere entree de notre tableau
  data.forEach(function(elt){ //pour chaque ligne de data
    if(elt.id==previous_id){ //si on a pas fini de traiter une circonscription
      //on ajoute le candidat et ses résltats dans le tableau de results de la circonscription
      array_out[index].results.push({"candidate" :elt.candidate, "votes" : elt.votes, "percent" : elt.percent, "party": elt.party});
    }
    else{
      //sinon, on a fini avec une circonscription donc on trie son tableau
      array_out[index].results.sort(function(e1,e2){
        return d3.descending(e1.votes,e2.votes);
      })
      previous_id = elt.id;
      //on passe a la circonscription suivante
      index++;
      array_out.push({"id" : previous_id, "name":elt.name, "results" :[]}); //on initialise l'entree pour cette nouvelle circonscription
      array_out[index].results.push({"candidate" :elt.candidate, "votes" : elt.votes, "percent" : elt.percent, "party": elt.party}); //on ajoute le premier candidat
    }

  })

  //trier le dernier tableau :
  array_out[index].results.sort(function(e1,e2){
    return d3.descending(e1.votes,e2.votes);
  });

  return array_out;


}
