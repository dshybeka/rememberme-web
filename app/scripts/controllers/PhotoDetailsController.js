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

    findMatches: function findMatches(curFace) {

      var self = this;

      var targets = "";
      $.ajax({
          url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/face/uid/" + curFace.uid + "/targets",
          type: "GET",
          async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");
            targets = response.data;
          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, no matches found =(");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, no matches found =(");
      });
      

      var msgJson = '{"api_key": "d45fd466-51e2-4701-8da8-04351c872236","api_secret":"171e8465-f548-401d-b63b-caf0dc28df5f","faces_uids":"'+ curFace.uid + '","targets":"' + targets +'" }';
      var recognizeId = "";
      var recognicedUid = "";
      $.support.cors = true;
      $.ajax({
          crossDomain: true,
          url: 'http://betafaceapi.com/service_json.svc/RecognizeFaces',
          type: 'post',
          processData: false,
          contentType: 'application/json',
          data: msgJson,
          dataType: 'json',
          async: false,
          success: function (response) {
              var int_response = response.int_response;
              if (int_response == 0) {
                  //image processed
                console.log("recognized id! " + response.recognize_uid);
                recognizeId = response.recognize_uid;
              }
              else {
                  //error
                  //doUpdateImage(image_uid, string_response, 0);

                console.info(int_response);
                  // console.info(string_response);
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.info(textStatus);
          }
      });

      self.getRecognitionResult(curFace.uid, recognizeId);
    },

    processPhoto: function() {

      var self = this;

      if (!self.get('model').isProcessed) {

        var encoded64 = self.getBase64Image(document.getElementById('cur-image'));

        var detection_flags = "cropface,recognition,propoints,classifiers,extended";
        var image_filename = self.get('model').name;
        var base64_data = encoded64;
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
                    self.get('model').isProcessed = true;
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
      } else {
        console.log("Image already processed, Sorry");
      }
    },

    updateFaceDetails: function(face) {
      var self = this;
      console.log("faceid " + face.id);

      self.set('errorMessage', null);
      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/face/" + face.id,
        type: "PUT",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(face),
        async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");

          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Could not update information about this face, please try later");
          }
      }, function() {
        console.log("what happened error?!");
        self.set('errorMessage', "Could not update information about this face, please try later");
      });
    }
  },

  getImageInfo: function getImageInfo(image_uid) {

    var msgJson = '{"api_key": "d45fd466-51e2-4701-8da8-04351c872236","api_secret":"171e8465-f548-401d-b63b-caf0dc28df5f","img_uid":"'+ image_uid + '" }';
    var self = this;

    $.support.cors = true;
    $.ajax({
        crossDomain: true,
        url: 'http://betafaceapi.com/service_json.svc/GetImageInfo',
        type: 'post',
        processData: false,
        contentType: 'application/json',
        data: msgJson,
        dataType: 'json',
        async: false,
        success: function (response) {
            var int_response = response.int_response;
            if (int_response == 1) {
                //image is in the queue
                //doUpdateImage(image_uid, 'in queue', 0);
                setTimeout(function () { getImageInfo(image_uid); }, 500);
            }
            else if (int_response == 0) {
                //image processed
                console.log("response is 0! " + response.faces);
                //parseImageInfo(image_uid, xmlDoc);
                self.sentProcessedInfo(response);
                // console.log("xmlDoc " + $(xmlDoc).children("faces").text());
            }
            else {
                //error
                //doUpdateImage(image_uid, string_response, 0);

                console.info(int_response);
                // console.info(string_response);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.info(textStatus);
        }
    });
  },

  sentProcessedInfo: function sentProcessedInfo(processedData) {

      var self = this;

      console.log("sentProcessedInfo ?? -> " + processedData);

      self.set('errorMessage', null);
      $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/" + self.get('model').id + "/processed",
        type: "POST",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(processedData),
        async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success");
            // self.set('model', response.data);
            self.transitionToRoute('photoDetails', response.data); 
          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, could not update photo =( try later!");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, some problems while updating this image");
      });
    },

    getRecognitionResult: function getRecognitionResult(faceUid, recognizeId) {

      var self = this;

      var recognicedUid = "";
      var msgJsonRecognitionResult = '{"api_key": "d45fd466-51e2-4701-8da8-04351c872236","api_secret":"171e8465-f548-401d-b63b-caf0dc28df5f","recognize_uid":"'+ recognizeId + '" }';
      $.support.cors = true;
      $.ajax({
          crossDomain: true,
          url: 'http://betafaceapi.com/service_json.svc/GetRecognizeResult',
          type: 'post',
          processData: false,
          contentType: 'application/json',
          data: msgJsonRecognitionResult,
          dataType: 'json',
          async: false,
          success: function (response) {
              var int_response = response.int_response;
              console.log("int_response " + int_response);
              if (int_response == 1) {
                //request is in the queue
                setTimeout(function () { self.getRecognitionResult(recognizeId); }, 500);
              } else if (int_response == 0) {
                  //image processed
                console.log("recognized id! " + response.faces_matches[0].face_uid);
                recognicedUid = response.faces_matches[0].face_uid;
              } else {
                  //error
                  //doUpdateImage(image_uid, string_response, 0);

                console.info(int_response);
                  // console.info(string_response);
              }
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.info(textStatus);
          }
      });

      $.ajax({
          url: "http://localhost:8090/RememberMe/user/" + self.get('model').userId +"/photo/face/uid/" + recognicedUid,
          type: "GET",
          async: false
      }).then(function(response) {

          if (response.success) {
            console.log("success " + response.data);
            var personName = response.data;
            $('#' + faceUid).val(personName);
          } else {
            console.log("unsuccess");
            self.set('errorMessage', "Sorry, no matches found =(");
          }
      }, function() {
        console.log("error!");
        self.set('errorMessage', "Sorry, no matches found =(");
      });
    },

    getBase64Image: function getBase64Image(img) {

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var dataURL = canvas.toDataURL("image/png");

      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
})