"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

 /**
  *
  * @param data      Données provenant du fichier CSV.
  * @return Object
  *                    {
  *                      "@NomDuMedia": {
  *                      number_tweets_and_RT: number //How many tweets + retweets
  *                      cumul_sentiment: number //The total sentiment score weighted by the retweet_count
                          mean_sentiment
  *                      tweets: [
                            id : unique à l'intérieur d'un média
  *                        //toutes les infos du tweet (full_text, date, retweetes, likes, comptes,sentiment...)
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
    sources[tweet.searchTerm].number_tweets_and_RT += 1 + +tweet.retweet_count;
    //sentiment
    sources[tweet.searchTerm].cumul_sentiment += +tweet.sentiment*(1 + +tweet.retweet_count);
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

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

 /**
  *
  * @param tweetSources      L'object au format de la sortie de la fonction précedente
  * @return Object
  *                    [
  *                    { name: $NomDuMedia$
  *                      number_tweets_and_RT: number //How many tweets + retweets
                          mean_sentiment : number
                        }
  *                      ...
  *                    ]
  */
function createMediaSources(tweetSources, mediasData){
  var mediaSources = []
  for(var media in tweetSources){
    var mediaInfo = mediasData[media];
    mediaSources.push({name: media, Pays:mediaInfo.Pays, Categorie: mediaInfo.Categorie, number_tweets_and_RT:tweetSources[media].number_tweets_and_RT,mean_sentiment:tweetSources[media].mean_sentiment})
  }
  return mediaSources;
}

function formatMediasData(data){
  var output = {};
  data.forEach((media) =>{
    //console.log(media);

    output[media.Compte] = {Categorie : media.Categorie, Followers : media.Followers, Nom : media.Nom, Pays : media.Pays};
    //output[media.Compte] = {Categorie : media.Categorie, Followers : media.Followers, Pays : media.Pays};
  })
  return output;
}

function domainMediaBubbleSize(scale, data, pays){
  let min = d3.min(data, d => Math.sqrt(d.Followers/pays[d.Pays])); // la plus petite date des datas
  let max = d3.max(data, d => Math.sqrt(d.Followers/pays[d.Pays])); // la date la plus récente
  scale.domain([min,max]);
}

function domainTweetBubbleSize(scale, tweetsSources){
  let min = d3.min(Object.values(tweetsSources), d => d3.min(d.tweets, tweet => +tweet.retweet_count));
  let max = d3.max(Object.values(tweetsSources), d => d3.max(d.tweets, tweet => +tweet.retweet_count));
  scale.domain([min, max]);
}


function colorCountry(){
  var scale = d3.scaleOrdinal().range(Object.values(countriesColors)).domain(Object.keys(countriesColors));
  return scale;
}
function colorCategory(){
  var scale = d3.scaleOrdinal().range(Object.values(categoriesColors)).domain(Object.keys(categoriesColors));
  return scale;
}
