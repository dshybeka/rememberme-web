RemembermeWeb.PhotoDetailsRoute = RemembermeWeb.AuthentificatedRoute.extend({

  queryParams: {
    id: {
      refreshModel: true
    }
  },

  model: function (params) {
    console.log("params " + params.id);

    var curModel = {};

    var applicationController = window.RemembermeWeb.__container__.lookup('controller:application');

    $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + applicationController.userId +"/photo/" + params.id + "/details",
        type: "GET",
        async: false
    }).then(function(response) {

        if (response.success) {
          console.log("success");
          curModel = response.data;
          console.log("model in route " + curModel.id);
        } else {
          console.log("unsuccess");
          curModel.errorMessage = "Sorry, photo was not found =(";
        }
    }, function() {
      console.log("error!");
    });

    return curModel;
  },

  setupController: function(controller, model) {

    var faceImages = [];

    console.log("model in controller " + model.id);
    if (model.id != null) {
      controller.set('model', model);
      if (model.isProcessed) {
        for (var i = 0; i < model.faces.length; i++) {
          var faceImageData = this.getFaceImage(model.faces[i].helpUid);
          console.log("faceImageData " + faceImageData);
          faceImages.push({data: faceImageData,
                           personName: model.faces[i].personName,
                           width: model.faces[i].width,
                           height: model.faces[i].height,
                           uid: model.faces[i].helpUid,
                           id: model.faces[i].id});
        }
        controller.set('faceImages', faceImages);
      } else {
        controller.set('faceImages', []);
      }
    }
  },

  // getFaceImage: function getFaceImage(image_uid) {

  //     var msgJson = '{"api_key": "d45fd466-51e2-4701-8da8-04351c872236","api_secret":"171e8465-f548-401d-b63b-caf0dc28df5f","face_uid":"'+ image_uid + '" }';
  //     var self = this;
  //     var faceImageData;

  //     $.support.cors = true;
  //     $.ajax({
  //         crossDomain: true,
  //         url: 'http://betafaceapi.com/service_json.svc/GetFaceImage',
  //         type: 'post',
  //         processData: false,
  //         contentType: 'application/json',
  //         data: msgJson,
  //         dataType: 'json',
  //         async: false,
  //         success: function (response) {
              
  //           var int_response = response.int_response;
  //           if (int_response == 0) {
  //             console.log("Success retrieved faces! ");
  //             faceImageData = 'data:image/jpeg;base64,' + response.face_image;
  //           } else {
            
  //               console.info(int_response);
  //           }
  //         },
  //         error: function (jqXHR, textStatus, errorThrown) {
  //             console.info(textStatus);
  //         }
  //     });

  //     return faceImageData;
  //   },

  getFaceImage: function getFaceImage(face_uid) {
        var faceImageData;
        var msg = '<?xml version="1.0" encoding="utf-8"?><FaceRequestId><api_key>d45fd466-51e2-4701-8da8-04351c872236</api_key><api_secret>171e8465-f548-401d-b63b-caf0dc28df5f</api_secret>' +
                '<face_uid>' + face_uid + '</face_uid></FaceRequestId>';

        $.support.cors = true;
        $.ajax({
            crossDomain: true,
            url: 'http://www.betafaceapi.com/service.svc/GetFaceImage',
            type: 'post',
            contentType: 'application/xml',
            processData: false,
            data: msg,
            dataType: 'xml',
            async: false,
            success: function (data, textStatus, jqXHR) {
                var xmlDocRoot = $.parseXML(jqXHR.responseText);
                var xmlDoc = $(xmlDocRoot).children("BetafaceFaceImageResponse");
                var int_response = parseInt($(xmlDoc).children("int_response").text());
                var string_response = $(xmlDoc).children("string_response").text();
                if (int_response == 0) {
                    var face_uid = $(xmlDoc).children("uid").text();
                    //
                    var face_image = $(xmlDoc).children("face_image").text();
                    faceImageData = 'data:image/jpeg;base64,' + face_image;
                }
                else {
                    //error
                    console.info(int_response);
                    console.info(string_response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.info(textStatus);
            }
        });
        return faceImageData;
    }

});