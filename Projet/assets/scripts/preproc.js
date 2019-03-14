"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

 /**
  * Trie les données par nom de rue puis par date.
  *
  * @param color     Échelle de 10 couleurs (son domaine contient les noms de rues).
  * @param data      Données provenant du fichier CSV.
  *
  * @return Object
  *                    {
  *                      $NomDuMedia$: {
  *                      number_tweet: number //How many tweets
  *                      cumul_sentiment: number //The total sentiment score weighted by the retweet_count
  *                      tweets: [
  *                        full_text: Date,     // La date du jour.
  *                        count: number   // Le nombre de vélos compté ce jour là (effectuer une conversion avec parseInt)
  *                      ]}
  *                      ...
  *                    }
  */
function createSources(data){
  var sources = {}
  data.forEach((tweet) => {
    if(!(tweet.searchTerm in sources)){
      sources[tweet.searchTerm]  = {"number_tweet":0,"cumul_sentiment":0,"tweets":[]};

    }
    sources[tweet.searchTerm].number_tweet+=1
    sources[tweet.searchTerm].cumul_sentiment += parseFloat(tweet.sentiment)*tweet.retweet_count;
    sources[tweet.searchTerm].tweets = sources[tweet.searchTerm].tweets.concat([tweet]);
  })
  return sources
}
