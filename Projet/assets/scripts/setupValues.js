// GLOBAL SVG
var svgSetup = {height: "1000", width: "100%"};

// MEDIA BUBBLE CHART

//Values of population for the 'countries'
var countries_population = {France: 67190000, Quebec: 8390000};

//Bubble colors legend
var countriesColors = {France: "#000", Quebec: "#ddd"};
var categoriesColors = {Tele: "#9adb0f", Ecrit: "#1ad5f2", Radio: "#ed8210"};

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
var tweetBubblesSize = {min: 40, max: 50000};

var attractionPoints = [[400,700],[800,700],[1200,700]] //The coordinates of the points of attraction

var collisionTweetMargin = 1;
