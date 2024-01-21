function forceDownload(blobUrl, filename) {
    var a = document.createElement("a");
    a.download = filename;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  
export   function downloadPhoto(url, filename) {
    fetch(url, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: "cors",
    })
      .then(function(response) {
        return response.blob();
      })
      .then(function(blob) {
        var blobUrl = window.URL.createObjectURL(blob);
        forceDownload(blobUrl, filename);
      })
      .catch(function(e) {
        console.error(e);
      });
  }
  