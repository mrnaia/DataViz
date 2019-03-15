"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

 /**
  *
  *
  *
  * @param data      Données provenant du fichier CSV.
  *
  * @return Object
  *                    {
  *                      $NomDuMedia$: {
  *                      number_tweets_and_RT: number //How many tweets + retweets
  *                      cumul_sentiment: number //The total sentiment score weighted by the retweet_count
                          mean_sentiment
  *                      tweets: [
                            id : unique à l'intérieur d'un média
  *                        //toutes les infos du teweet (full_text, date, retweetes, likes, comptes,sentiment...)
  *                      ]}
  *                      ...
  *                    }
  */
function createSources(data){
  var sources = {}
  //pour chaque tweet de la base de données
  data.forEach((tweet) => {
    //si le media n'est pas déjà créé dans le tableau
    if(!(tweet.searchTerm in sources)){
      //on lui crée une entrée
      sources[tweet.searchTerm]  = {"number_tweets_and_RT":0,"cumul_sentiment":0,"tweets":[]};
    }
    //nombre de retweets
    sources[tweet.searchTerm].number_tweets_and_RT += +1 + +tweet.retweet_count;
    //sentiment
    sources[tweet.searchTerm].cumul_sentiment += parseFloat(tweet.sentiment)*(1 + tweet.retweet_count);
    //ajout de la ligne des données du tweets dans le tableau de sortie
    sources[tweet.searchTerm].tweets = sources[tweet.searchTerm].tweets.concat([tweet]);
  })
  //pour chaque media, on calcule son sentiment moyen
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
