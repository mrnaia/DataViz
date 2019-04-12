"use strict";
/**
 * initialise la barre de recherche
 * @param  {Object} mediaSources     L'ensemble des media et leur données
 * @param  {d3 selections} mediaChartGroup  Le groupe contenant le media chart
 * @param  {d3 selections} tweetsChartGroup Le groupe contenant le media chart
 * @param  {d3 scale} tweetColorScale  L'échelle de couleur des tweets
 * @param  {Object} tweetSources     {media: {buckets:[...]}}
 */
function initSearchMediasBar(mediaSources, mediaChartGroup, tweetsChartGroup, tweetColorScale, tweetSources) {
  var mediaFullNames = Object.keys(mediaSources).map(d=>mediaSources[d].fullName);
  $("#mediaTags").autocomplete({
    source: mediaFullNames,
    select: function(a, b) {
      updateFilterCheck();
      tweetsChartGroup.attr("transform",""); //reset translation of tweet group
      d3.select(".annotations")
        .transition()
        .duration(500)
        .attr("opacity","0")
      let name = (mediaSources.filter(function(d){return d.fullName == b.item.value}))[0].name;
      selectNewMedia(name, b.item.value, mediaChartGroup, tweetsChartGroup, tweetColorScale, tweetSources);
    },
    autoFocus: true
  });
}
