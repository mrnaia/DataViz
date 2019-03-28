// GLOBAL SVG
var svgSetup = {height: "1000", width: "100%"};


// MEDIA BUBBLE CHART

//Values of population for the 'countries'
var countries_population = {France: 67190000, Quebec: 8390000};

//Bubble colors legend
var countriesColors = {France: "#000", Quebec: "#ddd"};
var categoriesColors = {Tele: "#9adb0f", Ecrit: "#1ad5f2", Radio: "#ed8210"};

// How many pixels of horizontal axis are beyond the range of bubbles ?
var axisMarginX = 50;
// How many pixels of vertical axis are beyons the horizontal axis ?
var axisMarginY = 70;

// Min and max in pixels of the radius of media bubbles
var mediaBubblesSize = {min: 5, max: 50};
// Min and max X positions of the media chart in the SVG
var xMediasPositions = {min: 0 + axisMarginX, max: 500 + axisMarginX};
// Y position (from the top of SVG) of the first media chart
var yMediasPosition = 200;
// Initial position in the SVG of media Bubbles before begin of simulation
var initPosition = {"x": (xMediasPositions.min + xMediasPositions.max)/2, "y": yMediasPosition};

// Space in number of pixels between each category separated
var interCategorySpace = 100;

// Transition axis duration in ms
var transitionAxisDuration = 500;

// Global values for checkboxes
var countryChecked;
var categoryChecked;
// Global variable that contains the number of categories displayed
var nbCategoriesDisplayed = 1;

// TWEETS BUBBLE CHART

// Min and Max values of tweets bubbles sizes
var tweetBubblesSize = {min: 40, max: 50000};
// X and Y values of the 3 attraction points for tweets
var attractionPoints = [[400, 700], [800, 700], [1200, 700]];
// Percentage of svg width between right svg border and left attractor center
var leftPositionPercentageAttractionPoint = 20;
// Separation between media chart and tweet chart in px
var tweetMarginTop = 20;
// height tweets chart in px
//TODO une taille pour chaque media a changer
var tweetHeight = 200;

// Size of the collision Tweets margin
var collisionTweetMargin = 1;
var forceStrengthTweet = 0.03;
var simulationTweet;
var tweetChartActive = false;
