cshr(() => {

  const back = cshr('#back');
  const next = cshr('#next');
  const img = cshr('#image');
  const frame = cshr('#frame');
  const loading = cshr('#loading');
  const info = cshr('#info');
  const categorySelector = cshr('#category-selector');

  window.categorySelector = categorySelector;

  let section, requestJSON;
  objectID = Math.floor(Math.random() * 10000);
  section = "images";

  const request = () => {
    console.log(objectID);
    return ({
      url: "https://api.harvardartmuseums.org/object/" + objectID,
      data: {
        apikey: "5396a200-c4f2-11e7-8f8e-1b14c6858050",
        // size: 1,
        // hasimage: 1,
        // page: 1
      },
      contentType: "application/json"
    });
  };

  img.on("load", (e) => {
    loading.addClass("hidden");
  });

  back.on("click", (e) => {
    if (objectID > 1) {
      objectID -= 1;
    }
    loading.removeClass("hidden");

    cshr.ajax(requestJSON).then(response => {
      requestJSON = request();
      response = JSON.parse(response);
      img.attr("src", response.images[0].baseimageurl);
      info.empty();
      // response.images[0].clarifai.outputs[0].data.concepts.forEach(concept => {
      //   const conceptText = concept.name;
      //   info.append(cshr(`<li>${conceptText}</li>`));
      // });
    })
    .catch(reason => {
      console.log('Handle rejected promise ('+reason+') here');
    });
  });

  next.on("click", (e) => {
    objectID += 1;
    loading.removeClass("hidden");
    requestJSON = request();
    cshr.ajax(requestJSON).then(response => {
      response = JSON.parse(response);
      // debugger
      img.attr("src", response.images[0].baseimageurl);
      info.empty();
      // response.images[0].clarifai.outputs[0].data.concepts.forEach(concept => {
      //   info.append(concept.name);
      // });
    })
    .catch(reason => {
      console.log('Handle rejected promise ('+reason+') here');
    });
  });

});
