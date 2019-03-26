// GLOBAL SVG
var svgSetup = {height: "1000", width: "100%"};

// MEDIA BUBBLE CHART

//Values of population for the 'countries'
var pays_population = {France: 67190000, Quebec: 8390000};

// How many pixels of axis are beyond the range of bubbles ?
var axisMargin = 50;

// Min and max in pixels of the radius of media bubbles
var mediaBubblesSize = {min: 5, max: 50};
// Min and max X positions of the media chart in the SVG
var xMediasPositions = {min: 0 + axisMargin, max: 500 + axisMargin};
// Y position (from the top of SVG) of the first media chart
var yMediasPosition = 100;

var center = {"x": 0, "y": yMediasPosition}

// TWEETS BUBBLE CHART
