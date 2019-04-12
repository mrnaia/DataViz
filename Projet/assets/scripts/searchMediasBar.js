"use strict";

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
