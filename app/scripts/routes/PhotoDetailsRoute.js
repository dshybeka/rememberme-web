RemembermeWeb.PhotoDetailsRoute = RemembermeWeb.AuthentificatedRoute.extend({

  queryParams: {
    photoId: {
      refreshModel: true
    }
  },

  model: function (params) {
    console.log("params " + params.photoId);

    var curModel = {};

    var applicationController = window.RemembermeWeb.__container__.lookup('controller:application');

    $.ajax({
        url: "http://localhost:8090/RememberMe/user/" + applicationController.userId +"/photo/" + params.photoId + "/details",
        type: "GET",
        async: false
    }).then(function(response) {

        if (response.success) {
          console.log("success");
          curModel = response.data;
          console.log("model " + curModel.name);
        } else {
          console.log("unsuccess");
          curModel.errorMessage = "Sorry, photo was not found =(";
        }
    }, function() {
      console.log("error!");
      controller.set('errorMessage', "Sorry, some problems while getting this image");
    });

    return curModel;
  },

  setupController: function(controller, model) {

    console.log("model " + model.id);
    if (model.id != null) {
      console.log("setted");
      controller.set('model', model);
    }
  }

  // setupController: function(controller, context, params) {

  //   var photos = [];

  //   var applicationController = window.RemembermeWeb.__container__.lookup('controller:application');

  //   console.log("queryParams.photoId " + params.photoId);

  //   $.ajax({
  //       url: "http://localhost:8090/RememberMe/user/" + applicationController.userId +"/photo" + params.photoId + "details",
  //       type: "GET",
  //       async: false
  //   }).then(function(response) {

  //       if (response.success) {
  //         console.log("success");
  //         controller.set('photoDetails', response.data);
  //         controller.set('userId', applicationController.userId);
  //       } else {
  //         console.log("unsuccess");
  //         controller.set('errorMessage', "Sorry, no photos found =(");
  //       }
  //   }, function() {
  //     console.log("error!");
  //     controller.set('errorMessage', "Sorry, some problems while getting this image");
  //   });

  //   controller.set("photos", photos);
  // }
});