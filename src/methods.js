var methods = {
  postData(data) {
    return new Promise((resolve, reject) => {
      var formData = new FormData(),
        url = "https://server1ts.net//financiero/inc/index.php";

        
         //url = "https://server1ts.net//financiero/inc/index.php";
          // url = "http://3.83.230.88//financiero/inc/index.php";        
          // url = "http://54.91.246.198//financiero/inc/index.php";        

      if (data.json) {
        data.data = JSON.stringify(data.data)
      }

      if(data.setUrl){
        url = data.setUrl
      }

      for (var [key, value] of Object.entries(data))
        formData.append(key, value);
      fetch(url, {
        method: "POST",
        body: formData
      })
        .then(res => {
          if (!res.ok) reject(res);
          return res.text();
        })
        .then(resp => {
          let encode = encodeURI(resp),
            decode,
            response;
          encode = encode.replace(/%0D%0A/g, "");
          decode = decodeURI(encode);
          response = JSON.parse(decode);
          if (!data.method || data.method !== "GET") {
            if (response.Code == "0")
              resolve(
                response.Form
                  ? { data: response.Mensaje, Form: response.Form }
                  : response.Mensaje
              );
            else reject(response);
          } else {
            resolve(response);
          }
        })
        .catch(error => reject(error));
    });
  }
};

export default methods;
