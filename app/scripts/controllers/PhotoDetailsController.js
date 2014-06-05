RemembermeWeb.PhotoDetailsController = Ember.Controller.extend({

  needs: ["application"],
  
  actions: {
    savePhotoDetails: function() {

      var self = this;

      self.set('errorMessage', null);
      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id + "/details",
        type: "PUT",
        data: JSON.stringify(self.get('model')),
        async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");

          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, could not update photo =( try later!");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, some problems while updating this image");
      });
    },

    processPhoto: function() {

      var self = this;

      var file = {};
      var reader  = new FileReader();
      var fileToSent = "";

      reader.onloadend = function () {
        console.log("loaded!");
        fileToSent = reader.result;
        console.log("fileToSent " + fileToSent);

        var detection_flags = "cropface,recognition,propoints,classifiers,extended";
        var image_filename = self.get('model').name;
        var prefix = ';base64,';
        var idx = fileToSent.indexOf(prefix);
        if (idx >= 0) {
            var base64_data = fileToSent.substring(idx + prefix.length);
            var msg = '<?xml version="1.0" encoding="utf-8"?><ImageRequestBinary xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                        '<api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                        '<detection_flags>' + detection_flags + '</detection_flags>' +
                        '<imagefile_data>' + base64_data + '</imagefile_data>' +
                        '<original_filename>' + image_filename + '</original_filename>' +
                        '</ImageRequestBinary>';


            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: 'http://www.betafaceapi.com/service.svc/UploadNewImage_File',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function (data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceImageResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();
                    if (int_response == 0) {
                        var image_uid = $(xmlDoc).children("img_uid").text();
                        console.log("image_uid " + image_uid);
                        self.get('model').helpUid = image_uid;
                        self.getImageInfo(image_uid);
                    }
                    else {
                        console.log("some error =(");

                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });

        }
      }

      // $.ajax({
      //   url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id,
      //   type: "GET",
      //   data: JSON.stringify(self.get('model')),
      //   async: false
      // }).then(function(response) {

      //     file = response;
      //     if (response) {
      //       console.log("success");

      //     } else {
      //       console.log("unsuccess");
      //       self.set('errorMessage', "Sorry, could not update photo =( try later!");
      //     }
      // }, function() {
      //   console.log("error!");
      //   self.set('errorMessage', "Sorry, some problems while updating this image");
      // });

      var oReq = new XMLHttpRequest();
      oReq.open("GET", "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id, false);


      oReq.onload = function(oEvent) {
        console.log("onload!");
        var blob = new Blob([oReq.response], {type: "image/png"});;
        file = blob;
      };

      oReq.send();

      if (file) {
        console.log("file is here");
        reader.readAsDataURL(file);
      } else {
        console.log("no file");
      }

      // self.set('errorMessage', null);
      // $.ajax({
      //   url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id + "/process",
      //   type: "POST",
      //   data: JSON.stringify(self.get('model')),
      //   async: false
      // }).then(function(response) {

      //     if (response.success) {
      //       console.log("success");

      //     } else {
      //       console.log("unsuccess");
      //       self.set('errorMessage', "Sorry, could not update photo =( try later!");
      //     }
      // }, function() {
      //   console.log("error!");
      //   self.set('errorMessage', "Sorry, some problems while updating this image");
      // });
    }
  },

  sentPhotoInfoForProcessing: function sentPhotoInfoForProcessing() {

      var self = this;

      console.log("sentPhotoInfoForProcessing ?? -> " + self.get('model').helpUid);

      self.set('errorMessage', null);
      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id + "/process",
        type: "POST",
        data: self.get('model'),
        async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");

          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, could not update photo =( try later!");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, some problems while updating this image");
      });
    },

    getImageInfo: function getImageInfo(image_uid) {
            var msg = '<?xml version="1.0" encoding="utf-8"?><ImageInfoRequestUid><api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                    '<img_uid>' + image_uid + '</img_uid></ImageInfoRequestUid>';

            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: 'http://www.betafaceapi.com/service.svc/GetImageInfo',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function (data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceImageInfoResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();
                    if (int_response == 1) {
                        //image is in the queue
                        //doUpdateImage(image_uid, 'in queue', 0);
                        setTimeout(function () { getImageInfo(image_uid); }, 500);
                    }
                    else if (int_response == 0) {
                        //image processed
                        console.log("response is 0!");
                        //parseImageInfo(image_uid, xmlDoc);
                    }
                    else {
                        //error
                        //doUpdateImage(image_uid, string_response, 0);

                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }
})