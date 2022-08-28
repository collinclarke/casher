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
  const starterPin = cshr('#starter-pin');
  const title = cshr('#title');
  const close = cshr('#close-button');
  const mainHeader = cshr('#main-header');
  const downloadAllButton = cshr('#download-all-button')

  let requestJSON;
  let currentObjId = 52634;
  let attempt = 0;

  const idList = [];

  const request = (objectId) => {
    return ({
      url: "https://api.harvardartmuseums.org/object/" + objectId,
      data: {
        apikey: "5396a200-c4f2-11e7-8f8e-1b14c6858050",
      },
      contentType: "application/json"
    });
  };

  mainHeader.on("click", (e) => {
    if (info.at(0).classList.value.includes("hidden")) {
      info.removeClass("hidden");
    } else {
      info.addClass("hidden");
    }
  });

  close.on("click", (e) => {
    info.addClass("hidden");
  });

  img.on("load", (e) => {
    loading.addClass("hidden");
  });

  pin.on("click", (e) => {
    downloadAllButton.removeClass('hidden')
    const pinNode = generatePinItem();
    pinNode.at(0).scrollIntoView({block: 'end', behavior: 'smooth'});
  });

  const generatePinItem = () => {
    if (!idList.includes(currentObjId)) {
      idList.push(currentObjId);
      const pinNode = cshr("<li>");
      const pinImg = cshr("<img>");
      const imgUrl = img.attr("src");
      pinImg.attr("src", imgUrl);
      pinNode.append(pinImg);
      pinNode.addClass("pinned-image");
      pinNode.attr("key", currentObjId);
      pinNode.attr("title", "Return to Image")
      pinNode.on("click", (e) => {
        const id = e.currentTarget.getAttribute("key");
        fetchImageById(id);
      });
      pinnedList.append(pinNode);
      return pinNode;
    }
  };


  const download = async (imgUrl) => {
    const blob = await toBlob(imgUrl);
    // Image urls look like this
    // https://nrs.harvard.edu/urn-3:HUAM:LEG256357
    const title = imgUrl.split('https://nrs.harvard.edu/')[1]
    save(blob, title)
  }

  const toBlob = (src) => new Promise((res) => {
    const img = document.createElement('img');
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.onload = ({target}) => {
      c.width = target.naturalWidth;
      c.height = target.naturalHeight;
      ctx.drawImage(target, 0, 0);
      c.toBlob((b) => res(b), "image/jpeg", 0.75);
    };
    img.crossOrigin = "";
    img.src = src;
  });

  const save = (blob, name = 'image.png') => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.target = '_blank';
    a.download = name;
    a.click();
  };

  const randObjId = () => {
    return 5000 + Math.floor(Math.random() * 60000);
  };

  const fetchImageById = (objectId) => {
    requestJSON = request(objectId);
    fetchImage(requestJSON);
    currentObjId = parseInt(objectId);
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

  downloadAllButton.on("click", () => {
    const pinnedItems = cshr('.pinned-image');
    pinnedItems.children().nodeCollection.forEach(img => {
      console.log(img.src);
      download(img.src);
    })
  })

});
