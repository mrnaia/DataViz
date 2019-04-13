"use strict";
/**
 * [getTweetsWords description]
 * @param  {[type]} mediaName [description]
 * @param  {[type]} buckets   [description]
 * @return {[type]}           [description]
 */
function getTweetsWords(mediaName, buckets) {
  var dataWC = [];
  var wordsOccurences = {};

  buckets.forEach(bucket => {
    bucket.forEach(tweet => {
      let wordList = tweet.full_text
        .replace(/(\r\n|\n|\r|[^a-zA-Z_0-9éèàçùâêûîô @#]*)/gm, "")
        .split(" ")
        .filter(word => word.length >= 6)
        .filter(word => !word.includes("@"))
        .filter(word => !word.includes("#"))
        .map(word => word.toLowerCase());
      wordList.forEach(word => {
        if (wordsOccurences[word] == undefined) wordsOccurences[word] = 1;
        else wordsOccurences[word]++;
      })
    })
  })

  for(var word in wordsOccurences) {
    dataWC.push({"word": word, "value": wordsOccurences[word]});
  }

  dataWC = dataWC.slice(0, 200);
  //console.log(dataWC.sort((a,b) => b.value - a.value))
  return dataWC;
}
/**
 * [drawWordCloud description]
 * @param  {[type]} parentElt    [description]
 * @param  {[type]} mediaName    [description]
 * @param  {[type]} mediaSources [description]
 */
function drawWordCloud(parentElt, mediaName, mediaSources) {
  var my_color = d3.interpolateCool;
  window.makeWordCloud(getTweetsWords(mediaName, mediaSources), parentElt, 500, "wordCloudMedia", "Impact", false, my_color);
}
