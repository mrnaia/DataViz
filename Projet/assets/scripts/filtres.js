//DEPRECATED
function splitCountry(checked,mediaG, data, scaleBubbles, mediaXScale, mediasData){

    if (checked){
      dataQuebec = data.filter(function(el){
        if (el.name in mediasData){
          return mediasData[el.name].Pays == "Quebec";
        } else {
          return;
        }});
      dataFrance = data.filter(function(el){
        if (el.name in mediasData){
          return mediasData[el.name].Pays == "France";
        } else {
          return;
        }
      });
      nbCategoriesDisplayed *= 2;
      //Avec attractionCenterX ou Y des fonctions qui prennent d en entree (chaque entree)
      // si on rajoute dans le preproc le "country" de chaque media on determine le point d'attraction (surtout en x)
      yMediasPosition = 300;
      runMediaSimulation(dataQuebec, mediaG, scaleBubbles, mediaXScale, mediasData);
      yMediasPosition = 100;
      runMediaSimulation(dataFrance, mediaG, scaleBubbles, mediaXScale, mediasData);
    } else {
      nbCategoriesDisplayed /= 2;
      runMediaSimulation(data, mediaG, scaleBubbles, mediaXScale, mediasData);
    }

  }
