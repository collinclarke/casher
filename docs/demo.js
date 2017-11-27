cshr(() => {

  const back = cshr('#back');
  const next = cshr('#next');
  const img = cshr('#image');
  const frame = cshr('#frame');
  const loading = cshr('#loading');
  const info = cshr('#info');
  const categorySelector = cshr('#category-selector');
  const pinnedList = cshr('#pinned-items');
  const pin = cshr('#pin-button');
  const random = cshr('#random-button');
  const pinnedItems = cshr('.pinned-image');
  const starterPin = cshr('#starter-pin');
  const title = cshr('#title');
  const close = cshr('#close-button');

  let requestJSON;
  let currentObjId = 52634;
  let attempt = 0;

  const request = (objectId) => {
    console.log(attempt);
    console.log(objectId);
    return ({
      url: "https://api.harvardartmuseums.org/object/" + objectId,
      data: {
        apikey: "5396a200-c4f2-11e7-8f8e-1b14c6858050",
      },
      contentType: "application/json"
    });
  };

  title.on("click", (e) => {
    info.removeClass("hidden");
  });

  close.on("click", (e) => {
    info.addClass("hidden");
  });

  img.on("load", (e) => {
    loading.addClass("hidden");
  });

  pin.on("click", (e) => {
    const pinNode = generatePinItem();
    pinnedList.append(pinNode);
    pinNode.at(0).scrollIntoView({block: 'end', behavior: 'smooth'});
  });

  const generatePinItem = () => {
    const pinNode = cshr("<li>");
    const pinImg = cshr("<img>");
    const imgUrl = img.attr("src");
    pinImg.attr("src", imgUrl);
    pinNode.append(pinImg);
    pinNode.addClass("pinned-image");
    pinNode.attr("key", currentObjId);
    pinNode.on("click", (e) => {
      const id = e.currentTarget.getAttribute("key");
      fetchImageById(id);
    });
    return pinNode;
  };

  const randObjId = () => {
    return 5000 + Math.floor(Math.random() * 60000);
  };

  const fetchImageById = (objectId) => {
    requestJSON = request(objectId);
    fetchImage(requestJSON);
  };

  random.on("click", (e) => {
    e.stopPropagation();
    objectId = randObjId();
    currentObjId = objectId;
    loading.removeClass("hidden");
    requestJSON = request(objectId);
    fetchImage(requestJSON);
  });

  const fetchImage = (params) => {
    return (
      cshr.ajax(requestJSON).then(response => {
        response = JSON.parse(response);
        img.attr("src", response.images[0].baseimageurl);
        attempt = 0;
      })
      .catch(reason => {
        attempt += 1;
        if (attempt > 25) {
          currentObjId = randObjId();
          attempt = 0;
        } else {
          currentObjId += 5;
        }
        requestJSON = request(currentObjId);
        fetchImage(requestJSON);
      })
    );
  };

  back.on("click", (e) => {
    if (currentObjId > 1) {
      currentObjId -= 1;
    }
    loading.removeClass("hidden");
    requestJSON = request(currentObjId);
    fetchImage(requestJSON);
  });

  next.on("click", (e) => {
    currentObjId += 1;
    loading.removeClass("hidden");
    requestJSON = request(currentObjId);
    fetchImage(requestJSON);
  });

  loading.removeClass("hidden");
  requestJSON = request(currentObjId);
  fetchImage(requestJSON).then(() => {
    const pinNode = generatePinItem();
    pinnedList.append(pinNode);
  });


});
