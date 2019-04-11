"use strict";

function initSearchMediasBar(mediaSources, mediaChartGroup, tweetsChartGroup, tweetColorScale, tweetSources) {
  var mediaFullNames = Object.keys(mediaSources).map(d=>mediaSources[d].fullName);
  $("#mediaTags").autocomplete({
    source: mediaFullNames,
    select: function(a, b) {
      let name = (mediaSources.filter(function(d){return d.fullName == b.item.value}))[0].name;
      selectNewMedia(name, b.item.value, mediaChartGroup, tweetsChartGroup, tweetColorScale, tweetSources);
    },
    autoFocus: true
  });
}
