"use strict";

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

//FORMATAGE DES DONNEES

 /**
  *
  * @param data      Données provenant du fichier CSV.
  * @return Object
  *                    {
  *                      "@NomDuMedia": {
                          buckets :
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
    tweet.sentiment = +tweet.sentiment
    tweet.retweet_count = +tweet.retweet_count
    if(!(tweet.searchTerm in sources)){
      //on lui crée une entrée
      sources[tweet.searchTerm]  = {"number_tweets_and_RT":0,"cumul_sentiment":0,"tweets":[],"buckets":new Array(numberBucket) };
      sources[tweet.searchTerm].buckets.fill([]);
    }
    //nombre de retweets
    sources[tweet.searchTerm].number_tweets_and_RT += 1 + +tweet.retweet_count;
    //sentiment
    sources[tweet.searchTerm].cumul_sentiment += +tweet.sentiment*(1 + +tweet.retweet_count);
    //ajout de la ligne des données du tweets dans le tableau de sortie

    //sources[tweet.searchTerm].tweets = sources[tweet.searchTerm].tweets.concat([tweet]);

    //Buckets
    var bucketIndex = Math.floor(numberBucket/2*(+tweet.sentiment+1));
    sources[tweet.searchTerm].buckets[bucketIndex] = sources[tweet.searchTerm].buckets[bucketIndex].concat([tweet])
  })
  //pour chaque media, on calcule son sentiment moyen
  for(var media in sources){
    sources[media].mean_sentiment = +sources[media].cumul_sentiment / +sources[media].number_tweets_and_RT;
    for (var i = 0; i < numberBucket; i++) {
      sources[media].buckets[i] = sources[media].buckets[i].sort((tweetA,tweetB) => +tweetB.retweet_count - +tweetA.retweet_count)
    }
  }
  return sources;
}

/**
 * Fichier permettant de traiter les données provenant du fichier CSV.
 */

 /**
  *
  * @param tweetSources      L'object au format de la sortie de la fonction précedente
  * @param mediasData       Les informations sur tous les medias issues du fichier csv
  * @return Object
  *                    [
  *                      {
  *                        fullName: $NomDuMedia$ en string
  *                        number_tweets_and_RT: number //How many tweets + retweets
  *                        mean_sentiment : number
                           categorie : string
                           Pays : string
                           name : "@Nom"
                           vx :
                           vy :
                           x :
                           y :
  *                      }
  *                      ...
  *                    ]
  */
function createMediaSources(tweetSources, mediasData){
  var mediaSources = []
  for(var media in tweetSources){
    var mediaInfo = mediasData[media];
    mediaSources.push({name: media,fullName: mediaInfo.Nom, Pays:mediaInfo.Pays, Categorie: mediaInfo.Categorie, number_tweets_and_RT:tweetSources[media].number_tweets_and_RT,mean_sentiment:tweetSources[media].mean_sentiment})
  }
  return mediaSources;
}

//relie le compte d'un media avec ses autres informations
function formatMediasData(data){
  var output = {};
  data.forEach((media) => {
    output[media.Compte] = {Categorie : media.Categorie, Followers : media.Followers, Nom : media.Nom, Pays : media.Pays};
  })
  return output;
}

function createMediaSplitMetadata() {
  var countries = Object.keys(countriesColors);
  var categories = Object.keys(categoriesColors);
  var axisData = [];
  countries.forEach(country => {
    categories.forEach(category => {
      axisData.push({country: country, category: category});
    });
  });
  return axisData;
}

//DOMAINES DES SCALES
function domainMediaBubbleSize(scale, data, pays){
  //la taille des bulles depend du nombre de followers divisé par la population
  let min = d3.min(data, d => Math.sqrt(d.Followers/pays[d.Pays]));
  let max = d3.max(data, d => Math.sqrt(d.Followers/pays[d.Pays]));
  scale.domain([min,max]);
}

//couleur des tweets depend du nombre de retweets
function domainTweetColorScale(scale, tweetsSources){
  var maxRetweet = 0;
  for(const media in tweetsSources){
    maxRetweet = Math.max(maxRetweet,d3.max(tweetsSources[media].buckets,d=>d3.max(d,d1=>+d1.retweet_count)));
  };
  scale.domain([0, Math.log10(maxRetweet)]);
}

//CREATION DES SCALES DE COULEURS
function colorCountry(){
  var scale = d3.scaleOrdinal().range(Object.values(countriesColors)).domain(Object.keys(countriesColors));
  return scale;
}
function colorCategory(){
  var scale = d3.scaleOrdinal().range(Object.values(categoriesColors)).domain(Object.keys(categoriesColors));
  return scale;
}
