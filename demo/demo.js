cshr(() => {


  const back = cshr('#back');
  const next = cshr('#next');
  const img = cshr('#image');
  const frame = cshr('#frame');
  const loading = cshr('#loading');
  const info = cshr('#info');

  const request = {

    url: "https://api.harvardartmuseums.org/object",
    data: {
      apikey: "5396a200-c4f2-11e7-8f8e-1b14c6858050",
      size: 1,
      hasimage: 1,
      page: 1
    },
    contentType: "application/json"
  };

  img.on("load", (e) => {
    loading.addClass("hidden");
  });

  back.on("click", (e) => {
    if (request.data.page > 1) {
      request.data.page -= 1;
    }
    loading.removeClass("hidden");
    cshr.ajax(request).then(response => {
      response = JSON.parse(response);
      img.attr("src", response.records[0].primaryimageurl);
      info.empty();
      info.append(response.records[0].medium);
    });
  });

  next.on("click", (e) => {
    request.data.page += 1;
    loading.removeClass("hidden");
    cshr.ajax(request).then(response => {
      response = JSON.parse(response);
      img.attr("src", response.records[0].primaryimageurl);
      info.empty();
      info.append(response.records[0].medium);
    });
  });

});
