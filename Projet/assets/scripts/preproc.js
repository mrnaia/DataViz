"use strict";
//FORMATAGE DES DONNEES
 /**
  *
  * @param data      Données provenant du fichier CSV.
  * @return Object
  *                    {
  *                      "@NomDuMedia": {
    *                      number_tweets_and_RT: number //How many tweets + retweets
    *                      cumul_sentiment: number //The total sentiment score weighted by the retweet_count
    *                       mean_sentiment
    *                      buckets: [
    *                      [{full_text, date, retweetes, likes, comptes,sentiment...},...],[...]
    *                      ]} Liste de tous les buckets trié par sentiment croissant contenant les tweets au sentiment associé
  *                      ...
  *                    }
  */
function createSources(data){
  var sources = {}
  //pour chaque tweet de la base de données
  data.forEach((tweet) => {
    //Parse sentiment et nombre de retweet
    tweet.sentiment = +tweet.sentiment
    tweet.retweet_count = +tweet.retweet_count
    if(!(tweet.searchTerm in sources)){
      //on lui crée une entrée
      sources[tweet.searchTerm]  = {"number_tweets_and_RT":0,"cumul_sentiment":0,"buckets":new Array(numberBucket) };
      sources[tweet.searchTerm].buckets.fill([]);
    }
    //nombre de retweets
    sources[tweet.searchTerm].number_tweets_and_RT += 1 + tweet.retweet_count;
    //sentiment
    sources[tweet.searchTerm].cumul_sentiment += tweet.sentiment*(1 + tweet.retweet_count);
    //Buckets
    var bucketIndex = Math.floor(numberBucket/2*(tweet.sentiment+1));
    sources[tweet.searchTerm].buckets[bucketIndex] = sources[tweet.searchTerm].buckets[bucketIndex].concat([tweet])
  })
  //pour chaque media, on calcule son sentiment moyen
  for(var media in sources){
    sources[media].mean_sentiment = +sources[media].cumul_sentiment / +sources[media].number_tweets_and_RT;
    for (var i = 0; i < numberBucket; i++) {
      //On trie chaque saut par nombre de retweet décroissant
      sources[media].buckets[i] = sources[media].buckets[i].sort((tweetA,tweetB) => tweetB.retweet_count - tweetA.retweet_count)
    }
  }
  return sources;
}
 /**
  *
  * @param tweetSources      L'object au format de la sortie de la fonction précedente
  * @param mediasData       Les informations sur tous les medias issues du fichier csv
  * @return Object
  *                    [
  *                      {
  *                        name: le nom du media en string
  *                        fullName: $NomDuMedia$ en string
  *                        Pays: Le pays du media en string
  *                        Categorie: La categorie du media en string
  *                        number_tweets_and_RT: Combien de tweet et retweet en number
  *                        mean_sentiment : Le sentiment moyen en number
  *                      }
  *                      ...
  *                    ] La source du media bubble chart
  */
function createMediaSources(tweetSources, mediasData){
  var mediaSources = []
  for(var media in tweetSources){
    var mediaInfo = mediasData[media];
    mediaSources.push({name: media,fullName: mediaInfo.Nom, Pays:mediaInfo.Pays, Categorie: mediaInfo.Categorie, number_tweets_and_RT:tweetSources[media].number_tweets_and_RT,mean_sentiment:tweetSources[media].mean_sentiment})
  }
  return mediaSources;
}

//
/**
 * Relie le compte d'un media avec ses autres informations. Créer les metadonnes d'un media
 * @param  {Array} data La source des metadonnées lu à partir d'un csvs
 * @return {Object}     {
 *                      "@media" : {
 *                                  Categorie: La categorie du media en string
     *                              Followers: Le nombre d abonnee sur tweeter en number
     *                              Nom:le nom du media en string
     *                              Pays:le pays du media en string
 *                                 }
 *                      }
 */
function formatMediasData(data){
  var output = {};
  data.forEach((media) => {
    output[media.Compte] = {Categorie : media.Categorie, Followers : media.Followers, Nom : media.Nom, Pays : media.Pays};
  })
  return output;
}
/**
 * Créer les metadata des pays pour diviser les medias
 * @return {[type]} [{country: Le pays considere
 *                    category: Une categorie possible}]
 */
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
/**
 * [domainMediaBubbleSize description]
 * @param  {[type]} scale [description]
 * @param  {[type]} data  [description]
 * @param  {[type]} pays  [description]
 * @return {[type]}       [description]
 */
function domainMediaBubbleSize(scale, data, pays){
  //la taille des bulles depend du nombre de followers divisé par la population
  let min = d3.min(data, d => Math.sqrt(d.Followers/pays[d.Pays]));
  let max = d3.max(data, d => Math.sqrt(d.Followers/pays[d.Pays]));
  scale.domain([min,max]);
}

//couleur des tweets depend du nombre de retweets
/**
 * [domainTweetColorScale description]
 * @param  {[type]} scale         [description]
 * @param  {[type]} tweetsSources [description]
 * @return {[type]}               [description]
 */
function domainTweetColorScale(scale, tweetsSources){
  var maxRetweet = 0;
  for(const media in tweetsSources){
    maxRetweet = Math.max(maxRetweet,d3.max(tweetsSources[media].buckets,d=>d3.max(d,d1=>+d1.retweet_count)));
  };
  scale.domain([0, Math.log10(maxRetweet)]);
}

//CREATION DES SCALES DE COULEURS
/**
 * Set le range et domain de l'échelle de couleurs des bulles des média en fonction des couleurs dans le setup values
 * @return {d3 scale} L'échelle de couleur d3
 */
function colorCountry(){
  var scale = d3.scaleOrdinal().range(Object.values(countriesColors)).domain(Object.keys(countriesColors));
  return scale;
}
/**
 * Set le range et domain de l'échelle de couleurs du contour des bulles des média en fonction des couleurs dans le setup values
 * @return {d3 scale} L'échelle de couleur d3
 */
function colorCategory(){
  var scale = d3.scaleOrdinal().range(Object.values(categoriesColors)).domain(Object.keys(categoriesColors));
  return scale;
}
