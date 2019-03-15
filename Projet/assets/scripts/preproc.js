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
      sources[tweet.searchTerm]  = {"number_tweets_and_RT":0,"cumul_sentiment":0,"tweets":[]};
    }
    sources[tweet.searchTerm].number_tweets_and_RT += +1 + +tweet.retweet_count;
    sources[tweet.searchTerm].cumul_sentiment += parseFloat(tweet.sentiment)*(1 + tweet.retweet_count);
    sources[tweet.searchTerm].tweets = sources[tweet.searchTerm].tweets.concat([tweet]);
  })
  for(var media in sources){
    sources[media].mean_sentiment = +sources[media].cumul_sentiment / +sources[media].number_tweets_and_RT;
    var id = 0;
    sources[media].tweets.forEach(tweet => {
      tweet["id"] = id;
      id++;
    })
  }
  return sources;
}
