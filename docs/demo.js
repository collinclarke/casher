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
  objectID = 6000 + Math.floor(Math.random() * 3000);
  section = "images";

  const request = () => {
    console.log(objectID);
    return ({
      url: "https://api.harvardartmuseums.org/object/" + objectID,
      data: {
        apikey: "5396a200-c4f2-11e7-8f8e-1b14c6858050",
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
    requestJSON = request();
    fetchImage(requestJSON);
  });

  const fetchImage = (params) => {
    cshr.ajax(requestJSON).then(response => {
      response = JSON.parse(response);
      img.attr("src", response.images[0].baseimageurl);
      info.empty();
    })
    .catch(reason => {
      objectID = 6000 + Math.floor(Math.random() * 3000);
      requestJSON = request();
      fetchImage(requestJSON);
    });
  };

  next.on("click", (e) => {
    objectID += 1;
    loading.removeClass("hidden");
    requestJSON = request();
    fetchImage(requestJSON);
  });



});
