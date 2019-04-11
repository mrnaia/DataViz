
// Fonction qui update tous les setupValues non constants nécessaires lors d'un redimensionnement
function updateWindowSize(svg) {
  svgBounds = svg.node().getBoundingClientRect(); //To compute the new bounds after CSS applied

  //MEDIA

  axisMarginX = axisMarginXPercentage/100 * svgBounds.width;
  axisMarginY = axisMarginYPercentage/100 * svgBounds.width;

  mediaBubblesSize = {min: mediaBubblesSizePercentage.min/100 * svgBounds.width, max: mediaBubblesSizePercentage.max/100 * svgBounds.width}; //or min in pixels maybe ?
  xMediasPositions = {min: 0 + axisMarginX, max: svgBounds.width - axisMarginX};

  yMediasPosition = topMediaMarginY + axisMarginY;

  initPosition = {"x": (xMediasPositions.min + xMediasPositions.max)/2, "y": yMediasPosition};

  interCategorySpace = mediaBubblesSize.max*interCategorySpaceCoef;

  updateFilterCheck();


  //TWEETS

  tweetBubblesSize = {min: tweetBubblesSizePercentage.min/100 * svgBounds.width, max: tweetBubblesSizePercentage.max/100 * svgBounds.width};

  tweetsYPosition = yMediasPosition + interCategorySpace*nbCategoriesDisplayed + axisMarginY + tweetVerticalMargin + tweetHeight/2;

  attractionPoints = [[svgBounds.width*leftPositionPercentageAttractionPoint/100, 1000], [svgBounds.width/2, 1000], [svgBounds.width*(1-leftPositionPercentageAttractionPoint/100), 1000]];





}
