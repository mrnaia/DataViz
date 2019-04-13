"use strict";
/**
 * Réalise le preprocessing pour calculer les occurences des mots dans les tweets
 * de chaque média.
 * @param  {string} mediaName nom du média concerné
 * @param  {liste} buckets   liste des buckets avec à l'intérieur des listes de tweets
 * @return {liste}           [{"word": mot, "value": nb_occurences}, {...}, ...]
 */
function getTweetsWords(mediaName, buckets) {
  //Init
  var dataWC = [];
  var wordsOccurences = {};

  //For each bucket
  buckets.forEach(bucket => {
    //For each tweet of the bucket
    bucket.forEach(tweet => {
      let wordList = tweet.full_text
        .replace(/(\r\n|\n|\r|[^a-zA-Z_0-9éèàçùâêûîô @#]*)/gm, "") //Remove bad characters
        .split(" ") //separate the words
        .filter(word => word.length >= 6) //keep only meaningful words
        .filter(word => !word.includes("@")) //remove account names
        .filter(word => !word.includes("#")) //remove hashtags
        .map(word => word.toLowerCase()); //toLowerCase not to be case sensitive
      //Add occurences
      wordList.forEach(word => {
        if (wordsOccurences[word] == undefined) wordsOccurences[word] = 1;
        else wordsOccurences[word]++;
      })
    })
  })
  //Transform into right format
  for(var word in wordsOccurences) {
    dataWC.push({"word": word, "value": wordsOccurences[word]});
  }
  //Keep only the words with the more occurences
  dataWC = dataWC.sort((a,b) => b.value - a.value).slice(0, 200);
  return dataWC;
}
/**
 * Dessine le word cloud du média concerné dans l'élément parent donné.
 * @param  {d3 selection} parentElt    élément parent dans quel mettre le nuage de mots
 * @param  {string} mediaName    nom du média avec le @, concerné par ce nuage de mots
 * @param  {liste} mediaSources les données sur les médias
 */
function drawWordCloud(parentElt, mediaName, mediaSources) {
  //Choix de la couleur
  var my_color = d3.interpolateCool;
  //Utilisation de la librairie
  window.makeWordCloud(getTweetsWords(mediaName, mediaSources), parentElt, 500, "wordCloudMedia", "Impact", false, my_color);
}
