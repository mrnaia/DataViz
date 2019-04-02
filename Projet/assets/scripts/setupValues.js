// GLOBAL SVG
var svgSetup = {height: "0", width: "100%"};
var svgBounds;



// MEDIA BUBBLE CHART

//Values of population for the 'countries'
const countries_population = {France: 67190000, Quebec: 8390000};

//Bubble colors legend
const countriesColors = {France: "#000", Quebec: "#ddd"};
const categoriesColors = {Tele: "#9adb0f", Ecrit: "#1ad5f2", Radio: "#ed8210"};
var hauteur_legende;
var largeur_legende;
// Percentage value must be setup, the other one is calculated at init

// How many pixels of horizontal axis are beyond the range of bubbles ?
const axisMarginXPercentage = 5;
var axisMarginX; //computed at init, px
// How many pixels of vertical axis are beyond the horizontal axis ?
const axisMarginYPercentage = 10;
var axisMarginY; //computed at init, px

// Min and max of radius of media bubbles in % of svg width
const mediaBubblesSizePercentage = {min:0.5, max: 10};
// Min and max in pixels of the radius of media bubbles
var mediaBubblesSize; //Computed at init, {min: px, max: px}

// Min and max X positions of the media chart in the SVG
var xMediasPositions; //computed at init {min: px, max: px}

//Margin over the media chart for title and legend
const topMediaMarginY = 100; //px
// Y position (from the top of SVG) of the first media chart
var yMediasPosition;

// Initial position in the SVG of media Bubbles before begin of simulation
var initPosition; //computed at init, {x: px, y: px}

// coef to determine the interCategorySpace
const interCategorySpaceCoef = 1.3;
// Space in number of pixels between each category separated
var interCategorySpace; //computed at init px

// Transition axis duration in ms
const transitionAxisDuration = 500;

// Global values for checkboxes
var countryChecked; //bool
var categoryChecked; //bool
// Global variable that contains the number of categories displayed
var nbCategoriesDisplayed; //1, 2, 3 or 6

// TWEETS BUBBLE CHART

// Min and Max values of tweets bubbles sizes in percentage
const tweetBubblesSizePercentage = {min: 5, max: 300};
// Min and Max values of tweets bubbles sizes
var tweetBubblesSize;

// Percentage of svg width between right svg border and left attractor center
const leftPositionPercentageAttractionPoint = 20;
// X and Y values of the 3 attraction points for tweets
var attractionPoints; //[[px, px], [px, px], [px, px]]
var tweetsYPosition;
// height tweets chart in px
var tweetHeight = 500; //Calculated for each media // TODO

// Separation between media chart and tweet chart in px
const tweetVerticalMargin = 100;
const tweetLegendMargin = 10;
// Simulation setup values
var forceStrengthTweet = 0.05;
var tweetChartActive = false;
var tweetSimuDone; //bool that says if tweets are displayed or not
var fractionToShowTip = 0.5;
// Size of the collision Tweets margin
var collisionTweetMargin = 1;

// Height of the gradient rectangle for color legend of tweets in px
const tweetLegendHeight = 45;
