/**
 * Mets à jour tous les setupValues non constants nécessaires lors d'un redimensionnement
 * @param  {d3 selection} svg [description]
 */
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
}
